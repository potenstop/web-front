/**
 *
 * 功能描述:
 *
 * @className CodeRunRequest
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/27 19:38
 */
import { JsonProperty } from 'papio-h5'

export class CodeRunRequest {
  @JsonProperty
  private code: string
  @JsonProperty
  private language: string
  public getCode (): string {
    return this.code
  }
  public setCode (code: string): void {
    this.code = code
  }
  public getLanguage (): string {
    return this.language
  }
  public setLanguage (language: string): void {
    this.language = language
  }
}
