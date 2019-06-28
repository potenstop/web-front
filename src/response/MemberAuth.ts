import { Property } from 'papio-common'

/**
 *
 * 功能描述:
 *
 * @className MemberAuth
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/26 12:47
 */
export class MemberAuth {
  @Property
  private memberAuthId: number
  @Property
  private identityType: number
  @Property
  private identifier: string
  public getMemberAuthId (): number {
    return this.memberAuthId
  }
  public setMemberAuthId (memberAuthId: number): void {
    this.memberAuthId = memberAuthId
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
