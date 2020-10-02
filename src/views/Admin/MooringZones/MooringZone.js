import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import api from '../../../utils/apiClient';
import Moment from 'moment';
import { CommonConfig } from '../../../utils/constants';

class MooringZone extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "Id", header: "ID", id: 0 },
            { field: "Title", header: "Title", id: 1 },
            { field: "Summary", header: "Summary", id: 2 },
            { field: "Created", header: "Created", id: 3 },
            { field: "Updated", header: "Updated", id: 4 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 5 }
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
            isEdit: false
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
    }

    componentDidMount() {
        this.getMooringZone();
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={() => this.editMooringZone(rowData)}></Button>
            <Button type="button" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} icon="pi pi-trash" className="p-button-danger" onClick={() => this.DeleteMooringZone(rowData)}></Button>
        </div>;
    }

    getMooringZone() {
        api.post('api/getMooringZone').then(res => {
            console.log("getMooringZone", res);
            if (res.success) {
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    var Updated = (res.data[i].UpdatedOn === undefined || res.data[i].UpdatedOn === null || res.data[i].UpdatedOn === "") ? ("No Updates") : (Moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateTime));
                    formattedData.push({
                        Id: [i + 1],
                        MooringZoneId: res.data[i].MooringZoneId,
                        Title: res.data[i].MooringZoneName,
                        Summary: res.data[i].Summary,
                        Created: Moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateTime),
                        Updated: Updated,
                    });
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                    this.setState({ arr: formattedData, str: str });
                }
            } else {
                console.log("Else");

            }
        }).catch(err => {

        });
    }

    editMooringZone(rowData) {
        console.log("rowData", rowData);
        var Id = rowData.MooringZoneId;
        var Title = rowData.Title;
        var Summary = rowData.Summary;

        this.props.history.push({
            pathname: '/EditMooringZone/' + Id,
            state: {
                Id: Id,
                Title: Title,
                Summary: Summary,
                // isEdit: true
            }
        });
    }

    DeleteMooringZone(rowData) {
        console.log("rowData", rowData);
        try {
            let data = {
                MooringZoneId: rowData.MooringZoneId
            }
            api.post('api/deleteMooringZone', data).then(res => {
                if (res.success) {
                    toast.success("Mooring Zone deleted successfully");
                }
            })
        } catch (error) {
            console.log("error", error);
        }
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

    addMoreMooring = () => {
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
                    <h1>Mooring Zone</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Mooring Zone" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addMoreMooring()}></Button>
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