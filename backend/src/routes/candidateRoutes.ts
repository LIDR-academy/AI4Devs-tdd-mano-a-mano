import { Router } from 'express';
import { CandidateService } from '../application/services/candidateService';
import { PrismaCandidateRepository } from '../infrastructure/repositories/PrismaCandidateRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    // console.log(req.body); //Just in case you want to inspect the request body
    const candidateData = req.body;

    const candidateService = new CandidateService(new PrismaCandidateRepository(prisma));
    const result = await candidateService.addCandidate(candidateData);
    res.status(201).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unexpected error occurred" });
    }
  }
});

export default router;
