import React, { Component } from 'react';
import Select from 'react-select';
import api from '../../utils/apiClient';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CommonConfig } from '../../utils/constants';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Collapse, Button as BTN, Input, Card, CardHeader, InputGroup, CardBody, Row, Col } from 'reactstrap';
import APIConstant from '../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { apiBase } from '../../utils/config';
import axios from 'axios';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class SubAgentAutoStatementSummary extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "SubAgentName", header: "Sub Agent Name", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "SubAgentCode", header: "Sub Agent Code", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "ReportMonth", header: "Month", sortable: true, filter: true, id: 2, style: { 'width': '60px' } },
            { field: "ReportYear", header: "Year", sortable: true, filter: true, id: 3, style: { 'width': '60px' } },
            { field: "StatementReferenceName", header: "Referance Name", sortable: true, filter: true, id: 4, style: { 'width': '100px' } },
            { field: "CreatedOn", header: "Generated On", sortable: true, filter: true, id: 5, style: { 'width': '60px' } },
            { field: "SentDate", header: "Sent On", sortable: true, filter: true, id: 6, style: { 'width': '60px' } },
            { field: "Stage", header: "Stage", sortable: true, filter: true, id: 7, style: { 'width': '60px' } },
            { body: this.linkdata.bind(this), field:"Action", header: "Action", sortable: false,filterMatchMode: 'contains', filter: false, style: { 'width': '160px' }, id: 8 }
        ]

        let columns1 = [
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 2, style: { 'width': '80px' } },
            // { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 3, style: { 'width': '80px' } },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 5, style: { 'width': '90px' } },
            { field: "NetPremium", header: "Net Premium", sortable: true, filter: true, id: 6, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 7, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AdminFeeAmount", header: "Admin Fee", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Gross", header: "Gross Amount", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AgentCommissionAmount", header: "Agent Commission Amount", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "YCommissionAmount", header: "Amount Due to Yachtsman", sortable: true, filter: true, id: 13, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "DueDate", header: "Due Date", sortable: true, filter: true, id: 14, style: { 'width': '80px' } },
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 15, style: { 'width': '60px', 'textAlign': 'right' } },
        ];



        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            cols1: columns1,
            showcol2: false,
            arr: [],
            arr1: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            searchCollapse: false,
            selected: {},
            selectedPolicy: 0,
            selectedAgent: '',
            selectAll: 0,
            isMonthYear: true,
            newEntryDate: moment().format('YYYY-MM-DD'),
            newEntryDateError: false,
            paymentMode: '',
            paymentModearr: [],
            paymentModeError: false,
            monthArray: [],
            policyMonth: moment().format('M'),
            policyMonthError: false,
            yearArray: [],
            policyYear: moment().format('YYYY'),
            policyYearError: false,
            policyFrom: '',
            policyFromError: false,
            policyTo: '',
            policyToError: false,
            note: '',
            DebtorType: 'SubAgent',
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            tillDate: moment().format("YYYY-MM"),
            tillDateError: false,
            isFilterTableShow: false,
            custom: true,
            tab2Title: "Sub Agent Statements",
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.colOptions1 = [];
        for (let col of columns1) {
            this.colOptions1.push({ label: col.header, value: col });
        }
    }

    linkdata(rowData) {
        var path = apiBase + "SubAgentStatement/" + rowData.StatementReferenceName;
        return (
            <>
            <BTN color= "warning" title="Search" onClick={() => this.viewSubAgentDetail(rowData.id)} style={{marginRight: "10px"}}> <i class="fa fa-eye"></i> </BTN>
            {(rowData.StatementReferenceName).substring((rowData.StatementReferenceName).length - 4) == 'xlsx'?
            <BTN color= "primary" title="Search" style={{marginRight: "10px"}} onClick={() => this.downloadData(rowData)}> <i class="fa fa-download"></i> </BTN>
            :(null) }
          {rowData.Stage == "Review" ? 
            <BTN color="success" title="change to Release" onClick={() => this.changeStage(rowData.id,"ReleaseAuto")}> change to Release Auto </BTN>
           : (rowData.Stage == "ReleaseAuto" ?
                <BTN color="secondary" title="change to Review" onClick={() => this.changeStage(rowData.id,"Review")}> change to Review </BTN>
           : null)}
            </>
            )
    }

    downloadData = (rowdata) => {
        console.log("downloadData---rowdata", rowdata);
        var path = apiBase + "SubAgentStatement/" + rowdata.StatementReferenceName;
        let filext = this.getFileExtension(rowdata.StatementReferenceName);
        console.log("filext", filext);
        let fileName = rowdata.StatementReferenceName;
        if (filext == undefined) {
          fileName = rowdata.StatementReferenceName + "." + rowdata.type
        }
    
        axios({
          url: path,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      }

      getFileExtension = (filename) => {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
      }

    actionTemplate(rowData, column) {
      }

    componentDidMount() {
        let loginPerson = CommonConfig.loggedInUserData().LoginId;
        this.setState({loggingUserId: loginPerson})
        this.getDropdown();
    }

    getDropdown() {

        // Get Month
        let monthArray = [
            { label: 'January', value: 1 },
            { label: 'February', value: 2 },
            { label: 'March', value: 3 },
            { label: 'April', value: 4 },
            { label: 'May', value: 5 },
            { label: 'June', value: 6 },
            { label: 'July', value: 7 },
            { label: 'August', value: 8 },
            { label: 'September', value: 9 },
            { label: 'October', value: 10 },
            { label: 'November', value: 11 },
            { label: 'December', value: 12 },
        ];
        this.setState({ monthArray: monthArray });

        // Get Year - Get last 10 year from current year
        let startYear = moment().format('YYYY');
        let yearArray = [];
        for (let index = startYear; index >= (parseInt(startYear) - 10); index--) {
            yearArray.push({ label: index, value: index });
        }
        this.setState({ yearArray: yearArray });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    // export() {
    //     // this.dt.exportCSV();
    // }

    customExport() {debugger
        var data = {
            id: this.state.selectedAgent
        }
        api.post('api/testExcel',data).then(res => {
            console.log("testExcel",res);
            if (res.success) {

            }
        });
    }

    filterData() {
        console.log("this.state.policyMonth", this.state.policyMonth);
        if (CommonConfig.isEmpty(this.state.policyMonth) || CommonConfig.isEmpty(this.state.policyYear)) {
            toast.error('Please select Month and Year.');
            return false;
        }
        this.subagentstatement();
    }

    changeStage(id, stage) {
        
        var data = {
            id: id ? id : '',
            stage: stage ? stage : '',
            CurrentUserId: this.state.loggingUserId? this.state.loggingUserId : '',
        };
        api.post('api/SubAgentAutoUpadateStage', data).then(res => {
            console.log("autosubagentstatement",res);
            if (res.success) {
            this.filterData();
            toast.success('Stage changed successful');
            }
        });        
    }

    subagentstatement() {
        
           var data = {
               policyMonth: this.state.policyMonth ? this.state.policyMonth : '',
               policyYear: this.state.policyYear ? this.state.policyYear : ''
           };
           api.post('api/autosubagentstatement', data).then(res => {
               console.log("autosubagentstatement",res);
               if (res.success) {
                   var formattedData = [];
                   this.setState({
                       selectedPage: 0
                   });
                   debugger
                   var dataLength = res.data[0].length;
                   if (dataLength > 0) {
   
                       for (let i = 0; i < dataLength; i++) {
                           var tempData = res.data[0][i];
                           formattedData.push({
                               id: tempData.SubAgentStatementHeaderId,
                               SubAgentName: tempData.SubAgentName,
                               SubAgentCode: tempData.AgentContactCode,
                               ReportMonth: tempData.ReportMonth,
                               ReportYear: tempData.ReportYear,
                               StatementReferenceName: tempData.StatementReferenceName,
                               CreatedOn: moment(tempData.CreatedOn).format('DD/MM/YYYY'),
                               SentDate: CommonConfig.isEmpty(tempData.SentDate)?"":moment(tempData.SentDate).format('DD/MM/YYYY'),
                               Stage: tempData.Stage
                           });
                       }
                   }
   
                   let firstPage = (formattedData.length) ? '1' : '0';
                   let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                   let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                   this.setState({ arr: formattedData, str: str, isFilterTableShow: true });
               }
           });
       }

        viewSubAgentDetail(id) {
            var data = {
                id: id,
            };
            api.post('api/viewAutoSubAgentStatement', data).then(res => {
                console.log("viewAutoSubAgentStatement",res);
                if (res.success) {
                    var formattedData = [];
                    this.setState({
                        selectedPage: 0
                    });
                    debugger
                    var dataLength = res.data[0].length;
                    if (dataLength > 0) {
                        var NetPremium = 0;
                        var Levy = 0;
                        var PaidAmount = 0;
                        var Gross = 0;
                        var AdminFeeAmount = 0;
                        var AgentCommissionAmount = 0;
                        var YCommissionAmount = 0;
                        for (let i = 0; i < dataLength; i++) {
                            var tempData = res.data[0][i];
                            formattedData.push({
                                id: i,
                                AgentName: tempData.AgentName,
                                ClientName: tempData.ClientName,
                                PolicyNumber: tempData.PolicyNumber,
                                RenewalDate: moment(tempData.RenewalDate).format('DD/MM/YYYY'),
                                TransactionDate: moment(tempData.TransactionDate).format('DD/MM/YYYY'),
                                TransactionType: tempData.TransactionType,
                                AgentCommissionAmount: parseFloat(tempData.AgentCommissionAmount ? tempData.AgentCommissionAmount : 0).toFixed(2),
                                AdminFeeAmount: parseFloat(tempData.AdminFee ? tempData.AdminFee : 0).toFixed(2),
                                YCommissionAmount: parseFloat(tempData.AmountDueToYachtsman ? tempData.AmountDueToYachtsman : 0).toFixed(2),
                                DueDate: moment(tempData.DueDate).format('DD/MM/YYYY'),
                                Gross: parseFloat(tempData.GrossAmount ? tempData.GrossAmount : 0).toFixed(2),
                                NetPremium: parseFloat(tempData.NetPremium ? tempData.NetPremium : 0).toFixed(2),
                                Levy: parseFloat(tempData.Levy ? tempData.Levy : 0).toFixed(2),
                                
                            });
                            NetPremium = NetPremium + tempData.NetPremium;
                            Levy = Levy + tempData.Levy;
                            // PaidAmount = PaidAmount + tempData.PaymentAmount;
                            Gross = Gross + tempData.GrossAmount;
                            AdminFeeAmount = AdminFeeAmount + tempData.AdminFee;
                            AgentCommissionAmount = AgentCommissionAmount + tempData.AgentCommissionAmount;
                            YCommissionAmount = YCommissionAmount + tempData.AmountDueToYachtsman;
                        }
                        formattedData.push({
                            Gross: parseFloat(Gross).toFixed(2),
                            NetPremium: parseFloat(NetPremium).toFixed(2),
                            Levy: parseFloat(Levy).toFixed(2),
                            // PaidAmount: parseFloat(PaidAmount).toFixed(2),
                            AdminFeeAmount: parseFloat(AdminFeeAmount).toFixed(2),
                            AgentCommissionAmount: parseFloat(AgentCommissionAmount).toFixed(2),
                            YCommissionAmount: parseFloat(YCommissionAmount).toFixed(2)
                        });
                    }
    
                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ arr1: formattedData, str: str, isFilterTableShow: false, selectedAgent: id });
                }
            });
        }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'tillDate') {
            this.setState({ tillDate: e.target.value, tillDateError: false });
            this.show('tillDate', false, 'tillDateError', '');

        }
        if (e.target.name === 'newEntryDate') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ newEntryDateError: true });
                this.show("newEntryDate", true, "newEntryDateError", "Please enter date");
            } else {
                this.setState({ newEntryDateError: false, newEntryDate: e.target.value });
                this.show("newEntryDate", false, "newEntryDateError", "");
            }
        }
        if (e.target.name === 'policyFrom') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyFrom: '' });
            } else {
                this.setState({ policyFrom: e.target.value, policyTo: '' });
                this.show('policyTo', false, 'policyToError', '');
            }
        }

        if (e.target.name === 'policyTo') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyTo: '' });
            } else {
                if (!CommonConfig.isEmpty(this.state.policyFrom)) {
                    var isToDateGreater = moment(e.target.value).isSameOrAfter(this.state.policyFrom);
                    if (!isToDateGreater) {
                        this.show('policyTo', true, 'policyToError', 'To date must be greater then From date.');
                    } else {
                        this.show('policyTo', false, 'policyToError', '');
                    }
                } else {
                    this.show('policyTo', false, 'policyToError', '');
                }
                this.setState({ policyTo: e.target.value });
            }
        }
    }

    selectType(value, type) {

        if (type === 'DebtorType') {

            this.setState({ DebtorTypeError: false, DebtorType: value });
            this.show('DebtorType', false, "DebtorTypeError", "");
            this.getOrganazationData(value)

        }
        if (type === 'paymentMode') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ paymentModeError: true, paymentMode: value });
                this.show('paymentMode', true, "paymentModeError", "Select payment mode");
            } else {
                this.setState({ paymentModeError: false, paymentMode: value });
                this.show('paymentMode', false, "paymentModeError", "");

            }
        }
        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, DebtorType: 'SubAgent' });

        }

        if (type === 'policyMonth') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyMonth: '' });
            } else {
                this.setState({ policyMonth: value.value });
            }
        }

        if (type === 'policyYear') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyYear: '' });
            } else {
                this.setState({ policyYear: value.value });
            }
        }

    }


    render() {
        const { t } = this.props;
        var header = null;
        let columns = '';
        let columns1 = '';
        // if (this.state.agentinfo == '') {
        columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
            />;
        });
        if (this.state.arr1.length > 0) {
            columns1 = this.state.cols1.map((col1, i) => {
                return <Column key={i} field={col1.field} header={col1.header} body={col1.body} sortable={col1.sortable} filter={col1.filter} filterMatchMode={col1.filterMatchMode} style={col1.style}
                />;
            });
        }
        else {
            columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                />;
            });
        }

        return (
            <div>
                <div className="basic-header">
                    <h1>Auto Sub Agent Statement</h1>
                    <div md="3" className="header-right-option" >
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        {/* <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button> */}
                    </div>
                </div>
                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    Search Sub Agent
                            <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row>
                                        <Col md="1.5">

                                            <div className="input-box">
                                                <label>Month</label>
                                                <Input type="select" name="policyMonth" id="policyMonth" value={this.state.policyMonth} onChange={(e) => this.selectType(e.target, 'policyMonth')}>
                                                    <option value="">Select Month</option>
                                                    {this.state.monthArray.map((month, i) => {
                                                        return (<option value={month.value} key={i}>{month.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="policyMonthError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>
                                        <Col md="2">
                                            <div className="input-box">
                                                <label>Year</label>
                                                <Input type="select" name="policyYear" id="policyYear" value={this.state.policyYear} onChange={(e) => this.selectType(e.target, 'policyYear')}>
                                                    <option value="">Select Year</option>
                                                    {this.state.yearArray.map((year, i) => {
                                                        return (<option value={year.value} key={i}>{year.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="policyYearError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>

                                        <Col md="2.5" style={{ marginTop: '20px' }}>
                                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                {/* {this.state.showcol2 != true ? (<div className="table-custom"> */}
                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ isFilterTableShow: !this.state.isFilterTableShow })} aria-expanded={this.state.isFilterTableShow} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    <span>{this.state.tab2Title}</span>
                                    <i style={{ float: 'right' }} className={this.state.isFilterTableShow ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.isFilterTableShow} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                                    paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Statement"
                                    currentPageReportTemplate={this.state.str}
                                    scrollable={true}
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                    responsive={true} resizableColumns={true} columnResizeMode="expand">
                                    {columns}
                                </DataTable>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                {/* </div>
                    ) : (<div className="table-custom"> */}
                {this.state.arr1.length > 0
                    ? <div className="table-custom">
                        <DataTable ref={(el) => this.dt = el} value={this.state.arr1} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                            paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Statement"
                            currentPageReportTemplate={this.state.str}
                            scrollable={true}
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                            responsive={true} resizableColumns={true} columnResizeMode="expand">
                            {columns1}
                        </DataTable>
                        {/* <BTN color="success" title="Export as CSV" onClick={() => this.customExport()}> Export as CSV </BTN> */}
                    </div>
                    : (null)}
                {/* </div>)} */}
            </div>
        )
    }
}


export default withTranslation()(SubAgentAutoStatementSummary);
