export interface Environment {
  hotConfig: {
    MSW_HOT_GRAPHQL_ENDPOINT: string;
    MSW_HOT_LOGIN_ENDPOINT: string;
    MSW_HOT_RESTORE_PASSWORD_ENDPOINT: string;
    MSW_HOT_USER_UNIQUE_VALIDATION_ENDPOINT: string;
    MSW_HOT_UPLOAD_MAP: string;
  };
  production: boolean;
}
