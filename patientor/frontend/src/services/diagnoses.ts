import axios from 'axios';
import type { Diagnosis } from '../types';

import { apiBaseUrl } from "../constants";

const getAll = async (): Promise<Diagnosis[]> => {
  const response = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return response.data;
};

export default { getAll };