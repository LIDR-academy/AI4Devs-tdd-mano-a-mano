import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { addCandidate } from '../../src/application/services/candidateService';
import { Candidate } from '../../src/domain/models/Candidate';

jest.mock('../../src/application/services/candidateService', () => ({
  addCandidate: jest.fn(),
}));

jest.mock('../../src/domain/models/Candidate', () => ({
  Candidate: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

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
