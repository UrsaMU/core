export interface TickAction {
  name: string;
  action: () => Promise<void>;
}

export class Tick {
  actions: TickAction[];
  counter: NodeJS.Timeout | undefined;
  interval: number;

  constructor(...list: (TickAction | number)[]) {
    this.actions = [];
    this.interval = 10000;

    list.forEach((item) => {
      if (typeof item === "function") this.actions.push(item);
      if (typeof item === "number") this.interval = item;
    });
  }

  add(...list: (TickAction | number)[]) {
    list.forEach((item) => {
      if (typeof item === "function") this.actions.push(item);
      if (typeof item === "number") this.interval = item;
    });
    return this;
  }

  remove(name: string) {
    this.actions.filter((item: TickAction) => item);
  }

  inverval(int: number) {
    this.interval = int;
    return this;
  }

  start() {
    this.counter = setInterval(() => {
      for (let action of this.actions) {
        action.action();
      }
    }, this.interval);
  }
}
