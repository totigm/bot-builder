import EventEmitter from "events";
import { findBestMatch } from "string-similarity";
import merge from "deepmerge";
import { Command, CommandHandler, BaseMessage, Message, Options, Documentation, TextFormatting, PartialOptions } from "../types";

export default abstract class Bot<Client extends EventEmitter = EventEmitter, BotMessage extends BaseMessage = BaseMessage> {
    private commands: Record<string, Command<Client, BotMessage>> = {};
    private options: Options = {
        symbol: "!",
        contentProp: "content",
        messageEvent: "message",
        textFormatting: {
            bold: "*",
            italic: "_",
            underline: "",
            strikethrough: "~",
            code: "```",
        },
        botMessages: {
            emoji: {
                list: "✅",
                error: "❌",
                question: "❓",
            },
            error: "There was an error processing your command",
            help: {
                name: "help",
                message: "I can handle the following commands",
                documentation: {
                    description: "Gives information about every command",
                    explanation: "Use this command followed by another command's name to get more info about a it",
                    exampleInput: "command name",
                },
                exampleText: "For example",
                withoutDocumentation: "This command doesn't have documentation",
                specificHelpMessage: (specificHelpCommand) => `Send ${specificHelpCommand} for more information about commands`,
            },
            suggestion: {
                similarity: 0.5,
                commandInfo: (commandName) => `${commandName} doesn't exist`,
                listMessage: "Maybe you meant",
                helpInfo: (helpCommandName) => `Send ${helpCommandName} for more info`,
            },
        },
    };

    constructor(protected client: Client, options?: PartialOptions) {
        this.options = merge(this.options, options) as Options;
        this.auth(options.authData);
        this.addHelpCommand();
        this.addOnMessageListener();
        this.client.on("ready", () => {
            console.log("The client is ready!");
        });
    }

    protected abstract auth(authData?: unknown): void;

    private handleGeneralHelp() {
        const {
            symbol,
            botMessages: { help },
        } = this.options;

        const commandsList = Object.entries(this.commands)
            .map(([name, { documentation }]) => this.getFormattedDescription(name, documentation?.description))
            .join("\n");

        const specificHelpCommand = `${symbol}${help.name} [${help.documentation.exampleInput}]`;

        const specificHelpMessage =
            typeof help.specificHelpMessage === "function"
                ? help.specificHelpMessage(this.boldText(specificHelpCommand))
                : help.specificHelpMessage;

        return `${help.message}:\n\n${commandsList}\n\n${specificHelpMessage}.`;
    }

    private getExplanationMessage(commandName: string) {
        const command = this.commands[commandName];
        const { explanation, description } = command.documentation;

        const hasExplanation = !!(explanation || description);
        return hasExplanation
            ? `${this.options.botMessages.emoji.question} ${this.boldText(commandName)}: ${explanation ?? description}.`
            : "";
    }

    private getExampleMessage(commandName: string) {
        const command = this.commands[commandName];

        const formattedCommand = this.options.symbol + commandName;
        const { example } = command.documentation;

        const exampleArgs = {
            input: example?.input ? ` ${example.input}` : "",
            output: example?.output ? ` -> ${example.output}` : "",
        };

        const exampleCommand = `${formattedCommand}${exampleArgs.input}${exampleArgs.output}`;

        const hasExample = Object.values(exampleArgs).some((value) => value !== "");
        return hasExample ? `\n${this.options.botMessages.help.exampleText}: ${this.boldText(exampleCommand)}` : "";
    }

    private handleSpecificHelp(commandName: string) {
        const command = this.commands[commandName];

        if (!command) return this.getSimilarCommandsMessage(commandName);

        const hasDocs = command.documentation && Object.keys(command.documentation).length > 0;
        if (!hasDocs) return `${this.options.botMessages.emoji.error} ${this.options.botMessages.help.withoutDocumentation}`;

        const explanationMessage = this.getExplanationMessage(commandName);
        const exampleMessage = this.getExampleMessage(commandName);

        return `${explanationMessage}${exampleMessage}`;
    }

    private addHelpCommand() {
        const {
            documentation: { description, explanation, exampleInput },
            name,
        } = this.options.botMessages.help;

        const docs: Documentation = {
            description,
            explanation,
            example: {
                input: `[${exampleInput}]`,
            },
        };

        this.addCommand(
            name,
            (message) => {
                const { args } = message;

                return args.length > 0 ? this.handleSpecificHelp(args[0]) : this.handleGeneralHelp();
            },
            docs,
        );
    }

    private getFormattedDescription(name: string, description?: string) {
        const { help, emoji } = this.options.botMessages;

        const messageEmoji = name === help.name ? emoji.question : emoji.list;
        const formattedDescription = description ? `: ${description}` : "";
        return `${messageEmoji} ${this.boldText(name)}${formattedDescription}`;
    }

    private async handleMessage(message: BotMessage) {
        const content = message[this.options.contentProp];

        const {
            symbol,
            botMessages: { emoji, error },
        } = this.options;

        if (content && content.startsWith(symbol)) {
            const formattedMessage = this.formatMessage(content);

            if (!formattedMessage) return;

            const newMessage = Object.assign(message, formattedMessage);

            const command = this.commands[newMessage.command];

            let response;
            try {
                response = command ? await command.handler(newMessage, this.client) : this.getSimilarCommandsMessage(newMessage.command);
            } catch (err) {
                console.error(err);
                response = `${emoji.error} ${error}.`;
            }

            if (response && (typeof response === "number" || response.trim() !== "")) message.reply(String(response));
        }
    }

    private addOnMessageListener() {
        this.client.on(this.options.messageEvent, (message: BotMessage) => {
            this.handleMessage(message);
        });
    }

