"use client"

import { useState } from "react";
import { FilloutPopupEmbed } from "@fillout/react";
import { PhoneCallIcon } from "lucide-react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="bg-primary rounded-lg p-2.5 font-semibold text-white w-full" 
      onClick={() => setIsOpen(true)}>Schedule a Call</button>

      <FilloutPopupEmbed
        filloutId="hGDrK5qnB8us"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default App;

