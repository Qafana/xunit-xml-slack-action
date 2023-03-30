import ResultsParser from './results-parser';
import SlackMessage from './slack-message';
import ActionInfo from './action-info';

jest.mock('./action-info')

test('blocks created OK for OK results', async () => {
    const result = new ResultsParser('results.xml');
    await result.parse();
    const blocks = new SlackMessage(undefined).getBlocks(result, new ActionInfo());
    expect(blocks).toContain(":large_green_circle");
})

test('blocks created OK for unknown results', async () => {
    const blocks = new SlackMessage(new ResultsParser('foo.xml')).getUnknownBlocks(new ActionInfo());
    expect(blocks).toContain(":Question: *UNKNOWN RESULT:*");
})



