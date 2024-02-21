const config = {
  scopes: "com.intuit.quickbooks.accounting%20phone%20profile%20openid",
  response_type: "code",
  locale: "en-us",
};

export const renderUI = ({ state }) => {
  let url =
    `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.REACT_APP_QUICKBOOKS_CLIENT_ID}&redirect_uri=` +
    `${encodeURIComponent(
      process.env.REACT_APP_QUICKBOOKS_REDIRECT_URI
    )}&scope=${config.scopes}&response_type=${config.response_type}&state=` +
    `${state}&locale=${config.locale}`;

  return window.location.assign(url);
};
