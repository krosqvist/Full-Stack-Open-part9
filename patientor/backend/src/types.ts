
import { z } from 'zod';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;

export const PatientRawSchema = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export const NewPatientSchema = PatientRawSchema.omit({ id: true });

export type PatientRaw = z.infer<typeof PatientRawSchema>;
export type Patient = Omit<PatientRaw, 'ssn'>;
export type NewPatient = z.infer<typeof NewPatientSchema>;
