import eddsa from './eddsa'

test('Generate Key Pair', () => {
    const { publicKey, privateKey } = eddsa.GeneratreKeyPair();
    expect(publicKey).not.toBe(null);
    expect(privateKey).not.toBe(null);
});

test('Sign / Verify Message', () => {
    const message = "hello world";
    const publicKeyEncoded = '531GyCmrCKs7HB333J3uUuRBsApNcjy+7HgtE98b0+M=';
    const privateKeyEncoded = 'zxjkRWH3Bh2zLoSjhpZrNzxsvLJOSmHRA5oR6n6CrcjnfUbIKasIqzscHffcne5S5EGwCk1yPL7seC0T3xvT4w==';

    // ecnrypt
    const signature = eddsa.Sign(privateKeyEncoded, message);
    expect(signature).not.toBe(null);

    // decrypt
    const isVerified = eddsa.Verify(publicKeyEncoded, message, signature)
    expect(isVerified).toBe(true);
});
