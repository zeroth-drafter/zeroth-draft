document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     MUSIC PLAYER
  =============================== */

  const audio = document.getElementById("globalAudio");
  const playerBar = document.getElementById("playerBar");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const loopBtn = document.getElementById("loopBtn");
  const progressBar = document.getElementById("progressBar");

  const playerArt = document.getElementById("playerArt");
  const playerTrackTitle = document.getElementById("playerTrackTitle");
  const playerTrackNumber = document.getElementById("playerTrackNumber");

  const trackEls = document.querySelectorAll(".album-art");
  let tracks = [];
  let currentIndex = 0;
  let isPlaying = false;

  trackEls.forEach((el, index) => {
    tracks.push({
      audio: el.dataset.audio,
      art: el.querySelector("img")?.src || "",
      title: el.closest(".track")?.querySelector(".track-title")?.textContent || "",
      number: el.closest(".track")?.querySelector(".track-number")?.textContent || "",
    });

    el.addEventListener("click", () => {
      loadTrack(index);
      togglePlay(true);
    });
  });

  function loadTrack(index) {
    if (!audio || !tracks[index]) return;

    currentIndex = index;
    audio.src = tracks[index].audio;
    audio.load();

    if (playerArt) playerArt.src = tracks[index].art;
    if (playerTrackTitle) playerTrackTitle.textContent = tracks[index].title;
    if (playerTrackNumber) playerTrackNumber.textContent = tracks[index].number;

    if (playerBar) playerBar.classList.remove("hidden");
  }

  function togglePlay(forcePlay = false) {
    if (!audio) return;

    if (forcePlay || audio.paused) {
      audio.play();
      isPlaying = true;
      if (playPauseBtn) playPauseBtn.textContent = "⏸";
    } else {
      audio.pause();
      isPlaying = false;
      if (playPauseBtn) playPauseBtn.textContent = "▶";
    }
  }

  playPauseBtn?.addEventListener("click", () => togglePlay());
  prevBtn?.addEventListener("click", () => loadTrack((currentIndex - 1 + tracks.length) % tracks.length));
  nextBtn?.addEventListener("click", () => loadTrack((currentIndex + 1) % tracks.length));

  loopBtn?.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.style.opacity = audio.loop ? "1" : "0.5";
  });

  audio?.addEventListener("timeupdate", () => {
    if (!progressBar || !audio.duration) return;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  });

  progressBar?.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  audio?.addEventListener("ended", () => {
    if (!audio.loop) {
      loadTrack((currentIndex + 1) % tracks.length);
      togglePlay(true);
    }
  });

  /* ===============================
     INFO & SUPPORT MODALS
  =============================== */

  const infoBtn = document.getElementById("infoBtn");
  const infoModal = document.getElementById("infoModal");
  const closeInfo = document.getElementById("closeInfo");

  infoBtn?.addEventListener("click", () => infoModal.classList.remove("hidden"));
  closeInfo?.addEventListener("click", () => infoModal.classList.add("hidden"));

  const supportBtns = document.querySelectorAll(".supportBtn");
  const supportModal = document.getElementById("supportModal");
  const closeSupport = document.getElementById("closeSupport");
  const continueSupport = document.getElementById("continueSupport");

  supportBtns.forEach(btn =>
    btn.addEventListener("click", () => supportModal?.classList.remove("hidden"))
  );

  closeSupport?.addEventListener("click", () => supportModal.classList.add("hidden"));
  continueSupport?.addEventListener("click", () => {
    window.location.href = "contribute.html";
  });

  /* ===============================
     LIGHTBOX (GALLERY FULLSCREEN)
  =============================== */

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (lightbox && lightboxImg) {
    let currentImages = [];
    let imgIndex = 0;
    let startX = 0;

    document.addEventListener("click", (e) => {
      const img = e.target.closest(".product-images img, .gallery-image img");
      if (!img) return;

      const parent = img.closest(".image-group") || img.parentElement;
      currentImages = Array.from(parent.querySelectorAll("img"));
      imgIndex = currentImages.indexOf(img);

      openLightbox();
    });

    function openLightbox() {
      lightboxImg.src = currentImages[imgIndex].src;
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.add("hidden");
      document.body.style.overflow = "";
    }

    lightbox.addEventListener("click", closeLightbox);

    lightbox.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50 && currentImages.length > 1) {
        imgIndex = diff > 0
          ? (imgIndex + 1) % currentImages.length
          : (imgIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[imgIndex].src;
      }
    });
  }

});
