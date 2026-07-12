export default function Loader(show = true) {
  let loader = document.getElementById("loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";
    document.body.appendChild(loader);
  }

  loader.innerHTML = `
    <div class="spinner"></div>
  `;

  loader.style.display = show ? "flex" : "none";
}