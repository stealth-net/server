import React, { useState } from 'react';
import styles from '../Auth.module.css';

const SignInPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignIn = () => {
		if (email === '' || password === '') return;
		fetch("/auth-api/v1/sign-in", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password })
		}).then(response => {
			if (response.ok) {
				window.location.pathname = '/';
			} else {
				alert('Sign in failed. Please check your credentials and try again.');
			}
		}).catch(error => {
			console.error('Error during sign in:', error);
			alert('An error occurred. Please try again later.');
		});
	};

	return (
		<div className={`${styles.authContainer} ${styles.fadeIn}`}>
			<div className={styles.authHeader}>
				<span className={styles.authTitle}>Welcome back! Sign in to your account</span>
			</div>
			<div className={styles.authContent}>
				<div className={`${styles.authFormContainer} ${styles.textCenter}`}>
					<span style={{ fontSize: '1.25rem' }} className={styles.authFormTitle}>Enter your credentials</span>
					<input
						className={styles.authInput}
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className={styles.authInput}
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className={`${styles.authButton} ${styles.authSubmitButton}`} onClick={handleSignIn}>Sign in</button>
					<div className={styles.textCenter}>
						<span className={styles.authText}>Don't have an account? <a href="/sign-up">Sign up</a></span>
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

export default SignInPage;