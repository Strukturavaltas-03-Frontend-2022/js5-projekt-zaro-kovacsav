import { apiUrl, userProperties } from "../assets/settings.js";

let users = [];
let isUserUnderEdit = false;
const nameInput = document.querySelector(".name__input");
const emailInput = document.querySelector(".email__input");
const addressInput = document.querySelector(".address__input");
const namePattern =
  // /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/;
  /^([A-ZÁÉÓÖŐÚÜŰa-záéóöőüű.]{0,10} ?[A-ZÁÉÓÖŐÚÜŰ][a-záéóöőüű'\-]{1,20} [A-ZÁÉÓÖŐÚÜŰ][a-záéóöőüű'\-]{1,20}( [A-ZÁÉÓÖŐÚÜŰ][a-záéóöőüű]{1,20})?)$/;
// nagyon egyszerű email validáció:
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const addressPattern = /^[a-zA-Z0-9-. ]{5,50}$/;

// -----------    CRUD    ---------------------------

// create - új user mentése
const createNewUser = async (user) => {
  await fetch(`${apiUrl}users`, {
    method: "POST",
    body: JSON.stringify({
      name: `${user.name}`,
      email: `${user.email}`,
      address: `${user.address}`,
    }),
    headers: { "Content-Type": "application/json" },
  });
  //console.log("before create");
};

// read - az összes users lekérdezése
const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}users`);
  const users = await response.json();
  return users;
};

// read - egy user lekérdezése
const getOneUser = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`);
  const user = await response.json();
  return user;
};

