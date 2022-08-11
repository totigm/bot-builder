<h1 align="center">Welcome to <b>@totigm/bot-builder</b> 👋</h1>

<p>
  <a href="https://www.npmjs.com/package/@totigm/bot-builder" target="_blank">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@totigm/bot-builder">
  </a>
  <a href="https://github.com/totigm/bot-builder" target="_blank">
    <img alt="GitHub repo" src="https://img.shields.io/badge/GitHub-%40totigm%2Fbot--builder%20-green">
  </a>
  <a href="https://www.npmjs.com/package/@totigm/bot-builder" target="_blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dt/@totigm/bot-builder" />
  </a>
  <a href="https://github.com/totigm/bot-builder/actions/workflows/main.yml" target="_blank">
    <img alt="CI" src="https://github.com/totigm/bot-builder/actions/workflows/main.yml/badge.svg" />
  </a>
  <a href="https://github.com/totigm/bot-builder/stargazers" target="_blank">
    <img alt="GitHub repo stars" src="https://img.shields.io/github/stars/totigm/bot-builder?style=flat">
  </a>
  <a href="https://github.com/totigm/bot-builder#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen" />
  </a>
  <a href="https://github.com/totigm/bot-builder/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/totigm/bot-builder" />
  </a>
</p>

## 📄 Introduction

This is a library to create bots. It handles all the commands stuff behind the scenes, so you can focus on your bot's logic.

This library by itself is not a bot, but it provides an abstraction layer to create bots for different platforms. You just have to implement the `Bot` class, specifying a `client` and an `auth` method, and it will take care of the rest.

The `Bot` class uses generics types for the `Client` and `Message` types, so you can use it with any client for any platform that you want. They extend the `EventEmitter` and `BaseMessage` types respectively.

## 🔗 Quick links

- [Reference documentation](./docs/reference.md)
- [Bot options](./docs/bot-options.md)
- [WhatsApp bot](https://www.npmjs.com/package/@totigm/whatsapp-bot)
- [Discord bot](https://www.npmjs.com/package/@totigm/discord-bot)
- [GitHub](https://github.com/totigm/bot-builder#readme)
- [NPM](https://www.npmjs.com/package/@totigm/bot-builder)

## 💻 Installation

```sh
npm i @totigm/bot-builder
```

or

```sh
yarn add @totigm/bot-builder
```

## 🚀 Getting started

See how to create a bot for [WhatsApp](https://www.npmjs.com/package/@totigm/whatsapp-bot) or [Discord](https://www.npmjs.com/package/@totigm/discord-bot). You can also create your own bot for any platform you want.

Start adding commands to your bot by checking the [reference documentation](./docs/reference.md).

## 🤖 Example usage

Check out [@totigm/whatsapp-bot](https://github.com/totigm/whatsapp-bot/blob/main/src/bot/index.ts) and [@totigm/discord-bot](https://github.com/totigm/discord-bot/blob/main/src/bot/index.ts) to see implementations for different platforms.

## ⚙️ Options

When you create a bot, you can pass an options object to customize it. Check the [bot options](./docs/bot-options.md) documentation for more information.

```ts
const botOptions = { ... };

const bot = new Bot(botOptions);
```

## 👤 Author

<a href="https://github.com/totigm" target="_blank">
  <img alt="GitHub: totigm" src="https://img.shields.io/github/followers/totigm?label=Follow @totigm&style=social">
</a>
<br>
<a href="https://twitter.com/totigm8" target="_blank">
  <img alt="Twitter: totigm8" src="https://img.shields.io/twitter/follow/totigm8?style=social" />
</a>
<br>
<a href="https://linkedin.com/in/totigm" target="_blank">
  <img alt="LinkedIn: totigm" src="https://img.shields.io/badge/LinkedIn-%40totigm-green?style=social&logo=linkedin" />
</a>
<br>
<a href="https://www.npmjs.com/~totigm" target="_blank">
  <img alt="NPM: totigm" src="https://img.shields.io/badge/NPM-%40totigm-green?style=social&logo=npm" />
</a>

## 🤝 Contributing

Contributions are more than welcome!

We think that you might have great ideas to make this project even better. If you do, please create a pull request and/or issue following the [contribution guidelines](./docs/CONTRIBUTING.md).

## ⭐️ Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Toti Muñoz](https://github.com/totigm).<br />
This project is [MIT](https://github.com/totigm/bot-builder/blob/master/LICENSE) licensed.

---

This project was made with ❤ and TypeScript
