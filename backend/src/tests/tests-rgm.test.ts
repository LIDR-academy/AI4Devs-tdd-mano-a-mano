import request from 'supertest';
import http from 'http';
import { app, server } from '../index';
import { addCandidate } from '../presentation/controllers/candidateController';
import { validateName } from '../application/validator';
import { Education } from '../domain/models/Education';
import { PrismaClient } from '@prisma/client';

jest.mock('../presentation/controllers/candidateController');
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../index', () => {
  const originalModule = jest.requireActual('../index');
  return {
    ...originalModule,
    app: {
      ...originalModule.app,
      listen: jest.fn(),
    },
  };
});

const prisma = new PrismaClient();
prisma.$disconnect = jest.fn();

jest.setTimeout(30000); // Set global timeout to 30 seconds

afterEach(() => {
  jest.clearAllMocks();
});

test('validateName should throw an error for invalid names', () => {
  expect(() => validateName('')).toThrow('Invalid name');
  expect(() => validateName('A')).toThrow('Invalid name');
  expect(() => validateName('ThisNameIsWayTooLongToBeValidBecauseItExceedsTheMaximumAllowedLengthThisNameIsWayTooLongToBeValidBecauseItExceedsTheMaximumAllowedLength')).toThrow('Invalid name');
});

test('validateName should not throw an error for valid names', () => {
  expect(() => validateName('John')).not.toThrow();
  expect(() => validateName('María')).not.toThrow();
});

describe('POST /candidates', () => {
  it('should add a candidate and return 201 status', async () => {
    const mockCandidate = { name: 'John Doe', email: 'john.doe@example.com' };
    (addCandidate as jest.Mock).mockResolvedValue(mockCandidate);

    const response = await request(server)
      .post('/candidates')
      .send(mockCandidate);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockCandidate);
  });

  it('should return 400 status if addCandidate throws an error', async () => {
    const mockError = new Error('Invalid data');
    (addCandidate as jest.Mock).mockRejectedValue(mockError);

    const response = await request(server)
      .post('/candidates')
      .send({ name: 'Invalid Candidate' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid data' });
  });

  it('should return 500 status for unexpected errors', async () => {
    (addCandidate as jest.Mock).mockRejectedValue('Unexpected error');

    const response = await request(server)
      .post('/candidates')
      .send({ name: 'Unexpected Error' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'An unexpected error occurred' });
  });
});

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

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});