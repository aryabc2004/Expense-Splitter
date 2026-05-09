import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BalancesTab from './components/BalancesTab'
import AddExpense from './components/AddExpense'

const INITIAL_GROUPS = [
  {
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
]

const CURRENT_USER = 'you@example.com'

export default function App() {
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [activeGroupId, setActiveGroupId] = useState('g1')
  const [showAddExpense, setShowAddExpense] = useState(false)

  const activeGroup = groups.find(g => g.id === activeGroupId)

  return (
    <div className="app">
      <Sidebar
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={setActiveGroupId}
      />

      <div className="main">
        <Topbar
          group={activeGroup}
          onAddExpense={() => setShowAddExpense(true)}
        />
        <div className="content">
          <BalancesTab group={activeGroup} currentUser={CURRENT_USER} />
        </div>
      </div>

      {showAddExpense && (
        <AddExpense
          group={activeGroup}
          onClose={() => setShowAddExpense(false)}
        />
      )}
    </div>
  )
}