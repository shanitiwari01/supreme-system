import { ERROR_CODES, BOOLEAN_STATUS, GenerateUUID, SINGLE_RECORD } from "utility";
import { RunQuery } from "./Config/Sql";
import { StudentDTO, StudentModel, ErrorModel } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class StudentSDL extends CommonSDL {

    /**
     * get all students data
     * @param studentDTO student DTO
     * @returns studentDTO
     */
    public GetStudentsAsync = async (studentDTO: StudentDTO) => {
        let whereCondition = `WHERE AddedBy = '${studentDTO.LoggedInUserID}'`;
        if (studentDTO.LastSyncedAt) {
            whereCondition += ` AND ModifiedOn > '${studentDTO.LastSyncedAt}'`;
        }
        studentDTO = await this.StudentDataAsync(studentDTO,
            `SELECT StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, Weight, State, City, Pincode, IsActive, AddedOn, ModifiedOn
            FROM Students`,
            whereCondition
        );
        return studentDTO;
    }

    /**
     * get single student record
     * @param studentDTO student DTO
     * @returns student details
     */
    public GetStudentAsync = async (studentDTO: StudentDTO) => {
        if (studentDTO.ID != "") {
            studentDTO = await this.StudentDataAsync(studentDTO,
                `SELECT StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, Weight, State, City, Pincode
                FROM Students
                WHERE StudentID = '${studentDTO.ID}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
        }
        return studentDTO;
    }

    /**
     * insert or update students
     * @param studentDTO student DTO
     * @returns status of the operation
     */
    public SaveStudentsAsync = async (studentDTO: StudentDTO) => {
        if (studentDTO.Students && studentDTO.LoggedInUserID) {
            let saveResult: any;
            studentDTO.Errors = [];
            for (let student of studentDTO.Students) {
                let errorObject = new ErrorModel();
                errorObject.ID = student.StudentID ? student.StudentID : "";
                //Discuss: Delete student while sync students
                saveResult = await RunQuery(this.InsertUpdateQuery(student, studentDTO.LoggedInUserID));
                if (saveResult.StatusCode == ERROR_CODES.OK) {
                    errorObject.Status = true;
                } else {
                    errorObject.Status = false;
                    errorObject.Message = saveResult.StatusMessage;
                }
                studentDTO.Errors.push(errorObject);
            }
            studentDTO.StatusCode = ERROR_CODES.OK;
        } else {
            studentDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return studentDTO;
    }

    /**
    * common function to hold stundent data
    * @param record student record
    * @returns studentModel 
    */
    private StudentDataAsync = async (studentDTO: StudentDTO, query: string, whereCondition: string = "") => {
        let fetchResult = await RunQuery(`${query} ${whereCondition}`);
        studentDTO.StatusCode = fetchResult.StatusCode;
        studentDTO.StatusMessage = fetchResult.StatusMessage;
        if (fetchResult.StatusCode == ERROR_CODES.OK && fetchResult.Data && fetchResult.Data.length > 0) {
            if (fetchResult.Data.length == SINGLE_RECORD) {
                studentDTO.Student = this.CreateStudentRecord(fetchResult.Data[0]);
            } else {
                for (let record of fetchResult.Data) {
                    studentDTO.Students.push(this.CreateStudentRecord(record));
                }
            }
        }
        return studentDTO;
    }

    /**
    * common function to hold stundent data
    * @param record student record
    * @returns studentModel 
    */
    private CreateStudentRecord = (record: any) => {
        let studentModel = new StudentModel();
        studentModel.StudentID = record.StudentID;
        studentModel.FirstName = record.FirstName;
        studentModel.MiddleName = record.MiddleName;
        studentModel.LastName = record.LastName;
        studentModel.Dob = record.Dob;
        studentModel.Gender = record.Gender;
        studentModel.MothersName = record.MothersName ? record.MothersName : "";
        studentModel.Age = record.Age ? record.Age : 0;
        studentModel.PhoneNumber = record.PhoneNumber ? record.PhoneNumber : 0;
        studentModel.AddressLine1 = record.AddressLine1 ? record.AddressLine1 : "";
        studentModel.AddressLine2 = record.AddressLine2 ? record.AddressLine2 : "";
        studentModel.Weight = record.Weight ? record.Weight : 0;
        studentModel.State = record.State ? record.State : "";
        studentModel.City = record.City ? record.City : "";
        studentModel.AddedOn = record.AddedOn ? record.AddedOn : "";
        studentModel.ModifiedOn = record.ModifiedOn ? record.ModifiedOn : "";
        studentModel.LastLoggedinDatetime = record.LastLoggedIn ? record.LastLoggedIn : "";
        studentModel.Pincode = record.Pincode ? record.Pincode : "";
        studentModel.IsActive = record.IsActive ? !!record.IsActive : false;
        studentModel.IsSync = record.IsSync ? record.IsSync : false;
        return studentModel;
    }

    /**
    * common function execute insert or replace query
    * @param student
    * @param userID
    * @returns query 
    */
    private InsertUpdateQuery = (student: StudentModel, userID: string) => {
        let insertAppendCondition = student.StudentID ? `'${student.StudentID}', ` : `'${GenerateUUID()}', `;
        insertAppendCondition += student.Weight ? `'${student.Weight}', ` : `NULL, `;
        insertAppendCondition += student.AddedOn ? `'${student.AddedOn}', ` : `UTC_TIMESTAMP(), `;
        insertAppendCondition += student.ModifiedOn ? `'${student.ModifiedOn}', ` : `UTC_TIMESTAMP(), `;
        insertAppendCondition += student.LastLoggedinDatetime ? `'${student.LastLoggedinDatetime}', ` : `NULL, `;
        let udpdateAppendCondition = `ModifiedOn = ` + (student.ModifiedOn ? `'${student.ModifiedOn}', ` : `UTC_TIMESTAMP(), `);
        udpdateAppendCondition += `LastLoggedIn = ` + (student.LastLoggedinDatetime ? `'${student.LastLoggedinDatetime}',` : `NULL, `);
        return `
            INSERT INTO Students 
            (StudentID, Weight, AddedOn, ModifiedOn, LastLoggedIn, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, State, City, Pincode, IsActive, AddedBy, ModifiedBy)
            VALUES (${insertAppendCondition} '${student.FirstName}', '${student.MiddleName}', '${student.LastName}', '${student.MothersName}', ${student.Age}, ${student.PhoneNumber}, '${student.Dob}', '${student.Gender}', '${student.AddressLine1}', '${student.AddressLine2}', '${student.State}', '${student.City}', ${student.Pincode ? student.Pincode : null}, ${student.IsActive ? student.IsActive : BOOLEAN_STATUS.STATUS_FALSE}, '${userID}', '${userID}')
            ON DUPLICATE KEY UPDATE 
            ${udpdateAppendCondition} FirstName = '${student.FirstName}', MiddleName = '${student.MiddleName}', LastName = '${student.LastName}', MothersName = '${student.MothersName}', Age = ${student.Age}, PhoneNumber = ${student.PhoneNumber}, Dob = '${student.Dob}', Gender = '${student.Gender}', AddressLine1 = '${student.AddressLine1}', AddressLine2 = '${student.AddressLine2}', Weight = ${student.Weight}, State = '${student.State}', City = '${student.City}', Pincode = ${student.Pincode ? student.Pincode : null}, IsActive = ${student.IsActive ? student.IsActive : BOOLEAN_STATUS.STATUS_FALSE}, ModifiedBy = '${userID}'`;
    }

    /**
     * Delete student using studentID
     * @param studentID
     * @param userID
     * @returns status of the operation
     */
    private DeleteStudentAsync = async (studentID: string, userID: string) => {
        let deleteResult: any = await RunQuery(
            `UPDATE Students 
            SET IsActive = ${BOOLEAN_STATUS.STATUS_FALSE}, ModifiedOn = UTC_TIMESTAMP(), ModifiedBy = ${userID}
            WHERE StudentID = '${studentID}'`
        );
        return deleteResult;
    }
}