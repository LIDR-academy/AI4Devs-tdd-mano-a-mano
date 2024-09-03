import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('renders RecruiterDashboard by default', () => {
  render(
    <App Router={({ children }) => (
      <MemoryRouter initialEntries={['/']}>
        {children}
      </MemoryRouter>
    )} />
  );
  const dashboardTitle = screen.getByText(/Dashboard del Reclutador/i);
  expect(dashboardTitle).toBeInTheDocument();
});

test('renders AddCandidate component when navigating to /add-candidate', () => {
  render(
    <App Router={({ children }) => (
      <MemoryRouter initialEntries={['/add-candidate']}>
        {children}
      </MemoryRouter>
    )} />
  );
  const addCandidateTitle = screen.getByText(/Agregar Candidato/i);
  expect(addCandidateTitle).toBeInTheDocument();
});