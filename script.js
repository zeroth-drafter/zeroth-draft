// ---------- LIGHTBOX (FINAL) ----------

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let currentImages = [];
let currentIndex = 0;

if (lightbox && lightboxImg) {
  // Event delegation: works for dynamically added images
  document.addEventListener("click", (e) => {
    const img = e.target.closest(
      ".product-images img, .gallery-image img"
    );
    if (!img) return;

    const parent =
      img.closest(".image-group") || img.parentElement;

    currentImages = Array.from(parent.querySelectorAll("img"));
    currentIndex = currentImages.indexOf(img);

    openLightbox();
  });

  function openLightbox() {
    // IMPORTANT: neutralize rotation opacity
    currentImages.forEach(img => {
      img.style.opacity = "1";
    });

    lightboxImg.src = currentImages[currentIndex].src;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // Close on click / tap
  lightbox.addEventListener("click", closeLightbox);

  // Swipe support
  let startX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  });

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
  }

  function prevImage() {
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
  }
}
