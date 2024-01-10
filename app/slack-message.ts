import ActionInfo from "./action-info";
import ResultsParser from "./results-parser";
import withResultSlackMessage from "./slack-message-with-results";
import noResultsSlackMessage from "./slack-message-no-results";


export default async function slackMessage(testStepOutcome: string, filePath: string) {
  const actionInfo: ActionInfo = new ActionInfo();
  switch (testStepOutcome) {
    case "success":
    case "failure":
      const result = new ResultsParser(filePath);
      try {
        await result.parse();
        return withResultSlackMessage(actionInfo, result);
      } catch (e) {
        return noResultsSlackMessage(actionInfo,
          'NO TEST RESULT',
          'No test result was found, check the Action for more info.');
      }

    case "cancelled":
    case "skipped":
      return noResultsSlackMessage(actionInfo,
        'TEST NOT FINISHED',
        `The test was ${testStepOutcome}, check the Action for more info.`);

    default:
      return noResultsSlackMessage(actionInfo,
        'UNKNOWN RESULT',
        'Check the Action for more info.');
  }
}
