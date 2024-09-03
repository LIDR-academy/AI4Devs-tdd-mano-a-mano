import { Candidate } from '../models/Candidate';

export interface CandidateRepository {
  save(candidate: Candidate): any;
//   findOne(id: number): Promise<Candidate | null>;
}