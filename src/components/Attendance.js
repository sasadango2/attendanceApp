import React, { useState } from 'react';
import { clockIn, clockOut } from '../services/attendanceService';

const Attendance = () => {
    const [employeeId, setEmployeeId] = useState('');

    const handleClockIn = async () => {
        try {
            await clockIn(employeeId);
            alert('Clocked in successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleClockOut = async () => {
        try {
            await clockOut(employeeId);
            alert('Clocked out successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Attendance</h1>
            <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Employee ID"
            />
            <button onClick={handleClockIn}>Clock In</button>
            <button onClick={handleClockOut}>Clock Out</button>
        </div>
    );
};

export default Attendance;

