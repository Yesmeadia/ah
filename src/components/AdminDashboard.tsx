'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Registration } from '@/types';
import styles from '@/styles/AdminDashboard.module.scss';

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.registrations);
      } else {
        setError('Failed to fetch registrations');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.mobile.includes(searchTerm) ||
    (reg.profession && reg.profession.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage event registrations</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Registrations</h3>
          <p className={styles.statNumber}>{registrations.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Today&apos;s Registrations</h3>
          <p className={styles.statNumber}>
            {registrations.filter((reg) => {
              const today = new Date().toDateString();
              const regDate = new Date(reg.createdAt).toDateString();
              return today === regDate;
            }).length}
          </p>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name, mobile, or profession..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Profession</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  No registrations found
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg, index) => (
                <tr key={reg.id}>
                  <td>{index + 1}</td>
                  <td className={styles.nameCell}>{reg.name}</td>
                  <td>{reg.mobile}</td>
                  <td>{reg.profession || '-'}</td>
                  <td>{formatDate(reg.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}