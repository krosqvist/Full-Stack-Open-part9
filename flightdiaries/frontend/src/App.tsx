
import { useEffect, useState } from 'react';
import axios from 'axios';
import diaryService from './services/diaries';
import type { ValidationError, NonSensitiveDiaryEntry, NewDiaryEntry, Weather, Visibility } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, [])

  const submitNewDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      const createdDiary = await diaryService.create(newDiary);
      setDiaries(diaries.concat(createdDiary));
      setDate('');
      setWeather('sunny');
      setVisibility('great');
      setComment('');
      setErrorMessage('');
    } catch (error: unknown) {
      if (axios.isAxiosError<ValidationError>(error)) {
        const errors = error.response?.data.error;

        setErrorMessage(
          errors
            ? errors.map(issue => issue.message).join(', ')
            : error.message
        );
      } else {
        setErrorMessage('An unexpected error occurred');
        console.error(error);
      }
    }
  };


  return (
    <div>
      <h1>Flight Diaries</h1>
      <h2>Add a new entry</h2>
      
      {errorMessage && (
        <div style={{ color: 'red' }}>
          Error: {errorMessage}
        </div>
      )}

      <form onSubmit={submitNewDiary}>
        <div>
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          Visibility
          {(['great', 'good', 'ok', 'poor'] as Visibility[]).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          Weather
          {(['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as Weather[]).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          Comment:
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>

        <button type="submit">Add</button>
      </form>

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
