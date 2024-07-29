import React, { useState } from 'react';
import { register, login, logout } from '../services/authService';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(email, password);
            alert('Registration successful');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = async () => {
        try {
            await login(email, password);
            alert('Login successful');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            alert('Logout successful');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Authentication</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Auth;
