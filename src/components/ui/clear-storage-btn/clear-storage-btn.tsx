import React from 'react';

const ClearLocalStorageButton = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <button
      className="rounded bg-slate-400 px-4 py-2 font-bold text-white hover:bg-red-700"
      onClick={handleClearLocalStorage}
      title="Clear local storage and refresh data"
    >
      Refresh Data
    </button>
  );
};

export default ClearLocalStorageButton;
