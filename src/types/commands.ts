import EventEmitter from "events";
import { HandlerMessage, BaseMessage } from "./messages";

type CommandResponse = string | number | void;

export type CommandHandler<Client extends EventEmitter, Message extends BaseMessage> = (
    message: HandlerMessage<Message>,
    client: Client,
) => CommandResponse | Promise<CommandResponse>;

interface Example {
    input?: string;
    output?: string;
}

export interface Documentation {
    description?: string;
    explanation?: string;
    example?: Example;
}

export interface Command<Client extends EventEmitter, Message extends BaseMessage> {
    handler: CommandHandler<Client, Message>;
    documentation?: Documentation;
}
