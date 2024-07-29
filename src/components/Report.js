import React, { useState } from 'react';
import { getDailyReport, getWeeklyReport, getMonthlyReport } from '../services/reportService';

const Report = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');

    const handleDailyReport = async () => {
        try {
            const hours = await getDailyReport(employeeId, date);
            alert(`Daily working hours: ${hours}`);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleWeeklyReport = async () => {
        try {
            const hours = await getWeeklyReport(employeeId, startDate, endDate);
            alert(`Weekly working hours: ${hours}`);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleMonthlyReport = async () => {
        try {
            const hours = await getMonthlyReport(employeeId, year, month);
            alert(`Monthly working hours: ${hours}`);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Report</h1>
            <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Employee ID"
            />
            <div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={handleDailyReport}>Daily Report</button>
            </div>
            <div>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleWeeklyReport}>Weekly Report</button>
            </div>
            <div>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                />
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Month"
                />
                <button onClick={handleMonthlyReport}>Monthly Report</button>
            </div>
        </div>
    );
};

export default Report;

