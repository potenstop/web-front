/**
 *
 * 功能描述: 获取js相关的帮助类
 *
 * @className JSHelperUtil
 * @projectName papio
 * @author yanshaowen
 * @date 2018/12/30 10:41
 */

export class JSHelperUtil {
  /**
   * 方法描述： 获取函数的参数名称列表
   * @author yanshaowen
   * @date 2018/12/30 11:02
   * @param fn 函数对象
   * @return 参数名称列表
   */
  public static getArgsNameList(fn: any): string[] {
    if (typeof fn !== "object" && typeof fn !== "function" ) { return [] }
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    const DEFAULT_PARAMS = /=[^,)]+/mg
    const FAT_ARROWS = /=>.*$/mg
    let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString()
    code = code
      .replace(COMMENTS, "")
      .replace(FAT_ARROWS, "")
      .replace(DEFAULT_PARAMS, "")
    const result = code.slice(code.indexOf("(") + 1, code.indexOf(")")).match(/([^\s,]+)/g)
    return result === null ? [] : result
  }
  /**
   * 方法描述 判断type是否为基础类型
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return true: 基础类型 false object: 类型
   */
  public static isBaseType(type: any) {
    // 数字和字符串 布尔为基础类型
    return type === Number || type === String || type === Boolean
  }
  /**
   * 方法描述 判断type是否为object类型 不包括数组 基础类型 null undefined void
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return
   */
  public static isClassType(type: any) {
    return !(JSHelperUtil.isBaseType(type) || Array === type || type === null || type === undefined)
  }
  /**
   * 方法描述 判断type是否为数组类型
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return
   */
  public static isArrayType(type: any) {
    return type === Array
  }
  /**
   * 方法描述 判断type是否为Set类型
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return
   */
  public static isSetType(type: any) {
    return type === Set
  }
  /**
   * 方法描述 判断是否为null或者undefined
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return
   */
  public static isNullOrUndefined(type: any) {
    return (type === null || type === undefined)
  }
  /**
   * 方法描述 判断是否为null或者undefined
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param type   需要判断的类型对象
   * @return
   */
  public static isNotNull(type: any) {
    return !JSHelperUtil.isNullOrUndefined(type)
  }
  /**
   * 方法描述 判断object是否为基础类型
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param value   需要判断的类型对象
   * @return true: 基础类型 false object: 类型
   */
  public static isBaseObject(value: any): boolean {
    // 数字和字符串 布尔为基础类型
     const typeString = typeof value
     return typeString === "number" || typeString === "string" || typeString === "boolean"
  }
  /**
   * 方法描述 判断object是否为object类型 不包括数组 基础类型 null undefined void
   * @author yanshaowen
   * @date 2018/12/30 11:05
   * @param value   需要判断的类型对象
   * @return
   */
  public static isClassObject(value: any) {
    return !(JSHelperUtil.isBaseObject(value) || Array.isArray(value) || value === null || value === undefined)
  }

}
