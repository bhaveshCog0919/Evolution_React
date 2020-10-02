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
import { Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';


class AgentCommissionReport extends Component {

    constructor(props) {
        super(props);

        let columns = [

            // { field: "ClientCode", header: "Client Code", sortable: true, filter: true, id: 1 },
            // { field: "Department", header: "Type", sortable: true, filter: true, id: 2 },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 0 },
            { field: "ClientName", header: "Client Name", sortable: true, filter: true, id: 1 },
            // { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 4 },
            // { field: "AgentCode", header: "Agent Code", sortable: true, filter: true, id: 5 },
            // { field: "InsuranceCompany", header: "Insurance Company", sortable: true, filter: true, id: 6 },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 2 },
            { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 3 },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 4 },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 5 },
            { field: "Premium", header: "Premium", sortable: true, filter: true, id: 6 ,style:{'textAlign':'right'}},
            { field: "AgentCommission", header: "Agent Commission", sortable: true, filter: true, id: 7 ,style:{'textAlign':'right'}},
            // { field: "ChargeAmount", header: "Charge Amt", sortable: true, filter: true, id: 10 },
            // { field: "PaidAmount", header: "Paid Amt", sortable: true, filter: true, id: 11 },
            // { field: "Outstanding", header: "Outstanding Amt", sortable: true, filter: true, id: 12 },
            // { field: "DueDate", header: "Outstanding Since", sortable: true, filter: true, id: 13 },
            // { field: "DayAfterDueDate", header: "No of Days", sortable: true, filter: true, id: 14 }
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

            DebtorType: 'SubAgent',
            Period: 0,
            // DebtorTypeList:[
            //     {label:'',value:''}
            // ],
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            monthtillDate: moment().format("YYYY-MM"),
            fromDate: '',
            toDate: ''
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.AgentCommissionReport();
        this.getOrganazationData(this.state.DebtorType);
    }

    ClientDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.ClientName}</p>
                <p>{rowData.ClientCode}</p>
            </div>
        )
    }

    AgentDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.AgentName}</p>
                <p>{rowData.AgentCode}</p>
            </div>
        )
    }

    DateDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.RenewalDate}</p>
                <p>{rowData.InceptionDate}</p>
            </div>
        )
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


    AgentCommissionReport() {
        var data = {
            DebtorType: this.state.DebtorType ? this.state.DebtorType : '',
            agentinfo: this.state.agentinfo ? this.state.agentinfo : '',
            Period: this.state.Period ? this.state.Period : 0,
            monthtillDate: this.state.monthtillDate ? this.state.monthtillDate : '',
            fromDate: this.state.fromDate ? this.state.fromDate : '',
            toDate: this.state.toDate ? this.state.toDate : ''
        };
        api.post('api/AgentCommissionReport', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage:0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {
                    var v_Premium = 0;
                    var v_AgentCommission = 0;

                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            // AgentName: tempData.SourceName,
                            // AgentCode: tempData.SubAgentId,
                            // Department: tempData.Department,
                            // ClientCode: tempData.ClientContactCode,
                            TransactionType: tempData.Description,
                            PolicyNumber: tempData.PolicyNumber,
                            ClientName: tempData.ClientName,
                            InceptionDate: moment(tempData.InceptionDate).format('DD/MM/YYYY'),
                            RenewalDate: moment(tempData.RenewalDate).format('DD/MM/YYYY'),
                            TransactionDate: moment(tempData.TransactionDate).format('DD/MM/YYYY'),
                            Premium: parseFloat(tempData.Premium?tempData.Premium:0).toFixed(2),
                            AgentCommission: parseFloat(tempData.AgentCommission?tempData.AgentCommission:0).toFixed(2),
                            // InsuranceCompany: tempData.InsuranceCompany,
                            // ChargeAmount: tempData.ChargeAmount,
                            // PaidAmount: tempData.PaidAmount,
                            // Outstanding: tempData.Outstanding,
                            // RenewalOrInceptionDate: moment(tempData.RenewalOrInceptionDate).format('DD/MM/YYYY'),
                            // TransactionType: tempData.TransactionType,
                            // DueDate: moment(tempData.DueDate).format('DD/MM/YYYY'),
                            // DayAfterDueDate: tempData.DayAfterDueDate
                        });
                        v_Premium = tempData.Premium + v_Premium;
                        v_AgentCommission = tempData.AgentCommission + v_AgentCommission;
                    }
                    formattedData.push({
                        PolicyNumber: 'Total',
                        Premium: parseFloat(v_Premium).toFixed(2),
                        AgentCommission: parseFloat(v_AgentCommission).toFixed(2),
                    });
                }

                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ arr: formattedData, str: str });
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
        this.AgentCommissionReport();

    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'monthtillDate') {
            this.setState({ monthtillDate: e.target.value });
        }

        if (e.target.name === 'fromDate') {
            this.setState({ fromDate: e.target.value });
        }

        if (e.target.name === 'toDate') {
            this.setState({ toDate: e.target.value });
        }
    }

    selectType(value, type) {

        if (type === 'DebtorType') {

            this.setState({ DebtorTypeError: false, DebtorType: value });
            this.show('DebtorType', false, "DebtorTypeError", "");
            this.getOrganazationData(value)

        }

        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, agentinfoError: false });
            this.show('agentinfo', false, 'agentinfoError', '');

        }

        if (type === 'Period') {
            this.setState({ Period: value });
        }

    }

    getOrganazationData(ContactType) {
        try {
            let data = { ContactType: ContactType };
            api.post('api/getOrganazationData', data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].OrganizationName,
                            value: res.data[i].OrganizationId,
                        })
                    }
                    this.setState({ sourceList: formattedData });
                } else {
                    console.log('getOrganazationData_error');
                }
            }).catch(err => {
                console.log('getOrganazationData', err);
            });
        } catch (error) {
            console.log('getOrganazationData', error);
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
                <div className="basic-header">
                    <h1>Agent Commission Report</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    Search Sub Agent/Service Center
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row>
                                        <Col md='2'>
                                            <div className="input-box">
                                                <label>Period</label>
                                                <Input type="select" name="Period" id="Period" onChange={(e) => this.selectType(e.target.value, 'Period')} value={this.state.Period}>
                                                    <option value="0">Month</option>
                                                    <option value="1">Custom</option>
                                    }
                                </Input>
                                            </div>
                                        </Col>
                                        {
                                            this.state.Period == 0 ?
                                                <Col md='6'>
                                                    <div className="input-box">
                                                        <label>Month</label>
                                                        <Input type="month" id="monthtillDate" name="monthtillDate"
                                                            value={this.state.monthtillDate}
                                                            onChange={(e) => this.handleChange(e, 'monthtillDate')}
                                                        ></Input>
                                                    </div>
                                                </Col>
                                                :
                                                <Col md='4'>
                                                    <Row>
                                                        <Col md='6'>
                                                            <div className="input-box">
                                                                <label>From Date</label>
                                                                <Input type="date" id="fromDate" name="fromDate"
                                                                    value={this.state.fromDate}
                                                                    onChange={(e) => this.handleChange(e, 'fromDate')}
                                                                ></Input>
                                                            </div>
                                                        </Col>
                                                        <Col md='6'>
                                                            <div className="input-box">
                                                                <label>To Date</label>
                                                                <Input type="date" id="toDate" name="toDate"
                                                                    value={this.state.toDate}
                                                                    onChange={(e) => this.handleChange(e, 'toDate')}
                                                                ></Input>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>}
                                        <Col md='3'>
                                            <div className="input-box">
                                                <label>Debtor Type</label>
                                                <Input type="select" name="DebtorType" id="DebtorType" onChange={(e) => this.selectType(e.target.value, 'DebtorType')} value={this.state.DebtorType}>
                                                    <option value="SubAgent">Sub Agent</option>
                                                    <option value="ServiceCenter">Service Center</option>
                                                    {/* {this.state.DebtorTypeList.map((type, i) => {
                                        return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                    }) */}
                                    }
                                </Input>
                                            </div>
                                        </Col>
                                        {/* <Col md='2'>
                                            <div className="input-box">
                                                <label>Till Date</label>
                                                <Input disabled type="month" id="tillDate" name="tillDate"
                                                    value={this.state.tillDate}
                                                    onChange={(e) => this.handleChange(e, 'tillDate')}
                                                ></Input>
                                              </div>
                                        </Col> */}
                                        <Col md='3'>
                                            <div className="input-box">
                                                <label>Agent Name</label>
                                                <Select name="agentinfo" id="agentinfo" options={this.state.sourceList}
                                                    value={this.state.agentinfo} onChange={(data) => this.selectType(data, 'agentinfo')}
                                                // placeholder={t("policyUnderwriting:Source.defaultValue")}
                                                // disabled={this.state.sourceDisable == true ? true : false}
                                                />
                                            </div>
                                        </Col>
                                        <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Agent Commission Report"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="expand">
                        {columns}
                    </DataTable>
                </div>
            </div>
        )
    }
}



export default withTranslation()(AgentCommissionReport);
