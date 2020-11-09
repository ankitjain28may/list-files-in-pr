const { getInput } = require("@actions/core");
const { context } = require("@actions/github");

function getInputs() {
  const result = {
    github: {},
  };

  // Github Token
  result.github.auth =
    getInput("githubToken") || process.env.GITHUB_TOKEN || false;
  if (!result.github.auth) {
    throw new Error("Github Token not found");
  }

  result.outputFormat = getInput("outputFormat") || "json";
  if (
    result.outputFormat != "space-delimited" &&
    result.outputFormat != "json" &&
    result.outputFormat != "new-line" &&
    result.outputFormat != "csv"
  ) {
    throw new Error(
      "Output Format should be one of the following: space-delimited, json, new-line, csv"
    );
  }
  // Github baseURL
  if (getInput("baseUrl")) {
    result.github.baseUrl = getInput("baseUrl");
  }
  // Github Repo Owner
  result.owner = context.repo.owner;
  // Github Repo name
  result.repo = context.repo.repo;
  // Github Pull Request Number
  result.pull_request_no = getInput("pullRequestNo") || context.issue.number;

  return result;
}

module.exports = getInputs();
