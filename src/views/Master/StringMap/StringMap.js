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
import { relativeTimeThreshold } from 'moment';
import moment from 'moment';


class StringMap extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "stringMapType", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "stringMapKey", header: "Key", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "stringMapName", header: "Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "description", header: "Description", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "sortOrder", header: "Sort Order", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "parentType", header: "Parent Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "parentName", header: "Parent Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 7 }
        ];

        this.state = {
            Id: '',
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
            cols: columns,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

            stringMapList: [],
            stringMapTypeList: [],
            stringMapId: '',
            parentStringMapId: '',
            stringMapType: '',
            stringMapTypeError: true,
            stringMapKey: '',
            stringMapKeyError: true,
            stringMapName: '',
            stringMapNameError: true,
            stringMapNameList: [],
            description: '',
            descriptionError: true,
            extDescription: '',
            extDescriptionError: true,
            parentStringMapType: '',
            parentStringMapTypeError: true,
            parentStringMapName: '',
            parentStringMapNameError: true,
            parentstringMapId: '',
            language: "en-GB",
            LanguageArr: [],
            sortOrder: '',
            status: 'Active',
            statusArr: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
            ],
            FStringMapType: '',
            FStringMapKey: '',
            FPStringMapName: '',
            FStatus: 'Active',
            FLanguage: '',
            FDescription: '',
            IsAdd: 'Add New',
            IsParent: 'Add Parent',
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
        this.getStringMapList();
        this.getStringMapType();
        this.getLanguage();
        this.getSortOrder();
    }

    getStringMapList() {
        let data = {
            StringMapType: this.state.FStringMapType,
            Status: this.state.FStatus,
            StringMapKey: this.state.FStringMapKey,
            Description: this.state.FDescription,
            ParentStringMapId: this.state.FPStringMapName,
            LanguageId: this.state.FLanguage
        }
        api.post('api/getStringMap', data).then(res => {
            if (res.success) {
                console.log("getStringMapList", res.data);
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        stringMapId: res.data[i].StringMapId,
                        stringMapType: res.data[i].StringMapType,
                        stringMapKey: res.data[i].StringMapKey,
                        stringMapName: res.data[i].StringMapName,
                        parentStringMapId: res.data[i].ParentStringMapId,
                        description: res.data[i].Description,
                        extDescription: res.data[i].ExtDescription,
                        sortOrder: res.data[i].SortOrder,
                        status: res.data[i].Status,
                        LanguageId: res.data[i].LanguageId,
                        parentType: res.data[i].ParentType,
                        parentName: res.data[i].ParentName,
                        effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment().format('YYYY-MM-DD'),
                    });
                }
                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ stringMapList: formattedData, str: str });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getStringMapType() {
        let data = {}
        api.post('api/getStringMapType', data).then(res => {
            if (res.success) {
                console.log("getStringMapType", res.data);
                this.setState({ stringMapTypeList: res.data });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getStringMapName(value) {
        let data = {
            stringMapType: value
            // stringMapType: 'CATEGORY' 
        }
        api.post('api/getStringMapName', data).then(res => {
            if (res.success) {
                console.log("ad=d=vsd=vs=v", res.data);
                this.setState({ stringMapNameList: res.data });
                if (this.state.primary) {
                    console.log("rowData", this.state.saveRes);
                    this.setState({ parentStringMapName: this.state.saveRes.StringMapId })
                }
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getLanguage() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                if (res.success) {
                    console.log("rowData", res.data);
                    this.setState({ LanguageArr: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getSortOrder(value) {
        let Data = {
            StringMapType: value,
        }
        console.log("Data", Data);
        api.post('api/getSortOrder', Data).then(res => {
            if (res.success) {
                console.log("res", res);
                var SO = Number(res.data[0].SortOrder) + 10;
                this.setState({ sortOrder: SO });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }


    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.stringMapList.length) ? l : this.state.stringMapList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.stringMapList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    export = () => {
        this.dt.exportCSV();
    }

    openModal() {
        debugger
        console.log("rowData");
        this.setState({
            primary: true,
            effectiveDate: this.state.effectiveDate,
            effectiveDateError: false,
        })
        if (!CommonConfig.isEmpty(this.state.FStringMapType)) {
            this.getSortOrder(this.state.FStringMapType);
            this.setState({
                IsAdd: 'Add Existing',
                stringMapType: this.state.FStringMapType,
                stringMapTypeError: false,
                effectiveDate: this.state.effectiveDate,
                effectiveDateError: false,
            })
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
        try {
            if (rowData.parentStringMapId) {
                var dataToSent = {
                    ParentStringMapId: rowData.parentStringMapId,
                }
                api.post('api/getParentTypeAndName', dataToSent).then(res => {
                    if (res.success) {
                        console.log("rowData", res.data);
                        this.setState({
                            primary: true,
                            heading: 'Update',
                            buttonName: 'Update',
                            toastName: 'Updated',
                            stringMapId: rowData.stringMapId,
                            stringMapType: rowData.stringMapType,
                            stringMapTypeError: false,
                            stringMapKey: rowData.stringMapKey,
                            stringMapKeyError: false,
                            stringMapName: rowData.stringMapName,
                            stringMapNameError: false,
                            description: rowData.description,
                            descriptionError: false,
                            extDescription: rowData.extDescription,
                            extDescriptionError: false,
                            parentStringMapType: res.data[0].StringMapType,
                            parentStringMapNameError: false,
                            status: rowData.status,
                            sortOrder: rowData.sortOrder,
                            saveRes: res.data[0],
                            effectiveDate: rowData.effectiveDate,
                            effectiveDateError: false,
                        });
                        this.getStringMapName(res.data[0].StringMapType);
                    }
                })
            } else {
                this.setState({
                    primary: true,
                    heading: 'Update',
                    buttonName: 'Update',
                    toastName: 'Updated',
                    stringMapId: rowData.stringMapId,
                    language: rowData.LanguageId,
                    stringMapType: rowData.stringMapType,
                    stringMapTypeError: false,
                    stringMapKey: rowData.stringMapKey,
                    stringMapKeyError: false,
                    stringMapName: rowData.stringMapName,
                    stringMapNameError: false,
                    description: rowData.description,
                    descriptionError: false,
                    extDescription: rowData.extDescription,
                    extDescriptionError: false,
                    parentStringMapNameError: false,
                    status: rowData.status,
                    sortOrder: rowData.sortOrder,
                    effectiveDate: rowData.effectiveDate,
                    effectiveDateError: false,
                });
            }
        } catch (error) {
            console.log("rowData", error);
        }
    }

    reset = () => {
        this.setState({
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save',
            primary: false,
            stringMapId: '',
            stringMapType: '',
            stringMapTypeError: true,
            stringMapKey: '',
            stringMapKeyError: true,
            stringMapName: '',
            stringMapNameError: true,
            description: '',
            descriptionError: true,
            extDescription: '',
            extDescriptionError: true,
            parentStringMapType: '',
            parentStringMapTypeError: true,
            parentStringMapName: '',
            parentStringMapNameError: true,
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,
            status: 'Active',
            sortOrder: ''
        })
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

    AddParent() {
        this.setState({
            IsParent: 'Add Parent'
        })
    }

    RemoveParent() {
        this.setState({
            IsParent: 'Remove parent'
        })
    }

    selectType(value, type) {
        if (type === 'FStringMapType') {
            if (value === '') {
                this.setState({ FStringMapType: value });
            } else {
                this.setState({ FStringMapType: value });
            }
        }

        if (type === 'FPStringMapType') {
            if (value === '') {
                this.setState({ FPStringMapType: value });
            } else {
                this.setState({ FPStringMapType: value });
                this.getStringMapName(value);
            }
        }

        if (type === 'FPStringMapName') {
            if (value === '') {
                this.setState({ FPStringMapName: value });
            } else {
                this.setState({ FPStringMapName: value });
            }
        }

        if (type === 'FStatus') {
            if (value === '') {
                this.setState({ FStatus: value });
            } else {
                this.setState({ FStatus: value });
            }
        }

        if (type === 'FLanguage') {
            if (value === '') {
                this.setState({ FLanguage: value });
            } else {
                this.setState({ FLanguage: value });
            }
        }

        if (type === 'stringMapType') {
            if (value === '') {
                this.setState({ stringMapTypeError: true, stringMapType: value });
                this.show('stringMapType', true);
            } else {
                this.setState({ stringMapTypeError: false, stringMapType: value });
                this.show('stringMapType', false);
                this.getSortOrder(value);
            }
        }

        if (type === 'status') {
            if (value === '') {
                this.setState({ statusError: true });
                this.show('status', true);
            } else {
                this.setState({ statusError: false, status: value });
                this.show('status', false);
            }
        }

        if (type === 'parentStringMapType') {
            if (value === '') {
                this.setState({ parentStringMapTypeError: true });
                this.show('parentStringMapType', true);
            } else {
                this.setState({ parentStringMapTypeError: false, parentStringMapType: value });
                this.show('parentStringMapType', false);
                this.getStringMapName(value);
            }
        }

        if (type === 'parentStringMapName') {
            if (value === '') {
                this.setState({ parentStringMapNameError: true });
                this.show('parentStringMapName', true);
            } else {
                this.setState({ parentStringMapNameError: false, parentStringMapName: value });
                this.show('parentStringMapName', false);
            }
        }

        if (type === 'language') {
            if (value === '') {
                this.setState({ languageError: true });
                this.show('language', true);
            } else {
                this.setState({ languageError: false, language: value });
                this.show('language', false);
            }
        }
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'stringMapKey') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ stringMapKeyError: true });
                this.show("stringMapKey", true);
            } else {
                // let KeyReg = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                // let stringMapKey = e.target.value;
                // if (e.target.value.length > 50 || !KeyReg.test(stringMapKey)) {
                //     this.setState({ stringMapKeyError: true });
                //     this.show("stringMapKey", true);
                // }
                // else {
                this.setState({ stringMapKeyError: false, stringMapKey: e.target.value, stringMapName: e.target.value, description: e.target.value, extDescription: e.target.value, stringMapNameError: false, descriptionError: false, extDescriptionError: false });
                this.show("stringMapKey", false);
            }
        }
        // }

        if (e.target.name === 'stringMapType') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ stringMapTypeError: true });
                this.show("stringMapType", true);
            } else {
                this.setState({ stringMapTypeError: false, stringMapType: e.target.value, sortOrder: 10 });
                this.show("stringMapType", false);
            }
        }

        if (e.target.name === 'stringMapName') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ stringMapNameError: true });
                this.show("stringMapName", true);
            } else {
                // let NameReg = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                // let stringMapName = e.target.value;
                // if (!NameReg.test(stringMapName)) {
                //     this.setState({ stringMapNameError: true });
                //     this.show("stringMapName", true);
                // } else {
                this.setState({ stringMapNameError: false, stringMapName: e.target.value });
                this.show("stringMapName", false);
            }
            // }
        }

        if (e.target.name === 'description') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ descriptionError: true });
                this.show("description", true);
            } else {
                // let DescReg = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                // let Description = e.target.value;
                // if (!DescReg.test(Description)) {
                //     this.setState({ descriptionError: true });
                //     this.show("description", true);
                // } else {
                this.setState({ descriptionError: false, description: e.target.value });
                this.show("description", false);
            }
        }


        if (e.target.name === 'extDescription') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ extDescriptionError: true });
                this.show("extDescription", true);
            } else {
                // let ExtDescReg = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                // let ExtDesc = e.target.value;
                // if (!ExtDescReg.test(ExtDesc)) {
                //     this.setState({ extDescriptionError: true });
                //     this.show("extDescription", true);
                // } else {
                this.setState({ extDescriptionError: false, extDescription: e.target.value });
                this.show("extDescription", false);
            }
        }

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false);
            }
        }
    }

    Save = () => {debugger
        if (
            this.state.stringMapTypeError === false &&
            this.state.stringMapKeyError === false &&
            this.state.stringMapNameError === false &&
            this.state.descriptionError === false &&
            this.state.extDescriptionError === false &&
            this.state.effectiveDateError === false
        ) {
            let data = {
                stringMapId: this.state.stringMapId,
                LanguageId: this.state.language,
                stringMapKey: this.state.stringMapKey,
                stringMapType: this.state.stringMapType,
                stringMapName: this.state.stringMapName,
                ParentStringMapId: this.state.IsParent === 'Add Parent' ? this.state.parentStringMapName : '',
                description: this.state.description,
                extDescription: this.state.extDescription,
                sortOrder: this.state.sortOrder,
                status: this.state.status,
                CreatedBy: CommonConfig.loggedInUserId(),
                effectiveDate: this.state.effectiveDate,
            }
            console.log("rowData", data);
            api.post('api/addUpdateStringMap', data).then(res => {
                if (res.success) {
                    toast.success();
                    this.reset();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                    this.getStringMapList();
                }
            });
            this.reset();
        } else {
            this.show("stringMapType", this.state.stringMapTypeError);
            this.show("stringMapKey", this.state.stringMapKeyError);
            this.show("stringMapName", this.state.stringMapNameError);
            this.show("description", this.state.descriptionError);
            this.show("extDescription", this.state.extDescriptionError);
            this.show("effectiveDate", this.state.effectiveDateError);
        }
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Edit")} style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Delete" style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} /> */}
        </div>;
    }

    goToHistoryPage = (data) => {
        console.log("rowData", data);
        var Id = data.stringMapId;
        this.props.history.push({
            pathname: '/Master/StringMapHistory/' + Id,
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
                    <h1> String Map </h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltipOptions={{ position: 'bottom' }} tooltip={t("translation:labels.shoeHideColumnLabel")}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltipOptions={{ position: 'bottom' }} tooltip="Add StringMap" onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltipOptions={{ position: 'bottom' }} tooltip="Export As CSV" onClick={this.export}></Button>
                    </div>
                </div>

                <Card className="mb-0">
                    <CardHeader id="headingOne">
                        <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                            <h5 className="m-0 p-0">
                                Search String Map
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
                                                <label>StringMap Type</label>
                                                <Input type="select" name="FStringMapType" id="FStringMapType" onChange={(e) => this.selectType(e.target.value, 'FStringMapType')} value={this.state.FStringMapType}>
                                                    <option value=''>Select String Map Type</option>
                                                    {this.state.stringMapTypeList.map((ct, i) => {
                                                        return (<option value={ct.StringMapType}>{ct.StringMapType}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="vesselClassError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="3">
                                            <div className="input-box">
                                                <label>Parent Type</label>
                                                <Input type="select" name="FPStringMapType" id="FPStringMapType" onChange={(e) => this.selectType(e.target.value, 'FPStringMapType')}> value={this.state.FPStringMapType}
                                                    <option value=''>Select Parent Type</option>
                                                    {this.state.stringMapTypeList.map((ct, i) => {
                                                        return (<option value={ct.StringMapType}>{ct.StringMapType}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="3">
                                            <div className="input-box">
                                                <label>Parent Name</label>
                                                <Input type="select" name="FPStringMapName" id="FPStringMapName" onChange={(e) => this.selectType(e.target.value, 'FPStringMapName')}> value={this.state.FPStringMapName}
                                                    <option value=''>Select Parent Name</option>
                                                    {this.state.stringMapNameList.map((ct, i) => {
                                                        return (<option value={ct.StringMapId}>{ct.StringMapName}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="3">
                                            <div className="input-box">
                                                <label for="rate1">Key</label>
                                                <Input type="text" name="FStringMapKey" id="FStringMapKey" onChange={(e) => this.handleChange(e)} value={this.state.FStringMapKey}>
                                                </Input>
                                                <em id="" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="3">
                                            <div className="input-box">
                                                <label for="">Description</label>
                                                <Input type="text" name="FDescription" id="FDescription" onChange={(e) => this.handleChange(e)} value={this.state.FDescription}>
                                                </Input>
                                                <em id="vesselClassError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="3">
                                            <div className="input-box">
                                                <label>Status</label>
                                                <Input type="select" name="FStatus" id="FStatus" onChange={(e) => this.selectType(e.target.value, 'FStatus')} value={this.state.FStatus}>
                                                    {this.state.statusArr.map((ct, i) => {
                                                        return (<option value={ct.label}>{ct.value}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="3">
                                            <div className="input-box">
                                                <label>Language</label>
                                                <Input type="select" name="FLanguage" id="FLanguage" onChange={(e) => this.selectType(e.target.value, 'FLanguage')} value={this.state.FLanguage}>
                                                    <option value=''>Select Language</option>
                                                    {this.state.LanguageArr.map((ct, i) => {
                                                        return (<option value={ct.LanguageId}>{ct.Language}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="1">
                                            <BTN color="success" style={{ marginTop: "20px", marginRight: '.5em', borderRadius: "20px" }}
                                                tooltipOptions={{ position: 'bottom' }} tooltip="Go" onClick={() => this.getStringMapList()}
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
                        value={this.state.stringMapList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.stringMapList.length}
                        exportFilename="StringMap List"
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
                    <ModalHeader toggle={this.reset}> {this.state.heading} StringMap</ModalHeader>
                    <ModalBody>

                        {(this.state.IsAdd === 'Add New') ?
                            <Row>
                                <Col md="6">

                                    <div className="input-box">
                                        <label>Language</label>
                                        <Input type="select" name="language" id="language" onChange={(e) => this.selectType(e.target.value, 'language')} value={this.state.language}>
                                            <option value=''>Select language</option>
                                            {this.state.LanguageArr.map((ct, i) => {
                                                return (<option value={ct.LanguageId}>{ct.Language}</option>)
                                            })
                                            }
                                        </Input>
                                        <em id="" className="error invalid-feedback"></em>
                                    </div>
                                </Col>
                            </Row> : null
                        }

                        <Row>
                            <Col md="6">
                                {(this.state.IsAdd !== 'Add New') ? (
                                    <div className="input-box">
                                        <label for="type">Type*</label>
                                        <Input type="select" name="stringMapType" id="stringMapType" onChange={(e) => this.selectType(e.target.value, 'stringMapType')} value={this.state.stringMapType}>
                                            <option value=''>Select Type</option>
                                            {this.state.stringMapTypeList.map((ct, i) => {
                                                return (<option value={ct.StringMapType}>{ct.StringMapType}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback" >Please select type</em>
                                    </div>
                                ) : (
                                        <div className="input-box">
                                            <label for="">Type*</label>
                                            <Input type="text" name="stringMapType" id="stringMapType" onChange={(e) => this.handleChange(e)} value={this.state.stringMapType}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please enter valid type</em>
                                        </div>
                                    )
                                }
                            </Col>

                            {(this.state.IsAdd === 'Add New') ? (
                                <div style={{ marginTop: 25 }}>
                                    <a href="javascript:void(0)" onClick={() => this.AddExisting()}>
                                        Existing StringMap Type
                                        </a>
                                </div>
                            ) : (
                                    <div style={{ marginTop: 25 }}>
                                        <a href="javascript:void(0)" onClick={() => this.AddNew()}>
                                            New StringMap Type
                                    </a>
                                    </div>
                                )
                            }
                        </Row>

                        <Row>
                            <Col md="6">
                                <div className="input-box">
                                    <label for="">Key*</label>
                                    <Input type="text" name="stringMapKey" id="stringMapKey" onChange={(e) => this.handleChange(e)} value={this.state.stringMapKey}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid key</em>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6">
                                <div className="input-box">
                                    <label for="">Name*</label>
                                    <Input type="text" name="stringMapName" id="stringMapName" onChange={(e) => this.handleChange(e)} value={this.state.stringMapName}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid name</em>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6">
                                <div className="input-box">
                                    <label for="">Description*</label>
                                    <Input type="text" name="description" id="description" onChange={(e) => this.handleChange(e)} value={this.state.description}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid description </em>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6">
                                <div className="input-box">
                                    <label for="">Extended Description*</label>
                                    <Input type="text" name="extDescription" id="extDescription" onChange={(e) => this.handleChange(e)} value={this.state.extDescription}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter extended description</em>
                                </div>
                            </Col>

                            {(this.state.IsParent !== 'Add Parent') ?
                                <div style={{ marginTop: 25 }}>
                                    <a href="javascript:void(0)" onClick={() => this.AddParent()}>
                                        Add Parent
                                </a>
                                </div>
                                // <BTN color="primary" onClick={() => this.AddParent()}><i class="fa fa-plus"></i> Add Parent</BTN>
                                : null
                            }

                        </Row>

                        {(this.state.IsParent === 'Add Parent') ?
                            <Row>
                                <Col md="6">
                                    <div className="input-box">
                                        <label for="">Parent Type</label>
                                        <Input type="select" name="parentStringMapType" id="parentStringMapType" onChange={(e) => this.selectType(e.target.value, 'parentStringMapType')} value={this.state.parentStringMapType}>
                                            <option value=''>Select Type</option>
                                            {this.state.stringMapTypeList.map((ct, i) => {
                                                return (<option value={ct.StringMapType}>{ct.StringMapType}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter parent type</em>
                                    </div>
                                </Col>
                            </Row> : null
                        }

                        {(this.state.IsParent === 'Add Parent') ?
                            <Row>
                                <Col md="6">
                                    <div className="input-box">
                                        <label for="">Parent Name</label>
                                        <Input type="select" name="parentStringMapName" id="parentStringMapName" onChange={(e) => this.selectType(e.target.value, 'parentStringMapName')} value={this.state.parentStringMapName}>
                                            <option value=''>Select Name</option>
                                            {this.state.stringMapNameList.map((ct, i) => {
                                                return (<option value={ct.StringMapId}>{ct.StringMapName}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter parent Name</em>
                                    </div>
                                </Col>

                                {/* {(this.state.IsParent === 'Add Parent') ? */}
                                <div style={{ marginTop: 25 }}>
                                    <a href="javascript:void(0)" onClick={() => this.RemoveParent()}>
                                        Remove Parent
                                </a>
                                </div>
                                {/* <BTN color="primary" onClick={() => this.RemoveParent()}><i class="fa fa-minus"></i> Remove Parent</BTN> */}

                            </Row> : null
                        }

                        <Row>
                            <Col md="6">
                                <div className="input-box">
                                    <label for="">Status*</label>
                                    <Input type="select" name="status" id="status" onChange={(e) => this.selectType(e.target.value, 'status')} value={this.state.status}>
                                        {this.state.statusArr.map((ct, i) => {
                                            return (<option value={ct.label} selected={ct.label === 'Active' ? true : false}>{ct.value}</option>)
                                        })
                                        }
                                    </Input>
                                    <em className="error invalid-feedback" >Please select status</em>
                                </div>
                            </Col>
                        </Row>

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


                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.Save()}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                    </ModalFooter>
                </Modal>

            </div >
        );
    }
}

export default withTranslation()(StringMap);
