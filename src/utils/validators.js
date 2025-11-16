/**
 * Validadores reutilizables
 */

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

const isValidDate = (date) => {
  // Verifica si la fecha es válida
  return date && !isNaN(new Date(date).getTime());
};

const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // La fecha de fin debe ser estrictamente posterior a la de inicio
  return start < end;
};

const isPositiveNumber = (num) => {
  return num !== undefined && Number(num) > 0;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
  isValidDate,
  isValidDateRange,
  isPositiveNumber,
};