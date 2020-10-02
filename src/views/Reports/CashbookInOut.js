import React, { Component } from 'react';
import api from '../../utils/apiClient';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CommonConfig } from '../../utils/constants';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';

class CashbookInOut extends Component {

    constructor(props) {
        super(props);

        let columns = [
              { field: "TransactionDate", header: "Transaction Date",  sortable: true, filter: true, id: 'TransactionDate' },
            { field: "TransactionInOut", header: "IN/OUT",  sortable: true, filter: true, id: 0 },
            { field: "TransactionId", header: "Transaction ID",  sortable: true, filter: true, id: 1 },
            { field: "PaymentMode", header: "Payment Type",  sortable: true, filter: true, id: 2 },
            { field: "PaymentAmount", header: "Payment Amount",  sortable: true, filter: true, id: 3 },
            { field: "AdminFeeAmount", header: "Payment Admin Fee",  sortable: true, filter: true, id: 4 },
            // { field: "BankCharge", header: "Payment Bank Charge - Does not apply",  sortable: true, filter: true, id: 5 },
            { field: "AgencyCommissionAmount", header: "Payment Agency Commission",  sortable: true, filter: true, id: 6 },
            { field: "YCommissionAmount", header: "Payment Yachtsman Commission",  sortable: true, filter: true, id: 7 },
            { field: "GovtLevyAmount", header: "Payment Government Levy",  sortable: true, filter: true, id: 8 },
            { field: "DateCompleted", header: "Payment Date Completed",  sortable: true, filter: true, id: 10 },
            { field: "ClientName", header: "Client",  sortable: true, filter: true, id: 11 },
            { field: "PolicyNumber", header: "Policy ID",  sortable: true, filter: true, id: 12 },
            { field: "VesselClassName", header: "Vessel Class",  sortable: true, filter: true, id: 13 },
            { field: "TransactionIdType", header: "Transaction: #ID - Type",  sortable: true, filter: true, id: 14 },
            { field: "InsuranceCompany", header: "Insurer",  sortable: true, filter: true, id: 15 },
            { field: "SubAgentId", header: "Sub-Agent ID",  sortable: true, filter: true, id: 16 },
            { field: "SubAgentName", header: "Sub-Agent Name and Company",  sortable: true, filter: true, id: 17 },
            { field: "Interest", header: "PP Interest",  sortable: true, filter: true, id: 18 },
            { field: "PlanAmount", header: "Payment Plan Amount",  sortable: true, filter: true, id: 19 }
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
            transactionDate: moment().format('YYYY-MM-DD'),
            transactionDateError: false,
            DateTypeList: [],
            DateType:'Custom',
            DateTypeError: false,
            FromDate: moment().format('YYYY-MM-DD'),
            ToDate: moment().format('YYYY-MM-DD'),
            FromDateError: false,
            ToDateError: false,
            MONTHList: [],
            MONTH:'01',
            MONTHError:false,
            Year:'2020',
            YearError:false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.getDropDownValues('CASEBOOKDATETYPE', 'DateTypeList', 'StringMapName');
        this.getDropDownValues('MONTH', 'MONTHList', 'StringMapKey');
        this.getCashbookDetails();
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

    getCashbookDetails() {
        var startDate = moment([parseInt(this.state.Year), parseInt(this.state.MONTH) - 1]).format('YYYY-MM-DD');
        var data = {
            languageId: this.state.LanguageId,
            transactionDate: this.state.transactionDate,
            DateType:this.state.DateType,
            FromDate:this.state.DateType=='Month'?startDate:this.state.FromDate,
            ToDate:this.state.DateType=='Month'?moment(startDate).endOf('month').format('YYYY-MM-DD'):this.state.ToDate,
            loggedInUserId: CommonConfig.loggedInUserId()
        };
        api.post('api/getCashbookDetails', data).then(res => {
            if (res.success) {
                var formattedData = [];

                console.log("getCashbookDetails-----i-i-i-i-",res.data);

                if (res.data[0].length) {
                    
                    
                    for (let i = 0; i < res.data[0].length; i++) {
                        var tempData = res.data[0][i];

                        formattedData.push({
                            TransactionInOut: tempData.TransactionInOut,
                            TransactionId: tempData.TransactionId,
                            PaymentMode: tempData.PaymentMode,
                            PaymentAmount: tempData.PaymentAmount,
                            AdminFeeAmount: tempData.AdminFeeAmount,
                            AgencyCommissionAmount: tempData.AgencyCommissionAmount,
                            YCommissionAmount: tempData.YCommissionAmount,
                            GovtLevyAmount: tempData.GovtLevyAmount,
                            TransactionDate: (tempData.TransactionDate == "0000-00-00 00:00:00" || tempData.TransactionDate == null || tempData.TransactionDate == "") ? '' : moment(tempData.TransactionDate).format(CommonConfig.dateFormat.dateOnly),
                            DateCompleted: (tempData.DateCompleted == "0000-00-00 00:00:00" || tempData.DateCompleted == null || tempData.DateCompleted == "") ? '' : moment(tempData.DateCompleted).format(CommonConfig.dateFormat.dateOnly),
                            ClientName: tempData.ClientName,
                            PolicyNumber: tempData.PolicyNumber,
                            VesselClassName: tempData.VesselClassName,
                            TransactionIdType: CommonConfig.isEmpty(tempData.TransactionId) ? '' : ('#' + tempData.TransactionId + ' - ' + tempData.Description),
                            InsuranceCompany: tempData.InsuranceCompany,
                            SubAgentId: tempData.SubAgentId,
                            SubAgentName: tempData.SubAgentName,
                            Interest: tempData.Interest,
                            PlanAmount: tempData.PlanAmount
                        });
                    }
                    
                }

                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ arr: formattedData, str: str });

            }
        });
    }

