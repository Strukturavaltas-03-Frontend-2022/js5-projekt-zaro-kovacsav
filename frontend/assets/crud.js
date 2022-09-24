import { apiUrl } from "../assets/settings.js";

// -----------    CRUD    ---------------------------

// create - új user mentése
export const createNewUser = async (user) => {
  await fetch(`${apiUrl}users`, {
    method: "POST",
    body: JSON.stringify({
      name: `${user.name}`,
      email: `${user.email}`,
      address: `${user.address}`,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

// read - az összes users lekérdezése
export const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}users`);
  const users = await response.json();
  return users;
};

// read - egy user lekérdezése
export const getOneUser = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`);
  const user = await response.json();
  return user;
};

// update - a user adatainak frissítése
export const updateUserInDatabase = async (user) => {
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
export const deleteUserInDatabase = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "DELETE",
  });
};
