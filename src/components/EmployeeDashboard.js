import React, { useState, useEffect } from 'react';
import { auth, db, addDoc, collection, serverTimestamp } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

// MUI components
import { Box, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const EmployeeDashboard = () => {
  const [user] = useAuthState(auth);
  const [employeeName, setEmployeeName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (user) {
        try {
          const userDoc = doc(db, 'employees', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setEmployeeName(docSnap.data().name);
          }
        } catch (error) {
          console.error('Error fetching employee name:', error);
        }
      }
    };

    fetchEmployeeName();
  }, [user]);

  const handleClockIn = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'attendance'), {
        uid: user.uid,
        timestamp: serverTimestamp(),
        type: 'clockIn'
      });
      setMessage('今日も1日頑張ろう！');
      setTimeout(() => {
        setMessage('');
        setLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error clocking in:', error);
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'attendance'), {
        uid: user.uid,
        timestamp: serverTimestamp(),
        type: 'clockOut'
      });
      setMessage('お疲れい！');
      setTimeout(() => {
        setMessage('');
        setLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error clocking out:', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Card sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            従業員画面
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom>
            おはようございます、{employeeName}
          </Typography>

          {/* 出勤ボタン */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClockIn}
            disabled={loading}
            sx={{ marginBottom: 2, width: '100%' }}
          >
            {loading ? <CircularProgress size={24} /> : '出勤'}
          </Button>

          {/* 退勤ボタン */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClockOut}
            disabled={loading}
            sx={{ marginBottom: 2, width: '100%' }}
          >
            {loading ? <CircularProgress size={24} /> : '退勤'}
          </Button>

          {/* メッセージの表示 */}
          {message && <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDashboard;





