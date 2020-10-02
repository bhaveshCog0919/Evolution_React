import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CommonConfig } from '../../../utils/constants';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';

class SubBinder extends Component {
    constructor(props) {
        super(props);
        
        let columns = [
            { field: "Id", header: "Id", sortable: true, filter: true, id: 0 },
            { field: "Type", header: "Type", sortable: true, filter: true, id: 1 },
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 2 },
            { field: "Title", header: "Title", sortable: true, filter: true, id: 3 },
            { field: "RefID", header: "Ref ID", sortable: true, filter: true, id: 4 },
            { field: "ActiveFrom", header: "Active From", sortable: true, filter: true, id: 5 },
            { field: "ActiveTo", header: "Active To", sortable: true, filter: true, id: 6 },
            { field: "LastUpdated", header: "Last Updated", sortable: true, filter: true, id: 7 },
            { field: "UpdatedBy", header: "Updated By", sortable: true, filter: true, id: 8 },
            { field: "Status", header: "Status", sortable: true, filter: true, id: 9 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 10 }
        ];

        this.state = {
            selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            subBinderArray: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.subBinderArray.length) ? l : this.state.subBinderArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.subBinderArray.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    export() {
        this.dt.exportCSV();
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.edit(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button>
        </div>;
    }

    componentWillMount() {

    }

    componentDidMount() {
        var splitData = this.props.location.pathname.split("/");
        // if (splitData[3] !== undefined) {
        if (!CommonConfig.isEmpty(splitData[3])) {
            this.setState({ BinderId: splitData[3] })
            this.getSubBinders(splitData[3])
        } 
        // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
        //     this.setState({ BinderId: this.props.match.params.Id })
        //     this.getSubBinders(this.props.match.params.Id)
        // }
    }

    getSubBinders(BinderId) {
        
        let data = {
            "BinderId": BinderId,
            "UserId": CommonConfig.loggedInUserId(),
        }
        api.post(APIConstant.path.getSubBinders, data).then(res => {
            console.log(res.data[0]);

            if (res.success) {
                var getSubBinders = res.data[0]
                this.setState({
                    subBinderArray: getSubBinders.map((obj) => {
                        console.log(obj);
                        return {
                            "Id": obj.SubBinderId,
                            "Type": obj.SubBinderType,
                            "AgentName": obj.NAME,
                            "Title": obj.SubBinderTitle,
                            "RefID": obj.ContactCode,
                            "ActiveFrom": obj.LiveStartDate,
                            "ActiveTo": obj.LiveEndDate,
                            "LastUpdated": obj.UpdatedOn,
                            "UpdatedBy": obj.UpdatedByName,
                            "Status": obj.Status,
                        }
                    })
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    addBinder() {
        this.props.history.push('/AddUpdateBinder');
    }

    render() {
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
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Sub Binders</h1>/
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        <Button type="button" icon="pi pi-plus" tooltip="Add Contact" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addBinder()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.subBinderArray} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.subBinderArray.length} exportFilename="Contact List"
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

export default withTranslation()(SubBinder);