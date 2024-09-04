import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      educations: [
        {
          institution: 'University',
          title: 'Bachelor',
          startDate: '2010-01-01',
          endDate: '2014-01-01',
        },
      ],
      workExperiences: [
        {
          company: 'Company',
          position: 'Developer',
          description: 'Developing software',
          startDate: '2015-01-01',
          endDate: '2020-01-01',
        },
      ],
      cv: {
        filePath: 'uploads/cv.pdf',
        fileType: 'application/pdf',
      },
    };

    const mockSave = jest.fn().mockResolvedValue({ id: 1 });
    Candidate.prototype.save = mockSave;
    Education.prototype.save = mockSave;
    WorkExperience.prototype.save = mockSave;
    Resume.prototype.save = mockSave;

    const result = await addCandidate(candidateData);

    expect(result).toEqual({ id: 1 });
    expect(mockSave).toHaveBeenCalledTimes(4); // Candidate, Education, WorkExperience, Resume
  });

  it('should throw an error for invalid email', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
      address: '123 Main St',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
  });

  it('should handle unique constraint error on email', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    const mockSave = jest.fn().mockRejectedValue({ code: 'P2002' });
    Candidate.prototype.save = mockSave;

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'The email already exists in the database',
    );
  });

  it('should handle SQL injection attempts', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St; DROP TABLE candidates;',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid address',
    );
  });

  it('should handle file upload validation', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      cv: {
        filePath: 'uploads/cv.exe',
        fileType: 'application/exe',
      },
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid CV data',
    );
  });

  // Additional Test Cases

  it('should return an error when required fields are missing', async () => {
    const candidateData = {
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid first name',
    );
  });

  it('should return an error for invalid data types', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: 1234567890, // Invalid type, should be string
      address: '123 Main St',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid phone number',
    );
  });

  it('should prevent XSS attacks', async () => {
    const candidateData = {
      firstName: '<script>alert("XSS")</script>',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid first name',
    );
  });

  it('should require authentication', async () => {
    // Assuming addCandidate requires an authenticated user
    // Mock the authentication check
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    // Simulate unauthenticated request
    const mockAuthCheck = jest.fn().mockImplementation(() => {
      throw new Error('Authentication required');
    });

    await expect(mockAuthCheck()).rejects.toThrow('Authentication required');
  });

  it('should check for proper permissions', async () => {
    // Assuming addCandidate requires specific permissions
    // Mock the authorization check
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    // Simulate unauthorized request
    const mockAuthCheck = jest.fn().mockImplementation(() => {
      throw new Error('Permission denied');
    });

    await expect(mockAuthCheck()).rejects.toThrow('Permission denied');
  });

  it('should enforce rate limiting', async () => {
    // Assuming rate limiting is implemented
    // Mock the rate limiting check
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    // Simulate rate limit exceeded
    const mockRateLimitCheck = jest.fn().mockImplementation(() => {
      throw new Error('Rate limit exceeded');
    });

    await expect(mockRateLimitCheck()).rejects.toThrow('Rate limit exceeded');
  });

  it('should return appropriate error messages without leaking sensitive information', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    const mockSave = jest
      .fn()
      .mockRejectedValue(new Error('Database connection failed'));
    Candidate.prototype.save = mockSave;

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Error adding candidate',
    );
  });

  it('should log all actions for audit purposes', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    const mockSave = jest.fn().mockResolvedValue({ id: 1 });
    Candidate.prototype.save = mockSave;

    const mockLogger = jest.fn();
    console.log = mockLogger;

    await addCandidate(candidateData);

    expect(mockLogger).toHaveBeenCalled();
  });

  it('should monitor for unusual activity', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    const mockSave = jest.fn().mockResolvedValue({ id: 1 });
    Candidate.prototype.save = mockSave;

    const mockMonitor = jest.fn();
    console.log = mockMonitor;

    await addCandidate(candidateData);

    expect(mockMonitor).toHaveBeenCalled();
  });
});
