
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


class SubAgentAggregateReport extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 0 },
            { field: "AgentCode", header: "Agent Code", sortable: true, filter: true, id: 1 },
            { field: "TotalPolicies", header: "Total Policies", sortable: true, filter: true, id: 2, style: { 'textAlign': 'right' } },
            { field: "TotalNetPremium", header: "Total Net Premium", sortable: true, filter: true, id: 3, style: { 'textAlign': 'right' } },
            { field: "TotalLevy", header: "Total Levy", sortable: true, filter: true, id: 4, style: { 'textAlign': 'right' } },
            { field: "TotalAdminFee", header: "Total AdminFee", sortable: true, filter: true, id: 5, style: { 'textAlign': 'right' } },
            { field: "TotalGross", header: "Total Gross", sortable: true, filter: true, id: 6, style: { 'textAlign': 'right' } },
            { field: "TotalAgentCommision", header: "Total Agent Commision", sortable: true, filter: true, id: 7, style: { 'textAlign': 'right' } },
            { field: "TotalDueToYachtsman", header: "Total Due To Yachtsman", sortable: true, filter: true, id: 8, style: { 'textAlign': 'right' } },
            { field: "TotalPaid", header: "Total Paid", sortable: true, filter: true, id: 9, style: { 'textAlign': 'right' } },
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

            DebtorType: 'Client',
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            tillDate: moment().format("YYYY-MM"),
            tillDateError: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.SubAgentAggregateReport();
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


    SubAgentAggregateReport() {
        var data = {
            DebtorType: this.state.DebtorType ? this.state.DebtorType : '',
            agentinfo: this.state.agentinfo ? this.state.agentinfo : '',
            tillDate: this.state.tillDate ? this.state.tillDate : ''
        };
        api.post('api/SubAgentAggregateReport', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {

                    var TotalPolicies = 0;
                    var TotalNetPremium = 0;
                    var TotalLevy = 0;
                    var TotalAdminFee = 0;
                    var TotalGross = 0;
                    var TotalAgentCommision = 0;
                    var TotalDueToYachtsman = 0;
                    var TotalPaid = 0;

                    for (let i = 0; i < dataLength; i++) {

                        var tempData = res.data[0][i];

                        console.log("tempData", tempData);
                        TotalPolicies = TotalPolicies + 1;
                        TotalNetPremium = TotalNetPremium + parseFloat(tempData.TotalNetPremium).toFixed(2);
                        TotalLevy = TotalLevy + parseFloat(tempData.TotalLevy).toFixed(2);
                        TotalAdminFee = TotalAdminFee + parseFloat(tempData.TotalAdminFee).toFixed(2);
                        TotalGross = TotalGross + parseFloat(tempData.TotalGross).toFixed(2);
                        TotalAgentCommision = TotalAgentCommision + parseFloat(tempData.TotalAgentCommision).toFixed(2);
                        TotalDueToYachtsman = TotalDueToYachtsman + parseFloat(tempData.TotalDueToYachtsman).toFixed(2);
                        TotalPaid = TotalPaid + parseFloat(tempData.TotalPaid).toFixed(2);

                        formattedData.push({
                            AgentName: tempData.AgentName,
                            AgentCode: tempData.AgentCode,
                            TotalPolicies: tempData.TotalPolicies,
                            TotalNetPremium: parseFloat(tempData.TotalNetPremium).toFixed(2),
                            TotalLevy: parseFloat(tempData.TotalLevy).toFixed(2),
                            TotalAdminFee: parseFloat(tempData.TotalAdminFee).toFixed(2),
                            TotalGross: parseFloat(tempData.TotalGross).toFixed(2),
                            TotalAgentCommision: parseFloat(tempData.TotalAgentCommision).toFixed(2),
                            TotalDueToYachtsman: parseFloat(tempData.TotalDueToYachtsman).toFixed(2),
                            TotalPaid: parseFloat(tempData.TotalPaid).toFixed(2),
                        });
                    }
                    formattedData.push({
                        AgentName: 'Total',
                        AgentCode: '',
                        TotalPolicies: TotalPolicies,
                        TotalNetPremium: parseFloat(TotalNetPremium).toFixed(2),
                        TotalLevy: parseFloat(TotalLevy).toFixed(2),
                        TotalAdminFee: parseFloat(TotalAdminFee).toFixed(2),
                        TotalGross: parseFloat(TotalGross).toFixed(2),
                        TotalAgentCommision: parseFloat(TotalAgentCommision).toFixed(2),
                        TotalDueToYachtsman: parseFloat(TotalDueToYachtsman).toFixed(2),
                        TotalPaid: parseFloat(TotalPaid).toFixed(2),
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

        this.SubAgentAggregateReport();

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
                    <h1>Sub Agent Aggregate Report</h1>
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
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Aggregate Report"
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


export default withTranslation()(SubAgentAggregateReport);
