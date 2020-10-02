import React, { Component } from 'react';
import { Collapse, Button as BTN, Card, CardHeader, CardBody, Col, Row, Input } from 'reactstrap';
import { Button } from 'primereact/button';
import api from '../../utils/apiClient';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig } from '../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import APIConstant from '../../utils/constants';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';


class PolicyDetails extends Component {
    constructor(props) {
        super(props);
        let columns = [
            // { field: "SrNo", header: "Sr No.", sortable: true, filter: true, id: 0 },
            // { field: "Type", header: "Type.", sortable: true, filter: true, id: 1 },
            // { field: "PolicyNo", header: "Policy No.", sortable: true, filter: true, id: 2 },
            // { field: "BoatType", header: "Outstanding Amount", sortable: true, filter: true, id: 3 },
            // { field: "Status", header: "Status", sortable: true, filter: true, id: 4 },
            // { field: "Department", header: "Department", sortable: true, filter: true, id: 4 },
            // { field: "Vessel", header: "Vessel", sortable: true, filter: true, id: 5 },
            // { field: "Value", header: "Value.", sortable: true, filter: true, id: 6 },
            // { field: "Premiun", header: "Premiun", sortable: true, filter: true, id: 7 },
            // { field: "Created", header: "Created", sortable: true, filter: true, id: 8 },
            // { field: "Renewal", header: "Renewal", sortable: true, filter: true, id: 9 },
            // { field: "Updated", header: "Updated", sortable: true, filter: true, id: 10 },
            // { field: "LastUpdatedBy", header: "Last Updated By", sortable: true, filter: true, id: 11 },
            // { field: "CreatedBy", header: "Created by", sortable: true, filter: true, id: 12 },
            // { field: "Currency", header: "Currency", sortable: true, filter: true, id: 13 },
            // { field: "Client", header: "Client", sortable: true, filter: true, id: 14 },
            // { field: "Country", header: "Country", sortable: true, filter: true, id: 15 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 0 },
            { body: this.formatPolicyDetail.bind(this), field: "PolicyData", header: "Policy No/Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { body: this.formatContactDetail.bind(this), field: "ClientDetails", header: "Client/Contacts", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.formatVesselData.bind(this), field: "VesselDetails", header: "Vessel Class/Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "InsuranceCompanyName", header: "Insurer", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { body: this.formatPremiun.bind(this), header: "Sum Insured/Premium", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.formatDate.bind(this), field: "InceptionDate", header: "Inception/Renewal", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "Department", header: "Department", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
        ];

        this.state = {
            toggleModalAdd: false,
            contactShown: '',
            cols: columns,
            clientArray: [],
            client: '',
            phoneArray: [],
            phone: '',
            str: '',
            emailArray: [],
            email: '',
            policyNumberArray: [],
            policyNumber: '',
            binderArray: [],
            binder: '',
            subBinderArray: [],
            subBinder: '',
            policyStartFromDate: '',
            policyStartToDate: '',
            policyRenewalFromDate: '',
            policyRenewalToDate: '',
            agentserviceCenter: '',
            sumInsuredfrom: '',
            sumInsuredTo: '',
            arr: [],
            selectedPage: 0,
            filteredcontactsSingle: null,
            contactArray: [],
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            custom: false,
            isExpand: false,
            countryList: [],
            country: '',
            languageArray: [],
            currencyArray: [],
            policyStatusList: [],
            policyStatus: '',
            policyTypeArray: [],
            policyType: '',
            vesselClassArray: [],
            vesselClassCopy: [],
            vesselClass: '',
            vesselType: '',
            vesselTypeArray: []
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    edit(rowData) {
        this.props.history.push({
            pathname: '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1',
            state: {
                PolicyId: rowData.PolicyId,
                tab: 1
            }
        });
    }

    formatPolicyDetail(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.PolicyType}</p>
                <p>{rowData.PolicyNumber}</p>
            </div>
        )
    }

    formatContactDetail(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.Name}</p>
                <p>{CommonConfig.formatPhoneNumber(rowData.CountryCode + rowData.PhoneNumber)}</p>
                <p>{rowData.Email}</p>
            </div>
        )
    }

