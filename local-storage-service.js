export default class LocalStorageService {
  isStorageSupported() {
    return window.localStorage !== undefined;
  }

  set(key, object) {
    window.localStorage.setItem(key, JSON.stringify(object));
  }

  get(key) {
    //return JSON.parse(window.localStorage.getItem(key));
    return window.localStorage.getItem(key);
  }

  remove(key) {
    window.localStorage.removeItem(key);
  }
}
