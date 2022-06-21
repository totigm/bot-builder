export interface BaseMessage {
    reply: (...args) => Promise<BaseMessage>;
    content?: string;
    body?: string;
    author?: string | Object;
}

export interface Message {
    command: string;
    text: string;
    args: string[];
}

export type HandlerMessage<BotMessage extends BaseMessage> = BotMessage & Message;
