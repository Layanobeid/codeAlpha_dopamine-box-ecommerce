// modal.js
export function openModal(product) {
  const modal = document.getElementById("productModal");

  modal.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal">
        <img src="${product.image}" alt="${product.name}" />

        <div class="modal-content">
          <h2>${product.name}</h2>
          <p>${product.description}</p>

          <div class="modal-price">$${product.price}</div>

          <div class="modal-actions">
            <button class="btn-buy" data-id="${product._id}">
              Add to Cart
            </button>
            <button class="btn-close">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  modal.querySelector(".btn-close").onclick = closeModal;
}

export function closeModal() {
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
  modal.innerHTML = "";
}