

// Function to encode Uint8Array to Base64 string
function Uint8ArrayToBase64(uint8Array) {
    return btoa(String.fromCharCode(...uint8Array));
}

// Function to decode Base64 string to Uint8Array
function Base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return uint8Array;
}

function MergeUint8Array(a, b) {
    var ret = new Uint8Array(a.length + b.length);
    ret.set(a);
    ret.set(b, a.length);
    return ret;
}

module.exports = {
    Uint8ArrayToBase64,
    Base64ToUint8Array,
    MergeUint8Array,
};