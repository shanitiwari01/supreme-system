import { BaseDTO } from "./BaseDTO";
import { StudentModel } from "../Models/StudentModel";

export class StudentDTO extends BaseDTO {
    Student?: StudentModel;
    Students: Array<StudentModel> = [];
}