
const soundControl = document.getElementById('soundControl');
let soundsEnabled = true;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSound = null;

const soundSources = {
  intro: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'],
  click: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3']
};

function playSound(type) {
  if (!soundsEnabled) return;
  if (currentSound) currentSound.stop();
  const soundUrl = soundSources[type][0];
  fetch(soundUrl).then(r => r.arrayBuffer()).then(buf => audioContext.decodeAudioData(buf)).then(decoded => {
    const src = audioContext.createBufferSource();
    src.buffer = decoded;
    src.connect(audioContext.destination);
    src.start(0);
    currentSound = src;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('localInvoiceBtn').onclick = async function(e) {
    e.preventDefault();
    playSound('click');
    const path = 'file:///L:/HTML%20System/Invoice%20Management%20System/Invoice.html';
    try {
      const opened = window.open(path, '_blank');
      if (!opened) throw new Error('Blocked');
    } catch (err) {
      try {
        await navigator.clipboard.writeText(path);
        alert("Network path copied to clipboard. Please paste in browser or File Explorer.");
      } catch {
        prompt("Please copy this path manually:", path);
      }
    }
  };

  soundControl.onclick = () => {
    soundsEnabled = !soundsEnabled;
    soundControl.textContent = soundsEnabled ? '🔊' : '🔇';
    playSound('click');
  };

  setTimeout(() => {
    if (audioContext.state === 'suspended') audioContext.resume();
    playSound('intro');
  }, 500);
});
