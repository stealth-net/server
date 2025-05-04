const { db } = require('../config/db');

class UserRepository {
    constructor() {
        this.tableName = 'users';
    }

    /**
     * Find a user by their username
     * @param {string} username - The username to search for
     * @returns {Promise<Object|null>} The user object or null if not found
     */
    async findByUsername(username) {
        try {
            return await db(this.tableName)
                .where({ username })
                .first();
        } catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }

    /**
     * Find a user by their email
     * @param {string} email - The email to search for
     * @returns {Promise<Object|null>} The user object or null if not found
     */
    async findByEmail(email) {
        try {
            return await db(this.tableName)
                .where({ email })
                .first();
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - The user data to insert
     * @param {string} userData.username - The username
     * @param {string} userData.email - The email
     * @param {string} userData.password - The hashed password
     * @returns {Promise<Object>} The created user object
     */
    async createUser(userData) {
        try {
            const [userId] = await db(this.tableName).insert({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                created_at: new Date()
            });

            return this.findById(userId);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    /**
     * Find a user by their ID
     * @param {number} id - The user ID
     * @returns {Promise<Object|null>} The user object or null if not found
     */
    async findById(id) {
        try {
            return await db(this.tableName)
                .where({ id })
                .first();
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    /**
     * Update a user's information
     * @param {number} id - The user ID
     * @param {Object} updateData - The data to update
     * @returns {Promise<Object>} The updated user object
     */
    async updateUser(id, updateData) {
        try {
            await db(this.tableName)
                .where({ id })
                .update(updateData);

            return this.findById(id);
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    /**
     * Delete a user
     * @param {number} id - The user ID
     * @returns {Promise<boolean>} True if deleted successfully
     */
    async deleteUser(id) {
        try {
            const deleted = await db(this.tableName)
                .where({ id })
                .delete();
            
            return deleted > 0;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    /**
     * Get all users with pagination
     * @param {number} page - The page number
     * @param {number} limit - The number of items per page
     * @returns {Promise<Object>} Object containing users and pagination info
     */
    async getAllUsers(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const [users, total] = await Promise.all([
                db(this.tableName)
                    .select('id', 'username', 'email', 'created_at')
                    .offset(offset)
                    .limit(limit),
                db(this.tableName).count('* as total').first()
            ]);

            return {
                users,
                pagination: {
                    total: total.total,
                    page,
                    limit,
                    totalPages: Math.ceil(total.total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error getting users: ${error.message}`);
        }
    }
}

module.exports = UserRepository;