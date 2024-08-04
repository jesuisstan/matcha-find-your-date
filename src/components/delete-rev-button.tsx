'use client';

import { useState } from 'react';

const DeleteRevenueButton = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/delete-table', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setError(null);
      } else {
        setMessage(null);
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setMessage(null);
      setError('Failed to delete table');
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Revenue Table</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteRevenueButton;
