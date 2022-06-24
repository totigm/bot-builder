import EventEmitter from "events";
import { HandlerMessage, BaseMessage } from "./messages";

type CommandResponse = string | number | void;

export type CommandHandler<Client extends EventEmitter, Message extends BaseMessage> = (
    message: HandlerMessage<Message>,
    client: Client,
) => CommandResponse | Promise<CommandResponse>;

export interface Command<Client extends EventEmitter, Message extends BaseMessage> {
    description: string;
    handler: CommandHandler<Client, Message>;
}
