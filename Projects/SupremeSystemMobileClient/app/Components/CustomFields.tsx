import React, { useEffect, useState } from "react";
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { View, Pressable, TouchableOpacity, Text, Image } from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import FileModel from './../models/FileModel';
import { Dropdown } from 'react-native-element-dropdown';
import { CommonStyle, AddEditStudentStyle } from "../css/Styles";
import { ELEMENT_STYLES, RESOURCE_FIELDS, REG_EXP_CONSTANTS, CUSTOM_CONSTANTS, NUMERIC_CONSTANTS, LINEAR_GRADIENT, PICKER_TYPE, ATTCH_IMAGE_ICON } from "utility";
import { LHInfoValue } from "./InfoValue";
import { LHLinearGradient } from "./LinearGradient";
import { SvgXml } from "react-native-svg";
import { launchImageLibrary } from 'react-native-image-picker'

/**
 * Common TextField component
 * @param {*} props 
 * @returns TextField
 */
export const LHTextBox = React.forwardRef((props: any, ref: any) => {
    let [value, setValue] = useState('');
    let [error, setError] = useState('');

    useEffect(() => {
        props.value ? setValue(props.value.toString()) : setValue('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return value;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        },
    }));

    return (
        props.resource ?
            <View style={CommonStyle.textInputContainer}>
                {(typeof props.label == "undefined" || props.label) &&
                    <View style={CommonStyle.InfoPosition}>
                        <Text style={CommonStyle.TextInputLabel}>
                            <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text>
                        </Text>
                        {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}
                    </View>}
                <TextInput
                    testID={props.resourceKey}
                    mode={CUSTOM_CONSTANTS.MODE.OUTLINED}
                    placeholder={props.resource[RESOURCE_FIELDS.PLACEHOLDER]}
                    keyboardType={props.keyboardType ? props.keyboardType : CUSTOM_CONSTANTS.KEYBOARD_TYPE.DEFAULT}
                    multiline={props.multiline ? props.multiline : false}
                    numberOfLines={props.multiline ? (props.numberOfLines ? props.numberOfLines : NUMERIC_CONSTANTS.THREE) : NUMERIC_CONSTANTS.ONE}
                    value={value}
                    maxLength={props.type == CUSTOM_CONSTANTS.INPUT_TYPE.STRING ? parseInt(props.resource[RESOURCE_FIELDS.MAX_LENGTH]) : (props.resource[RESOURCE_FIELDS.MAX_LENGTH]).toString().length}
                    onChangeText={(val: any) => { props.keyboardType == CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC ? setValue(val.replace(REG_EXP_CONSTANTS.NUMERIC, '')) : (props.keyboardType == CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD ? setValue(val.replace(REG_EXP_CONSTANTS.NUMERIC_DECIMAL, '')) : setValue(val)); }
                    }
                    style={props.styles ? props.styles : CommonStyle.textInput}
                    editable={props.editable}
                    outlineColor={ELEMENT_STYLES.COLORS.PLACEHOLDER}
                    placeholderTextColor={ELEMENT_STYLES.COLORS.PLACEHOLDER_TEXT}
                    secureTextEntry={props.secureTextEntry ? true : false}
                    right={props.rightIcon ?
                        <TextInput.Icon
                            onPress={() => props.clickRightIcon()}
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.rightIcon} />}
                        /> : null}
                    left={props.leftIcon ?
                        <TextInput.Icon
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.leftIcon} />}
                        /> : null}
                />
                {error !== '' && <Text style={CommonStyle.errorText} >{error}</Text>}
            </View>
            : null
    );
});

/**
 * Common Numeric TextField component
 * @param {*} props 
 * @returns TextField
 */
export const LHNumericTextBox = React.forwardRef((props: any, ref: any) => {
    let [value, setValue] = useState('');
    let [error, setError] = useState('');

    useEffect(() => {
        props.value ? setValue(props.value.toString()) : setValue('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return value;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        },
    }));

    return (
        props.resource ?
            <View style={CommonStyle.textInputContainer}>
                {(typeof props.label == "undefined" || props.label) &&
                    <View style={CommonStyle.InfoPosition}>
                        <Text style={CommonStyle.TextInputLabel}>
                            <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text>
                        </Text>
                        {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}
                    </View>}
                <TextInput
                    testID={props.resourceKey}
                    mode={CUSTOM_CONSTANTS.MODE.OUTLINED}
                    placeholder={props.resource[RESOURCE_FIELDS.PLACEHOLDER]}
                    keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.DEFAULT}
                    value={value}
                    maxLength={(props.resource[RESOURCE_FIELDS.MAX_LENGTH]).toString().length}
                    onChangeText={(val: any) => { setValue(val.replace(REG_EXP_CONSTANTS.NUMERIC, '')) }}
                    style={props.styles ? props.styles : CommonStyle.textInput}
                    editable={props.editable}
                    outlineColor={ELEMENT_STYLES.COLORS.PLACEHOLDER}
                    placeholderTextColor={ELEMENT_STYLES.COLORS.PLACEHOLDER_TEXT}
                    right={props.rightIcon ?
                        <TextInput.Icon
                            onPress={() => props.clickRightIcon()}
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.rightIcon} />}
                        /> : null}
                    left={props.leftIcon ?
                        <TextInput.Icon
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.leftIcon} />}
                        /> : null}
                />
                {error !== '' && <Text style={CommonStyle.errorText} >{error}</Text>}
            </View>
            : null
    );
});

