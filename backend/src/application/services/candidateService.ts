import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import { EducationRepository } from '../../domain/repositories/EducationRepository';

export class CandidateService {
    constructor(
        private candidateRepository: CandidateRepository,
        private educationRepository: EducationRepository
    ) {}
  
    async addCandidate(candidateData: any): Promise<Candidate> {
        try {
            validateCandidateData(candidateData); // Validar los datos del candidato
        } catch (error: any) {
            throw new Error(error);
        }

        const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
        try {
            const savedCandidate = await this.candidateRepository.save(candidate);
            const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

            // Guardar la educación del candidato
            if (candidateData.educations) {
                for (const education of candidateData.educations) {
                    const educationModel = new Education(education);
                    educationModel.candidateId = candidateId;
                    await this.educationRepository.save(educationModel);
                    candidate.education.push(educationModel);
                }
            }

            // Guardar la experiencia laboral del candidato
            if (candidateData.workExperiences) {
                for (const experience of candidateData.workExperiences) {
                    const experienceModel = new WorkExperience(experience);
                    experienceModel.candidateId = candidateId;
                    await experienceModel.save();
                    candidate.workExperience.push(experienceModel);
                }
            }

            // Guardar los archivos de CV
            if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
                const resumeModel = new Resume(candidateData.cv);
                resumeModel.candidateId = candidateId;
                await resumeModel.save();
                candidate.resumes.push(resumeModel);
            }
            return savedCandidate;
        } catch (error: any) {
            if (error.code === 'P2002') {
                // Unique constraint failed on the fields: (`email`)
                throw new Error('The email already exists in the database');
            } else {
                throw error;
            }
        }
    }
}