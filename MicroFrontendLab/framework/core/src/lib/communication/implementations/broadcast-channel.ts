import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { CommunicationChannel } from "../communication-channel";

class CommunicationChannelImpl extends CommunicationChannel {
  #channel: BroadcastChannel;
  #subject: BehaviorSubject<any>;

  constructor(channelName: string) {
    super();
    this.#channel = new BroadcastChannel(channelName);
    this.#subject = new BehaviorSubject(null);
    this.#channel.onmessage = (message) => this.#subject.next(message.data);
  }

  publish(topic: string, payload: any): void {
    this.#channel.postMessage({ topic, payload });
  }

  messages$(topic: string): Observable<any> {
    return this.#subject.pipe(
      filter((message) => message.topic === topic),
      map((message) => message.payload)
    );
  }

  close(): void {
    this.#channel.close();
  }
}

export { CommunicationChannelImpl as BroadcastChannel };
