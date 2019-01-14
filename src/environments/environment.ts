import { Environment } from './environment.interface';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'http://localhost:3000/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'http://localhost:3000/login',
    MSW_HOT_RESET_PASSWORD_ENDPOINT: 'http://localhost:3000/reset-password',
    MSW_HOT_FIRSTLOGIN_ENDPOINT: 'http://localhost:3000/first-login',
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: 'http://localhost:3000/restore-password',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'http://localhost:3000/validateUserNameUnique',
    MSW_HOT_UPLOAD_MAP: 'http://localhost:3000/map/upload',
  },
  production: false,
} as Environment;
