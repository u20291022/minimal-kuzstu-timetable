import { existsSync, mkdirSync, appendFileSync } from "fs"

class FileSystem {
  public append<Data extends { toString(): string }>(path: string, data: Data): void {
    appendFileSync(path, data.toString());
  }

  public makeDirectory(directoryPath: string): void {
    if (!this.exists(directoryPath)) {
      mkdirSync(directoryPath, {recursive: true})
    }
  }

  public exists(path: string): boolean {
    return existsSync(path);
  }
}

export const fileSystem = new FileSystem();