document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     UTIL — ORDER ID
  ========================= */
  function generateOrderID() {
    const d = new Date();
    const date =
      String(d.getFullYear()).slice(-2) +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(100 + Math.random() * 900);
    return `ZD-${date}-${rand}`;
  }

  /* =========================
     IMAGE SLIDESHOW
  ========================= */
  document.querySelectorAll(".product-images").forEach(container => {
    const images = container.querySelectorAll("img");
    if (images.length <= 1) return;

    let index = 0;
    let interval;

    images.forEach((img, i) => {
      img.style.position = "absolute";
      img.style.inset = "0";
      img.style.opacity = i === 0 ? "1" : "0";
      img.style.transition = "opacity 0.6s ease";
    });

    function start() {
      interval = setInterval(() => {
        images[index].style.opacity = "0";
        index = (index + 1) % images.length;
        images[index].style.opacity = "1";
      }, 4000);
    }

    function stop() {
      clearInterval(interval);
    }

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
    start();
  });

  /* =========================
     STOCK / PREORDER UI
  ========================= */
function updateProductUI(card) {
  const stock = parseInt(card.dataset.stock, 10);
  const preorderAllowed = card.dataset.preorder === "true";

  const stockLine = card.querySelector(".stock-line");
  const addToCartBtn = card.querySelector("[data-action='add-to-cart']");
  const buyNowBtn = card.querySelector(".buy-now-btn");
  const preorderBtn = card.querySelector(".preorder-btn");

  if (stock <= 0) {
    stockLine.textContent = "Oops, sold out!";

    if (addToCartBtn) addToCartBtn.disabled = true;
    if (buyNowBtn) buyNowBtn.style.display = "none";

    if (preorderAllowed && preorderBtn) {
      preorderBtn.style.display = "inline-block";
    }

    return;
  }

  // In stock
  stockLine.textContent = stock <= 3 ? `only ${stock} left` : "in stock";

  if (addToCartBtn) addToCartBtn.disabled = false;
  if (buyNowBtn) buyNowBtn.style.display = "inline-block";
  if (preorderBtn) preorderBtn.style.display = "none";
}


  document.querySelectorAll(".product-card").forEach(updateProductUI);

  /* =========================
     PREORDER MODAL + PREFILL
  ========================= */
  const preorderModal = document.getElementById("preorderModal");
  const closePreorder = document.getElementById("closePreorder");
  const preorderFormBtn = document.getElementById("preorderFormBtn");

  let preorderProductName = "";

  document.querySelectorAll(".preorder-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      preorderProductName = card.dataset.name;
      preorderModal.classList.remove("hidden");
    });
  });

  closePreorder.addEventListener("click", () => {
    preorderModal.classList.add("hidden");
  });

  preorderModal.addEventListener("click", e => {
    if (e.target === preorderModal) preorderModal.classList.add("hidden");
  });

  preorderFormBtn.addEventListener("click", () => {
    const orderID = generateOrderID();

    const preorderText = encodeURIComponent(
      `${preorderProductName}\nOrder ID: ${orderID}`
    );

    const preorderFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSeQg9MGIqghwncJJ0Ps37FlWRU-_XX0yG9_pzlZTGFSuFTcLw/viewform" +
      "?entry.1904952198=" + preorderText;

    window.open(preorderFormURL, "_blank");
  });

  /* =========================
     CART + CHECKOUT PREFILL
  ========================= */
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  const cartWrapper = document.querySelector(".cart-wrapper");
  const cartBtn   = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const buyNowBtn = document.getElementById("buyNowBtn");

  function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;
    cartItems.innerHTML = "";

    for (const name in cart) {
      const item = cart[name];
      totalItems += item.qty;
      totalPrice += item.qty * item.price;

      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span class="cart-name">${name}</span>
        <span class="cart-unit-price">₹${item.price}</span>
        <button class="qty-btn" data-action="decrease" data-name="${name}">−</button>
        <span class="cart-qty">${item.qty}</span>
        <button class="qty-btn" data-action="increase" data-name="${name}">+</button>
      `;
      cartItems.appendChild(li);
    }

    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: ₹${totalPrice}`;

    if (cartWrapper) {
      cartWrapper.style.display = totalItems ? "flex" : "none";
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  /* ADD TO CART → REDUCE STOCK */
  document.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-action='add-to-cart']");
    if (!btn) return;

    const card = btn.closest(".product-card");
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    let stock = parseInt(card.dataset.stock, 10);

    if (stock <= 0) return;

    card.dataset.stock = stock - 1;

    if (!cart[name]) cart[name] = { qty: 1, price };
    else cart[name].qty++;

    updateProductUI(card);
    updateCartUI();
  });

  cartItems.addEventListener("click", e => {
  const action = e.target.dataset.action;
  const name = e.target.dataset.name;
  if (!cart[name]) return;

  const card = document.querySelector(
    `.product-card[data-name="${CSS.escape(name)}"]`
  );

  if (!card) return;

  let stock = parseInt(card.dataset.stock, 10);

  // INCREASE (+)
  if (action === "increase") {
    if (stock <= 0) return; // ❌ no stock, no increment

    cart[name].qty++;
    card.dataset.stock = stock - 1;
    updateProductUI(card);
  }

  // DECREASE (−)
  if (action === "decrease") {
    cart[name].qty--;
    card.dataset.stock = stock + 1;
    updateProductUI(card);

    if (cart[name].qty <= 0) {
      delete cart[name];
    }
  }

  updateCartUI();
});


  cartBtn.addEventListener("click", () => {
    cartModal.classList.add("show");
  });

  cartModal.addEventListener("click", e => {
    if (e.target === cartModal || e.target.classList.contains("modal-x")) {
      cartModal.classList.remove("show");
    }
  });

