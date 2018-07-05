// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
//  beUrl: 'http://localhost:3000/graphql',
  beUrl: 'http://40.76.86.73:3000/graphql',
  loginUrl: 'http://40.76.86.73:3000/login',
//  loginUrl: 'https://msw-server.azurewebsites.net/login',
};
