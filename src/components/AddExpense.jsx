import { useState } from 'react'
import { nameOf } from '../utils/calculations'

export default function AddExpense({ group, currentUser, onClose, onAdd }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [paid, setPaid] = useState(currentUser)
  const [involved, setInvolved] = useState(group.members.map(() => true))
  const [customSplits, setCustomSplits] = useState(group.members.map(() => ''))

  const checkedCount = involved.filter(Boolean).length
  const equalShare = amount && checkedCount > 0
    ? (parseFloat(amount) / checkedCount).toFixed(2)
    : ''

  function handleToggle(i) {
    const next = [...involved]
    next[i] = !next[i]
    setInvolved(next)
  }

  function handleCustomSplit(i, val) {
    const next = [...customSplits]
    next[i] = val
    setCustomSplits(next)
  }

  function handleSubmit() {
    if (!desc.trim()) return alert('Add a description')
    if (!amount || parseFloat(amount) <= 0) return alert('Add an amount')

    const splits = {}
    group.members.forEach((m, i) => {
      if (!involved[i]) return
      splits[m] = customSplits[i] !== '' ? parseFloat(customSplits[i]) : parseFloat(equalShare)
    })

    const splitTotal = Object.values(splits).reduce((a, b) => a + b, 0)
    if (Math.abs(splitTotal - parseFloat(amount)) > 0.05) {
      return alert(`Splits ($${splitTotal.toFixed(2)}) must equal total ($${parseFloat(amount).toFixed(2)})`)
    }

    onAdd({
      id: 'e' + Date.now(),
      desc: desc.trim(),
      amount: parseFloat(amount),
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
                <label>{nameOf(m, currentUser)}</label>
                <input
                  className="split-input"
                  type="number"
                  placeholder={involved[i] ? equalShare : '—'}
                  value={customSplits[i]}
                  disabled={!involved[i]}
                  onChange={e => handleCustomSplit(i, e.target.value)}
                />
              </div>
            ))}
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