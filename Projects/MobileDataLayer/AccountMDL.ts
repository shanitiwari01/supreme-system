import { BOOLEAN_STATUS, ERROR_CODES } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { UserDTO, UserModel } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class AccountMBL extends CommonMDL {

    /**
     * add/update user
     * @param UserDTO User DTO
     * @returns status
     */
    public SaveUserAsync = async (userDTO: UserDTO) => {
        if (userDTO.User instanceof UserModel) {
            let deleteResult: any = await ExecuteQuery(`DELETE FROM Users`);
            userDTO.StatusCode = deleteResult.StatusCode;
            userDTO.StatusMessage = deleteResult.StatusMessage;
            if (deleteResult.StatusCode == ERROR_CODES.OK) {
                let userResult: any = await ExecuteQuery(this.CreateUserSaveQuery(userDTO.User));
                userDTO.StatusCode = userResult.StatusCode;
                userDTO.StatusMessage = userResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * get save query
     * @param UserDTO User DTO
     * @returns query
     */
    private CreateUserSaveQuery = (user: UserModel) => {
        let insertQuery = `'${user.UserID}', '${user.FirstName}', '${user.LastName}', '${user.DateOfBirth}', '${user.GenderKey}', '${user.Phone}', '${user.KycTypeKey}', '${user.KycID}', '${user.KycDocument}', ${BOOLEAN_STATUS.STATUS_TRUE}, '${user.AccountPassword}', ${BOOLEAN_STATUS.STATUS_FALSE}, ${BOOLEAN_STATUS.STATUS_TRUE}, ${BOOLEAN_STATUS.STATUS_TRUE}, datetime('now'), datetime('now'), `;
        insertQuery += user.UserPhoto ? `'${user.UserPhoto}', ` : `NULL, `;
        insertQuery += user.MiddleName ? `'${user.MiddleName}', ` : `NULL, `;
        insertQuery += user.MothersName ? `'${user.MothersName}', ` : `NULL, `;
        insertQuery += user.Email ? `'${user.Email}'` : `NULL`;
        return `INSERT INTO Users
            (UserID, FirstName, LastName, DateOfBirth, GenderKey, Phone, KycTypeKey, KycID, KycDocument, ActivationStatus, AccountPassword, IsTempPassword, IsTwoFactorAuthenticationDone, IsActive, AddedOn, ModifiedOn, UserPhoto, MiddleName, MotherName, Email)
            VALUES (${insertQuery})`;
    }
}