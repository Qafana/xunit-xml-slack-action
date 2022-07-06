import dotenv from 'dotenv';
import * as core from '@actions/core';
import ResultsParser from './app/results-parser.js';
import SlackMessage from './app/slack-message.js';
import ActionInfo from './app/action-info.js';

dotenv.config();
let slackWebhookUrl = core.getInput("slack-webhook-url") ? core.getInput("slack-webhook-url") : process.env.SLACK_WEBHOOK_URL;
let testOutputFile = core.getInput("directory-path") ? core.getInput("directory-path") : process.env.TEST_OUTPUT_FILE;

(async () => {
  const workspacePath = process.env.GITHUB_WORKSPACE;
  const result = new ResultsParser(workspacePath + '/' + testOutputFile);
  await result.parse();
  await new SlackMessage(result).send(slackWebhookUrl, new ActionInfo());
})();