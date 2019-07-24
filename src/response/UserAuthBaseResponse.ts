import {UserAuth} from "@/response/UserAuth";
import { Property } from 'papio-common'
/**
 *
 * 功能描述:
 *
 * @className UserAuthBaseResponse
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:18
 */


export class UserAuthBaseResponse {
  @Property
  private userId: number
  @Property
  private nickname: string
  @Property
  private avatar: string
  @Property
  private userAuthList: UserAuth[]
  public getUserId (): number {
    return this.userId
  }
  public setUserId (userId: number): void {
    this.userId = userId
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
  public getUserAuthList (): UserAuth[] {
    return this.userAuthList
  }
  public setUserAuthList (userAuthList: UserAuth[]): void {
    this.userAuthList = userAuthList
  }
}

