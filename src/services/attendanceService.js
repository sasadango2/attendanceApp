import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const clockIn = async (employeeId) => {
  await addDoc(collection(db, 'attendance'), {
    employeeId,
    type: 'clockIn',
    timestamp: Timestamp.now()
  });
};

export const clockOut = async (employeeId) => {
  await addDoc(collection(db, 'attendance'), {
    employeeId,
    type: 'clockOut',
    timestamp: Timestamp.now()
  });
};

export const getAttendanceByEmployee = async (employeeId) => {
  const q = query(collection(db, 'attendance'), where('employeeId', '==', employeeId));
  const querySnapshot = await getDocs(q);
  const attendances = [];
  querySnapshot.forEach((doc) => {
    attendances.push(doc.data());
  });
  return attendances;
};

