export function vibrate30sPattern() {
  const pattern: number[] = [0]; // start immediately
  const vibrate = 500; // vibrate 0.5s
  const pause = 200; // pause 0.2s
  let total = 0;

  while (total < 30000) {
    pattern.push(vibrate, pause);
    total += vibrate + pause;
  }

  return pattern;
}
