import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_LB}/auth/register`,
                inputs
            );
            navigate('/login');
        } catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <div className="auth">
            <form>
                <h1>Register</h1>
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
                        <ion-icon name="mail-sharp"></ion-icon>
                    </span>
                    <input
                        required
                        type="email"
                        placeholder="Email"
                        name="email"
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
                <button onClick={handleSubmit}>Register</button>
                {err && <p>{err}</p>}
                <span>
                    Do you have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
