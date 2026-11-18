type FrameCallback = (now: number) => void;

interface Subscriber {
  id: number;
  priority: number;
  cb: FrameCallback;
}

class SharedAnimationClock {
  private subscribers: Subscriber[] = [];
  private nextId = 1;
  private rafId: number | null = null;

  private tick = (now: number) => {
    if (this.subscribers.length === 0) {
      this.rafId = null;
      return;
    }
    // Iterate snapshot safely in case a callback unmounts during tick
    const list = this.subscribers.slice();
    for (let i = 0; i < list.length; i++) {
      list[i].cb(now);
    }
    if (this.subscribers.length > 0) {
      this.rafId = window.requestAnimationFrame(this.tick);
    } else {
      this.rafId = null;
    }
  };

  subscribe(priority: number, cb: FrameCallback): () => void {
    const id = this.nextId++;
    this.subscribers.push({ id, priority, cb });
    this.subscribers.sort((a, b) => a.priority - b.priority);

    if (this.rafId === null && typeof window !== 'undefined') {
      this.rafId = window.requestAnimationFrame(this.tick);
    }

    return () => {
      const idx = this.subscribers.findIndex((s) => s.id === id);
      if (idx !== -1) {
        this.subscribers.splice(idx, 1);
      }
      if (this.subscribers.length === 0 && this.rafId !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    };
  }
}

export const animationClock = new SharedAnimationClock();
