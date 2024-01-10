import slackMessage from './slack-message';

jest.mock('./action-info')

test('message object created for success step', async () => {
    const message = await slackMessage("success", "./app/results-all-ok.xml");
    expect(message).toHaveProperty("text", "undefined - Passed");
    expect(message).toHaveProperty("blocks");
})

test('message object created for failure step', async () => {
    const message = await slackMessage("failure", "./app/results-with-failure-and-skipped.xml");
    expect(message).toHaveProperty("text", "undefined - Failed");
    expect(message).toHaveProperty("blocks");
})

test('message object created for missing result file', async () => {
    const message = await slackMessage("failure", "foo.xml");
    expect(message).toHaveProperty("text", "undefined - NO TEST RESULT");
    expect(message).toHaveProperty("blocks");
})

test('message object created for cancelled step', async () => {
    const message = await slackMessage("cancelled", "./app/results-all-ok.xml");
    expect(message).toHaveProperty("text", "undefined - TEST NOT FINISHED");
    expect(message).toHaveProperty("blocks");
})

test('message object created for skipped step', async () => {
    const message = await slackMessage("skipped", "./app/results-all-ok.xml");
    expect(message).toHaveProperty("text", "undefined - TEST NOT FINISHED");
    expect(message).toHaveProperty("blocks");
})

test('message object created for missing step outcome', async () => {
    const message = await slackMessage(null, "./app/results-all-ok.xml");
    expect(message).toHaveProperty("text", "undefined - UNKNOWN RESULT");
    expect(message).toHaveProperty("blocks");
})







