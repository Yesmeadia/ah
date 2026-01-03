'use client';

import { useEffect, useState } from 'react';
import { speakWelcomeMessage } from '@/lib/textToSpeech';
import styles from '@/styles/WelcomeMessage.module.scss';

interface WelcomeMessageProps {
  name: string;
  onClose: () => void;
}

export default function WelcomeMessage({ name, onClose }: WelcomeMessageProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    const timer = setTimeout(() => {
      speakWelcomeMessage(name);
    }, 300);

    return () => clearTimeout(timer);
  }, [name]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`${styles.overlay} ${show ? styles.show : ''}`} onClick={handleClose}>
      <div className={`${styles.modal} ${show ? styles.show : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <div className={styles.successRing}></div>
          <svg
            className={styles.checkIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h2 className={styles.title}>Registration Successful!</h2>
        <div className={styles.divider}></div>
        
        <p className={styles.message}>
          Welcome <span className={styles.name}>{name}</span>
        </p>
        
        <p className={styles.subtext}>
          to the YES EDU-CONNECT 
        </p>

        
        <p className={styles.info}>
          We&apos;re excited to have you join us! You&apos;ll receive further details shortly.
        </p>
        
      </div>
    </div>
  );
}