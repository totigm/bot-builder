interface HelpCommand {
    name: string;
    emoji: string;
    description: string;
    message: string;
}

interface NonExistent {
    info: (commandName: string) => string;
    suggestion: string;
    listEmoji: string;
    help: (helpCommand: string) => string;
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
    help: HelpCommand;
    nonExistent: NonExistent;
    textFormatting: TextFormatting;
}

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
