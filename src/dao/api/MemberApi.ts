/**
 *
 * 功能描述:
 *
 * @className MemberApi
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/24 14:14
 */
import { MemberRegisterRequest } from '@/request/MemberRegisterRequest'
import { ApiResult } from '@/bmo/ApiResult'
import { MemberAuthBaseResponse } from '@/response/MemberAuthBaseResponse'
import Axios from 'axios'
import { JsonProtocol } from 'papio-common'
Axios.defaults.timeout = 50000
Axios.defaults.baseURL = 'http://127.0.0.1:8080'
export class MemberApi {
  public async register (request: MemberRegisterRequest): Promise<ApiResult<MemberAuthBaseResponse>> {
    const response = await Axios.post('/member/register', request)
    const map = new Map<string, new () => object>()
    map.set('ApiResult.data', MemberAuthBaseResponse)
    return JsonProtocol.jsonToBean(response, ApiResult, map)
  }
  public async visitorLogin (uuid: string): Promise<ApiResult<MemberAuthBaseResponse>> {
    const response = await Axios.get('/member/visitor/login', {
      params: {
        uuid
      }
    })
    if (response.status === 200) {
      const map = new Map<string, new () => object>()
      map.set('ApiResult.data', MemberAuthBaseResponse)
      return JsonProtocol.jsonToBean(response.data, ApiResult, map)
    }
  }
}
