// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const BASE_URL = process.env.REACT_APP_BASE_URL
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userEmail, userPassword) => {
        try {
            const response = await axios.post(BASE_URL+'api/auth/login', { userEmail, userPassword });
            const { token , data } = response.data;
            localStorage.setItem('jwtToken', token);
            setUser(jwtDecode(token));
            return jwtDecode(token)
        }catch(error) {
               error.response ? toast.error( "Error : " + error.response.data.message) : toast.error("failed")
        
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setUser(jwtDecode(token));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading , setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
