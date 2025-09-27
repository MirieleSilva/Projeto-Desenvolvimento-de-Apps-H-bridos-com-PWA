import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, analytics, logEvent } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    analytics && logEvent(analytics, 'sign_up', { method: 'password' })
    nav('/')
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h1>Cadastro</h1>
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Criar conta</button>
      <p>Já tem? <Link to="/login">Entrar</Link></p>
    </form>
  )
}
