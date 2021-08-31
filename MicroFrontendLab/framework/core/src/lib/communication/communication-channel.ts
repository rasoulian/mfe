import { Observable } from "rxjs";

export abstract class CommunicationChannel {
  abstract publish(topic: string, payload: any): void;
  abstract messages$(topic: string): Observable<any>;
  abstract close(): void;
}
