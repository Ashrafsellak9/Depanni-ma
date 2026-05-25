type Handler = (() => void) | null;

let onSessionExpired: Handler = null;

export function setSessionExpiredHandler(handler: Handler): void {
  onSessionExpired = handler;
}

export function notifySessionExpired(): void {
  onSessionExpired?.();
}
