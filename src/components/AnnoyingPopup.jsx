import { useEffect, useState } from 'react';

function AnnoyingPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const firstPop = setTimeout(() => setIsOpen(true), 1500);
    const repeatPop = setInterval(() => setIsOpen(true), 10000);

    return () => {
      clearTimeout(firstPop);
      clearInterval(repeatPop);
    };
  }, []);

  return (
    <aside className={`annoying-popup ${isOpen ? 'is-open' : ''}`}>
      <button
        className="annoying-tab"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        TRILLION DOLLAR ALERT
      </button>
      <div className="annoying-box">
        <button
          className="annoying-close"
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Tuck away alert"
        >
          X
        </button>
        <h2>WAIT BEFORE YOU READ</h2>
        <p>Subscribe to the trillion dollar experience.</p>
      </div>
    </aside>
  );
}

export default AnnoyingPopup;
