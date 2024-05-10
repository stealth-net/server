module.exports = input => {
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    }
  
    return input.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
}