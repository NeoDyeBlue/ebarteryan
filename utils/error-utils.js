export default function errorThrower(name, message) {
  let error = new Error(message);
  error.name = name;
  return error;
}
