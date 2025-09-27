import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

// TROQUE pelos valores do seu app web no Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCY5KEbWqwq3f57oi2apHavqLl7KO9Xbuk",
  authDomain: "gestor-horarios-93a53.firebaseapp.com",
  projectId: "gestor-horarios-93a53",
  storageBucket: "gestor-horarios-93a53.firebasestorage.app",
  messagingSenderId: "198506536629",
  appId: "1:198506536629:web:1cb95c3e11627e819468fc",
  measurementId: "G-KFW3HPDSF2"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics só roda em https/produçao (ou localhost) e se measurementId existir
let analytics = null
isSupported().then((ok) => {
  if (ok && firebaseConfig.measurementId) {
    analytics = getAnalytics(app)
    logEvent(analytics, 'app_open')
  }
})
export { analytics, logEvent }
