// Composant Loader avec animation Scan
import { memo } from "react";

const Loader = memo(() => {
  return (
    <div className="loader-wrapper">
      <p className="loader">
        <span>Koon</span>
      </p>
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;
