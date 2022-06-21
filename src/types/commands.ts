import EventEmitter from 'events';
import { HandlerMessage, BaseMessage } from './messages';

export type CommandHandler<Client extends EventEmitter, Message extends BaseMessage> = (
    message: HandlerMessage<Message>,
    client?: Client,
) => any;

export interface Command<Client extends EventEmitter, Message extends BaseMessage> {
    description: string;
    handler: CommandHandler<Client, Message>;
}
