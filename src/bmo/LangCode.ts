/**
 *
 * 功能描述:
 *
 * @className LangCode
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/29 11:49
 */
export class LangCode {
  private lang: string;
  private label: string;
  private defaultCode: string;
  public getLang (): string {
    return this.lang
  }
  public setLang (lang: string): void {
    this.lang = lang
  }
  public getLabel (): string {
    return this.label
  }
  public setLabel (label: string): void {
    this.label = label
  }
  public getDefaultCode (): string {
    return this.defaultCode
  }
  public setDefaultCode (defaultCode: string): void {
    this.defaultCode = defaultCode
  }
}
