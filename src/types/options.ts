import { Documentation } from "./commands";

interface ErrorMessage {
    emoji: string;
    message: string;
}

interface HelpCommand {
    name: string;
    emoji: string;
    message: string;
    exampleText: string;
    documentation: Omit<Documentation, "example"> & { exampleInput: string };
}

interface NonExistentCommand {
    info: (commandName: string) => string;
    suggestion: string;
    listEmoji: string;
    helpInfo: (helpCommand: string) => string;
    similarity: number;
}

export interface TextFormatting {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
}

export interface Options {
    symbol: string;
    contentProp: string;
    messageEvent: string;
    error: ErrorMessage;
    help: HelpCommand;
    nonExistent: NonExistentCommand;
    textFormatting: TextFormatting;
}

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type PartialOptions = DeepPartial<Options>;
