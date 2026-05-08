import { useState } from "react";
import "./App.css";

const initialData = [
  { id: 1, name: "Alice Johnson", role: "Designer", email: "alice@example.com", status: "Active" },
  { id: 2, name: "Bob Smith", role: "Developer", email: "bob@example.com", status: "Active" },
  { id: 3, name: "Carol White", role: "Manager", email: "carol@example.com", status: "Inactive" },
];

const EMPTY_FORM = { name: "", role: "", email: "", status: "Active" };

export default function App() {
  const [records, setRecords] = useState(initialData);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (rec) => {
    setForm({ name: rec.name, role: rec.role, email: rec.email, status: rec.status });
    setEditId(rec.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.email) return;
    if (editId !== null) {
      setRecords((prev) => prev.map((r) => (r.id === editId ? { ...r, ...form } : r)));
      showToast("Record updated successfully");
    } else {
      setRecords((prev) => [{ id: Date.now(), ...form }, ...prev]);
      showToast("Record created successfully");
    }
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleDelete = () => {
    setRecords((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    showToast("Record deleted", "error");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">⬡</div>
          <div>
            <h1>DataForge</h1>
            <p className="subtitle">Team Directory</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Record</button>
      </header>

      <div className="stats-bar">
        <div className="stat"><span className="stat-num">{records.length}</span><span className="stat-label">Total</span></div>
        <div className="divider" />
        <div className="stat"><span className="stat-num">{records.filter((r) => r.status === "Active").length}</span><span className="stat-label">Active</span></div>
        <div className="divider" />
        <div className="stat"><span className="stat-num">{records.filter((r) => r.status === "Inactive").length}</span><span className="stat-label">Inactive</span></div>
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="search" placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty">No records found</td></tr>
            ) : (
              filtered.map((rec, i) => (
                <tr key={rec.id} className="row">
                  <td className="idx">{i + 1}</td>
                  <td><div className="name-cell"><div className="avatar">{rec.name[0]}</div><span>{rec.name}</span></div></td>
                  <td><span className="role-badge">{rec.role}</span></td>
                  <td className="email">{rec.email}</td>
                  <td><span className={`status-badge ${rec.status === "Active" ? "active" : "inactive"}`}>{rec.status}</span></td>
                  <td><div className="actions"><button className="btn-edit" onClick={() => openEdit(rec)}>Edit</button><button className="btn-del" onClick={() => setDeleteId(rec.id)}>Delete</button></div></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Edit Record" : "New Record"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="field"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" required /></div>
              <div className="field"><label>Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Developer" required /></div>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" required /></div>
              <div className="field"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="overlay" onClick={() => setDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠</div>
            <h2>Delete Record?</h2>
            <p>This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type === "success" ? "✓" : "✕"} {toast.msg}</div>}
    </div>
  );
}
