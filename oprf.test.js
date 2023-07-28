const { Blind, Finalize } = require('./oprf.js');

test('Blind message', async () => {
    const input = 'hello world';
    const { blind, blindedElement } = await Blind(input);
    expect(blind).not.toBe(null);
    expect(blindedElement).not.toBe(null);
});

test('Finalize message', async () => {
    const input = 'hello world';
    const blind = 'Apu+5ldgdOk9GrxPIooEUqwisheu3eiUnCOHrBJqbwk=';
    const evaluatedElement = 'dJq8XkfYMW9OqfF0ROOT4e3nU+9PM1ULm0Dub592uTY=';
    const output = await Finalize(input, blind, evaluatedElement);
    expect(output).toBe("dPAgCD9dSD4swG+FrV9EOOXnsORWXynFrBwwVVZ6IwsoXHcuT5ejoblcxw+MiJ9a7OnYXgC4egyDZQSajOet8Q==");
});
