import EventEmitter from "events";
import { findBestMatch } from "string-similarity";
import merge from "deepmerge";
import { Command, CommandHandler, BaseMessage, Message, Options, DeepPartial } from "../types";

export default abstract class Bot<
    Client extends EventEmitter = EventEmitter,
    BotMessage extends BaseMessage = BaseMessage,
> {
    private commands: Record<string, Command<Client, BotMessage>> = {};
    private options: Options = {
        symbol: "!",
        contentProp: "content",
        error: {
            emoji: "❌",
            message: "There was an error processing your command.",
        },
        help: {
            name: "help",
            emoji: "❓",
            description: "Gives information about every command.",
            message: "I can handle the following commands:",
        },
        nonExistent: {
            info: (commandName) => `${this.boldText(commandName)} doesn't exist.`,
            suggestion: "Maybe you meant:",
            listEmoji: "✅",
            helpInfo: (helpCommand) => `Send ${this.boldText(helpCommand)} for more info.`,
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

    private addHelpCommand() {
        const { help } = this.options;

        // Specific commands help is missing
        // `You can use ${this.options.symbol}${this.options.help.name} [command name] to get more info about commands.`
        this.addCommand(help.name, help.description, () => {
            const message = `${help.message}\n\n`;
            const list = Object.entries(this.commands)
                .map(([name, { description }]) => this.getFormattedDescription(name, description))
                .join("\n");

            return message + list;
        });
    }

    private getFormattedDescription(name: string, description: string) {
        const { help, nonExistent: nonexistent } = this.options;
        return `${name === help.name ? help.emoji : nonexistent.listEmoji} ${this.boldText(
            name,
        )}: ${description}`;
    }

    private async handleMessage(message: BotMessage) {
        const content = message[this.options.contentProp] || message.body;

        if (content && content.startsWith(this.options.symbol)) {
            const newMessage = Object.assign(message, this.formatMessage(content));

            const command = this.commands[newMessage.command];

            let response;
            try {
                response = command
                    ? await command.handler(newMessage, this.client)
                    : this.getSimilarCommandsMessage(newMessage.command);
            } catch (error) {
                console.error(error);
                response = `${this.options.error.emoji} ${this.options.error.message}`;
            }

            if (response && (typeof response === "number" || response.trim() !== ""))
                message.reply(String(response));
        }
    }

    private addOnMessageListener() {
        this.client.on("message", (message: BotMessage) => {
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

        let message = info(commandName);

        if (commands.length > 0) {
            message += `\n\n${suggestion}\n`;
            message += commands.map((name) => `${listEmoji} ${this.boldText(name)}`).join("\n");
        }

        const { emoji: helpEmoji, name: helpName } = this.options.help;
        message += `\n\n${helpEmoji} ${helpInfo(this.options.symbol + helpName)}`;

        return message;
    }

    public addCommand(
        name: string,
        description: string,
        handler: CommandHandler<Client, BotMessage>,
    ) {
        const commandName = name.toLowerCase();

        !this.commands[commandName]
            ? (this.commands[commandName] = {
                  description,
                  handler,
              })
            : console.log(`The ${commandName} command already exists`);
    }

    private static formatText(text: string, symbol: string) {
        const trimmedText = text.trim();
        return trimmedText !== "" ? symbol + trimmedText + symbol : trimmedText;
    }

    public boldText(text: string) {
        return Bot.formatText(text, this.options.textFormatting.bold);
    }

    public italicText(text: string) {
        return Bot.formatText(text, this.options.textFormatting.italic);
    }

    public underlineText(text: string) {
        return Bot.formatText(text, this.options.textFormatting.underline);
    }

    public strikethroughText(text: string) {
        return Bot.formatText(text, this.options.textFormatting.strikethrough);
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
