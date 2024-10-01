# React/TypeScript/Tailwind App Starter

## Overview

A skeleton for getting started quickly with web application development using:

- [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com)
- Static analysis: [Prettier](https://prettier.io), [ESLint](https://eslint.org), [TypeScript](https://www.typescriptlang.org)
- Testing: [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com), [Mock Service Worker](https://mswjs.io)
- Build process: [Vite](https://vitejs.dev), [PostCSS](https://postcss.org)

I made it for myself to avoid repeating the same tasks over and over again when starting new side projects. Feel free to use it in its entirety or just for inspiration.

## Quick Start

1. Get the repository to start your new project.
2. Run `npm install` in your project directory to install the dependencies.
3. Run `npm run dev` to start the development server.
4. Start building your application in `src/App.tsx`.

## Installation

### Packages

**Note:** The projects requires Node.js version 18+ or 20+.

After you fork/clone/download the repository, install all the npm packages into your project folder:

```bash
npm install
```

### VS Code Extensions

If you are using [Visual Studio Code](https://code.visualstudio.com), you will be prompted to install several recommended [extensions](https://marketplace.visualstudio.com/vscode) after opening the project:

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)

## Usage

### Development

To start developing your React/TypeScript application, go to `src/App.tsx`.

You can use the [Tailwind classes](https://tailwindcss.com/docs/utility-first) right away.

You can start [describing the network](https://mswjs.io/docs/getting-started#step-2-describe) using the [MSW request handlers](https://mswjs.io/docs/concepts/request-handler) in `src/mocks/handlers.ts`. The [MSW/Node.js integration module](https://mswjs.io/docs/getting-started#step-3-integrate) (`src/mocks/node.ts`) is already started in `vitest.setup.ts`.

### Static Analysis

To check the formatting with Prettier (without modifying the files):

```bash
npm run format:check
```

To actually format (modify) the files with Prettier:

```bash
npm run format
```

To lint the files using ESLint:

```bash
npm run lint
```

To statically check types with TypeScript:

```bash
npm run types
```

### Testing

To run all tests and view the results in the terminal:

```bash
npm run test
```

To run all tests and view the results in the browser:

```bash
npm run test:ui
```

To run all tests and generate a test coverage report:

```bash
npm run coverage
```

### Build Process

To run Vite's development server:

```bash
npm run dev
```

To preview the production build locally (after building the project with the `build` script):

```bash
npm run preview
```

To run the TypeScript compiler and Vite's build process:

```bash
npm run build
```

## Configuration

### Tailwind CSS

Tailwind CSS is installed as a PostCSS plugin (see `postcss.config.js`) and configured to process the contents of the root `index.html` and all `.ts/.tsx` files in the `src` directory. No [customizations](https://tailwindcss.com/docs/configuration) are provided by default. You can change the configuration in `tailwind.config.js`.

Any additional plugins (like [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typographyhttps://github.com/tailwindlabs/tailwindcss-typography), [tailwindcss-forms](https://github.com/tailwindlabs/tailwindcss-forms), [tailwindcss-aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio), or [tailwindcss-container-queries](https://github.com/tailwindlabs/tailwindcss-container-queries)) can also be added in `tailwind.config.js`.

Tailwind's [base styles](https://tailwindcss.com/docs/preflight) and the other two layers are included by default (see `src/index.css`).

### Prettier

Prettier uses the default configuration. It also has the [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) plugin enabled to automatically sort classes based on [Tailwind's recommended class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted). You can change the configuration in `.prettierrc`.

Ingored files (not to be formatted) can be specified in `.prettierignore`. According to its [documentation](https://prettier.io/docs/en/ignore), Prettier also respects the `.gitignore` configuration and ignores `node_modules/`.

### ESLint

By default, ESLint uses the [recommended configuration](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations) and the following plugins with their respective recommended configurations:

- [typescript-eslint](https://typescript-eslint.io)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)

You can see the details and tweak the configuration to your needs in `eslint.config.js`.

### TypeScript

By default, all `.ts/.tsx` files in the `src` directory are included for analysis. Strict type checking and several linting options are enabled to catch unused local variables or function parameters and to prevent unsafe `switch` cases. The configuration ensures that the code complies with the JavaScript features supported by the ES2020.

The compiler won't emit JavaScript files, leaving that responsibility to Vite.

You can change the configuration in `tsconfig.app.json`.

### Vitest

By default, Vitest is configured to use the [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) plugin to handle React's JSX syntax. It also uses [jsdom](https://github.com/jsdom/jsdom) as its testing environment. You can change the configuration in `vitest.config.ts`.

### Testing Library

The React trees mounted with `render` are by default unmounted after each test. You can change the setup in `vitest.setup.ts`.

### Mock Service Worker

The [MSW/Node.js integration module](https://mswjs.io/docs/getting-started#step-3-integrate) (`src/mocks/node.ts`) is handled in `vitest.setup.ts`.

### Vite

By default, Vite is configured to use the [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) plugin to handle React's JSX syntax. You can change the configuration in `vite.config.ts`.

### PostCSS

PostCSS can be configured in `postcss.config.js`. By default, it uses Tailwind CSS (configured in `tailwind.config.js`) to generate CSS and [Autoprefixer](https://github.com/postcss/autoprefixer) (which uses the recommended default [Browserslist](https://browsersl.ist) configuration from `.browserslistrc`) to ensure cross-browser support by automatically adding necessary CSS prefixes.

### EditorConfig

To keep line endings consistent across different development environments, [EditorConfig](https://editorconfig.org) is set to use LF. You can change the configuration in `.editorconfig`.

### VS Code

Visual Studio Code has some workspace settings added by default. These set Prettier as the default formatter and make the editor always open `.css` files in [Tailwind CSS mode](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss#files.associations). You can change these settings in `.vscode/setttings.json`.

You can also add the following to your [global VS Code user settings](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) to automatically format files with Prettier:

```json
"editor.formatOnPaste": true,
"editor.formatOnSave": true,
"editor.formatOnType": true
```

### Git

Line endings are set to LF in `.gitattributes`. Files to be [ignored by Git](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository#_ignoring) can be specified in `.gitignore`.

## License

This project is licensed under the [MIT License](https://github.com/m-kupiec/starter-app-react-ts-tailwind/blob/main/LICENSE.txt).
