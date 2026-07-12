export function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  return wishlist;
}

export function isWishlisted(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return wishlist.includes(productId);
}