import React, { useState } from "react";
import {
    TextField,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    Checkbox,
    RadioGroup,
    FormControlLabel,
    Radio,

} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePicker from "react-datepicker";

/**
 * Common TextField component
 * 
 * @param {*} props 
 * @returns TextField
 */
export const TextBox = (props) => {
    const [focus, setFocused] = useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);


    return (
        <TextField
            onFocus={onFocus}
            onBlur={onBlur}

            // uncomment after language changes
            // label={getResourceValue(props.resources, props.resourceKey)}
            // placeholder={getResourceValue(props.resources, props.resourceKey)}

            label={props.resourceKey}
            placeholder={props.resourceKey}
            
            margin="normal"
            variant="outlined"
            name={props.resourceKey}
            onChange={(ev) => { props.changeValue(ev); }}
            value={props.value}
            type={props.type == "date" ? (props.type == "date" && focus ? "date" : props.resourceKey) : props.type}
            defaultChecked={props.checked ? props.checked : ''}
            className={props.type == "checkbox" ? '' : 'mt-0 mb-0 d-flex'}

        />
    );
}

/**
 * Common DatePicker component
 * 
 * @param {*} props 
 * @returns DatePicker
 */
export const DateTextBox = (props) => {
    return (
        <>
            <div className={'own-custom-label active'}>
                {/* {getResourceValue(props.resources, props.resourceKey)} */}
                {props.resourceKey}
            </div>
            <DatePicker
                // placeholderText={getResourceValue(props.resources, props.resourceKey)}
                placeholderText={props.resourceKey}
                // selected={props.startDate ? new Date(props.startDate) : new Date().setFullYear(new Date().getFullYear() - 16)}
                selected={props.startDate}
                onChange={props.dateChange}
                onClickOutside={props.datePickerValue}
                maxDate={new Date()}
                scrollableYearDropdown={true}
                yearDropdownItemNumber={100}
                popperPlacement="top"
                popperModifiers={{
                    flip: {
                        behavior: ["top"]
                    },
                    preventOverflow: {
                        enabled: false
                    },
                    hide: {
                        enabled: false
                    }
                }}
                autoComplete="off"
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                showMonthDropdown
                className={'mt-0 mb-0 d-flex'}
                onChangeRaw={(ev) => ev.preventDefault()}
                name={props.resourceKey}
            />

        </>

    );
}

/**
 * Common search component
 * 
 * @param {*} props 
 * @returns Search TextField
 */
export const DropDownSearch = (props) => {
    return (
        <FormControl variant="outlined">
            <Autocomplete
                freeSolo
                id={props.resourceKey + "-select"}
                disableClearable

                options={props.arrayList.map((option) => option.name)}
                // onChange={(_, newValue) => {
                //     this.setState({ title: newValue })
                // }}
                value={props.value}
                renderInput={(params) => (
                    params.InputProps.className = '',
                    <TextField
                        {...params}
                        // label={getResourceValue(props.resources, props.resourceKey)}
                        // label={props.resourceKey}
                        value={props.value}
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                        // name={getResourceValue(props.resources, props.resourceKey)}
                        name={props.resourceKey}
                        onChange={(ev) => props.changeValue(ev)}
                        className={'mt-0 mb-0 d-flex'}
                    />
                )}
            />
        </FormControl>

    );
}

/**
 * Common dropdown component
 * 
 * @param {*} props 
 * @returns Select
 */
export const DropDown = (props) => {
    return (
        <FormControl variant="outlined">
            <InputLabel id={props.resourceKey + "-label"}>
                {/* {getResourceValue(props.resources, props.resourceKey)} */}
                {props.resourceKey}
            </InputLabel>
            <Select
                enableSearch
                labelId={props.resourceKey + "-label"}
                id={props.resourceKey + "-select"}
                // label={getResourceValue(props.resources, props.resourceKey)}
                label={props.resourceKey}
                className={'mt-0 mb-0 d-flex'}
                name={props.resourceKey}
                value={props.value}
                onChange={(ev) => props.changeValue(ev)}
            >
            
                {props.arrayList && props.arrayList.length > 0 && props.arrayList.map((item, index) => (
                    <MenuItem value={item.value?item.value:item.name} key={index}>
                        {item.value?item.value:item.name}
                    </MenuItem>
                ))}
            </Select>

        </FormControl>

    );
}

/**
 * Common Checkbox component
 * 
 * @param {*} props 
 * @returns Checkbox
 */
export const InputCheckbox = (props) => {
    return (
        <Checkbox
            checked={props.checked}
            onChange={props.changeValue}
        />
    );
}

/**
 * 
 * Common radio input component
 * 
 * @param {*} props 
 * @returns 
 */
export const RadioInput = (props) => {
    return (
        <RadioGroup name="category" className="row px-2 flex-row">

            {props.parentCategory && props.parentCategory.length > 0 && props.parentCategory.map(category => (
                <div className="col-md-4 col-12 px-2" key={category.parent_category_id}>
                    <FormControlLabel value={`${category.parent_category_id}`} control={
                        <Radio
                            onChange={(ev) => props.changeValue(ev, 'emptyCategory')}
                            checked={`${category.parent_category_id}` === props.category} />
                    }
                        label={category.parent_category_name} />

                </div>
            ))}


        </RadioGroup>
    );
}

/**
 * Common button component
 * 
 * @param {*} props 
 * @returns button
 */
export const SubmitButton = (props) => {
    return (
        <button type={props.type} className="btn btn-own btn-own-primary min-height-btn">
            {/* {getResourceValue(props.resources, props.resourceKey)} */}
            {props.resourceKey}
        </button>
    );
}

export default null;