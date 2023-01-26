import React, { Component } from 'react';
import { connect } from 'react-redux';
import { globalAlertRemove } from '../Redux/Actions/CommonActionsWC';

class AlertWC extends Component {
    constructor(props) {
        super(props);
        this.state={
            count:0,
        }
    }

    /**
     * Remove alert after 4 seconds
     */
    removeAlert = () => {
        setTimeout(() => {
            globalAlertRemove()
        }, 4000)
    }

    render() {
        
        const { alertArray } = this.props;
        return (
            <React.Fragment>
                {alertArray && alertArray.length > 0 ?
                    <div className="alert-box-wrapper">

                        <ul >

                            {alertArray.map((x, index) => (

                                <li key={index} className={x.alertType == "success" ? "alert-list success list-unstyled" : "alert-list error list-unstyled"}>
                                    {this.removeAlert()}
                                    {x.alertMessage}
                                </li>

                            ))}
                        </ul>
                    </div> : null}
            </React.Fragment>
        )
    }

}

const mapStateProps = state => ({
    alertArray: state.common.alertArray,
})

export default connect(mapStateProps)(AlertWC)