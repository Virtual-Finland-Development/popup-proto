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
      } catch (error) {
        console.error("Failed to fetch auth token", error);
      }

      urlParams.delete("loginCode");
      urlParams.delete("provider");
      window.history.replaceState("", "", `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`);
    }
  }
}
