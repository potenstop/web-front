/**
 *
 * 功能描述:
 *
 * @className SysUtil
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/17 14:42
 */
export class SysUtil {
  static evil (code: string) {
    return new Function('return ' + code)()
  }
  static generateUUID () : string {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }
}
