export const COLORS = ['#1D9E75', '#378ADD', '#D4537E', '#BA7517', '#7F77DD', '#D85A30']

export function getInitials(email) {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

export function nameOf(email, currentUser) {
  if (email === currentUser) return 'You'
  return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
}

export function memberColor(email, members) {
  return COLORS[members.indexOf(email) % COLORS.length]
}

export function computeBalances(group) {
  const bal = {}
  group.members.forEach(m => bal[m] = 0)

  // Add all expenses
  group.expenses.forEach(exp => {
    bal[exp.paid] += exp.amount
    Object.entries(exp.splits).forEach(([m, amt]) => { bal[m] -= amt })
  })

  // Subtract all settlements
  group.settlements.forEach(s => {
    bal[s.from] += s.amount
    bal[s.to] -= s.amount
  })

  return bal
}

export function minimumTransactions(balances) {
  const debtors = []
  const creditors = []

  Object.entries(balances).forEach(([person, balance]) => {
    const rounded = Math.round(balance * 100) / 100
    if (rounded < -0.01) debtors.push({ person, amount: -rounded })
    else if (rounded > 0.01) creditors.push({ person, amount: rounded })
  })

  const transactions = []
  let i = 0, j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(debtor.amount, creditor.amount)
    transactions.push({ from: debtor.person, to: creditor.person, amount })
    debtor.amount -= amount
    creditor.amount -= amount
    if (debtor.amount < 0.01) i++
    if (creditor.amount < 0.01) j++
  }

  return transactions
}