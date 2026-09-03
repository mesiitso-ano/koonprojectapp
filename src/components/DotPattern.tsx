// Composant d'arrière-plan blanc simple
import { memo } from "react";

const DotPattern = memo(() => {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none bg-white"
    />
  );
});

DotPattern.displayName = "DotPattern";

export default DotPattern;
