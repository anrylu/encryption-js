const OPRF = require('oprf');
const {Uint8ArrayToBase64, Base64ToUint8Array, MergeUint8Array} = require('./utility.js');

async function sha512Hash(uint8Array) {
    const buffer = await crypto.subtle.digest('SHA-512', uint8Array);
    return new Uint8Array(buffer);
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
    let b0Src = MergeUint8Array(zPad, new TextEncoder().encode(input));
    b0Src = MergeUint8Array(b0Src, libStr);
    b0Src = MergeUint8Array(b0Src, new Uint8Array([0]));
    b0Src = MergeUint8Array(b0Src, dstPrime);
    b0 = await sha512Hash(b0Src);

    // calculate bi
    let biSrc = MergeUint8Array(b0, new Uint8Array([1]))
    biSrc = MergeUint8Array(biSrc, dstPrime);
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
    const blindedElement = Uint8ArrayToBase64(masked.point);
    const blind = Uint8ArrayToBase64(masked.mask);
    return { blind, blindedElement };
}
  
// Assuming 'evaluatedElement' is the processed value by the server
async function Finalize(input, blind, evaluatedElement) {
    const oprf = new OPRF();
    await oprf.ready;

    // process inpput
    evaluatedElement = Base64ToUint8Array(evaluatedElement);
    blind = Base64ToUint8Array(blind);

    // unblind
    const unblindedElement = oprf.unmaskPoint(evaluatedElement, blind);
    const finalizeDST = new Uint8Array([70, 105, 110, 97, 108, 105, 122, 101]);

    // hash
    let hashInput = MergeUint8Array(new Uint8Array([input.length>>8, input.length&0xFF]), new TextEncoder().encode(input));
    hashInput = MergeUint8Array(hashInput, new Uint8Array([0, 32]));
    hashInput = MergeUint8Array(hashInput, unblindedElement);
    hashInput = MergeUint8Array(hashInput, finalizeDST);
    const hash = await sha512Hash(hashInput);

    return Uint8ArrayToBase64(hash);
}

module.exports = {
    Blind,
    Finalize,
};
