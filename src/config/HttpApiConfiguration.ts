/**
 *
 * 功能描述:
 *
 * @className RestTestHttpConfiguration
 * @projectName papio
 * @author yanshaowen
 * @date 2019/2/14 10:19
 */
import { IDataSource } from 'type-interface'
import { AxiosDataSource, Bean, Configuration, MapperScan } from 'papio-common'
@Configuration
@MapperScan('/src/dao/api')
export class HttpApiConfiguration {
  @Bean
  public HttpApiConfigurationMaster (): IDataSource {
    const httpDataSource = new AxiosDataSource()
    httpDataSource.setName('master')
    httpDataSource.setReadOnly(false)
    httpDataSource.setUrl('http://127.0.0.1:8080')
    httpDataSource.build()
    return httpDataSource
  }
}
