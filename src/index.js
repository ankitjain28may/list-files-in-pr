const { Octokit } = require("@octokit/core");
const { context } = require("@actions/github");
const { setOutput, setFailed } = require("@actions/core");
const inputHelper = require("./input-helper");

const QUERY = `query($cursor:String, $owner: String!, $repo: String!, $pr_number: Int!)
{
  repository(name: $repo, owner: $owner) {
    pullRequest(number: $pr_number) {
      files(first: 100, after:$cursor) {
        nodes {
          path
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}
`;

if (context.eventName != "pull_request") {
  throw new Error(
    `This is currently enabled for 'pull_request' type of events`
  );
}

const params = {
  owner: inputHelper.owner,
  repo: inputHelper.repo,
  pr_number: inputHelper.pull_request_no,
};

const pullRequestFiles = [];
let pullRequestFilesFormat = "";
const octokit = new Octokit(inputHelper.github);

async function fetchFilesFromPR(octokit, { results, cursor } = { results: [] }) {
  params.cursor = cursor
  const { repository: { pullRequest }} = await octokit.graphql(QUERY, params);
  results.push(...pullRequest.files.nodes);
  if (pullRequest.files.pageInfo.hasNextPage) {
    await fetchFilesFromPR(octokit, {
      results,
      cursor: pullRequest.files.pageInfo.endCursor,
    });
  }
  return results;
}

fetchFilesFromPR(octokit)
  .then(function (result) {
    result.forEach((element) => {
      pullRequestFiles.push(element.path);
    });

    switch (inputHelper.outputFormat) {
      case "space-delimited":
        pullRequestFilesFormat = pullRequestFiles.join(" ");
        break;
      case "csv":
        pullRequestFilesFormat = pullRequestFiles.join(",");
        break;
      case "new-line":
        pullRequestFilesFormat = pullRequestFiles.join("\\n");
        break;
      case "json":
        pullRequestFilesFormat = JSON.stringify(pullRequestFiles);
        break;
    }
    setOutput("pullRequestFiles", pullRequestFilesFormat);
  })
  .catch((error) => {
    setFailed(error);
  });
