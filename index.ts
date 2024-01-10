import dotenv from 'dotenv';
import * as core from '@actions/core';
import {IncomingWebhook} from "@slack/webhook";
import slackMessage from "./app/slack-message.js";


dotenv.config();
let testStepOutcome = core.getInput("test-step-outcome");
let slackWebhookUrl = core.getInput("slack-webhook-url") ? core.getInput("slack-webhook-url") : process.env.SLACK_WEBHOOK_URL;
let testOutputFile = core.getInput("directory-path") ? core.getInput("directory-path") : process.env.TEST_OUTPUT_FILE;


(async () => {
  const workspacePath = process.env.GITHUB_WORKSPACE;
  const filePath = workspacePath + '/' + testOutputFile
  const message = await slackMessage(testStepOutcome, filePath);
  const webhook = new IncomingWebhook(slackWebhookUrl);
  await webhook.send(message);
})();