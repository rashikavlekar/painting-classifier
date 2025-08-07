// File: src/pages/HistoryPageWrapper.jsx
import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import HistoryPage from './HistoryPage';

const HistoryPageWrapper = ({ setPage, history, setHistory }) => {
  const session = useSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return <p className="text-center mt-10">Please sign in to view your history.</p>;
  }

  return (
    <HistoryPage
      setPage={setPage}
      userEmail={userEmail}
      history={history}
      setHistory={setHistory}
    />
  );
};

export default HistoryPageWrapper;
