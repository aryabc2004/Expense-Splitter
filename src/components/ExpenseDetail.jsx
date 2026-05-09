import { nameOf, memberColor, getInitials } from '../utils/calculations'

export default function ExpenseDetail({ expense, group, currentUser, onClose }) {
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

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>

      </div>
    </div>
  )
}