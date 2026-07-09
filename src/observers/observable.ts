type ObserverFunction = (data: unknown) => void;

export class Observable {
  observers: ObserverFunction[] = [];

  subscribe(func: ObserverFunction) {
    this.observers.push(func);
  }

  unsubscribe(func: ObserverFunction) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: unknown) {
    this.observers.forEach((observer) => observer(data));
  }
}

export const loginObserver = new Observable();
