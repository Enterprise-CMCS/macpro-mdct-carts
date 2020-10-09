const { host, protocol } = window.location;
const { env } = window;

export default {
  oidc: {
    clientId: env.OIDC_CLIENT_ID,
    issuer: env.OIDC_ISSUER,
    redirectUri: `${protocol}//${host}/implicit/callback`,
    scopes: ["openid", "profile", "email"],
    pkce: true,
  },
  callback: "/implicit/callback",
};
