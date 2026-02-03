function invalidParameter(param) {
    
    const emptyEntries = Object.entries(param).filter(([key, value]) => value === undefined || value === null || value === '');
    if (emptyEntries.length > 0) {
        const emptyKeys = emptyEntries.map(([key, _]) => key);
        return {
            isValid: false,
            message: `Invalid parameters: ${emptyKeys.join(', ')} cannot be empty.`
        };
    }
    return { isValid: true };
}

module.exports = invalidParameter;