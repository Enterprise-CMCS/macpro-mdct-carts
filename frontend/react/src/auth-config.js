const { host, protocol } = window.location;

export default {
  oidc: {
    clientId: "0oa4juv4poiQ6nDB6297",
    issuer: "https://test.idp.idm.cms.gov/oauth2/aus4itu0feyg3RJTK297",
    redirectUri: `${protocol}//${host}/implicit/callback`,
    scopes: ["openid", "profile", "email"],
    pkce: true,
  },
  callback: "/implicit/callback",
};
