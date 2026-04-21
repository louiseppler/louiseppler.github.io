export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function distanceToText(distance: string) : string {
    var d = parseFloat(distance);

    if(d < 1000) {
        return Math.round(d) + "\u202Fm";
    }

    return "" + (Math.round(d/100)/10) + "\u202Fkm";
}