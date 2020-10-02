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
import { Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
// import api from '../../utils/apiClient';
// import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../../utils/constants';
// import { apiBase } from '../../utils/config';
import ShowMoreText from 'react-show-more-text';

class MooringZone extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "Id", header: "ID", id: 0 },
            { field: "Title", header: "Title", id: 1 },
            { field: "Summary", header: "Summary", id: 2 },
            { field: "Created", header: "Created", id: 3 },
            { field: "Updated", header: "Updated", id: 4 },
            { body: this.editTemplete.bind(this), header: "Action", sortable: false, filter: false, id: 5 },
            { body: this.deleteTemplete.bind(this), header: "Action", sortable: false, filter: false, id: 6 },
        ];

        this.state = {
            brand: null,
            colors: null,
            toggleModalDel: false,
            toggleModalAdd: false,
            cols: columns,
            arr: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.export = this.export.bind(this);
        this.editTemplete = this.editTemplete.bind(this);
        this.deleteTemplete = this.deleteTemplete.bind(this);
    }

    componentDidMount() {
        this.getTimelineDetails();
    }

    editTemplete(rowData, column) {
        return <div>
            <Button type="button" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={() => this.editTask(rowData)}></Button>
        </div>;
    }

    deleteTemplete(rowData, column) {
        return <div>
            <Button type="button" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} icon="pi pi-trash" className="p-button-danger" onClick={() => this.DeleteTaskModal(rowData)}></Button>
        </div>;
    }

    getTimelineDetails() {
        var formattedData = [];
        let firstPage = (formattedData.length) ? '1' : '0';
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    export() {
        this.dt.exportCSV();
    }

    addMoreMooring = () => {
        debugger
        // this.props.history.push({'/AddMooringGuide'});

        this.props.history.push({
            pathname: '/AddMooringZone'
        });
    }

    render() {
        var header = <div>

        </div>;
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Mooring Guide</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Contact" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addMoreMooring()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>
                <div className="header-right-option">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Task List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                        scrollable={true} scrollHeight="265px">
                        {columns}
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default MooringZone;