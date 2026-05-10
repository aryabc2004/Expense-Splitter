import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BalancesTab from './components/BalancesTab'
import ExpensesTab from './components/ExpensesTab'
import SettleTab from './components/SettleTab'
import AddExpense from './components/AddExpense'
import CreateGroup from './components/CreateGroup'

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
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [activeTab, setActiveTab] = useState('balances')

  const activeGroup = groups.find(g => g.id === activeGroupId)

  function handleAddExpense(expense) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: [...g.expenses, expense] }
        : g
    ))
  }

  function handleDeleteExpense(expenseId) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId) }
        : g
    ))
  }

  function handleEditExpense(updatedExpense) {
    setGroups(prev => prev.map(g =>
      g.id === activeGroupId
        ? { ...g, expenses: g.expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e) }
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
            <BalancesTab group={activeGroup} currentUser={CURRENT_USER} />
          )}
          {activeTab === 'expenses' && (
            <ExpensesTab
              group={activeGroup}
              currentUser={CURRENT_USER}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          )}
          {activeTab === 'settle' && (
            <SettleTab
              group={activeGroup}
              currentUser={CURRENT_USER}
              onSettle={handleSettle}
            />
          )}

        </div>
      </div>

      {showAddExpense && (
        <AddExpense
          group={activeGroup}
          currentUser={CURRENT_USER}
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