import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button } from 'reactstrap';
import api from '../../utils/apiClient';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import CKEditor from 'ckeditor4-react';
import { Redirect } from 'react-router-dom';


class Endorsements extends Component {
  constructor() {
    super();
    let columns = [
      { field: "MidTermAdjustmentDisplayId", header: "Id", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
      { field: "AdjustmentDate", header: "Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
      { field: "Note", header: "Note", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
      { body: this.formatAmountChargedData.bind(this), sortable: true, filter: true, filterMatchMode: 'contains', field: "ChargeAmount", header: "ChargeAmount", id: 3 },
      { body: this.formatChargeFees.bind(this), sortable: true, filter: true, filterMatchMode: 'contains', field: "ChargeFee", header: "ChargeFee", id: 4 },
      { body: this.formatTotal.bind(this), sortable: true, filter: true, filterMatchMode: 'contains', field: "Total", header: "Total", id: 5 },
      { field: "MidTermStatus", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
      { field: "CreatedByName", header: "CreatedBy", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
      { field: "CreatedOn", header: "CreatedOn", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
      { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 9, style: { width: '12%' } }
    ];

    this.state = {
      PolicyId: 'bef076c0-2ea5-11ea-a563-fa163eb9754c',
      isEdit: 0,
      endorsementName: '',
      systemEndorsement: '',
      systemEndorsementsError: true,
      systemEndorsementsList: [],
      systemEndorsementMaster: [],
      customEndorsementMaster: [],
      customEndorsement: '',
      customEndorsementId: '',
      customEndorsementsError: true,
      customEndorsementsList: [],
      customEndorsementDetails: '',
      customEndorsementTitleError: true,
      customEndorsementDetailsError: false,
      toggleModal: false,
      toggleSystemSaveModal: false,
      toggleSystemDeleteModal: false,
      cols: columns,
      tempData: [],
      tempid: '',
      str: '',
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      selectedPage: 0,
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
      arr: [],
      EndrosmentDetails: '',
      toggleCusomEndrosmentDetailModal: false,
      CurrencySymbol: '',
      showMTAModel: false,
    }

    this.handleDetailsChange = this.handleDetailsChange.bind(this);
  }

  actionTemplate(rowData, column) {
    return <div>
      <Button type="button" color="primary" className="fa fa-eye btn-sm" title="View" tooltipOptions={{ position: 'bottom' }} onClick={(e) => this.showMDTAPopup(e, rowData)}>
      </Button>
      <Button style={{marginLeft:5}} type="button" color="warning" className="fa fa-eye btn-sm" title="View Dynamic Computation" tooltipOptions={{ position: 'bottom' }} onClick={(e) => this.showDynamicComputationDetails(e, rowData)}>
      </Button></div>;
  }

  showMDTAPopup = (e, rowData) => {
    console.log("showMDTAPopup", rowData);
    this.setState({
      showMTAModel: true, MidTermAdjustmentDisplayId: rowData.MidTermAdjustmentDisplayId, AdjustmentDate: rowData.AdjustmentDate,
      Note: rowData.Note, ChargeAmount: rowData.ChargeAmount, ChargeFee: rowData.ChargeFee, DefaultChargeAmount: rowData.DefaultChargeAmount, DefaultChargeFee: rowData.DefaultChargeFee, MidTermStatus: rowData.MidTermStatus, CreatedByName: rowData.CreatedByName, CreatedOn: rowData.CreatedOn, CreatedTime: rowData.CreatedTime, AdjustmentType: rowData.AdjustmentType,
      PremiumBefore: rowData.PremiumBefore, PremiumAfter: rowData.PremiumAfter, TotalCharge: rowData.TotalCharge, DefaultTotalCharge: rowData.DefaultTotalCharge, Levy: rowData.Levy
    })
  }

  showDynamicComputationDetails = (e, rowData) => {
    const data = {  PolicyId: this.props.match.params.id,
                    PolicyMidTermAdjustmentId: rowData.PolicyMidTermAdjustmentId };

    api.post('api/showDynamicComputationDetails', data).then(res => {
      if (res.success) {
        this.setState({ dynamicComputationDetails: res.data[0][0].Html, showDynamicComputation: true });
      } else {

      }
    }).catch(err => {

    });
  }

  hideDynamicComputationDetailModel = (e) => {
    this.setState({ dynamicComputationDetails: '', showDynamicComputation: false });
  }

  componentDidMount() {
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
    }
    console.log("componentDidMount", this.props.CurrencySymbol);
    this.getMidTermAdjustment();
    this.getSystemEndorsement();
    this.getCustomEndorsement();
    this.setState({ PolicyId: this.props.match.params.id })
  }

  formatAmountChargedData(rowData) {
    return (
      <div style={{ float: 'right' }}>{<i className={this.props.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.ChargeAmount) ? ('') : (rowData.ChargeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
    )
  }

  formatChargeFees(rowData) {
    return (
      <div style={{ float: 'right' }}>{<i className={this.props.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.ChargeFee) ? ('') : (rowData.ChargeFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
    )
  }

  formatTotal(rowData) {
    return (
      <div style={{ float: 'right' }}>{<i className={this.props.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.ChargeFee) ? ('') : (((Number(rowData.ChargeAmount) + Number(rowData.ChargeFee)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
    )
  }

  getMidTermAdjustment() {
    let data = { PolicyId: this.props.match.params.id }; //this.state.PolicyId }
    api.post('api/getMidTermAdjustment', data).then(res => {
      if (res.success) {
        console.log("getMidTermAdjustment", res.data);

        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {

          formattedData.push({
            MidTermAdjustmentDisplayId: res.data[i].MidTermAdjustmentDisplayId,
            AdjustmentDate: CommonConfig.isEmpty(res.data[i].AdjustmentDate) ? 'N/A' : moment(res.data[i].AdjustmentDate).format(CommonConfig.dateFormat.dateOnly),
            Note: CommonConfig.isEmpty(res.data[i].Note) ? 'N/A' : res.data[i].Note,
            ChargeAmount: CommonConfig.isEmpty(res.data[i].ChargeAmount) ? 0 : (res.data[i].ChargeAmount).toFixed(2),
            ChargeFee: CommonConfig.isEmpty(res.data[i].ChargeFee) ? 0 : (res.data[i].ChargeFee).toFixed(2),
            DefaultChargeAmount: CommonConfig.isEmpty(res.data[i].DefaultChargeAmount) ? 0 : (res.data[i].DefaultChargeAmount).toFixed(2),
            DefaultChargeFee: CommonConfig.isEmpty(res.data[i].DefaultChargeFee) ? 0 : (res.data[i].DefaultChargeFee).toFixed(2),
            MidTermStatus: res.data[i].MidTermStatus,
            CreatedByName: res.data[i].CreatedByName,
            CreatedOn: CommonConfig.isEmpty(res.data[i].CreatedOn) ? 'N/A' : moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateOnly),
            CreatedTime: CommonConfig.isEmpty(res.data[i].CreatedOn) ? 'N/A' : moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.timeOnly),
            UpdatedOn: CommonConfig.isEmpty(res.data[i].UpdatedOn) ? 'N/A' : moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateOnly),
            UpdatedTime: CommonConfig.isEmpty(res.data[i].UpdatedOn) ? 'N/A' : moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.timeOnly),
            AdjustmentType: CommonConfig.isEmpty(res.data[i].AdjustmentType) ? 'N/A' : res.data[i].AdjustmentType,
            PremiumBefore: CommonConfig.isEmpty(res.data[i].PremiumBefore) ? 0 : res.data[i].PremiumBefore,
            PremiumAfter: CommonConfig.isEmpty(res.data[i].PremiumAfter) ? 0 : res.data[i].PremiumAfter,
            TotalCharge: (Number(res.data[i].ChargeAmount) + Number(res.data[i].ChargeFee)).toFixed(2),
            DefaultTotalCharge: (Number(res.data[i].DefaultChargeAmount) + Number(res.data[i].DefaultChargeFee)).toFixed(2),
            Levy: CommonConfig.isEmpty(res.data[i].Levy) ? 0 : res.data[i].Levy,
            PolicyMidTermAdjustmentId: res.data[i].PolicyMidTermAdjustmentId,
          })
        }
        let firstPage = (formattedData.length) ? '1' : '0';
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
        this.setState({ arr: formattedData, str: str });
      } else {

      }
    }).catch(err => {

    });
  }

  getSystemEndorsement = () => {
    let data = { PolicyId: this.state.PolicyId } //Static policy ID
    api.post('api/getSystemEndorsement', data).then(res => {
      if (res.success) {
        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            id: [i + 1],
            label: res.data[i].SystemEndorsementId,
            value: 'Endorsement ' + res.data[i].EndorsementNumber + ' ' + res.data[i].EndorsementTitle,
            isAdded: false,
          })
        }
        this.setState({ systemEndorsementMaster: formattedData });
        this.getAddedSystemEndorsement();
      } else {

      }
    }).catch(err => {

    });
  }

  getCustomEndorsement = () => {
    let data = { PolicyId: this.state.PolicyId }  //Static policy ID
    api.post('api/getCustomEndorsement', data).then(res => {
      if (res.success) {
        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            id: [i + 1],
            label: res.data[i].CustomEndorsementId,
            value: res.data[i].CustomEndorsementTitle,
            details: '',
            isAdded: false,
            IsCustom: false
          })
        }
        this.setState({ customEndorsementMaster: formattedData });
        this.getAddedCustomEndorsement();
      } else {

      }
    }).catch(err => {
      console.log(err);

    });
  }

  getAddedSystemEndorsement = () => {
    let data = { PolicyId: this.state.PolicyId }  //Static policy ID
    api.post('api/getAddedSystemEndorsement', data).then(res => {
      if (res.success) {
        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            id: i,
            SystemEndorsementId: res.data[i].SystemEndorsementId,
            endorsement: 'Endorsement ' + res.data[i].EndorsementNumber + ' ' + res.data[i].EndorsementTitle,
          })
          let endorsementArray = this.state.systemEndorsementMaster;
          let index = endorsementArray.findIndex(x => x.label === res.data[i].SystemEndorsementId);
          endorsementArray[index].isAdded = true;
          this.setState({ systemEndorsementMaster: endorsementArray });
        }
        this.setState({ systemEndorsementsList: formattedData });
      } else {

      }
    }).catch(err => {

    });
  }

