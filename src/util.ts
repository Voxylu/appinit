import * as childProcess from "child_process"
import chalk from "chalk"

export const errPrefix = chalk.red(">>")

export function yarnAvaible() {
  const res = childProcess.spawnSync("yarn", ["--version"])
  if (res.status === 0) {
    return true
  } else {
    return false
  }
}

export function spawnSt(
  command: string,
  args: string[],
  cwd: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const co = childProcess.spawn(command, args, { cwd, stdio: "inherit" })
    co.on("close", (code) => {
      if (code !== 0) {
        console.error(
          chalk.red(">>"),
          `Error with command: ${command} ${args.join(" ")}`
        )
        process.exit(1)
      }
      resolve(true)
    })
  })
}

export function spS(
  command: string,
  args: string[],
  cwd: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const co = childProcess.spawnSync(command, args, { cwd })
    if (co.status !== 0) {
      console.error(
        errPrefix,
        `Error with command \`${command} ${args.join(" ")}\``
      )
      console.error(co.stderr.toString())
      process.exit(1)
    }
    resolve()
  })
}
