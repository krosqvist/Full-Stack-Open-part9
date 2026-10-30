
import { useEffect, useState } from 'react';
import diaryService from './services/diaries';
import type { NonSensitiveDiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, [])

  return (
    <div>
      <h1>Flight Diaries</h1>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
