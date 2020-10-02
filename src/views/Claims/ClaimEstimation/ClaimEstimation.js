import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import api from '../../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../../utils/constants';
import { withTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import moment from 'moment';

class ClaimEstimation extends Component {

    constructor(props) {
        super(props);
        let columns = [
            { field: "Class", header: "Class", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "Type", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "From", header: "From", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "To", header: "To", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "Excess", header: "Excess", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
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
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.claimsList.length) ? l : this.state.claimsList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.claimsList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    actionTemplate(rowData, column) {
        // debugger;
        return <div>

        </div>;
    }

    async componentDidMount() {

    }


    componentWillUnmount() {

    }

    render() {
        let columns = '';
        columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div>
                <div className="group float-right">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                    </span>
                </div>
                <div className="table-custom">
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

export default withTranslation()(ClaimEstimation);
