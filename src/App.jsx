import './App.css'

const group = {
  id: 'g1',
  name: 'Tokyo Trip',
  members: ['you@example.com', 'priya@gmail.com', 'alex@gmail.com']
}

function App() {
  return (
    <div className="app">

      <div className="sidebar">
        <div className="sidebar-header">
          <span className="logo">Expense Splitter</span>
        </div>
        <div className="group-list">
          <div className="nav-label">Groups</div>
          <div className="group-card active">
            <div className="group-dot" style={{ background: '#1D9E75' }}></div>
            <div>
              <div className="group-name">{group.name}</div>
              <div className="group-meta">{group.members.length} members</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <span className="topbar-title">{group.name}</span>
          <span className="topbar-sub">{group.members.length} members</span>
        </div>
        <div className="content">
          Nothing here yet.
        </div>
      </div>

    </div>
  )
}

export default App