/**
 * Common Speical TextField component
 * @param {*} props 
 * @returns TextField
 */
export const LHSpecialTextBox = React.forwardRef((props: any, ref: any) => {
    let [value, setValue] = useState('');
    let [error, setError] = useState('');

    useEffect(() => {
        props.value ? setValue(props.value.toString()) : setValue('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return value;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        },
    }));

    return (
        props.resource ?
            <View style={CommonStyle.textInputContainer}>
                {(typeof props.label == "undefined" || props.label) &&
                    <View style={CommonStyle.InfoPosition}>
                        <Text style={CommonStyle.TextInputLabel}>
                            <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text>
                        </Text>
                        {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}
                    </View>}
                <TextInput
                    testID={props.resourceKey}
                    mode={CUSTOM_CONSTANTS.MODE.OUTLINED}
                    placeholder={props.resource[RESOURCE_FIELDS.PLACEHOLDER]}
                    value={value}
                    onChangeText={(val: any) => setValue(val)}
                    style={props.styles ? props.styles : CommonStyle.textInput}
                    editable={props.editable}
                    outlineColor={ELEMENT_STYLES.COLORS.PLACEHOLDER}
                    placeholderTextColor={ELEMENT_STYLES.COLORS.PLACEHOLDER_TEXT}
                    secureTextEntry={props.secureTextEntry ? !!BOOLEAN_STATUS.STATUS_TRUE : !!BOOLEAN_STATUS.STATUS_FALSE}
                    right={props.rightIcon ?
                        <TextInput.Icon
                            onPress={() => props.clickRightIcon()}
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.rightIcon} />}
                        /> : null}
                    left={props.leftIcon ?
                        <TextInput.Icon
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.leftIcon} />}
                        /> : null}
                />
                {error !== '' && <Text style={CommonStyle.errorText} >{error}</Text>}
            </View>
            : null
    );
});


/**
 * Common Speical TextField component
 * @param {*} props 
 * @returns TextField
 */
export const LHNormalTextBox = React.forwardRef((props: any, ref: any) => {
    let [value, setValue] = useState('');
    let [error, setError] = useState('');

    useEffect(() => {
        props.value ? setValue(props.value.toString()) : setValue('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return value;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        },
    }));

    return (
        props.resource ?
            <View style={CommonStyle.textInputContainer}>
                {(typeof props.label == "undefined" || props.label) &&
                    <View style={CommonStyle.InfoPosition}>
                        <Text style={CommonStyle.TextInputLabel}>
                            <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text>
                        </Text>
                        {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}
                    </View>}
                <TextInput
                    testID={props.resourceKey}
                    mode={CUSTOM_CONSTANTS.MODE.OUTLINED}
                    placeholder={props.resource[RESOURCE_FIELDS.PLACEHOLDER]}
                    multiline={props.multiline ? props.multiline : !!BOOLEAN_STATUS.STATUS_FALSE}
                    numberOfLines={props.multiline ? (props.numberOfLines ? props.numberOfLines : NUMERIC_CONSTANTS.THREE) : NUMERIC_CONSTANTS.ONE}
                    value={value}
                    onChangeText={(val: any) => setValue(val)}
                    style={props.styles ? props.styles : CommonStyle.textInput}
                    editable={props.editable}
                    outlineColor={ELEMENT_STYLES.COLORS.PLACEHOLDER}
                    placeholderTextColor={ELEMENT_STYLES.COLORS.PLACEHOLDER_TEXT}
                    right={props.rightIcon ?
                        <TextInput.Icon
                            onPress={() => props.clickRightIcon()}
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.rightIcon} />}
                        /> : null}
                    left={props.leftIcon ?
                        <TextInput.Icon
                            name={() => <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.MEDIUM}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.MEDIUM}
                                xml={props.leftIcon} />}
                        /> : null}
                />
                {error !== '' && <Text style={CommonStyle.errorText} >{error}</Text>}
            </View>
            : null
    );
});
/**
 * Common Date Picker component
 * @param {*} props 
 * @returns DatePicker
 */
