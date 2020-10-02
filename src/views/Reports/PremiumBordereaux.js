import React, { Component } from 'react';
import api from '../../utils/apiClient';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CommonConfig } from '../../utils/constants';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';
import { TabView, TabPanel } from 'primereact/tabview';
import SavedBordereaux from './SavedBordereaux';

class PremiumBordereaux extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "ClientName", header: "Name", sortable: true, filter: true, id: 1, style: { 'width': '150px' } },
            { field: "TransactionDescription", header: "Transaction", sortable: true, filter: true, id: 2, style: { 'width': '200px' } },
            { field: "PaymentStatus", header: "Status", sortable: true, filter: true, id: 3, style: { 'width': '100px' } },
            { field: "SubAgentId", header: "Sub Agent Id", sortable: true, filter: true, id: 4, style: { 'width': '100px' } },
            { field: "Department", header: "Department", sortable: true, filter: true, id: 5, style: { 'width': '150px' } },
            { field: "SourceName", header: "Source Name", sortable: true, filter: true, id: 6, style: { 'width': '200px' } },
            { field: "VesselRegistrationLocation", header: "Where is The boat Registered?", sortable: true, filter: true, id: 7, style: { 'width': '200px' } },
            { field: "Income", header: "Income", sortable: true, filter: true, id: 8, style: { 'width': '100px' } },
            { field: "Outstanding", header: "Outstanding", sortable: true, filter: true, id: 9, style: { 'width': '150px' } },
            { field: "Gross", header: "Gross", sortable: true, filter: true, id: 10, style: { 'width': '150px' } },
            { field: "GrossLessLevy", header: "Gross Less Levy", sortable: true, filter: true, id: 11, style: { 'width': '150px' } },
            { field: "TotalCommission", header: "Total Commission", sortable: true, filter: true, id: 12, style: { 'width': '150px' } },
            { field: "ArcFees", header: "Arc & Fees (Add On Cost)", sortable: true, filter: true, id: 13, style: { 'width': '150px' } },
            { field: "AdminFeeAmount", header: "FEES (Admin Fee)", sortable: true, filter: true, id: 14, style: { 'width': '150px' } },
            { field: "GovtLevyPercent", header: "Gvt Levy Rate", sortable: true, filter: true, id: 15, style: { 'width': '150px' } },
            { field: "GovtLevyAmount", header: "Gvt Levy Amount", sortable: true, filter: true, id: 16, style: { 'width': '150px' } },
            { field: "NetPay", header: "Net Pay", sortable: true, filter: true, id: 19, style: { 'width': '150px' } },
            { field: "TransactionDate", header: "Date Completed", sortable: true, filter: true, id: 20, style: { 'width': '150px' } },
            { field: "InsuranceCompany", header: "Insurance Company (Binder Name)", sortable: true, filter: true, id: 21, style: { 'width': '250px' } },
            { field: "PolicyClass", header: "Policy Class", sortable: true, filter: true, id: 22, style: { 'width': '150px' } },
            { field: "PolicyType", header: "Policy Type", sortable: true, filter: true, id: 23, style: { 'width': '150px' } },
            { field: "PolicyStatus", header: "Policy Status", sortable: true, filter: true, id: 24, style: { 'width': '150px' } },
            { field: "CruisingRange", header: "Cruising Range", sortable: true, filter: true, id: 25, style: { 'width': '250px' } },
            { field: "MooringName", header: "Mooring Name", sortable: true, filter: true, id: 26, style: { 'width': '200px' } },
            { field: "MooringType", header: "Mooring Type", sortable: true, filter: true, id: 27, style: { 'width': '200px' } },
            { field: "GeoTags", header: "Geo Tags", sortable: true, filter: true, id: 28, style: { 'width': '200px' } },
            { field: "VesselName", header: "Vessel Name", sortable: true, filter: true, id: 29, style: { 'width': '200px' } },
            { field: "YearBuilt", header: "Year Built", sortable: true, filter: true, id: 'YearBuilt', style: { 'width': '100px' } },
            { field: "VesselMakeModel", header: "Vessel Make & Mode", sortable: true, filter: true, id: 30, style: { 'width': '200px' } },
            { field: "SumInsured", header: "Sum Insured", sortable: true, filter: true, id: 31, style: { 'width': '150px' } },
            { field: "RRE", header: "RRE", sortable: true, filter: true, id: 32, style: { 'width': '100px' } },
            { field: "ExcessAmount", header: "Excess Amount", sortable: true, filter: true, id: 33, style: { 'width': '150px' } },
            { field: "SurveyDueDate", header: "Survey Due Date", sortable: true, filter: true, id: 34, style: { 'width': '150px' } },
            { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 35, style: { 'width': '150px' } },
            { field: "PolicyCreated", header: "Policy Created", sortable: true, filter: true, id: 36, style: { 'width': '150px' } },
            { field: "PolicyRenewalDate", header: "Policy Renewal Date", sortable: true, filter: true, id: 37, style: { 'width': '150px' } },
            { field: "PolicyLastBound", header: "Policy Last Bound", sortable: true, filter: true, id: 38, style: { 'width': '150px' } },
            { field: "PolicyUpdated", header: "Policy Updated", sortable: true, filter: true, id: 39, style: { 'width': '150px' } },
            { field: "YCommissionRate", header: "Yachtsman Commision Rate", sortable: true, filter: true, id: 40, style: { 'width': '150px' } },
            { field: "YCommissionAmount", header: "Yachtsman Commision Amount", sortable: true, filter: true, id: 41, style: { 'width': '150px' } },
            { field: "AgentCommissionRate", header: "Agent Commission Rate", sortable: true, filter: true, id: 17, style: { 'width': '150px' } },
            { field: "AgentCommissionAmount", header: "Agent Commission Amount", sortable: true, filter: true, id: 18, style: { 'width': '150px' } },
            { field: "TransactionCreated", header: "Transaction Created", sortable: true, filter: true, id: 42, style: { 'width': '150px' } },
            { field: "TransactionCompleted", header: "Transaction Completed", sortable: true, filter: true, id: 43, style: { 'width': '150px' } },
            { field: "PXStatus", header: "PX Status", sortable: true, filter: true, id: 44, style: { 'width': '150px' } },
            { field: "PaymentMode", header: "PX Type", sortable: true, filter: true, id: 45, style: { 'width': '200px' } },
            { field: "Currency", header: "PX Currency", sortable: true, filter: true, id: 46, style: { 'width': '150px' } },
            { field: "MidtermAdjustmentEffectiveDate", header: "Midterm Adjustment Effective Date", sortable: true, filter: true, id: 47, style: { 'width': '150px' } },
            { field: "ReasonForCancellation", header: "Reason for Cancellation", sortable: true, filter: true, id: 48, style: { 'width': '200px' } },
            { field: "PolicyIssuanceDate", header: "Policy Issuance Date (Policy Document Generation Date)", sortable: true, filter: true, id: 49, style: { 'width': '200px' } },
            { field: "ContactAddress", header: "Contact Address", sortable: true, filter: true, id: 50, style: { 'width': '300px' } },
            { field: "Email", header: "Email", sortable: true, filter: true, id: 51, style: { 'width': '300px' } },
            { field: "Phone", header: "Phone", sortable: true, filter: true, id: 52, style: { 'width': '200px' } }
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            arr: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            searchCollapse: false,
            transactionDate: moment().format('YYYY-MM'),
            transactionDateError: false,
            currencyList: [],
            countryList: [],
            currency: 'All',
            currencyError: false,
            country: 'All',
            countryError: false,
            BODList: [],
            BOD: 'LastBindDate',
            BODError: false,
            statementTypeList: [],
            statementType: 'Regular',
            statementTypeError: false
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        //this.getPremiumBordereauxDetails();
        this.getCurrency();
        this.getDropDownValues('BORDEREAUXCOUNTRY', 'countryList', 'StringMapName');
        this.getDropDownValues('BOD', 'BODList', 'StringMapName');
        this.getDropDownValues('BSTATEMENTTYPE', 'statementTypeList', 'SortOrder');
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
            });
        } catch (error) {
        }
    }

    getCurrency() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                if (res.success) {
                    this.setState({ currencyList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getPremiumBordereauxDetails() {
        var data = {
            languageId: this.state.LanguageId,
            transactionDate: this.state.transactionDate,
            country: this.state.country,
            currency: this.state.currency,
            BOD: this.state.BOD,
            statementType: this.state.statementType,
            loggedInUserId: CommonConfig.loggedInUserId()
        };
        console.log("getPremiumBordereauxDetails----", data);
        api.post('api/getPremiumBordereauxDetails', data).then(res => {
            console.log("getPremiumBordereauxDetails----", res);
            if (res.success) {
                if (res.data.success) {
                    toast.success(res.data.message);
                    console.log("getPremiumBordereauxDetails---- IN");
                } else {
                    toast.error(res.data.message);
                }
            } else {
                toast.error(res.data.message);
            }
        });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    export() {
        this.dt.exportCSV();
    }

    filterData() {
        if (this.state.transactionDateError) {
            toast.error("Please select Month/Year.");
            return false;
        } else {
            this.getPremiumBordereauxDetails();
        }
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'transactionDate') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ transactionDate: e.target.value, transactionDateError: true });
                this.show('transactionDate', true, 'transactionDateError', 'Please select Month/Year');
            } else {
                this.setState({ transactionDate: e.target.value, transactionDateError: false });
                this.show('transactionDate', false, 'transactionDateError', '');
            }
        }
    }

    selectType(value, type) {
        if (type === 'country') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ countryError: true, country: value });
                this.show('country', true, "countryError", "Please select country");
            } else {
                this.setState({ countryError: false, country: value });
                this.show('country', false, "countryError", "");

            }
        }

        if (type === 'currency') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ currencyError: true, currency: value });
                this.show('currency', true, "currencyError", "Please select currency");
            } else {
                this.setState({ currencyError: false, currency: value });
                this.show('currency', false, "currencyError", "");

            }
        }

        if (type === 'BOD') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ BODError: true, BOD: value });
                this.show('BOD', true, "BODError", "Please select Based On Date");
            } else {
                this.setState({ BODError: false, BOD: value });
                this.show('BOD', false, "BODError", "");

            }
        }

        if (type === 'statementType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ statementTypeError: true, statementType: value });
                this.show('statementType', true, "statementTypeError", "Please select Statement Type");
            } else {
                this.setState({ statementTypeError: false, statementType: value });
                this.show('statementType', false, "statementTypeError", "");

            }
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

    render() {
        const { t } = this.props;
        var header = null;

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
            />;
        });

        return (
            <div>
                <div className="content-section implementation">
                    <TabView renderActiveOnly={true}>
                        <TabPanel header="Generate Bordereaux">

                            <div className="filter-data">
                                <Row>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label>Month/Year</label>
                                            <Input type="month" id="transactionDate" name="transactionDate"
                                                value={this.state.transactionDate}
                                                onChange={(e) => this.handleChange(e, 'transactionDate')}
                                            ></Input>
                                            <em id="transactionDateError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label>Type</label>
                                            <Input type="select" name="statementType" id="statementType" onChange={(e) => this.selectType(e.target.value, 'statementType')} value={this.state.statementType}>
                                                {this.state.statementTypeList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="statementTypeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label>Country</label>
                                            <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                                                {this.state.countryList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="countryError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label>Curreny</label>
                                            <Input type="select" name="currency" id="currency" onChange={(e) => this.selectType(e.target.value, 'currency')} value={this.state.currency}>
                                                <option value="All">All</option>
                                                {this.state.currencyList.map((currency, i) => {
                                                    return (<option value={currency.CurrncyCode} key={i}>{currency.CurrncyCode}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="currencyError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label>Based On Date</label>
                                            <Input type="select" name="BOD" id="BOD" onChange={(e) => this.selectType(e.target.value, 'BOD')} value={this.state.BOD}>
                                                {this.state.BODList.map((BOD, i) => {
                                                    return (<option value={BOD.StringMapKey} key={i}>{BOD.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="BODError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div>&nbsp;</div>
                                        <BTN color="success" title="Search" onClick={() => this.filterData()}> Generate </BTN>
                                    </Col>
                                </Row>
                            </div>

                        </TabPanel>

                        <TabPanel header="Saved Bordereaux">

                            <SavedBordereaux {...this.props} />

                        </TabPanel>

                    </TabView>

                    {/* <BinderInfo {...this.props} /> */}

                    {/* <div className="basic-header">
                        <h1>Premium Bordereaux</h1>
                        <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                        fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                        onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                        </div>
                    </div> 
                    
                    <div className="table-custom">
                        <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Premium Bordereaux"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="expand">
                        {columns}
                        </DataTable>
                    </div> 
                    */}
                </div>

            </div>
        )
    }
}

export default withTranslation()(PremiumBordereaux);
