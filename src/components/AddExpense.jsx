import { useState } from 'react'
import { nameOf } from '../utils/calculations'

export default function AddExpense({ group, currentUser, onClose, onAdd }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [paid, setPaid] = useState(currentUser)
  const [involved, setInvolved] = useState(group.members.map(() => true))
  const [customSplits, setCustomSplits] = useState(group.members.map(() => ''))

  const total = parseFloat(amount) || 0
  const checkedIndexes = involved.map((v, i) => v ? i : -1).filter(i => i !== -1)
  const lockedTotal = customSplits.reduce((sum, val, i) => {
    return involved[i] && val !== '' ? sum + (parseFloat(val) || 0) : sum
  }, 0)
  const unlockedCount = checkedIndexes.filter(i => customSplits[i] === '').length
  const autoShare = unlockedCount > 0 ? Math.max(0, (total - lockedTotal) / unlockedCount) : 0

  function getDisplayAmount(i) {
    if (!involved[i]) return ''
    if (customSplits[i] !== '') return customSplits[i]
    return autoShare.toFixed(2)
  }

  function handleToggle(i) {
    const next = [...involved]
    next[i] = !next[i]
    const nextCustom = [...customSplits]
    if (!next[i]) nextCustom[i] = ''
    setInvolved(next)
    setCustomSplits(nextCustom)
  }

  function handleCustomSplit(i, val) {
    const next = [...customSplits]
    next[i] = val
    setCustomSplits(next)
  }

  function clearCustomSplit(i) {
    const next = [...customSplits]
    next[i] = ''
    setCustomSplits(next)
  }

  function handleSubmit() {
    if (!desc.trim()) return alert('Add a description')
    if (!total) return alert('Add an amount')

    const splits = {}
    group.members.forEach((m, i) => {
      if (!involved[i]) return
      splits[m] = parseFloat(getDisplayAmount(i)) || 0
    })

    const splitTotal = Object.values(splits).reduce((a, b) => a + b, 0)
    if (Math.abs(splitTotal - total) > 0.05) {
      return alert(`Splits ($${splitTotal.toFixed(2)}) must equal total ($${total.toFixed(2)})`)
    }

    

    onAdd({
      id: 'e' + Date.now(),
      desc: desc.trim(),
      amount: total,
      paid,
      splits,
      date: new Date().toISOString().slice(0, 10)
    })

    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add expense</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="e.g. Dinner at Ichiran"
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
                placeholder="0.00"
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
            <label className="form-label">Split between</label>
            {group.members.map((m, i) => (
              <div key={m} className="split-row">
                <input
                  type="checkbox"
                  checked={involved[i]}
                  onChange={() => handleToggle(i)}
                />
                <label style={{ flex: 1 }}>{nameOf(m, currentUser)}</label>
                <input
                  className="split-input"
                  type="number"
                  placeholder={involved[i] ? autoShare.toFixed(2) : '—'}
                  value={customSplits[i]}
                  disabled={!involved[i]}
                  onChange={e => handleCustomSplit(i, e.target.value)}
                />
                {customSplits[i] !== '' && involved[i] && (
                  <button
                    onClick={() => clearCustomSplit(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a8a5', fontSize: '14px', padding: '0 4px' }}
                    title="Reset to auto"
                  >×</button>
                )}
              </div>
            ))}
            <div style={{ fontSize: '11px', color: '#a8a8a5', marginTop: '6px' }}>
              Remaining: ${Math.max(0, total - lockedTotal - (autoShare * unlockedCount)).toFixed(2)} · Click × to reset a custom amount
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Add expense</button>
        </div>
      </div>
    </div>
  )
}