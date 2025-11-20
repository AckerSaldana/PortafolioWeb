import gsap from 'gsap';
import { customEases, durations, staggerPresets } from './gsapConfig';

/**
 * Split text into individual characters wrapped in spans
 * @param {string} text - The text to split
 * @returns {string} HTML string with wrapped characters
 */
export const splitTextToChars = (text) => {
  return text
    .split('')
    .map((char, i) => {
      const isSpace = char === ' ';
      return `<span class="char" style="display: inline-block; ${isSpace ? 'width: 0.3em;' : ''}">${isSpace ? '&nbsp;' : char}</span>`;
    })
    .join('');
};

/**
 * Split text into words wrapped in spans
 * @param {string} text - The text to split
 * @returns {string} HTML string with wrapped words
 */
export const splitTextToWords = (text) => {
  return text
    .split(' ')
    .map(word => `<span class="word" style="display: inline-block;">${word}</span>`)
    .join(' ');
};

/**
 * Split text into lines wrapped in spans
 * @param {string} text - The text to split (should contain <br> or \n for line breaks)
 * @returns {string} HTML string with wrapped lines
 */
export const splitTextToLines = (text) => {
  return text
    .split(/\n|<br\s*\/?>/i)
    .map(line => `<span class="line" style="display: block;">${line}</span>`)
    .join('');
};

/**
 * Animate text reveal character by character
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline}
 */
export const revealTextByChars = (element, options = {}) => {
  const {
    duration = durations.fast,
    stagger = staggerPresets.fast,
    ease = customEases.smooth,
    y = 30,
    opacity = 0,
    delay = 0,
  } = options;

  const chars = gsap.utils.toArray(`${element} .char`);

  return gsap.fromTo(
    chars,
    {
      opacity,
      y,
      rotationX: -90,
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration,
      stagger,
      ease,
      delay,
      force3D: true,
    }
  );
};

/**
 * Animate text reveal word by word
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline}
 */
export const revealTextByWords = (element, options = {}) => {
  const {
    duration = durations.normal,
    stagger = staggerPresets.normal,
    ease = customEases.smooth,
    y = 40,
    delay = 0,
  } = options;

  const words = gsap.utils.toArray(`${element} .word`);

  return gsap.fromTo(
    words,
    {
      opacity: 0,
      y,
      scale: 0.8,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease,
      delay,
      force3D: true,
    }
  );
};

/**
 * Animate text reveal line by line
 * @param {HTMLElement|string} element - Element or selector
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline}
 */
export const revealTextByLines = (element, options = {}) => {
  const {
    duration = durations.normal,
    stagger = staggerPresets.slow,
    ease = customEases.smooth,
    y = 50,
    delay = 0,
  } = options;

  const lines = gsap.utils.toArray(`${element} .line`);

  return gsap.fromTo(
    lines,
    {
      opacity: 0,
      y,
      clipPath: 'inset(0 0 100% 0)',
    },
    {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      duration,
      stagger,
      ease,
      delay,
      force3D: true,
    }
  );
};

/**
 * Create a scramble/glitch text effect
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} finalText - The final text to display
 * @param {Object} options - Animation options
 */
export const scrambleText = (element, finalText, options = {}) => {
  const {
    duration = 1,
    scrambleSpeed = 50,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  let frame = 0;
  const totalFrames = Math.floor((duration * 1000) / scrambleSpeed);
  const originalText = el.textContent;

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const revealIndex = Math.floor(progress * finalText.length);

    let scrambled = '';
    for (let i = 0; i < finalText.length; i++) {
      if (i < revealIndex) {
        scrambled += finalText[i];
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    el.textContent = scrambled;

    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, scrambleSpeed);

  return {
    kill: () => clearInterval(interval),
  };
};

/**
 * Typewriter effect
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} text - Text to type
 * @param {Object} options - Animation options
 */
export const typewriterEffect = (element, text, options = {}) => {
  const {
    speed = 50,
    cursor = true,
    cursorChar = '|',
    onComplete = () => {},
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  let index = 0;
  el.textContent = cursor ? cursorChar : '';

  const interval = setInterval(() => {
    if (index < text.length) {
      el.textContent = text.substring(0, index + 1) + (cursor ? cursorChar : '');
      index++;
    } else {
      if (!cursor) {
        clearInterval(interval);
        onComplete();
      } else {
        // Blink cursor
        setTimeout(() => {
          clearInterval(interval);
          el.textContent = text;
          onComplete();
        }, 500);
      }
    }
  }, speed);

  return {
    kill: () => clearInterval(interval),
  };
};

/**
 * Morphing text effect (crossfade between texts)
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} newText - New text to morph into
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline}
 */
export const morphText = (element, newText, options = {}) => {
  const {
    duration = durations.normal,
    ease = customEases.smooth,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  const tl = gsap.timeline();

  tl.to(el, {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)',
    duration: duration / 2,
    ease,
  })
    .call(() => {
      el.textContent = newText;
    })
    .to(el, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: duration / 2,
      ease,
    });

  return tl;
};

/**
 * Wave animation for text
 * @param {HTMLElement|string} element - Element or selector containing .char spans
 * @param {Object} options - Animation options
 */
export const waveText = (element, options = {}) => {
  const {
    amplitude = 10,
    frequency = 0.5,
    duration = 2,
  } = options;

  const chars = gsap.utils.toArray(`${element} .char`);

  chars.forEach((char, i) => {
    gsap.to(char, {
      y: `+=${amplitude}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * frequency / chars.length,
    });
  });
};

/**
 * Utility to prepare text element for animation
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} type - 'chars', 'words', or 'lines'
 */
export const prepareTextForAnimation = (element, type = 'chars') => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  const text = el.textContent;

  switch (type) {
    case 'chars':
      el.innerHTML = splitTextToChars(text);
      break;
    case 'words':
      el.innerHTML = splitTextToWords(text);
      break;
    case 'lines':
      el.innerHTML = splitTextToLines(text);
      break;
    default:
      el.innerHTML = splitTextToChars(text);
  }
};
