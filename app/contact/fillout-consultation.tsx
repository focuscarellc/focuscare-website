"use client"

import { useState } from "react";
import { FilloutPopupEmbed } from "@fillout/react";
import { PhoneCallIcon } from "lucide-react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button  className="" 
      onClick={() => setIsOpen(true)}>Book a Free Consultation</button>

      <FilloutPopupEmbed
        filloutId="hGDrK5qnB8us"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default App;