    private extractArguments(command: string): string[] {
        const args = []; // Array to hold the extracted arguments
        let current = ""; // String to build the current argument
        // Disabled to allow single quotes
        // eslint-disable-next-line @typescript-eslint/quotes
        let quoteChar: '"' | "'" | null = null; // Variable to track the type of quote in use (null, '"', or "'")

        // Loop through each character in the command string
        for (const char of command) {
            // Check if the character is a quote (either single or double) that starts or ends an argument
            // eslint-disable-next-line @typescript-eslint/quotes
            if ((char === '"' || char === "'") && (quoteChar === null || quoteChar === char)) {
                // If we're already inside quotes, this quote ends the argument
                // Otherwise, this quote starts an argument
                quoteChar = quoteChar ? null : char;
                continue; // Move to the next character
            }

            // If we're not inside quotes and the character is a space,
            // it signifies the end of the current argument
            if (!quoteChar && char === " ") {
                if (current) {
                    args.push(current); // Add the completed argument to the array
                    current = ""; // Reset the current argument
                }
                continue; // Move to the next character
            }

            // Add the current character to the argument being built
            current += char;
        }

        // If there's an argument being built when the loop finishes, add it to the array of arguments
        if (current) {
            args.push(current);
        }

        return args;
    }

    private parseArgument(arg: string): { key: string; value: string | true } {
        const delimiterRegex = /=|:/;

        // Split the argument into key and value parts on the first '=' or ':' character
        const symbolIndex = arg.match(delimiterRegex)?.index;

        // If a delimiter is not found, or if the delimiter is the first character, the argument is treated as a flag
        if (symbolIndex === undefined || symbolIndex === 0) {
            return { key: arg.replace(delimiterRegex, ""), value: true };
        }

        const key = arg.substring(0, symbolIndex);
        const rawValue = arg.substring(symbolIndex + 1);

        // If there isn't a value, it means the argument is a flag
        if (!rawValue) {
            return { key, value: true };
        }

        // For arguments with a value, remove any enclosing quotes and return the key-value pair
        return { key, value: rawValue.replace(/(^"|"$)|(^'|'$)/g, "") };
    }

    private formatMessage(content: string): Message | null {
        const contentWithoutSymbol = content.trim().substring(this.options.symbol.length);
        const splittedMessage = this.extractArguments(contentWithoutSymbol);

        if (splittedMessage.length === 0) return null;

        const command = splittedMessage[0].toLowerCase();
        const args = splittedMessage.slice(1);

        // Parse each argument into a key-value map
        const argsMap = args.reduce((acc, arg) => {
            const { key, value } = this.parseArgument(arg);
            return { ...acc, [key]: value };
        }, {});

        return {
            command,
            text: args.join(" "),
            args,
            argsMap,
        };
    }

    private findSimilarCommands(input: string): string[] {
        const { ratings } = findBestMatch(input, Object.keys(this.commands));
        return ratings
            .filter(({ rating }) => rating >= this.options.botMessages.suggestion.similarity)
            .sort((a, b) => b.rating - a.rating)
            .map(({ target }) => target);
    }

    private getSuggestionsList(commands: string[]): string {
        const {
            botMessages: { help, emoji, suggestion },
        } = this.options;

        if (commands.length > 0) {
            const list = commands.map((name) => `${name !== help.name ? emoji.list : emoji.question} ${this.boldText(name)}`).join("\n");

            return `\n\n${suggestion.listMessage}:\n${list}`;
        }

        return "";
    }

    private getInfoMessage(emoji: string, content: string | ((str: string) => string), param: string): string {
        return `${emoji} ${typeof content === "function" ? content(this.boldText(param)) : content}.`;
    }

    private getSimilarCommandsMessage(commandName: string): string {
        const commands = this.findSimilarCommands(commandName);

        const {
            symbol,
            botMessages: {
                emoji,
                suggestion: { commandInfo, helpInfo },
                help,
            },
        } = this.options;

        const infoMessage = this.getInfoMessage(emoji.error, commandInfo, commandName);
        const helpMessage = this.getInfoMessage(emoji.question, helpInfo, symbol + help.name);

        const suggestionsList = this.getSuggestionsList(commands);

        return infoMessage + suggestionsList + "\n\n" + helpMessage;
    }

    public addCommand(name: string, handler: CommandHandler<Client, BotMessage>, documentation?: Documentation) {
        const commandName = name.toLowerCase();

        const command: Command<Client, BotMessage> = {
            handler,
        };

        if (documentation) command.documentation = documentation;

        !this.commands[commandName] ? (this.commands[commandName] = command) : console.log(`The ${commandName} command already exists`);
    }

    public formatText(text: string, formatters: keyof TextFormatting | (keyof TextFormatting)[]): string {
        const formattersArray = typeof formatters === "string" ? [formatters] : formatters;
        const uniqueFormatters = [...new Set(formattersArray)].map((formatter) => this.options.textFormatting[formatter]);

        const formatSymbols = uniqueFormatters.join("");
        const reversedFormatSymbols = uniqueFormatters.reverse().join("");

        return `${formatSymbols}${text}${reversedFormatSymbols}`;
    }

    public boldText(text: string) {
        return this.formatText(text, "bold");
    }

    public italicText(text: string) {
        return this.formatText(text, "italic");
    }

    public underlineText(text: string) {
        return this.formatText(text, "underline");
    }

    public strikethroughText(text: string) {
        return this.formatText(text, "strikethrough");
    }

    public codeText(text: string) {
        return this.formatText(text, "code");
    }

    public getCommand(name: string) {
        return this.commands[name];
    }

    public getCommands() {
        return this.commands;
    }

    public getClient() {
        return this.client;
    }
}
