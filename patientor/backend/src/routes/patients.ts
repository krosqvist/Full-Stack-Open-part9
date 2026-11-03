import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import { newPatientParser, newEntryParser, errorMiddleware } from '../middleware.ts';
import type { NonSensitivePatient, NewPatient, NewEntry, Patient } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<NonSensitivePatient>) => {  
  const addedPatient = patientService.addPatient(req.body);  
  res.json(addedPatient);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Patient>) => {
  const patient = patientService.addEntry(req.params.id, req.body);
  res.json(patient);
});

router.use(errorMiddleware);

export default router;