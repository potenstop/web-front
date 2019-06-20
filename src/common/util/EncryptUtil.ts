/**
 *
 * 功能描述:
 *
 * @className EncryptUtil
 * @projectName web-front
 * @author yanshaowen
 * @date 2019/6/20 10:23
 */
import * as CryptoJs from 'crypto-js';
import {EncryptResult} from "@/bmo/EncryptResult";
import {EncryptType} from "@/bmo/EncryptType";
export class EncryptUtil {
  public static decode (type: string, str: string, salt?: string): EncryptResult {
    const encryptResult = new EncryptResult();
    encryptResult.name = type
    if (!salt) salt = ''
    switch (type) {
      case 'md5':
        encryptResult.data = CryptoJs.MD5(str).toString()
        break
      case 'sha1':
        encryptResult.data = CryptoJs.SHA1(str).toString()
        break
      case 'sha256':
        encryptResult.data = CryptoJs.SHA256(str).toString()
        break
      case 'hmac-md5':
        encryptResult.data = CryptoJs.HmacMD5(str, salt).toString()
        break
      case 'hmac-sha1':
        encryptResult.data = CryptoJs.HmacSHA1(str, salt).toString()
        break
      case 'hmac-sha256':
        encryptResult.data = CryptoJs.HmacSHA256(str, salt).toString()
        break
      case 'aes':
        const key = CryptoJs.enc.Utf8.parse(salt);
        const iv = CryptoJs.enc.Utf8.parse(salt);

        encryptResult.data = CryptoJs.AES.encrypt(str, key, {
          iv: iv,
          mode: CryptoJs.mode.ECB,
          padding: CryptoJs.pad.Pkcs7
        }).toString()
        break;
      case 'rabbit':
        encryptResult.data = CryptoJs.Rabbit.decrypt(str, salt).toString()
        break
      case 'enc-base64':
        encryptResult.data = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Utf8.parse(str))
        break
      case 'url':
        encryptResult.data = encodeURIComponent(str)
        break
    }
    return encryptResult
  }
  public static encode0 (type: string, str: string, salt?: string): EncryptResult {
    const encryptResult = new EncryptResult();
    encryptResult.name = type
    if (!salt) salt = ''
    switch (type) {
      case 'aes':
        encryptResult.data = CryptoJs.AES.encrypt(str, salt).toString()
        break;
      case 'rabbit':
        encryptResult.data = CryptoJs.Rabbit.encrypt(str, salt).toString()
        break
      case 'enc-base64':
        encryptResult.data = CryptoJs.enc.Utf8.stringify(CryptoJs.enc.Base64.parse(str))
        break
      case 'url':
        encryptResult.data = decodeURIComponent(str)
        break
    }
    return encryptResult
  }
  public static encode (str: string) {
    CryptoJs.MD5(str)
  }
  public static getDecodeTypeList(): EncryptType[] {
    const encryptTypes: EncryptType[] = []
    encryptTypes.push(new EncryptType('md5', 'md5', false))
    encryptTypes.push(new EncryptType('sha1', 'sha1', false))
    encryptTypes.push(new EncryptType('sha256', 'sha256', false))

    encryptTypes.push(new EncryptType('hmac-md5', 'hmac-md5', true))
    encryptTypes.push(new EncryptType('hmac-sha1', 'hmac-sha1', true))
    encryptTypes.push(new EncryptType('hmac-sha256', 'hmac-sha256', true))
    encryptTypes.push(new EncryptType('aes', 'aes', true))
    encryptTypes.push(new EncryptType('rabbit', 'rabbit', true))
    encryptTypes.push(new EncryptType('enc-base64', 'base64', false))
    encryptTypes.push(new EncryptType('url', 'url', false))
    return encryptTypes;
  }
  public static getEncodeTypeList(): EncryptType[] {
    const encryptTypes: EncryptType[] = []
    encryptTypes.push(new EncryptType('aes', 'aes', true))
    encryptTypes.push(new EncryptType('rabbit', 'rabbit', true))
    encryptTypes.push(new EncryptType('enc-base64', 'base64', false))
    encryptTypes.push(new EncryptType('url', 'url', false))
    return encryptTypes;
  }
}
