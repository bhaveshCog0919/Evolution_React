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

class Inbox extends Component {

  constructor(props) {
    super(props);

    let columns = [
      { body: this.actionTemplate.bind(this), style: { width: '50px' }, header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 0 },
      { body: this.formatTags.bind(this), field: "TagsString", header: "Tags", sortable: true, filter: true, filter: false, filterMatchMode: 'contains', id: 3 },
      { body: this.formatNameEmail.bind(this), field: "FromEmail", header: "From", sortable: true, filter: true, filter: false, filterMatchMode: 'contains', id: 3 },
      { body: this.formatSubject.bind(this), field: "Subject", header: "Subject", sortable: true, filter: true, filter: false, filterMatchMode: 'contains', id: 5 },
      { body: this.formatDate.bind(this), field: "CreatedOn", header: "Date/Time", sortable: true, filter: false, filterMatchMode: 'contains', id: 6 },
    ];

    this.toggle = this.toggle.bind(this);
    this.state = {
      tagModel: false,
      tagTypeArray: [],
      tagType: '',
      PolicyId:this.props.match.params.id,
      tagValue: '',
      tagsData: [],
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
    this.getTagsDropDownValues()
  }

  setSelectedEmail = (e) => {
    this.setState({ selectedEmail: e })
  }

  addTag(rowData) {
    if (rowData.Tags != undefined) {
      for (let index = 0; index < rowData.Tags.length; index++) {
        this.state.tagsData.push({"TagType":rowData.Tags[index].TagName,"TagValue":rowData.Tags[index].Value})
      }
    }
    this.setState({
      editEmailData: rowData, tagModel: true, tagType: '', tagName: '',
      tagValue: ''
    })
  }

  removeTagTemp(index) {
    try {
      this.state.tagsData.splice(index, 1)
      var data = {
        delete: true,
        Tags: this.state.tagsData[index],
        EmailUID: this.state.editEmailData.EmailUID
      }
      api.post(APIConstant.path.addUpdateTags, data,true).then(res => {
        if (res.data.success) {
          toast.success(res.data.msg);
        }
      }).catch(err => {
      });
    } catch (error) {
      console.log("error...",)
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'tagValue') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ tagValue: '' });
      } else {
        this.setState({ tagValue: e.target.value });
      }
    }
  }

  submitTags() {
    try {
      this.state.tagsData.push({"TagType":this.state.tagType,"TagValue":this.state.tagValue})
      var data = {
        delete: false,
        Tags: {"TagType":this.state.tagType,"TagValue":this.state.tagValue},
        EmailUID: this.state.editEmailData.EmailUID
      }
      api.post(APIConstant.path.addUpdateTags, data,true).then(res => {
        if (res.data.success) {
          this.state.tagType = ""
          this.state.tagValue = ""
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      }).catch(err => {
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  formatTags(rowData) {
    return (
      <div className="policy-list-data">
        <p>{rowData.TagsString}</p>
        <Button color="light" onClick={() => this.addTag(rowData)} className={'mr-1'}><i class="fa fa-plus" aria-hidden="true"></i></Button>
      </div>
    )
  }

  getTagsDropDownValues() {
    try {
      const data = {
        stringmaptype: "EMAILTAG",
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ tagTypeArray: res.data });
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  onPage(event) {
    let firstPage = event.first + 1;
    let l = event.rows * (event.page + 1);
    let lastPage = (l < this.state.emailList.length) ? l : this.state.emailList.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.emailList.length + ' records';
    this.setState({ selectedPage: event.first, str: str, rowsPerPage: event.rows });
  }

  actionTemplate(rowData, column) {
    return <div className="policy-list-data">
      <BTN type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.openDetail(rowData)}
        style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
      </BTN>
      {rowData.IsImportant.data[0] == 1 ? <Button color="light" onClick={() => this.addRemoveFlag(rowData, "FLAGGED", true)}><span className="fa fa-star"></span></Button> : <Button color="light" onClick={() => this.addRemoveFlag(rowData, "FLAGGED", false)}><span className="fa fa-star-o"></span></Button>}
      {rowData.IsViewed.data[0] == 1 ? <Button color="light" onClick={() => this.addRemoveFlag(rowData, "SEEN", true)}><span className="fa fa-envelope"></span></Button> : <Button color="light" onClick={() => this.addRemoveFlag(rowData, "SEEN", false)}><span className="fa fa-envelope-o"></span></Button>}
      <Button color="light" onClick={() => this.deleteMessage(rowData)} className={'mr-1'}><span className="fa fa-trash-o"></span></Button>
    </div>;
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

  deleteMessage(emails) {
    let data = {}
    if (emails == ''){
      let UIDData =  this.state.selectedEmail
                    .map((data) => {
                        return String(data.EmailUID)
                    })
      data = {
        "uid": UIDData,
        "boxName": "INBOX",
        "searchType": "ALL"
      }
    } else {
      data = {
        "uid": [emails.EmailUID],
        "boxName": "INBOX",
        "searchType": "ALL"
      }
    }
    api.post(APIConstant.path.deleteMessage, data).then(res => {
      if (res.success) {
        this.getInbox()
      }

    }).catch(err => {
      console.log(err)
    });
  }

  addRemoveFlag(emails, FlagName, remove) {
    let data = {}
    if (emails == ''){
      let UIDData =  this.state.selectedEmail
                    .map((data) => {
                        return String(data.EmailUID)
                    })
      data = {
        "uid": UIDData,
        "boxName": "INBOX",
        "flagname": FlagName,
        "remove": remove
      }
    } else {
      data = {
        "uid": [emails.EmailUID],
        "boxName": "INBOX",
        "flagname": FlagName,
        "remove": remove
      }
    }
    api.post(APIConstant.path.addRemoveFlag, data).then(res => {
      if (res.success) {
        this.getInbox()
      }

    }).catch(err => {
      console.log(err)
    });
  }

  getInbox() {
    let data = {
      "boxName": "Inbox",
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

  selectType(value, type) {
    //need to select template
    if (type === 'tagType') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ tagType: '' });
      } else {
        this.setState({ tagType: value });
      }
    }
  }

  openDetail(item) {
    this.props.history.push({
      pathname: '/apps/email/message',
      state: {
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
            <div className="toolbar">
              {/* {this.state.selectedEmail.length > 0 ?  */}
              <ButtonGroup className={'mr-1'}>
              <Button color="light" onClick={() => this.addRemoveFlag('', "FLAGGED", false)}><span className="fa fa-star"></span></Button> 
              <Button color="light" onClick={() => this.addRemoveFlag('', "FLAGGED", true)}><span className="fa fa-star-o"></span></Button>
              <Button color="light" onClick={() => this.addRemoveFlag('', "SEEN", false)}><span className="fa fa-envelope"></span></Button> 
              <Button color="light" onClick={() => this.addRemoveFlag('', "SEEN", true)}><span className="fa fa-envelope-o"></span></Button>
              <Button color="light" onClick={() => this.deleteMessage('')}><span className="fa fa-trash-o"></span></Button>
              </ButtonGroup>
              <div className="group float-right">
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                </span>
              </div>
            </div>
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
                selection={this.state.selectedEmail}
                onSelectionChange={e => this.setSelectedEmail(e.value)}
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
                <Column selectionMode="multiple" style={{ width: '3em' }} />
                {columns}
              </DataTable>
            </ul>
          </main>
        </div>
        <Modal isOpen={this.state.tagModel} className={'modal-lg'} style={{ maxWidth: '70%' }}>
          <ModalHeader toggle={() => this.setState({ tagModel: false })}> Tags </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <span>Email Subject#: {this.state.editEmailData.Subject}</span>
              </Col>
              <Col md="6">
                <span>Date: {moment(this.state.editEmailData.CreatedOn).format(CommonConfig.dateFormat.forDatePicker)}</span>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="input-box">
                  <Input type="select" name="tagType" id="tagType" value={this.state.tagType} onChange={(e) => this.selectType(e.target.value, 'tagType')}>
                    <option value="">Select Tag Type</option>
                    {this.state.tagTypeArray.map((tagType, i) => {
                      return (<option value={tagType.StringMapKey} key={i}>{tagType.StringMapName}</option>)
                    })
                    }
                  </Input>
                </div>
              </Col>
              <Col md="3">
                <div className="input-box">
                  <Input type="text" name="tagValue" id="tagValue"
                    value={this.state.tagValue}
                    onChange={(e) => this.handleChange(e)} />
                </div>
              </Col>
              <Col md="3">
                <Button color="success" onClick={() => this.submitTags()}>Add</Button>
              </Col>
            </Row>
            <Row>
              <Col md="7">
                <span>{this.state.tagsData.length} Tags </span>
                <Table>
                  <thead>
                    <tr>
                      <th className="center">Tag Name</th>
                      <th className="center">Value</th>
                      <th className="center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.tagsData.map((tagData,i)=> {
                      return (<tr>
                        <td className="center">{tagData.TagType}</td>
                        <td className="center">{tagData.TagValue}</td>
                        <td className="center"><Button color="light" onClick={() => this.removeTagTemp(i)} className={'mr-1'}><span className="fa fa-trash-o"></span></Button></td>
                      </tr>)
                    })
                    }
                  </tbody>
                </Table>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Inbox;
