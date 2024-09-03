import request from 'supertest';
import { app, startServer } from '../index';
import { PrismaClient } from '@prisma/client';
import http from 'http';

const prisma = new PrismaClient();
let server: http.Server;

beforeAll(async () => {
  server = startServer();
  
  await prisma.resume.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.candidate.deleteMany();
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

describe('Example test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  })
});


describe('Candidate API', () => {
  it('should create a new candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '600600600',
      address: '123 Main St, City, Country',
      educations: [
        {
          institution: 'University of Example',
          title: 'Bachelor of Science',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'Tech Corp',
          position: 'Software Developer',
          description: 'Developed web applications',
          startDate: '2019-07-01',
          endDate: '2023-06-30'
        }
      ],
      cv: {
        filePath: 'uploads/sample-cv.pdf',
        fileType: 'application/pdf'
      }
    };

    const response = await request(app)
      .post('/candidates')
      .send(candidateData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe(candidateData.firstName);
    expect(response.body.lastName).toBe(candidateData.lastName);
    expect(response.body.email).toBe(candidateData.email);
  });

  it('should return an error when creating a candidate with invalid data', async () => {
    const invalidCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email' // Invalid email format
    };

    const response = await request(app)
      .post('/candidates')
      .send(invalidCandidateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Error: Invalid email');
  });
});

import { CandidateService } from '../application/services/candidateService';
import { CandidateRepository } from '../domain/repositories/CandidateRepository';
import { Candidate } from '../domain/models/Candidate';

// Mock del CandidateRepository
const mockCandidateRepository: jest.Mocked<CandidateRepository> = {
  save: jest.fn(),
};

describe('CandidateService', () => {
  let candidateService: CandidateService;

  beforeEach(() => {
    candidateService = new CandidateService(mockCandidateRepository);
    jest.clearAllMocks();
  });

  it('should add a candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '600123456',
      address: '123 Main St, City'
    };

    const savedCandidate = new Candidate({
      id: 1,
      ...candidateData
    });

    mockCandidateRepository.save.mockResolvedValue(savedCandidate);

    const result = await candidateService.addCandidate(candidateData);

    expect(mockCandidateRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCandidateRepository.save).toHaveBeenCalledWith(expect.any(Candidate));
    expect(result).toEqual(savedCandidate);
    expect(result.id).toBe(1);
    expect(result.firstName).toBe(candidateData.firstName);
    expect(result.lastName).toBe(candidateData.lastName);
    expect(result.email).toBe(candidateData.email);
  });
});