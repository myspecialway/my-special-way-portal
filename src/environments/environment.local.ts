import { Environment } from './environment.interface';

export const environment = {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/graphql',
    MSW_HOT_LOGIN_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/login',
    MSW_HOT_RESET_PASSWORD_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/reset-password',
    MSW_HOT_FIRSTLOGIN_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/first-login',
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/restore-password',
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: 'https://msw-westus-app-k8s.att.io:3000/api/validateUserNameUnique',
    MSW_HOT_UPLOAD_MAP: 'https://msw-westus-app-k8s.att.io:3000/api/map',
  },
  production: false,
} as Environment;
