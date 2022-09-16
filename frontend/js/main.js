import { apiUrl, userProperties } from "../assets/settings.js";

let users = [];

// -----------    CRUD    ---------------------------

// create new user
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
  console.log("before create");
};

// read - get all users
const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}users`);
  const users = await response.json();
  //console.log(users);
  return users;
};

// read - get one user
const getOneUser = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`);
  const user = await response.json();
  return user;
};

// update user
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
  console.log(response);
};

// delete user
const deleteUserInDatabase = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "DELETE",
  });
};

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

const removeInputCellsActive = (row) => {
  row.querySelectorAll("input").forEach((item) => {
    item.disabled = true;
    item.classList.remove("input__active");
  });
};

const validateInputFields = (name, email, address) => {
  return true;
};

// a szerkesztés gombra kattintásnál a soron kívül minden más gomb legyen inaktív
const setButtonsDisabled = (row) => {
  const allRowButtons = document.querySelectorAll(".row__button");
  allRowButtons.forEach((item) => (item.disabled = true));
  row
    .querySelectorAll(".row__button")
    .forEach((item) => (item.disabled = false));
};

const setButtonsAbled = () => {
  const allRowButtons = document.querySelectorAll(".row__button");
  allRowButtons.forEach((item) => (item.disabled = false));
};

const saveUpdate = async (row, user) => {
  changeIcons(row, user, "endUpdate");
  const inputFileds = row.querySelectorAll("input");
  console.log("inputFileds: ", inputFileds[1].value);
  user.name = inputFileds[1].value;
  user.email = inputFileds[2].value;
  user.address = inputFileds[3].value;
  removeInputCellsActive(row);
  await updateUserInDatabase(user);
};

const undoUpdate = (row, user) => {
  changeIcons(row, user, "endUpdate");
  removeInputCellsActive(row);
  setButtonsAbled();
};

const updateUser = (row, user) => {
  console.log("Módosítás", row.querySelectorAll("input"));
  changeIcons(row, user, "update");
  setButtonsDisabled(row);
  row.querySelectorAll("input").forEach((item) => {
    item.disabled = false;
    item.classList.add("input__active");
  });
};

const deleteUser = async (row, user) => {
  //console.log("Törlés, row:", row.rowIndex);
  await deleteUserInDatabase(user.id);
  document.querySelector(".table").deleteRow(row.rowIndex);
};

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
      td.appendChild(input);
      input.value = user[prop];
    });
    setIconsInDOM(row, user, "update");
    setIconsInDOM(row, user, "delete");
  });
};

const setnewUserButton = () => {
  const newUserButton = document.querySelector(".newUser");
  newUserButton.addEventListener("click", () => setNewUser());
};

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

const emptyInputFields = () => {
  document.querySelector(".name__input").value = "";
  document.querySelector(".email__input").value = "";
  document.querySelector(".address__input").value = "";
};

const setNewUser = async () => {
  const nameInput = document.querySelector(".name__input").value;
  const emailInput = document.querySelector(".email__input").value;
  const addressInput = document.querySelector(".address__input").value;
  if (validateInputFields(nameInput, emailInput, addressInput)) {
    let user = {};
    user.name = nameInput;
    user.email = emailInput;
    user.address = addressInput;
    await createNewUser(user);
    console.log("after create");
    emptyInputFields();
    await insertUserToTable(user.email);
  } else {
    alert("Hibás adatok!");
  }
};

const main = async () => {
  users = await getAllUsers();
  setDOM(users);
  setnewUserButton();
};

main();
