import {MemberAuth} from "@/response/MemberAuth";
import { Property } from 'papio-common'
/**
 *
 * 功能描述:
 *
 * @className MemberAuthBaseResponse
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:18
 */


export class MemberAuthBaseResponse {
  @Property
  private memberId: number
  @Property
  private nickname: string
  @Property
  private avatar: string
  @Property
  private memberAuthList: MemberAuth[]
  public getMemberId (): number {
    return this.memberId
  }
  public setMemberId (memberId: number): void {
    this.memberId = memberId
  }
  public getNickname (): string {
    return this.nickname
  }
  public setNickname (nickname: string): void {
    this.nickname = nickname
  }
  public getAvatar (): string {
    return this.avatar
  }
  public setAvatar (avatar: string): void {
    this.avatar = avatar
  }
  public getMemberAuthList (): MemberAuth[] {
    return this.memberAuthList
  }
  public setMemberAuthList (memberAuthList: MemberAuth[]): void {
    this.memberAuthList = memberAuthList
  }
}

