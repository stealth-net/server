function gen_uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function gen_token(userID) {
    return btoa(userID) + '.' + btoa(Date.now()) + '.' + btoa(gen_uuid());
}

module.exports = gen_token;