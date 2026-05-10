import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BalancesTab from './components/BalancesTab'
import ExpensesTab from './components/ExpensesTab'
import SettleTab from './components/SettleTab'
import AddExpense from './components/AddExpense'
import CreateGroup from './components/CreateGroup'

function createInitialGroups(currentUser) {
  return [
    {
      id: 'g1',
      name: 'Example Group (Template)',
      isTemplate: true,
      color: '#1D9E75',
      members: [currentUser, 'priya@gmail.com', 'alex@gmail.com'],
      expenses: [
        { id: 'e1', desc: 'Airbnb', amount: 480, paid: currentUser, splits: { [currentUser]: 160, 'priya@gmail.com': 160, 'alex@gmail.com': 160 }, date: '2024-03-10' },
        { id: 'e2', desc: 'Ramen dinner', amount: 60, paid: 'priya@gmail.com', splits: { [currentUser]: 20, 'priya@gmail.com': 20, 'alex@gmail.com': 20 }, date: '2024-03-11' },
        { id: 'e3', desc: 'Theme park', amount: 200, paid: 'alex@gmail.com', splits: { [currentUser]: 50, 'priya@gmail.com': 100, 'alex@gmail.com': 50 }, date: '2024-03-12' },
      ],
      settlements: []
    }
  ]
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState('g1')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [activeTab, setActiveTab] = useState('balances')

  const activeGroup = groups.find(g => g.id === activeGroupId)

  function handleLogin(email) {
    setCurrentUser(email)
    setGroups(createInitialGroups(email))
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  function handleAddExpense(expense) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: [...g.expenses, expense], settlements: [] }
        : g
    ))
  }

  function handleDeleteExpense(expenseId) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId), settlements: [] }
        : g
    ))
  }

  function handleSettle(transaction) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? {
            ...g,
            settlements: [...g.settlements, {
              from: transaction.from,
              to: transaction.to,
              amount: transaction.amount,
              date: new Date().toISOString().slice(0, 10)
            }]
          }
        : g
    ))
  }

  function handleCreateGroup(newGroup) {
    setGroups(prev => [...prev, newGroup])
    setActiveGroupId(newGroup.id)
    setActiveTab('balances')
  }

  return (
    <div className="app">
      <Sidebar
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={setActiveGroupId}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      <div className="main">
        <Topbar
          group={activeGroup}
          onAddExpense={() => setShowAddExpense(true)}
        />
        <div className="content">

          <div className="tab-bar">
            {['balances', 'expenses', 'settle'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'balances' && (
            <BalancesTab group={activeGroup} currentUser={currentUser} />
          )}
          {activeTab === 'expenses' && (
            <ExpensesTab
              group={activeGroup}
              currentUser={currentUser}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {activeTab === 'settle' && (
            <SettleTab
              group={activeGroup}
              currentUser={currentUser}
              onSettle={handleSettle}
            />
          )}

        </div>
      </div>

      {showAddExpense && (
        <AddExpense
          group={activeGroup}
          currentUser={currentUser}
          onClose={() => setShowAddExpense(false)}
          onAdd={handleAddExpense}
        />
      )}

      {showCreateGroup && (
        <CreateGroup
          groupCount={groups.length}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  )
}