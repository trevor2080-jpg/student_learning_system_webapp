import React, { useState, useEffect, useCallback } from 'react';
import { coursesApi } from '../services/api';
import Modal, { ConfirmModal } from '../components/Modal';

const initForm = { title: '', code: '', description: '' };

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(initForm); setFormError(''); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ title: c.title, code: c.code, description: c.description || '' }); setFormError(''); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.code.trim()) { setFormError('Title and code are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) await coursesApi.update(editing.id, form);
      else await coursesApi.create(form);
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await coursesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete');
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="loading">Loading courses…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">
            <span className="rel-badge">M:M → Students</span>{'  '}
            <span className="rel-badge">1:M → Assignments</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Course</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-title">No courses yet</div>
          <div className="empty-state-text">Create your first course.</div>
        </div>
      ) : (
        <div className="card-grid">
          {courses.map(c => (
            <div key={c.id} className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">{c.title}</div>
                  <span className="card-code">{c.code}</span>
                </div>
                <div className="card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(c)}>Delete</button>
                </div>
              </div>
              <div className="card-body">
                {c.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{c.description}</p>
                )}

                <div className="meta-item">
                  <span className="meta-label">Students</span>
                  <span className="meta-value">{c.students?.length || 0} enrolled</span>
                </div>
                {c.students?.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: 12 }}>
                    {c.students.map(s => (
                      <span key={s.id} className="tag">{s.name}</span>
                    ))}
                  </div>
                )}

                <div className="meta-item">
                  <span className="meta-label">Assignments</span>
                  <span className="meta-value">{c.assignments?.length || 0}</span>
                </div>
                {c.assignments?.length > 0 && (
                  <div className="tag-list">
                    {c.assignments.map(a => (
                      <span key={a.id} className="tag" style={{ background: 'var(--warning-light)', color: 'var(--warning)', borderColor: 'rgba(122,92,0,0.2)' }}>
                        {a.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal
          title={editing ? 'Edit Course' : 'Add Course'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          loading={saving}
        >
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Introduction to Computer Science" />
          </div>
          <div className="form-group">
            <label className="form-label">Course Code *</label>
            <input className="form-control" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="CS101" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Course overview…" />
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete course "${deleteTarget.title}" (${deleteTarget.code})?`}
          warning="All assignments in this course will also be deleted."
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
