import Settings from "../../Settings";
import { generateAppContext } from "./utils";

export function redirectToAuthenticationService() {
  const redirectUrl = `${Settings.authenticationService}/auth/openid/testbed/authentication-request?appContext=${generateAppContext()}`;
  window.location.href = redirectUrl;
}

export async function fetchLoggedInState(loginCode: string) {
  const response = await fetch(`${Settings.authenticationService}/auth/openid/testbed/login-request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loginCode: loginCode,
      appContext: generateAppContext(),
    }),
  });

  const data = await response.json();
  return { accessToken: data.accessToken, idToken: data.idToken, profileData: data.profileData };
}
