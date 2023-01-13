import { clearUrlParamsFromCurrentUrl } from "../utils";
import { fetchLoggedInState } from "./AuthGWService";

export default async function AuthEventsListener(state: IState) {
  const urlParams = new URLSearchParams(window.location.search);

  const affectsThisApp = urlParams.has("provider") && urlParams.get("provider").toLowerCase() === "testbed";
  if (affectsThisApp && !state.is("sessionStorage::loggedIn")) {
    if (urlParams.has("loginCode")) {
      //
      // Handle login response
      //
      const loginCode = urlParams.get("loginCode");
      try {
        const loggedInState = await fetchLoggedInState(loginCode);
        state.set("sessionStorage::loggedIn", loggedInState);
        console.log("Logged in");
      } catch (error) {
        console.error("Failed to fetch auth token", error);
      }

      // Clear loginCode and provider from URL
      clearUrlParamsFromCurrentUrl(["loginCode", "provider"], urlParams);
    }
  }
}
