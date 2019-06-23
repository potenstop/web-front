/**
 *
 * 功能描述:
 *
 * @className ConvertUtil
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/22 13:38
 */
/**
 * 转换工具类
 */
export class ConvertUtil {
  // 下划线转换驼峰
  public static toHump (name: string) {
    return name.replace(/\_(\w)/g, (all, letter) => {
      return letter.toUpperCase()
    });
  }
  // 驼峰转换下划线
  public static toLine (name: string) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase()
  }
  // 首字母大写
  public static toFirstUpperCase (name: string): string {
    return name[0].toLocaleUpperCase() + name.slice(1, name.length)
  }
}
