import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import APIConstant from '../../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import moment from 'moment';

class Levy extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "type", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "rate1", header: "Rate1", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "rateBasis1", header: "RateBasis1", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "rate2", header: "Rate2", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "rateBasis2", header: "RateBasis2", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "amountInEUR", header: "AmountInEUR", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "amountInGBP", header: "AmountInGBP", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 8 }
        ];

        this.state = {
            LevyId: '',
            country: '',
            countryarr: [],
            countryError: true,
            type: '',
            typeError: true,
            typearr: [],
            rate1: '',
            rate1Error: true,
            rateBasis1: '',
            rateBasis1arr: [],
            rateBasis1Error: true,
            rate2: '',
            rate2Error: true,
            rateBasis2: '',
            rateBasis2arr: [],
            rateBasis2Error: true,
            amountInEUR: '',
            amountInEURError: true,
            amountInGBP: '',
            amountInGBPError: true,
            effectivedate: 'Effective Date',
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: true,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            toggleModal: false,
            cols: columns,
            LevyList: [],
            rowData: '',
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: t("masterLevy:DataTableHeaders." + col.header + ""), value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);

    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getLevyList();
        this.getCountry();
        this.getRateBasis1();
        this.getRateBasis2();
        this.getLevyType();
    }

    getCountry() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var country = [];
                    for (let i = 0; i < res.data.length; i++) {
                        country.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ countryarr: country });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getRateBasis1() {
        try {
            const data = {
                stringmaptype: 'RATEBASIS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var rateBasis1 = [];
                    for (let i = 0; i < res.data.length; i++) {
                        rateBasis1.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ rateBasis1arr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getRateBasis2() {
        try {
            const data = {
                stringmaptype: 'RATEBASIS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var rateBasis2 = [];
                    for (let i = 0; i < res.data.length; i++) {
                        rateBasis2.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ rateBasis2arr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getLevyType() {
        try {
            const data = {
                stringmaptype: 'LEVYTYPE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var type = [];
                    for (let i = 0; i < res.data.length; i++) {
                        type.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ typearr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.LevyList.length) ? l : this.state.LevyList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.LevyList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getLevyList() {
        try {
            api.post('api/getLevy').then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        // var Updated = (res.data[i].updatedon === undefined || res.data[i].updatedon === null || res.data[i].updatedon === "") ? ("No Updates") : (Moment(res.data[i].updatedon).format(CommonConfig.dateFormat.dateTime));
                        formattedData.push({
                            LevyId: res.data[i].LevyId,
                            country: res.data[i].Country,
                            type: res.data[i].Type,
                            rate1: res.data[i].Rate1,
                            rateBasis1: res.data[i].RateBasis1,
                            rate2: res.data[i].Rate2,
                            rateBasis2: res.data[i].RateBasis2,
                            amountInEUR: res.data[i].AmountEUR,
                            amountInGBP: res.data[i].AmountGBP,
                            effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment().format('YYYY-MM-DD'),
                        });
                        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                        this.setState({ LevyList: formattedData, str: str });
                    }
                } else {
                    console.log(" getLevy Else");
                }
            }).catch(err => {

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    export = () => {
        this.dt.exportCSV();
    }

    openModal = () => {
        this.setState({
            primary: true
        })
    }

    edit = (rowData) => {
        this.setState({
            LevyId: rowData.LevyId,
            country: rowData.country,
            type: rowData.type,
            rate1: rowData.rate1,
            rateBasis1: rowData.rateBasis1,
            rate2: rowData.rate2,
            rateBasis2: rowData.rateBasis2,
            amountInEUR: rowData.amountInEUR,
            amountInGBP: rowData.amountInGBP,
            effectiveDate: rowData.effectiveDate,
            effectiveDateError: false,
            countryError: false,
            typeError: false,
            rate1Error: false,
            rateBasis1Error: false,
            rate2Error: false,
            rateBasis2Error: false,
            amountInEURError: false,
            amountInGBPError: false,
            buttonName: 'Update',
            heading: 'Update',
            toastName: 'Updated',
            primary: true
        });
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: true,
            LevyId: rowData.LevyId,
            country: rowData.country,
        });
    }

    goToHistoryPage = (rowData) => {
        console.log("rowData", rowData);
        var Id = rowData.LevyId;
        this.props.history.push({
            pathname: '/Master/LevyHistory/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            LevyId: '',
            country: ''
        });
    }

    Delete() {
        const { t } = this.props;
        try {
            let data = {
                LevyId: this.state.LevyId,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            api.post('api/deleteLevy', data).then(res => {
                if (res.success) {
                    this.toggleLarge();
                    toast.success(t("masterLevy:Toast.Delete"));
                    this.getLevyList();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    Save() {
        debugger
        //console.log("this.state.LevyList...", this.state.LevyList);
        const { t } = this.props;
        try {
            if (this.state.countryError === true ||
                this.state.typeError === true ||
                this.state.effectiveDateError === true) {
                this.show("country", this.state.countryError);
                this.show("type", this.state.typeError);
                this.show("effectiveDate", this.state.effectiveDateError);
            }
            else if (this.state.type === "ONE RATE" && (this.state.rate1Error === true || this.state.rateBasis1Error === true)) {
                this.show("rate1", this.state.rate1Error);
                this.show("rateBasis1", this.state.rateBasis1Error);
            } else if (this.state.type === "ADD TWO RATES" && (this.state.rate1Error === true || this.state.rateBasis1Error === true || this.state.rate2Error === true || this.state.rateBasis2Error === true)) {
                this.show("rate1", this.state.rate1Error);
                this.show("rateBasis1", this.state.rateBasis1Error);
                this.show("rate2", this.state.rate2Error);
                this.show("rateBasis2", this.state.rateBasis2Error);
            } else if (this.state.type === "FIXED AMOUNT" && (this.state.amountInEURError === true || this.state.amountInGBPError === true)) {
                this.show("amountInEUR", this.state.amountInEURError);
                this.show("amountInGBP", this.state.amountInGBPError);
            }
            else {
                let checkLevyCountry;
                if (this.state.buttonName === "Save") {
                    checkLevyCountry = this.state.LevyList.filter(x => x.country === this.state.country);
                    if (checkLevyCountry.length) {
                        toast.error(t("masterLevy:Toast.error"));
                        return null;
                    }
                }

                if (this.state.buttonName === "Update") {
                    let array = this.state.LevyList.filter(x => x.LevyId !== this.state.LevyId);
                    checkLevyCountry = array.filter(x => x.country === (this.state.country));
                    if (checkLevyCountry.length) {
                        toast.error(t("masterLevy:Toast.error"));
                        return null;
                    }
                }

                let data = {
                    LevyId: this.state.LevyId,
                    country: this.state.country,
                    type: this.state.type,
                    rate1: this.state.rate1,
                    rateBasis1: this.state.rateBasis1,
                    rate2: this.state.rate2,
                    rateBasis2: this.state.rateBasis2,
                    amountInEUR: this.state.amountInEUR,
                    amountInGBP: this.state.amountInGBP,
                    CreatedBy: CommonConfig.loggedInUserId(),
                    LanguageId: this.state.LanguageId,
                    effectiveDate: this.state.effectiveDate,
                }
                api.post('api/addUpdateLevy', data).then(res => {

                    if (res.success) {
                        toast.success(t("masterLevy:Toast." + this.state.toastName + ""));
                        this.reset();
                        this.getLevyList();
                    }
                })
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    actionTemplate(rowData, column) {
        const { t } = this.props;

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Edit")} style={{ padding: 2 }}
                onClick={() => this.edit(rowData)} />
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltipOptions={{ position: 'bottom' }} tooltip={t("buttons.Delete")} style={{ padding: 2 }}
                onClick={() => this.openDeleteModal(rowData)} />
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ padding: 2 }}></Button>
        </div>;
    }


    reset = () => {
        this.setState({
            country: '',
            countryError: true,
            type: '',
            typeError: true,
            rate1: '',
            rate1Error: true,
            rateBasis1: '',
            rateBasis1Error: true,
            rate2: '',
            rate2Error: true,
            rateBasis2: '',
            rateBasis2Error: true,
            amountInEUR: '',
            amountInEURError: true,
            amountInGBP: '',
            amountInGBPError: true,
            effectiveDate: moment().format(CommonConfig.dateFormat.YearMonthDay),
            effectiveDateError: true,
            LevyId: '',
            // rowData: '',
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            primary: false
        })
    }

    selectType(value, type) {

        if (type === 'country') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ countryError: true, country: value });
                this.show('country', true);
            } else {
                this.setState({ countryError: false, country: value });
                this.show('country', false);
            }
        }

        if (type === 'type') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ typeError: true, type: value });
                this.show('type', true);
            } else {
                this.setState({ typeError: false, type: value });
                if (value == 'ADD TWO RATES') {
                    this.setState({ rate1Error: true, rateBasis1Error: true, rate2Error: true, rateBasis2Error: true });
                } else if (value == 'FIXED AMOUNT') {
                    this.setState({ amountInEURError: true, amountInGBPError: true });
                } else if (value == 'ONE RATE') {
                    this.setState({ rate1Error: true, rateBasis1Error: true });
                }
                this.setState({
                    rate1: '', rateBasis1: '', rate2: '', rateBasis2: '', amountInEUR: '', amountInGBP: ''
                });
                this.show('type', false);
            }
        }

        if (type === 'rateBasis1') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ rateBasis1Error: true, rateBasis1: value });
                this.show('rateBasis1', true);
            } else {
                this.setState({ rateBasis1Error: false, rateBasis1: value });
                this.show('rateBasis1', false);
            }
        }

        if (type === 'rateBasis2') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ rateBasis2Error: true, rateBasis2: value });
                this.show('rateBasis2', true);
            } else {
                this.setState({ rateBasis2Error: false, rateBasis2: value });
                this.show('rateBasis2', false);
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'rate1') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ rate1Error: true });
                this.show("rate1", true);
            } else {
                let rate1RegEx = CommonConfig.RegExp.percentageWithNegative;
                let rate1 = e.target.value;
                if (e.target.value > 100 || !rate1RegEx.test(rate1)) {
                    this.setState({ rate1Error: true });
                    this.show("rate1", true);
                } else {
                    this.setState({ rate1Error: false, rate1: e.target.value });
                    this.show("rate1", false);
                }
            }
        }

        if (e.target.name === 'rate2') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ rate2Error: true });
                this.show("rate2", true);
            } else {
                let rate2RegEx = CommonConfig.RegExp.percentageWithNegative;
                let rate2 = e.target.value;
                if (e.target.value > 100 || !rate2RegEx.test(rate2)) {
                    this.setState({ rate2Error: true });
                    this.show("rate2", true);
                } else {
                    this.setState({ rate2Error: false, rate2: e.target.value });
                    this.show("rate2", false);
                }
            }
        }

        if (e.target.name === 'amountInEUR') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ amountInEURError: true });
                this.show("amountInEUR", true);
            } else {
                let invSpace = CommonConfig.RegExp.decimalWithNegative;
                let amountInEUR = e.target.value;
                if (!invSpace.test(amountInEUR)) {
                    this.setState({ amountInEURError: true });
                    this.show("amountInEUR", true);
                } else {
                    this.setState({ amountInEURError: false, amountInEUR: e.target.value });
                    this.show("amountInEUR", false);
                }
            }
        }

        if (e.target.name === 'amountInGBP') {
            if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                this.setState({ amountInGBPError: true });
                this.show("amountInGBP", true);
            } else {
                let invSpace = CommonConfig.RegExp.decimalWithNegative;
                let amountInGBP = e.target.value;
                if (!invSpace.test(amountInGBP)) {
                    this.setState({ amountInGBPError: true });
                    this.show("amountInGBP", true);
                } else {
                    this.setState({ amountInGBPError: false, amountInGBP: e.target.value });
                    this.show("amountInGBP", false);
                }
            }
        }

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            }  else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false);
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

    render() {

        const { t } = this.props;
        const mandatoryFieldMsg = t("mandatoryFieldMsg");

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={t("masterLevy:DataTableHeaders." + col.header + "")} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("masterLevy:Header")}</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder={t("translation:labels.globalSearchLabel")} size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip={t("translation:labels.shoeHideColumnLabel")} tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltipOptions={{ position: 'bottom' }} tooltip={t("masterLevy:AddLevy")} onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltipOptions={{ position: 'bottom' }} tooltip="Export As CSV" onClick={this.export}></Button>

                    </div>
                </div>
                <div className="table-custom">
                    {/* <div className="header-right-option"> */}
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.LevyList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.LevyList.length}
                        exportFilename={t("masterLevy:LevyList")}
                        currentPageReportTemplate={this.state.str}
                        // scrollable={true} scrollHeight="250px"
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
                    <ModalHeader toggle={this.reset}>{t("masterLevy:ModalHeading." + this.state.heading + "")}</ModalHeader>
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
                                        <label for="country">{t("masterLevy:Country.label")}*</label>
                                        <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                                            <option value=''>{t("masterLevy:Country.defaultValue")}</option>
                                            {this.state.countryarr.map((type, i) => {
                                                return (<option value={type.key}>{type.label}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback" >{t("masterLevy:Country.error")}</em>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6">
                                    <div className="input-box">
                                        <label>{this.state.effectivedate}</label>
                                        <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                            min={moment().format('YYYY-MM-DD')}
                                            max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                        >
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter effective date</em>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col md="6">
                                    <div className="input-box">
                                        <label for="type">{t("masterLevy:Type.label")}*</label>
                                        <Input type="select" name="type" id="type" onChange={(e) => this.selectType(e.target.value, 'type')} value={this.state.type}>
                                            <option value=''>{t("masterLevy:Type.defaultValue")}</option>
                                            {this.state.typearr.map((type, i) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback" >{t("masterLevy:Type.error")}</em>
                                    </div>
                                </Col>
                            </Row>

                            {(this.state.type === 'ONE RATE') ? (
                                <Row style={{ marginTop: "10px" }}>

                                    <Col md="6">
                                        <div className="input-box">
                                            <label for="rate1">{t("masterLevy:Rate1.label")}*</label>
                                            <Input type="text" name="rate1" id="rate1" placeholder={t("masterLevy:Rate1.label")} onChange={(e) => this.handleChange(e)} value={this.state.rate1}>
                                            </Input>
                                            <em className="error invalid-feedback" >{t("masterLevy:Rate1.error_blank")}</em>
                                        </div>
                                    </Col>



                                    <Col md="6">
                                        <div className="input-box">
                                            <label for="rateBasis1">{t("masterLevy:RateBasis1.label")}*</label>
                                            <Input type="select" name="rateBasis1" id="rateBasis1" onChange={(e) => this.selectType(e.target.value, 'rateBasis1')} value={this.state.rateBasis1}>
                                                <option value=''>{t("masterLevy:RateBasis1.defaultValue")}</option>
                                                {this.state.rateBasis1arr.map((type, i) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </Input>
                                            <em className="error invalid-feedback" >{t("masterLevy:RateBasis1.error")}</em>
                                        </div>
                                    </Col>
                                    {/* <Col md="4"> */}

                                </Row>
                            ) : (
                                    null
                                )}

                            {(this.state.type === 'ADD TWO RATES') ? (
                                <div>
                                    <Row style={{ marginTop: "10px" }}>
                                        <Col md="6">
                                            <div className="input-box">
                                                <label for="rate1">{t("masterLevy:Rate1.label")}*</label>
                                                <Input type="text" name="rate1" id="rate1" placeholder={t("masterLevy:Rate1.label")} onChange={(e) => this.handleChange(e)} value={this.state.rate1}>
                                                </Input>
                                                <em className="error invalid-feedback">{t("masterLevy:Rate1.error_blank")}</em>
                                            </div>
                                        </Col>


                                        <Col md="6">
                                            <div className="input-box">
                                                <label for="rateBasis1">{t("masterLevy:RateBasis1.label")}*</label>
                                                <Input type="select" name="rateBasis1" id="rateBasis1" onChange={(e) => this.selectType(e.target.value, 'rateBasis1')} value={this.state.rateBasis1}>
                                                    <option value=''>{t("masterLevy:RateBasis1.defaultValue")}</option>
                                                    {this.state.rateBasis1arr.map((type, i) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback" >{t("masterLevy:RateBasis1.error")}</em>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "10px" }}>
                                        <Col md="6">
                                            <div className="input-box">
                                                <label for="rate2">{t("masterLevy:Rate2.label")}*</label>
                                                <Input type="text" name="rate2" id="rate2" placeholder={t("masterLevy:Rate2.label")} onChange={(e) => this.handleChange(e)} value={this.state.rate2}>
                                                </Input>
                                                <em className="error invalid-feedback" >{t("masterLevy:Rate2.error_blank")}</em>
                                            </div>
                                        </Col>

                                        <Col md="6">
                                            <div className="input-box">
                                                <label for="rateBasis2">{t("masterLevy:RateBasis2.label")}*</label>
                                                <Input type="select" name="rateBasis2" id="rateBasis2" onChange={(e) => this.selectType(e.target.value, 'rateBasis2')} value={this.state.rateBasis2}>

                                                    <option value=''>{t("masterLevy:RateBasis2.defaultValue")}</option>
                                                    {this.state.rateBasis2arr.map((type, i) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback">{t("masterLevy:RateBasis2.error")}</em>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                    null
                                )}

                            {(this.state.type === 'FIXED AMOUNT') ? (
                                <Row style={{ marginTop: "10px" }}>
                                    <Col md="6">
                                        <div className="input-box">
                                            <label for="eur">{t("masterLevy:AmountInEUR.label")}*</label>
                                            <Input type="text" name="amountInEUR" id="amountInEUR" placeholder={t("masterLevy:AmountInEUR.label")} onChange={(e) => this.handleChange(e)} value={this.state.amountInEUR}>
                                            </Input>
                                            <em className="error invalid-feedback" >{t("masterLevy:AmountInEUR.error_blank")}</em>
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="input-box">
                                            <label for="gbp">{t("masterLevy:AmountInGBP.label")}*</label>
                                            <Input type="text" name="amountInGBP" id="amountInGBP" placeholder={t("masterLevy:AmountInGBP.label")} onChange={(e) => this.handleChange(e)} value={this.state.amountInGBP}>
                                            </Input>
                                            <em className="error invalid-feedback" >{t("masterLevy:AmountInGBP.error_blank")}</em>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                    null
                                )}
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.Save()}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                        <BTN color="primary" onClick={this.reset}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>{t("masterLevy:Delete.label")}</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete Levy for {this.state.country}?
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

export default withTranslation()(Levy);