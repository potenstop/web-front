/**
 *
 * 功能描述:
 *
 * @className JavaBeanUtil
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/21 14:16
 */
class JavaTypes {
  public static INTEGER = 'Integer'
  public static STRING = 'String'
}
class Field {
  public name: string;
  public type: string;


}
export class JavaBeanUtil {
  public static toJSONString() {

  }
  public static jsonToJavaBean(json: JSON) {
    const dataList: string[] = []

    Object.keys(json).forEach(key => {
      // if (json)
    })

  }

}
