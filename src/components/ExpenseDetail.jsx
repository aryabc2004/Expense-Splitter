import { useState } from 'react'
import { nameOf, memberColor, getInitials } from '../utils/calculations'

export default function ExpenseDetail({ expense, group, currentUser, onClose, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [desc, setDesc] = useState(expense.desc)
  const [amount, setAmount] = useState(expense.amount.toString())
  const [paid, setPaid] = useState(expense.paid)
  const [splits, setSplits] = useState({ ...expense.splits })

  const checkedMembers = Object.keys(splits)
  const equalShare = checkedMembers.length > 0
    ? (parseFloat(amount) / checkedMembers.length).toFixed(2)
    : '0'

  function handleSplitChange(member, val) {
    setSplits(prev => ({ ...prev, [member]: parseFloat(val) || 0 }))
  }

  function handleSave() {
    if (!desc.trim()) return alert('Add a description')
    if (!amount || parseFloat(amount) <= 0) return alert('Add an amount')
    const splitTotal = Object.values(splits).reduce((a, b) => a + b, 0)
    if (Math.abs(splitTotal - parseFloat(amount)) > 0.05) {
      return alert(`Splits ($${splitTotal.toFixed(2)}) must equal total ($${parseFloat(amount).toFixed(2)})`)
    }
    onEdit({ ...expense, desc: desc.trim(), amount: parseFloat(amount), paid, splits })
    onClose()
  }

  function handleDelete() {
    if (window.confirm(`Delete "${expense.desc}"?`)) {
      onDelete(expense.id)
      onClose()
    }
  }

  if (isEditing) {
    return (
      <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">Edit expense</div>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input
                  className="form-input"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Paid by</label>
                <select className="form-input" value={paid} onChange={e => setPaid(e.target.value)}>
                  {group.members.map(m => (
                    <option key={m} value={m}>{nameOf(m, currentUser)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Splits</label>
              {Object.entries(splits).map(([member, amt]) => (
                <div key={member} className="split-row">
                  <label>{nameOf(member, currentUser)}</label>
                  <input
                    className="split-input"
                    type="number"
                    value={amt}
                    placeholder={equalShare}
                    onChange={e => handleSplitChange(member, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{expense.desc}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '16px' }}>
            <div className="form-label">Total amount</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1c1c1a' }}>
              ${expense.amount.toFixed(2)}
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div className="form-label">Paid by</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="bal-avatar"
                style={{
                  background: memberColor(expense.paid, group.members) + '22',
                  color: memberColor(expense.paid, group.members)
                }}
              >
                {getInitials(expense.paid)}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {nameOf(expense.paid, currentUser)}
              </span>
            </div>
          </div>
          <div>
            <div className="form-label">Split</div>
            {Object.entries(expense.splits).map(([member, amount]) => (
              <div key={member} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div
                  className="bal-avatar"
                  style={{
                    background: memberColor(member, group.members) + '22',
                    color: memberColor(member, group.members)
                  }}
                >
                  {getInitials(member)}
                </div>
                <span style={{ fontSize: '13px', flex: 1 }}>{nameOf(member, currentUser)}</span>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>${amount.toFixed(2)}</span>
                <span style={{ fontSize: '11px', color: '#a8a8a5' }}>
                  {((amount / expense.amount) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#a8a8a5' }}>
            Added on {expense.date}
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}