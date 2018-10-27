import * as fs from "fs"
import * as path from "path"
import * as child from "child_process"
import * as spawn from "cross-spawn"
import chalk from "chalk"
import {
  getName,
  getLang,
  getTest,
  getEnzyme,
  getCss,
  getModule,
  getReady,
  getTsCompiler,
  getSw,
  getLinter,
} from "./questions"
import { yarnAvaible, spS, errPrefix, spawnSt } from "./util"
import {
  webpackDep,
  babelDep,
  reactDep,
  typescriptDep,
  babelTsDep,
  eslintDep,
  tslintDep,
  jestDep,
  jestTsDep,
  cssDep,
  sassDep,
} from "./dependencies"
import { babel, webpack, basics } from "./setup"

async function main() {
  const name = await getName()
  const lang = await getLang()
  const compiler = lang === "ts" ? await getTsCompiler() : null
  const linter = await getLinter(lang)
  const test = await getTest()
  // TODO: add enzyme
  // const enzyme = test ? await getEnzyme() : null
  const css = await getCss()
  // TODO: add css modules ans sw
  // const modules = await getModule()
  // const sw = await getSw()

  const projectPath = path.resolve(process.cwd(), name)

  fs.mkdirSync(projectPath)

  const yarn = yarnAvaible()
  const command = yarn ? "yarn" : "npm"
  const instCo = yarn ? "add" : "install"

  // await getReady()

  await spS(command, ["init", "-y"], projectPath)

  let devDependencies = webpackDep
  if (lang === "js") {
    devDependencies = devDependencies.concat(babelDep)
    if (linter) {
      devDependencies = devDependencies.concat(eslintDep)
    }
    if (test) {
      devDependencies = devDependencies.concat(jestDep)
    }
  } else if (lang === "ts") {
    devDependencies = devDependencies.concat(typescriptDep)
    if (compiler === "babel") {
      devDependencies = devDependencies.concat(babelDep, babelTsDep)
    } else {
      // TODO: add awesome-ts-loader
    }
    if (linter) {
      devDependencies = devDependencies.concat(tslintDep)
    }
    if (test) {
      devDependencies = devDependencies.concat(jestDep, jestTsDep)
    }
  }
  devDependencies = devDependencies.concat(cssDep)
  if (css === "sass") {
    devDependencies = devDependencies.concat(sassDep)
  }

  console.log(chalk.blue(">>"), "Install devDependencies...")
  await spawnSt(command, [instCo, "-D", ...devDependencies], projectPath)

  let dependencies = reactDep

  console.log(chalk.blue(">>"), "Install dependencies...")
  await spawnSt(command, [instCo, ...dependencies], projectPath)

  if ((lang === "ts" && compiler === "babel") || lang === "js") {
    babel(lang === "ts", projectPath)
    webpack(lang === "ts", css === "sass", projectPath)
    basics(name, lang === "ts", css === "sass", projectPath)
  }
  if (lang === "ts") {
    function l(lib: string) {
      return `--lib ${lib}`
    }
    const t = child.execSync(
      `${path.resolve(
        projectPath,
        "node_modules/.bin/tsc"
      )} --init --jsx react ${l("es2015")} ${l("es2016")} ${l("dom")}`
    )
  }
}

main()
