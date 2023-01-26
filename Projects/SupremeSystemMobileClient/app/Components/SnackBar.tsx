import React, { useEffect } from "react";
import { Text } from 'react-native';
import { SnackBarStyles } from "../css/Styles";
import { LINEAR_GRADIENT } from "utility";
import { LHLinearGradient } from "./LinearGradient";
import { useDispatch, useSelector } from 'react-redux';
import * as snackBarActions from '../store/actions/snackBarAction';
import { IState } from "./ReducerInterface";

export const LHSnackBar = () => {
    let show = useSelector((state: IState) => state.snackBarReducer.show);
    let message = useSelector((state: IState) => state.snackBarReducer.message);
    let timeOut = useSelector((state: IState) => state.snackBarReducer.timeOut);
    let dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(snackBarActions.setShowSnackBar(false, ''));
        }, timeOut);
    },[message])

    return (
        <>
            {
                show && <LHLinearGradient
                    colors={LINEAR_GRADIENT.COLORS.SECONDARY}
                    style={SnackBarStyles.snackBarContainer}>
                    <Text style={SnackBarStyles.labelStyle}>{message}</Text>
                </LHLinearGradient>
            }
        </>
    )
}