import { ERROR_CODES, RESOURCE_GROUPS, VALIDATION_DATA_VARIABLES, HEADER_NULL } from "utility";
import { StudentDTO, ContextDTO } from "datamodels";
import { StudentSDL } from "servicedatalayer";
import CommonSBL from "./CommonSBL";
import express from "express";

export default class StudentSBL extends CommonSBL {

    /**
     * fetch all student data
     * @param req 
     * @param res 
     * @returns student list
     */
    public GetStudentsAsync = async (req: express.Request, res: express.Response) => {
        let contextDTO: ContextDTO = res.locals.context;
        let studentDTO = new StudentDTO();
        try {
            if (contextDTO.LoggedInUserID) {
                studentDTO.LoggedInUserID = contextDTO.LoggedInUserID;
                studentDTO.LastSyncedAt = req.headers.lastsyncedat && req.headers.lastsyncedat != HEADER_NULL ? req.headers.lastsyncedat.toString() : "";
                studentDTO = await new StudentSDL().GetStudentsAsync(studentDTO);
                if (studentDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(studentDTO));
                }
            } else {
                studentDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error, contextDTO.LoggedInUserID);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
            res.status(ERROR_CODES.OK).send(studentDTO);
        }
    }

    /**
     * fetch single student data
     * @param req 
     * @param res 
     * @returns student DTO
     */
    public GetStudentAsync = async (req: express.Request, res: express.Response) => {
        let contextDTO: ContextDTO = res.locals.context;
        let studentDTO = new StudentDTO();
        try {
            if (contextDTO.LoggedInUserID) {
                studentDTO.LoggedInUserID = contextDTO.LoggedInUserID;
                studentDTO.ID = req.body.id ? req.body.id.toString().trim() : "";
                if (studentDTO.ID != "") {
                    studentDTO = await new StudentSDL().GetStudentAsync(studentDTO);
                    if (studentDTO.StatusCode != ERROR_CODES.OK) {
                        throw new Error(this.CreateErrorMessage(studentDTO));
                    }
                } else {
                    studentDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                }
            } else {
                studentDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error, studentDTO.LoggedInUserID);
        } finally {
            studentDTO = this.ResetApiData(studentDTO);
            res.status(ERROR_CODES.OK).send(studentDTO);
        }
    }

    /**
     * Save students list 
     * @param req 
     * @param res 
     * @returns operation status
     */
    public SaveStudentsAsync = async (req: express.Request, res: express.Response) => {
        let contextDTO: ContextDTO = res.locals.context;
        let studentDTO = new StudentDTO();
        try {
            if (contextDTO.LoggedInUserID) {
                studentDTO.LoggedInUserID = contextDTO.LoggedInUserID;
                studentDTO.Students = req.body.students ? req.body.students : [];
                if (studentDTO.Students && studentDTO.Students.length > 0) {
                    studentDTO = await this.ValidateAndSaveStudentsAsync(studentDTO);
                    if (studentDTO.StatusCode != ERROR_CODES.OK && studentDTO.StatusMessage) {
                        throw new Error(this.CreateErrorMessage(studentDTO));
                    }
                } else {
                    studentDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                }
            } else {
                studentDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
            }
        } catch (error) {
            studentDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error, studentDTO.LoggedInUserID);
        } finally {
            studentDTO.Students = [];
            studentDTO = this.ResetApiData(studentDTO);
            res.status(ERROR_CODES.OK).send(studentDTO);
        }
    }

    /**
     * Validate student list 
     * @param studentDTO
     * @returns operation status
     */
    private ValidateAndSaveStudentsAsync = async (studentDTO: StudentDTO) => {
        studentDTO.GroupIDs = `${RESOURCE_GROUPS.COMMON}, ${RESOURCE_GROUPS.STUDENTS}`;
        if (await this.ValidateDataAsync(studentDTO, VALIDATION_DATA_VARIABLES.STUDENTS)) {
            studentDTO = await new StudentSDL().SaveStudentsAsync(studentDTO);
        } else {
            studentDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return studentDTO;
    }
}