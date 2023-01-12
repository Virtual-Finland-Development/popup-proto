import Settings from "../../Settings";

export async function fetchUserProfileData(idToken: string) {
  const response = await fetch(`${Settings.testbedAPIService}/testbed/productizers/user-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Failed to fetch user profile data");
}
