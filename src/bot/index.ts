import EventEmitter from "events";
import { findBestMatch } from "string-similarity";
import merge from "deepmerge";
import { Command, CommandHandler, BaseMessage, Message, Options, DeepPartial, Documentation, TextFormatting } from "../types";

export default abstract class Bot<Client extends EventEmitter = EventEmitter, BotMessage extends BaseMessage = BaseMessage> {
    private commands: Record<string, Command<Client, BotMessage>> = {};
    private options: Options = {
        symbol: "!",
        contentProp: "content",
        messageEvent: "message",
        error: {
            emoji: "❌",
            message: "There was an error processing your command",
        },
        help: {
            name: "help",
            emoji: "❓",
            message: "I can handle the following commands",
            exampleText: "For example",
            documentation: {
                description: "Gives information about every command",
                explanation: "Use this command followed by another command's name to get more info about a it",
                exampleInput: "command name",
            },
        },
        nonExistent: {
            info: (commandName) => `${this.boldText(commandName)} doesn't exist`,
            suggestion: "Maybe you meant",
            listEmoji: "✅",
            helpInfo: (helpCommand) => `Send ${this.boldText(helpCommand)} for more info`,
            similarity: 0.5,
        },
        textFormatting: {
            bold: "**",
            italic: "*",
            underline: "__",
            strikethrough: "~~",
        },
    };

    constructor(protected client: Client, options?: DeepPartial<Options>) {
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
        const { help } = this.options;

        let message = `${help.message}:\n`;
        message += Object.entries(this.commands)
            .map(([name, { documentation }]) => this.getFormattedDescription(name, documentation.description))
            .join("\n");

        return message;
    }

    private handleSpecificHelp(commandName: string) {
        const command = this.commands[commandName];

        if (!command) return this.getSimilarCommandsMessage(commandName);

        const formattedCommand = this.boldText(this.options.symbol + commandName);
        const { exampleText, emoji } = this.options.help;
        const { explanation, description, example } = command.documentation;

        let message = `${emoji} ${this.boldText(commandName)}: ${explanation ?? description}.`;

        if (example)
            message += `\n${exampleText}: ${formattedCommand} ${example.input} ${
                example.output ? `${this.boldText("->")} ${example.output}` : ""
            }`;

        return message;
    }

    private addHelpCommand() {
        const {
            documentation: { description, explanation, exampleInput },
            name,
        } = this.options.help;

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

    private getFormattedDescription(name: string, description: string) {
        const { help, nonExistent } = this.options;
        return `${name === help.name ? help.emoji : nonExistent.listEmoji} ${this.boldText(name)}: ${description}`;
    }

    private async handleMessage(message: BotMessage) {
        const content = message[this.options.contentProp] || message.body;

        if (content && content.startsWith(this.options.symbol)) {
            const newMessage = Object.assign(message, this.formatMessage(content));

            const command = this.commands[newMessage.command];

            let response;
            try {
                response = command ? await command.handler(newMessage, this.client) : this.getSimilarCommandsMessage(newMessage.command);
            } catch (error) {
                console.error(error);
                response = `${this.options.error.emoji} ${this.options.error.message}.`;
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
            .filter(({ rating }) => rating >= this.options.nonExistent.similarity)
            .sort((a, b) => b.rating - a.rating)
            .map(({ target }) => target);
    }

    private getSimilarCommandsMessage(commandName: string): string {
        const commands = this.findSimilarCommands(commandName);

        const { info, suggestion, listEmoji, helpInfo } = this.options.nonExistent;

        let message = `${this.options.error.emoji} ${info(commandName)}.`;

        if (commands.length > 0) {
            message += `\n\n${suggestion}:\n`;
            message += commands.map((name) => `${listEmoji} ${this.boldText(name)}`).join("\n");
        }

        const { emoji: helpEmoji, name: helpName } = this.options.help;
        message += `\n\n${helpEmoji} ${helpInfo(this.options.symbol + helpName)}.`;

        return message;
    }

    public addCommand(name: string, handler: CommandHandler<Client, BotMessage>, documentation: Documentation) {
        const commandName = name.toLowerCase();

        !this.commands[commandName]
            ? (this.commands[commandName] = {
                  handler,
                  documentation,
              })
            : console.log(`The ${commandName} command already exists`);
    }

    public formatText(text: string, formatters: (keyof TextFormatting)[]): string {
        const uniqueFormatters = formatters
            .filter((value, index) => formatters.indexOf(value) === index)
            .map((formatter) => this.options.textFormatting[formatter]);
        const formatSymbols = uniqueFormatters.join("");
        const reversedFormatSymbols = uniqueFormatters.reverse().join("");

        return `${formatSymbols}${text}${reversedFormatSymbols}`;
    }

    public boldText(text: string) {
        return this.formatText(text, ["bold"]);
    }

    public italicText(text: string) {
        return this.formatText(text, ["italic"]);
    }

    public underlineText(text: string) {
        return this.formatText(text, ["underline"]);
    }

    public strikethroughText(text: string) {
        return this.formatText(text, ["strikethrough"]);
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
