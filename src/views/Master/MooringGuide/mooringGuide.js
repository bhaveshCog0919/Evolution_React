import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import moment from 'moment';

class mooringGuide extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "id", header: "Id", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "name", header: "Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "County", header: "County/Region", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "Location", header: "Location", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "location_type", header: "Location Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "Loading", header: "Loading", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "mooring_Type", header: "Mooring Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "approval_Required", header: "Approval Required", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 6 }
        ];

        this.state = {
            cols: columns,
            arr: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            isEdit: false
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.getMooringGuide();
    }

    getMooringGuide() {
        api.post('api/getMooringGuide').then(res => {
            if (res.success) {
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    var approvalRequired = (res.data[i].IsApprovalRequired.data[0] == 1) ? ("Yes") : ("No");
                    formattedData.push({
                        id: [i + 1],
                        MooringGuideId: res.data[i].MooringGuideId,
                        name: res.data[i].MooringName,
                        Country: res.data[i].countryName,
                        County: res.data[i].Region,
                        Location: res.data[i].Location,
                        location_type: res.data[i].LocationType,
                        Loading: res.data[i].LoadingPercent.toFixed(2),
                        mooring_Type: res.data[i].MooringType,
                        approval_Required: approvalRequired,
                        CountryId: res.data[i].CountryId,
                        Longitude: res.data[i].Longitude,
                        Latitude: res.data[i].Latitude,
                        Notes: res.data[i].Notes,
                        MooringZone: res.data[i].MooringZone
                    });
                }
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ arr: formattedData, str: str });
            } else {
                console.log("Else");

            }
        }).catch(err => {

        });
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

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={() => this.onEditRow(rowData)}></Button>
        </div>;
    }

    export() {
        this.dt.exportCSV();
    }

    addMoreMooringGuide = () => {
        this.props.history.push({
            pathname: '/AddMooringGuide'
        });
        // this.props.history.push('/AddMooringGuide');
    }

    onEditRow = (rowData) => {debugger
        var Id = rowData.MooringGuideId;
        this.props.history.push({
            pathname: '/EditMooringGuide/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    render() {
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Mooring Guide</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Mooring Guide" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addMoreMooringGuide()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export As CSV" tooltipOptions={{ position: 'bottom' }} onClick={() => this.export()}></Button>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.arr}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        // onRowClick={(e) => this.onEditRow(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.arr.length}
                        exportFilename="Mooring Guide List"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="265px">
                        {columns}
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default mooringGuide;