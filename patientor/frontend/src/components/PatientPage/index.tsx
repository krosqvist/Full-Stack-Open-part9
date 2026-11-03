import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import patientService from '../../services/patients';
import type { Patient, Diagnosis } from '../../types';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientService.getById(id)
      .then(data => setPatient(data))
      .catch(error => console.error(error));
  }, [id]);

  if (!patient) {
    return <div>Loading patient information...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Ssn: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Gender: {patient.gender}</p>
      <p>Date of birth: {patient.dateOfBirth}</p>

      {!showEntryForm && (
        <Button
          variant="contained"
          onClick={() => setShowEntryForm(true)}
        >
          Add New Entry
        </Button>)}

      {showEntryForm && (
        <AddEntryForm
          diagnoses={diagnoses}
          onSubmit={async (entry) => {
            const updatedPatient = await patientService.addEntry(
              patient.id,
              entry
            );
            setPatient(updatedPatient);
            setShowEntryForm(false);
          }}
          onCancel={() => setShowEntryForm(false)}
        />
      )}

      <h3>Entries</h3>
      {patient.entries.map(entry => (
        <Paper
          key={entry.id}
          elevation={2}
          sx={{
            padding: 2,
            marginBottom: 2,
            borderRadius: 2
          }}
        >
          <h3>{entry.date}</h3>
          <p>{entry.description}</p>
          <p>Diagnose by: {entry.specialist}</p>
          <ul>
            {entry.diagnosisCodes?.map(code => {
              const diagnosis = diagnoses.find(d => d.code === code);

              return (
                <li key={code}>
                  {code} - {diagnosis?.name ?? 'Unknown diagnosis'}
                </li>
              );
            })}
          </ul>

          <EntryDetails entry={entry} />
        </Paper>
      ))}
    </div>
  );
};

export default PatientPage;