import Settings from "../../Settings";
import { ensureUrlQueryParams } from "../utils/urls";
import { generateAppContext } from "./authUtils";

/**
 *
 * @param options
 */
export function redirectToAuthenticationService(options?: { redirectUrl?: string; queryParams?: UrlQueryParams }) {
  const redirectUrl = `${Settings.authenticationService}/auth/openid/testbed/authentication-request?appContext=${generateAppContext(options)}`;
  window.location.assign(redirectUrl);
}

/**
 *
 * @param loginCode
 * @returns
 */
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

/**
 *
 * @param idToken
 * @param dataSourceUri
 * @param consentToken if provided the consent token is verified, otherwise a new consent token is requested from the testbed consent api
 * @returns
 */
export async function fetchUserProfileDataConsent(idToken: string, dataSourceUri: string, consentToken?: string | null): Promise<IConsentSituation> {
  if (!idToken) {
    throw new Error("Invalid id token");
  }

  const response = await fetch(`${Settings.authenticationService}/consents/testbed/consent-check`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appContext: generateAppContext(),
      dataSources: [{ uri: dataSourceUri, consentToken: consentToken }],
    }),
  });

  const responseData = await response.json().catch(() => {
    throw new Error("Invalid consent data response: json parse error");
  });
  if (response.status !== 200 || !(responseData instanceof Array)) {
    throw new Error("Invalid consent data response");
  }

  const consentSituation = responseData.find((situation: { dataSource: string }) => situation.dataSource === dataSourceUri);
  if (!consentSituation) {
    throw new Error("Invalid consent data response");
  }
  return consentSituation;
}

export function redirectToConsentService(consentSituation: IConsentSituation, options?: { redirectUrl?: string; queryParams?: UrlQueryParams }) {
  if (!consentSituation.redirectUrl) {
    throw new Error("Invalid consent situation");
  }

  const redirectUrl = ensureUrlQueryParams(consentSituation.redirectUrl, { appContext: generateAppContext(options) });
  window.location.assign(redirectUrl);
}
