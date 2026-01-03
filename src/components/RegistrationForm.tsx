'use client';

import { useState } from 'react';
import { FormData } from '@/types';
import styles from '@/styles/RegistrationForm.module.scss';

interface RegistrationFormProps {
  onSuccess: (name: string) => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    profession: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.mobile) {
      setError('Name and mobile number are required');
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const data = await response.json();
      onSuccess(formData.name);
      setFormData({ name: '', mobile: '', profession: '' });
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.formCardTop}>
          {/* Decorative circles */}
          <div className={styles.decorativeCircles}>
            <span className={`${styles.circle} ${styles.circle1}`}></span>
            <span className={`${styles.circle} ${styles.circle2}`}></span>
            <span className={`${styles.circle} ${styles.circle3}`}></span>
          </div>

          <div className={styles.formCardContent}>
            {/* Logo - visible only on mobile */}
            <div className={styles.logoContainer}>
              <img 
                src="/images/w_logo.png" 
                alt="YES Logo" 
                className={styles.logo}
              />
            </div>

            <h1 className={styles.title}>YES EDU-CONNECT</h1>
            <p className={styles.subtitle}>An Introductory & Vision Sharing Meet by YES India Foundation</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mobile" className={styles.label}>
                  Mobile Number <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="profession" className={styles.label}>
                  Profession <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your profession"
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </form>
          </div>

          <div className={styles.waveBottom}></div>
        </div>

        <div className={styles.formCardBottom}>
          {/* Empty white section at bottom */}
        </div>
      </div>
    </div>
  );
}