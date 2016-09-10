// Change address to one that is visible to Android emulator (ex. 10.0.2.2) or iOS simulator (localhost)
// Change accordingly if running from a real device
export const baseUrl = "http://10.0.2.2:3000";

export const config = {
  apiUrl: baseUrl + "/api",
  loginUrl: baseUrl + "/saml/login"
};
