import type { Entry } from '../../types';

interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <div>
          <p>Health check rating: {entry.healthCheckRating}</p>
        </div>
      );

    case 'Hospital':
      return (
        <div>
          <p>Discharge date: {entry.discharge.date}</p>
          <p>Discharge criteria: {entry.discharge.criteria}</p>
        </div>
      );

    case 'OccupationalHealthcare':
      return (
        <div>
          <p>Employer: {entry.employerName}</p>
          {entry.sickLeave && (
            <p>
              Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </p>
          )}
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;