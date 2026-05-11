import React, { useState, useEffect, useCallback } from 'react';
import { enrollmentsApi, studentsApi, coursesApi } from '../services/api';

export default function EnrollmentsPage() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const [eData, sData, cData] = await Promise.all([
        enrollmentsApi.getAll(),
        studentsApi.getAll(),
        coursesApi.getAll(),
      ]);
      setCourses(eData);
      setStudents(sData);
      setAllCourses(cData);
    } catch (e) {
      setError('Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (msg, type = 'success') => {
    if (type === 'success') setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) { setError('Select both a student and a course.'); return; }
    setEnrolling(true);
    try {
      const result = await enrollmentsApi.enroll(Number(selectedStudent), Number(selectedCourse));
      flash(result.message);
      setSelectedStudent('');
      setSelectedCourse('');
      await load();
    } catch (e) {
      flash(e.response?.data?.message || 'Failed to enroll', 'error');
    } finally { setEnrolling(false); }
  };

  const handleUnenroll = async (studentId, courseId, studentName, courseTitle) => {
    try {
      const result = await enrollmentsApi.unenroll(studentId, courseId);
      flash(result.message);
      await load();
    } catch (e) {
      flash(e.response?.data?.message || 'Failed to unenroll', 'error');
    }
  };

  if (loading) return <div className="loading">Loading enrollments…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enrollments</h1>
          <p className="page-subtitle">
            <span className="rel-badge">M:M → Students ↔ Courses</span>
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Enroll Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Enroll a Student</span>
        </div>
        <div className="card-body">
          <div className="alert alert-warn" style={{ marginBottom: 16 }}>
            <strong>Many-to-Many relationship:</strong> a student can enroll in multiple courses; a course can have many students.
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
              <label className="form-label">Student</label>
              <select className="form-control" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                <option value="">Select student…</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
              <label className="form-label">Course</label>
              <select className="form-control" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="">Select course…</option>
                {allCourses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleEnroll} disabled={enrolling || !selectedStudent || !selectedCourse}>
              {enrolling ? 'Enrolling…' : '+ Enroll'}
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Matrix */}
      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <div className="empty-state-title">No courses yet</div>
          <div className="empty-state-text">Create courses and enroll students to see enrollments here.</div>
        </div>
      ) : (
        <div className="card-grid">
          {courses.map(course => (
            <div key={course.id} className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">{course.title}</div>
                  <span className="card-code">{course.code}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                  {course.students?.length || 0} student{course.students?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="card-body">
                {course.assignments?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div className="section-title">Assignments ({course.assignments.length})</div>
                    <div className="tag-list">
                      {course.assignments.map(a => (
                        <span key={a.id} className="tag" style={{ background: 'var(--warning-light)', color: 'var(--warning)', borderColor: 'rgba(122,92,0,0.2)' }}>
                          {a.title} · {new Date(a.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="section-title">Enrolled Students</div>
                {course.students?.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No students enrolled yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {course.students.map(student => (
                      <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div className="student-row">
                          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                            {student.profile?.avatarUrl
                              ? <img src={student.profile.avatarUrl} alt={student.name} onError={e => e.target.style.display='none'} />
                              : student.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{student.name}</div>
                            {student.profile?.bio && (
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {student.profile.bio}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUnenroll(student.id, course.id, student.name, course.title)}
                        >
                          Unenroll
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
