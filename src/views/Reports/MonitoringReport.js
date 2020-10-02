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
import APIConstant from '../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class MonitoringReport extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "SrNO", header: "Sr No", sortable: true, filter: true, id: 0 },
            { field: "MessageType", header: "MessageType", sortable: true, filter: true, id: 1 },
            { field: "MessageText", header: "MessageText", sortable: true, filter: true, id: 2 },
            { field: "Param", header: "Param", sortable: true, filter: true, id: 3 },
            { field: "Comment", header: "Comment", sortable: true, filter: true, id: 4 },
            { body: this.CreatedOn.bind(this), field: "CreatedOn/UpdatedOn", header: "CreatedOn/UpdatedOn", sortable: true, filter: true, id: 5 },
            { body: this.CreatedBy.bind(this), field: "CreatedBy/UpdatedBy", header: "CreatedBy/UpdatedBy", sortable: true, filter: true, id: 6 },
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
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.MonitoringReport();
    }

    CreatedOn(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.CreatedOn}</p>
                <p>{rowData.UpdatedOn}</p>
            </div>
        )
    }

    CreatedBy(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.CreatedBy}</p>
                <p>{rowData.UpdatedBy}</p>
            </div>
        )
    }

    MonitoringReport() {
        api.post('api/MonitoringReport', '').then(res => {
            if (res.success) {
                var formattedData = [];

                var dataLength = res.data[0].length;
                if (dataLength > 0) {
                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            SrNO: tempData.Id,
                            MessageType: tempData.MessageType,
                            MessageText: tempData.MessageText,
                            Param: tempData.Param,
                            Comment: tempData.Comment,
                            CreatedBy: tempData.CreatedBy,
                            UpdatedBy: tempData.UpdatedBy,
                            CreatedOn: moment(tempData.CreatedOn).format('DD/MM/YYYY'),
                            UpdatedOn: moment(tempData.UpdatedOn).format('DD/MM/YYYY')

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
                    <h1>Monitoring Report</h1>
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
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Statement"
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


export default withTranslation()(MonitoringReport);
