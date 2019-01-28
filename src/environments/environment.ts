import { Environment } from './environment.interface';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'http://localhost:3000/api/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'http://localhost:3000/api/login',
    MSW_HOT_RESET_PASSWORD_ENDPOINT: 'http://localhost:3000/api/reset-password',
    MSW_HOT_FIRSTLOGIN_ENDPOINT: 'http://localhost:3000/api/first-login',
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: 'http://localhost:3000/api/restore-password',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'http://localhost:3000/api/validateUserNameUnique',
    MSW_HOT_UPLOAD_MAP: 'http://localhost:3000/api/map',
  },
  production: false,
} as Environment;
