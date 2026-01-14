document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("globalAudio");
  const tracks = Array.from(document.querySelectorAll(".track"));

  let currentIndex = -1;

  // OPTIONAL PLAYER BAR ELEMENTS (SAFE GUARDS)
  const playerBar = document.getElementById("playerBar");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const trackTitle = document.getElementById("playerTrackTitle");
  const trackNumber = document.getElementById("playerTrackNumber");
  const playerArt = document.getElementById("playerArt");

  /* ---------- CORE FUNCTIONS ---------- */

  function loadTrack(index) {
    const track = tracks[index];
    if (!track) return;

    const album = track.querySelector(".album-art");
    const img = album.querySelector("img");

    audio.src = album.dataset.audio;
    audio.load();
    audio.play();

    currentIndex = index;
    document.body.classList.add("listening");

    if (playerBar) playerBar.classList.remove("hidden");
    if (trackTitle) trackTitle.textContent = track.querySelector(".track-title").textContent;
    if (trackNumber) trackNumber.textContent = track.querySelector(".track-number").textContent;
    if (playerArt) playerArt.src = img.src;

    setActivePlayButton();
    if (playPauseBtn) playPauseBtn.textContent = "❚❚";
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play();
      document.body.classList.add("listening");
      if (playPauseBtn) playPauseBtn.textContent = "❚❚";
    } else {
      audio.pause();
      document.body.classList.remove("listening");
      if (playPauseBtn) playPauseBtn.textContent = "▶";
    }
  }

  function setActivePlayButton() {
    document.querySelectorAll(".play-btn").forEach(btn => {
      btn.textContent = "▶";
    });

    if (currentIndex >= 0) {
      const activeBtn = tracks[currentIndex].querySelector(".play-btn");
      if (activeBtn) activeBtn.textContent = "❚❚";
    }
  }

  /* ---------- TRACK PLAY BUTTONS ---------- */

  tracks.forEach((track, index) => {
    const playBtn = track.querySelector(".play-btn");
    if (!playBtn) return;

    playBtn.addEventListener("click", () => {
      if (currentIndex !== index) {
        loadTrack(index);
      } else {
        togglePlay();
      }
    });
  });

  /* ---------- PLAYER BAR CONTROLS (OPTIONAL) ---------- */

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlay);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (tracks.length === 0) return;
      loadTrack((currentIndex + 1) % tracks.length);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (tracks.length === 0) return;
      loadTrack((currentIndex - 1 + tracks.length) % tracks.length);
    });
  }

  /* ---------- PROGRESS BAR (OPTIONAL) ---------- */

  if (progressBar) {
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    });

    progressBar.addEventListener("input", () => {
      if (!audio.duration) return;
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
  }

  /* ---------- INFO MODAL ---------- */

  const infoBtn = document.getElementById("infoBtn");
  const infoModal = document.getElementById("infoModal");
  const closeInfo = document.getElementById("closeInfo");

  if (infoBtn && infoModal && closeInfo) {
    infoBtn.addEventListener("click", () => {
      infoModal.classList.remove("hidden");
    });

    closeInfo.addEventListener("click", () => {
      infoModal.classList.add("hidden");
    });

    infoModal.addEventListener("click", (e) => {
      if (e.target === infoModal) {
        infoModal.classList.add("hidden");
      }
    });
  }
});

// --- Support Artist Popup Logic ---
const supportModal = document.getElementById("supportModal");
const closeSupport = document.getElementById("closeSupport");
const continueSupport = document.getElementById("continueSupport");

document.querySelectorAll(".supportBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    supportModal.classList.remove("hidden");
  });
});

closeSupport.addEventListener("click", () => {
  supportModal.classList.add("hidden");
});

continueSupport.addEventListener("click", () => {
  window.open(
    "https://docs.google.com/forms/d/10wczcGtOYbHLk2_O1Adk4LRxZ2_W8SLrEXyza7ScF6A/viewform?edit_requested=true",
    "_blank"
  );
});

