import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw } from 'lucide-react';
import { parseCSV } from './utils/csvParser';
import { Flashcard } from './types';
import { DEFAULT_CSV_DATA } from './constants';
import Card from './components/Card';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  
  // SRS State
  const [queue, setQueue] = useState<number[]>([]); // Array of indices pointing to 'cards'
  const [learned, setLearned] = useState<Set<number>>(new Set());
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize with default data
  useEffect(() => {
    const initialCards = parseCSV(DEFAULT_CSV_DATA);
    setCards(initialCards);
    // Initialize queue with all card indices [0, 1, 2, ...]
    setQueue(initialCards.map((_, idx) => idx));
    setLoading(false);
  }, []);

  const currentCardIndex = queue.length > 0 ? queue[0] : null;
  const currentCard = currentCardIndex !== null ? cards[currentCardIndex] : null;

  const handleShuffle = useCallback(() => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      // Fisher-Yates shuffle
      for (let i = newQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
      }
      return newQueue;
    });
    setIsFlipped(false);
  }, []);

  const handleReset = useCallback(() => {
    setQueue(cards.map((_, idx) => idx));
    setLearned(new Set());
    setIsFlipped(false);
  }, [cards]);

  const handleGrade = useCallback((grade: 'again' | 'hard' | 'easy') => {
    if (currentCardIndex === null) return;

    setIsFlipped(false);

    // Artificial delay for animation
    setTimeout(() => {
      setQueue(prevQueue => {
        const current = prevQueue[0];
        const remaining = prevQueue.slice(1);
        
        if (grade === 'easy') {
          // Remove from queue, mark as learned
          setLearned(prev => new Set(prev).add(current));
          return remaining;
        } else if (grade === 'hard') {
          // Re-insert at the end of the queue (or slightly sooner if queue is huge)
          return [...remaining, current];
        } else { // 'again'
          // Re-insert shortly (e.g., after 3 cards or at end if < 3)
          const reInsertIndex = Math.min(remaining.length, 3);
          const newQueue = [...remaining];
          newQueue.splice(reInsertIndex, 0, current);
          return newQueue;
        }
      });
    }, 200);
  }, [currentCardIndex]);

  const handleCardClick = () => {
    // Only allow flip if we have a card
    if (currentCard) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
            const newCards = parseCSV(content);
            if (newCards.length > 0) {
                setCards(newCards);
                setQueue(newCards.map((_, idx) => idx));
                setLearned(new Set());
                setIsFlipped(false);
            } else {
                alert("Bu dosyadan geçerli kartlar okunamadı.");
            }
        }
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!currentCard) return;

        if (e.key === ' ' || e.key === 'Enter') {
           if (!isFlipped) handleCardClick();
        }

        // Only allow grading keys if flipped
        if (isFlipped) {
            if (e.key === '1' || e.key === 'ArrowLeft') handleGrade('again');
            if (e.key === '2' || e.key === 'ArrowDown') handleGrade('hard');
            if (e.key === '3' || e.key === 'ArrowRight') handleGrade('easy');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, isFlipped, handleGrade]);

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  // Session Complete State
  if (!currentCard && cards.length > 0) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center font-sans">
              <div className="w-full max-w-md bg-gray-800 rounded-[2rem] p-8 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-2">Oturum Tamamlandı!</h2>
                <p className="text-white/60 mb-8">Sıradaki tüm kartları çalıştınız.</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleReset}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCw size={20} />
                        Tekrar Başla
                    </button>
                    
                    <label className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                        Yeni Deste Yükle
                        <input 
                            type="file" 
                            accept=".csv" 
                            onChange={handleFileUpload} 
                            className="hidden" 
                        />
                    </label>
                </div>
              </div>
          </div>
      )
  }

  if (cards.length === 0) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-xl mb-4">Kart bulunamadı</h2>
              <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
                CSV Yükle
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                />
            </label>
          </div>
      )
  }

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
        
        {/* Background Gradients (Ambient Lighting) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Main Content Area */}
        <div className="z-10 w-full max-w-md flex flex-col items-center">
            
            {/* Card Container */}
            <div className="w-full relative">
                {currentCard && (
                    <Card 
                        data={currentCard} 
                        isFlipped={isFlipped} 
                        onClick={handleCardClick} 
                    />
                )}
            </div>

            {/* Controls */}
            <Controls 
                queueLength={queue.length}
                learnedCount={learned.size}
                totalCards={cards.length}
                isFlipped={isFlipped}
                onGrade={handleGrade}
                onShuffle={handleShuffle}
                onReset={handleReset}
                onUpload={handleFileUpload}
            />
        </div>
    </div>
  );
};

export default App;