import React, { useState, useEffect } from 'react';
import { db, auth, createUserWithEmailAndPassword, signOut } from '../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, query, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

// MUI components
import { Box, Button, TextField, Typography, List, ListItem, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [user] = useAuthState(auth);
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [hourlyRate, setHourlyRate] = useState('');
  const [totalHours, setTotalHours] = useState({});
  const [totalSalaries, setTotalSalaries] = useState({});
  const navigate = useNavigate();

  // 従業員情報を取得
  useEffect(() => {
    const fetchEmployees = async () => {
      const q = query(collection(db, 'employees'));
      const querySnapshot = await getDocs(q);
      const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
    };

    fetchEmployees();
  }, []);

  // 勤怠情報を取得し、労働時間と給料を計算
  useEffect(() => {
    const fetchTotalHours = () => {
      const unsubscribe = onSnapshot(collection(db, 'attendance'), (snapshot) => {
        const hours = {};
        const salaries = {};
        const clockIns = {};

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const { uid, timestamp, type } = data;
          const employee = employees.find(emp => emp.uid === uid);

          if (employee) {
            const employeeId = employee.id;
            if (!hours[employeeId]) hours[employeeId] = 0;

            let timeInMillis = null;

            // タイムスタンプが正しいか確認してから処理を続ける
            if (timestamp && timestamp instanceof Timestamp) {
              timeInMillis = timestamp.toMillis(); // Timestamp型をミリ秒に変換
            } else if (typeof timestamp === 'string') {
              const date = new Date(timestamp);
              if (!isNaN(date.getTime())) {
                timeInMillis = date.getTime(); // 文字列をミリ秒に変換
              } else {
                console.error(`Invalid date string for doc ${doc.id}: `, timestamp);
              }
            } else {
              console.error(`Missing or invalid timestamp for doc ${doc.id}: `, timestamp);
            }

            if (timeInMillis !== null) {
              if (type === 'clockIn') {
                clockIns[employeeId] = timeInMillis;
              } else if (type === 'clockOut' && clockIns[employeeId]) {
                hours[employeeId] += (timeInMillis - clockIns[employeeId]);
                clockIns[employeeId] = null;  // リセット
              }
            }
          }
        });

        employees.forEach(employee => {
          const employeeId = employee.id;
          const rate = employee.hourlyRate || 0;  // 時給がない場合は0
          const workedHours = (hours[employeeId] || 0) / 3600000;  // ミリ秒を時間に変換
          salaries[employeeId] = workedHours * rate;  // 給料を計算
        });

        setTotalHours(hours);
        setTotalSalaries(salaries);
      });

      return () => unsubscribe();
    };

    fetchTotalHours();
  }, [employees]);

  // 従業員の追加処理
  const handleAddEmployee = async () => {
    try {
      // Firebase Authentication でユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Firestore に従業員情報を追加
      await addDoc(collection(db, 'employees'), {
        uid,
        name,
        email,
        role,
        hourlyRate: parseFloat(hourlyRate), // 時給を保存
        password,  
        createdAt: serverTimestamp()  // Firebaseサーバーのタイムスタンプを使う
      });

      setName('');
      setEmail('');
      setPassword('');
      setHourlyRate('');  // 時給フィールドをリセット
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // 時給の更新処理
  const handleUpdateHourlyRate = async (id, newRate) => {
    try {
      await updateDoc(doc(db, 'employees', id), { hourlyRate: parseFloat(newRate) });
      
      // 時給を更新したら、全体の給料も再計算
      const updatedEmployees = employees.map(emp =>
        emp.id === id ? { ...emp, hourlyRate: parseFloat(newRate) } : emp
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error updating hourly rate:', error);
    }
  };

  // 従業員の削除処理
  const handleDeleteEmployee = async (id) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // 労働時間と給料の再計算（従業員データが変更されたとき）
  useEffect(() => {
    const recalculateSalaries = () => {
      const updatedSalaries = {};
      employees.forEach(employee => {
        const employeeId = employee.id;
        const rate = employee.hourlyRate || 0;
        const workedHours = (totalHours[employeeId] || 0) / 3600000;  // ミリ秒を時間に変換
        updatedSalaries[employeeId] = workedHours * rate;  // 給料を計算
      });
      setTotalSalaries(updatedSalaries);
    };

    recalculateSalaries();
  }, [employees, totalHours]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        管理者画面
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        endIcon={<LogoutIcon />}
        sx={{ marginBottom: 4 }}
      >
        ログアウト
      </Button>

      {/* 従業員追加フォーム */}
      <Typography variant="h5" gutterBottom>
        従業員を追加
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormControl>
          <InputLabel>役職</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="employee">従業員</MenuItem>
            <MenuItem value="admin">管理者</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Hourly Rate"
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
        />
        <Button variant="contained" onClick={handleAddEmployee}>
          追加
        </Button>
      </Box>

      {/* 従業員リスト */}
      <Typography variant="h5" gutterBottom>
        従業員リスト
      </Typography>
      <List>
        {employees.map(emp => (
          <ListItem key={emp.id} sx={{ display: 'flex', gap: 2 }}>
            <Typography>{emp.name} ({emp.email}) 時給: </Typography>
            <TextField
              type="number"
              value={emp.hourlyRate || ''}
              onChange={(e) => handleUpdateHourlyRate(emp.id, e.target.value)}
              placeholder="Hourly Rate"
            />円
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEmployee(emp.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* 労働時間と給料 */}
      <Typography variant="h5" gutterBottom>
        従業員の労働時間と給料
      </Typography>
      <List>
        {employees.map(emp => (
          <ListItem key={emp.id}>
            <Typography>
              {emp.name}: {totalHours[emp.id] ? (totalHours[emp.id] / 3600000).toFixed(2) : 0} 時間, 
              給料: {totalSalaries[emp.id] ? totalSalaries[emp.id].toFixed(2) : 0} 円
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminDashboard;






















