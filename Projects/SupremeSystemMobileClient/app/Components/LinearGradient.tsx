import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { LINEAR_GRADIENT } from "utility";

export const LHLinearGradient = (props: any) => {
    return (
        <>
            <LinearGradient
                locations={props.location ? props.location:null}
                start={LINEAR_GRADIENT.START}
                end={LINEAR_GRADIENT.END}
                colors={props.colors}
                style={props.style}>
                <>{props.children}</>
            </LinearGradient>
        </>
    )
}
