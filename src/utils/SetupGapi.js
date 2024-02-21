/* istanbul ignore file */
import { gapi } from "gapi-script";

export const SetupGapi = () => {
  gapi.load("client:auth", () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
  });
};
