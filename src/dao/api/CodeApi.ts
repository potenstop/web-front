/**
 *
 * 功能描述:
 *
 * @className CodeApi
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/27 16:47
 */
import {
  AxisoRemote,
  PostMapping, RequestBody,
  ReturnGenericsProperty
} from 'papio-common'
import { ApiResult } from '@/bmo/ApiResult'
import {CodeRunRequest} from "@/request/CodeRunRequest";
@AxisoRemote({filepath: '/src/dao/api', name: "/code", timeout: 10000})
export class CodeApi {
  @PostMapping({path: "/run"})
  @ReturnGenericsProperty(new Map<string, new () => object>().set("ApiResult", ApiResult).set("ApiResult.data", String))
  public codeRun (@RequestBody request: CodeRunRequest): Promise<ApiResult<string>> {
    return null;
  }
}
