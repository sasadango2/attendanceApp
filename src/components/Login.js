import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getDocs, query, collection } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

// MUI components
import { Box, Button, TextField, Typography, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Login = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 従業員の名前を取得
    const fetchEmployees = async () => {
      try {
        const q = query(collection(db, 'employees'));
        const querySnapshot = await getDocs(q);
        const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(employeeList);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleLogin = async () => {
    try {
      // 選択された従業員の情報を取得
      const selectedEmp = employees.find(emp => emp.name === selectedEmployee);
      if (!selectedEmp) throw new Error('従業員が選択されていません');

      // Firebase Authentication によるログイン
      await signInWithEmailAndPassword(auth, selectedEmp.email, password);

      // ロールによってリダイレクト
      if (selectedEmp.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ maxWidth: 400, padding: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            ログイン
          </Typography>
          {/* 従業員選択 */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="employee-select-label">従業員を選択</InputLabel>
            <Select
              labelId="employee-select-label"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <MenuItem value=""><em>従業員を選択</em></MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.name}>{emp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* パスワード入力 */}
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* エラーメッセージ */}
          {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

          {/* ログインボタン */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3 }}
            onClick={handleLogin}
          >
            ログイン
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

































