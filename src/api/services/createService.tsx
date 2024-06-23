import axios from "../configApi";
import { translateGoogleEs } from "../translate";

export const createService = async obj => {
  let data = await parseObj(obj);
  try {
    const res = await axios.post(`/services`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateService = async obj => {
  try {
    let data = await parseObj(obj);
    const res = await axios.put(`/services/${obj.id}`, data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

const parseObj = async obj => {
  const serviceSummaryEs = obj.serviceSummary
    ? await translateGoogleEs(obj.serviceSummary)
    : obj.serviceSummary;
  const descriptionEs = obj.description
    ? await translateGoogleEs(obj.description)
    : obj.description;
  const ageEs = obj.age ? await translateGoogleEs(obj.age) : obj.age;

  return {
    ...obj,
    serviceSummaryEs: serviceSummaryEs,
    descriptionEs: descriptionEs,
    ageEs: ageEs
  };
};
