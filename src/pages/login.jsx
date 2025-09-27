import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, analytics, logEvent } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    await signInWithEmailAndPassword(auth, email, password)
    analytics && logEvent(analytics, 'login', { method: 'password' })
    nav('/')
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h1>Login</h1>
      <input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Entrar</button>
      <p>Sem conta? <Link to="/register">Cadastre-se</Link></p>
    </form>
  )
}
