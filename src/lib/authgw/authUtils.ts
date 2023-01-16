import { Buffer } from "buffer";
import Settings from "../../Settings";
import { ensureUrlQueryParams } from "../utils/urls";

export function generateAppContext(options?: { redirectUrl?: string | URL; queryParams?: { [key: string]: string | number | boolean } }) {
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

/**
 *
 * @param url
 * @param containerElement
 */
export function redirectWithIFrame(url: string | URL, containerElement?: HTMLElement) {
  const urlObj = new URL(url);

  if (!containerElement) {
    containerElement = document.querySelector("#protoPluginApp .protoPluginAppContent") as HTMLElement;
    if (!containerElement) {
      throw new Error("containerElement not found");
    }
  }

  let iframe = document.querySelector("iframe[name=protoPluginRedirectionIFrame]");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Redirection");
    iframe.setAttribute("name", "protoPluginRedirectionIFrame");
    containerElement.appendChild(iframe);
  }

  let redirectionForm = document.querySelector("form[name=protoPluginRedirectionForm]") as HTMLFormElement;
  if (!redirectionForm) {
    redirectionForm = document.createElement("form");
    redirectionForm.setAttribute("name", "protoPluginRedirectionForm");
    redirectionForm.setAttribute("target", "protoPluginRedirectionIFrame");
    containerElement.appendChild(redirectionForm);
  }

  redirectionForm.setAttribute("action", urlObj.origin + urlObj.pathname);

  const urlParams = urlObj.searchParams;
  for (const [key, value] of urlParams.entries()) {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", value);
    redirectionForm.appendChild(input);
  }

  redirectionForm.submit();
}
