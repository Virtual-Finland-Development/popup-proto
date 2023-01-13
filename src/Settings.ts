export default {
  appName: "popup-proto",
  authenticationService: import.meta.env.VITE_AUTHGW_API_URL || "https://virtualfinland-authgw.localhost",
  testbedAPIService: import.meta.env.VITE_TESTBED_API_URL || "http://localhost:3003",
};
