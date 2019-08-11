import { JsonProperty } from 'papio-h5'

/**
 *
 * 功能描述:
 *
 * @className MemberRegisterRequest
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:18
 */
export class UserRegisterRequest {
  @JsonProperty
  private credential: string
  @JsonProperty
  private identifier: string
  @JsonProperty
  private identityType: number
  @JsonProperty
  private nickname: string
  public getCredential (): string {
    return this.credential
  }
  public setCredential (credential: string): void {
    this.credential = credential
  }
  public getIdentifier (): string {
    return this.identifier
  }
  public setIdentifier (identifier: string): void {
    this.identifier = identifier
  }
  public getIdentityType (): number {
    return this.identityType
  }
  public setIdentityType (identityType: number): void {
    this.identityType = identityType
  }
  public getNickname (): string {
    return this.nickname
  }
  public setNickname (nickname: string): void {
    this.nickname = nickname
  }
}
