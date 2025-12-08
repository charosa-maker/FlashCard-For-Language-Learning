import React from 'react';
import { Flashcard } from '../types';

interface CardProps {
  data: Flashcard;
  isFlipped: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ data, isFlipped, onClick }) => {

  const formatQuestion = (text: string): React.ReactNode => {
    // Pattern 1: Russian [Type] -> Turkish
    // Example: "What is the Turkish translation for the Russian verb 'Понимать'?"
    const rusToTrMatch = text.match(/What (?:is|are) the Turkish translations? for the Russian (\w+) '(.+?)'\?/);
    if (rusToTrMatch) {
      const type = rusToTrMatch[1].toLowerCase();
      const word = rusToTrMatch[2];
      
      let rusType = 'Русское слово'; // default
      if (type === 'verb') rusType = 'Русский глагол';
      if (type === 'adjective') rusType = 'Русское прилагательное';
      if (type === 'phrase') rusType = 'Русская фраза';
      
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl md:text-5xl font-bold mb-2">{word}</span>
          <span className="text-lg text-indigo-300 font-medium bg-white/10 px-3 py-1 rounded-full">{rusType}</span>
          <span className="text-xl md:text-2xl mt-4 text-gray-300 font-light">Türkçe karşılığı nedir?</span>
        </div>
      );
    }
    
    // Pattern 2: English Concept -> Turkish Word
    // Example: "What is the Turkish word for 'City'?"
    const engToTrMatch = text.match(/What (?:is|are) the Turkish words? for '(.+?)'\?/);
    if (engToTrMatch) {
       return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl md:text-5xl font-bold mb-4">{engToTrMatch[1]}</span>
          <span className="text-xl md:text-2xl mt-2 text-gray-300 font-light">Türkçe karşılığı nedir?</span>
        </div>
      );
    }

    // Pattern 3: Turkish [Category] -> Russian Word
    // Example: "What is the Russian word for the Turkish place 'Merkez'?"
    const trToRusMatch = text.match(/What is the Russian (word|translation) for the Turkish (\w+) '(.+?)'\?/);
    if (trToRusMatch) {
       const target = trToRusMatch[1]; // word or translation
       const category = trToRusMatch[2]; // place, transport, word
       const word = trToRusMatch[3];
       
       let trCategory = 'kelimesi';
       if (category === 'place') trCategory = 'yeri';
       if (category === 'transport') trCategory = 'aracı';
       if (category === 'word') trCategory = 'kelimesi';
       
       let rusTarget = 'Русское слово';
       if (target === 'translation') rusTarget = 'Русский перевод';

       return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl md:text-5xl font-bold mb-2">{word}</span>
          <span className="text-lg text-indigo-300 font-medium bg-white/10 px-3 py-1 rounded-full">Türkçe {trCategory}</span>
          <span className="text-xl md:text-2xl mt-4 text-gray-300 font-light">{rusTarget} nedir?</span>
        </div>
      );
    }

    // Fallback if no pattern matches
    return <span className="text-2xl">{text}</span>;
  };

  return (
    <div 
      className="relative w-full h-[500px] cursor-pointer perspective-1000 group select-none"
      onClick={onClick}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ease-out ${!isFlipped ? 'hover:scale-[1.01]' : ''}`}
        style={{
          transform: isFlipped ? 'rotateY(180deg) scale(1.02)' : undefined
        }}
      >
        {/* Front Face (Question) */}
        <div className="absolute w-full h-full backface-hidden rounded-[2rem] bg-gray-800 shadow-2xl border border-white/10 flex flex-col items-center justify-center p-8 text-center transition-colors">
          <div className="flex-1 flex items-center justify-center w-full">
             <div className="text-white leading-tight">
              {formatQuestion(data.question)}
            </div>
          </div>
          <p className="text-white/40 text-sm mt-4 font-medium tracking-wide uppercase group-hover:text-white/60 transition-colors">Cevabı gör</p>
        </div>

        {/* Back Face (Answer + Context) */}
        <div className="absolute w-full h-full backface-hidden rounded-[2rem] bg-indigo-900/90 shadow-2xl border border-indigo-500/30 rotate-y-180 flex flex-col items-center p-8 text-center shadow-indigo-500/20 overflow-hidden">
           
           <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
             {/* Main Answer */}
             <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {data.answer}
            </h2>

            {/* Optional Image */}
            {data.imageUrl && (
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                <img 
                  src={data.imageUrl} 
                  alt="Mnemonic" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Optional Example */}
            {data.example && (
              <div className="bg-white/10 rounded-xl p-4 w-full backdrop-blur-sm">
                <p className="text-indigo-200 text-lg italic leading-relaxed">
                  "{data.example}"
                </p>
              </div>
            )}
          </div>

          {!data.example && !data.imageUrl && (
             <p className="text-white/40 text-sm mt-auto font-medium tracking-wide uppercase">Kartı aşağıdan puanla</p>
          )}
        </div>
      </div>
      
      {/* Decorative Stack Effect Behind */}
      <div className={`absolute top-4 left-4 w-full h-full rounded-[2rem] bg-white/5 -z-10 blur-[1px] transition-transform duration-500 ${isFlipped ? 'translate-x-1 translate-y-1' : ''}`}></div>
      <div className={`absolute top-8 left-8 w-full h-full rounded-[2rem] bg-white/5 -z-20 blur-[2px] transition-transform duration-500 ${isFlipped ? 'translate-x-2 translate-y-2' : ''}`}></div>
    </div>
  );
};

export default Card;