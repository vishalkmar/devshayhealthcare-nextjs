'use client';

import { useEffect, useState } from 'react';

// Typing effect for a list of phrases. Loops, with a blinking caret.
export default function Typewriter({ words = [], className = '', caretClassName = '' }) {
  const list = words.length ? words : [''];
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = list[wordIdx % list.length];
    let delay = deleting ? 45 : 90;

    if (!deleting && text === full) {
      delay = 1600; // pause at full word
    } else if (deleting && text === '') {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % list.length);
      delay = 300;
    }

    const t = setTimeout(() => {
      if (!deleting && text === full) { setDeleting(true); return; }
      const next = deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
      setText(next);
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, wordIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className}>
      {text}
      <span className={`ml-0.5 inline-block w-[3px] animate-pulse ${caretClassName}`}>|</span>
    </span>
  );
}
