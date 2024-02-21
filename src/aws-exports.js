/* istanbul ignore file */
export const config = {
  aws_project_region: "eu-central-1",
  aws_cognito_region: "eu-central-1",
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,

  oauth: {
    domain: process.env.REACT_APP_AWS_DOMAIN,
    redirectSignIn: process.env.REACT_APP_AWS_REDIRECT,
    redirectSignOut: process.env.REACT_APP_AWS_REDIRECT,
    responseType: "token",
  },
};
export const getAmplifiyConfiguration = () => {
  const oauth = {
    domain: config.oauth?.domain,
    scope: config.oauth?.scope,
    redirectSignIn: config.oauth?.redirectSignIn,
    redirectSignOut: config.oauth?.redirectSignOut,
    responseType: config.oauth?.responseType,
  };
  var urlsIn = config.oauth.redirectSignIn.split(",");
  var urlsOut = config.oauth.redirectSignOut.split(",");
  var hasLocalhost = (hostname) =>
    Boolean(
      hostname.match(/localhost/) ||
        hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/)
    );
  var hasHostname = (hostname) =>
    Boolean(hostname.includes(window.location.hostname));
  var isLocalhost = hasLocalhost(window.location.hostname);
  if (isLocalhost) {
    urlsIn.forEach((e) => {
      if (hasLocalhost(e)) {
        oauth.redirectSignIn = e;
      }
    });
    urlsOut.forEach((e) => {
      if (hasLocalhost(e)) {
        oauth.redirectSignOut = e;
      }
    });
  } else {
    urlsIn.forEach((e) => {
      if (hasHostname(e)) {
        oauth.redirectSignIn = e;
      }
    });
    urlsOut.forEach((e) => {
      if (hasHostname(e)) {
        oauth.redirectSignOut = e;
      }
    });
  }
  var configUpdate = config;
  configUpdate.oauth = oauth;
  return configUpdate;
};
