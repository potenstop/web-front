/**
 *
 * 功能描述:
 *
 * @className MemberApi
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:14
 */
import {
  AxisoRemote,
  RequestMapping,
  RequestMethod,
  RequestParam,
  ReturnGenericsProperty
} from 'papio-common'
import { ApiResult } from "@/bmo/ApiResult"
import { MemberAuthBaseResponse } from "@/response/MemberAuthBaseResponse"
@AxisoRemote({filepath: '/src/dao/api', name: "/member", timeout: 5000})
export class MemberApi {
  @RequestMapping({path: "visitor/login", method: RequestMethod.GET})
  @ReturnGenericsProperty(new Map<string, new () => object>().set("ApiResult", ApiResult).set("ApiResult.data", MemberAuthBaseResponse))
  public visitorLogin(@RequestParam("uuid") uuid: string): Promise<ApiResult<MemberAuthBaseResponse>> {
    return null
  }
}
