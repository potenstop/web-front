/**
 *
 * 功能描述:
 *
 * @className LangCodeDefault
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/29 11:50
 */
import { LangCode } from '@/bmo/LangCode'
// java
const java = new LangCode();
java.setLang("java")
java.setLabel("java")
java.setDefaultCode(`public class WebApiApplication {
    public static void main(String[] args) {
        System.out.println("111");
    }
}`)
// js
const javaScript = new LangCode();
javaScript.setLang("javascript")
javaScript.setLabel("js")
javaScript.setDefaultCode("console.log('111')")
// Python
const python = new LangCode();
python.setLang("python")
python.setLabel("python")
python.setDefaultCode("print('111')")
// ruby
const ruby = new LangCode();
ruby.setLang("ruby")
ruby.setLabel("ruby")
ruby.setDefaultCode("puts '111'")
// all
const all = new Map<string, LangCode>()
all.set(java.getLang(), java)
all.set(javaScript.getLang(), javaScript)
all.set(python.getLang(), python)
all.set(ruby.getLang(), ruby)
export class LangCodeDefault {
  public static getAllList (): LangCode[] {
    const list: LangCode[] = []
    all.forEach(v => {
      list.push(v)
    })
    return list
  }
  public static getLang (lang: string): LangCode {
    return all.get(lang)
  }
}
