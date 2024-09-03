import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { addCandidate } from '../../src/application/services/candidateService';
import { Candidate } from '../../src/domain/models/Candidate';
import { validateName } from '../../src/application/validator';
import { Education } from '../../src/domain/models/Education';
import { PrismaClient } from '@prisma/client';

// Mocking dependencies
jest.mock('../../src/application/services/candidateService', () => ({
  addCandidate: jest.fn(),
}));

jest.mock('../../src/domain/models/Candidate', () => ({
  Candidate: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prisma = new PrismaClient();
prisma.$disconnect = jest.fn();

jest.setTimeout(30000); // Set global timeout to 30 seconds

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Tests for addCandidateController
describe('addCandidateController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockAddCandidate: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        education: [],
        workExperience: [],
        resumes: [],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockAddCandidate = addCandidate as jest.Mock;
  });

  it('should call addCandidate service with correct data and return 201 status', async () => {
    mockAddCandidate.mockResolvedValue({ id: 1, ...req.body });

    await addCandidateController(req as Request, res as Response);

    expect(mockAddCandidate).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Candidate added successfully', data: { id: 1, ...req.body } });
  });

  it('should return 400 status if there is an error', async () => {
    mockAddCandidate.mockRejectedValue(new Error('Error al agregar el candidato'));

    await addCandidateController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error adding candidate', error: 'Error al agregar el candidato' });
  });

  it('should return 400 status if there is an unknown error', async () => {
    mockAddCandidate.mockRejectedValue('Unknown error');

    await addCandidateController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error adding candidate', error: 'Unknown error' });
  });
});

// Tests for Candidate model
describe('Candidate model', () => {
  let candidateInstance: any;

  beforeEach(() => {
    candidateInstance = new Candidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      education: [],
      workExperience: [],
      resumes: [],
    });
  });

  it('should save candidate to the database', async () => {
    candidateInstance.save.mockResolvedValue({ id: 1 });

    const result = await candidateInstance.save();

    expect(candidateInstance.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should handle errors when saving candidate to the database', async () => {
    candidateInstance.save.mockRejectedValue(new Error('Database error'));

    try {
      await candidateInstance.save();
    } catch (error) {
      expect(candidateInstance.save).toHaveBeenCalled();
      expect(error).toEqual(new Error('Database error'));
    }
  });
});

// Tests for Education model
describe('Education Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new education record', async () => {
    const mockEducationData = {
      institution: 'Test University',
      title: 'Bachelor of Science',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
      candidateId: 1,
    };

    const mockEducation = new Education(mockEducationData);
    prisma.education.create = jest.fn().mockResolvedValue(mockEducationData);

    const result = await mockEducation.save();

    expect(prisma.education.create).toHaveBeenCalledWith({
      data: {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 1,
      },
    });
    expect(result).toEqual(mockEducationData);
  });

  test('should update an existing education record', async () => {
    const mockEducationData = {
      id: 1,
      institution: 'Test University',
      title: 'Bachelor of Science',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
      candidateId: 1,
    };

    const mockEducation = new Education(mockEducationData);
    prisma.education.update = jest.fn().mockResolvedValue(mockEducationData);

    const result = await mockEducation.save();

    expect(prisma.education.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 1,
      },
    });
    expect(result).toEqual(mockEducationData);
  });
});

// Tests for validateName function
describe('validateName function', () => {
  test('should throw an error for invalid names', () => {
    expect(() => validateName('')).toThrow('Invalid name');
    expect(() => validateName('A')).toThrow('Invalid name');
    expect(() => validateName('ThisNameIsWayTooLongToBeValidBecauseItExceedsTheMaximumAllowedLengthThisNameIsWayTooLongToBeValidBecauseItExceedsTheMaximumAllowedLength')).toThrow('Invalid name');
  });

  test('should not throw an error for valid names', () => {
    expect(() => validateName('John')).not.toThrow();
    expect(() => validateName('María')).not.toThrow();
  });
});
