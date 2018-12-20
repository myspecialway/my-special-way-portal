export interface Environment {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: string;
    MSW_HOT_LOGIN_ENDPOINT: string;
    MSW_HOT_FIRSTLOGIN_ENDPOINT: string;
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: string;
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: string;
  };
  production: boolean;
}
