/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../utils/apiClient';
import APIConstant from '../../../../utils/constants';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { CommonConfig } from '../../../../utils/constants';
import { AutoComplete } from 'primereact/autocomplete';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from 'moment';
import CKEditor from 'ckeditor4-react';
import { Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, Button, ButtonGroup, FormGroup, Input, Button as BTN, Form, Label, Row, Col } from 'reactstrap';
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

class Message extends Component {

  constructor(props) {
    super(props);

    if (this.props.location.state == undefined) {
      this.props.history.push({
        pathname: '/apps/email/inbox'
      });
      return
    }

    let columns = [
      { selectionMode: "multiple", style: { width: '3em' }, id: 0 },
      { field: "Filename", header: "Name", sortable: true, filter: true, id: 1 },
      { body: this.formatCreatedDate.bind(this), field: "CreatedOn", header: "Created", sortable: true, filter: true, id: 2 },
      { field: "forename", header: "CreatedBy", sortable: true, filter: true, id: 3 },
      { field: "Directory", header: "Directory", sortable: true, filter: true, id: 4 },
    ];

    this.toggle = this.toggle.bind(this);
    this.state = {
      messageType:this.props.location.state.type,
      documentType: "",
      replytoView: false,
      replyAllView: false,
      forwordView: false,
      attachmentURL: [],
      totalDocument: [],
      selectedDocuments: [],
      cols: columns,
      str: '',
      customDoc: [],
      openAttachmentPopup: false,
      filteredPolicysSingle: null,
      selectedPolicy: null,
      selectedPolicyId: null,
      policysData: [],
      documentList: [],
      dropdownOpen: false,
      emails: this.props.location.state.email,
      emailBody: "",
      emailBodyError: false,
      InboxCount: this.props.location.state.InboxCount,
      attachment: [],
      emailFrom: this.props.location.state.email.FromEmail,
      emailFromName: this.props.location.state.email.FromName,
      emailTo: this.props.location.state.email.FromEmail,
      emailCC: this.props.location.state.email.CCEmail,
      emailBCC: this.props.location.state.email.BCCEmail,
      emailSubject: "Re:" + this.props.location.state.email.Subject,
    };

    this.colOptions = [];
    for (let col of columns) {
      this.colOptions.push({ label: col.header, value: col });
    }

    this.onColumnToggle = this.onColumnToggle.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.getAttachment()
    if (this.state.emails.IsViewed.data[0] == 0) {
      this.addRemoveFlag(this.state.emails, "SEEN", false)
    }
  }

  deleteMessage(emails) {
    let data = {
      "uid": emails.EmailUID,
      "boxName": "INBOX",
      "searchType": "ALL"
    }
    api.post(APIConstant.path.deleteMessage, data).then(res => {
      if (res.success) {
        this.props.history.push({
          pathname: '/apps/email/inbox'
        });
      }
    }).catch(err => {
      console.log(err)
    });
  }

  addRemoveFlag(emails, FlagName, remove) {
    let data = {
      "uid": emails.EmailUID,
      "boxName": "INBOX",
      "flagname": FlagName,
      "remove": remove
    }
    api.post(APIConstant.path.addRemoveFlag, data).then(res => {
      if (res.success) {
        if (FlagName == "FLAGGED" && remove == false) {
          this.state.emails.IsImportant.data[0] = 1
        } else if (FlagName == "FLAGGED" && remove == true) {
          this.state.emails.IsImportant.data[0] = 0
        } else if (FlagName == "SEEN" && remove == true) {
          this.state.emails.IsViewed.data[0] = 0
        } else if (FlagName == "SEEN" && remove == true) {
          this.state.emails.IsViewed.data[0] = 0
        }
      }
    }).catch(err => {
      console.log(err)
    });
  }

  onColumnToggle(event) {
    let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
    this.setState({ cols: valueInOrder });
  }

  formatCreatedDate(rowData) {
    return (
      moment(rowData.CreatedOn).format(CommonConfig.dateFormat.dateTime)
    )
  }

