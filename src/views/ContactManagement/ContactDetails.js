import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import DatePicker from 'react-date-picker';
import {
  Button, Col, Container, Form, Input, InputGroupAddon, InputGroupText, Row, InputGroup,
  Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody, PopoverHeader
} from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { AutoComplete } from 'primereact/autocomplete';
import { withTranslation } from 'react-i18next';

import api from '../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../utils/constants';
import { apiBase } from '../../utils/config';
import { postalCodes } from '../../utils/postalCodes';

const userDefaultImg = require('../../assets/img/defaultProfile.png');

class ContactDetails extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      personid: '',
      organizationid: '',
      securityuserid: '',
      selectedLanguage: props.i18n.language,

      radioSelected: 'oktocontact',
      isEdit: false,

      contactcode: 0,
      changedContactCode: '',
      contactCodeLabel: 'Edit Contact Code',
      isContactCodeEdit: false,
      contactCodeError: false,

      contactType: [],
      selectedContactType: 'Client',
      selectedContactName: '',

      companyArray: [
        { label: 'Individual', value: 'Individual', image: 'icon-user' },
        { label: 'Company', value: 'Company', image: 'fa fa-building' }
      ],
      isCompany: 'Individual',

      genderArray: [
        { label: 'Male', value: 'Male', image: 'fa fa-male' },
        { label: 'Female', value: 'Female', image: 'fa fa-female' }
      ],
      gender: '',

      userImg: '',
      userImgData: '',

      companyname: '',
      comapnynameError: true,

      title: '',
      titleArray: [],
      titleError: true,
      forename: '',
      forenameError: true,
      surname: '',
      surnameError: true,
      salutation: '',
      salutationError: true,

      passportno: '',
      passportnoError: true,
      countryArray: [],
      countryArrayCopy: [],
      countryCodeArray: [],
      filteredCountriesSingle: null,
      country: '',
      countryShown: '',
      countryError: true,

      companyIdentifier: '',
      companyIdentifierError: true,

      businesstype: '',
      businesstypeShown: '',
      businessTypeError: true,
      BusinessArray: [],
      filteredBusinessSingle: null,
      dob: '',
      dobError: true,

      addressid: '',
      addrCountry: '',
      addrCountryShown: '',
      filteredAddressCountriesSingle: null,
      addrCountryError: true,
      addrline1: '',
      addrline1Error: true,
      addrline2: '',
      addrline2Error: false,
      addrline3: '',
      addrline3Error: false,
      city: '',
      cityShown: '',
      filteredCitySingle: null,
      cityError: true,
      cityArray: [],
      state: '',
      stateShown: '',
      filteredStateSingle: null,
      stateError: true,
      stateArray: [],
      stateArrayCopy: [],
      postalcode: '',
      postalcodeError: true,

      phoneList: [],
      primaryPhone: '',
      visiblePhoneModal: false,
      phoneTypes: [],
      isEditPhone: false,
      phoneID: 0,
      phoneModalTitle: 'Add Phone',
      phonetype: 'Business',
      phoneTypeError: false,
      phoneAreaCode: '',
      phoneAreaCodeError: false,
      phoneNumber: '',
      phoneNumberError: true,
      countrycode: '',
      countryflag: '',
      selectedCountry: '',
      countrycodeError: true,
      landLineLabel: 'EnterLandLine',
      landLineSelected: false,
      extensionLabel: 'Enter Ext',
      extSelected: false,
      ext: '',
      extError: false,

      emailList: [],
      primaryEmail: '',
      visibleEmailmodal: false,
      emailTypes: [],
      isEditEmail: false,
      emailID: 0,
      emailModalTitle: 'Add Email',
      emailtype: 'Work',
      emailTypeError: false,
      email: '',
      emailError: true,

      contactModes: [],
      contactModesList: [],

      docdeliverySelected: '',
      docDelivery: [],

      note: '',
      noteError: false,

      bankcode: '',
      bankcodeError: false,

      commission: '',
      commissionError: false,

      CommissionPayable: 'New Business',
      CommissionPayableError: false,
      CommissionPayables: [],
      
      binder: '',
      binderArray: [],

      allowLogin: 'no',

      username: '',
      usernameError: false,
      password: '',
      passwordError: false,
      isShowPassword: false,
      confirmPassword: '',
      confirmPasswordError: false,
      isShowConfirmPassword: false,
      case1: false,
      case2: false,
      case3: false,
      case4: false,
      case5: false,
      case6: true,
      showRules: false,

      securityQuestionArray: [],
      selectedSecurityQuestions: [],
      que1: '',
      ans1: '',
      isShowAns1: false,
      securityquestionid1: '',
      ans1Error: true,
      que2: '',
      ans2: '',
      isShowAns2: false,
      securityquestionid2: '',
      ans2Error: true,
      que3: '',
      ans3: '',
      isShowAns3: false,
      securityquestionid3: '',
      ans3Error: true,

      varifyAuthority: '',

      isDeletePhone: false,
      isDeleteEmail: false,
      valueForDelete: '',

      showPolicyModal: false,
      resID: '',

      isInternalStaff: false,


      newuser: 'no'
    };
  }

  componentDidMount() {
    let el = document.getElementsByTagName('body');
    el[0].classList.remove('modal-open');

    this.getContactTypes();
    this.getTitle();
      this.getCountry();
    this.getEmailType("EMAILTYPE");
    this.getCOMMISSIONPAYABLE("COMMISSIONPAYABLE");
    this.getPhoneType();
    this.getBusinessTypes();
    // this.getDropDownValues('BUSINESSTYPE', 'BusinessArray', 'StringMapKey');
    this.getContactModes();
    this.getBinder();
    this.getSecurityQuestions();
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.getContactDetails(this.props.match.params.id, this.props.match.params.entityType);
    } else {
      this.getContactCode();
    }
  }

  getContactDetails(id, entityType) {

    try {
      let data = {
        id: id,
        entityType: entityType,
        languageId: this.props.i18n.language //this.state.selectedLanguage
      }
      api.post('api/getContactDetailsByTypeAndID', data).then(res => {
        console.log("dfsgsrfg", res);
        if (res.success) {
          var phones = [];
          var emails = [];
          var contactModes = this.state.contactModesList;
          var profileImage;

          let sortedPhoneData = res.data.phoneData.sort((x, y) => {
            return y.IsPreferred.data[0] - x.IsPreferred.data[0]
          });

          let sortedEmailData = res.data.emailData.sort((x, y) => {
            return y.IsPreferred.data[0] - x.IsPreferred.data[0]
          });

          for (let i = 0; i < sortedPhoneData.length; i++) {
            phones.push({
              id: i,
              phoneid: sortedPhoneData[i].PhoneId,
              phonetype: sortedPhoneData[i].PhoneType,
              areacode: sortedPhoneData[i].AreaCode,
              countrycode: sortedPhoneData[i].CountryCode,
              phonenumber: sortedPhoneData[i].PhoneNumber,
              ext: sortedPhoneData[i].Ext,
              ispreferred: (sortedPhoneData[i].IsPreferred.data[0] === 1) ? true : false,
              isDeleted: false
            });
          }

          for (let j = 0; j < sortedEmailData.length; j++) {
            emails.push({
              id: j,
              emailid: sortedEmailData[j].EmailId,
              emailtype: sortedEmailData[j].EmailType,
              email: sortedEmailData[j].Email,
              ispreferred: (sortedEmailData[j].IsPreferred.data[0] === 1) ? true : false,
              isDeleted: false
            });
          }

            for(let a = 0; a < contactModes.length; a++){
              for (let k = 0; k < res.data.contactModes.length; k++) {
              if(res.data.contactModes[k].contactmodename == contactModes[a].StringMapName){
                contactModes[a].ContactModeId= res.data.contactModes[k].ContactModeId;
                contactModes[a].StringMapId= res.data.contactModes[k].ContactModeType;
                contactModes[a].StringMapKey= res.data.contactModes[k].ContactModeType;
                contactModes[a].StringMapName= res.data.contactModes[k].contactmodename;
                contactModes[a].isSelected=(res.data.contactModes[k].Status === 'Active') ? true : false;
              }
            }
          }

          // if (res.data.personData[0].SecurityUserId && res.data.personData[0].SecurityUserId !== undefined && res.data.personData[0].SecurityUserId !== null && res.data.personData[0].SecurityUserId !== '') {

          //   this.setState({
          //     allowLogin: 'yes',
          //     username: res.data.personData[0].LoginId,
          //     password: res.data.personData[0].Password,
          //     case1: true,
          //     case2: true,
          //     case3: true,
          //     case4: true,
          //     case5: true,
          //     case6: true
          //   });
          //   console.log(res.data.questionData.length());

          //   if(res.data.questionData.length() != 0){
          //     this.setState({
          //       securityquestionid1: res.data.questionData[0].UserSecurityQuestionId,
          //       securityquestionid2: res.data.questionData[1].UserSecurityQuestionId,
          //       securityquestionid3: res.data.questionData[2].UserSecurityQuestionId,
          //       que1: res.data.questionData[0].Question,
          //       que2: res.data.questionData[1].Question,
          //       que3: res.data.questionData[2].Question,
          //       ans1: res.data.questionData[0].Answer,
          //       ans2: res.data.questionData[1].Answer,
          //       ans3: res.data.questionData[2].Answer
          //     });
          //   }
          //   // for(let k = 0; k < res.data.questionData.length; k++){

          //   // }
          // }

          if (res.data.personData[0].PicturePath !== '' && res.data.personData[0].PicturePath !== undefined && res.data.personData[0].PicturePath !== null) {
            profileImage = apiBase + res.data.personData[0].PicturePath;
          }

          if (!CommonConfig.isEmpty(res.data.addressData[0].Country)) {
            this.getStates(res.data.addressData[0].Country);
          }

          if (!CommonConfig.isEmpty(res.data.addressData[0].State)) {
            this.getCity(res.data.addressData[0].State);
          }

          if (entityType.toString().toLowerCase() === 'person') {
            this.setState({
              isEdit: true,
              personid: res.data.personData[0].PersonId,
              contactcode: res.data.personData[0].ContactCode,
              selectedContactType: res.data.personData[0].ContactType,
              selectedContactName: res.data.personData[0].contactTypeName,
              commission: res.data.personData[0].CommissionRate,
              bankcode: res.data.personData[0].CentralBankCode,
              isInternalStaff: (res.data.personData[0].ContactType == "InternalStaff") ? true : false,
              isCompany: 'Individual',
              userImg: profileImage,
              companyname: res.data.personData[0].CompanyName,
              comapnynameError: (res.data.personData[0].CompanyName !== undefined && res.data.personData[0].CompanyName !== null) ? false : true,
              title: res.data.personData[0].Title,
              titleError: (res.data.personData[0].Title !== undefined && res.data.personData[0].Title !== null) ? false : true,
              forename: res.data.personData[0].Forename,
              forenameError: (res.data.personData[0].Forename !== undefined && res.data.personData[0].Forename !== null) ? false : true,
              surname: res.data.personData[0].Surname,
              surnameError: (res.data.personData[0].Surname !== undefined && res.data.personData[0].Surname !== null) ? false : true,
              salutation: res.data.personData[0].Salutation,
              salutationError: (res.data.personData[0].Salutation !== undefined && res.data.personData[0].Salutation !== null) ? false : true,
              gender: res.data.personData[0].Gender,
              passportno: res.data.personData[0].PassportNumber,
              passportnoError: (res.data.personData[0].PassportNumber !== undefined && res.data.personData[0].PassportNumber !== null) ? false : true,
              // country: res.data.personData[0].PassportCountry,
              // countryShown: (res.data.personData[0].passportcountryName !== undefined && res.data.personData[0].passportcountryName !== null && res.data.personData[0].passportcountryName !== '') ? res.data.personData[0].passportcountryName : '',
              country: { label: res.data.personData[0].passportcountryName, value: res.data.personData[0].PassportCountry },
              countryError: (res.data.personData[0].PassportCountry !== undefined && res.data.personData[0].PassportCountry !== null) ? false : true,
              dob: CommonConfig.isEmpty(res.data.personData[0].DOB)||res.data.personData[0].DOB=='0000-00-00'|| res.data.personData[0].DOB == "Invalid date" ?'':moment(res.data.personData[0].DOB).format('YYYY-MM-DD'), //new Date(res.data.personData[0].DOB), //
              dobError: (res.data.personData[0].DOB !== undefined && res.data.personData[0].DOB !== null) ? false : true,
              businesstype: res.data.personData[0].BusinessType,
              // businesstypeShown: (res.data.personData[0].businesstypeName !== undefined && res.data.personData[0].businesstypeName !== null && res.data.personData[0].businesstypeName !== '') ? res.data.personData[0].businesstypeName : '',
              // businesstype: { label: res.data.personData[0].businesstypeName, value: res.data.personData[0].BusinessType },
              businessTypeError: (res.data.personData[0].BusinessType !== undefined && res.data.personData[0].BusinessType !== null) ? false : true,
              addressid: res.data.addressData[0].Addressid,
              // addrCountry: res.data.addressData[0].Country,
              // addrCountryShown: (res.data.addressData[0].countryname !== undefined && res.data.addressData[0].countryname !== null && res.data.addressData[0].countryname !== '') ? res.data.addressData[0].countryname : '',
              addrCountry: { label: res.data.addressData[0].countryname, value: res.data.addressData[0].Country },
              addrCountryError: (CommonConfig.isEmpty(res.data.addressData[0].Country)) ? true : false,
              addrline1: res.data.addressData[0].AddrLine1,
              addrline1Error: (res.data.addressData[0].AddrLine1 !== undefined && res.data.addressData[0].AddrLine1 !== null) ? false : true,
              addrline2: res.data.addressData[0].AddrLine2,
              addrline3: res.data.addressData[0].AddrLine3,
              state: res.data.addressData[0].State,
              stateShown: (res.data.addressData[0].statename !== undefined && res.data.addressData[0].statename !== null && res.data.addressData[0].statename !== '') ? res.data.addressData[0].statename : '',
              stateError: (res.data.addressData[0].State !== undefined && res.data.addressData[0].State !== null) ? false : true,
              city: res.data.addressData[0].City,
              cityShown: res.data.addressData[0].City,
              cityError: (res.data.addressData[0].City !== undefined && res.data.addressData[0].City !== null) ? false : true,
              postalcode: res.data.addressData[0].PostalCode,
              postalcodeError: (res.data.addressData[0].PostalCode !== undefined && res.data.addressData[0].PostalCode !== null) ? false : true,
              
              phoneList: phones,
              emailList: emails,
              radioSelected: (res.data.personData[0].IsOkToContact.data[0] === 1) ? 'oktocontact' : 'donotcontact',
              contactModes: contactModes,
              docdeliverySelected: res.data.personData[0].DocumentDelivery,
              note: res.data.personData[0].Note,
              CommissionPayable: res.data.personData[0].CommissionPayableOn,
              allowLogin: (res.data.personData[0].SecurityUserId !== undefined && res.data.personData[0].SecurityUserId !== null && res.data.personData[0].SecurityUserId !== '') ? 'yes' : 'no',
              securityuserid: (res.data.personData[0].SecurityUserId !== undefined && res.data.personData[0].SecurityUserId !== null) ? res.data.personData[0].SecurityUserId : ''
            });
          } else if (entityType.toString().toLowerCase() === 'organization') {
         
            this.setState({
              isEdit: true,
              organizationid: res.data.personData[0].OrganizationId,
              contactcode: res.data.personData[0].ContactCode,
              selectedContactType: res.data.personData[0].ContactType,
              selectedContactName: res.data.personData[0].contactTypeName,
              isCompany: 'Company',
              commission: res.data.personData[0].CommissionRate,
              userImg: profileImage,
              CommissionPayable: res.data.personData[0].CommissionPayableOn,
              companyIdentifier: res.data.personData[0].CompanyIdentifier,
              companyIdentifierError: CommonConfig.isEmpty(res.data.personData[0].CompanyIdentifier) ? true : false,
              companyname: res.data.personData[0].OrganizationName,
              comapnynameError: (res.data.personData[0].OrganizationName !== undefined && res.data.personData[0].OrganizationName !== null) ? false : true,
              businesstype: res.data.personData[0].BusinessType,
              // businesstypeShown: (res.data.personData[0].businesstypeName !== undefined && res.data.personData[0].businesstypeName !== null && res.data.personData[0].businesstypeName !== '') ? res.data.personData[0].businesstypeName : '',
              //businesstype: { label: res.data.personData[0].businesstypeName, value: res.data.personData[0].BusinessType },
              businessTypeError: (res.data.personData[0].BusinessType !== undefined && res.data.personData[0].BusinessType !== null) ? false : true,
              addressid: res.data.addressData[0].Addressid,
              // addrCountry: res.data.addressData[0].Country,
              // addrCountryShown: (res.data.addressData[0].countryname !== undefined && res.data.addressData[0].countryname !== null && res.data.addressData[0].countryname !== '') ? res.data.addressData[0].countryname : '',
              addrCountry: { label: res.data.addressData[0].countryname, value: res.data.addressData[0].Country },
              addrCountryError: (res.data.addressData[0].Country !== null && res.data.addressData[0].Country !== undefined) ? false : true,
              addrline1: res.data.addressData[0].AddrLine1,
              addrline1Error: (res.data.addressData[0].AddrLine1 !== undefined && res.data.addressData[0].AddrLine1 !== null) ? false : true,
              addrline2: res.data.addressData[0].AddrLine2,
              addrline3: res.data.addressData[0].AddrLine3,
              state: res.data.addressData[0].State,
              stateShown: (res.data.addressData[0].statename !== undefined && res.data.addressData[0].statename !== null && res.data.addressData[0].statename !== '') ? res.data.addressData[0].statename : '',
              stateError: (res.data.addressData[0].State !== undefined && res.data.addressData[0].State !== null) ? false : true,
              city: res.data.addressData[0].City,
              cityShown: res.data.addressData[0].City,
              cityError: (res.data.addressData[0].City !== undefined && res.data.addressData[0].City !== null) ? false : true,
              postalcode: res.data.addressData[0].PostalCode,
              postalcodeError: (res.data.addressData[0].PostalCode !== undefined && res.data.addressData[0].PostalCode !== null) ? false : true,
              phoneList: phones,
              emailList: emails,
              radioSelected: (res.data.personData[0].IsOkToContact.data[0] === 1) ? 'oktocontact' : 'donotcontact',
              contactModes: contactModes,
              docdeliverySelected: res.data.personData[0].DocumentDelivery,
              note: res.data.personData[0].Note,
              allowLogin: (res.data.personData[0].SecurityUserId !== undefined && res.data.personData[0].SecurityUserId !== null && res.data.personData[0].SecurityUserId !== '') ? 'yes' : 'no',
              securityuserid: (res.data.personData[0].SecurityUserId !== undefined && res.data.personData[0].SecurityUserId !== null) ? res.data.personData[0].SecurityUserId : '',
              // companyname: res.data.personData[0].CompanyName?res.data.personData[0].CompanyName:'',
              // comapnynameError: false,
              title: res.data.personData[0].Title?res.data.personData[0].Title:'',
              titleError: false,
              forename: res.data.personData[0].Forename?res.data.personData[0].Forename:'',
              forenameError: false,
              surname: res.data.personData[0].Surname?res.data.personData[0].Surname:'',
              surnameError: false,
              salutation: res.data.personData[0].Salutation?res.data.personData[0].Salutation:'',
              salutationError: false,
              gender: res.data.personData[0].Gender?res.data.personData[0].Gender:'',
              passportno: res.data.personData[0].PassportNumber?res.data.personData[0].PassportNumber:'',
              passportnoError: false,
              dob: CommonConfig.isEmpty(res.data.personData[0].DOB)||res.data.personData[0].DOB=='0000-00-00'|| res.data.personData[0].DOB == "Invalid date" ?'':moment(res.data.personData[0].DOB).format('YYYY-MM-DD'), 
              dobError: false,
              country: { label: res.data.personData[0].passportcountryName, value: res.data.personData[0].PassportCountry },
              countryError: (res.data.personData[0].PassportCountry !== undefined && res.data.personData[0].PassportCountry !== null) ? false : true,
            })
          } else {

          }
          if (this.state.selectedContactType == 'SubAgent' || this.state.selectedContactType == 'ServiceCenter') {
            // this.getEmailType("EMAILTYPEAGENT");
            this.getEmailType("BROKERMAILTYPE");
          } else {
            this.getEmailType("EMAILTYPE");
          }
        } else {
          console.log("error in get data");
        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  getContactCode() {
    try {
      api.get('api/generateContactCode').then(res => {
        if (res.success) {
          this.setState({ contactcode: Number(res.data.ContactCode) + 1 });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getContactTypes() {
    try {
      const data = {
        stringmaptype: 'CONTACTTYPE',
        // orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ contactType: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getTitle() {
    try {
      const data = {
        stringmaptype: 'TITLE',
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ titleArray: res.data });
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

  getCOMMISSIONPAYABLE(type) {
    try {
      const data = {
        stringmaptype: type,
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ CommissionPayables: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getEmailType(type) {
    try {
      const data = {
        stringmaptype: type,
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage,
        ContactType:this.state.selectedContactType
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ emailTypes: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getPhoneType() {
    try {
      const data = {
        stringmaptype: 'PHONETYPE',
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ phoneTypes: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getCity(state) {
    try {
      let selectedState = this.state.stateArrayCopy.find(x => x.StringMapKey === state);
      const data = {
        parent_id: selectedState.StringMapId,
        // orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ cityArray: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getStates(country) {
    try {
      let selectedCountry = this.state.countryArrayCopy.find(x => x.StringMapKey === country);

      const data = {
        parent_id: selectedCountry.StringMapId,
        // orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ stateArray: res.data, stateArrayCopy: res.data, city: '' });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
    // this.getCity();
  }

  // getBusinessTypes() {
  //   try {
  //     api.get('api/getBusinessTypes').then(res => {
  //       if (res.success) {
  //         let formatArr = [];
  //         for (let i = 0; i < res.data.length; i++) {
  //           formatArr.push({ label: res.data[i].label, value: res.data[i].label });
  //         }
  //         this.setState({ BusinessArray: formatArr });
  //       }
  //     }).catch(err => {

  //     });
  //   } catch (err) {

  //   }
  // }

  getBusinessTypes(stringMapType, setStateName, sortorder) {
    try {
      const data = {
        stringmaptype: 'BUSINESSTYPE',
        orderby: 'StringMapKey'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          let formatArr = [];
          for (let i = 0; i < res.data.length; i++) {
            formatArr.push({ label: res.data[i].StringMapName, value: res.data[i].StringMapKey });
          }
          this.setState({ BusinessArray: formatArr });

        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  getContactModes() {
    try {
      const data = {
        stringmaptype: 'CONTACTMODE',
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var formattedArray = [];
          for (let i = 0; i < res.data.length; i++) {
            formattedArray.push({
              ContactModeId: '', StringMapId: res.data[i].StringMapId,
              StringMapName: res.data[i].StringMapName, StringMapKey: res.data[i].StringMapKey, isSelected: false
            });
          }
          // this.setState({ contactModes: res.data });
          this.setState({ contactModes: formattedArray });
          this.setState({ contactModesList: formattedArray });
          
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  getBinder() {

  }

  getSecurityQuestions() {
    try {
      const data = {
        stringmaptype: 'SECURITYQUESTION',
        orderby: 'SortOrder',
        languageid: this.state.selectedLanguage
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          // var Questions = [];
          // res.data.map((ques, i) => {
          //   Questions.push({label: ques.stringmapname, })
          // })
          this.setState({ securityQuestionArray: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("err", error);
    }
  }

  toggle(type) {
    const { t } = this.props;
    if (type === 'landline') {
      if (this.state.landLineSelected) {
        this.setState({ landLineLabel: 'EnterLandLine' });
      } else {
        this.setState({ landLineLabel: 'HideLandLine' });
      }
      this.setState({ landLineSelected: !this.state.landLineSelected, phoneAreaCode: '', phoneAreaCodeError: false });
      // this.show('phoneAreaCode', false);
    } else if (type === 'ext') {
      if (this.state.extSelected) {
        this.setState({ extensionLabel: t('contactDetails:EnterExt') });
      } else {
        this.setState({ extensionLabel: t('contactDetails:HideExt') });
      }
      this.setState({ extSelected: !this.state.extSelected, ext: '', extError: false });
      // this.show("ext", false);
    } else if (type === 'password') {
      this.setState({ isShowPassword: !this.state.isShowPassword });
    } else if (type === 'confirmPassword') {
      this.setState({ isShowConfirmPassword: !this.state.isShowConfirmPassword });
    } else if (type === 'contactcode') {
      this.setState({ isContactCodeEdit: !this.state.isContactCodeEdit, contactCodeError: false, changedContactCode: this.state.contactcode });
    } else if (type === 'ans1') {
      this.setState({ isShowAns1: !this.state.isShowAns1 });
    } else if (type === 'ans2') {
      this.setState({ isShowAns2: !this.state.isShowAns2 });
    } else if (type === 'ans3') {
      this.setState({ isShowAns3: !this.state.isShowAns3 });
    } else if (type === 'rules') {
      this.setState({ showRules: !this.state.showRules });
    } else if (type === 'dob') {
      document.getElementById('dob').click();
    }
  }

  onRadioBtnClick(radioType, radioSelected) {
    if (radioType === 'contactPreference') {
      if (radioSelected === 'donotcontact') {
        let arr = this.state.contactModes;
        arr.forEach(val => {
          val.isSelected = false;
        });
        this.setState({ contactModes: arr });
      }
      this.setState({ radioSelected: radioSelected });
    } else if (radioType === 'docdelivery') {
      // if(radioSelected === 'both'){
      //   var docArray = [{label: 'email', value: 'email'}, {label: 'post', value: 'post'}];
      //   this.setState({ docDelivery: docArray });
      // }else{
      //   var docArray = [{label: radioSelected, value: radioSelected}];
      // this.setState({ docDelivery: docArray });
      // }
      this.setState({ docdeliverySelected: radioSelected });
    } else if (radioType === 'allowLogin') {
      this.setState({ allowLogin: radioSelected });
      if (radioSelected === 'yes' && this.state.emailList.length) {
        var email = this.state.emailList.find(x => x.ispreferred === true);
        this.setState({ username: email.email });
      } else {
        this.setState({ username: '' });
      }
    }
    else if (radioType === 'newuser') {
      this.setState({ newuser: radioSelected });
      if (radioSelected === 'yes' && this.state.emailList.length) {
        var email = this.state.emailList.find(x => x.ispreferred === true);
        this.setState({ username: email.email });
      } else {
        this.setState({ username: '' });
      }
    }
    else if (radioType === 'varifyauthority') {
      this.setState({ varifyAuthority: radioSelected });
    }
  }

  countydata(e) {
    debugger
    this.setState({ stateShown: e.value });
    if (e.value.StringMapKey) {
      this.setState({ state: e.value.StringMapKey });
    }
    else {
      this.setState({ state: e.value });
    }
    this.getCity(e.value);
  }

  selectType(value, type) {
    const { t } = this.props;
    console.log("selectType", value);
    console.log("selectType", type);
    if (type === 'contact') {
      debugger
      this.setState({ selectedContactType: value });
      if (value !== '' && value !== null && value !== undefined) {
        this.show("contacttype", false, "contactTypeError", "");
        // --- code change after database fields changed
        this.setState({ selectedContactName: value });
        if (value === 'InsuranceCompany') {
          this.setState({ isCompany: 'Company', allowLogin: 'no' });
        } else {
          this.setState({ isCompany: 'Individual', allowLogin: 'no' });
        }

        if (value === 'InternalStaff') {
          this.setState({ isInternalStaff: true });
        } else {
          this.setState({ isInternalStaff: false });
        }

        if (value == 'SubAgent' || value == 'ServiceCenter') {
          // this.getEmailType("EMAILTYPEAGENT");
          this.getEmailType("BROKERMAILTYPE");
        } else {
          this.getEmailType("EMAILTYPE");
        }
        // --- code change after database fields changed

        // if (value === 'Surveyor') {
        //   this.setState({ isCompany: 'Individual', allowLogin: 'no' });
        // }
        // let contactType = this.state.contactType.find(x => x.StringMapKey === value);
        // this.setState({ selectedContactName: contactType.StringMapName });
        // if (contactType.StringMapName === 'Insurance Company') {
        //   this.setState({ isCompany: 'Company', allowLogin: 'no' });
        // } else if (contactType.stringmapname === 'Surveyors') {
        //   this.setState({ allowLogin: 'no' });
        // } else {
        //   this.setState({ allowLogin: 'no' });
        // }
      } else {
        this.setState({ selectedContactName: '', allowLogin: 'no' });
        this.show("contacttype", true, "contactTypeError", t("contactDetails:ContactType.error"));
      }
    } else if (type === 'company') {
      this.setState({ comapnynameError: false });
      this.show("companyname", false, "comapnynameError", "");
      if (this.state.selectedContactType === 'InsuranceCompany') {
        this.setState({ isCompany: 'Company' });
      } else if (this.state.selectedContactType === 'InternalStaff') {
        this.setState({ isCompany: 'Individual' });
      } else {
        this.setState({ isCompany: value });
      }
      if (value === 'Company' && this.state.selectedContactType != 'Client') {
        this.setState({ title: '', gender: '', forename: '', surname: '', salutation: '', dob: '' });
      }
    } else if (type === 'title') {
      this.setState({ title: value });
      // let titleName = this.state.titleArray.find(x => x.stringmapid === value);
      if (value === '') {
        this.setState({ gender: '', titleError: true });
        this.show("title", true, "titleError", t("contactDetails:Title.error"));
        // } else if (titleName.stringmapid === 'Mr.') {
      } else if (value === 'Mr.') {
        this.setState({ gender: 'Male', titleError: false });
        this.show("title", false, "titleError", "");
      } else if (value === 'Dr.') {
        this.setState({ gender: '', titleError: false });
        this.show("title", false, "titleError", "");
      } else {
        this.setState({ gender: 'Female', titleError: false });
        this.show("title", false, "titleError", "");
      }
    } else if (type === 'country') {
      this.setState({ country: value });
    } else if (type === 'gender') {
      if (this.state.title === 'Mr.') {
        this.setState({ gender: 'Male' });
      } else if (this.state.title === 'Mrs.' || this.state.title === 'Miss') {
        this.setState({ gender: 'Female' });
      } else {
        this.setState({ gender: value });
      }
    } else if (type === 'phonetype') {
      if (value === '') {
        this.setState({ phoneTypeError: true, phonetype: value });
        this.show("phonetype", true, "phoneTypeError", t("contactDetails:PhoneType.error"));
      } else {
        this.setState({ phonetype: value, phoneTypeError: false });
        this.show("phonetype", false, "phoneTypeError", "");
      }
    } else if (type === 'emailtype') {
      if (value === '') {
        this.setState({ emailTypeError: true, emailtype: value });
        this.show("emailtype", true, "emailTypeError", t("contactDetails:EmailType.error"));
      } else {
        this.setState({ emailtype: value, emailTypeError: false });
        this.show("emailtype", false, "emailTypeError", "");
      }
    } else if (type === 'addrCountry') {
      if (value === '' || value === undefined || value === null) {
        this.setState({
          addrCountry: value, state: '', stateShown: '', cityShown: '', city: '',
          countrycode: '', countrycodeError: true, stateError: true, cityError: true, countryflag: ''
        });
        // this.show('addrCountry', true, "addrCountryError", t("contactDetails:Country.error"));
      } else {
        this.show('addrCountry', false, "addrCountryError", "");
        // let selectedCountry = this.state.countryCodeArray.find(x => x.CountryId === value.value);
        let selectedCountry = this.state.countryCodeArray.find(x => x.CountryName === value.label);
        this.setState({
          addrCountry: value, state: '', stateShown: '', cityShown: '', city: '',
          selectedCountry: (selectedCountry !== undefined) ? selectedCountry.CountryName : '',
          countrycode: (selectedCountry !== undefined) ? selectedCountry.CountryCode : '', countrycodeError: false, stateError: true,
          cityError: true, countryflag: (selectedCountry !== undefined) ? selectedCountry.CountryFlag : ''
        });
        this.getStates(value.value); //get county/provines by country selection
      }
      // let selectedCountry = this.state.countryArray.find(x => x.countryid === value);
      // if (value === '' || value === undefined || value === null) {
      //   this.setState({ addrCountry: value, state: '', city: '', countrycode: '', countrycodeError: true });
      // } else {
      //   this.setState({ addrCountry: value, state: '', city: '', countrycode: selectedCountry.countrycode, countrycodeError: false });
      //   this.getStates(value); //get county/provines by country selection
      // }
    } else if (type === 'addrstate') {
      if (value === '') {
        //
      } else {
        this.setState({ state: value, city: '' });
        this.getCity(value);
      }
    } else if (type === 'addrcity') {
      if (value === '') {
        //
      } else {
        this.setState({ city: value });
      }
    } else if (type === 'countrycode') {
      let selectedCountry = this.state.countryCodeArray.find(x => x.CountryCode === value);
      if (value === '') {
        this.setState({ countrycodeError: true, countrycode: value, countryflag: '', selectedCountry: '' });
        this.show('countrycode', true, "countrycodeError", t("contactDetails:CountryCode.error"));
      } else {
        this.setState({ countrycode: value, countryflag: selectedCountry.CountryFlag, countrycodeError: false, selectedCountry: selectedCountry.CountryName });
        this.show('countrycode', false, "countrycodeError", "");
      }
    } else if (type === 'businesstype') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ businessTypeError: true, businesstype: value });
        // this.show('businesstype', true, "businessTypeError", "Please select");
      } else {
        this.setState({ businesstype: value, businessTypeError: false });
        // this.show('businesstype', false, "businessTypeError", "");
      }
    } else if (type === 'state') {
      this.setState({ state: value });
      this.getCity(value);
    } else if (type === 'city') {
      this.setState({ city: value });
    }

    else if (type === 'CommissionPayable') {
      if (value === '') {
        this.setState({ CommissionPayableError: true, CommissionPayable: value });
        this.show("CommissionPayable", true, "CommissionPayableError", t("contactDetails:CommissionPayable.error"));
      } else {
        this.setState({ CommissionPayable: value, CommissionPayableError: false });
        this.show("CommissionPayable", false, "CommissionPayableError", "");
      }
    }
  }

  chooseFile = () => {
    document.getElementById('profileimage').click();
  }

  selectImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ userImgData: event.target.files[0] });
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ userImg: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  handleChange = (e) => {
    const { t } = this.props;
    // debugger;
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'companyname') {
      if (this.state.isCompany === 'Company' && CommonConfig.isEmpty(e.target.value)) {
        this.setState({ comapnynameError: true });
        this.show("companyname", true, "comapnynameError", t("contactDetails:CompanyName.error_blank"));
      } else if (e.target.value.length > 100) {
        this.setState({ comapnynameError: true, companyname: this.state.companyname });
        this.show("companyname", true, "comapnynameError", t("contactDetails:CompanyName.error_maxLength"));
      } else {
        this.setState({ companyname: e.target.value, comapnynameError: false });
        this.show("companyname", false, "comapnynameError", "");
      }
    }

    if (e.target.name === 'forename') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ forenameError: true });
        this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_blank"));
      } else {
        let nameRegEx = CommonConfig.RegExp.nameWithSpace; // /^[a-zA-Z]+[a-zA-Z-']*$/; // /^[a-zA-Z]+[a-zA-Z-\s']*$/
        let name = e.target.value;
        if (!nameRegEx.test(name)) {
          this.setState({ forenameError: true });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_pattern"));
        } else if (e.target.value.length > 25) {
          this.setState({ forenameError: true });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_maxLength"));
        } else if (e.target.value.length < 3) {
          this.setState({ forenameError: true });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_minLength"));
        } else {
          this.setState({ forenameError: false, forename: e.target.value, salutation: e.target.value, salutationError: false });
          this.show("forename", false, "forenameError", "");
        }
      }
    }

    if (e.target.name === 'surname') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ surnameError: true });
        this.show("surname", true, "surnameError", t("contactDetails:LastName.error_blank"));
      } else {
        let nameRegEx = CommonConfig.RegExp.nameWithSpace; // /^[a-zA-Z]+[a-zA-Z-']*$/;
        let name = e.target.value;
        if (!nameRegEx.test(name)) {
          this.setState({ surnameError: true });
          this.show("surname", true, "surnameError", t("contactDetails:LastName.error_pattern"));
        } else if (e.target.value.length > 25) {
          this.setState({ surnameError: true });
          this.show("surname", true, "surnameError", t("contactDetails:LastName.error_maxLength"));
        } else if (e.target.value.length < 3) {
          this.setState({ surnameError: true });
          this.show("surname", true, "surnameError", t("contactDetails:LastName.error_minLength"));
        } else {
          this.setState({ surnameError: false, surname: e.target.value });
          this.show("surname", false, "surnameError", "");
        }
      }
    }

    if (e.target.name === 'salutation') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ salutationError: true });
        this.show("salutation", true, "salutationError", t("contactDetails:Salutation.error_blank"));
      } else {
        let nameRegEx = CommonConfig.RegExp.nameWithSpace; // /^[a-zA-Z]+[a-zA-Z-'.]*$/;
        let name = e.target.value;
        if (!nameRegEx.test(name)) {
          this.setState({ salutationError: true });
          this.show("salutation", true, "salutationError", t("contactDetails:Salutation.error_pattern"));
          // } else if (e.target.value.length > 5 || e.target.value.length < 2) {
        } else if (e.target.value.length > 100) {
          this.setState({ salutationError: true });
          this.show("salutation", true, "salutationError", t("contactDetails:Salutation.error_blank"));
        } else {
          this.setState({ salutationError: false, salutation: e.target.value });
          this.show("salutation", false, "salutationError", "");
        }
      }
    }

    if (e.target.name === 'passportno') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ passportnoError: true });
        this.show("passportno", false, "passportnoError", "");
        // this.show("passportno", true, "passportnoError", t("contactDetails:PassportNumber.error_blank"));
      } else if (e.target.value.length !== 9) {
        this.setState({ passportnoError: true });
        this.show("passportno", true, "passportnoError", t("contactDetails:PassportNumber.error_pattern"));
      } else {
        // var passportRegEx = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/ig;
        // var passport = e.target.value;
        // if (!passportRegEx.test(passport)) {
        //   this.setState({ passportnoError: true });
        //   this.show("passportno", true, "passportnoError", t("contactDetails:PassportNumber.error_pattern"));
        // } else {
        this.setState({ passportnoError: false, passportno: e.target.value });
        this.show("passportno", false, "passportnoError", "");
        // }
      }
    }

    if (e.target.name === 'companyIdentifier') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ companyIdentifierError: true });
        // this.show("companyIdentifier", true, "companyIdentifierError", t("contactDetails:CompanyIdentifier.error_blank"));
        this.show("companyIdentifier", false, "companyIdentifierError", "");
      } else {
        // if(passportRegEx.test(passport)){
        //   this.setState({ companyIdentifierError: true });
        //   this.show("companyIdentifier", true);
        // }else{
        if (e.target.value.length > 100) {
          this.setState({ companyIdentifierError: true });
          this.show("companyIdentifier", true, "companyIdentifierError", t("contactDetails:CompanyIdentifier.error_maxLength"));
        } else {
          this.setState({ companyIdentifierError: false, companyIdentifier: e.target.value });
          this.show("companyIdentifier", false, "companyIdentifierError", "");
        }
        // }
      }
    }

    if (e.target.name === 'addrline1') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ addrline1Error: true });
        this.show("addrline1", true, "line1Error", t("contactDetails:Line1.error_blank"));
      } else {
        if (e.target.value.length > 150) {
          this.setState({ addrline1Error: true });
          this.show("addrline1", true, "line1Error", t("contactDetails:Line1.error_maxLength"));
        } else {
          this.setState({ addrline1Error: false, addrline1: e.target.value });
          this.show("addrline1", false, "line1Error", "");
        }
      }
    }

    if (e.target.name === 'addrline2') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ addrline2Error: false });
        this.show("addrline2", false, "line2Error", "");
      } else {
        if (e.target.value.length > 150) {
          this.setState({ addrline2Error: true });
          this.show("addrline2", true, "line2Error", t("contactDetails:Line2.error_maxLength"));
        } else {
          this.show("addrline2", false, "line2Error", "");
          this.setState({ addrline2: e.target.value, addrline2Error: false });
        }
      }
    }

    if (e.target.name === 'addrline3') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ addrline3Error: false });
        this.show("addrline3", false, "line3Error", "");
      } else {
        if (e.target.value.length > 150) {
          this.setState({ addrline3Error: true });
          this.show("addrline3", true, "line3Error", t("contactDetails:Line3.error_maxLength"));
        } else {
          this.show("addrline3", false, "line3Error", "");
          this.setState({ addrline3: e.target.value, addrline3Error: false });
        }
      }
    }

    if (e.target.name === 'postalcode') {
      // if (CommonConfig.isEmpty(e.target.value)) {
      //   this.setState({ postalcodeError: true });
      //   this.show("postalcode", true, "postalcodeError", t("contactDetails:PostalCode.error_blank"));
      // } else {
      this.setState({ postalcode: e.target.value, postalcodeError: false });
      this.show("postalcode", false, "postalcodeError", "");
      //--- old code
      // if (this.state.addrCountryShown !== undefined && this.state.addrCountryShown !== '' && this.state.addrCountryShown !== {} && this.state.addrCountryShown !== null) {
      //   let country = postalCodes.find(x => x.Country === this.state.addrCountryShown.stringmapname);
      //   var postalCodeRegEx = country.Regex;
      //   // var postalCodeRegEx = /(?:^[AC-FHKNPRTV-Y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Y]{4}$/;
      //   var postalCodeValue = e.target.value;
      //   if (!postalCodeRegEx.test(postalCodeValue)) {
      //     this.setState({ postalcodeError: true });
      //     this.show("postalcode", true);
      //   } else {
      //     this.setState({ postalcode: e.target.value, postalcodeError: false });
      //     this.show("postalcode", false);
      //   }
      // } else {
      //   this.setState({ postalcodeError: true });
      //   toast.error('Please select country first');
      // }
      //---old code

      if (this.state.addrCountry && this.state.addrCountry.value !== undefined && this.state.addrCountry.value !== '' && this.state.addrCountry !== {} && this.state.addrCountry.value !== null) {
        // let selectedAddrCountry = this.state.countryCodeArray.find(x => x.CountryName === this.state.addrCountry.label);

        // let country = postalCodes.find(x => x.ISO === selectedAddrCountry.CountryShortForm);
        // var postalCodeRegEx = country.Regex;
        // var postalCodeValue = e.target.value;
        // if (!postalCodeRegEx.test(postalCodeValue)) {
        //   this.setState({ postalcodeError: true });
        //   this.show("postalcode", true, "postalcodeError", t("contactDetails:PostalCode.error_blank"));
        // } else {
        this.setState({ postalcode: e.target.value, postalcodeError: false });
        this.show("postalcode", false, "postalcodeError", "");
        // }
      } else {
        this.setState({ postalcodeError: true });
        toast.error('Please select country first');
      }
      // }
    }

    if (e.target.name === 'phoneAreaCode') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ phoneAreaCodeError: false });
        this.show("phoneAreaCode", false, "areaCodeError", "");
      } else {
        let numberRegEx = CommonConfig.RegExp.number; // /^[0-9]+$/;
        let areaCode = e.target.value;
        if (e.target.value.length > 5) {
          this.setState({ phoneAreaCodeError: true });
          this.show("phoneAreaCode", true, "areaCodeError", t("contactDetails:AreaCode.error_blank"));
        } else if (!numberRegEx.test(areaCode)) {
          this.setState({ phoneAreaCodeError: true, phoneAreaCode: this.state.phoneAreaCode });
          this.show("phoneAreaCode", true, "areaCodeError", t("contactDetails:AreaCode.error_blank"));
        } else {
          this.setState({ phoneAreaCode: e.target.value, phoneAreaCodeError: false });
          this.show("phoneAreaCode", false, "areaCodeError", "");
        }
      }
    }

    if (e.target.name === 'phoneNumber') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ phoneNumberError: true });
        this.show("phoneNumber", true, "phoneNumberError", t("contactDetails:Phone.error_blank"));
      } else {
        let numberRegEx = CommonConfig.RegExp.number; // /^[0-9]+$/;
        let phone = e.target.value;
        if (!numberRegEx.test(phone)) {
          this.setState({ phoneNumberError: true, phoneNumber: this.state.phoneNumber });
          this.show("phoneNumber", true, "phoneNumberError", t("contactDetails:Phone.error_pattern"));
        } else if (e.target.value.length < 6) {
          this.setState({ phoneNumberError: true });
          this.show("phoneNumber", true, "phoneNumberError", t("contactDetails:Phone.error_minLength"));
        } else if (e.target.value.length > 15) {
          this.setState({ phoneNumberError: true });
          this.show("phoneNumber", true, "phoneNumberError", t("contactDetails:Phone.error_maxLength"));
        } else {
          this.setState({ phoneNumber: e.target.value, phoneNumberError: false });
          this.show("phoneNumber", false, "phoneNumberError", "");
        }
      }
    }

    if (e.target.name === 'email') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ emailError: true });
        this.show("email", true, "emailError", t("contactDetails:Email.error_blank"));
      } else {
        var emailRegEx = CommonConfig.RegExp.email; // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegEx.test(e.target.value)) {
          this.setState({ emailError: true });
          this.show("email", true, "emailError", t("contactDetails:Email.error_blank"));
        } else {
          this.setState({ email: e.target.value, emailError: false });
          this.show("email", false, "emailError", "");
        }
      }
    }

    if (e.target.name === 'note') {
      if (CommonConfig.isEmpty(e.target.value)) {
        // this.setState({ noteError: true });
        // this.show("note", true);
      } else {
        this.setState({ note: e.target.value, noteError: false });
        // this.show("note", false);
      }
    }

    if (e.target.name === 'bankcode') {
      if (CommonConfig.isEmpty(e.target.value)) {
        // this.setState({ bankcodeError: true });
        // this.show("bankcode", true);
      } else {
        this.setState({ bankcode: e.target.value, bankcodeError: false });
        this.show("bankcode", false, "bankcodeError", "");
      }
    }

    if (e.target.name === 'commission') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ commissionError: true });
        this.show("commission", true, "commissionError", t("contactDetails:CommossionRate.error_blank"));
      } else {
        let numberRegEx = CommonConfig.RegExp.decimalWithOne; // /^[0-9]+$/;
        let commossion = e.target.value;
        if (!numberRegEx.test(commossion)) {
          this.setState({ commissionError: true });
          this.show("commission", true, "commissionError", t("contactDetails:CommossionRate.error_pattern"));
        } else
          if (commossion > 100) {
            this.setState({ commissionError: true });
            this.show("commission", true, "commissionError", t("contactDetails:CommossionRate.error_pattern"));
          } else {
            this.setState({ commission: e.target.value, commissionError: false });
            this.show("commission", false, "commissionError", "");
          }
      }
    }

    if (e.target.name === 'ans1') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ ans1Error: true });
        this.show("ans1", true, "ans1Error", t("contactDetails:Answer1.error_blank"));
      } else {
        this.setState({ ans1Error: false, ans1: e.target.value });
        this.show("ans1", false, "ans1Error", "");
      }
    }

    if (e.target.name === 'ans2') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ ans2Error: true });
        this.show("ans2", true, "ans2Error", t("contactDetails:Answer2.error_blank"));
      } else {
        this.setState({ ans2Error: false, ans2: e.target.value });
        this.show("ans2", false, "ans2Error", "");
      }
    }

    if (e.target.name === 'ans3') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ ans3Error: true });
        this.show("ans3", true, "ans3Error", t("contactDetails:Answer3.error_blank"));
      } else {
        this.setState({ ans3Error: false, ans3: e.target.value });
        this.show("ans3", false, "ans3Error", "");
      }
    }

    if (e.target.name === 'ext') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ ext: e.target.value, extError: false });
        this.show("ext", false);
      } else {
        var numberRegEx = /^[0-9]+$/;
        let ext = e.target.value;
        if (e.target.value.length > 3) {
          this.setState({ extError: true });
          this.show("ext", true);
        } else if (!numberRegEx.test(ext)) {
          this.setState({ extError: true });
          this.show("ext", true);
        } else {
          this.setState({ ext: e.target.value, extError: false });
          this.show("ext", false);
        }
      }
    }

    if (e.target.name === 'username') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ usernameError: true });
        this.show("username", true, "usernameError", t("contactDetails:UserName.error_blank"));
      } else {
        this.setState({ usernameError: false, username: e.target.value });
        this.show("username", false, "usernameError", "");
      }
    }

    if (e.target.name === 'confirmPassword') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ confirmPasswordError: true });
        this.show("confirmPassword", true, "confirmPasswordError", t("contactDetails:ConfirmPassword.error_blank"));
      } else {
        if (CommonConfig.isEmpty(this.state.password)) {
          this.setState({ confirmPasswordError: true });
          this.show("confirmPassword", true, "confirmPasswordError", t("contactDetails:ConfirmPassword.error_blank"));
        } else if (this.state.password !== e.target.value) {
          this.setState({ confirmPasswordError: true });
          this.show("confirmPassword", true, "confirmPasswordError", t("contactDetails:ConfirmPassword.error_blank"));
        } else {
          this.setState({ confirmPasswordError: false, confirmPassword: e.target.value });
          this.show("confirmPassword", false, "confirmPasswordError", "");
        }
      }
    }

    if (e.target.name === 'changedContactCode') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ contactCodeError: true });
        this.show("changedContactCode", true);
      } else {
        // if (e.target.value.length > 50 || e.target.value.length < 3) {
        //   this.setState({ contactCodeError: true });
        //   this.show("changedContactCode", true);
        // } else {
        this.setState({ contactCodeError: false, changedContactCode: e.target.value });
        this.show("changedContactCode", false);
        // }
      }
    }

    if (e.target.name === 'dob') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ dobError: true });
        this.show("dob", true, "DOBError", t("contactDetails:DOB.error_blank"));
      } else if (moment(e.target.value).format('YYYY-MM-DD') > moment().subtract(12, 'years').format('YYYY-MM-DD')) {
        this.setState({ dobError: true });
        this.show("dob", true, "DOBError", t("contactDetails:DOB.error_maxLength"));
      } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().subtract(100, 'years').format('YYYY-MM-DD')) {
        this.setState({ dobError: true });
        this.show("dob", true, "DOBError", t("contactDetails:DOB.error_minLength"));
      } else {
        this.setState({ dobError: false, dob: e.target.value });
        this.show("dob", false, "DOBError", "");
      }
    }
  }

  setValues = (e) => {
    const { t } = this.props;

    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'forename') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ forenameError: true });
        this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_blank"));
      } else {
        let nameRegEx = /^[a-zA-Z]+[a-zA-Z-']*$/; // /^[a-zA-Z]+[a-zA-Z-\s']*$/
        let name = e.target.value;
        if (!nameRegEx.test(name)) {
          this.setState({ forenameError: true, forename: this.state.forename });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_pattern"));
        } else if (e.target.value.length > 50) {
          this.setState({ forenameError: true, forename: this.state.forename });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_maxLength"));
        } else if (e.target.value.length < 3) {
          this.setState({ forenameError: true, forename: e.target.value });
          this.show("forename", true, "forenameError", t("contactDetails:FirstName.error_minLength"));
        } else {
          this.setState({ forenameError: false, forename: e.target.value, salutation: e.target.value, salutationError: false });
          this.show("forename", false, "forenameError", "");
          this.show("salutation", false, "salutationError", "");
        }
      }
    }
  }

  show(field, condition, errorField, message) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
      document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
    } else {
      document.getElementById(field).className = "form-control";
      document.getElementById(errorField).innerHTML = null;
    }
  }

  reset = (type) => {
    const { t } = this.props;
    if (type === 'phoneModal') {
      // if (this.state.addrCountry !== '' && this.state.addrCountry !== null && this.state.addrCountry !== undefined) {
      //   let selectedCountry = this.state.countryCodeArray.find(x => x.countryid === this.state.addrCountry);
      //   this.setState({ countrycode: selectedCountry.countrycode, countryflag: selectedCountry.countryflag });
      // }
      if (this.state.landLineSelected) this.show("phoneAreaCode", false, "areaCodeError", "");
      this.show("phoneNumber", false, "phoneNumberError", "");

      if (this.state.addrCountry.value !== '' && this.state.addrCountry.value !== null && this.state.addrCountry.value !== undefined) {
        let selectedCountry = this.state.countryCodeArray.find(x => x.CountryName === this.state.addrCountry.label);
        this.setState({ countrycode: selectedCountry.CountryCode, countryflag: selectedCountry.CountryFlag, selectedCountry: selectedCountry.CountryName });
      }
      this.setState({
        visiblePhoneModal: false, phonetype: 'Business', phoneTypeError: false, phoneModalTitle: 'Add Phone',
        phoneAreaCode: '', phoneAreaCodeError: false, phoneNumber: '', phoneNumberError: true,
        isEditPhone: false, countrycodeError: false, extError: false, ext: '', landLineSelected: false,
        extSelected: false, landLineLabel: 'EnterLandLine', extensionLabel: t('contactDetails:EnterExt')
      });
    } else if (type === 'emailModal') {
      this.setState({
        visibleEmailmodal: false, isEditEmail: false, emailtype: 'Work',
        emailTypeError: false, email: '', emailError: true, emailModalTitle: 'Add Email'
      });
      this.show("email", false, "emailError", "");
    } else if (type === 'contactDetails') {
      this.setState({
        personid: '',
        organizationid: '',
        securityuserid: '',

        radioSelected: 'oktocontact',
        isEdit: false,

        contactcode: 0,
        selectedContactType: '',
        selectedContactName: '',

        isCompany: '',

        gender: '',

        userImg: '',
        userImgData: '',

        companyname: '',
        comapnynameError: true,

        title: '',
        titleError: true,
        forename: '',
        forenameError: true,
        surname: '',
        surnameError: true,
        salutation: '',
        salutationError: true,

        passportno: '',
        passportnoError: true,
        country: '',
        countryShown: '',
        filteredCountriesSingle: null,
        countryError: true,

        companyIdentifier: '',
        companyIdentifierError: true,

        businesstype: '',
        businesstypeShown: '',
        filteredBusinessSingle: null,
        businessTypeError: true,
        dob: '',
        dobError: true,

        addressid: '',
        addrCountry: '',
        addrCountryShown: '',
        filteredAddressCountriesSingle: null,
        addrCountryError: true,
        addrline1: '',
        addrline1Error: true,
        addrline2: '',
        addrline3: '',
        city: '',
        cityError: true,
        state: '',
        stateShown: '',
        filteredStateSingle: null,
        stateError: true,
        postalcode: '',
        postalcodeError: true,

        phoneList: [],
        primaryPhone: '',
        visiblePhoneModal: false,
        isEditPhone: false,
        phoneID: 0,
        phoneModalTitle: 'Add Phone',
        phonetype: 'Business',
        phoneTypeError: false,
        phoneAreaCode: '',
        phoneAreaCodeError: false,
        phoneNumber: '',
        phoneNumberError: true,
        countrycode: '',
        countrycodeError: true,
        landLineLabel: 'EnterLandLine',
        landLineSelected: false,
        extensionLabel: t('contactDetails:EnterExt'),
        extSelected: false,
        ext: '',
        extError: false,

        emailList: [],
        primaryEmail: '',
        visibleEmailmodal: false,
        isEditEmail: false,
        emailID: 0,
        emailModalTitle: 'Add Email',
        emailtype: 'Work',
        emailTypeError: false,
        email: '',
        emailError: true,

        docdeliverySelected: '',

        note: '',
        noteError: false,

        bankcode: '',
        bankcodeError: false,

        commission: '',
        commissionError: false,

        binder: '',

        allowLogin: 'no',

        username: '',
        usernameError: false,
        password: '',
        passwordError: false,
        isShowPassword: false,
        confirmPassword: '',
        confirmPasswordError: false,
        isShowConfirmPassword: false,

        selectedSecurityQuestions: [],
        que1: '',
        ans1: '',
        ans1Error: true,
        que2: '',
        ans2: '',
        ans2Error: true,
        que3: '',
        ans3: '',
        ans3Error: true,

        varifyAuthority: ''
      });
      this.getContactModes();
    }
  }

  addToList = (type) => {
    const { t } = this.props;

    if (type === 'phoneList') {

      if (this.state.phoneAreaCodeError || this.state.phoneTypeError || this.state.phoneNumberError || this.state.countrycodeError || this.state.extError) {

        if (this.state.phoneAreaCodeError) this.show("phoneAreaCode", true, "areaCodeError", t("contactDetails:AreaCode.error_blank"));
        if (this.state.phoneTypeError) this.show("phonetype", true, "phoneTypeError", t("contactDetails:PhoneType.error"));
        if (this.state.phoneNumberError) this.show("phoneNumber", true, "phoneNumberError", t("contactDetails:Phone.error_blank"));
        if (this.state.countrycodeError) this.show("countrycode", true, "countrycodeError", t("contactDetails:CountryCode.error"));
        if (this.state.extError) this.show("ext", true, "", "");

      } else {

        this.setState({ landLineLabel: 'EnterLandLine', extensionLabel: t('contactDetails:EnterExt') });
        
        let isExist = this.state.phoneList.findIndex(x => x.phonetype === this.state.phonetype
          && x.phonenumber === this.state.phoneNumber
          && x.countrycode === this.state.countrycode
          && x.id !== this.state.phoneID);
        if (isExist > -1) {
          toast.error(t("contactDetails:PhoneAlreadyExist"));
          return;
        }

        if (this.state.isEditPhone) {
          let phoneArray = this.state.phoneList;
          let index = this.state.phoneList.findIndex(x => x.id === this.state.phoneID);
          // var index = this.state.phoneList.findIndex(x => x.id === this.state.phoneID || x.phoneid === this.state.phoneID);

          phoneArray[index].phonetype = this.state.phonetype;
          phoneArray[index].areacode = this.state.phoneAreaCode;
          phoneArray[index].phonenumber = this.state.phoneNumber;
          phoneArray[index].countrycode = this.state.countrycode;
          phoneArray[index].ext = this.state.ext;

          this.setState({ phoneList: phoneArray });
        } else {
          var phoneArray = [
            {
              id: this.state.phoneList.length,
              phoneid: '',
              phonetype: this.state.phonetype,
              areacode: this.state.phoneAreaCode,
              phonenumber: this.state.phoneNumber,
              countrycode: this.state.countrycode,
              ext: this.state.ext,
              ispreferred: (this.state.phoneList.length === 0) ? true : false,
              isDeleted: false
            }
          ];
          this.setState({ phoneList: this.state.phoneList.concat(phoneArray) });
        }
        this.reset('phoneModal');
      }

    } else if (type === 'emailList') {

      if (this.state.emailTypeError || this.state.emailError) {

        if (this.state.emailTypeError) this.show("emailtype", true, "emailTypeError", t("contactDetails:EmailType.error"));
        if (this.state.emailError) this.show("email", true, "emailError", t("contactDetails:Email.error_blank"));

      } else {

// debugger;
        let isExist = this.state.emailList.findIndex(x => x.emailtype === this.state.emailtype
          && x.email === this.state.email
          && x.id !== this.state.emailID);
        if (isExist > -1) {
          toast.error(t("contactDetails:EmailAlreadyExist"));
          return;
        }

        if (this.state.isEditEmail) {
          let emailArray = this.state.emailList;

          let index = this.state.emailList.findIndex(x => x.id === this.state.emailID);
          // var index = this.state.emailList.findIndex(x => x.id === this.state.emailID || x.emailid === this.state.emailID);

          var el = document.getElementById('emailtype');
          var emailtype = el.options[el.selectedIndex].innerHTML;

          emailArray[index].emailtype = emailtype;
          emailArray[index].email = this.state.email;

          this.setState({ emailList: emailArray });
        } else {
          var emailArray = [{
            id: this.state.emailList.length,
            emailid: '',
            emailtype: this.state.emailtype,
            email: this.state.email,
            ispreferred: (this.state.emailList.length === 0) ? true : false,
            isDeleted: false
          }];
          this.setState({ emailList: this.state.emailList.concat(emailArray) });
        }

        let allEmail = this.state.emailList.concat(emailArray);
        let preferredEmail = allEmail.find(x => x.ispreferred === true);
        // this.setState({ username: this.state.email });
        this.setState({ username: preferredEmail.email });

        this.reset('emailModal');
      }
    } else if (type === 'contactcode') {
      this.setState({ contactcode: this.state.changedContactCode });
      this.toggle('contactcode');
    }
  }

  makePrimary = (value, type) => {
    if (type === 'phone') {
      let phoneArray = this.state.phoneList;
      // let index = phoneArray.findIndex(x => x.id === value.id || x.phoneid === value.phoneid);
      let index = phoneArray.findIndex(x => x.id === value.id);
      for (let i = 0; i < phoneArray.length; i++) {
        phoneArray[i].ispreferred = false;
      }
      phoneArray[index].ispreferred = true;

      phoneArray.sort((x, y) => {
        return y.ispreferred - x.ispreferred
        // return (x.ispreferred === y.ispreferred) ? 0 : x.ispreferred ? -1 : 1;
      });

      this.setState({ phoneList: phoneArray });
    } else if (type === 'email') {
      let emailArray = this.state.emailList;
      // let index = emailArray.findIndex(x => x.id === value.id || x.emailid === value.emailid);
      let index = emailArray.findIndex(x => x.id === value.id);
      for (let i = 0; i < emailArray.length; i++) {
        emailArray[i].ispreferred = false;
      }
      emailArray[index].ispreferred = true;

      emailArray.sort((x, y) => {
        return y.ispreferred - x.ispreferred
        // return (x.ispreferred === y.ispreferred) ? 0 : x.ispreferred ? -1 : 1;
      });

      this.setState({ emailList: emailArray, username: value.email });
    }
  }

  edit = (value, type) => {
    // debugger;
    const { t } = this.props;
    if (type === 'phone') {
      let selectedCountry = this.state.countryCodeArray.find(x => x.CountryCode === value.countrycode);
      this.setState({
        isEditPhone: true, phonetype: value.phonetype, phoneTypeError: false, countryflag: selectedCountry.CountryFlag,
        phoneModalTitle: 'Edit Phone', countrycode: value.countrycode, countrycodeError: false, selectedCountry: selectedCountry.CountryName,
        phoneAreaCode: value.areacode, phoneAreaCodeError: false, ext: value.ext,
        phoneNumber: value.phonenumber, phoneNumberError: false, phoneID: value.id,
        landLineSelected: (value.areacode !== '' && value.areacode !== null && value.areacode !== undefined) ? true : false,
        landLineLabel: (value.areacode !== '' && value.areacode !== null && value.areacode !== undefined) ? 'HideLandLine' : 'EnterLandLine',
        //visiblePhoneModal: true
      });
      // if (value.areacode !== '' && value.areacode !== null && value.areacode !== undefined) {
      //   this.setState({ landLineSelected: true, landLineLabel: 'Hide Land Line' });
      // }
      if (value.ext !== '' && value.ext !== undefined && value.ext !== null) {
        this.setState({ extSelected: true, extensionLabel: 'Hide Ext' });
      }
      this.show('phonetype', false, "phoneTypeError", "");
      this.show('phoneNumber', false, "phoneNumberError", "");
    } else if (type === 'email') {
      this.setState({
        isEditEmail: true, emailtype: value.emailtype, emailTypeError: false,
        emailModalTitle: 'Edit Email', email: value.email, emailError: false, emailID: value.id //visibleEmailmodal: true,
      });
      this.show('emailtype', false, "emailTypeError", "");
      this.show('email', false, "emailError", "");
    }
  }

  confirmDelete = (value, type) => {
    if (type === 'phone') {
      this.setState({ isDeletePhone: true, valueForDelete: value });
    } else if (type === 'email') {
      this.setState({ isDeleteEmail: true, valueForDelete: value });
    }
  }

  delete = (value, type) => {
    if (type === 'phone') {
      let phoneArray = this.state.phoneList;
      // let index = phoneArray.findIndex(x => x.phoneid === value.phoneid || x.id === value.id);
      let index = phoneArray.findIndex(x => x.id === value.id);
      phoneArray[index].isDeleted = true;
      // phoneArray.splice(index, 1);
      this.setState({ phoneList: phoneArray, isDeletePhone: false, valueForDelete: '' });
    } else if (type === 'email') {
      let emailArray = this.state.emailList;
      // var index = emailArray.findIndex(x => x.id === value.id || x.emailid === value.emailid);
      let index = emailArray.findIndex(x => x.id === value.id);
      // emailArray.splice(index, 1);
      emailArray[index].isDeleted = true;
      this.setState({ emailList: emailArray, isDeleteEmail: false, valueForDelete: '' });
    }
  }

  checked = (isChecked, value) => {
    let arr = this.state.contactModes;
    let i = arr.findIndex(x => x.StringMapKey === value.StringMapKey);
    arr[i].isSelected = isChecked;
    this.setState({ contactModes: arr });
  }

  handleSecurityQuestion = (data, queNo) => {
    const { t } = this.props;

    let quesionexist = this.state.selectedSecurityQuestions.findIndex(x => x.label === queNo);
    if (quesionexist > -1) {
      this.state.selectedSecurityQuestions.splice(quesionexist, 1);
    }

    if (data.target.value === '') {
      if (queNo === 'que1') this.show('que1', true, "que1Error", "");
      if (queNo === 'que2') this.show('que2', true, "que2Error", "");
      if (queNo === 'que3') this.show('que3', true, "que3Error", "");
    } else {
      let check = this.state.selectedSecurityQuestions.findIndex(x => x.value === data.target.value);
      if (check === -1) {
        if (queNo === 'que1') {
          // this.setState({ que1: data });
          this.setState({ que1: data.target.value });
          this.show('que1', false, "que1Error", "");
        } else if (queNo === 'que2') {
          // this.setState({ que2: data });
          this.setState({ que2: data.target.value });
          this.show('que2', false, "que2Error", "");
        } else if (queNo === 'que3') {
          // this.setState({ que3: data });
          this.setState({ que3: data.target.value });
          this.show('que3', false, "que3Error", "");
        }
        var arr = [{ label: queNo, value: data.target.value }];
        this.setState({ selectedSecurityQuestions: this.state.selectedSecurityQuestions.concat(arr) });
      } else {
        toast.warn(t("contactDetails:QuestaionAlreadySelected"));
      }
    }
  }

  formatPhone = (ph) => {
    let phone;
    if (ph.countrycode && ph.countrycode !== '' && ph.countrycode !== undefined && ph.countrycode !== null) {
      if (ph.areacode && ph.areacode !== '' && ph.areacode !== undefined && ph.areacode !== null) {
        phone = ph.countrycode + ' ' + ph.areacode + ' ' + CommonConfig.formatPhoneNumber(ph.phonenumber);
      } else {
        phone = ph.countrycode + ' ' + CommonConfig.formatPhoneNumber(ph.phonenumber);
      }
    } else {
      if (ph.areacode && ph.areacode !== '' && ph.areacode !== undefined && ph.areacode !== null) {
        phone = ph.areacode + ' ' + CommonConfig.formatPhoneNumber(ph.phonenumber);
      } else {
        phone = CommonConfig.formatPhoneNumber(ph.phonenumber);
      }
    }
    return phone;
  }

  goBack = () => {
    // console.log("goBack", this.state.);
    debugger;
    var id = this.props.match.params.id?this.props.match.params.id:this.state.resID;
    var entityType = this.props.match.params.entityType?this.props.match.params.entityType:this.state.entityType;
    this.props.history.push({
      pathname: '/viewContactDetails/' + id + '/' + entityType,
      state: { isAdded: !this.state.isEdit }
    });
    // this.props.history.push('/contactList');
  }

  getType = (type, value) => {
    if (type === 'phone') {
      // var phonetype = this.state.phoneTypes.find(x => x.StringMapKey === value.phonetype);
      // return phonetype.StringMapName;
      return value.phonetype;
    } else if (type === 'email') {
      // var emailtype = this.state.emailTypes.find(x => x.StringMapKey === value.emailtype);
      // return emailtype.StringMapName;
      return value.emailtype;
    }
  }

  checkUniqueQuestions() {
    if (this.state.allowLogin === 'no') {
      return true;
    } else {
      if (this.state.isEdit) {
        if (CommonConfig.isEmpty(this.state.securityuserid)) {
          if (this.state.selectedSecurityQuestions.length < 3) {
            return false;
          } else if (this.state.que1 === this.state.que2 || this.state.que1 === this.state.que3 || this.state.que2 === this.state.que3) {
            return false;
          } else {
            return true;
          }
        } else {
          if (this.state.que1 === this.state.que2 || this.state.que1 === this.state.que3 || this.state.que2 === this.state.que3) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (this.state.selectedSecurityQuestions.length < 3) {
          return false;
        } else if (this.state.que1 === this.state.que2 || this.state.que1 === this.state.que3 || this.state.que2 === this.state.que3) {
          return false;
        } else {
          return true;
        }
      }
    }
    // if(this.state.selectedSecurityQuestions.length < 3){
    //   return false;
    // }else if(this.state.que1 === this.state.que2 || this.state.que1 === this.state.que3 || this.state.que2 === this.state.que3){
    //   return false;
    // }else{
    //   return true;
    // }
  }

  validate() {
    const { t } = this.props;
    let errCount = 0;
    if (CommonConfig.isEmpty(this.state.selectedContactType)) {
      toast.error(t("contactDetails:ContactType.error"));
      errCount++;
    }
  }

  saveContact = () => {
    debugger;
    const { t } = this.props;
    try {
      if (this.state.title === '' && this.state.selectedContactType != 'InsuranceCompany' && (this.state.isCompany != 'Company'|| (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client'))) {
        toast.error(t("contactDetails:Title.error"));
        return;
      }
      if (this.state.selectedContactType === '') {
        toast.error(t("contactDetails:ContactType.error"));
        return;
      }

      if (this.state.isCompany === '') {
        toast.error(t("contactDetails:isCompanyError"));
        return;
      }
      if (this.state.companyname === '' && this.state.isCompany === 'Company') {
        toast.error(t("contactDetails:CompanyName.error_blank"));
        return;
      }
      if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.title === '') {
        toast.error(t("contactDetails:Title.error"));
        return;
      }
      if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.forename === '') {
        toast.error(t("contactDetails:FirstName.error_blank"));
        return;
      }
      if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.surname === '') {
        toast.error(t("contactDetails:LastName.error_blank"));
        return;
      }
      if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.salutation === '') {
        toast.error(t("contactDetails:Salutation.error_blank"));
        return;
      }
      if (this.state.passportno !== '' && (this.state.country.value === undefined || this.state.country.value === '')) {
        toast.error(t("contactDetails:PassportCountry.error_blank"));
        return;
      }
      // if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.passportno === '') {
      //   toast.error(t("contactDetails:PassportNumber.error_pattern"));
      //   return;
      // }
      // if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.country === '') {
      //   toast.error(t("contactDetails:PassportCountry.error_blank"));
      //   return;
      // }
      // if (this.state.isCompany === 'Company' && this.state.companyIdentifier === '') {
      //   toast.error(t("contactDetails:CompanyIdentifier.error_blank"));
      //   return;
      // }
      if ((this.state.businesstype === '' || this.state.businesstype === undefined || this.state.businesstype === null) && ((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client'))) {
        toast.error(t("contactDetails:BusinessType.error_blank"));
        return;
      }
      if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && this.state.gender === '') {
        toast.error(t("contactDetails:GenderError"));
        return;
      }

      // Dob Error
      // if (((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) && !this.state.isInternalStaff && (this.state.dob === '' || this.state.dob === null || this.state.dob === undefined || this.state.dob === 'null' || this.state.dob === 'undefined' || this.state.dob === "Invalid date")) {
      //   toast.error(t("contactDetails:DOB.error_blank"));
      //   return;
      // }
      if(this.state.dob === '' || this.state.dob === null || this.state.dob === undefined || this.state.dob === 'null' || this.state.dob === 'undefined' || this.state.dob === "Invalid date"){
        this.state.dob = '0000-00-00';
      }
      if (!this.state.isInternalStaff && (this.state.addrCountry === '' || this.state.addrCountry === null || this.state.addrCountry === undefined || this.state.addrCountry === 'null' || this.state.addrCountry === 'undefined')) {
        toast.error(t("contactDetails:Country.error"));
        return;
      }
      if (!this.state.isInternalStaff && (this.state.addrCountry.value === '' || this.state.addrCountry.value === undefined || this.state.addrCountry.value === null || this.state.addrCountry.value === 'null' || this.state.addrCountry.value === 'undefined')) {
        toast.error(t("contactDetails:Country.error"));
        return;
      }

      if (!this.state.isInternalStaff && this.state.addrline1 === '') {
        toast.error(t("contactDetails:Line1.error_blank"));
        return;
      }
      if (!this.state.isInternalStaff && this.state.state === '') {
        toast.error(t("contactDetails:County.error"));
        return;
      }
      // if (this.state.city === '' && this.state.cityShown === '') {
      //   toast.error(t("contactDetails:Town.error"));
      //   return;
      // }
      // if (this.state.postalcode === '') {
      //   toast.error(t("contactDetails:PostalCode.error_blank"));
      //   return;
      // }

      let phoneList = this.state.phoneList.filter(x => x.isDeleted === false);
      if (!phoneList.length) {
        toast.error(t("contactDetails:PhonesError"));
        return;
      }

      let emailList = this.state.emailList.filter(x => x.isDeleted === false);
      if (!emailList.length) {
        toast.error(t("contactDetails:EmailsError"));
        return;
      }
      if (!this.state.isInternalStaff && !this.state.docdeliverySelected) {
        toast.error(t("contactDetails:DocumentDelivery.Error"));
        return;
      }
      if (!this.state.isEdit && this.state.allowLogin === 'yes' && (this.state.username === '' || this.state.username === null || this.state.username === undefined)) {
        toast.error(t("contactDetails:UserName.error_blank"));
        return;
      }
      if (!this.state.isEdit && this.state.allowLogin === 'yes' && (this.state.password === '' || this.state.password === null || this.state.password === undefined)) {
        toast.error(t("contactDetails:Password.error_blank"));
        return;
      }
      if (!this.state.isEdit && this.state.allowLogin === 'yes' && (this.state.confirmPassword === '' || this.state.confirmPassword === null || this.state.confirmPassword === undefined)) {
        toast.error(t("contactDetails:ConfirmPassword.error_blank"));
        return;
      }
      // if (this.state.allowLogin === 'yes' && (this.state.que1 === '' || this.state.que1 === null || this.state.que1 === undefined)) {
      //   toast.error(t("contactDetails:Question1.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && (this.state.ans1 === '' || this.state.ans1 === null || this.state.ans1 === undefined)) {
      //   toast.error(t("contactDetails:Answer1.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && (this.state.que2 === '' || this.state.que2 === null || this.state.que2 === undefined)) {
      //   toast.error(t("contactDetails:Question1.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && (this.state.ans2 === '' || this.state.ans2 === null || this.state.ans2 === undefined)) {
      //   toast.error(t("contactDetails:Answer2.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && (this.state.que3 === '' || this.state.que3 === null || this.state.que3 === undefined)) {
      //   toast.error(t("contactDetails:Question3.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && (this.state.ans3 === '' || this.state.ans3 === null || this.state.ans3 === undefined)) {
      //   toast.error(t("contactDetails:Answer3.error"));
      //   return;
      // }
      // if (this.state.allowLogin === 'yes' && !this.checkUniqueQuestions()) {
      //   toast.error(t("contactDetails:UniqueQuestion"));
      //   return;
      // }

      if (this.state.commission === '' && (this.state.selectedContactName === 'SubAgent' || this.state.selectedContactName === 'ServiceCenter' || this.state.selectedContactName === 'Sub-Agent' || this.state.selectedContactName === 'Service-Center')) {
        toast.error(t("Please enter commission rate"));
        return;
      }

      const contactDetailsForm = new FormData();

      var company, allowLogin;
      if (this.state.selectedContactName === 'InsuranceCompany' || this.state.selectedContactName === 'Surveyor') {
        company = 'Company';
        allowLogin = 'no';
      } else {
        company = this.state.isCompany;
        allowLogin = this.state.allowLogin;
      }
      contactDetailsForm.append('personid', this.state.personid);
      contactDetailsForm.append('NewUser', this.state.newuser);
      contactDetailsForm.append('organizationid', this.state.organizationid);
      contactDetailsForm.append('addressid', this.state.addressid);
      contactDetailsForm.append('languageid', this.state.selectedLanguage);

      contactDetailsForm.append('isEdit', this.state.isEdit);

      contactDetailsForm.append('contacttype', this.state.selectedContactType);
      // contactDetailsForm.append('isCompany', this.state.isCompany);
      contactDetailsForm.append('isCompany', company);
      contactDetailsForm.append('contactcode', this.state.contactcode);

      if(this.state.companyname != null && this.state.companyname != 'null' && this.state.companyname != 'undefined' && this.state.companyname != undefined){
        contactDetailsForm.append('companyname', this.state.companyname.trim());     
      }
      else{
          contactDetailsForm.append('companyname', this.state.companyname);
      }
      contactDetailsForm.append('title', this.state.title);
      
      contactDetailsForm.append('forename', this.state.forename.trim());
      contactDetailsForm.append('surname', this.state.surname.trim());
      contactDetailsForm.append('salutation', this.state.salutation.trim());
      contactDetailsForm.append('dob', this.state.dob);
      contactDetailsForm.append('gender', this.state.gender);

      contactDetailsForm.append('companyidentifier', this.state.companyIdentifier?this.state.companyIdentifier.trim():'');

      contactDetailsForm.append('passportno', this.state.passportno.trim());
      // contactDetailsForm.append('passportcountry', this.state.country);
      contactDetailsForm.append('passportcountry', CommonConfig.isEmpty(this.state.country.value) ? '' : this.state.country.value);
      contactDetailsForm.append('businesstype', this.state.businesstype);
      // contactDetailsForm.append('businesstype', (this.state.businesstype !== '' && this.state.businesstype !== undefined && this.state.businesstype !== null) ? this.state.businesstype : this.state.businesstypeShown);

      // contactDetailsForm.append('country', this.state.addrCountry);
      contactDetailsForm.append('country', this.state.addrCountry.value);
      contactDetailsForm.append('addrline1', this.state.addrline1);
      contactDetailsForm.append('addrline2', this.state.addrline2);
      contactDetailsForm.append('addrline3', this.state.addrline3);
      contactDetailsForm.append('city', CommonConfig.isEmpty(this.state.city) ? this.state.cityShown : this.state.city);
      contactDetailsForm.append('state', this.state.state);
      contactDetailsForm.append('postalcode', this.state.postalcode);

      contactDetailsForm.append('phoneList', JSON.stringify(this.state.phoneList));

      contactDetailsForm.append('emailList', JSON.stringify(this.state.emailList));

      contactDetailsForm.append('isoktocontact', this.state.radioSelected);
      contactDetailsForm.append('contactmode', JSON.stringify(this.state.contactModes));
      contactDetailsForm.append('documentdelivery', this.state.docdeliverySelected);
      contactDetailsForm.append('note', this.state.note);

      contactDetailsForm.append('centralbankcode', this.state.bankcode);
      contactDetailsForm.append('commissionrate', this.state.commission);
      contactDetailsForm.append('binderid', this.state.binder);
      contactDetailsForm.append('CommissionPayableOn', this.state.CommissionPayable);
      
      // contactDetailsForm.append('allowtologin', this.state.allowLogin);
      contactDetailsForm.append('allowtologin', allowLogin);

      // contactDetailsForm.append('securityuserid', this.state.securityuserid);

      contactDetailsForm.append('username', this.state.username);
      contactDetailsForm.append('password', this.state.password);
      // contactDetailsForm.append('confirmPassword', this.state.confirmPassword);

      let questionArray = [];
      if (this.state.allowLogin === 'yes') {
        questionArray = [
          { securityQuestionID: this.state.securityquestionid1, que: this.state.que1, ans: this.state.ans1 },
          { securityQuestionID: this.state.securityquestionid2, que: this.state.que2, ans: this.state.ans2 },
          { securityQuestionID: this.state.securityquestionid3, que: this.state.que3, ans: this.state.ans3 }
        ];
      }

      contactDetailsForm.append('questionArray', JSON.stringify(questionArray));
      contactDetailsForm.append('question1', this.state.que1);
      contactDetailsForm.append('answer1', this.state.ans1);
      contactDetailsForm.append('question2', this.state.que2);
      contactDetailsForm.append('answer2', this.state.ans2);
      contactDetailsForm.append('question3', this.state.que3);
      contactDetailsForm.append('answer3', this.state.ans3);
      contactDetailsForm.append('userauthenticity', this.state.varifyAuthority);
      contactDetailsForm.append('bankcode', this.state.bankcode);
      contactDetailsForm.append('commission', this.state.commission);

      contactDetailsForm.append('loggedInUserId', CommonConfig.loggedInUserId());

      if (!CommonConfig.isEmpty(this.state.userImgData)) {
        // var imgData = {
        //   uri: this.state.image2.uri,
        //   type: "image/jpeg", // or photo.type
        //   name: "providergallary"
        // }
        contactDetailsForm.append('profileImage', this.state.userImgData, this.state.userImgData.name);
      }
      // 

      api.post('api/addContactDetails', contactDetailsForm).then(res => {

        if (res.success) {
          if (res.data.success) {
            toast.success(res.data.message);
            if (this.state.selectedContactType === 'Client' && !this.state.isEdit) {
              this.setState({ showPolicyModal: true, resID: res.data.data.id ,entityType:res.data.data.entityType });
            } else {
              this.props.history.push({
                pathname: '/viewContactDetails/' + res.data.data.id + '/' + res.data.data.entityType,
                state: { isAdded: !this.state.isEdit }
              });
              this.reset('contactDetails');
            }
            // this.props.history.push('/contactList');
          } else {
            toast.error(res.data.message);
          }
        }
      }).catch(err => {
        console.log(err);
      });
    } catch (error) {
      console.log("Asfdaf", error);
    }
  }

  filterSingle = (event, type) => {
    if (type === 'passportcountry') {
      // if(event.query === undefined || event.query === '' || event.query === null){
      //   this.setState({ filteredCountriesSingle: this.state.countryArray });
      // }else{
      let results = this.state.countryArray.filter((country) => {
        return country.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
      this.setState({ filteredCountriesSingle: results });
      // }
    } else if (type === 'addresscountry') {
      let results = this.state.countryArray.filter((country) => {
        return country.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
      this.setState({ filteredAddressCountriesSingle: results, stateShown: '' });
    } else if (type === 'businesstype') {
      let results = this.state.BusinessArray.filter((business) => {
        return business.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
      this.setState({ filteredBusinessSingle: results });
    } else if (type === 'addrstate') {
      // if(this.state.stateArray.length){
      let results = this.state.stateArray.filter((st) => {
        return st.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
      this.setState({ filteredStateSingle: results });
      // }else{
      //   toast.error('Please select country first');
      // }
    } else if (type === 'city') {
      // if(this.state.cityArray.length){
      let results = this.state.cityArray.filter((city) => {
        return city.label.toLowerCase().startsWith(event.query.toLowerCase());
      });
      this.setState({ filteredCitySingle: results });
      // }else{
      //   toast.error('Please select country and state first');
      // }
    }
  }

  countryCodeTemplate(option) {
    return (
      <div className="p-clearfix">
        <i className={option.countryflag}></i>
        <span style={{ float: 'right', margin: '.5em .25em 0 0' }}>{option.countrycode}</span>
      </div>
    );
  }

  handlePasswordChange = (e) => {
    const { t } = this.props;

    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({
          passwordError: true, case1: false, case2: false, case3: false,
          case4: false, case5: false, case6: false
        });
        this.show("password", true, "passwordError", t("contactDetails:Password.error_blank"));
      } else {
        var myInput = document.getElementById("password");

        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
          this.setState({ case2: true });
        } else {
          this.setState({ case2: false });
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
          this.setState({ case1: true });
        } else {
          this.setState({ case1: false });
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
          this.setState({ case4: true });
        } else {
          this.setState({ case4: false });
        }

        //Validate Special Characters
        var spcs = /[!@#$%^&*(),.?":{}|<>_+-='~`]/g;
        if (myInput.value.match(spcs)) {
          this.setState({ case3: true });
        } else {
          this.setState({ case3: false });
        }

        // Validate length
        if (myInput.value.length === 8) {
          this.setState({ case5: true, case6: true });
        } else if (myInput.value.length > 15) {
          this.setState({ case6: false });
        } else if (myInput.value.length < 8) {
          this.setState({ case5: false });
        } else {
          this.setState({ case5: true, case6: true });
        }

        //password regex
        let passwordRegEx = CommonConfig.RegExp.password; // /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/;
        let password = e.target.value;
        if (!passwordRegEx.test(password)) {
          this.setState({ passwordError: true });
          this.show("password", true, "passwordError", t("contactDetails:Password.error_blank"));
        } else {
          this.setState({ passwordError: false, password: e.target.value });
          this.show("password", false, "passwordError", "");
        }
      }
    }
  }

  goToPolicy() {
    this.props.history.push({
      pathname: '/CreatePolicy/' + this.state.resID,
      state: {
        Id: this.state.resID
      }
    });
    this.reset('contactDetails');
  }

  // validateCountry = (e) => {
  //   if(e.value === '' || e.value === undefined || e.value === null){
  //     this.show('addrCountry', true);
  //   }else{
  //     this.setState({ addrCountryShown: e.value });
  //     this.show('addrCountry', false);
  //   }
  // }

  handleDobChange = (e) => {
    console.log("ijijij", e)
    // const { t } = this.props;
    if (e === null || e === undefined) {

    }
    this.setState({ dob: e });
  }

  close = (type) => {
    if (type === 'policyModal') {
      this.goBack();
      this.reset('contactDetails');
    }
  }

  render() {
    const { t } = this.props;
    const SaveButton = t("buttons.Save");
    const AddButton = t("buttons.Add");
    const EditButton = t("buttons.Edit");
    const DeleteButton = t("buttons.Delete");
    const CloseButton = t("buttons.Close");
    const BackButton = t("buttons.Back");
    const UpdateButton = t("buttons.Update");

    return (
      <div className="animated fadeIn">
        <div className="main-content">

          <Container>

            {/* <div>
              block for show errors
            </div> */}

            <Form encType="multipart/form-data" autoComplete="of">
              {/* <form encType="multipart/form-data"> */}

              <Row style={{ marginTop: 5 }}>
                <Col md="12">
                  {/* {(this.state.isContactCodeEdit) ? (
                    <Row>
                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:ContactCode")}</label>
                          <Input type="text" name="changedContactCode" className="" id="changedContactCode" onChange={(e) => this.handleChange(e)} value={this.state.changedContactCode} />
                            <em className="error invalid-feedback" >{t("contactDetails:ContactCodeError")}</em>
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="add-btn">
                          <Button title={SaveButton} color="primary" onClick={() => this.addToList('contactcode')} style={{ marginRight: 10 }}>
                            <i className="fa fa-check"></i>
                          </Button>
                          <Button title={CloseButton} color="secondary" onClick={() => this.toggle('contactcode')} style={{ marginLeft: 10 }}>
                            <i className="fa fa-close"></i>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                      <span> */}
                  <b style={{ marginRight: 20, fontSize: 20 }}>{t("contactDetails:Contact#")} {this.state.contactcode}</b>
                  {/* <a href="javascript:void(0)" onClick={() => this.toggle('contactcode')}>{t("contactDetails:EditContactCode")}</a>
                      </span>
                    )
                  } */}
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                <Col md="2">
                  <div className="profile-img">
                    <img src={(this.state.userImg && this.state.userImg !== '') ? this.state.userImg : userDefaultImg} alt="user_profile_image" width="100%" height="auto" />
                    <Button title={t("contactDetails:ChangePicture")} outline color="secondary"
                      onClick={() => this.chooseFile()} style={{ marginLeft: 10, bottom: 0 }}>
                      <i className="fa fa-pencil"></i>
                    </Button>
                    {/* <Input type="file" id="file" name="file" accept="image/*" style={{display: 'none'}} onClick={this.selectImage} /> */}
                    <input type="file" id="profileimage" name="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => this.selectImage(e)} />
                  </div>
                </Col>

                <Col md="10">
                  <Row>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:ContactType.label")}*</label>
                        <Input type="select" name="contacttype" id="contacttype"
                          // onBlur={(e) => this.selectType(e.target.value, 'contact')}
                          onChange={(e) => this.selectType(e.target.value, 'contact')}
                          value={this.state.selectedContactType} className=""
                        >
                          <option value=''>{t("contactDetails:ContactType.defaultValue")}</option>
                          {this.state.contactType.map((ct, i) => {
                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback" id="contactTypeError"></em>
                        {/* <em className="error invalid-feedback" >{t("contactDetails:ContactType.error")}</em> */}
                      </div>
                    </Col>

                    <Col md="4">
                      <div className="add-btn">
                        {/* <label>Is Company: </label> */}
                        <div className="button-group">
                          {this.state.companyArray.map((company, i) => {
                            return (<Button name="iscompany" className="" key={i} onClick={() => this.selectType(company.value, 'company')} //active={t("contactDetails:"+this.state.isCompany+"")}
                              color={this.state.isCompany === company.value ? 'primary' : 'secondary'} style={(i === this.state.companyArray.length) ? { marginLeft: 10 } : { marginRight: 10 }}>
                              <i className={company.image}></i>
                              {t("contactDetails:" + company.label + "")}
                              {(this.state.isCompany === company.value) ? <i className="fa fa-check icon-rt"></i> : null}
                            </Button>);
                          })}
                        </div>

                      </div>
                    </Col>

                    <Col md="5">
                      <div className="input-box">
                        <label>
                          {t("contactDetails:CompanyName.label")}
                          {(this.state.isCompany === 'Company') ? '*' : null}
                        </label>
                        <Input name="companyname" type="text" id="companyname" className=""
                          placeholder={t("contactDetails:CompanyName.label")}
                          onChange={e => this.handleChange(e)} value={this.state.companyname}
                          // onBlur={e => this.handleChange(e)} 
                          autoComplete="of"
                        />
                        <em id="comapnynameError" className="error invalid-feedback" ></em>
                        {/* <em className="error invalid-feedback" >{t("contactDetails:CompanyName.error_blank")}</em> */}
                      </div>
                    </Col>
                  </Row>

                  {(((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) ||(this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) ? (
                    <Row>
                      <Col md="12">
                        <label>{t("contactDetails:Name")}</label>
                      </Col>

                      <Col md="2">
                        <div className="input-box">
                          <label>{t("contactDetails:Title.label")}*</label>
                          <Input type="select" name="title" id="title"
                            // onBlur={(e) => this.selectType(e.target.value, 'title')}
                            onChange={(e) => this.selectType(e.target.value, 'title')} value={this.state.title}
                          >
                            <option value=''>{t("contactDetails:Title.defaultValue")}</option>
                            {this.state.titleArray.map((title, i) => {
                              return (<option value={title.StringMapKey} key={i}>{title.StringMapName}</option>)
                            })
                            }
                          </Input>
                          <em id="titleError" className="error invalid-feedback" ></em>
                          {/* <em className="error invalid-feedback" >{t("contactDetails:Title.error")}</em> */}
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:FirstName.label")}*</label>
                          <Input type="text" name="forename" id="forename" placeholder={t("contactDetails:FirstName.label")}
                            onChange={(e) => this.handleChange(e)} value={this.state.forename}
                            // onBlur={(e) => this.setValues(e)} 
                            className="" autoComplete="of" maxLength="26"
                          />
                          <em id="forenameError" className="error invalid-feedback" ></em>
                          {/* <em className="error invalid-feedback" >{t("contactDetails:FirstName.error_blank")}</em> */}
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:LastName.label")}*</label>
                          <Input type="text" name="surname" id="surname" placeholder={t("contactDetails:LastName.label")}
                            onChange={(e) => this.handleChange(e)} value={this.state.surname}
                            // onBlur={(e) => this.handleChange(e)} 
                            className="" autoComplete="of" maxLength="26"
                          />
                          <em id="surnameError" className="error invalid-feedback" ></em>
                          {/* <em className="error invalid-feedback" >{t("contactDetails:LastName.error_blank")}</em> */}
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:Salutation.label")}*</label>
                          <Input type="text" name="salutation" id="salutation" placeholder={t("contactDetails:Salutation.label")}
                            onChange={(e) => this.handleChange(e)} value={this.state.salutation}
                            // onBlur={(e) => this.handleChange(e)} 
                            className="" autoComplete="of"
                          />
                          <em id="salutationError" className="error invalid-feedback" ></em>
                          {/* <em className="error invalid-feedback" >{t("contactDetails:Salutation.error_blank")}</em> */}
                        </div>
                      </Col>
                    </Row>
                  ) : null
                  }

                  {(((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) ||(this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) ? (
                    <Row>
                      {(this.state.isInternalStaff) ? (null) : (
                        <Col md="3">
                          <div className="input-box">
                            <label>{t("contactDetails:PassportNumber.label")}</label>
                            <Input type="text" name="passportno" id="passportno" placeholder={t("contactDetails:PassportNumber.label")}
                              onChange={(e) => this.handleChange(e)} value={this.state.passportno}
                              // onBlur={(e) => this.handleChange(e)} 
                              className="" autoComplete="of" maxLength="9"
                            />
                            <em className="error invalid-feedback" id="passportnoError"></em>
                            {/* <em className="error invalid-feedback" >{t("contactDetails:PassportNumber.error_pattern")}</em> */}
                          </div>
                        </Col>
                      )}

                      {(this.state.isInternalStaff) ? (null) : (
                        <Col md="3">
                          <div className="input-box">
                            <label>{t("contactDetails:PassportCountry.label")}</label>
                            {/* <AutoComplete value={this.state.countryShown} suggestions={this.state.filteredCountriesSingle} 
                            completeMethod={(e) => this.filterSingle(e, 'passportcountry')} field="label"
                            size={20} placeholder={t("contactDetails:PassportCountry.label")} minLength={1} 
                            onChange={(e) => this.setState({ countryShown: e.value })}
                            onSelect={(e) => this.selectType(e.value.StringMapKey, 'country')}
                            // onFocus={(e) => this.filterSingle(e, 'passportcountry')}
                          /> */}
                            <Select options={this.state.countryArray} value={this.state.country}
                              onChange={(data) => this.selectType(data, 'country')}
                              placeholder={t("contactDetails:PassportCountry.label")}
                            />
                            {/* <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                            <option value=''>Select Country</option>
                            {this.state.countryArray.map((country, i) => {
                              return (<option value={country.StringMapKey}>{country.StringMapName}</option>)
                            })
                            }
                          </Input> */}
                          </div>
                        </Col>
                      )}

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:BusinessType.label")}*</label>
                          <AutoComplete value={this.state.businesstype} suggestions={this.state.filteredBusinessSingle}
                            completeMethod={(e) => this.filterSingle(e, 'businesstype')} field="label" size={25}
                            placeholder={t("contactDetails:BusinessType.label")} minLength={1} onChange={(e) => this.setState({ businesstype: e.value })}
                            name="businesstype" id="businesstype" className="" onSelect={(e) => this.selectType(e.value.value, 'businesstype')}
                          />
                          {/* <Select options={this.state.BusinessArray} value={this.state.businesstype} 
                            onChange={(data) => this.selectType(data, 'businesstype')} id="businesstype"
                            placeholder={t("contactDetails:BusinessType.label")} className="" name="businesstype"
                            // onBlur={(e) => this.selectType(e.target.value, 'businesstype')} 
                          /> */}
                          <em className="error invalid-feedback" id="businessTypeError"></em>
                        </div>
                      </Col>

                    </Row>
                  ) : (this.state.isCompany === 'Company') ? (
                    <Row>
                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:CompanyIdentifier.label")}</label>
                          <Input type="text" name="companyIdentifier" id="companyIdentifier" onBlur={(e) => this.handleChange(e)}
                            placeholder={t("contactDetails:CompanyIdentifier.label")} onChange={(e) => this.handleChange(e)}
                            value={this.state.companyIdentifier} className="" autoComplete="of"
                          />
                          <em className="error invalid-feedback" id="companyIdentifierError"></em>
                          {/* <em className="error invalid-feedback" >{t("contactDetails:CompanyIdentifier.error_blank")}</em> */}
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="input-box">
                          <label>{t("contactDetails:BusinessType.label")}</label>
                          <AutoComplete value={this.state.businesstype} suggestions={this.state.filteredBusinessSingle}
                            completeMethod={(e) => this.filterSingle(e, 'businesstype')} field="label" size={25}
                            placeholder={t("contactDetails:BusinessType.label")} minLength={1} onChange={(e) => this.setState({ businesstype: e.value })}
                            name="businesstype" id="businesstype" className="" onSelect={(e) => this.selectType(e.value.value, 'businesstype')}
                          />
                          {/* <Select options={this.state.BusinessArray} value={this.state.businesstype}
                            onChange={(data) => this.selectType(data, 'businesstype')} id="businesstype"
                            placeholder={t("contactDetails:BusinessType.label")} className="" name="businesstype"
                          // onBlur={(e) => this.selectType(e.target.value, 'businesstype')} 
                          /> */}
                        </div>
                      </Col>
                    </Row>
                  ) : null
                  }

                </Col>
              </Row>

              {(((this.state.isCompany === 'Individual') || (this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client'))||(this.state.isCompany === 'Company' && this.state.selectedContactType === 'Client')) ? (
                <Row>
                  <Col md="3">
                    <div className="input-box">
                      <label>{t("contactDetails:Gender")}*</label>
                      <div className="button-group">
                        {this.state.genderArray.map((gender, i) => {
                          return (<Button key={i} onClick={() => this.selectType(gender.value, 'gender')} // active={this.state.gender}
                            color={this.state.gender === gender.label ? 'primary' : 'secondary'} style={(i === this.state.genderArray.length) ? { marginLeft: 10 } : { marginRight: 10 }}>
                            <i className={gender.image}></i>
                            {t("contactDetails:" + gender.label + "")}
                            {(this.state.gender === gender.label) ? <i className="fa fa-check icon-rt"></i> : null}
                          </Button>);
                        })}
                      </div>
                    </div>
                  </Col>

                  {(this.state.isInternalStaff) ? (null) : (
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:DOB.label")}</label>
                        <InputGroup>
                          <Input type="date" name="dob" id="dob" placeholder="Date of Birth"
                            // onBlur={(e) => this.handleChange(e)}
                            onChange={(e) => this.handleChange(e)} value={this.state.dob}
                            min={moment().subtract(100, 'years').format('YYYY-MM-DD')}
                            max={moment().subtract(12, 'years').format('YYYY-MM-DD')}
                          />
                          <em className="error invalid-feedback" id="DOBError"></em>
                          {/* <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-calendar" onClick={() => this.toggle('dob')} ></i>
                          </InputGroupText>
                        </InputGroupAddon> */}
                        </InputGroup>
                        {/* <DatePicker name="dob" onChange={e => this.handleDobChange(e)}
                        value={this.state.dob} maxDate={moment().subtract(12, 'years').toDate()} minDate={moment().subtract(100, 'years').toDate()}
                        className="" calendarClassName="" 
                      /> */}

                        {/* <em className="error invalid-feedback" id="DOBError">{t("contactDetails:DOB.error")}</em> */}
                      </div>
                    </Col>
                  )}
                </Row>
              ) : null
              }

              {/* Address - START */}
              {(this.state.isInternalStaff) ? (null) : (
                <div>
                  <div className="form-heading">
                    <h3>{t("contactDetails:Address")}</h3>
                  </div>

                  <Row>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:Country.label")}*</label>
                        {/* <AutoComplete value={this.state.addrCountryShown} suggestions={this.state.filteredAddressCountriesSingle}
                      completeMethod={(e) => this.filterSingle(e, 'addresscountry')} field="label" size={15}
                      placeholder={t("contactDetails:Country.label")} minLength={1} onChange={(e) => this.setState({ addrCountryShown: e.value })}
                      name="addrCountry" id="addrCountry" className="" onSelect={(e) => this.selectType(e.value.stringmapid, 'addrCountry')}
                    /> */}
                        {/* <em className="error invalid-feedback" >{t("contactDetails:Country.error")}</em> */}

                        <Select options={this.state.countryArray}
                          onChange={(data) => this.selectType(data, 'addrCountry')}
                          // onBlur={(data) => this.selectType(data, 'addrCountry')}
                          // onChange={(data) => this.setState({ addrCountry: data })}
                          value={this.state.addrCountry} className="" id="addrCountry"
                          placeholder={t("contactDetails:Country.label")} name="addrCountry"
                        />
                        <em className="error invalid-feedback" id="addrCountryError"></em>
                        {/* <Input type="select" name="addrCountry" id="addrCountry" onChange={(e) => this.selectType(e.target.value, 'addrCountry')} value={this.state.addrCountry}>
                    <option value=''>Select Country</option>
                    {this.state.countryArray.map((country, i) => {
                      return (<option value={country.countryid}>{country.countryname}</option>)
                    })
                    }
                  </Input> */}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:Line1.label")}*</label>
                        <Input name="addrline1" type="text" id="addrline1" className=""
                          placeholder={t("contactDetails:Line1.placeholder")}
                          // onBlur={e => this.handleChange(e)} 
                          autoComplete="of"
                          onChange={e => this.handleChange(e)} value={this.state.addrline1}
                        />
                        <em className="error invalid-feedback" id="line1Error"></em>
                        {/* <em className="error invalid-feedback" >{t("contactDetails:Line1.error_blank")}</em> */}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:Line2.label")}</label>
                        <Input name="addrline2" type="text" id="addrline2" className=""
                          placeholder={t("contactDetails:Line2.placeholder")} onChange={e => this.handleChange(e)}
                          value={this.state.addrline2}
                          // onBlur={e => this.handleChange(e)}
                          autoComplete="of"
                        />
                        <em className="error invalid-feedback" id="line2Error"></em>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:Line3.label")}</label>
                        <Input name="addrline3" type="text" id="addrline3" className=""
                          placeholder={t("contactDetails:Line3.placeholder")} onChange={e => this.handleChange(e)}
                          value={this.state.addrline3}
                          //  onBlur={e => this.handleChange(e)} 
                          autoComplete="of"
                        />
                        <em className="error invalid-feedback" id="line3Error"></em>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="2">
                      <div className="input-box">
                        <label>{t("contactDetails:County.label")}*</label>
                        {/* <Select options={this.state.stateArray}
                    onChange={(data) => this.setState({ state: data })}
                    value={this.state.state}
                  /> */}
                        {/* <Input type="select" name="addrstate" id="addrstate" onChange={(e) => this.selectType(e.target.value, 'addrstate')} value={this.state.state}>
                    <option value=''>Select County</option>
                    {this.state.stateArray.map((state, i) => {
                      return (<option value={state.stringmapid}>{state.stringmapname}</option>)
                    })
                    }
                  </Input> */}
                        {/* <AutoComplete value={this.state.stateShown} suggestions={this.state.filteredStateSingle}
                          completeMethod={(e) => this.filterSingle(e, 'addrstate')} field="label" size={15}
                          placeholder={t("contactDetails:County.placeholder")} minLength={1} onChange={(e) => this.setState({ stateShown: e.value })}
                          name="addrstate" id="addrstate" className="" onSelect={(e) => this.selectType(e.value.StringMapKey, 'state')}
                        /> */}
                        <AutoComplete value={this.state.state} suggestions={this.state.filteredStateSingle}
                          completeMethod={(e) => this.filterSingle(e, 'addrstate')} field="label" size={15}
                          placeholder={t("contactDetails:County.placeholder")} minLength={1}
                          onChange={(e) => this.countydata(e)}
                          name="addrstate" id="addrstate" className=""
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:Town.label")}</label>
                        <AutoComplete value={this.state.cityShown} suggestions={this.state.filteredCitySingle} completeMethod={(e) => this.filterSingle(e, 'city')} field="label"
                          size={25} placeholder={t("contactDetails:Town.placeholder")} minLength={1} onChange={(e) => this.setState({ cityShown: e.value })}
                          onSelect={(e) => this.selectType(e.value.StringMapName, 'city')}
                        />
                        {/* <Select options={this.state.cityArray}
                    onChange={(data) => this.setState({ city: data })}
                    value={this.state.city}
                  /> */}
                        {/* <Input type="select" name="addrcity" id="addrcity" onChange={(e) => this.selectType(e.target.value, 'addrcity')} value={this.state.city}>
                    <option value=''>Select Town</option>
                    {this.state.cityArray.map((city, i) => {
                      return (<option value={city.stringmapid}>{city.stringmapname}</option>)
                    })
                    }
                  </Input> */}
                      </div>
                    </Col>

                    <Col md="2">
                      <div className="input-box">
                        <label>{t("contactDetails:PostalCode.label")}</label>
                        <Input name="postalcode" type="text" id="postalcode" className="" maxLength="8"
                          placeholder={t("contactDetails:PostalCode.label")} onChange={e => this.handleChange(e)}
                          value={this.state.postalcode}
                          //  onBlur={e => this.handleChange(e)} 
                          autoComplete="of"
                        />
                        <em className="error invalid-feedback" id="postalcodeError"></em>
                        {/* <em className="error invalid-feedback" >{t("contactDetails:PostalCode.error_blank")}</em> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
              {/* Address - END */}

              <div className="form-heading">
                <h3>{t("contactDetails:PhoneHeader")}</h3>
              </div>

              <Row>
                <Col md="2">
                  <div className="input-box">
                    <label>{t("contactDetails:PhoneType.label")}*</label>
                    <Input type="select" name="phonetype" id="phonetype"
                      // onBlur={(e) => this.selectType(e.target.value, 'phonetype')}
                      onChange={(e) => this.selectType(e.target.value, 'phonetype')} value={this.state.phonetype}
                    >
                      {/* <option value=''>{t("contactDetails:PhoneType.defaultValue")}</option> */}
                      {this.state.phoneTypes.map((phonetype, i) => {
                        return (<option value={phonetype.StringMapKey} key={i}>{phonetype.StringMapName}</option>)
                      })
                      }
                    </Input>
                    <em className="error invalid-feedback" id="phoneTypeError"></em>
                    {/* <em className="error invalid-feedback" >{t("contactDetails:PhoneType.error")}</em> */}
                  </div>
                </Col>

                <Col md="3">
                  <div className="input-box">
                    <label>{t("contactDetails:CountryCode.label")}*</label>
                    {/* <Dropdown value={this.state.countrycode} options={this.state.countryCodeArray} 
                    name="countrycode" id="countrycode" filter={false} showClear={false}
                    onChange={(e) => this.selectType(e.target.value, 'countrycode')} itemTemplate={this.countryCodeTemplate}
                  /> */}
                    <InputGroup className="mb-3">
                      {(this.state.countryflag !== '') ? (
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className={this.state.countryflag} title={this.state.selectedCountry}></i>
                          </InputGroupText>
                        </InputGroupAddon>
                      ) : null
                      }
                      <Input type="select" name="countrycode" id="countrycode"
                        // onBlur={(e) => this.selectType(e.target.value, 'countrycode')}
                        onChange={(e) => this.selectType(e.target.value, 'countrycode')} value={this.state.countrycode}
                      >
                        <option value=''>{t("contactDetails:CountryCode.defaultValue")}</option>
                        {this.state.countryCodeArray.map((country, i) => {
                          return (<option value={country.CountryCode} key={i}>
                            ({country.CountryCode}) {country.CountryName}
                          </option>
                          )
                        })
                        }
                      </Input>
                      <em className="error invalid-feedback" id="countrycodeError"></em>
                      {/* <em className="error invalid-feedback" >{t("contactDetails:CountryCode.error")}</em> */}
                    </InputGroup>
                  </div>
                </Col>

                {(this.state.landLineSelected) ?
                  <Col md="2">
                    <div className="input-box">
                      <label>{t("contactDetails:AreaCode.label")}</label>
                      <Input type="text" name="phoneAreaCode" id="phoneAreaCode" placeholder={t("contactDetails:AreaCode.placeholder")}
                        onChange={(e) => this.handleChange(e)}
                        // onBlur={(e) => this.handleChange(e)}
                        value={this.state.phoneAreaCode} autoComplete="of" className="" maxLength="6"
                      />
                      <em className="error invalid-feedback" id="areaCodeError"></em>
                    </div>
                  </Col> : null
                }

                <Col md="2">
                  <div className="input-box">
                    <label>{t("contactDetails:Phone.label")}*</label>
                    <Input type="text" name="phoneNumber" id="phoneNumber" placeholder={t("contactDetails:Phone.placeholder")}
                      onChange={(e) => this.handleChange(e)} value={this.state.phoneNumber} className=""
                      // onBlur={(e) => this.handleChange(e)} 
                      autoComplete="of" maxLength="15"
                    />
                    <em className="error invalid-feedback" id="phoneNumberError"></em>
                    {/* <em className="error invalid-feedback" >{t("contactDetails:Phone.error_blank")}</em> */}
                  </div>
                </Col>

                {/* {(this.state.extSelected) ?
                <Col md="2">
                  <div className="input-box">
                    <label>Ext</label>
                    <Input type="text" name="ext" id="ext" className="" placeholder="Ext" onChange={(e) => this.handleChange(e)} value={this.state.ext} />
                    <em className="error invalid-feedback" >Please enter valid ext</em>
                  </div>
                </Col> : null
              } */}

                <Col md="3">
                  {(this.state.isEditPhone) ?
                    (
                      <div className="add-btn">
                        <Button title={UpdateButton} color="primary" onClick={() => this.addToList('phoneList')} style={{ marginRight: 10 }}>
                          <i className="fa fa-check"></i>
                          {/* {this.state.isEditEmail ? EditButton : AddButton} */}
                        </Button>
                        <Button title={CloseButton} color="secondary" onClick={() => this.reset('phoneModal')} style={{ marginLeft: 10 }}>
                          <i className="fa fa-close"></i>
                          {/* {CloseButton} */}
                        </Button>
                        <Button onClick={() => this.toggle('landline')} className="px-0" color="link" style={{ marginRight: 0 }}>
                          {t("contactDetails:" + this.state.landLineLabel + "")}
                        </Button>
                      </div>
                    ) : (
                      <div className="add-btn">
                        <Button title={AddButton} color="primary" onClick={() => this.addToList('phoneList')}>
                          <i className="fa fa-plus"></i>
                          {/* {this.state.isEditEmail ? EditButton : AddButton} */}
                        </Button>
                        <Button style={{ marginLeft: 5 }} color='link' className="px-0" onClick={() => this.toggle('landline')}>
                          {t("contactDetails:" + this.state.landLineLabel + "")}
                        </Button>
                      </div>
                    )
                  }
                </Col>
              </Row>

              {/* <Row>
                <Col md="12">
                  <div className="button-group">
                    <a onClick={() => this.toggle('landline')} className="btn btn-primary" href="javascript:void(0)" style={{ marginRight: 10 }}>
                      {this.state.landLineLabel}
                    </a>
                    <a onClick={() => this.toggle('ext')} href="javascript:void(0)" style={{ marginLeft: 10 }}>
                        {this.state.extensionLabel}
                      </a>
                  </div>
                </Col>
              </Row> */}

              <Row>
                <Col md="12">
                  <div style={{ marginTop: 10 }} className="input-box">
                    <table className="added-detail-table">
                      <thead></thead>

                      <tbody>
                        {this.state.phoneList.map((ph, i) => {
                          if (!ph.isDeleted) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span>
                                    {this.getType('phone', ph)}
                                  </span>
                                </td>

                                <td>
                                  <span>
                                    {this.formatPhone(ph)}
                                  </span>
                                </td>

                                {/* <td style={{marginRight: 10}}>
                                    <span>
                                      {ph.ext}
                                    </span>
                                  </td> */}

                                <td>
                                  {(ph.ispreferred) ?
                                    <span>{t("contactDetails:PhonePrimary")}</span> :
                                    <span>
                                      <Button color="link" onClick={() => this.makePrimary(ph, 'phone')} className="px-0">{t("contactDetails:PhoneMakePrimary")}</Button>
                                    </span>
                                  }
                                </td>

                                <td>
                                  <span>
                                    <Button title={EditButton} onClick={() => this.edit(ph, 'phone')} style={{ marginRight: 5 }} color="primary">
                                      <i className="fa fa-pencil"></i>
                                    </Button>
                                    {(!ph.ispreferred) ?
                                      <Button title={DeleteButton} onClick={() => this.confirmDelete(ph, 'phone')} style={{ marginLeft: 5 }} color="danger">
                                        <i className="fa fa-trash"></i>
                                      </Button> :
                                      null
                                    }
                                  </span>
                                </td>
                              </tr>
                            )
                          }
                        })
                        }
                      </tbody>
                    </table>
                    {/* {this.state.phoneList.map((ph, i) => {
                        if (!ph.isDeleted) {
                          return (<div className="row">
                            <div className="col-md-2">
                              <p>{this.getType('phone', ph)}</p>
                            </div>
                            <div className="col-md-3">
                              <span>{this.formatPhone(ph)}</span>
                            </div>
                            <div className="col-md-1">
                              <span>{ph.ext}</span>
                            </div>
                            <div className="col-md-3">
                              {(ph.ispreferred) ?
                                <p>Primary</p> :
                                <a onClick={() => this.makePrimary(ph, 'phone')}>Make Primary</a>
                              }
                            </div>
                            <div className="col-md-3">
                              <span>
                                <Button onClick={() => this.edit(ph, 'phone')} style={{ marginRight: 5 }} color="primary">
                                  <i className="fa fa-pencil"></i>
                                </Button>
                                {(!ph.ispreferred) ?
                                  <Button onClick={() => this.delete(ph, 'phone')} style={{ marginLeft: 5 }} color="danger">
                                    <i className="fa fa-trash"></i>
                                  </Button> :
                                  null
                                }
                              </span>
                            </div>
                          </div>)
                        }
                      })
                      } */}
                  </div>
                </Col>
              </Row>

              <div className="form-heading">
                <h3>{t("contactDetails:EmailHeader")}</h3>
              </div>

              <Row>

                {/* <Button className="pull-right" color="primary" onClick={() => this.setState({ visibleEmailmodal: true })}>
                  <i className="fa fa-plus"></i>
                </Button>
                <hr /> */}

                <Col md="2">
                  {/* <Col>
                  <label>Email Type</label>
                </Col> */}
                  {/* <Col> */}
                  <div className="input-box">
                    <label>{t("contactDetails:EmailType.label")}*</label>
                    <Input type="select" name="emailtype" id="emailtype"
                      //  onBlur={(e) => this.selectType(e.target.value, 'emailtype')}
                      onChange={(e) => this.selectType(e.target.value, 'emailtype')} value={this.state.emailtype}>
                      {/* <option value=''>{t("contactDetails:EmailType.defaultValue")}</option> */}
                      {this.state.emailTypes.map((emailtype, i) => {
                        return (<option value={emailtype.StringMapKey} key={i}>{emailtype.StringMapName}</option>)
                      })
                      }
                    </Input>
                    <em className="error invalid-feedback" id="emailTypeError"></em>
                    {/* <em className="error invalid-feedback" >{t("contactDetails:EmailType.error")}</em> */}
                  </div>
                  {/* </Col> */}
                </Col>

                <Col md="4">
                  {/* <Col>
                    <label>Email</label>
                </Col> */}
                  {/* <Col> */}
                  <div className="input-box">
                    <label>{t("contactDetails:Email.label")}*</label>
                    <Input type="email" name="email" id="email" placeholder={t("contactDetails:Email.placeholder")}
                      onChange={(e) => this.handleChange(e)} value={this.state.email} autoComplete="of"
                      // onBlur={(e) => this.handleChange(e)}
                      className=""
                    />
                    <em className="error invalid-feedback" id="emailError"></em>
                    {/* <em className="error invalid-feedback" >{t("contactDetails:Email.error_blank")}</em> */}
                  </div>
                  {/* </Col> */}
                </Col>

                <Col md="2">
                  {(this.state.isEditEmail) ?
                    (
                      <div className="add-btn">
                        <Button title={UpdateButton} color="primary" onClick={() => this.addToList('emailList')} style={{ marginRight: 5 }}>
                          <i className="fa fa-check"></i>
                          {/* {this.state.isEditEmail ? EditButton : AddButton} */}
                        </Button>
                        <Button title={CloseButton} color="secondary" onClick={() => this.reset('emailModal')} style={{ marginLeft: 5 }}>
                          <i className="fa fa-close"></i>
                          {/* {CloseButton} */}
                        </Button>
                      </div>
                    ) : (
                      <div className="add-btn">
                        <Button title={AddButton} color="primary" onClick={() => this.addToList('emailList')} style={{ marginRight: 5 }}>
                          <i className="fa fa-plus"></i>
                          {/* {this.state.isEditEmail ? EditButton : AddButton} */}
                        </Button>
                      </div>
                    )
                  }
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <div style={{ marginTop: 10 }} className="input-box">
                    <table className="added-detail-table">
                      <thead></thead>

                      <tbody>
                        {this.state.emailList.map((email, i) => {
                          if (!email.isDeleted) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span>
                                    {this.getType('email', email)}
                                  </span>
                                </td>

                                <td>
                                  <span>
                                    {email.email}
                                  </span>
                                </td>

                                <td>
                                  {(email.ispreferred) ?
                                    <span>{t("contactDetails:EmailPrimary")}</span> :
                                    <span>
                                      <Button color="link" className="px-0" onClick={() => this.makePrimary(email, 'email')}>{t("contactDetails:EmailMakePrimary")}</Button>
                                    </span>
                                  }
                                </td>

                                <td>
                                  <span>
                                    <Button title={EditButton} color="primary" onClick={() => this.edit(email, 'email')} style={{ marginRight: 5 }}>
                                      <i className="fa fa-pencil"></i>
                                    </Button>
                                    {(!email.ispreferred) ?
                                      <Button title={DeleteButton} color="danger" onClick={() => this.confirmDelete(email, 'email')} style={{ marginLeft: 5 }}>
                                        <i className="fa fa-trash"></i>
                                      </Button>
                                      :
                                      null
                                    }
                                  </span>
                                </td>
                              </tr>
                            )
                          }
                        })
                        }
                      </tbody>
                    </table>

                    {/* {this.state.emailList.map((email, i) => {
                    if (!email.isDeleted) {
                      return (<div className="row">
                        <div className="col-md-2">
                          <p>{this.getType('email', email)}</p>
                        </div>

                        <div className="col-md-5">
                          <p>{email.email}</p>
                        </div>

                        <div className="col-md-3">
                          {(email.ispreferred) ?
                            <p>Primary</p> :
                            <a onClick={() => this.makePrimary(email, 'email')}>Make Primary</a>
                          }
                        </div>

                        <div className="col-md-2">
                          <span>
                            <Button color="primary" onClick={() => this.edit(email, 'email')} style={{ marginRight: 5 }}>
                              <i className="fa fa-pencil"></i>
                            </Button>
                            {(!email.ispreferred) ?
                              <Button color="danger" onClick={() => this.delete(email, 'email')} style={{ marginLeft: 5 }}>
                                <i className="fa fa-trash"></i>
                              </Button>
                              :
                              null
                            }
                          </span>
                        </div>
                      </div>
                      )
                    }
                  })
                  } */}
                  </div>
                </Col>
              </Row>

              {/* Contact Preference & Contact Mode - START */}
              {(this.state.isInternalStaff) ? (null) : (
                <Row>
                  <Col md="4">
                    <div className="input-box rc-box">
                      <label>{t("contactDetails:ContactPreference")}</label>
                      <div className="rc-inline">
                        <label>
                          <Input type="radio" name="contactPreference" checked={(this.state.radioSelected === 'oktocontact') ? true : false}
                            value={this.state.radioSelected} onChange={() => this.onRadioBtnClick('contactPreference', 'oktocontact')}
                          />
                          {t("contactDetails:OktoContact")}
                        </label>

                        <label>
                          <Input type="radio" name="contactPreference" checked={(this.state.radioSelected === 'donotcontact') ? true : false}
                            value={this.state.radioSelected} onChange={() => this.onRadioBtnClick('contactPreference', 'donotcontact')} />
                          {t("contactDetails:DonotContact")}
                        </label>
                      </div>
                    </div>
                  </Col>

                  <Col md="6">
                    {(this.state.radioSelected === 'donotcontact')
                      ? (null)
                      : (<div className="input-box">
                        <label>{t("contactDetails:ContactMode")}</label>
                        <div className="rc-inline">
                          {this.state.contactModes.map((cm, i) => {
                            return (
                              <label key={i}>
                                <Input type='checkbox' name='contactmode' value={cm.StringMapKey} checked={cm.isSelected}
                                  onChange={(e) => this.checked(e.target.checked, cm)} /*disabled={this.state.radioSelected === 'donotcontact' ? true : false}*/ />
                                {cm.StringMapName}
                              </label>
                            )
                          })}
                        </div>
                      </div>
                      )}
                  </Col>
                </Row>
              )}
              {/* Contact Preference & Contact Mode - END */}

              {/* Document Delivery - START */}
              {(this.state.isInternalStaff) ? (null) : (
                <Row>
                  <Col md="6">
                    <div className="input-box rc-box">
                      <label>{t("contactDetails:DocumentDelivery.label")}*</label>
                      <div className="rc-inline">
                        <label>
                          <Input type="radio" name="docdelivery" checked={(this.state.docdeliverySelected === 'email') ? true : false}
                            value={this.state.docdeliverySelected} onChange={() => this.onRadioBtnClick('docdelivery', 'email')} />
                          {t("contactDetails:DocumentDelivery.Email")}
                        </label>

                        <label>
                          <Input type="radio" name="docdelivery" checked={(this.state.docdeliverySelected === 'post') ? true : false}
                            value={this.state.docdeliverySelected} onChange={() => this.onRadioBtnClick('docdelivery', 'post')} />
                          {t("contactDetails:DocumentDelivery.Post")}
                        </label>

                        <label>
                          <Input type="radio" name="docdelivery" checked={(this.state.docdeliverySelected === 'both') ? true : false}
                            value={this.state.docdeliverySelected} onChange={() => this.onRadioBtnClick('docdelivery', 'both')} />
                          {t("contactDetails:DocumentDelivery.Both")}
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
              {/* Document Delivery - END */}

              <Row>
                <Col md="12">
                  <label>{t("contactDetails:Notes.label")}</label>
                  <Input name="note" type="textarea" id="note" className="" onChange={e => this.handleChange(e)} value={this.state.note} />
                </Col>
              </Row>

              {( this.state.selectedContactName === 'ServiceCenter' || this.state.selectedContactName === 'Service-Center' || this.state.selectedContactName === 'Service Center') ? (
                <div>
                  <Row style={{ marginTop: 10 }}>
                  <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:CommissionPayable.label")}</label>
                         <Input type="select" name="CommissionPayable" id="CommissionPayable"
                          onChange={(e) => this.selectType(e.target.value, 'CommissionPayable')} value={this.state.CommissionPayable}>
                          {this.state.CommissionPayables.map((CommissionPayable, i) => {
                            return (<option value={CommissionPayable.StringMapKey} key={i}>{CommissionPayable.StringMapName}</option>)
                          })
                      }
                    </Input>
                        <em className="error invalid-feedback" id="CommissionPayableError"></em>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : null
              }

              {(this.state.selectedContactName === 'SubAgent' || this.state.selectedContactName === 'ServiceCenter' || this.state.selectedContactName === 'Sub-Agent' || this.state.selectedContactName === 'Service-Center' || this.state.selectedContactName === 'Service Center') ? (
                <div>
                  <Row style={{ marginTop: 10 }}>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:CentralBankCode.label")}</label>
                        <Input name="bankcode" type="text" id="bankcode" className=""
                          onChange={e => this.handleChange(e)}
                          // onBlur={e => this.handleChange(e)}
                          value={this.state.bankcode}
                        />
                        <em className="error invalid-feedback" id="bankcodeError"></em>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="input-box">
                        <label>{t("contactDetails:commissionRate.label")}*</label>
                        <Input name="commission" type="text" id="commission" className=""
                          onChange={e => this.handleChange(e)}
                          // onBlur={e => this.handleChange(e)} 
                          value={this.state.commission}
                        />
                        <em className="error invalid-feedback" id="commissionError"></em>
                      </div>
                    </Col>
                  
                  </Row>

                  {/* <Row style={{ marginTop: 10 }}>
                    <Col md="3">
                      <label>{t("contactDetails:Binder.label")}</label>
                    </Col>
                    <Col md="9">
                      <AutoComplete value={this.state.binder} suggestions={this.state.binderArray}
                        completeMethod={(e) => this.filterSingle(e, 'binder')} field="label" size={25}
                        placeholder={t("contactDetails:Binder.placeholder")} minLength={1} onChange={(e) => this.setState({ binderShown: e.value })}
                        name="binder" id="binder" className="" onSelect={(e) => this.selectType(e, 'binder')}
                      />
                      <Select options={this.state.binderArray}
                        onChange={(data) => this.setState({ binder: data })}
                        value={this.state.binder}
                      />
                    </Col>
                  </Row> */}
                </div>
              ) : null
              }

              {/* {(this.state.selectedContactName === 'InsuranceCompany' || this.state.selectedContactName === 'Surveyor') ?
                null : (
                  <Row style={{ marginTop: 10 }}>
                    <Col md="4">
                      <label>{t("contactDetails:AllowedLogin.label")}</label>
                      <div className="rc-inline">
                        <label>
                          <Input type="radio" name="allowLogin" checked={(this.state.allowLogin === 'no') ? true : false}
                            value={this.state.allowLogin} onClick={() => this.onRadioBtnClick('allowLogin', 'no')} />
                          {t("contactDetails:AllowedLogin.No")}
                      </label>

                        <label >
                          <Input type="radio" name="allowLogin" checked={(this.state.allowLogin === 'yes') ? true : false}
                            value={this.state.allowLogin} onClick={() => this.onRadioBtnClick('allowLogin', 'yes')} />
                          {t("contactDetails:AllowedLogin.Yes")}
                      </label>
                      </div>
                    </Col>
                  </Row>
                )
              } */}
              {(this.state.selectedContactName === 'InsuranceCompany' || this.state.selectedContactName === 'Surveyor') ?
                null : (
                  <Row style={{ marginTop: 10 }}>
                    <Col md="4">
                      <label>{t("contactDetails:NewUser.label")}</label>
                      <div className="rc-inline">
                        <label>
                          <Input type="radio" name="newuser" checked={(this.state.newuser === 'no') ? true : false}
                            value={this.state.newuser} onClick={() => this.onRadioBtnClick('newuser', 'no')} />
                          {t("contactDetails:NewUser.No")}
                        </label>

                        <label >
                          <Input type="radio" name="newuser" checked={(this.state.newuser === 'yes') ? true : false}
                            value={this.state.allowLonewusergin} onClick={() => this.onRadioBtnClick('newuser', 'yes')} />
                          {t("contactDetails:NewUser.Yes")}
                        </label>
                      </div>
                    </Col>
                  </Row>
                )
              }

              {/* {(this.state.allowLogin === 'yes') ? (

<div>
  {(this.state.isEdit && this.state.securityuserid !== '') ?
    (
      <div></div>
    ) : (
      <Row>
        <Col md="3">
          <div className="input-box">
            <label>{t("contactDetails:UserName.label")}</label>
            <Input name="username" type="text" readOnly id="username" className="" autoComplete="of"
              placeholder={t("contactDetails:UserName.placeholder")} onChange={e => this.handleChange(e)} value={this.state.username}
         onBlur={e => this.handleChange(e)}
            />
            <em className="error invalid-feedback" id="usernameError"></em>
           <em className="error invalid-feedback" >{t("contactDetails:UserName.error_blank")}</em> 
          </div>
        </Col>

        <Col md="3">
          <div className="input-box input-icon">
            <label>{t("contactDetails:Password.label")}</label>
            <i className="fa fa-info-circle" title="Password Rules" id="rules" onClick={() => this.toggle('rules')} style={{ marginLeft: 5 }}></i>
            <InputGroup>
              <Input name="password" type={this.state.isShowPassword ? "text" : "password"}
                id="password" className="" placeholder={t("contactDetails:Password.placeholder")}
                onChange={e => this.handlePasswordChange(e)} value={this.state.password}
                 onBlur={e => this.handlePasswordChange(e)} 
                maxLength="15"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className={this.state.isShowPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    onClick={() => this.toggle('password')} title={this.state.isShowPassword ? t("contactDetails:Password.password_hide") : t("contactDetails:Password.password_show")}>
                  </i>
                </InputGroupText>
              </InputGroupAddon>
              <em className="error invalid-feedback" id="passwordError"></em>
               <em className="error invalid-feedback" >{t("contactDetails:Password.error_blank")}</em> 
            </InputGroup>
          </div>
        </Col>

        <Popover placement="right" isOpen={this.state.showRules} target="rules" toggle={() => this.toggle('rules')}>
          <PopoverHeader>{t("contactDetails:PasswordRules.label")}</PopoverHeader>
          <PopoverBody style={{ marginLeft: 10, marginRight: 10 }}>
            <Row>{t("contactDetails:PasswordRules.uppercase")}</Row>
            <Row>{t("contactDetails:PasswordRules.lowercase")}</Row>
            <Row>{t("contactDetails:PasswordRules.minlength")}</Row>
            <Row>{t("contactDetails:PasswordRules.specialcharacter")}</Row>
            <Row>{t("contactDetails:PasswordRules.number")}</Row>
             <Row>{t("contactDetails:PasswordRules.maxlength")}</Row> 
          </PopoverBody>
        </Popover>

        <Col md="3">
          <div className="input-box">
            <label>{t("contactDetails:ConfirmPassword.label")}</label>
            <InputGroup>
              <Input name="confirmPassword" type={this.state.isShowConfirmPassword ? "text" : "password"}
                id="confirmPassword" className="" placeholder={t("contactDetails:ConfirmPassword.placeholder")}
                onChange={e => this.handleChange(e)} value={this.state.confirmPassword}
                 onBlur={e => this.handleChange(e)} 
                maxLength="15"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className={this.state.isShowConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    onClick={() => this.toggle('confirmPassword')} title={this.state.isShowConfirmPassword ? t("contactDetails:ConfirmPassword.password_hide") : t("contactDetails:ConfirmPassword.password_show")}>
                  </i>
                </InputGroupText>
              </InputGroupAddon>
              <em className="error invalid-feedback" id="confirmPasswordError"></em>
               <em className="error invalid-feedback" >{t("contactDetails:ConfirmPassword.error_blank")}</em> 
            </InputGroup>
          </div>
        </Col>
      </Row>
    )
  }

  <Row>
  <Col md="12">
    <h4>Password Rules</h4>
    <div className="row">
      <div className="col-md-4">
        <p id="capital" className="invalid" style={this.state.case1 ? {color: 'green'} : {color: 'red'}}>
          One capital (upperCaseLetters) required
        </p>
      </div>

      <div className="col-md-4">
        <p id="letter" className="invalid" style={this.state.case2 ? {color: 'green'} : {color: 'red'}}>
          One small (lowerCaseLetters) required
        </p>
      </div>
      
      <div className="col-md-4">
        <p id="spc" className="invalid" style={this.state.case3 ? {color: 'green'} : {color: 'red'}}>
          One special character required
        </p>
      </div>
    </div>

    <div className="row">
      <div className="col-md-4">
        <p id="number" className="invalid" style={this.state.case4 ? {color: 'green'} : {color: 'red'}}>
          One number required
        </p>
      </div>

      <div className="col-md-4">
        <p id="minlength" className="invalid" style={this.state.case5 ? {color: 'green'} : {color: 'red'}}>
          Minimum 8 characters required
        </p>
      </div>

      <div className="col-md-4">
        <p id="maxlength" className="invalid" style={this.state.case6 ? {color: 'green'} : {color: 'red'}}>
          Maximum 15 characters allowed
        </p>
      </div>
    </div>
  </Col>
</Row>

  <Row>
    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Question1.label")}*</label>
        <Input type="select" name="que1" id="que1" onChange={(data) => this.handleSecurityQuestion(data, 'que1')} value={this.state.que1}>
          <option value=''>{t("contactDetails:Question1.defaultValue")}</option>
          {this.state.securityQuestionArray.map((que, i) => {
            return (<option value={que.StringMapKey} key={i}>{que.StringMapName}</option>)
          })
          }
        </Input>
        <em className="error invalid-feedback" id="que1Error">Please select question</em>
      </div>
    </Col>

    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Answer1.label")}*</label>
        <InputGroup>
          <Input name="ans1" type={this.state.isShowAns1 ? "text" : "password"} id="ans1"
            className="" onChange={e => this.handleChange(e)} value={this.state.ans1}
            autoComplete="of" maxLength="50"
            onBlur={e => this.handleChange(e)}
          />
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className={this.state.isShowAns1 ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => this.toggle('ans1')} title={this.state.isShowAns1 ? t("contactDetails:Answer1.hide") : t("contactDetails:Answer1.show")}>
              </i>
            </InputGroupText>
          </InputGroupAddon>
          <em className="error invalid-feedback" id="ans1Error"></em>
        <em className="error invalid-feedback" >{t("contactDetails:Answer1.error_blank")}</em>
        </InputGroup>
      </div>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Question2.label")}*</label>
        <Input type="select" name="que2" id="que2" onChange={(data) => this.handleSecurityQuestion(data, 'que2')} value={this.state.que2}>
          <option value=''>{t("contactDetails:Question2.defaultValue")}</option>
          {this.state.securityQuestionArray.map((que, i) => {
            return (<option value={que.StringMapKey} key={i}>{que.StringMapName}</option>)
          })
          }
        </Input>
        <em className="error invalid-feedback" id="que2Error">Please select question</em>
      </div>
    </Col>

    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Answer2.label")}*</label>
        <InputGroup>
          <Input name="ans2" type={this.state.isShowAns2 ? "text" : "password"}
            id="ans2" className="" onChange={e => this.handleChange(e)}
            value={this.state.ans2} autoComplete="of" maxLength="50"
          />
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className={this.state.isShowAns2 ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => this.toggle('ans2')} title={this.state.isShowAns2 ? t("contactDetails:Answer2.hide") : t("contactDetails:Answer2.show")}>
              </i>
            </InputGroupText>
          </InputGroupAddon>
          <em className="error invalid-feedback" id="ans2Error"></em>
           <em className="error invalid-feedback" >{t("contactDetails:Answer2.error_blank")}</em> 
        </InputGroup>
      </div>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Question3.label")}*</label>
        <Input type="select" name="que3" id="que3" onChange={(data) => this.handleSecurityQuestion(data, 'que3')} value={this.state.que3}>
          <option value=''>{t("contactDetails:Question3.defaultValue")}</option>
          {this.state.securityQuestionArray.map((que, i) => {
            return (<option value={que.StringMapKey} key={i}>{que.StringMapName}</option>)
          })
          }
        </Input>
        <em className="error invalid-feedback" id="que3Error">Please select question</em>
      </div>
    </Col>

    <Col md="6">
      <div className="input-box">
        <label>{t("contactDetails:Answer3.label")}*</label>
        <InputGroup>
          <Input name="ans3" type={this.state.isShowAns3 ? "text" : "password"}
            id="ans3" className="" onChange={e => this.handleChange(e)}
            value={this.state.ans3} autoComplete="of" maxLength="50"
          />
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className={this.state.isShowAns3 ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => this.toggle('ans3')} title={this.state.isShowAns3 ? t("contactDetails:Answer3.hide") : t("contactDetails:Answer3.show")}>
              </i>
            </InputGroupText>
          </InputGroupAddon>
          <em className="error invalid-feedback" id="ans3Error"></em>
           <em className="error invalid-feedback" >{t("contactDetails:Answer3.error_blank")}</em> 
        </InputGroup>
      </div>
    </Col>
  </Row>

   <Row style={{marginTop: 10}}>
  <Col md="3">
    <label>Did you verify the user authenticity?</label>
  </Col>
  <Col md="9">
    <Row>
      <Col md="3">
        <FormGroup>
          <label>
            <Input type="radio" name="varifyauthority" checked={(this.state.varifyAuthority === 'yes') ? true : false}
              value={this.state.varifyAuthority} onClick={() => this.onRadioBtnClick('varifyauthority', 'yes')} />
            Yes
          </label>
        </FormGroup>
      </Col>

      <Col md="3">
        <FormGroup>
          <label >
            <Input type="radio" name="varifyauthority" checked={(this.state.varifyAuthority === 'no') ? true : false}
              value={this.state.varifyAuthority} onClick={() => this.onRadioBtnClick('varifyauthority', 'no')} />
            No
          </label>
        </FormGroup>
      </Col>
    </Row>
  </Col>
</Row> 
</div>
) : null
} */}

              <Row className="text-center" style={{ marginTop: 10 }}>
                <Col>
                  <div className="final-save">
                    <Button color="success" onClick={() => this.saveContact()}>
                      <i className="fa fa-check"></i>
                      {SaveButton}
                    </Button>
                    <Button color="primary" onClick={() => this.goBack()}>
                      <i className="fa fa-angle-left"></i>
                      {BackButton}
                    </Button>
                  </div>
                </Col>
              </Row>

            </Form>
            {/* </form> */}

            <Modal toggle={() => this.setState({ isDeletePhone: false })} isOpen={this.state.isDeletePhone}>
              <ModalHeader toggle={() => this.setState({ isDeletePhone: false })}>
                <h3>{t("contactDetails:DeletePhone.label")}</h3>
              </ModalHeader>

              <ModalBody>
                <Row>
                  <Col md="12">
                    <p>{t("contactDetails:DeletePhone.message")} {this.state.valueForDelete.phonenumber} ?</p>
                  </Col>
                </Row>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={() => this.setState({ isDeletePhone: false })}>
                  <i className="fa fa-close"></i>
                  {t("contactDetails:DeletePhone.No")}
                </Button>
                <Button color="primary" onClick={() => this.delete(this.state.valueForDelete, 'phone')}>
                  <i className="fa fa-check"></i>
                  {t("contactDetails:DeletePhone.Yes")}
                </Button>
              </ModalFooter>
            </Modal>

            <Modal toggle={() => this.setState({ isDeleteEmail: false })} isOpen={this.state.isDeleteEmail}>
              <ModalHeader toggle={() => this.setState({ isDeleteEmail: false })}>
                <h3>{t("contactDetails:DeleteEmail.label")}</h3>
              </ModalHeader>

              <ModalBody>
                <Row>
                  <Col md="12">
                    <p>{t("contactDetails:DeleteEmail.message")} {this.state.valueForDelete.email} ?</p>
                  </Col>
                </Row>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={() => this.setState({ isDeleteEmail: false })}>
                  <i className="fa fa-close"></i>
                  {t("contactDetails:DeleteEmail.No")}
                </Button>
                <Button color="primary" onClick={() => this.delete(this.state.valueForDelete, 'email')}>
                  <i className="fa fa-check"></i>
                  {t("contactDetails:DeleteEmail.Yes")}
                </Button>
              </ModalFooter>
            </Modal>

            <Modal toggle={() => this.reset('phoneModal')} isOpen={this.state.visiblePhoneModal}>
              <ModalHeader toggle={() => this.reset('phoneModal')}>
                <h3>{this.state.phoneModalTitle}</h3>
              </ModalHeader>

              <ModalBody>
                <Form>
                  <Row>
                    <Col md="4">
                      <Col>
                        <label>Phone Type</label>
                      </Col>
                      <Col>
                        <Input type="select" name="phonetype" id="phonetype" onChange={(e) => this.selectType(e.target.value, 'phonetype')} value={this.state.phonetype}>
                          <option value=''>Select</option>
                          {this.state.phoneTypes.map((phonetype, i) => {
                            return (<option value={phonetype.stringmapname} key={i}>{phonetype.stringmapname}</option>)
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback" >Please select phone type</em>
                      </Col>
                    </Col>

                    <Col md="4">
                      <Col>
                        <label>Area Code</label>
                      </Col>
                      <Col>
                        <Input type="text" name="phoneAreaCode" id="phoneAreaCode" placeholder="Area Code" onChange={(e) => this.handleChange(e)} value={this.state.phoneAreaCode} />
                        <em className="error invalid-feedback" >Please enter valid area code</em>
                      </Col>
                    </Col>

                    <Col md="4">
                      <Col>
                        <label>Phone</label>
                      </Col>
                      <Col>
                        <Input type="text" name="phoneNumber" id="phoneNumber" placeholder="Phone Number" onChange={(e) => this.handleChange(e)} value={this.state.phoneNumber} />
                        <em className="error invalid-feedback" >Please enter valid Phone Number</em>
                      </Col>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={() => this.reset('phoneModal')}>
                  <i className="fa fa-close"></i>
                  {CloseButton}
                </Button>
                <Button color="primary" onClick={() => this.addToList('phoneList')}>
                  <i className="fa fa-check"></i>
                  {this.state.isEditPhone ? EditButton : AddButton}
                </Button>
              </ModalFooter>
            </Modal>

            <Modal toggle={() => this.reset('emailModal')} isOpen={this.state.visibleEmailmodal}>
              <ModalHeader toggle={() => this.reset('emailModal')}>
                <h3>{this.state.emailModalTitle}</h3>
              </ModalHeader>

              <ModalBody>
                <Form>
                  <Row>
                    <Col md="4">
                      <Col>
                        <label>Email Type</label>
                      </Col>
                      <Col>
                        <Input type="select" name="emailtype" id="emailtype" onChange={(e) => this.selectType(e.target.value, 'emailtype')} value={this.state.emailtype}>
                          <option value=''>Select</option>
                          {this.state.emailTypes.map((emailtype, i) => {
                            return (<option value={emailtype.stringmapname} key={i}>{emailtype.stringmapname}</option>)
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback" >Please select email type</em>
                      </Col>
                    </Col>

                    <Col md="6">
                      <Col>
                        <label>Email</label>
                      </Col>
                      <Col>
                        <Input type="email" name="email" id="email" placeholder="Email" onChange={(e) => this.handleChange(e)} value={this.state.email} />
                        <em className="error invalid-feedback" >Please enter valid email</em>
                      </Col>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={() => this.reset('emailModal')}>
                  <i className="fa fa-close"></i>
                  {CloseButton}
                </Button>
                <Button color="primary" onClick={() => this.addToList('emailList')}>
                  <i className="fa fa-check"></i>
                  {this.state.isEditEmail ? EditButton : AddButton}
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              // toggle={() => this.reset('policyModal')} 
              isOpen={this.state.showPolicyModal}
            >
              <ModalHeader toggle={() => this.close('policyModal')}>
                <h3>{t("contactDetails:SetupPolicy.header")}</h3>
              </ModalHeader>

              <ModalBody>
                <Row>
                  <Col md="12">
                    <p>{t("contactDetails:SetupPolicy.message")}</p>
                  </Col>
                </Row>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={() => this.close('policyModal')}>
                  <i className="fa fa-close"></i>
                  {t("contactDetails:SetupPolicy.No")}
                </Button>
                <Button color="primary" onClick={() => this.goToPolicy()}>
                  <i className="fa fa-check"></i>
                  {t("contactDetails:SetupPolicy.Yes")}
                </Button>
              </ModalFooter>
            </Modal>
          </Container>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ContactDetails);
