import { Trash2 } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';

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
    <div className="items-center">
      <ButtonMatcha
        variant="ghost"
        size="icon"
        title="Clear local storage data"
        onClick={handleClearLocalStorage}
        className="transition-all duration-300 ease-in-out hover:bg-transparent hover:text-negative"
      >
        <Trash2 />
        <span className="sr-only">Clear local storage data</span>
      </ButtonMatcha>
    </div>
  );
};

export default ClearLocalStorageButton;
