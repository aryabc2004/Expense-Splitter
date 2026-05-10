# Expense Splitter

A web app that lets a group of friends log shared expenses, see a live view of who owes whom, and settle debts in the minimum number of transactions.

**Live demo:** https://rococo-kringle-793076.netlify.app

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| UI Framework | React (via Vite) | Component-based architecture suits the modular nature of the app. Vite was chosen over Create React App for faster dev server startup. |
| Styling | Vanilla CSS | Chosen over Tailwind to keep focus on React fundamentals without adding a second learning curve. |
| State Management | React useState | No Redux needed — the app has a single group object as the source of truth, passed down via props. |
| Hosting | Netlify | Free tier, instant deploys from CLI, zero config for static React apps. |

---

## Project Structure

```
src/
├── App.jsx                  ← root component, owns all state
├── App.css                  ← global styles
├── components/
│   ├── Login.jsx            ← email login screen
│   ├── CreateGroup.jsx      ← group creation form
│   ├── Sidebar.jsx          ← group info panel
│   ├── Topbar.jsx           ← group header and add expense button
│   ├── BalancesTab.jsx      ← net balance view per member
│   ├── ExpensesTab.jsx      ← expense history and NL parser
│   ├── ExpenseDetail.jsx    ← expense split breakdown modal
│   ├── SettleTab.jsx        ← minimum transaction settlement view
│   └── AddExpense.jsx       ← add expense modal with split logic
└── utils/
    └── calculations.js      ← all financial logic
```

---

## Key Algorithms

### Balance Computation

Balances are computed fresh on every render from the raw expenses and settlements arrays. Settlements are subtracted from the running balance rather than clearing expenses — this means adding a new expense after settling doesn't invalidate past settlements, the math stays correct cumulatively.

```js
function computeBalances(group) {
  const bal = {}
  group.members.forEach(m => bal[m] = 0)

  group.expenses.forEach(exp => {
    bal[exp.paid] += exp.amount
    Object.entries(exp.splits).forEach(([m, amt]) => { bal[m] -= amt })
  })

  group.settlements.forEach(s => {
    bal[s.from] += s.amount
    bal[s.to] -= s.amount
  })

  return bal
}
```

### Debt Simplification

Given N people with various net balances, the algorithm finds the fewest payments to bring everyone to zero using a greedy approach — match the largest debtor with the largest creditor, transfer the minimum of their amounts, repeat until done.

```js
function minimumTransactions(balances) {
  const debtors = [], creditors = []

  Object.entries(balances).forEach(([person, balance]) => {
    const rounded = Math.round(balance * 100) / 100
    if (rounded < -0.01) debtors.push({ person, amount: -rounded })
    else if (rounded > 0.01) creditors.push({ person, amount: rounded })
  })

  const transactions = []
  let i = 0, j = 0

  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].amount, creditors[j].amount)
    transactions.push({ from: debtors[i].person, to: creditors[j].person, amount: amt })
    debtors[i].amount -= amt
    creditors[j].amount -= amt
    if (debtors[i].amount < 0.01) i++
    if (creditors[j].amount < 0.01) j++
  }

  return transactions
}
```

### Natural Language Parsing

The Expenses tab supports adding expenses in plain English using a local rule-based parser — no API required. It uses regex to extract amounts, split counts, who paid, and extra charges.

Supported patterns:
- `Split $60 dinner three ways`
- `Alex paid $120 for groceries split equally`
- `$80 sushi, Priya owes extra $15`

The alternative considered was using the Claude API for smarter parsing. This was prototyped but ultimately replaced with the local parser to avoid CORS issues in the browser and keep the app dependency-free.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Running locally

```bash
git clone https://github.com/aryabc2004/expense-splitter
cd expense-splitter
npm install
npm run dev
```

App runs at `http://localhost:5173`. All features including natural language parsing work on localhost.

### Deploying

```bash
npm run build
netlify deploy --prod --dir dist
```

---

## Design Decisions

**Why one group?**
The assessment says "a group" and keeping a single group simplifies state management and eliminates bugs around group switching. A multi-group version would require a state management library or more complex prop drilling.

**Why clear settlements on expense delete?**
When an expense is deleted, past settlements may no longer be valid. Clearing them forces users to re-settle based on correct balances. A more sophisticated implementation would use event sourcing to replay settlement history.

**Why no persistence?**
Data resets on page refresh. localStorage was deliberately omitted to keep scope within the 3-day timeline. In production this would be replaced with a database and proper authentication.

---

## AI Coding Agent Sessions

Built iteratively using Claude (claude.ai) as a coding agent across 5 sessions:

- **Session 1** — Project setup, Vite + React scaffolding, GitHub config, basic layout
- **Session 2** — Component architecture, balance computation, add expense modal with split logic
- **Session 3** — Settle tab, debt simplification algorithm, expense detail modal with delete
- **Session 4** — Login flow, single group simplification, cumulative balance approach
- **Session 5** — Natural language parser, bug fixes, deployment
