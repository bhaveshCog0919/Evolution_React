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


class MigrationReport extends Component {

    constructor(props) {
        super(props);


        let columns = [
            { field: "PolicyId", header: "Policy Id", sortable: true, filter: true, id: 1 ,style: { 'width': '100px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 2 ,style: { 'width': '60px' } },
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 3 ,style: { 'width': '100px' } },
            { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 4 ,style: { 'width': '80px' } },
            { field: "RenewalDate", header: "Renewal Date    ", sortable: true, filter: true, id: 5 ,style: { 'width': '80px' } },
            { field: "PolicyType", header: "Policy Type", sortable: true, filter: true, id: 6 ,style: { 'width': '70px' } },
            { field: "VesselClass", header: "Vessel Class", sortable: true, filter: true, id: 7 ,style: { 'width': '100px' } },
            { field: "VesselType", header: "Vessel Type", sortable: true, filter: true, id: 8 ,style: { 'width': '100px' } },
            { field: "PolicyCountry", header: "Policy Country", sortable: true, filter: true, id: 9 ,style: { 'width': '100px' } },
            { field: "Binder", header: "Binder", sortable: true, filter: true, id: 10 ,style: { 'width': '100px' } },
            { field: "RegistrationCountry", header: "Registration Country", sortable: true, filter: true, id: 11, style: { 'width': '70px' } },
            { field: "MooringName", header: "Mooring Name", sortable: true, filter: true, id: 12, style: { 'width': '100px' } },
            { field: "MooringType", header: "Mooring Type", sortable: true, filter: true, id: 13 , style: { 'width': '100px' } },
            { field: "Premium19", header: "2019 Premium", sortable: true, filter: true, id: 14 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Premium20", header: "2020 Premium", sortable: true, filter: true, id: 15 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "NetPrem", header: "Net Prem", sortable: true, filter: true, id: 16 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 17 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Admin", header: "Admin", sortable: true, filter: true, id: 18 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "PremDiff", header: "Prem Diff", sortable: true, filter: true, id: 19 , style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Stage", header: "Stage", sortable: true, filter: true, id: 20 , style: { 'width': '100px' } },
            { field: "Comment", header: "Comment", sortable: true, filter: true, id: 21 , style: { 'width': '100px' } },
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
            fromDate: '',
            toDate: '',
            selected: {},
            selectAll: 0
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.toggleRow = this.toggleRow.bind(this);
        this.export = this.export.bind(this);
    }

    componentDidMount() {

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

    actionTemplate(rowData, column) {
        console.log('rowData', rowData);

        return <div>
            <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selected[rowData.id] === true}
                onChange={() => this.toggleRow(rowData.id)} />
        </div>;
    }

    MigrationReportAPI() {
        var data = {
            fromDate: this.state.fromDate ? this.state.fromDate : '',
            toDate: this.state.toDate ? this.state.toDate : ''
        };
        api.post('api/MigrationReportAPI', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                var dataLength = res.data[1].length;
                if (dataLength > 0) {
                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[1][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            PolicyId:tempData.PolicyId,
                            PolicyNumber:tempData.PolicyNumber,
                            ClientName:tempData.ClientName,
                            InceptionDate: moment(tempData.InceptionDate).format('DD/MM/YYYY'),
                            RenewalDate: moment(tempData.RenewalDate).format('DD/MM/YYYY'),
                            PolicyType:tempData.PolicyType,
                            VesselClass:tempData.VesselClassName,
                            VesselType:tempData.VesselTypeName,
                            PolicyCountry:tempData.Country,
                            Binder:tempData.UMRN,
                            RegistrationCountry:tempData.VesselRegistrationLocation,
                            MooringName:tempData.MooringName,
                            MooringType:tempData.MooringType,
                            Premium19:tempData.TotalDue2019,
                            Premium20:tempData.TotalDue2020,
                            NetPrem:tempData.NetPremium,
                            Levy:tempData.Levy,
                            Admin:tempData.AdminFee,
                            PremDiff:tempData.DifferenceTotalDue,
                            Stage:tempData.Stage,
                            Comment:tempData.Comments 
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
            this.state.data.forEach(x => {
                newSelected[x.id] = true;
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
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
        this.MigrationReportAPI();
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'fromDate') {
            this.setState({ fromDate: e.target.value });
        }

        if (e.target.name === 'toDate') {
            this.setState({ toDate: e.target.value });
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
                    <h1>Migration Report</h1>
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
                        {/* <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                MigrationReport
                                 </h5>
                            </BTN>
                        </CardHeader> */}
                        <CardBody>
                            <div className="filter-data">
                                <Row>

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
                                    </Col>
                                    <Col md='2'>
                                        <div>&nbsp;</div>
                                        <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>

                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Migration Report"
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



export default withTranslation()(MigrationReport);