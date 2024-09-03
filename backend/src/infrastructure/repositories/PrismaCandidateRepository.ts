import { Prisma, PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/models/Candidate';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';

export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async save(candidate: Candidate) {
    
    const candidateData: any = {};

    // Solo añadir al objeto candidateData los campos que no son undefined
    if (candidate.firstName !== undefined) candidateData.firstName = candidate.firstName;
    if (candidate.lastName !== undefined) candidateData.lastName = candidate.lastName;
    if (candidate.email !== undefined) candidateData.email = candidate.email;
    if (candidate.phone !== undefined) candidateData.phone = candidate.phone;
    if (candidate.address !== undefined) candidateData.address = candidate.address;

    // Añadir educations si hay alguna para añadir
    if (candidate.education.length > 0) {
        candidateData.educations = {
            create: candidate.education.map(edu => ({
                institution: edu.institution,
                title: edu.title,
                startDate: edu.startDate,
                endDate: edu.endDate
            }))
        };
    }

    // Añadir workExperiences si hay alguna para añadir
    if (candidate.workExperience.length > 0) {
        candidateData.workExperiences = {
            create: candidate.workExperience.map(exp => ({
                company: exp.company,
                position: exp.position,
                description: exp.description,
                startDate: exp.startDate,
                endDate: exp.endDate
            }))
        };
    }

    // Añadir resumes si hay alguno para añadir
    if (candidate.resumes.length > 0) {
        candidateData.resumes = {
            create: candidate.resumes.map(resume => ({
                filePath: resume.filePath,
                fileType: resume.fileType
            }))
        };
    }

    if (candidate.id) {
        // Actualizar un candidato existente
        try {
            return await this.prisma.candidate.update({
                where: { id: candidate.id },
                data: candidateData
            });
        } catch (error: any) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientInitializationError) {
                // Database connection error
                throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
            } else if (error.code === 'P2025') {
                // Record not found error
                throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
            } else {
                throw error;
            }
        }
    } else {
        // Crear un nuevo candidato
        try {
            const result = await this.prisma.candidate.create({
                data: candidateData
            });
            return result;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientInitializationError) {
                // Database connection error
                throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
            } else {
                throw error;
            }
        }
    }

  }

}