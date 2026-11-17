
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const orb = document.querySelector(".orb");

// Add messages to the chat
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// SAGEON's personality
function getResponse(text) {
  const msg = text.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi"))
    return "Greetings, Master. SAGEON is ready to assist you.";

  if (msg.includes("your name"))
    return "I am SAGEON AI, your personal intelligent assistant.";

  if (msg.includes("who created you"))
    return "I am being developed by my Master.";

  if (msg.includes("how are you"))
    return "All systems operational, Master.";

  if (msg.includes("appraisal"))
    return "Appraisal Mode activated. Please provide the information for analysis.";

  if (msg.includes("help"))
    return "Certainly, Master. What assistance do you require?";

  return "Message received, Master. My intelligence system is still under development.";
}

// Make SAGEON speak
function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);
  voice.rate = 0.95;
  voice.pitch = 1.05;
  voice.volume = 1;

  window.speechSynthesis.speak(voice);
}

// Orb animation
function setOrbState(state) {
  orb.classList.remove("listening", "thinking", "speaking");

  if (state) {
    orb.classList.add(state);
  }
}

// Send a message
function sendMessage() {
  const text = userInput.value.trim();

  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  setOrbState("thinking");

  setTimeout(() => {
    const reply = getResponse(text);

    addMessage(reply, "bot");

    setOrbState("speaking");

    speak(reply);

    setTimeout(() => {
      setOrbState("");
    }, 3000);

  }, 900);
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Microphone recognition
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;

  micBtn.addEventListener("click", () => {
    try {
      recognition.start();
      setOrbState("listening");
      micBtn.textContent = "🔴";
    } catch (error) {
      console.log("Microphone is busy.");
    }
  });

  recognition.onresult = (event) => {
    userInput.value = event.results[0][0].transcript;
    sendMessage();
  };

  recognition.onend = () => {
    micBtn.textContent = "🎙️";
    setOrbState("");
  };

} else {
  micBtn.addEventListener("click", () => {
    addMessage("Voice recognition is not supported in this browser.", "bot");
  });
}

console.log("SAGEON AI initialized.");
