# Sending JUnit report to Slack

## Buildning

If you make changes, the action needs to be built and the resulting files need to be checked in.

https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github

1. `npm i -g @vercel/ncc` if you didn't already do that
2. `ncc build index.ts --license LICENSE` or `npm run build`
3. commit, push, tag 
