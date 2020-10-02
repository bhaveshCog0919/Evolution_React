import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN, Card, CardHeader, CardBody, Collapse, Form } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { CommonConfig } from '../../../utils/constants';
import { apiBase } from '../../../utils/config';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { registerHelper } from 'codemirror';
import moment from 'moment';


class SysConfig extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "SysConfigType", header: "Sys Config Params Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "SysKey", header: "Key", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "SysValue", header: "Value", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "SysValueType", header: "Value Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 4 }
        ];


        this.state = {
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            custom: false,
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
        this.actionTemplate = this.actionTemplate.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }


    componentDidMount() {
        this.getSysConfigList();
        this.getSysConfigType();
        // this.getDropDownValues('SYSCONFIGTYPE', 'sysConfigTypeArr');
        this.getDropDownValues('SYSCONFIGVALUETYPE', 'sysConfigValueTypeArr', 'StringMapName');
        this.getDropDownValues('RECORDSTATUS', 'sysConfigStatusArr','SortOrder');
        this.getDropDownValues('RECORDSTATUS', 'FStatusArr','SortOrder');
        // this.getDropDownValues('SYSCONFIGTYPE', 'FSysConfigTypeArr');
    }

    getSysConfigType() {
        api.post('api/getSysConfigType').then(res => {
            var newArr = [];
            for (var i = 0; i < res.length; i++) {
                newArr.push({
                    value: res[i].SysConfigType,
                    label: res[i].SysConfigType,
                });
            }
            this.setState({ sysConfigTypeArr: newArr, FSysConfigTypeArr: newArr })
        })
    }

    getSysConfigList() {
        try {
            var data = {
                FSysConfigType: this.state.FSysConfigType,
                FStatus: this.state.FStatus,
                FKey: this.state.FKey,
            }
            api.post('api/getSysConfigList', data).then(res => {
                console.log("getSysConfigListErr", res);
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            SysConfigId: res.data[i].SysConfigId,
                            SysConfigType: res.data[i].SysConfigType,
                            SysKey: res.data[i].SysKey,
                            SysValue: res.data[i].SysValue,
                            SysValueType: res.data[i].SysValueType,
                            Status: res.data[i].Status,
                            effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment().format('YYYY-MM-DD'),
                        });
                    }
                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ sales: formattedData, str: str });
                }
            });
        } catch (error) {
            console.log("getSysConfigListErr", error);
        }
    }

    getDropDownValues(stringMapType, setStateName, sortOrder) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: sortOrder
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

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.sales.length) ? l : this.state.sales.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.sales.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    export = () => {
        this.dt.exportCSV();
    }

    openModal() {
        debugger
        this.setState({
            primary: true,
            effectiveDate: moment(this.state.effectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            effectiveDateError: false,
            sysConfigStatus: 'Active',
        });
        if (!CommonConfig.isEmpty(this.state.FSysConfigType)) {
            this.setState({
                IsAdd: 'Add Existing',
                sysConfigType: this.state.FSysConfigType,
                sysConfigTypeError: false,
                effectiveDate: moment(this.state.effectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                effectiveDateError: false,
                sysConfigStatus: 'Active',
            })
        }
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

    edit = (rowData) => {
        console.log("rowData", rowData);
        this.setState({
            primary: true,
            heading: 'Update',
            buttonName: 'Update',
            toastName: 'Updated',
            isEdit: true,
            sysConfigType: rowData.SysConfigType,
            sysConfigTypeError: false,
            sysConfigValueType: rowData.SysValueType,
            sysConfigValueTypeError: false,
            sysConfigValue: rowData.SysValue,
            sysConfigValueError: false,
            sysConfigKey: rowData.SysKey,
            sysConfigKeyError: false,
            sysConfigStatus: rowData.Status,
            sysConfigStatusError: false,
            SysConfigId: rowData.SysConfigId,
            effectiveDate: rowData.effectiveDate,
            effectiveDateError: false,
        })
    }

    reset = () => {
        this.setState({
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save',
            primary: false,

        })
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Edit")} style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Delete" style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} /> */}
        </div>;
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
                api.post('api/addUpdateSysConfig', dataToSent).then(res => {
                    if (res.success) {
                        console.log("SaveSysConfig", res.data);
                        toast.success(res.data.message);
                        this.setState({ primary: false });
                        this.getSysConfigList();
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

    AddNew() {
        this.setState({
            IsAdd: 'Add New'
        })
    }

    AddExisting() {
        this.setState({
            IsAdd: 'Add Existing'
        })
    }

    goToHistoryPage = (data) => {
        console.log("rowData", data);
        var Id = data.SysConfigId;
        this.props.history.push({
            pathname: '/Master/SysConfigHistory/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    render() {

        const { t } = this.props;

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <div className="basic-header">
                        <h1> Sys Config Params</h1>
                    </div>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltipOptions={{ position: 'bottom' }} tooltip={t("translation:labels.shoeHideColumnLabel")}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltipOptions={{ position: 'bottom' }} tooltip="Add SysConfig" onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltipOptions={{ position: 'bottom' }} tooltip="Export As CSV" onClick={this.export}></Button>
                    </div>
                </div>

                <Card className="mb-0">
                    <CardHeader id="headingOne">
                        <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                            <h5 className="m-0 p-0">
                                Search Sys Config Params
                                <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                            </h5>
                        </BTN>
                    </CardHeader>
                    <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                            <Form onSubmit={e => e.preventDefault()}>
                                <div className="rc-inline">
                                    <Row>
                                        <Col md="3">
                                            <div className="input-box">
                                                <label>Sys Config Params Type</label>
                                                <Input type="select" name="FSysConfigType" id="FSysConfigType" onChange={(e) => this.selectType(e.target.value, 'FSysConfigType')} value={this.state.FSysConfigType}>
                                                    <option value=''>Select config type</option>
                                                    {this.state.FSysConfigTypeArr.map((ct, i) => {
                                                        return (<option value={ct.value}>{ct.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="FSysConfigTypeError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="3">
                                            <div className="input-box">
                                                <label for="">Key</label>
                                                <Input type="text" name="FKey" id="FKey" onChange={(e) => this.handleChange(e)} value={this.state.FKey}>
                                                </Input>
                                                <em id="FKeyError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="2">
                                            <div className="input-box">
                                                <label>Status</label>
                                                <Input type="select" name="FStatus" id="FStatus" onChange={(e) => this.selectType(e.target.value, 'FStatus')} value={this.state.FStatus}>
                                                    {this.state.FStatusArr.map((ct, i) => {
                                                        return (<option value={ct.Description}>{ct.StringMapKey}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="FStatusError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="1">
                                            <BTN color="success" style={{ marginTop: "20px", marginRight: '.5em', borderRadius: "20px" }}
                                                tooltipOptions={{ position: 'bottom' }} tooltip="Go" onClick={() => this.getSysConfigList()}
                                            >
                                                Go
                            </BTN>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </CardBody>
                    </Collapse>
                </Card>

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
                    <ModalHeader toggle={this.reset}> {this.state.heading} Sys Config Params</ModalHeader>
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
                                            <label>Sys Config Params Type*</label>
                                            <InputGroup>
                                                <Input type="select" name="sysConfigType" id="sysConfigType" onChange={(e) => this.selectType(e.target.value, 'sysConfigType')} value={this.state.sysConfigType}>
                                                    <option value=''>Select Config Type</option>
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
                                                <option value=''>Select Value Type</option>
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
                        <BTN color="success" onClick={() => this.save()}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default withTranslation()(SysConfig);