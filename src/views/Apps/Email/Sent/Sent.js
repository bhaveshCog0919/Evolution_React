import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, FormGroup, Input, Col, ButtonDropdown, Table, DropdownToggle, DropdownMenu, DropdownItem, Badge, Button, ButtonGroup, Row } from 'reactstrap';
import APIConstant from '../../../../utils/constants';
import { CommonConfig } from '../../../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button as BTN } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import api from '../../../../utils/apiClient';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from 'moment';
import { any } from 'prop-types';
import { toast } from 'react-toastify';
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

class Sent extends Component {

  constructor(props) {
    super(props);

    let columns = [
      { body: this.actionTemplate.bind(this), style: { width: '50px' }, header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 0 },
      { body: this.formatNameEmail.bind(this), field: "FromEmail", header: "From", sortable: true, filter: true, filter: false, filterMatchMode: 'contains', id: 3 },
      { body: this.formatSubject.bind(this), field: "Subject", header: "Subject", sortable: true, filter: true, filter: false, filterMatchMode: 'contains', id: 5 },
      { body: this.formatDate.bind(this), field: "CreatedOn", header: "Date/Time", sortable: true, filter: false, filterMatchMode: 'contains', id: 6 },
    ];

    this.toggle = this.toggle.bind(this);
    this.state = {
      editEmailData: '',
      dropdownOpen: false,
      emailList: [],
      InboxCount: 0,
      globalFilter: null,
      cols: columns,
      first: 1,
      selectedEmail: [],
      rows: 10,
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
    };
    
    this.getInbox()
  }

  actionTemplate(rowData, column) {
    return <div className="policy-list-data">
      <BTN type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.openDetail(rowData)}
        style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
      </BTN>
    </div>;
  }

  onPage(event) {
    let firstPage = event.first + 1;
    let l = event.rows * (event.page + 1);
    let lastPage = (l < this.state.emailList.length) ? l : this.state.emailList.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.emailList.length + ' records';
    this.setState({ selectedPage: event.first, str: str, rowsPerPage: event.rows });
  }

  formatDate(rowData) {
    return (
      <div className="policy-list-data">
        <p>{moment(rowData.CreatedOn).format(CommonConfig.dateFormat.dbDateTime)}</p>
      </div>
    )
  }

  formatSubject(rowData) {
    return (
      <div className="policy-list-data">
        <p>{rowData.Subject} {rowData.AttachCount > 0 ? <i class="fa fa-paperclip" aria-hidden="true">({rowData.AttachCount})</i> : (null)}</p>
      </div>
    )
  }

  formatNameEmail(rowData) {
    return (
      <div className="policy-list-data">
        <p>{rowData.FromName}</p>
        <p>{rowData.FromEmail}</p>
      </div>
    )
  }

  getInbox() {
    let data = {
      "boxName": "Sent",
      "searchType": "ALL",
      "PolicyId":this.state.PolicyId
    }
    api.post(APIConstant.path.allEmail, data).then(res => {
      console.log(res)
      if (res.success) {
        this.setState({ emailList: res.data ,selectedEmail:[]});
        let count = this.state.emailList.filter((item) => {
          if (item.IsViewed.data[0] == 0) {
            return true
          } else {
            return false
          }
        }).length
        this.setState({ InboxCount: count })
      }
    }).catch(err => {
      console.log(err)
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  openDetail(item) {
    this.props.history.push({
      pathname: '/apps/email/message',
      state: {
        type:"sent",
        email: item,
        InboxCount: this.state.InboxCount
      }
    });
  }

  rowClass(data) {
    return {
      'row-accessories': data.IsViewed.data[0] === 0
    }
  }

  render() {

    let columns = this.state.cols.map((col, i) => {
      return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
    });

    return (
      <div className="animated fadeIn">
        <div className="email-app mb-4">
          <nav>
            <a href="#/apps/email/compose" className="btn btn-danger btn-block">New Email</a>
            <Nav>
              <NavItem>
                <NavLink href="#/apps/email/inbox"><i className="fa fa-inbox"></i> Inbox <Badge color="danger">{this.state.InboxCount}</Badge></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/apps/email/sent"><i className="fa fa-inbox"></i> Sent </NavLink>
              </NavItem>
            </Nav>
          </nav>
          <main className="inbox">
            <ul className="messages">
              <DataTable
                ref={(el) => this.dt = el}
                value={this.state.emailList}
                rowClassName={this.rowClass}
                first={this.state.selectedPage}
                onPage={(e) => this.onPage(e)}
                paginator={true}
                rows={this.state.rowsPerPage}
                totalRecords={this.state.emailList.length}
                exportFilename="Email List"
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
            </ul>
          </main>
        </div>
      </div>
    )
  }
}

export default Sent;
