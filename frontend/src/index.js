import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import MainPage from './pages/mainpage/Page';
import SignUpPage from './pages/sign-up/Page';
import SignInPage from './pages/sign-in/Page';

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