import axios from "./configApi";

export const getAboutPage = async () => {
  const lang = JSON.parse(localStorage.getItem("@bcn_language"))
    ? JSON.parse(localStorage.getItem("@bcn_language"))
    : "en";
  const url = lang === "en" ? "/static-pages/ABOUT" : "/static-pages/ABOUT_ES";
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
};

export const getTermsPage = async () => {
  const lang = JSON.parse(localStorage.getItem("@bcn_language"))
    ? JSON.parse(localStorage.getItem("@bcn_language"))
    : "en";
  const url = lang === "en" ? "/static-pages/TERMS" : "/static-pages/TERMS_ES";
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
};

export const getPrivacyPage = async () => {
  try {
    const lang = JSON.parse(localStorage.getItem("@bcn_language"))
      ? JSON.parse(localStorage.getItem("@bcn_language"))
      : "en";
    const url =
      lang === "en" ? "/static-pages/PRIVACY" : "/static-pages/PRIVACY_ES";
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
};

export const getFAQPage = async () => {
  try {
    const res = await axios.get(`/static-pages/FAQ`);
    return res.data;
  } catch (error) {
    // return error.response.data;
    return Promise.reject(error);
  }
};
