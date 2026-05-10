import { computeBalancesAfterSettlements, minimumTransactions, nameOf, memberColor, getInitials } from '../utils/calculations'

export default function SettleTab({ group, currentUser, onSettle }) {
  const balances = computeBalancesAfterSettlements(group)
  const transactions = minimumTransactions(balances)

  const isSettled = (t) => group.settlements.some(
    s => s.from === t.from && s.to === t.to
  )

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
          {transactions.map((t, i) => {
            const settled = isSettled(t)
            return (
              <div className="settle-row" key={i} style={{ opacity: settled ? 0.5 : 1 }}>
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
                <button
                  className="settle-pay-btn"
                  onClick={() => !settled && onSettle(t)}
                  disabled={settled}
                  style={{ opacity: settled ? 0.4 : 1, cursor: settled ? 'default' : 'pointer' }}
                >
                  {settled ? '✓ Paid' : 'Mark paid'}
                </button>
              </div>
            )
          })}
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