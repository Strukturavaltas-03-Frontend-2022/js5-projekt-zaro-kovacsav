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
const getOneUsers = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`);
  return response.json();
};

// update user
const updateUser = async (user) => {
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
const deleteUser = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "DELETE",
  });
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
    /*row.appendChild(td);
    td.textContent = user.name;
    row.appendChild(td);
    td.textContent = user.email;
    row.appendChild(td);
    td.textContent = user.adress;*/
    /* ide jönnek a gombok
    const p = document.createElement("p");
    charatcertDiv.appendChild(p);
    p.classList.add("name");
    p.textContent = element.name;
    p.addEventListener("click", () => selectCharacter(element));
    */
  });
};

//console.log(

const main = async () => {
  users = await getAllUsers();
  console.log(users);
  setDOM(users);
};

main();
