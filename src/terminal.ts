import { InternalTerminal } from './internal-terminal';
import { TerminalKey, terminalKeyToValue } from './terminal-key';

export class Terminal {
  private readonly _internalTerminal: InternalTerminal;
  private _originalStdout?: typeof process.stdout.write;

  constructor(size: [number, number]) {
    this._internalTerminal = new InternalTerminal(size);
  }

  public get width() {
    return this._internalTerminal.width;
  }

  public get height() {
    return this._internalTerminal.height;
  }

  public get text() {
    return [...this._internalTerminal.historyText, ...this._internalTerminal.currentText];
  }

  public write(text: string): boolean {
    return this._internalTerminal.write(text);
  }

  public sendKey(key: TerminalKey) {
    this.write(terminalKeyToValue(key));
  }

  public redirectStdout() {
    this._originalStdout ??= process.stdout.write;
    process.stdout.write = (text: string) => this.write(text);
  }

  public restoreStdout() {
    if (!this._originalStdout) {
      throw new Error('Cannot restore stdout because it was not replaced by this temrinal instance');
    }
    process.stdout.write = this._originalStdout;
  }
}
