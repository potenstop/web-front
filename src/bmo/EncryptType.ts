/**
 *
 * 功能描述:
 *
 * @className EncryptType
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/18 15:36
 */
export class EncryptType {
  public name: string
  public desc: string
  public hasSalt: boolean

  constructor(name: string, desc: string, hasSalt: boolean) {
    this.name = name
    this.desc = desc
    this.hasSalt = hasSalt
  }
}
