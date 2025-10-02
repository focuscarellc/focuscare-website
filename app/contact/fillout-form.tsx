"use client"

import { FilloutStandardEmbed } from "@fillout/react";
import { Fullscreen } from "lucide-react";

export default function FilloutForm() {
  return (
      // <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Send Us a Message</h2>
    <div 
      style={{
        width: "100%",
        height: "100%",
      }}
      className="bg-white rounded-lg shadow-md dark:bg-slate-800"  
    >
      <FilloutStandardEmbed filloutId="hjrSZDYEhjus" />
    </div>
  );
}