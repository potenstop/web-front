/**
 *
 * 功能描述:
 *
 * @className SysUtil
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/17 14:42
 */
import { EncryptType } from '../../bmo/EncryptType'
export class SysUtil {
  static evil (code: string) {
    return new Function('return ' + code)()
  }
}
