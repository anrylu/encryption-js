// Function to encode Uint8Array to Base64 string
export function Uint8ArrayToBase64(uint8Array) {
    return btoa(String.fromCharCode(...uint8Array));
}

// Function to decode Base64 string to Uint8Array
export function Base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return uint8Array;
}

export function MergeUint8Array(a, b) {
    var ret = new Uint8Array(a.length + b.length);
    ret.set(a);
    ret.set(b, a.length);
    return ret;
}

export function ExportKeyToPEM(key, isPublic) {
    const exportedKeyBuffer = new Uint8Array(key);
    const exportedKeyBase64 = Uint8ArrayToBase64(exportedKeyBuffer);
    const tag = isPublic? "PUBLIC" : "PRIVATE";
    const pemHeader = '-----BEGIN ' + tag + ' KEY-----\n';
    const pemFooter = '\n-----END ' + tag + ' KEY-----\n';

    return pemHeader + exportedKeyBase64.match(/.{1,64}/g).join('\n') + pemFooter;
}

export function ImportKeyFromPEM(data) {
    return Base64ToUint8Array(
        data.replace(/-----BEGIN .*?-----|-----END .*?-----|[\r\n]/g, ''));
}