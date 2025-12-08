import React from 'react';
import { RotateCw, Upload, Shuffle, Check, X, Clock } from 'lucide-react';

interface ControlsProps {
  queueLength: number;
  learnedCount: number;
  totalCards: number;
  isFlipped: boolean;
  onGrade: (grade: 'again' | 'hard' | 'easy') => void;
  onShuffle: () => void;
  onReset: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Controls: React.FC<ControlsProps> = ({
  queueLength,
  learnedCount,
  totalCards,
  isFlipped,
  onGrade,
  onShuffle,
  onReset,
  onUpload
}) => {
  // Calculate Progress Percentages
  const learnedPercent = totalCards > 0 ? (learnedCount / totalCards) * 100 : 0;
  // Queue percent fills the rest (excluding learned)
  const queuePercent = 100 - learnedPercent;

  return (
    <div className="w-full max-w-md mx-auto mt-8 flex flex-col gap-6 px-4">
      
      {/* Grading Controls Area */}
      <div className="h-20 flex items-center justify-center">
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Again Button */}
            <button
              onClick={() => onGrade('again')}
              className="flex flex-col items-center justify-center gap-1 bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-400 rounded-xl py-3 transition-all active:scale-95 group"
            >
              <X size={20} className="mb-1" />
              <span className="text-xs font-bold uppercase tracking-wider">Tekrar</span>
              <span className="text-[10px] opacity-60 group-hover:text-white/80">Bilemedim</span>
            </button>

            {/* Hard Button */}
            <button
              onClick={() => onGrade('hard')}
              className="flex flex-col items-center justify-center gap-1 bg-yellow-500/10 border border-yellow-500/50 hover:bg-yellow-500 hover:text-black text-yellow-400 rounded-xl py-3 transition-all active:scale-95 group"
            >
              <Clock size={20} className="mb-1" />
              <span className="text-xs font-bold uppercase tracking-wider">Zor</span>
              <span className="text-[10px] opacity-60 group-hover:text-black/60">+5 Kart</span>
            </button>

            {/* Easy Button */}
            <button
              onClick={() => onGrade('easy')}
              className="flex flex-col items-center justify-center gap-1 bg-green-500/10 border border-green-500/50 hover:bg-green-500 hover:text-white text-green-400 rounded-xl py-3 transition-all active:scale-95 group"
            >
              <Check size={20} className="mb-1" />
              <span className="text-xs font-bold uppercase tracking-wider">Kolay</span>
              <span className="text-[10px] opacity-60 group-hover:text-white/80">Öğrenildi</span>
            </button>
          </div>
        ) : (
          <div className="text-white/30 text-sm font-medium animate-pulse">
            Cevabı görmek için karta dokun
          </div>
        )}
      </div>

      {/* Progress & Tools Row */}
      <div className="flex items-center gap-4 text-white/60">
        
        {/* Shuffle Button */}
        <button 
          onClick={onShuffle}
          className="p-2 hover:text-white transition-colors"
          title="Karıştır"
        >
          <Shuffle size={20} />
        </button>

        {/* Segmented Progress Bar */}
        <div className="flex-1 flex flex-col gap-1.5">
           <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider px-1">
             <span className="text-green-400">Öğrenilen ({learnedCount})</span>
             <span className="text-gray-400">Kalan ({queueLength})</span>
           </div>
           <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
                {/* Learned Segment */}
                <div 
                    className="h-full bg-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${learnedPercent}%` }}
                ></div>
                 {/* Queue Segment (Implicitly the background, but we can style it if needed) */}
                 <div className="h-full bg-gray-700 flex-1"></div>
            </div>
        </div>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="p-2 hover:text-white transition-colors"
          title="Sıfırla"
        >
          <RotateCw size={20} />
        </button>

         {/* Upload Button */}
         <label className="p-2 hover:text-white transition-colors cursor-pointer" title="CSV Yükle">
          <Upload size={20} />
          <input 
            type="file" 
            accept=".csv" 
            onChange={onUpload} 
            className="hidden" 
          />
        </label>
      </div>
    </div>
  );
};

export default Controls;