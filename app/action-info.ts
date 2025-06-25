import * as github from "@actions/github";

export default class ActionInfo {
  workflowName: string;
  stepId: string;
  runUrl: string;
  buildUrl: string;
  additionalActionName: string;
  additionalActionUrl: string;
  constructor(additionalActionName: string, additionalActionUrl: string) {
    this.workflowName = github.context.workflow;
    this.stepId = github.context.action;
    this.runUrl = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`;
    this.buildUrl = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/runs/${github.context.runNumber}`;
    this.additionalActionName = additionalActionName;
    this.additionalActionUrl = additionalActionUrl;
  }
}
