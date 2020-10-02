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
// import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../../utils/constants';
// import { apiBase } from '../../utils/config';
import moment from 'moment';
import { useTranslation, withTranslation, Trans } from 'react-i18next';


class VesselType extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "VesselClassCode", header: "ClassID", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "vesselClassName", header: "ClassName", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "vesselTypeName", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 3 }
        ];


        this.state = {
            vesselTypeId: '',
            vesselTypeList: [],
            vesselTypes: [],

            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

            vesselClassName: '',
            classNameError: true,
            vesselTypeName: '',
            vesselTypeError: true,
            VesselClassList: [],
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            vesselClassId: '',
            VClassId: '',
            cols: columns,
            vesselClass: '',
            vesselClassError: true,
            VCName: '',
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
            toggleModal: false,
            // filter: {
            //     VesselClassId: ''
            // },
            VesselClassCode: '',
            isVessel: false,
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: t("masterVesselType:DataTableHeaders." + col.header + ""), value: col });
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
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getVesselTypeListData(this.props.match.params.Id)
        }
        this.getVesselClassList()
        this.getVesselTypeList()
    }

    getVesselTypeListData(id) {
        // if (this.state.vesselClassError === false) {
            try {
                let data
                if (id) {
                    data = { VesselClassId: id };
                    // let filterData = this.state.filter
                    // filterData.vesselClass = id;
                    this.setState({ vesselClass: id, VClassId: id });
                } else {
                    data = { VesselClassId: this.state.VClassId };
                }

                api.post('api/getVesselType', data).then(res => {
                    if (res.success) {
                        var formattedData = [];
                        for (var i = 0; i < res.data.length; i++) {
                            // var Updated = (res.data[i].updatedon === undefined || res.data[i].updatedon === null || res.data[i].updatedon === "") ? ("No Updates") : (Moment(res.data[i].updatedon).format(CommonConfig.dateFormat.dateTime));
                            formattedData.push({
                                vesselTypeId: res.data[i].VesselTypeId,
                                vesselClassId: res.data[i].VesselClassId,
                                VesselClassCode: res.data[i].VesselClassCode,
                                vesselTypeName: res.data[i].VesselTypeName,
                                vesselClassName: res.data[i].VesselClassName,
                                id: res.data[i].VesselClassId
                            });
                        }
                        let firstPage = (formattedData.length) ? '1' : '0';
                        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                        this.setState({ vesselTypeList: formattedData, str: str });
                    }
                    else {
                        console.log(" getVesselType Else");
                    }
                }).catch(err => {
                    console.log("err1", err);
                });
            } catch (error) {
                console.log("err", error);
            }
        // }
    }

    getVesselTypeList() {
        api.post('api/getVesselTypeList').then(res => {
            if (res.success) {
                this.setState({ vesselTypes: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }

    getVesselClassList() {
        let data = {} 
        api.post('api/getVesselClassList', data).then(res => {
            if (res.success) {
                this.setState({ VesselClassList: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        // let firstPage = (this.state.vesselTypeList.length) ? '1' : '0';
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.vesselTypeList.length) ? l : this.state.vesselTypeList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.vesselTypeList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;
        return <div className="text-center">
            <Button type="button" style={{ margiLeft: '.5em', padding: 2 }} icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} 
            tooltip={t('buttons.Edit')} onClick={() => this.edit(rowData)} />
            <Button type="button" style={{ margiLeft: '.5em', padding: 2 }} icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} 
            tooltip={t('buttons.Delete')} onClick={() => this.openDeleteModal(rowData)} />
        </div>;
    }

    selectType(value, type) {
        const { t } = this.props;
        if (type === 'vesselClass') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselClassError: true, vesselClass: value});
                this.show("vesselClass", true, "vesselClassError", t("masterVesselType:ClassName.error"));
            } else {
                this.setState({ VClassId: value, vesselClass: value, vesselClassError: false });
                this.show("vesselClass", false, "vesselClassError", "");
            }
        }

        if (type === 'vesselClassName') {
            let data = this.state.VesselClassList.find(x => x.VesselClassId === value);
            if (value === '') {
                this.setState({ classNameError: true, vesselClassName: value });
                this.show("vesselClassName", true, "classNameError", t("masterVesselType:ClassName.error"));
            } else {
                this.setState({ classNameError: false, vesselClassName: value, VesselClassCode: data.VesselClassCode, VCName: data.VesselClassName });
                this.show("vesselClassName", false, "classNameError", "");
            }
        }
    }

    export = () => {
        this.dt.exportCSV();
    }

    openModal() {
        this.setState({
            primary: true,
        });        
    }

    edit = (rowData) => {

        this.setState({
            vesselTypeId: rowData.vesselTypeId,
            vesselClassId: rowData.vesselClassId,
            primary: true,
            heading: 'Update',
            buttonName: 'Update',
            toastName: 'Updated',
            vesselClassName: rowData.id,
            vesselTypeName: rowData.vesselTypeName,
            classNameError: false,
            vesselTypeError: false,
            VesselClassCode: rowData.VesselClassCode
        })
    }

    reset = () => {

        this.setState({
            vesselClassId: '',
            vesselTypeId: '',
            VesselClassCode: '',
            vesselClassName: '',
            vesselTypeName: '',
            classNameError: true,
            vesselTypeError: true,
            // vesselClass: '',
            // vesselClassError: true,
            primary: false,
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save'
        })
    }

    save = () => {
        // console.log("this.state.vesselTypes...", this.state.vesselTypes)
        const { t } = this.props;

        if (
            this.state.classNameError === false &&
            this.state.vesselTypeError === false
        ) {
            let checkVesselTypeName;
            if (this.state.buttonName === "Save") {
                checkVesselTypeName = this.state.vesselTypes.filter(x => x.VesselTypeName === this.state.vesselTypeName);
                if (checkVesselTypeName.length) {
                    toast.error(t("masterVesselType:Toast.error"));
                    return null
                }
            }

            if (this.state.buttonName === "Update") {
                let array = this.state.vesselTypes.filter(x => x.VesselTypeId !== this.state.vesselTypeId);
                checkVesselTypeName = array.filter(x => x.VesselTypeName === this.state.vesselTypeName);
                if (checkVesselTypeName.length) {
                    toast.error(t("masterVesselType:Toast.error"));
                    return null
                }
            }

            let data = {
                vesselClassId: this.state.vesselClassName,
                vesselTypeId: this.state.vesselTypeId,
                vesselTypeCode: (((this.state.VCName).slice(0, 2)) + ((this.state.vesselTypeName).slice(0, 2))).toUpperCase(),
                vesselTypeName: this.state.vesselTypeName,
                LanguageId: this.state.LanguageId,
                CreatedBy: CommonConfig.loggedInUserId(),
                effectiveDate: this.state.effectiveDate
            }
            console.log("save", data);
            api.post('api/addUpdateVesselType', data).then(res => {

                if (res.data.success) {
                    toast.success(t("masterVesselType:Toast." + this.state.toastName + ""));
                    this.getVesselTypeListData();
                    this.reset();
                } else {
                    toast.error(res.data.message);
                }
            }).catch(err => {
            });
        }
        else {
            this.show("vesselClassName", this.state.classNameError, "classNameError", t("masterVesselType:ClassName.error"));
            this.show("vesselTypeName", this.state.vesselTypeError, "vesselTypeError", t("masterVesselType:VesselType.error_pattern"));
        }
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: true,
            vesselTypeId: rowData.vesselTypeId,
            vesselTypeName: rowData.vesselTypeName
        });
    }

    toggleLarge = () => {
        this.setState({ 
            toggleModal: false,
            vesselTypeId: '',
            vesselTypeName: ''
         });
    }

    Delete() {
        const { t } = this.props;
        try {
            let data = {
                vesselTypeId: this.state.vesselTypeId,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            api.post('api/deleteVesselType', data).then(res => {
                if (res.success) {
                    this.toggleLarge();
                    toast.success(t("masterVesselType:Toast.Delete"));
                    this.getVesselTypeListData();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    show(field, condition, errorField, message) {

        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
            document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
        } else {
            document.getElementById(field).className = "form-control";
            document.getElementById(errorField).innerHTML = null;
        }
    }

    handleChange = (e) => {
        const { t } = this.props;
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'vesselTypeName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ vesselTypeError: true });
                this.show("vesselTypeName", true, "vesselTypeError", t("masterVesselType:VesselType.error_blank"));
            } else {
                // let nameRegEx = /^[a-zA-Z]+[a-zA-Z-\s']*$/; // /^[a-zA-Z]+[a-zA-Z-\s']*$/
                let name = e.target.value;
                if (e.target.value.length > 50) {
                    this.setState({ vesselTypeError: true });
                    this.show("vesselTypeName", true, "vesselTypeError", t("masterVesselType:VesselType.error_maxLength"));
                } else {
                    this.setState({ vesselTypeError: false, vesselTypename: e.target.value });
                    this.show("vesselTypeName", false, "vesselTypeError", "");
                }
            }
        }
    }

    render() {
        const { t } = this.props;
        const mandatoryFieldMsg = t("mandatoryFieldMsg");

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={t("masterVesselType:DataTableHeaders." + col.header + "")} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("masterVesselType:Header")}</h1>
                </div>

                <div className="rc-inline">
                    <Row>
                        <Col md="3">
                            <div className="input-box">

                                <label>{t("masterVesselType:ClassName.label")}</label>
                                <Input type="select" name="vesselClass" id="vesselClass" onChange={(e) => this.selectType(e.target.value, 'vesselClass')} value={this.state.vesselClass} >
                                    <option value=''>{t("masterVesselType:ClassName.defaultValue")}</option>
                                    {this.state.VesselClassList.map((ct, i) => {
                                        return (<option value={ct.VesselClassId}>{ct.VesselClassName}</option>)
                                    })
                                    }
                                </Input>
                                <em id="vesselClassError" className="error invalid-feedback"></em>
                            </div>
                        </Col>

                        <Col md="1">
                            <BTN color="success" style={{ marginTop: "20px", marginRight: '.5em', borderRadius: "20px" }}
                                tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Go")} onClick={() => this.getVesselTypeListData()}
                            >
                                {t("buttons.Go")}
                            </BTN>
                        </Col>
                    </Row>
                </div>


                <div className="basic-header">
                    <div></div>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} style={{ width: '50px' }} tooltipOptions={{ position: 'bottom' }} tooltip={t("translation:labels.shoeHideColumnLabel")}
                            style={{ width: '50px' }} onChange={this.onColumnToggle}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip={t("masterVesselType:AddVesselType")} tooltipOptions={{ position: 'bottom' }} onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip={t("buttons.exportAsCSVLabel")} tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    {/* <div className="header-right-option"> */}
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.vesselTypeList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        exportFilename={t("masterVesselType:VesselTypeList")}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.vesselTypeList.length}
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage={t("translation:NoRecordsMsg")}
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
                    <ModalHeader toggle={this.reset}>{t("masterVesselType:ModalHeading." + this.state.heading + "")}</ModalHeader>


                    <ModalBody>
                        <form className="form" action="#">
                            <Row>
                                <Col md="12" className="text-right">
                                    <span style={{ color: "red" }}>{mandatoryFieldMsg}</span>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="3">
                                <b>{t("masterVesselType:ClassId.label")}</b> {this.state.VesselClassCode}
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label for="">{t("masterVesselType:ClassName.label")}*</label>
                                        <Input type="select" name="vesselClassName" id="vesselClassName" className="" onChange={(e) => this.selectType(e.target.value, 'vesselClassName')} value={this.state.vesselClassName}>
                                            <option value=''>{t("masterVesselType:ClassName.defaultValue")}</option>
                                            {this.state.VesselClassList.map((ct, i) => {
                                                return (<option value={ct.VesselClassId}>{ct.VesselClassName}</option>)
                                            })
                                            }
                                        </Input>
                                        <em id="classNameError" className="error invalid-feedback"></em>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>{t("masterVesselType:VesselType.label")}*</label>
                                        <Input type="text" name="vesselTypeName" id="vesselTypeName" onChange={e => this.handleChange(e)} placeholder={t("masterVesselType:VesselType.placeholder")} value={this.state.vesselTypeName} />
                                        <em id="vesselTypeError" className="error invalid-feedback"></em>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={this.save}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                        <BTN color="primary" onClick={this.reset}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>{t("masterVesselType:Delete.label")}</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.vesselTypeName} vessel type?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.Delete()}><i class="fa fa-check"></i> {t("buttons.Yes")}</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i> {t("buttons.No")}</BTN>
                    </ModalFooter>
                </Modal>

            </div >
        );
    }
}

export default withTranslation()(VesselType);