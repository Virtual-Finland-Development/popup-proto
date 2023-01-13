import Settings from "../../Settings";

export function log(...args: any[]) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${Settings.appName}]`, ...args);
  }
}

export function logError(...args: any[]) {
  console.error(`[${Settings.appName}]`, ...args);
}

export function alertError(...args: any[]) {
  alert(`[${Settings.appName}] ${args.join(" ")}`);
}