export const LHDatePick = React.forwardRef((props: any, ref: any) => {
    let [open, setOpen] = useState(false);
    let [error, setError] = useState('');
    let [dob, setDob] = useState('');
    let [maxDob, setMaxDob] = useState(new Date());
    let [minDob, setMinDob] = useState(new Date());

    useEffect(() => {
        let defaultDate = new Date();
        if (props.value) {
            defaultDate = new Date(props.value);
        }
        ChangeDate(defaultDate);
        let maxDate = new Date().setDate(new Date().getDate() + parseInt(props.resource[RESOURCE_FIELDS.MAX_LENGTH]));
        let stringMaxDate = moment(new Date(maxDate), CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT).format(CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT);
        setMaxDob(new Date(stringMaxDate));

        let minDate = new Date().setDate(new Date().getDate() + parseInt(props.resource[RESOURCE_FIELDS.MIN_LENGTH]));
        let stringMinDate = moment(new Date(minDate), CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT).format(CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT);
        setMinDob(new Date(stringMinDate));
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return dob;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        }
    }))

    const ChangeDate = (val: Date) => {
        setOpen(false);
        let newDate = moment(val, CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT).format(CUSTOM_CONSTANTS.DATE_FORMAT.DEFAULT).toString();
        setDob(newDate);
    }
    return (
        <View style={CommonStyle.textInputContainer}>
            <View style={CommonStyle.InfoPosition}>
                <Text style={CommonStyle.TextInputLabel}>
                    <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text>
                </Text>
                {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}

            </View>
            <TouchableOpacity
                testID={props.resourceKey}
                onPress={() => setOpen(true)}  >
                <TextInput
                    mode={CUSTOM_CONSTANTS.MODE.OUTLINED}
                    placeholder={props.resource[RESOURCE_FIELDS.VALUE]}
                    value={dob}
                    editable={false}
                    style={props.styles ? props.styles : CommonStyle.textInput}
                    outlineColor={ELEMENT_STYLES.COLORS.PLACEHOLDER}
                    placeholderTextColor={ELEMENT_STYLES.COLORS.PLACEHOLDER_TEXT}
                />
                {error !== '' && <Text style={CommonStyle.errorText}>{error}</Text>}
            </TouchableOpacity>
            <DatePicker
                modal
                mode={CUSTOM_CONSTANTS.MODE.DATE}
                open={open}
                date={dob ? new Date(dob) : new Date(maxDob)}
                onConfirm={(val: any) => ChangeDate(val)}
                onCancel={() => setOpen(false)}
                maximumDate={new Date(maxDob)}
                minimumDate={new Date(minDob)}
            />
        </View>
    );
});

/**
 * Common DropDown component
 * @param {*} props 
 * @returns DropDown
 */
