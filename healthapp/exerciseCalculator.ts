interface Inputs {
  hours: number[];
  target: number;
}

interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseInputs = (args: string[]): Inputs => {
  if (args.length < 3) throw new Error('Not enough arguments');
  const target = Number(args[2]);
  const hours = args.slice(3).map(Number);
  if (isNaN(target) || hours.some(hour => isNaN(hour))) {
    throw new Error('Provided values were not numbers');
  }
  return {
    target,
    hours
  };
};

export const calculateExercises = (hours: number[], target: number): Results => {
  const periodLength = hours.length;
  const trainingDays = hours.filter(day => day > 0).length;
  const average = hours.reduce((sum, day) => sum + day, 0) / periodLength;
  const success = average >= target;
  let rating = 1;
  let ratingDescription = 'Needs improvement';

  if (average >= target) {
    rating = 3;
    ratingDescription = 'Excellent job';
  }
  else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { hours, target } = parseInputs(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}