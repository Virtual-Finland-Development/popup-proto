/**
 *
 * @param key
 * @param urlParams
 * @returns
 */
export function popUrlQueryParamFromCurrentUrl(key: string, urlParams?: URLSearchParams) {
  if (!urlParams) {
    urlParams = new URLSearchParams(window.location.search);
  }

  const value = urlParams.get(key);
  if (value) {
    clearUrlParamsFromCurrentUrl([key], urlParams);
  }

  return value;
}

/**
 *
 * @param keys
 * @param urlParams
 */
export function clearUrlParamsFromCurrentUrl(keys: Array<string>, urlParams?: URLSearchParams): void {
  if (!urlParams) {
    urlParams = new URLSearchParams(window.location.search);
  }
  for (const key of keys) {
    if (urlParams.has(key)) {
      urlParams.delete(key);
    }
  }
  const cleanedHref = `${window.location.origin}${window.location.pathname}${getCleanUrlParamsString(urlParams)}`;

  if (cleanedHref !== window.location.href) {
    window.history.replaceState("", "", cleanedHref);
  }
}

/**
 *
 * @param url
 * @param queryParams
 * @returns
 */
export function ensureUrlQueryParams(url: string | URL, queryParams: { [key: string]: string | number | boolean }): string {
  const urlObj = new URL(url);
  const urlParams = new URLSearchParams(urlObj.search);

  for (const [key, value] of Object.entries(queryParams)) {
    urlParams.set(key, String(value));
  }

  const baseUrl = urlObj.origin + urlObj.pathname;
  return `${baseUrl}${getCleanUrlParamsString(urlParams)}`;
}

/**
 *
 * @param urlParams
 * @returns
 */
export function getCleanUrlParamsString(urlParams: URLSearchParams): string {
  const urlParamsString = urlParams.toString();
  return urlParamsString.length > 0 ? `?${urlParamsString}` : "";
}
