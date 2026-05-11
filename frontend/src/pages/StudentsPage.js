import React, { useState, useEffect, useCallback } from 'react';
import { studentsApi, profilesApi } from '../services/api';
import Modal, { ConfirmModal } from '../components/Modal';

const initStudent = { name: '', email: '' };
const initProfile = { bio: '', avatarUrl: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initStudent);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showProfileForm, setShowProfileForm] = useState(null); // student
  const [profileForm, setProfileForm] = useState(initProfile);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(initStudent);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({ name: student.name, email: student.email });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await studentsApi.update(editing.id, form);
      } else {
        await studentsApi.create(form);
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const openProfileCreate = (student) => {
    setShowProfileForm(student);
    setEditingProfile(null);
    setProfileForm(initProfile);
    setProfileError('');
  };

  const openProfileEdit = (student) => {
    setShowProfileForm(student);
    setEditingProfile(student.profile);
    setProfileForm({ bio: student.profile.bio || '', avatarUrl: student.profile.avatarUrl || '' });
    setProfileError('');
  };

  const handleProfileSave = async () => {
    setProfileSaving(true); setProfileError('');
    try {
      if (editingProfile) {
        await profilesApi.update(editingProfile.id, profileForm);
      } else {
        await profilesApi.create({ ...profileForm, studentId: showProfileForm.id });
      }
      setShowProfileForm(null);
      await load();
    } catch (e) {
      setProfileError(e.response?.data?.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileDelete = async (student) => {
    try {
      await profilesApi.delete(student.profile.id);
      await load();
    } catch (e) {
      setError('Failed to delete profile');
    }
  };

  if (loading) return <div className="loading">Loading students…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            <span className="rel-badge">1:1 → Profile</span>{'  '}
            <span className="rel-badge">M:M → Courses</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Student</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-title">No students yet</div>
          <div className="empty-state-text">Add your first student to get started.</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Profile</th>
                  <th>Enrolled Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="student-row">
                        <div className="avatar">
                          {s.profile?.avatarUrl
                            ? <img src={s.profile.avatarUrl} alt={s.name} onError={e => e.target.style.display='none'} />
                            : s.name[0]?.toUpperCase()}
                        </div>
                        <strong>{s.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                    <td>
                      {s.profile ? (
                        <div className="inline-actions">
                          <span className="tag">Has Profile</span>
                          <button className="btn btn-secondary btn-sm" onClick={() => openProfileEdit(s)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleProfileDelete(s)}>✕</button>
                        </div>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => openProfileCreate(s)}>+ Add Profile</button>
                      )}
                    </td>
                    <td>
                      <div className="tag-list">
                        {s.courses?.length > 0
                          ? s.courses.map(c => <span key={c.id} className="tag">{c.code}</span>)
                          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None</span>}
                      </div>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <Modal
          title={editing ? 'Edit Student' : 'Add Student'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          loading={saving}
        >
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
          </div>
        </Modal>
      )}

      {showProfileForm && (
        <Modal
          title={`${editingProfile ? 'Edit' : 'Add'} Profile — ${showProfileForm.name}`}
          onClose={() => setShowProfileForm(null)}
          onSubmit={handleProfileSave}
          loading={profileSaving}
        >
          {profileError && <div className="alert alert-error">{profileError}</div>}
          <div className="alert alert-warn" style={{ marginBottom: 16 }}>
            <strong>One-to-One relationship:</strong> each student has at most one profile.
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about this student…" />
          </div>
          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input className="form-control" value={profileForm.avatarUrl} onChange={e => setProfileForm(f => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://…" />
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete student "${deleteTarget.name}"?`}
          warning="This will also remove their profile and all enrollments."
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
