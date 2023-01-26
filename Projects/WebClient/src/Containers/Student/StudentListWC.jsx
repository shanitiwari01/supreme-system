import React, { useState } from "react";

import { Scrollbars } from "react-custom-scrollbars";
import { format } from 'date-fns'
const StudentListWC = (props) => {
    let students = props.students;
    return (
        <div className="own-table extra-thead-space-right own-sorting-table table-responsive">
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={60000}>
                <table className="table mb-0">
                    <thead>
                        <tr>
                            {/* <th className="header-checkbox">
                                <InputCheckbox
                                    type={"checkbox"}
                                    name="studentId"
                                    defaultChecked={props.allChecked}
                                    changeValue={(ev) => props.checkedRows(ev, null, "All")}
                                />
                            </th> */}
                            <th
                                className={`sort-header cursor ${props.sortObj.sortVal === "name" ? "active" : ""
                                    } ${props.sortObj.sortType ? "aesc" : "desc"}`}
                                onClick={() => props.sortingTable("name")}
                            >
                                {" "}
                                <span className="header-txt">{'Name '} </span>
                                {
                                    props.sortObj.sortVal === "name" ? (
                                        props.sortObj.sortType ? <i class="fa fa-long-arrow-up" aria-hidden="true"></i> : <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
                                    ) : null
                                }
                            </th>
                             
                            <th
                                className={`sort-header cursor ${props.sortObj.sortVal === "dob" ? "active" : ""
                                    } ${props.sortObj.sortType ? "aesc" : "desc"}`}
                                onClick={() => props.sortingTable("dob")}
                            >
                                {" "}
                                <span className="header-txt">{'Date of birth '}</span>
                                {
                                    props.sortObj.sortVal === "dob" ? (
                                        props.sortObj.sortType ? <i class="fa fa-long-arrow-up" aria-hidden="true"></i> : <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
                                    ) : null
                                }
                            </th>

                            <th
                                className={`sort-header cursor ${props.sortObj.sortVal === "dob" ? "active" : ""
                                    } ${props.sortObj.sortType ? "aesc" : "desc"}`}
                                onClick={() => props.sortingTable("Last Logged In")}
                            >
                                {" "}
                                <span className="header-txt">{'Last Logged In '}</span>
                                {
                                    props.sortObj.sortVal === "dob" ? (
                                        props.sortObj.sortType ? <i class="fa fa-long-arrow-up" aria-hidden="true"></i> : <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
                                    ) : null
                                }
                            </th>

                            <th
                                className={`sort-header cursor ${props.sortObj.sortVal === "address" ? "active" : ""
                                    } ${props.sortObj.sortType ? "aesc" : "desc"}`}
                                onClick={() => props.sortingTable("address")}
                            >
                                {" "}
                                <span className="header-txt">{'Address'} </span>
                                {
                                    props.sortObj.sortVal === "address" ? (
                                        props.sortObj.sortType ? <i class="fa fa-long-arrow-up" aria-hidden="true"></i> : <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
                                    ) : null
                                }

                            </th>

                            <th><span className="header-txt">{'Delete'} </span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students &&
                            students.length > 0 &&
                            students.map((student) => {
                                let lastLoggedIn  =  "";
                                if(student.LastLoggedinDatetime) {
                                    let recordDate =  new Date(student.LastLoggedinDatetime + ' UTC');
   
                                    lastLoggedIn    =   recordDate.toString();
                                }

                                return (
                                    <tr key={student.StudentID} onDoubleClick={() => props.openEditStudentModal(student)} className="cursor">
                                        {/* <td>
                                             <InputCheckbox
                                                type={"checkbox"}
                                                name="studentId"
                                                checked={student.checked ? student.checked : false}
                                                changeValue={(ev) => props.checkedRows(ev, student.student_id, "single")}
                                            />
                                        </td> */}

                                        <td>
                                            {student.Name ? student.Name : 'N/A'}
                                        </td>

                                        <td>
                                            {student.DateOfBirth ? format(new Date(student.DateOfBirth), 'dd-MM-yyyy') : 'N/A'}
                                        </td>

                                        <td>
                                            {student.LastLoggedinDatetime ? format(new Date(lastLoggedIn), 'dd-MM-yyyy HH:mm:ii') : 'N/A'}
                                        </td>

                                        <td>
                                            {student.Address ? student.Address : 'N/A'}
                                        </td>

                                        <td onClick={() => props.deleteStudent(student.StudentID)}>
                                            <i class="fa fa-trash" height={50} aria-hidden="true"></i>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </Scrollbars>
        </div>
    );
};

export default StudentListWC;
