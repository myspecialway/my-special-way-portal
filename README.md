[![Build Status](https://travis-ci.org/myspecialway/my-special-way-portal.svg?branch=master)](https://travis-ci.org/myspecialway/my-special-way-portal)
[![codecov](https://codecov.io/gh/myspecialway/my-special-way-portal/branch/master/graph/badge.svg)](https://codecov.io/gh/myspecialway/my-special-way-portal)
[![BCH compliance](https://bettercodehub.com/edge/badge/myspecialway/my-special-way-portal?branch=master)](https://bettercodehub.com/results/myspecialway/my-special-way-server)

# my-special-way-portal

Server part of the My special way project enabling indoor navigation for schools
Demo master version running at https://msw-portal.azurewebsites.net/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Do we have those?
 

```
Nodejs
npm
git
typescript
yarn
Angular
```

### Starting

Getting the code
```
git clone https://github.com/myspecialway/my-special-way-portal.git my-special-way-portal
cd my-special-way-portal
yarn
```


## Starting the server

```
yarn start
```

## Running the tests

The below will run both the Unit and the E2E tests

```
yarn test

```
The test will run also on CI once you do your first commit also generating 

### Coding style tests

Based on [TSLint](https://palantir.github.io/tslint/) - please refer to [tslint.json](tslint.json) for definition of the rules.
Violations will fail your builds.
Adding TSLint plugin to your IDE will spare you the trouble of fixing after the commit

## Deployment

Commit to master through a PR will bump the version, update docker hub with your image and deploy to Azure.
Commit to your branch will update to docker hub with custom tag, you will need to run the docker manually for now.

## Built With

* Nodejs
* Angualar
* Graphql

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

Also this [git flow](https://guides.github.com/introduction/flow/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. 

## Authors


See also the list of [contributors](https://github.com/myspecialway/my-special-way-portal/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
