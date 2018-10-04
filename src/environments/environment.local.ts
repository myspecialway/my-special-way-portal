import { Environment } from './environment.interface';

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'http://localhost:3000/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'http://localhost:3000/login',
  },
  production: false,
} as Environment;
