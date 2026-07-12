export default function Button(text, onClick) {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.innerText = text;
  btn.onclick = onClick;
  return btn;
}