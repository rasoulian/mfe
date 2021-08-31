import { container } from "../dependency-injection";
import { CommunicationChannel } from "./communication-channel";
import { BroadcastChannel } from "./implementations/broadcast-channel";
import { LocalStorageChannel } from "./implementations/localstorage";

export abstract class CommunicationChannelFactory {
  abstract create(channelName: string): CommunicationChannel;
}

class CommunicationChannelFactoryImpl extends CommunicationChannelFactory {
  create(channelName: string): CommunicationChannel {
    if (typeof window === "undefined") throw new Error("Window is undefined!");

    if (typeof window.BroadcastChannel === "function")
      return new BroadcastChannel(channelName);

    return new LocalStorageChannel(channelName);
  }
}

export const CommunicationChannelFactoryToken = Symbol.for(
  "CommunicationChannelFactoryToken"
);
container
  .bind(CommunicationChannelFactoryToken)
  .to(CommunicationChannelFactoryImpl);
container
  .bind(CommunicationChannelFactory)
  .toService(CommunicationChannelFactoryToken);
