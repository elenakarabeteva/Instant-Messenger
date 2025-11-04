// src/utils/getInitials.js
export function getInitials(fullName) {
    if (!fullName)
        return "";

    const splitName = fullName.split(' ');
    
    return `${splitName?.[0][0] || ''}${splitName?.[1][0] || ''}`.toUpperCase();
}
