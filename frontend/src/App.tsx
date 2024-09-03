import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RecruiterDashboard />} />
    <Route path="/add-candidate" element={<AddCandidate />} />
  </Routes>
);

const App = ({ Router = BrowserRouter }) => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;