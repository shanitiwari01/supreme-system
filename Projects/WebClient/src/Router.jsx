import React, { useEffect, useState } from 'react';
import {Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

//common component
import NotFoundWC from './Common/NotFoundWC';
import StudentsWC from './Containers/Student/StudentsWC';


// mapping of component with its name
const FeatureComponentList = {
    
}

const Router = (props) =>  {
    const [ featuresList, setFeaturesList ] = useState(props.routes);

    useEffect(() => {
        setFeaturesList(props.routes);
    }, [props.routes])

    return (
        <Switch>
            
            <Route exact path={`/`} component={StudentsWC} />
            
            {/* Make all routes as per the features assigned for the user role */}
            {
                
                featuresList != null && featuresList != '' && 
                featuresList.length > 0 && featuresList.map((feature, index) => (
                
                    /* check if the component exists for each feature */
                    typeof(FeatureComponentList[feature.component]) != 'undefined' ? 
                        <Route 
                            exact
                            key={index}  
                            path={feature.route_name} 
                            component={FeatureComponentList[feature.component]} 
                        />
                    : null
                
                ))
            }
            
            <Route path="*" component={NotFoundWC} />

        </Switch>
    )
}
// export default Router

const mapStateToProps = state => ({
    routes: state.common.routes,
})

export default connect(mapStateToProps)(Router);