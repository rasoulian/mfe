import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { CommunicationChannel } from "../communication-channel";

const KEY_PREFIX = "communication-channel:";
class CommunicationChannelImpl extends CommunicationChannel {
  #subject: BehaviorSubject<any>;

  constructor(private channelName: string) {
    super();
    this.#subject = new BehaviorSubject(null);
    this.channelName = `${KEY_PREFIX}${channelName}:`;
    this.handleStorage = this.handleStorage.bind(this);
    window.addEventListener("storage", this.handleStorage);
  }

  publish(topic: string, payload: any): void {
    const value = JSON.stringify({
        topic,
        payload,
      }),
      key = this.channelName;

    localStorage.setItem(key, value);
    /** StorageEvent does not fire the 'storage' event
     * in the window that changes the state of the local storage.
     * So we fire it manually
     */
    window.dispatchEvent(
      new StorageEvent("storage", { key: key, newValue: value })
    );
    localStorage.removeItem(key);
  }

  messages$(topic: string): Observable<any> {
    return this.#subject.pipe(
      filter((message) => message.topic === topic),
      map((message) => message.payload)
    );
  }

  close(): void {
    window.removeEventListener("storage", this.handleStorage);
  }

  private handleStorage(event: StorageEvent) {
    if (event.key !== this.channelName || event.newValue == null) return;

    const message = JSON.parse(event.newValue);
    this.#subject.next(message);
  }
}

export { CommunicationChannelImpl as LocalStorageChannel };