  getAddedCustomEndorsement = () => {
    let data = { PolicyId: this.state.PolicyId }  //Static policy ID
    api.post('api/getAddedCustomEndorsement', data).then(res => {
      if (res.success) {

        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            id: i,
            customEndorsementid: res.data[i].CustomEndorsementId,
            endorsement: res.data[i].CustomEndorsementTitle,
            details: res.data[i].Details,
          })
          let endorsementArray = this.state.customEndorsementMaster;
          let index = endorsementArray.findIndex(x => x.label === res.data[i].CustomEndorsementId);
          endorsementArray[index].isAdded = true;
          this.setState({ customEndorsementMaster: endorsementArray });
        }

        this.setState({ customEndorsementsList: formattedData });
      } else {

      }
    }).catch(err => {
      console.log(err);

    });
  }

  ValidateAndAddSystem = () => {
    if (this.state.systemEndorsementsError === false) {
      // if no error over System Endorsement
      let endorsementArray = this.state.systemEndorsementMaster;
      let index = endorsementArray.findIndex(x => x.label === this.state.systemEndorsement);
      let data = { endorsement: endorsementArray[index].value }
      api.post('api/validateSystemEndorsement', data).then(res => {
        if (res.success) {
          if (res.data == 'true') {
            // if validate with vessel class and type
            this.openModal('save', 'System');
          } else {
            // if not validate with vessel class and type
            document.getElementById("ErrorSystemEndorsement").style.display = "block";
          }
        } else {

        }
      }).catch(err => {

      });
    } else {
      // if error over System Endorsement
      this.show("systemEndorsement", this.state.systemEndorsementsError);
    }
  }

  AddCustom = (operation, type) => {// debugger
    if (this.state.customEndorsementsError) {
      if (this.state.customEndorsementsError) this.show("customEndorsement", true);
    } else {
      this.openModal(operation, type)
      this.setState({ customEndorsementId: this.state.customEndorsement, customEndorsement: this.state.endorsementName, isEdit: 3 })
    }
  }

  saveEndrosement = (type) => {
    if (type == 'System') {
      if (this.state.systemEndorsementsError === false) {
        let endorsementArray = this.state.systemEndorsementMaster;
        let index = endorsementArray.findIndex(x => x.label === this.state.systemEndorsement);

        let data = {
          SystemEndorsementId: this.state.systemEndorsement,
          PolicyId: this.state.PolicyId
        }
        api.post('api/addSystemEndorsement', data).then(res => {

          if (res.success) {
            // toast.success('System Endorsement added successfully');
            this.getAddedSystemEndorsement(); //Call added endrosment after adding new one
            this.toggleLarge('save');
            endorsementArray[index].isAdded = true;
            var systemEndorsementsArray = [
              {
                id: this.state.systemEndorsementsList.length,
                SystemEndorsementId: this.state.systemEndorsement,
                endorsement: endorsementArray[index].value,
              }
            ];
            this.setState({ systemEndorsementsList: this.state.systemEndorsementsList.concat(systemEndorsementsArray), systemEndorsementMaster: endorsementArray });
            this.reset('systemEndorsement');
          } else {

          }
        }).catch(err => {
        });
      }
    } else if (type == 'Custom') {
      // let data = {
      //   CustomEndorsementId: this.state.customEndorsement,
      //   PolicyId: this.state.PolicyId
      // }
      // api.post('api/addCustomEndorsements', data).then(res => {
      //   if (res.success) {
      //     toast.success('Custom Endorsement added successfully');
      //     // this.getAddedSystemEndorsement(); //Call added endrosment after adding new one
      //     this.toggleLarge('save');
      //   }
      // }).catch(err => {
      //   console.log(err);
      // });
      // let TempEndorsementArray = this.state.customEndorsementMaster;
      // let index = TempEndorsementArray.findIndex(x => x.label === this.state.customEndorsement);
      // TempEndorsementArray[index].isAdded = true;
      // var customEndorsementArray = [
      //   {
      //     id: this.state.customEndorsementsList.length,
      //     customEndorsementid: this.state.customEndorsement,
      //     endorsement: TempEndorsementArray[index].value,
      //     details: TempEndorsementArray[index].description,
      //     isDeleted: false
      //   }
      // ];
      // this.setState({ customEndorsementsList: this.state.customEndorsementsList.concat(customEndorsementArray), customEndorsementMaster: TempEndorsementArray });
      // this.reset('customEndorsement');
    }
  }

  editCustomEndrosement = (data, type) => {

    this.openModal('addcustom', 'Custom');
    this.setState({ customEndorsement: data.endorsement, customEndorsementDetails: data.details, tempid: data.id, customEndorsementId: data.customEndorsementid, customEndorsementTitleError: false, customEndorsementDetailsError: false, isEdit: 1 })
  }

  addCustomEndrosement = () => {
    debugger;  
    if (this.state.isEdit == 1) {
      if (
        this.state.customEndorsementTitleError === false &&
        !CommonConfig.isEmpty(this.state.customEndorsementDetails)
      ) {
        let data = {
          CustomEndorsementId: this.state.customEndorsementId,
          PolicyId: this.state.PolicyId,
          Details: this.state.customEndorsementDetails
        }
        api.post('api/addCustomEndorsements', data).then(res => {
          if (res.success) {
            this.getAddedCustomEndorsement();
            // toast.success('Custom Endorsement edited successfully');
            this.toggleLarge('save');
          }
        }).catch(err => {
          console.log(err);
        });

        this.toggleLarge('addcustom');

      } else {
        this.show("customEndorsementTitle", this.state.customEndorsementTitleError);
        this.setState({
          customEndorsementDetailsError: true
        })
        this.show("customEndorsementDetails", this.state.customEndorsementDetailsError);
      }
    } else if (this.state.isEdit == 0) {
      if (
        this.state.customEndorsementTitleError === false &&
        !CommonConfig.isEmpty(this.state.customEndorsementDetails) 
      ) {
        let data = {
          PolicyId: this.state.PolicyId,
          Title: this.state.customEndorsement,
          Details: this.state.customEndorsementDetails
        }
        api.post('api/addNewCustomEndorsements', data).then(res => {

          if (res.data.success) {
            this.getCustomEndorsement();
            // toast.success(res.data.message);
            this.toggleLarge('save');
            this.toggleLarge('addcustom');
          } else {
            toast.error(res.data.message);
          }

        }).catch(err => {
          console.log(err);
        });

      } else {
        this.show("customEndorsementTitle", this.state.customEndorsementTitleError);
        this.setState({
          customEndorsementDetailsError: true
        });
        this.show("customEndorsementDetails", this.state.customEndorsementDetailsError);
      }
    } else if (this.state.isEdit == 3) {// debugger
      let data = {
        CustomEndorsementId: this.state.customEndorsementId,
        PolicyId: this.state.PolicyId,
        Details: this.state.customEndorsementDetails
      }
      api.post('api/addCustomEndorsements', data).then(res => {
        if (res.success) {
          this.getAddedCustomEndorsement();
          // toast.success('Custom Endorsement added successfully');
          this.toggleLarge('addcustom');
        }
      }).catch(err => {
        console.log(err);
      });
      let TempEndorsementArray = this.state.customEndorsementMaster;
      let index = TempEndorsementArray.findIndex(x => x.label === this.state.customEndorsementId);
      TempEndorsementArray[index].isAdded = true;
      var customEndorsementArray = [
        {
          id: this.state.customEndorsementsList.length,
          customEndorsementid: this.state.customEndorsementId,
          endorsement: TempEndorsementArray[index].value,
          details: TempEndorsementArray[index].description,
          isDeleted: false
        }
      ];
      this.reset('customEndorsement');

      this.setState({ customEndorsementsList: this.state.customEndorsementsList.concat(customEndorsementArray), customEndorsementMaster: TempEndorsementArray, customEndorsementsError: true });
    }
  }

  delete = (value, type) => {
    if (type === 'systemEndrosement') {
      this.setState({ tempData: value, endorsementName: value.endorsement });
      this.openModal('deletecustom', 'System');
    } else if (type === 'customEndrosement') {
      this.setState({ tempData: value, endorsementName: value.endorsement });
      this.openModal('deletecustom', 'Custom');
    }
  }

  deleteEndrosement = (value, type) => {
    if (type == 'System') {
      let data = {
        SystemEndorsementId: value.SystemEndorsementId,
        PolicyId: this.state.PolicyId
      }
      api.post('api/deleteSystemEndorsement', data).then(res => {

        if (res.success) {
          // toast.success('System Endorsement deleted successfully');
          this.getAddedSystemEndorsement(); //Call added endrosment after adding new one
          this.toggleLarge('deletecustom');
        } else {

        }
      }).catch(err => {

      })
      let endorsementArray = this.state.systemEndorsementMaster;
      let listIndex = this.state.systemEndorsementsList.findIndex(x => x.endorsement === value.endorsement);
      this.state.systemEndorsementsList.splice(listIndex, 1);
      let index = endorsementArray.findIndex(x => x.value === value.endorsement);
      endorsementArray[index].isAdded = false;
      this.setState({ systemEndorsementMaster: endorsementArray });
    } else if (type == 'Custom') {

      let data = {
        CustomEndorsementId: value.customEndorsementid,
        PolicyId: this.state.PolicyId
      }
      api.post('api/deleteCustomEndorsement', data).then(res => {

        if (res.success) {
          // toast.success('Custom Endorsement deleted successfully');
          this.getAddedSystemEndorsement(); //Call added endrosment after adding new one
          this.toggleLarge('deletecustom');
        } else {

        }
      }).catch(err => {

      })
      let endorsementArray = this.state.customEndorsementMaster;
      let listIndex = this.state.customEndorsementsList.findIndex(x => x.endorsement === value.endorsement);
      if (!this.state.customEndorsementsList[listIndex].IsCustom) {
        let index = endorsementArray.findIndex(x => x.value === value.endorsement);
        endorsementArray[index].isAdded = false;
      }
      this.state.customEndorsementsList.splice(listIndex, 1);
      this.setState({ customEndorsementMaster: endorsementArray });
    }
  }

  openModal(operation, type) {

    if (operation == 'save') {
      // if call save confirmation modal
      this.setState({ toggleSystemSaveModal: !this.state.toggleSystemSaveModal, EndorsementType: type });
    }
    else if (operation == 'addcustom') {
      // if call Add Custom Endorsement modal
      this.setState({ toggleModal: !this.state.toggleModal, customEndorsement: '', customEndorsementDetails: '' });
    }
    else if (operation == 'deletecustom') {
      // if call delete confirmation modal
      this.setState({ toggleSystemDeleteModal: !this.state.toggleSystemDeleteModal, EndorsementType: type });
    }
    else if (operation == 'customDetail') {
      // if call Show More Custom Endrosment Details modal
      this.setState({ toggleCusomEndrosmentDetailModal: !this.state.toggleCusomEndrosmentDetailModal, EndrosmentDetails: type.details });
    }
  }

  toggleLarge = (operation) => {
    if (operation == 'save') {
      // if call save confirmation modal
      this.setState({ toggleSystemSaveModal: false, EndorsementType: '' });
    }
    else if (operation == 'addcustom') {
      // if call Add Custom Endorsement modal
      this.setState({ toggleModal: false, customEndorsementTitleError: true, customEndorsementDetailsError: true, customEndorsementId: '', isEdit: 0, customEndorsementsError: true });
    }
    else if (operation == 'deletecustom') {
      // if call delete confirmation modal
      this.setState({ toggleSystemDeleteModal: false, tempData: [], EndorsementType: '' });
    }
    else if (operation == 'customDetail') {
      this.setState({ toggleCusomEndrosmentDetailModal: false, EndrosmentDetails: '' })
    }
  }

  selectType(value, type) {
    if (type == 'systemEndorsement') {
      if (value === '') {
        this.setState({ systemEndorsementsError: true, systemEndorsement: value });
        this.show("systemEndorsement", true);
      } else {
        this.show("systemEndorsement", false);
        let endorsementArray = this.state.systemEndorsementMaster;
        let index = endorsementArray.findIndex(x => x.label === value);
        this.setState({ systemEndorsement: value, systemEndorsementsError: false, endorsementName: endorsementArray[index].value });
      }
    } else if (type == 'customEndorsement') {
      if (value === '') {
        this.setState({ customEndorsementsError: true, customEndorsement: value });
        this.show("customEndorsement", true);
      } else {
        this.show("customEndorsement", false);
        let endorsementArray = this.state.customEndorsementMaster;
        let index = endorsementArray.findIndex(x => x.label === value);
        this.setState({ customEndorsement: value, customEndorsementsError: false, endorsementName: endorsementArray[index].value });
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name == 'customEndorsementTitle') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ customEndorsementTitleError: true, customEndorsement: '' });
        this.show("customEndorsementTitle", true);
      } else {
        this.setState({ customEndorsementTitleError: false, customEndorsement: e.target.value });
        this.show("customEndorsementTitle", false);
      }
    } else if (e.target.name == 'customEndorsementDetails') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ customEndorsementDetailsError: true, customEndorsementDetails: '' });
        this.show("customEndorsementDetails", true);
      } else {
        this.setState({ customEndorsementDetailsError: false, customEndorsementDetails: e.target.value });
        this.show("customEndorsementDetails", false);
      }
    }
  }

  handleDetailsChange(evt) {
    debugger;
    const data = evt.editor.getData();
    if (CommonConfig.isEmpty(data)) {
      this.setState({ customEndorsementDetailsError: true, customEndorsementDetails: '' });
      // this.show("customEndorsementDetails", true);
    } else {
      this.setState({ customEndorsementDetailsError: false, customEndorsementDetails: data });
      // this.show("customEndorsementDetails", false);
    }
  }

  show(field, condition) {

    if (condition) {
      if (document.getElementById(field)) {
        document.getElementById(field).className = "form-control is-invalid";
      }
    } else {
      if (document.getElementById(field)) {
        document.getElementById(field).className = "form-control";
      }
    }
  }


  reset = (type) => {
    if (type == 'systemEndorsement') {
      this.setState({ systemEndorsement: '', systemEndorsementsError: false })
    } else if (type == 'customEndorsement') {
      this.setState({ customEndorsement: '', customEndorsementsError: false })
    }
  }

  getPageString = (e) => {
    let firstPage = e.first + 1;
    let l = e.rows * (e.page + 1);
    let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  render() {
    const { t, i18n } = this.props;
    const SaveButton = t("buttons.Save");
    const AddButton = t("buttons.Add");
    const EditButton = t("buttons.Edit");
    const DeleteButton = t("buttons.Delete");
    const CloseButton = t("buttons.Close");
    const BackButton = t("buttons.Back");
    const UpdateButton = t("buttons.Update");

    let columns = this.state.cols.map((col, i) => {
      return <Column field={col.field} header={t("policyEndorsement:MidTermAdjustment." + col.header + "")} body={col.body} sortable={col.sortable} filter={col.filter} />;
    });

    return (
      <div>
        <Container>
          <Row>
            <Col md="8">
              <span>{t("policyEndorsement:SystemEndorsement.System")}</span>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <div style={{ marginTop: 10 }} className="input-box">
                        <table className="added-detail-table">
                          <thead></thead>
                          <tbody>
                            {this.state.systemEndorsementsList.map((se, i) => {
                              if (!se.isDeleted) {
                                return (
                                  <tr>
                                    <td>
                                      <span>
                                        {(se.endorsement)}
                                      </span>
                                    </td>
                                    {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                    <td>
                                      <span>
                                        <Button title={DeleteButton} onClick={() => this.delete(se, 'systemEndrosement')} style={{ marginLeft: 5 }} color="danger">
                                          <i className="fa fa-trash"></i>
                                        </Button>
                                      </span>
                                    </td>
                                    ) : (null)}
                                  </tr>
                                )
                              }
                            })
                            }
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                  <div className="input-box">
                    <Row>
                      <Col md="4">
                        <span>{t("policyEndorsement:SystemEndorsement.label")}</span>
                      </Col>
                      <Col md="7">
                        <Input type="select" name="systemEndorsement" id="systemEndorsement" onChange={(e) => this.selectType(e.target.value, 'systemEndorsement')} value={this.state.systemEndorsement}>
                          <option value=''>{t("policyEndorsement:SystemEndorsement.defaultValue")}</option>
                          {this.state.systemEndorsementMaster.map((type, i) => {
                            if (!type.isAdded) {
                              return (<option value={type.label}>{type.value}</option>)
                            }
                          })
                          }
                        </Input>
                        <p id="ErrorSystemEndorsement" className="error" style={{ color: 'red', display: 'none' }}>This Vessel Doesnot contain this Endorsement</p>
                        <em className="error invalid-feedback">{t("policyEndorsement:SystemEndorsement.error")}</em>
                      </Col>
                      <Col md="1">
                        {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                          ? (<Button title={AddButton} color="primary" onClick={() => this.ValidateAndAddSystem()}>
                            <i className="fa fa-plus"></i>
                          </Button>)
                          : (null)}
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="11">
              <span>{t("policyEndorsement:CustomEndorsement.Custom")}</span>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <div style={{ marginTop: 10 }} className="input-box">
                        <table className="added-detail-table">
                          <thead></thead>

                          <tbody>
                            {this.state.customEndorsementsList.map((se, i) => {
                              if (!se.isDeleted) {
                                return (
                                  <tr>
                                    <td>
                                      <span>
                                        {(se.endorsement)}
                                      </span>
                                    </td>

                                    <td>
                                      <span>
                                        {(se.details != '' && se.details != null)
                                          ?
                                          (se.details.length > 100)
                                            ?
                                            <p style={{ marginBottom: 0 }}><div style={{ display: "inline-block" }} dangerouslySetInnerHTML={{ __html: se.details.substr(0, 100) }}></div><a onClick={() => this.openModal('customDetail', se)}>...</a></p>
                                            // <p>{se.details.substr(0, 100)}<a onClick={() => this.openModal('customDetail', se)}>...</a></p>
                                            :
                                            <div dangerouslySetInnerHTML={{ __html: se.details }}></div>
                                          :
                                          (null)
                                        }
                                      </span>
                                    </td>

                                    <td>
                                      <span style={{ display: "inline-flex" }}>
                                        <Button className="p-button p-component p-button-icon-only" title={EditButton} onClick={() => this.editCustomEndrosement(se, 'customEndrosement')} style={{ marginLeft: 5 }} color="warning">
                                          <i className="fa fa-pencil"></i>
                                        </Button>
                                        <Button className="p-button p-component p-button-icon-only" title={DeleteButton} onClick={() => this.delete(se, 'customEndrosement')} style={{ marginLeft: 5 }} color="danger">
                                          <i className="fa fa-trash"></i>
                                        </Button>
                                      </span>
                                    </td>
                                  </tr>
                                )
                              }
                            })
                            }
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                  <div className="input-box">
                    <Row>
                      <Col md="4">
                        <label>{t("policyEndorsement:CustomEndorsement.label")}</label>
                      </Col>
                      <Col md="5">
                        <Input type="select" name="customEndorsement" id="customEndorsement" onChange={(e) => this.selectType(e.target.value, 'customEndorsement')} value={this.state.customEndorsement}>
                          <option value=''>{t("policyEndorsement:CustomEndorsement.defaultValue")}</option>
                          {this.state.customEndorsementMaster.map((type, i) => {
                            if (!type.isAdded) {
                              return (<option value={type.label}>{type.value}</option>)
                            }
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback" >{t("policyEndorsement:CustomEndorsement.error")}</em>
                      </Col>
                      {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                        ? (<Col md="3">
                          <Button title={AddButton} color="primary" onClick={() => this.AddCustom('addcustom', 'Custom')} style={{ marginRight: "0.5em" }}>
                            <i className="fa fa-plus"></i>
                          </Button>
                          <Button title='New' color="primary" onClick={() => this.openModal('addcustom', 'Custom')}>
                            New
                        </Button>
                        </Col>)
                        : (null)}
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <span>{t("policyEndorsement:MidTermAdjustment.title")}</span>
              <Card>
                <CardBody>
                  <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                      paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.arr.length} currentPageReportTemplate={this.state.str}
                      scrollable={true} scrollHeight="250px"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      rowsPerPageOptions={this.state.rowsPerPageOptions} emptyMessage="No records found"
                      responsive={true} resizableColumns={true} columnResizeMode="fit"
                      scrollable={true} scrollHeight="265px">
                      {columns}
                    </DataTable>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={this.state.toggleModal} toggle={() => this.toggleLarge('addcustom')}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={() => this.toggleLarge('addcustom')}>Custom Endorsement</ModalHeader>
          <ModalBody>
            <Row style={{ marginTop: 10 }}>
              <Col md="2">
                <label>Title</label>
              </Col>
              <Col md="10">
                <div className="input-box">
                  {this.state.isEdit == 1 || this.state.isEdit == 3 ?
                    <Input type="text" name="customEndorsementTitle" id="customEndorsementTitle" onChange={e => this.handleChange(e)} placeholder="Custom Endorsement Title" value={this.state.customEndorsement} readOnly />
                    :
                    <Input type="text" name="customEndorsementTitle" id="customEndorsementTitle" onChange={e => this.handleChange(e)} placeholder="Custom Endorsement Title" value={this.state.customEndorsement} />
                  }
                  <em className="error invalid-feedback"> Please enter custom endorsement title </em>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col md="2">
                <label>Details</label>
              </Col>
              <Col md="10">
                <div className="input-box">
                  {/* <Input type="textarea" name="customEndorsementDetails" id="customEndorsementDetails" rows={5} cols={50} placeholder="please write note" value={this.state.customEndorsementDetails} onChange={e => this.handleChange(e)} autoResize={true} /> */}

                  <CKEditor name="customEndorsementDetails" id="customEndorsementDetails" data={this.state.customEndorsementDetails} onChange={this.handleDetailsChange} />
                  {this.state.customEndorsementDetailsError == true ?
                    <em className="error" style={{ color: 'red', fontSize: '80%' }}> Please enter custom endorsement details </em>
                    :
                    null
                  }

                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {/* <Button className="p-button p-component p-button-icon-only" title={SaveButton} onClick={() => this.addCustomEndrosement('customEndrosement')} style={{ marginLeft: 5 }} color="warning">
              <i className="fa fa-check"></i>
            </Button>
            <Button className="p-button p-component p-button-icon-only" title={CloseButton} onClick={() => this.toggleLarge('addcustom')} style={{ marginLeft: 5 }} color="danger">
              <i className="fa fa-times"></i>
            </Button> */}

            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.addCustomEndrosement('customEndrosement')}>
              < i style={{ marginRight: "10px" }} className="fa fa-check" ></i >
              Save
            </Button>
            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.toggleLarge('addcustom')}>
              <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.toggleSystemSaveModal} toggle={() => this.toggleLarge('save')}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={() => this.toggleLarge('save')}>Add {this.state.EndorsementType} Endorsement</ModalHeader>
          <ModalBody>
            Are you sure you want to Add <b>{this.state.endorsementName}</b> {this.state.EndorsementType} Endorsement?
          </ModalBody>
          <ModalFooter>
            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveEndrosement(this.state.EndorsementType)}>
              < i style={{ marginRight: "10px" }} className="fa fa-check" ></i >
              Yes
            </Button>
            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.toggleLarge('save')}>
              <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.toggleSystemDeleteModal} toggle={() => this.toggleLarge('deletecustom')}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={() => this.toggleLarge('deletecustom')}>Delete {this.state.EndorsementType} Endorsement</ModalHeader>
          <ModalBody>
            Are you sure you want to Delete <b>{this.state.endorsementName}</b> {this.state.EndorsementType} Endorsement?
          </ModalBody>
          <ModalFooter>
            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.deleteEndrosement(this.state.tempData, this.state.EndorsementType)}>
              < i style={{ marginRight: "10px" }} className="fa fa-check" ></i >
              Yes
            </Button>
            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.toggleLarge('deletecustom')}>
              <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.toggleCusomEndrosmentDetailModal} toggle={() => this.toggleLarge('customDetail')}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={() => this.toggleLarge('customDetail')}>Custom Endorsement Details</ModalHeader>
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: this.state.EndrosmentDetails }}></div>
            {/* {this.state.EndrosmentDetails} */}
          </ModalBody>
          <ModalFooter>
            <button color="secondary" onClick={() => this.toggleLarge('customDetail')}>Close</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.showMTAModel}
          className={'modal-lg modal-primary '}
        >
          <ModalHeader toggle={() => this.setState({ showMTAModel: false })}>Mid Term Adjustment</ModalHeader>
          <ModalBody>
            <Col style={{ margin: 15 }}>

              <Row>
                <Col md="3">
                  <label>Policy Number</label>
                </Col>
                <Col md="3">
                  <label>{this.props.PolicyNumber}</label>
                </Col>

                <Col md="4">
                  <label>Mid-Term Id</label>
                </Col>
                <Col md="2">
                  <label>{this.state.MidTermAdjustmentDisplayId}</label>
                </Col>

                {/* <Col md="3">
                  <label>Total Due</label>
                </Col>
                <Col md="3">
                  <label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.PremiumBefore}</label>
                </Col> */}
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="3">
                  <label>Adjustment Date *</label>
                </Col>
                <Col md="3">
                  <label>{this.state.AdjustmentDate}</label>
                </Col>

                {/* <Col md="3">
                  <label>New Total Due</label>
                </Col>
                <Col md="3">
                  <label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.PremiumAfter}</label>
                </Col> */}
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="3">
                  <label>Adjustment Type</label>
                </Col>
                <Col md="3">
                  <label>{this.state.AdjustmentType}</label>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="4">
                </Col>
                <Col md="2">
                  <label><b>Default</b></label>
                </Col>
                <Col md="2">
                  <label><b>Actual</b></label>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="4">
                  <label>Actual Amount</label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeAmount}
                  </label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.ChargeAmount}
                  </label>
                </Col>
              </Row>


              <Row style={{ marginTop: 10 }}>
                <Col md="4">
                  <label>Mid Term Adjustment Fee
                        {/* {this.state.suggestedByEvo} */}
                  </label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeFee}
                  </label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.ChargeFee}
                  </label>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="4">
                  <label>Total Mid Term Charges</label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultTotalCharge}</label>
                </Col>
                <Col md="2">
                  <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.TotalCharge}</label>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="4">
                  <label>Mid-Term Note</label>
                </Col>
                <Col md="5">
                  <label>{this.state.Note}</label>
                </Col>
              </Row>
            </Col>
            <Col style={{ margin: 15 }}>
              <Row>
                <Col md="4">
                  <label>UpdatedBy</label>
                </Col>
                <Col md="5">
                  <label>{this.state.CreatedByName} ({this.state.CreatedOn}  {this.state.CreatedTime})</label>
                </Col>
                {/* <Col md="4">
                  <label>UpdatedOn</label>
                </Col>
                <Col md="2">
                  <label></label>
                </Col> */}
              </Row>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={() => this.setState({ showMTAModel: false })}><i style={{ marginRight: "10px" }} className="fa fa-check"></i>Ok</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.showDynamicComputation} className="policydetail_modal">
          <ModalHeader>
            Summary Details
                        <a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.hideDynamicComputationDetailModel()}>
              <i class="fa fa-close"></i>
            </a>
          </ModalHeader>
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: this.state.dynamicComputationDetails }}></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default withTranslation()(Endorsements);