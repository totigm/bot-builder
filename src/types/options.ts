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

export interface Options {
    symbol: string;
    contentProp: string;
    help: HelpCommand;
    nonexistent: NonExistent;
}

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
