import eddsa from './eddsa'

test('Generate Key Pair', () => {
    const { publicKey, privateKey } = eddsa.GeneratreKeyPair();
    expect(publicKey).not.toBe(null);
    expect(privateKey).not.toBe(null);
});

test('Sign / Verify Message', () => {
    const message = "hello world";
    const publicKeyEncoded = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUNvd0JRWURLMlZ3QXlFQXdtdDBtdDJyZVJiakxUWTRFUXNNMmR6YXlvL0p1NzBEVkRPbUU2V1RSYzg9Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=';
    const privateKeyEncoded = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUUzWnFUZ0VqQzBXYlU2ZFpWNFRXTVBJSkFpVHpBYXZPL0k1Y1d0VFh3KzkKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQo=';

    // ecnrypt
    const signature = eddsa.Sign(privateKeyEncoded, message);
    expect(signature).not.toBe(null);

    // decrypt
    const isVerified = eddsa.Verify(publicKeyEncoded, message, signature)
    expect(isVerified).toBe(true);
});
