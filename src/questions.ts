import * as inquirer from "inquirer"
import * as fs from "fs"
import * as path from "path"

export async function getName(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What's the name of your project?",
      validate: (value: string) => {
        const projectPath = path.resolve(process.cwd(), value)
        if (fs.existsSync(projectPath)) {
          return `A folder or a file '${value}' already exist.`
        }
        return true
      },
    },
  ])
  return answer.name
}

export async function getType(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "size",
      message: "What 'type' of application do you want?",
      choices: [
        { name: "Webpack only", value: "webpack", disabled: "Comming soon..." },
        { name: "React (with webpack)", value: "react" },
      ],
    },
  ])
  return answer.size
}

export async function getLang(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "lang",
      message: "What language you will use?",
      choices: [
        {
          name: "Typescript",
          value: "ts",
        },
        {
          name: "Modern Javascript",
          value: "js",
        },
      ],
    },
  ])
  return answer.lang
}

export async function getTsCompiler(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "compiler",
      message: "What 'compiler' for typescript?",
      choices: [
        {
          name: "Babel with @babel/preset-env",
          value: "babel",
        },
        {
          name: "Default typescript compiler with awesome-ts-loader",
          value: "awesome-ts-loader",
          disabled: "Comming soon...",
        },
      ],
    },
  ])
  return answer.compiler
}

export async function getLinter(lang: string): Promise<boolean> {
  if (lang === "ts") {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "lint",
        message: "Do you want tslint installed?",
      },
    ])
    return answer.lint
  } else {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "list",
        message: "Do you want eslint installed?",
      },
    ])
    return answer.list
  }
}

export async function getTest(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "test",
      message: "Do want your application to have tests?",
      default: true,
    },
  ])
  return answer.test
}

export async function getEnzyme(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "enzyme",
      message: "Do you want enzyme setup for your tests?",
    },
  ])
  return answer.enzyme
}

export async function getCss(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "css",
      message: "What 'type' of css do you want?",
      choices: [
        { name: "Less", value: "less", disabled: "Comming soon..." },
        { name: "Sass", value: "sass" },
        { name: "Css", value: "css" },
      ],
    },
  ])
  return answer.css
}

export async function getModule(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "module",
      message: "Do you want css modules?",
    },
  ])
  return answer.module
}

export async function getSw(): Promise<string> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "sw",
      message: "Do you want service workers?",
      choices: [
        {
          name: "Customizable sw with workbox",
          value: "customsw",
          disabled: "Comming soon...",
        },
        { name: "Complete sw with workbox", value: "complete" },
        { name: "No preconfigured service workers", value: "none" },
      ],
    },
  ])
  return answer.sw
}

export async function getReady(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "ready",
      message: "Ready?",
    },
  ])
  return answer.ready
}
