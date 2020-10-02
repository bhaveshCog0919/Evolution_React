import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { withTranslation } from 'react-i18next';

import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';

class ContactManagement extends Component {
  constructor(props) {
    super(props);

    let columns = [
      { field: "code", header: "Code", sortable: true, filter: true,filterMatchMode: 'contains', style: { width: 80 }, id: 0 },
      { field: "name", header: "Name/Company", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 1 },
      // { field: "address", header: "Address", sortable: true, filter: true },
      // { field: "county", header: "County", sortable: true, filter: true },
      { field: "phone", header: "Phone", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 2 },
      { field: "email", header: "Email", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 3 },
      { field: "country", header: "Country", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 4 },
      { field: "address", header: "Address", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 5 },
      { field: "contact", header: "Contact Type", sortable: true,filterMatchMode: 'contains', filter: true, style: {}, id: 6 },
      { body: this.actionTemplate.bind(this), header: "Action", sortable: false,filterMatchMode: 'contains', filter: false, style: {}, id: 7 }
    ];

    this.state = {
      selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
      brand: null,
      colors: null,
      toggleModal: false,
      cols: columns,
      arr: [],
      selectedPage: 0,
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      str: '',
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
      globalFilter: null,

      organizationQuestion: [],
      personQuestion: [],
      arrayToDisplay: [],
      verificationArray: [],

      showModal: false,
      selectedRecord: '',
      note: '',

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
    this.getContactDetails();
    this.getPersonQuestion();
    this.getOrganizationQuestion();
  }

  getContactDetails() {
    try {
      let data = {
        orderby: CommonConfig.isEmpty(this.props.location.state) ? 'SearchName' : (this.props.location.state.isAdded) ? 'CreatedOn' : 'SearchName'
      }
      api.post('api/getContactList', data).then(res => {
        console.log("getContactList----------------- ",res);
        if (res.success) {
          let formattedData = [];
          let i;
          for (i = 0; i < res.data.length; i++) {
          
            formattedData.push({
              id: (res.data[i].PersonId && res.data[i].PersonId !== undefined && res.data[i].PersonId !== null) ? res.data[i].PersonId : res.data[i].OrganizationId,
              entityType: res.data[i].EntityType,
              code: res.data[i].ContactCode,
              name: res.data[i].fullname, //(res.data[i].personid ? res.data[i].forename + ' ' + res.data[i].surname : res.data[i].organizationname),
              address: (res.data[i].AddrLine1 === null || res.data[i].AddrLine1 === undefined) ? '' : res.data[i].AddrLine1, //res.data[i].addrline1 + ' ' + res.data[i].addrline2 + ' ' + res.data[i].addrline3,
              // county: res.data[i].state,
              phone: (CommonConfig.isEmpty(res.data[i].CountryCode) ? '':res.data[i].CountryCode) 
              + ' ' + (CommonConfig.isEmpty(res.data[i].AreaCode) ? '':res.data[i].AreaCode)
              + ' ' + ( CommonConfig.isEmpty(res.data[i].PhoneNumber) ? '' : 
              CommonConfig.formatPhoneNumber(res.data[i].PhoneNumber)),
              email: res.data[i].Email,
              country: res.data[i].countryname,
              business: res.data[i].businesstype,
              contact: res.data[i].contacttype,
              DOB: (res.data[i].EntityType === 'person') ? CommonConfig.isEmpty(res.data[i].DOB) || res.data[i].DOB=='0000-00-00' || res.data[i].DOB == "Invalid date"  ?'':moment(res.data[i].DOB).format('DD-MM-YYYY') : res.data[i].DOB, //for person dob as dob - for organization dob as companyidentifier,
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

  getPersonQuestion() {
    try {
      const data = {
        stringmaptype: 'PERSONQUESTION',
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ personQuestion: res.data });
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
    let id = rowData.id;
    let entityType = rowData.entityType;

    this.props.history.push({
      pathname: '/viewContactDetails/' + id + '/' + entityType,
      state: {
        id: id,
        entityType: entityType
      }
    });
    // this.setState({ showModal: true, selectedRecord: rowData, 
    //   arrayToDisplay: (rowData.entityType === 'person') ? this.state.personQuestion : this.state.organizationQuestion
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
          console.log("rowData.id...",rowData.id);
          console.log("rowData.entityType...",rowData.entityType);
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
      {/* <i className="pi pi-pencil" title="Edit" onClick={() => this.edit(rowData)} style={{ marginRight: '.5em' }}></i>
      <i className="pi pi-trash" title="Delete" onClick={() => this.delete(rowData)} style={{ marginLeft: '.5em' }}></i> */}
      <Button type="button" icon="pi pi-eye" className="p-button-warning"
        onClick={() => this.edit(rowData)}
        style={{ marginRight: '.5em' }} tooltip="View Contact" tooltipOptions={{ position: 'bottom' }} />
      <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete Contact"
        tooltipOptions={{ position: 'bottom' }} onClick={() => this.confirmDelete(rowData)} />
      <Button type="button" icon="pi pi-file" className="p-button-primary"
        onClick={() => this.viewPolicy(rowData)}
        style={{ marginRight: '.5em' }} tooltip="View Policy" tooltipOptions={{ position: 'bottom' }} />
      <Button type="button" icon="pi pi-plus" className="p-button-success"
        onClick={() => this.newPolicy(rowData)}
        style={{ marginRight: '.5em' }} tooltip="New Policy" tooltipOptions={{ position: 'bottom' }} />
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

    if (e.target.value === '' || e.target.value === null) {
      // this.show(e.target.name, true);
    } else {
      this.show(e.target.name, false);
      this.setState({ note: e.target.value });
    }
  }

  selectType = (value, type) => {
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
        //verification fail
        toast.error('User verification failed');
      } else if (errCount >= 2) {
        //verification fail
        toast.error('User verification failed');
      } else if (errCount == 1 && this.state.note === '') {
        //verfication fail
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

        // api.post('api/addVerificationDetails', data).then(res => {
        //   if(res.success){
        //     if(res.data.success){
        //       toast.success(res.data.message);

        //       this.reset();

        //       this.props.history.push({
        //         pathname: '/editContactDetails/' + id + '/' + entityType,
        //         state: {
        //           id: id,
        //           entityType: entityType
        //         }
        //       });
        //     }else{

        //     }
        //   }else{
        //     // toast.error('User verification failed');
        //   }
        // }).catch(err => {
        //   console.log("err", err);
        // });
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
    // let firstPage = (filteredData.length) ? '1' : '0';
    // let lastPage = (this.state.rowsPerPage < filteredData.length) ? this.state.rowsPerPage : filteredData.length;
    // let str = firstPage + ' to ' + lastPage + ' out of ' + filteredData.length + ' records';
    // this.setState({ str: str });
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
                          onChange={(e) => this.selectType(e.target.value, e.target.name)}>
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

export default withTranslation()(ContactManagement);