import { Buffer } from "buffer";
import Settings from "../../Settings";

export function generateAppContext(redirectUrl: string = window.location.href) {
  const appContextBase64 = Buffer.from(
    JSON.stringify({
      appName: Settings.appName,
      redirectUrl: redirectUrl,
    })
  ).toString("base64");
  return encodeURIComponent(appContextBase64);
}