export const LHDropDown = React.forwardRef((props: any, ref: any) => {
    let [error, setError] = useState('');
    let [dropdownValue, setDropdownValue] = useState('');

    useEffect(() => {
        props.value ? setDropdownValue(props.value) : setDropdownValue('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return dropdownValue;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        }
    }));

    const RenderItem = (item: any) => {
        return (
            <View style={AddEditStudentStyle.item}>
                <Text style={AddEditStudentStyle.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <View style={CommonStyle.textInputContainer}>
            <Text style={CommonStyle.TextInputLabel}>
                <Text>{props.resource[RESOURCE_FIELDS.VALUE]}</Text><Text style={CommonStyle.primaryColor}>{+props.resource[RESOURCE_FIELDS.IS_REQUIRED] > 0 ? ' *' : ''}</Text></Text>
            {props.resource[RESOURCE_FIELDS.INFO_VALUE] != 'null' && <LHInfoValue message={props.resource[RESOURCE_FIELDS.INFO_VALUE]} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} />}
            <Dropdown
                style={props.style}
                containerStyle={props.containerStyle}
                autoScroll={true}
                data={props.data}
                labelField={CUSTOM_CONSTANTS.DROPDOWN_CONSTANTS.LABEL_FIELD}
                valueField={CUSTOM_CONSTANTS.DROPDOWN_CONSTANTS.VALUE_FIELD}
                placeholder={props.resource[RESOURCE_FIELDS.VALUE]}
                placeholderStyle={CommonStyle.dropdownPlaceholder}
                selectedTextStyle={CommonStyle.selectedTextStyle}
                value={dropdownValue}
                onChange={(item: any) => {
                    setDropdownValue(item.value);
                }}
                maxHeight={CUSTOM_CONSTANTS.DROPDOWN_CONSTANTS.MAX_HEIGHT}
                dropdownPosition={CUSTOM_CONSTANTS.DROPDOWN_CONSTANTS.POSITION}
                renderItem={(item: any) => RenderItem(item)}
            />
            {error !== '' && <Text style={CommonStyle.errorText}>{error}</Text>}
        </View>
    );
});

/**
 * Common Button component
 * @param {*} props 
 * @returns Button
 */
export const LHSubmitButton = (props: any) => {
    return (
        <Pressable
            testID={props.resourceKey}
            style={props.style ? props.style : ''}
            onPress={() => props.onClick()}
            disabled={props.disabled ? props.disabled : false}>
            <LHLinearGradient
                locations={[LINEAR_GRADIENT.LOCATION.x, LINEAR_GRADIENT.LOCATION.y]}
                colors={props.colors ? props.colors : (props.disabled ? LINEAR_GRADIENT.COLORS.TERTIARY : LINEAR_GRADIENT.COLORS.PRIMARY)}
                style={CommonStyle.buttonStyle}>
                <Text style={props.disabled ? CommonStyle.disabledlabelStyle : CommonStyle.labelStyle}>{props.resource ? props.resource[RESOURCE_FIELDS.VALUE] : props.resourceKey}</Text>
            </LHLinearGradient>
        </Pressable>
    );
}

/**
 * Common Delete Button component
 * @param {*} props 
 * @returns Delete Button
 */
export const LHDeleteButton = (props: any) => {
    return (
        <Pressable
            testID={props.resourceKey}
            style={props.style ? props.style : ''}
            onPress={() => props.onClick()}
            disabled={props.disabled ? props.disabled : false}>
            <Text style={props.disabled ? CommonStyle.disabledlabelStyle : CommonStyle.deletelabelStyle}>{props.resource ? props.resource[RESOURCE_FIELDS.VALUE] : props.resourceKey}</Text>
        </Pressable>
    );
}

export const LHImagePicker = React.forwardRef((props: any, ref: any) => {
    let [error, setError] = useState('');
    let [image, setImage] = useState('');

    useEffect(() => {
        props.value ? setImage(props.value) : setImage('');
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
        GetValue() {
            return image;
        },
        ShowError(val: any) {
            setError(val);
            return error;
        }
    }));

    const openPicker = async () => {
        let options: any = {
            mediaType: 'photo',
            includeBase64: false
        };
        launchImageLibrary(options, (response: any) => {
            if (response.assets && response.assets.length >= 0) {
                let file: FileModel = {
                    name: response.assets[0].fileName,
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    size: response.assets[0].fileSize,
                    width: response.assets[0].width,
                    height: response.assets[0].height
                }
                setImage(file)
            }
        });
    }
    return (
        <View>
            {
                props.UIType == PICKER_TYPE.CIRCLE && <View style={CommonStyle.userImageContainer}>
                    <TouchableOpacity onPress={() => openPicker()} >
                        <Image source={image ? { uri: image.uri } : require('../assets/images/person-circle.png')} style={CommonStyle.userImage} />
                    </TouchableOpacity>
                    <View style={CommonStyle.attachImage}>
                        <TouchableOpacity onPress={() => openPicker()} >
                            <SvgXml
                                width={CUSTOM_CONSTANTS.SVG.WIDTH.LARGER}
                                height={CUSTOM_CONSTANTS.SVG.HEIGHT.LARGER}
                                xml={ATTCH_IMAGE_ICON} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={CommonStyle.attachImageText}>{props.resource[RESOURCE_FIELDS.VALUE]}</Text>
                    </View>
                    {error !== '' && <Text style={CommonStyle.errorText}>{error}</Text>}
                </View>
            }

            {
                props.UIType == PICKER_TYPE.RECTANGLE && <View style={CommonStyle.pickerRectangleContainer}>
                    <TouchableOpacity onPress={() => openPicker()} style={CommonStyle.flexOneContainer}>
                        <View style={CommonStyle.flexTwoContainer}>
                            <View style={CommonStyle.addImageContainer}>
                                <Text style={CommonStyle.addImageText}>+</Text>
                            </View>
                            <View style={CommonStyle.addImageLabelContainer}>
                                <Text style={{ fontSize: 18, color: '#111111' }}>{props.resource[RESOURCE_FIELDS.VALUE]}</Text>
                                <Text style={{ fontSize: 14, color: '#54565A' }}>{props.resource[RESOURCE_FIELDS.PLACEHOLDER]}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {error !== '' && <Text style={CommonStyle.errorText}>{error}</Text>}
                </View>
            }

        </View >
    )
});
