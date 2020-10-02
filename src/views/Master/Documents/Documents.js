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
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { CommonConfig } from '../../../utils/constants';
import { apiBase } from '../../../utils/config';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { registerHelper } from 'codemirror';
import moment from 'moment';
import CKEditor from 'ckeditor4-react';


class Documents extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "templateType", header: "Template Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "tamplateName", header: "Template Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "docLang", header: "Language", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "processTypeName", header: "Process Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "departmentName", header: "Department", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "isThirdParty", header: "Third Party", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "fileName", header: "File Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "templateCategoryName", header: "Template Category", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 8 }
        ];

        this.state = {
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
            cols: columns,
            MasterDocumentsArray: [],
            departmentList: [],
            documentListType: [],
            languageList: [],
            countryList: [],
            templateTypeList: [],
            templateCategoryList: [],
            dynamicFieldList: [],
            MessageTemplateId: "",
            templateType: 'Document',
            showDocumentData: true,
            tamplateName: "",
            docLang: "",
            processType: "",
            department: "",
            isThirdParty: "No",
            fileName: "",
            templateCategory: "",
            templateMessage: "",
            toggleModal: false,
            tamplateNameError: true,
            departmentError: true,
            docLangError: true,
            processTypeError: true,
            fileNameError: true,
            templateCategoryError: true,
            templateMessageError: true,
            showEmailSubject: false,
            subject: "",
            subjectError: false,
            dynamicFieldForSubject:"",

        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.handleDetailsChange = this.handleDetailsChange.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getMasterDocumentsData();
        this.getLanguageData();
        this.getDropDownValues('POLICYDEPARTMENT', 'departmentList', 'StringMapName');
        this.getDropDownValues('GENERATEDOCUMENTPROCESS', 'documentListType', 'SortOrder');
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
        this.getDropDownValues('DOCUMENTTEMPLATETYPE', 'templateTypeList', 'SortOrder');
        this.getDropDownValues('DOCUMENTTEMPLATECATEGORY', 'templateCategoryList', 'SortOrder');
        this.getDropDownValues('MAILMERGEFIELD', 'dynamicFieldList', 'SortOrder');
    }

    getLanguageData() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                if (res.success) {
                    this.setState({ languageList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getMasterDocumentsData() {
        api.post('api/getMasterDocumentsData').then(res => {
            console.log("getMasterDocumentsData", res);
            this.setState({
                MasterDocumentsArray: res.map((obj) => {
                    return {
                        MessageTemplateId: obj.MessageTemplateId,
                        templateType: obj.TemplateType,
                        tamplateName: obj.TamplateName,
                        docLang: obj.DocLang,
                        processType: obj.ProcessType,
                        processTypeName: obj.ProcessTypeName,
                        department: obj.Department,
                        departmentName: obj.DepartmentName,
                        isThirdParty: (obj.IsThirdParty.data[0] == 0) ? "No" : "Yes",
                        fileName: obj.FileName,
                        templateCategory: obj.TemplateCategory,
                        templateCategoryName: obj.TemplateCategoryName,
                        templateMessage: obj.TemplateMessage,
                        tamplateNameError: false,
                        departmentError: false,
                        docLangError: false,
                        processTypeError: false,
                        fileNameError: false,
                        templateCategoryError: false,
                        templateMessageError: false,
                    }
                }),
            })
        })
    }

    getDropDownValues(stringMapType, setStateName, orderBy) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderBy
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
                console.log("errrr", err);
            });
        } catch (error) {
            console.log("asfsdg", error);
        }
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.MasterDocumentsArray.length) ? l : this.state.MasterDocumentsArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.MasterDocumentsArray.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    export = () => {
        this.dt.exportCSV();
    }

    selectType(value, type) {

        if (type === 'processType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ processTypeError: true, processType: value });
                this.show("processType", true, "processTypeError", "Please Select Process Type");
            } else {
                this.setState({ processTypeError: false, processType: value });
                this.show('processType', false, "processTypeError", "");
            }
        }

        if (type === 'department') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ departmentError: true, department: value });
                this.show("department", true, "departmentError", "Please Select Process Type");
            } else {
                this.setState({ departmentError: false, department: value });
                this.show('department', false, "departmentError", "");
            }
        }

        if (type === 'docLang') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ docLangError: true, docLang: value });
                this.show("docLang", true, "docLangError", "Please Select Process Type");
            } else {
                this.setState({ docLangError: false, docLang: value });
                this.show('docLang', false, "docLangError", "");
            }
        }

        if (type === 'templateCategory') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ templateCategoryError: true, templateCategory: value });
                this.show("templateCategory", true, "templateCategoryError", "Please Select Template Category");
            } else {
                this.setState({ templateCategoryError: false, templateCategory: value });
                this.show('templateCategory', false, "templateCategoryError", "");
            }
        }

        if (type === 'dynamicField') {
            var messageData = this.state.templateMessage + " " + value;
            this.setState({ templateMessage: messageData, dynamicField: "" });
        }

        if(type === 'dynamicFieldForSubject'){
            var subjectData = this.state.subject + " " + value;
            this.setState({subject: subjectData, dynamicFieldForSubject : ""}); 
        }

    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'isThirdParty') {
            if (e.target.checked) {
                this.setState({ isThirdParty: e.target.checked, isThirdPartyError: false });
            } else {
                this.setState({ isThirdParty: e.target.checked, isThirdPartyError: true });
            }
        }

        if (e.target.name === 'fileName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ fileNameError: true, fileName: e.target.value });
                this.show("fileName", true, "fileNameError", "Please Enter FileName");
            } else {
                this.setState({ fileNameError: false, fileName: e.target.value });
                this.show('fileName', false, "fileNameError", "");
            }
        }

        if (e.target.name === 'tamplateName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ tamplateNameError: true, tamplateName: e.target.value });
                this.show("tamplateName", true, "tamplateNameError", "Please Enter Template Name");
            } else {
                
                this.setState({ tamplateNameError: false, tamplateName: e.target.value });
                this.show('tamplateName', false, "tamplateNameError", "");
            }
        }

        if(e.target.name === 'subject'){
            let val = e.target.value;
            if(CommonConfig.isEmpty(val)){
                this.setState({subjectError : true , subject: val});
                this.show("subject", true , "subjectError", "Please Enter Subject");
            } else {
                this.setState({subjectError: false , subject: val});
                this.show('subject', false ,"subjectError" , "");
            }
        }
    }

    handleDetailsChange(evt) {

        const data = evt.editor.getData();
        if (CommonConfig.isEmpty(data)) {
            this.setState({ templateMessageError: true, templateMessage: '' });
            // this.show("customEndorsementDetails", true);
        } else {
            this.setState({ templateMessageError: false, templateMessage: data });
            // this.show("customEndorsementDetails", false);
        }
    }

    show(field, condition, errorField, message) {
        if (condition) {
            if (document.getElementById(field))
                document.getElementById(field).className = "form-control is-invalid";

            if (document.getElementById(errorField))
                document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
        } else {
            if (document.getElementById(field))
                document.getElementById(field).className = "form-control";

            if (document.getElementById(errorField))
                document.getElementById(errorField).innerHTML = null;
        }
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Edit")} style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip="Delete" style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} />
        </div>;
    }

    openDeleteModal = (rowData) => {
        debugger;
        this.setState({
            toggleModal: !this.state.toggleModal,
            MessageTemplateId: rowData.MessageTemplateId,
            templateType: rowData.templateType,
            tamplateName: rowData.tamplateName,
            department: rowData.department,
            departmentName: rowData.departmentName,
            isThirdParty: rowData.isThirdParty,
            docLang: rowData.docLang,
            fileName: rowData.fileName,
            processType: rowData.processType,
            processTypeName: rowData.processTypeName,
            templateCategory: rowData.templateCategory,
            templateCategoryName: rowData.templateCategoryName,
            templateMessage: rowData.templateMessage,
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
        });
        this.reset();
    }

    addDocumentTemplate() {
        this.setState({
            MessageTemplateId: "",
            templateType: 'Document',
            showDocumentData: true,
            showEmailSubject:false,
            tamplateName: "",
            docLang: "",
            processType: "",
            department: "",
            isThirdParty: false,
            fileName: "",
            templateCategory: "",
            templateMessage: "",
            primary: true,
        })
    }

    edit(data) {
        this.setState({
            MessageTemplateId: data.MessageTemplateId,
            templateType: data.templateType,
            tamplateName: data.tamplateName,
            department: data.department,
            isThirdParty: data.isThirdParty == "No" ? false : true,
            docLang: data.docLang,
            fileName: data.fileName,
            processType: data.processType,
            templateCategory: data.templateCategory,
            templateMessage: data.templateMessage,
            primary: true,
            showDocumentData: (data.templateType == 'Document' ? true : false),
            showEmailSubject: (data.templateType == 'Email' ? true : false)
        })
    }

    save() {

        var data = this.state.MasterDocumentsArray.filter(x => x.tamplateName == this.state.tamplateName);
        console.log("data.....", data);
        if(data.length){
            this.setState({ tamplateNameError: true });
            this.show("tamplateName", true, "tamplateNameError", " Template Name Already Exist Please Enter another name");
            toast.error("Template Name Already Exist Please Enter another name");
        }             
        if (this.state.tamplateNameError) {
            toast.error("Please enter template name");
        } else if (this.state.docLangError) {
            toast.error("Please select language");
        } else if (this.state.processTypeError && this.state.templateType == 'Document') {
            toast.error("Please select process type");
        } else if (this.state.departmentError && this.state.templateType == 'Document') {
            toast.error("Please select department");
        } else if (this.state.fileNameError && this.state.templateType == 'Document') {
            toast.error("Please enter file name");
        }
        //  else if (this.state.templateCategoryError) {
        //     toast.error("Please select template category");
        // }
         else if (this.state.templateMessageError) {
            toast.error("Please enter template message");
        }else if( this.state.subjectError){
            toast.error("Please enter Email Subject ")
        }else {
            console.log(this.state);
            var dataToSent = {
                MessageTemplateId: this.state.MessageTemplateId ? this.state.MessageTemplateId : "",
                TemplateType: this.state.templateType,
                Department: this.state.department,
                TamplateName: this.state.tamplateName,
                IsThirdParty: this.state.isThirdParty,
                DocLang: this.state.docLang,
                FileName: this.state.fileName,
                EmailSubject: this.state.subject,
                ProcessType: this.state.processType,
                TemplateMessage: this.state.templateMessage,
                TemplateCategory: this.state.templateCategory,
                loggedInUserId: CommonConfig.loggedInUserId(),
            }
            console.log(dataToSent);
            api.post('api/addUpdateMasterDocument', dataToSent).then(res => {
                if (res.success) {
                    console.log("SaveSysConfig", res.data);
                    toast.success(res.message);
                    this.setState({ primary: false });
                    this.getMasterDocumentsData();
                }
            }).catch(err => {
                console.log("SaveSysConfigIN", err);
            });
        }
    }

    reset = () => {
        this.setState({
            MessageTemplateId: "",
            templateType: 'Document',
            showDocumentData: true,
            showEmailSubject: false,
            tamplateName: "",
            docLang: "",
            processType: "",
            department: "",
            isThirdParty: false,
            fileName: "",
            subject:"",
            templateCategory: "",
            templateMessage: "",
            primary: false,
        })
    }

    selectTemplateType(templateType) {
        this.setState({templateMessage: ''});
        if (templateType == 'Document') {
            this.setState({ showDocumentData: true , showEmailSubject: false });
        } else if(templateType == 'Email'){
            this.setState({ showEmailSubject:true , showDocumentData: false});
        }
        else{
            this.setState({ showDocumentData: false , showEmailSubject: false });
        }
        this.setState({ templateType: templateType });
    }

    deleteTemplate() {
        let data = {
            "MessageTemplateId": this.state.MessageTemplateId,
            "UserId": CommonConfig.loggedInUserId(),
            "Status": "Inactive",
            "loggedInUserId": CommonConfig.loggedInUserId(),
        }
        api.post('api/deleteTemplate', data).then(res => {
            if (res.success) {
                toast.success("Template successfully deleted");
                this.toggleLarge();
                this.getMasterDocumentsData();
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {

        console.log("this.state", this.state.docLang);


        const { t } = this.props;

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1> Documents </h1>

                    <div className="header-right-option">

                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Document Template" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addDocumentTemplate()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.MasterDocumentsArray}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.MasterDocumentsArray.length}
                        exportFilename="Document Template List"
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
                    className={'modal-lg modal-primary ' + this.props.className} style={{ maxWidth: "1000px" }}>
                    <ModalHeader toggle={this.reset}> {this.state.heading} Document Template </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="2">
                                <label>Template Type</label>
                            </Col>
                            <Col md="10">
                                {this.state.templateTypeList.map((ct, i) => {
                                    return (
                                        <div className="rc-inline" style={{ display: "initial" }}>
                                            <label>
                                                <Input type="radio" name="Document" checked={this.state.templateType === ct.StringMapName}
                                                    value={ct.StringMapName} onChange={(e) => this.selectTemplateType(ct.StringMapName)} /> {ct.StringMapName}
                                            </label>
                                        </div>
                                    )
                                })
                                }
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                            <Col md="2">
                                <label>Name</label>
                            </Col>
                            <Col md="4">
                                <Input type="text" name="tamplateName" id="tamplateName"
                                    placeholder="Enter File Template Name"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.tamplateName}
                                />
                                <em id="tamplateNameError" className="error invalid-feedback"></em>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                            <Col md="2">
                                <label>Language</label>
                            </Col>
                            <Col md="4">
                                <Input type="select" name="docLang" id="docLang" onChange={(e) => this.selectType(e.target.value, 'docLang')} value={this.state.docLang}>
                                    <option value=''>Select Langage</option>
                                    {this.state.languageList.map((ct, i) => {
                                        return (<option value={ct.Language} key={i}>{ct.Language}</option>)
                                    })
                                    }
                                </Input>
                                <em id="docLangError" className="error invalid-feedback"></em>
                            </Col>
                        </Row>
                        {(this.state.showDocumentData) ? (
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="2">
                                    <label>Process</label>
                                </Col>
                                <Col md="4">
                                    <Input type="select" name="processType" id="processType" onChange={(e) => this.selectType(e.target.value, 'processType')} value={this.state.processType}>
                                        <option value=''>Select Process</option>
                                        {this.state.documentListType.map((ct, i) => {
                                            return (<option value={ct.StringMapId} key={i}>{ct.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                    <em id="processTypeError" className="error invalid-feedback"></em>
                                </Col>
                                <Col md="2">
                                    <label>Department</label>
                                </Col>
                                <Col md="4">
                                    <Input type="select" name="department" id="department" onChange={(e) => this.selectType(e.target.value, 'department')} value={this.state.department}>
                                        <option value=''>Select Department</option>
                                        {this.state.departmentList.map((ct, i) => {
                                            return (<option value={ct.StringMapId} key={i}>{ct.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                    <em id="departmentError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>
                        ) : ''}
                        {(this.state.showDocumentData) ? (
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="2">
                                    <label>Third Party</label>
                                </Col>
                                <Col md="4">
                                    <Input type="checkbox" name="isThirdParty" id="isThirdParty" onChange={(e) => this.handleChange(e)} value={this.state.isThirdParty} checked={this.state.isThirdParty} style={{ marginLeft: "10px" }} >
                                    </Input>
                                </Col>
                                <Col md="2">
                                    <label>File Name</label>
                                </Col>
                                <Col md="4">
                                    <Input type="text" name="fileName" id="fileName"
                                        placeholder="Enter File Name"
                                        onChange={(e) => this.handleChange(e)}
                                        value={this.state.fileName}
                                    />
                                    <em id="fileNameError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>
                        ) : ''}
                        <Row style={{ marginTop: "10px" }}>
                            <Col md="2">
                                <label>Template Category</label>
                            </Col>
                            <Col md="4">
                                <Input type="select" name="templateCategory" id="templateCategory" onChange={(e) => this.selectType(e.target.value, 'templateCategory')} value={this.state.templateCategory}>
                                    <option value=''>Select Template Category</option>
                                    {this.state.templateCategoryList.map((ct, i) => {
                                        return (<option value={ct.StringMapId} key={i}>{ct.StringMapName}</option>)
                                    })
                                    }
                                </Input>
                                <em id="templateCategoryError" className="error invalid-feedback"></em>
                            </Col>
                        </Row>
                        {this.state.showEmailSubject ?(
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="2">
                                    <label>Email Subject </label>
                                </Col>
                                <Col md="4">    
                                    <Input type="text" name="subject" id="subject"
                                        placeholder="Enter Email Subject"
                                        onChange={(e) => this.handleChange(e)}
                                        value={this.state.subject}
                                    />
                                    <em id="subjectError" className="error invalid-feedback"></em>
                                </Col>
                                <Col md="2">
                                    <label>Pick Dynamic Field For Subject</label>
                                </Col>
                                <Col md="4">
                                    <Input type="select" name="dynamicFieldForSubject" id="dynamicFieldForSubject" onChange={(e) => this.selectType(e.target.value, 'dynamicFieldForSubject')} value={this.state.dynamicFieldForSubject}>
                                        <option value=''>Select Dynamic Field For Subject</option>
                                        {this.state.dynamicFieldList.map((ct, i) => {
                                            return (<option value={ct.Description} key={i}>{ct.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                </Col>
                            </Row>
                        ) :'' }
                        <Row style={{ marginTop: "10px" }}>
                            <Col md="2">
                                <label>Message Text</label>
                            </Col>
                            <Col md="4">

                            </Col>
                            <Col md="2">
                                <label>Pick Dynamic Field</label>
                            </Col>
                            <Col md="4">
                                <Input type="select" name="dynamicField" id="dynamicField" onChange={(e) => this.selectType(e.target.value, 'dynamicField')} value={this.state.dynamicField}>
                                    <option value=''>Select Dynamic Field For Message</option>
                                    {this.state.dynamicFieldList.map((ct, i) => {
                                        return (<option value={ct.Description} key={i}>{ct.StringMapName}</option>)
                                    })
                                    }
                                </Input>

                            </Col>
                        </Row>

                        {(this.state.templateType !== 'SMS') ? (
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="12">
                                    <CKEditor name="templateMessage" id="templateMessage" data={this.state.templateMessage} onChange={this.handleDetailsChange} />
                                    <em id="templateMessageError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>
                        ) : (
                            <>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col md="12">
                                        <Input name="templateMessage" rows="10" type="textarea" id="templateMessage" className="" onChange={e => this.handleChange(e)} value={this.state.templateMessage} />
                                        <em id="templateMessageError" className="error invalid-feedback"></em>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        {this.state.docLang =='English'?
                                        <>
                                        <label><i>Note: Maximum Length For SMS is 180 Character</i> </label>
                                        </>
                                        : (this.state.docLang == 'Spanish') ?
                                         <><label><i>Note: Maximum Length For SMS is 90 Character</i> </label></>
                                         : null} 
                                    </Col>
                                </Row>
                            </>
                            )}

                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.save()}><i class="fa fa-check"></i> Save </BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> Cancel </BTN>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete Template</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.templateType} {this.state.tamplateName} Template?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.deleteTemplate()}><i class="fa fa-check"></i> Delete</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>
            </div >
        )
    }
}

export default withTranslation()(Documents);