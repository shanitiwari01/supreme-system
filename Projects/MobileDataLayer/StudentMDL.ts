import { ERROR_CODES, BOOLEAN_STATUS, SYNC_STATUS, STUDENT_ROUTES } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { ErrorModel, StudentDTO, StudentModel } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class StudentMDL extends CommonMDL {

    /**
     * get unsynced students
     * @param studentDTO StudentDTO
     * @returns student list 
     */
    public GetUnsyncedStudentsAsync = async (studentDTO: StudentDTO) => {
        studentDTO = await this.CreateStudentListAsync(studentDTO,
            `SELECT StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, Weight, State, City, Pincode, LastLoggedIn, IsActive, AddedOn, ModifiedOn
            FROM Students
            WHERE IsSync = ${SYNC_STATUS.NOT_SYNCED}`
        );
        return studentDTO;
    }

    /**
    * update student synced status
    * @param studentDTO StudentDTO
    * @returns status of the operation
    */
    public UpdateStudentsAsync = async (studentDTO: StudentDTO) => {
        if (studentDTO.Errors && studentDTO.Errors.length > 0) {
            let updateResult: any;
            for (let student of studentDTO.Students) {
                updateResult = await this.UpdateStudentRecordAsync(student, studentDTO.Errors);
                studentDTO.StatusCode = updateResult.StatusCode;
                studentDTO.StatusMessage = updateResult.StatusMessage;
                if (updateResult.StatusCode != ERROR_CODES.OK) {
                    break;
                }
            }
        } else {
            studentDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
        }
        return studentDTO;
    }

    /**
     * add/update all students
     * @param studentDTO StudentDTO
     * @returns operation status
     */
    public SaveStudentsAsync = async (studentDTO: StudentDTO) => {
        let saveResult: any;
        for (let student of studentDTO.Students) {
            if (student.StudentID && +student.IsActive == BOOLEAN_STATUS.STATUS_FALSE) {
                saveResult = await this.DeleteStudentAsync(student.StudentID);
            } else {
                saveResult = await ExecuteQuery(this.InsertUpdateQuery(student));
            }
            studentDTO.StatusCode = saveResult.StatusCode;
            studentDTO.StatusMessage = saveResult.StatusMessage;
            if (studentDTO.StatusCode != ERROR_CODES.OK) {
                break;
            }
        }
        if (studentDTO.StatusCode == ERROR_CODES.OK && studentDTO.UpdateSyncedDate) {
            studentDTO.ServiceName = STUDENT_ROUTES.GET_STUDENTS;
            studentDTO = await this.UpdateLastSyncedDateTimeAsync(studentDTO);
        }
        return studentDTO;
    }

    /**
     * get all students list
     * @param studentDTO student DTO
     * @returns student list
     */
    public GetStudentsAsync = async (studentDTO: StudentDTO) => {
        let limitCondition = studentDTO.NoOfRecords && studentDTO.NoOfRecords > 0 ? `LIMIT ${studentDTO.NoOfRecords}` : ``;
        studentDTO = await this.CreateStudentListAsync(studentDTO,
            `SELECT StudentID, FirstName, MiddleName, LastName, Dob, Gender
            FROM Students
            WHERE IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}
            ORDER BY ModifiedOn DESC
            ${limitCondition}`
        );
        return studentDTO;
    }

    /**
     * get single student data
     * @param studentDTO student DTO
     * @returns student details
     */
    public GetStudentAsync = async (studentDTO: StudentDTO) => {
        let fetchResult: any = await ExecuteQuery(
            `SELECT StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, Weight, State, City, Pincode 
            FROM Students
            WHERE StudentID = '${studentDTO.ID}'`
        );
        studentDTO.StatusCode = fetchResult.StatusCode;
        studentDTO.StatusMessage = fetchResult.StatusMessage;
        if (fetchResult.StatusCode == ERROR_CODES.OK && fetchResult.Data && fetchResult.Data.length > 0) {
            studentDTO.Student = this.CreateStudentRecord(fetchResult.Data[0]);
        }
        return studentDTO;
    }

    /**
     * excutes the query and returns the list of students
     * @param studentDTO Student DTO
     * @param query query to execute
     * @returns student list
     */
    private CreateStudentListAsync = async (studentDTO: StudentDTO, query: string) => {
        let fetchStudents: any = await ExecuteQuery(query);
        studentDTO.StatusCode = fetchStudents.StatusCode;
        studentDTO.StatusMessage = fetchStudents.StatusMessage;
        if (fetchStudents.StatusCode == ERROR_CODES.OK && fetchStudents.Data && fetchStudents.Data.length > 0) {
            for (let record of fetchStudents.Data) {
                studentDTO.Students.push(this.CreateStudentRecord(record));
            }
        }
        return studentDTO;
    }

    /**
    * common function to hold student data
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
    * common function to return insert or replace query
    * @param student student record
    * @returns query 
    */
    private InsertUpdateQuery = (student: StudentModel) => {
        let appendCondition = student.Pincode ? `${student.Pincode}, ` : `NULL, `;
        appendCondition += student.AddedOn ? `'${student.AddedOn}', ` : `datetime('now'), `;
        appendCondition += student.ModifiedOn ? `'${student.ModifiedOn}', ` : `datetime('now'), `;
        appendCondition += student.IsSync ? `${+student.IsSync}` : `${SYNC_STATUS.NOT_SYNCED}`;
        return `
            INSERT OR REPLACE INTO Students 
            (StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, Weight, State, City, LastLoggedIn, IsActive, Pincode, AddedOn, ModifiedOn, IsSync)
            VALUES ('${student.StudentID}', '${student.FirstName}', '${student.MiddleName}', '${student.LastName}', '${student.MothersName}', ${student.Age}, ${student.PhoneNumber}, '${student.Dob}', '${student.Gender}', '${student.AddressLine1}', '${student.AddressLine2}', ${student.Weight ? student.Weight : null}, '${student.State}', '${student.City}', '${student.LastLoggedinDatetime}', ${+student.IsActive}, ${appendCondition})`;
    }

    /**
     * Delete student
     * @param {*} studentID
     * @returns status of the operation
     */
    private DeleteStudentAsync = async (studentID: string) => {
        let deleteResult: any = await ExecuteQuery(
            `UPDATE Students 
            SET IsActive = ${BOOLEAN_STATUS.STATUS_FALSE}, ModifiedOn = datetime('now'), IsSync = ${SYNC_STATUS.NOT_SYNCED}
            WHERE StudentID = '${studentID}'`
        );
        return deleteResult;
    }

    /**
     * update student record after sync data
     * @param student Student record
     * @param errors errors
     * @returns operation status
     */
    private UpdateStudentRecordAsync = async (student: StudentModel, errors: ErrorModel[]) => {
        let errorData: ErrorModel;
        let updateStudentsResult: any;
        let errorIndex: number = errors.findIndex((e: ErrorModel) => e.ID == student.StudentID);
        if (errorIndex >= 0) {
            let updateQuery: string;
            errorData = errors[errorIndex];
            if (errorData.Status == !!BOOLEAN_STATUS.STATUS_FALSE) {
                updateQuery =
                    `UPDATE Students 
                    SET ErrorMessage = '${errorData.Message}' 
                    WHERE StudentID = '${errorData.ID}'`;
            } else {
                updateQuery =
                    `UPDATE Students 
                    SET IsSync = ${SYNC_STATUS.SYNCED} 
                    WHERE StudentID = '${errorData.ID}'`;
            }
            updateStudentsResult = await ExecuteQuery(updateQuery);
        } else {
            updateStudentsResult.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
        }
        return updateStudentsResult;
    }
}