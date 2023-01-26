import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class RouteChangedWC extends Component{
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
        //  globalLoader(true)
        // this.onRouteChanged();
        }
      }
    
      onRouteChanged() {
        
        // console.log("ROUTE CHANGED child");
      }

      render(){
          return <div></div>
      }
}

export default withRouter(RouteChangedWC)