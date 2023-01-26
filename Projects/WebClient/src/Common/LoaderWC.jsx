import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoaderWC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.props.loader ?
                    <div className="loader-wrapper">
                        <div className="loader"></div>
                    </div> : null}
            </React.Fragment>

        )
    }
}


const mapState = state => ({
    loader: state.common.loader,
});

export default connect(mapState)(LoaderWC);