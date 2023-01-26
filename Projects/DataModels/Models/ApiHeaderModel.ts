export class ApiHeaderModel {
    accesstoken?: string | null = "";
    refreshtoken?: string | null = "";
    lastsyncedat?: string | null = "";
    deviceid: string = "";
    devicetype: string = "";
    deviceos: string = ""; 
    deviceosversion: string = ""; 
    devicemodel: string = "";
    devicedetail: string = "";
    isremembered: boolean = true; 
    pincode: string = ""
}