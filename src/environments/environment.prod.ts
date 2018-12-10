import { Environment } from './environment.interface';

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'https://msw-server.azurewebsites.net/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'https://msw-server.azurewebsites.net/login',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'https://msw-server.azurewebsites.net/validateUserNameUnique',
    MSW_HOT_UPLOAD_MAP: 'https://msw-server.azurewebsites.net/map',
  },
  production: true,
} as Environment;
