interface ErrorMessage {
    emoji: string;
    message: string;
}

interface HelpCommand {
    name: string;
    emoji: string;
    description: string;
    message: string;
}

interface NonExistentCommand {
    info: (commandName: string) => string;
    suggestion: string;
    listEmoji: string;
    helpInfo: (helpCommand: string) => string;
    similarity: number;
}

interface TextFormatting {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
}

export interface Options {
    symbol: string;
    contentProp: string;
    error: ErrorMessage;
    help: HelpCommand;
    nonExistent: NonExistentCommand;
    textFormatting: TextFormatting;
}

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
