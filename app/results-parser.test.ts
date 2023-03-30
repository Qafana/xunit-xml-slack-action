import ResultsParser from './results-parser';

test('existing file is parsed OK', async () => {
    const result = new ResultsParser('results.xml');
    await result.parse();
    expect(result.failedTests).toBe(1);
})

test('non-existing file throws ENOENT', async () => {
    const result = new ResultsParser('foo.xml');
    try {
        await result.parse();
    } catch (e) {
        expect(e.code).toEqual('ENOENT');
    }
})

