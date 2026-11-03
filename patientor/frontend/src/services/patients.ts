import axios from "axios";
import { Patient, PatientFormValues, NewEntry, PatientWithoutSsn } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getById = async (id: string) => {
  const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return response.data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (id: string, entry: NewEntry) => {
  const response = await axios.post<PatientWithoutSsn>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );

  return response.data;
};

export default {
  getAll, getById, create, addEntry
};

