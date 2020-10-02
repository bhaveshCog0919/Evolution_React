import React, { Component } from 'react';
import { Col, Row, Input, Card, CardBody, Button as BTN, Modal, ModalBody, ModalFooter, ModalHeader, Collapse, CardHeader } from 'reactstrap';
import { InputTextarea } from 'primereact/inputtextarea';
import api from '../../utils/apiClient';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import { AutoComplete } from 'primereact/autocomplete';

import { withTranslation } from 'react-i18next';

class PolicyGeneral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PolicyId: this.props.match.params.id,
      boatingQualificationList: [],
      previousInsurerList: [],
      NCBList: [],
      previousNCBNoofYearsList: [],
      previousBoatingExperienceList: [],

      showGeneralQuestions: false,
      showInsuranceHistory: false,
      showSchemes: false,

      policyGeneralId: "",
      boatingExperienceYear: "",
      boatingExperienceYearError: true,
      isGeneralQuestionProofProvided: false,

      previousNCBYears: "",
      previousNCBYearsError: false,
      previousNCBAmount: 0,
      previousNCBAmountError: false,
      boatingQualifications: "",
      boatingQualificationsArr: [],
      boatingQualificationsError: false,
      losses: "",
      lossesErr: true,
      lossesDescribe: "",
      lossesDescribeError: false,
      showLossesDescribe: false,
      convicted: "",
      convictedErr: true,
      convictedDescribe: "",
      convictedDescribeError: false,
      ShowConvictedDescribe: false,
      insuranceCanceled: "",
      insuranceCanceledErr: true,
      insuranceCanceledDescribe: "",
      insuranceCanceledDescribeError: false,
      ShowInsuranceCanceledDescribe: false,
      damaged: "",
      damagedErr: true,
      damagedDescribe: "",
      damagedDescribeError: false,
      ShowDamagedDescribe: false,
      interestedParty: '',
      interestedPartiesError: false,
      previousInsurer: "",
      previousInsurerError: false,
      isInsuranceHistoryProofProvided: false,
      policyNo: "",
      policyNoError: true,
      memberISA: false,
      affiliatedClub: "",
      affiliatedClubError: false,
      ISAMembershipNo: "",
      ISAMembershipNoError: false,
      memberIWAI: false,
      affiliatedBranch: "",
      affiliatedBranchError: false,
      IWAIMembershipNo: "",
      IWAIMembershipNoError: false,
      isEdit: false,
      Options: [],
      toggleModal: false,
      tempData: {},

      isExpand: false,
      deleteItemName: '',
      CurrencySymbol: '',
      policyStatus: '',
    };

    this.boatingQualificationListCopy = [];
  }

  componentDidMount() {
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
    }
    console.log("componentDidMount", this.props.status);
    this.getDropDownValues('PREVIOUSBOATINGEXPERIENCE', 'previousBoatingExperienceList');
    this.getDropDownValues('PREVIOUSNCBYEARS', 'previousNCBNoofYearsList');
    this.getDropDownValues('BOATINGQUALIFICATIONS', 'boatingQualificationAllList');
    this.getDropDownValues('PREVIOUSINSURER', 'previousInsurerList');
    this.getDropDownValues('GENERALNCB', 'NCBList');
    this.getDropDownValues('POLICYGENERALYESNO', 'Options');
    // setTimeout(() => {
    this.boatingQualificationDropdown();
    this.getGeneralPolicy();
    // }, 5000);
  }

  boatingQualificationDropdown() {
    try {
      const data = {
        stringmaptype: "BOATINGQUALIFICATIONS",
        orderby: 'sortorder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {

        if (res.success) {
          // this.boatingQualificationListCopy = res.data;
          // var listData = res.data;
          // this.state.boatingQualificationsArr.forEach(data => {
          //   let index = listData.findIndex(x => x.StringMapKey === data.BoatingQualification);
          //   res.data.splice(index, 1);
          // });

          this.setState({ boatingQualificationList: res.data });
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  getDropDownValues(stringMapType, setStateName) {
    try {
      const data = {
        stringmaptype: stringMapType,
        orderby: 'sortorder'
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

  getGeneralPolicy() {
    try {
      let data = { PolicyId: this.props.match.params.id };
      api.post('api/getGeneralPolicy', data).then(res => {
        console.log("ASDfdsagf", res);
        if (res.success) {
          let arr1 = res.data[0].boatingQualificationsArr; //data from policyboatingQualification(which are added)
          let arr2 = this.state.boatingQualificationList; //data from stringmap(all boatingQualifications)

          for (let i = 0; i < arr1.length; i++) {
            let index = arr2.findIndex(x => x.StringMapId === arr1[i].BoatingQualification);
            arr2.splice(index, 1);
          }

          this.setState({
            policyGeneralId: res.data[0].PolicyGeneralId,
            boatingExperienceYear: res.data[0].PreviousBoatingExperinceInYears,
            isGeneralQuestionProofProvided: res.data[0].IsGeneralQuestionProofProvided.data[0] === 1 ? true : false,
            previousNCBAmount: res.data[0].PreviousNCBAmount,
            previousNCBYears: res.data[0].PreviousNCBYears,

            boatingQualificationsArr: res.data[0].boatingQualificationsArr,
            boatingQualificationList: arr2,

            losses: res.data[0].IsLossesInLastFiveYears.data[0] === 1 ? "Yes" : "No",
            showLossesDescribe: res.data[0].IsLossesInLastFiveYears.data[0] === 1 ? true : false,
            lossesDescribe: res.data[0].LossesInLastFiveYearsDescription,
            convicted: res.data[0].IsConvictedOrCharged.data[0] === 1 ? "Yes" : "No",
            ShowConvictedDescribe: res.data[0].IsConvictedOrCharged.data[0] === 1 ? true : false,
            convictedDescribe: res.data[0].ConvictedOrChargedDescription,
            insuranceCanceled: res.data[0].IsInsuranceCanceledOrRefused.data[0] === 1 ? "Yes" : "No",
            ShowInsuranceCanceledDescribe: res.data[0].IsInsuranceCanceledOrRefused.data[0] === 1 ? true : false,
            insuranceCanceledDescribe: res.data[0].InsuranceCanceledOrRefusedDescription,
            damaged: res.data[0].IsVesselHasBeenDamaged.data[0] === 1 ? "Yes" : "No",
            ShowDamagedDescribe: res.data[0].IsVesselHasBeenDamaged.data[0] === 1 ? true : false,
            damagedDescribe: res.data[0].VesselHasBeenDamagedDescription,
            interestedParty: res.data[0].InterestedParty,
            previousInsurer: res.data[0].PreviousInsurer,
            isInsuranceHistoryProofProvided: res.data[0].IsInsuranceHistoryProofProvided.data[0] === 1 ? true : false,
            policyNo: res.data[0].PreviousPolicyNumber,
            memberISA: res.data[0].IsMemberofISA.data[0] === 1 ? true : false,
            affiliatedClub: res.data[0].ISAAffiliatedClubName,
            ISAMembershipNo: res.data[0].ISAMembershipNumber,
            memberIWAI: res.data[0].IsMemberofIWAI.data[0] === 1 ? true : false,
            affiliatedBranch: res.data[0].IWAIAffiliatedBranchName,
            IWAIMembershipNo: res.data[0].IWAIMembershipNumber,
            boatingExperienceYearError: res.data[0].PreviousBoatingExperinceInYears !== '' ? false : true,
            policyNoError: res.data[0].PreviousPolicyNumber !== '' ? false : true,
            previousNCBYearsError: res.data[0].PreviousNCBYears !== '' ? false : true,
            previousNCBAmountError: res.data[0].PreviousNCBAmount !== '' ? false : true,
            lossesErr: false,
            convictedErr: false,
            insuranceCanceledErr: false,
            damagedErr: false,
          });
        } else {
          console.log("Something Went Wrong");
        }
      }).catch(err => {
        console.log("err...", err);
        toast.error("Something Went Wrong");
      });
    } catch (err) {
      console.log("err...", err);
      toast.error("Something Went Wrong");
    }

  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'previousNCBAmount') {
      if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
        this.setState({ previousNCBAmountError: true });
        this.show("previousNCBAmount", true);
      } else {
        this.setState({ previousNCBAmountError: false, previousNCBAmount: e.target.value });
        this.show("previousNCBAmount", false);
      }
    }

    if (e.target.name === 'lossesDescribe') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ lossesDescribeError: true });
        this.show("lossesDescribe", true);
      } else {
        this.setState({ lossesDescribeError: false, lossesDescribe: e.target.value });
        this.show("lossesDescribe", false);
      }
    }

    if (e.target.name === 'convictedDescribe') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ convictedDescribeError: true });
        this.show("convictedDescribe", true);
      } else {
        this.setState({ convictedDescribeError: false, convictedDescribe: e.target.value });
        this.show("convictedDescribe", false);
      }
    }

    if (e.target.name === 'insuranceCanceledDescribe') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ insuranceCanceledDescribeError: true });
        this.show("insuranceCanceledDescribe", true);
      } else {
        this.setState({ insuranceCanceledDescribeError: false, insuranceCanceledDescribe: e.target.value });
        this.show("insuranceCanceledDescribe", false);
      }
    }

    if (e.target.name === 'damagedDescribe') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ damagedDescribeError: true });
        this.show("damagedDescribe", true);
      } else {
        this.setState({ damagedDescribeError: false, damagedDescribe: e.target.value });
        this.show("damagedDescribe", false);
      }
    }

    if (e.target.name === 'interestedParty') {
      if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
        this.setState({ interestedPartiesError: true });
        this.show("interestedParty", true);
      } else {
        this.setState({ interestedPartiesError: false, interestedParty: e.target.value });
        this.show("interestedParty", false);
      }
    }

    if (e.target.name === 'policyNo') {
      if (!CommonConfig.RegExp.alphaNumeric.test(e.target.value)) {
        this.setState({ policyNoError: true });
        this.show("policyNo", true);
      } else {
        this.setState({ policyNoError: false, policyNo: e.target.value });
        this.show("policyNo", false);
      }
    }

    if (e.target.name === 'memberISA') {
      if (!this.state.memberISA == false) {
        this.setState({
          affiliatedClub: '',
          ISAMembershipNo: ''
        });
      }
      this.setState({
        memberISA: !this.state.memberISA,
        affiliatedClubError: !this.state.affiliatedClubError,
        ISAMembershipNoError: !this.state.ISAMembershipNoError,
      });
    }

    if (e.target.name === 'affiliatedClub') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ affiliatedClubError: true });
        this.show("affiliatedClub", true);
      } else {
        this.setState({ affiliatedClubError: false, affiliatedClub: e.target.value });
        this.show("affiliatedClub", false);
      }
    }

    if (e.target.name === 'ISAMembershipNo') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ ISAMembershipNoError: true });
        this.show("ISAMembershipNo", true);
      } else {
        this.setState({ ISAMembershipNoError: false, ISAMembershipNo: e.target.value });
        this.show("ISAMembershipNo", false);
      }
    }

    if (e.target.name === 'memberIWAI') {
      if (!this.state.memberIWAI == false) {
        this.setState({
          affiliatedBranch: '',
          IWAIMembershipNo: ''
        });
      }
      this.setState({
        memberIWAI: !this.state.memberIWAI,
        affiliatedBranchError: !this.state.affiliatedBranchError,
        IWAIMembershipNoError: !this.state.IWAIMembershipNoError,
      });
    }

    if (e.target.name === 'affiliatedBranch') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ affiliatedBranchError: true });
        this.show("affiliatedBranch", true);
      } else {
        this.setState({ affiliatedBranchError: false, affiliatedBranch: e.target.value });
        this.show("affiliatedBranch", false);
      }
    }

    if (e.target.name === 'IWAIMembershipNo') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ IWAIMembershipNoError: true });
        this.show("IWAIMembershipNo", true);
      } else {
        this.setState({ IWAIMembershipNoError: false, IWAIMembershipNo: e.target.value });
        this.show("IWAIMembershipNo", false);
      }
    }

    if (e.target.name === 'isGeneralQuestionProofProvided') {
      this.setState({
        isGeneralQuestionProofProvided: !this.state.isGeneralQuestionProofProvided,
      });
    }

    if (e.target.name === 'isInsuranceHistoryProofProvided') {
      this.setState({
        isInsuranceHistoryProofProvided: !this.state.isInsuranceHistoryProofProvided,
      });
    }

  }

  selectType(value, type) {

    if (type === 'boatingExperienceYear') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ boatingExperienceYearError: true, boatingExperienceYear: value });
        this.show('boatingExperienceYear', true);
      } else {
        this.setState({ boatingExperienceYearError: false, boatingExperienceYear: value });
        this.show('boatingExperienceYear', false);
      }
    }

    if (type === 'boatingQualifications') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ boatingQualificationsError: true, boatingQualifications: value });
        this.show('boatingQualifications', true);
      } else {
        this.setState({ boatingQualificationsError: false, boatingQualifications: value });
        this.show('boatingQualifications', false);
      }
    }

    if (type === 'previousInsurer') {
      this.setState({ previousInsurer: value });
    }

    if (type === 'losses') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ losses: value, showLossesDescribe: false, lossesErr: true, lossesDescribe: '' });
        this.show('losses', true);
      } else {
        if (value === "Yes") {
          this.setState({ showLossesDescribe: true });
          this.setState({ lossesDescribeError: true, losses: value, lossesErr: false });
        } else {
          this.setState({ showLossesDescribe: false, lossesDescribe: '' });
          this.setState({ lossesDescribeError: false, losses: value, lossesErr: false });
        }
        this.show('losses', false);
      }
    }

    if (type === 'convicted') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ convicted: value, ShowConvictedDescribe: false, convictedErr: true, convictedDescribe: '' });
        this.show('convicted', true);
      } else {
        if (value === "Yes") {
          this.setState({ ShowConvictedDescribe: true });
          this.setState({ convictedDescribeError: true, convicted: value, convictedErr: false });
        } else {
          this.setState({ ShowConvictedDescribe: false, convictedDescribe: '' });
          this.setState({ convictedDescribeError: false, convicted: value, convictedErr: false });
        }
        this.show('convicted', false);
      }
    }

    if (type === 'insuranceCanceled') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ insuranceCanceled: value, ShowInsuranceCanceledDescribe: false, insuranceCanceledErr: true, insuranceCanceledDescribe: '' });
        this.show('insuranceCanceled', true);
      } else {
        if (value === "Yes") {
          this.setState({ ShowInsuranceCanceledDescribe: true });
          this.setState({ insuranceCanceledDescribeError: true, insuranceCanceled: value, insuranceCanceledErr: false });
        } else {
          this.setState({ ShowInsuranceCanceledDescribe: false, insuranceCanceledDescribe: '' });
          this.setState({ insuranceCanceledDescribeError: false, insuranceCanceled: value, insuranceCanceledErr: false });
        }
        this.show('insuranceCanceled', false);
      }
    }

    if (type === 'damaged') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ damaged: value, ShowDamagedDescribe: false, damagedErr: true, damagedDescribe: '' });
        this.show('damaged', true);
      } else {
        if (value === "Yes") {
          this.setState({ ShowDamagedDescribe: true });
          this.setState({ damagedDescribeError: true, damaged: value, damagedErr: false });
        } else {
          this.setState({ ShowDamagedDescribe: false, damagedDescribe: '' });
          this.setState({ damagedDescribeError: false, damaged: value, damagedErr: false });
        }
        this.show('damaged', false);
      }
    }

    if (type === 'previousNCBYears') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ previousNCBYearsError: true, previousNCBYears: value });
        this.show('previousNCBYears', true);
      } else {
        this.setState({ previousNCBYearsError: false, previousNCBYears: value });
        this.show('previousNCBYears', false);
      }
    }
  }

  changePreviousInsurer(value) {
    if (CommonConfig.isEmpty(value)) {
      this.setState({ previousInsurerError: true, previousInsurer: value });
      this.show('previousInsurer', true, 'previousInsurerError', 'Please select previous insurer');
    } else {
      this.setState({ previousInsurerError: false, previousInsurer: value });
      this.show('previousInsurer', false, 'previousInsurerError', '');
      let results = this.state.previousInsurerList.filter((previousInsurerData) => {
        var previousInsurerName = previousInsurerData.StringMapName;
        return previousInsurerName == value;
      });
    }
  }

  suggestPreviousInsurer(event) {
    let results = this.state.previousInsurerList.filter((previousInsurerData) => {
      var previousInsurerName = previousInsurerData.StringMapName;
      return previousInsurerName.toLowerCase().startsWith(event.query.toLowerCase());
    });
    var previousInsurerResult = [];
    results.forEach(res => {
      previousInsurerResult.push(res.StringMapName);
    });
    this.setState({ previousInsurerSuggestions: previousInsurerResult });
  }

  show(field, condition) {
    if (condition) {
      if (document.getElementById(field) !== null) {
        document.getElementById(field).className = "form-control is-invalid";
      }
    } else {
      if (document.getElementById(field) !== null) {
        document.getElementById(field).className = "form-control";
      }
    }
  }

  editPolicyGeneral() {
    this.setState({ isEdit: true });
  }

  back() {
    this.setState({ isEdit: false });
  }

  goBack() {
    // this.props.history.push('/PolicyDetails');
    this.getGeneralPolicy();
    this.setState({ isEdit: false });
  }

  validate = () => {
    var errorCount = 0;

    if (this.state.boatingExperienceYearError === true) {
      errorCount += 1;
      this.show('boatingExperienceYear', true);
    }

    if (this.state.lossesErr === true) {
      errorCount += 1;
      this.show('losses', true);
    }

    if (this.state.lossesDescribeError === true) {
      errorCount += 1;
      this.show('lossesDescribe', true);
      toast.error("Please enter description for losses in last 5 years.");
    }

    if (this.state.convictedErr === true) {
      errorCount += 1;
      this.show('convicted', true);
    }

    if (this.state.convictedDescribeError === true) {
      errorCount += 1;
      this.show('convictedDescribe', true);
      toast.error("Please enter description for Convicted or Charged.");
    }

    if (this.state.insuranceCanceledErr === true) {
      errorCount += 1;
      this.show('insuranceCanceled', true);
    }

    if (this.state.insuranceCanceledDescribeError === true) {
      errorCount += 1;
      this.show('insuranceCanceledDescribe', true);
      toast.error("Please enter description for Insurance cancelled or refused.");
    }

    if (this.state.damagedErr === true) {
      errorCount += 1;
      this.show('damaged', true);
    }

    if (this.state.damagedDescribeError === true) {
      errorCount += 1;
      this.show('damagedDescribe', true);
      toast.error("Please enter description for Has the vessel ever been damaged.");
    }

    if (errorCount === 0) {
      return true;
    } else {
      return false;
    }
  }

  ValidateAndAddBoatingQualification = () => {
    if (CommonConfig.isEmpty(this.state.boatingQualifications) || this.state.boatingQualificationsError) {
      this.setState({ boatingQualificationsError: true });
      this.show('boatingQualifications', true);
    } else {
      let arr1 = this.state.boatingQualificationsArr;
      let arr2 = this.boatingQualificationListCopy;
      let arr3 = this.state.boatingQualificationList;

      let index = arr2.findIndex(x => x.StringMapKey === this.state.boatingQualifications);
      let index1 = arr3.findIndex(x => x.StringMapKey === this.state.boatingQualifications);
      let bqindex = arr1.findIndex(x => x.BoatingQualification === this.state.boatingQualifications);

      if (bqindex === -1) {
        let boatingQuaData = {
          PolicyBoatingQualificationId: '',
          PolicyId: this.props.match.params.id,
          Status: arr2[index].Status,
          BoatingQualification: arr2[index].StringMapId,
          BoatingQualificationName: arr2[index].StringMapKey,
          LanguageId: arr2[index].LanguageId
        }
        arr1.push(boatingQuaData);
        arr3.splice(index1, 1);
      }

      // else {
      //   BoatingQualificationsArray[bqindex].Status = "Active";
      // }

      this.setState({
        boatingQualificationsArr: arr1,
        boatingQualificationList: arr3,
        boatingQualifications: ''
      });
    }
  }

  openModal() {
    this.setState({ toggleModal: !this.state.toggleModal });
  }

  delete = (data) => {
    this.setState({ tempData: data, deleteItemName: data.BoatingQualificationName });
    this.openModal();
  }

  toggleLarge = () => {
    this.setState({ toggleModal: false, tempData: '' });
  }

  deleteBoatingQualification = () => {
    let arr1 = this.state.boatingQualificationsArr;
    let arr2 = this.boatingQualificationListCopy;
    let arr3 = this.state.boatingQualificationList;
    let selectedRecord = this.state.tempData;

    // let index = arr1.findIndex(x => x.PolicyBoatingQualificationId === selectedRecord.PolicyBoatingQualificationId);
    let index = arr1.findIndex(x => x.BoatingQualification === selectedRecord.BoatingQualification);
    if (index > -1) {
      arr1.splice(index, 1);
    }

    let index1 = arr2.findIndex(x => x.StringMapId === selectedRecord.BoatingQualification);
    if (index1 > -1) {
      arr3.push(arr2[index1]);
    }

    this.setState({
      boatingQualificationsArr: arr1,
      boatingQualificationList: arr3,
      tempData: {},
      toggleModal: false
    })
  }

  Save = () => {
    if (this.validate()) {
      let data = {
        PolicyId: this.props.match.params.id,
        PolicyGeneralId: this.state.policyGeneralId,
        PreviousBoatingExperinceInYears: this.state.boatingExperienceYear,
        IsGeneralQuestionProofProvided: this.state.isGeneralQuestionProofProvided === true ? 1 : 0,
        PreviousNCBYears: this.state.previousNCBYears,
        PreviousNCBAmount: this.state.previousNCBAmount,
        boatingQualificationsArr: this.state.boatingQualificationsArr,
        BoatingQualificationsCount: this.state.boatingQualificationsArr.length,
        IsLossesInLastFiveYears: this.state.losses === "Yes" ? 1 : 0,
        LossesInLastFiveYearsDescription: CommonConfig.isEmpty(this.state.lossesDescribe) ? '' : this.state.lossesDescribe.trim(),
        IsConvictedOrCharged: this.state.convicted === "Yes" ? 1 : 0,
        ConvictedOrChargedDescription: CommonConfig.isEmpty(this.state.convictedDescribe) ? '' : this.state.convictedDescribe.trim(),
        IsInsuranceCanceledOrRefused: this.state.insuranceCanceled === "Yes" ? 1 : 0,
        InsuranceCanceledOrRefusedDescription: CommonConfig.isEmpty(this.state.insuranceCanceledDescribe) ? '' : this.state.insuranceCanceledDescribe.trim(),
        IsVesselHasBeenDamaged: this.state.damaged === "Yes" ? 1 : 0,
        VesselHasBeenDamagedDescription: CommonConfig.isEmpty(this.state.insuranceCanceleddamagedDescribeDescribe) ? '' : this.state.damagedDescribe.trim(),
        InterestedParty: this.state.interestedParty,
        IsInsuranceHistoryProofProvided: this.state.isInsuranceHistoryProofProvided,
        PreviousInsurer: this.state.previousInsurer,
        PreviousPolicyNumber: this.state.policyNo,
        IsMemberofISA: this.state.memberISA === true ? 1 : 0,
        ISAAffiliatedClubName: CommonConfig.isEmpty(this.state.affiliatedClub) ? '' : this.state.affiliatedClub.trim(),
        ISAMembershipNumber: this.state.ISAMembershipNo,
        IsMemberofIWAI: this.state.memberIWAI === true ? 1 : 0,
        IWAIAffiliatedBranchName: CommonConfig.isEmpty(this.state.affiliatedBranch) ? '' : this.state.affiliatedBranch.trim(),
        IWAIMembershipNumber: this.state.IWAIMembershipNo,
        Status: "Active",
        SortOrder: '1',
        LanguageId: 'en-GB',
      };
      console.log("Save", data);
      api.post('api/AddgeneralPolicy', data).then(res => {
        if (res.success) {
          var firstRes = res;
          let secondData = {
            policyId: this.props.match.params.id,
            CurrentUser: CommonConfig.loggedInUserId(),
          }
          api.post('api/isPolicyReferred', secondData).then(res => {
            if (res.success) {
              let fourthData = {
                policyId: this.props.match.params.id,
                IsRenewal: 0,
                CurrentUser: CommonConfig.loggedInUserId()
              }

              api.post('api/recomputePremium', fourthData).then(res => {
                debugger

                if (res.success) {
                  if (CommonConfig.isEmpty(res.data.returnValue)) {
                    toast.success(firstRes.message);
                    this.setState({ isEdit: false });
                    setTimeout(function () {
                      window.location.reload();
                    }, 1000);
                  }
                  else {
                    toast.error("There was an error while calculating the premium. " + res.data.returnValue);
                  }
                } else {
                  console.log('error');

                }
              }).catch(err => {

              });
            }
          }).catch(err => {
            console.log("error", err);
          });
        } else {
          toast.error("Something Went Wrong");
        }
      }).catch(err => {
        console.log("Something Went Wrong", err);
      });
    } else {
      if (this.state.boatingExperienceYearError === true) {
        this.show('boatingExperienceYear', true);
        toast.error("Please enter boating Experience Year.");
      }

      if (this.state.lossesErr === true) {
        this.show('losses', true);
        toast.error("Please select losses in last 5 years.");
      }

      if (this.state.convictedErr === true) {
        this.show('convicted', true);
        toast.error("Please select Convicted or Charged.");
      }

      if (this.state.insuranceCanceledErr === true) {
        this.show('insuranceCanceled', true);
        toast.error("Please select Insurance cancelled or refused.");
      }

      if (this.state.damagedErr === true) {
        this.show('damaged', true);
        toast.error("Please select Has the vessel ever been damaged.");
      }
      // toast.error("Something Went Wrong");
    }
  }

  toggleAll = (toggleType) => {
    if (toggleType === 'expand') {
      this.setState({
        showGeneralQuestions: true,
        showInsuranceHistory: true,
        showSchemes: true,
        isExpand: true
      });
    } else {
      this.setState({
        showGeneralQuestions: false,
        showInsuranceHistory: false,
        showSchemes: false,
        isExpand: false
      });
    }
  }

  render() {
    const { t } = this.props;
    const SaveButton = t("buttons.Save");
    const CancelButton = t("buttons.Cancel");
    const BackButton = t("buttons.BackToPolicy");
    const AddButton = t("buttons.Add");
    const DeleteButton = t("buttons.Delete");

    return (
      <div>
        <Row>
          <Col md="12">
            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
              ? (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                onClick={(this.state.isEdit) ? () => this.back() : () => this.editPolicyGeneral()}
              >
                <i className={(this.state.isEdit) ? "fa fa-eye" : "fa fa-pencil"}></i>
              </BTN>)
              : (null)}

            <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
              onClick={(this.state.isExpand) ? () => this.toggleAll('collapse') : () => this.toggleAll('expand')}
            >
              <i className={(this.state.isExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
            </BTN>
          </Col>
        </Row>

        <div className="input-box" id="generalQuestions">
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showGeneralQuestions: !this.state.showGeneralQuestions, showInsuranceHistory: false, showSchemes: false })} aria-expanded={this.state.showGeneralQuestions} aria-controls="collapseOne">
                <h5 className="m-0 p-0">
                  {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                  {t("policyGeneral:generalQuestions#")}
                  <i style={{ float: 'right' }} className={this.state.showGeneralQuestions ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                </h5>
              </BTN>
            </CardHeader>

            <Collapse isOpen={this.state.showGeneralQuestions} data-parent="#generalQuestions" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                {(this.state.isEdit) ? (
                  <div>
                    <Row>
                      <Col md="6">
                        <div className="input-box">
                          <label>{t("policyGeneral:previousBoatingExperience.label")}*</label>
                          <Input type="select" style={{ width: "36%" }} name="boatingExperienceYear" id="boatingExperienceYear" onChange={(e) => this.selectType(e.target.value, 'boatingExperienceYear')} value={this.state.boatingExperienceYear}>
                            <option value=''>{t("policyGeneral:previousBoatingExperience.defaultValue")}</option>
                            {this.state.previousBoatingExperienceList.map((ct, i) => {
                              return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >{t("policyGeneral:previousBoatingExperience.error")}</em>
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="input-box">
                          <Input type="checkbox" name="isGeneralQuestionProofProvided" id="isGeneralQuestionProofProvided" value={this.state.isGeneralQuestionProofProvided} checked={this.state.isGeneralQuestionProofProvided} onChange={(e) => this.handleChange(e)}>
                          </Input>
                          <label>{t("policyGeneral:generalProofProvided")}</label>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4">
                        <div className="input-box row">
                          <Col md="10">
                            <label>{t("policyGeneral:boatingQualifications.label")}</label>
                            <Input type="select" style={{ width: "100%", display: "inline-block" }} name="boatingQualifications" id="boatingQualifications" onChange={(e) => this.selectType(e.target.value, 'boatingQualifications')} value={this.state.boatingQualifications}>
                              <option value=''>{t("policyGeneral:boatingQualifications.defaultValue")}</option>
                              {this.state.boatingQualificationList.map((ct, i) => {
                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                              })}
                            </Input>
                            <em className="error invalid-feedback" >{t("policyGeneral:boatingQualifications.error")}</em>
                          </Col>
                          <Col md="2">
                            <label>&nbsp;</label>
                            <BTN title={AddButton} style={{ marginLeft: "10px" }} color="primary" onClick={() => this.ValidateAndAddBoatingQualification()}>
                              <i className="fa fa-plus"></i>
                            </BTN>
                          </Col>
                        </div>
                      </Col>

                      <Col md="5">
                        <table className="added-detail-table" style={{ marginTop: "10px" }}>
                          <tbody>
                            {this.state.boatingQualificationsArr.map((bqa, i) => {
                              return bqa.Status === "Active" ? (
                                <tr key={i}>
                                  <td>{(bqa.BoatingQualificationName)}</td>
                                  <td>
                                    <span>
                                      <BTN title={DeleteButton} onClick={() => this.delete(bqa)} style={{ marginLeft: 5 }} color="danger">
                                        <i className="fa fa-trash"></i>
                                      </BTN>
                                    </span>
                                  </td>
                                </tr>
                              ) : null
                            })}
                          </tbody>
                        </table>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="3">
                        <div className="input-box">
                          <label>{t("policyGeneral:lossesinlast5years.label")}*</label>
                          <Input type="select" name="losses" id="losses" onChange={(e) => this.selectType(e.target.value, 'losses')} value={this.state.losses}>
                            <option value=''>Select losses</option>
                            {this.state.Options.map((ct, i) => {
                              return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >{t("policyGeneral:lossesinlast5years.lossesError")}</em>
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("policyGeneral:convictedorCharged.label")}*</label>
                          <Input type="select" name="convicted" id="convicted" onChange={(e) => this.selectType(e.target.value, 'convicted')} value={this.state.convicted}>
                            <option value=''>Select convicted</option>
                            {this.state.Options.map((ct, i) => {
                              return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >{t("policyGeneral:convictedorCharged.convictedError")}</em>
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("policyGeneral:insuranceCanceledorRefused.label")}*</label>
                          <Input type="select" name="insuranceCanceled" id="insuranceCanceled" onChange={(e) => this.selectType(e.target.value, 'insuranceCanceled')} value={this.state.insuranceCanceled}>
                            <option value=''>Select insurance canceled</option>
                            {this.state.Options.map((ct, i) => {
                              return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >{t("policyGeneral:insuranceCanceledorRefused.insuranceCanceledorRefusedError")}</em>
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("policyGeneral:vesselDamaged.label")}*</label>
                          <Input type="select" name="damaged" id="damaged" onChange={(e) => this.selectType(e.target.value, 'damaged')} value={this.state.damaged}>
                            <option value=''>Select damaged</option>
                            {this.state.Options.map((ct, i) => {
                              return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >{t("policyGeneral:vesselDamaged.vesselDamagedError")}</em>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="3">
                        {(this.state.showLossesDescribe) ? (
                          <div className="input-box">
                            <label>{t("policyGeneral:lossesinlast5years.describe")}</label>
                            <InputTextarea placeholder={t("policyGeneral:lossesinlast5years.describePlaceholder")} rows={1} cols={25} autoResize={true} name="lossesDescribe" id="lossesDescribe" onChange={(e) => this.handleChange(e)} value={this.state.lossesDescribe}>
                            </InputTextarea>
                          </div>
                        ) : (null)}
                      </Col>

                      <Col md="3">
                        {(this.state.ShowConvictedDescribe) ? (
                          <div className='input-box'>
                            <label>{t("policyGeneral:convictedorCharged.describe")}</label>
                            <InputTextarea placeholder={t("policyGeneral:convictedorCharged.describePlaceholder")} rows={1} cols={25} autoResize={true} name="convictedDescribe" id="convictedDescribe" onChange={(e) => this.handleChange(e)} value={this.state.convictedDescribe}>
                            </InputTextarea>
                          </div>
                        ) : (null)}
                      </Col>

                      <Col md="3">
                        {(this.state.ShowInsuranceCanceledDescribe) ? (
                          <div className='input-box'>
                            <label>{t("policyGeneral:insuranceCanceledorRefused.describe")}</label>
                            <InputTextarea placeholder={t("policyGeneral:insuranceCanceledorRefused.describePlaceholder")} rows={1} cols={25} autoResize={true} name="insuranceCanceledDescribe" id="insuranceCanceledDescribe" onChange={(e) => this.handleChange(e)} value={this.state.insuranceCanceledDescribe}>
                            </InputTextarea>
                          </div>
                        ) : (null)}
                      </Col>

                      <Col md="3">
                        {(this.state.ShowDamagedDescribe) ? (
                          <div className='input-box'>
                            <label>{t("policyGeneral:vesselDamaged.describe")}</label>
                            <InputTextarea placeholder={t("policyGeneral:vesselDamaged.describePlaceholder")} rows={1} cols={25} autoResize={true} name="damagedDescribe" id="damagedDescribe" onChange={(e) => this.handleChange(e)} value={this.state.damagedDescribe}>
                            </InputTextarea>
                          </div>
                        ) : (null)}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className='input-box'>
                          <label>Interested Parties</label>
                          <InputTextarea style={{ width: "100%" }} placeholder="Interested Parties" cols={25} autoResize={true} name="interestedParty" id="interestedParty" onChange={(e) => this.handleChange(e)} value={this.state.interestedParty} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                    <div>
                      <Row>
                        <Col md="4">
                          <div className="policy-box">
                            <p>{t("policyGeneral:previousBoatingExperience.label")} :</p>
                            <span>{this.state.boatingExperienceYear}</span>
                          </div>
                        </Col>

                        <Col md="4">
                          <div className="policy-box">
                            <p>{t("policyGeneral:generalProofProvided")} :</p>
                            <span>{this.state.isGeneralQuestionProofProvided ? 'Yes' : 'No'}</span>
                          </div>
                        </Col>

                        <Col md="4">
                          <div className='policy-box'>
                            <p>{t("policyGeneral:lossesinlast5years.label")}</p>
                            <span>{this.state.losses}</span>
                          </div>
                        </Col>

                        {(this.state.showLossesDescribe) ?
                          (<Col md="4">
                            <div className='input-box'>
                              <label>{t("policyGeneral:lossesinlast5years.describe")}</label>
                              <span>{this.state.lossesDescribe}</span>
                            </div>
                          </Col>) : null
                        }
                      </Row>

                      <Row>
                        <Col md="4">
                          <div className='policy-box'>
                            <p>{t("policyGeneral:convictedorCharged.label")}</p>
                            <span>{this.state.convicted}</span>
                          </div>
                        </Col>
                        {(this.state.ShowConvictedDescribe) ?
                          (<Col md="4">
                            <div className='policy-box'>
                              <p>{t("policyGeneral:convictedorCharged.describe")}</p>
                              <span>{this.state.convictedDescribe}</span>
                            </div>
                          </Col>) : null
                        }
                        <Col md="4">
                          <div className='policy-box'>
                            <p>{t("policyGeneral:insuranceCanceledorRefused.label")}*</p>
                            <span>{this.state.insuranceCanceled}</span>
                          </div>
                        </Col>
                        {(this.state.ShowInsuranceCanceledDescribe) ?
                          (<Col md="4">
                            <div className='policy-box'>
                              <p>{t("policyGeneral:insuranceCanceledorRefused.describe")}</p>
                              <span>{this.state.insuranceCanceledDescribe}</span>
                            </div>
                          </Col>) : null
                        }
                        <Col md="4">
                          <div className='policy-box'>
                            <p>{t("policyGeneral:vesselDamaged.label")}*</p>
                            <span>{this.state.damaged}</span>
                          </div>
                        </Col>

                        {(this.state.ShowDamagedDescribe) ?
                          (<Col md="4">
                            <div className='policy-box'>
                              <p>{t("policyGeneral:vesselDamaged.describe")}</p>
                              <span>{this.state.damagedDescribe}</span>
                            </div>
                          </Col>) : null
                        }
                      </Row>

                      <Row>
                        <Col md="12">
                          <div className='policy-box'>
                            <p>Interested Party</p>
                            <span>{this.state.interestedParty}</span>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="5">
                          <table className="added-detail-table" style={{ marginTop: "10px" }}>
                            <tbody>
                              {this.state.boatingQualificationsArr.map((bqa, i) => {
                                return bqa.Status === "Active" ? (
                                  <tr key={i}>
                                    <td>{(bqa.BoatingQualificationName)}</td>
                                  </tr>
                                ) : null
                              })}
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </div>
                  )}
              </CardBody>
            </Collapse>
          </Card>
        </div>

        <div className="input-box" id="insuranceHistory">
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showInsuranceHistory: !this.state.showInsuranceHistory, showGeneralQuestions: false, showSchemes: false })} aria-expanded={this.state.showInsuranceHistory} aria-controls="collapseOne">
                <h5 className="m-0 p-0">
                  {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                  {t("policyGeneral:insuranceHistory#")}
                  <i style={{ float: 'right' }} className={this.state.showInsuranceHistory ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                </h5>
              </BTN>
            </CardHeader>

            <Collapse isOpen={this.state.showInsuranceHistory} data-parent="#insuranceHistory" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                {(this.state.isEdit) ? (
                  <Row>
                    <Col md="4">
                      <div className="input-box">
                        <label>{t("policyGeneral:previousInsurer.label")}</label>

                        <AutoComplete placeholder="Previous Insurer Name" value={this.state.previousInsurer} id='previousInsurer' onChange={(e) => this.setState({ previousInsurer: e.value },
                          this.changePreviousInsurer(e.value))} suggestions={this.state.previousInsurerSuggestions} completeMethod={this.suggestPreviousInsurer.bind(this)} />
                        <em id="previousInsurerError" className="error invalid-feedback" >{t("policyGeneral:previousInsurer.error")}</em>

                        {/* <Input type="select" name="previousInsurer" id="previousInsurer" onChange={(e) => this.selectType(e.target.value, 'previousInsurer')} value={this.state.previousInsurer}>
                          <option value=''>{t("policyGeneral:previousInsurer.defaultValue")}</option>
                          {this.state.previousInsurerList.map((ct, i) => {
                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                          })}
                        </Input>
                        <em className="error invalid-feedback" >{t("policyGeneral:previousInsurer.error")}</em> */}
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="input-box">
                        <label>{t("policyGeneral:policyNo.label")}</label>
                        <Input type="text" placeholder={t("policyGeneral:policyNo.label")} name="policyNo" id="policyNo" onChange={(e) => this.handleChange(e)} value={this.state.policyNo}></Input>
                        <em className="error invalid-feedback" >{t("policyGeneral:policyNo.error")}</em>
                      </div>
                    </Col>

                    <Col md="5">
                      <div className="input-box">
                        <Input type="checkbox" name="isInsuranceHistoryProofProvided" id="isInsuranceHistoryProofProvided" value={this.state.isInsuranceHistoryProofProvided} checked={this.state.isInsuranceHistoryProofProvided} onChange={(e) => this.handleChange(e)}></Input>
                        <label>{t("policyGeneral:insuranceHistoryProofProvided")}</label>
                      </div>
                    </Col>

                    < Col md="6" >
                      <Row>
                        <Col md="3">
                          <div className="input-box">
                            <label>{t("policyGeneral:previousNCB.label")}</label>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="5">
                          <div className="input-box">
                            <label>{t("policyGeneral:previousNCB.noofYears")}</label>
                            <Input type="select" name="previousNCBYears" id="previousNCBYears" onChange={(e) => this.selectType(e.target.value, 'previousNCBYears')} value={this.state.previousNCBYears}>
                              <option value=''>{t("policyGeneral:previousNCB.noofYearsDefaultValue")}</option>
                              {this.state.previousNCBNoofYearsList.map((ct, i) => {
                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                              })}
                            </Input>
                            <em className="error invalid-feedback" >{t("policyGeneral:previousNCB.noofYearsError")}</em>
                          </div>
                        </Col>

                        <Col md="4">
                          <div className="input-box">
                            <label>{t("policyGeneral:previousNCB.NCBAmount")}</label>
                            <Input type="text" placeholder={t("policyGeneral:previousNCB.NCBAmountPlaceholder")} name="previousNCBAmount" id="previousNCBAmount" onChange={(e) => this.handleChange(e)} value={this.state.previousNCBAmount}>
                            </Input>
                            <em className="error invalid-feedback" >{t("policyGeneral:previousNCB.NCBAmountError")}</em>
                          </div>
                        </Col>
                      </Row>
                    </Col >
                  </Row>
                ) : (
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <div className="policy-box">
                              <p>{t("policyGeneral:previousInsurer.label")} : {this.state.previousInsurer}</p>
                              <span></span>
                            </div>
                          </Col>

                          <Col>
                            <div className="policy-box">
                              <p>{t("policyGeneral:policyNo.label")} : {this.state.policyNo}</p>
                              <span></span>
                            </div>
                          </Col>

                          <Col>
                            <div className="policy-box">
                              <p>{t("policyGeneral:previousInsurer.label")} : {this.state.isInsuranceHistoryProofProvided ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</p>
                              <span></span>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="policy-box">
                              <p>Previous NCB No of Years : {this.state.previousNCBYears}</p>
                              <span></span>
                            </div>
                          </Col>

                          <Col>
                            <div className="policy-box">
                              <p>Previous NCB Amount : {<i className={this.props.CurrencySymbol}></i>} {this.state.previousNCBAmount}</p>
                              <span></span>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )}
              </CardBody>
            </Collapse>
          </Card>
        </div>

        <div className="input-box" id="schemes">
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showSchemes: !this.state.showSchemes, showGeneralQuestions: false, showInsuranceHistory: false })} aria-expanded={this.state.showSchemes} aria-controls="collapseOne">
                <h5 className="m-0 p-0">
                  {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                  {t("policyGeneral:schemes#")}
                  <i style={{ float: 'right' }} className={this.state.showSchemes ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                </h5>
              </BTN>
            </CardHeader>

            <Collapse isOpen={this.state.showSchemes} data-parent="#schemes" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                <div className="input-box">
                  <Row>
                    <Col md="3">
                      <label>{t("policyGeneral:ISA.label")}</label>
                    </Col>

                    {(this.state.isEdit) ? (
                      <Col md="2" style={{ padding: "0px" }}>
                        <div>
                          <Input type="checkbox" checked={this.state.memberISA === true ? "checked" : ""} name="memberISA" id="memberISA" value={this.state.memberISA} onChange={(e) => this.handleChange(e)}>
                          </Input>
                          {(this.state.memberISA) ? (
                            <label>{t("policyGeneral:ISA.affiliatedClub")}</label>
                          ) : (
                              null
                            )}
                        </div>
                      </Col>
                    ) : (
                        <Col md="2" style={{ padding: "0px" }}>
                          <div>
                            <label style={{ marginRight: "10px", marginLeft: "-31px" }}>{this.state.memberISA == true ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</label>
                            {(this.state.memberISA) ? (
                              <label>{t("policyGeneral:ISA.affiliatedClub")}</label>
                            ) : (
                                null
                              )}
                          </div>
                        </Col>
                      )}

                    <Col md="3">
                      {(this.state.isEdit) ? (
                        <div>
                          {(this.state.memberISA) ? (
                            <Input type="text" placeholder={t("policyGeneral:ISA.affiliatedClub")} name="affiliatedClub" id="affiliatedClub" onChange={(e) => this.handleChange(e)} value={this.state.affiliatedClub}>
                            </Input>
                          ) : (
                              null
                            )}
                          <em className="error invalid-feedback" >{t("policyGeneral:ISA.affiliatedClubError")}</em>
                        </div>
                      ) : (
                          <div>
                            {(this.state.memberISA) ? (
                              <label>{this.state.affiliatedClub}</label>
                            ) : (
                                null
                              )}
                          </div>
                        )}
                    </Col>

                    <Col md="2">
                      {(this.state.memberISA) ? (
                        <label>{t("policyGeneral:ISA.membershipNo")}</label>
                      ) : (
                          null
                        )}
                    </Col>

                    <Col md="2">
                      {(this.state.isEdit) ? (
                        <div>
                          {(this.state.memberISA) ? (
                            <Input type="text" placeholder={t("policyGeneral:ISA.membershipNo")} name="ISAMembershipNo" id="ISAMembershipNo" onChange={(e) => this.handleChange(e)} value={this.state.ISAMembershipNo}>
                            </Input>
                          ) : (
                              null
                            )}
                          <em className="error invalid-feedback" >{t("policyGeneral:ISA.membershipNoError")}</em>
                        </div>
                      ) : (
                          <div>
                            {(this.state.memberISA) ? (
                              <label>{this.state.ISAMembershipNo}</label>
                            ) : (
                                null
                              )}
                          </div>
                        )}
                    </Col>
                  </Row>
                </div>

                <div className="input-box">
                  <Row>
                    <Col md="3">
                      <label>{t("policyGeneral:IWAI.label")}</label>
                    </Col>

                    {(this.state.isEdit) ? (
                      <Col md="2" style={{ padding: "0px" }}>
                        <div>
                          <Input type="checkbox" name="memberIWAI" id="memberIWAI" checked={this.state.memberIWAI == true ? "checked" : ""} value={this.state.memberIWAI} onChange={(e) => this.handleChange(e)} >
                          </Input>
                          {(this.state.memberIWAI) ? (
                            <label>{t("policyGeneral:IWAI.affiliatedBranch")}</label>
                          ) : (
                              null
                            )}
                        </div>
                      </Col>
                    ) : (
                        <Col md="2" style={{ padding: "0px" }}>
                          <div>
                            <label style={{ marginRight: "10px", marginLeft: "-31px" }}>{this.state.memberIWAI == true ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</label>
                            {(this.state.memberIWAI) ? (
                              <label>{t("policyGeneral:IWAI.affiliatedBranch")}</label>
                            ) : (
                                null
                              )}
                          </div>
                        </Col>
                      )}

                    <Col md="3">
                      {(this.state.isEdit) ? (
                        <div>
                          {(this.state.memberIWAI) ? (
                            <Input type="text" placeholder={t("policyGeneral:IWAI.affiliatedBranch")} name="affiliatedBranch" id="affiliatedBranch" onChange={(e) => this.handleChange(e)} value={this.state.affiliatedBranch}>
                            </Input>
                          ) : (
                              null
                            )}
                          <em className="error invalid-feedback" >{t("policyGeneral:IWAI.affiliatedBranchError")}</em>
                        </div>
                      ) : (
                          <div>
                            {(this.state.memberIWAI) ? (
                              <label>{this.state.affiliatedBranch}</label>
                            ) : (
                                null
                              )}
                          </div>
                        )}
                    </Col>

                    <Col md="2">
                      {(this.state.memberIWAI) ? (
                        <label>{t("policyGeneral:IWAI.membershipNo")}</label>
                      ) : (
                          null
                        )}
                    </Col>

                    <Col md="2">
                      {(this.state.isEdit) ? (
                        <div>
                          {(this.state.memberIWAI) ? (
                            <Input type="text" placeholder={t("policyGeneral:IWAI.membershipNo")} name="IWAIMembershipNo" id="IWAIMembershipNo" onChange={(e) => this.handleChange(e)} value={this.state.IWAIMembershipNo}>
                            </Input>
                          ) : (
                              null
                            )}
                          <em className="error invalid-feedback" >{t("policyGeneral:IWAI.membershipNoError")}</em>
                        </div>
                      ) : (
                          <div>
                            {(this.state.memberIWAI) ? (
                              <label>{this.state.IWAIMembershipNo}</label>
                            ) : (
                                null
                              )}
                          </div>
                        )}
                    </Col>
                  </Row>
                </div>

              </CardBody>
            </Collapse>
          </Card>
        </div>

        <Row>
          {(this.state.isEdit) ? (
            <Col md="5" style={{ margin: "auto" }}>
              <BTN color="primary" onClick={() => this.goBack()}>
                <i style={{ marginRight: "10px" }} className="fa fa-angle-left"></i>
                {BackButton}
              </BTN>

              <BTN style={{ marginLeft: "10px" }} color="success" onClick={() => this.Save()}>
                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                {SaveButton}
              </BTN>

              <BTN style={{ marginLeft: "10px" }} color="primary" onClick={() => this.goBack()}>
                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                {CancelButton}
              </BTN>
            </Col>
          ) : (
              <div></div>
            )}
        </Row>

        <Modal isOpen={this.state.toggleModal} toggle={() => this.toggleLarge()}>
          <ModalHeader toggle={() => this.toggleLarge()}>
            Delete Boating Qualification
          </ModalHeader>

          <ModalBody>
            Are you sure you want to Delete <b>{this.state.deleteItemName}</b> Boating Qualification?
          </ModalBody>

          <ModalFooter>
            <BTN style={{ marginLeft: "10px" }} color="danger" onClick={() => this.deleteBoatingQualification(this.state.tempData)}>
              <i style={{ marginRight: "10px" }} className="fa fa-trash"></i>
              {DeleteButton}
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

export default withTranslation()(PolicyGeneral);