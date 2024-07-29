import React, { useState, useEffect } from 'react';
import { clockIn, clockOut, getAttendanceByEmployee } from '../services/attendanceService';
import { getEmployees } from '../services/employeeService';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeList = await getEmployees();
      setEmployees(employeeList);
    };
    fetchEmployees();
  }, []);

  const handleClockIn = async () => {
    try {
      await clockIn(selectedEmployee);
      setStatus('clocked in');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut(selectedEmployee);
      setStatus('clocked out');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
        <option value="">Select Employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
      <button onClick={handleClockIn} disabled={!selectedEmployee || status === 'clocked in'}>Clock In</button>
      <button onClick={handleClockOut} disabled={!selectedEmployee || status === 'clocked out'}>Clock Out</button>
    </div>
  );
};

export default EmployeeDashboard;
