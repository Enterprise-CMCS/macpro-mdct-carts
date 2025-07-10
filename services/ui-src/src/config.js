//  @ts-nocheck

export const configToExport = {
  MAX_ATTACHMENT_SIZE: 5000000,
  REACT_APP_LD_SDK_CLIENT: window.env.REACT_APP_LD_SDK_CLIENT,
  s3: {
    REGION: window.env.S3_ATTACHMENTS_BUCKET_REGION,
    BUCKET: window.env.S3_ATTACHMENTS_BUCKET_NAME,
  },
  apiGateway: {
    REGION: window.env.API_REGION,
    URL: window.env.API_URL,
  },
  cognito: {
    REGION: window.env.COGNITO_REGION,
    USER_POOL_ID: window.env.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window.env.COGNITO_USER_POOL_CLIENT_ID,
    APP_CLIENT_DOMAIN: window.env.COGNITO_USER_POOL_CLIENT_DOMAIN,
    IDENTITY_POOL_ID: window.env.COGNITO_IDENTITY_POOL_ID,
    REDIRECT_SIGNIN: window.env.COGNITO_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: window.env.COGNITO_REDIRECT_SIGNOUT,
  },
  POST_SIGNOUT_REDIRECT: window.env.POST_SIGNOUT_REDIRECT,
};

export default configToExport;
