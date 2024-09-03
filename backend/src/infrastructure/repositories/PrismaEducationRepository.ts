import { PrismaClient } from '@prisma/client';
import { Education } from '../../domain/models/Education';
import { EducationRepository } from '../../domain/repositories/EducationRepository';

export class PrismaEducationRepository implements EducationRepository {
  constructor(private prisma: PrismaClient) {}

  async save(education: Education) {
        const educationData: any = {
            institution: education.institution,
            title: education.title,
            startDate: education.startDate,
            endDate: education.endDate,
        };

        if (education.candidateId !== undefined) {
            educationData.candidateId = education.candidateId;
        }

        if (education.id) {
            // Actualizar una experiencia laboral existente
            return await this.prisma.education.update({
                where: { id: education.id },
                data: educationData
            });
        } else {
            // Crear una nueva experiencia laboral
            return await this.prisma.education.create({
                data: educationData
            });
        }
    }

//   async findById(id: number): Promise<Education | null> {
//     const education = await this.prisma.education.findUnique({ where: { id } });
//     return education ? new Education(education) : null;
//   }

//   async findByCandidateId(candidateId: number): Promise<Education[]> {
//     const educations = await this.prisma.education.findMany({ where: { candidateId } });
//     return educations.map(education => new Education(education));
//   }

//   async update(id: number, education: Education): Promise<Education> {
//     const updatedEducation = await this.prisma.education.update({
//       where: { id },
//       data: {
//         institution: education.institution,
//         title: education.title,
//         startDate: education.startDate,
//         endDate: education.endDate,
//       },
//     });
//     return new Education(updatedEducation);
//   }

//   async delete(id: number): Promise<void> {
//     await this.prisma.education.delete({ where: { id } });
//   }
}