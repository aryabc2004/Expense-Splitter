import { useState } from 'react'
import { nameOf, memberColor, getInitials } from '../utils/calculations'
import ExpenseDetail from './ExpenseDetail'

export default function ExpensesTab({ group, currentUser }) {
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState(-1)
  const [selectedExpense, setSelectedExpense] = useState(null)

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
        />
      )}
    </div>
  )
}