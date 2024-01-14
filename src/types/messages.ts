export interface BaseMessage {
    reply: (...args) => Promise<unknown>;
}

export interface Message {
    command: string;
    text: string;
    args: string[];
    // The value is a string if the argument is a key-value pair (e.g., !command key=value).
    // The value is true for flag-type arguments, which are present without an accompanying value (e.g., !command key).
    argsMap: { [key: string]: string | true };
}

export type HandlerMessage<BotMessage extends BaseMessage> = BotMessage & Message;
