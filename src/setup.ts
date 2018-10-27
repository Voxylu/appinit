import * as fs from "fs"
import * as path from "path"
import {
  babelConf,
  webpackComon,
  webpackDev,
  webpackProd,
  tsDeclaration,
  indexSrc,
  indexCmp,
  appCmp,
  appCss,
  indexHtml,
} from "./filesGen"
import { spS } from "./util"

export function babel(ts: boolean, cwd: string) {
  fs.writeFileSync(path.resolve(cwd, ".babelrc"), babelConf(ts))
}

export function webpack(ts: boolean, sass: boolean, cwd: string) {
  const configPath = path.resolve(cwd, "config")
  function getFilePath(file: string) {
    return path.resolve(configPath, file)
  }
  fs.mkdirSync(configPath)
  fs.writeFileSync(getFilePath("webpack.common.js"), webpackComon(ts))
  fs.writeFileSync(getFilePath("webpack.dev.js"), webpackDev(sass))
  fs.writeFileSync(getFilePath("webpack.prod.js"), webpackProd(sass))
  if (ts) {
    fs.writeFileSync(getFilePath("declarations.d.ts"), tsDeclaration)
  }
  const packagePath = path.resolve(cwd, "package.json")
  const raw = fs.readFileSync(packagePath)
  const projectPackage = JSON.parse(raw.toString()) as any
  if (!projectPackage.scripts) {
    projectPackage.scripts = {}
  }
  projectPackage.scripts.start =
    "webpack-dev-server --config config/webpack.dev.js"
  projectPackage.scripts.build = "webpack --config config/webpack.prod.js"
  fs.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2))
}

export function basics(name: string, ts: boolean, sass: boolean, cwd: string) {
  function g(p: string, file: string) {
    return path.resolve(p, file)
  }
  const publicPath = path.resolve(cwd, "public")
  fs.mkdirSync(publicPath)
  fs.writeFileSync(g(publicPath, "index.html"), indexHtml(name))

  const srcPath = path.resolve(cwd, "src")
  const ext = (s?: boolean) => (ts ? (s ? ".tsx" : ".ts") : s ? ".jsx" : ".js")
  fs.mkdirSync(srcPath)
  fs.writeFileSync(g(srcPath, `index${ext(true)}`), indexSrc(ts))
  const componentsPath = path.resolve(srcPath, "components")
  fs.mkdirSync(componentsPath)
  const appPath = path.resolve(componentsPath, "App")
  fs.mkdirSync(appPath)
  fs.writeFileSync(g(appPath, `index${ext()}`), indexCmp)
  fs.writeFileSync(g(appPath, `App${ext(true)}`), appCmp(ts, sass))
  fs.writeFileSync(g(appPath, `App.${sass ? "s" : ""}css`), appCss)

  // TODO: svg, test
}
