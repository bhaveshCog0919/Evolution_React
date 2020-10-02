import React, { Component } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Label
} from "reactstrap";
import Select from 'react-select';
import api from "../../../utils/apiClient";
import APIConstant from "../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import mapimg from '../../../assets/img/gt-map.png';
import moment from 'moment';
import { CommonConfig } from '../../../utils/constants';
import { withTranslation } from 'react-i18next';

class GetQuote extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            

            // -----------------------------------------------------------
            // Default value
            isQuote: '1',
            languageid: 'en-IE',
            Status: 'Active',
            PolicyStatus: 'Quotation',

            boatUse: '',
            boatUseError: true,
            CurrentUser: 'SystemGetQuote', //ask sir
            // Default value
            // -----------------------------------------------------------
            // User
            contactCode: '', //From SP
            contactType: 'Client',
            fullName: '',
            fullNameError: true,

            foreName: '',
            surName: '',

            emailType: 'Personal',
            email: '',
            emailError: true,


            phoneType: 'Mobile',
            countryCodeArray: [],
            country: '',
            countryCode: '',
            isPreferred: 1,
            countryShown: '',
            countryError: true,
            countryflag: '',
            countrycodeError: true,

            phoneNumber: '',
            phoneNumberError: true,

            addrLine1: '',
            // -----------------------------------------------------------
            //Policy
            policyNumber: '',
            entityType: 'Person',
            refer: false,
            policyCountry: '',
            policyType: 'Vessel',
            docLang: '',
            currency: '',
            policyEffectiveDate: moment().format('YYYY-MM-DD'),
            renewalDate: moment().add(365, 'days').format('YYYY-MM-DD'),
            PolicyDepartment: 'Direct',
            source: '',
            binder: '',
            rate: '',
            ratingType: '',
            excess: '',
            premium: '',
            levy: '',
            adminFee: '',
            // Policy
            // -----------------------------------------------------------
            //Vessel
            vesselClassName: '',
            vesselClassNameError: true,
            vesselClass: '',
            

            vesselType: '',
            vesselName: '',
            UseofVessel: '',
            hullMaterial: 'GRP',
            makeAndModel: '',
            length: 0,
            vesselBuildType: 'Production',
            lastSurveyDate: '',
            surveyDueDate: '',
            
            yearBuilt: '',
            yearBuiltError: true,

            yearPurchased: '',
            purchasePrice: 0, //Beacuse of Sp error

            sumInsured: '',
            sumInsuredError: true,

            sumInsuredMethod: 'Market Value',

            whereReg: '',
            whereRegError: true,

            mooringType: '',
            mooringTypeList: [],
            mooringTypeError: true,

            //Vessel
            // -----------------------------------------------------------
            // Engine & Trailer Details
            mainEngine: '',
            mainEngineHp: '',
            mainEngineYear: '',
            mainEngineSerialNo: '',
            noOfMainEngine: '',
            tarnsmissionMainEngine: '',
            auxiliaryEngine: '',
            auxiliaryEngineHp: '',
            auxiliaryEngineYear: '',
            auxiliaryEngineSerialNo: '',
            noOfAuxiliaryEngine: '',
            auxiliaryEngineTransmission: '',
            maxSpeed: 0,
            makeofTrailer: '',
            trailerSerialNo: '',
            // Engine & Trailer Details
            // -----------------------------------------------------------
            // Navigational Limits
            cruisingRange: '',
            additionalCruisingRange: '',
            // Navigational Limits
            // -----------------------------------------------------------
            // General Questions
            PreviousBoatingExperience: '',
            
            CurrentNCBYears: '',
            CurrentNCBYearsError: true,

            previousInsurer: "",
            previousPolicyNo: "",
            boatingQualifications: '',
            losses: '',
            lossesDescribe: '',
            convicted: '',
            convictedDescribe: '',
            insurancecanceled: '',
            insurancecanceledDescribe: '',
            damaged: '',
            damagedDescribe: '',
            // General Questions
            // -----------------------------------------------------------
            // Limits / Additional Cover
            thirdPartyLiability: '',
            waterSkiingLiability: '',
            waterToysLiability: '',
            sailRacingCoverage: '',
            racingEventType: '',
            crewLiability: '',
            // Limits / Additional Cover
        };
    }

    componentDidMount() {
        this.getCountry();
        this.getUrlBaseCountry();
        this.getMooringNameAndTypeSeperated();
        this.getNextPolicyNumer();
    }

    getNextPolicyNumer() {
        api.post(APIConstant.path.getNextPolicyNumer).then(res => {
            if (res.success) {
                var tempPolicyNumber = '';
                console.log('getNextPolicyNumer', res.data[0].PolicyNumber);
                tempPolicyNumber = res.data[0].PolicyNumber + 1;
                console.log('tempPolicyNumber', tempPolicyNumber);

                this.setState({ policyNumber: tempPolicyNumber });
            }
        })
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

    getUrlBaseCountry() {
        var splitData = this.props.location.pathname.split("/");
        var whereReg = '';
        var PolicyCountry = '';
        var PolicyLanguage = '';
        var currency = '';
        var ThirdPartyLiability = '';
        var LanguageId = '';
        var whereRegError = true;
        if (splitData[2] !== undefined) {
            PolicyCountry = splitData[2] || '';
        } else {
            PolicyCountry = 'Ireland';
        }
        console.log('PolicyCountry', PolicyCountry);
        if (PolicyCountry == 'Ireland') {
            PolicyLanguage = 'English';
            whereReg = 'Ireland';
            whereRegError = false;
            ThirdPartyLiability = 3000000;
            LanguageId = 'en-GB';
        } else if (PolicyCountry == 'Spain') {
            whereReg = 'Spain';
            whereRegError = false;
            PolicyLanguage = 'Spanish';
            ThirdPartyLiability = 500000;
            LanguageId = 'es-ES';
        }
        currency = 'EUR';
        this.setState({ policyCountry: PolicyCountry, whereReg: whereReg, whereRegError: whereRegError, docLang: PolicyLanguage, thirdPartyLiability: ThirdPartyLiability, currency: PolicyCountry, languageid: LanguageId });
    }

    getMooringNameAndTypeSeperated() {
        const data = {
            zone: 'Irish Website',
        };
        api.post(APIConstant.path.getMooringNameAndTypeSeperated, data).then(res => {
            if (res.success) {
                console.log('getMooringNameAndTypeSeperated',res.data);
                var formattedData = [];
                for (let i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        label: res.data[i].MoringNameType,
                        value: res.data[i].MooringGuideId,
                    })
                }
                this.setState({ mooringTypeList: formattedData });
            }
        }).catch(err => {

        });
    }

    getVesselClassIdFromName(vesselClassName) {
        try {
            const data = {
                class: vesselClassName
            };
            api.post(APIConstant.path.getVesselClassIdFromName, data).then(res => {
                if (res.success) {
                    var vesselClassId = res.data[0].VesselClassId;
                    var vesselTypeName = CommonConfig.getFixedVesselTypeFromVesselClassName(vesselClassName);
                    const data = {
                        classId: vesselClassId,
                        type: vesselTypeName,
                    };
                    api.post(APIConstant.path.getVesselTypeIdFromNameandClassId, data).then(res => {
                        if (res.success) {                           
                            this.setState({vesselClass: vesselClassId, vesselType: res.data[0].VesselTypeId});
                        } else {
        
                        }
                    }).catch(err => {
        
                    });        
                } else {

                }
            }).catch(err => {

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    onRadioBtnClick(radioType, radioSelected) {
        if (radioType === 'whereReg') {
            var CrusingRange = CommonConfig.GetFixedCrusingRange(this.state.boatUse, radioSelected);
            this.setState({ whereReg: radioSelected, whereRegError: false, cruisingRange: CrusingRange });
        }
        if (radioType === 'vesselClassName') {
            this.getVesselClassIdFromName(radioSelected);
            this.setState({ vesselClassName: radioSelected, vesselClassNameError: false });
        }
        if (radioType === 'boatUse') {
            var CrusingRange = CommonConfig.GetFixedCrusingRange(radioSelected, this.state.whereReg);
            this.setState({ boatUse: radioSelected, boatUseError: false, cruisingRange: CrusingRange });
        }
        if (radioType === 'CurrentNCBYears') {
            this.setState({ CurrentNCBYears: radioSelected, CurrentNCBYearsError: false });
        }
    }

    handleChange = e => {
        const { t } = this.props;
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'yearBuilt') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ yearBuiltError: true });
                this.show("yearBuilt", true, "yearBuiltError", "Please enter year built");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                var minYear = moment().subtract(100, 'year').format('YYYY');
                var maxYear = moment().year();
                if (!yearRegEx.test(year) || (year < minYear || year > maxYear)) {
                    this.setState({ yearBuiltError: true });
                    this.show("yearBuilt", true, "yearBuiltError", "Please enter valid year built");
                } else {
                    this.setState({ yearBuiltError: false, yearBuilt: e.target.value });
                    this.show("yearBuilt", false, "yearBuiltError", "");
                }
            }
        }
        if (e.target.name === 'sumInsured') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ sumInsuredError: true });
                this.show("sumInsured", true, "sumInsuredError", "Please enter sum insured");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ sumInsuredError: true });
                    this.show("sumInsured", true, "sumInsuredError", "Please enter valid sum insured");
                } else {
                    this.setState({ sumInsuredError: false, sumInsured: e.target.value });
                    this.show("sumInsured", false, "sumInsuredError", "");
                }
            }
        }
        if (e.target.name === 'email') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ emailError: true });
                this.show("email", true, "emailError", "Please enter email id");
            } else {
                let decimalRegEx = CommonConfig.RegExp.email;
                let email = e.target.value;
                if (!decimalRegEx.test(email)) {
                    this.setState({ emailError: true });
                    this.show("email", true, "emailError", "Please enter valid email");
                } else {
                    this.setState({ emailError: false, email: e.target.value });
                    this.show("email", false, "emailError", "");
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
        if (e.target.name === 'fullName') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ fullNameError: true });
                this.show("fullName", true, "fullNameError", "Please enter fullName id");
            } else {
                let decimalRegEx = CommonConfig.RegExp.nameWithSpace;
                let fullName = e.target.value;
                if (!decimalRegEx.test(fullName)) {
                    this.setState({ fullNameError: true });
                    this.show("fullName", true, "fullNameError", "Please enter valid fullName");
                } else {
                    var ForeName = (e.target.value).split(' ').slice(0, 1).join(' ');
                    var SurName = (e.target.value).split(' ').slice(1).join(' ');
                    this.setState({ fullNameError: false, fullName: e.target.value, foreName: ForeName, surName: CommonConfig.isEmpty(SurName) ? ' ' : SurName });
                    this.show("fullName", false, "fullNameError", "");
                }
            }
        }
    };

    selectType(value, type) {
        const { t } = this.props;
        if (type === 'countryCode') {
            console.log('countryCode', value);
            let selectedCountry = this.state.countryCodeArray.find(x => x.CountryCode === value);

            if (value === '') {
                this.setState({ countrycodeError: true, countryCode: value, countryflag: '', selectedCountry: '' });
                this.show('countryCode', true, "countrycodeError", t("contactDetails:CountryCode.error"));
            } else {
                this.setState({ countryCode: value, countryflag: selectedCountry.CountryFlag, countrycodeError: false, selectedCountry: selectedCountry.CountryName });
                this.show('countryCode', false, "countrycodeError", "");
            }
        }
        if (type === 'mooringType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ mooringTypeError: true, mooringType: value, mooringTypeList: [] });
                this.show("", true, "mooringTypeError", "Please select Where is boat moored");
            } else {
                this.setState({ mooringTypeError: false, mooringType: value.value });
                this.show("mooringType", false, "mooringTypeError", "");

            }
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        }
        else {
            document.getElementById(field).className = "form-control";
        }
    }

    Save() {
        console.log(this.state);        
        if (this.state.whereRegError === false &&
            this.state.vesselClassNameError === false &&
            this.state.boatUseError === false &&
            this.state.yearBuiltError === false &&
            this.state.sumInsuredError === false &&
            this.state.CurrentNCBYearsError === false &&
            this.state.emailError === false &&
            this.state.countrycodeError === false &&
            this.state.phoneNumberError === false &&
            this.state.fullNameError === false) {

            let data = {
                // Common
                IsQuote: this.state.isQuote,
                LanguageId: this.state.languageid,
                Status: this.state.Status,
                LoggedInUserId: this.state.CurrentUser,
                //User
                ContactType: this.state.contactType,
                Forename: this.state.foreName,
                SurName: this.state.surName,
                //Phone
                PhoneType: this.state.phoneType,
                CountryCode: this.state.countryCode,
                PhoneNumber: this.state.phoneNumber,
                IsPreferred: this.state.isPreferred,
                //Email
                EmailType: this.state.emailType,
                Email: this.state.email,
                //Address
                AddrLine1:this.state.addrLine1,
                // Policy
                PolicyNumber: this.state.policyNumber,
                EntityId: this.state.CurrentUser,
                EntityType: this.state.entityType,
                IsReferred: (this.state.refer == true) ? 1 : 0,
                Country: this.state.whereReg,
                PolicyType: this.state.policyType,
                DocLang: this.state.docLang,
                Currency: this.state.currency,
                InceptionDate: (this.state.policyEffectiveDate != '' && this.state.policyEffectiveDate != null) ? moment(this.state.policyEffectiveDate).format(CommonConfig.dateFormat.dbDateTime) : '',
                RenewalDate: moment(this.state.renewalDate).format(CommonConfig.dateFormat.dbDateTime),
                PolicyStatus: this.state.PolicyStatus,
                // Vessel
                VesselClass: this.state.vesselClass,
                VesselType: this.state.vesselType,
                VesselName: this.state.vesselName,
                VesselUse: this.state.UseofVessel,
                HullMaterial: this.state.hullMaterial,
                Make: this.state.makeAndModel,
                Length: this.state.length,
                BuildType: this.state.vesselBuildType,
                LastSurveyDate: (this.state.lastSurveyDate !== '' && this.state.lastSurveyDate !== null) ? moment(this.state.lastSurveyDate).format('YYYY/MM/DD') : '',
                SurveyDueDate: (this.state.surveyDueDate !== '' && this.state.surveyDueDate !== null) ? moment(this.state.surveyDueDate).format('YYYY/MM/DD') : '',
                YearBuilt: this.state.yearBuilt,
                BoatAge: new Date().getFullYear() - this.state.yearBuilt,
                YearPurchased: (this.state.yearPurchased !== '' && this.state.yearPurchased !== null) ? moment(this.state.yearPurchased).format(CommonConfig.dateFormat.yearOnly) : '',
                PurchasePrice: this.state.purchasePrice,
                SumInsured: this.state.sumInsured,
                SumInsuredMethod: this.state.sumInsuredMethod,
                // EngineTrailer 
                MainEngine: this.state.mainEngine,
                MainEngineHp: this.state.mainEngineHp,
                MainEngineYear: this.state.mainEngineYear,
                MainEngineSerialNo: this.state.mainEngineSerialNo,
                MainEngineCount: this.state.noOfMainEngine,
                MainEngineTransmission: this.state.tarnsmissionMainEngine,
                AuxiliaryEngine: this.state.auxiliaryEngine,
                AuxiliaryEngineHp: this.state.auxiliaryEngineHp,
                AuxiliaryEngineYear: this.state.auxiliaryEngineYear,
                AuxiliaryEngineSerialNo: this.state.auxiliaryEngineSerialNo,
                AuxiliaryEngineCount: this.state.noOfAuxiliaryEngine,
                AuxiliaryEngineTransmission: this.state.auxiliaryEngineTransmission,
                MaxSpeed: this.state.maxSpeed,
                MakeOfTrailer: this.state.makeofTrailer,
                TrailerSrNo: this.state.trailerSerialNo,
                // MooringNavigation
                VesselRegistrationLocation: this.state.whereReg,
                MooringGuideId: this.state.mooringType,
                CruisingRange: this.state.cruisingRange,
                AdditionalCruisingRange: this.state.additionalCruisingRange,
                // General 
                PreviousBoatingExperinceInYears: this.state.PreviousBoatingExperience,
                CurrentNCBYear: this.state.CurrentNCBYears,
                PreviousInsurer: this.state.previousInsurer,
                PreviousPolicyNumber: this.state.previousPolicyNo,
                // boatingQualificationsArr: this.state.boatingQualificationsArr,
                // BoatingQualificationsCount: this.state.boatingQualificationsArr.length,
                IsLossesInLastFiveYears: this.state.losses == "Yes" ? 1 : 0,
                LossesInLastFiveYearsDescription: this.state.lossesDescribe,
                IsConvictedOrCharged: this.state.convicted == "Yes" ? 1 : 0,
                ConvictedOrChargedDescription: this.state.convictedDescribe,
                IsInsuranceCanceledOrRefused: this.state.insurancecanceled == "Yes" ? 1 : 0,
                InsuranceCanceledOrRefusedDescription: this.state.insurancecanceledDescribe,
                IsVesselHasBeenDamaged: this.state.damaged == "Yes" ? 1 : 0,
                VesselHasBeenDamagedDescription: this.state.damagedDescribe,
                // PolicyInsured
                ThirdPartyLiabilityAmount: this.state.thirdPartyLiability,
                WaterSkiingLiabilityAmount: this.state.waterSkiingLiability,
                WaterToysLiabilityAmount: this.state.waterToysLiability,
                SailRacingCoverageAmount: this.state.sailRacingCoverage,
                RacingEventType: this.state.racingEventType,
                CrewLiability: this.state.crewLiability,
                NonRatableRatingType: this.state.ratingType,
                NonRatableRateAmount: this.state.rate,
                ExcessAmount: this.state.excess,
                MarineTradePremium: this.state.premium,
                GovtLevyAmount: this.state.levy,
                AdminFeeAmount: this.state.adminFee,
                // policyUnderwriting
                Department: this.state.PolicyDepartment,
                SourceId: this.state.source,
                BinderId: this.state.binder,
            }

            api.post('api/saveGetQuote', data).then(res => {
                console.log(this.state);
                if (res.success) {

                    toast.success('Quotation Generated successfully');
                    // this.props.history.push({
                    //     pathname: '/PolicyDetails/' + res.data.policyid + '/1',
                    //     state: {
                    //         Id: res.data.policyid,
                    //         tab: 1
                    //     }
                    // });
                } else {

                }
            }).catch(err => {

            })

        } else {
            if (this.state.whereRegError) {
                toast.error("Please select Where is your boat registered")
                return;
            }
            if (this.state.vesselClassNameError) {
                toast.error("Please select What type of boat do you want to insure")
                return;
            }
            if (this.state.boatUseError) {
                toast.error("Please select where do you want to Use your Boat")
                return;
            }
            if (this.state.yearBuiltError) {
                toast.error("Please enter year of boat built")
                return;
            }
            if (this.state.sumInsuredError) {
                toast.error("Please enter Market value of your boat")
                return;
            }
            if (this.state.CurrentNCBYearsError) {
                toast.error("Please select NCB Years")
                return;
            }
            if (this.state.emailError) {
                toast.error("Please enter Email Id")
                return;
            }
            if (this.state.countrycodeError) {
                toast.error("Please select Country Code")
                return;
            }
            if (this.state.phoneNumberError) {
                toast.error("Please enter Phone Number")
                return;
            }
            if (this.state.fullNameError) {
                toast.error("Please enter Full Name")
                return;
            }
        }
    }



    render() {
        const { t } = this.props;
        return (
            <div className="get-quote-main-outer">
                <div className="get-quote-header">
                    <div className="container">
                        <div className="gt-header-inner">
                            <div className="left-part">
                                <div className="gt-logo">
                                    <a href="https://yachtsman.ie/" className="custom-logo-link"><img src="https://yachtsman.ie/wp-content/uploads/2019/09/logo.png" className="custom-logo" alt="Yachtsman"></img></a>
                                </div>
                            </div>
                            <div className="right-part">
                                <div className="top-line">
                                    <div class="topbar-inner">
                                        <div className="dwn-btn">
                                            <a href="/wp-content/themes/yachtsman/support/YACHTSMAN_INGLES_EN_A4.pdf" target="_blank">Download Brochure</a>
                                        </div>
                                        <div className="top-free-phone">
                                            <i className="fa fa-phone"></i>
                                            <p>1800 30 4000</p>
                                            <span>(free phone)</span>
                                        </div>
                                        <div className="region">
                                            <p>Choose Region:</p>
                                            <a href="#" className="ireland"></a>
                                            <a href="#" className="uk"></a>
                                            <a href="#" className="spain"></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="gt-menu">
                                    <ul className="gt-menu-toggle">
                                        <li>
                                            <a href="https://yachtsman.ie/" className="menu-link"><span className="text-wrap">Home</span></a>
                                        </li>
                                        <li className="submenu-toggle">
                                            <a href="https://yachtsman.ie/boat-insurance/" className="menu-link sf-with-ul"><span className="text-wrap">Boat Insurance <span className="nav-arrow fa fa-angle-down"></span></span></a>
                                            <ul className="sub-menu">
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/motor-cruisers/" className="menu-link"><span className="text-wrap">Motor
                                                            Cruisers</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/yacht/" className="menu-link"><span className="text-wrap">Yacht</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/sports-boat/" className="menu-link"><span className="text-wrap">Sports Boat / Fast
                                                            Fisher</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/rib/" className="menu-link"><span className="text-wrap">Rib</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/dinghy/" className="menu-link"><span className="text-wrap">Dinghy</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/lake-boat/" className="menu-link"><span className="text-wrap">Lake Boat</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/canoe-kayak/" className="menu-link"><span className="text-wrap">Canoe / Kayak</span></a>
                                                </li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/rowing-sculls/" className="menu-link"><span className="text-wrap">Rowing
                                                            Sculls</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/jet-ski/" className="menu-link"><span className="text-wrap">Jet Ski</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/third-party-cover/" className="menu-link"><span className="text-wrap">Third
                                                            Party</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/combined-marine-trade-club-insurance/" className="menu-link"><span
                                                        className="text-wrap">Combined Marine Trade &amp; Club Insurance</span></a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/renew-your-policy/" className="menu-link"><span className="text-wrap">Renew Your Policy</span></a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/claims/" className="menu-link"><span className="text-wrap">Claims</span></a>
                                        </li>
                                        <li className="submenu-toggle">
                                            <a href="https://yachtsman.ie/help-support/" className="menu-link sf-with-ul"><span className="text-wrap">Help &amp; Support <span className="nav-arrow fa fa-angle-down"></span></span></a>
                                            <ul className="sub-menu">
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/about-us/" className="menu-link"><span className="text-wrap">About Us</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/contact-us/" className="menu-link"><span className="text-wrap">Contact Us</span></a></li>
                                                <li className="menu-item"><a
                                                    href="https://yachtsman.ie/faq/" className="menu-link"><span className="text-wrap">FAQ</span></a></li>
                                                <li className="menu-item"><a
                                                    className="menu-link"><span className="text-wrap">Useful Links</span></a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="getquote-outer">
                        <div className="gt-heading">
                            <h1>Get a Quote</h1>
                            <span className="devider"></span>
                            <p>
                                Yachtsman is one of the largest provider of boat insurance in Ireland, we’re also proud to say that we’ve been protecting the insurance needs of boaters for more than 45 years.
                            </p>
                            <p>
                                When you have a Yachtsman insurance policy you get more than boat insurance, you get a range of exclusive benefits in cover for all onboard. You see, we believe recreational boating should be safe, secure and most of all fun for everyone. So we’re committed to taking the risk out of boating so you can truly enjoy your time on the water.
                            </p>
                        </div>
                        <div className="gt-content">
                            <Row>
                                <Col md="8">
                                    <div className="gt-form">
                                        {/* <form> */}
                                        <div className="gt-input-box">
                                            <label className="label-bold">Where is your boat registered?</label>
                                            <div className="gt-radio">
                                                <div className="middle">
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="whereReg" id="whereReg" checked={(this.state.whereReg === 'Ireland') ? true : false}
                                                                value={this.state.whereReg} onChange={() => this.onRadioBtnClick('whereReg', 'Ireland')} />
                                                            <div class="front-end box">
                                                                <span>Ireland</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="whereReg" id="whereReg" checked={(this.state.whereReg === 'Spain') ? true : false}
                                                                value={this.state.whereReg} onChange={() => this.onRadioBtnClick('whereReg', 'Spain')} />
                                                            <div class="front-end box">
                                                                <span>Spain</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    {/* <div className="gtradio-box">
                                                            <label>
                                                                <input type="radio" name="whereReg" id="whereReg" checked={(this.state.whereReg === 'Germany') ? true : false}
                                                                value={this.state.whereReg} onChange={() => this.onRadioBtnClick('whereReg', 'Germany')}/>
                                                                <div class="front-end box">
                                                                    <span>Germany</span>
                                                                </div>
                                                            </label>
                                                        </div> */}
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="whereReg" id="whereReg" checked={(this.state.whereReg === 'United Kingdom') ? true : false}
                                                                value={this.state.whereReg} onChange={() => this.onRadioBtnClick('whereReg', 'United Kingdom')} />
                                                            <div class="front-end box">
                                                                <span>United Kingdom</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gt-input-box">
                                            <label className="label-bold">What type of boat do you want to insure?</label>
                                            <div className="gt-radio">
                                                <div className="middle">
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="vesselClassName" id="vesselClassName" checked={(this.state.vesselClassName === 'Motor Cruisers') ? true : false}
                                                                value={this.state.vesselClassName} onChange={() => this.onRadioBtnClick('vesselClassName', 'Motor Cruisers')} />
                                                            <div class="front-end box">
                                                                <span>Motor Cruisers</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="vesselClassName" id="vesselClassName" checked={(this.state.vesselClassName === 'Yacht') ? true : false}
                                                                value={this.state.vesselClassName} onChange={() => this.onRadioBtnClick('vesselClassName', 'Yacht')} />
                                                            <div class="front-end box">
                                                                <span>Yacht</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="vesselClassName" id="vesselClassName" checked={(this.state.vesselClassName === 'Rib') ? true : false}
                                                                value={this.state.vesselClassName} onChange={() => this.onRadioBtnClick('vesselClassName', 'Rib')} />
                                                            <div class="front-end box">
                                                                <span>RIB</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="vesselClassName" id="vesselClassName" checked={(this.state.vesselClassName === 'Sports Boat') ? true : false}
                                                                value={this.state.vesselClassName} onChange={() => this.onRadioBtnClick('vesselClassName', 'Sports Boat')} />
                                                            <div class="front-end box">
                                                                <span>Sports Boat</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gt-input-box">
                                            <label className="label-bold">Where do you want to use your boat?</label>
                                            <div className="gt-radio">
                                                <div className="middle">
                                                    {/* <div className="gtradio-box">
                                                            <label>
                                                                <input type="radio" name="use"/>
                                                                <div class="front-end box">
                                                                    <span>Non-Tidal<br></br>Waters</span>
                                                                </div>
                                                            </label>
                                                        </div>
                                                        <div className="gtradio-box">
                                                            <label>
                                                                <input type="radio" name="use"/>
                                                                <div class="front-end box">
                                                                    <span>Coastal<br></br>Waters</span>
                                                                </div>
                                                            </label>
                                                        </div> */}
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="boatUse" id="boatUse" checked={(this.state.boatUse === 'Med Waters') ? true : false}
                                                                value={this.state.boatUse} onChange={() => this.onRadioBtnClick('boatUse', 'Med Waters')} />
                                                            <div class="front-end box">
                                                                <span>Med<br></br>Waters</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="boatUse" id="boatUse" checked={(this.state.boatUse === 'Inland & Coastal UK') ? true : false}
                                                                value={this.state.boatUse} onChange={() => this.onRadioBtnClick('boatUse', 'Inland & Coastal UK')} />
                                                            <div class="front-end box">
                                                                <span>Inland &<br></br>Coastal UK</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gt-input-box">
                                            <Row>
                                                <Col md="6">
                                                    <div className="gt-text-box">
                                                        <label className="label-bold">What year was your boat built?</label>
                                                        <div className="gt-addon">
                                                            <input type="text" name="yearBuilt" id="yearBuilt" onChange={(e) => this.handleChange(e)} value={this.state.yearBuilt} placeholder="Year Built" ></input>
                                                            <i class="fa fa-check"></i>
                                                            <span>Year</span>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="gt-text-box">
                                                        <label className="label-bold">What is the Market value of your boat?</label>
                                                        <div className="gt-addon">
                                                            <input type="text" name="sumInsured" id="sumInsured" onChange={(e) => this.handleChange(e)} value={this.state.sumInsured} placeholder="Sum Insured"></input>
                                                            <em id="sumInsuredError" className="error invalid-feedback"></em>
                                                            <i class="fa fa-check"></i>
                                                            <span>TSI</span>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="gt-input-box">
                                            <div className="gt-text-box width-ext">
                                                <label className="label-bold">What is the home port of your boat?</label>
                                                <div className="gt-addon">
                                                </div>
                                                    <Select name="mooringType" id="mooringType" options={this.state.mooringTypeList} value={this.state.mooringType} onChange={(data) => this.selectType(data, 'mooringType')} placeholder="Select"/>
                                                    <em id="mooringTypeError" className="error invalid-feedback"></em>
                                                    {/* <input type="text" placeholder="Malahide Marina – Marina berth"></input> */}
                                                    <i class="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <div className="gt-input-box">
                                            <label className="label-bold">How many years of No Claim Bonus do you have?</label>
                                            <div className="gt-radio">
                                                <div className="middle num-box">
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 0) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 0)} />
                                                            <div class="front-end box">
                                                                <span>0</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 1) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 1)} />
                                                            <div class="front-end box">
                                                                <span>1</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 2) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 2)} />
                                                            <div class="front-end box">
                                                                <span>2</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 3) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 3)} />
                                                            <div class="front-end box">
                                                                <span>3</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 4) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 4)} />
                                                            <div class="front-end box">
                                                                <span>4</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === 5) ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', 5)} />
                                                            <div class="front-end box">
                                                                <span>5</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    {/* <div className="gtradio-box">
                                                        <label>
                                                            <input type="radio" name="CurrentNCBYears" id="CurrentNCBYears" checked={(this.state.CurrentNCBYears === '5+') ? true : false}
                                                                value={this.state.CurrentNCBYears} onChange={() => this.onRadioBtnClick('CurrentNCBYears', '5+')} />
                                                            <div class="front-end box">
                                                                <span>5+</span>
                                                            </div>
                                                        </label>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gt-user-detail">
                                            <div className="gt-user-input">
                                                <label className="label-bold">Email Address</label>
                                                <div className="gtu-addon">
                                                    <input type="text" name="email" id="email" onChange={(e) => this.handleChange(e)} value={this.state.email} placeholder="Email Address"></input>
                                                    <i className="fa fa-check"></i>
                                                </div>
                                            </div>
                                            <div className="gt-user-input">
                                                <label className="label-bold">Telephone Number</label>
                                                <Row>
                                                    <Col md="4">
                                                        <InputGroup className="mb-3">
                                                            {(this.state.countryflag !== '') ? (
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className={this.state.countryflag} title={this.state.selectedCountry}></i>
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                            ) : null
                                                            }
                                                            <Input type="select" name="countryCode" id="countryCode"
                                                                // onBlur={(e) => this.selectType(e.target.value, 'countryCode')}
                                                                onChange={(e) => this.selectType(e.target.value, 'countryCode')} value={this.state.countryCode}
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
                                                    </Col>
                                                    <Col md="8">
                                                        <div className="gtu-addon">
                                                            <input type="text" name="phoneNumber" id="phoneNumber" placeholder="Phone Number" onChange={(e) => this.handleChange(e)} value={this.state.phoneNumber} />
                                                            <em className="error invalid-feedback" >Please enter valid Phone Number</em>
                                                            <i className="fa fa-check"></i>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="gt-user-input">
                                                <label className="label-bold">Name</label>
                                                <div className="gtu-addon">
                                                    <input type="text" name="fullName" id="fullName" onChange={(e) => this.handleChange(e)} value={this.state.fullName} placeholder="Full Name"></input>
                                                    <i className="fa fa-check"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gt-submit">
                                            <button onClick={() => this.Save()}><i class="fa fa-anchor"></i> Get Your Quotation</button>
                                        </div>
                                        {/* </form> */}
                                    </div>
                                </Col>
                                <Col md="4">
                                    <div className="why-choose-box">
                                        <div className="wc-heading">
                                            <h2>
                                                <span><i className="fa fa-ship"></i></span>
                                                Why Choose Yachtsman
                                            </h2>
                                        </div>
                                        <div className="wc-list">
                                            <ul>
                                                <li>Uninsured Loss Recovery</li>
                                                <li>Personal Injury Pursuit</li>
                                                <li>Contract Disputes</li>
                                                <li>Navigational Prosecution Defence</li>
                                                <li>Identity Fraud</li>
                                                <li>Emergency Expenses Cover</li>
                                                <li>Mooring Fees Cover</li>
                                                <li>Temporary Replacement Costs</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="gt-map">
                                        <img src={mapimg} alt="Map Image"></img>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="get-quote-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                <div className="ftr-about">
                                    <div className="ftr-logo">
                                        <a href="https://yachtsman.ie/"><img src="https://yachtsman.ie/wp-content/uploads/2019/09/logo.png" /></a>
                                    </div>
                                    <div className="ftr-about-content">
                                        <p>
                                            M. J. O’Neill (Insurances) ltd<br></br>
                                            t/a Yachtsman Euromarine, Yachtsman Marine Insurance, Yachtsman Seguro de Barcos is regulated by the Central Bank of Ireland. A private company limited by shares.<br></br>
                                            Registered in Ireland No. 48019.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                <div className="ftr-menu">
                                    <h4>HELP & SUPPORT</h4>
                                    <ul>
                                        <li>
                                            <a href="https://yachtsman.ie/data-protection-policy/">Data Protection Policy</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/privacy-policy/">Privacy Policy</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/terms-of-business/">Terms of Business</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/web-site-terms-of-use/">Web site terms of use</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/key-facts/">Key Facts</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/about-us/">About Us</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/contact-us/">Contact Us</a>
                                        </li>
                                        <li>
                                            <a href="https://yachtsman.ie/faq/">FAQ</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                <div className="ftr-contact">
                                    <h4>CONTACT US</h4>

                                    <div className="ftr-contact-details">
                                        <p>
                                            <i className="fa fa-map-marker"></i>
                                            Abbey Moate House, Abbey Street, Naas, Co. Kildare.
                                        </p>
                                        <p>
                                            <i className="fa fa-phone"></i>
                                            1800 30 4000 or 045 982668
                                        </p>
                                        <p>
                                            <i className="fa fa-envelope"></i>
                                            info@yachtsman.ie
                                        </p>
                                    </div>

                                    <div className="ftr-followus">
                                        <h2>FOLLOW US</h2>

                                        <p>Keep in touch with us! Follow us on<br></br> Facebook & Twitter today!</p>

                                        <ul>
                                            <li>
                                                <a href=""><img src="https://yachtsman.ie/wp-content/themes/yachtsman/images/facebook.png" /></a>
                                            </li>
                                            <li>
                                                <a href=""><img src="https://yachtsman.ie/wp-content/themes/yachtsman/images/twitter.png" /></a>
                                            </li>
                                            <li>
                                                <a href=""><img src="https://yachtsman.ie/wp-content/themes/yachtsman/images/linkedin.png" /></a>
                                            </li>
                                            <li>
                                                <a href=""><img src="https://yachtsman.ie/wp-content/themes/yachtsman/images/instagram.png" /></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer_copyright">
                        <div className="container">
                            <img src="https://yachtsman.ie/wp-content/uploads/2019/09/cover-holder.png" alt="" className="footer_cover_holder" />
                            <img src="https://yachtsman.ie/wp-content/uploads/2019/09/cards.png" alt="" className="footer_card" />
                            <span className="copyright_text">All Content Copyright <i className="fa fa-copyright" aria-hidden="true"></i> 2012 yachtsman Euromarine. Powered by <a target="_blank" href="https://www.cognisun.com/">Cognisun</a></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(GetQuote);
