/**
 *
 * 功能描述:
 *
 * @className ApiResult
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:21
 */
import { JsonProperty } from 'papio-h5'
export class ApiResult<T> {
  @JsonProperty
  private code: string
  @JsonProperty
  private data: T
  @JsonProperty
  private message: string
  public getCode (): string {
    return this.code
  }
  public setCode (code: string): void {
    this.code = code
  }
  public getData (): T {
    return this.data
  }
  public setData (data: T): void {
    this.data = data
  }
  public getMessage (): string {
    return this.message
  }
  public setMessage (message: string): void {
    this.message = message
  }
}
