import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { runCreateUserWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';
import { getAuth, updateProfile } from 'firebase/auth';
import './styles/Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();
    const auth = getAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Check password length
        if (password.length < 6) {
            setErrorMessage('Password should be at least 6 characters long');
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await runCreateUserWithEmailAndPassword(email, password);
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
            } catch (error) {
                setIsRegistering(false);
                // Handle specific Firebase errors
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErrorMessage('This email is already registered');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('Invalid email address');
                        break;
                    case 'auth/operation-not-allowed':
                        setErrorMessage('Registration is currently disabled');
                        break;
                    case 'auth/weak-password':
                        setErrorMessage('Password is too weak');
                        break;
                    default:
                        setErrorMessage('An error occurred during registration');
                        break;
                }
            }
        }
    }

    return (
        <div className="login-container">
            {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}
            <div className="login-box">
                <h2>Create an account with AurumAI</h2>                
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            autoComplete='name'
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        <div className="error-message">
                            {errorMessage}
                        </div>
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
