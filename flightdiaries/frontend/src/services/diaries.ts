import axios from 'axios';
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = '/api/diaries';

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};

const create = async (object: NewDiaryEntry): Promise<NonSensitiveDiaryEntry> => {
  const response = await axios.post<NonSensitiveDiaryEntry>(baseUrl, object);
  return response.data;
};

export default { getAll, create };