"use client";

import React, { useState, useEffect } from 'react';

interface Registration {
  fullName: string;
  email: string;
  linkedin?: string;
  startupName?: string;
  stage?: string;
  industry?: string;
  betaPerk?: string;
  timestamp: string;
}

interface RegistrationsViewProps {
  onBack: () => void;
}

const RegistrationsView: React.FC<RegistrationsViewProps> = ({ onBack }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        setError('Could not fetch registrations from server');
      }
    } catch (err) {
      setError('Connection refused. Is the database connected?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registrations-view">
      <div className="view-header">
        <button className="btn-back" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h2 className="view-title">Live Database Dashboard</h2>
        <p className="view-stats">Total Registrations: {registrations.length}</p>
      </div>

      {isLoading && <div className="loading">Connecting to database...</div>}
      {error && <div className="error-box">{error}</div>}

      {!isLoading && !error && (
        <div className="registrations-table-container">
          <table className="registrations-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Full Name</th>
                <th>Startup</th>
                <th>Stage</th>
                <th>Beta Perk</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">No registrations yet. Try registering!</td>
                </tr>
              ) : (
                registrations.map((reg, index) => (
                  <tr key={index}>
                    <td>{new Date(reg.timestamp).toLocaleDateString()}</td>
                    <td>
                      <div className="name-cell">
                        <strong>{reg.fullName}</strong>
                        {reg.linkedin && (
                          <a href={reg.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin text-blue-600 ml-2"></i>
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="startup-cell">
                        {reg.startupName}
                        {reg.industry && <span className="industry-badge">{reg.industry}</span>}
                      </div>
                    </td>
                    <td><span className="badge-stage">{reg.stage}</span></td>
                    <td><span className="badge-perk">{reg.betaPerk}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationsView;
