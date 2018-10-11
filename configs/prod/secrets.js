export const prodConfig = {
  apiKey: "XXXXXXXX",
  authDomain: "memory02.firebaseapp.com",
  databaseURL: "https://memory02.firebaseio.com",
  projectId: "memory02",
  storageBucket: "memory02.appspot.com",
  messagingSenderId: "YYYYYYYY"
};
export const devConfig = prodConfig;
export const DEBUG_KEY = {
  signature: "DEBUG_UserToken",
  public: "DEBUG_UserToken-publickey-value",
  private: "DEBUG_UserToken-privatekey-value"
};
export const ENCRYPTION_KEY = "ZZZZZZZZ";
export const LE_TOKEN = "LLLLLLLL";
export const ERROR_KEY = {
  key: "KKKKKKKK",
  projectId: "memory02",
  service: "memory02.usertoken.com",
  version: "1.0.0",
  reportUncaughtExceptions: true,
  disabled: false,
  context: { user: "memory02-user" }
};
