import React, { Component } from 'react';
import Select from 'react-select';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Col, Row, Input, Modal, ModalBody, ModalFooter, ModalHeader, Button as BTN } from 'reactstrap';
import { Button } from 'primereact/button';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig } from '../../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

class NewPolicy extends Component {
    constructor(props) {
        super(props);

        let Options = [
            { StringMapKey: "Yes", StringMapName: "Yes" },
            { StringMapKey: "No", StringMapName: "No" },
        ];

        this.state = {
            //Sagar
            //Common
            PolicyId: '',
            isInsert: true,
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            Status: 'Active',
            PolicyStatus: 'Quotation',
            LoginUserType: '',
            addOnCoverageArr: [],
            addOnCoverageCount: '',
            assumptionArr: [],
            assumptionCount: '',
            //User
            EntityId: '',
            EntityType: '',
            Policy_Holder: '',
            Policy_Holder_Email: '',
            Policy_Holder_Address: '',
            Policy_Holder_Conatct: '',
            ContactCode: '',
            // Policy
            policyNumber: '',
            policyNumberError: false,
            changePolicyNumber: false,

            refer: false,
            TPO: false,
            countryList: [],
            country: '',
            countryError: true,

            policyTypeList: [],
            policyType: '',
            policyTypeError: true,

            documentLanguageList: [],
            documentLanguage: '',
            documentLanguageError: true,

            currencyList: [],
            currency: '',
            currencyError: true,

            PolicyDepartment: '',
            departmentList: [],
            PolicyDepartmentError: true,

            source: '',
            sourceError: false,
            sourceList: [],
            sourceDisplay: false,

            rate: '',
            rateError: false,

            ratingType: '',

            excess: '',
            excessError: false,

            isShowNonRateParams: 0,

            isEditDocLang: false,
            isEditCurrency: false,
            // Policy
            // -----------------------------------------------------------
            //Vessel
            VesselClassList: [],
            vesselClass: '',
            VesselClassError: true,

            vesselTypeList: [],
            vesselType: '',
            vesselTypeError: true,

            vesselName: '',
            vesselNameError: true,

            UseofVesselList: [],
            UseofVessel: '',
            UseofVesselError: true,

            hullMaterialList: [],
            hullMaterial: '',
            hullMaterialError: true,

            makeAndModel: '',
            makeAndModelError: true,

            length: '',
            lengthError: true,

            vesselBuildType: '',
            vesselBuildTypearr: [],
            vesselBuildTypeError: true,

            lastSurveyDateRequired: false,
            lastSurveyDate: '',
            lastSurveyDateError: true,
            surveyDueDate: '',

            yearBuilt: '',
            yearBuiltError: true,
            YBuilt: '',

            yearPurchased: '',
            yearPurchasedError: true,

            purchasePrice: '',
            purchasePriceError: true,

            sumInsured: '',
            sumInsuredError: true,

            sumInsuredMethodList: [],
            sumInsuredMethod: '',
            sumInsuredMethodError: true,

            whereRegList: [],
            whereReg: '',
            whereRegError: true,

            boatMooredList: [],
            boatMoored: '',
            boatMooredError: true,

            mooringTypeList: [],
            mooringType: '',
            mooringTypeError: true,
            //Vessel
            // -----------------------------------------------------------
            // Engine & Trailer Details
            mainEngine: '',
            mainEngineError: true,

            mainEngineHp: '',
            mainEngineHpError: true,

            mainEngineYear: '',
            mainEngineYearError: true,

            mainengineSerialNoLabel: "Main Engine Serial Number",
            mainEngineSerialNo: '',
            mainEngineSerialNoError: true,

            noOfEngineList: [],

            noOfMainEngine: '',
            noOfMainEngineError: true,

            tarnsmissionMainEngine: '',
            tarnsmissionMainEngineList: [],
            tarnsmissionMainEngineError: true,

            auxiliaryEngine: '',
            auxiliaryEngineError: true,

            auxiliaryEngineHp: '',
            auxiliaryEngineHpError: true,

            auxiliaryEngineYear: '',
            auxiliaryEngineYearError: true,

            auxiliaryEngineSerialNoLabel: "Auxiliary Engine Serial Number",
            auxiliaryEngineSerialNo: '',
            auxiliaryEngineSerialNoError: true,

            noOfAuxiliaryEngine: '',
            noOfAuxiliaryEngineError: true,

            auxiliaryEngineTransmission: '',
            auxiliaryEngineTransmissionarr: [],
            auxiliaryEngineTransmissionError: true,

            maxSpeed: '',
            maxSpeedError: true,

            makeofTrailer: '',
            makeofTrailerError: true,

            trailerSerialNo: '',
            trailerSerialNoError: true,
            // Engine & Trailer Details
            // -----------------------------------------------------------
            // Navigational Limits
            cruisingRangeList: [],
            cruisingRange: '',
            cruisingRangeError: true,

            additionalCruisingRange: '',
            additionalCruisingRangeError: true,
            // Navigational Limits
            // -----------------------------------------------------------
            // General Questions
            PreviousBoatingExperienceList: [],
            PreviousBoatingExperience: '',
            PreviousBoatingExperienceError: true,

            CurrentNCBYearsList: [],
            CurrentNCBYears: '',
            CurrentNCBYearsError: true,

            previousInsurerList: [],
            previousInsurer: "",
            previousInsurerError: false,

            previousPolicyNo: "",
            previousPolicyNoError: false,

            boatingQualifications: '',
            boatingQualificationsArr: [],
            boatingQualificationsError: true,
            boatingQualificationList: [],
            boatingQualificationAllList: [],

            Options: Options,

            losses: '',
            lossesError: true,
            lossesDescribe: '',
            lossesDescribeError: true,
            showLossesDescribe: false,

            convicted: '',
            convictedError: true,
            convictedDescribe: '',
            convictedDescribeError: true,
            showconvictedDescribe: false,

            insurancecanceled: '',
            insurancecanceledError: true,
            insurancecanceledDescribe: '',
            insurancecanceledDescribeError: true,
            showinsurancecanceledDescribe: false,

            damaged: '',
            damagedError: true,
            damagedDescribe: '',
            damagedDescribeError: true,
            showdamagedDescribe: false,
            // General Questions
            // -----------------------------------------------------------
            // Limits / Additional Cover
            DisplayWater: 0,
            DisplayRacing: 0,
            DisplayCrew: 0,

            ThirdPartyLiabilityList: [],
            thirdPartyLiability: '',
            thirdPartyLiabilityError: true,

            isWaterSkiing: false,
            waterSkiingLiability: '',
            systemWaterSkiingLiability: '',

            isWaterToys: false,
            waterToysLiability: '',
            systemWaterToysLiabiility: '',

            isSailRacing: false,
            sailRacingCoverage: '',

            RacingEventTypeList: [],
            racingEventType: '',
            racingEventTypeError: true,

            CrewLiabilityList: [],
            crewLiability: '',
            crewLiabilityError: true,

            policyEffectiveDate: '',
            renewalDate: '',
            policyEffectiveDateError: true,
            // Limits / Additional Cover
            // PolicySumInsured
            conditionalVessel: 1,
            conditionalEngine: 1,
            conditionalNavigation: 1,
            conditionalGeneral: 1,
            conditionalLimits: 1,

            binderList: [],
            binder: '',
            binderError: true,

            premium: '',
            premiumError: true,

            levy: '',
            levyError: true,

            adminFee: '',
            adminFeeError: true,

            total: '',
            // PolicySumInsured
            binder: '',
            binderError: false,

            premium: '',
            premiumError: false,

            levy: '',
            levyError: false,

            adminFee: '',
            adminFeeError: false,
            // PolicySumInsured
            AssumptionAndTerms: false,
            AssumptionAndTermsError: false,
            sumInsuredMethodList: [],
            CrewLiabilityList: [],
            RacingEventTypeList: [],
            ThirdPartyLiabilityList: [],
            //Sagar
        };
    }

    componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getPolicyContactDetails(this.props.match.params.Id);
            if (this.props.match.params.PolicyId && this.props.match.params.PolicyId !== undefined) {
                //get policy details
                this.setState({ PolicyId: this.props.match.params.PolicyId, isInsert: false });
            } else {
                this.setState({ isEditDocLang: true, isEditCurrency: true, country: '', policyType: "Vessel", documentLanguage: "English", currency: "EUR", policyEffectiveDate: moment().format('YYYY-MM-DD'), renewalDate: moment().add(365, 'days').format('YYYY-MM-DD'), PolicyDepartment: 'Direct', countryError: false, documentLanguageError: false, policyTypeError: false, currencyError: false, policyEffectiveDateError: false, PolicyDepartmentError: false, sumInsuredMethod: 'Market Value', sumInsuredMethodError: false });
                setTimeout(() => {
                    let ThirdPartyStringMapType = CommonConfig.ThirdPartyStringMapOnCountry(this.state.country);
                    this.getDropDownValues(ThirdPartyStringMapType, 'ThirdPartyLiabilityList', 'SortOrder');
                }, 500);
            }
        }
        let userType = CommonConfig.loggedInUserData().ContactType;
        this.setState({ LoginUserType: userType });
        this.setState({ AssumptionAndTerms: (userType == "InternalStaff") ? true : false })
        this.boatingQualificationDropdown();
        this.getMooringZones();
        this.getDropdown();
        this.getWaterSkiiAndWaterToys();
        this.getCruisingRangeList();
        this.getBoatRegisterList();
        this.getNextPolicyNumer();

        this.getDropDownValues('PREVIOUSBOATINGEXPERIENCE', 'PreviousBoatingExperienceList', 'SortOrder');
        this.getDropDownValues('PREVIOUSINSURER', 'previousInsurerList', 'StringMapName');
        this.getDropDownValues('CURRENTNCBYEARS', 'CurrentNCBYearsList', 'SortOrder');
        this.getDropDownValues('SUMINSUREDMETHOD', 'sumInsuredMethodList', 'StringMapName');
        this.getDropDownValues('BOATINGQUALIFICATIONS', 'boatingQualificationAllList', 'StringMapName');
        this.getDropDownValues('CREWLIABILITY', 'CrewLiabilityList', 'SortOrder');
        this.getDropDownValues('RACINGEVENTTYPE', 'RacingEventTypeList', 'StringMapName');
        this.getDropDownValues('NOOFENGINES', 'noOfEngineList', 'StringMapName');
        this.getDropDownValues('TRANSMISSIONS', 'tarnsmissionMainEngineList', 'StringMapName');
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
        this.getDropDownValues('POLICYTYPE', 'policyTypeList', 'StringMapName');
        this.getDropDownValues('HULLMATERIAL', 'hullMaterialList', 'StringMapName');
        this.getDropDownValues('TYPEOFBUILD', 'vesselBuildTypearr', 'StringMapName');
        this.getDropDownValues('POLICYDEPARTMENT', 'departmentList');
    }

    getPolicyContactDetails(id) {
        const data = { id: id };
        this.setState({ EntityId: id });
        api.post('api/getContactList', data).then(res => {
            if (res.success) {
                console.log("getContactList", res.data);
                this.setState({
                    Policy_Holder: res.data[0].fullname,
                    Policy_Holder_Email: res.data[0].Email,
                    Policy_Holder_Address: (CommonConfig.isEmpty(res.data[0].addr) ? '' : res.data[0].addr + ', ') + res.data[0].Country + ', ' + res.data[0].PostalCode,
                    Policy_Holder_Conatct: CommonConfig.formatPhone(res.data[0].CountryCode, res.data[0].AreaCode, res.data[0].PhoneNumber),
                    EntityType: res.data[0].EntityType, ContactCode: ' (#' + res.data[0].ContactCode + ')'
                })
                this.setState({vesselClass:'', VesselClassError: true, vesselType:'', vesselTypeError: true});
                var resCountry = res.data[0].Country;
                var newCountry = this.state.countryList.find(x => x.StringMapKey === resCountry);
                if (newCountry) {
    
                    this.getVesselClassByCountry(res.data[0].Country, this.state.TPO);

                    this.setState({ country: newCountry.StringMapKey })
                    if (newCountry == "UK") {
                        this.setState({ currency: "GBP" })
                    } else {
                        this.setState({ currency: "EUR" })
                    }
                } else {
                    this.setState({ country: "Ireland" })
                    this.getVesselClassByCountry("Ireland", this.state.TPO);
                }
            } else {

            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    getWaterSkiiAndWaterToys() {
        api.post('api/getWaterSkiiAndWaterToys').then(res => {
            console.log(res.data);

            if (res.success) {
                this.setState({ systemWaterSkiingLiability: res.data[0].WaterSkiingLiability, systemWaterToysLiabiility: res.data[0].WaterToysLiabiility })
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    getBinderByPolicyType(stringType) { debugger
        var data = {
            stringMapType : stringType,
        }
        api.post('api/getBinderByPolicyType', data).then(res => {
            console.log('getBinderByPolicyType', res.data);

            if (res.success) {
                var formattedData = [];

                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        label: res.data[i].UMRN,
                        value: res.data[i].BinderId,
                    });
                }
                this.setState({ binderList: formattedData });

            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    getDropdown() {

        var formattedLanguage = [];

        // Get Language
        try {
            api.get(APIConstant.path.getLanguage).then(res => {

                if (res.success) {

                    for (var i = 0; i < res.data.length; i++) {
                        formattedLanguage.push({
                            label: res.data[i].Language,
                            value: res.data[i].Language,
                        });
                    }
                    this.setState({ documentLanguageList: formattedLanguage });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {

        }

        var formattedCurrency = [];

        // Get Currency
        try {
            api.get(APIConstant.path.getCurrency).then(res => {

                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        formattedCurrency.push({
                            label: res.data[i].CurrncyCode,
                            value: res.data[i].CurrncyCode,
                        });
                    }
                    this.setState({ currencyList: formattedCurrency });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {

        }

        // var formattedVesselClass = [];

        // // Get Vessel Class
        // try {
        //     api.get(APIConstant.path.getVesselClass).then(res => {
        //         if (res.success) {

        //             for (var i = 0; i < res.data.length; i++) {
        //                 formattedVesselClass.push({
        //                     label: res.data[i].VesselClassName,
        //                     value: res.data[i].VesselClassId,
        //                 });
        //             }
        //             this.setState({ VesselClassList: formattedVesselClass });
        //         } else {

        //         }
        //     }).catch(err => {

        //     });
        // } catch (err) {

        // }
    }

    editDocLang(task) {
        if (task == 'View') {
            this.setState({ isEditDocLang: false })
        } else {
            this.setState({ isEditDocLang: true })
        }
    }

    editCurrency(task) {
        if (task == 'View') {
            this.setState({ isEditCurrency: false })
        } else {
            this.setState({ isEditCurrency: true })
        }
    }

    getDropDownValues(stringMapType, setStateName, orderBy) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderBy
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getVesselClassByCountry(country, TPO) {
        try {
            const data = {
                Country: country,
                TPO: (TPO)?1:0
            };
            console.log('getVesselClassByCountry',data);
            api.post(APIConstant.path.getVesselClassByCountry, data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    console.log('getVesselClassByCountry', res);

                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselClassName,
                            value: res.data[i].VesselClassId,
                        });
                    }

                    this.setState({ VesselClassList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getVesselType(id, Country, TPO) {
        try {
            const data = {
                VesselClassId: id,
                Country: Country,
                TPO: (TPO)?1:0
            };
            console.log('getVesselTypeByCountry',data);
            api.post(APIConstant.path.getVesselTypeByCountry, data).then(res => {
                console.log('getVesselTypeByCountry',res);
                
                if (res.success) {
                    var formattedData = [];

                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselTypeName,
                            value: res.data[i].VesselTypeId,
                        });
                    }

                    this.setState({ vesselTypeList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    // getVesselType(id) {
    //     try {
    //         const data = {
    //             VesselClassId: id
    //         };
    //         api.post(APIConstant.path.getVesselType, data).then(res => {
    //             if (res.success) {
    //                 var formattedData = [];

    //                 for (var i = 0; i < res.data.length; i++) {
    //                     formattedData.push({
    //                         label: res.data[i].VesselTypeName,
    //                         value: res.data[i].VesselTypeId,
    //                     });
    //                 }

    //                 this.setState({ vesselTypeList: formattedData });
    //             } else {
    //             }
    //         }).catch(err => {
    //         });
    //     } catch (error) {
    //     }
    // }

    getDefaultAddonCoverage(id) {
        try {
            const data = {
                VesselTypeId: id
            };
            api.post(APIConstant.path.getDefaultAddonCoverage, data).then(res => {
                if (res.success) {

                    this.setState({ addOnCoverageCount: res.data.length, addOnCoverageArr: res.data });

                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getAssumption(id) {
        try {
            const data = {
                VesselTypeId: id
            };
            api.post(APIConstant.path.getAssumption, data).then(res => {
                if (res.success) {

                    this.setState({ assumptionCount: res.data.length, assumptionArr: res.data });

                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getMooringZones() {
        const data = {
            pMode: 'mooringName',
            zone: 'Irish Website',
            mooringName: '',
            mooringType: '',
            PolicyId: '',
        };
        api.post('api/getMooringGuideDetails', data).then(res => {
            if (res.success) {
                var formattedData = [];
                for (let i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        label: res.data[i].MooringName,
                        value: res.data[i].MooringName,
                        
                    })
                }
                this.setState({ boatMooredList: formattedData });
            }
        }).catch(err => {

        });

        // try {
        //     const data = {
        //         zone: 'Irish Website',
        //         isStringMap: 0,
        //         PolicyId: this.state.PolicyId,
        //         DDName: 'MooringName'
        //     };
        //     api.post(APIConstant.path.getcommondropdown, data).then(res => {
        //         console.log('-p-o-p-p--o-l--p-l-k-l-l-',res);                    

        //         if (res.success) {
        //             var formattedData = [];
        //             for (let i = 0; i < res.data.length; i++) {
        //                 formattedData.push({
        //                     label: res.data[i].MooringName,
        //                     value: res.data[i].MooringName,
                            
        //                 })
        //             }
        //             this.setState({ boatMooredList: formattedData });
        //         } else {
        //         }
        //     }).catch(err => {
        //     });
        // } catch (error) {
        // }
    }

    getCruisingRangeList() {
        try {
            const data = {
                stringmaptype: 'CRUISINGRANGE',
                orderby: 'SortOrder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].Description,
                            value: res.data[i].StringMapKey
                        })
                    }
                    this.setState({ cruisingRangeList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getBoatRegisterList() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
                orderby: 'StringMapName'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].StringMapKey
                        })
                    }
                    this.setState({ whereRegList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getmooringType(value) {
        let data = {
            mooring_Type: value
        }
        api.post('api/getMooringTypeDataByMoored', data).then(res => {
            if (res.success) {
                var mooringType = [];

                for (var i = 0; i < res.data.length; i++) {
                    mooringType.push({
                        label: res.data[i].MooringType,
                        value: res.data[i].MooringGuideId,
                    })
                }
                this.setState({ mooringTypeList: mooringType });
            }
        })
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

    async checkPolicyNumberExists(policyNumber) {
        this.setState({ changePolicyNumber: false });
        let data = {
            PolicyNumber: policyNumber
        }
        var returnval = await api.post(APIConstant.path.checkPolicyNumberExists, data).then(res => {
            if (res.success) {
                if (res.data.length != 0) {
                    toast.error("Policy Number Already Exists");
                    this.setState({ policyNumberError: true });
                    this.show("policyNumber", true, "policyNumberError", "Policy Number Already Exists");
                    return true;
                } else {
                    return false;
                }

            } else {
                return true;
            }
        });

        return returnval;
    }

    editPolicyNumber() {
        console.log('this.state.changePolicyNumber', this.state.changePolicyNumber);

        this.setState({ changePolicyNumber: !this.state.changePolicyNumber });
        if (this.state.changePolicyNumber) {
            this.checkPolicyNumberExists(this.state.policyNumber);
        }
    }

    show(field, condition, errorField, message) {
        if (condition) {
            if (document.getElementById(field))
                document.getElementById(field).className = "form-control is-invalid";

            if (document.getElementById(errorField))
                document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
        } else {
            if (document.getElementById(field))
                document.getElementById(field).className = "form-control";

            if (document.getElementById(errorField))
                document.getElementById(errorField).innerHTML = null;
        }
    }

    boatingQualificationDropdown() {
        try {
            const data = {
                stringmaptype: "BOATINGQUALIFICATIONS",
                orderby: 'StringMapName'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var listData = res.data;
                    this.state.boatingQualificationsArr.forEach(data => {
                        let index = listData.findIndex(x => x.StringMapKey === data.BoatingQualification);
                        res.data.splice(index, 1);
                    });
                    this.setState({ boatingQualificationList: listData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    ValidateAndAddBoatingQualification = () => {
        if (this.state.boatingQualifications === '' || this.state.boatingQualifications === null || this.state.boatingQualificationsError) {
            this.setState({ boatingQualificationsError: true });
            this.show('boatingQualifications', true, "boatingQualificationsError", "Please select Boating Qualifications");
        } else {
            let BoatingQualificationsArray = this.state.boatingQualificationsArr;
            let BoatingQualificationsList = this.state.boatingQualificationList;
            let index = BoatingQualificationsList.findIndex(x => x.StringMapKey === this.state.boatingQualifications);
            let bqindex = BoatingQualificationsArray.findIndex(x => x.BoatingQualification === this.state.boatingQualifications);
            if (bqindex == -1) {
                var boatingQuaData = {
                    BoatingQualification: BoatingQualificationsList[index].StringMapId,
                    BoatingQualificationName: BoatingQualificationsList[index].StringMapKey,
                    Status: BoatingQualificationsList[index].Status
                }
                BoatingQualificationsArray.push(boatingQuaData);
            } else {
                BoatingQualificationsArray[bqindex].Status = "Active";
            }
            BoatingQualificationsList.splice(index, 1);
            this.setState({ boatingQualificationsArr: BoatingQualificationsArray, boatingQualificationList: BoatingQualificationsList, boatingQualifications: '' });
        }
    }

    deleteBoatingQualification = (data) => {

        let BoatingQualificationsArray = this.state.boatingQualificationsArr;
        let BoatingQualificationsList = this.state.boatingQualificationList;
        let boatingQualificationAllList = this.state.boatingQualificationAllList;

        if (data.PolicyId) {
            let index = BoatingQualificationsArray.findIndex(x => x.BoatingQualification === data.BoatingQualification);
            BoatingQualificationsArray[index].Status = "Inactive";
        } else {
            let index = BoatingQualificationsArray.findIndex(x => x.BoatingQualification === data.BoatingQualification);
            BoatingQualificationsArray.splice(index, 1);
        }
        let bqindex = boatingQualificationAllList.findIndex(x => x.StringMapId === data.BoatingQualification);
        BoatingQualificationsList.push(boatingQualificationAllList[bqindex]);
        this.setState({ boatingQualificationsArr: BoatingQualificationsArray, boatingQualificationList: BoatingQualificationsList, toggleModal: false, temData: '' });
    }

    openModal(modal) {
        if (modal == 'Delete') {
            this.setState({ toggleModal: !this.state.toggleModal });
        } else if (modal == 'Assumption') {
            this.setState({ toggleAssumption: !this.state.toggleAssumption });
        } else if (modal == 'TermsAndCondition') {
            this.setState({ toggleTermsAndCondition: !this.state.toggleTermsAndCondition });
        }
    }

    delete = (data) => {
        this.setState({ temData: data });
        this.openModal('Delete');
    }

    toggleLarge = (modal) => {
        if (modal == 'Delete') {
            this.setState({ toggleModal: false, temData: '' });
        } else if (modal == 'Assumption') {
            this.setState({ toggleAssumption: false });
        } else if (modal == 'TermsAndCondition') {
            this.setState({ toggleTermsAndCondition: false });
        }
    }

    getOrganazationData(ContactType) {
        try {
            let data = { ContactType: ContactType };
            api.post('api/getOrganazationData', data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].OrganizationName,
                            value: res.data[i].OrganizationId,
                        })
                    }
                    this.setState({ sourceList: formattedData });
                } else {
                    console.log('getOrganazationData_error');
                }
            }).catch(err => {
                console.log('getOrganazationData', err);
            });
        } catch (error) {
            console.log('getOrganazationData', error);
        }
    }

    suggestPreviousInsurer(event) {
        console.log('this.state.previousInsurerList', this.state.previousInsurerList);

        let results = this.state.previousInsurerList.filter((previousInsurerData) => {
            var previousInsurerName = previousInsurerData.StringMapName;
            return previousInsurerName.toLowerCase().startsWith(event.query.toLowerCase());
        });
        console.log('this.state.previousInsurerList', results);
        var previousInsurerResult = [];
        results.forEach(res => {
            previousInsurerResult.push(res.StringMapName);
        });
        this.setState({ previousInsurerSuggestions: previousInsurerResult });
    }

    changePreviousInsurer(value) {
        console.log("changePreviousInsurer >", value);
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
            // if (results.length > 0) {
            //     this.setState({ insuranceComapny: results[0].InsuranceCompanyName, gross: results[0].GrossCommission, subBinders: results[0].subBinderData, adminFees: results[0].adminFees, totalgross: totalgross, balance: balance, balanceTotal: balanceTotal })
            // }
        }
    }

    calculateTotal(premium, levy, adminFee) {
        var totalDue = '';
        var Premium = CommonConfig.isEmpty(premium) ? 0 : premium;
        var Levy = CommonConfig.isEmpty(levy) ? 0 : levy;
        var AdminFee = CommonConfig.isEmpty(adminFee) ? 0 : adminFee;
        totalDue = Number(Premium) + Number(Levy) + Number(AdminFee);
        this.setState({ total: totalDue });
    }

    getVesselClassIdFromName(vesselClassName) {
        try {
            const data = {
                class: vesselClassName
            };
            console.log('getVesselClassIdFromName1',data);    
            api.post(APIConstant.path.getVesselClassIdFromName, data).then(res => {
                if (res.success) {
                    console.log('getVesselClassIdFromName2',res);
                    var vesselClassId = res.data[0].VesselClassId;
                    var vesselTypeName = CommonConfig.getFixedVesselTypeFromVesselClassName(vesselClassName);
                    const data = {
                        classId: vesselClassId,
                        type: vesselTypeName,
                    };
                    console.log('getVesselClassIdFromName3',data);
                    api.post(APIConstant.path.getVesselTypeIdFromNameandClassId, data).then(result => {
                        console.log('getVesselClassIdFromName4',result);                   
                        if (result.success) {
                            this.setState({ vesselClass: vesselClassId, vesselType: result.data[0].VesselTypeId });
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

    conditionalFields(policyType) {
        console.log('policyType out',policyType);
        if (policyType == 'MarineTrade' || policyType == 'MultiVessel' || policyType == 'Engineering') {
            console.log('policyType in',policyType);
            this.setState({
                rate: '',
                rateError: false,

                ratingType: '',

                excess: '',
                excessError: false,

                vesselClass: '',
                VesselClassError: false,

                vesselType: '',
                vesselTypeError: false,

                vesselName: '',
                vesselNameError: false,

                UseofVessel: '',
                UseofVesselError: false,

                hullMaterial: '',
                hullMaterialError: false,

                makeAndModel: '',
                makeAndModelError: false,

                length: '',
                lengthError: false,

                vesselBuildType: '',

                vesselBuildTypeError: false,

                lastSurveyDateRequired: false,
                lastSurveyDate: '',
                lastSurveyDateError: false,
                surveyDueDate: '',

                yearBuilt: '',
                yearBuiltError: false,
                YBuilt: '',

                yearPurchased: '',
                yearPurchasedError: false,

                purchasePrice: 0,
                purchasePriceError: false,

                sumInsured: 0,
                sumInsuredError: false,

                sumInsuredMethod: '',
                sumInsuredMethodError: false,

                whereReg: '',
                whereRegError: false,

                boatMoored: '',
                boatMooredError: false,

                mooringType: '',
                mooringTypeError: false,
                //Vessel
                // -----------------------------------------------------------
                // Engine & Trailer Details
                mainEngine: '',
                mainEngineError: false,

                mainEngineHp: '',
                mainEngineHpError: false,

                mainEngineYear: '',
                mainEngineYearError: false,

                mainEngineSerialNo: '',
                mainEngineSerialNoError: false,

                noOfMainEngine: '',
                noOfMainEngineError: false,

                tarnsmissionMainEngine: '',

                tarnsmissionMainEngineError: false,

                auxiliaryEngine: '',
                auxiliaryEngineError: false,

                auxiliaryEngineHp: '',
                auxiliaryEngineHpError: false,

                auxiliaryEngineYear: '',
                auxiliaryEngineYearError: false,

                auxiliaryEngineSerialNo: '',
                auxiliaryEngineSerialNoError: false,

                noOfAuxiliaryEngine: '',
                noOfAuxiliaryEngineError: false,

                auxiliaryEngineTransmission: '',

                auxiliaryEngineTransmissionError: false,

                maxSpeed: 0,
                maxSpeedError: false,

                makeofTrailer: '',
                makeofTrailerError: false,

                trailerSerialNo: '',
                trailerSerialNoError: false,
                // Engine & Trailer Details
                // -----------------------------------------------------------
                // Navigational Limits

                cruisingRange: '',
                cruisingRangeError: false,

                additionalCruisingRange: '',
                additionalCruisingRangeError: false,
                // Navigational Limits
                // -----------------------------------------------------------
                // General Questions
                PreviousBoatingExperience: '',
                PreviousBoatingExperienceError: false,

                CurrentNCBYears: 0,
                CurrentNCBYearsError: false,

                previousInsurer: "",
                previousInsurerError: false,

                previousPolicyNo: "",
                previousPolicyNoError: false,

                boatingQualifications: '',

                boatingQualificationsError: false,

                losses: '',
                lossesError: false,
                lossesDescribe: '',
                lossesDescribeError: false,
                showLossesDescribe: false,

                convicted: '',
                convictedError: false,
                convictedDescribe: '',
                convictedDescribeError: false,
                showconvictedDescribe: false,

                insurancecanceled: '',
                insurancecanceledError: false,
                insurancecanceledDescribe: '',
                insurancecanceledDescribeError: false,
                showinsurancecanceledDescribe: false,

                damaged: '',
                damagedError: false,
                damagedDescribe: '',
                damagedDescribeError: false,
                showdamagedDescribe: false,
                // General Questions
                // -----------------------------------------------------------
                // Limits / Additional Cover            
                thirdPartyLiability: '',
                thirdPartyLiabilityError: false,

                isWaterSkiing: false,
                waterSkiingLiability: '',
                systemWaterSkiingLiability: '',

                isWaterToys: false,
                waterToysLiability: '',
                systemWaterToysLiabiility: '',

                isSailRacing: false,
                sailRacingCoverage: '',

                racingEventType: '',
                racingEventTypeError: false,

                crewLiability: '',
                crewLiabilityError: false,
                // PolicySumInsured
                binder: '',
                binderError: true,

                premium: '',
                premiumError: true,

                levy: '',
                levyError: true,

                adminFee: '',
                adminFeeError: true,
                // PolicySumInsured
                conditionalVessel: 0,
                conditionalEngine: 0,
                conditionalNavigation: 0,
                conditionalGeneral: 0,
                conditionalLimits: 0,
                isShowNonRateParams: 0,
            });
            if (policyType == 'MarineTrade'){
                this.getVesselClassIdFromName('MarineTradeVessel');
            }
            if (policyType == 'MultiVessel') {
                this.getVesselClassIdFromName('MultiVessel');
            }
            if (policyType == 'Engineering') {
                this.getVesselClassIdFromName('Engineering Vessel');
            }
        } else if (policyType == 'VesselNonrated') {
            this.setState({
                excessError: true,
                rateError: true,
                ratingType: 'Rating',
                conditionalVessel: 1,
                conditionalEngine: 1,
                conditionalNavigation: 1,
                conditionalGeneral: 1,
                conditionalLimits: 1,
                isShowNonRateParams: 1,
            })
        } else {
            this.setState({
                rate: '',
                rateError: false,

                ratingType: '',

                excess: '',
                excessError: false,

                vesselClass: '',
                VesselClassError: true,

                vesselType: '',
                vesselTypeError: true,

                vesselName: '',
                vesselNameError: true,

                UseofVessel: '',
                UseofVesselError: true,

                hullMaterial: '',
                hullMaterialError: true,

                makeAndModel: '',
                makeAndModelError: true,

                length: '',
                lengthError: true,

                vesselBuildType: '',

                vesselBuildTypeError: true,

                lastSurveyDateRequired: false,
                lastSurveyDate: '',
                lastSurveyDateError: true,
                surveyDueDate: '',

                yearBuilt: '',
                yearBuiltError: true,
                YBuilt: '',

                yearPurchased: '',
                yearPurchasedError: true,

                purchasePrice: '',
                purchasePriceError: true,

                sumInsured: '',
                sumInsuredError: true,


                sumInsuredMethod: 'Market Value',
                // sumInsuredMethodError: true,

                whereReg: '',
                whereRegError: true,

                boatMoored: '',
                boatMooredError: true,

                mooringType: '',
                mooringTypeError: true,
                //Vessel
                // -----------------------------------------------------------
                // Engine & Trailer Details
                mainEngine: '',
                mainEngineError: true,

                mainEngineHp: '',
                mainEngineHpError: true,

                mainEngineYear: '',
                mainEngineYearError: true,

                mainEngineSerialNo: '',
                mainEngineSerialNoError: true,

                noOfMainEngine: '',
                noOfMainEngineError: true,

                tarnsmissionMainEngine: '',

                tarnsmissionMainEngineError: true,

                auxiliaryEngine: '',
                auxiliaryEngineError: true,

                auxiliaryEngineHp: '',
                auxiliaryEngineHpError: true,

                auxiliaryEngineYear: '',
                auxiliaryEngineYearError: true,

                auxiliaryEngineSerialNo: '',
                auxiliaryEngineSerialNoError: true,

                noOfAuxiliaryEngine: '',
                noOfAuxiliaryEngineError: true,

                auxiliaryEngineTransmission: '',

                auxiliaryEngineTransmissionError: true,

                maxSpeed: '',
                maxSpeedError: true,

                makeofTrailer: '',
                makeofTrailerError: true,

                trailerSerialNo: '',
                trailerSerialNoError: true,
                // Engine & Trailer Details
                // -----------------------------------------------------------
                // Navigational Limits

                cruisingRange: '',
                cruisingRangeError: true,

                additionalCruisingRange: '',
                additionalCruisingRangeError: true,
                // Navigational Limits
                // -----------------------------------------------------------
                // General Questions

                PreviousBoatingExperience: '',
                PreviousBoatingExperienceError: true,


                CurrentNCBYears: '',
                CurrentNCBYearsError: true,


                previousInsurer: "",
                previousInsurerError: false,

                previousPolicyNo: "",
                previousPolicyNoError: false,

                boatingQualifications: '',

                boatingQualificationsError: true,

                losses: '',
                lossesError: true,
                lossesDescribe: '',
                lossesDescribeError: true,
                showLossesDescribe: false,

                convicted: '',
                convictedError: true,
                convictedDescribe: '',
                convictedDescribeError: true,
                showconvictedDescribe: false,

                insurancecanceled: '',
                insurancecanceledError: true,
                insurancecanceledDescribe: '',
                insurancecanceledDescribeError: true,
                showinsurancecanceledDescribe: false,

                damaged: '',
                damagedError: true,
                damagedDescribe: '',
                damagedDescribeError: true,
                showdamagedDescribe: false,
                // General Questions
                // -----------------------------------------------------------
                // Limits / Additional Cover            
                thirdPartyLiability: '',
                thirdPartyLiabilityError: true,

                isWaterSkiing: false,
                waterSkiingLiability: '',
                systemWaterSkiingLiability: '',

                isWaterToys: false,
                waterToysLiability: '',
                systemWaterToysLiabiility: '',

                isSailRacing: false,
                sailRacingCoverage: '',


                racingEventType: '',
                racingEventTypeError: true,


                crewLiability: '',
                crewLiabilityError: true,
                // PolicySumInsured
                binder: '',
                binderError: false,

                premium: '',
                premiumError: false,

                levy: '',
                levyError: false,

                adminFee: '',
                adminFeeError: false,
                // PolicySumInsured
                conditionalVessel: 1,
                conditionalEngine: 1,
                conditionalNavigation: 1,
                conditionalGeneral: 1,
                conditionalLimits: 1,
                isShowNonRateParams: 0,
            })
        }
    }

    selectType(value, type) {
        console.log(this.state);

        if (type === 'country') {

            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ countryError: true, country: value.value });
                this.show("country", true, "countryError", "Please select Country");
            } else {
                this.setState({ countryError: false, country: value.value });
                this.show("country", false, "countryError", "");
                let ThirdPartyStringMapType = CommonConfig.ThirdPartyStringMapOnCountry(value.value)
                this.getDropDownValues(ThirdPartyStringMapType, 'ThirdPartyLiabilityList', 'SortOrder');
                if (value.value == "UK") {
                    this.setState({ currency: "GBP" })
                } else {
                    this.setState({ currency: "EUR" })
                }
                this.getVesselClassByCountry(value.value, this.state.TPO);
                this.setState({vesselClass:'', VesselClassError: true, vesselType:'', vesselTypeError: true});
            }
        }

        if (type === 'policyType') {
            console.log(value.value);
            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ policyTypeError: true, policyType: value.value });
                this.show("policyType", true, "policyTypeError", "Please select policy type");
            } else {
                // if (value.value == 'VesselNonrated') {
                //     this.setState({ excessError: true, rateError: true, ratingType: 'Rating', isShowNonRateParams: 1 })
                // } else {
                //     this.setState({ rate: '', excess: '', ratingType: '', excessError: false, rateError: false, isShowNonRateParams: 0 })
                // }
                // console.log('conditionalFields',value.value);
                
                this.conditionalFields(value.value);
                this.setState({ policyTypeError: false, policyType: value.value });
                this.show("policyType", false, "policyTypeError", "");

                if ( value.value == 'MarineTrade' || value.value == 'MultiVessel' ) {
                    this.getBinderByPolicyType('MARINBINDER');
                }else if (value.value == 'Engineering') {
                    this.getBinderByPolicyType('ENGINEERINGBINDER');
                }
            }
        }

        if (type === 'documentLanguage') {

            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ documentLanguageError: true, documentLanguage: value.value });
                this.show("documentLanguage", true, "documentLanguageError", "Please select document language");
            } else {
                this.setState({ documentLanguageError: false, documentLanguage: value.value });
                this.show("documentLanguage", false, "documentLanguageError", "");
            }
        }

        if (type === 'currency') {

            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ currencyError: true, currency: value.value });
                this.show("currency", true, "currencyError", "Please select currency");
            } else {
                this.setState({ currencyError: false, currency: value.value });
                this.show("currency", false, "currencyError", "");
            }
        }

        if (type === 'PolicyDepartment') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ PolicyDepartmentError: true, PolicyDepartment: value });
                this.show("PolicyDepartment", true, "PolicyDepartmentError", "Please select policy department");
            } else {
                this.setState({ PolicyDepartmentError: false, PolicyDepartment: value });
                this.show("PolicyDepartment", false, "PolicyDepartmentError", "");
                if (value == 'ServiceCenter' || value == 'SubAgent') {
                    this.setState({ sourceDisplay: true })
                    this.getOrganazationData(value)
                }
                else {
                    this.setState({ sourceDisplay: false })
                }
            }
        }

        if (type === 'source') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ sourceError: true, source: value });
                this.show("", true, "sourceError", "");
            } else {
                this.setState({ sourceError: false, source: value.value });
                this.show("source", false, "sourceError", "");
            }
        }

        if (type === 'binder') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ binderError: true, binder: value });
                this.show("", true, "binderError", "");
            } else {
                this.setState({ binderError: false, binder: value.value });
                this.show("binder", false, "binderError", "");
            }
        }

        if (type === 'vesselClass') {

            if (value === '' || value === undefined || value === null) {
                this.setState({ VesselClassError: true, vesselClass: value, vesselTypeList: [] });
                this.show("", true, "vesselClassError", "Please select vessel class");
            } else {

                this.setState({ VesselClassError: false, vesselClass: value.value, VesselType: '', vesselTypeError: true });
                this.show("vesselClass", false, "vesselClassError", "");
                this.getVesselType(value.value, this.state.country, this.state.TPO);

                var SelectedId = value.label;
                let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(SelectedId);

                if (!CommonConfig.isEmpty(this.state.yearBuilt)) {
                    let BoatAge = new Date().getFullYear() - this.state.yearBuilt;
                    if (SelectedId != 'Dinghy' && SelectedId != 'Lake Boat' && SelectedId != 'Personal Watercraft') {
                        this.setState({ lastSurveyDateRequired: (BoatAge >= 20) ? true : false });
                    } else {
                        this.setState({ lastSurveyDateRequired: false, vesselType: '' });
                    }
                    this.show("lastSurveyDate", (BoatAge >= 30) ? '' : false, "lastSurveyDateError", (BoatAge >= 30) ? "" : "");
                }

                this.setState({
                    DisplayWater: DisplayCondition.displayWater,
                    DisplayRacing: DisplayCondition.displayRacing,
                    DisplayCrew: DisplayCondition.displayCrew
                });

                if (SelectedId == "Dinghy" || SelectedId == "Rowing Sculls") {
                    this.setState({
                        conditionalEngine: 0, mainEngine: '', mainEngineHp: '', mainEngineYear: '', noOfMainEngine: '', tarnsmissionMainEngine: '',
                        auxiliaryEngine: '', auxiliaryEngineHp: '', auxiliaryEngineYear: '', auxiliaryEngineNoEngine: '', auxiliaryEngineTransmission: '', maxSpeed: 0,
                        makeofTrailer: '', trailerSerialNo: '',
                        mainEngineError: false, mainEngineHpError: false, mainEngineYearError: false, noOfMainEngineError: false, tarnsmissionMainEngineError: false, maxSpeedError: false
                    })
                } else {
                    this.setState({
                        conditionalEngine: 1, mainEngine: '', mainEngineHp: '', mainEngineYear: '', noOfMainEngine: '', tarnsmissionMainEngine: '',
                        auxiliaryEngine: '', auxiliaryEngineHp: '', auxiliaryEngineYear: '', auxiliaryEngineNoEngine: '', auxiliaryEngineTransmission: '', maxSpeed: '',
                        makeofTrailer: '', trailerSerialNo: '',
                        mainEngineError: true, mainEngineHpError: true, mainEngineYearError: true, noOfMainEngineError: true, tarnsmissionMainEngineError: true, maxSpeedError: true
                    })
                }

                if (SelectedId === "Commercial Vessels") {
                    this.getDropDownValues('COMMERCIALUSEOFVESSEL', 'UseofVesselList', 'StringMapName');
                } else {
                    this.getDropDownValues('USEOFVESSEL', 'UseofVesselList', 'StringMapName');
                }
            }
            // this.setState({ VesselType:'' })
        }

        if (type === 'vesselType') {

            if (value === '' || value === undefined || value === null) {
                this.setState({ vesselTypeError: true, vesselType: value.value });
                this.show("", true, "vesselTypeError", "Please select vessel type");
            } else {
                this.setState({ vesselTypeError: false, vesselType: value.value });
                this.show("vesselType", false, "vesselTypeError", "");
                this.getDefaultAddonCoverage(value.value);
                this.getAssumption(value.value);

                var vesselClass = this.state.VesselClassList.filter(e => e.value === this.state.vesselClass);
                if (vesselClass.length) {
                    var SelectedClass = vesselClass[0].label;

                    if (SelectedClass == 'Yacht' || SelectedClass == 'Vela') {
                        var SelectedId = value.label;
                        let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(SelectedId);
                        this.setState({
                            DisplayWater: DisplayCondition.displayWater,
                            DisplayRacing: DisplayCondition.displayRacing,
                            DisplayCrew: DisplayCondition.displayCrew
                        })
                    }
                }
            }
        }

        if (type === 'UseofVessel') {

            if (CommonConfig.isEmpty(value)) {
                this.setState({ UseofVesselError: true, UseofVessel: value });
                this.show("UseofVessel", true, "UseofVesselError", "Please select use of vessel");
            } else {
                this.setState({ UseofVesselError: false, UseofVessel: value });
                this.show("UseofVessel", false, "UseofVesselError", "");
            }
        }

        if (type === 'hullMaterial') {

            if (CommonConfig.isEmpty(value)) {
                this.setState({ hullMaterialError: true, hullMaterial: value });
                this.show("hullMaterial", true, "hullMaterialError", "Please select hull material");
            } else {
                this.setState({ hullMaterialError: false, hullMaterial: value });
                this.show("hullMaterial", false, "hullMaterialError", "");
            }
        }

        if (type === 'vesselBuildType') {

            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselBuildTypeError: true, vesselBuildType: value });
                this.show("vesselBuildType", true, "vesselBuildTypeError", "Please select type of build");
            } else {
                this.setState({ vesselBuildTypeError: false, vesselBuildType: value });
                this.show("vesselBuildType", false, "vesselBuildTypeError", "");
            }
        }

        if (type === 'sumInsuredMethod') {

            if (CommonConfig.isEmpty(value)) {
                this.setState({ sumInsuredMethodError: true, sumInsuredMethod: value });
                this.show("sumInsuredMethod", true, "sumInsuredMethodError", "Please select sum insured method");
            } else {
                this.setState({ sumInsuredMethodError: false, sumInsuredMethod: value });
                this.show("sumInsuredMethod", false, "sumInsuredMethodError", "");
            }
        }

        if (type === 'whereReg') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ whereRegError: true, whereReg: value });
                this.show("", true, "whereRegError", "Please select Where is boat registered");
            } else {
                this.setState({ whereRegError: false, whereReg: value.value });
                this.show("whereReg", false, "whereRegError", "");
            }
        }

        if (type === 'boatMoored') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ boatMooredError: true, boatMoored: value, mooringTypeList: [] });
                this.show("", true, "boatMooredError", "Please select Where is boat moored");
            } else {
                this.getmooringType(value.value);
                this.setState({ boatMooredError: false, boatMoored: value.value });
                this.show("boatMoored", false, "boatMooredError", "");

            }
        }

        if (type === 'mooringType') {
            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ mooringTypeError: true, mooringType: value.value });
                this.show("mooringType", true, "mooringTypeError", "Please select moored type");
            } else {
                this.setState({ mooringTypeError: false, mooringType: value.value });
                this.show("mooringType", false, "mooringTypeError", "");
            }
        }

        if (type === 'cruisingRange') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ cruisingRangeError: true, cruisingRange: value });
                this.show("", true, "cruisingRangeError", "Please select cruising range");
            } else {
                this.setState({ cruisingRangeError: false, cruisingRange: value.value });
                this.show("cruisingRange", false, "cruisingRangeError", "");
            }
        }

        if (type === 'noOfMainEngine') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ noOfMainEngineError: true, noOfMainEngine: value });
                this.show("noOfMainEngine", true, "noOfMainEngineError", "Please select no of engine");
            } else {
                this.setState({ noOfMainEngineError: false, noOfMainEngine: value });
                this.show("noOfMainEngine", false, "noOfMainEngineError", "");
            }
        }

        if (type === 'tarnsmissionMainEngine') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ tarnsmissionMainEngineError: true, tarnsmissionMainEngine: value });
                this.show("tarnsmissionMainEngine", true, "tarnsmissionMainEngineError", "Please select tarnsmission");
            } else {
                this.setState({ tarnsmissionMainEngineError: false, tarnsmissionMainEngine: value });
                this.show("tarnsmissionMainEngine", false, "tarnsmissionMainEngineError", "");
            }
        }

        if (type === 'noOfAuxiliaryEngine') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ noOfAuxiliaryEngineError: true, noOfAuxiliaryEngine: value });
                this.show("noOfAuxiliaryEngine", true, "noOfAuxiliaryEngineError", "Please select no of engine");
            } else {
                this.setState({ noOfAuxiliaryEngineError: false, noOfAuxiliaryEngine: value });
                this.show("noOfAuxiliaryEngine", false, "noOfAuxiliaryEngineError", "");
            }
        }

        if (type === 'auxiliaryEngineTransmission') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ auxiliaryEngineTransmissionError: true, auxiliaryEngineTransmission: value });
                this.show("auxiliaryEngineTransmission", true, "auxiliaryEngineTransmissionError", "Please select Transmission");
            } else {
                this.setState({ auxiliaryEngineTransmissionError: false, auxiliaryEngineTransmission: value });
                this.show("auxiliaryEngineTransmission", false, "auxiliaryEngineTransmissionError", "");
            }
        }



        if (type === 'boatingQualifications') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ boatingQualificationsError: true, boatingQualifications: value });
                this.show("boatingQualifications", true, "boatingQualificationsError", "Please select boating qualifications");
            } else {
                this.setState({ boatingQualificationsError: false, boatingQualifications: value });
                this.show("boatingQualifications", false, "boatingQualificationsError", "");
            }
        }

        if (type === 'losses') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ lossesDescribeError: true, losses: value, showLossesDescribe: false, lossesError: true });
                this.show("losses", true, "lossesError", "Please select losses");
            } else {
                if (value == "Yes") {
                    this.setState({ showLossesDescribe: true, lossesDescribeError: true });
                } else {
                    this.setState({ showLossesDescribe: false, lossesDescribeError: false, lossesDescribe: '' });
                }
                this.setState({ losses: value, lossesError: false });
                this.show("losses", false, "lossesError", "");
            }
        }

        if (type === 'convicted') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ convictedDescribeError: true, convicted: value, showconvictedDescribe: false, convictedError: true });
                this.show("convicted", true, "convictedError", "Please select convicted");
            } else {
                if (value == "Yes") {
                    this.setState({ showconvictedDescribe: true, convictedDescribeError: true });
                } else {
                    this.setState({ showconvictedDescribe: false, convictedDescribeError: false, convictedDescribe: '' });
                }
                this.setState({ convicted: value, convictedError: false });
                this.show("convicted", false, "convictedError", "");
            }
        }

        if (type === 'insurancecanceled') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ insurancecanceledDescribeError: true, insurancecanceled: value, showinsurancecanceledDescribe: false, insurancecanceledError: true });
                this.show("insurancecanceled", true, "insurancecanceledError", "Please select is insurance canceled-refused or not");
            } else {
                if (value == "Yes") {
                    this.setState({ showinsurancecanceledDescribe: true, insurancecanceledDescribeError: true });
                } else {
                    this.setState({ showinsurancecanceledDescribe: false, insurancecanceledDescribeError: false, insurancecanceledDescribe: '' });
                }
                this.setState({ insurancecanceled: value, insurancecanceledError: false });
                this.show("insurancecanceled", false, "insurancecanceledError", "");
            }
        }

        if (type === 'damaged') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ damagedDescribeError: true, damaged: value, showdamagedDescribe: false, damagedError: true });
                this.show("damaged", true, "damagedError", "Please select is vessel ever been damaged or not");
            } else {
                if (value == "Yes") {
                    this.setState({ showdamagedDescribe: true, damagedDescribeError: true });
                } else {
                    this.setState({ showdamagedDescribe: false, damagedDescribeError: false, damagedDescribe: '' });
                }
                this.setState({ damaged: value, damagedError: false });
                this.show("damaged", false, "damagedError", "");
            }
        }

        if (type === 'PreviousBoatingExperience') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ PreviousBoatingExperienceError: true, PreviousBoatingExperience: value });
                this.show("PreviousBoatingExperience", true, "PreviousBoatingExperienceError", "Please select previous boating experience");
            } else {
                this.setState({ PreviousBoatingExperienceError: false, PreviousBoatingExperience: value });
                this.show("PreviousBoatingExperience", false, "PreviousBoatingExperienceError", "");
            }
        }

        if (type === 'CurrentNCBYears') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CurrentNCBYearsError: true, CurrentNCBYears: value });
                this.show("CurrentNCBYears", true, "CurrentNCBYearsError", "Please select current NCB years");
            } else {
                this.setState({ CurrentNCBYearsError: false, CurrentNCBYears: value });
                this.show('CurrentNCBYears', false, "CurrentNCBYearsError", "");
            }
        }

        if (type === 'thirdPartyLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ thirdPartyLiabilityError: true, thirdPartyLiability: value });
                this.show("thirdPartyLiability", true, "thirdPartyLiabilityError", "Please select third party liability");
            } else {
                this.setState({ thirdPartyLiabilityError: false, thirdPartyLiability: value });
                this.show('thirdPartyLiability', false, "thirdPartyLiabilityError", "");
            }
        }

        if (type === 'racingEventType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ racingEventTypeError: true, racingEventType: value });
                this.show("racingEventType", true, "racingEventTypeError", "Please select racing event type");
            } else {
                this.setState({ racingEventTypeError: false, racingEventType: value });
                this.show('racingEventType', false, "racingEventTypeError", "");
            }
        }

        if (type === 'crewLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ crewLiabilityError: true, crewLiability: value });
                this.show("crewLiability", true, "crewLiabilityError", "Please select crew liability");
            } else {
                this.setState({ crewLiabilityError: false, crewLiability: value });
                this.show('crewLiability', false, "crewLiabilityError", "");
            }
        }
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        // SAGAR
        let alphaNumeric = CommonConfig.RegExp.alphaNumeric;
        if (e.target.name === 'policyNumber') {
            debugger
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ policyNumberError: true });
                this.show("policyNumber", true, "policyNumberError", "Please enter Policy Number");
            } else if (e.target.value.length > 10) {
                this.setState({ policyNumberError: true, policyNumber: this.state.policyNumber });
                this.show("policyNumber", true, "policyNumberError", "Please enter less than 10");
            } else {
                this.setState({ policyNumber: e.target.value, policyNumberError: false });
                this.show("policyNumber", false, "policyNumberError", "");
            }
        }

        if (e.target.name === 'refer') {
            if (e.target.checked) {
                this.setState({ refer: e.target.checked });
            } else {
                this.setState({ refer: e.target.checked });
            }
        }

        if (e.target.name === 'TPO') {
            this.setState({ TPO: e.target.checked });
            if (!CommonConfig.isEmpty(this.state.country)) {
                this.getVesselClassByCountry(this.state.country, e.target.checked);
                this.setState({vesselClass:'', VesselClassError: true, vesselType:'', vesselTypeError: true});
            }
        }

        if (e.target.name === 'policyEffectiveDate') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ policyEffectiveDateError: true });
                this.show("policyEffectiveDate", true, "policyEffectiveDateError", "Please enter policy effective date");
            } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                this.setState({ policyEffectiveDateError: true });
                this.show("policyEffectiveDate", true, "policyEffectiveDateError", "Please enter valid policy effective date");
            } else {
                let RenewalDate = moment(e.target.value).add(365, 'days').format('YYYY-MM-DD');
                this.setState({ policyEffectiveDateError: false, policyEffectiveDate: e.target.value, renewalDate: RenewalDate });
                this.show("policyEffectiveDate", false, "policyEffectiveDateError", "");
            }
        }

        if (e.target.name === 'premium') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ premiumError: true });
                this.show("premium", true, "premiumError", "Please enter Premium Amount");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ premiumError: true });
                    this.show("premium", true, "premiumError", "Please enter valid Premium Amount");
                } else {
                    this.calculateTotal(e.target.value, this.state.levy, this.state.adminFee);
                    this.setState({ premiumError: false, premium: e.target.value });
                    this.show("premium", false, "premiumError", "");
                }
            }
        }

        if (e.target.name === 'levy') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ levyError: true });
                this.show("levy", true, "levyError", "Please enter Premium Amount");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ levyError: true });
                    this.show("levy", true, "levyError", "Please enter valid Premium Amount");
                } else {
                    this.calculateTotal(this.state.premium, e.target.value, this.state.adminFee);
                    this.setState({ levyError: false, levy: e.target.value });
                    this.show("levy", false, "levyError", "");
                }
            }
        }

        if (e.target.name === 'adminFee') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ adminFeeError: true });
                this.show("adminFee", true, "adminFeeError", "Please enter Premium Amount");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ adminFeeError: true });
                    this.show("adminFee", true, "adminFeeError", "Please enter valid Premium Amount");
                } else {
                    this.calculateTotal(this.state.premium, this.state.levy, e.target.value);
                    this.setState({ adminFeeError: false, adminFee: e.target.value });
                    this.show("adminFee", false, "adminFeeError", "");
                }
            }
        }

        if (e.target.name === 'rate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ rateError: true });
                this.show("rate", true, "rateError", "Please enter Rate");
            } else {
                let decimalRegEx = CommonConfig.RegExp.percentage;
                let percentage = e.target.value;
                if (!decimalRegEx.test(percentage)) {
                    this.setState({ rateError: true });
                    this.show("rate", true, "rateError", "Please enter valid Rate");
                } else {
                    this.setState({ rateError: false, rate: e.target.value });
                    this.show("rate", false, "rateError", "");
                }
            }
        }

        if (e.target.name === 'excess') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ excessError: true });
                this.show("excess", true, "excessError", "Please enter Excess Amount");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ excessError: true });
                    this.show("excess", true, "excessError", "Please enter valid Excess Amount");
                } else {
                    this.setState({ excessError: false, excess: e.target.value });
                    this.show("excess", false, "excessError", "");
                }
            }
        }

        if (e.target.name === 'vesselName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ vesselNameError: true });
                this.show("vesselName", true, "vesselNameError", "Please enter Make & Model ");
            } else if (e.target.value.length > 50) {
                this.setState({ vesselNameError: true, vesselName: this.state.vesselName });
                this.show("vesselName", true, "vesselNameError", "Please enter less than 50");
            } else {
                this.setState({ vesselName: e.target.value, vesselNameError: false });
                this.show("vesselName", false, "vesselNameError", "");
            }
        }

        if (e.target.name === 'makeAndModel') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ makeAndModelError: true });
                this.show("makeAndModel", true, "makeAndModelError", "Please enter Make & Model ");
            } else if (e.target.value.length > 38) {
                this.setState({ makeAndModelError: true, makeAndModel: this.state.makeAndModel });
                this.show("makeAndModel", true, "makeAndModelError", "Please enter less than 38");
            } else {
                this.setState({ makeAndModel: e.target.value, makeAndModelError: false });
                this.show("makeAndModel", false, "makeAndModelError", "");
            }
        }

        if (e.target.name === 'length') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ lengthError: true });
                this.show("length", true, "lengthError", "Please enter length");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ lengthError: true });
                    this.show("length", true, "lengthError", "Please enter valid length");
                } else {
                    this.setState({ lengthError: false, length: e.target.value });
                    this.show("length", false, "lengthError", "");
                }
            }
        }

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

                    // var el = document.getElementById('vesselClass');
                    // var vesselClass = el.options[el.selectedIndex].innerHTML;

                    var vesselClass = this.state.VesselClassList.filter(e => e.value === this.state.vesselClass);
                    if (vesselClass.length) {
                        var SelectedClass = vesselClass[0].label;

                        let BoatAge = new Date().getFullYear() - e.target.value;
                        if (SelectedClass != 'Dinghy' && SelectedClass != 'Lake Boat' && SelectedClass != 'Personal Watercraft') {
                            this.setState({ lastSurveyDateRequired: (BoatAge >= 20) ? true : false });
                        } else {
                            this.setState({ lastSurveyDateRequired: false });
                        }
                        this.show("lastSurveyDate", (BoatAge >= 30) ? '' : false, "lastSurveyDateError", (BoatAge >= 30) ? "" : "");
                    }
                }
            }
            var YBuilt = moment(e.target.value).format('YYYY');
            this.setState({ YBuilt: YBuilt, yearPurchased: '' })
        }

        if (e.target.name === 'yearPurchased') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ yearPurchasedError: true });
                this.show("yearPurchased", true, "yearPurchasedError", "Please enter year purchased");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                var Ybuilt = this.state.YBuilt;
                var maxYear = moment().year();
                if (!yearRegEx.test(year) || (year < Ybuilt || year > maxYear)) {
                    this.setState({ yearPurchasedError: true });
                    this.show("yearPurchased", true, "yearPurchasedError", "Please enter valid year purchased");
                } else {
                    this.setState({ yearPurchasedError: false, yearPurchased: e.target.value });
                    this.show("yearPurchased", false, "yearPurchasedError", "");
                }
            }
        }

        if (e.target.name === 'purchasePrice') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ purchasePriceError: true });
                this.show("purchasePrice", true, "purchasePriceError", "Please enter purchase price");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ purchasePriceError: true });
                    this.show("purchasePrice", true, "purchasePriceError", "Please enter valid purchase price");
                } else {
                    this.setState({ purchasePriceError: false, purchasePrice: e.target.value });
                    this.show("purchasePrice", false, "purchasePriceError", "");
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

        if (e.target.name === 'lastSurveyDate') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ lastSurveyDateError: true, surveyDueDate: '' });
                // this.show("lastSurveyDate", true, "lastSurveyDateError", "Please enter Last Survey Date");
            } else if (moment(e.target.value).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
                this.setState({ lastSurveyDateError: true });
                this.show("lastSurveyDate", true, "lastSurveyDateError", "Please enter valid last survey date");
            } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().subtract(5, 'years').format('YYYY-MM-DD')) {
                this.setState({ lastSurveyDateError: true });
                this.show("lastSurveyDate", true, "lastSurveyDateError", "Please enter valid last survey date");
            } else {
                let SurveyDueDate = moment(e.target.value).add(5, 'years').format('YYYY-MM-DD');
                this.setState({ lastSurveyDateError: false, lastSurveyDate: e.target.value, surveyDueDate: SurveyDueDate });
                this.show("lastSurveyDate", false, "lastSurveyDateError", "");
            }
        }

        if (e.target.name === 'mainEngine') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ mainEngineError: true });
                this.show("mainEngine", true, "mainEngineError", "Please enter main engine ");
            } else if (e.target.value.length > 200) {
                this.setState({ mainEngineError: true, mainEngine: this.state.mainEngine });
                this.show("mainEngine", true, "mainEngineError", "Please enter less than 200");
            } else {
                this.setState({ mainEngine: e.target.value, mainEngineError: false });
                this.show("mainEngine", false, "mainEngineError", "");
            }
        }

        if (e.target.name === 'mainEngineHp') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mainEngineHpError: true });
                this.show("mainEngineHp", true, "mainEngineHpError", "Please enter main engine HP");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ mainEngineHpError: true });
                    this.show("mainEngineHp", true, "mainEngineHpError", "Please enter valid main engine HP");
                } else {
                    this.setState({ mainEngineHpError: false, mainEngineHp: e.target.value });
                    this.show("mainEngineHp", false, "mainEngineHpError", "");
                }
            }
        }

        if (e.target.name === 'mainEngineSerialNo') {
            if (CommonConfig.isEmpty(e.target.value) || !alphaNumeric.test(e.target.value)) {
                this.setState({ mainEngineSerialNoError: true });
                this.show("mainEngineSerialNo", true);
            } else {
                this.setState({ mainEngineSerialNoError: false, mainEngineSerialNo: e.target.value });
                this.show("mainEngineSerialNo", false);
            }
        }

        if (e.target.name === 'mainEngineYear') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mainEngineYearError: true });
                this.show("mainEngineYear", true, "mainEngineYearError", "Please enter main engine year");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                var minYear = moment().subtract(100, 'year').format('YYYY');
                var maxYear = moment().year();
                if (!yearRegEx.test(year) || (year < minYear || year > maxYear)) {
                    this.setState({ mainEngineYearError: true });
                    this.show("mainEngineYear", true, "mainEngineYearError", "Please enter valid main engine year");
                } else {
                    this.setState({ mainEngineYearError: false, mainEngineYear: e.target.value });
                    this.show("mainEngineYear", false, "mainEngineYearError", "");
                }
            }
        }

        if (e.target.name === 'auxiliaryEngine') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ auxiliaryEngineError: true });
                this.show("auxiliaryEngine", true, "auxiliaryEngineError", "Please enter auxiliary engine ");
            } else if (e.target.value.length > 200) {
                this.setState({ auxiliaryEngineError: true, auxiliaryEngine: this.state.auxiliaryEngine });
                this.show("auxiliaryEngine", true, "auxiliaryEngineError", "Please enter less than 200");
            } else {
                this.setState({ auxiliaryEngine: e.target.value, auxiliaryEngineError: false });
                this.show("auxiliaryEngine", false, "auxiliaryEngineError", "");
            }
        }

        if (e.target.name === 'auxiliaryEngineHp') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ auxiliaryEngineHpError: true });
                this.show("auxiliaryEngineHp", true, "auxiliaryEngineHpError", "Please enter auxiliary engine HP");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ auxiliaryEngineHpError: true });
                    this.show("auxiliaryEngineHp", true, "auxiliaryEngineHpError", "Please enter valid auxiliary engine HP");
                } else {
                    this.setState({ auxiliaryEngineHpError: false, auxiliaryEngineHp: e.target.value });
                    this.show("auxiliaryEngineHp", false, "auxiliaryEngineHpError", "");
                }
            }
        }

        if (e.target.name === 'auxiliaryEngineSerialNo') {
            if (CommonConfig.isEmpty(e.target.value) || !alphaNumeric.test(e.target.value)) {
                this.setState({ auxiliaryEngineSerialNoError: true });
                this.show("auxiliaryEngineSerialNo", true);
            } else {
                this.setState({ auxiliaryEngineSerialNoError: false, auxiliaryEngineSerialNo: e.target.value });
                this.show("auxiliaryEngineSerialNo", false);
            }
        }

        if (e.target.name === 'auxiliaryEngineYear') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ auxiliaryEngineYearError: true });
                this.show("auxiliaryEngineYear", true, "auxiliaryEngineYearError", "Please enter auxiliary engine year");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                if (!yearRegEx.test(year)) {
                    this.setState({ auxiliaryEngineYearError: true });
                    this.show("auxiliaryEngineYear", true, "auxiliaryEngineYearError", "Please enter valid auxiliary engine year");
                } else {
                    this.setState({ auxiliaryEngineYearError: false, auxiliaryEngineYear: e.target.value });
                    this.show("auxiliaryEngineYear", false, "auxiliaryEngineYearError", "");
                }
            }
        }

        if (e.target.name === 'maxSpeed') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ maxSpeedError: true });
                this.show("maxSpeed", true, "maxSpeedError", "Please enter max speed");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ maxSpeedError: true });
                    this.show("maxSpeed", true, "maxSpeedError", "Please enter valid max speed");
                } else {
                    this.setState({ maxSpeedError: false, maxSpeed: e.target.value });
                    this.show("maxSpeed", false, "maxSpeedError", "");
                }
            }
        }

        if (e.target.name === 'makeofTrailer') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ makeofTrailerError: true });
                this.show("makeofTrailer", true, "makeofTrailerError", "Please enter make of trailer ");
            } else if (e.target.value.length > 50) {
                this.setState({ makeofTrailerError: true, makeofTrailer: this.state.makeofTrailer });
                this.show("makeofTrailer", true, "makeofTrailerError", "Please enter less than 50");
            } else {
                this.setState({ makeofTrailer: e.target.value, makeofTrailerError: false });
                this.show("makeofTrailer", false, "makeofTrailerError", "");
            }
        }

        if (e.target.name === 'trailerSerialNo') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ trailerSerialNoError: true });
                this.show("trailerSerialNo", true, "trailerSerialNoError", "Please enter trailer serial no");
            } else {
                let alphaNumericRegEx = CommonConfig.RegExp.alphaNumeric;
                let alphaNumeric = e.target.value;
                if (!alphaNumericRegEx.test(alphaNumeric)) {
                    this.setState({ trailerSerialNoError: true });
                    this.show("trailerSerialNo", true, "trailerSerialNoError", "Please enter valid trailer serial no");
                } else if (e.target.value.length > 50) {
                    this.setState({ trailerSerialNoError: true, trailerSerialNo: this.state.trailerSerialNo });
                    this.show("trailerSerialNo", true, "trailerSerialNoError", "Please enter less than 50");
                } else {
                    this.setState({ trailerSerialNoError: false, trailerSerialNo: e.target.value });
                    this.show("trailerSerialNo", false, "trailerSerialNoError", "");
                }
            }
        }

        if (e.target.name === 'additionalCruisingRange') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ additionalCruisingRangeError: true });
                this.show("additionalCruisingRange", true, "additionalCruisingRangeError", "Please enter additional cruising range");
            } else if (e.target.value.length > 500) {
                this.setState({ additionalCruisingRangeError: true, additionalCruisingRange: this.state.additionalCruisingRange });
                this.show("additionalCruisingRange", true, "additionalCruisingRangeError", "Please enter less than 500");
            } else {
                this.setState({ additionalCruisingRange: e.target.value, additionalCruisingRangeError: false });
                this.show("additionalCruisingRange", false, "additionalCruisingRangeError", "");
            }
        }

        if (e.target.name === 'previousPolicyNo') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ previousPolicyNoError: true });
                this.show("previousPolicyNo", true, "previousPolicyNoError", "Please enter previous policy no");
            } else {
                let alphaNumericRegEx = CommonConfig.RegExp.alphaNumeric;
                let alphaNumeric = e.target.value;
                if (!alphaNumericRegEx.test(alphaNumeric)) {
                    this.setState({ previousPolicyNoError: true });
                    this.show("previousPolicyNo", true, "previousPolicyNoError", "Please enter valid policy no");
                } else {
                    this.setState({ previousPolicyNoError: false, previousPolicyNo: e.target.value });
                    this.show("previousPolicyNo", false, "previousPolicyNoError", "");
                }
            }
        }

        if (e.target.name === 'lossesDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ lossesDescribeError: true });
                this.show("lossesDescribe", true, "lossesDescribeError", "Please enter losses describe");
            } else if (e.target.value.length > 500) {
                this.setState({ lossesDescribeError: true, lossesDescribe: this.state.lossesDescribe });
                this.show("lossesDescribe", true, "lossesDescribeError", "Please enter less than 500");
            } else {
                this.setState({ lossesDescribe: e.target.value, lossesDescribeError: false });
                this.show("lossesDescribe", false, "lossesDescribeError", "");
            }
        }

        if (e.target.name === 'convictedDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ convictedDescribeError: true });
                this.show("convictedDescribe", true, "convictedDescribeError", "Please enter convicted describe");
            } else if (e.target.value.length > 500) {
                this.setState({ convictedDescribeError: true, convictedDescribe: this.state.convictedDescribe });
                this.show("convictedDescribe", true, "convictedDescribeError", "Please enter less than 500");
            } else {
                this.setState({ convictedDescribe: e.target.value, convictedDescribeError: false });
                this.show("convictedDescribe", false, "convictedDescribeError", "");
            }
        }

        if (e.target.name === 'insurancecanceledDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ insurancecanceledDescribeError: true });
                this.show("insurancecanceledDescribe", true, "insurancecanceledDescribeError", "Please enter insurance canceled Describe");
            } else if (e.target.value.length > 500) {
                this.setState({ insurancecanceledDescribeError: true, insurancecanceledDescribe: this.state.insurancecanceledDescribe });
                this.show("insurancecanceledDescribe", true, "insurancecanceledDescribeError", "Please enter less than 500");
            } else {
                this.setState({ insurancecanceledDescribe: e.target.value, insurancecanceledDescribeError: false });
                this.show("insurancecanceledDescribe", false, "insurancecanceledDescribeError", "");
            }
        }

        if (e.target.name === 'damagedDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ damagedDescribeError: true });
                this.show("damagedDescribe", true, "damagedDescribeError", "Please enter damaged describe");
            } else if (e.target.value.length > 500) {
                this.setState({ damagedDescribeError: true, damagedDescribe: this.state.damagedDescribe });
                this.show("damagedDescribe", true, "damagedDescribeError", "Please enter less than 500");
            } else {
                this.setState({ damagedDescribe: e.target.value, damagedDescribeError: false });
                this.show("damagedDescribe", false, "damagedDescribeError", "");
            }
        }

        if (e.target.name === 'isWaterSkiing') {
            if (e.target.checked) {
                this.setState({ isWaterSkiing: e.target.checked, waterSkiingLiability: this.state.systemWaterSkiingLiability });
            } else {
                this.setState({ isWaterSkiing: e.target.checked, waterSkiingLiability: '' });
            }
        }

        if (e.target.name === 'waterSkiingLiability') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ waterSkiingLiabilityError: true });
                this.show("waterSkiingLiability", true, "waterSkiingLiabilityError", "Please enter water skiing liability");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ waterSkiingLiabilityError: true });
                    this.show("waterSkiingLiability", true, "waterSkiingLiabilityError", "Please enter valid water skiing liability");
                } else {
                    this.setState({ waterSkiingLiabilityError: false, waterSkiingLiability: e.target.value });
                    this.show("waterSkiingLiability", false, "waterSkiingLiabilityError", "");
                }
            }
        }

        if (e.target.name === 'isWaterToys') {
            if (e.target.checked) {
                this.setState({ isWaterToys: e.target.checked, waterToysLiability: this.state.systemWaterToysLiabiility });
            } else {
                this.setState({ isWaterToys: e.target.checked, waterToysLiability: '' });
            }
        }

        if (e.target.name === 'waterToysLiability') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ waterToysLiabilityError: true });
                this.show("waterToysLiability", true, "waterToysLiabilityError", "Please enter water toys liability");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ waterToysLiabilityError: true });
                    this.show("waterToysLiability", true, "waterToysLiabilityError", "Please enter valid water toys liability");
                } else {
                    this.setState({ waterToysLiabilityError: false, waterToysLiability: e.target.value });
                    this.show("waterToysLiability", false, "waterToysLiabilityError", "");
                }
            }
        }

        if (e.target.name === 'isSailRacing') {
            if (e.target.checked) {
                this.setState({ isSailRacing: e.target.checked });
            } else {
                this.setState({ isSailRacing: e.target.checked });
            }
        }

        if (e.target.name === 'sailRacingCoverage') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ sailRacingCoverageError: true });
                this.show("sailRacingCoverage", true, "sailRacingCoverageError", "Please enter sail racing coverage");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ sailRacingCoverageError: true });
                    this.show("sailRacingCoverage", true, "sailRacingCoverageError", "Please enter valid sail racing coverage");
                } else {
                    this.setState({ sailRacingCoverageError: false, sailRacingCoverage: e.target.value });
                    this.show("sailRacingCoverage", false, "sailRacingCoverageError", "");
                }
            }
        }

        if (e.target.name === 'AssumptionAndTerms') {
            console.log(e.target.checked);

            if (e.target.checked) {
                this.setState({ AssumptionAndTerms: e.target.checked, AssumptionAndTermsError: false });
            } else {
                this.setState({ AssumptionAndTerms: e.target.checked, AssumptionAndTermsError: true });
            }
        }
        // SAGAR

    }

    async Save() {

        // <---------------------------- Check Policy Number on the Go and Show Error ----------------------------> 

        // var checkPolicyNumberExists = await this.checkPolicyNumberExists(this.state.policyNumber);
        // if (checkPolicyNumberExists) {
        //     return false;
        // }

        // <---------------------------- Check Policy Number on the Go and Show Error ----------------------------> 

        if (this.state.lastSurveyDateRequired && CommonConfig.isEmpty(this.state.lastSurveyDate)) {
            toast.error("Please select Last Survey Date")
            return;
        } 
        if(this.state.policyType == 'MarineTrade' || this.state.policyType =='MultiVessel' || this.state.policyType == 'Engineering'){
            this.setState({
                vesselTypeError:false,
                VesselClassError:false
            });
            this.state.vesselTypeError=false;
            this.state.VesselClassError=false;
        }
        if (!this.state.policyNumberError && !this.state.countryError && !this.state.policyTypeError && !this.state.documentLanguageError && !this.state.currencyError && !this.state.policyEffectiveDateError && !this.state.PolicyDepartmentError && !this.state.binderError && !this.state.premiumError && !this.state.levyError && !this.state.adminFeeError && !this.state.rateError && !this.state.excessError && !this.state.VesselClassError && !this.state.vesselTypeError && !this.state.UseofVesselError && !this.state.hullMaterialError && !this.state.makeAndModelError && !this.state.lengthError && !this.state.vesselBuildTypeError && !this.state.yearBuiltError && !this.state.yearPurchasedError && !this.state.purchasePriceError && !this.state.sumInsuredError && !this.state.sumInsuredMethodError && !this.state.whereRegError && !this.state.boatMooredError && !this.state.mooringTypeError && !this.state.mainEngineError && !this.state.mainEngineHpError && !this.state.mainEngineYearError && !this.state.noOfMainEngineError && !this.state.tarnsmissionMainEngineError && !this.state.maxSpeedError && !this.state.cruisingRangeError && !this.state.PreviousBoatingExperienceError && !this.state.CurrentNCBYearsError && !this.state.lossesError && !this.state.lossesDescribeError && !this.state.convictedError && !this.state.convictedDescribeError && !this.state.insurancecanceledError && !this.state.insurancecanceledDescribeError && !this.state.damagedError && !this.state.damagedDescribeError && !this.state.thirdPartyLiabilityError /*&& !this.state.racingEventTypeError && !this.state.crewLiabilityError*/ && this.state.AssumptionAndTerms) {
            let data = {
                // Common
                LanguageId: this.state.LanguageId,
                Status: this.state.Status,
                LoggedInUserId: CommonConfig.loggedInUserId(),
                TPO: this.state.TPO,
                // Policy
                PolicyNumber: this.state.policyNumber,
                EntityId: this.state.EntityId,
                EntityType: this.state.EntityType,
                IsReferred: (this.state.refer == true) ? 1 : 0,
                Country: this.state.country,
                PolicyType: this.state.policyType,
                DocLang: this.state.documentLanguage,
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
                boatingQualificationsArr: this.state.boatingQualificationsArr,
                BoatingQualificationsCount: this.state.boatingQualificationsArr.length,
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
                // policyAddOnCoverage
                addOnCoverageArr: this.state.addOnCoverageArr,
                addOnCoverageCount: this.state.addOnCoverageCount,
            }
            
            api.post('api/savePolicy', data).then(res => {

                if (res.success) {

                    // toast.error(res.data.returnValue);
                    toast.success('Quotation Generated successfully');
                    this.props.history.push({
                        pathname: '/PolicyDetailsMerged/' + res.data.policyid + '/1/1',
                        state: {
                            Id: res.data.policyid,
                            tab: 1
                        }
                    });
                } else {

                }
            }).catch(err => {

            })

        } else {
            if (this.state.policyNumberError) {
                this.checkPolicyNumberExists(this.state.policyNumber);
                return;
            }
            if (this.state.countryError) {
                toast.error("Please select country")
                return;
            }
            if (this.state.policyTypeError) {
                toast.error("Please select policy type")
                return;
            }
            if (this.state.documentLanguageError) {
                toast.error("Please select document language")
                return;
            }
            if (this.state.currencyError) {
                toast.error("Please select currency")
                return;
            }
            if (this.state.policyEffectiveDateError) {
                toast.error("Please select policy effective date")
                return;
            }
            if (this.state.PolicyDepartmentError) {
                toast.error("Please select policy department")
                return;
            }
            if (this.state.binderError) {
                toast.error("Please select Binder")
                return;
            }
            if (this.state.premiumError) {
                toast.error("Please enter Premium")
                return;
            }
            if (this.state.levyError) {
                toast.error("Please enter Levy")
                return;
            }
            if (this.state.adminFeeError) {
                toast.error("Please enter AdminFee")
                return;
            }
            if (this.state.rateError) {
                toast.error("Please enter Rate")
                return;
            }
            if (this.state.excessError) {
                toast.error("Please enter Excess")
                return;
            }
            if (this.state.VesselClassError) {
                toast.error("Please select vessel class")
                return;
            }
            if (this.state.vesselTypeError) {
                toast.error("Please select vessel type")
                return;
            }
            if (this.state.UseofVesselError) {
                toast.error("Please select Use of vessel")
                return;
            }
            if (this.state.hullMaterialError) {
                toast.error("Please select hull material")
                return;
            }
            if (this.state.makeAndModelError) {
                toast.error("Please enter make and model")
                return;
            }
            if (this.state.lengthError) {
                toast.error("Please enter length")
                return;
            }
            if (this.state.vesselBuildTypeError) {
                toast.error("Please select vessel built type")
                return;
            }
            if (this.state.yearBuiltError) {
                toast.error("Please enter year built")
                return;
            }
            if (this.state.yearPurchasedError) {
                toast.error("Please enter year purchased")
                return;
            }
            if (this.state.purchasePriceError) {
                toast.error("Please enter purchase price")
                return;
            }
            if (this.state.sumInsuredError) {
                toast.error("Please enter sum insured")
                return;
            }
            if (this.state.sumInsuredMethodError) {
                toast.error("Please select sum insured method")
                return;
            }
            // if (this.state.lastSurveyDateRequired && CommonConfig.isEmpty(this.state.lastSurveyDate)) {
            //     toast.error("Please select Last Survey Date")
            //     return;
            // }
            if (this.state.whereRegError) {
                toast.error("Please select Where is boat registered")
                return;
            }
            if (this.state.boatMooredError) {
                toast.error("Please select Where is boat moored")
                return;
            }
            if (this.state.mooringTypeError) {
                toast.error("Please select mooring type")
                return;
            }
            if (this.state.mainEngineError) {
                toast.error("Please enter main engine")
                return;
            }
            if (this.state.mainEngineHpError) {
                toast.error("Please enter main engine HP")
                return;
            }
            if (this.state.mainEngineYearError) {
                toast.error("Please enter main engine year")
                return;
            }
            if (this.state.noOfMainEngineError) {
                toast.error("Please select No of main engine")
                return;
            }
            if (this.state.tarnsmissionMainEngineError) {
                toast.error("Please select Tarnsmission main engine")
                return;
            }
            if (this.state.maxSpeedError) {
                toast.error("Please enter max speed")
                return;
            }
            if (this.state.cruisingRangeError) {
                toast.error("Please select cruising range")
                return;
            }
            if (this.state.PreviousBoatingExperienceError) {
                toast.error("Please select Previous boating experience")
                return;
            }
            if (this.state.CurrentNCBYearsError) {
                toast.error("Please select your NCB years")
                return;
            }
            if (this.state.lossesError) {
                toast.error("Please select Any losses in last 5 years ?")
                return;
            }
            if (this.state.lossesDescribeError) {
                toast.error("Please enter losses description")
                return;
            }
            if (this.state.convictedError) {
                toast.error("Please select convicted or charged")
                return;
            }
            if (this.state.convictedDescribeError) {
                toast.error("Please enter convict or charge description")
                return;
            }
            if (this.state.insurancecanceledError) {
                toast.error("Please select insurance canceled or refused")
                return;
            }
            if (this.state.insurancecanceledDescribeError) {
                toast.error("Please enter insurance cancelled or refused description")
                return;
            }
            if (this.state.damagedError) {
                toast.error("Please select Has the vessel ever been damaged?")
                return;
            }
            if (this.state.damagedDescribeError) {
                toast.error("Please enter description of damage")
                return;
            }
            if (this.state.thirdPartyLiabilityError) {
                toast.error("Please select third party liability")
                return;
            }
            // if (this.state.racingEventTypeError) {
            //     toast.error("Please select Racing Event Type")
            //     return;
            // }
            // if (this.state.crewLiabilityError) {
            //     toast.error("Please select Crew Liability")
            //     return;
            // }
            if (!this.state.AssumptionAndTerms) {
                toast.error("You must agree to assumption and terms & conditions")
                return;
            }
            // this.show('country', this.state.countryError);
            // this.show('policyType', this.state.policyTypeError);
            // this.show('documentLanguage', this.state.documentLanguageError);
            // this.show('currency', this.state.currencyError);
            // this.show('vesselClass', this.state.VesselClassError);
            // this.show('vesselType', this.state.vesselTypeError);
            // this.show('UseofVessel', this.state.UseofVesselError);
            // this.show('hullMaterial', this.state.hullMaterialError);
            // this.show('makeAndModel', this.state.makeAndModelError);
            // this.show('length', this.state.lengthError);
            // this.show('yearBuilt', this.state.yearBuiltError);
            // this.show('yearPurchased', this.state.yearPurchasedError);
            // this.show('purchasePrice', this.state.purchasePriceError);
            // this.show('sumInsured', this.state.sumInsuredError);
            // this.show('sumInsuredMethod', this.state.sumInsuredMethodError);
            // this.show('whereReg', this.state.whereRegError);
            // this.show('boatMoored', this.state.boatMooredError);
            // this.show('mooringType', this.state.mooringTypeError);
            // this.show('mainEngine', this.state.mainEngineError);
            // this.show('mainEngineHp', this.state.mainEngineHpError);
            // this.show('noOfMainEngine', this.state.noOfMainEngineError);
            // this.show('mainEngineYear', this.state.mainEngineYearError);
            // this.show('tarnsmissionMainEngine', this.state.tarnsmissionMainEngineError);
            // this.show('maxSpeed', this.state.maxSpeedError);
            // this.show('cruisingRange', this.state.cruisingRangeError);
            // this.show('PreviousBoatingExperience', this.state.PreviousBoatingExperienceError);
            // this.show('losses', this.state.lossesError);
            // this.show('convicted', this.state.convictedError);
            // this.show('insurancecanceled', this.state.insurancecanceledError);
            // this.show('damaged', this.state.damagedError);
            // this.show('racingEventType', this.state.racingEventTypeError);
            // this.show('crewLiability', this.state.crewLiabilityError);
            // this.setState({ AssumptionAndTermsError: !this.state.AssumptionAndTerms});
        }
    }

    BackToPolicyList() {
        this.props.history.push({
            pathname: '/PolicyList',
        });
    }

    render() {
        const { t, i18n } = this.props;
        const SaveButton = t("buttons.Save");
        const CancelButton = t("buttons.Cancel");
        const BackButton = t("buttons.BackToPolicy");
        const AddButton = t("buttons.Add");
        const DeleteButton = t("buttons.Delete");

        return (
            <div>
                <Col style={{ marginTop: "20px" }}>
                    <div className="input-box">
                        <Row>
                            <Col md="3">
                                <h2>New Policy Quotation</h2><br />
                                <div className="policy-box">
                                    <p style={{ width: "70%" }}>Policy Number</p>
                                    <div className="pl-inner">
                                        {(this.state.changePolicyNumber) ? (
                                            <span>
                                                <Input type="text" name="policyNumber" id="policyNumber" onChange={(e) => this.handleChange(e)} onBlur={(e) => this.checkPolicyNumberExists(e.target.value)} value={this.state.policyNumber} style={{ display: "inline-block" }} />
                                                {/* <em id="policyNumberError" className="error invalid-feedback"></em> */}
                                            </span>
                                        ) : (
                                                <span>{this.state.policyNumber}</span>
                                            )}
                                        <BTN color="primary" onClick={() => this.editPolicyNumber()} title="Change Policy Number">
                                            <i className="fa fa-pencil"></i>
                                        </BTN>
                                    </div>
                                </div>
                            </Col>
                            <Col md="6"></Col>
                            <Col md="3">
                                <div className="input-box">
                                    <Row>
                                        <Col>
                                            <b>{this.state.Policy_Holder}{this.state.ContactCode}<br /></b>
                                            {this.state.Policy_Holder_Address}<br />
                                            {this.state.Policy_Holder_Conatct}<br />
                                            {this.state.Policy_Holder_Email}
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="9">
                                <div className="form-heading">
                                    <h3>General</h3>
                                </div>
                                <Card>
                                    <CardBody>
                                        <div className="input-box">
                                            <Row style={{ verticalAlign: "center" }}>
                                                <Col md="2">
                                                    <label>Binder Country *</label>
                                                    <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target, 'country')} value={this.state.country}>
                                                        <option value=''>Select</option>
                                                        {this.state.countryList.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="countryError" className="error invalid-feedback"></em>
                                                </Col>

                                                <Col md="3">
                                                    <label>Policy Type *</label>
                                                    <Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectType(e.target, 'policyType')} value={this.state.policyType}>
                                                        <option value=''>Select</option>
                                                        {this.state.policyTypeList.map((type, i) => {
                                                            return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="policyTypeError" className="error invalid-feedback"></em>
                                                </Col>

                                                <Col md="3">
                                                    <label>Document Language *</label>
                                                    {(this.state.isEditDocLang) ? (
                                                        <div>
                                                            <Input type="select" name="documentLanguage" id="documentLanguage" onChange={(e) => this.selectType(e.target, 'documentLanguage')} value={this.state.documentLanguage}>
                                                                <option value=''>Select</option>
                                                                {this.state.documentLanguageList.map((type, i) => {
                                                                    return (<option value={type.value}>{type.label}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="documentLanguageError" className="error invalid-feedback"></em>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                {this.state.documentLanguage}
                                                            </div>
                                                        )}
                                                </Col>

                                                {(this.state.isInsert) ? (null) :
                                                    (
                                                        <Col md="1" >
                                                            {(this.state.isEditDocLang) ? (
                                                                <Button type='button' tooltip="Save" icon="fa fa-save" style={{ float: "left", margin: "3px" }} color="primary" onClick={() => this.editDocLang('View')} />

                                                            ) : (
                                                                    <Button type='button' tooltip="Edit" icon="fa fa-pencil" style={{ float: "left", margin: "3px" }} color="primary" onClick={() => this.editDocLang('Edit')} />
                                                                )}
                                                        </Col>
                                                    )}

                                                <Col md="2">
                                                    <label>Currency *</label>
                                                    {(this.state.isEditCurrency) ? (
                                                        <div>
                                                            <Input type="select" name="currency" id="currency" onChange={(e) => this.selectType(e.target, 'currency')} value={this.state.currency}>
                                                                <option value=''>Select</option>
                                                                {this.state.currencyList.map((type, i) => {
                                                                    return (<option value={type.value}>{type.label}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="currencyError" className="error invalid-feedback"></em>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                {this.state.currency}
                                                            </div>
                                                        )}
                                                </Col>
                                                <Col md="2" style={{ alignSelf: "center" }}>
                                                    <h5>Refer<Input type="checkbox" name="refer" id="refer" value={this.state.refer} style={{ marginLeft: "3px" }} checked={this.state.refer == true ? "checked" : ""} onChange={(e) => this.handleChange(e)} />
                                                        <em id="referError" className="error invalid-feedback"></em>
                                                    </h5>
                                                </Col>
                                                {(this.state.isInsert) ? (null) :
                                                    (
                                                        <Col md="1">
                                                            {(this.state.isEditCurrency) ? (
                                                                <Button type='button' tooltip="Save" icon="fa fa-save" style={{ float: "left", margin: "3px" }} color="primary" onClick={() => this.editCurrency('View')} />

                                                            ) : (
                                                                    <Button type='button' tooltip="Edit" icon="fa fa-pencil" style={{ float: "left", margin: "3px" }} color="primary" onClick={() => this.editCurrency('Edit')} />
                                                                )}
                                                        </Col>
                                                    )}
                                            </Row>
                                        </div>
                                        <div className="input-box">
                                            <Row>
                                                <Col md="3">
                                                    <label>Policy Effective Date</label>
                                                    <div>
                                                        {/* <DatePicker name="policyEffectiveDate" onChange={e => this.setState({ policyEffectiveDate: e })}
                                                            value={this.state.policyEffectiveDate} className="policyEffectiveDate" calendarClassName="" minDate={moment().toDate()}
                                                        /> */}
                                                        <Input type="date" name="policyEffectiveDate" id="policyEffectiveDate" placeholder="Date of Birth" onBlur={(e) => this.handleChange(e)}
                                                            onChange={(e) => this.handleChange(e)} value={this.state.policyEffectiveDate}
                                                            min={moment().format('YYYY-MM-DD')}
                                                        // max={moment().subtract(12, 'years').format('YYYY-MM-DD')}
                                                        />
                                                        <em id="policyEffectiveDateError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <label>{t("policyUnderwriting:Department.label")} *</label>
                                                    <div>
                                                        <Input type="select" name="PolicyDepartment" disabled={this.state.departmentDisable == true ? true : false} id="PolicyDepartment" onChange={(e) => this.selectType(e.target.value, 'PolicyDepartment')} value={this.state.PolicyDepartment}>
                                                            <option value=''>{t("policyUnderwriting:Department.defaultValue")}</option>
                                                            {this.state.departmentList.map((ct, i) => {
                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="PolicyDepartmentError" className="error invalid-feedback" ></em>
                                                    </div>
                                                </Col>
                                                {(this.state.sourceDisplay) ?
                                                    <Col md="3">
                                                        <label>{t("policyUnderwriting:Source.label")}</label>
                                                        <div>
                                                            <Select name="source" id="source" options={this.state.sourceList} value={this.state.source} onChange={(data) => this.selectType(data, 'source')} placeholder={t("policyUnderwriting:Source.defaultValue")} />
                                                            <em id="sourceError" className="error invalid-feedback"></em>
                                                            {/* <Input type="select" name="source" disabled={this.state.sourceDisable == true ? true : false} id="source" onChange={(e) => this.selectType(e.target.value, 'source')} value={this.state.source}>
                                                                <option value=''>{t("policyUnderwriting:Source.defaultValue")}</option>
                                                                {this.state.sourceList.map((ct, i) => {
                                                                    return (<option value={ct.OrganizationId} key={i}>{ct.OrganizationName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="sourceError" className="error invalid-feedback" ></em> */}
                                                        </div>
                                                    </Col>
                                                    : null}
                                                <Col md="2" style={{ alignSelf: "center" }}>
                                                    <h6>Third Party Only<Input type="checkbox" name="TPO" id="TPO" value={this.state.TPO} style={{ marginLeft: "3px" }} checked={this.state.TPO == true ? "checked" : ""} onChange={(e) => this.handleChange(e)} />
                                                        <em id="TPOError" className="error invalid-feedback"></em>
                                                    </h6>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            {(this.state.isShowNonRateParams == 1)
                                ? (<Col md="3">
                                    <div className="form-heading">
                                        <h3>Non Rated Policy Params</h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row style={{ verticalAlign: "center" }}>
                                                    <Col md="12">
                                                        <label>Rate *</label>
                                                        <Input type="text" name="rate" id="rate" onChange={(e) => this.handleChange(e)} value={this.state.rate} />
                                                        <em id="rateError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="12">
                                                        <label>Excess *</label>
                                                        <Input type="text" name="excess" id="excess" onChange={(e) => this.handleChange(e)} value={this.state.excess} />
                                                        <em id="excessError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>)
                                : (null)}
                            {(this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel' || this.state.policyType == 'Engineering')
                                ? (<Col md="3">
                                    <div className="form-heading">
                                        <h3>
                                            {(this.state.policyType == 'MarineTrade')?'Marine Trade':(this.state.policyType == 'MultiVessel')?'Multi Vessel':'Engineering'} Params
                                        </h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row style={{ verticalAlign: "center" }}>
                                                    <Col md="12">
                                                        <label>Binder *</label>
                                                        <Input type="select" name="binder" id="binder" onChange={(e) => this.selectType(e.target, 'binder')} value={this.state.binder}>
                                                            <option value=''>Select</option>
                                                            {this.state.binderList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="binderError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="12">
                                                        <label>Premium *</label>
                                                        <Input type="text" name="premium" id="premium" onChange={(e) => this.handleChange(e)} value={this.state.premium} />
                                                        <em id="excessError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="12">
                                                        <label>Levy *</label>
                                                        <Input type="text" name="levy" id="levy" onChange={(e) => this.handleChange(e)} value={this.state.levy} />
                                                        <em id="excessError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="12">
                                                        <label>Admin Fee *</label>
                                                        <Input type="text" name="adminFee" id="adminFee" onChange={(e) => this.handleChange(e)} value={this.state.adminFee} />
                                                        <em id="excessError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="12">
                                                        <label>Total</label>
                                                        <Input type="text" name="total" id="total" onChange={(e) => this.handleChange(e)} value={this.state.total} readOnly />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>)
                                : (null)}
                        </Row>
                        {(this.state.conditionalVessel) ?
                            (<Row>
                                <Col md="12">
                                    <div className="form-heading">
                                        <h3>Vessel</h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Class *</label>
                                                        <Select name="vesselClass" id="vesselClass" options={this.state.VesselClassList} value={this.state.vesselClass} onChange={(data) => this.selectType(data, 'vesselClass')} placeholder="Select"
                                                        />
                                                        <em id="whereRegError" className="error invalid-feedback"></em>

                                                        {/* <Input type="select" name="vesselClass" id="vesselClass" onChange={(e) => this.selectType(e.target, 'vesselClass')} value={this.state.vesselClass}>
                                                        <option value=''>Select</option>
                                                        {this.state.VesselClassList.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="vesselClassError" className="error invalid-feedback"></em> */}
                                                    </Col>

                                                    <Col md="3">
                                                        <label>Type *</label>
                                                        <Select name="vesselType" id="vesselType" options={this.state.vesselTypeList} value={this.state.vesselType} onChange={(data) => this.selectType(data, 'vesselType')} placeholder="Select"
                                                        />
                                                        <em id="vesselTypeError" className="error invalid-feedback"></em>

                                                        {/* <Input type="select" name="vesselType" id="vesselType" onChange={(e) => this.selectType(e.target, 'vesselType')} value={this.state.vesselType}>
                                                        <option value=''>Select</option>
                                                        {this.state.vesselTypeList.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="vesselTypeError" className="error invalid-feedback"></em> */}
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Vessel Name</label>
                                                        <Input type="text" name="vesselName" id="vesselName" onChange={(e) => this.handleChange(e)} value={this.state.vesselName} placeholder="Vessel Name" />
                                                        <em id="vesselNameError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Use of Vessel *</label>
                                                        <Input type="select" name="UseofVessel" id="UseofVessel" onChange={(e) => this.selectType(e.target.value, 'UseofVessel')} value={this.state.UseofVessel}>
                                                            <option value=''>Select</option>
                                                            {this.state.UseofVesselList.map((type, i) => {
                                                                return (<option value={type.Description}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="UseofVesselError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Hull Material *</label>
                                                        <Input type="select" name="hullMaterial" id="hullMaterial" onChange={(e) => this.selectType(e.target.value, 'hullMaterial')} value={this.state.hullMaterial}>
                                                            <option value=''>Select</option>
                                                            {this.state.hullMaterialList.map((type, i) => {
                                                                return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="hullMaterialError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>Make & Model *</label>
                                                        <Input type="text" name="makeAndModel" id="makeAndModel" onChange={(e) => this.handleChange(e)} value={this.state.makeAndModel} placeholder="Make & Model" />
                                                        <em id="makeAndModelError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Length (meters) *</label>
                                                        <Input type="text" name="length" id="length" onChange={(e) => this.handleChange(e)} value={this.state.length} placeholder="Length (meters)" />
                                                        <em id="lengthError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Type of Build *</label>
                                                        <Input type="select" name="vesselBuildType" id="vesselBuildType"
                                                            value={this.state.vesselBuildType} onChange={(e) => this.selectType(e.target.value, 'vesselBuildType')}
                                                        >
                                                            <option value=''>Select</option>
                                                            {this.state.vesselBuildTypearr.map((type, i) => {
                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="vesselBuildTypeError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Year Built *</label>
                                                        <Input type="text" name="yearBuilt" id="yearBuilt" onChange={(e) => this.handleChange(e)} value={this.state.yearBuilt} placeholder="Year Built" />
                                                        <em id="yearBuiltError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Year Purchased *</label>
                                                        <Input type="text" name="yearPurchased" id="yearPurchased" onChange={(e) => this.handleChange(e)} value={this.state.yearPurchased} placeholder="Year Purchased" />
                                                        <em id="yearPurchasedError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Purchase Price *</label>
                                                        <Input type="text" name="purchasePrice" id="purchasePrice" onChange={(e) => this.handleChange(e)} value={this.state.purchasePrice} placeholder="Purchase Price" />
                                                        <em id="purchasePriceError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>Sum Insured *</label>
                                                        <Input type="text" name="sumInsured" id="sumInsured" onChange={(e) => this.handleChange(e)} value={this.state.sumInsured} placeholder="Sum Insured" />
                                                        <em id="sumInsuredError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Sum Insured Method *</label>
                                                        <Input type="select" name="sumInsuredMethod" id="sumInsuredMethod" onChange={(e) => this.selectType(e.target.value, 'sumInsuredMethod')} value={this.state.sumInsuredMethod}>
                                                            {this.state.sumInsuredMethodList.map((type, i) => {
                                                                return (<option value={type.Description}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="sumInsuredMethodError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="3">
                                                        <label>Last Survey Date {(this.state.lastSurveyDateRequired) ? '*' : (null)}</label>
                                                        {/* <DatePicker name="lastSurveyDate" onChange={e => this.setState({ lastSurveyDate: e })}
                                                        value={this.state.lastSurveyDate} className="" id="lastSurveyDate" calendarClassName="" maxDate={moment().toDate()}
                                                    /> */}
                                                        <Input type="date" name="lastSurveyDate" id="lastSurveyDate" placeholder="Date of Birth" onBlur={(e) => this.handleChange(e)}
                                                            onChange={(e) => this.handleChange(e)} value={this.state.lastSurveyDate}
                                                            min={moment().subtract(5, 'years').format('YYYY-MM-DD')}
                                                            max={moment().format('YYYY-MM-DD')}
                                                        />
                                                        <em id="lastSurveyDateError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Where is boat registered? *</label>
                                                        <Select name="whereReg" id="whereReg" options={this.state.whereRegList} value={this.state.whereReg} onChange={(data) => this.selectType(data, 'whereReg')} placeholder="Select"
                                                        />
                                                        <em id="whereRegError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="4">
                                                        <label>Where is the boat Moored? *</label>
                                                        <Select name="boatMoored" id="boatMoored" options={this.state.boatMooredList} value={this.state.boatMoored} onChange={(data) => this.selectType(data, 'boatMoored')} placeholder="Select"
                                                        />
                                                        <em id="boatMooredError" className="error invalid-feedback"></em>
                                                    </Col>
                                                    <Col md="2">
                                                        <label>Mooring Type *</label>
                                                        <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectType(e.target, 'mooringType')} value={this.state.mooringType}>
                                                            <option value=''>Select</option>
                                                            {this.state.mooringTypeList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="mooringTypeError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                            : (null)}

                        {(this.state.conditionalEngine)
                            ?
                            (<Row>
                                <Col md="12">
                                    <div className="form-heading">
                                        <h3>Engine & Trailer Details</h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>Main Engine(s) *</label>
                                                        <Input type="text" name="mainEngine" id="mainEngine" placeholder="Main Engine(s)" onChange={(e) => this.handleChange(e)} value={this.state.mainEngine} />
                                                        <em id="mainEngineError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="1">
                                                        <label>HP *</label>
                                                        <Input type="text" name="mainEngineHp" id="mainEngineHp" onChange={(e) => this.handleChange(e)} value={this.state.mainEngineHp} />
                                                        <em id="mainEngineHpError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Year *</label>
                                                        <Input type="text" name="mainEngineYear" id="mainEngineYear" onChange={(e) => this.handleChange(e)} value={this.state.mainEngineYear} />
                                                        <em id="mainEngineYearError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="3">
                                                        <div className="input-box">
                                                            <label>{this.state.mainengineSerialNoLabel}</label>
                                                            <Input type="text" name="mainEngineSerialNo" id="mainEngineSerialNo"
                                                                onChange={(e) => this.handleChange(e)} value={this.state.mainEngineSerialNo}
                                                            // onBlur={(e) => this.handleChange(e)}
                                                            >
                                                            </Input>
                                                            <em id="documentLanguageError" className="error invalid-feedback"></em>
                                                            <em className="error invalid-feedback" >Please enter serial number of Main Engine</em>
                                                        </div>
                                                    </Col>

                                                    <Col md="2" >
                                                        <label>No of Engines *</label>
                                                        <Input type="select" name="noOfMainEngine" id="noOfMainEngine" onChange={(e) => this.selectType(e.target.value, 'noOfMainEngine')} value={this.state.noOfMainEngine}>
                                                            <option value=''>Select</option>
                                                            {this.state.noOfEngineList.map((type, i) => {
                                                                return (<option value={type.Description}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="noOfMainEngineError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Transmission *</label>
                                                        <Input type="select" name="tarnsmissionMainEngine" id="tarnsmissionMainEngine" onChange={(e) => this.selectType(e.target.value, 'tarnsmissionMainEngine')} value={this.state.tarnsmissionMainEngine}>
                                                            <option value=''>Select</option>
                                                            {this.state.tarnsmissionMainEngineList.map((type, i) => {
                                                                return (<option value={type.Description}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="tarnsmissionMainEngineError" className="error invalid-feedback"></em>
                                                    </Col>

                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>Auxiliary Engine</label>
                                                        <Input type="text" name="auxiliaryEngine" id="auxiliaryEngine" placeholder="Auxiliary Engine" onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngine} />
                                                        <em id="auxiliaryEngineError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="1">
                                                        <label>HP</label>
                                                        <Input type="text" name="auxiliaryEngineHp" id="auxiliaryEngineHp" onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineHp} />
                                                        <em id="auxiliaryEngineHpError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Year</label>
                                                        <Input type="text" name="auxiliaryEngineYear" id="auxiliaryEngineYear" onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineYear} />
                                                        <em id="auxiliaryEngineYearError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="3">
                                                        <div className="input-box">
                                                            <label>{this.state.auxiliaryEngineSerialNoLabel}</label>
                                                            <Input type="text" name="auxiliaryEngineSerialNo" id="auxiliaryEngineSerialNo"
                                                                onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineSerialNo}
                                                            // onBlur={(e) => this.handleChange(e)}
                                                            >
                                                            </Input>
                                                            <em className="error invalid-feedback" >Please enter serial number of auxiliary engine</em>
                                                        </div>
                                                    </Col>

                                                    <Col md="2" >
                                                        <label>No of Engines</label>
                                                        <Input type="select" name="noOfAuxiliaryEngine" id="noOfAuxiliaryEngine" onChange={(e) => this.selectType(e.target.value, 'noOfAuxiliaryEngine')} value={this.state.noOfAuxiliaryEngine}>
                                                            <option value=''>Select</option>
                                                            {this.state.noOfEngineList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="noOfAuxiliaryEngineError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2" >
                                                        <label>Transmission</label>
                                                        <Input type="select" name="auxiliaryEngineTransmission" id="auxiliaryEngineTransmission" onChange={(e) => this.selectType(e.target.value, 'auxiliaryEngineTransmission')} value={this.state.auxiliaryEngineTransmission}>
                                                            <option value=''>Select</option>
                                                            {this.state.tarnsmissionMainEngineList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="auxiliaryEngineTransmissionError" className="error invalid-feedback"></em>
                                                    </Col>

                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>Max Speed (Knots)*</label>
                                                        <Input type="text" name="maxSpeed" id="maxSpeed" placeholder="Max Speed" onChange={(e) => this.handleChange(e)} value={this.state.maxSpeed} />
                                                        <em id="maxSpeedError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Make of Trailer</label>
                                                        <Input type="text" name="makeofTrailer" id="makeofTrailer" placeholder="Make of Trailer" onChange={(e) => this.handleChange(e)} value={this.state.makeofTrailer} />
                                                        <em id="makeofTrailerError" className="error invalid-feedback"></em>
                                                    </Col>

                                                    <Col md="2">
                                                        <label>Trailer Serial No.</label>
                                                        <Input type="text" name="trailerSerialNo" id="trailerSerialNo" placeholder="Trailer Serial No." onChange={(e) => this.handleChange(e)} value={this.state.trailerSerialNo} />
                                                        <em id="trailerSerialNoError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>

                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                            : (null)}

                        {(this.state.conditionalNavigation) ?
                            (<Row>
                                <Col md="12">
                                    <div className="form-heading">
                                        <h3>Navigational Limits</h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="11">
                                                        <label>Cruising Range *</label>
                                                        <Select name="cruisingRange" id="cruisingRange" options={this.state.cruisingRangeList} value={this.state.cruisingRange} onChange={(data) => this.selectType(data, 'cruisingRange')} placeholder="Select" />
                                                        <em id="cruisingRangeError" className="error invalid-feedback"></em>

                                                        {/* <Input type="select" name="cruisingRange" id="cruisingRange" placeholder="Cruising Range" onChange={(e) => this.selectType(e.target, 'cruisingRange')} value={this.state.cruisingRange}>
                                                        <option value=''>Select</option>
                                                        {this.state.cruisingRangeList.map((ct, i) => {
                                                            return (<option value={ct.StringMapKey}>{ct.Description}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="cruisingRangeError" className="error invalid-feedback"></em> */}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="9">
                                                        <label>Additional Cruising Range</label>
                                                        <InputTextarea style={{ width: "100%" }} rows={1} autoResize={true} name="additionalCruisingRange" id="additionalCruisingRange" placeholder="Additional Cruising Range" onChange={(e) => this.handleChange(e)} value={this.state.additionalCruisingRange} />
                                                        <em id="additionalCruisingRangeError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                            : (null)}

                        {(this.state.conditionalGeneral) ?
                            (<Row>
                                <Col md="12">
                                    <div className="form-heading">
                                        <h3>General Questions</h3>
                                    </div>
                                    <Card>
                                        <CardBody>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="4">
                                                        <label>Previous Boating Experience (Years)*</label>
                                                        <div>
                                                            <Input type="select" style={{ float: "left", marginRight: "8px" }} name="PreviousBoatingExperience" id="PreviousBoatingExperience" onChange={(e) => this.selectType(e.target.value, 'PreviousBoatingExperience')} value={this.state.PreviousBoatingExperience}>
                                                                <option value=''>Select</option>
                                                                {this.state.PreviousBoatingExperienceList.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="PreviousBoatingExperienceError" className="error invalid-feedback"></em>
                                                        </div>
                                                    </Col>
                                                    <Col md="3">
                                                        <label>Select your NCB (Years)*</label>
                                                        <div>
                                                            <Input type="select" style={{ float: "left", marginRight: "8px" }} name="CurrentNCBYears" id="CurrentNCBYears" onChange={(e) => this.selectType(e.target.value, 'CurrentNCBYears')} value={this.state.CurrentNCBYears}>
                                                                <option value=''>Select</option>
                                                                {this.state.CurrentNCBYearsList.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="CurrentNCBYearsError" className="error invalid-feedback"></em>
                                                        </div>
                                                    </Col>
                                                    <Col md="3">
                                                        <div className="input-box">
                                                            <label>{t("policyGeneral:previousInsurer.label")}</label>


                                                            <AutoComplete placeholder="Previous Insurer Name" value={this.state.previousInsurer} id='previousInsurer' onChange={(e) => this.setState({ previousInsurer: e.value },
                                                                this.changePreviousInsurer(e.value))} suggestions={this.state.previousInsurerSuggestions} completeMethod={this.suggestPreviousInsurer.bind(this)} />
                                                            <em id="previousInsurerError" className="error invalid-feedback" ></em>


                                                            {/* <Input type="select" name="previousInsurer" id="previousInsurer" onChange={(e) => this.selectType(e.target.value, 'previousInsurer')} value={this.state.previousInsurer}>
                                                            <option value=''>{t("policyGeneral:previousInsurer.defaultValue")}</option>
                                                            {this.state.previousInsurerList.map((ct, i) => {
                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                            })}
                                                        </Input>
                                                        <em id ="previousInsurerError" className="error invalid-feedback" ></em> */}
                                                        </div>
                                                    </Col>

                                                    <Col md="2">
                                                        <div className="input-box">
                                                            <label>Previous Policy No.</label>
                                                            <Input type="text" placeholder="Previous Policy" name="previousPolicyNo" id="previousPolicyNo" onChange={(e) => this.handleChange(e)} value={this.state.previousPolicyNo}></Input>
                                                            <em id="previousPolicyNoError" className="error invalid-feedback" ></em>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="4">
                                                        <label>{t("policyGeneral:boatingQualifications.label")}</label>
                                                        <div>
                                                            <Input type="select" name="boatingQualifications" id="boatingQualifications" onChange={(e) => this.selectType(e.target.value, 'boatingQualifications')} value={this.state.boatingQualifications}>
                                                                <option value=''>Select</option>
                                                                {this.state.boatingQualificationList.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="boatingQualificationsError" className="error invalid-feedback"></em>
                                                            <div>
                                                                <table className="added-detail-table" style={{ marginTop: "10px" }}>
                                                                    <tbody>
                                                                        {this.state.boatingQualificationsArr.map((bqa, i) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        {(bqa.BoatingQualificationName)}
                                                                                    </td>
                                                                                    <td>
                                                                                        <span>
                                                                                            <BTN type='button' tooltip="Delete" color="danger" onClick={() => this.delete(bqa)}>
                                                                                                <i className="fa fa-trash"></i>
                                                                                            </BTN>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md="1">
                                                        <div className="add-btn">
                                                            <Button type='button' tooltip="Add" icon="fa fa-plus" color="primary" onClick={() => this.ValidateAndAddBoatingQualification()} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="6">
                                                        <label>Any Losses in last 5 years? *</label>
                                                        <div>
                                                            <Input type="select" name="losses" id="losses" onChange={(e) => this.selectType(e.target.value, 'losses')} value={this.state.losses}>
                                                                <option value=''>Select</option>
                                                                {this.state.Options.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="lossesError" className="error invalid-feedback"></em>
                                                        </div>
                                                        {(this.state.showLossesDescribe) ? (
                                                            <label>Describe</label>
                                                        ) : (
                                                                null
                                                            )}

                                                        <div>
                                                            {(this.state.showLossesDescribe) ? (
                                                                <div>
                                                                    <InputTextarea style={{ width: "100%" }} rows={1} autoResize={true} name="lossesDescribe" id="lossesDescribe" onChange={(e) => this.handleChange(e)} value={this.state.lossesDescribe} />
                                                                    <em id="lossesDescribeError" className="error invalid-feedback"></em>
                                                                </div>
                                                            ) : (
                                                                    null
                                                                )}
                                                            {/* {(this.state.lossesDescribeError) ? (
                                                        ) : (
                                                                null
                                                            )} */}
                                                        </div>
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Has been Convicted or Charged? *</label>
                                                        <div>
                                                            <Input type="select" name="convicted" id="convicted" onChange={(e) => this.selectType(e.target.value, 'convicted')} value={this.state.convicted}>
                                                                <option value=''>Select</option>
                                                                {this.state.Options.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="convictedError" className="error invalid-feedback"></em>
                                                        </div>

                                                        {(this.state.showconvictedDescribe) ? (
                                                            <label>Describe</label>
                                                        ) : (
                                                                null
                                                            )}
                                                        <div>
                                                            {(this.state.showconvictedDescribe) ? (
                                                                <div>
                                                                    <InputTextarea style={{ width: "100%" }} rows={1} cols={30} autoResize={true} name="convictedDescribe" id="convictedDescribe" onChange={(e) => this.handleChange(e)} value={this.state.convictedDescribe} />
                                                                    <em id="convictedDescribeError" className="error invalid-feedback" style={{ display: "block" }}></em>
                                                                </div>
                                                            ) : (
                                                                    null
                                                                )}
                                                            {/* {(this.state.convictedDescribeError) ? (
                                                            
                                                            // <em className="error invalid-feedback" style={{ display: "block" }}>Please enter convicted or charged describe</em>
                                                        ) : (
                                                                null
                                                            )} */}

                                                        </div>

                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="6">
                                                        <label>Has the Insurance been canceled or refused? *</label>
                                                        <div>
                                                            <Input type="select" name="insurancecanceled" id="insurancecanceled" onChange={(e) => this.selectType(e.target.value, 'insurancecanceled')} value={this.state.insurancecanceled}>
                                                                <option value=''>Select</option>
                                                                {this.state.Options.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="insurancecanceledError" className="error invalid-feedback"></em>
                                                        </div>
                                                        {(this.state.showinsurancecanceledDescribe) ? (
                                                            <label>Describe</label>
                                                        ) : (
                                                                null
                                                            )}
                                                        <div>
                                                            {(this.state.showinsurancecanceledDescribe) ? (
                                                                <div>
                                                                    <InputTextarea style={{ width: "100%" }} rows={1} cols={30} autoResize={true} name="insurancecanceledDescribe" id="insurancecanceledDescribe" onChange={(e) => this.handleChange(e)} value={this.state.insurancecanceledDescribe} />
                                                                    <em id="insurancecanceledDescribeError" className="error invalid-feedback" style={{ display: "block" }}></em>
                                                                </div>
                                                            ) : (
                                                                    null
                                                                )}
                                                            {/* {(this.state.insurancecanceledDescribeError) ? (
                                                            
                                                            // <em className="error invalid-feedback" style={{ display: "block" }}>Please enter insurance canceled or refused describe</em>
                                                        ) : (
                                                                null
                                                            )} */}

                                                        </div>
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Has the vessel ever been damaged? *</label>
                                                        <div>
                                                            <Input type="select" name="damaged" id="damaged" onChange={(e) => this.selectType(e.target.value, 'damaged')} value={this.state.damaged}>
                                                                <option value=''>Select</option>
                                                                {this.state.Options.map((ct, i) => {
                                                                    return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="damagedError" className="error invalid-feedback"></em>
                                                        </div>
                                                        {(this.state.showdamagedDescribe) ? (
                                                            <label>Describe</label>
                                                        ) : (
                                                                null
                                                            )}
                                                        <div>
                                                            {(this.state.showdamagedDescribe) ? (
                                                                <div>
                                                                    <InputTextarea style={{ width: "100%" }} rows={1} cols={30} autoResize={true} name="damagedDescribe" id="damagedDescribe" onChange={(e) => this.handleChange(e)} value={this.state.damagedDescribe} />
                                                                    <em id="damagedDescribeError" className="error invalid-feedback" style={{ display: "block" }}></em>
                                                                </div>
                                                            ) : (
                                                                    null
                                                                )}
                                                            {/* {(this.state.damagedDescribeError) ? (
                                                            
                                                            // <em className="error invalid-feedback" style={{ display: "block" }}>Please enter damaged describe</em>
                                                        ) : (
                                                                null
                                                            )} */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                            : (null)}

                        {(this.state.conditionalLimits) ?
                            (<Row>
                                <Col md="12">
                                    <div className="form-heading">
                                        <h3>Limits / Additional Cover</h3>
                                    </div>
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Third Party Liability *</label>
                                                        <div>
                                                            <Input type="select" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                                                <option value=''>Select</option>
                                                                {this.state.ThirdPartyLiabilityList.map((type, i) => {
                                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                            <em id="thirdPartyLiabilityError" className="error invalid-feedback"></em>
                                                        </div>

                                                    </Col>
                                                </Row>
                                            </div>
                                            {(this.state.DisplayWater == 1) ?
                                                (
                                                    <div>
                                                        <div className="input-box">
                                                            <Row>
                                                                <Col md="2">
                                                                    <label>Water Skiing Liability</label>
                                                                </Col>
                                                                <Col md="2">

                                                                    <div>
                                                                        <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} />
                                                                        {this.state.isWaterSkiing ? (
                                                                            <Input type="text" name="waterSkiingLiability" id="waterSkiingLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterSkiingLiability} readOnly />
                                                                        ) : (null)}
                                                                        <em id="waterSkiingLiabilityError" className="error invalid-feedback"></em>
                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className="input-box">
                                                            <Row>
                                                                <Col md="2">
                                                                    <label>Water Toys Liabiility</label>
                                                                </Col>
                                                                <Col md="2">

                                                                    <div>
                                                                        <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} />
                                                                        {this.state.isWaterToys ? (
                                                                            <Input type="text" name="waterToysLiability" id="waterToysLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterToysLiability} readOnly />
                                                                        ) : (null)}
                                                                        <em id="waterToysLiabilityError" className="error invalid-feedback"></em>
                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                ) : (null)}
                                            {(this.state.DisplayRacing == 1) ?
                                                (
                                                    <div>
                                                        <div className="input-box">
                                                            <Row>
                                                                <Col md="3">
                                                                    <label>Sail Racing Coverage Required?</label>
                                                                </Col>
                                                                <Col md="2">

                                                                    <div>
                                                                        <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} />
                                                                        {this.state.isSailRacing ? (
                                                                            <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage} />
                                                                        ) : (null)}
                                                                        <em id="sailRacingCoverageError" className="error invalid-feedback"></em>
                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                ) : (null)}


                                            <div className="input-box">
                                                <Row>
                                                    {(this.state.DisplayRacing == 1) ?
                                                        (
                                                            <Col md="4">
                                                                <label>Racing Event Type *</label>
                                                                <div>
                                                                    <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                                        <option value=''>Select</option>
                                                                        {this.state.RacingEventTypeList.map((type, i) => {
                                                                            return (<option value={type.value}>{type.label}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em id="racingEventTypeError" className="error invalid-feedback"></em>
                                                                </div>
                                                            </Col>
                                                        ) : (null)}
                                                    {(this.state.DisplayCrew == 1) ?
                                                        (
                                                            <Col md="2">
                                                                <label>Crew Liability? *</label>
                                                                <div>
                                                                    <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                                        <option value=''>Select</option>
                                                                        {this.state.CrewLiabilityList.map((type, i) => {
                                                                            return (<option value={type.value}>{type.label}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em id="crewLiabilityError" className="error invalid-feedback"></em>
                                                                </div>
                                                            </Col>
                                                        ) : (null)}
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                            : (null)}

                        {(this.state.LoginUserType == "InternalStaff") ? (null) :
                            (<div className="input-box">
                                <Row>
                                    <Col md="12">
                                        <Input type="checkbox" name="AssumptionAndTerms" id="AssumptionAndTerms" onChange={(e) => this.handleChange(e)} checked={this.state.AssumptionAndTerms == true ? "checked" : ""} value={this.state.AssumptionAndTerms} />
                                        <span>I agree to the {this.state.assumptionCount == 0 ? 'Assumption' : (<a onClick={() => this.openModal('Assumption')} style={{ textDecorationLine: 'underline', cursor: 'pointer' }}>Assumptions</a>)} as well as <a onClick={() => this.openModal('TermsAndCondition')} style={{ textDecorationLine: 'underline', cursor: 'pointer' }}>Terms & Conditions</a></span>
                                        {(this.state.AssumptionAndTermsError)
                                            ? <p style={{ color: 'red' }}>You must agree to Assumption And Terms & Conditions</p>
                                            : (null)}
                                    </Col>
                                </Row>
                            </div>)}
                        <div className="input-box">
                            <Row>
                                <Col md="12" style={{ textAlign: "center" }}>
                                    <Button color="success" onClick={() => this.BackToPolicyList()} label={BackButton} icon="fa fa-angle-left" style={{ marginRight: 10 }} />

                                    {(this.state.refer)
                                        ? (<Button color="success" onClick={() => this.Save()} label="Generate Quotation Referred" icon="fa fa-check" />)
                                        : (<Button color="success" onClick={() => this.Save()} label="Generate Quotation" icon="fa fa-check" disabled={!this.state.AssumptionAndTerms} />)}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Modal isOpen={this.state.toggleModal} toggle={() => this.toggleLarge('Delete')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleLarge('Delete')}>Delete Boating Qualification</ModalHeader>
                    <ModalBody>
                        Are you sure you want to Delete Boating Qualification?
                    </ModalBody>
                    <ModalFooter>
                        <button color="primary" onClick={() => this.deleteBoatingQualification(this.state.temData)}>Yes</button>
                        <button color="secondary" onClick={() => this.toggleLarge('Delete')}>Cancel</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.toggleAssumption} toggle={() => this.toggleLarge('Assumption')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleLarge('Assumption')}>Assumption</ModalHeader>
                    <ModalBody>
                        <ul>
                            {this.state.assumptionArr.map((type, i) => {
                                return (<li>{type.AssumptionDescription}</li>)
                            })}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <button color="secondary" onClick={() => this.toggleLarge('TermsAndCondition')}>Close</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.toggleTermsAndCondition} toggle={() => this.toggleLarge('TermsAndCondition')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleLarge('TermsAndCondition')}>Terms And Condition</ModalHeader>
                    <ModalBody>
                        <div dangerouslySetInnerHTML={{ __html: t("translation:termsAndCondition.terms") }}></div>
                    </ModalBody>
                    <ModalFooter>
                        <button color="secondary" onClick={() => this.toggleLarge('TermsAndCondition')}>Close</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default withTranslation()(NewPolicy);