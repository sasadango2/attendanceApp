// src/services/reportService.js
import { getAttendanceByDate } from './attendanceService';

const calculateWorkingHours = (attendances) => {
    let totalHours = 0;
    attendances.forEach(attendance => {
        if (attendance.clockOut) {
            const duration = attendance.clockOut.toDate() - attendance.clockIn.toDate();
            totalHours += duration / (1000 * 60 * 60); // ミリ秒を時間に変換
        }
    });
    return totalHours;
};

const getDailyReport = async (employeeId, date) => {
    const attendances = await getAttendanceByDate(employeeId, { start: new Date(date), end: new Date(date + 'T23:59:59') });
    return calculateWorkingHours(attendances);
};

const getWeeklyReport = async (employeeId, startDate, endDate) => {
    const attendances = await getAttendanceByDate(employeeId, { start: new Date(startDate), end: new Date(endDate) });
    return calculateWorkingHours(attendances);
};

const getMonthlyReport = async (employeeId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const attendances = await getAttendanceByDate(employeeId, { start: startDate, end: endDate });
    return calculateWorkingHours(attendances);
};

export { getDailyReport, getWeeklyReport, getMonthlyReport };
