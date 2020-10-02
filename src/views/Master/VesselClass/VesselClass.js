import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
// import APIConstant from '../../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import moment from 'moment';


class VesselClass extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "vesselClassCode", header: "ClassID", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "vesselClassName", header: "ClassName", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "vesselTypeCount", header: "NoofTypes", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "adminFee", header: "AdminFee", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "currency", header: "Currency", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "sortOrder", header: "SortOrder", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 6 }
        ];

        this.state = {
            toggleModal: false,
            vesselClassList: [],

            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

            vesselClassId: '',
            vesselClassCode: '',

            vesselClassName: '',
            vesselClassNameError: true,

            adminFee: '',
            adminFeeError: true,

            currency: 'Euro',
            currencyError: false,
            currencyList: [],

            effectivedate: 'Effective Date',
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,

            sortOrder: '',

            cols: columns,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            selectedPage: 0,
            str: '',
            globalFilter: null,

            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            primary: false,
            toggleModal: false,
            SortOrderInc: "",
            isVessel: false
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: t("masterVesselClass:DataTableHeaders." + col.header + ""), value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getVesselClassList();
        this.getCurrency();
        this.getVesselClassCode();
    }

    getVesselClassList() {
        // let data = {}
        api.post('api/getVesselClassData').then(res => {
            if (res.success) {
                console.log("getVesselClassList", res.data);
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        vesselClassId: res.data[i].VesselClassId,
                        vesselClassCode: res.data[i].VesselClassCode,
                        vesselClassName: res.data[i].VesselClassName,
                        vesselTypeCount: res.data[i].VesselTypeCount,
                        adminFee: res.data[i].AdminFee,
                        currency: res.data[i].Currency,
                        sortOrder: res.data[i].SortOrder,
                        effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
                        isVessel: true
                    });
                    // let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    // let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                    // this.setState({ vesselClassList: formattedData, str: str });
                    // console.log("getVesselClassData", this.state.vesselClassList);
                }
                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ vesselClassList: formattedData, str: str });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getCurrency() {

        api.get('api/getCurrency').then(res => {
            if (res.success) {
                this.setState({ currencyList: res.data });
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
        let lastPage = (l < this.state.vesselClassList.length) ? l : this.state.vesselClassList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.vesselClassList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getVesselClassCode = () => {
        api.post('api/getVesselClassCode').then(res => {
            if (res.success) {
                var SortOrder = Number(res.data[0].SortOrder) + 1;
                console.log('getVesselClassCode',res.data);
                console.log('getVesselClassCode',SortOrder);
                
                this.setState({ vesselClassCode: SortOrder });
            } else {
                console.log("Something went wrong");
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    edit = (rowData) => {

        this.setState({
            primary: true,
            heading: 'Update',
            buttonName: 'Update',
            toastName: 'Updated',
            vesselClassId: rowData.vesselClassId,
            vesselClassCode: rowData.vesselClassCode,
            vesselClassName: rowData.vesselClassName,
            vesselClassNameError: false,
            adminFee: rowData.adminFee,
            adminFeeError: false,
            currency: rowData.currency,
            currencyError: false,
            SortOrderInc: rowData.vesselClassCode,
            effectiveDate: moment(rowData.effectiveDate).format('YYYY-MM-DD'),
        })

    }

    Save = () => {
        const { t } = this.props;
        // console.log("this.state.vesselClassList...", this.state.vesselClassList);
        if (
            this.state.vesselClassNameError === false &&
            this.state.adminFeeError === false
            // this.state.currencyError === false
        ) {
            let checkVesselClassName;
            if (this.state.buttonName === "Save") {
                checkVesselClassName = this.state.vesselClassList.filter(x => x.vesselClassName === this.state.vesselClassName);
                if (checkVesselClassName.length) {
                    toast.error(t("masterVesselClass:Toast.error"));
                    return null;
                }
            }

            if (this.state.buttonName === "Update") {
                let array = this.state.vesselClassList.filter(x => x.vesselClassId !== this.state.vesselClassId);
                checkVesselClassName = array.filter(x => x.vesselClassName === this.state.vesselClassName);
                if (checkVesselClassName.length) {
                    toast.error(t("masterVesselClass:Toast.error"));
                    return null;
                }
            }

            let data = {
                LanguageId: this.state.LanguageId,
                vesselClassId: this.state.vesselClassId,
                vesselClassCode: this.state.vesselClassCode,
                vesselClassName: this.state.vesselClassName,
                sortOrder: this.state.vesselClassCode,
                adminFee: this.state.adminFee,
                currency: this.state.currency,
                effectiveDate: this.state.effectiveDate,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            api.post('api/addUpdateVesselClassList', data).then(res => {

                if (res.success) {
                    toast.success(t("masterVesselClass:Toast." + this.state.toastName + ""));
                    this.reset();
                    this.getVesselClassList();
                } else {
                }
            }).catch(err => {
            });
        } else {
            this.show("vesselClassName", this.state.vesselClassNameError, "vesselClassNameError", t("masterVesselClass:VesselClass.error_pattern"));
            this.show("adminFee", this.state.adminFeeError, "adminFeeError", t("masterVesselClass:AdminFee.error_pattern"));
            // this.show("currency", this.state.currencyError, "currencyError", t("masterVesselClass:Currency.error_pattern"));
        }
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: !this.state.toggleModal,
            vesselClassId: rowData.vesselClassId,
            vesselClassName: rowData.vesselClassName
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            vesselClassId: '',
            vesselClassName: ''
        });
    }

    Delete() {
        const { t } = this.props;
        try {
            let data = {
                vesselClassId: this.state.vesselClassId,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            console.log("Delete", data);
            api.post('api/deleteVesselClass', data).then(res => {
                if (res.success) {
                    this.toggleLarge();
                    toast.success(t("masterVesselClass:Toast.Delete"));
                    this.getVesselClassList();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    VesselType(rowData) {
        var Id = rowData.vesselClassId;
        this.props.history.push({
            pathname: '/Master/VesselType/' + Id,
            state: {
                id: Id,
            }
        });
    }

    goToHistoryPage = (rowData) => {
        console.log("rowData", rowData);
        var Id = rowData.vesselClassId;
        this.props.history.push({
            pathname: '/Master/VesselClassHistory/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    // RiskQuestion(rowData) {
    //     this.props.history.push({
    //         pathname: '/Master/RiskQuestion'
    //     });
    // }

    // Endorsement(rowData) {
    //     this.props.history.push({
    //         pathname: '/Master/Endorsement'
    //     });
    // }

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

        if (e.target.name === 'vesselClassName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ vesselClassNameError: true });
                this.show("vesselClassName", true, "vesselClassNameError", t("masterVesselClass:VesselClass.error_blank"));
            } else {
                // let nameRegEx = / /; // /^[a-zA-Z]+[a-zA-Z-\s']*$/
                let name = e.target.value;
                // if (!nameRegEx.test(name)) {
                //     this.setState({ vesselClassNameError: true });
                //     this.show("vesselClassName", true, "vesselClassNameError", "Please enter class name");
                // }
                if (e.target.value.length > 50) {
                    this.setState({ vesselClassNameError: true });
                    this.show("vesselClassName", true, "vesselClassNameError", t("masterVesselClass:VesselClass.error_maxLength"));
                } else {
                    this.setState({ vesselClassNameError: false, vesselClassName: e.target.value });
                    this.show("vesselClassName", false, "vesselClassNameError", "");
                }
            }
        }

        if (e.target.name === 'adminFee') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ adminFeeError: true });
                this.show("adminFee", true, "adminFeeError", t("masterVesselClass:AdminFee.error_blank"));
            } else {
                let RegEx = /^[0-9]+(\.[0-9][0-9])?$/;
                let name = e.target.value;
                if (!RegEx.test(name)) {
                    this.setState({ adminFeeError: true });
                    this.show("adminFee", true, "adminFeeError", t("masterVesselClass:AdminFee.error_pattern"));
                    // } else if (e.target.value.length > 100) {
                    //     this.setState({ adminFeeError: true });
                    //     this.show("adminFee", true, "adminFeeError", "admin Fee cannot be grater than 100");
                } else {
                    this.setState({ adminFeeError: false, adminFee: e.target.value });
                    this.show("adminFee", false, "adminFeeError", "");
                }
            }
        }

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true, "effectiveDateError", "Enter valid effective date");
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false, "effectiveDateError", "");
            }
        }
    }


    selectType = (value, type) => {
        const { t } = this.props;

        if (type === 'currency') {

            if (value === '') {
                this.setState({ currencyError: true, currency: value });
                this.show("currency", true, "currencyError", t("masterVesselClass:Currency.error"));
            } else {
                this.setState({ currency: value, currencyError: false });
                this.show("currency", false, "currencyError", "");
            }
        }
    }

    reset = () => {
        this.setState({
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save',
            primary: false,
            vesselClassId: '',
            VesselClassCode: '',
            vesselClassName: '',
            vesselClassNameError: true,
            noofTypes: '',
            noofTypesError: true,
            adminFee: '',
            adminFeeError: true,
            currency: 'Euro',
            currencyError: false,
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,
        })
        // this.getVesselClassCode();
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;
        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip={t('buttons.Edit')}
                style={{ padding: 2 }} onClick={() => this.edit(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip={t('buttons.Delete')}
                style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)}></Button>
            <Button type="button" icon="fa fa-shield" color="primary" tooltipOptions={{ position: 'bottom' }} tooltip={t("masterVesselClass:VesselTypes")}
                style={{ padding: 2 }} onClick={() => this.VesselType(rowData)}></Button>
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ padding: 2 }}></Button>
        </div>;
    }

    openModal() {
        this.setState({
            primary: true
        })
    }

    export = () => {
        this.dt.exportCSV();
    }

    render() {
        const { t } = this.props;
        const mandatoryFieldMsg = t("mandatoryFieldMsg");

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={t("masterVesselClass:DataTableHeaders." + col.header + "")} body={col.body}
                sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("masterVesselClass:Header")}</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltipOptions={{ position: 'bottom' }} tooltip="Show/Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip={t("masterVesselClass:AddVesselClass")} tooltipOptions={{ position: 'bottom' }}
                            onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip={t("buttons.exportAsCSVLabel")} tooltipOptions={{ position: 'bottom' }}
                            onClick={this.export}></Button>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.vesselClassList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.vesselClassList.length}
                        exportFilename={t("masterVesselClass:Export_File")}
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage={t("translation:NoRecordsMsg")}
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                </div>

                <Modal isOpen={this.state.primary} toggle={this.reset}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.reset}>{t("masterVesselClass:ModalHeading." + this.state.heading + "")}</ModalHeader>
                    <ModalBody>
                        <form className="form" action="#">

                            <Row>
                                <Col md="12" className="text-right">
                                    <span style={{ color: "red" }}>{mandatoryFieldMsg}</span>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="3">
                                    <b>{t("masterVesselClass:ClassID.label")}:</b> {this.state.vesselClassCode}
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>{t("masterVesselClass:ClassName.label")}*</label>
                                        <InputGroup>
                                            <Input type="text" name="vesselClassName" id="vesselClassName" onChange={e => this.handleChange(e)}
                                                placeholder={t("masterVesselClass:ClassName.label")} value={this.state.vesselClassName} />
                                            <em id="vesselClassNameError" className="error invalid-feedback"></em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>{t("masterVesselClass:AdminFee.label")}*</label>
                                        <InputGroup>
                                            <Input type="text" name="adminFee" id="adminFee" onChange={e => this.handleChange(e)}
                                                placeholder={t("masterVesselClass:AdminFee.label")} value={this.state.adminFee} />
                                            <em id="adminFeeError" className="error invalid-feedback"></em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>{t("masterVesselClass:Currency.label")}*</label>
                                        <InputGroup>
                                            <Input type="select" name="currency" id="currency"
                                                onChange={(e) => this.selectType(e.target.value, 'currency')}
                                                value={this.state.currency}>
                                                {/* <option value=''>Select currency</option> */}
                                                {this.state.currencyList.map((ct, i) => {
                                                    return (<option value={ct.CurrencyName} selected={ct.CurrencyName === 'Euro' ? true : false}>{ct.CurrencyName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="currencyError" className="error invalid-feedback"></em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6" className="pull-right">
                                    <div className="input-box">
                                        <label>{this.state.effectivedate}</label>
                                        <InputGroup>
                                            <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                                min={moment().format('YYYY-MM-DD')}
                                                max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                            >
                                            </Input>
                                            <em id="effectiveDateError" className="error invalid-feedback"></em>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.Save()}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>{t("masterVesselClass:Delete.label")}</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.vesselClassName} Vessel Class?
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

export default withTranslation()(VesselClass);
