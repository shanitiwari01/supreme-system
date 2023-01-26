import { ERROR_CODES, MOBILE_CONFIG, SYNC_STATUS, GLOBAL_API, STUDENT_ROUTES, RESOURCE_GROUPS } from "utility";
import StudentMBL from "./../StudentMBL";
import { StudentMDL } from "mobiledatalayer";
import { StudentDTO, BaseDTO, StudentModel } from "datamodels";
import EncryptedStorage from 'react-native-encrypted-storage';
import Axios from "axios";

jest.mock("react-native", () => ({
    show: () => null,
}));

jest.mock("@react-native-community/netinfo", () => ({
    fetch: () => true,
}));

jest.mock("@react-native-community/async-storage");

describe("Student test cases", () => {
    var studentId = "ff55e2aa-e233-4c9e-8746-798b88d9486c";
    beforeAll(async () => {
        await EncryptedStorage.setItem(MOBILE_CONFIG.LANGUAGE_ID, "1");
        await EncryptedStorage.setItem(MOBILE_CONFIG.ACCESS_TOKEN, "5ipy1htwbaerc26dsouxxmxp1lilabyfhu4rnbs6f3sxt7r2nuh31drzvt3y1xs6");
    });
    it("Get students from server", async () => {
        let studentMDL = new StudentMDL();
        let syncedDetail: BaseDTO = await studentMDL.GetLastSyncedDateTimeAsync(STUDENT_ROUTES.GET_STUDENTS);
        expect(syncedDetail.StatusCode).toEqual(ERROR_CODES.OK);
        if (syncedDetail.StatusCode == ERROR_CODES.OK) {
            let lastsyncedat = syncedDetail.LastSyncedAt ? syncedDetail.LastSyncedAt : "null";
            let token = await new StudentMBL().GetStringValueFromStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN);
            token = token ? token : "";
            await Axios.request({
                method: "GET",
                url: `${GLOBAL_API}${STUDENT_ROUTES.GET_STUDENTS}`,
                headers: {lastsyncedat: lastsyncedat, token: token},
                data: {},
            }).then(async (res: any) => {
                if(res.data && res.data.Students && res.data.Students.length > 0) {
                    let studentDTO = new StudentDTO();
                    studentDTO.Students = res.data.Students;
                    studentDTO.UpdateSyncedDate = true;
                    studentDTO = await studentMDL.SaveStudentsAsync(studentDTO);
                    expect(studentDTO.StatusCode).toEqual(ERROR_CODES.OK);
                    expect(studentDTO.Students.length).toBeGreaterThan(0);
                } else {
                    expect(res.status).toEqual(ERROR_CODES.OK);
                }
            }).catch((err: any) => {
                console.log("GET_STUDENTS ERROR", err);
            });
        }
    });

    it("Add Edit student", async () => {
        let studentDTO = new StudentDTO();
        let studentData = new StudentModel();
        studentData.FirstName = "Hiren";
        studentData.MiddleName = "Nirjan";
        studentData.LastName = "Parikh";
        studentData.MothersName = "Gita";
        studentData.Age = 46;
        studentData.PhoneNumber = 8384968734;
        studentData.Gender = "Male";
        studentData.AddressLine1 = "Vile parle Test";
        studentData.AddressLine2 = "New York test";
        studentData.Weight = 106;
        studentData.State = "Maharashtra";
        studentData.City = "Mumbai";
        studentData.Pincode = 400101;
        studentData.Dob = "2001-12-01";
        studentData.LastLoggedinDatetime = new Date().toDateString();
        studentData.StudentID = studentId;
        studentData.IsActive = true;
        studentData.IsSync = false;
        studentDTO.Students.push(studentData);
        let submitResult: any = await new StudentMBL().SaveStudentsAsync(studentDTO);
        expect(submitResult.StatusCode).toEqual(ERROR_CODES.OK);
    });

    it("Fetch single student", async () => {
        let studentDTO = new StudentDTO();
        studentDTO.ID = "ff55e2aa-e233-4c9e-8746-798b88d9486c"
        let student: any = await new StudentMBL().GetStudentAsync(studentDTO);
        expect(student.StatusCode).toEqual(ERROR_CODES.OK);
        expect(student.Student.FirstName).toEqual("Hiren");
        expect(student.Student.LastName).toEqual("Parikh");
        expect(student.Student.MothersName).toEqual("Gita");
        expect(student.Student.Age).toEqual(46);
        expect(student.Student.Weight).toEqual(106);
    });

    it("Delete student", async () => {
        let studentDTO = new StudentDTO();
        let studentData = new StudentModel();
        studentData.StudentID = studentId;
        studentData.IsActive = false;
        studentData.IsSync = false;
        studentDTO.Students.push(studentData);
        let submitResult: any = await new StudentMBL().SaveStudentsAsync(studentDTO);
        expect(submitResult.StatusCode).toEqual(ERROR_CODES.OK);
    });

    it("Fetch deleted student", async () => {
        let studentDTO = new StudentDTO();
        studentDTO.ID = "ff55e2aa-e233-4c9e-8746-798b88d9486c"
        let student: any = await new StudentMBL().GetStudentAsync(studentDTO);
        expect(student.Student.IsActive).toEqual(false);
    });

    it("Fetch all students", async () => {
        let studentDTO = new StudentDTO();
        studentDTO.GroupIDs = `${RESOURCE_GROUPS.STUDENTS}`;
        studentDTO = await new StudentMBL().GetStudentsAsync(studentDTO);
        expect(studentDTO.StatusCode).toEqual(ERROR_CODES.OK);
        expect(studentDTO.Students.length).toBeGreaterThan(0);
    });

    it("Fetch recent students", async () => {
        let studentDTO = new StudentDTO();
        studentDTO.GroupIDs = `${RESOURCE_GROUPS.STUDENTS}`;
        studentDTO.NoOfRecords = 1;
        studentDTO = await new StudentMBL().GetStudentsAsync(studentDTO);
        expect(studentDTO.StatusCode).toEqual(ERROR_CODES.OK);
        expect(studentDTO.Students.length).toEqual(1);
    });

    it("Sync unsynced student", async () => {
        let studentDTO = new StudentDTO();
        let studentMDL = new StudentMDL();
        studentDTO = await studentMDL.GetUnsyncedStudentsAsync(studentDTO);
        expect(studentDTO.StatusCode).toEqual(ERROR_CODES.OK);
        if(studentDTO.StatusCode == ERROR_CODES.OK && studentDTO.Students.length > 0){
            let token = await new StudentMBL().GetStringValueFromStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN);
            token = token ? token : "";
            await Axios.request({
                method: "POST",
                url: `${GLOBAL_API}${STUDENT_ROUTES.SAVE_STUDENTS}`,
                headers: {token: token},
                data: { students: studentDTO.Students },
            }).then(async (res: any) => {
                if(res.data) {
                    expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
                    if(res.data.StatusCode == ERROR_CODES.OK){
                        studentDTO.Errors = res.data.Errors;
                        studentDTO = await studentMDL.UpdateStudentsAsync(studentDTO);
                        expect(studentDTO.StatusCode).toEqual(ERROR_CODES.OK);
                    }
                } else {
                    expect(res.status).toEqual(ERROR_CODES.OK);
                }
            }).catch((err: any) => {
                console.log("SYNC_STUDENTS ERROR", err);
            });
        }
    });
});