import { Uint8ArrayToBase64, Base64ToUint8Array, ExportKeyToPEM } from './utility'
import * as nacl from 'tweetnacl'
import * as naclUtil from 'tweetnacl-util'

function GeneratreKeyPair() {
    // Generate a new key pair
    const keyPair = nacl.sign.keyPair();

    // Extract the public and private keys
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
    return {
        publicKey: naclUtil.encodeBase64(publicKey),
        privateKey: naclUtil.encodeBase64(privateKey),
    };
}

function convertPublicKey(publicKeyEncoded) {
    return naclUtil.decodeBase64(publicKeyEncoded);
}

function convertPrivateKey(privateKeyEncoded) {
    return naclUtil.decodeBase64(privateKeyEncoded);
}

function Sign(privateKeyEncoded, msg) {
    const privateKey = convertPrivateKey(privateKeyEncoded);
    const signature = nacl.sign.detached(naclUtil.decodeUTF8(msg), privateKey);
    return naclUtil.encodeBase64(signature);
}

function Verify(publicKeyEncoded, msg, signature) {
    const publicKey = convertPublicKey(publicKeyEncoded);
    const isVerified = nacl.sign.detached.verify(
        naclUtil.decodeUTF8(msg),
        naclUtil.decodeBase64(signature),
        publicKey);
    return isVerified;
}

export default {
    GeneratreKeyPair,
    Sign,
    Verify,
};
