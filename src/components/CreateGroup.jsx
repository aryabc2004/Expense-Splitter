import { useState } from 'react'

const COLORS = ['#1D9E75', '#378ADD', '#D4537E', '#BA7517', '#7F77DD', '#D85A30']

export default function CreateGroup({ onClose, onCreate, groupCount }) {
  const [name, setName] = useState('')
  const [membersText, setMembersText] = useState('')

  function handleSubmit() {
    if (!name.trim()) return alert('Enter a group name')

    const extras = membersText
      .split('\n')
      .map(e => e.trim())
      .filter(Boolean)

    const members = ['you@example.com', ...extras.filter(e => e !== 'you@example.com')]

    onCreate({
      id: 'g' + Date.now(),
      name: name.trim(),
      color: COLORS[groupCount % COLORS.length],
      members,
      expenses: [],
      settlements: []
    })

    onClose()
  }

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
              placeholder="e.g. Weekend Trip"
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