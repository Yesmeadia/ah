'use client';

import { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import WelcomeMessage from '@/components/WelcomeMessage';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  const handleRegistrationSuccess = (name: string) => {
    setUserName(name);
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    setUserName('');
  };

  return (
    <main>
      <RegistrationForm onSuccess={handleRegistrationSuccess} />
      {showWelcome && (
        <WelcomeMessage name={userName} onClose={handleCloseWelcome} />
      )}
    </main>
  );
}