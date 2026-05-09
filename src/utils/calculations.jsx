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
  group.expenses.forEach(exp => {
    bal[exp.paid] += exp.amount
    Object.entries(exp.splits).forEach(([m, amt]) => { bal[m] -= amt })
  })
  group.settlements.forEach(s => { bal[s.from] -= s.amount; bal[s.to] += s.amount })
  return bal
}