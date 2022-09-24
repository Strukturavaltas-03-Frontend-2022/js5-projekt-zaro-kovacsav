import { englishStrings, hunStrings } from "./message_datas.js";

const setLanguage = (className, text) => {
  document.querySelector(className).textContent = text;
};

const setPlaceholders = (className, text) => {
  document.querySelector(className).setAttribute("placeholder", text);
};

const setDOMLanguage = (language) => {
  setLanguage(".header__title", language.title);
  setLanguage(".core", language.core);
  setLanguage(".userAdmin", language.userAdmin);
  setLanguage(".interface", language.interface);
  setLanguage(".layouts", language.layouts);
  setLanguage(".pages", language.pages);
  setLanguage(".addons", language.addons);
  setLanguage(".charts", language.charts);
  setLanguage(".labels", language.labels);
  setLanguage(".userAdminSection", language.userAdminSection);
  setLanguage(".newUser", language.newUserButton);
  setLanguage(".nameTableHead", language.nameTableHead);
  setLanguage(".emailTableHead", language.emailTableHead);
  setLanguage(".posttableHead", language.posttableHead);

  setPlaceholders(".search__input", language.search);
  setPlaceholders(".name__input", language.nameInputPlaceholder);
  setPlaceholders(".email__input", language.emailInputPlaceholder);
  setPlaceholders(".address__input", language.addressInputPlaceholder);
};

export const selectLanguage = (selectedLanguage) => {
  if (selectedLanguage === "english") {
    setDOMLanguage(englishStrings);
  } else {
    setDOMLanguage(hunStrings);
  }
};
