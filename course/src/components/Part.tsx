import type { CoursePart } from '../types.ts';

interface PartProps {
  coursePart: CoursePart;
}

const Part = ({ coursePart }: PartProps) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
          <p>{coursePart.description}</p>
        </div>
      );

    case "group":
      return (
        <div>
          <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
          <p>Project exercises: {coursePart.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
          <p>{coursePart.description}</p>
          <p>Background material: {coursePart.backgroundMaterial}</p>
        </div>
      );

    case "special":
      return (
        <div>
          <h3>{coursePart.name} {coursePart.exerciseCount}</h3>
          <p>{coursePart.description}</p>
          <p>Requirements:</p>
          <ul>
            {coursePart.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
    );

    default: {
      const exhaustiveCheck: never = coursePart;
      return exhaustiveCheck;
    }
  }
};

export default Part;