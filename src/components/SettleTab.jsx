import { computeBalances, minimumTransactions, nameOf, memberColor, getInitials } from '../utils/calculations'

export default function SettleTab({ group, currentUser, onSettle }) {
  const balances = computeBalances(group)
  const transactions = minimumTransactions(balances)

  return (
    <div>
      {transactions.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: '60px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
          All settled up!
        </div>
      ) : (
        <div className="settle-section">
          <div className="settle-title">
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''} to settle everything
          </div>
          {transactions.map((t, i) => (
            <div className="settle-row" key={i}>
              <div
                className="bal-avatar"
                style={{ background: memberColor(t.from, group.members) + '22', color: memberColor(t.from, group.members) }}
              >
                {getInitials(t.from)}
              </div>
              <div className="settle-from">{nameOf(t.from, currentUser)}</div>
              <div className="settle-arrow">→</div>
              <div
                className="bal-avatar"
                style={{ background: memberColor(t.to, group.members) + '22', color: memberColor(t.to, group.members) }}
              >
                {getInitials(t.to)}
              </div>
              <div className="settle-to">{nameOf(t.to, currentUser)}</div>
              <div className="settle-amt">${t.amount.toFixed(2)}</div>
              <button className="settle-pay-btn" onClick={() => onSettle(t)}>
                Mark paid
              </button>
            </div>
          ))}
        </div>
      )}

      {group.settlements.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div className="settle-title">Past settlements</div>
          {group.settlements.map((s, i) => (
            <div key={i} className="past-settlement">
              {nameOf(s.from, currentUser)} paid {nameOf(s.to, currentUser)} ${s.amount.toFixed(2)} on {s.date}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}