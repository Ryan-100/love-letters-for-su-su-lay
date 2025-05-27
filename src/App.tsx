import React from "react";
import { LetterBox } from "./LetterBox";
import { toast, Toaster } from "sonner";
import { SoundControl } from "./SoundControl";

export default function App() {
  React.useEffect(() => {
    document.body.style.userSelect = 'none';
    
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.info('စုစုလေးအတွက်ရေးထားတဲ့စာတွေမို့ ကူးယူခွင့်မပြုပါ။', {
        position: 'top-center',
        duration: 2000,
      });
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);
  return (
    <div className="minecraft-bg min-h-screen p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="minecraft-title text-center text-3xl md:text-4xl mb-8">
          ♥ ကိုကို့စုစုလေးအတွက် ♥
        </h1>
        <LetterBox />
      </div>
      <SoundControl />
    </div>
  );
}
