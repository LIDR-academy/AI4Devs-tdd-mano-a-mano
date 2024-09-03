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
import { EducationRepository } from '../domain/repositories/EducationRepository';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';

// Mock del CandidateRepository
const mockCandidateRepository: jest.Mocked<CandidateRepository> = {
  save: jest.fn(),
};
const mockEducationRepository: jest.Mocked<EducationRepository> = {
  save: jest.fn(),
};

describe('CandidateService', () => {
  let candidateService: CandidateService;

  beforeEach(() => {
    candidateService = new CandidateService(mockCandidateRepository, mockEducationRepository);
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

  it('should add a candidate with two education records successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '600123456',
      address: '123 Main St, City',
      educations: [
        {
          institution: 'University of Example',
          title: 'Bachelor of Science',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        },
        {
          institution: 'College of Further Example',
          title: 'Master of Science',
          startDate: '2019-09-01',
          endDate: '2021-06-30'
        }
      ]
    };

    const savedCandidate = new Candidate({
      id: 1,
      ...candidateData
    });

    const savedEducations = candidateData.educations.map((edu, index) => new Education({
      id: index + 1,
      ...edu,
      candidateId: 1
    }));

    mockCandidateRepository.save.mockResolvedValue(savedCandidate);
    mockEducationRepository.save.mockImplementation((education) => 
      Promise.resolve(new Education({ ...education, id: savedEducations.length + 1 }))
    );

    const result = await candidateService.addCandidate(candidateData);

    expect(mockCandidateRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCandidateRepository.save).toHaveBeenCalledWith(expect.any(Candidate));
    expect(mockEducationRepository.save).toHaveBeenCalledTimes(2);
    expect(mockEducationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      institution: 'University of Example',
      title: 'Bachelor of Science',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      candidateId: 1
    }));
    expect(mockEducationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      institution: 'College of Further Example',
      title: 'Master of Science',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      candidateId: 1
    }));

    expect(result).toEqual(savedCandidate);
    expect(result.id).toBe(1);
    expect(result.firstName).toBe(candidateData.firstName);
    expect(result.lastName).toBe(candidateData.lastName);
    expect(result.email).toBe(candidateData.email);
    // expect(result.education).toHaveLength(2);
    // expect(result.education[0]).toEqual(expect.objectContaining({
    //   institution: 'University of Example',
    //   title: 'Bachelor of Science'
    // }));
    // expect(result.education[1]).toEqual(expect.objectContaining({
    //   institution: 'College of Further Example',
    //   title: 'Master of Science'
    // }));
  });
});