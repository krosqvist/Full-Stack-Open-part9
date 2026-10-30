interface CoursePart {
  name: string;
  exerciseCount: number;
};

interface ContentProps {
  courseParts: CoursePart[];
};

const Total = ({ courseParts }: ContentProps) => {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return (
    <div>
      <p>
        Number of exercises {totalExercises}
      </p>
    </div>
  );
};

export default Total;