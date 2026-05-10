import { useState } from 'react'
import { nameOf, memberColor, getInitials } from '../utils/calculations'
import ExpenseDetail from './ExpenseDetail'

export default function ExpensesTab({ group, currentUser, onDeleteExpense, onAddExpense }) {
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState(-1)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [nlText, setNlText] = useState('')

  function parseNL() {
  if (!nlText.trim()) return

  const text = nlText.trim()

  const amountMatch = text.match(/\$(\d+(?:\.\d+)?)/)
  if (!amountMatch) return alert('Could not find an amount — include a $ value like "$100"')
  const amount = parseFloat(amountMatch[1])

  const desc = text.split('$')[0]
    .replace(/split|equally|between|for|paid?|by/gi, '')
    .trim() || 'Expense'

  const paidMatch = text.match(/(\w+)\s+paid|paid\s+by\s+(\w+)/i)
  const paidName = paidMatch?.[1] || paidMatch?.[2]
  const paid = group.members.find(m =>
    m.split('@')[0].toLowerCase() === paidName?.toLowerCase()
  ) || currentUser

  // Extract "owes $X" (total share) — no extra keyword
  const owesPattern = /(\w+)\s+owes\s+\$?(\d+(?:\.\d+)?)/gi
  const statedSplits = {}
  let match
  while ((match = owesPattern.exec(text)) !== null) {
    // Skip if "extra" appears right before the amount
    if (/extra/i.test(match[0])) continue
    const person = group.members.find(m =>
      m.split('@')[0].toLowerCase() === match[1].toLowerCase()
    )
    if (person) statedSplits[person] = parseFloat(match[2])
  }

  // Extract "owes an extra $X" or "owes extra $X"
  const extraPattern = /(\w+)\s+owes\s+(?:an?\s+)?extra\s+\$?(\d+(?:\.\d+)?)/gi
  const extraSplits = {}
  while ((match = extraPattern.exec(text)) !== null) {
    const person = group.members.find(m =>
      m.split('@')[0].toLowerCase() === match[1].toLowerCase()
    )
    if (person) extraSplits[person] = parseFloat(match[2])
  }

  const waysMatch = text.match(/(\d+|two|three|four|five|six|seven|eight)\s*ways?/i)
  const wordToNum = { two:2, three:3, four:4, five:5, six:6, seven:7, eight:8 }
  const ways = waysMatch
    ? (parseInt(waysMatch[1]) || wordToNum[waysMatch[1].toLowerCase()])
    : group.members.length

  const involved = group.members.slice(0, ways)

  // Build base splits from stated amounts first
  const statedTotal = Object.values(statedSplits).reduce((a, b) => a + b, 0)
  const unstatedMembers = involved.filter(m => !statedSplits[m])
  const remaining = parseFloat((amount - statedTotal).toFixed(2))
  if (remaining < 0) return alert(`Stated amounts ($${statedTotal}) exceed total ($${amount})`)
  const autoShare = unstatedMembers.length > 0
    ? parseFloat((remaining / unstatedMembers.length).toFixed(2))
    : 0

  const splits = {}
  involved.forEach((m, i) => {
    if (statedSplits[m] !== undefined) {
      splits[m] = statedSplits[m]
    } else {
      splits[m] = i === involved.length - 1 && unstatedMembers.length > 0
        ? parseFloat((remaining - autoShare * (unstatedMembers.length - 1)).toFixed(2))
        : autoShare
    }
  })

  // Apply extra amounts — add to person, reduce others proportionally
  Object.entries(extraSplits).forEach(([extraPerson, extraAmt]) => {
    if (splits[extraPerson] === undefined) return
    splits[extraPerson] = parseFloat((splits[extraPerson] + extraAmt).toFixed(2))
    const others = involved.filter(m => m !== extraPerson)
    const reduction = parseFloat((extraAmt / others.length).toFixed(2))
    others.forEach((m, i) => {
      splits[m] = i === others.length - 1
        ? parseFloat((splits[m] - (extraAmt - reduction * (others.length - 1))).toFixed(2))
        : parseFloat((splits[m] - reduction).toFixed(2))
    })
  })

  onAddExpense({
    id: 'e' + Date.now(),
    desc: desc.trim(),
    amount,
    paid,
    splits,
    date: new Date().toISOString().slice(0, 10)
  })

  setNlText('')
}

  function toggleDir() {
    setSortDir(prev => prev * -1)
  }

  const sorted = [...group.expenses].sort((a, b) => {
    if (sortBy === 'date') return sortDir * (a.date > b.date ? 1 : -1)
    if (sortBy === 'amount') return sortDir * (a.amount - b.amount)
    if (sortBy === 'paid') return sortDir * a.paid.localeCompare(b.paid)
    return 0
  })

  return (
    <div>
      <div className="nl-section">
        <div className="nl-label">✨ Natural language</div>
        <div className="nl-input-row">
          <input
            className="nl-input"
            placeholder='e.g. "Split $60 dinner three ways"'
            value={nlText}
            onChange={e => setNlText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') parseNL() }}
          />
          <button className="action-btn" onClick={parseNL}>
            Parse
          </button>
        </div>
      </div>

      <div className="sort-bar">
        <span className="sort-label">Sort:</span>
        {['date', 'amount', 'paid'].map(s => (
          <button
            key={s}
            className={`sort-btn ${sortBy === s ? 'active' : ''}`}
            onClick={() => setSortBy(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button className="sort-btn" onClick={toggleDir} style={{ marginLeft: 'auto' }}>
          {sortDir === 1 ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">No expenses yet. Add one above.</div>
      ) : (
        sorted.map(exp => (
          <div
            className="expense-row"
            key={exp.id}
            onClick={() => setSelectedExpense(exp)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="exp-icon"
              style={{
                background: memberColor(exp.paid, group.members) + '22',
                color: memberColor(exp.paid, group.members)
              }}
            >
              {getInitials(exp.paid)}
            </div>
            <div className="exp-desc">
              <div className="exp-title">{exp.desc}</div>
              <div className="exp-meta">Paid by {nameOf(exp.paid, currentUser)} · {exp.date}</div>
            </div>
            <div className="exp-amount">
              <div className="exp-total">${exp.amount.toFixed(2)}</div>
              <div className="exp-paid" style={{ color: memberColor(exp.paid, group.members) }}>
                {nameOf(exp.paid, currentUser)}
              </div>
            </div>
          </div>
        ))
      )}

      {selectedExpense && (
        <ExpenseDetail
          expense={selectedExpense}
          group={group}
          currentUser={currentUser}
          onClose={() => setSelectedExpense(null)}
          onDelete={onDeleteExpense}
        />
      )}
    </div>
  )
}