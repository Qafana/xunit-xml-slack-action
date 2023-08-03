import ActionInfo from "./action-info";


export default function noResultsSlackMessage(actionInfo: ActionInfo, title: string, text: string): object {
  const noResultBlocks: string = getBlocks(actionInfo, title, text);
  return {
    text: `${actionInfo.workflowName} - ${title}`,
    blocks: JSON.parse(noResultBlocks)
  }
}

function getBlocks(actionInfo: ActionInfo, title: string, text: string): string {
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
            "text": ":Question: *${title}:* ${text}"
        }
    },
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

