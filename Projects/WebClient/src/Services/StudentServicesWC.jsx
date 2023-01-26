import Axios from "axios";
import { GLOBAL_API } from '../Utils/TypesWC';

/**
 * fetch student list api
 * 
 * @param {*} value 
 * @param {*} link 
 * @returns 
 */
export const fetchStudentListApi = async () => {
    return Axios.post(`${GLOBAL_API}/auth/student/get-students`, {}, {
        headers: {}
    }).then(res => {
        return res
    }).catch(err => {
        console.log(err)
    })
}

export const saveStudentDetailsApi = async (obj) => {
    return Axios.post(`${GLOBAL_API}/auth/student/save-student`, obj, {
        headers: {}
    }).then(res => {
        return res
    }).catch(err => {
        console.log(err)
    })
}

export const deleteStudentApi = async (obj) => {
    return Axios.post(`${GLOBAL_API}/auth/student/delete-student`, obj, {
        headers: {}
    }).then(res => {
        return res
    }).catch(err => {
        console.log(err)
    })
}
