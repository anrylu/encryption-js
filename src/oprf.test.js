import oprf from './oprf'

test('Blind message', async () => {
    const input = 'Abc123中文';
    const { blind, blindedElement } = await oprf.Blind(input);
    expect(blind).not.toBe(null);
    expect(blindedElement).not.toBe(null);
});

test('Finalize message', async () => {
    const input = 'hello world';
    const blind = 'S6uIxGmFR7hCGofTWEmkqCRlKcofD7LODtUvj/HgtgQ=';
    const evaluatedElement = 'eD9VqAUSc0IX0BGljc/JzA96RXH/eMLAVTtiB8zO9SI=';
    const output = await oprf.NewFinalize(input, blind, evaluatedElement);
    expect(output).toBe("B2PfoHp0MBH/dm3yf5/FzGVyXzb0r4CHSh9hDu2RF6+skporEs22uEeYXVYW5cXcJDsQ7wUI1miyFn+0ojJB2g==");
});

test('Blind chinese message', async () => {
    const input = 'Abc123中文';
    const { blind, blindedElement } = await oprf.Blind(input);
    expect(blind).not.toBe(null);
    expect(blindedElement).not.toBe(null);
});

test('Finalize chinese message', async () => {
    const input = 'Abc123中文';
    const blind = 'KfHIy+SKenZA0+C3E8TMkjOZa5UUOiFsy3F2csxRNww=';
    const evaluatedElement = "JA58YuQZ7lIcqzM/hWhyK2Rgi9/E5PVTOFDLgOMpg1E=";
    const output = await oprf.NewFinalize(input, blind, evaluatedElement);
    expect(output).toBe('BFTpxBN7xcag0Dk+doEpd2kkjr9c3gjygkFG5ELaB6vAFbfWR5TWdYYsCZ5pspkaZ9+oJmEynhSq2g/JT8roAw==');
});

test('Blind special message', async () => {
    const input = "Dj@NM+$iRA05Fg33B*@#bb6+-_.!~*'()#%|\\/,.;:{}[]^ˋ";
    const { blind, blindedElement } = await oprf.Blind(input);
    expect(blind).not.toBe(null);
    expect(blindedElement).not.toBe(null);
});

test('Finalize chinese message', async () => {
    const input = "Dj@NM+$iRA05Fg33B*@#bb6+-_.!~*'()#%|\\/,.;:{}[]^ˋ";
    const blind = 'ROcxpx3BscdAccDx4b5Jg/qP0gel+2ovt8QIxW1CfAs=';
    const evaluatedElement = "CBznu528F6exfklGLVMLdsyNPx3yYWLu4UQAB0B4DUc=";
    const output = await oprf.NewFinalize(input, blind, evaluatedElement);
    expect(output).toBe('18xrtIdBBxiaw1pGT8kCxrmCur0iC1Hx9f7Zord1mkh1ADvpHrCK3LNkH7pTpEjAX9E00eGxzpx4LD0jXIehUA==');
});
