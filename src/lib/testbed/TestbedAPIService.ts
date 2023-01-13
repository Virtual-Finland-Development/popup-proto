import Settings from "../../Settings";
import { alertError } from "../utils/logging";

export async function fetchUserProfileData(idToken: string, consentToken: string) {
  const response = await fetch(`${Settings.testbedAPIService}/testbed/productizers/user-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      "X-Consent-Token": consentToken,
    },
  });
  if (response.ok) {
    return await response.json();
  }
  try {
    const responseData = await response.json();
    alertError(responseData);
  } catch (error) {}
  throw new Error("Failed to fetch user profile data");
}
