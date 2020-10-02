import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import moment from 'moment';

class StringMapHistory extends Component {
    constructor() {
        super();

        let columns = [
            { field: "StringMapType", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "StringMapKey", header: "Key", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "StringMapName", header: "Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "Description", header: "Description", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "SortOrder", header: "Sort Order", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "ParentType", header: "Parent Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "ParentName", header: "Parent Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "effectiveDate", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "Qualifier", header: "Qualifier", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "isCurrent", header: "isCurrent", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
            { field: "UpdatedOn", header: "UpdatedOn", sortable: true, filter: true, filterMatchMode: 'contains', id: 10 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 11 }
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
            // LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            LanguageId:'',
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
    }

    componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getStringMapHistory(this.props.match.params.Id);
        }
        this.getStringMapType()
    }

    getStringMapHistory(Id) {
        var dataToSent = {
            StringMapId: Id,
        }
        api.post('api/getStringMapHistoryData', dataToSent).then(res => {
            console.log("getStringMapHistory", res);
            var newArr = [];
            for (var i = 0; i < res.length; i++) {
                newArr.push({
                    stringMapId: res[i].StringMapId,
                    StringMapType: res[i].StringMapType,
                    StringMapKey: res[i].StringMapKey,
                    StringMapName: res[i].StringMapName,
                    Description: res[i].Description,
                    ExtDescription: res[i].ExtDescription,
                    SortOrder: res[i].SortOrder,
                    ParentType: res[i].ParentType,
                    ParentName: res[i].ParentName,
                    status: res[i].Status,
                    language: res[i].LanguageId,
                    ParentStringMapId: res[i].ParentStringMapId,
                    UpdatedOn: CommonConfig.isEmpty(res[i].UpdatedOn) ? '' : moment(res[i].UpdatedOn).format('DD-MM-YYYY'),
                    effectiveDate: CommonConfig.isEmpty(res[i].StartDate) ? '' : moment(res[i].StartDate).format('DD-MM-YYYY'),
                });
            }
            this.setState({ stringMapList: newArr })
        })
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    actionTemplate(rowData, column) {
        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip='Edit' style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
            {/* <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Edit" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button> */}
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Delete" style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} /> */}
        </div>;
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
            effectiveDate: '',
            effectiveDateError: true,
            status: 'Active',
            sortOrder: ''
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

    edit = (rowData) => {
        console.log("rowData", rowData);
        try {
            if (rowData.ParentStringMapId) {
                var dataToSent = {
                    ParentStringMapId: rowData.ParentStringMapId,
                }
                api.post('api/getParentTypeAndName', dataToSent).then(res => {
                    if (res.success) {
                        console.log("rowData1", res.data);
                        this.setState({
                            primary: true,
                            heading: 'Update',
                            buttonName: 'Update',
                            toastName: 'Updated',
                            stringMapId: rowData.stringMapId,
                            stringMapType: rowData.StringMapType,
                            stringMapTypeError: false,
                            stringMapKey: rowData.StringMapKey,
                            stringMapKeyError: false,
                            stringMapName: rowData.StringMapName,
                            stringMapNameError: false,
                            description: rowData.Description,
                            descriptionError: false,
                            extDescription: rowData.ExtDescription,
                            extDescriptionError: false,
                            parentStringMapType: res.data[0].StringMapType,
                            parentStringMapNameError: false,
                            status: rowData.status,
                            sortOrder: rowData.SortOrder,
                            saveRes: res.data[0],
                            effectiveDate: moment(rowData.effectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            IsAdd: 'Add Existing',
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
                    stringMapType: rowData.stringMapType,
                    stringMapTypeError: false,
                    stringMapKey: rowData.StringMapKey,
                    stringMapKeyError: false,
                    stringMapName: rowData.StringMapName,
                    stringMapNameError: false,
                    description: rowData.Description,
                    descriptionError: false,
                    extDescription: rowData.ExtDescription,
                    extDescriptionError: false,
                    parentStringMapNameError: false,
                    status: rowData.status,
                    sortOrder: rowData.sortOrder,
                    effectiveDate: moment(rowData.effectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    effectiveDateError: false,
                });
            }
        } catch (error) {
            console.log("rowData", error);
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

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
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
                this.setState({ stringMapKeyError: false, stringMapKey: e.target.value, stringMapName: e.target.value, description: e.target.value, extDescription: e.target.value, stringMapNameError: false, descriptionError: false });
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
    }

    save = () => {
        if (
            this.state.stringMapTypeError === false &&
            this.state.stringMapKeyError === false &&
            this.state.stringMapNameError === false &&
            this.state.descriptionError === false &&
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
            api.post('api/addUpdateStringMapHistory', data).then(res => {
                console.log("rowDatares", res);
                if (res.success) {
                    toast.success(res.message);
                    this.reset();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                    this.getStringMapHistory(this.state.stringMapId);
                }
            });
        } else {
            this.show("stringMapType", this.state.stringMapTypeError);
            this.show("stringMapKey", this.state.stringMapKeyError);
            this.show("stringMapName", this.state.stringMapNameError);
            this.show("description", this.state.descriptionError);
            this.show("effectiveDate", this.state.effectiveDateError);
        }
    }

    render() {
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>StringMap History</h1>
                </div>
                <div className="table-custom" style={{ marginTop: 30 }}>
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
                                        <label for="">Parent Type*</label>
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
                                        <label for="">Parent Name*</label>
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
                        <BTN color="success" onClick={() => this.save()}><i class="fa fa-check"></i>Save</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}

export default StringMapHistory;