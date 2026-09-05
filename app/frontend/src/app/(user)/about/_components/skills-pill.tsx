'use client';

import { useEffect, useState } from 'react';

type SkillType = {
  text: string;
};

export function SkillPill({ text }: SkillType) {
  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    // Generates safely only on the client after mounting
    const randomHex =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setTextColor(randomHex);
  }, []);

  return (
    <div
      style={{ color: textColor }}
      className='cursor-grab whitespace-nowrap rounded-full bg-[#1C1C1C] px-5 py-2 text-center font-semibold transition-colors hover:bg-[#2A2A2A] focus:cursor-grabbing md:px-13 md:py-6'
    >
      {text}
    </div>
  );
}
