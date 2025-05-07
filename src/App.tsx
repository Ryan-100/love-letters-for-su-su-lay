import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { LetterBox } from "./LetterBox";
import { Toaster } from "sonner";

export default function App() {
  const seedLetters = useMutation(api.letters.seedLetters);
  
  useEffect(() => {
    // Seed letters when app starts
    void seedLetters();
  }, [seedLetters]);

  return (
    <div className="minecraft-bg min-h-screen p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="minecraft-title text-center text-3xl md:text-4xl mb-8">
          ♥ ကိုကို့စုစုလေးအတွက် ♥
        </h1>
        <LetterBox />
      </div>
    </div>
  );
}
