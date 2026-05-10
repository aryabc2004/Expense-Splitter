export default function Sidebar({ group }) {
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
      </div>
    </div>
  )
}