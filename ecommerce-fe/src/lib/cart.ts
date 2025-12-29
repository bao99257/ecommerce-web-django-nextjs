import { api } from "./api";

export async function addToCart(productId: number, quantity: number = 1) {
  return api("/cart/add/", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}
