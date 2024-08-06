import React, { useState } from 'react';
import '../../Auth.css';

const SignUpPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignUp = () => {
		if (username === '' || email === '' || password === '') return;
		fetch("/auth-api/v1/sign-up", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password })
		}).then(response => {
			if (response.ok) {
				window.location.pathname = '/';
			} else {
				alert('Sign up failed. Please check your information and try again.');
			}
		}).catch(error => {
			console.error('Error during sign up:', error);
			alert('An error occurred. Please try again later.');
		});
	};

	return (
		<div className="auth-container fade-in">
			<div className="auth-header">
				<span className="auth-title">Welcome! Create an account</span>
			</div>
			<div className="auth-content">
				<div className="auth-form-container text-center">
					<span style={{ fontSize: '1.25rem' }} className="auth-form-title">Enter your account information</span>
					<input
						className="auth-input"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
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
					<button className="auth-button auth-submit-button" onClick={handleSignUp}>Sign-up</button>
					<div className="text-center">
						<span className="auth-text">Already have an account? <a href="/login">Log in</a></span>
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

export default SignUpPage;