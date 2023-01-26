import React from "react";
import { View } from 'react-native';
import { ValidateFormFieldsAsync } from "../Functions/CommonFunctions";

export const LHForm = React.forwardRef((props: any, ref: any) => {
    let fieldsArray: any = []

    React.useImperativeHandle(ref, () => ({
        async onSubmit() {
            let childrens: any = React.Children.toArray(props.children);
            fieldsArray = [];
            GetChildrenValue(childrens);
            let validationErrorList = await ValidateFormFieldsAsync(fieldsArray, props.resources);
            let errorFlag = false;
            for (let error of validationErrorList) {
                if (!error.validation) {
                    GetError(childrens, error);
                    errorFlag = true;
                }
                else{
                    GetError(childrens, error);
                }
            }
            if (!errorFlag) {
                return fieldsArray;
            }
        },
    }))

    const GetChildrenValue = (children: any) => {
        React.Children.map(children, function (child) {
            let childObj: any = {};
            if (child.props?.resourceKey) {
                childObj.name = child.props.resourceKey;
                childObj.value = child.ref.current.GetValue();
                childObj.type = child.props.type;
                fieldsArray.push(childObj)
            } else if (child.props?.children) {
                GetChildrenValue(child.props.children);
            }
        });
    }

    const GetError = async (children: any, error: any) => {
        React.Children.map(children, async function (child) {
            if (child.props?.resourceKey) {
                if (child.props.resourceKey === error.name) {
                    child.ref.current.ShowError(error.error);
                }
            } else if (child.props?.children) {
                GetError(child.props.children, error);
            }
        });
    }

    return (
        <View>
            <>{props.children}</>
        </View>
    )
});

