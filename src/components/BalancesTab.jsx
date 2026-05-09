import { computeBalances, memberColor, nameOf, getInitials } from '../utils/calculations'

export default function BalancesTab({ group, currentUser }) {
  const balances = computeBalances(group)

  return (
    <div className="balance-grid">
      {group.members.map(m => {
        const b = Math.round(balances[m] * 100) / 100
        const cls = b > 0.01 ? 'pos' : b < -0.01 ? 'neg' : 'zero'
        const label = b > 0.01 ? 'gets back' : b < -0.01 ? 'owes' : 'settled up'

        return (
          <div className="bal-card" key={m}>
            <div className="bal-avatar" style={{ background: memberColor(m, group.members) + '22', color: memberColor(m, group.members) }}>
              {getInitials(m)}
            </div>
            <div className="bal-name">{nameOf(m, currentUser)}</div>
            <div className={`bal-amount ${cls}`}>${Math.abs(b).toFixed(2)}</div>
            <div className={`bal-label ${cls}`}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}