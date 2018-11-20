import { Environment } from './environment.interface';

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'http://localhost:3000/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'http://localhost:3000/login',
    MSW_HOT_RESET_PASSWORD_ENDPOINT: 'http://localhost:3000/reset-password',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'http://localhost:3000/validateUserNameUnique',
  },
  production: false,
} as Environment;
