import React, { useState, useEffect, useCallback } from 'react';
import { assignmentsApi, coursesApi } from '../services/api';
import Modal, { ConfirmModal } from '../components/Modal';

const initForm = { title: '', dueDate: '', description: '', courseId: '' };

function dueDateClass(dateStr) {
  const due = new Date(dateStr);
  const now = new Date();
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'overdue';
  if (diff < 3) return 'due-soon';
  return '';
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
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
      const [aData, cData] = await Promise.all([assignmentsApi.getAll(), coursesApi.getAll()]);
      setAssignments(aData);
      setCourses(cData);
    } catch (e) {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...initForm, courseId: courses[0]?.id || '' });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, dueDate: a.dueDate, description: a.description || '', courseId: a.courseId });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.dueDate || !form.courseId) { setFormError('Title, due date, and course are required.'); return; }
    setSaving(true); setFormError('');
    try {
      const payload = { ...form, courseId: Number(form.courseId) };
      if (editing) await assignmentsApi.update(editing.id, payload);
      else await assignmentsApi.create(payload);
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await assignmentsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError('Failed to delete');
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="loading">Loading assignments…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">
            <span className="rel-badge">M:1 → Course</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} disabled={courses.length === 0}>+ Add Assignment</button>
      </div>

      {courses.length === 0 && (
        <div className="alert alert-warn">You need to create a course before adding assignments.</div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No assignments yet</div>
          <div className="empty-state-text">Add assignments to your courses.</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.title}</strong></td>
                    <td>
                      <span className="tag">{a.course?.code}</span>
                      {' '}
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.course?.title}</span>
                    </td>
                    <td>
                      <span className={dueDateClass(a.dueDate)}>
                        {new Date(a.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {dueDateClass(a.dueDate) === 'overdue' && ' ⚠'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.description || '—'}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(a)}>Delete</button>
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
          title={editing ? 'Edit Assignment' : 'Add Assignment'}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          loading={saving}
        >
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="alert alert-warn" style={{ marginBottom: 16 }}>
            <strong>One-to-Many relationship:</strong> one course has many assignments.
          </div>
          <div className="form-group">
            <label className="form-label">Course *</label>
            <select className="form-control" value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
              <option value="">Select a course…</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assignment Title *</label>
            <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Midterm Essay" />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input className="form-control" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Assignment instructions…" />
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete assignment "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
