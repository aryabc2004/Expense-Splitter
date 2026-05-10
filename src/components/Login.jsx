import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')

  function handleSubmit() {
    if (!email.trim()) return alert('Enter your email')
    if (!email.includes('@')) return alert('Enter a valid email')
    onLogin(email.trim())
  }

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-logo">Expense Splitter</div>
        <div className="login-sub">Track and split shared expenses with friends</div>

        <div className="form-group" style={{ marginTop: '24px' }}>
          <label className="form-label">Email address</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            autoFocus
          />
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px' }} onClick={handleSubmit}>
          Sign in
        </button>

        <div className="login-note">
          No password needed for this demo. Just enter your email to get started.
        </div>
      </div>
    </div>
  )
}