import axios from "./configApi";

export const translateGoogle = async text => {
  try {
    let toLang = JSON.parse(localStorage.getItem("@bcn_language"))
      ? JSON.parse(localStorage.getItem("@bcn_language"))
      : "en";
    let fromLang = toLang === "es" ? "en" : "es";
    let obj = {
      source: fromLang,
      target: toLang,
      text: text
    };
    const res = await axios.post(`/common/translate`, obj);
    return res.data.translatedText;
  } catch (error) {
    return error.response.data;
  }
};

export const translateGoogleEs = async text => {
  try {
    let obj = {
      source: "en",
      target: "es",
      text: text
    };
    const res = await axios.post(`/common/translate`, obj);
    return res.data.translatedText;
  } catch (error) {
    return error.response.data;
  }
};
