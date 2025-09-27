import { useEffect, useMemo, useState } from 'react'
import { auth, db, analytics, logEvent } from '../firebase'
import {
  addDoc, collection, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, doc, deleteDoc
} from 'firebase/firestore'
import { format } from 'date-fns'

export default function Home() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('08:00')
  const [tasks, setTasks] = useState([])

  const uid = auth.currentUser?.uid
  // cria a ref só quando tiver uid
  const colRef = useMemo(() => uid ? collection(db, 'users', uid, 'tasks') : null, [uid])

  useEffect(() => {
    if (!colRef) return
    const q = query(colRef, orderBy('dueAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [colRef])

  async function addTask(e) {
    e.preventDefault()
    if (!colRef) return

    const [h, m] = time.split(':').map(Number)
    const due = new Date(); due.setHours(h, m, 0, 0)

    await addDoc(colRef, {
      title,
      dueAt: due,            // Firestore salva como Timestamp
      done: false,
      createdAt: serverTimestamp()
    })
    analytics && logEvent(analytics, 'task_create')
    setTitle('')
  }

  async function toggleDone(t) {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'tasks', t.id), { done: !t.done })
    analytics && logEvent(analytics, 'task_complete', { done: !t.done })
  }

  async function removeTask(t) {
    if (!uid) return
    const ok = confirm(`Excluir a tarefa: "${t.title}"?`)
    if (!ok) return
    await deleteDoc(doc(db, 'users', uid, 'tasks', t.id))
    analytics && logEvent(analytics, 'task_delete')
  }

  const total = tasks.length
  const done = tasks.filter(t => t.done).length

  return (
    <div className="page">
      <h1>Minhas Tarefas</h1>

      <form onSubmit={addTask} className="row">
        <input
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button>Adicionar</button>
      </form>

      <p><b>Resumo:</b> {done}/{total} concluídas hoje</p>

      <ul className="list">
        {tasks.map(t => (
          <li key={t.id} className="task-row">
            <label className="task-main">
              <input type="checkbox" checked={t.done} onChange={() => toggleDone(t)} />
              {t.title} — {t.dueAt?.toDate ? format(t.dueAt.toDate(), 'HH:mm') : format(new Date(t.dueAt), 'HH:mm')}
            </label>
            <button
              className="btn-delete"
              type="button"
              onClick={() => removeTask(t)}
              aria-label={`Excluir ${t.title}`}
              title="Excluir"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
