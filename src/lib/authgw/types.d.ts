type IState = {
  is(key: string): boolean;
  set(key: string, value: any, emit?: boolean): void;
  get(key: string, emit?: boolean): any;
  remove(key: string, emit?: boolean): void;
  clear(emit?: boolean): void;
  emit(event: string, ...args: any[]): void;
  on(event: string, callback: (...args: any[]) => void): void;
};
