export default function AddExpense({ group, onClose }) {
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
            <input className="form-input" placeholder="e.g. Dinner at Ichiran" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input className="form-input" type="number" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Paid by</label>
              <select className="form-input">
                {group.members.map(m => (
                  <option key={m} value={m}>{m.split('@')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Split between</label>
            {group.members.map(m => (
              <div key={m} className="split-row">
                <input type="checkbox" defaultChecked />
                <label>{m.split('@')[0]}</label>
                <input className="split-input" type="number" placeholder="auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary">Add expense</button>
        </div>

      </div>
    </div>
  )
}