const { comparePassword } = require('../utils/passwordUtils');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.displayName = data.displayName;
        this.createdAt = data.createdAt;
        this._repository = null;
    }

    /**
     * Get the display name (username if displayName is not set)
     */
    get display() {
        return this.displayName || this.username;
    }

    /**
     * Static method to login a user
     * @param {string} username - The username
     * @param {string} password - The password
     * @param {UserRepository} repository - The user repository instance
     * @returns {Promise<User>} The user instance if login successful
     */
    static async login(username, password, repository) {
        const userData = await repository.findByUsername(username);
        if (!userData) {
            throw new Error('User not found');
        }

        const passwordMatch = await comparePassword(password, userData.password);
        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        const user = new User(userData);
        user._repository = repository;
        return user;
    }

    /**
     * Send a friend request to another user
     * @param {string} targetUserId - The ID of the user to send the request to
     * @returns {Promise<Object>} The created friend request
     */
    async sendFriendRequest(targetUserId) {
        if (!this._repository) {
            throw new Error('User instance not properly initialized with repository');
        }

        // Check if request already exists
        const existingRequest = await this._repository.findFriendRequest(this.id, targetUserId);
        if (existingRequest) {
            throw new Error('Friend request already sent');
        }

        // Create the friend request
        return await this._repository.createFriendRequest({
            senderId: this.id,
            receiverId: targetUserId,
            status: 'pending',
            createdAt: new Date()
        });
    }

    /**
     * Accept a friend request
     * @param {string} requestId - The ID of the friend request
     * @returns {Promise<Object>} The updated friend request
     */
    async acceptFriendRequest(requestId) {
        if (!this._repository) {
            throw new Error('User instance not properly initialized with repository');
        }

        const request = await this._repository.findFriendRequestById(requestId);
        if (!request) {
            throw new Error('Friend request not found');
        }

        if (request.receiverId !== this.id) {
            throw new Error('Not authorized to accept this request');
        }

        return await this._repository.updateFriendRequest(requestId, {
            status: 'accepted',
            updatedAt: new Date()
        });
    }

    /**
     * Get all friend requests for this user
     * @returns {Promise<Array>} Array of friend requests
     */
    async getFriendRequests() {
        if (!this._repository) {
            throw new Error('User instance not properly initialized with repository');
        }

        return await this._repository.findFriendRequestsByUserId(this.id);
    }

    /**
     * Get all friends of this user
     * @returns {Promise<Array>} Array of friend users
     */
    async getFriends() {
        if (!this._repository) {
            throw new Error('User instance not properly initialized with repository');
        }

        return await this._repository.findFriendsByUserId(this.id);
    }

    /**
     * Update user's display name
     * @param {string} newDisplayName - The new display name
     * @returns {Promise<User>} Updated user instance
     */
    async updateDisplayName(newDisplayName) {
        if (!this._repository) {
            throw new Error('User instance not properly initialized with repository');
        }

        const updatedUser = await this._repository.updateUser(this.id, {
            displayName: newDisplayName
        });

        this.displayName = newDisplayName;
        return this;
    }

    /**
     * Convert user to JSON object
     * @returns {Object} User data without sensitive information
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            displayName: this.displayName,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;