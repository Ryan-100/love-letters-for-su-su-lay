import { LetterBox } from "./LetterBox";
import { Toaster } from "sonner";

export default function App() {

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
