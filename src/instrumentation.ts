export function register() {
  // Node.js 25+ defines globalThis.localStorage as an object without getItem/setItem
  // when --localstorage-file is not configured with a valid path.
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function'
  ) {
    const store = new Map<string, string>();
    const memoryStorage: Storage = {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key: string) {
        return store.get(String(key)) ?? null;
      },
      key(index: number) {
        return Array.from(store.keys())[index] ?? null;
      },
      removeItem(key: string) {
        store.delete(String(key));
      },
      setItem(key: string, value: string) {
        store.set(String(key), String(value));
      },
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: memoryStorage,
      writable: true,
      configurable: true,
    });
  }
}
