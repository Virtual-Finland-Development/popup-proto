import * as logging from "../utils/logging";
import { clearUrlParamsFromCurrentUrl } from "../utils/urls";
import { fetchLoggedInState } from "./AuthGWService";

export default async function AuthEventsListener(state: IState) {
  const urlParams = new URLSearchParams(window.location.search);

  const affectsThisApp = urlParams.has("provider") && urlParams.get("provider").toLowerCase() === "testbed";
  if (affectsThisApp && !state.is("sessionStorage::loggedIn")) {
    const cleanupQueryParams = ["provider"];

    if (urlParams.has("loginCode")) {
      //
      // Handle login response
      //
      const loginCode = urlParams.get("loginCode");
      try {
        const loggedInState = await fetchLoggedInState(loginCode);
        state.set("sessionStorage::loggedIn", loggedInState);
        logging.log("Logged in");
      } catch (error) {
        logging.logError("Failed to fetch auth token", error);
      }
      // Cleanup auth query params
      cleanupQueryParams.push("loginCode");
    }
    if (urlParams.has("consentStatus")) {
      // Cleanup consent query params
      cleanupQueryParams.push("consentStatus");
      cleanupQueryParams.push("consentToken");
      cleanupQueryParams.push("dataSource");
    }

    clearUrlParamsFromCurrentUrl(cleanupQueryParams, urlParams);
  }
}
