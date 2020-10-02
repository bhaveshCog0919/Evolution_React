import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import api from '../../utils/apiClient';
import { Button as BTN } from 'primereact/button';
import { Card, CardBody, Col, Table, Row, Input, Button, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form, UncontrolledTooltip } from 'reactstrap';
import APIConstant, { CommonConfig } from '../../utils/constants';
import { withTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import moment from 'moment';

class ClaimList extends Component {

    constructor(props) {
        super(props);
        let columns = [
            { body: this.claimDataTemplate.bind(this), header: "Claim Number [Policy Number]", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { body: this.VesselClaimTemplate.bind(this), header: "Vessel / Claim Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Name", header: "Full Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.dateTemplate.bind(this), header: "Loss Date / Date Reported / Binder Year", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { body: this.stageDataTemplate.bind(this), header: "Stage", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "HandledBy", header: "Handler", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 13 }
        ];

        this.state = {
            claimsList: [],
            cols: columns,
            paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null
        };
        this.dateTemplate = this.dateTemplate.bind(this);
        this.VesselClaimTemplate = this.VesselClaimTemplate.bind(this);
        this.claimDataTemplate = this.claimDataTemplate.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.stageDataTemplate = this.stageDataTemplate.bind(this);
    }

    stageDataTemplate(rowData, column) {
        return <div className="policy-list-data">
            <p>{rowData.Stage}</p>
        </div>
    }

    dateTemplate(rowData, column) {
        return <div className="policy-list-data">
            <p>{moment(rowData.DateReported).format(CommonConfig.dateFormat.forDatePicker)}/{moment(rowData.BinderYear).format(CommonConfig.dateFormat.forDatePicker)}</p>
        </div>
    }

    claimDataTemplate(rowData, column) {
        // debugger;
        return <div className="policy-list-data">
            <p>{rowData.ClaimNumber}</p>
        </div>
    }

    VesselClaimTemplate(rowData, column) {
        // debugger;
        return <div className="policy-list-data">
            <p>{rowData.ClaimType}</p>
        </div>
    }

    getClaimList() {
        let data = {
            //"PolicyId":this.state.PolicyId
            "PolicyId": "10502036-f2ff-4ff6-a43b-1a2336bfa5c4"
        }
        api.post(APIConstant.path.getClaimList, data).then(res => {
            console.log(res)
            if (res.success) {
                this.setState({ claimsList: res.data });
            }
        }).catch(err => {
            console.log(err)
        });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.claimsList.length) ? l : this.state.claimsList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.claimsList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    openDetail(rowData) {
        this.props.history.push({
            pathname: '/ClaimsDetail',
            state: {
                claimID: rowData.ClaimId
            }
        });
    }

    actionTemplate(rowData, column) {
        // debugger;
        return <div>
            <BTN type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.openDetail(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </BTN>
        </div>;
    }

    async componentDidMount() {
        this.getClaimList()
    }


    componentWillUnmount() {

    }

    render() {
        let columns = '';
        columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div className="animated fadeIn">
                <div className="table-custom">
                    <Row>
                        <CardBody>
                            <div className="group float-right">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                                </span>
                            </div>
                        </CardBody>
                    </Row>
                    <DataTable ref={(el) => this.dt = el} value={this.state.claimsList} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.claimsList.length} exportFilename="Claims List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                        paginatorTemplate={this.state.paginatorTemplate}
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

export default withTranslation()(ClaimList);
