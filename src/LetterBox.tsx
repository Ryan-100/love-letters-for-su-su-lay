/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from "react";
import { toast } from "sonner";
import { letters } from "./lib/data";

const moods = [
  { id: "love", emoji: "💝", label: "အချစ်တွေ" },
  { id: "romantic", emoji: "💕", label: "ကြည်နူးစရာလေးတွေ" },
  { id: "happiness", emoji: "💫", label: "ပျော်ရွှင်မှုတွေ" },
  { id: "sadness", emoji: "💔", label: "၀မ်းနည်းမှုတွေ" }
];

export function LetterBox() {
  const [selectedMood, setSelectedMood] = useState("");
  const [hearts, setHearts] = useState<{id: number, left: number, emoji: string}[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const [selectedLetter, setSelectedLetter] = useState<null | { 
    content: string; 
    title: string;
    mood: string;
  }>(null);

  const playSound = (sound: string) => {
    const sounds = {
      open: '/sounds/letter-open.mp3',
      close: '/sounds/soft-close.mp3',
      heart: '/sounds/heart-beat.mp3',
      select: '/sounds/magic-chime.mp3',
      unfold: '/sounds/paper-unfold.mp3'
    } as const;
    audioRef.current.src = sounds[sound as keyof typeof sounds];
    audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
  };

  const createHearts = (count: number) => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      emoji: ['💖', '💗', '💓', '💘', '💝', '😍','💕','💞','💓','🤍','💙','🩷','❤️','💌'][Math.floor(Math.random() * 5)]
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 3000);
  };

  const handleOpenLetter = async (letter: typeof letters[0]) => {
    if (isOpening) return;
    setIsOpening(true);
    
    try {
      playSound('heart');
      createHearts(10);
      
      // First stage: envelope opening
      await new Promise(resolve => setTimeout(resolve, 800));
      playSound('open');
      
      // Second stage: letter unfolding
      playSound('unfold');
      setSelectedLetter(letter);
    } catch (error) {
      toast.error("စာဖွင့်ရန်မအောင်မြင်ပါ");
    } finally {
      setIsOpening(false);
    }
  };

  const handleCloseLetter = () => {
    playSound('close');
    createHearts(10);
    setSelectedLetter(null);
    setSelectedMood("");
  };

  if (selectedLetter) {
    return (
      <div className="mt-8">
        <div className="envelope-container relative max-w-lg mx-auto">
          {/* Envelope back */}
          <div className="envelope-back absolute top-0 left-0 w-full h-full bg-pink-100 border-2 border-pink-300 rounded-lg"></div>
          
          {/* Letter content */}
          <div className="letter-content minecraft-paper p-6 relative z-10 transform origin-top">
            <h3 className="minecraft-text text-2xl mb-4 text-pink-500">
              {selectedLetter.title}
            </h3>
            <div className="minecraft-text text-lg mb-4" dangerouslySetInnerHTML={{__html:selectedLetter.content}}>
            </div>
            <button
              type="button"
              onClick={handleCloseLetter}
              className="minecraft-button mt-4 cursor-pointer"
            >
              ပိတ်မည်။
            </button>
          </div>
          
          {/* Envelope flap */}
          <div className="envelope-flap absolute top-0 left-0 w-full h-1/2 bg-pink-200 border-2 border-pink-300 rounded-t-lg origin-bottom animate-envelopeOpen"></div>
        </div>
        
        {/* Floating hearts */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          {hearts.map(heart => (
            <div 
              key={heart.id}
              className="absolute text-xl animate-floatUp"
              style={{
                left: `${heart.left}%`,
                bottom: '0',
                animationDelay: `${Math.random() * 0.1}s`
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 relative">
      <div>
        <div className="text-center mb-6">
          <h2 className="minecraft-text text-2xl text-pink-500">
            ခံစားချက်အလိုက် ဖတ်စေချင်တဲ့ စာလွှာလေးတွေပါ🥺
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => {
                  setSelectedMood(mood.id);
                  playSound('select');
                  createHearts(10);
                }}
                className={`minecraft-button relative transition-all ${
                  selectedMood === mood.id ? 'bg-pink-400 scale-105' : 'hover:scale-105'
                }`}
              >
                {mood.emoji} {mood.label}
                {selectedMood === mood.id && (
                  <span className="absolute -top-2 -right-2 animate-sparkle">✨</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {selectedMood && letters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {letters
              .filter(letter => letter.mood === selectedMood)
              .map((letter, index) => (
              <div 
                key={index}
                onClick={() => {
                  if (!letter.opened && !isOpening) {
                    void handleOpenLetter(letter);
                  }
                }}
                className={`envelope-closed relative cursor-pointer transition-all ${
                  isOpening ? 'pointer-events-none' : ''
                } ${letter.opened ? 'opacity-70' : 'hover:scale-105'}`}
              >
                <div className="envelope-closed-front bg-pink-200 p-4 border-2 border-pink-300 rounded-lg">
                  <h3 className="minecraft-text text-lg">{letter.title}</h3>
                  <p className="text-sm mt-2">
                    {letter.opened ? "ဖွင့်ပြီးသား" : "ဖွင့်ရန်နှိပ်ပါ"}
                  </p>
                  {!letter.opened && (
                    <div className="absolute top-2 right-2 animate-pulse">💌</div>
                  )}
                </div>
                {!letter.opened && isOpening && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="animate-spin">💝</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Floating hearts */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {hearts.map(heart => (
            <div 
              key={heart.id}
              className="absolute text-xl animate-floatUp"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}