type IState = {
  is(key: string): boolean;
  set(key: string, value: any, emit?: boolean): void;
  get(key: string, emit?: boolean): any;
  remove(key: string, emit?: boolean): void;
  clear(emit?: boolean): void;
  emit(event: string, ...args: any[]): void;

  /**
   * Setup event listener that will be called on every emit
   *
   * @param event
   * @param callback
   */
  on(event: string, callback: (...args: any[]) => void): void;

  /**
   * Setup event listener that will be called only once on emit
   *
   * @param event
   * @param callback
   */
  once(event: string, callback: (...args: any[]) => void): void;
};
