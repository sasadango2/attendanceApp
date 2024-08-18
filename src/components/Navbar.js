import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/admin">Admin Dashboard</Link></li>
        <li><Link to="/employee">Employee Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;





