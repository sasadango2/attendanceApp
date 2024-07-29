// src/services/employeeService.js
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const addEmployee = async (employee) => {
  const docRef = await addDoc(collection(db, 'employees'), employee);
  return docRef.id;
};

export const deleteEmployee = async (id) => {
  await deleteDoc(doc(db, 'employees', id));
};

export const getEmployees = async () => {
  const querySnapshot = await getDocs(collection(db, 'employees'));
  const employees = [];
  querySnapshot.forEach((doc) => {
    employees.push({ id: doc.id, ...doc.data() });
  });
  return employees;
};

