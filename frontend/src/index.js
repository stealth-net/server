import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import MainPage from './pages/Mainpage_View';
import SignUpPage from './pages/SignUp_View';
import SignInPage from './pages/SignIn_View';

const root = ReactDOM.createRoot(document.getElementById('root'));

const isAuthenticated = document.cookie.includes('token');

root.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/sign-in" />} />
				<Route path="/sign-up" element={<SignUpPage />} />
				<Route path="/sign-in" element={<SignInPage />} />
			</Routes>
		</Router>
	</React.StrictMode>
);