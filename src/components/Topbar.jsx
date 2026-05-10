export default function Topbar({ group, onAddExpense }) {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{group.name}</div>
        <div className="topbar-sub">{group.members.length} members</div>
      </div>
      <button className="action-btn" onClick={onAddExpense}>+ Add expense</button>
    </div>
  )
}