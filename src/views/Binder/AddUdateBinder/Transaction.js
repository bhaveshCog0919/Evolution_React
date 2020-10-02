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
import moment from 'moment';

class Transaction extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "TransactionID", header: "Transaction ID", sortable: true, filter: true, id: 0 },
            { field: "SettlementID", header: "Settlement ID", sortable: true, filter: true, id: 1 },
            { field: "Type", header: "Type", sortable: true, filter: true, id: 2 },
            { field: "Policy No", header: "Policy No", sortable: true, filter: true, id: 3 },
            { field: "Status", header: "Status", sortable: true, filter: true, id: 4 },
            { field: "Name/Company", header: "Name/Company", sortable: true, filter: true, id: 5 },
            { field: "Currency", header: "Currency", sortable: true, filter: true, id: 6 },
            { field: "Total", header: "Total", sortable: true, filter: true, id: 7 },
            { field: "Outstanding", header: "Outstanding", sortable: true, filter: true, id: 8 },
            { field: "Created", header: "Created", sortable: true, filter: true, id: 9 },
            { field: "LastUpdated", header: "Last Updated", sortable: true, filter: true, id: 10 },
            { field: "CreatedBy", header: "Created By", sortable: true, filter: true, id: 11 },
            { field: "UpdatedBy", header: "Updated By", sortable: true, filter: true, id: 12 }
        ];

        this.state = {
            selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            transactionArray: [],
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
        this.export = this.export.bind(this);
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.transactionArray.length) ? l : this.state.transactionArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.transactionArray.length + ' records';
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
            this.getTransactions(splitData[3])
        } 
        // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
        //     this.setState({ BinderId: this.props.match.params.Id })
        //     this.getTransactions(this.props.match.params.Id)
        // }
    }

    getTransactions(BinderId) {
        let data = {
            "BinderId": BinderId,
            "UserId": CommonConfig.loggedInUserId(),
        }
        api.post(APIConstant.path.getTransaction, data).then(res => {
            console.log(res.data[0]);

            if (res.success) {
                var transactionData = res.data[0]
                this.setState({
                    transactionArray: transactionData.map((obj) => {
                        console.log(obj);
                        return {
                            "TransactionID": obj.BinderTransactionId,
                            "SettlementID": obj.SettelmentId,
                            "Type": obj.TransactionType,
                            "Policy No": obj.PolicyNumber,
                            "Status": obj.Status,
                            "Name/Company": obj.Name,
                            "Currency": obj.Currency,
                            "Total": obj.TotalAmount,
                            "Outstanding": obj.Outstanding,
                            "Created": CommonConfig.isEmpty(obj.CreatedOn) ? '' : moment(obj.CreatedOn).format('YYYY-MM-DD'),
                            "LastUpdated": CommonConfig.isEmpty(obj.UpdatedOn) ? '' : moment(obj.UpdatedOn).format('YYYY-MM-DD'),
                            "CreatedBy": obj.CreatedByName,
                            "UpdatedBy": obj.UpdatedByName
                        }
                    })
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    render() {
        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Transaction</h1>/
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.transactionArray} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.transactionArray.length} exportFilename="Transaction List"
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

export default withTranslation()(Transaction);