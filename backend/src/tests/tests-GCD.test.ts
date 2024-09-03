import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    candidate: {
      create: jest.fn(),
    },
    education: {
      create: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('validateCandidateData', () => {
  it('debería lanzar un error si el nombre es inválido', () => {
    const invalidCandidate = {
      firstName: 'A',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '612345678',
      address: 'Valid Address',
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid name');
  });

  it('debería lanzar un error si el email es inválido', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'invalid-email',
      phone: '612345678',
      address: 'Valid Address',
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid email');
  });

  it('debería lanzar un error si el teléfono es inválido', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '123456',
      address: 'Valid Address',
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid phone');
  });

  it('debería lanzar un error si la dirección es inválida', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '612345678',
      address: 'A'.repeat(101),
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid address');
  });

  it('debería lanzar un error si la educación es inválida', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '612345678',
      address: 'Valid Address',
      educations: [
        {
          institution: '',
          title: 'Valid Title',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid institution');
  });

  it('debería lanzar un error si la experiencia laboral es inválida', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '612345678',
      address: 'Valid Address',
      workExperiences: [
        {
          company: 'Valid Company',
          position: '',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid position');
  });

  it('debería lanzar un error si el CV es inválido', () => {
    const invalidCandidate = {
      firstName: 'ValidFirstName',
      lastName: 'ValidLastName',
      email: 'valid.email@example.com',
      phone: '612345678',
      address: 'Valid Address',
      cv: {
        filePath: '',
        fileType: 'application/pdf',
      },
    };

    expect(() => validateCandidateData(invalidCandidate)).toThrow('Invalid CV data');
  });
});

describe('addCandidate', () => {
  it('debería guardar un candidato en la base de datos', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678',
      address: '123 Main St',
      educations: [
        {
          institution: 'University',
          title: 'Bachelor',
          startDate: '2015-01-01',
          endDate: '2019-01-01',
        },
      ],
      workExperiences: [
        {
          company: 'Company',
          position: 'Developer',
          startDate: '2019-02-01',
          endDate: '2021-01-01',
        },
      ],
      cv: {
        filePath: '/path/to/cv.pdf',
        fileType: 'application/pdf',
      },
    };

    jest.spyOn(prisma.candidate, 'create').mockResolvedValue({ id: 1, ...candidateData });

    const result = await addCandidate(candidateData);

    expect(prisma.candidate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      }),
    });
    expect(result).toEqual(expect.objectContaining({ id: 1, ...candidateData }));
  });
});
