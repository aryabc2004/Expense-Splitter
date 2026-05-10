import { useState } from 'react'

export default function Sidebar({ group }) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="logo">Expense Splitter</span>
      </div>
      <div className="group-list">
        <div className="nav-label">Your Group</div>
        <div className="group-card active">
          <div className="group-dot" style={{ background: group.color }}></div>
          <div>
            <div className="group-name">{group.name}</div>
            <div className="group-meta">{group.members.length} members</div>
          </div>
        </div>
        <div style={{ padding: '8px 10px', fontSize: '12px', color: '#a8a8a5' }}>
          {group.members.map(m => (
            <div key={m} style={{ marginBottom: '4px' }}>{m}</div>
          ))}
        </div>

        <button className="nlp-help-btn" onClick={() => setShowHelp(true)}>
          ✨ NLP Help
        </button>
      </div>

      {showHelp && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowHelp(false) }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Natural Language Tips</div>
              <button className="modal-close" onClick={() => setShowHelp(false)}>×</button>
            </div>
            <div className="modal-body">

              <div className="help-section">
                <div className="help-section-title">Basic split</div>
                <div className="help-example">"Split $60 dinner three ways"</div>
                <div className="help-desc">Splits $60 equally among the first 3 members.</div>
              </div>

              <div className="help-section">
                <div className="help-section-title">Someone paid</div>
                <div className="help-example">"Alex paid $120 groceries three ways"</div>
                <div className="help-desc">Records Alex as the payer. Use the first part of their email (e.g. alex@gmail.com → Alex).</div>
              </div>

              <div className="help-section">
                <div className="help-section-title">Specific amounts</div>
                <div className="help-example">"Split $100 three ways, Alex owes $50"</div>
                <div className="help-desc">Alex pays $50, the remaining $50 is split equally among the others.</div>
              </div>

              <div className="help-section">
                <div className="help-section-title">Multiple specific amounts</div>
                <div className="help-example">"Split $100 three ways, Alex owes $50, Priya owes $30"</div>
                <div className="help-desc">Alex pays $50, Priya pays $30, the remaining $20 goes to everyone else.</div>
              </div>

              <div className="help-section">
                <div className="help-section-title">Extra charge</div>
                <div className="help-example">"Split $60 three ways, Alex owes an extra $10"</div>
                <div className="help-desc">Everyone splits equally first, then Alex pays $10 more and the others are reduced accordingly.</div>
              </div>

              <div className="help-section" style={{ marginBottom: 0 }}>
                <div className="help-section-title">Keywords</div>
                <div style={{ fontSize: '12px', color: '#6b6b68', lineHeight: '1.8' }}>
                  <div><strong>ways</strong> — number of people splitting (two, three, four... or 2, 3, 4...)</div>
                  <div><strong>paid</strong> — who covered the bill</div>
                  <div><strong>owes $X</strong> — that person's total share</div>
                  <div><strong>owes an extra $X</strong> — that person pays extra on top of equal share</div>
                </div>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowHelp(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}