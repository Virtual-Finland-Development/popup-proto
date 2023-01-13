class VariableStorage implements Storage {
  private storage: { [key: string]: any } = {};

  getItem(key: string): any {
    return this.storage[key];
  }
  setItem(key: string, value: any): void {
    this.storage[key] = value;
  }
  removeItem(key: string): void {
    delete this.storage[key];
  }
  clear(): void {
    this.storage = {};
  }
  key(index: number): string | null {
    return Object.keys(this.storage)[index] || null;
  }
  get length(): number {
    return Object.keys(this.storage).length;
  }
}

export default class State implements IState {
  private variableStorage: Storage = new VariableStorage();
  private callbacks: { [key: string]: ((...args: any[]) => void)[] } = {};
  private onceCallback: { [key: string]: (...args: any[]) => void } = {};
  private keyPrefix: string;
  private removedBaseKeys: string[] = [];

  constructor(keyPrefix: string) {
    this.keyPrefix = keyPrefix;
  }

  is(key: string): boolean {
    return !!this.get(key);
  }
  was(key: string): boolean {
    const baseKey = this.parseBaseKey(key);
    return this.removedBaseKeys.includes(baseKey);
  }
  get(key: string, emit: boolean = true) {
    const driver = this.resolveDriver(key);
    const keyActual = this.resolveKeyActual(key);
    emit && this.emit(`${key}::get`);
    const valueActual = driver.getItem(keyActual);
    try {
      return JSON.parse(valueActual);
    } catch (error) {
      return valueActual;
    }
  }
  set(key: string, value: any, emit: boolean = true) {
    const driver = this.resolveDriver(key);
    const keyActual = this.resolveKeyActual(key);
    const valueActual = JSON.stringify(value);
    driver.setItem(keyActual, valueActual);
    emit && this.emit(`${key}::set`, value);
  }
  remove(key: string, emit: boolean = true) {
    const driver = this.resolveDriver(key);
    const keyActual = this.resolveKeyActual(key);
    driver.removeItem(keyActual);
    this.onKeyWasRemoved(key);
    emit && this.emit(`${key}::clear`);
  }
  clear(emit: boolean = true) {
    this.variableStorage.clear();

    const driverCleaner = (driver: Storage) => {
      Object.keys(driver)
        .filter((x) => x.startsWith(this.keyPrefix))
        .forEach((x) => driver.removeItem(x));
    };

    driverCleaner(window.localStorage);
    driverCleaner(window.sessionStorage);
    this.clearListeners();
    emit && this.emit("clear");
  }

  clearListeners() {
    this.callbacks = {};
  }

  emit(event: string, ...args: any[]): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(...args));
    }

    if (this.onceCallback[event]) {
      this.onceCallback[event](...args);
      delete this.onceCallback[event];
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  once(event: string, callback: (...args: any[]) => void): void {
    this.onceCallback[event] = callback;
  }

  private resolveKeyActual(key: string) {
    return `${this.keyPrefix}::${key}`;
  }

  private resolveDriver(key: string) {
    const baseKey = this.parseBaseKey(key, { clearKeyPrefix: true });

    if (baseKey.startsWith("sessionStorage::")) {
      return sessionStorage;
    } else if (baseKey.startsWith("localStorage::")) {
      return localStorage;
    } else if (baseKey.startsWith("variableStorage::")) {
      return this.variableStorage;
    }
    return this.variableStorage;
  }

  private parseBaseKey(key: string, options?: { clearKeyPrefix?: boolean; clearStoragePrefix?: boolean }): string {
    const hasOptions = typeof options === "object" && options !== null;
    if (!hasOptions || options.clearKeyPrefix) {
      key = key.replace(`${this.keyPrefix}::`, "");
    }
    if (!hasOptions || options.clearStoragePrefix) {
      key = key.replace(/^(sessionStorage|localStorage)::/, "");
    }
    return key;
  }

  private onKeyWasRemoved(key: string) {
    const baseKey = this.parseBaseKey(key);
    this.removedBaseKeys.push(baseKey);
  }
}
