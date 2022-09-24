// beáálítjuk az üzeneteket a felhasználó tevékenységére
export const setNotification = (message, resultBoolean) => {
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
