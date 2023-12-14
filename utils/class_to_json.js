function class_to_json(obj) {
    const jsonObj = {};
    
    for(let key in obj) {
        if(typeof obj[key] !== "function") {
            jsonObj[key] = obj[key];
        };
    };
    
    return jsonObj;
};

module.exports = class_to_json;