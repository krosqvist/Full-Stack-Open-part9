interface BmiValues {
  h: number;
  w: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      h: Number(args[2]),
      w: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (h: number, w: number): string => {
  const bmi = w / (h / 100)**2;
  if (bmi < 18.5) {
    return('Underweight range');
  }
  else if (bmi < 25) {
    return('Normal range');
  }
  else if (bmi < 30) {
    return('Overweight range');
  }
  else {
    return('Obese range');
  }
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { h, w } = parseArguments(process.argv);
    console.log(calculateBmi(h, w));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}