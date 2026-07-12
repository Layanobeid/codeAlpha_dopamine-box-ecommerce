export default function Input(placeholder, type = "text") {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.className = "input";
  return input;
}