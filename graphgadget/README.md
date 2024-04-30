# graphgadget
This is the project containing the web application that we will be developing.

## how to run
1. Install [nodejs](https://nodejs.org/en/download). You can whether it is intalled by running the command "npm" in the terminal.
2. Move with the terminal to the "code/graphgadget" directory.
3. For the first time you must run "npm install" this will fetch all required packages
4. Build the project using the command "npm run build". The output should be visible in the "graphgadget/build" folder.
5. To run the website use "npm run preview". You can also use "npm run dev" if you dont want to build each time.
6. When you are finished press 'q' to exit

## testing
There are 2 main ways of testing.

The first is with vitest. These are files in "graphgadget/src" that end with the extension: .test.ts . These tests are meant for unit tests.

The second method is via playwright, which allows system tests. These are found in the "graphgadget/tests" directory. 

To run the test you can use the command "npm run test"
