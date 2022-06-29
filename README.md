# Bot builder

This is a library to create bots for different platforms. It handles all the commands stuff behind the scenes, so you can focus on your bot's logic.

## Introduction

This library by itself is not a bot, but it provides an abstraction layer to create bots for different platforms. You just have to implement the `Bot` class, specifying a `Client` and an `auth` function, and the library will take care of the rest.

## Getting started

## ⚙️ Bot options

Your bot can be customized if you want it to have a different behaviour. The options that it supports are:

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Sub options</th>
            <th>Description</th>
            <th>Default value</th>
            <th>Value type</th>
        </tr>
    </thead>
    <tbody>
        <div id="symbol">
            <tr>
                <td><b>symbol</b></td>
                <td></td>
                <td>The symbol that goes before the command</td>
                <td><b>!</b></td>
                <td>string</td>
            </tr>
        </div>
        <div id="contentProp">
            <tr>
                <td><b>contentProp</b></td>
                <td></td>
                <td>The property of the Message object which contains its text</td>
                <td><b>content</b></td>
                <td>string</td>
            </tr>
        </div>
        <div id="messageEvent">
            <tr>
                <td><b>messageEvent</b></td>
                <td></td>
                <td>The event emitted by the Client when the bot receives a message</td>
                <td><b>message</b></td>
                <td>string</td>
            </tr>
        </div>
        <div id="error">
            <tr>
                <td rowspan="3">
                    <b>error</b>
                </td>
            </tr>
            <tr>
                <td>message</td>
                <td>The message sent by the bot when there's an internal error</td>
                <td>There was an error processing your command</td>
                <td>string</td>
            </tr>
            <tr>
                <td>emoji</td>
                <td>The emoji that goes before the error message</td>
                <td>❌</td>
                <td>string</td>
            </tr>
        </div>
        <div id="nonExistent">
            <tr>
                <td rowspan="6">
                    <b>nonExistent</b>
                </td>
            </tr>
            <tr>
                <td>info</td>
                <td>Message saying that the command doesn't exist</td>
                <td>(commandName) => `${this.boldText(commandName)} doesn't exist`</td>
                <td>(string) => string</td>
            </tr>
            <tr>
                <td>suggestion</td>
                <td>Message suggesting similar commands in case there are any</td>
                <td>Maybe you meant</td>
                <td>string</td>
            </tr>
            <tr>
                <td>listEmoji</td>
                <td>The emoji that goes before each command's suggestion</td>
                <td>✅</td>
                <td>string</td>
            </tr>
            <tr>
                <td>helpInfo</td>
                <td>Message showing how to use the help command</td>
                <td>(helpCommand) => `Send ${this.boldText(helpCommand)} for more info`</td>
                <td>(string) => string</td>
            </tr>
            <tr>
                <td>similarity</td>
                <td>How similar does the command needs to be in order to be suggested</td>
                <td>0.5</td>
                <td>number from 0 (totally different) to 1 (equal)</td>
            </tr>
        </div>
        <div id="textFormatting">
            <tr>
                <td rowspan="5">
                    <b>textFormatting</b>
                </td>
            </tr>
            <tr>
                <td>bold</td>
                <td>Symbols to format text as bold</td>
                <td>**</td>
                <td>string</td>
            </tr>
            <tr>
                <td>italic</td>
                <td>Symbols to format text as italic</td>
                <td>*</td>
                <td>string</td>
            </tr>
            <tr>
                <td>underline</td>
                <td>Symbols to underline text</td>
                <td>_</td>
                <td>string</td>
            </tr>
            <tr>
                <td>strikethrough</td>
                <td>Symbols to strikethrough text</td>
                <td>~~</td>
                <td>string</td>
            </tr>
        </div>
    </tbody>
</table>

## ✨ Contributing

Contributions are more than welcome!

We think that you might have great ideas to make this project even better, so if you do, please create a pull request and/or issue following our [contribution guidelines](./docs/CONTRIBUTING.md).

## 😃 Author

[TotiGM](https://github.com/totigm)

## 📄 License

[MIT](./LICENSE)

<hr />

This project was made with ❤ and TypeScript
