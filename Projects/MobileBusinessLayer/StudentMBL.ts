import { ERROR_CODES, STUDENT_ROUTES, API_METHODS, SYNC_CONSTANTS, API_HEADER_TOKEN } from "utility";
import { StudentDTO, ServiceApiDTO, BaseDTO, ApiHeaderModel } from "datamodels";
import { StudentMDL } from "mobiledatalayer";
import CommonMBL from "./CommonMBL";

export default class StudentMBL extends CommonMBL {

    /**
    * send all unsynced students and update isSynced flag after success
    * @returns operation status 
    */
    public SyncStudentsToServerAsync = async () => {
        let studentDTO = new StudentDTO();
        try {
            let studentMDL = new StudentMDL();
            studentDTO = await studentMDL.GetUnsyncedStudentsAsync(studentDTO);
            if (studentDTO.StatusCode == ERROR_CODES.OK) {
                if (studentDTO.Students && studentDTO.Students.length > 0) {
                    let serviceApiDTO = new ServiceApiDTO();
                    serviceApiDTO.Service = {
                        Method: API_METHODS.POST,
                        Api: STUDENT_ROUTES.SAVE_STUDENTS,
                        Header: await this.GetApiHeadersAsync(API_HEADER_TOKEN.ACCESS_TOKEN),
                        Body: { students: studentDTO.Students }
                    }
                    serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                    studentDTO.StatusCode = serviceApiDTO.StatusCode;
                    if (serviceApiDTO.StatusCode == ERROR_CODES.OK) {
                        studentDTO = await studentMDL.UpdateStudentsAsync(studentDTO);
                    }
                }
            }
            if (studentDTO.StatusCode != ERROR_CODES.OK && studentDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(studentDTO));
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
        }
        return studentDTO;
    }

    /**
     * get all student list from server and update in local DB
     * @returns operation status
     */
    public SyncStudentsFromServerAsync = async () => {
        let studentDTO = new StudentDTO();
        try {
            let studentMDL = new StudentMDL();
            let syncedDetail: BaseDTO = await studentMDL.GetLastSyncedDateTimeAsync(STUDENT_ROUTES.GET_STUDENTS);
            if (syncedDetail.StatusCode == ERROR_CODES.OK) {
                let serviceApiDTO = new ServiceApiDTO();
                let headers: ApiHeaderModel = await this.GetApiHeadersAsync(API_HEADER_TOKEN.ACCESS_TOKEN);
                headers.lastsyncedat = syncedDetail.LastSyncedAt;
                serviceApiDTO.Service = {
                    Method: API_METHODS.GET,
                    Api: STUDENT_ROUTES.GET_STUDENTS,
                    Header: headers
                }
                serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                studentDTO.StatusCode = serviceApiDTO.StatusCode;
                if (serviceApiDTO.StatusCode == ERROR_CODES.OK && serviceApiDTO.Data.Students && serviceApiDTO.Data.Students.length > 0) {
                    studentDTO.Students = serviceApiDTO.Data.Students;
                    studentDTO.UpdateSyncedDate = true;
                    studentDTO = await studentMDL.SaveStudentsAsync(studentDTO);
                    if (studentDTO.StatusCode == ERROR_CODES.OK) {
                        studentDTO.NoOfRecords = studentDTO.Students.length;
                        studentDTO.DataSyncedFor = SYNC_CONSTANTS.STUDENTS;
                    }
                }
            } else {
                studentDTO.StatusCode = syncedDetail.StatusCode;
                studentDTO.StatusMessage = syncedDetail.StatusMessage;
            }
            if (studentDTO.StatusCode != ERROR_CODES.OK && studentDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(studentDTO));
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
        }
        return studentDTO;
    }

    /**
     * fetch all students data
     * @param studentDTO
     * @returns operation status
     */
    public GetStudentsAsync = async (studentDTO: StudentDTO) => {
        try {
            studentDTO = await this.GetPageResourcesAsync(studentDTO);
            studentDTO = await new StudentMDL().GetStudentsAsync(studentDTO);
            if (studentDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(studentDTO));
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
        }
        return studentDTO;
    }

    /**
     * fetch single student data
     * @param studentDTO StudentDTO
     * @returns student DTO
     */
    public GetStudentAsync = async (studentDTO: StudentDTO) => {
        try {
            if (studentDTO.ID != "") {
                studentDTO = await new StudentMDL().GetStudentAsync(studentDTO);
                if (studentDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(studentDTO));
                }
            } else {
                studentDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
        }
        return studentDTO;
    }

    /**
     * Add or update student data
     * @param studentDTO StudentDTO
     * @returns operation status
     */
    public SaveStudentsAsync = async (studentDTO: StudentDTO) => {
        try {
            if (studentDTO.Students && studentDTO.Students.length > 0) {
                studentDTO = await new StudentMDL().SaveStudentsAsync(studentDTO);
                if (studentDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(studentDTO));
                }
            } else {
                studentDTO.StatusCode = ERROR_CODES.VALIDATION_ERROR;
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
        }
        return studentDTO;
    }
}