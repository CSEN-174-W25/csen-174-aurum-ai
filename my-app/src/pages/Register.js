import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { runCreateUserWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';
import './styles/Login.css';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            await runCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <div className="login-container">
            {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}
            <div className="login-box">
                <h2>Create an account with AurumAI</h2>                
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            autoComplete='email'
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='new-password'
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <labe htmlFor="c-password">Confirm Password</labe>
                        <input
                            disabled={isRegistering}
                            type="password"
                            id="c-password"
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            required
                        />
                    </div>


                    {errorMessage && (
                            <span>{errorMessage}</span>
                        )}

                    <button type="submit" className="login-button" disabled={isRegistering}>
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="sign-up">
                    <p>Already have an account? <Link to={'/'}>Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
