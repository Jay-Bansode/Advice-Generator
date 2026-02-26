const adviceText = document.querySelector(".text");
const adviceId = document.querySelector(".title");
const diceBtn = document.getElementById("trigger-advice");
const copyBtn = document.getElementById("copy-btn");
const ttsBtn = document.getElementById("tts-btn");
const shareBtn = document.getElementById("share-btn");

// GSAP entrance animation
gsap.from(".container", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "back.out(1.7)"
});

const displayAdvice = (advice, id) => {
  // Animate out
  gsap.to(".text, .title", {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      adviceId.innerText = `Advice #${id}`;
      adviceText.innerText = `"${advice}"`;

      // Animate in
      gsap.to(".text, .title", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });
};

const fetchAdvice = async () => {
  // Add rotation animation to dice
  gsap.to(".dice-button img", { rotation: "+=360", duration: 0.6, ease: "power2.inOut" });

  try {
    const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
    const data = await res.json();
    const { id, advice } = data.slip;

    displayAdvice(advice, id);
  } catch (error) {
    console.error("Error fetching advice:", error);
    adviceText.innerText = "Failed to fetch advice. Please try again.";
  }
};

// Features
const copyToClipboard = () => {
  const text = adviceText.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="ph ph-check"></i>';
    gsap.from(copyBtn, { scale: 1.2, duration: 0.3 });
    setTimeout(() => {
      copyBtn.innerHTML = originalIcon;
    }, 2000);
  });
};

const speakAdvice = () => {
  const text = adviceText.innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.rate = 0.9;

  // Visual feedback during speech
  utterance.onstart = () => {
    gsap.to(ttsBtn, { color: "#52ffa8", scale: 1.2, duration: 0.3 });
    // Disable dice button
    diceBtn.disabled = true;
    gsap.to(diceBtn, { opacity: 0.5, pointerEvents: "none", duration: 0.3 });
  };
  utterance.onend = () => {
    gsap.to(ttsBtn, { color: "white", scale: 1, duration: 0.3 });
    // Re-enable dice button
    diceBtn.disabled = false;
    gsap.to(diceBtn, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
  };

  speechSynthesis.speak(utterance);
};

const shareOnTwitter = () => {
  const text = encodeURIComponent(adviceText.innerText);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
};

// Event Listeners
diceBtn.addEventListener("click", fetchAdvice);
copyBtn.addEventListener("click", copyToClipboard);
ttsBtn.addEventListener("click", speakAdvice);
shareBtn.addEventListener("click", shareOnTwitter);

// Initial load
fetchAdvice();
