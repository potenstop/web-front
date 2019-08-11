/**
 *
 * 功能描述:
 *
 * @className LangBean
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/22 12:50
 */

import { ConvertUtil, JSHelperUtil } from 'papio-h5'
class Field {
  public name: string
  public javaType: string
  public tsType: string
}
class JavaTypes {
  public static INTEGER = 'Integer'
  public static STRING = 'String'
  public static BIGDECIMAL = 'BigDecimal'
  public static BOOLEAN = 'Boolean'
}
class TsTypes {
  public static NUMBER = 'number'
  public static STRING = 'string'
  public static BOOLEAN = 'boolean'
}
interface Options {
  // 是否生产get set方法
  hasGetSet?: boolean
  // 空格数量
  space?: number
  // 字段名称转换 0 不转换 1 转为驼峰 2 下划线
  nameFormat?: number
}

export class LangBean {
  private className: string = 'Test'
  private fields: Field[] = []
  private space: number = 4
  private spaceString: string = ''
  private line: string = '\n'
  private nameFormat: number = 1
  private hasGetSet: boolean = true
  private outClassName: Map<string, LangBean> = new Map<string, LangBean>()
  private options: Options

  constructor (json: any, options?: Options) {
    if (options) {
      this.options = options
      if (options.hasGetSet !== undefined) {
        this.hasGetSet = options.hasGetSet
      }
      if (options.space !== undefined) {
        this.space = options.space
      }
      if (options.nameFormat !== undefined) {
        this.nameFormat = options.nameFormat
      }
    }
    this.setSpace(this.space)
    this.initJson(json)
  }
  private initJson (json: any) {
    if (JSHelperUtil.isClassObject(json)) {
      Object.keys(json).forEach(key => {
        const value = json[key]
        const field = new Field()
        field.name = key
        if (JSHelperUtil.isBaseObject(value)) {
          if (typeof value === 'number') {
            // 判断是否为整数
            if (Number.isInteger(value)) {
              field.javaType = JavaTypes.INTEGER
            } else {
              field.javaType = JavaTypes.BIGDECIMAL
            }
            field.tsType = TsTypes.NUMBER
          } else if (typeof value === 'boolean') {
            field.javaType = JavaTypes.BOOLEAN
            field.tsType = TsTypes.BOOLEAN
          } else if (typeof value === 'string') {
            field.javaType = JavaTypes.STRING
            field.tsType = TsTypes.STRING
          }
          this.addField(field)
        } else if (JSHelperUtil.isClassObject(value)) {
          this.addOutClass(key, value)
          field.javaType = ConvertUtil.toFirstUpperCase(key)
          field.tsType = ConvertUtil.toFirstUpperCase(key)
          this.addField(field)
        } else if (Array.isArray(value) && value.length > 0) {
          this.initArray(key, value)
        }
      })
    }
  }
  private initArray (key: string, array: any[]) {
    if (array.length > 0) {
      console.log(key, array)
      const value = array[0]
      const field = new Field()
      field.name = key
      if (JSHelperUtil.isBaseObject(value)) {
        if (typeof value === 'number') {
          // 判断是否为整数
          if (Number.isInteger(value)) {
            field.javaType = `List<${JavaTypes.INTEGER}>`
          } else {
            field.javaType = `List<${JavaTypes.BIGDECIMAL}>`
          }
          field.tsType = `${TsTypes.NUMBER}[]`
        } else if (typeof value === 'boolean') {
          field.javaType = `List<${JavaTypes.BOOLEAN}>`
          field.tsType = `${TsTypes.BOOLEAN}[]`
        } else if (typeof value === 'string') {
          field.javaType = `List<${JavaTypes.STRING}>`
          field.tsType = `${TsTypes.STRING}[]`
        }
        this.addField(field)
      } else if (JSHelperUtil.isClassObject(value)) {
        // 去掉结尾的s 或者list
        const ends: string[] = ['s', 'List']
        for (const end of ends) {
          if (key.slice(key.length - end.length, key.length) === end) {
            key = key.slice(0, key.length - end.length)
            break
          }
        }
        this.addOutClass(key, value)
        field.javaType = `List<${ConvertUtil.toFirstUpperCase(key)}>`
        field.tsType = `${ConvertUtil.toFirstUpperCase(key)}[]`
        this.addField(field)
      }
    }
  }

  private setSpace (space: number) {
    this.space = space
    let tab = ''
    for (let len = space; len > 0; len--) {
      tab += ' '
    }
    this.spaceString = tab
  }
  public setClassName (className: string) {
    this.className = className
  }
  public addField (field: Field) {
    this.fields.push(field)
  }
  public addOutClass (className: string, value: JSON) {
    const bean = new LangBean(value, this.options)
    bean.setClassName(ConvertUtil.toFirstUpperCase(className))
    this.outClassName.set(className, bean)
  }
  public toTypeString () : string {
    const strList: string[] = []
    const fieldEmbellish = this.hasGetSet ? 'private' : 'public'
    strList.push(`export class ${this.className} {`)
    strList.push(this.line)
    // 生成field
    this.fields.forEach(value => {
      if (this.nameFormat === 1) {
        value.name = ConvertUtil.toHump(value.name)
      } else if (this.nameFormat === 2) {
        value.name = ConvertUtil.toLine(value.name)
      }
      strList.push(`${this.spaceString}${fieldEmbellish} ${value.name}: ${value.tsType};`)
      strList.push(this.line)
    })
    if (this.hasGetSet) {
      // 生成get set
      this.fields.forEach(value => {
        // get方法
        strList.push(`${this.spaceString}public get${ConvertUtil.toFirstUpperCase(value.name)} (): ${value.tsType} {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`return this.${value.name};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        // set方法
        strList.push(`${this.spaceString}public set${ConvertUtil.toFirstUpperCase(value.name)} (${value.name}: ${value.tsType}): void {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`this.${value.name} = ${value.name};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
      })
    }
    strList.push('}')
    // outClass
    this.outClassName.forEach((value, key) => {
      strList.push(this.line)
      strList.push(value.toTypeString())
    })
    return strList.join('')
  }
  public toJavaString (): string {
    const strList: string[] = []
    const fieldEmbellish = this.hasGetSet ? 'private' : 'public'
    strList.push(`public class ${this.className} {`)
    strList.push(this.line)
    // 生成field
    this.fields.forEach(value => {
      if (this.nameFormat === 1) {
        value.name = ConvertUtil.toHump(value.name)
      } else if (this.nameFormat === 2) {
        value.name = ConvertUtil.toLine(value.name)
      }
      strList.push(`${this.spaceString}${fieldEmbellish} ${value.javaType} ${value.name};`)
      strList.push(this.line)
      strList.push(this.line)
    })
    if (this.hasGetSet) {
      // 生成get set
      this.fields.forEach(value => {
        // get方法
        strList.push(`${this.spaceString}public ${value.javaType} get${ConvertUtil.toFirstUpperCase(value.name)}() {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`return this.${value.name};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
        // set方法
        strList.push(`${this.spaceString}public void set${ConvertUtil.toFirstUpperCase(value.name)}(${value.javaType} ${value.name}) {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`this.${value.name} = ${value.name};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
      })
    }
    if (strList[strList.length - 1] === '\n') {
      strList[strList.length - 1] = '}'
    } else {
      strList.push('}')
    }
    // outClass
    this.outClassName.forEach((value, key) => {
      strList.push(this.line)
      strList.push(value.toJavaString())
    })
    return strList.join('')
  }
}
