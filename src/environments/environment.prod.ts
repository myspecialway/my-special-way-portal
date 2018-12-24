import { Environment } from './environment.interface';

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'https://msw-server.azurewebsites.net/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'https://msw-server.azurewebsites.net/login',
    MSW_HOT_FIRSTLOGIN_ENDPOINT: 'https://msw-server.azurewebsites.net/first-login',
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: 'https://msw-server.azurewebsites.net/restore-password',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'https://msw-server.azurewebsites.net/validateUserNameUnique',
    MSW_HOT_UPLOAD_MAP: 'https://msw-server.azurewebsites.net/map',
  },
  production: true,
} as Environment;
