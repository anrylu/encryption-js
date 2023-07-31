const {Uint8ArrayToBase64, Base64ToUint8Array, MergeUint8Array} = require('./utility.js');

async function generateKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 10000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function stringToAESKey(passphrase, salt) {
    if( !salt ) {
        salt = crypto.getRandomValues(new Uint8Array(16));
    }
    const key = await generateKey(passphrase, salt);
    return {key, salt};
}

async function EncryptMessage(passphrase, msg) {
	// derive key
	const { key, salt } = await stringToAESKey(passphrase, null)

	// Generate a random nonce (IV) for GCM mode
    const nonce = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the plaintext using AES-GCM
    const encodedMessage = new TextEncoder().encode(msg);
    const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: nonce },
        key,
        encodedMessage
    );
    const ret = MergeUint8Array(
        MergeUint8Array(salt, nonce),
        new Uint8Array(ciphertextBuffer));
  
    return Uint8ArrayToBase64(ret);
}

async function DecryptMessage(passphrase, ciphertext) {
    const totalBuffer = Base64ToUint8Array(ciphertext);
    const salt = totalBuffer.subarray(0, 16);
    const nonce = totalBuffer.subarray(16, 28);
    const ciphertextBuffer = totalBuffer.subarray(28);

	// derive key
	const { key, _ } = await stringToAESKey(passphrase, salt);

    // decrypt
    const decryptedMessageBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      key,
      ciphertextBuffer
    );

    return new TextDecoder().decode(decryptedMessageBuffer);
}

module.exports = {
    EncryptMessage,
    DecryptMessage,
};