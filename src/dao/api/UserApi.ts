/**
 *
 * 功能描述:
 *
 * @className UserApi
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
} from 'papio-h5'
import { ApiResult } from "@/bmo/ApiResult"
import { UserAuthBaseResponse } from "@/response/UserAuthBaseResponse"
@AxisoRemote({filepath: '/src/dao/api', name: "/user", timeout: 5000})
export class UserApi {
  @RequestMapping({path: "visitor/login", method: RequestMethod.GET})
  @ReturnGenericsProperty(new Map<string, new () => object>().set("ApiResult", ApiResult).set("ApiResult.data", UserAuthBaseResponse))
  public visitorLogin(@RequestParam("uuid") uuid: string): Promise<ApiResult<UserAuthBaseResponse>> {
    return null
  }
}
