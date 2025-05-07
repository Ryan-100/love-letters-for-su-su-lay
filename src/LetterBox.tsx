import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

const moods = [
  { id: "love", emoji: "💝", label: "အချစ်တွေ" },
  { id: "romantic", emoji: "💕", label: "ကြည်နူးစရာလေးတွေ" },
  { id: "happiness", emoji: "💫", label: "ပျော်ရွှင်မှုတွေ" },
  { id: "sadness", emoji: "💔", label: "၀မ်းနည်းမှုတွေ" }
];

const HEART_EMOJIS = ['💖', '💗', '💓', '💘', '💝', '💞', '💟', '❣️', '❤️'];

export function LetterBox() {
  const [selectedMood, setSelectedMood] = useState("");
  const [hearts, setHearts] = useState<{id: number, left: number, emoji: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  
  const letters = useQuery(api.letters.getLettersByMood, 
    selectedMood ? { mood: selectedMood } : "skip"
  );
  const openLetter = useMutation(api.letters.openLetter);
  const [selectedLetter, setSelectedLetter] = useState<null | { 
    _id: Id<"letters">; 
    content: string; 
    title: string 
  }>(null);

  const playSound = (sound: 'open' | 'close' | 'heart' | 'select') => {
    const sounds = {
      open: '/sounds/letter-open.mp3',
      close: '/sounds/soft-close.mp3',
      heart: '/sounds/heart-beat.mp3',
      select: '/sounds/magic-chime.mp3'
    };
    audioRef.current.src = sounds[sound];
    audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
  };

  const createHearts = (count: number) => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 3000);
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    playSound('select');
    createHearts(3);
  };

  const handleOpenLetter = async (letterId: Id<"letters">) => {
    try {
      playSound('heart');
      createHearts(5);
      
      const letter = await openLetter({ letterId });
      if (letter) {
        playSound('open');
        setSelectedLetter(letter);
      }
    } catch (error) {
      toast.error("စာဖွင့်ရန်မအောင်မြင်ပါ");
    }
  };

  const handleCloseLetter = () => {
    playSound('close');
    createHearts(3);
    setSelectedLetter(null);
    setSelectedMood("");
  };

  if (selectedLetter) {
    return (
      <div className="mt-8 animate-letterOpen">
        <div className="minecraft-paper p-6 max-w-lg mx-auto">
          <h3 className="minecraft-text text-2xl mb-4 text-pink-500">
            {selectedLetter.title}
          </h3>
          <div className="minecraft-text text-lg mb-4">
            {selectedLetter.content}
          </div>
          <button
            type="button"
            onClick={handleCloseLetter}
            className="minecraft-button mt-4 cursor-pointer animate-heartBeat"
          >
            ပိတ်မည်။
          </button>
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
                animationDelay: `${Math.random() * 0.5}s`
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
    <div className="mt-8">
      <div>
        <div className="text-center mb-6">
          <h2 className="minecraft-text text-2xl text-pink-500">
            စုစုလေးနှလုံးသားလေးထဲ ဘာတွေခံစားနေရလဲ🥺
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`minecraft-button relative ${
                  selectedMood === mood.id ? 'bg-pink-400 after:content-["✨"] after:absolute after:-top-2 after:-right-2' : ''
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </div>
        
        {selectedMood && letters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {letters.map((letter) => (
              <div
                key={letter._id}
                onClick={() => {
                  if (!letter.opened) {
                    void handleOpenLetter(letter._id);
                  }
                }}
                className={`minecraft-letter ${letter.opened ? 'opened' : 'hover:scale-105'} transition-transform`}
              >
                <h3 className="minecraft-text text-lg">{letter.title}</h3>
                <p className="text-sm mt-2">
                  {letter.opened ? "ဖွင့်ပြီးသား" : "ဖွင့်ရန်နှိပ်ပါ"}
                </p>
                {!letter.opened && (
                  <div className="absolute top-2 right-2 animate-pulse">💌</div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Floating hearts for mood selection */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          {hearts.map(heart => (
            <div 
              key={heart.id}
              className="absolute text-xl animate-floatUp"
              style={{
                left: `${heart.left}%`,
                bottom: '10vh',
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