const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { comparePassword, hashPassword } = require('../utils/passwordUtils');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Registers a new user.
     * @param {Object} userData - Data for creating a new user.
     * @param {string} userData.username - The username.
     * @param {string} userData.password - The password.
     * @param {string} userData.email - The email address.
     * @returns {Promise<Object>} The newly created user.
     */
    async register(userData) {
        // Check if username already exists
        const existingUser = await this.userRepository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        const existingEmail = await this.userRepository.findByEmail(userData.email);
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        // Hash the user's password
        const hashedPassword = await hashPassword(userData.password);

        // Create new user in the database
        const newUser = await this.userRepository.createUser({
            ...userData,
            password: hashedPassword,
        });

        return newUser;
    }

    /**
     * Logs in a user.
     * @param {string} email - The email.
     * @param {string} password - The password.
     * @returns {Promise<Object>} The user and an authentication token.
     */
    async login(email, password) {
        // Find the user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Compare the password with the stored hash
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        // Generate a JWT token (using a secret key from env or config)
        const token = this.generateToken(user.id);

        // Return the user object (excluding sensitive info) and the token
        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    /**
     * Generates a JWT token.
     * @param {string} userId - The user's ID.
     * @returns {string} The JWT token.
     */
    generateToken(userId) {
        // Secret key should be stored in environment variables for security
        const secretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret';
        const expiresIn = '24h'; // Token expiration time (1 day)

        return jwt.sign({ userId }, secretKey, { expiresIn });
    }

    /**
     * Sanitize user object (remove sensitive information like password).
     * @param {Object} user - The user object.
     * @returns {Object} The sanitized user object.
     */
    sanitizeUser(user) {
        const sanitizedUser = { ...user };
        delete sanitizedUser.password;
        return sanitizedUser;
    }
}

module.exports = AuthService;