import { Uint8ArrayToBase64, Base64ToUint8Array, ExportKeyToPEM, ImportKeyFromPEM } from './utility'

async function GeneratreKeyPair() {
    // Generate an RSA key pair
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: 'SHA-256',    
        },
        true, // Can extract private key
        ['encrypt', 'decrypt'] // Use the key for encryption/decryption
    );

    // Export the key as PKCS#8 format
    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    // Convert the exported key to PEM format
    const publicKeyPEM = ExportKeyToPEM(publicKey, true);
    const privateKeyPEM = ExportKeyToPEM(privateKey, false);

    const encoder = new TextEncoder();
    return {
        publicKey: Uint8ArrayToBase64(encoder.encode(publicKeyPEM)),
        privateKey: Uint8ArrayToBase64(encoder.encode(privateKeyPEM)),
    };
}

async function convertPublicKey(publicKeyEncoded) {
    const decoder = new TextDecoder();
    const publicKeyPEM = decoder.decode(Base64ToUint8Array(publicKeyEncoded));
    const keyData = ImportKeyFromPEM(publicKeyPEM);
    return await crypto.subtle.importKey('spki', keyData.buffer, { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }, true, ['encrypt']);
}

async function convertPrivateKey(privateKeyEncoded) {
    const decoder = new TextDecoder();
    const privateKeyPEM = decoder.decode(Base64ToUint8Array(privateKeyEncoded));
    const keyData = ImportKeyFromPEM(privateKeyPEM);
    return await crypto.subtle.importKey('pkcs8', keyData.buffer, { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }, true, ['decrypt']);
}

async function EncryptMessage(publicKeyEncoded, msg) {
    const publicKey = await convertPublicKey(publicKeyEncoded);
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const ciphertext = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
    return Uint8ArrayToBase64(new Uint8Array(ciphertext));
}

async function DecryptMessage(privateKeyEncoded, ciphertext) {
    const privateKey = await convertPrivateKey(privateKeyEncoded);
    const ciphertextBuffer = Base64ToUint8Array(ciphertext);
    const decryptedData = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        ciphertextBuffer
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

export default {
    GeneratreKeyPair,
    EncryptMessage,
    DecryptMessage,
};
