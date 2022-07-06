//@ts-check
import { IncomingWebhook } from '@slack/webhook';
import ActionInfo from './action-info';
import ResultsParser from './results-parser';

export default class SlackMessage {
  testResults: ResultsParser;
  constructor(testResults: ResultsParser) {
    this.testResults = testResults;
  }

  async send(slackWebhookUrl: string, actionInfo: ActionInfo): Promise<void> {
    const webhook = new IncomingWebhook(slackWebhookUrl);
    const blocks = this.getBlocks(this.testResults, actionInfo);
    await webhook.send({ text: `${actionInfo.workflowName} - ${this.testResults.failedTests > 0 ? "Failed": "Passed"}`, blocks: JSON.parse(blocks) });
  }

  private getFailedTestsSections(failed, failedTestsList: string[]): string {
    const template = (testName: string, isFailed: boolean) =>  `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "${isFailed ? ":red_circle: " + testName : ":tada: *ALL PASSED*"} "
        }
    },`;
    if (!failed) {
        return template("", false);
    }
    else{
        return failedTestsList.map(testName => template(testName, true)).join("\n");
    }
  }

  private getOverralTestsSection(passedTests, skippedTests, failedTests): string {
    const passedSubstring = passedTests > 0 ? `:large_green_circle: *PASSED: ${passedTests}*` : "";
    const failedSubstring = failedTests > 0 ? `:red_circle: *FAILED: ${failedTests}*` : "";
    const skippedSubstring = skippedTests > 0 ? `:white_circle: *SKIPPED: ${skippedTests}*` : "";
    const template = (passedTests, skippedTests, failedTests) => `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "${passedSubstring} ${failedSubstring} ${skippedSubstring}"
        }
    },`;
    return template(passedTests, skippedTests, failedTests);
    
}

  getBlocks(testResults: ResultsParser, actionInfo: ActionInfo): string {
    const failedTests = testResults.failedTests;
    const skippedTests = testResults.skippedTests;
    const passedTests = testResults.passedTests;
    const failedTestsList = testResults.failedTestsList;
    const failed = failedTests > 0;
    const failedTestsSections = this.getFailedTestsSections(failed, failedTestsList);
    const overralTestsSection = this.getOverralTestsSection(passedTests, skippedTests, failedTests);
  const nesta = `
  [
    {
        "type": "context",
        "elements": [
            {
                "type": "plain_text",
                "text": "Action: ${actionInfo.workflowName}",
                "emoji": true
            }
        ]
    },
    {
        "type": "divider"
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": ":clock1: *Execution time:* ${testResults.executionTime}"
        }
    },
    ${overralTestsSection}
    {
        "type": "divider"
    },
    ${failedTestsSections}
    {
        "type": "divider"
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Go to Action",
                    "emoji": true
                },
                "value": "action_go",
                "url": "${actionInfo.runUrl}"
            }
        ]
    }
]
  `
  return nesta;
    }
}