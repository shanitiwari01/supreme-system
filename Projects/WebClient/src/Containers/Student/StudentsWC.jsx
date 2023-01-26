import React, { Component } from 'react';
import { fetchStudentListApi, deleteStudentApi } from "../../Services/StudentServicesWC";
import PaginationWC from '../../Common/PaginationWC';
import { TextBox, InputCheckbox } from '../../Common/CustomFieldsWC'
import StudentListWC from './StudentListWC';
import AddEditStudentModalWC from './AddEditStudentModalWC';

class StudentsWC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allRowsChecked: false,      // all checkbox handler
            currentPage: 1,             // pagination current page number
            isUserChecked: false,       // check atleast one checkbox checked
            openModal: false,           // open add and edit modal
            pageSize: 25,               // per page rows number
            students: [],               // student list
            sortColName: '',            // sorting column name
            sortType: true,             // sorting type (asc, desc )
            searchVal: ''    ,          // search text data
            singleStudentData:{}  ,     // get single student object
            isEdit:false,               //check if modal is edit or not
        };
    }

    componentDidMount = () => {

        // studen list storing in state
        
        this.fetchStudents();
    }

    /**
     * fetch student details
     */
    fetchStudents = async () => {
        let studentResult = await fetchStudentListApi();
        if(studentResult && studentResult.data?.StatusCode == 200){
            let students = studentResult.data?.Students;
            this.setState({ students: students });
        }
    }

    /**
     * Sorting table by column name
     * 
     * @param {*} val 
     */
    sortingTable = (val) => {
        if (val === this.state.sortColName) {
            this.setState((prevState => ({
                sortType: !prevState.sortType,
                currentPage: 1,
            }

            )), () => {
                // call api
                // this.viewUserApi()
            })
        }
        else {
            this.setState({
                sortColName: val,
                sortType: true,
                currentPage: 1,
            }, () => {
                // call api
                // this.viewUserApi()
            })
        }
    }

    /**
     * Handling per page rows number
     * 
     * @param {*} ev 
     */
     onChangeValue = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value,
            pageSize:ev.target.value,
            currentPage: 1,
        }, () => {
            // call api
            // this.viewUserApi()
        })
    }

    /**
     * Refresh student details
     */
    resetApiVal = () => {
        this.setState({
            pageSize: 25,
            currentPage: 1,
            searchVal: '',
            sortColName: '',
            sortType: true,
        }, () => {
            // call api
            // this.viewUserApi()
        })
    }

    /**
     * Jump to page handler
     * 
     * @param {*} ev 
     * @param {*} val 
     */
    goToPage = (ev, val) => {
        try {
            if (ev) {
                this.setState({
                    currentPage: ev.target.value
                }, () => {
                    // call api
                    // this.viewUserApi()
                })
            }
            else {
                if (val === 'next') {
                    this.setState((prevState => ({
                        currentPage: prevState.currentPage + 1
                    }

                    )), () => {
                        // call api
                        // this.viewUserApi()
                    })
                }
                else if (val === 'prev') {
                    this.setState((prevState => ({
                        currentPage: prevState.currentPage - 1
                    }

                    )), () => {
                        // call api
                        // this.viewUserApi()
                    })
                }
            }
        } catch (error) {
            let errorObject = {
                methodName: "students/goToPage",
                errorStake: error.toString(),
            };

            // errorLogger(errorObject);
        }
    }

    /**
     * Search student details
     * 
     * @param {*} ev 
     */
    searchFilter = (ev) => {
        ev.preventDefault();

        // call api
        // this.viewUserApi()

    }

    /**
     * Handle multiple checkbox
     * 
     * @param {*} ev 
     * @param {*} id 
     * @param {*} type 
     */
    checkedRows = (ev, id, type) => {
        try {
            let students = [...this.state.students];

            if (type === "All") {
                students.forEach(element => {
                    element.checked = ev.target.checked
                });
                this.setState({
                    students: students,
                    allRowsChecked: ev.target.checked,
                    isUserChecked: ev.target.checked,
                })
            }

            else {
                let index = students.findIndex(x => x.StudentID === id);
                students[index].checked = ev.target.checked;
                let check = students.some(x => x.checked)

                let obj = {
                    students: students,
                    isUserChecked: check
                };

                if(!ev.target.checked){
                    obj.allRowsChecked = ev.target.checked;
                }

                this.setState(obj);
            }

        } catch (error) {
            let errorObject = {
                methodName: "students/checkedRows",
                errorStake: error.toString(),
            };

            // errorLogger(errorObject);
        }
    }

    /**
     * Manage student edit modal
     * 
     * @param {*} studentId 
     */
     openEditStudentModal = (student) => {
        this.setState({openModal: true});
        this.setState({isEdit:true});
        this.setState({singleStudentData:student});
    }

    /**
     * Open add modal
     */
     openAddUserModal = () => {
        this.setState({openModal: true});
        this.setState({isEdit:false});
    }

    /**
     * Close the modal and refresh the student table
     */
    refeshStudentData  =  () => {
        this.setState({openModal: false});
        
        this.fetchStudents();
    }

    /**
     * delete the student
     */
    deleteStudent = async (id) => {
        let obj = {
            id : id,
            globalUser: 1
        }
        
        let deleteResult = await deleteStudentApi(obj);

        if(deleteResult && deleteResult.data?.StatusCode == 200){
            this.fetchStudents();
        }
    }

    render() {

        return (
            <>
                <div>
                    <section className="app-main-wrapper">
                        <div className="right-content-wrapper mt-3">
                            <div className="search-action-wrapper px-3 d-flex flex-wrap">
                                <>
                                    {/* <button type="button" onClick={this.deactivateUser} disabled={!this.state.checkedUserInfo} className="btn btn-own gray-btn mr-3 min-height-btn">
                                    {getResourceValue(this.state.adminResources, 'DEACTIVATE')}
                                </button> */}

                                    <button type="button" onClick={this.openAddUserModal} className="btn btn-own btn-own-primary mr-3 min-height-btn align-items-center d-inline-flex text-uppercase">
                                    <span className="font-24 mr-1">+</span> {'Add New'}
                                </button>

                                    <div className="search-bar-data ml-auto  ">
                                        <form className="form-own form-auto-height" noValidate autoComplete="off" onSubmit={(ev) => this.searchFilter(ev)}>
                                            <div className="form-group-icon position-relative form-group pb-1 ">
                                                <TextBox
                                                    type={"text"}
                                                    // resources={this.state.manageProfileResources}
                                                    resourceKey={'Search'}
                                                    value={this.state.searchVal}
                                                    changeValue={(ev) => this.setState({ searchVal: ev.target.value })} />
                                            </div>
                                        </form>
                                    </div>
                                </>
                            </div>
                            {this.state.students.length > 0 &&
                                <div className="px-3 pt-3 mt-4" style={{ borderTop: "2px solid #ebeef1", }}>
                                    <PaginationWC
                                        pageSize={this.state.pageSize}
                                        changePageSize={this.changePageSize}
                                        resources={this.state.adminResources}
                                        goToPage={this.goToPage}
                                        totalCount={this.state.students.length}
                                        currentPage={this.state.currentPage}
                                        changeValue={(ev) => this.onChangeValue(ev)}
                                    />
                                </div>}

                            <div className="p-3">
                                {this.state.students.length <= 0 ?
                                    <div className="no-table-data mt-3">
                                        {/* {getResourceValue(this.state.adminResources, 'NO_RECORDS')} */}
                                        {' No Records Found'}
                                    </div> :

                                        <StudentListWC 
                                            sortingTable={this.sortingTable} 
                                            allChecked={this.state.allRowsChecked}
                                            students={this.state.students} 
                                            openEditStudentModal={this.openEditStudentModal}
                                            sortObj={{ sortVal: this.state.sortColName, sortType: this.state.sortType }}
                                            checkedRows={this.checkedRows}
                                            deleteStudent={(id) => this.deleteStudent(id)}
                                            // resources={this.state.adminResources}
                                        />}
                            </div>
                        </div>
                    </section>
                </div>
                {this.state.openModal ?
                    <AddEditStudentModalWC 
                    // closeCallBackOption={this.viewUserApi} 
                    open={true}
                    studentListArray={this.state.students}
                    singleStudentObj={this.state.singleStudentData?this.state.singleStudentData:null}
                    isEdit={this.state.isEdit}
                    // organizations={this.state.organizations}
                    onCloseChangeModal={() => this.setState({openModal: false})} 
                    studentSaved={() => this.refeshStudentData()}
                    // roleType={this.state.currentTabActive} 
                    // resources={this.state.adminResources}
                    // patientTags={this.state.patientTags}
                    /> : null}
                    
            </>

        )
    }


}

export default StudentsWC;