  selectDocument = (event) => {
    var docuCustom = []
    if (event.target.files && event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        docuCustom.push(event.target.files[i])
      }
      this.setState({ customDoc: this.state.customDoc.concat(docuCustom) });
    } else {

    }
  }

  removeDocument(type, index) {
    if (type == "policy") {
      this.state.selectedDocuments.splice(index, 1)
    } else {
      this.state.customDoc.splice(index, 1)
    }
  }

  getDocumentList() {
    try {
      const data = {
        "pPolicyId": this.state.policysData[0].policyId,
        'CurrentUser': CommonConfig.loggedInUserData().EntityId
      };
      api.post("api/getDocumentList", data).then(res => {
        console.log("res", res);
        if (res.success) {
          let lastPage = (this.state.rowsPerPage < res.data.length) ? this.state.rowsPerPage : res.data.length;
          let str = '1 to ' + lastPage + ' out of ' + res.data.length + ' records';
          this.setState({ documentList: res.data, str: str, openAttachmentPopup: true });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  selectType(value, type) {
    //need to select template
    if (type === 'selectPolicy') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ selectedPolicy: '', selectedPolicyId: '' });
      } else {
        this.setState({ selectedPolicy: value });
      }
    }

    if (type === 'documentType') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ documentType: '' });
      } else {
        this.setState({ documentType: value });
        if (value == "1") {
          this.setState({ openAttachmentPopup: true });
        } else {
          document.getElementById("customDoc").click()
        }
      }
    }
  }

  handleDetailsChange(evt) {
    const data = evt.editor.getData();
    if (CommonConfig.isEmpty(data)) {
      this.setState({ emailBodyError: true, emailBody: '' });
      // this.show("customEndorsementDetails", true);
    } else {
      this.setState({ emailBodyError: false, emailBody: data });
      // this.show("customEndorsementDetails", false);
    }
  }

  downloadData = (rowdata) => {
    var blob = new Blob([rowdata.content], { type: rowdata.contentType });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = rowdata.filename;
    link.download = fileName;
    link.click();
  }

  filterPolicySingle() {
    let data = {
      "pPolicyId": '',
      "pPolicyNumber": this.state.selectedPolicy,
      "CurrentUser": CommonConfig.loggedInUserData().EntityId
    }
    api.post(APIConstant.path.getPolicyAutoComplete, data).then(res => {
      if (res.success) {
        this.setState({ policysData: res.data })
        this.getDocumentList()
      } else {
        this.setState({ policysData: [] })
        toast.error(res.data[0].returnValue);
      }
    }).catch(err => {
      console.log(err)
    });
  }

  forwordMail() {
    const emailDataForm = new FormData();
    emailDataForm.append("to", this.state.emailTo)
    emailDataForm.append("replyTo", this.state.emails.InReplyTo)
    emailDataForm.append("messageId", this.state.emails.MessageId)
    emailDataForm.append("from", this.state.emailFrom)
    emailDataForm.append("cc", this.state.emailCC)
    emailDataForm.append("bcc", this.state.emailBCC)
    emailDataForm.append("subject", this.state.emailSubject)
    emailDataForm.append("mail", 'RenewalMail')
    emailDataForm.append("EmailSenderId", CommonConfig.loggedInUserData().EntityId)
    emailDataForm.append("html", this.state.emailBody)
    emailDataForm.append("selectedDocuments", JSON.stringify(this.state.selectedDocuments))

    for (let i = 0; i < this.state.customDoc.length; i++) {
      emailDataForm.append("File", this.state.customDoc[i], this.state.customDoc[i].name);
    }

    api.post(APIConstant.path.forwordMail, emailDataForm).then(res => {
      if (res.success) {
        toast.success('Mail Send Successful!');
        this.props.history.push({
          pathname: '/apps/email/inbox'
        });
      } else {
        toast.error('Mail Send Failed!');
      }
    }).catch(err => {
      console.log(err)
    });

  }

  sendReplyAll() {
    const emailDataForm = new FormData();
    emailDataForm.append("to", this.state.emailTo)
    emailDataForm.append("replyTo", this.state.emails.InReplyTo)
    emailDataForm.append("messageId", this.state.emails.MessageId)
    emailDataForm.append("from", this.state.emailFrom)
    emailDataForm.append("cc", this.state.emailCC)
    emailDataForm.append("bcc", this.state.emailBCC)
    emailDataForm.append("subject", this.state.emailSubject)
    emailDataForm.append("mail", 'RenewalMail')
    emailDataForm.append("EmailSenderId", CommonConfig.loggedInUserData().EntityId)
    emailDataForm.append("html", this.state.emailBody)
    emailDataForm.append("selectedDocuments", JSON.stringify(this.state.selectedDocuments))

    for (let i = 0; i < this.state.customDoc.length; i++) {
      emailDataForm.append("File", this.state.customDoc[i], this.state.customDoc[i].name);
    }

    api.post(APIConstant.path.forwordMail, emailDataForm).then(res => {
      if (res.success) {
        toast.success('Mail Send Successful!');
        this.props.history.push({
          pathname: '/apps/email/inbox'
        });
      } else {
        toast.error('Mail Send Failed!');
      }
    }).catch(err => {
      console.log(err)
    });

  }

  sendReply() {
    const emailDataForm = new FormData();
    emailDataForm.append("to", this.state.emailTo)
    emailDataForm.append("replyTo", this.state.emails.InReplyTo)
    emailDataForm.append("messageId", this.state.emails.MessageId)
    emailDataForm.append("from", this.state.emailFrom)
    emailDataForm.append("cc", this.state.emailCC)
    emailDataForm.append("bcc", this.state.emailBCC)
    emailDataForm.append("subject", this.state.emailSubject)
    emailDataForm.append("mail", 'RenewalMail')
    emailDataForm.append("EmailSenderId", CommonConfig.loggedInUserData().EntityId)
    emailDataForm.append("html", this.state.emailBody)
    emailDataForm.append("selectedDocuments", JSON.stringify(this.state.selectedDocuments))

    for (let i = 0; i < this.state.customDoc.length; i++) {
      emailDataForm.append("File", this.state.customDoc[i], this.state.customDoc[i].name);
    }

    api.post(APIConstant.path.sendReply, emailDataForm).then(res => {
      if (res.success) {
        toast.success('Mail Send Successful!');
        this.props.history.push({
          pathname: '/apps/email/inbox'
        });
      } else {
        toast.error('Mail Send Failed!');
      }
    }).catch(err => {
      console.log(err)
    });

  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'emailTo') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ emailTo: '' });
      } else {
        this.setState({ emailTo: e.target.value });
      }
    }

    if (e.target.name === 'emailFrom') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ emailFrom: '' });
      } else {
        this.setState({ emailFrom: e.target.value });
      }
    }

    if (e.target.name === 'emailCC') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ emailCC: '' });
      } else {
        this.setState({ emailCC: e.target.value });
      }
    }

    if (e.target.name === 'emailBCC') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ emailBCC: '' });
      } else {
        this.setState({ emailBCC: e.target.value });
      }
    }

    if (e.target.name === 'emailSubject') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ emailSubject: '' });
      } else {
        this.setState({ emailSubject: e.target.value });
      }
    }
  }

  getAttachment() {
    let data = {
      "uid": this.state.emails.EmailUID,
      "boxName":this.state.messageType == "sent" ? "INBOX.Sent" : "INBOX"
    }
    api.post(APIConstant.path.getAttachment, data).then(res => {
      if (res.success) {
        var all = _.find(res.data[0].parts, { "which": "" })
        var id = this.state.emails.EmailUID;
        var idHeader = "Imap-Id: " + id + "\r\n";
        simpleParser(idHeader + all.body, (err, mail) => {
          this.setState({ emailBody: mail.html == false ? mail.textAsHtml : mail.html, attachment: mail.attachments })
        });
      }
    }).catch(err => {
      console.log(err)
    });
  }

  mulSelect = (e) => {
    this.setState({ selectedDocuments: e })
  }

  getPageString = (e) => {
    let firstPage = e.first + 1;
    let l = e.rows * (e.page + 1);
    let lastPage = (l < this.state.documentList.length) ? l : this.state.documentList.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.documentList.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  createMarkup() {
    return { __html: this.state.emailBody };
  }

  render() {

    var header =
      <div>
        <div style={{ 'textAlign': 'Right', marginTop: 10 }}>
          <Row>
            <Col>
              <div className="basic-header">
                <div className="header-right-option">
                  <div style={{ textAlign: 'right' }}>
                    <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                  </div>
                  <MultiSelect value={this.state.cols} options={this.colOptions}
                    fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                    onChange={this.onColumnToggle} style={{ width: '50px' }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>;

    let columns = this.state.cols.map((col, i) => {
      return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} selectionMode={col.selectionMode} style={col.style} />;
    });

    return (
      <div className="animated fadeIn">
        <div className="email-app mb-4">
          <nav>
            <a href="#/apps/email/compose" className="btn btn-danger btn-block">New Email</a>
            <Nav>
              <NavItem>
                <NavLink href="#/apps/email/inbox"><i className="fa fa-inbox"></i> Inbox <Badge color="danger"></Badge></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/apps/email/sent"><i className="fa fa-inbox"></i> Sent </NavLink>
              </NavItem>
            </Nav>
          </nav>
          <main className="message">
            {this.state.messageType != 'sent' ? ((this.state.replytoView == false && this.state.replyAllView == false && this.state.forwordView == false) ? (<div className="toolbar">
              <ButtonGroup className={'mr-1'}>
                {this.state.emails.IsImportant.data[0] == 1 ? <Button color="light" onClick={() => this.addRemoveFlag(this.state.emails, "FLAGGED", true)}>
                  <span className="fa fa-star"></span>
                </Button> :
                  <Button color="light" onClick={() => this.addRemoveFlag(this.state.emails, "FLAGGED", false)}>
                    <span className="fa fa-star-o"></span>
                  </Button>}
              </ButtonGroup>
              <ButtonGroup className={'mr-1'}>
                <Button color="light"><span onClick={() => this.setState({ replytoView: true, replyAllView: false, forwordView: false })} className="fa fa-mail-reply"></span></Button>
                <Button color="light"><span onClick={() => this.setState({ replytoView: false, replyAllView: true, forwordView: false })} className="fa fa-mail-reply-all"></span></Button>
                <Button color="light"><span onClick={() => this.setState({ replytoView: false, replyAllView: false, forwordView: true })} className="fa fa-mail-forward"></span></Button>
              </ButtonGroup>
              <Button color="light" onClick={() => this.deleteMessage(this.state.emails)} className={'mr-1'}><span className="fa fa-trash-o"></span></Button>
              {this.state.emails.IsViewed.data[0] == 1 ? <Button color="light" onClick={() => this.addRemoveFlag(this.state.emails,"SEEN",true)}><span className="fa fa-envelope"></span></Button> : <Button color="light" onClick={() => this.addRemoveFlag(this.state.emails,"SEEN",false)}><span className="fa fa-envelope-o"></span></Button>}
            </div>) : (null)) : (null)}
            <div className="details">
              {(this.state.replytoView == false && this.state.replyAllView == false && this.state.forwordView == false) ? (
                <div>
                  <div className="title">{this.state.emails.Subject}</div>
                  <div className="header">
                    <div className="from">
                      <p>{this.state.emails.FromName} {this.state.emails.FromEmail}</p>
                      <p>{this.state.emails.ToEmail}</p>
                      <p>{this.state.emails.CCEmail}</p>
                      <p>{this.state.emails.BCCEmail}</p>
                    </div>
                    <div className="date">{moment(this.state.emails.CreatedOn).format(CommonConfig.dateFormat.dbDateTime)}</div>
                  </div>
                  <div className="content" dangerouslySetInnerHTML={this.createMarkup()} /> </div>) : (null)}
              {this.state.attachment.length > 0 ? (<div className="attachments">
                {this.state.attachment.map((attach, i) => {
                  return (
                    <div className="attachment">
                      <Badge color="danger">{attach.contentType}</Badge> <b>{attach.filename}</b> <i>({parseInt(parseInt(attach.size) / 1024)} Kb)</i>
                      <span className="menu">
                        <a onClick={() => this.downloadData(attach)} className="fa fa-cloud-download">{null}</a>
                      </span>
                    </div>)
                })}
              </div>) : (null)}
              {(this.state.replytoView == true || this.state.replyAllView == true || this.state.forwordView == true) ?
                (<Form>
                  <FormGroup row className="mb-3">
                    <Label for="to" xs={2} sm={1}>To:</Label>
                    <Col xs={10} sm={11}>
                      <Input type="email" value={this.state.emailTo} name="emailTo" id="emailTo" onChange={(e) => this.handleChange(e)} placeholder="Type Email" />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-3">
                    <Label for="cc" xs={2} sm={1}>CC:</Label>
                    <Col xs={10} sm={11}>
                      <Input type="email" value={this.state.emailCC} id="emailCC" name="emailCC" onChange={(e) => this.handleChange(e)} placeholder="Type CC" />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-3">
                    <Label for="bcc" xs={2} sm={1}>BCC:</Label>
                    <Col xs={10} sm={11}>
                      <Input type="email" value={this.state.emailBCC} id="emailBCC" name="emailBCC" onChange={(e) => this.handleChange(e)} placeholder="Type BCC" />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-3">
                    <Label for="bcc" xs={2} sm={1}>Subject:</Label>
                    <Col xs={10} sm={11}>
                      <Input type="text" value={this.state.emailSubject} id="emailSubject" name="emailSubject" onChange={(e) => this.handleChange(e)} placeholder="Type Subject" />
                    </Col>
                  </FormGroup>
                </Form>) : (null)}
              {(this.state.replytoView == true || this.state.replyAllView == true || this.state.forwordView == true) ? (<form method="post" action="">
                <FormGroup className="mt-4">
                  <CKEditor name="emailBody" id="emailBody" data={this.state.emailBody} onChange={this.handleDetailsChange} />
                  <em id="emailBodyError" className="error invalid-feedback"></em>
                </FormGroup>
                <FormGroup>
                  <Col xs={10} sm={11}>
                    <FormGroup>
                      <Row>
                        <Col md="4">
                          <div className="input-box">
                            <Input type="select" name="documentType" id="documentType" onChange={(e) => this.selectType(e.target.value, 'documentType')} value={this.state.documentType}>
                              <option value=''>Select Attachment</option>
                              <option value="1" key="Policy Doc">Policy Doc</option>
                              <option value="2" key="Custom">Custom</option>
                            </Input>
                          </div>
                        </Col>
                        <Col md="4">
                          {this.state.documentType == "1" ? (<BTN color="success" onClick={() => this.selectType("1", 'documentType')}>Select Doc</BTN>) : (null)}
                          {this.state.documentType == "2" ? (<BTN color="success" onClick={() => this.selectType("2", 'documentType')}>Select Doc</BTN>) : (null)}
                          <Input type="file" name="customDoc" id="customDoc" style={{ display: "none" }} multiple="multiple" onChange={this.selectDocument} />
                        </Col>
                      </Row>
                    </FormGroup>

                    {this.state.selectedDocuments.length > 0 ? (<div className="attachments">
                      <span>Policy Doc : </span>
                      <span>Policy#: {this.state.policysData.length > 0 ? this.state.policysData[0].policyNumber : 'NA'}</span>
                      <span style={{ marginLeft: '10px' }}>RenewalDate: {this.state.policysData.length > 0 ? moment(this.state.policysData[0].renewalDate).format(CommonConfig.dateFormat.forDatePicker) : 'NA'}</span>
                      <span style={{ marginLeft: '10px' }}>InsuredName: {this.state.policysData.length > 0 ? this.state.policysData[0].insuredName : 'NA'}</span>
                      <span style={{ marginLeft: '10px' }}>PolicyType: {this.state.policysData.length > 0 ? this.state.policysData[0].policyType : 'NA'}</span>
                      {this.state.selectedDocuments.map((attach, i) => {
                        return (
                          <div className="attachment">
                            <Badge color="danger">{attach.Type}</Badge> <b>{attach.Filename}</b> <i>({attach.FileSize})</i>
                            <span className="menu">
                              <a onClick={() => this.removeDocument("policy", i)} className="fa fa-remove">{null}</a>
                              <a onClick={() => this.downloadData(attach)} className="fa fa-cloud-download">{null}</a>
                            </span>
                          </div>)
                      })
                      }
                    </div>) : (null)}

                    {this.state.customDoc.length > 0 ? (<div className="attachments">
                      <span>Custom Doc</span>
                      {this.state.customDoc.map((attach, i) => {
                        return (
                          <div className="attachment">
                            <Badge color="danger">{attach.type}</Badge> <b>{attach.name}</b> <i>({Math.round(attach.size / 1024)} KB)</i>
                            <span className="menu">
                              <a onClick={() => this.removeDocument("custom", i)} className="fa fa-remove">{null}</a>
                              <a onClick={() => this.downloadData(attach)} className="fa fa-cloud-download">{null}</a>
                            </span>
                          </div>)
                      })
                      }
                    </div>) : (null)}
                  </Col>
                  <Col>
                    <FormGroup>
                      {this.state.replytoView == true ?
                        <BTN color="success" onClick={() => this.sendReply()}>Reply</BTN> : (null)}

                      {this.state.replyAllView == true ?
                        <BTN color="success" onClick={() => this.sendReplyAll()}>Reply All</BTN> : (null)}

                      {this.state.forwordView == true ?
                        <BTN color="success" onClick={() => this.forwordMail()}>Forword</BTN> : (null)}
                    </FormGroup>
                  </Col>
                </FormGroup>
              </form>) : (null)}
            </div>
          </main>
        </div>
        <Modal isOpen={this.state.openAttachmentPopup} className={'modal-lg'} style={{ maxWidth: '70%' }}>
          <ModalHeader toggle={() => this.setState({ openAttachmentPopup: false })}> Attachement </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="3">
                <AutoComplete value={this.state.selectedPolicy} field="policyNumber" placeholder="Search By Policy And Email" minLength={1} onChange={(e) => this.selectType(e.value, 'selectPolicy')} />
              </Col>
              <Col md="1" style={{ marginLeft: '2px' }}>
                <BTN color="success" onClick={() => this.filterPolicySingle()}>Search</BTN>
              </Col>
              <Col md="7">
                <span>Policy#: {this.state.policysData.length > 0 ? this.state.policysData[0].policyNumber : 'NA'}</span>
                <span style={{ marginLeft: '10px' }}>RenewalDate: {this.state.policysData.length > 0 ? moment(this.state.policysData[0].renewalDate).format(CommonConfig.dateFormat.forDatePicker) : 'NA'}</span>
                <span style={{ marginLeft: '10px' }}>InsuredName: {this.state.policysData.length > 0 ? this.state.policysData[0].insuredName : 'NA'}</span>
                <span style={{ marginLeft: '10px' }}>PolicyType: {this.state.policysData.length > 0 ? this.state.policysData[0].policyType : 'NA'}</span>
              </Col>
            </Row>
            <div className="table-custom">
              <DataTable style={{}} ref={(el) => this.dt = el} value={this.state.documentList}
                currentPageReportTemplate={this.state.str} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                paginator={true} rows={this.state.rowsPerPage} header={header} exportFilename="Documents"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
                rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                responsive={true} resizableColumns={true} columnResizeMode="fit"
                scrollable={true} scrollHeight="265px"
                selection={this.state.selectedDocuments}
                onSelectionChange={(e) => this.mulSelect(e.value)}
              >
                {columns}
              </DataTable>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Message;
