import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { withRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { TextBox, DropDown } from '../../Common/CustomFieldsWC';
import { saveStudentDetailsApi } from "../../Services/StudentServicesWC";
import { format } from 'date-fns';
class AddEditStudentModalWC extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: '', //store name value
      nameErr: '',  // store name error if any
      emptyName: false, //set flag if name error

      dob: new Date(),  // store date of birth value
      valueInDate: false,  //set flag if date error
      formattedDate: "",  //store formated string date 
      dobErr: '', //store date error

      address: '',  //store address value
      textAreaErr: '',  //store address error
      emptyTextArea: false, //set flag if address error

      singleStudentObj: {}  //store single student obj

    }

  }

  componentDidMount = async () => {
    try {
      if(this.props.isEdit){
        let tempStudentObj = this.props.singleStudentObj
        
        this.setState({ name: tempStudentObj.Name, dob: tempStudentObj.DateOfBirth, address: tempStudentObj.Address  })
      }
      else{
        this.setState({ singleStudentObj: {} })
      }
     
    } catch (error) {

    }
  }
  //Handle all the input fields 
  onChangeValue = (ev) => {
    try {
      let name = ev.target.name;
      let value = ev.target.value;

      if (name === "name") {
        this.setState({
          [name]: value,
        })
      }
      else if (name === "address") {
        this.setState({
          [name]: value,
        })
      }
      else if (name === "dob") {
        this.setState({
          [name]: value,
        })
      }
      else {
        this.setState({
          [name]: value,
        })
      }
    }
    catch (error) {
    }
  }

  // save or update user data
  userPostData = async () => {
    try {
        let obj = {
          name : this.state.name,
          dob: this.state.dob,
          address: this.state.address,
          lastLoggedIn: new Date(),
          globalUser: 1
      }
        
        if(this.props.isEdit) {
          obj.studentId = this.props.singleStudentObj.StudentID;
        }
        
        let submitResult = await saveStudentDetailsApi(obj);

        if(submitResult && submitResult.data?.StatusCode == 200) {
            this.props.studentSaved();
        }

    } catch (error) {
    }
  }


  render() {
    
    return (
      <div>
        <Modal
          classNames={{ modal: "modal-sm modal-own" }}
          open={this.props.open}
          onClose={() => this.props.onCloseChangeModal()}
          center
          closeOnOverlayClick={false}
          closeIcon={""}
          autoFocus={false}
        >
          <div className="px-3">
            <p className="login-txt mb-2 primary-color"> Add Student </p>

            <form
              className="form-own pt-2"
              noValidate
              autoComplete="off"
            >
              <div className="form-group-icon position-relative form-group pb-1">
                <TextBox
                  type={"text"}
                  resourceKey={'name'}
                  value={this.state.name}
                  changeValue={(ev) => this.onChangeValue(ev)}
                />
                <div className="error-wrapper">
                  {this.state.nameErr}
                </div>
              </div>
              <div className="form-group-icon position-relative form-group pb-1">
                <TextBox
                  type={"date"}
                  resourceKey={'dob'}
                  value={format(new Date(this.state.dob), 'dd-MM-yyyy')}
                  changeValue={(ev) => this.onChangeValue(ev)}
                />
                <div className="error-wrapper">
                  {this.state.dobErr}
                </div>
              </div>

              <div className="form-group-icon position-relative form-group pb-1">
                <TextBox
                  type={"txtarea"}
                  resourceKey={'address'}
                  value={this.state.address}
                  changeValue={(ev) => this.onChangeValue(ev)}
                />
                <div className="error-wrapper">
                  {this.state.addressErr}
                </div>
              </div>

              <div className="border-bottom-own col-12 mb-3"></div>
              <div className="pb-3 btn-wrapper pt-3">
                <button
                  type="button"
                  className="btn full-width-xs-mb btn-own btn-own-grey min-height-btn mr-3"
                  onClick={() => this.props.onCloseChangeModal()}
                >
                  {'CANCEL'}
                </button>
                <button
                  onClick={() => this.userPostData()}
                  type="button"
                  className="btn full-width-xs btn-own btn-own-primary min-height-btn"
                >
                  {'Save'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(AddEditStudentModalWC);
