import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Login = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate('/');
        } catch (err) {
            setError(err.response.data);
        }
    };
    return (
        <div className="auth">
            <form>
                <h1>Login</h1>
                <div className="form_input">
                    <span className="icon">
                        <ion-icon name="person-sharp"></ion-icon>
                    </span>
                    <input
                        required
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                    />
                </div>
                <div className="form_input">
                    <span className="icon">
                        <ion-icon name="lock-closed-sharp"></ion-icon>
                    </span>
                    <input
                        required
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <button onClick={handleSubmit}>Login</button>
                {err && <p>{err}</p>}
                <span>
                    Don't you have an account?{' '}
                    <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
