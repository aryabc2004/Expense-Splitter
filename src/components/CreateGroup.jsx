import { useState } from 'react'

const COLORS = ['#1D9E75', '#378ADD', '#D4537E', '#BA7517', '#7F77DD', '#D85A30']

export default function CreateGroup({ onClose, onCreate, currentUser, inline }) {
  const [name, setName] = useState('')
  const [membersText, setMembersText] = useState('')

  function handleSubmit() {
    if (!name.trim()) return alert('Enter a group name')

    const extras = membersText
      .split('\n')
      .map(e => e.trim())
      .filter(Boolean)

    const members = [currentUser, ...extras.filter(e => e !== currentUser)]

    onCreate({
      id: 'g' + Date.now(),
      name: name.trim(),
      color: COLORS[0],
      members,
      expenses: [],
      settlements: []
    })

    if (!inline) onClose()
  }

  const card = (
    <div className="login-card">
      <div className="login-logo">Create your group</div>
      <div className="login-sub">Add a name and invite members by email</div>

      <div className="form-group" style={{ marginTop: '24px' }}>
        <label className="form-label">Group name</label>
        <input
          className="form-input"
          placeholder="e.g. Tokyo Trip"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">Add members (email, one per line)</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder={"friend1@gmail.com\nfriend2@gmail.com"}
          value={membersText}
          onChange={e => setMembersText(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', marginTop: '8px', padding: '10px' }}
        onClick={handleSubmit}
      >
        Create group
      </button>
    </div>
  )

  if (inline) return card

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Create group</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Group name</label>
            <input
              className="form-input"
              placeholder="e.g. Tokyo Trip"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Add members (email, one per line)</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder={"friend1@gmail.com\nfriend2@gmail.com"}
              value={membersText}
              onChange={e => setMembersText(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  )
}