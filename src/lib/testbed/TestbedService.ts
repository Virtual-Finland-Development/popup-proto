import { Buffer } from "buffer";

const Settings = {
  authenticationService: "https://virtualfinland-authgw.localhost",
};

function generateAppContext() {
  const appContextBase64 = Buffer.from(
    JSON.stringify({
      appName: "popup-proto",
      redirectUrl: window.location.href,
    })
  ).toString("base64");
  return encodeURIComponent(appContextBase64);
}

export function redirectToAuthenticationService() {
  const redirectUrl = `${Settings.authenticationService}/auth/openid/testbed/authentication-request?appContext=${generateAppContext()}`;
  window.location.href = redirectUrl;
}

export async function authenticationUrlParamsListener() {
  const urlParams = new URLSearchParams(window.location.search);

  const affectsThisApp = urlParams.has("provider") && urlParams.get("provider").toLowerCase() === "testbed";
  if (!this.AuthState.isLoggedIn()) {
    if (affectsThisApp && urlParams.has("loginCode")) {
      //
      // Handle login response
      //
      const loginCode = urlParams.get("loginCode");
      try {
        const loggedInState = await this.AuthService.fetchLoggedInState(loginCode);
        this.AuthState.login(loggedInState); // Store state in local storage
        this.UIState.resetViewState(); // reset view state
      } catch (error) {
        this.log("LoginFlowEventsListener", "Failed to fetch auth token", error);
      }
    }
  }
}
