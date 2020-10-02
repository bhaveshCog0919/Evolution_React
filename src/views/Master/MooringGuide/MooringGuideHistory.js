import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN, InputGroup } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import moment from 'moment';
import APIConstant from '../../../utils/constants';

class MooringGuideHistory extends Component {
    constructor() {
        super();

        let columns = [
            { field: "id", header: "Id", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "name", header: "Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "County", header: "County/Region", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "Location", header: "Location", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "location_type", header: "Location Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "Loading", header: "Loading", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "mooring_Type", header: "Mooring Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "approval_Required", header: "Approval Required", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "effective_date", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
            // { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 10 }
        ];

        this.state = {
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
            cols: columns,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            sales: [],
            sysConfigValueType: '',
            sysConfigValueTypeArr: [],
            sysConfigValueTypeError: true,

            sysConfigStatus: 'Active',
            sysConfigStatusArr: [],
            sysConfigStatusError: true,

            sysConfigValue: '',
            sysConfigValueError: true,

            sysConfigKey: '',
            sysConfigKeyError: true,

            sysConfigType: '',
            sysConfigTypeArr: [],
            sysConfigTypeError: true,

            FSysConfigType: '',
            FSysConfigTypeArr: [],

            FStatus: 'Active',
            FStatusArr: [],

            FKey: '',
            isEdit: false,

            effectivedate: 'Effective Date',
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: true,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        // this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getMooringGuideHistoryList(this.props.match.params.Id);
        }
        this.getDropDownValues('SYSCONFIGVALUETYPE', 'sysConfigValueTypeArr');
        this.getDropDownValues('RECORDSTATUS', 'sysConfigStatusArr');
        this.getDropDownValues('RECORDSTATUS', 'FStatusArr');
    }

    getDropDownValues(stringMapType, setStateName) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("getDropDownValues", res.data);
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getMooringGuideHistoryList(Id) {
        var dataToSent = {
            MooringGuidId: Id,
        }
        api.post('api/getMooringGuideHistoryList', dataToSent).then(res => {
            console.log('getMooringGuideHistoryList', res);
            var formattedArr = [];
            for (var i = 0; i < res.data.length; i++) {
                var approvalRequired = (res.data[i].IsApprovalRequired.data[0] == 1) ? ("Yes") : ("No");
                formattedArr.push({
                    id: [i + 1],
                    MooringGuideId: res.data[i].MooringGuideId,
                    name: res.data[i].MooringName,
                    Country: res.data[i].countryName,
                    County: res.data[i].Region,
                    Location: res.data[i].Location,
                    location_type: res.data[i].LocationType,
                    Loading: res.data[i].LoadingPercent.toFixed(2),
                    mooring_Type: res.data[i].MooringType,
                    approval_Required: approvalRequired,
                    effective_date: moment(res.data[i].StartDate).format(CommonConfig.dateFormat.forDatePicker),
                    CountryId: res.data[i].CountryId,
                    Longitude: res.data[i].Longitude,
                    Latitude: res.data[i].Latitude,
                    Notes: res.data[i].Notes,
                    MooringZone: res.data[i].MooringZone
                });
            }
            console.log('formattedArr',formattedArr);            
            this.setState({ sales: formattedArr })
        })
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    // actionTemplate(rowData, column) {
    //     const { t } = this.props;
    //     return <div className="text-center">
    //         <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip='Edit' style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
    //         {/* <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Edit" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button> */}
    //         {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Delete" style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} /> */}
    //     </div>;
    // }

    // edit(rowData) {
    //     console.log("rowData", rowData);
    //     this.setState({
    //         primary: true,
    //         isEdit: true,
    //         heading: 'Update',
    //         toastName: 'Updated',
    //         sysConfigType: rowData.SysConfigType,
    //         sysConfigTypeError: false,
    //         sysConfigValueType: rowData.SysValueType,
    //         sysConfigValueTypeError: false,
    //         sysConfigValue: rowData.SysValue,
    //         sysConfigValueError: false,
    //         sysConfigKey: rowData.SysKey,
    //         sysConfigKeyError: false,
    //         sysConfigStatus: rowData.Status,
    //         sysConfigStatusError: false,
    //         SysConfigId: rowData.SysConfigId,
    //         effectiveDate: moment(rowData.effectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    //         effectiveDateError: false,
    //     })
    // }

    reset = () => {
        this.setState({
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save',
            primary: false,

        })
    }

    selectType(value, type) {
        console.log("selectType", value, type);
        if (type === 'FSysConfigType') {
            if (value === '') {
                this.setState({ FSysConfigType: value });
            } else {
                this.setState({ FSysConfigType: value });
            }
        }

        if (type === 'FStatus') {
            if (value === '') {
                this.setState({ FStatus: value });
            } else {
                this.setState({ FStatus: value });
            }
        }

        if (type === 'sysConfigStatus') {
            if (value === '') {
                this.setState({ sysConfigStatus: value });
            } else {
                this.setState({ sysConfigStatus: value });
            }
        }

        if (type === 'sysConfigType') {
            if (value === '') {
                this.setState({ sysConfigTypeError: true, sysConfigType: value });
                this.show('sysConfigType', true);
            } else {
                this.setState({ sysConfigTypeError: false, sysConfigType: value });
                this.show('sysConfigType', false);
            }
        }

        if (type === 'sysConfigValueType') {
            if (value === '') {
                this.setState({ sysConfigValueTypeError: true, sysConfigValueType: value });
                this.show('sysConfigValueType', true);
            } else {
                this.setState({ sysConfigValueTypeError: false, sysConfigValueType: value });
                this.show('sysConfigValueType', false);
            }
        }
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'sysConfigKey') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ sysConfigKeyError: true });
                this.show("sysConfigKey", true);
            } else {
                this.setState({ sysConfigKeyError: false, sysConfigKey: e.target.value });
                this.show("sysConfigKey", false);
            }
        }

        if (e.target.name === 'sysConfigValue') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ sysConfigValueError: true });
                this.show("sysConfigValue", true);
            } else {
                this.setState({ sysConfigValueError: false, sysConfigValue: e.target.value, sortOrder: 10 });
                this.show("sysConfigValue", false);
            }
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    save() {
        debugger
        try {
            if (
                this.state.sysConfigTypeError === false &&
                this.state.sysConfigValueTypeError === false &&
                this.state.sysConfigValueError === false &&
                this.state.sysConfigKeyError === false &&
                this.state.effectiveDateError === false
            ) {
                var dataToSent = {
                    SysConfigType: this.state.sysConfigType,
                    SysValueType: this.state.sysConfigValueType,
                    SysValue: this.state.sysConfigValue,
                    SysKey: this.state.sysConfigKey,
                    Status: this.state.sysConfigStatus,
                    SysConfigId: this.state.SysConfigId,
                    loggedInUserId: CommonConfig.loggedInUserId(),
                    effectiveDate: this.state.effectiveDate,
                }
                console.log("rowDataSave", dataToSent);
                api.post('api/addUpdateSysConfigHistory', dataToSent).then(res => {
                    if (res.success) {
                        toast.success(res.message);
                        this.setState({ primary: false });
                        this.getSysConfigHistoryList(this.state.SysConfigId);
                    }
                }).catch(err => {
                    console.log("SaveSysConfigIN", err);
                });
            } else {
                this.show("sysConfigType", this.state.sysConfigTypeError);
                this.show("sysConfigValueType", this.state.sysConfigValueTypeError);
                this.show("sysConfigValue", this.state.sysConfigValueError);
                this.show("sysConfigKey", this.state.sysConfigKeyError);
                this.show("effectiveDate", this.state.effectiveDateError);
            }
        } catch (error) {
            console.log("SaveSysConfigOUT", error);
        }
    }

    render() {
        const { t } = this.props;
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Mooring Guide History</h1>
                </div>

                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.sales}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.sales.length}
                        exportFilename="Sys Config List"
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                </div>
                <Modal isOpen={this.state.primary} toggle={this.reset}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.reset}> {this.state.heading} Sys Config</ModalHeader>
                    <ModalBody>
                        <form className="form" action="#">

                            <Row>
                                <Col md="12" className="text-right">
                                    <span style={{ color: "red" }}>Field Indicates with * are mandatory</span>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                {(this.state.IsAdd !== 'Add New') ? (
                                    <Col md="6" className="pull-right">
                                        <div className="input-box">
                                            <label>Sys Config Type*</label>
                                            <InputGroup>
                                                <Input type="select" name="sysConfigType" id="sysConfigType" onChange={(e) => this.selectType(e.target.value, 'sysConfigType')} value={this.state.sysConfigType}>
                                                    <option value=''>Select system config type</option>
                                                    {this.state.sysConfigTypeArr.map((ct, i) => {
                                                        return (<option value={ct.value}>{ct.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback" >Please select system config type</em>
                                            </InputGroup>
                                        </div>
                                    </Col>
                                ) : (
                                        <Col md="6" className="pull-right">
                                            <div className="input-box">
                                                <label>Sys Config Type*</label>
                                                <InputGroup>
                                                    <Input type="text" name="sysConfigType" id="sysConfigType" onChange={(e) => this.selectType(e.target.value, 'sysConfigType')} value={this.state.sysConfigType}>
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter valid system config type</em>
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    )}

                                {(this.state.IsAdd === 'Add New') ? (
                                    <div style={{ marginTop: 25 }}>
                                        <a href="javascript:void(0)" onClick={() => this.AddExisting()}>
                                            Existing SysConfig Type
                                        </a>
                                    </div>
                                ) : (
                                        <div style={{ marginTop: 25 }}>
                                            <a href="javascript:void(0)" onClick={() => this.AddNew()}>
                                                New SysConfig Type
                                    </a>
                                        </div>
                                    )
                                }
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>Key*</label>
                                        <InputGroup>
                                            <Input type="text" name="sysConfigKey" id="sysConfigKey" onChange={(e) => this.handleChange(e)} value={this.state.sysConfigKey} />
                                            <em className="error invalid-feedback" >Please select system config key</em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>Value*</label>
                                        <InputGroup>
                                            <Input type="text" name="sysConfigValue" id="sysConfigValue" onChange={(e) => this.handleChange(e)} value={this.state.sysConfigValue} />
                                            <em className="error invalid-feedback" >Please enter valid system config value</em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>Value Type*</label>
                                        <InputGroup>
                                            <Input type="select" name="sysConfigValueType" id="sysConfigValueType" onChange={(e) => this.selectType(e.target.value, 'sysConfigValueType')} value={this.state.sysConfigValueType}>
                                                <option value=''>Select system config value type</option>
                                                {this.state.sysConfigValueTypeArr.map((ct, i) => {
                                                    return (<option value={ct.Description}>{ct.StringMapKey}</option>)
                                                })
                                                }
                                            </Input>
                                            <em className="error invalid-feedback" >Please select system config value type</em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            {(this.state.isEdit) ? (
                                <Row>
                                    <Col md="6">
                                        <div className="input-box">
                                            <label>Status</label>
                                            <Input type="select" name="sysConfigStatus" id="sysConfigStatus" onChange={(e) => this.selectType(e.target.value, 'sysConfigStatus')} value={this.state.sysConfigStatus}>
                                                {this.state.sysConfigStatusArr.map((ct, i) => {
                                                    return (<option value={ct.Description}>{ct.StringMapKey}</option>)
                                                })
                                                }
                                            </Input>
                                            <em className="error invalid-feedback" >Please select status</em>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                    null
                                )}

                            <Row>
                                <Col md="6">
                                    <div className="input-box">
                                        <label for="">{this.state.effectivedate}*</label>
                                        <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                            min={moment().format('YYYY-MM-DD')}
                                            max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                        >
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter valid effective date</em>
                                    </div>
                                </Col>
                            </Row>

                        </form>

                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.save()}><i class="fa fa-check"></i>{this.state.isEdit ? 'Update' : 'Add'}</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default MooringGuideHistory;