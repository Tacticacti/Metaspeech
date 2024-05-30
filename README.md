# Software Project: Speech Dataset Visualization

Graph Gadget is a website that visualizes, primarily but not limited to, speech meta data.

![main statement coverage](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code/badges/main/coverage.svg?key_text=main+statement+coverage&key_width=157)
![main pipeline](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code/badges/main/pipeline.svg?ignore_skipped=true&key_text=main+pipeline&key_width=90)


## Getting started

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

## Project structure
The project is structured as follows:
- graphgadget: 
  - src: 
    - lib: contains svelte componenents and typescript modules.
    - routes: contains the pages. For example, `routes/modify/+page.svelte` is the page: `/modify`.
  - static: contains static assets such as icons.
  - tests: contains system tests.

## Technology stack
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&labelColor=gray)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&labelColor=gray)](https://en.wikipedia.org/wiki/css3)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&labelColor=gray)](https://www.npmjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&labelColor=gray)](https://vitejs.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=Svelte&labelColor=gray)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&labelColor=gray)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&labelColor=gray)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=Vitest&labelColor=gray)](https://vitest.dev/)
[![Tailwind css](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&labelColor=gray)](https://tailwindcss.com/)


## Usefull links
- **Hosted locations:**
    - [Gitlab Pages](https://code-cse2000-software-project-2023-2024-cluster--b9a47b9440c17a.pages.ewi.tudelft.nl/)

- **Related repositories:**
    - [Code repository](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/code)
    - [Documents repository](https://gitlab.ewi.tudelft.nl/cse2000-software-project/2023-2024/cluster-s/15a/documents)

- **Related reports and documents:**
    - [Report](https://www.overleaf.com/3294929372phcbcjzgxsqg#4af51f)
    - [Code of Conduct](https://www.overleaf.com/6212343596rpkcsdzvxvqh#74f42f)
    - [Project Plan](https://www.overleaf.com/4843161939vfjxtkknvvvw#fdf6cb)

## About us
This project was a part of the TU Delft 2023/2024 Software Project.

It was developed by:

| Name | Student id | Email |
| ------ | ------ | ----- |
| Boris Annink | 5591147 | B.R.M.Annink@student.tudelft.nl |
| Edward Oh |        | J.Oh-2@student.tudelft.nl |
| Emīls Dzintars |        | E.Dzintars@student.tudelft.nl |
| Mateo Nasse |        | M.A.Nasse@student.tudelft.nl |
| Pedro Gomes Moreira |        | P.GomesMoreira@student.tudelft.nl |

The project was guided by:

| Role | Name | Email |
| ------ | ------ | -- |
| Client | Odette Scharenborg | O.E.Scharenborg@tudelft.nl |
| Client | Tanvina Patel | T.B.Patel@tudelft.nl |
| TA | Timur Oberhuber | T.Oberhuber@student.tudelft.nl |
| Coach | Thomas Durieux | Thomas.Durieux@tudelft.nl |
