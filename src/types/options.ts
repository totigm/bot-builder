import { Documentation } from "./commands";

export interface TextFormatting {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    code: string;
}

interface Emoji {
    list: string;
    error: string;
    question: string;
}

type Error = string;

interface Help {
    name: string;
    message: string;
    exampleText: string;
    documentation: Omit<Documentation, "example"> & { exampleInput: string };
    withoutDocumentation: string;
}

interface Suggestion {
    similarity: number;
    commandInfo: string | ((commandName: string) => string);
    listMessage: string;
    helpInfo: string | ((helpCommandName: string) => string);
}

interface BotMessages {
    emoji: Emoji;
    error: Error;
    help: Help;
    suggestion: Suggestion;
}

export interface Options {
    symbol: string;
    contentProp: string;
    messageEvent: string;
    textFormatting: TextFormatting;
    botMessages: BotMessages;
}

type DeepPartial<T> = T extends unknown
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type PartialOptions = DeepPartial<Options>;
