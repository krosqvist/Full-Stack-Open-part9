import patients from '../../data/patients.ts';
import type { NonSensitivePatient, Patient, NewPatient, NewEntry } from '../types.ts';
import { v1 as uuid } from 'uuid';

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return undefined;
  }
  const { id: patientId, name, dateOfBirth, ssn, gender, occupation, entries } = patient;
  return {
    id: patientId,
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
    entries
  };
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return undefined;
  }
  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return patient;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addEntry
};