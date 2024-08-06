import React, { useState } from 'react';
import '../../Auth.css';

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
		<div className="auth-container fade-in">
			<div className="auth-header">
				<span className="auth-title">Welcome back! Sign in to your account</span>
			</div>
			<div className="auth-content">
				<div className="auth-form-container text-center">
					<span style={{ fontSize: '1.25rem' }} className="auth-form-title">Enter your credentials</span>
					<input
						className="auth-input"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className="auth-input"
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className="auth-button auth-submit-button" onClick={handleSignIn}>Sign in</button>
					<div className="text-center">
						<span className="auth-text">Don't have an account? <a href="/sign-up">Sign up</a></span>
					</div>
				</div>
				<div className="auth-logo-container">
					<div className="auth-logo" style={{ width: '128px', height: '128px' }}></div>
					<span className="auth-logo-label">StealthNet</span>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;