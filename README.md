# Software Project: Speech Dataset Visualization
This project is a part of the TU Delft 2023/2024 Software Project. During which a web application 'Graph Gadget' (name subject to change) was developed.

Graph Gadget is a website that visualizes, primarily but not limited to, speech meta data.

![main pipeline](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code/badges/main/pipeline.svg?ignore_skipped=true&key_text=main+pipeline&key_width=90)
![main statement coverage](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code/badges/main/coverage.svg?key_text=main+statement+coverage&key_width=157)

### Technology stack
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&labelColor=gray)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&labelColor=gray)](https://en.wikipedia.org/wiki/css3)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&labelColor=gray)](https://www.npmjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&labelColor=gray)](https://vitejs.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=Svelte&labelColor=gray)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&labelColor=gray)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&labelColor=gray)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=Vitest&labelColor=gray)](https://vitest.dev/)
[![Tailwind css](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&labelColor=gray)](https://tailwindcss.com/)

## Contents
1. [**⚡ Getting started**](#⚡-getting-started)
2. [**🔗 Useful links**](#🔗-useful-links)
3. [**🏗️ Project structure**](#🏗️-project-structure)
4. [**🎨 Styling**](#🎨-styling)
5. [**🧪 Testing**](#🧪-testing)
6. [**ℹ️ About us**](#ℹ️-about-us)

## ⚡ Getting started

To run the project you need to follow the following steps:

1. **Clone the git repository to your local machine**
2. **Open the terminal into the graphgadget subfolder:**
   - Open your terminal.
   - Use the `cd` command to navigate to the 'graphgadget' folder.
     ```bash
     cd /path/to/the/project/graphgadget
     ```
3. **Install dependencies:**
   - If this is your first time running the project, install the necessary dependencies by running:
     ```bash
     npm install
     ```
4. **Run the project:**
   - Use the `npm run dev` command to run the website:
     ```bash
     npm run dev
     ```
   - Alternatively, you can simulate the pipeline by running `npm run all`. This would run checkstyle, build, test, and run in that order:
     ```bash
     npm run all
     ```
     Note: when running the tests for the first time you might need to install extra dependancies for the testing framework:
     ```bash
     npx playwright install
     ```

## 🔗 Useful links
- **Hosted locations:**
    - [Gitlab Pages](https://code-cse2000-software-project-2023-2024-cluster--b9a47b9440c17a.pages.ewi.tudelft.nl/)

- **Related repositories:**
    - [Code repository](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code)
    - [Documents repository](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/documents)

- **Related reports and documents:**
    - [Report](https://www.overleaf.com/read/fbvcpsjggszz#a44e80)
    - [Code of Conduct](https://www.overleaf.com/read/thygttdrhczt#3f911d)
    - [Project Plan](https://www.overleaf.com/read/fccvwktkrjtt#d315f0)

## 🏗️ Project structure
The project is structured as follows:
- graphgadget: 
    - src: 
        - lib: contains Svelte components and TypeScript modules.
        - routes: contains the pages. For example, `routes/modify/+page.svelte` is the page: `/modify`.
    - static: contains static assets such as icons.
    - tests: contains system tests.

## 🎨 Styling
[![Tailwind css](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&labelColor=gray)](https://tailwindcss.com/)
[![Flowbite](https://img.shields.io/badge/Flowbite-rgb(30,66,159))](https://flowbite.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&labelColor=gray)](https://en.wikipedia.org/wiki/css3)

We are using  and  for styling components and other types of styling. Tailwind is used as an inline CSS enhancer and Flowbite provides Svelte components for common elements seen in websites, such as a loading spinner.

## 🧪 Testing
The project uses 2 different methods of testing frameworks for testing: unit tests and E2E tests. 

### Unit tests & Integration tests
For unit and integration tests we use:
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=Vitest&labelColor=gray)](https://vitest.dev/)

A unit test is a block of code that verifies the accuracy of a smaller, isolated block of application code, typically a function or method. The unit test is designed to check that the block of code runs as expected, according to the developer's theoretical logic behind it. - [Amazon](https://aws.amazon.com/what-is/unit-testing/#:~:text=A%20unit%20test%20is%20a,developer's%20theoretical%20logic%20behind%20it.)

Integration testing is a type of software testing where components of the software are gradually integrated and then tested as a unified group. Usually, these components are already working well individually, but they may break when integrated with other components. - [katalon](https://katalon.com/resources-center/blog/integration-testing)

Unit and integration tests can be found throughout the project, they can be identified by their extension: `.test.ts`. In some cases a `.help.ts` file can be found along side it. Suc files contain helper functions to find specific elements or perform common actions like clicking a button. 

### E2E tests
For end-to-end tests we use: 
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&labelColor=gray)](https://playwright.dev/)

End-to-end (E2E) testing is a Software testing methodology to test a functional and data application flow consisting of several sub-systems working together from start to end. - [Microsoft](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/e2e-testing/)

E2E tests can be found in the `/graphgadget/tests` folder.

## ℹ️ About us
This project was a part of the TU Delft 2023/2024 Software Project. The following people were a part of this project:


| Role     | Name               | Email                      |
| -------- | ------------------ | -------------------------- |
| Client   | Odette Scharenborg | O.E.Scharenborg@tudelft.nl |
| Client   | Tanvina Patel      | T.B.Patel@tudelft.nl       |
| Coach    | Thomas Durieux     | Thomas.Durieux@tudelft.nl  |
| Developer| Boris Annink       | B.R.M.Annink@student.tudelft.nl |
| Developer| Edward Oh          | J.Oh-2@student.tudelft.nl   |
| Developer| Emīls Dzintars     | E.Dzintars@student.tudelft.nl |
| Developer| Mateo Nasse        | M.A.Nasse@student.tudelft.nl |
| Developer| Pedro Gomes Moreira| P.GomesMoreira@student.tudelft.nl |
| TA       | Timur Oberhuber    | T.Oberhuber@student.tudelft.nl |
