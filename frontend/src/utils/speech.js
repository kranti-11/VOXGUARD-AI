// Browser Speech Synthesis for VoxGuard Voice Conversations

let currentUtterance = null;

export const playConversationAudio = (transcript, onTurnChange, onEnd) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return { stop: () => {} };
  }

  // Cancel any running speech
  window.speechSynthesis.cancel();

  let currentIndex = 0;
  let isStopped = false;

  const voices = window.speechSynthesis.getVoices();
  // Attempt to select distinct voices or use pitch/rate modulation
  const femaleVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Female') || v.name.includes('Zira'));
  const maleVoice = voices.find(v => v.name.includes('Alex') || v.name.includes('Google UK English Male') || v.name.includes('Male') || v.name.includes('David'));

  const speakTurn = (index) => {
    if (isStopped || index >= transcript.length) {
      if (onEnd) onEnd();
      return;
    }

    const turn = transcript[index];
    if (onTurnChange) onTurnChange(index, turn);

    const utterance = new SpeechSynthesisUtterance(turn.text);
    currentUtterance = utterance;

    if (turn.speaker === 'agent') {
      utterance.rate = 1.05;
      utterance.pitch = 1.1; // crisp professional voice
      if (femaleVoice) utterance.voice = femaleVoice;
    } else {
      utterance.rate = 0.95;
      utterance.pitch = 0.85; // distinct customer voice
      if (maleVoice) utterance.voice = maleVoice;
    }

    utterance.onend = () => {
      if (!isStopped) {
        // Small natural pause between turns
        setTimeout(() => {
          speakTurn(index + 1);
        }, 500);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis turn error:', e);
      if (!isStopped && index + 1 < transcript.length) {
        speakTurn(index + 1);
      } else if (onEnd) {
        onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakTurn(0);

  return {
    stop: () => {
      isStopped = true;
      window.speechSynthesis.cancel();
      if (onEnd) onEnd();
    }
  };
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

