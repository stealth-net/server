import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainPage from './pages/Mainpage_View';
import SignUpPage from './pages/SignUp_View';
import SignInPage from './pages/SignIn_View';

// Protected Route component
const ProtectedRoute = ({ children }) => {
	const token = Cookies.get('token');
	if (!token) {
		return <Navigate to="/sign-in" replace />;
	}
	return children;
};

// Public Route component (redirects to main if already logged in)
const PublicRoute = ({ children }) => {
	const token = Cookies.get('token');
	if (token) {
		return <Navigate to="/" replace />;
	}
	return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/sign-in" element={<PublicRoute><SignInPage /></PublicRoute>} />
        <Route path="/sign-up" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      </Routes>
    </Router>
  );
}

export default App;