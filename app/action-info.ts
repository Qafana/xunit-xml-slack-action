
import * as github from '@actions/github';

export default class ActionInfo{
    workflowName: string;
    runUrl: string;
    buildUrl: string;
    constructor(){
        this.workflowName = github.context.workflow;
        this.runUrl = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`;
        this.buildUrl = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/runs/${github.context.runNumber}`;
    }
}