/**
 * Sends a response status based on a condition.
 * @param {Object} res - The response object.
 * @param {boolean} condition - The condition to check.
 * @param {number} statusCode - The HTTP status code to send if the condition is true.
 * @param {string} message - Optional message to send with the response.
 */
function sendStatusIf(res, condition, statusCode, message = '') {
    if (condition) {
        res.status(statusCode).send(message || getStatusMessage(statusCode));
        return true;
    }
    return false;
}

/**
 * Gets the status message for a given status code.
 * @param {number} statusCode - The HTTP status code.
 * @returns {string} - The status message.
 */
function getStatusMessage(statusCode) {
    const statusMessages = {
        401: 'Unauthorized',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error'
    };
    return statusMessages[statusCode] || '';
}

module.exports = sendStatusIf;