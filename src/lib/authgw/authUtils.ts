import { Buffer } from "buffer";
import Settings from "../../Settings";
import { ensureUrlQueryParams } from "../utils";

export function generateAppContext(options?: { redirectUrl?: string; queryParams?: { [key: string]: string | number | boolean } }) {
  const queryParams = options?.queryParams ?? {};
  const comeBackUrl = options?.redirectUrl ?? window.location.href;
  const redirectUrl = ensureUrlQueryParams(comeBackUrl, queryParams);
  const appContextBase64 = Buffer.from(
    JSON.stringify({
      appName: Settings.appName,
      redirectUrl: redirectUrl,
    })
  ).toString("base64");
  return encodeURIComponent(appContextBase64);
}
