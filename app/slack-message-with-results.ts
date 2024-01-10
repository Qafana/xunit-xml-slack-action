import ActionInfo from './action-info';
import ResultsParser from './results-parser';


export default function withResultSlackMessage(actionInfo: ActionInfo, testResults: ResultsParser): object {
  const resultBlocks = getBlocks(testResults, actionInfo);
  return {
    text: `${actionInfo.workflowName} - ${testResults.failedTests > 0 ? "Failed" : "Passed"}`,
    blocks: JSON.parse(resultBlocks)
  }
}


function getFailedTestsSections(failed, failedTestsList: string[]): string {
  const template = (testName: string, isFailed: boolean) => `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "${isFailed ? ":red_circle: " + testName : ":tada: *ALL PASSED*"} "
        }
    },`;
  if (!failed) {
    return template("", false);
  } else {
    return failedTestsList.map(testName => template(testName, true)).join("\n");
  }
}

function getOverralTestsSection(passedTests, skippedTests, failedTests): string {
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


function getBlocks(testResults: ResultsParser, actionInfo: ActionInfo): string {
  const failedTests = testResults.failedTests;
  const skippedTests = testResults.skippedTests;
  const passedTests = testResults.passedTests;
  const failedTestsList = testResults.failedTestsList;
  const failed = failedTests > 0;
  const failedTestsSections = getFailedTestsSections(failed, failedTestsList);
  const overralTestsSection = getOverralTestsSection(passedTests, skippedTests, failedTests);
  return `
  [
    {
        "type": "context",
        "elements": [
            {
                "type": "plain_text",
                "text": "Workflow: ${actionInfo.workflowName} :: Step: ${actionInfo.stepId}",
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
  `;
}
