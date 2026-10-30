import Part from './Part';
import type { CoursePart } from '../types.ts';

interface ContentProps {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((coursePart) => (
        <Part key={coursePart.name} coursePart={coursePart} />
      ))}
    </div>
  );
};

export default Content;