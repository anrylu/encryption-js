const { EncryptMessage, DecryptMessage } = require('./aes.js');

test('Encrypt/Decrypt message', async () => {
    const passphrase = 'pass';
    const message = 'hello world';

    const ciphertext = await EncryptMessage(passphrase, message);
    expect(ciphertext).not.toBe(null);
    const decrypttext = await DecryptMessage(passphrase, ciphertext);
    expect(decrypttext).toBe(message);
});
