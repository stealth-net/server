module.exports = req => {
    return (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0].replace('::ffff:', '');
}

// This may not typically be utilized in a coding environment.