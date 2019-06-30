/**
 *
 * 功能描述:
 *
 * @className SqlAnalysis
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/30 12:27
 */
import {ConvertUtil, JSHelperUtil} from "papio-common";
class Filed {
  public filedName: string
  public filedType: string
  public comment: string
}
interface Options {
  prefixName?: string
  useLombok?: boolean
  logInfo?: string
  returnType?: string
}
export class SqlAnalysis {
  private space: number = 4
  private spaceString: string = ''
  private line: string = '\n'
  private ddl: string
  private filedList: Filed[] = []
  private prefixName: string
  private useLombok: boolean = false
  private logInfo: string
  private returnType: string
  private primaryFiledName: string
  private primaryFiledType: string
  constructor (ddl: string, option?: Options) {
    this.ddl = ddl
    if (option) {
      this.prefixName = option.prefixName
      if (JSHelperUtil.isNotNull(option.useLombok)) {
        this.useLombok =option.useLombok
      }
      this.logInfo = option.logInfo
      this.returnType = option.returnType
    }
    this.setSpace(this.space)
    this.init()
  }
  private init () {
    const tabInfo = this.ddl.replace(/[\n\r]/g,'').replace(/`/g,'').replace(/_.{1}/g,function(m){return m.toUpperCase()}).replace(/_/g,'')
    const heads = (tabInfo.split('(')[0]).trim().split(/\s+/)
    let head = heads[heads.length - 1]
    head = head.slice(0, 1).toUpperCase() + head.slice(1)
    if (!this.prefixName) {
      this.prefixName = head
    }
    const allFields = /(?<=\().*(?=\))/.exec(tabInfo)
    let fields = []
    if (allFields && allFields.length === 1) {
      fields = allFields[0].split(',')
    }
    const keys = new Set(['PRIMARY','UNIQUE','KEY'])
    fields.forEach((value, index, array) => {
      let commentString: string = null
      let fieldName: string = null
      let fieldType: string = null
      value = value.trim();
      let comment = /(?<=COMMENT).*/.exec(value);
      if (comment && comment.length === 1) {
        comment = /(?<=').*(?=')/.exec(comment[0].trim())
        if (comment && comment.length === 1) {
          commentString = comment[0].trim()
        }
      }
      const valList = value.split(/\s+/);
      if (valList) {
        if (!keys.has(valList[0].toLocaleUpperCase())) {
          fieldName = ConvertUtil.toHump(valList[0])
          if (valList[1]) {
            fieldType = SqlAnalysis.dbType(valList[1])
          }
        } else {
          if (valList[0].toLocaleUpperCase() === 'PRIMARY') {
            this.primaryFiledName = ConvertUtil.toHump(/(?<=\().*(?=\))/.exec(valList[2])[0])
          }
        }

      }
      if (fieldName && fieldType) {
        let filed = new Filed();
        filed.filedName = fieldName
        filed.filedType = fieldType
        filed.comment = commentString
        this.filedList.push(filed)
      }
    })
    if (this.primaryFiledName) {
      this.filedList.forEach(value => {
        if (value.filedName === this.primaryFiledName) {
          this.primaryFiledType = value.filedType
        }
      })
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
  public toController () {
    const funcPrefixName = SqlAnalysis.toFirstLowerCase(this.prefixName)
    let strList: string[] = []
    let returnResponse =  `List<${this.prefixName}Response>`;
    if (JSHelperUtil.isNotNull(this.returnType)) {
      returnResponse = `${this.returnType}<List<${this.prefixName}Response>>`
    }
    strList.push(`import io.swagger.annotations.Api;${this.line}`)
    strList.push(`import io.swagger.annotations.ApiOperation;${this.line}`)
    strList.push(`import org.springframework.beans.factory.annotation.Autowired;${this.line}`)
    strList.push(`import org.springframework.web.bind.annotation.*;${this.line}`)
    strList.push(`import javax.validation.Valid;${this.line}`)
    if (this.useLombok) {
      strList.push(`import lombok.RequiredArgsConstructor;${this.line}`)
    }
    strList.push(`${this.line}`)
    strList.push(`@RestController${this.line}`);
    strList.push(`@RequestMapping("/${this.prefixName}")${this.line}`)
    strList.push(`@Api(description = "${this.prefixName}")${this.line}`)

    if (this.useLombok){
      strList.push(`@RequiredArgsConstructor(onConstructor = @__(@Autowired))${this.line}`)
    }
    strList.push(`public class ${this.prefixName}Controller {${this.line}`)
    if (!this.useLombok) {
      strList.push(`${this.spaceString}@Autowired${this.line}`)
    }
    strList.push(`${this.spaceString}private final ${this.prefixName}Service ${funcPrefixName}Service;${this.line}`)
    // list方法
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@GetMapping("/list")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@ApiOperation(value = "按条件查询多条")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}List(`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(value = "pageNumber", example = "1") @RequestParam(required = true) Integer pageNumber,${this.line}`);
    strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(value = "pageSize", example = "20") @RequestParam(required = true) Integer pageSize,${this.line}`);
    this.filedList.forEach((value, index) => {
      let comma = ','
      if (index === this.filedList.length -1) {
        comma = ''
      }
      strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(value = "${value.filedName}", example = "1") @RequestParam(required = false) ${value.filedType} ${value.filedName}${comma}${this.line}`)
    })
    strList.push(`${this.spaceString}) {`)
    this.setFunctionCode(strList, returnResponse, 'controller-start-request', 'controller-end-response')
    strList.push(`${this.line}`)

    strList.push(`${this.spaceString}}`)
    // by-id方法  有主键才生成
    if (this.primaryFiledName) {
      if (JSHelperUtil.isNotNull(this.returnType)) {
        returnResponse = `${this.returnType}<${this.prefixName}Response>`
      }

      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@GetMapping("/by-id")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@ApiOperation(value = "按id查询一条记录")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}ById(`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(value = "${this.primaryFiledName}", example = "1") @RequestParam(required = true) ${this.primaryFiledType} ${this.primaryFiledName}${this.line}`);
      strList.push(`${this.spaceString}) {`)
      this.setFunctionCode(strList, returnResponse, 'controller-start-request', 'controller-end-response')
      strList.push(`${this.line}${this.spaceString}}`)

    }
    // update方法
    strList.push()
    // delete方法
    strList.push()
    return strList.join("");

  }
  public static dbType (t: string) {
    if(! t){
      return "String";
    }
    t = t.toUpperCase().trim()
    if(t.indexOf("DATE") !== -1 || t.indexOf("TIME")  !==  -1){
      return "Date";
    }

    if(t.indexOf("CHAR") !== -1 || t.indexOf("TEXT") !== -1 || t.indexOf("LOB") !== -1){
      return "String";
    }

    if(t.indexOf("INT") !== -1){
      return "Integer";
    }

    if((t.toUpperCase()).indexOf("DECIMAL") !== -1 || t.indexOf("NUM") !== -1 || t.indexOf("DOUBLE") !== -1 || t.indexOf("FLOAT") !== -1){
      return "BigDecimal";
    }

    return "String";
  }
  public static toFirstLowerCase (name: string): string {
    return name[0].toLocaleLowerCase() + name.slice(1, name.length)
  }
  public setFunctionCode (strList: string[], returnResponse: string, startLog: string, endLog: string) {
    strList.push(`${this.line}`)
    if (this.logInfo) {
      // params
      const paramsConsole: string[] = []
      this.filedList.forEach((value, index) => {
        let comma = ' '
        if (index === this.filedList.length -1) {
          comma = ''
        }
        paramsConsole.push(`${value.filedName}:[{}]${comma}`)
      })
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${startLog} ${paramsConsole.join()}", ${this.filedList.map(value => value.filedName).join(', ')});${this.line}`);
    }

    strList.push(`${this.spaceString}${this.spaceString}${returnResponse} result = new ${this.returnType}<>();${this.line}`);
    strList.push(`${this.spaceString}${this.spaceString}// TODO get data${this.line}`);
    if (this.logInfo) {
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${endLog} result", result);${this.line}`);
    }
    strList.push(`${this.spaceString}${this.spaceString}return result;`);
  }

}
