/**
 *
 * 功能描述:
 *
 * @className ApiResult
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:21
 */
import { Property } from 'papio-common'
export class ApiResult<T> {
  @Property
  private code: string
  @Property
  private data: T
  @Property
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
