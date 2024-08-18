import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Navigate をインポート
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    if (user) {
      const checkRole = async () => {
        try {
          // Firestore からユーザーの役割を取得
          const q = query(collection(db, 'employees'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setIsAdmin(userData.role === 'admin');
            setIsEmployee(userData.role === 'employee');
          }
        } catch (err) {
          console.error('Error checking user role:', err);
        }
      };

      checkRole();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <Navigate to="/login" />;
  if (rest.path === '/admin' && !isAdmin) return <Navigate to="/employee" />;
  if (rest.path === '/employee' && !isEmployee) return <Navigate to="/admin" />;
  
  return <Component {...rest} />;
};

export default PrivateRoute;














