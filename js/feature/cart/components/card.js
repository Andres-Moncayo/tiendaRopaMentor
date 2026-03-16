const DEFAULT_PRODUCT = { image: "", title: "", price: "", id: "" };

export function Card(
  { product, className } = { product: DEFAULT_PRODUCT, className: "" },
) {
  return `<div class="c-card ${className}">
      <a href="detalle.html" class="c-card__link"></a>
      <img src="${product.image}"class="c-card__image">
      <div class="c-card__body">
          <h2 class="c-card__title">${product.title}</h2>
          <p class="c-card__price">$${product.price}</p>
          <button class="c-card__btn c-card__btn--buy" data-id="${product.id}">
              Agregar al carrito
          </button>
      </div>
  </div>
`;
}
