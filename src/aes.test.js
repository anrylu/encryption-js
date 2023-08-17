import aes from './aes';

test('Encrypt/Decrypt message', async () => {
    const passphrase = 'pass';
    const message = 'hello world';

    const ciphertext = await aes.EncryptMessage(passphrase, message);
    expect(ciphertext).not.toBe(null);
    const decrypttext = await aes.DecryptMessage(passphrase, ciphertext);
    expect(decrypttext).toBe(message);
});
