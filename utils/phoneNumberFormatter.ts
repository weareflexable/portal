
export function convertToAmericanFormat(phoneNumber:string):string{
 const formatedNumber = `+1 (${phoneNumber.substring(2,5)}) ${phoneNumber.substring(5,8)}-${phoneNumber.substring(8)}`;
return formatedNumber
}
