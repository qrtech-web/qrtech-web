// scripts/seedFirestore.js
// Ejecutá: node scripts/seedFirestore.js
import { readFileSync } from 'fs';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1️⃣ Cargamos credenciales (usa GOOGLE_APPLICATION_CREDENTIALS
//    o serviceAccount.json si preferís)
initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// 2️⃣ Leemos el archivo seed.json
const seed = JSON.parse(readFileSync('seed.json', 'utf8'));

// 3️⃣ Insertamos cada doc
const batch = db.batch();
Object.entries(seed.productos).forEach(([id, data]) => {
  const ref = db.collection('productos').doc(id);
  batch.set(ref, data);
});

await batch.commit();
console.log('Seed cargado con éxito 🚀');
process.exit(0);
