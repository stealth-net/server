import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from '../Auth.module.css';

const SignUpPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		setError('');

		if (username === '' || email === '' || password === '') {
			setError('Please fill in all fields');
			return;
		}

		try {
			const response = await fetch("/api/auth/register", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password })
			});

			const data = await response.json();

			if (response.ok) {
				// Store the token in a cookie
				Cookies.set('token', data.data.token, { 
					expires: 1, // 1 day
					secure: false, // Allow HTTP for development
					sameSite: 'lax' // Less strict for development
				});
				navigate('/'); // Navigate to main page
			} else {
				setError(data.message || 'Sign up failed. Please check your information.');
			}
		} catch (error) {
			console.error('Error during sign up:', error);
			setError('An error occurred. Please try again later.');
		}
	};

	return (
		<div className={`${styles.authContainer} ${styles.fadeIn}`}>
			<div className={styles.authHeader}>
				<span className={styles.authTitle}>Welcome! Create an account</span>
			</div>
			<div className={styles.authContent}>
				<div className={`${styles.authFormContainer} ${styles.textCenter}`}>
					<span style={{ fontSize: '1.25rem' }} className={styles.authFormTitle}>Enter your account information</span>
					{error && <div className={styles.errorMessage}>{error}</div>}
					<form onSubmit={handleSignUp}>
						<input
							className={styles.authInput}
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							minLength={3}
						/>
						<input
							className={styles.authInput}
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							required
						/>
						<input
							className={styles.authInput}
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
						/>
						<button type="submit" className={`${styles.authButton} ${styles.authSubmitButton}`}>Sign up</button>
					</form>
					<div className={styles.textCenter}>
						<span className={styles.authText}>Already have an account? <Link to="/login">Log in</Link></span>
					</div>
				</div>
				<div className={styles.authLogoContainer}>
					<div className={styles.authLogo} style={{ width: '128px', height: '128px' }}></div>
					<span className={styles.authLogoLabel}>StealthNet</span>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;