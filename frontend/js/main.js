import { apiUrl, userProperties } from "../assets/settings.js";

let users = [];

// -----------    CRUD    ---------------------------

// create new user
const createNewUser = async (user) => {
  const response = await fetch(`${apiUrl}users`, {
    method: "POST",
    body: JSON.stringify({
      name: `${user.name}`,
      email: `${user.email}`,
      adress: `${user.adress}`,
    }),
    headers: { "content-type": "application/json" },
  });
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
  return response.json();
};

// update user
const updateUserInDatabase = async (user) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "POST",
    body: JSON.stringify({
      name: `${user.name}`,
      email: `${user.email}`,
      adress: `${user.adress}`,
    }),
    headers: { "content-type": "application/json" },
  });
};

// delete user
const deleteUserInDatabase = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "DELETE",
  });
};

const updateUser = (user) => {
  console.log("Módosítás");
};

const deleteUser = (user) => {
  console.log("Törlés");
};

const setIconsInDOM = (row, user, updateOrDelete) => {
  let td = document.createElement("td");
  row.appendChild(td);
  let i = document.createElement("i");
  td.appendChild(i);
  i.classList.add("fa");
  if (updateOrDelete === "update") {
    i.classList.add("fa-pencil-square-o");
    i.addEventListener("click", () => updateUser(user));
  } else {
    i.classList.add("fa-trash-o");
    i.addEventListener("click", () => deleteUser(user.id));
  }
};

const setDOM = (userList) => {
  userList.forEach((user) => {
    const tbody = document.querySelector(".table__body");
    const row = document.createElement("tr");
    tbody.appendChild(row);
    userProperties.forEach((prop) => {
      const td = document.createElement("td");
      row.appendChild(td);
      td.textContent = user[prop];
    });
    setIconsInDOM(row, user, "update");
    setIconsInDOM(row, user, "delete");
  });
};

const main = async () => {
  users = await getAllUsers();
  console.log(users);
  setDOM(users);
};

main();
