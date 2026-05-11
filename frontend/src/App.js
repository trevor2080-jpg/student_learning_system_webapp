import React, { useState } from 'react';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import './App.css';

const NAV_ITEMS = [
  { key: 'students', label: 'Students', icon: '👤' },
  { key: 'courses', label: 'Courses', icon: '📚' },
  { key: 'assignments', label: 'Assignments', icon: '📝' },
  { key: 'enrollments', label: 'Enrollments', icon: '🔗' },
];

export default function App() {
  const [activePage, setActivePage] = useState('students');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">StudentHub</span>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`nav-btn ${activePage === item.key ? 'active' : ''}`}
                onClick={() => setActivePage(item.key)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {activePage === 'students' && <StudentsPage />}
        {activePage === 'courses' && <CoursesPage />}
        {activePage === 'assignments' && <AssignmentsPage />}
        {activePage === 'enrollments' && <EnrollmentsPage />}
      </main>
    </div>
  );
}
