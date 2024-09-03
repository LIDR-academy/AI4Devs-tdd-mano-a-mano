import { Education } from '../models/Education';

export interface EducationRepository {
  save(education: Education): any;
//   findById(id: number): Promise<Education | null>;
//   findByCandidateId(candidateId: number): Promise<Education[]>;
//   update(id: number, education: Education): Promise<Education>;
//   delete(id: number): Promise<void>;
}