const asn1js = require('asn1js');

import { ExportKeyToPEM, ImportKeyFromPEM } from './utility'
import * as nacl from 'tweetnacl'
import * as naclUtil from 'tweetnacl-util'

function marshalPKIXPublicKey(key) {
    var sequence = new asn1js.Sequence({
        name: 'SubjectPublicKeyInfo',
        value: [
            new asn1js.Sequence({
                name: 'algorithm',
                value: [new asn1js.ObjectIdentifier({
                    value: '1.3.101.112'
                })],
            }),
            new asn1js.BitString({
                name: 'subjectPublicKey',
                isHexOnly: true,
                valueHex: key
            }),
        ]
    });
    return new Uint8Array(sequence.toBER(false));
}

function marshalPKCS8PrivateKey(key) {
    var sequence = new asn1js.Sequence({
        name: 'SubjectPrivateKeyInfo',
        value: [
            new asn1js.Integer({
                name: 'version',
                value: 0,
            }),
            new asn1js.Sequence({
                name: 'algorithm',
                value: [new asn1js.ObjectIdentifier({
                    value: '1.3.101.112'
                })],
            }),
            new asn1js.OctetString({
                name: 'subjectPrivateKey',
                isHexOnly: true,
                valueHex: key.subarray(0, 32)
            }),
        ]
    });
    return new Uint8Array(sequence.toBER(false));
}

function GeneratreKeyPair() {
    // Generate a new key pair
    const keyPair = nacl.sign.keyPair();

    // Extract the public and private keys
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
    const publicKeyMarshal = marshalPKIXPublicKey(publicKey);
    const privateKeyMarshal = marshalPKCS8PrivateKey(privateKey);

    // Convert the exported key to PEM format
    const publicKeyPEM = ExportKeyToPEM(publicKeyMarshal, true);
    const privateKeyPEM = ExportKeyToPEM(privateKeyMarshal, false);

    return {
        publicKey: naclUtil.encodeBase64(publicKeyPEM),
        privateKey: naclUtil.encodeBase64(privateKeyPEM),
    };
}

function convertPublicKey(keyEncoded) {
    const decoder = new TextDecoder();
    const keyPEM = decoder.decode(naclUtil.decodeBase64(keyEncoded));
    const keyBER = ImportKeyFromPEM(keyPEM);
    const keyASN1 = asn1js.fromBER(keyBER);
    const key = keyASN1.result.valueBlock.value[1].valueBlock.valueHexView;
    return key;
}

function convertPrivateKey(keyEncoded) {
    const decoder = new TextDecoder();
    const keyPEM = decoder.decode(naclUtil.decodeBase64(keyEncoded));
    const keyBER = ImportKeyFromPEM(keyPEM);
    const keyASN1 = asn1js.fromBER(keyBER);
    const keySeed = keyASN1.result.valueBlock.value[2].valueBlock.value[0].valueBlock.valueHexView;
    const keyPair = nacl.sign.keyPair.fromSeed(keySeed);
    return keyPair.secretKey;
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