    formatVesselData(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.VesselClassName}</p>
                <p>{rowData.VesselTypeName}</p>
            </div>
        )
    }

    formatPremiun(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.SumInsured}</p>
                <p>{rowData.CurrentPremium}</p>
            </div>
        )
    }

    formatDate(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.InceptionDate}</p>
                <p>{rowData.RenewalDate}</p>
            </div>
        )
    }

    actionTemplate(rowData, column) {
        return <div className="policy-list-data">
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.edit(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button> */}
        </div>;
    }

    export() {
        this.dt.exportCSV();
    }

    componentDidMount() {
        this.getDropDownValues('COUNTRY', 'countryList');
        this.getDropDownValues('POLICYSTATUS', 'policyStatusList');
        this.getDropDownValues('POLICYTYPE', 'policyTypeArray');
        this.getLanguage();
        this.getCurrency();
        this.getVesselClass();
        this.getPolicyList(0);
        this.getPolicyClientName();
        this.getAllEmailList();
        this.getAllcontactList();
        this.getAllpolicyNumber();
        this.getAllBinder();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.match.isExact !== this.props.match.isExact) {
            setTimeout(() => {
                this.getPolicyList(0);
            }, 100);
        }
    }

    getPolicyClientName() {
        try {
            api.post(APIConstant.path.getPolicyClientName).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].EntityId,
                            label: res.data.data[i].FullName,
                        });
                    }
                    this.setState({ clientArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllEmailList() {
        try {
            api.post(APIConstant.path.getAllEmailList).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].Email,
                            label: res.data.data[i].Email,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ emailArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllcontactList() {
        try {
            api.post(APIConstant.path.getAllcontactList).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].PhoneNumber,
                            label: res.data.data[i].PhoneNumber,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ phoneArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllpolicyNumber() {
        try {
            api.post(APIConstant.path.getAllpolicyNumber).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].PolicyNumber,
                            label: res.data.data[i].PolicyNumber,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ policyNumberArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllBinder() {
        try {
            let data = {};
            api.post(APIConstant.path.getAllBinder, data).then(res => {
                if (res.success) {
                    console.log('res.datares.data', res.data.res);

                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.res.length; i++) {
                        formattedData.push({
                            value: res.data.res[i].BinderId,
                            label: res.data.res[i].UMRN,
                        });
                    }

                    this.setState({ binderArray: formattedData });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
        }
    }

    getSubBinderByBinderId(id) {
        debugger
        try {
            let data = {
                BinderId: id
            };
            api.post(APIConstant.path.getSubBinderByBinderId, data).then(res => {
                if (res.success) {
                    console.log('res.datares.data', res.data.res);

                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.res.length; i++) {
                        formattedData.push({
                            value: res.data.res[i].SubBinderId,
                            label: res.data.res[i].Title,
                        });
                    }

                    this.setState({ subBinderArray: formattedData });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
        }
    }

    getLanguage() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                if (res.success) {
                    this.setState({ languageArray: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getCurrency() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                if (res.success) {
                    this.setState({ currencyArray: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getVesselClass() {
        try {
            api.get(APIConstant.path.getVesselClass).then(res => {
                if (res.success) {
                    let formattedArray = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedArray.push({
                            label: res.data[i].VesselClassName,
                            value: res.data[i].VesselClassId
                        });
                    }
                    this.setState({ vesselClassArray: formattedArray, vesselClassCopy: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }

    }

    getVesselType(id) {
        try {
            const data = {
                VesselClassId: id
            };
            api.post(APIConstant.path.getVesselType, data).then(res => {
                if (res.success) {
                    console.log('-o-p-o-o-p-o-p-p-o', res.data);

                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselTypeName,
                            value: res.data[i].VesselTypeId,
                        });
                    }
                    this.setState({ vesselTypeArray: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }

    }

    getPolicyList(IsAdvance) {
        try {
            let data = {};
            var splitData = this.props.location.pathname.split("/");
            if (splitData[2] !== undefined && splitData[3] !== undefined) {
                data = {
                    entityId: splitData[2] || '',
                    entityType: splitData[3] || '',
                    isAdvance: 0,
                };
            } else {
                data = {
                    isAdvance: IsAdvance
                }
            }
            console.log('0o-0o-o-kl0k-0k-0k-0k-0k-0k-0kj', data);

            api.post('api/getPolicyList', data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        // console.log("getPolicyList > ", res.data[i]);
                        formattedData.push({
                            SrNo: i + 1,
                            Name: res.data[i].Name,
                            CountryCode: res.data[i].CountryCode,
                            PhoneNumber: res.data[i].PhoneNumber,
                            Email: res.data[i].Email,
                            PolicyId: res.data[i].PolicyId,
                            PolicyType: res.data[i].PolicyType,
                            PolicyNumber: res.data[i].PolicyNumber,
                            Status: res.data[i].Status,
                            Department: res.data[i].Department,
                            InsuranceCompanyName: res.data[i].InsuranceCompanyName,
                            Vessel: res.data[i].VesselName,
                            Value: res.data[i].SumInsured,
                            VesselClassName: res.data[i].VesselClassName,
                            VesselTypeName: res.data[i].VesselTypeName,
                            SumInsured: res.data[i].SumInsured,
                            CurrentPremium: res.data[i].CurrentPremium,
                            InceptionDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker),
                            RenewalDate: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.forDatePicker),
                            Premium: "",
                            Created: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                            Renewal: moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                            Updated: moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateOnly),
                            LastUpdatedBy: "",
                            CreatedBy: res.data[i].CreatedBy,
                            LastUpdated: "",
                            Currency: res.data[i].Currency,
                            Client: res.data[i].EntityType === 'person' ? res.data[i].Forename + '' + res.data[i].SurName : "",
                            Country: res.data[i].Country,
                            ClientDetails: res.data[i].Name + "" + CommonConfig.formatPhoneNumber(res.data[i].CountryCode + res.data[i].PhoneNumber) + "" + res.data[i].Email,
                            PolicyData: res.data[i].PolicyType + "" + res.data[i].PolicyNumber,
                            VesselDetails: res.data[i].VesselClassName + "" + res.data[i].VesselTypeName,
                        });
                    }

                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ arr: formattedData, str: str });
                } else {
                }
            }).catch(err => {

            });
        } catch (err) {

        }
    }

    filterSingle(e) {
        let results = this.state.contactArray.filter((contact) => {
            return contact.label.toLowerCase().startsWith(e.query.toLowerCase());
        });
        this.setState({ filteredcontactsSingle: results });

    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getDropDownValues(stringMapType, setStateName) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    toggleLargeAdd = () => {
        this.setState({ toggleModalAdd: false });
    }

    gotoNextPage() {
        this.props.history.push('/newPolicy1');
    }

    toggleCustom = (tab) => {
        const prevState = this.state.custom;
        const state = prevState.map((x, index) => tab === index ? !x : false);
        this.setState({ custom: state });
    }

    selectType(value, type) {
        if (type === 'vesselclass') {

            if (value === '' || value === null) {
                // this.setState({ VesselClassError: true, vesselClass: value.value });
                // this.show('vesselclass', true);
            } else {
                this.setState({ VesselClassError: false, vesselClass: value });
                // this.show('vesselclass', false);
                this.getVesselType(value.value);
            }
        }
        if (type === 'client') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ client: value });
            } else {
                this.setState({ client: value.value });
            }
        }
        if (type === 'binder') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ binder: value });
            } else {
                this.getSubBinderByBinderId(value);
                this.setState({ binder: value.value });
            }
        }
    }

    filterData() {
        let date = {

        }
    }

    redirectToNewPolicy = () => {
        var splitData = this.props.location.pathname.split("/");
        if (splitData[2] !== undefined && splitData[3] !== undefined) {
            this.props.history.push({
                pathname: '/CreatePolicy/' + splitData[2],
                state: {
                    id: splitData[2]
                }
            });
        } else {
            this.props.history.push({
                pathname: '/NewPolicy/',
                state: {}
            });
        }
    }

    render() {
        const { t } = this.props;
        var header = <div>
            <Row>
                <Col md="1">
                    <MultiSelect value={this.state.cols} options={this.colOptions}
                        fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                        onChange={this.onColumnToggle} style={{ width: '50px' }} />
                </Col>
                <Col md="11">
                    <div style={{ textAlign: 'right' }}>
                        <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                        <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />

                        <Button type="button" icon="pi pi-external-link" iconPos="left" tooltip="Export as CSV" tooltipOptions={{ position: 'left' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </Col>
            </Row>
        </div>;

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("policyList:PolicyList")}</h1>

                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="New Policy Setup" tooltipOptions={{ position: 'bottom' }} onClick={() => this.redirectToNewPolicy()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>
                {/* <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {t("policyList:SearchPolicy")}
                                    <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Client.label")}</label>
                                            <Select name="client" id="client" options={this.state.clientArray} value={this.state.client} onChange={(data) => this.selectType(data, 'client')} placeholder="Select" />
                                            <em id="cruisingRangeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Phone.label")}</label>
                                            <Select name="phone" id="phone" options={this.state.phoneArray} value={this.state.phone} onChange={(data) => this.selectType(data, 'phone')} placeholder="Select" />
                                            <em id="cruisingRangeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Email.label")}</label>
                                            <Select name="email" id="email" options={this.state.emailArray} value={this.state.email} onChange={(data) => this.selectType(data, 'email')} placeholder="Select" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:PolicyNumber.label")}</label>
                                            <Select name="policyNumber" id="policyNumber" options={this.state.policyNumberArray} value={this.state.policyNumber} onChange={(data) => this.selectType(data, 'policyNumber')} placeholder="Select" />
                                            <em id="cruisingRangeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Binder.label")}</label>
                                            <Select name="binder" id="binder" options={this.state.binderArray} value={this.state.binder} onChange={(data) => this.selectType(data, 'binder')} placeholder="Select" />
                                            <em id="cruisingRangeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:SubBinder.label")}</label>
                                            <Select name="subBinder" id="subBinder" options={this.state.subBinderArray} value={this.state.subBinder} onChange={(data) => this.selectType(data, 'subBinder')} placeholder="Select" />
                                            <em id="cruisingRangeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="5">
                                        <div className="input-box">
                                            <label>{t("policyList:PolicyStartDateFrom.label")}</label>

                                            <DatePicker name="dob" value={this.state.dob} maxDate={moment().toDate()} minDate={moment().subtract(100, 'years').toDate()}
                                            />

                                            <span style={{ paddingRight: 5, paddingLeft: 5 }}>{t("policyList:PolicyStartDateFrom.tolabel")}</span>

                                            <DatePicker name="dob"
                                                value={this.state.dob} maxDate={moment().toDate()} minDate={moment().subtract(100, 'years').toDate()}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="input-box">
                                            <label>{t("policyList:PolicyRenewalDateFrom.label")}</label>

                                            <DatePicker name="dob"
                                                value={this.state.dob} maxDate={moment().toDate()} minDate={moment().subtract(100, 'years').toDate()}
                                            />

                                            <span style={{ paddingRight: 5, paddingLeft: 5 }}>{t("policyList:PolicyRenewalDateFrom.tolabel")}</span>

                                            <DatePicker name="dob" value={this.state.dob} maxDate={moment().toDate()} minDate={moment().subtract(100, 'years').toDate()}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Country.label")}</label>
                                            <Select options={this.state.countryList} value={this.state.country}
                                                // onChange={(data) => this.selectType(data, 'country')}
                                                placeholder={t("policyList:Country.label")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Language.label")}</label>
                                            <Input type="select" name="language" id="language">
                                                <option value=''>{t("policyList:Language.defaultValue")}</option>
                                                {this.state.languageArray.map((language, i) => {
                                                    return (<option value={language.LanguageId} key={i}>{language.Language}</option>)
                                                })
                                                }
                                            </Input>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Currency.label")}</label>
                                            <Input type="select" name="currency" id="currency">
                                                <option value=''>{t("policyList:Currency.defaultValue")}</option>
                                                {this.state.currencyArray.map((currency, i) => {
                                                    return (<option value={currency.CurrncyCode} key={i}>{currency.CurrncyCode}</option>)
                                                })
                                                }
                                            </Input>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:PolicyStatus.label")}</label>
                                            <Input type="select" name="policystatus" id="policystatus" value={this.state.policyStatus}>
                                                {this.state.policyStatusList.map((policyStatus, i) => {
                                                    return (
                                                        <option value={policyStatus.StringMapKey} key={i} selected={policyStatus.StringMapKey === 'Active' ? true : false}>
                                                            {policyStatus.StringMapName}
                                                        </option>
                                                    )
                                                })
                                                }
                                            </Input>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:PolicyType.label")}</label>
                                            <Input type="select" name="policytype" id="policytype">
                                                <option value={this.state.policyType}>{t("policyList:PolicyType.defaultValue")}</option>
                                                {this.state.policyTypeArray.map((policytype, i) => {
                                                    return (<option value={policytype.StringMapKey} key={i}>{policytype.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:VesselClass.label")}</label>
                                            <Select id="vesselclass" name="vesselclass" options={this.state.vesselClassArray} value={this.state.vesselClass}
                                                onChange={(e) => this.selectType(e, 'vesselclass')}
                                                placeholder={t("policyList:VesselClass.label")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:VesselType.label")}</label>
                                            <Select id="vesselType" name="vesselType" options={this.state.vesselTypeArray} value={this.state.vesselType}
                                                onChange={(e) => this.selectType(e, 'vesselType')}
                                                placeholder={t("policyList:VesselType.label")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:Agent/ServiceCenter.label")}</label>
                                            <Input type="text" name="phonetype" id="phonetype"></Input>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:SumInsuredFrom.label")}</label>
                                            <Input type="text" name="phonetype" id="phonetype"></Input>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="input-box">
                                            <label>{t("policyList:SumInsuredTo.label")}</label>
                                            <Input type="text" name="phonetype" id="phonetype"></Input>
                                        </div>
                                    </Col>
                                </Row>

                                <div style={{ width: "100%", textAlign: "right" }}>
                                    <BTN color="success" style={{ marginRight: '.5em', borderRadius: "20px" }} title="Go" onClick={() => this.filterData()}> Go </BTN>
                                </div>
                            </CardBody>

                        </Collapse>
                    </Card>
                </div> */}
                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.arr.length} exportFilename="Policy List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                    >
                        {columns}
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default withTranslation()(PolicyDetails);
