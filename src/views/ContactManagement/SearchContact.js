import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import Select from 'react-select';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input, Form } from 'reactstrap';
import { Collapse, Card, CardHeader, CardBody } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class SearchContact extends Component {
  constructor(props) {
    super(props);

    let columns = [
      { field: "code", header: "Code", sortable: true, filter: true, filterMatchMode: 'contains', style: { width: 80 }, id: 0 },
      { field: "name", header: "Name/Company", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 1 },
      { field: "phone", header: "Phone", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 2 },
      { field: "email", header: "Email", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 3 },
      { field: "country", header: "Country", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 4 },
      { field: "address", header: "Address", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 5 },
      { field: "contact", header: "Contact Type", sortable: true, filterMatchMode: 'contains', filter: true, style: {}, id: 6 },
      { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filterMatchMode: 'contains', filter: false, style: {}, id: 7 }
    ];

    this.state = {
      selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
      brand: null,
      colors: null,
      toggleModal: false,
      cols: columns,
      arr: [],
      ContactCode: '',
      ContactName: '',
      addrCountry: '',
      userlogin: '',
      clientNamePhoneEmail: '',
      userloginArray: [],
      userloginArrayCopy: [],
      searchType: 'INDIVIDUAL',
      selectedPage: 0,
      offset: 0,
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      str: '',
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
      globalFilter: null,

      organizationQuestion: [],
      CONTACTTYPE: [],
      CONTACTTYPECOPY: [],
      arrayToDisplay: [],
      verificationArray: [],

      showModal: false,
      selectedRecord: '',
      note: '',
      countryArray: [],
      countryArrayCopy: [],
      countryCodeArray: [],
      isDeleteContact: false,

      showPolicyModal: false,
      NewPolicyUserId: '',
      NewPolicyUser: ''
    };

    this.colOptions = [];
    for (let col of columns) {
      this.colOptions.push({ label: col.header, value: col });
    }

    this.onColumnToggle = this.onColumnToggle.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.export = this.export.bind(this);
  }

  componentDidMount() {
    // this.getContactDetails();
    this.getCONTACTTYPE();
    this.getLOGINUSER();
    this.getCountry();
  }

  getContactDetails() {
    try {
      let data = {
        orderby: CommonConfig.isEmpty(this.props.location.state) ? 'SearchName' : (this.props.location.state.isAdded) ? 'CreatedOn' : 'SearchName'
      }
      api.post('api/getContactList', data).then(res => {
        console.log("getContactList----------------- ", res);
        if (res.success) {
          let formattedData = [];
          let i;
          for (i = 0; i < res.data.length; i++) {

            formattedData.push({
              id: (res.data[i].PersonId && res.data[i].PersonId !== undefined && res.data[i].PersonId !== null) ? res.data[i].PersonId : res.data[i].OrganizationId,
              entityType: res.data[i].EntityType,
              code: res.data[i].ContactCode,
              name: res.data[i].fullname,
              address: (res.data[i].AddrLine1 === null || res.data[i].AddrLine1 === undefined) ? '' : res.data[i].AddrLine1,
              phone: (CommonConfig.isEmpty(res.data[i].CountryCode) ? '' : res.data[i].CountryCode)
                + ' ' + (CommonConfig.isEmpty(res.data[i].AreaCode) ? '' : res.data[i].AreaCode)
                + ' ' + (CommonConfig.isEmpty(res.data[i].PhoneNumber) ? '' :
                  CommonConfig.formatPhoneNumber(res.data[i].PhoneNumber)),
              email: res.data[i].Email,
              country: res.data[i].countryname,
              business: res.data[i].businesstype,
              contact: res.data[i].contacttype,
              DOB: (res.data[i].EntityType === 'person') ? CommonConfig.isEmpty(res.data[i].DOB) || res.data[i].DOB == '0000-00-00' || res.data[i].DOB == "Invalid date" ? '' : moment(res.data[i].DOB).format('DD-MM-YYYY') : res.data[i].DOB,
              PostalCode: res.data[i].PostalCode,
              Mobile: res.data[i].PhoneNumber
            });
          }

          let firstPage = (formattedData.length) ? '1' : '0';
          let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
          let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
          this.setState({ arr: formattedData, str: str });
        } else {

        }
      }).catch(err => {
        console.log("DFsd", err);
      });
    } catch (err) {
      console.log("DFsdaaaa", err);
    }
  }

  getPreviousRecords() {
    let offset = (this.state.offset > 0) ? parseInt(this.state.offset) - 1 : 0;
    this.setState({ offset: offset });

    setTimeout(() => {
      this.getSearchContact();
    }, 100);
  }

  getNextRecords() {
    let offset = (this.state.offset >= 0) ? parseInt(this.state.offset) + 1 : 0;
    this.setState({ offset: offset });

    setTimeout(() => {
      this.getSearchContact();
    }, 100);
  }

  getSearchContact() {
    try {
      const data = {
        searchType: this.state.searchType,
        offSet: this.state.offset
      };

      if (this.state.searchType != 'ALL') {
        data.ClientName = CommonConfig.isEmpty(this.state.ContactName) ? '' : this.state.ContactName;
        data.ClientName = data.ClientName.replace("'", "\'");
        data.PhoneEmail = CommonConfig.isEmpty(this.state.clientNamePhoneEmail) ? '' : this.state.clientNamePhoneEmail;
        data.ContactType = CommonConfig.isEmpty(this.state.CONTACTTYPENEW) ? '' : this.state.CONTACTTYPENEW;
        data.ContactCountry = CommonConfig.isEmpty(this.state.addrCountry) ? '' : this.state.addrCountry;
        data.ContactCode = CommonConfig.isEmpty(this.state.ContactCode) ? '' : this.state.ContactCode;
        data.UserLogin = CommonConfig.isEmpty(this.state.userlogin) ? '' : this.state.userlogin;
      }

      console.log("searchContact--------", data);
      api.post('api/searchContact', data).then(res => {
        console.log("searchContact--------", res);
        if (res.success) {
          let formattedData = [];
          let i;
          for (i = 0; i < res.data.length; i++) {

            formattedData.push({
              id: (res.data[i].PersonId && res.data[i].PersonId !== undefined && res.data[i].PersonId !== null) ? res.data[i].PersonId : res.data[i].OrganizationId,
              entityType: res.data[i].EntityType,
              code: res.data[i].ContactCode,
              name: res.data[i].fullname,
              address: (res.data[i].AddrLine1 === null || res.data[i].AddrLine1 === undefined) ? '' : res.data[i].AddrLine1,
              phone: (CommonConfig.isEmpty(res.data[i].CountryCode) ? '' : res.data[i].CountryCode)
                + ' ' + (CommonConfig.isEmpty(res.data[i].AreaCode) ? '' : res.data[i].AreaCode)
                + ' ' + (CommonConfig.isEmpty(res.data[i].PhoneNumber) ? '' :
                  CommonConfig.formatPhoneNumber(res.data[i].PhoneNumber)),
              email: res.data[i].Email,
              country: res.data[i].Country,
              business: res.data[i].businesstype,
              contact: res.data[i].contacttype,
              DOB: (res.data[i].EntityType === 'person') ? CommonConfig.isEmpty(res.data[i].DOB) || res.data[i].DOB == '0000-00-00' || res.data[i].DOB == "Invalid date" ? '' : moment(res.data[i].DOB).format('DD-MM-YYYY') : res.data[i].DOB,
              PostalCode: res.data[i].PostalCode,
              Mobile: res.data[i].PhoneNumber
            });
          }

          let firstPage = (formattedData.length) ? '1' : '0';
          let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
          let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
          this.setState({ arr: formattedData, str: str });
        } else {

        }
      }).catch(err => {
        console.log("searchContact-API-Error", err);
      });
    } catch (error) {
      console.log("searchContact-Error", error);
    }
  }

  getCONTACTTYPE() {
    try {
      const data = {
        stringmaptype: 'CONTACTTYPE',
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          let formattedArray = [];
          for (let i = 0; i < res.data.length; i++) {
            formattedArray.push({ label: res.data[i].StringMapName, value: res.data[i].StringMapKey });
          }
          this.setState({ CONTACTTYPE: formattedArray, CONTACTTYPECOPY: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }
  getLOGINUSER() {
    try {
      const data = {
        stringmaptype: 'LOGINUSER',
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          let formattedArray = [];
          for (let i = 0; i < res.data.length; i++) {
            formattedArray.push({ label: res.data[i].StringMapName, value: res.data[i].StringMapKey });
          }
          this.setState({ userloginArray: formattedArray, userloginArrayCopy: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }
  getOrganizationQuestion() {
    try {
      const data = {
        stringmaptype: 'ORGQUESTION',
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ organizationQuestion: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getCountry() {
    try {
      const data = {
        stringmaptype: 'COUNTRY',
        // orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          let formattedArray = [];
          for (let i = 0; i < res.data.length; i++) {
            formattedArray.push({ label: res.data[i].StringMapName, value: res.data[i].StringMapKey });
          }
          // this.setState({ countryArray: res.data });
          this.setState({ countryArray: formattedArray, countryArrayCopy: res.data });
        } else {

        }
      }).catch(err => {

      });

      api.get('api/getCountry').then(res => {
        if (res.success) {
          this.setState({ countryCodeArray: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  export() {
    this.dt.exportCSV();
  }

  addMoreContact() {
    this.props.history.push('/addContactDetails');
  }

  onColumnToggle(event) {
    let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
    this.setState({ cols: valueInOrder });
  }

  edit = (rowData) => {
    // let id = rowData.id;
    // let entityType = rowData.entityType;

    window.open(window.location.origin + '/#' + 'viewContactDetails/' + rowData.id + '/' + rowData.entityType);
    // this.props.history.push({
    //   pathname: '/viewContactDetails/' + id + '/' + entityType,
    //   state: {
    //     id: id,
    //     entityType: entityType
    //   }
    // });
  }

  delete = (rowData) => {
    try {
      let data = {
        id: rowData.id,
        entityType: rowData.entityType,
        loggedInUserId: CommonConfig.loggedInUserId()
      }
      api.post('api/deleteContact', data).then(res => {
        console.log("DSAf", res);
        if (res.data.success) {
          toast.success(res.data.message);
          this.reset('delete');
          this.getContactDetails();
        } else {

        }
      }).catch(err => {
        console.log("DSAf", err);
      });
    } catch (error) {
      console.log("DSAf", error);
    }
  }

  confirmDelete = (rowData) => {
    this.setState({ isDeleteContact: true, selectedRecord: rowData });
  }

  viewPolicy = (rowData) => {
    console.log(rowData);

    let data = {
      id: rowData.id,
      entityType: rowData.entityType,
    }
    api.post('api/getUserPolicyList', data).then(res => {

      if (res.data.success) {
        if (res.data.data.length == '0') {
          this.setState({ showPolicyModal: true, NewPolicyUserId: rowData.id, NewPolicyUser: rowData.name });
        } else {
          console.log("rowData.id...", rowData.id);
          console.log("rowData.entityType...", rowData.entityType);
          this.props.history.push({
            pathname: '/PolicyList/' + rowData.id + '/' + rowData.entityType,
            state: {
              id: rowData.id,
              entityType: rowData.entityType
            }
          });
        }
      } else {
        console.log('err');
      }
    }).catch(err => {
      console.log("DSAf", err);
    });
  }

  goToPolicy() {

    this.props.history.push({
      pathname: '/CreatePolicy/' + this.state.NewPolicyUserId,
      state: {
        Id: this.state.NewPolicyUserId
      }
    });
  }

  newPolicy = (rowData) => {
    let id = rowData.id;

    this.props.history.push({
      pathname: '/CreatePolicy/' + id,
      state: {
        id: id
      }
    });
  }

  actionTemplate(rowData, column) {
    console.log('rowData', rowData);

    return <div>
      <Button type="button" icon="pi pi-eye" className="p-button-warning"
        onClick={() => this.edit(rowData)}
        style={{ marginRight: '.5em' }} tooltip="View Contact" tooltipOptions={{ position: 'bottom' }} />
        
      <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete Contact"
        tooltipOptions={{ position: 'bottom' }} onClick={() => this.confirmDelete(rowData)} />

      {(rowData.contact === 'Client') ? (
        <Button type="button" icon="pi pi-file" className="p-button-primary"
          onClick={() => this.viewPolicy(rowData)}
          style={{ marginRight: '.5em' }} tooltip="View Policy" tooltipOptions={{ position: 'bottom' }} />
      ) : (null)}

      {(rowData.contact === 'Client') ? (
        <Button type="button" icon="pi pi-plus" className="p-button-success"
          onClick={() => this.newPolicy(rowData)}
          style={{ marginRight: '.5em' }} tooltip="New Policy" tooltipOptions={{ position: 'bottom' }} />
      ) : (null)}

    </div>;
  }

  getPageString = (e) => {
    let firstPage = e.first + 1;
    let l = e.rows * (e.page + 1);
    let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name == "note") {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ note: '' });
      } else {
        this.show(e.target.name, false);
        this.setState({ note: e.target.value });
      }
    }
    if (e.target.name == "ContactCode") {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ ContactCode: '' });
      } else {
        this.setState({ ContactCode: e.target.value });
      }
    }
    if (e.target.name == "ContactName") {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ ContactName: '' });
      } else {
        this.setState({ ContactName: e.target.value });
      }
    }
    if (e.target.name == "clientNamePhoneEmail") {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ clientNamePhoneEmail: '' });
      } else {
        this.setState({ clientNamePhoneEmail: e.target.value });
      }
    }
  }

  selectType(value, type) {
  
    if (value === '' || value === undefined || value === null) {
      this.setState({
        [type]: ''
      });
    }
    else {
      this.setState({
        [type]: value.value
      });
    }
    if (type === 'CONTACTTYPENEW') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ CONTACTTYPENEW: '' });
      } else {
        this.setState({ CONTACTTYPENEW: value.value });
      }
    }

    if (type === 'userlogin') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ userlogin: '' });
      } else {
        this.setState({ userlogin: value.value });
      }
    }

    if (type === 'addrCountry') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ addrCountry: '' });
      } else {
        this.setState({ addrCountry: value.value });
      }
    }

  }

  selectType1 = (value, type) => {
    if (value === '') {
      this.show(type, true);
    } else {
      this.show(type, false);
      let arr2 = this.state.verificationArray;
      let i = this.state.verificationArray.findIndex(x => x.label === type);
      if (i !== -1) {
        arr2[i].value = (value === 'Correct') ? true : false
      } else {
        arr2.push({ label: type, value: (value === 'Correct') ? true : false });
      }
      this.setState({ verificationArray: arr2 });
    }
  }

  show(field, condition) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    } else {
      document.getElementById(field).className = "form-control";
    }
  }

  reset = (type) => {
    if (type === 'edit') {
      this.setState({ showModal: false, selectedRecord: '', verificationArray: [], note: '' });
    } else if (type === 'delete') {
      this.setState({ isDeleteContact: false, selectedRecord: '' });
    } else if (type === 'policyModal') {
      this.setState({ showPolicyModal: false, NewPolicyUser: '', NewPolicyUserId: '' });
    }
  }

  goToEdit = () => {
    try {
      var id = this.state.selectedRecord.id;
      var entityType = this.state.selectedRecord.entityType;
      this.props.history.push({
        pathname: '/viewContactDetails/' + id + '/' + entityType,
        state: {
          id: id,
          entityType: entityType
        }
      });
      let errCount = 0;
      for (let i = 0; i < this.state.verificationArray.length; i++) {
        if (!this.state.verificationArray[i].value) {
          errCount++;
        }
      }

      if (this.state.verificationArray.length <= 2 && this.state.note === '') {
        toast.error('User verification failed');
      } else if (errCount >= 2) {
        toast.error('User verification failed');
      } else if (errCount == 1 && this.state.note === '') {
        toast.error('User verification failed');
      } else {
        var id = this.state.selectedRecord.id;
        var entityType = this.state.selectedRecord.entityType;

        let data = {
          verificationArray: this.state.verificationArray,
          isCorrect: true,
          note: this.state.note,
          id: id
        }

      }
    } catch (error) {
      console.log("error", error);
    }
  }

  searchGlobal = (e) => {
    console.log("Zsdfsafg", e);
    this.setState({ globalFilter: e.target.value });
    console.log("frgt", this.state.arr);
  }

  filterData = (filteredData) => {
    console.log("dddd", filteredData);
  }

  onRadioBtnClick(radioSelected) {
    this.setState({ searchType: radioSelected });

    if (radioSelected === "ALL") {
      // setTimeout(() => {
      //     this.getSearchContact();
      // }, 100);
    }
  }
  render() {
    const { t } = this.props;
    let columns = this.state.cols.map((col, i) => {
      return (
        <Column key={i} field={col.field} header={col.header} body={col.body}
          sortable={col.sortable} filter={col.filter} style={col.style} filterMatchMode="contains"
        />
      )
    });

    return (
      <div>

        <div className="basic-header">
          <h1>Contacts</h1>
          <div className="header-right-option">
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.searchGlobal(e)} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />

            <MultiSelect value={this.state.cols} options={this.colOptions}
              fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
              onChange={this.onColumnToggle} style={{ width: '50px' }}
            />

            <Button type="button" icon="pi pi-plus" tooltip="Add Contact" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addMoreContact()}></Button>
            <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
          </div>
        </div>
        <div className="input-box" id="accordion">

          <Card className="mb-0">
            <CardHeader id="headingOne">
              <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                <h5 className="m-0 p-0">
                  {"Search Contact"}
                  <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                </h5>
              </BTN>
            </CardHeader>
            <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                <Form onSubmit={e => e.preventDefault()}>
                  <div className="gt-radio">
                    <div className="middle">
                      <div className="gtradio-box">
                        <label>
                          <input type="radio" name="searchType" id="searchType"
                            checked={(this.state.searchType === 'INDIVIDUAL') ? true : false}
                            value={this.state.searchType} onChange={(e) => this.onRadioBtnClick('INDIVIDUAL')} />
                          <div className="front-end box">
                            <span>INDIVIDUAL</span>
                          </div>
                        </label>
                      </div>
                      <div className="gtradio-box">
                        <label>
                          <input type="radio" name="searchType" id="searchType"
                            checked={(this.state.searchType === 'COMPANY') ? true : false}
                            value={this.state.searchType} onChange={() => this.onRadioBtnClick('COMPANY')} />
                          <div className="front-end box">
                            <span>COMPANY</span>
                          </div>
                        </label>
                      </div>
                      {/* <div className="gtradio-box">
                        <label>
                          <input type="radio" name="searchType" id="searchType"
                            checked={(this.state.searchType === 'ALL') ? true : false}
                            value={this.state.searchType} onChange={(e) => this.onRadioBtnClick('ALL')} />
                          <div className="front-end box">
                            <span>All</span>
                          </div>
                        </label>
                      </div> */}
                    </div>
                  </div>

                  <div>
                    {(this.state.searchType == 'INDIVIDUAL') ? (
                      <Row>
                        <Col md="3">
                          <div className="input-box">
                            <label>Contact Type</label>
                            <Select options={this.state.CONTACTTYPE}
                              onChange={(data) => this.selectType(data, 'CONTACTTYPENEW')}
                              value={this.state.CONTACTTYPENEW} className="" id="CONTACTTYPENEW"
                              placeholder="Contact Type" name="CONTACTTYPENEW"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Contact Code</label>
                            <Input name="ContactCode" id="ContactCode" value={this.state.ContactCode} onChange={(e) => this.handleChange(e)} placeholder="Contact Code" />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Name</label>
                            <Input name="ContactName" id="ContactName" value={this.state.ContactName} onChange={(e) => this.handleChange(e)} placeholder="Enter Contact Name" />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Country</label>
                            <Select options={this.state.countryArray}
                              onChange={(data) => this.selectType(data, 'addrCountry')}
                              value={this.state.addrCountry} className="" id="addrCountry"
                              placeholder="Country" name="addrCountry"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Login User/Non-Login User</label>
                            <Select options={this.state.userloginArray}
                              onChange={(data) => this.selectType(data, 'userlogin')}
                              value={this.state.userlogin} className="" id="userlogin"
                              placeholder="Login User/Non-Login User" name="userlogin"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Client(Phone/Email)</label>
                            <Input name="clientNamePhoneEmail" id="clientNamePhoneEmail" value={this.state.clientNamePhoneEmail} onChange={(e) => this.handleChange(e)} placeholder="Enter Client/Phone/Email" />
                          </div>
                        </Col>
                      </Row>
                    ) : (null)}

                    {(this.state.searchType == 'COMPANY') ? (
                      <Row>
                        <Col md="3">
                          <div className="input-box">
                            <label>Contact Type</label>
                            <Select options={this.state.CONTACTTYPE}
                              onChange={(data) => this.selectType(data, 'CONTACTTYPENEW')}
                              value={this.state.CONTACTTYPENEW} className="" id="CONTACTTYPENEW"
                              placeholder="Contact Type" name="CONTACTTYPENEW"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Contact Code</label>
                            <Input name="ContactCode" id="ContactCode" value={this.state.ContactCode} onChange={(e) => this.handleChange(e)} placeholder="Contact Code" />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Name</label>
                            <Input name="ContactName" id="ContactName" value={this.state.ContactName} onChange={(e) => this.handleChange(e)} placeholder="Enter Contact Name" />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Country</label>
                            <Select options={this.state.countryArray}
                              onChange={(data) => this.selectType(data, 'addrCountry')}
                              value={this.state.addrCountry} className="" id="addrCountry"
                              placeholder="Country" name="addrCountry"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Login User/Non-Login User</label>
                            <Select options={this.state.userloginArray}
                              onChange={(data) => this.selectType(data, 'userlogin')}
                              value={this.state.userlogin} className="" id="userlogin"
                              placeholder="Login User/Non-Login User" name="userlogin"
                            />
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="input-box">
                            <label>Client(Phone/Email)</label>
                            <Input name="clientNamePhoneEmail" id="clientNamePhoneEmail" value={this.state.clientNamePhoneEmail} onChange={(e) => this.handleChange(e)} placeholder="Enter Client/Phone/Email" />
                          </div>
                        </Col>
                      </Row>
                    ) : (null)}

                  </div>

                  {(this.state.searchType != 'ALL') ? (
                    <Row>
                      <Col md="12" className="text-left">
                        <BTN type="submit" color="success" title="Go" onClick={() => this.getSearchContact()}> Go </BTN>
                      </Col>
                    </Row>
                  ) : (null)}
                </Form>
              </CardBody>
            </Collapse>
          </Card>
        </div>
        <div className="table-custom">
          <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
            paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.arr.length} exportFilename="Contact List"
            currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
            responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
            onValueChange={(filteredData => this.filterData(filteredData))}
          >
            {columns}
          </DataTable>
        </div>

        <Modal toggle={() => this.reset('edit')} isOpen={this.state.showModal}>
          <ModalHeader toggle={() => this.reset('edit')}>
            Edit Contact Details
          </ModalHeader>

          <ModalBody>
            {this.state.arrayToDisplay.map((que, i) => {
              return (
                <div className="input-box rc-box" key={i}>
                  <div className="rc-inline">
                    <Row>
                      <Col md="4">
                        <label>{que.stringmapname}</label>
                      </Col>

                      <Col md="4">
                        <label>{this.state.selectedRecord[que.stringmapkey]}</label>
                      </Col>

                      <Col md="4">
                        <Input type="select" name={que.stringmapkey} id={que.stringmapkey} className=""
                          onChange={(e) => this.selectType1(e.target.value, e.target.name)}>
                          <option value=''>Select</option>
                          <option value='Correct'>Correct</option>
                          <option value='Incorrect'>Incorrect</option>
                        </Input>
                        <em className="error invalid-feedback" >Please select one option</em>
                      </Col>
                    </Row>
                  </div>
                </div>
              )
            })
            }

            <div className="input-box rc-box">
              <div className="rc-inline">
                <Row>
                  <Col md="4">
                    <label>Comment</label>
                  </Col>

                  <Col md="8">
                    <Input name="note" type="textarea" id="note" className="" onChange={e => this.handleChange(e)} value={this.state.note} />
                    <em className="error invalid-feedback" >Please enter note</em>
                  </Col>
                </Row>
              </div>
            </div>

          </ModalBody>

          <ModalFooter>
            <BTN color="danger" onClick={() => this.reset()}>
              <i className="fa fa-close"></i>
              Verification Failed
          </BTN>
            <BTN color="success" onClick={() => this.goToEdit()}>
              <i className="fa fa-check"></i>
              Verification Done
            </BTN>
          </ModalFooter>
        </Modal>

        <Modal toggle={() => this.reset('delete')} isOpen={this.state.isDeleteContact}>
          <ModalHeader toggle={() => this.reset('delete')}>
            Delete Contact?
          </ModalHeader>

          <ModalBody>
            <span>Are you sure you want to delete contact {this.state.selectedRecord.name} ?</span>
          </ModalBody>

          <ModalFooter>
            <BTN color="danger" onClick={() => this.reset('delete')}>
              <i className="fa fa-close"></i>
              No
            </BTN>
            <BTN color="success" onClick={() => this.delete(this.state.selectedRecord)}>
              <i className="fa fa-check"></i>
              Yes
            </BTN>
          </ModalFooter>
        </Modal>

        <Modal
          toggle={() => this.reset('policyModal')}
          isOpen={this.state.showPolicyModal}
        >
          <ModalHeader toggle={() => this.reset('policyModal')}>
            <h5>No Policy Found for <b>{this.state.NewPolicyUser}</b></h5>
          </ModalHeader>

          <ModalBody>
            <Row>
              <Col md="12">
                <p>{t("contactDetails:SetupPolicy.message")}</p>
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter>
            <BTN color="primary" onClick={() => this.reset('policyModal')}>
              <i className="fa fa-close"></i>
              {t("contactDetails:SetupPolicy.No")}
            </BTN>
            <BTN color="primary" onClick={() => this.goToPolicy()}>
              <i className="fa fa-check"></i>
              {t("contactDetails:SetupPolicy.Yes")}
            </BTN>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default withTranslation()(SearchContact);