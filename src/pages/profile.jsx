import { useEffect, useMemo, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { format, startOfDay, endOfDay } from 'date-fns'

export default function Profile() {
  const u = auth.currentUser
  const [doneToday, setDoneToday] = useState([])
  const [loading, setLoading] = useState(true)

  const uid = u?.uid
  const today = new Date()

  // pega apenas tasks concluídas do dia
  const colRef = useMemo(() => {
    if (!uid) return null
    return query(
      collection(db, 'users', uid, 'tasks'),
      where('done', '==', true),
      where('dueAt', '>=', startOfDay(today)),
      where('dueAt', '<=', endOfDay(today))
    )
  }, [uid, today])

  useEffect(() => {
    if (!colRef) return
    const unsub = onSnapshot(colRef, (snap) => {
      setDoneToday(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [colRef])

  return (
    <div className="page">
      <h1>Perfil</h1>
      <p><b>Nome:</b> {u?.displayName}</p>
      <p><b>E-mail:</b> {u?.email}</p>

      <h2>Resumo do dia</h2>
      {loading ? (
        <p>Nenhuma tarefa concluida</p>
      ) : (
        <>
          <p><b>{doneToday.length}</b> tarefas concluídas hoje ({format(today, 'dd/MM/yyyy')})</p>
          <ul className="list">
            {doneToday.map(t => (
              <li key={t.id}>
                ✔ {t.title} — {t.dueAt?.toDate
                  ? format(t.dueAt.toDate(), 'HH:mm')
                  : format(new Date(t.dueAt), 'HH:mm')}
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={() => auth.signOut()}>Sair</button>
    </div>
  )
}

