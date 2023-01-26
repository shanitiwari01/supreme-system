import React, { useState, useEffect } from 'react';
import { PAGE_ENTRY_SIZE } from '../Utils/TypesWC';
import { TextField, Select, FormControl, MenuItem, InputLabel, Checkbox } from '@material-ui/core';
import { errorLogger } from "../Services/CommonServicesWC";
import { getResourceValue } from '../Functions/CommonFunctionWC';
import { DropDown } from './CustomFieldsWC';
const PaginationWC = React.memo((props) => {

    const [goToPage, setGoToPage] = useState([]);

    useEffect(() => {

        try {

            // go to page list calc
            let totalPages = Math.ceil(props.totalCount / props.pageSize);
            let totalDropdownItem = [];
            for (let index = 1; index <= totalPages; index++) {
                totalDropdownItem.push(index)

            }
            setGoToPage(totalDropdownItem);

        } catch (error) {
            let errorObject = {
                methodName: "ownPagination/useEffect",
                errorStake: error.toString(),
            };

            errorLogger(errorObject);
        }

    }, [props.totalCount, props.pageSize,])


 

    return (
        <div className="own-paagination-wrapper d-flex flex-wrap justify-content-end align-items-center">


            <div className="show-item-page form-own mr-0 mr-md-3">
                <DropDown
                    resourceKey={'show per page'}
                    value={props.pageSize}
                    arrayList={PAGE_ENTRY_SIZE}
                    changeValue={(ev) => props.changeValue(ev)}
                />

                {/* <FormControl variant="outlined">
                    <Select
                        labelId="show_per_page"
                        id="demo-simple-select-outlined"
                        value={props.pageSize}
                        onChange={(ev) => props.changePageSize(ev)}
                        label={'Show per page'}
                        name="pageSize"
                    >
                        
                    </Select>
                </FormControl> */}

            </div>

            {props.unreadCheckbox && <div className="form-own mr-0 mr-md-3">
                <Checkbox
                    value="Unread"
                    checked={props.unreadFlag}
                    name="unread"
                    onChange={(ev) => props.checkUnread(ev)}
                />
                {getResourceValue(props.resources, "UNREAD_TICK")}
            </div>}

            <div className="flex-1 d-flex flex-wrap justify-content-end align-items-center pagination-right-wrapper mt-md-0 mt-3">

                <div className="font-16 color-grey-own pr-2">
                    <span className="showing-pagination-txt">
                        {/* {getResourceValue(props.resources, "SHOW_PAGE_TEXT_ONE")} */}
                        {'Showing'}
                        <span>
                            {(props.currentPage * props.pageSize) < props.totalCount ?
                                <span>
                                    <span className="bold-grey-txt">
                                        <span>
                                            {(props.currentPage * props.pageSize) - props.pageSize + 1} - {(props.currentPage * props.pageSize)}
                                        </span>
                                    </span>
                                </span> :

                                <>{ }<span>
                                    <span className="bold-grey-txt">
                                        <span>
                                            {(props.currentPage * props.pageSize) - props.pageSize + 1} - {props.totalCount}
                                        </span>
                                    </span>
                                </span>
                                </>}
                            {/* {getResourceValue(props.resources, "SHOW_PAGE_TEXT_TWO")}  */}
                            {" of "}
                            <span className="bold-grey-txt">
                                {props.totalCount}
                            </span>
                            {/* {getResourceValue(props.resources, "ROWS")} */}
                            {" rows "}
                        </span>
                    </span>

                </div>
                {props.pageSize < props.totalCount &&
                    <>
                        <div className="pagination-btn-wrapper">
                            <ul className="list-inline pagination-list pr-2">
                                <li className="list-inline-item prev-next-btn"><button onClick={() => props.goToPage(null, 'prev')} className="btn" disabled={props.currentPage < 2}>{getResourceValue(props.resources, "PREV")}</button></li>
                                <li className="list-inline-item prev-next-btn"><button onClick={() => props.goToPage(null, 'next')} className="btn" disabled={(props.currentPage * props.pageSize) >= props.totalCount}>{getResourceValue(props.resources, "NEXT")}</button></li></ul></div>

                        <div className="d-inline-flex flex-wrap align-items-center jump-page-wrapper">
                            <div className="jump-txt px-2 d-none d-md-inline-flex">
                                {/* {getResourceValue(props.resources, "JUMP_TO_PAGE")}  */}
                                {'Jump to page '}
                                : </div>
                            <div className="jump-to-page form-own">
                                <FormControl variant="outlined">

                                    <Select

                                        labelId="show_per_page"
                                        id="demo-simple-select-outlined"
                                        value={props.currentPage}
                                        onChange={(ev) => props.goToPage(ev, 'jump')}
                                        name="jumpToPage"
                                    >
                                        {goToPage && goToPage.length > 0 && goToPage.map((data, index) => (
                                            <MenuItem value={data} key={index}>{data}</MenuItem>

                                        ))}

                                    </Select>
                                </FormControl>

                            </div>
                        </div>
                    </>}
            </div>
        </div>

    )

})

export default PaginationWC;