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
        this.auth();
        this.addHelpCommand();
        this.addOnMessageListener();
        this.client.on("ready", () => {
            console.log("The client is ready!");
        });
    }

    protected abstract auth(): void;

    private handleGeneralHelp() {
        const { help } = this.options.botMessages;

        const commandsList = Object.entries(this.commands)
            .map(([name, { documentation }]) => this.getFormattedDescription(name, documentation?.description))
            .join("\n");

        return help.message + ":\n\n" + commandsList;
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

        const formattedCommand = this.boldText(this.options.symbol + commandName);
        const { example } = command.documentation;

        const exampleArgs = {
            input: example?.input ? `${example.input} ` : "",
            output: example.output ? `${this.boldText("->")} ${example.output}` : "",
        };

        const hasExample = Object.values(exampleArgs).some((value) => value !== "");
        return hasExample
            ? `${this.options.botMessages.help.exampleText}: ${formattedCommand} ${exampleArgs.input}${exampleArgs.output}`
            : "";
    }

    private handleSpecificHelp(commandName: string) {
        const command = this.commands[commandName];

        if (!command) return this.getSimilarCommandsMessage(commandName);

        const hasDocs = command.documentation && Object.keys(command.documentation).length > 0;
        if (!hasDocs) return `${this.options.botMessages.emoji.error} ${this.options.botMessages.help.withoutDocumentation}`;

        const explanationMessage = this.getExplanationMessage(commandName);
        const exampleMessage = this.getExampleMessage(commandName);

        return `${explanationMessage}\n${exampleMessage}`;
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
            const newMessage = Object.assign(message, this.formatMessage(content));

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

    private formatMessage(content: string): Message {
        const splittedMessage = content.trim().split(" ");
        const args = splittedMessage.slice(1);

        return {
            command: splittedMessage[0].substring(this.options.symbol.length).toLowerCase(),
            text: args.join(" "),
            args,
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
