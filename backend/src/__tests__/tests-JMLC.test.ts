import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { addCandidate } from '../application/services/candidateService';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn()
}));

let prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
  (PrismaClient as jest.Mock).mockReturnValue(prismaMock);
});

describe('Candidate Service', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  })
});
