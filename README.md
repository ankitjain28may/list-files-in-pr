# List Files in PR

List the files in the pull request in Github Actions. This package is using the Graphql GitHub APIs for fetching the list of files changed in a particular pull request. It is currently enabled for the `pull_request` type of events only.

The output will be available via the `steps` output context.

## Usage

Check the [actions.yml](https://github.com/ankitjain28may/list-files-in-pr/blob/master/action.yml) for the complete format of the required inputs and outputs.

```yaml
  - uses: ankitjain28may/list-files-in-pr@v1.0
    with:
      githubToken: ${{ github.token }}
      outputFormat: 'json' # It can be csv, new-line, space-delimited as well. default is json
```

### Get the list of files in a PR

```yaml
  - uses: ankitjain28may/list-files-in-pr@v1.0
    id: list-files
    with:
      githubToken: ${{ github.token }}
      outputFormat: 'space-delimited'
  - run: |
      for file in ${{ steps.list-files.outputs.pullRequestFiles }}; do
        echo "Changed Files - ${file}."
      done

```

## License

Copyright (c) 2020 Ankit Jain - Released under MIT License
