const AuthService = require('../services/AuthService');
const { hashPassword } = require('../utils/passwordUtils');

class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    /**
     * POST /api/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                const error = new Error('Email and password are required');
                error.name = 'ValidationError';
                error.status = 400;
                throw error;
            }

            const { user, token } = await this.authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/register
     */
    async register(req, res, next) {
        try {
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                const error = new Error('Username, email, and password are required');
                error.name = 'ValidationError';
                error.status = 400;
                throw error;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const error = new Error('Invalid email format');
                error.name = 'ValidationError';
                error.status = 400;
                throw error;
            }

            // Validate password strength
            if (password.length < 8) {
                const error = new Error('Password must be at least 8 characters long');
                error.name = 'ValidationError';
                error.status = 400;
                throw error;
            }

            const newUser = await this.authService.register({ username, password, email });

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();