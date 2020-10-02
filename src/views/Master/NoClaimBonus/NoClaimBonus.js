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
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import moment from 'moment';

class NoClaimBonus extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "years", header: "NoofYears", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "discount", header: "DiscountRate", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "effective_Date", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 3 }
        ];

        this.state = {
            noClaimBonusList: [],
            cols: columns,
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            years: '',
            discount: '',
            primary: false,
            toggleModal: false,
            yearsError: true,
            discountError: true,
            NoClaimBonusId: '',
            effectivedate: 'Effective Date',
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: t("masterNoClaimBonus:DataTableHeaders." + col.header + ""), value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getNoClaimBonusList();
    }

    getNoClaimBonusList() {
        try {
            api.post('api/getNoClaimBonus').then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        // var Updated = (res.data[i].updatedon === undefined || res.data[i].updatedon === null || res.data[i].updatedon === "") ? ("No Updates") : (Moment(res.data[i].updatedon).format(CommonConfig.dateFormat.dateTime));
                        formattedData.push({
                            NoClaimBonusId: res.data[i].NoClaimBonusId,
                            years: res.data[i].YearCount,
                            discount: res.data[i].DiscountRate,
                            effective_Date: moment(res.data[i].StartDate).format(CommonConfig.dateFormat.forDatePicker),
                        });
                        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                        this.setState({ noClaimBonusList: formattedData, str: str });
                    }
                } else {
                    console.log("Else");
                }
            }).catch(err => {

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.noClaimBonusList.length) ? l : this.state.noClaimBonusList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.noClaimBonusList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    edit = (rowData) => {

        this.setState({
            heading: 'Update',
            buttonName: 'Update',
            toastName: 'Updated',
            years: rowData.years,
            discount: rowData.discount,
            NoClaimBonusId: rowData.NoClaimBonusId,
            // effectiveDate: rowData.effectiveDate,
            effectiveDateError: false,
            yearsError: false,
            discountError: false,
            primary: true
        });
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: true,
            NoClaimBonusId: rowData.NoClaimBonusId,
            years: rowData.years
        });
    }

    goToHistoryPage = (rowData) => {
        console.log("rowData", rowData);
        var Id = rowData.NoClaimBonusId;
        this.props.history.push({
            pathname: '/Master/NoClaimBonusHistory/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    Delete() {
        const { t } = this.props;
        try {
            let data = {
                NoClaimBonusId: this.state.NoClaimBonusId,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            api.post('api/deleteNoClaimBonus', data).then(res => {
                if (res.success) {
                    this.toggleLarge();
                    toast.success(t("masterNoClaimBonus:Toast.Delete"));
                    this.getNoClaimBonusList();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            years: '',
            NoClaimBonusId: ''
        });
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }}
                tooltip={t("buttons.Edit")} style={{ padding: 2 }} onClick={() => this.edit(rowData)} />
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }}
                tooltip={t("buttons.Delete")} style={{ padding: 2 }} onClick={() => this.openDeleteModal(rowData)} />
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" 
                onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ padding: 2 }}></Button>
        </div>;
    }

    Save = () => {

        // console.log("this.state.noClaimBonusList...", this.state.noClaimBonusList);
        const { t } = this.props;
        if (
            this.state.yearsError === false &&
            this.state.discountError === false &&
            this.state.effectiveDateError === false
        ) {
            let checkNCBYears;
            if (this.state.buttonName === "Save") {
                checkNCBYears = this.state.noClaimBonusList.filter(x => x.years === parseInt(this.state.years));
                if (checkNCBYears.length) {
                    toast.error(t("masterNoClaimBonus:Toast.error"));
                    return null;
                }
            }

            if (this.state.buttonName === "Update") {
                let array = this.state.noClaimBonusList.filter(x => x.NoClaimBonusId !== this.state.NoClaimBonusId);
                checkNCBYears = array.filter(x => x.years === parseInt(this.state.years));
                if (checkNCBYears.length) {
                    toast.error(t("masterNoClaimBonus:Toast.error"));
                    return null;
                }
            }

            let data = {
                NoClaimBonusId: this.state.NoClaimBonusId,
                NCBYears: this.state.years,
                NCBDiscount: this.state.discount,
                LanguageId: this.state.LanguageId,
                effectiveDate: this.state.effectiveDate,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            console.log('data',data);            
            api.post('api/addUpdateNoClaimBonus', data).then(res => {
                if (res.success) {
                    toast.success(t("masterNoClaimBonus:Toast." + this.state.toastName + ""));
                    this.reset();
                    this.getNoClaimBonusList();
                } else {
                    toast.error(res.data.message);
                }
            }).catch(err => {
            });
        } else {
            this.show("years", this.state.yearsError);
            this.show("discount", this.state.discountError);
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'years') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ yearsError: true });
                this.show("years", true);
            } else {
                let invSpace = CommonConfig.RegExp.number;
                let years = e.target.value;
                if (!invSpace.test(years)) {
                    this.setState({ yearsError: true });
                    this.show("years", true);
                } else {
                    this.setState({ yearsError: false, years: e.target.value });
                    this.show("years", false);
                }
            }
        }

        if (e.target.name === 'discount') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ discountError: true });
                this.show("discount", true);
            } else {
                let invSpace = CommonConfig.RegExp.percentageWithNegative;
                let discount = e.target.value;
                if (!invSpace.test(discount)) {
                    this.setState({ discountError: true });
                    this.show("discount", true);
                } else {
                    this.setState({ discountError: false, discount: e.target.value });
                    this.show("discount", false);
                }
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

    reset = () => {
        this.setState({
            years: '',
            discount: '',
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,
            yearsError: true,
            discountError: true,
            NoClaimBonusId: '',
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            primary: false,
        })
    }

    export = () => {
        this.dt.exportCSV();
    }

    openModal() {
        this.setState({
            primary: true
        })
    }

    render() {

        const { t } = this.props;
        const mandatoryFieldMsg = t("mandatoryFieldMsg");

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={t("masterNoClaimBonus:DataTableHeaders." + col.header + "")} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("masterNoClaimBonus:Header")}</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltipOptions={{ position: 'bottom' }} tooltip={t("translation:labels.shoeHideColumnLabel")}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltipOptions={{ position: 'bottom' }} tooltip={t("masterNoClaimBonus:AddNoClaimBonus")} onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltipOptions={{ position: 'bottom' }} tooltip={t("translation:buttons.exportAsCSVLabel")} onClick={this.export}></Button>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.noClaimBonusList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.noClaimBonusList.length}
                        exportFilename={t("masterNoClaimBonus:NoClaimBonusList")}
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
                    <ModalHeader toggle={this.reset}>{t("masterNoClaimBonus:ModalHeading." + this.state.heading + "")}{}</ModalHeader>
                    <ModalBody>
                        <form className="form" action="#">
                            <Row>
                                <Col md="12" className="text-right">
                                    <span style={{ color: "red" }}>{mandatoryFieldMsg}</span>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6">
                                    <div className="input-box">
                                        <label>{t("masterNoClaimBonus:NoofYears.label")}*</label>
                                        <Input type="text" name="years" id="years" onChange={e => this.handleChange(e)} placeholder={t("masterNoClaimBonus:NoofYears.placeholder")} value={this.state.years} >
                                        </Input>
                                        <em className="error invalid-feedback">{t("masterNoClaimBonus:NoofYears.error_blank")}</em>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6">
                                    <div className="imput-box">
                                        <label>{this.state.effectivedate}</label>
                                        <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                            min={moment().format(CommonConfig.dateFormat.YearMonthDay)}
                                            max={moment().add(100, 'years').format(CommonConfig.dateFormat.YearMonthDay)}
                                        >
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter valid effective date</em>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6">
                                    <div className="imput-box">
                                        <label>{t("masterNoClaimBonus:DiscountRate.label")}*</label>
                                        <Input type="text" name="discount" id="discount" onChange={e => this.handleChange(e)} placeholder={t("masterNoClaimBonus:DiscountRate.placeholder")} value={this.state.discount} >
                                        </Input>
                                        <em className="error invalid-feedback">{t("masterNoClaimBonus:DiscountRate.error_blank")}</em>
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
                    <ModalHeader toggle={this.toggleLarge}>{t("masterNoClaimBonus:Delete.label")}</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete No Claim Bonus for {this.state.years} years?
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

export default withTranslation()(NoClaimBonus);