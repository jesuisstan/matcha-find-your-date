import React from 'react';

const ClearLocalStorageButton = () => {
  const handleClearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    window.location.reload();
  };

  return (
    <button
      className="rounded bg-slate-400 px-4 py-2 font-bold text-white hover:bg-red-700"
      onClick={handleClearLocalStorage}
      title="Clear local storage and refresh data"
    >
      Clear storage
    </button>
  );
};

export default ClearLocalStorageButton;
