<h1 align="center">⚙ Bot options ⚙</h1>

Your bot can be customized if you want it to have a different behaviour. The options that it supports are:

- [symbol](#symbol)
- [contentProp](#contentprop)
- [messageEvent](#messageevent)
- [textFormatting](#textformatting)
  - [bold](#bold)
  - [italic](#italic)
  - [underline](#underline)
  - [strikethrough](#strikethrough)
  - [code](#code)
- [botMessages](#botmessages)
  - [error](#error)
  - [emoji](#emoji)
    - [list](#list)
    - [error](#error-1)
    - [question](#question)
  - [suggestion](#suggestion)
    - [similarity](#similarity)
    - [commandInfo](#commandinfo)
    - [listMessage](#listmessage)
    - [helpInfo](#helpinfo)
  - [help](#help)
    - [name](#name)
    - [message](#message)
    - [specificHelpMessage](#specifichelpmessage)
    - [documentation](#documentation)
      - [description](#description)
      - [explanation](#explanation)
      - [exampleInput](#exampleinput)
    - [exampleText](#exampletext)
    - [withoutDocumentation](#withoutdocumentation)

# symbol

The symbol that goes before the command name.

![!help command](https://user-images.githubusercontent.com/64804554/183612318-b427d4a9-0686-48f4-8b4d-42bc736e00c8.png)

- Default value: `!`
- Value type: `string`

# contentProp

The property of the `Message` object which contains its text.

- Default value: `content`
- Value type: `string`

# messageEvent

The event emitted by the `Client` when the bot receives a message.

- Default value: `message`
- Value type: `string`

# textFormatting

![formatted text](https://user-images.githubusercontent.com/64804554/183644878-b28b0df6-e04a-4210-b112-ff7eaabfb4c2.png)

Symbols to format text.

- Value type: `object`
  - [bold](#bold)
  - [italic](#italic)
  - [underline](#underline)
  - [strikethrough](#strikethrough)
  - [code](#code)
- Value type of each prop: `string`

## bold

Default value: `*`

## italic

Default value: `_`

## underline

Default value: `empty`

## strikethrough

Default value: `~`

## code

Default value: `` ``` ``

# botMessages

Messages that the bot sends to the user for various situations.

- Value type: `object`
  - [error](#error)
  - [emoji](#emoji)
    - [list](#list)
    - [error](#error-1)
    - [question](#question)
  - [suggestion](#suggestion)
    - [similarity](#similarity)
    - [commandInfo](#commandinfo)
    - [listMessage](#listmessage)
    - [helpInfo](#helpinfo)
  - [help](#help)
    - [name](#name)
    - [message](#message)
    - [specificHelpMessage](#specifichelpmessage)
    - [documentation](#documentation)
      - [description](#description)
      - [explanation](#explanation)
      - [exampleInput](#exampleinput)
    - [exampleText](#exampletext)
    - [withoutDocumentation](#withoutdocumentation)

## error

The message sent by the bot when there is an internal error.

![error message](https://user-images.githubusercontent.com/64804554/183613891-c4a076fc-5ad9-481c-be5b-ac4a041d599b.png)

- Default value: `There was an error processing your command`
- Value type: `string`

## emoji

Emojis that go before messages for various situations.

- Value type: `object`
  - [list](#list)
  - [error](#error-1)
  - [question](#question)

### list

Emoji used to list commands. This is used in the [help](#help) command, and when [suggesting](#suggestion) commands.

- Default value: ✅
- Value type: `string`

### error

Emoji used when there is an internal [error](#error), or when a [non existent command](#suggestion) is sent by the user.

- Default value: ❌
- Value type: `string`

### question

Emoji used for the help commands. It used on the general and specific [help](#help), and also when the user sends a [non existent command](#suggestion).

- Default value: ❓
- Value type: `string`

## suggestion

The message sent by the bot when the user sends a non existent command.

![suggestions message](https://user-images.githubusercontent.com/64804554/183615157-a56df794-74bc-4fd4-850f-667c695562e8.png)

Value type: `object`
  - [similarity](#similarity)
  - [commandInfo](#commandinfo)
  - [listMessage](#listmessage)
  - [helpInfo](#helpinfo)

### similarity

Similarity rate used to suggest similar commands.
How similar the command needs to be in order to be suggested.

- Default value: 0.5
- Value type: `number` from 0 (totally different) to 1 (equal)

### commandInfo

Part of the message letting the user know that the command doesn't exist.

![info part](https://user-images.githubusercontent.com/64804554/183615510-a7e48c99-1cb4-49a6-b37d-db8fbc7d19c1.png)

- Default value: ``(commandName) => `${commandName} doesn't exist` ``
- Value type: `string | ((commandName: string) => string)`

### listMessage

Part of the message before listing similar commands in case there are.

![suggestion part](https://user-images.githubusercontent.com/64804554/183615659-9bec4ed3-3427-40b2-b264-33e6c310e3f9.png)

- Default value: `Maybe you meant`

### helpInfo

Part of the message letting the user know how to use the help command.

![help part](https://user-images.githubusercontent.com/64804554/183615780-8916094a-feb8-4d20-b422-05e4d20cdf5f.png)

- Default value: ``(helpCommandName) => `Send ${helpCommandName} for more info` ``
- Value type: `string | ((helpCommandName: string) => string)`

## help

Messages sent by the bot when the user sends the `help` command.

General help:

![general help message](https://user-images.githubusercontent.com/64804554/185166269-56c53425-5344-4e6a-bec5-401eaf1d93b0.png)


Specific command help:

![specific command help message](https://user-images.githubusercontent.com/64804554/185166562-0e367abd-1318-4b25-8f3a-9f9174ac3a18.png)

Value type: `object`
  - [name](#name)
  - [message](#message)
  - [specificHelpMessage](#specifichelpmessage)
  - [documentation](#documentation)
    - [description](#description)
    - [explanation](#explanation)
    - [exampleInput](#exampleinput)
  - [exampleText](#exampletext)
  - [withoutDocumentation](#withoutdocumentation)

### name

Name of the help command.

![name of the command](https://user-images.githubusercontent.com/64804554/185167205-1b29fd72-9025-4712-aae4-fbfa3cef791e.png)

- Default value: `help`
- Value type: `string`

### message

Part of the message before listing available commands.

![help message](https://user-images.githubusercontent.com/64804554/185167516-a6dab8a6-fdfd-43b3-88c0-c6d3718b34ff.png)

- Default value: `I can handle the following commands`
- Value type: `string`

### specificHelpMessage

Part of the general help message suggesting to use the specific help command.

![specific help part on general help](https://user-images.githubusercontent.com/64804554/185169052-b5414dc0-1ec5-4b2b-9b6b-b3e2474c71f0.png)

- Default value: ``(specificHelpCommand) => `Send ${specificHelpCommand} for more information about commands` ``
- Value type: `string | ((specificHelpCommand: string) => string)`

### documentation

Documentation object for the help command.

- Value type: `object`
  - [description](#description)
  - [explanation](#explanation)
  - [exampleInput](#exampleinput)

#### description

Short description of the help command.

![help command description](https://user-images.githubusercontent.com/64804554/185168268-9578dfe4-dc39-439c-97d6-5f99957fe0c0.png)

- Default value: `Gives information about every command`
- Value type: `string`

#### explanation

Detailed explanation of the help command.

![help command explanation](https://user-images.githubusercontent.com/64804554/185170170-dd384eeb-9e54-4832-aa00-bb36088a478d.png)

- Default value: `Use this command followed by another command's name to get more info about a it`
- Value type: `string`

#### exampleInput

Example of the command usage.

![specifichelp command example input](https://user-images.githubusercontent.com/64804554/185170500-6fe82bf0-57d1-4290-8c32-0bac6bd8227a.png)

![general help command example input](https://user-images.githubusercontent.com/64804554/185170916-2535fd34-b8c7-4e98-8755-248fb819b01d.png)

- Default value: `command name`
- Value type: `string`

### exampleText

Part of the message before showing the example of the command usage.

![example help text](https://user-images.githubusercontent.com/64804554/185170707-6f140a52-99e9-4239-b032-9faaddc79000.png)

- Default value: `For example`
- Value type: `string`

### withoutDocumentation

Message sent for the [specific help](#help) when the command doesn't have documentation.

![specific help without documentation](https://user-images.githubusercontent.com/64804554/184128687-90ed4b8b-35a1-4f71-9d61-d25e9b8aeaf7.png)

- Default value: `This command doesn't have documentation`
- Value type: `string`
