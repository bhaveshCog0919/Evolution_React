import React from 'react';
import {
    Button, Col, Container, Input, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    Collapse, Card, CardBody, CardHeader
} from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

import api from '../../utils/apiClient';
import { apiBase } from '../../utils/config';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import SidebarNav from '../SidebarNav/SidebarNav';

const userDefaultImg = require('../../assets/img/defaultProfile.png');

class ViewContactDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            entityType: '',
            selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            isEdit: false,
            isInternalStaff: false,
            contactcode: 0,
            selectedContactName: '',
            isCompany: 'Individual',
            contactPreference: '',
            gender: '',
            userImg: '',
            companyname: '',
            titleName: '',
            forename: '',
            surname: '',
            salutation: '',
            fullName: '',

            passportno: '',
            countryShown: '',

            companyIdentifier: '',

            businesstypeShown: '',
            dob: '',
            addrCountryShown: '',
            addrline1: '',
            addrline2: '',
            addrline3: '',
            cityShown: '',
            stateShown: '',
            postalcode: '',

            phoneList: [],
            emailList: [],

            contactModes: [],

            docdeliverySelected: '',

            userNote: '',
            bankcode: '',
            commission: '',

            custom: [false, false, false],
            isExpand: false,

            showModal: false,
            personQuestion: [],
            organizationQuestion: [],

            arrayToDisplay: [],
            selectedRecord: '',
            verificationArray: [],
            mobile: null,
            note: '',
            selected1: false,
            selected2: false,
            selected3: false
        }
    }

    componentDidMount() {
        this.getPersonQuestion();
        this.getOrganizationQuestion();

        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getContactDetails(this.props.match.params.id, this.props.match.params.entityType);
        }
    }

    getPersonQuestion() {
        try {
            const data = {
                stringmaptype: 'PERSONQUESTION',
                orderby: 'SortOrder',
                languageid: this.state.selectedLanguage
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
                orderby: 'SortOrder',
                languageid: this.state.selectedLanguage
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

    getContactDetails(id, entityType) {
       
        try {
            let data = {
                id: id,
                entityType: entityType
            }
            this.setState({ id: id, entityType: entityType });
            console.log("data",data);
            
            api.post('api/getContactDetailsByTypeAndID', data).then(res => {
                console.log("res",res);
                if (res.success) {
                    console.log("getContactDetailsByTypeAndID > ", res);
                    let contactModes = [];
                    let profileImage;

                    let phones = res.data.phoneData.sort((x, y) => {
                        return y.IsPreferred.data[0] - x.IsPreferred.data[0]
                    });

                    let emails = res.data.emailData.sort((x, y) => {
                        return y.IsPreferred.data[0] - x.IsPreferred.data[0]
                    });

                    let preferredPhone = phones.find(x => x.IsPreferred.data[0] === 1);
                    let phonestr = this.formatPhone(preferredPhone);

                    for (let k = 0; k < res.data.contactModes.length; k++) {
                        contactModes.push({
                            contactmodeid: res.data.contactModes[k].ContactModeId,
                            stringmapid: res.data.contactModes[k].ContactModeType,
                            stringmapname: res.data.contactModes[k].contactmodename,
                            isSelected: (res.data.contactModes[k].Status === 'Active') ? true : false
                        });
                    }

                    if (res.data.personData[0].PicturePath !== '' && res.data.personData[0].PicturePath !== undefined && res.data.personData[0].PicturePath !== null) {
                        profileImage = apiBase + res.data.personData[0].PicturePath;
                    }
                    if (entityType.toString().toLowerCase() === 'person') {
                        this.setState({
                            contactcode: res.data.personData[0].ContactCode,
                            selectedContactName: res.data.personData[0].contactTypeName,
                            isInternalStaff: (res.data.personData[0].ContactType == "InternalStaff") ? true : false,
                            isCompany: 'Individual',
                            userImg: profileImage,
                            companyname: res.data.personData[0].CompanyName,
                            titleName: res.data.personData[0].titleName,
                            forename: res.data.personData[0].Forename,
                            surname: res.data.personData[0].Surname,
                            salutation: res.data.personData[0].Salutation,
                            gender: res.data.personData[0].Gender,
                            passportno: res.data.personData[0].PassportNumber,
                            countryShown: (CommonConfig.isEmpty(res.data.personData[0].passportcountryName)) ? '' : res.data.personData[0].passportcountryName,
                            dob: CommonConfig.isEmpty(res.data.personData[0].DOB) || res.data.personData[0].DOB=='0000-00-00' || res.data.personData[0].DOB == "Invalid date" ?'':moment(res.data.personData[0].DOB).format(CommonConfig.dateFormat.dateOnly),
                            businesstypeShown: (CommonConfig.isEmpty(res.data.personData[0].businesstypeName)) ? '' : res.data.personData[0].businesstypeName,
                            addrCountryShown: (CommonConfig.isEmpty(res.data.addressData[0].countryname)) ? '' : res.data.addressData[0].countryname,
                            addrline1: res.data.addressData[0].AddrLine1,
                            addrline2: res.data.addressData[0].AddrLine2,
                            addrline3: res.data.addressData[0].AddrLine3,
                            stateShown: (CommonConfig.isEmpty(res.data.addressData[0].State)) ? '' : res.data.addressData[0].State,
                            cityShown: res.data.addressData[0].City,
                            postalcode: res.data.addressData[0].PostalCode,
                            phoneList: phones,
                            emailList: emails,
                            contactPreference: (res.data.personData[0].IsOkToContact.data[0] === 1) ? 'oktocontact' : 'donotcontact',
                            contactModes: contactModes,
                            docdeliverySelected: res.data.personData[0].DocumentDelivery,
                            userNote: res.data.personData[0].Note,
                            mobile: phonestr,
                            fullName: res.data.personData[0].titleName + ' ' + res.data.personData[0].Forename + ' ' + res.data.personData[0].Surname
                        });
                    } else if (entityType.toString().toLowerCase() === 'organization') {
                        this.setState({
                            contactcode: res.data.personData[0].ContactCode,
                            selectedContactName: res.data.personData[0].contactTypeName,
                            isInternalStaff: (res.data.personData[0].ContactType == "InternalStaff") ? true : false,
                            isCompany: 'Company',
                            userImg: profileImage,
                            companyIdentifier: res.data.personData[0].CompanyIdentifier,
                            companyname: res.data.personData[0].OrganizationName,
                            businesstypeShown: (CommonConfig.isEmpty(res.data.personData[0].businesstypeName)) ? '' : res.data.personData[0].businesstypeName,
                            addrCountryShown: (CommonConfig.isEmpty(res.data.addressData[0].countryname)) ? '' : res.data.addressData[0].countryname,
                            addrline1: res.data.addressData[0].AddrLine1,
                            addrline2: res.data.addressData[0].AddrLine2,
                            addrline3: res.data.addressData[0].AddrLine3,
                            stateShown: (res.data.addressData[0].statename !== undefined && res.data.addressData[0].statename !== null && res.data.addressData[0].statename !== '') ? res.data.addressData[0].statename : '',
                            cityShown: res.data.addressData[0].City,
                            postalcode: res.data.addressData[0].PostalCode,
                            phoneList: phones,
                            emailList: emails,
                            contactPreference: (res.data.personData[0].IsOkToContact.data[0] === 1) ? 'oktocontact' : 'donotcontact',
                            contactModes: contactModes,
                            docdeliverySelected: res.data.personData[0].DocumentDelivery,
                            userNote: res.data.personData[0].Note,
                            mobile: phonestr,
                            fullName: res.data.personData[0].OrganizationName
                        });
                    } else {

                    }
                } else {
                    console.log("error in get data");
                }
            }).catch(err => {
                console.log("err", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    formatPhone = (ph) => {
        let phone;
        if (ph.CountryCode && ph.CountryCode !== '' && ph.CountryCode !== undefined && ph.CountryCode !== null) {
            if (ph.AreaCode && ph.AreaCode !== '' && ph.AreaCode !== undefined && ph.AreaCode !== null) {
                // phone = ph.CountryCode + ' ' + ph.AreaCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
                phone = ph.CountryCode + ' ' + ph.AreaCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
            } else {
                // phone = ph.CountryCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
                phone = ph.CountryCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
            }
        } else {
            if (ph.AreaCode && ph.AreaCode !== '' && ph.AreaCode !== undefined && ph.AreaCode !== null) {
                // phone = ph.AreaCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
                phone = ph.AreaCode + ' ' + CommonConfig.formatPhoneNumber(ph.PhoneNumber);
            } else {
                // phone = CommonConfig.formatPhoneNumber(ph.PhoneNumber);
                phone = CommonConfig.formatPhoneNumber(ph.PhoneNumber);
            }
        }
        return phone;
    }

    toggleCustom = (tab) => {
        const prevState = this.state.custom;
        const state = prevState.map((x, index) => tab === index ? !x : false);
        this.setState({ custom: state, isExpand: false });
    }

    toggleAll = (toggleType) => {
        const prevState = this.state.custom;
        if (toggleType === 'expand') {
            const state = prevState.map((x, index) => x = true);
            this.setState({ custom: state, isExpand: true });
        } else {
            const state = prevState.map((x, index) => x = false);
            this.setState({ custom: state, isExpand: false });
        }
    }

    editContacts(state) {
        // debugger;
         if(this.state.selectedContactName == "Client"){
            this.setState({
                showModal: true, selectedRecord: state,
                arrayToDisplay: (this.state.isCompany === 'Individual') ? this.state.personQuestion : this.state.organizationQuestion
            });
         }else{
            let id = state.id;
            let entityType = state.entityType;
            this.props.history.push({
                pathname: '/editContactDetails/' + id + '/' + entityType,
                state: {
                    id: id,
                    entityType: entityType
                }
            });
         }
         // old code 
        // if (this.state.isInternalStaff) {
        //     let id = state.id;
        //     let entityType = state.entityType;
        //     this.props.history.push({
        //         pathname: '/editContactDetails/' + id + '/' + entityType,
        //         state: {
        //             id: id,
        //             entityType: entityType
        //         }
        //     });
        // } else {
        //     this.setState({
        //         showModal: true, selectedRecord: state,
        //         arrayToDisplay: (this.state.isCompany === 'Individual') ? this.state.personQuestion : this.state.organizationQuestion
        //     });
        // }
    }

    reset = () => {
        this.setState({
            showModal: false, selectedRecord: '', verificationArray: [],
            note: '', selected1: false, selected2: false, selected3: false
        });
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

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    selectType = (value, type, i) => {
        if (value === '') {
            this.show(type, true);
            if (i === 0) this.setState({ selected1: false });
            if (i === 1) this.setState({ selected2: false });
            if (i === 2) this.setState({ selected3: false });
        } else if (value === 'Incorrect') {
            if (i === 0) this.setState({ selected1: false });
            if (i === 1) this.setState({ selected2: false });
            if (i === 2) this.setState({ selected3: false });
        } else {
            this.show(type, false);
            if (i === 0) this.setState({ selected1: true });
            if (i === 1) this.setState({ selected2: true });
            if (i === 2) this.setState({ selected3: true });
        }
    }

    goToEdit = () => {
        const { t } = this.props;
        try {
            let selectedValues = 0;
            if (this.state.selected1) selectedValues++;
            if (this.state.selected2) selectedValues++;
            if (this.state.selected3) selectedValues++;

            let checkValid = true;
            if (this.state.entityType.toLowerCase() === 'person') {
                if (selectedValues === 0 || selectedValues === 1) {
                    checkValid = false;
                    toast.error(t("contactDetails:ViewPage.SelectAnswerError"));
                } else if (selectedValues < 3 && CommonConfig.isEmpty(this.state.note)) {
                    checkValid = false;
                    toast.error(t("contactDetails:ViewPage.AddCommentError"));
                }
            } else {
                if (selectedValues === 0) {
                    checkValid = false;
                    toast.error(t("contactDetails:ViewPage.SelectAnswerError"));
                } else if (selectedValues < 2 && CommonConfig.isEmpty(this.state.note)) {
                    checkValid = false;
                    toast.error(t("contactDetails:ViewPage.AddCommentError"));
                }
            }

            // if(selectedValues < 2){
            //     toast.error(t("contactDetails:ViewPage.SelectAnswerError"));
            // }else if(selectedValues === 2 && this.state.note.trim() === ''){
            //     toast.error(t("contactDetails:ViewPage.AddCommentError"));
            // }else if((selectedValues === 2 && this.state.note.trim() !== '') || (selectedValues === 3)){

            if (checkValid) {
                let id = this.state.selectedRecord.id;
                let entityType = this.state.selectedRecord.entityType;

                let data = {
                    verificationArray: this.state.verificationArray,
                    isCorrect: true,
                    note: this.state.note,
                    id: id
                }

                api.post('api/addVerificationDetails', data).then(res => {
                    if (res.success) {
                        if (res.data.success) {
                            this.reset();
                            toast.success(res.data.message);

                            this.props.history.push({
                                pathname: '/editContactDetails/' + id + '/' + entityType,
                                state: {
                                    id: id,
                                    entityType: entityType
                                }
                            });
                        } else {

                        }
                    } else {
                        toast.error('User verification failed');
                    }
                }).catch(err => {
                    console.log("err", err);
                });
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    goBack = () => {
        this.props.history.push({
            pathname: '/contactList'
        });
        // this.props.history.push('/contactList');
    }

    render() {
        const { t } = this.props;
        const EditButton = t("buttons.Edit");
        const BackButton = t("buttons.Back");

        return (
            <div className="animated fadeIn">
                <div className="main-content">
                    <Container>
                        <Row>
                            <Col md="12">
                                <b style={{ marginRight: 20 }}>Contact# {this.state.contactcode}</b>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            {(this.state.fullName != "") ? (
                                <Col md="12" style={{ marginBottom: 10 }}>
                                    <SidebarNav contactEntityType={this.props.match.params.entityType}
                                        contactEntityId={this.props.match.params.id}
                                        contactName={this.state.fullName}
                                        NavPage="User" NavID={this.props.match.params.id} {...this.props} />
                                </Col>
                            ) : (null)}
                            <Col md="2">
                                <div className="profile-img">
                                    <img src={(this.state.userImg && this.state.userImg !== '') ? this.state.userImg : userDefaultImg} alt="user_profile_image" width="100%" height="auto" />
                                </div>
                            </Col>

                            <Col md="8">
                                {(this.state.isCompany === 'Individual') ?
                                    (
                                        <div>
                                            <div className="row">
                                                <h2>
                                                    <b>{this.state.titleName} {this.state.forename} {this.state.surname}</b>
                                                </h2>
                                                <span style={{ margin: 10 }}>({this.state.selectedContactName})</span>

                                                <span style={{ margin: 10 }}>
                                                    <i className="fa fa-phone" style={{ marginRight: 5 }}></i>
                                                    {this.state.mobile}
                                                </span>

                                                <span style={{ margin: 10 }}>
                                                    <i className="fa fa-envelope" style={{ marginRight: 5 }}></i>
                                                    {(this.state.emailList[0] !== undefined) ? this.state.emailList[0].Email : ''}
                                                </span>
                                            </div>

                                            <div>
                                                <span>{this.state.businesstypeShown}</span>
                                            </div>

                                            <div>
                                                <span>{this.state.companyname}</span>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-2">
                                                    {t("contactDetails:Gender")}: {this.state.gender}
                                                </div>
                                                {(this.state.isInternalStaff) ? (null) : (
                                                    <div className="col-md-4">
                                                        {t("contactDetails:DOB.label")}: {this.state.dob}
                                                    </div>
                                                )}
                                                <div className="col-md-4">
                                                    {t("contactDetails:Salutation.label")}: {this.state.salutation}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="row">
                                                <h2>
                                                    <b>{this.state.companyname}</b>
                                                </h2>

                                                <span style={{ margin: 10 }}>({this.state.selectedContactName})</span>

                                                <span style={{ margin: 10 }}>
                                                    <i className="fa fa-phone" style={{ marginRight: 5 }}></i>
                                                    {this.state.mobile}
                                                </span>

                                                <span style={{ margin: 10 }}>
                                                    <i className="fa fa-envelope" style={{ marginRight: 5 }}></i>
                                                    {(this.state.emailList[0] !== undefined) ? this.state.emailList[0].Email : ''}
                                                </span>
                                            </div>

                                            <div>
                                                <span>{this.state.businesstypeShown}</span>
                                            </div>

                                            <div>
                                                <span>{this.state.companyIdentifier}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </Col>

                            <Col md="2" style={{ textAlign: "right" }}>

                                <Button style={{ marginRight: 5 }} color="primary" onClick={() => this.editContacts(this.state)}>
                                    <i className="fa fa-pencil" style={{ marginRight: 5 }}></i>
                                    {EditButton}
                                </Button>

                                <Button color="primary" onClick={() => this.goBack()}>
                                    <i className="fa fa-angle-left"></i>
                                    {BackButton}
                                </Button>

                            </Col>
                        </Row>

                        <Card style={{ marginTop: 10 }}>
                            <CardBody>
                                <div className="text-right" style={{ marginBottom: 5 }}>
                                    <Button color="primary" title={(this.state.isExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
                                        onClick={(this.state.isExpand) ? () => this.toggleAll('collapse') : () => this.toggleAll('expand')}
                                    >
                                        <i className={(this.state.isExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
                                    </Button>
                                </div>

                                <div id="accordion">
                                    <Card className="mb-0">
                                        <CardHeader id="headingOne">
                                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(0)} aria-expanded={this.state.custom[0]} aria-controls="collapseOne">
                                                <h5 className="m-0 p-0">
                                                    {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                    {t("contactDetails:ViewPage.ContactDetails")}
                                                    <i style={{ float: 'right' }} className={this.state.custom[0] ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                </h5>
                                            </Button>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.custom[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                            <CardBody>
                                                <Row>
                                                    <Col md="4">
                                                        <span>
                                                            <i className="fa fa-phone-square" style={{ marginRight: 10 }}></i>
                                                            <b>{t("contactDetails:PhoneHeader")}</b>
                                                        </span>

                                                        <Row>
                                                            <Col md="12">
                                                                <div style={{ marginTop: 10 }} className="input-box">
                                                                    <table className="added-detail-table">
                                                                        <thead></thead>

                                                                        <tbody>
                                                                            {this.state.phoneList.map((ph, i) => {
                                                                                return (
                                                                                    <tr key={i}>
                                                                                        <td>
                                                                                            <span>
                                                                                                {ph.phonetypeName}
                                                                                            </span>
                                                                                        </td>

                                                                                        <td>
                                                                                            <span>
                                                                                                {this.formatPhone(ph)}
                                                                                                {(ph.IsPreferred.data[0] === 1) ?
                                                                                                    (<i style={{ marginLeft: 10 }} title={t("contactDetails:PhonePrimary")} className="fa fa-check-circle"></i>) : null
                                                                                                }
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col md="4">
                                                        <span>
                                                            <i className="fa fa-envelope-square" style={{ marginRight: 10 }}></i>
                                                            <b>{t("contactDetails:EmailHeader")}</b>
                                                        </span>

                                                        <Row>
                                                            <Col md="12">
                                                                <div style={{ marginTop: 10 }} className="input-box">
                                                                    <table className="added-detail-table">
                                                                        <thead></thead>

                                                                        <tbody>
                                                                            {this.state.emailList.map((email, i) => {
                                                                                return (
                                                                                    <tr key={i}>
                                                                                        <td>
                                                                                            <span>{email.EmailTypeName}</span>
                                                                                        </td>
                                                                                        <td>
                                                                                            <span>
                                                                                                {email.Email}
                                                                                                {(email.IsPreferred.data[0] === 1) ?
                                                                                                    (<i style={{ marginLeft: 10 }} title={t("contactDetails:EmailPrimary")} className="fa fa-check-circle"></i>) : null
                                                                                                }
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    {(this.state.isInternalStaff) ? (null) : (
                                                        <Col md="4">
                                                            <span>
                                                                <i className="fa fa-map-marker" style={{ marginRight: 10 }}></i>
                                                                <b>{t("contactDetails:Address")}</b>
                                                            </span>

                                                            <Row>
                                                                <Col md="12">
                                                                    <p>
                                                                        {this.state.addrline1}<br />
                                                                        {((!CommonConfig.isEmpty(this.state.addrline2) && !CommonConfig.isEmpty(this.state.addrline3)) ?
                                                                            (this.state.addrline2, this.state.addrline3) :
                                                                            ((!CommonConfig.isEmpty(this.state.addrline2) && CommonConfig.isEmpty(this.state.addrline3)) ?
                                                                                (this.state.addrline2) :
                                                                                ((CommonConfig.isEmpty(this.state.addrline2) && !CommonConfig.isEmpty(this.state.addrline3)) ?
                                                                                    (this.state.addrline3) : null)))
                                                                        }
                                                                        {(CommonConfig.isEmpty(this.state.addrline2) && CommonConfig.isEmpty(this.state.addrline3)) ?
                                                                            null : <br />
                                                                        }
                                                                        {this.state.cityShown}<br />
                                                                        {this.state.stateShown}<br />
                                                                        {this.state.addrCountryShown} <br />
                                                                        {this.state.postalcode}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    )}
                                                </Row>

                                                {(this.state.isInternalStaff) ? (null) : (
                                                    <Row>
                                                        <Col md="2">
                                                            <span><b>{t("contactDetails:ContactPreference")}</b></span>
                                                        </Col>
                                                        <Col md="2">
                                                            <span>{(this.state.contactPreference == 'oktocontact' ? t("contactDetails:OktoContact") : t("contactDetails:DonotContact"))}</span>
                                                        </Col>
                                                    </Row>
                                                )}

                                                {(this.state.isInternalStaff) ? (null) : (
                                                    <Row>
                                                        <Col md="2">
                                                            <span><b>{t("contactDetails:ContactMode")}</b></span>
                                                        </Col>
                                                        {this.state.contactModes.map((cm, i) => {
                                                            if (cm.isSelected) {
                                                                return (
                                                                    //   <div key={i}>
                                                                    //     <p>{cm.stringmapname}</p> 
                                                                    //   </div>
                                                                    <Col md="2" key={i}>
                                                                        <p>{cm.stringmapname}</p>
                                                                    </Col>
                                                                )
                                                            }
                                                        })
                                                        }
                                                    </Row>
                                                )}

                                                {(this.state.isInternalStaff) ? (null) : (
                                                    <Row>
                                                        <Col md="2">
                                                            <span><b>{t("contactDetails:DocumentDelivery.label")}</b></span>
                                                        </Col>
                                                        <Col md="10">
                                                            <span>
                                                                {(this.state.docdeliverySelected == 'both' ?
                                                                    (<div className="row">
                                                                        <div className="col-md-2">
                                                                            {t("contactDetails:DocumentDelivery.Email")}
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            {t("contactDetails:DocumentDelivery.Post")}
                                                                        </div>
                                                                    </div>) :
                                                                    (this.state.docdeliverySelected == 'email') ?
                                                                        (<div className="row">
                                                                            <div className="col-md-2">
                                                                                {t("contactDetails:DocumentDelivery.Email")}
                                                                            </div>
                                                                        </div>) :
                                                                        (<div className="row">
                                                                            <div className="col-md-2">
                                                                                {t("contactDetails:DocumentDelivery.Post")}
                                                                            </div>
                                                                        </div>)
                                                                )}
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                )}

                                            </CardBody>
                                        </Collapse>
                                    </Card>

                                    {(this.state.isCompany === 'Individual') ? (
                                        (this.state.isInternalStaff) ? (null) : (
                                            <Card className="mb-0">
                                                <CardHeader id="headingTwo">
                                                    <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(1)} aria-expanded={this.state.custom[1]} aria-controls="collapseTwo">
                                                        <h5 className="m-0 p-0">
                                                            {t("contactDetails:ViewPage.PassportDetails")}
                                                            <i style={{ float: 'right' }} className={this.state.custom[1] ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                        </h5>
                                                    </Button>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.custom[1]} data-parent="#accordion" id="collapseTwo">
                                                    <CardBody>
                                                        <Row>
                                                            <Col md="3">
                                                                <span><b>{t("contactDetails:PassportNumber.label")}</b></span>
                                                            </Col>
                                                            <Col md="2">
                                                                <span>{this.state.passportno}</span>
                                                            </Col>
                                                            <Col md="3">
                                                                <span><b>{t("contactDetails:PassportCountry.label")}</b></span>
                                                            </Col>
                                                            <Col md="2">
                                                                <span>{this.state.countryShown}</span>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        )
                                    ) : null
                                    }

                                    {CommonConfig.isEmpty(this.state.userNote) ?
                                        null : (
                                            <Card className="mb-0">
                                                <CardHeader id="headingThree">
                                                    <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(2)} aria-expanded={this.state.custom[2]} aria-controls="collapseThree">
                                                        <h5 className="m-0 p-0">
                                                            {t("contactDetails:ViewPage.NoteDetails")}
                                                            <i style={{ float: 'right' }} className={this.state.custom[2] ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                        </h5>
                                                    </Button>
                                                </CardHeader>
                                                <Collapse isOpen={this.state.custom[2]} data-parent="#accordion" id="collapseThree">
                                                    <CardBody>
                                                        <Row>
                                                            <Col md="3">
                                                                <span>{t("contactDetails:Notes.label")}</span>
                                                            </Col>
                                                            <Col md="9">
                                                                <p>{this.state.userNote}</p>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        )
                                    }
                                </div>
                            </CardBody>
                        </Card>

                    </Container>

                    <Modal toggle={() => this.reset()} isOpen={this.state.showModal}>
                        <ModalHeader toggle={() => this.reset()}>
                            {t("contactDetails:ViewPage.ModalHeader")}
                        </ModalHeader>

                        <ModalBody>
                            {this.state.arrayToDisplay.map((que, i) => {
                                return (
                                    <div className="input-box rc-box" key={i}>
                                        <div className="rc-inline">
                                            <Row>
                                                <Col md="4">
                                                    <label>{que.StringMapName}</label>
                                                </Col>

                                                <Col md="5">
                                                    <label>{this.state.selectedRecord[que.StringMapKey.toLowerCase()]}</label>
                                                </Col>

                                                <Col md="3">
                                                    <Input type="select" name={que.StringMapKey} id={que.StringMapKey} className=""
                                                        onChange={(e) => this.selectType(e.target.value, e.target.name, i)}
                                                    >
                                                        <option value=''>{t("contactDetails:ViewPage.OptionDefault")}</option>
                                                        <option value='Correct'>{t("contactDetails:ViewPage.OptionCorrect")}</option>
                                                        <option value='Incorrect'>{t("contactDetails:ViewPage.OptionIncorrect")}</option>
                                                    </Input>
                                                    <em className="error invalid-feedback">{t("contactDetails:ViewPage.OptionError")}</em>
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
                                            <label>{t("contactDetails:ViewPage.CommentLabel")}</label>
                                        </Col>

                                        <Col md="8">
                                            <Input name="note" type="textarea" id="note" className="" maxLength="500"
                                                value={this.state.note} onChange={e => this.handleChange(e)}
                                            />
                                            <em className="error invalid-feedback" >{t("contactDetails:ViewPage.CommentErrorBlank")}</em>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" onClick={() => this.reset()}>
                                <i className="fa fa-close"></i>
                                {t("contactDetails:ViewPage.VerificationFailed")}
                            </Button>
                            <Button color="success" onClick={() => this.goToEdit()}>
                                <i className="fa fa-check"></i>
                                {t("contactDetails:ViewPage.VerificationDone")}
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {/* </Container> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(ViewContactDetails);
