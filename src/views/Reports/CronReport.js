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


class CronReport extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "CreatedOn", header: "CreatedOn", sortable: true, filter: true, id: 1 },
            { field: "Status", header: "Status", sortable: true, filter: true, id: 1 },
            { field: "PolicyNumber", header: "PolicyNumber", sortable: true, filter: true, id: 2 },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 3 },
            { field: "TemplateName", header: "Template Name", sortable: true, filter: true, id: 4 },
            { field: "TamplateName", header: "Tamplate Name", sortable: true, filter: true, id: 5 },
            { field: "ToEmail", header: "ToEmail", sortable: true, filter: true, id: 6, style: { 'textAlign': 'right' } },
            { field: "EmailSubject", header: "EmailSubject", sortable: true, filter: true, id: 7, style: { 'textAlign': 'right' } },
            { field: "Message", header: "Message", sortable: true, filter: true, id: 8 },
            { field: "TimestampSent", header: "Email Sent Time", sortable: true, filter: true, id: 9 },
            { field: "ErrorMsg", header: "Error Message", sortable: true, filter: true, id: 10 },
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
            selected: {},
            selectedPolicy: 0,
            selectedAgent: '',
            selectAll: 0,
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            monthtillDate: moment().format("YYYY-MM"),
            FromDate: moment().format('YYYY-MM-DD'),
            ToDate: moment().endOf('month').format('YYYY-MM-DD'),
            MONTHList: [],
            MONTH: '01',
            MONTHError: false,
            Year: '2020',
            YearError: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.CronReport();
        this.getOrganazationData(this.state.DebtorType);
        this.getDropDownValues('MONTH', 'MONTHList', 'StringMapKey');
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
    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }
    toggleSelectAll() {
        let newSelected = {};
        if (this.state.selectAll === 0) {
            this.state.arr.forEach(x => {
                newSelected[x.id] = true;
            });
        }
        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    actionTemplate(rowData, column) {
        return <div>
            <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selected[rowData.id] === true}
                onChange={() => this.toggleRow(rowData.id)} />
        </div>;
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


    CronReport() {
        var data = {
            fromDate: this.state.FromDate,
            toDate: this.state.ToDate,
        };
        api.post('api/CronReport', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {
                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            id:i,
                            CreatedOn: tempData.CreatedOn,
                            Status: tempData.Status,
                            PolicyNumber: tempData.PolicyNumber,
                            RenewalDate: tempData.RenewalDate,
                            TemplateName: tempData.TemplateName,
                            TamplateName: tempData.TamplateName,
                            ToEmail: tempData.ToEmail,
                            EmailSubject: tempData.EmailSubject,
                            Message: tempData.Message,
                            TimestampSent: tempData.TimestampSent,
                            ErrorMsg: tempData.ErrorMsg, 
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
        this.CronReport();
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'monthtillDate') {
            this.setState({ monthtillDate: e.target.value });
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

    ReferrData(){
        var data = {
                   };
               
        // api.post('api/CronReport', data).then(res => {
        // });
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
                    <h1>Cron Report </h1>
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
                                    Filter
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row>
                                        <Col md='3'>
                                            <label>From Date</label>
                                            <Input type="date" id="FromDate" name="FromDate"
                                                value={this.state.FromDate}
                                                onChange={(e) => this.handleChange(e, 'FromDate')}
                                            ></Input>

                                            <em id="FromDateError" className="error invalid-feedback"></em>
                                        </Col>
                                        <Col md='3'>

                                            <label>To Date</label>
                                            <Input type="date" id="ToDate" name="ToDate"
                                                value={this.state.ToDate}
                                                onChange={(e) => this.handleChange(e, 'ToDate')}
                                            ></Input>

                                            <em id="ToDateError" className="error invalid-feedback"></em>
                                        </Col>
                                        <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {/* <Col md='3'>
                                            <label>Month</label>
                                            <Input type="select" name="MONTH" id="MONTH" onChange={(e) => this.selectType(e.target.value, 'MONTH')} value={this.state.MONTH}>
                                                {this.state.MONTHList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="MONTHError" className="error invalid-feedback"></em>
                                        </Col> */}

                                        {/* <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.ReferrData()}> Refer </BTN>
                                        </Col> */}
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Cron Report"
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



export default withTranslation()(CronReport);
