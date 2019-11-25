// Root api for getting any data
export const ROOT_API = 'http://localhost:8000/api';

// Configuration of toast popuo
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Email Regex
export const EMAIL_REG_EXP = /^[A-Za-z]{1,}[A-Za-z0-9]{0,}[.]{0,1}[A-Za-z0-9]{1,}[.]{0,1}[A-Za-z0-9]{1,}@[A-Za-z]{2,}[.]{1}[A-za-z]{2,3}[.]{0,1}[a-z]{0,2}$/;

// Character Regex
export const ONLY_CHAR_REG_EXP = /^[a-zA-Z]+$/;
