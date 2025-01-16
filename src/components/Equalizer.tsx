import React from 'react';

const style = document.createElement('style');
style.textContent = `
  @keyframes equalizer {
    0% {
      height: 15%;
    }
    100% {
      height: 100%;
    } 
  }
`;
document.head.appendChild(style);

export const Equalizer: React.FC = () => (
  <div className="flex items-end justify-center gap-1 h-64 mb-8 p-4">
    {[...Array(16)].map((_, i) => (
      <div
        key={i}
        className="w-3 bg-gradient-to-t from-[#1DB954] to-[#1ed760] rounded-full transform-gpu"
        style={{
          height: `${Math.max(15, Math.random() * 100)}%`,
          animation: `equalizer 1s ease-in-out ${i * 0.1}s infinite alternate`
        }}
      />
    ))}
  </div>
);