    selectType(value, type) {
        if (type === 'DateType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ DateTypeError: true, DateType: value });
                this.show('DateType', true, "DateTypeError", "Please select Date Type");
            } else {
                this.setState({ DateTypeError: false, DateType: value });
                this.show('DateType', false, "DateTypeError", "");

            }
        }
        if (type === 'MONTH') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ MONTHError: true, MONTH: value });
                this.show('MONTH', true, "MONTHError", "Please select Date Type");
            } else {
                this.setState({ MONTHError: false, MONTH: value });
                this.show('MONTH', false, "MONTHError", "");

            }
        }
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
            toast.error("Please select date.");
            return false;
        } else {
            this.getCashbookDetails();
        }
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'transactionDate') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ transactionDate: e.target.value, transactionDateError: true });
                this.show('transactionDate', true, 'transactionDateError', 'Please select Month and Year');
            } else {
                this.setState({ transactionDate: e.target.value,FromDate: e.target.value,ToDate: e.target.value, transactionDateError: false });
                this.show('transactionDate', false, 'transactionDateError', '');
            }
        }

        if (e.target.name === 'FromDate') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ FromDate: e.target.value, FromDateError: true });
                this.show('FromDate', true, 'FromDateError', 'Please select From date');
            } else {
                this.setState({ FromDate: e.target.value, FromDateError: false });
                this.show('FromDate', false, 'FromDateError', '');
            }
        }

        if (e.target.name === 'ToDate') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ ToDate: e.target.value, ToDateError: true });
                this.show('ToDate', true, 'ToDateError', 'Please select To Date');
            } else {
                this.setState({ ToDate: e.target.value, ToDateError: false });
                this.show('ToDate', false, 'ToDateError', '');
            }
        }
        if (e.target.name === 'Year') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ Year: e.target.value, YearError: true });
                this.show('Year', true, 'YearError', 'Please Enter Year');
            } else {
                this.setState({ Year: e.target.value, YearError: false });
                this.show('Year', false, 'YearError', '');
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
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={{ width: '200px' }}
            />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Cashbook In/Out</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div>
                    <Row>
                        <Col md='3'>
                            <div className="input-box">
                                <label>Select Date Type</label>
                                <Input type="select" name="DateType" id="DateType" onChange={(e) => this.selectType(e.target.value, 'DateType')} value={this.state.DateType}>
                                    {this.state.DateTypeList.map((type, i) => {
                                        return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                    })
                                    }
                                </Input>
                                <em id="DateTypeError" className="error invalid-feedback"></em>
                            </div>
                        </Col>
                         {this.state.DateType == 'Month' ?(<Col md='3'>
                            <div className="input-box">
                                <label>Month</label>
                                <Input type="select" name="MONTH" id="MONTH" onChange={(e) => this.selectType(e.target.value, 'MONTH')} value={this.state.MONTH}>
                                    {this.state.MONTHList.map((type, i) => {
                                        return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                    })
                                    }
                                </Input>
                                <em id="MONTHError" className="error invalid-feedback"></em>
                            </div>
                            <div className="input-box">
                                <label>Year</label>
                                <Input type="number" min="1900" max="2099" id="Year" name="Year"
                                    value={this.state.Year}
                                    onChange={(e) => this.handleChange(e, 'Year')}
                                ></Input>

                                <em id="YearError" className="error invalid-feedback"></em>
                            </div>
                        </Col>):null} 
                        {this.state.DateType == 'Custom' ?(<Col md='3'>
                            <div className="input-box">
                                <label>From Date</label>
                                <Input type="date" id="FromDate" name="FromDate"
                                    value={this.state.FromDate}
                                    onChange={(e) => this.handleChange(e, 'FromDate')}
                                ></Input>

                                <em id="FromDateError" className="error invalid-feedback"></em>
                            </div>
                            <div className="input-box">
                                <label>To Date</label>
                                <Input type="date" id="ToDate" name="ToDate"
                                    value={this.state.ToDate}
                                    onChange={(e) => this.handleChange(e, 'ToDate')}
                                ></Input>

                                <em id="ToDateError" className="error invalid-feedback"></em>
                            </div>
                        </Col>):null} 
                        {this.state.DateType == 'Specific Date' ?(<Col md='3'>
                            <div className="input-box">
                                <label>Date</label>
                                <Input type="date" id="transactionDate" name="transactionDate"
                                    value={this.state.transactionDate}
                                    onChange={(e) => this.handleChange(e, 'transactionDate')}
                                ></Input>

                                <em id="transactionDateError" className="error invalid-feedback"></em>
                            </div>
                        </Col>):null} 
                        <Col md='5'>
                            <div>&nbsp;</div>
                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                        </Col>
                    </Row>
                </div>

                <div className="table-custom">
                    {/* paginator={false}
                    rows={this.state.rowsPerPage}
                    first={this.state.selectedPage}
                    onPage={(e) => this.getPageString(e)}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" */}
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr}
                         header={header} totalRecords={this.state.arr.length} exportFilename="Premium Bordereaux"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true}
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="expand"
                        >
                        {columns}
                    </DataTable>
                </div>
            </div>
        )
    }
}


export default withTranslation()(CashbookInOut);
