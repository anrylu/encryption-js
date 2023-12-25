import eddsa from './eddsa'

test('Generate Key Pair', () => {
    const { publicKey, privateKey } = eddsa.GeneratreKeyPair();
    expect(publicKey).not.toBe(null);
    expect(privateKey).not.toBe(null);
});

test('Sign / Verify Message', () => {
    const message = "hello world";
    const publicKeyEncoded = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUNvd0JRWURLMlZ3QXlFQTk1S2VEQ0hOTVo4Und4ckJnYVpZaDI1aHkzSXJNTGlIcnBWaDcvSHdLVE09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ==';
    const privateKeyEncoded = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUhKakVUWmZieHNDWjhPVTg4elNVU21GNFptaEs4bUtKdjQ1VVc1OXRxaEIKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==';

    // ecnrypt
    const signature = eddsa.Sign(privateKeyEncoded, message);
    expect(signature).not.toBe(null);

    // decrypt
    const isVerified = eddsa.Verify(publicKeyEncoded, message, signature)
    expect(isVerified).toBe(true);
});
