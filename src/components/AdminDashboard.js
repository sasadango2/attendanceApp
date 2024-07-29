import React, { useState, useEffect } from 'react';
import { addEmployee, deleteEmployee, getEmployees } from '../services/employeeService';
import { getAttendanceByEmployee } from '../services/attendanceService';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeList = await getEmployees();
      setEmployees(employeeList);
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (name && email) {
      await addEmployee({ name, email });
      setName('');
      setEmail('');
      const employeeList = await getEmployees();
      setEmployees(employeeList);
    } else {
      alert('Please enter both name and email');
    }
  };

  const handleDeleteEmployee = async (id) => {
    await deleteEmployee(id);
    const employeeList = await getEmployees();
    setEmployees(employeeList);
  };

  const handleSelectEmployee = async (id) => {
    setSelectedEmployee(id);
    const attendance = await getAttendanceByEmployee(id);
    let total = 0;
    for (let i = 0; i < attendance.length; i += 2) {
      if (attendance[i + 1]) {
        total += (attendance[i + 1].timestamp.seconds - attendance[i].timestamp.seconds) / 3600;
      }
    }
    setTotalHours(total);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleAddEmployee}>Add Employee</button>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.email}
            <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
            <button onClick={() => handleSelectEmployee(employee.id)}>View Hours</button>
          </li>
        ))}
      </ul>
      {selectedEmployee && (
        <div>
          <h2>Total Hours for Selected Employee: {totalHours}</h2>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
