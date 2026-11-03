import { useState } from 'react';
import type { SubmitEvent } from 'react';

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material/Select';

import type { Diagnosis, NewEntry, HealthCheckRating } from '../../types';
import { HealthCheckRating as Rating } from '../../types';

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (entry: NewEntry) => void | Promise<void>;
  onCancel: () => void;
}

type EntryType = NewEntry['type'];

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = error.response;

    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = response.data;

      if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data
      ) {
        const apiError = data.error;

        if (Array.isArray(apiError)) {
          return apiError
            .map(issue => {
              if (
                typeof issue === 'object' &&
                issue !== null &&
                'message' in issue &&
                typeof issue.message === 'string'
              ) {
                return issue.message;
              }
              return null;
            })
            .filter((message): message is string => message !== null)
            .join('; ') || 'The submitted data is invalid.';
        }

        if (typeof apiError === 'string') {
          return apiError;
        }
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

const AddEntryForm = ({ diagnoses, onSubmit, onCancel }: Props) => {
  const [type, setType] = useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(Rating.Healthy);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDiagnosisChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const validate = (): string | null => {
    if (!description.trim()) {
      return 'Description is required.';
    }

    if (!date) {
      return 'Entry date is required.';
    }

    if (!specialist.trim()) {
      return 'Specialist is required.';
    }

    if (type === 'Hospital') {
      if (!dischargeDate || !dischargeCriteria.trim()) {
        return 'Discharge date and discharge criteria are required.';
      }

      if (dischargeDate < date) {
        return 'Discharge date cannot be before the entry date.';
      }
    }

    if (type === 'OccupationalHealthcare') {
      if (!employerName.trim()) {
        return 'Employer name is required.';
      }

      if (Boolean(sickLeaveStart) !== Boolean(sickLeaveEnd)) {
        return 'Please enter both sick leave dates, or leave both empty.';
      }

      if (sickLeaveStart && sickLeaveEnd && sickLeaveStart > sickLeaveEnd) {
        return 'Sick leave end date cannot be before its start date.';
      }
    }

    return null;
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validate();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const commonFields = {
      description: description.trim(),
      date,
      specialist: specialist.trim(),
      ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {})
    };

    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          ...commonFields,
          type: 'HealthCheck',
          healthCheckRating
        };
        break;

      case 'Hospital':
        entry = {
          ...commonFields,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria.trim()
          }
        };
        break;

      case 'OccupationalHealthcare':
        entry = {
          ...commonFields,
          type: 'OccupationalHealthcare',
          employerName: employerName.trim(),
          ...(sickLeaveStart && sickLeaveEnd
            ? {
                sickLeave: {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd
                }
              }
            : {})
        };
        break;
    }

    try {
      setSubmitting(true);
      await onSubmit(entry);

      setSuccessMessage('Entry added successfully.');
      setDescription('');
      setDate('');
      setSpecialist('');
      setDiagnosisCodes([]);
      setHealthCheckRating(Rating.Healthy);
      setDischargeDate('');
      setDischargeCriteria('');
      setEmployerName('');
      setSickLeaveStart('');
      setSickLeaveEnd('');
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
        <Stack spacing={2.5}>
          <Typography variant="h5">
            New Entry
          </Typography>

          <Divider />

          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={2.5}>
              <FormControl fullWidth>
                <InputLabel id="entry-type-label">Entry type</InputLabel>
                <Select
                  labelId="entry-type-label"
                  value={type}
                  label="Entry type"
                  onChange={event =>
                    setType(event.target.value as EntryType)
                  }
                >
                  <MenuItem value="HealthCheck">Health Check</MenuItem>
                  <MenuItem value="Hospital">Hospital</MenuItem>
                  <MenuItem value="OccupationalHealthcar">
                    Occupational Healthcare
                  </MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6">
                General information
              </Typography>

              <TextField
                label="Description"
                value={description}
                onChange={event => setDescription(event.target.value)}
                fullWidth
                required
                multiline
                minRows={2}
              />

              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                label="Specialist"
                value={specialist}
                onChange={event => setSpecialist(event.target.value)}
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel id="diagnosis-codes-label">
                  Diagnosis codes
                </InputLabel>
                <Select
                  labelId="diagnosis-codes-label"
                  multiple
                  value={diagnosisCodes}
                  onChange={handleDiagnosisChange}
                  input={<OutlinedInput label="Diagnosis codes" />}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(code => {
                        const diagnosis = diagnoses.find(
                          item => item.code === code
                        );

                        return (
                          <Chip
                            key={code}
                            label={`${code} - ${diagnosis?.name ?? 'Unknown'}`}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {diagnoses.map(diagnosis => (
                    <MenuItem key={diagnosis.code} value={diagnosis.code}>
                      {diagnosis.code} - {diagnosis.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              {type === 'HealthCheck' && (
                <>
                  <Typography variant="h6">
                    Health check details
                  </Typography>

                  <FormControl fullWidth>
                    <InputLabel id="health-rating-label">
                      Health check rating
                    </InputLabel>
                    <Select
                      labelId="health-rating-label"
                      value={healthCheckRating}
                      label="Health check rating"
                      onChange={event =>
                        setHealthCheckRating(
                          Number(event.target.value) as HealthCheckRating
                        )
                      }
                    >
                      <MenuItem value={Rating.Healthy}>Healthy (0)</MenuItem>
                      <MenuItem value={Rating.LowRisk}>Low risk (1)</MenuItem>
                      <MenuItem value={Rating.HighRisk}>High risk (2)</MenuItem>
                      <MenuItem value={Rating.CriticalRisk}>Critical risk (3)</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}

              {type === 'Hospital' && (
                <>
                  <Typography variant="h6">
                    Discharge details
                  </Typography>

                  <TextField
                    label="Discharge date"
                    type="date"
                    value={dischargeDate}
                    onChange={event => setDischargeDate(event.target.value)}
                    fullWidth
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <TextField
                    label="Discharge criteria"
                    value={dischargeCriteria}
                    onChange={event =>
                      setDischargeCriteria(event.target.value)
                    }
                    fullWidth
                    required
                    multiline
                    minRows={2}
                  />
                </>
              )}

              {type === 'OccupationalHealthcare' && (
                <>
                  <Typography variant="h6">
                    Occupational healthcare details
                  </Typography>

                  <TextField
                    label="Employer name"
                    value={employerName}
                    onChange={event => setEmployerName(event.target.value)}
                    fullWidth
                    required
                  />

                  <Typography variant="subtitle1">
                    Sick leave (optional)
                  </Typography>

                  <TextField
                    label="Sick leave start date"
                    type="date"
                    value={sickLeaveStart}
                    onChange={event => setSickLeaveStart(event.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <TextField
                    label="Sick leave end date"
                    type="date"
                    value={sickLeaveEnd}
                    onChange={event => setSickLeaveEnd(event.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </>
              )}

              <Box sx={{ display: 'flex' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add'}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={8000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEntryForm;