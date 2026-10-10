(() => {
  const products = Array.isArray(window.SHOP_PRODUCTS) ? window.SHOP_PRODUCTS : [];
  const grid = document.getElementById("product-grid");
  const filters = document.getElementById("filters");
  const search = document.getElementById("search");
  const empty = document.getElementById("empty-state");
  let activeCategory = "Todos";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  const categories = ["Todos", ...new Set(products.map(p => p.category).filter(Boolean))];
  filters.innerHTML = categories.map(category =>
    `<button class="filter-btn${category === activeCategory ? " active" : ""}" type="button" data-category="${esc(category)}">${esc(category)}</button>`
  ).join("");

  function render() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    const visible = products.filter(p => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const haystack = `${p.title || ""} ${p.category || ""} ${p.description || ""}`.toLocaleLowerCase("pt-BR");
      return matchesCategory && haystack.includes(term);
    });
    grid.innerHTML = visible.map(p => {
      const url = /^https?:\/\//i.test(p.affiliateUrl || "") ? p.affiliateUrl : "https://shopee.com.br/";
      const image = /^https?:\/\//i.test(p.image || "")
        ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">`
        : `<div class="placeholder" aria-hidden="true">S<span>S</span></div>`;
      return `<article class="product-card">
        <div class="product-image">${image}</div>
        <div class="product-info">
          <span class="product-category">${esc(p.category || "Achados")}</span>
          <h3>${esc(p.title || "Produto")}</h3>
          <p class="product-description">${esc(p.description || "Confira os detalhes do produto na Shopee.")}</p>
          <div class="product-bottom">
            <span class="product-price${p.price ? "" : " no-price"}">${p.price ? esc(p.price) : "Confira o preço"}</span>
            <a class="buy-button" href="${esc(url)}" target="_blank" rel="noopener noreferrer sponsored">Ver na Shopee <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </article>`;
    }).join("");
    empty.hidden = visible.length !== 0;
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === button));
    render();
  });
  search.addEventListener("input", render);
  document.getElementById("year").textContent = new Date().getFullYear();
  render();
})();
