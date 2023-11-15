import { fileSystem } from "./filesystem"

class Logger {
  private logsDirectoryPath = "logs"

  constructor() {
    fileSystem.makeDirectory(this.logsDirectoryPath)
  }

  public write<T extends { toString(): string }>(data: T, silent = false): void {
    const currentDateString = new Date().toDateString()
    const currentTimeString = new Date().toLocaleTimeString()

    const logPath = this.logsDirectoryPath + "/" +  currentDateString + ".txt"
    const logData = `[${currentTimeString}] ${data.toString()}`

    fileSystem.append(logPath, logData + "\n")
    if (!silent) console.log(logData)
  }
}

export const logger = new Logger()