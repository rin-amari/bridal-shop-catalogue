document.addEventListener("DOMContentLoaded", () => {
  const filterToggle = document.getElementById("filter-toggle");
  const filterClose = document.getElementById("filter-close");
  const filters = document.getElementById("filters");
  const overlay = document.getElementById("overlay");
  const products = document.querySelectorAll(".product-card");
  const filterStyle = document.getElementById("filter-style");
  const filterColor = document.getElementById("filter-color");
  const sortSelect = document.getElementById("sort");
  const gridButtons = document.querySelectorAll(".grid-btn");
  const productList = document.getElementById("product-list");

  // Register PWA service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js")
        .then(reg => console.log("Service Worker registered:", reg.scope))
        .catch(err => console.log("Service Worker registration failed:", err));
    });
  }

  // Get category from URL (e.g., ?category=dresses)
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  // Filter products by category on page load
  if (category) {
    products.forEach(product => {
      if (product.dataset.category !== category) {
        product.style.display = "none";
      }
    });

    // Update hero title dynamically
    const heroTitle = document.querySelector(".catalogue-hero h1");
    heroTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    document.title = `Catalogue | ${heroTitle.textContent} | Élégance Bridal`;
  }

  // Toggle filter sidebar
  const openFilters = () => {
    filters.classList.add("visible");
    overlay.classList.add("visible");
  };

  const closeFilters = () => {
    filters.classList.remove("visible");
    overlay.classList.remove("visible");
  };

  filterToggle?.addEventListener("click", openFilters);
  filterClose?.addEventListener("click", closeFilters);
  overlay?.addEventListener("click", closeFilters);

  // Apply filters (style/color)
  function applyFilters() {
    const style = filterStyle.value;
    const color = filterColor.value;

    products.forEach(product => {
      const matchesStyle = !style || product.dataset.style === style;
      const matchesColor = !color || product.dataset.color === color;
      const matchesCategory = !category || product.dataset.category === category;
      product.style.display = matchesStyle && matchesColor && matchesCategory ? "block" : "none";
    });
  }

  // Apply sorting
  function applySort() {
    const sortValue = sortSelect.value;
    const productArray = Array.from(products);

    productArray.sort((a, b) => {
      if (sortValue.includes("name")) {
        return sortValue === "name-asc"
          ? a.dataset.name.localeCompare(b.dataset.name)
          : b.dataset.name.localeCompare(a.dataset.name);
      } else {
        return sortValue === "price-asc"
          ? a.dataset.price - b.dataset.price
          : b.dataset.price - a.dataset.price;
      }
    });

    productArray.forEach(p => productList.appendChild(p));
  }

  // Change grid layout
  gridButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cols = btn.dataset.columns;
      productList.className = `product-grid refined-grid columns-${cols}`;
    });
  });

  filterStyle?.addEventListener("change", applyFilters);
  filterColor?.addEventListener("change", applyFilters);
  sortSelect?.addEventListener("change", applySort);
});
