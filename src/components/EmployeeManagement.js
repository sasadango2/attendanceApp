import React, { useState, useEffect } from 'react';
import { addEmployee, getEmployees, updateEmployee, deleteEmployee } from '../services/employeeService';

const EmployeeManagement = () => {
    // const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState({ name: '', email: '' });

    // useEffect(() => {
    //     const fetchEmployees = async () => {
    //         try {
    //             const data = await getEmployees();
    //             setEmployees(data);
    //         } catch (error) {
    //             alert(error.message);
    //         }
    //     };
    //     fetchEmployees();
    // }, []);

    const handleAdd = async () => {
        try {
            await addEmployee(employee);
            alert('Employee added successfully');
            setEmployee({ name: '', email: '' }); // フォームをリセットする
            // const data = await getEmployees();
            // setEmployees(data); // 更新された従業員リストを取得
        } catch (error) {
            alert(error.message);
        }
    };

    // const handleUpdate = async (id) => {
    //     try {
    //         await updateEmployee(id, employee);
    //         alert('Employee updated successfully');
    //         const data = await getEmployees();
    //         setEmployees(data); // 更新された従業員リストを取得
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };

    // const handleDelete = async (id) => {
    //     try {
    //         await deleteEmployee(id);
    //         alert('Employee deleted successfully');
    //         const data = await getEmployees();
    //         setEmployees(data); // 更新された従業員リストを取得
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };

    return (
        <div>
            <h1>Employee Management</h1>
            <input
                type="text"
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                placeholder="Name"
            />
            <input
                type="email"
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                placeholder="Email"
            />
            <button onClick={handleAdd}>Add Employee</button>

            {/* <h2>Employee List</h2>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        {emp.name} ({emp.email})
                        <button onClick={() => handleUpdate(emp.id)}>Update</button>
                        <button onClick={() => handleDelete(emp.id)}>Delete</button>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default EmployeeManagement;

