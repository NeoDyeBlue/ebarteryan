export function error(name, message) {
  let error = new Error(message);
  error.name = name;
  return error;
}
