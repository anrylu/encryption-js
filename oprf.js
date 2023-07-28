const OPRF = require('oprf');

// Function to encode Uint8Array to Base64 string
function uint8ArrayToBase64(uint8Array) {
    return btoa(String.fromCharCode(...uint8Array));
}

// Function to decode Base64 string to Uint8Array
function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return uint8Array;
}

async function sha512Hash(uint8Array) {
    const buffer = await crypto.subtle.digest('SHA-512', uint8Array);
    return new Uint8Array(buffer);
}

function mergeUint8Array(a, b) {
    var ret = new Uint8Array(a.length + b.length);
    ret.set(a);
    ret.set(b, a.length);
    return ret;
}

async function expandMessage(input) {
    // calculate b0
    const zPad = new Uint8Array(128);
    const libStr = new Uint8Array([0, 64]);
    const dstPrime = new Uint8Array([
        72, 97, 115, 104, 84, 111, 71, 114, 111, 117,
        112, 45, 79, 80, 82, 70, 86, 49, 45, 0,
        45, 114, 105, 115, 116, 114, 101, 116, 116, 111,
        50, 53, 53, 45, 83, 72, 65, 53, 49, 50,
        40]);
    let b0Src = mergeUint8Array(zPad, new TextEncoder().encode(input));
    b0Src = mergeUint8Array(b0Src, libStr);
    b0Src = mergeUint8Array(b0Src, new Uint8Array([0]));
    b0Src = mergeUint8Array(b0Src, dstPrime);
    b0 = await sha512Hash(b0Src);

    // calculate bi
    let biSrc = mergeUint8Array(b0, new Uint8Array([1]))
    biSrc = mergeUint8Array(biSrc, dstPrime);
    bi = await sha512Hash(biSrc)

    return bi;
}

// Assuming 'input' is the input value from the client
async function Blind(input) {
    const oprf = new OPRF();
    await oprf.ready;

    // hash to point
    const hash = await expandMessage(input)
    const point = oprf.sodium.crypto_core_ristretto255_from_hash(hash);

    // mask point
    const masked = oprf.maskPoint(point);
    const blindedElement = uint8ArrayToBase64(masked.point);
    const blind = uint8ArrayToBase64(masked.mask);
    return { blind, blindedElement };
}
  
// Assuming 'evaluatedElement' is the processed value by the server
async function Finalize(input, blind, evaluatedElement) {
    const oprf = new OPRF();
    await oprf.ready;

    // process inpput
    evaluatedElement = base64ToUint8Array(evaluatedElement);
    blind = base64ToUint8Array(blind);

    // unblind
    const unblindedElement = oprf.unmaskPoint(evaluatedElement, blind);
    const finalizeDST = new Uint8Array([70, 105, 110, 97, 108, 105, 122, 101]);

    // hash
    let hashInput = mergeUint8Array(new Uint8Array([input.length>>8, input.length&0xFF]), new TextEncoder().encode(input));
    hashInput = mergeUint8Array(hashInput, new Uint8Array([0, 32]));
    hashInput = mergeUint8Array(hashInput, unblindedElement);
    hashInput = mergeUint8Array(hashInput, finalizeDST);
    const hash = await sha512Hash(hashInput);

    return uint8ArrayToBase64(hash);
}

module.exports = {
    Blind,
    Finalize,
};
