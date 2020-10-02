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

class BulkDocument extends Component {

  constructor(props) {
    super(props);
    let columns = [
      { field: "SrNo", header: "Sr No.", id: 0 , sortable: true, filter: true, filterMatchMode: 'contains'},
      { field: "PolicyId", header: "Policy Id", id: 1 , sortable: true, filter: true, filterMatchMode: 'contains'},
      { field: "PolicyNumber", header: "Policy Number", id: 2 , sortable: true, filter: true, filterMatchMode: 'contains'},
      { field: "ProcessType", header: "Process Type", id: 3 , sortable: true, filter: true, filterMatchMode: 'contains'},
      {body: this.format_status.bind(this), field: "Status", header: "Status", id: 4 , sortable: true, filter: true, filterMatchMode: 'contains'},
      {body: this.format_error.bind(this), field: "Error", header: "Error", id: 5 , sortable: true, filter: true, filterMatchMode: 'contains'},
      {body: this.format_createddate_createdby.bind(this), field: "Process Time", header: "Process Time", id: 6 , sortable: true, filter: true, filterMatchMode: 'contains'},
      { field: "MissingDocumentlist", header: "MissingDocumentlist", id: 7 , sortable: true, filter: true, filterMatchMode: 'contains'},
    ];

    // console.log("props",props);

    this.state = {
      sortinggroup:[],
      brand: null,
      colors: null,
      toggleModalDel: false,
      toggleModalAdd: false,
      cols: columns,
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
   
  }

  componentDidMount() {
  this.getData();
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
    let lastPage = (l < this.state.sortinggroup.length) ? l : this.state.sortinggroup.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.sortinggroup.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  getData(){
    api.post("api/getgeneratebulkDocument", '').then( res => {
      if (res.success) {
        console.log("res  getgeneratebulkDocument",res);
        
        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            SrNo:[i + 1],
            PolicyId:res.data[i].PolicyId,
            PolicyNumber:res.data[i].PolicyNumber,
            ProcessType:res.data[i].ProcessType,
            StatusGenerateDoc:res.data[i].StatusGenerateDoc,
            ErrorGenerateDoc:res.data[i].ErrorGenerateDoc,

            StatusRecalculate:res.data[i].StatusRecalculate,
            ErrorRecalculate:res.data[i].ErrorRecalculate,
            StatusBindPolicy:res.data[i].StatusBindPolicy,
            ErrorBindPolicy:res.data[i].ErrorBindPolicy,

            PhysicalDocumentVerficationStatus:res.data[i].PhysicalDocumentVerficationStatus,
            DTProcessStart:res.data[i].DTProcessStart ? moment(res.data[i].DTProcessStart).format('YYYY-MM-DD hh:mm:ss a') : '' ,
            DTProcessEnd:res.data[i].DTProcessEnd ? moment(res.data[i].DTProcessEnd).format('YYYY-MM-DD hh:mm:ss a') : '' ,
            MissingDocumentlist:res.data[i].MissingDocumentlist
          })
        }
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';
        this.setState({ sortinggroup: formattedData, str: str });
      } else {
        console.log("no data",res);
      }
    }).catch(err => {

      });
  }

  format_status(rowData) {
    return (
      <div className="policy-list-data">
        <p>Recalculate status:- {rowData.StatusRecalculate}</p>
        <p>BindPolicy status:- {rowData.StatusBindPolicy}</p>
        <p>Generate Documnet status:- {rowData.StatusGenerateDoc}</p>
        <p>Physical Documnet status:- {rowData.PhysicalDocumentVerficationStatus}</p>
      </div>
    )
  }

  format_error(rowData) {
    return (
      <div className="policy-list-data">
        <p>Recalculate Error:- {rowData.ErrorRecalculate}</p>
        <p>BindPolicy Error:- {rowData.ErrorBindPolicy}</p>
        <p>Generate Documnet Error:- {rowData.ErrorGenerateDoc}</p>
      </div>
    )
  }


  recomputePremium(){
    try {    
      api.post("api/getgeneratebulkDocument", '',true).then(async res => {
        console.log("res", res);
        // toast.success(res.data.message);
        if (res.success) {
         for (var i = 0; i < res.data.length; i++) {
            console.log("res.data",res.data[i]);
            const data = {PolicyId:res.data[i].PolicyId,IsRenewal: 1, CurrentUser: CommonConfig.loggedInUserId() };
       await  api.post("api/bulkdocumentrecompute", data).then(res1 => {
         // debugger;   
         console.log("dayta",res1);
           
            }).catch(err => {
              console.log('err',err);             
            });
  
          }
          window.location.reload();
          } else {
  
        }
      }).catch(err => {
  
      });
    } catch (error) {
  
    }
  }
  // recomputePremium(){
  //   const data = {IsRenewal: 1, CurrentUser: CommonConfig.loggedInUserId() };
  //   api.post('api/bulkdocumentrecompute', data).then(res => {

  //     console.log('ress', res);
    
  //     // if (res.success) {
  //     //   console.log('res',res);
  //     // } else {
  //     //   console.log('error');    
  //     // }
  //   }).catch(err => {
  //     console.log('err', err);
  //   });   
  // }

  format_createddate_createdby(rowData) {
    return (
      <div className="policy-list-data">
        <p>Start Process:- {rowData.DTProcessStart}</p>
        <p>End Process:- {rowData.DTProcessEnd}</p>
      </div>
    )
  }

   getDocumentList() {
    try {
      const data = {
        entityType: this.state.NavPage,
        entityId: this.state.NavID
      };
      
      api.post("api/getgeneratebulkDocument", '',true).then(async res => {
        console.log("res", res);
        // toast.success(res.data.message);
        if (res.success) {
         for (var i = 0; i < res.data.length; i++) {
            console.log("res.data",res.data[i]);
            
       await  api.post("api/generatebulkDocument", res.data[i],true).then(res1 => {
         // debugger;
         if(res1.data.success){
          toast.success('Policy Number: '+res.data[i].PolicyNumber+': '+res1.data.message);
         }
         else{
          toast.error('Policy Number: '+res.data[i].PolicyNumber+': '+res1.data.message)
         }
             
            }).catch(err => {
              console.log('err',err);             
            });

          }
          window.location.reload();
          } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  render() {

    const { t, i18n } = this.props;
    const CancelButton = t("buttons.Cancel");
    const Generate = t("buttons.Generate");

    var header =
      <div>
     
      </div>;

let columns = this.state.cols.map((col, i) => {
  // return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
  return<Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} selectionMode={col.selectionMode} style={col.style} />
});

    return (
      <div className="animated fadeIn">

          <div style={{margin:5,height:'40px'}}>
            <BTN style={{float:'right'}} onClick={() => this.getDocumentList()}>Generate Bulk Document</BTN>
            <BTN style={{float:'right',marginRight:'5px'}} onClick={() => this.recomputePremium()}>Recompute Premium and Bind Policy</BTN>
          </div>

          <div className="table-custom">
          <DataTable ref={(el) => this.dt = el} value={this.state.sortinggroup} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
            paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.sortinggroup.length} exportFilename="Task List"
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

export default withTranslation()(BulkDocument);