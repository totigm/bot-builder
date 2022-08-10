export interface BaseMessage {
    reply: (...args) => Promise<unknown>;
}

export interface Message {
    command: string;
    text: string;
    args: string[];
}

export type HandlerMessage<BotMessage extends BaseMessage> = BotMessage & Message;
