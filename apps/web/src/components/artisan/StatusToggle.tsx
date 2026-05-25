"use client";

import { useState } from "react";

export function StatusToggle() {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setIsAvailable(!isAvailable)}
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300 ${
        isAvailable
          ? "border-[rgba(27,138,78,0.2)] bg-[rgba(27,138,78,0.1)] text-green"
          : "border-[rgba(107,114,128,0.2)] bg-[rgba(107,114,128,0.1)] text-dep-gray"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isAvailable ? "animate-pulse bg-green" : "bg-dep-gray"
        }`}
      />
      {isAvailable ? "● Disponible" : "○ En pause"}
    </button>
  );
}
