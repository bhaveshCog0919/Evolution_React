import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { apiBase } from '../../utils/config';
import ShowMoreText from 'react-show-more-text';

class Timeline extends Component {
  constructor() {
    super();

    let columns = [
      { field: "time", header: "Time", id: 0 },
      { field: "User", header: "User", id: 1 },
      { field: "Action", header: "Action", id: 2 },
      { field: "Binder", header: "Binder", id: 3 },
      { field: "Date_Renewal", header: "Date Renewal", id: 4 },
      { field: "Note", header: "Note", id: 5 },
      // { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 6 }
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

    // this.onColumnToggle = this.onColumnToggle.bind(this);
    // this.export = this.export.bind(this);
    // this.actionTemplate = this.actionTemplate.bind(this);
  }

  componentDidMount() {
    this.getTimelineDetails();
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

  render() {
    var header = <div>
    </div>;
    let columns = this.state.cols.map((col, i) => {
      return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
    });
    return (
      <div className="table-custom">
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
    )
  }
}

export default Timeline;