/* =========================
   PRODUCT BUY NOW → ADD + OPEN CART
========================= */
document.body.addEventListener("click", e => {
  const btn = e.target.closest(".buy-now-btn");
  if (!btn) return;

  // Prevent action if visually disabled
  if (btn.classList.contains("disabled")) return;

  const card = btn.closest(".product-card");
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price, 10);
  let stock = parseInt(card.dataset.stock, 10);

  // HARD STOP if stock is 0
  if (stock <= 0) {
    // Optional: open preorder modal instead
    const preorderBtn = card.querySelector(".preorder-btn");
    if (preorderBtn) preorderBtn.click();
    return;
  }

  // Reduce stock
  card.dataset.stock = stock - 1;

  // Add to cart
  if (!cart[name]) cart[name] = { qty: 1, price };
  else cart[name].qty++;

  updateProductUI(card);
  updateCartUI();

  cartModal.classList.add("show");
});



  /* =========================
     BUY NOW → PREFILL + CLEAR
  ========================= */
  buyNowBtn.addEventListener("click", () => {
    let itemsText = "";
    let totalPrice = 0;

    for (const name in cart) {
      const item = cart[name];
      itemsText += `${name} × ${item.qty}\n`;
      totalPrice += item.qty * item.price;
    }

    const orderID = generateOrderID();

    const encodedItems = encodeURIComponent(
      itemsText.trim() + `\n\nOrder ID: ${orderID}`
    );
    const encodedTotal = encodeURIComponent(totalPrice);

    const checkoutFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSfLXUxdLJ03PLlS8Tfm64NgyQ5PxpAc_7fSudfwjWd52mDdIA/viewform" +
      "?entry.1904952198=" + encodedItems +
      "&entry.32374466=" + encodedTotal;

    window.open(checkoutFormURL, "_blank");

    /* AUTO-CLEAR CART */
    localStorage.removeItem("cart");
    for (const key in cart) delete cart[key];
    updateCartUI();
  });

  updateCartUI();
});
