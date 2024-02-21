# FEMTO FP&A

## FEMTO FP&A is a web application that allows users to create and manage financial plans for their business. It is a tool that helps users to understand the financial impact of their decisions and to make better business decisions.

Front End application oriented to ...

## Technologies used

- [React](https://reactjs.org/) single page application
- Routing done using [React Router](https://reacttraining.com/react-router/web/guides/philosophy)
- State management via [React Context](https://reactjs.org/)
- [Mantine] (https://mantine.dev/) for UI components
- [Axios](https://axios-http.com) for HTTP requests
- [MSAL](https://github.com/AzureAD/microsoft-authentication-library-for-js) for Microsoft authentication
- [Jest](https://jestjs.io/) for testing
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting
- [JIRA](https://xpovi.atlassian.net) for project management
- [Figma](https://figma.com) for design
- [Bitbucket](https://bitbucket.com) for version control
- [Slack](https://slack.com) for communication
- [Confluence](https://xpovi.atlassian.net/wiki/spaces/RD/overview) for documentation

## Setup

1. Clone the repository and install the dependencies

```bash
npm install
```

2. Start the frontend application locally

<!-- Depending on using docker or not -->

If you are using docker, you can start the application by running:

```bash
docker-compose up
```

If you are not using docker, you can start the application by running:

```bash
npm start
```

## Available commands

- `npm start`: Start the app locally in your development environment, by default it will be in http://localhost:3000.
- `npm run test`: Run the tests using Jest.
- `npm run build`: Build the app for production.

## Development flow

Here are the steps of the process you need to follow in order to integrate new code or a new feature into the project:

1. Create a new issue in the issue tracker (JIRA) and assign it to yourself.
1. Create a local branch to get started using git: `git checkout -b FEM-<Issue Code>-<Issue_Title>`. For instance, this could be a branch name: `FEM-1-Login_Feature`.
   - The first part is the code of project, while the second part it is just the issue tracker card number followed by some short description.
1. Develop the new feature while doing atomic commits to your local branch using `git commit`.
1. Once you are done, Rebase your commits into a single commit using `git rebase -i HEAD~<number_of_commits>`. This will open an editor where you can squash your commits into a single one.
1. After you are done, you might want to do a `git rebase master` in case new changes were integrated, so your new commits are applied on top of that and you make sure everything still works.
1. Before creating the Pull Request, you need to make sure the tests pass (`npm run test`) and test the commit against safari browser on Lambdatest.
1. Your code should be reviewed, you can update the branch with new changes after you get some feedback.
1. After the Pull Request is approved, It will transition to `Testing` in the issue tracker.
1. Once the Pull Request is merged, the issue tracker card will transition to `Done`. Finally, remember to transition your issue tracker card to `Done`.

### BEM convention

The components try to follow a [BEM](https://css-tricks.com/bem-101/) naming convention (Block Element Modifier). Hence, you can leverage the & (ampersand) operator in SASS to reference the parent component in a concise way.

```html
<a class="Button Button--big Button--orange">
  <span class="Button__price">$9.99</span>
  <span class="Button__text">Subscribe</span>
</a>
```

you can then write your styles as:

```css
/* Block component */
.btn {
}

/* Element that depends upon the block */
.btn__price {
}

/* Modifier that changes the style of the block */
.btn--orange {
}
.btn--big {
}
```

## Linter

In order to lint the code, the project uses [ESLint](https://eslint.org/), which is provided by [Create React App](https://github.com/facebook/create-react-app).

If you want to run the linter just type:

```bash
npx eslint .
```

## Testing

The testing strategy for this project is based on the following two libraries:

- [react-testing-library](https://github.com/kentcdodds/react-testing-library): these are some testing utilities that allow you to write tests that work with actual DOM nodes. You can think of it as a replacement of the popular [Enzyme](https://github.com/airbnb/enzyme) testing library.
- [Jest](https://jestjs.io/): test runner developed by Facebook, it ships with `create-react-app`. It is also used to mock some of the modules that are required on the tests.

The main principle behind the testing philosophy of this approach is:

> The more your tests resemble the way your software is used, the more confidence they can give you.

Test files are located in the same folder as the component they are testing, and they are named as `ComponentName.spec.js`. For example, the tests for the `Button` component are located in `src/components/Button/Button.spec.js`.

You can write unit and integration tests with this approach. If you want to unit test a high level component you'll need to mock some dependencies, because `react-testing-library` intentionally **does not support** shallow rendering.

In case you want to do basic [snapshot testing](https://jestjs.io/docs/en/snapshot-testing), this is also supported, e.g.:

```javascript
expect(container.firstChild).toMatchSnapshot();
```

### How to run tests

To start watch mode, just do:

```bash
npm run test
```

It is suggested that you keep your terminal opened while in watch mode. As you edit your code, your tests will be automatically re-run. Look at the terminal for more instructions on the watch mode usage.

And then you'll see the rendered element on the console.

## Routes

This project is using [`react-router-dom v6`](https://reacttraining.com/react-router/core), have a look at `App.js` which is the file that defines the routes that are available.

There are several routes to navigate to different pages of the app:

There are two guards that are used to protect the routes:

- `RequireAuth`: this is a wrapper around the `Route` component that checks if the user is authenticated. If the user is not authenticated, it will redirect to the login page.
- `RequireNoAuth`: this is a wrapper around the `Route` component that checks if the user is authenticated. If the user is authenticated, it will redirect to the home page.

## State management

FEMTO FP&A uses React Context to manage the state of the application. The state is managed in the `src/contexts` folder. The `index.js` file is the entry point of the application and it is the one that wraps the whole application with the Providers component. This component is the one that provides the state to the rest of the application.

The `src/contexts` folder contains the following files:

- `UserContext.js`: this file contains the state of the user. It contains the user information and the functions to update the user information.

## CI/CD

<!-- Describe how the project uses bitbucket pipeline to test code and once merged to the master build it using docker and push the image to the ecr on aws that triggers a service run to create a task and deploy it -->

This project uses [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines) to run the tests and build the project. The pipeline is defined in the `bitbucket-pipelines.yml` file.

There are two pipelines defined:

- `pull requests`: this pipeline is triggered when a pull request is created. It runs the tests checks project against the linter and formatter.
- `master`: This pipeline is triggered by merging to the "master" . It deploys the project to a production environment.

The pipeline is composed of the following steps:

1. Install dependencies
1. Run tests
1. Build the project
1. Deploy to staging

### Install dependencies

This step installs the dependencies of the project using `npm install`.

### Run tests

This step runs the tests of the project using `npm run test`.

### Build the project

This step builds the project using docker and pushes the image to the ECR on AWS.

### Deploy to staging

Once the image is pushed to the ECR, the pipeline triggers a service run to create a task and deploy it to the production environment.

### Test deployment

The test deployment is available at https://stg.femtofpa.com/login
