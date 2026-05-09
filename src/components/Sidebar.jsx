export default function Sidebar({ groups, activeGroupId, onSelectGroup, onCreateGroup }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="logo">Expense Splitter</span>
      </div>
      <div className="group-list">
        <div className="nav-label">Groups</div>
        {groups.map(g => (
          <div
            key={g.id}
            className={`group-card ${g.id === activeGroupId ? 'active' : ''}`}
            onClick={() => onSelectGroup(g.id)}
          >
            <div className="group-dot" style={{ background: g.color }}></div>
            <div>
              <div className="group-name">{g.name}</div>
              <div className="group-meta">{g.members.length} members</div>
            </div>
          </div>
        ))}
        <button className="new-group-btn" onClick={onCreateGroup}>
          + New group
        </button>
      </div>
    </div>
  )
}