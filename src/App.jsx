import './App.css'

const group = {
  id: 'g1',
  name: 'Tokyo Trip',
  color: '#1D9E75',
  members: ['you@example.com', 'priya@gmail.com', 'alex@gmail.com'],
  expenses: [
    { id: 'e1', desc: 'Airbnb', amount: 480, paid: 'you@example.com', splits: { 'you@example.com': 160, 'priya@gmail.com': 160, 'alex@gmail.com': 160 }, date: '2024-03-10' },
    { id: 'e2', desc: 'Ramen dinner', amount: 60, paid: 'priya@gmail.com', splits: { 'you@example.com': 20, 'priya@gmail.com': 20, 'alex@gmail.com': 20 }, date: '2024-03-11' },
    { id: 'e3', desc: 'Theme park', amount: 200, paid: 'alex@gmail.com', splits: { 'you@example.com': 50, 'priya@gmail.com': 100, 'alex@gmail.com': 50 }, date: '2024-03-12' },
  ],
  settlements: []
}

const COLORS = ['#1D9E75', '#378ADD', '#D4537E']

function getInitials(email) {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

function nameOf(email) {
  if (email === 'you@example.com') return 'You'
  return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
}

function memberColor(email) {
  const idx = group.members.indexOf(email)
  return COLORS[idx % COLORS.length]
}

function computeBalances() {
  const bal = {}
  group.members.forEach(m => bal[m] = 0)
  group.expenses.forEach(exp => {
    bal[exp.paid] += exp.amount
    Object.entries(exp.splits).forEach(([m, amt]) => { bal[m] -= amt })
  })
  return bal
}

function BalancesTab() {
  const balances = computeBalances()

  return (
    <div className="balance-grid">
      {group.members.map(m => {
        const b = Math.round(balances[m] * 100) / 100
        const cls = b > 0.01 ? 'pos' : b < -0.01 ? 'neg' : 'zero'
        const label = b > 0.01 ? 'gets back' : b < -0.01 ? 'owes' : 'settled up'

        return (
          <div className="bal-card" key={m}>
            <div className="bal-avatar" style={{ background: memberColor(m) + '22', color: memberColor(m) }}>
              {getInitials(m)}
            </div>
            <div className="bal-name">{nameOf(m)}</div>
            <div className={`bal-amount ${cls}`}>${Math.abs(b).toFixed(2)}</div>
            <div className={`bal-label ${cls}`}>{label}</div>
          </div>
        )
      })}
    </div>
  )
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
          <BalancesTab />
        </div>
      </div>

    </div>
  )
}

export default App