// update - a user adatainak frissítése
const updateUserInDatabase = async (user) => {
  const response = await fetch(`${apiUrl}users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: `${user.name}`,
      email: `${user.email}`,
      address: `${user.address}`,
    }),
    headers: { "Content-Type": "application/json" },
  });
  //console.log(response);
};

// delete - egy user törlése
const deleteUserInDatabase = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "DELETE",
  });
};

// a user szerkesztésénél az ikonok és ezzel együtt a függvények cseréje
// a metódusoknak megfelelően
const changeIcons = (row, user, method) => {
  const updateIcons = row.querySelectorAll(".row__button");
  // ki kell törölni, hogy az eseményfigyelő is eltűnjön
  updateIcons.forEach((icon) => icon.parentNode.remove());
  if (method === "update") {
    setIconsInDOM(row, user, "save");
    setIconsInDOM(row, user, "undo");
  } else {
    setIconsInDOM(row, user, "update");
    setIconsInDOM(row, user, "delete");
  }
};

// az input mezők inaktiválása
const removeInputCellsActive = (row) => {
  row.querySelectorAll("input").forEach((item) => {
    item.disabled = true;
    item.classList.remove("input__active");
  });
};

// az input mező folyamtos validálása beírásnál
// meg kell vizsgálni, hogy nem adtuk-e rá már a mezőkre az eseményfigyelőket
// korábban, hogy ne legyen duplikálás
const setInputFieldValidOrInvalid = (inputFieldName, pattern) => {
  if (!inputFieldName.classList.contains("eventListenerAlreadyAdded")) {
    inputFieldName.addEventListener("keyup", (ev) => {
      inputFieldName.classList.add("eventListenerAlreadyAdded");
      if (pattern.test(inputFieldName.value)) {
        inputFieldName.classList.remove("invalid");
      } else {
        inputFieldName.classList.add("invalid");
      }
    });
  }
};

// a három input mező validásála mentés előtt
const validateInputFields = (nameInput, emailInput, addressInput) => {
  if (
    namePattern.test(nameInput.value) &&
    emailPattern.test(emailInput.value) &&
    addressPattern.test(addressInput.value)
  ) {
    return true;
  } else {
    return false;
  }
};

// a szerkesztés gombra kattintásnál a soron kívül minden más gomb legyen inaktív
const setButtonsDisabled = (row) => {
  const allRowButtons = document.querySelectorAll(".row__button");
  allRowButtons.forEach((item) => (item.disabled = true));
  row
    .querySelectorAll(".row__button")
    .forEach((item) => (item.disabled = false));
};

// az összes gomb disabled tulajdonságának visszavonása
const setButtonsAbled = () => {
  const allRowButtons = document.querySelectorAll(".row__button");
  allRowButtons.forEach((item) => (item.disabled = false));
};

// a user adatok szerkesztett változatának mentése
const saveUpdate = async (row, user) => {
  const inputFileds = row.querySelectorAll("input");
  console.log("inputFileds: ", inputFileds[1].value);
  if (validateInputFields(inputFileds[1], inputFileds[2], inputFileds[3])) {
    changeIcons(row, user, "endUpdate");
    user.name = inputFileds[1].value;
    user.email = inputFileds[2].value;
    user.address = inputFileds[3].value;
    removeInputCellsActive(row);
    //setButtonsAbled();
    await updateUserInDatabase(user);
    isUserUnderEdit = false;
    setNotification("Sikeres mentés!", true);
  } else {
    setNotification("Hibás adatok!", false);
    //alert("Hibás adatok!");
  }
};

// vissza állítjuk a user eredeti adatait
const setOriginalValuesOfUser = (row, user) => {
  const inputFileds = row.querySelectorAll("input");
  inputFileds[1].value = user.name;
  inputFileds[2].value = user.email;
  inputFileds[3].value = user.address;
};

// leszedjük a beviteli mezőről az invalid osztályt undo esetén
const removeInvalidClassFromInputFileds = (row) => {
  const inputFileds = row.querySelectorAll("input");
  inputFileds.forEach((item) => item.classList.remove("invalid"));
};

// a szerkesztés visszavonása és az eredeti állapot visszaállítása
const undoUpdate = (row, user) => {
  changeIcons(row, user, "endUpdate");
  removeInputCellsActive(row);
  setButtonsAbled();
  setOriginalValuesOfUser(row, user);
  removeInvalidClassFromInputFileds(row);
  isUserUnderEdit = false;
};

// a user adatainak szerkesztése:
// ikon és eseménycsere, a többi gomb inaktiválása
// a beviteli mezők aktiválása, a bevitel folyamatos validálása
const updateUser = (row, user) => {
  if (!isUserUnderEdit) {
    isUserUnderEdit = true;
    console.log("Módosítás", row.querySelectorAll("input"));
    changeIcons(row, user, "update");
    // nem inaktiválni kell a gombokat, más a feladat
    //setButtonsDisabled(row);
    const inputFileds = row.querySelectorAll("input");
    // az ID-t tartalmazó elemet ki kell venni a tömbből, az nem szerkeszthető
    const inputFiledsArray = Array.from(inputFileds).slice(1);
    inputFiledsArray.forEach((item) => {
      item.disabled = false;
      item.classList.add("input__active");
    });
    setInputFieldValidOrInvalid(inputFiledsArray[0], namePattern);
    setInputFieldValidOrInvalid(inputFiledsArray[1], emailPattern);
    setInputFieldValidOrInvalid(inputFiledsArray[2], addressPattern);
  } else {
    setNotification(
      "Nem lehet szerkeszteni amíg egy user szerkesztés alatt van!!",
      false
    );
  }
};

// a user törlése
const deleteUser = async (row, user) => {
  if (!isUserUnderEdit) {
    await deleteUserInDatabase(user.id);
    document.querySelector(".table").deleteRow(row.rowIndex);
  } else {
    setNotification(
      "Nem lehet törölni amíg egy user szerkesztés alatt van!",
      false
    );
  }
};

// a szerkesztő/törlő/mentő/visszavonó ikonok létrehozása és a hozzájuk
// tartozó függvények beállítása
const setIconsInDOM = (row, user, method) => {
  let td = document.createElement("td");
  row.appendChild(td);
  let button = document.createElement("button");
  button.classList.add("row__button");
  td.appendChild(button);
  let i = document.createElement("i");
  button.appendChild(i);
  i.classList.add("fa");
  if (method === "update") {
    i.classList.add("fa-pencil-square-o");
    button.addEventListener("click", () => updateUser(row, user));
  } else if (method === "delete") {
    i.classList.add("fa-trash-o");
    button.addEventListener("click", () => deleteUser(row, user));
  } else if (method === "save") {
    i.classList.add("fa-floppy-o");
    button.addEventListener("click", () => saveUpdate(row, user));
  } else if (method === "undo") {
    i.classList.add("fa-undo");
    button.addEventListener("click", () => undoUpdate(row, user));
  }
};

const emptyTableRows = () => {
  const rows = document.querySelectorAll("tr");
  console.log(rows.length);
};

// a táblázat feltöltése adatokkal és ikonokkal
const setDOM = (userList) => {
  userList.forEach((user) => {
    const tbody = document.querySelector(".table__body");
    const row = document.createElement("tr");
    tbody.appendChild(row);
    userProperties.forEach((prop) => {
      const td = document.createElement("td");
      row.appendChild(td);
      const input = document.createElement("input");
      input.disabled = true;
      input.classList.add("input");
      td.appendChild(input);
      input.value = user[prop];
      input.classList.add(prop);
    });
    setIconsInDOM(row, user, "update");
    setIconsInDOM(row, user, "delete");
  });
};

// az új felhasználó gombjának beállítása
const setnewUserButton = () => {
  const newUserButton = document.querySelector(".newUser");
  newUserButton.addEventListener("click", () => setNewUser());
};

// az új user felvétele a táblázat első sorába
// mivel mi nem adhatunk meg neki ID-t, el kell küldeni az adatbázisba, ott kap egyet
// és vissza kell kérni, hogy már ezt is be tudjuk írni a táblázatba
// de nem tudjuk csak ezt az egyet lekérdezni, mert még nem tudjuk az ID-jét
// mindet le kell kérdezni, és aztán leszűrni
// az email egyedi, nem lehet ugyanaz, arra tudunk szűrni
const insertUserToTable = async (newUserEmail) => {
  users = await getAllUsers();
  console.log(users);
  console.log(newUserEmail);
  const user = users.filter((item) => item.email === newUserEmail);
  console.log("New user: ", user[0].name);
  const tbody = document.querySelector(".table__body");
  const firstrow = tbody.firstChild;
  const row = document.createElement("tr");
  tbody.insertBefore(row, firstrow);
  userProperties.forEach((prop) => {
    const td = document.createElement("td");
    row.appendChild(td);
    const input = document.createElement("input");
    input.disabled = true;
    td.appendChild(input);
    input.value = user[0][prop];
  });
  setIconsInDOM(row, user, "update");
  setIconsInDOM(row, user, "delete");
};

// a beviteli mezők kiürítése az új user mentése után
const emptyInputFields = () => {
  document.querySelector(".name__input").value = "";
  document.querySelector(".email__input").value = "";
  document.querySelector(".address__input").value = "";
};

// új user beviteli mezőinek folyamatos validálása
const validateNewUserInputFieldsOnKeyup = () => {
  setInputFieldValidOrInvalid(nameInput, namePattern);
  setInputFieldValidOrInvalid(emailInput, emailPattern);
  setInputFieldValidOrInvalid(addressInput, addressPattern);
};

// új user felvétele
// validálás után beállítjuk a user adatait, elküldjük az adatbázisba
// ürítjük a beviteli mezőket, beszúrjuk a táblázat első sorába
const setNewUser = async () => {
  console.log(addressInput.value);
  if (validateInputFields(nameInput, emailInput, addressInput)) {
    let user = {};
    user.name = nameInput.value;
    user.email = emailInput.value;
    user.address = addressInput.value;
    await createNewUser(user);
    console.log("after create");
    emptyInputFields();
    await insertUserToTable(user.email);
    setNotification("Az új user fölvétele sikerült!", true);
  } else {
    setNotification("Hibás adatok!", false);
    //alert("Hibás adatok!");
  }
};

const setNotification = (message, resultBoolean) => {
  let messageBox = "";
  if (!resultBoolean) {
    messageBox = document.querySelector(".failure__div");
  } else {
    messageBox = document.querySelector(".success__div");
  }
  messageBox.classList.remove("display__none");
  messageBox.classList.add("display__block");
  const messageBoxH2 = messageBox.querySelector("h2");
  messageBoxH2.textContent = message;

  const setTimeOutNumber = setTimeout(function () {
    clearTimeout(setTimeOutNumber);
    messageBox.classList.add("display__none");
    messageBox.classList.remove("display__block");
    messageBoxH2.textContent = "";
  }, 5000);
};

const main = async () => {
  users = await getAllUsers();
  setDOM(users);
  setnewUserButton();
  validateNewUserInputFieldsOnKeyup();
};

main();
