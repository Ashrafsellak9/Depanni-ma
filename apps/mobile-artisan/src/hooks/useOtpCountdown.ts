import { useEffect, useState } from "react";

const OTP_DURATION_SEC = 5 * 60;

export function useOtpCountdown(active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SEC);

  useEffect(() => {
    if (!active) return;
    setSecondsLeft(OTP_DURATION_SEC);
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const reset = () => setSecondsLeft(OTP_DURATION_SEC);

  const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60,
  ).padStart(2, "0")}`;

  return { secondsLeft, formatted, canResend: secondsLeft === 0, reset };
}
