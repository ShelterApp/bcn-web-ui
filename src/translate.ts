import i18n from "i18n";

const translate = (cell, value) => {
  return value ? i18n.t(cell, { value: value }) : i18n.t(cell);
};

export default translate;
