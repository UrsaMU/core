export interface TickAction {
  name: string;
  action: () => Promise<void>;
}

export class Tick {
  actions: TickAction[];
  counter: NodeJS.Timeout | undefined;
  interval: number;

  constructor(...list: TickAction[]) {
    this.actions = list;
    this.interval = 10000;
  }

  add(...list: TickAction[]) {
    list.forEach((item) => this.actions.push(item));
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
