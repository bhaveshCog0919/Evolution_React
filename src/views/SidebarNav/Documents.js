import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import api from '../../utils/apiClient'
import APIConstant from '../../utils/constants';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { toast } from 'react-toastify';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button as BTN, Row, Col, Input, InputGroup, CardBody, Collapse, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { apiBase } from '../../utils/config';
import axios from 'axios';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

class Documents extends Component {

  constructor(props) {
    super(props);
    let columns = [
      { selectionMode: "multiple", style: { width: '3em' }, id: 0 },
      { body: this.filenameTemplate.bind(this), field: "filename", header: "Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
      { body: this.format_createddate_createdby.bind(this), field: "createdon", header: "Created/CreatedBy", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
      // { field: "createdby", header: "CreatedBy", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
      { field: "directory", header: "Directory", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
      { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 4 },
    ];

    // console.log("props",props);

    this.state = {
      documentList: [],
      directoryList: [],
      processList: [],
      documentListType: [],
      selecteddirectory: '',
      selectedProcess: '',
      selectedfile: '',
      file: '',
      Description: '',
      colors: null,
      cols: columns,
      generateProcessError: true,
      valueError: true,
      fileError: true,
      Extension: '',
      FileName: '',
      FileNameError: true,
      str: '',
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      selectedPage: 0,
      selectedCars3: '',
      LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

      uploadCollapse: false,
      generateCollapse: false,
      toggleModal: false,
      generateDocumentMessage: "",
    };

    this.colOptions = [];
    for (let col of columns) {
      this.colOptions.push({ label: col.header, value: col });
    }

    this.onColumnToggle = this.onColumnToggle.bind(this);
    this.export = this.export.bind(this);
    this.togglePrimary = this.togglePrimary.bind(this);
    this.download = this.download.bind(this);
    this.upload = this.upload.bind(this);
    // this.downloadData = this.downloadData.bind(this);

    // This data we will get from Policy and Contact pages.
    if (props.NavPage) {
      this.state.NavPage = props.NavPage;
    }
    if (props.NavID) {
      this.state.NavID = props.NavID;
    }
  }

  componentDidMount() {

    setTimeout(() => {
      this.getDropDownValues('DOCUMENTLISTTYPE', 'documentListType');
      this.getDocumentList("Current");
      this.getDirectoryList();
      this.getGenerateDocumentProcessList();
      this.getpolicyNumberById();
    }, 500);

  }

  getpolicyNumberById() {
    try {
      const data = {
        policyId: this.state.NavID
      }
      api.post(APIConstant.path.getpolicyNumberById, data).then(res => {
        if (res.success) {
          console.log("getpolicyNumberById", res);
          this.setState({ policyNumber: res.data.data[0].PolicyNumber });
        } else {
        }
      }).catch(err => {
        console.log('error', err);

      });
    } catch (error) {
      console.log('error', error);
    }
  }

  getDropDownValues(stringMapType, setStateName) {
    try {
      const data = {
        stringmaptype: stringMapType,
        orderby: 'SortOrder',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          if (setStateName === 'boatingQualificationAllList') {
            this.boatingQualificationListCopy = res.data;
          } else {
            this.setState({ [setStateName]: res.data });
          }
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  getDocumentList(type) {
    try {
      const data = {
        entityType: this.state.NavPage,
        entityId: this.state.NavID,
        documentType: type
      };
      api.post("api/getDocumentListByTypeAndId", data).then(res => {
        console.log("res", res);
        if (res.success) {
          var formattedData = [];
          for (var i = 0; i < res.data.length; i++) {
            formattedData.push({
              documentid: [i + 1],
              filename: res.data[i].Filename,
              createdon: moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateTime),
              type: res.data[i].Type,
              url: res.data[i].URL,
              directory: res.data[i].Directory,
              createdby: res.data[i].forename
            })
          }
          let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
          let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';
          this.setState({ documentList: formattedData, str: str });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  getDirectoryList() {
    try {
      const data = {
        stringmaptype: 'DOCUMENTDIRECTORY'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ directoryList: res.data });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  getGenerateDocumentProcessList() {
    try {
      const data = {
        stringmaptype: 'GENERATEDOCUMENTPROCESS',
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ processList: res.data });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  getPageString = (e) => {
    let firstPage = e.first + 1;
    let l = e.rows * (e.page + 1);
    let lastPage = (l < this.state.documentList.length) ? l : this.state.documentList.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.documentList.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  selectType(value, type) {

    if (type == "directory") {
      if (value === '') {
        this.setState({ valueError: true, selecteddirectory: value });
        this.show("directory", true);
      }
      else {
        this.setState({ valueError: false, selecteddirectory: value });
        this.show("directory", false);
      }
    }

    if (type == "process") {
      if (value === '') {
        this.setState({ generateProcessError: true, selectedProcess: value });
        this.show("process", true);
      }
      else {
        this.setState({ generateProcessError: false, selectedProcess: value });
        this.show("process", false);
      }
    }

    if (type == "documentType") {
      this.setState({ documentType: value });
      this.getDocumentList(value);
    }
  }

  selectFile = (event) => {

    if (event.target.files && event.target.files[0]) {
      var docname = event.target.files[0].name.split('.').slice(0, -1).join('.');
      var ext = event.target.files[0].name.split('.').pop();

      this.setState({ selectedfile: event.target.files[0], FileName: docname, FileNameError: false, Extension: ext });
      this.show("FileName", false);
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ file: e.target.result });
        this.show("file", false);
      };
      reader.readAsDataURL(event.target.files[0]);

      console.log();
    }
    else {
      this.setState({ FileNameError: true, FileName: '', Extension: '' });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.name);
    if (e.target.name === 'Description') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ Description: e.target.value });
      }
      else {
        this.setState({ Description: e.target.value });
      }
    } else {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ FileNameError: true, FileName: e.target.value });
        this.show("FileName", true);
      }
      else {
        this.setState({ FileName: e.target.value, FileNameError: false });
        this.show("FileName", false);
      }
    }
  }

  reset = () => {
    this.setState({
      selecteddirectory: '', selectedProcess: '', Description: '', valueError: true, selectedfile: '', file: '', FileName: '', FileNameError: true, Extension: '', generateProcessError: true
    });
    this.show("FileName", false);
    this.show("file", false);
    this.show("directory", false);
    this.show("process", false);
    document.getElementById("file").value = null;
  }

  show(field, condition) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    } else {
      document.getElementById(field).className = "form-control";
    }
  }

  export() {
    this.dt.exportCSV();
  }

  clear = () => {
    document.getElementById("file").value = null;
    document.getElementById("file").style.display = "block";
    document.getElementById("FileName").style.display = "none";
    this.setState({ Extension: '', FileName: '', FileNameError: false });
    this.show("FileName", false);
  }

  upload() {
    console.log("Documents >> ", this.state);
    if (
      this.state.selectedfile !== "" &&
      this.state.valueError === false &&
      this.state.FileNameError === false
    ) {

      var formData = new FormData();

      formData.append('policyNumber', this.state.policyNumber);
      formData.append('directory', this.state.selecteddirectory);
      formData.append('policyId', this.state.NavID);
      formData.append('description', (this.state.Description).trim());
      formData.append('FileName', (this.state.FileName).trim());
      formData.append('Extension', this.state.Extension);
      formData.append('document', this.state.selectedfile);
      formData.append('entityId', this.state.NavID);
      formData.append('entityType', this.state.NavPage);
      formData.append('loggedInUserId', CommonConfig.loggedInUserId());
      formData.append('languageId', this.state.LanguageId);

      console.log("upload >> ", formData);

      api.post('api/uploadDocument', formData).then(res => {

        if (res.success) {
          toast.success("Document's uploaded successfully");
          this.togglePrimary();
          this.getDocumentList(this.state.documentType);
        } else {
        }
      }).catch(err => {
      });
    }
    else {
      if (this.state.valueError) this.show("directory", true);
      if (this.state.FileNameError) this.show("FileName", true);
      if (this.state.selectedfile === '' || this.state.selectedfile === undefined || this.state.selectedfile === null) this.show("file", true);
    }
  }

  allowGenerateDocument(isDocumentGenerate) {
    this.setState({
      toggleModal: false
    })
    this.generateDocument(isDocumentGenerate);
  }

  openModal() {
    this.setState({ toggleModal: !this.state.toggleModal });
  }

  toggleLarge = () => {
    this.setState({ toggleModal: false });
    this.togglePrimary();
    this.getDocumentList(this.state.documentType);
  }

  generateDocument(isDocumentGenerateAllow) {
    if (this.state.generateProcessError === false) {

      var data = {
        processType: this.state.selectedProcess,
        policyId: this.state.NavID,
        isDocumentGenerateAllow: isDocumentGenerateAllow,
        CurrentUser: CommonConfig.loggedInUserId(),
      };

      api.post('api/generateDocument', data).then(res => {

        if (res.success) {
          toast.success("Document's generated successfully");
          this.togglePrimary();
          this.getDocumentList(this.state.documentType);
        } else {
          console.log("ooooooooooooooooooooooooooooooooooooooooo", res);
          if (res.isDocumentGenerate == 0) {
            toast.error(res.message);
            this.togglePrimary();
          } else if (res.isDocumentGenerate == 2) {
            toast.error(res.message);
            this.togglePrimary();
          }
          else {
            this.setState({ generateDocumentMessage: res.message })
            this.openModal();
          }

        }
      }).catch(err => {
        console.log("api/generateProcessDocument > Error");
      });
    } else {
      if (this.state.generateProcessError) this.show("process", true);
    }
  }

  downloadData = (rowdata) => {
    console.log("downloadData---rowdata", rowdata);
    var path = apiBase + "" + rowdata.url;
    console.log("path",path);
    let filext = this.getFileExtension(rowdata.filename);
    console.log("filext", filext);
    let fileName = rowdata.filename;
    if (filext == undefined) {
      fileName = rowdata.filename + "." + rowdata.type
    }

    axios({
      url: path,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  getFileExtension = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  download = (rowData) => {
    document.getElementById('download').click();
  }

  emailData() {
    toast.success("Comming Soon...");
  }

  printData() {
    toast.success("Comming Soon...");
    // window.print();
    // var content = document.getElementById("FileName");
    // var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    // pri.document.open();
    // pri.document.write(content.innerHTML);
    // pri.document.close();
    // pri.focus();
    // pri.print();
  }

  actionTemplate(rowData, column) {

    return <div className="text-center">
      <Button type="button" icon="pi pi-download" style={{ margin: 2 }} tooltip="Download" tooltipOptions={{ position: 'bottom' }} onClick={() => this.downloadData(rowData)}></Button>
      <Button type="button" icon="pi pi-envelope" style={{ margin: 2 }} tooltip="Email" tooltipOptions={{ position: 'bottom' }} onClick={() => this.emailData()}></Button>
      <Button type="button" icon="pi pi-print" style={{ margin: 2 }} tooltip="Print" tooltipOptions={{ position: 'bottom' }} onClick={() => this.printData()}></Button>
    </div>;
  }

  format_createddate_createdby(rowData) {
    return (
      <div className="policy-list-data">
        <p>{moment(rowData.createdon, 'DD/MM/YYYY hh:mm').format('DD-MM-YYYY,hh:mm A')}</p>
        {/* <p>{rowData.createdon}</p> */}
        <p>{rowData.createdby}</p>
      </div>
    )
  }

  filenameTemplate(rowData, column) {
    var path = apiBase + "" + rowData.url;
    return (<div><a href={path} target="_new">{rowData.filename}</a></div>);
    // return {rowData.filename};
  }

  togglePrimary() {
    this.setState({
      uploadCollapse: false,
      generateCollapse: false,
    });
    this.reset();
  }

  onColumnToggle(event) {
    let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
    this.setState({ cols: valueInOrder });
  }

  mulSelect(e) {
    console.log("eeeee", e.value);
    this.setState({ selectedCars3: e.value });
  }

  bulk_Download = () => {
    var bulk_Data = this.state.selectedCars3;
    console.log("bulk_Download---bulk_Data", bulk_Data);
    if (bulk_Data.length) {
      for (let i = 0; i < bulk_Data.length; i++) {
        var path = apiBase + bulk_Data[i].url;
        let filext = this.getFileExtension(bulk_Data[i].filename);
        let fileName = bulk_Data[i].filename;
        if (filext == undefined) {
          fileName = bulk_Data[i].filename + "." + bulk_Data[i].type
        }
        axios({
          url: path,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      }
    }
  }

  HideSideBar() {
    this.setState({ visible: false });
    this.reset();
  }

  render() {

    const { t, i18n } = this.props;
    const CancelButton = t("buttons.Cancel");
    const Generate = t("buttons.Generate");

    var header =
      <div>
        <div style={{ paddingTop: 10, paddingBottom: 10, borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: "#d8d6d6", display: "inline-block", width: "100%" }}>
          <div style={{ textAlign: "left" }}>
            <BTN color="link" className="text-left" onClick={() => this.setState({ uploadCollapse: !this.state.uploadCollapse, generateCollapse: false })} aria-expanded={this.state.uploadCollapse} aria-controls="collapseOne" style={{ marginRight: "10px" }}>
              Upload &nbsp;
              <i className={this.state.uploadCollapse ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
            </BTN>

            {(this.state.NavPage == "Policy") ? (
              <BTN color="link" className="text-left" onClick={() => this.setState({ uploadCollapse: false, generateCollapse: !this.state.generateCollapse })} aria-expanded={this.state.generateCollapse} aria-controls="collapseTwo">
                Generate &nbsp;
                <i className={this.state.generateCollapse ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
              </BTN>
            ) : (null)}
            <span className="text-left float-right" onClick={(e) => this.HideSideBar()}>
              <i className="fa fa-close"></i>
            </span>
          </div>

          <Collapse isOpen={this.state.uploadCollapse} id="collapseOne">
            <CardBody style={{ textAlign: "left" }}>
              <h3 style={{ marginBottom: "10px" }}> Upload a New Document </h3>

              <div className="file-field">
                <Row>
                  <Col md="3" className="pull-right">
                    <label for="">Select File*</label>
                  </Col>
                  <Col md="9">
                    <div className="btn btn-primary " style={{ width: "100%" }}>
                      <InputGroup>
                        <Input type="file" name="file" id="file" className="" onChange={this.selectFile} />
                        <em className="error invalid-feedback"> Please select file </em>

                      </InputGroup>
                    </div>
                  </Col>
                </Row>

                <Row style={{ marginTop: "10px" }}>
                  <Col md="3" className="pull-right">
                    <label for="">File Name*</label>
                  </Col>
                  <Col md="9">
                    <InputGroup>
                      <Input type="text" name="FileName" id="FileName" onChange={e => this.handleChange(e)} placeholder="File Name" value={this.state.FileName} />
                      <em className="error invalid-feedback"> Please enter file name </em>
                    </InputGroup>
                  </Col>
                </Row>

                <Row style={{ marginTop: "10px" }}>
                  <Col md="3" className="pull-right">
                    <label for="">Directory*</label>
                  </Col>
                  <Col md="9">
                    <div className="input-box">
                      <Input type="select" name="directory" id="directory" className="" onChange={(e) => this.selectType(e.target.value, 'directory')} value={this.state.selecteddirectory}>
                        <option value=''>--Document Type--</option>
                        {this.state.directoryList.map((ct, i) => {
                          return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                        })
                        }
                      </Input>
                      <em className="error invalid-feedback"> Please select directory </em>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md="3" className="pull-left">
                    <label for="">Description</label>
                  </Col>
                  <Col md="9">
                    <div className="input-box">
                      <Input name="Description" type="textarea" id="Description" className="" onChange={e => this.handleChange(e)} value={this.state.Description} placeholder="Description" />
                      <em className="error invalid-feedback"> Please enter description </em>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="pull-right" >
                <BTN color="success" onClick={this.upload}><i class="fa fa-check"></i> Upload</BTN>{' '}
                <BTN color="primary" onClick={this.reset}><i class="fa fa-angle-left"></i> Cancel</BTN>
              </div>
            </CardBody>
          </Collapse>

          <Collapse isOpen={this.state.generateCollapse} id="collapseTwo">
            <CardBody style={{ textAlign: "left" }}>
              <h3 style={{ marginBottom: "10px" }}> Generate a New Document </h3>

              <div className="file-field">
                <Row style={{ marginTop: "10px" }}>
                  <Col md="1" className="pull-right">
                    <label for="">Process*</label>
                  </Col>
                  <Col md="11">
                    <div className="input-box">
                      <Input type="select" name="process" id="process" className="" onChange={(e) => this.selectType(e.target.value, 'process')} value={this.state.selectedProcess}>
                        <option value=''>--Process Type--</option>
                        {this.state.processList.map((ct, i) => {
                          return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                        })
                        }
                      </Input>
                      <em className="error invalid-feedback"> Please select Process Type </em>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="pull-right" >
                <BTN color="success" onClick={() => this.generateDocument(0)}><i class="fa fa-check"></i> Generate</BTN>{' '}
                <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
              </div>
            </CardBody>
          </Collapse>

        </div>
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
                  {(this.state.selectedCars3.length > 1) ? (
                    <Button type="button" icon="pi pi-download" tooltip="Bulk Download" tooltipOptions={{ position: 'bottom' }} onClick={this.bulk_Download}></Button>
                  ) : (
                      null
                    )}

                  {(this.state.selectedCars3.length > 1) ? (
                    <Button type="button" icon="pi pi-envelope" tooltip="Bulk Email" tooltipOptions={{ position: 'bottom' }} onClick={this.bulk_Email}></Button>
                  ) : (
                      null
                    )}

                  {(this.state.selectedCars3.length > 1) ? (
                    <Button type="button" icon="pi pi-print" tooltip="Bulk Print" tooltipOptions={{ position: 'bottom' }} onClick={this.bulk_Print}></Button>
                  ) : (
                      null
                    )}

                  <Button type="button" icon="pi pi-file-o" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                </div>
              </div>
            </Col>
            <Col md="3">
              <div className="input-box">
                <Input type="select" style={{ width: "100%" }} name="documentType" id="documentType" onChange={(e) => this.selectType(e.target.value, 'documentType')} value={this.state.documentType}>
                  {this.state.documentListType.map((ct, i) => {
                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                  })}
                </Input>
                <em className="error invalid-feedback" >{t("policyGeneral:previousBoatingExperience.error")}</em>
              </div>
            </Col>
          </Row>
        </div>
      </div>;

    let columns = this.state.cols.map((col, i) => {
      return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} selectionMode={col.selectionMode} style={col.style} />;
    });

    return (
      <div className="animated fadeIn">
        <a href="javascript:void(0)" onClick={(e) => this.setState({ visible: true })}>Documents</a>

        <Sidebar showCloseIcon={false} blockScroll={true} visible={this.state.visible} position="right" onHide={(e) => this.HideSideBar()} style={{ width: 900 }}>
          <ScrollPanel style={{ width: '100%', height: '90%' }}>
            <div className="table-custom">
              <DataTable style={{ background: "#FFFFFF" }} ref={(el) => this.dt = el} value={this.state.documentList}
                currentPageReportTemplate={this.state.str} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                paginator={true} rows={this.state.rowsPerPage} header={header} exportFilename="Documents"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
                rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                responsive={true} resizableColumns={true} columnResizeMode="fit"
                scrollable={true} scrollHeight="265px"
                selection={this.state.selectedCars3}
                onSelectionChange={(e) => this.mulSelect(e)}
              >
                {columns}
              </DataTable>
              {/* <iframe id="ifmcontentstoprint" style={{height: "0px", width: "0px", position: "absolute"}}></iframe> */}
            </div>
          </ScrollPanel>
        </Sidebar>

        <Modal isOpen={this.state.toggleModal} toggle={() => this.toggleLarge()}>
          <ModalHeader toggle={() => this.toggleLarge()}>
            Generate Document
          </ModalHeader>

          <ModalBody>
            {this.state.generateDocumentMessage}
          </ModalBody>

          <ModalFooter>
            <BTN style={{ marginLeft: "10px" }} color="success" onClick={() => this.allowGenerateDocument(1)}>
              <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
              {Generate}
            </BTN>

            <BTN style={{ marginLeft: "10px" }} color="primary" onClick={() => this.toggleLarge()}>
              <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
              {CancelButton}
            </BTN>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default withTranslation()(Documents);