import { Property } from 'papio-common'

/**
 *
 * 功能描述:
 *
 * @className UserAuth
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/26 12:47
 */
export class UserAuth {
  @Property
  private userAuthId: number
  @Property
  private identityType: number
  @Property
  private identifier: string
  public getUserAuthId (): number {
    return this.userAuthId
  }
  public setUserAuthId (userAuthId: number): void {
    this.userAuthId = userAuthId
  }
  public getIdentityType (): number {
    return this.identityType
  }
  public setIdentityType (identityType: number): void {
    this.identityType = identityType
  }
  public getIdentifier (): string {
    return this.identifier
  }
  public setIdentifier (identifier: string): void {
    this.identifier = identifier
  }
}
