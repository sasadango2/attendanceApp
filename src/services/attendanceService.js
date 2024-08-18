import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// 出勤記録を追加
export const clockIn = async (uid) => {
  try {
    await addDoc(collection(db, 'attendance'), {
      uid,
      timestamp: new Date().toISOString(),
      type: 'clockIn'
    });
  } catch (error) {
    console.error('Error clocking in: ', error);
  }
};

// 退勤記録を追加
export const clockOut = async (uid) => {
  try {
    await addDoc(collection(db, 'attendance'), {
      uid,
      timestamp: new Date().toISOString(),
      type: 'clockOut'
    });
  } catch (error) {
    console.error('Error clocking out: ', error);
  }
};

// 日次の出退勤記録を取得
export const getAttendanceByDate = async (uid, date) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('uid', '==', uid),
      where('timestamp', '>=', date + 'T00:00:00Z'),
      where('timestamp', '<=', date + 'T23:59:59Z')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting attendance by date: ', error);
    return [];
  }
};













