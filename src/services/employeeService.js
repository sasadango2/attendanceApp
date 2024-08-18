import { db } from '../firebase'; // インポートパスが正しいことを確認
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

export const addEmployee = async (employee) => {
  await addDoc(collection(db, 'employees'), employee);
};

export const deleteEmployee = async (id) => {
  await deleteDoc(doc(db, 'employees', id));
};

export const getEmployees = async () => {
  const querySnapshot = await getDocs(collection(db, 'employees'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};














