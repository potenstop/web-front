/**
 *
 * 功能描述:
 *
 * @className SqlAnalysis
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/30 12:27
 */
import { ConvertUtil, JSHelperUtil } from 'papio-h5'
import * as SqlParser from 'sql-ddl-to-json-schema'
const sqlParser = new SqlParser('mysql')
class Filed {
  public filedName: string
  public filedType: string
  public comment: string
  public defaultValue: string
  public autoincrement: boolean
  public required: boolean
  public len: number
  public point: number
}
interface Options {
  prefixName?: string
  useLombok?: boolean
  logInfo?: string
  returnType?: string
  requestVerifyAnnotation?: boolean
  requestHump?: boolean
  responseHump?: boolean
  jsonParse?: 'fastjson' | 'jackson'
}
export class SqlAnalysis {
  private space: number = 4
  private spaceString: string = ''
  private line: string = '\n'
  private ddl: string
  private filedList: Filed[] = []
  private tableName: string
  private tableComment: string
  private useLombok: boolean = false
  private logInfo: string
  private returnType: string
  private primaryFiled: Filed
  private errorMessage: string
  private classFiles: Map<string, string> = new Map()
  private requestVerifyAnnotation: boolean = true
  private requestHump: boolean = true
  private responseHump: boolean = true
  private jsonParse: 'fastjson' | 'jackson' = 'jackson'
  constructor (ddl: string, option?: Options) {
    this.ddl = ddl
    if (option) {
      this.tableName = option.prefixName
      if (JSHelperUtil.isNotNull(option.useLombok)) {
        this.useLombok = option.useLombok
      }
      this.logInfo = option.logInfo
      this.returnType = option.returnType
      if (JSHelperUtil.isNotNull(option.requestVerifyAnnotation)) {
        this.requestVerifyAnnotation = option.requestVerifyAnnotation
      }
      if (JSHelperUtil.isNotNull(option.requestHump)) {
        this.requestHump = option.requestHump
      }
      if (JSHelperUtil.isNotNull(option.responseHump)) {
        this.responseHump = option.responseHump
      }
      if (JSHelperUtil.isNotNull(option.jsonParse)) {
        this.jsonParse = option.jsonParse
      }
    }
    this.setSpace(this.space)
    this.init()
  }
  private init () {
    let compactJsonTablesArray
    try {
      compactJsonTablesArray = sqlParser.toCompactJson(sqlParser.feed(this.ddl).results)
    } catch (e) {
      this.errorMessage = e.message
      return
    }
    if (compactJsonTablesArray.length === 0) {
      this.errorMessage = '输入标准的ddl'
      return
    }
    this.errorMessage = null
    const table = compactJsonTablesArray[0]
    if (!this.tableName) {
      this.tableName = table.name
    }
    this.tableComment = table.comment
    let primaryFiledName
    if (table.primaryKey.columns && table.primaryKey.columns.length > 0) {
      primaryFiledName = ConvertUtil.toHump(table.primaryKey.columns[0].column)
    }
    if (table.columns) {
      table.columns.forEach(column => {
        console.log(column.type)
        let filed = new Filed()
        filed.filedName = ConvertUtil.toHump(column.name)
        filed.filedType = SqlAnalysis.dbType(column.type.datatype)
        filed.comment = column.options.comment
        filed.defaultValue = column.options.default
        filed.autoincrement = column.options.autoincrement
        filed.required = !column.options.nullable
        if ('width' in column.type) {
          filed.len = column.type.width
        }
        if ('length' in column.type) {
          filed.len = column.type.length
        }
        if ('digits' in column.type) {
          filed.len = column.type.digits
          filed.point = column.type.decimals
        }
        this.filedList.push(filed)
      })
    }
    if (primaryFiledName) {
      this.filedList.forEach(value => {
        if (value.filedName === primaryFiledName) {
          this.primaryFiled = value
        }
      })
    }
    this.genController()
  }
  private setSpace (space: number) {
    this.space = space
    let tab = ''
    for (let len = space; len > 0; len--) {
      tab += ' '
    }
    this.spaceString = tab
  }
  public getClassFiles (): Map<string, string> {
    return this.classFiles
  }
  public getCodeByClassFiles (fileName: string): string {
    return this.classFiles.get(fileName)
  }
  public getAllFileNames (): string[] {
    const fileNames: string[] = []
    this.getClassFiles().forEach((value, key) => {
      fileNames.push(key)
    })
    return fileNames
  }
  public getErrorMessage () {
    return this.errorMessage
  }
  private genController (): void {
    const funcPrefixName = SqlAnalysis.toFirstLowerCase(ConvertUtil.toHump(this.tableName))
    const className = ConvertUtil.toFirstUpperCase(ConvertUtil.toHump(this.tableName))
    const urlName = this.tableName.replace(/(_)/g, "-");
    let strList: string[] = []
    let returnResponse =  `List<${className}Response>`;
    if (JSHelperUtil.isNotNull(this.returnType)) {
      returnResponse = `${this.returnType}<List<${className}Response>>`
    }
    this.addResponse(`${className}Response`, this.filedList)
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
    strList.push(`@RequestMapping("/${urlName}")${this.line}`)
    strList.push(`@Api(description = "${this.tableComment ? this.tableComment : ''}")${this.line}`)
    if (this.useLombok){
      strList.push(`@RequiredArgsConstructor(onConstructor = @__(@Autowired))${this.line}`)
    }
    strList.push(`public class ${className}Controller {${this.line}`)
    if (!this.useLombok) {
      strList.push(`${this.spaceString}@Autowired${this.line}`)
    }
    strList.push(`${this.spaceString}private final ${this.tableName}Service ${funcPrefixName}Service;${this.line}`)
    // list方法
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@GetMapping("/list")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@ApiOperation(value = "按条件查询多条")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}List(`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(name = "pageNumber", value ="页码", example = "1") @RequestParam(required = true) Integer pageNumber,${this.line}`)
    strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(name = "pageSize", value ="每页条数", example = "20") @RequestParam(required = true) Integer pageSize,${this.line}`)
    this.filedList.forEach((value, index) => {
      let comma = ','
      if (index === this.filedList.length - 1) {
        comma = ''
      }
      strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(name = "${value.filedName}", value = "${value.comment ? value.comment : ''}" ,example = "${value.defaultValue ? value.defaultValue : ''}") @RequestParam(required = false) ${value.filedType} ${value.filedName}${comma}${this.line}`)
    })
    strList.push(`${this.spaceString}) {`)
    this.setFunctionCodeByQuery(strList, returnResponse, 'controller-start-request', 'controller-end-response', this.filedList)
    strList.push(`${this.line}`)

    strList.push(`${this.spaceString}}`)
    // 单个对象
    if (JSHelperUtil.isNotNull(this.returnType)) {
      returnResponse = `${this.returnType}<${this.tableName}Response>`
    }
    // add方法
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@GetMapping("/add")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}@ApiOperation(value = "插入记录")`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}Add(`)
    strList.push(`${this.line}`)
    strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}UpdateById(@RequestBody @Valid ${funcPrefixName}AddRequest request) {`)
    this.setFunctionCodeByBody(strList, returnResponse, 'controller-start-request', 'controller-end-response')
    strList.push(`${this.line}${this.spaceString}}`)
    this.addRequest(`${funcPrefixName}AddRequest`, this.filedList)
    // by-id方法  有主键才生成
    if (this.primaryFiled) {
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@GetMapping("/by-id")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@ApiOperation(value = "按id查询一条记录")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}GetById(`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(name = "${this.primaryFiled.filedName}", value = "${this.primaryFiled.comment ? this.primaryFiled.comment : 'id'}", example = "${this.primaryFiled.defaultValue ? this.primaryFiled.defaultValue : 1}") @RequestParam(required = true) ${this.primaryFiled.filedType} ${this.primaryFiled.filedName}${this.line}`)
      strList.push(`${this.spaceString}) {`)
      this.setFunctionCodeByQuery(strList, returnResponse, 'controller-start-request', 'controller-end-response', [this.primaryFiled])
      strList.push(`${this.line}${this.spaceString}}`)
      // update方法
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@PutMapping("/by-id")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@ApiOperation(value = "按id更新一条记录")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}UpdateById(@RequestBody @Valid ${funcPrefixName}UpdateByIdRequest request) {`)
      this.setFunctionCodeByBody(strList, returnResponse, 'controller-start-request', 'controller-end-response')
      strList.push(`${this.line}${this.spaceString}}`)
      this.addRequest(`${funcPrefixName}UpdateByIdRequest`, this.filedList)
      // delete方法
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@DeleteMapping("/by-id")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}@ApiOperation(value = "按id删除一条记录")`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}public ${returnResponse} ${funcPrefixName}DeleteById(`)
      strList.push(`${this.line}`)
      strList.push(`${this.spaceString}${this.spaceString}${this.spaceString}@ApiParam(name = "${this.primaryFiled.filedName}", value = "id", example = "${this.primaryFiled.defaultValue ? this.primaryFiled.defaultValue : 1}") @RequestParam(required = true) ${this.primaryFiled.filedType} ${this.primaryFiled.filedName}${this.line}`)
      strList.push(`${this.spaceString}) {`)
      this.setFunctionCodeByQuery(strList, returnResponse, 'controller-start-request', 'controller-end-response', [this.primaryFiled])
      strList.push(`${this.line}${this.spaceString}}`)
    }
    this.classFiles.set(`${ConvertUtil.toFirstUpperCase(funcPrefixName)}Controller`, strList.join(''))
  }
  public addRequest (className: string, fileds: Filed[]): void {
    const strList: string[] = []
    if (!this.requestHump) {
      if (this.jsonParse === 'jackson') {
        strList.push(`import com.fasterxml.jackson.annotation.JsonProperty;${this.line}`)
      } else if (this.jsonParse === 'fastjson') {
        strList.push(`import com.alibaba.fastjson.annotation.JSONField;${this.line}`)
      }
    }
    strList.push(`import io.swagger.annotations.ApiModel;${this.line}`)
    strList.push(`import io.swagger.annotations.ApiModelProperty;${this.line}`)
    strList.push(`import org.hibernate.validator.constraints.NotBlank;${this.line}`)
    strList.push(`import org.hibernate.validator.constraints.NotEmpty;${this.line}`)
    strList.push(`import javax.validation.Valid;${this.line}`)
    strList.push(`import javax.validation.constraints.Max;${this.line}`)
    strList.push(`import javax.validation.constraints.NotNull;${this.line}`)
    if (this.useLombok) {
      strList.push(`import lombok.Data;${this.line}`)
    }
    strList.push(`import java.util.Date;${this.line}`)
    strList.push(`${this.line}`)
    strList.push(`@ApiModel(value = "${className}", description = "")${this.line}`)
    strList.push(`public class ${className} {${this.line}`)
    strList.push(`${this.line}`)
    fileds.forEach(filed => {
      strList.push(`${this.spaceString}@ApiModelProperty(value = "${filed.comment ? filed.comment : ''}", name = "${filed.filedName}", required = ${filed.required}, example = "${filed.defaultValue}")${this.line}`)
      if (this.requestVerifyAnnotation) {
        if (filed.required) {
          strList.push(`${this.spaceString}@NotNull${this.line}`)
        }
        if (JSHelperUtil.isNotNull(filed.len) && filed.filedType === 'String') {
          strList.push(`${this.spaceString}@Max(value = ${filed.len})${this.line}`)
        }
      }
      if (!this.requestHump) {
        if (this.jsonParse === 'jackson') {
          strList.push(`${this.spaceString}@JsonProperty(value = "${ConvertUtil.toLine(filed.filedName)}")${this.line}`)
        } else if (this.jsonParse === 'fastjson') {
          strList.push(`${this.spaceString}@JSONField(name = "${ConvertUtil.toLine(filed.filedName)}")${this.line}`)
        }
      }
      strList.push(`${this.spaceString}private ${filed.filedType} ${filed.filedName};${this.line}`)
      strList.push(`${this.line}`)
    })
    if (!this.useLombok) {
      // 生成get set
      fileds.forEach(value => {
        // get方法
        strList.push(`${this.spaceString}public ${value.filedType} get${ConvertUtil.toFirstUpperCase(value.filedName)}() {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`return this.${value.filedName};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
        // set方法
        strList.push(`${this.spaceString}public void set${ConvertUtil.toFirstUpperCase(value.filedName)}(${value.filedType} ${value.filedName}) {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`this.${value.filedName} = ${value.filedName};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
      })
    }
    if (strList[strList.length - 1] === this.line && strList[strList.length - 2] === this.line) {
      strList[strList.length - 1]= '}'
    }
    this.classFiles.set(className + '.java', strList.join(''))
  }
  public addResponse (className: string, fileds: Filed[]): void {
    const strList: string[] = []
    if (!this.responseHump) {
      if (this.jsonParse === 'jackson') {
        strList.push(`import com.fasterxml.jackson.annotation.JsonProperty;${this.line}`)
      } else if (this.jsonParse === 'fastjson') {
        strList.push(`import com.alibaba.fastjson.annotation.JSONField;${this.line}`)
      }
    }
    strList.push(`import io.swagger.annotations.ApiModel;${this.line}`)
    strList.push(`import io.swagger.annotations.ApiModelProperty;${this.line}`)
    if (this.useLombok) {
      strList.push(`import lombok.Data;${this.line}`)
    }
    strList.push(`import java.util.Date;${this.line}`)
    strList.push(`${this.line}`)
    strList.push(`@ApiModel(value = "${className}", description = "")${this.line}`)
    if (this.useLombok) {
      strList.push(`@Data${this.line}`)
    }
    strList.push(`public class ${className} {${this.line}`)
    strList.push(`${this.line}`)
    fileds.forEach(filed => {
      strList.push(`${this.spaceString}@ApiModelProperty(value = "${filed.comment ? filed.comment : ''}", name = "${filed.filedName}", required = ${filed.required}, example = "${filed.defaultValue ? filed.defaultValue : ''}")${this.line}`)
      if (!this.responseHump) {
        if (this.jsonParse === 'jackson') {
          strList.push(`${this.spaceString}@JsonProperty(value = "${ConvertUtil.toLine(filed.filedName)}")${this.line}`)
        } else if (this.jsonParse === 'fastjson') {
          strList.push(`${this.spaceString}@JSONField(name = "${ConvertUtil.toLine(filed.filedName)}")${this.line}`)
        }
      }
      strList.push(`${this.spaceString}private ${filed.filedType} ${filed.filedName};${this.line}`)
      strList.push(`${this.line}`)
    })
    if (!this.useLombok) {
      // 生成get set
      fileds.forEach(value => {
        // get方法
        strList.push(`${this.spaceString}public ${value.filedType} get${ConvertUtil.toFirstUpperCase(value.filedName)}() {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`return this.${value.filedName};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
        // set方法
        strList.push(`${this.spaceString}public void set${ConvertUtil.toFirstUpperCase(value.filedName)}(${value.filedType} ${value.filedName}) {`)
        strList.push(this.line)
        strList.push(`${this.spaceString}`)
        strList.push(`${this.spaceString}`)
        strList.push(`this.${value.filedName} = ${value.filedName};`)
        strList.push(this.line)
        strList.push(`${this.spaceString}}`)
        strList.push(this.line)
        strList.push(this.line)
      })
    }
    if (strList[strList.length - 1] === this.line && strList[strList.length - 2] === this.line) {
      strList[strList.length - 1]= '}'
    }
    this.classFiles.set(className, strList.join(''))
  }
  public static dbType (t: string): string {
    if (!t) {
      return 'String'
    }
    t = t.toUpperCase().trim()
    if (t.indexOf('DATE') !== -1 || t.indexOf('TIME') !== -1) {
      return 'Date'
    }
    if (t.indexOf('CHAR') !== -1 || t.indexOf('TEXT') !== -1 || t.indexOf('LOB') !== -1) {
      return 'String'
    }
    if (t.indexOf('INT') !== -1) {
      return 'Integer'
    }
    if (t.toUpperCase().indexOf('DECIMAL') !== -1 || t.indexOf('NUM') !== -1 || t.indexOf('DOUBLE') !== -1 || t.indexOf('FLOAT') !== -1) {
      return 'BigDecimal'
    }
    return 'String'
  }
  public static toFirstLowerCase (name: string): string {
    return name[0].toLocaleLowerCase() + name.slice(1, name.length)
  }

  /**
   * 方法功能描述: 生成code代码函数体
   * @author yanshaowen
   * @date 2019/7/1 15:46
   * @param
   * @return
   */
  public setFunctionCodeByQuery (strList: string[], returnResponse: string, startLog: string, endLog: string, fields: Filed[]) {
    strList.push(`${this.line}`)
    if (this.logInfo) {
      // params
      const paramsConsole: string[] = []
      fields.forEach((value, index) => {
        let comma = ' '
        if (index === fields.length - 1) {
          comma = ''
        }
        paramsConsole.push(`${value.filedName}:[{}]${comma}`)
      })
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${startLog} ${paramsConsole.join()}", ${fields.map(value => value.filedName).join(', ')});${this.line}`)
    }
    strList.push(`${this.spaceString}${this.spaceString}${returnResponse} result = new ${this.returnType}<>();${this.line}`)
    strList.push(`${this.spaceString}${this.spaceString}// TODO get data${this.line}`)
    if (this.logInfo) {
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${endLog} result:[{}]", result);${this.line}`)
    }
    strList.push(`${this.spaceString}${this.spaceString}return result;`)
  }
  public setFunctionCodeByBody (strList: string[], returnResponse: string, startLog: string, endLog: string) {
    strList.push(`${this.line}`)
    if (this.logInfo) {
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${startLog} request:[{}]", request);${this.line}`)
    }
    strList.push(`${this.spaceString}${this.spaceString}${returnResponse} result = new ${this.returnType}<>();${this.line}`)
    strList.push(`${this.spaceString}${this.spaceString}// TODO get data${this.line}`)
    if (this.logInfo) {
      strList.push(`${this.spaceString}${this.spaceString}${this.logInfo}("${endLog} result:[{}]", result);${this.line}`)
    }
    strList.push(`${this.spaceString}${this.spaceString}return result;`)
  }
}
