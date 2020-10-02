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
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN, Card, CardHeader, CardBody, Collapse, Form } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import { apiBase } from '../../utils/config';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { registerHelper } from 'codemirror';
import { relativeTimeThreshold } from 'moment';
import moment from 'moment';

class DashboardPolicyList extends Component {
    constructor(props) {
        super(props);

        let columns = [
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
            cols: columns,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            policyStage: this.props.match.params.mode,
            referredPolicyCount: '',
            policyList: [],
        };
        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
    }

    componentDidMount() {
        this.getPolicyList(this.props.match.params.mode);
    }

    getPolicyList(stage) {
        let data = {
            PolicyStage: stage,
            TeamType: 'Renewal',
            CurrentUser: CommonConfig.loggedInUserData().ContactType
        }
        api.post('api/getPolicyListByStage', data).then(res => {
            if (res.success) {
                console.log("getPolicyListByStage", res.data);
                let firstPage = (res.data.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < res.data.length) ? this.state.rowsPerPage : res.data.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + res.data.length + ' records';
                this.setState({ policyList: res.data, policyCount: res.data.length, str: str, policyStage: stage });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    actionTemplate(rowData, column) {
        return <div className="policy-list-data">
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.edit(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button> */}
        </div>;
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

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.policyList.length) ? l : this.state.policyList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.policyList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
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
                <p>{moment(rowData.InceptionDate).format(CommonConfig.dateFormat.dateOnly)}</p>
                <p>{moment(rowData.RenewalDate).format(CommonConfig.dateFormat.dateOnly)}</p>
            </div>
        )
    }

    render() {

        const { t } = this.props;

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        if (this.props.isIdleTimeOut) {
            this.props.history.push('/')
        }
        return (

            <div className="animated fadeIn">

                <div className="table-custom">
                    <Row>
                        <Col md='3'>
                            <h2>{this.state.policyStage} ({this.state.policyCount})</h2>
                        </Col>
                        <Col md='4'></Col>
                        <Col md= '5' style={{textAlign: "right"}}>
                            <span className = {this.state.policyStage == 'Pending'?"dashbordSelectorSelect":''} style = {{marginRight:15, textDecoration: "underline", cursor: "pointer", }} onClick={() => this.getPolicyList('Pending')}><b>Pending</b></span>
                            <span className = {this.state.policyStage == 'Referred'?"dashbordSelectorSelect":''} style = {{marginRight:15, textDecoration: "underline", cursor: "pointer"}} onClick={() => this.getPolicyList('Referred')}><b>Referred</b></span>
                            <span className = {this.state.policyStage == 'In Progress'?"dashbordSelectorSelect":''} style = {{marginRight:15, textDecoration: "underline", cursor: "pointer"}} onClick={() => this.getPolicyList('In Progress')}><b>In Progress</b></span>
                            <span className = {this.state.policyStage == 'Completed'?"dashbordSelectorSelect":''} style = {{marginRight:15, textDecoration: "underline", cursor: "pointer"}} onClick={() => this.getPolicyList('Completed')}><b>Completed</b></span>
                            <span className = {this.state.policyStage == 'Lapsed Or Canceled'?"dashbordSelectorSelect":''} style = {{marginRight:15, textDecoration: "underline", cursor: "pointer"}} onClick={() => this.getPolicyList('Lapsed Or Canceled')}><b>Lapsed Or Canceled</b></span>
                        </Col>
                    </Row>
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.policyList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.policyList.length}
                        exportFilename="StringMap List"
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                </div>

            </div>
        );
    }
}

export default DashboardPolicyList;
