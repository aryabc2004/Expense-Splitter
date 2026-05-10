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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [group, setGroup] = useState(null)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [activeTab, setActiveTab] = useState('balances')

  function handleLogin(email) {
    setCurrentUser(email)
  }

  function handleCreateGroup(newGroup) {
    setGroup(newGroup)
  }

  function handleAddExpense(expense) {
    setGroup(prev => ({ ...prev, expenses: [...prev.expenses, expense] }))
  }

  function handleDeleteExpense(expenseId) {
    setGroup(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== expenseId),
      settlements: []
    }))
  }

  function handleSettle(transaction) {
    setGroup(prev => ({
      ...prev,
      settlements: [...prev.settlements, {
        from: transaction.from,
        to: transaction.to,
        amount: transaction.amount,
        date: new Date().toISOString().slice(0, 10)
      }]
    }))
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  if (!group) {
    return (
      <div className="login-overlay">
        <CreateGroup
          inline
          currentUser={currentUser}
          onClose={() => {}}
          onCreate={handleCreateGroup}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar group={group} />

      <div className="main">
        <Topbar
          group={group}
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
            <BalancesTab group={group} currentUser={currentUser} />
          )}
          {activeTab === 'expenses' && (
            <ExpensesTab
              group={group}
              currentUser={currentUser}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {activeTab === 'settle' && (
            <SettleTab
              group={group}
              currentUser={currentUser}
              onSettle={handleSettle}
            />
          )}

        </div>
      </div>

      {showAddExpense && (
        <AddExpense
          group={group}
          currentUser={currentUser}
          onClose={() => setShowAddExpense(false)}
          onAdd={handleAddExpense}
        />
      )}
    </div>
  )
}