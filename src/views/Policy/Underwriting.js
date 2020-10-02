import React, { Component } from 'react';
import Select from 'react-select';
import { AutoComplete } from 'primereact/autocomplete';
import { Col, Row, Container, Form, Input, Card, CardBody, Collapse, Button as BTN, CardHeader } from 'reactstrap';
import api from '../../utils/apiClient';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { date } from 'yup';
import { number } from 'prop-types';

class Underwriting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            PolicyCountry: this.props.PolicyCountry,
            PolicyId: this.props.match.params.id,
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            PolicyType: '',
            departmentList: [],
            sourceList: [],
            sourceDisplay: false,
            awaitingDocumentList: [],
            premiumCreditList: [],
            thirdPartyLiabilityList: [],
            racingEventTypeList: [],
            crewLiabilityList: [],
            govtLevyList: [],
            binders: [],
            subBinders: [],
            currentNCBNoofYearsList: [],

            showPolicyDates: false,
            showPolicyOptionsAdjustments: false,
            showLimitsAdditionalCoverCommissionFeesandLevy: false,
            showRatingExcess: false,

            currentNCBYears: "",
            currentNCBYearsError: true,

            currentNCBAmount: 0,
            currentNCBAmountError: true,

            PolicyGeneralId: '',

            amount: 100,
            binder: '',
            binderSuggestions: null,
            selectBinderError: true,
            subBinder: '',
            subBinderError: false,
            subbinderSuggestions: null,
            insuranceComapny: '',
            nextBinder: '',
            nextInsuranceComapny: '',
            isDisplayNext: 0,
            department: '',
            departmentError: false,
            source: '',
            sourceError: false,
            awaitingDocuments: '',
            awaitingDocumentsError: false,
            premiumCredits: '',
            premiumCreditsError: false,
            liabilityType: '',
            thirdPartyLiability: '',
            thirdPartyLiabilityError: false,
            isWaterSkiing: false,
            waterSkiingLiability: '',
            isWaterToys: false,
            waterToysLiability: '',
            isSailRacing: false,
            sailRacingCoverage: '',
            sailRacingCoverageError: false,
            racingEventType: '',
            racingEventTypeError: false,
            crewLiability: '',
            crewLiabilityError: false,
            excess: '',
            excessError: false,
            inceptionDate: '',
            inceptionDateError: true,
            isInceptionEdit: false,
            renewalDate: '',
            renewalDateError: true,
            isRenewalEdit: false,
            lastBindDate: '',
            defaultLastBindDate: '',
            isLastBindEdit: false,
            lastBindDateError: '',
            yearBuilt: '',
            lastSurveyDate: '',
            surveyDueDate: '',
            underWriter: '',
            underWriterError: false,
            note: '',
            noteError: false,
            gross: '',
            grossError: false,
            totalgross: '',
            agency: '',
            agencyError: false,
            changeAgencyCommission: false,
            agencyTotal: '',
            balance: '',
            balanceTotal: '',
            governmentLavys: '',
            governmentLavysError: false,
            governmentLavysPercent: '',
            governmentLavysPercentError: false,
            governmentLavysAmount: '',
            governmentLavysAmountError: false,
            adminFees: '',
            adminFeesError: false,
            ratingType: '',
            ratingTypeValue: '',
            ratingTypeValueError: false,

            ratingTypeValueRegex: '',

            isEdit: false,
            currentPremium: 0,
            renewalPremium: 0,
            policyStatus: '',

            isExpand: false,
            maxPolicyAmount: 0,

            DisplayWater: 0,
            DisplayRacing: 0,
            DisplayCrew: 0,
            CurrencySymbol: '',

            MarineTradePremium: '',
            MarineTradePremiumError: false,

            PolicyCurrentPremium: 0,

        };
    }

    async componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
        }
        console.log("componentDidMount", this.props.CurrencySymbol);
        var PolicyPremium = await this.getPolicyPremium();
        this.getBinderData();

        this.getDropDownValues('POLICYDEPARTMENT', 'departmentList', 'StringMapName');
        // this.getDropDownValues('POLICYSOURCE', 'sourceList');
        this.getDropDownValues('AWAITINGDOCUMENT', 'awaitingDocumentList', 'StringMapName');
        this.getDropDownValues('PREMIUMCREDIT', 'premiumCreditList', 'StringMapName');
        this.getDropDownValues('RACINGEVENTTYPE', 'racingEventTypeList', 'StringMapName');
        this.getDropDownValues('CREWLIABILITY', 'crewLiabilityList', 'SortOrder');
        this.getDropDownValues('GOVTLEVY', 'govtLevyList');
        this.getDropDownValues('CURRENTNCBYEARS', 'currentNCBNoofYearsList');

        if (this.state.PolicyCountry == "Spain") {
            this.getDropDownValues('THIRDPARTYLIABILITYSPAIN', 'thirdPartyLiabilityList', 'SortOrder');
        } else {
            this.getDropDownValues('THIRDPARTYLIABILITY', 'thirdPartyLiabilityList', 'SortOrder');
        }

        this.getPolicyUnderwritingData();
        this.getSysConfigValue();
        this.setState({ awaitingDocuments: 'No', IsPremiumCredit: 'No' });
        this.IsmigratedData();
        this.isGenerateRenewal();

    }

    async getPolicyPremium() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                LanguageId: this.state.LanguageId
            };
            var PolicyPremium = await api.post('api/getPolicyPremium', data).then(res => {
                console.log("PolicyCurrentPremium", res);
                if (res.success) {
                    this.setState({ PolicyCurrentPremium: res.data[0][0].TotalPremium });
                    return 1;
                } else {
                    console.log("something error");
                    return 1;
                }
            }).catch(err => {
                console.log("error", err);
                return 1;
            });
            return PolicyPremium;
        } catch (error) {
            console.log("erroreeee", error);
        }
    }

    getSysConfigValue() {
        try {
            api.post('api/getSystemConfigByKey', { key: 'PolicyVesselAmount' }).then(res => {
                if (res.success) {
                    this.setState({ maxPolicyAmount: res.data[0].SysValue });
                } else {
                    console.log("something error");
                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("erroreeee", error);
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
                console.log("errrr", err);
            });
        } catch (error) {
            console.log("asfsdg", error);
        }
    }

    getPolicyUnderwritingData() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                LanguageId: this.state.LanguageId
            }; //'bef076c0-2ea5-11ea-a563-fa163eb9754c' };
            api.post('api/getPolicyUnderwritingData', data).then(res => {
                debugger;
                console.log("underwriting", res.data);
                console.log("PolicyCurrentPremium", this.state.PolicyCurrentPremium);
                if (res.success) {
                    let PolicyUnderwritingData = res.data[0];

                    let InceptionDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].InceptionDate)) {
                        InceptionDate = '';
                        this.setState({ inceptionDateError: true });
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].InceptionDate).format('YYYY-MM-DD');
                        InceptionDate = (dt === 'Invalid date') ? '' : dt;
                        this.setState({ inceptionDateError: false });
                    }
                    let SurveyDueDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].SurveyDueDate)) {
                        SurveyDueDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].SurveyDueDate).format('YYYY-MM-DD');
                        SurveyDueDate = (dt === 'Invalid date') ? '' : new Date(dt);
                    }

                    let RenewalDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].RenewalDate)) {
                        RenewalDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].RenewalDate).format('YYYY-MM-DD');
                        RenewalDate = (dt === 'Invalid date') ? '' : dt;
                    }
                    console.log('PolicyUnderwritingData[0].RenewalDate', PolicyUnderwritingData[0].RenewalDate);

                    let LastBindDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].LastBindDate)) {
                        LastBindDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].LastBindDate).format('YYYY-MM-DD');
                        LastBindDate = (dt === 'Invalid date') ? '' : dt;
                    }

                    let vesselClass = PolicyUnderwritingData[0].VesselClassName

                    let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(vesselClass);
                    this.setState({
                        DisplayWater: DisplayCondition.displayWater,
                        DisplayRacing: DisplayCondition.displayRacing,
                        DisplayCrew: DisplayCondition.displayCrew
                    })

                    if (vesselClass == 'Yacht' || vesselClass == 'Vela') {

                        let vesselType = PolicyUnderwritingData[0].VesselTypeName

                        let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(vesselType);
                        this.setState({
                            DisplayWater: DisplayCondition.displayWater,
                            DisplayRacing: DisplayCondition.displayRacing,
                            DisplayCrew: DisplayCondition.displayCrew
                        })
                    }

                    // Initialize Agency value
                    // let currentPremium = parseFloat(PolicyUnderwritingData[0].CurrentPremium);
                    console.log("PolicyCurrentPremium - IN", this.state.PolicyCurrentPremium);
                    let currentPremium = parseFloat(this.state.PolicyCurrentPremium); // Changed on 15-05-2020 by Rajendra
                    let agencyPercent = (PolicyUnderwritingData[0].AgencyCommissionPercent) ? parseFloat(PolicyUnderwritingData[0].AgencyCommissionPercent) : 0;
                    let agencyAmount = (agencyPercent * currentPremium) / 100;

                    // Initialize gross value
                    let gross = parseFloat(PolicyUnderwritingData[0].GrossCommisionPercent);
                    let totalgross = (gross * currentPremium) / 100;

                    // Initialize balance value
                    let balance = parseFloat(gross) - parseFloat(agencyPercent);
                    let balanceTotal = parseFloat(totalgross) - parseFloat(agencyAmount);
                    // let source = { label: PolicyUnderwritingData[0].SourceName, value: PolicyUnderwritingData[0].SourceId };
                    var source = PolicyUnderwritingData[0].SourceId;
                    console.log('(PolicyUnderwritingData[0].Department ===', (PolicyUnderwritingData[0].Department === 'ServiceCenter' || PolicyUnderwritingData[0].Department === 'SubAgent'));
                    console.log(PolicyUnderwritingData[0].Department);

                    this.setState({
                        PolicyNumber: PolicyUnderwritingData[0].PolicyNumber,
                        PolicyUnderwritingId: PolicyUnderwritingData[0].PolicyUnderwritingId,
                        PolicyInsuredAmountId: PolicyUnderwritingData[0].PolicyInsuredAmountId,
                        binder: PolicyUnderwritingData[0].UMRN,
                        subBinder: PolicyUnderwritingData[0].Title,
                        insuranceComapnyId: PolicyUnderwritingData[0].InsuranceComapnyId,
                        insuranceComapny: PolicyUnderwritingData[0].InsuranceCompanyName,
                        department: PolicyUnderwritingData[0].Department,
                        departmentName: PolicyUnderwritingData[0].DepartmentName,
                        departmentDisable: (PolicyUnderwritingData[0].Title) ? true : false,
                        source: source,
                        sourceDisable: (PolicyUnderwritingData[0].Title) ? true : false,
                        sourceName: PolicyUnderwritingData[0].SourceName,
                        sourceError: (PolicyUnderwritingData[0].Department === 'ServiceCenter' || PolicyUnderwritingData[0].Department === 'SubAgent') ? CommonConfig.isEmpty(PolicyUnderwritingData[0].SourceName) : false,
                        awaitingDocuments: CommonConfig.isEmpty(PolicyUnderwritingData[0].IsAwaitingDocument) ? 'No' : PolicyUnderwritingData[0].IsAwaitingDocument.data[0] == 1 ? "Yes" : "No",
                        premiumCredits: CommonConfig.isEmpty(PolicyUnderwritingData[0].IsPremiumCredit) ? 'No' : PolicyUnderwritingData[0].IsPremiumCredit.data[0] == 1 ? "Yes" : "No",
                        liabilityType: PolicyUnderwritingData[0].LiabilityType,
                        PolicyInsuredAmount: PolicyUnderwritingData[0].InsuranceCompanyName,
                        thirdPartyLiability: PolicyUnderwritingData[0].ThirdPartyLiabilityAmount,
                        isWaterSkiing: (CommonConfig.isEmpty(PolicyUnderwritingData[0].WaterSkiingLiabilityAmount) || PolicyUnderwritingData[0].WaterSkiingLiabilityAmount == 0) ? false : true,
                        waterSkiingLiability: PolicyUnderwritingData[0].WaterSkiingLiabilityAmount,
                        waterSkiingLiabilityAmount: PolicyUnderwritingData[0].WaterSkiingLiabilityAmount,
                        isWaterToys: (CommonConfig.isEmpty(PolicyUnderwritingData[0].WaterToysLiabilityAmount) || PolicyUnderwritingData[0].WaterToysLiabilityAmount == 0) ? false : true,
                        waterToysLiability: PolicyUnderwritingData[0].WaterToysLiabilityAmount,
                        waterToysLiabilityAmount: PolicyUnderwritingData[0].WaterToysLiabilityAmount,
                        isSailRacing: (CommonConfig.isEmpty(PolicyUnderwritingData[0].SailRacingCoverageAmount) || PolicyUnderwritingData[0].SailRacingCoverageAmount == 0) ? false : true,
                        sailRacingCoverage: PolicyUnderwritingData[0].SailRacingCoverageAmount,
                        sailRacingCoverageAmount: PolicyUnderwritingData[0].SailRacingCoverageAmount,
                        racingEventType: PolicyUnderwritingData[0].RacingEventType,
                        crewLiability: PolicyUnderwritingData[0].CrewLiability,
                        MarineTradePremium: PolicyUnderwritingData[0].MarineTradePremium ? PolicyUnderwritingData[0].MarineTradePremium : '',
                        // inceptionDate: moment(PolicyUnderwritingData[0].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                        // renewalDate: moment(PolicyUnderwritingData[0].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                        // lastBindDate: moment(PolicyUnderwritingData[0].LastBindDate).format(CommonConfig.dateFormat.dateOnly),
                        yearBuilt: PolicyUnderwritingData[0].YearBuilt,
                        lastSurveyDate: CommonConfig.isEmpty(moment(PolicyUnderwritingData[0].LastSurveyDate)) ? moment(PolicyUnderwritingData[0].LastSurveyDate).format(CommonConfig.dateFormat.dateOnly) : '',
                        surveyDueDate: SurveyDueDate,
                        defaultinceptionDate: InceptionDate,
                        inceptionDate: InceptionDate,
                        defaultrenewalDate: RenewalDate,
                        renewalDate: RenewalDate,
                        renewalDateError: CommonConfig.isEmpty(RenewalDate),
                        defaultLastBindDate: LastBindDate,
                        lastBindDate: LastBindDate,
                        underWriter: PolicyUnderwritingData[0].UnderwriterAmount,
                        currentPremium: PolicyUnderwritingData[0].CurrentPremium,
                        renewalPremium: PolicyUnderwritingData[0].RenewalPremium,
                        policyStatus: PolicyUnderwritingData[0].Status,

                        note: PolicyUnderwritingData[0].UnderwriterNote,
                        gross: gross.toFixed(2),
                        totalgross: totalgross.toFixed(2),
                        agency: agencyPercent.toFixed(2),
                        agencyTotal: agencyAmount.toFixed(2),
                        balance: balance.toFixed(2),
                        balanceTotal: balanceTotal.toFixed(2),

                        governmentLavys: (PolicyUnderwritingData[0].GovtLevyType == "CUSTOM") ? 'CUSTOM' : 'DEFAULT',
                        governmentLavysPercent: PolicyUnderwritingData[0].GovtLevyPercent,
                        governmentLavysAmount: PolicyUnderwritingData[0].GovtLevyAmount,
                        adminFees: PolicyUnderwritingData[0].AdminFeeAmount,

                        excess: PolicyUnderwritingData[0].ExcessAmount,
                        subBinders: PolicyUnderwritingData[0].subBinderData,

                        ratingType: PolicyUnderwritingData[0].NonRatableRatingType,
                        ratingTypeValueRegex: (PolicyUnderwritingData[0].NonRatableRatingType == 'Rating') ? CommonConfig.RegExp.percentage : CommonConfig.RegExp.decimalWithOne,
                        ratingTypeValue: PolicyUnderwritingData[0].NonRatableRateAmount,
                        PolicyType: PolicyUnderwritingData[0].PolicyType,
                        currentNCBAmount: (CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBAmount) ? '' : PolicyUnderwritingData[0].CurrentNCBAmount),
                        currentNCBYears: PolicyUnderwritingData[0].CurrentNCBYear,
                        PolicyGeneralId: PolicyUnderwritingData[0].PolicyGeneralId,
                        currentNCBAmountError: CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBAmount) ? true : false,
                        currentNCBYearsError: CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBYear) ? true : false,
                        // inceptionDateError: (PolicyUnderwritingData[0].InceptionDate != '' || PolicyUnderwritingData[0].InceptionDate != null || PolicyUnderwritingData[0].InceptionDate != undefined) ? false : true,
                        // selectBinderError: (PolicyUnderwritingData[0].BinderId != '' || PolicyUnderwritingData[0].BinderId != null || PolicyUnderwritingData[0].BinderId != undefined) ? false : true
                        selectBinderError: CommonConfig.isEmpty(PolicyUnderwritingData[0].BinderId) ? true : false
                    });
                    this.getOrganazationData(this.state.department);
                    this.getWaterSkiiAndWaterToys();
                } else {
                    console.log('getPolicyUnderwritingData_error');
                }
            }).catch(err => {
                console.log('getPolicyUnderwritingData_error', err);
            });
        } catch (error) {
            console.log('getPolicyUnderwritingData_error', error);
        }
    }

    getWaterSkiiAndWaterToys() {
        api.post('api/getWaterSkiiAndWaterToys').then(res => {
            if (res.success) {
                this.setState({ waterSkiingLiabilityAmount: res.data[0].WaterSkiingLiability, waterToysLiabilityAmount: res.data[0].WaterToysLiabiility });

                if (this.state.isWaterSkiing) {
                    this.setState({ waterSkiingLiability: res.data[0].WaterSkiingLiability });
                }
                if (this.state.isWaterToys) {
                    this.setState({ waterToysLiability: res.data[0].WaterToysLiabiility });
                }
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    getBinderData() {
        try {
            let data = {};
            api.post('api/getBinder', data).then(res => {
                if (res.success) {
                    this.setState({ binders: res.data });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
        }
    }

    getSubBinderData(data) {
        try {
            api.post('api/getSubBinderData', data).then(res => {
                if (res.success) {
                    this.setState({ subBinders: res.data });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
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

    suggestBinder(event) {
        let results = this.state.binders.filter((binderdata) => {
            var binderUMRN = binderdata.UMRN;
            return binderUMRN.toLowerCase().startsWith(event.query.toLowerCase());
        });
        var binderresult = [];
        results.forEach(res => {
            binderresult.push(res.UMRN);
        });
        this.setState({ binderSuggestions: binderresult });
    }

    suggestsubBinder(event) {
        let results = this.state.subBinders.filter((subBinder) => {
            var subBinderTitle = subBinder.Title;
            return subBinderTitle.toLowerCase().startsWith(event.query.toLowerCase());
        });
        var subBinderresult = [];
        results.forEach(res => {
            subBinderresult.push(res.Title);
        });
        this.setState({ subbinderSuggestions: subBinderresult });
    }

    changeBinder(value) {
        console.log("changeBinder >", value);
        if (CommonConfig.isEmpty(value)) {
            this.setState({ selectBinderError: true, binder: value });
            this.show('binder', true);
        } else {
            this.setState({ selectBinderError: false, binder: value });
            this.show('binder', false);
            let results = this.state.binders.filter((binderdata) => {
                var binderUMRN = binderdata.UMRN;
                return binderUMRN == value;
            });
            if (results.length > 0) {
                this.getSubBinderData(value);
                // var totalgross = (results[0].GrossCommission * this.state.amount) / 100;
                var totalgross = (results[0].GrossCommission * this.state.PolicyCurrentPremium) / 100;
                var balance = results[0].GrossCommission + this.state.agency;
                var balanceTotal = totalgross + this.state.agencyTotal;
                totalgross = CommonConfig.isEmpty(totalgross) ? 0 : totalgross.toFixed(2);
                balance = CommonConfig.isEmpty(balance) ? 0 : balance.toFixed(2);
                balanceTotal = CommonConfig.isEmpty(balanceTotal) ? 0 : balanceTotal.toFixed(2);
                this.setState({ insuranceComapny: results[0].InsuranceCompanyName, gross: results[0].GrossCommission, /*subBinders: results[0].subBinderData,*/ adminFees: results[0].adminFees, totalgross: totalgross, balance: balance, balanceTotal: balanceTotal })
            }
        }
    }

    changesubBinder(value) {
        if (CommonConfig.isEmpty(value)) {
            this.setState({ subBinderError: true, subBinder: value, departmentDisable: false, sourceDisable: false });
            this.show('subBinder', true);
        } else {
            let results = this.state.subBinders.filter((subbinderdata) => {
                var subBinderTitle = subbinderdata.Title;
                return subBinderTitle == value;
            });
            if (results.length > 0) {
                this.setState({ department: results[0].Type, source: results[0].EntityId, sourceName: results[0].EntityType, departmentDisable: true, sourceDisable: true })
            }
        }
    }

    editAgencyCommission() {
        this.setState({ changeAgencyCommission: !this.state.changeAgencyCommission });
    }

    isGenerateRenewal() {
        const data = { policyId: this.props.match.params.id };
        api.post(APIConstant.path.isGenerateRenewal, data).then(async res => {
            console.log('isGenerateRenewal', res.data[0].returnValue);
            if (res.success) {
                if (!CommonConfig.isEmpty(res.data[0].returnValue) && res.data[0].returnValue != 0) {
                    if (res.data[0].returnValue == 2) {
                        console.log('migratedData', 'before');
                        var IsmigratedData = await this.IsmigratedData();
                        console.log('migratedData after', IsmigratedData);

                        if (IsmigratedData == 0) {
                            // console.log('migratedData', 0);
                            //   var nextBinder = await api.post(APIConstant.path.migratedData, data).then(res => {
                            //     if (res.success) {
                            //       if (res.data.returnValue == 0) {
                            //         console.log('migratedData', '01');
                            //       } else {
                            //         console.log('migratedData', '11');
                            //       }

                            //     } else {
                            //       console.log('error');
                            //     }
                            //   }).catch(err => {
                            //     console.log('error', err);
                            //   });
                            //   return nextBinder;
                        } else if (IsmigratedData == 1) {
                            let data1 = {
                                policyId: this.props.match.params.id
                            }
                            api.post(APIConstant.path.getNextBinderDetails, data1).then(res => {
                                if (res.success) {
                                    console.log('nextBinder', res);
                                    if (!CommonConfig.isEmpty(res.data[0].binderUMRN)) {
                                        this.setState({ nextBinder: res.data[0].binderUMRN, nextInsuranceComapny: res.data[0].insuranceCompanyName, isDisplayNext: 1 });
                                    } else {
                                        this.setState({ isDisplayNext: 0 });
                                    }
                                } else {
                                    console.log('error');
                                }
                            }).catch(err => {
                                console.log('error', err);
                            });
                        }
                        else {

                        }
                    }
                }
            } else {
                console.log('error');
            }
        }).catch(err => {

        });
    }

    async IsmigratedData() {
        let data = {
            policyId: this.props.match.params.id
        }
        var isMigrated = await api.post(APIConstant.path.migratedData, data).then(res => {
            if (res.success) {
                console.log('migratedData', res.data[0]);

                return res.data[0].returnValue;
            } else {
                console.log('error');
                return -1;
            }
        }).catch(err => {
            console.log('error', err);
        });
        return isMigrated;
    }


    selectType(value, type) {

        if (type === 'department') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ departmentError: true, department: value });
                this.show('department', true);
            } else {
                this.setState({ departmentError: false, department: value });
                this.show('department', false);
                if (value === 'ServiceCenter' || value === 'SubAgent') {
                    this.setState({ sourceDisplay: true, sourceError: true })
                    this.getOrganazationData(value)
                } else {
                    this.setState({ sourceDisplay: false, source: '', sourceError: false, sourceList: [] });
                    this.show('source', false);
                }
            }
        }

        if (type === 'source') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ sourceError: true, source: value });
                this.show('source', true);
            } else {
                this.setState({ sourceError: false, source: value.value });
                this.show('source', false);
            }
        }

        if (type === 'awaitingDocuments') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ awaitingDocumentsError: true, awaitingDocuments: value });
                this.show('awaitingDocuments', true);
            } else {
                this.setState({ awaitingDocumentsError: false, awaitingDocuments: value });
                this.show('awaitingDocuments', false);
            }
        }

        if (type === 'premiumCredits') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ premiumCreditsError: true, premiumCredits: value });
                this.show('premiumCredits', true);
            } else {
                this.setState({ premiumCreditsError: false, premiumCredits: value });
                this.show('premiumCredits', false);
            }
        }

        if (type === 'thirdPartyLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ thirdPartyLiabilityError: true, thirdPartyLiability: value });
                this.show('thirdPartyLiability', true);
            } else {
                this.setState({ thirdPartyLiabilityError: false, thirdPartyLiability: value });
                this.show('thirdPartyLiability', false);
            }
        }

        if (type === 'racingEventType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ racingEventTypeError: true, racingEventType: value });
                this.show('racingEventType', true);
            } else {
                this.setState({ racingEventTypeError: false, racingEventType: value });
                this.show('racingEventType', false);
            }
        }

        if (type === 'crewLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ crewLiabilityError: true, crewLiability: value });
                this.show('crewLiability', true);
            } else {
                this.setState({ crewLiabilityError: false, crewLiability: value });
                this.show('crewLiability', false);
            }
        }

        if (type === 'governmentLavys') {
            this.setState({ governmentLavys: value });
            if (value == "DEFAULT") {
                let premium = this.state.currentPremium;
                if (this.state.policyStatus == "Active") {
                    premium = (this.state.renewalPremium == null) ? 0 : this.state.renewalPremium;
                }
                let governmentLavysAmount = (parseFloat(this.state.governmentLavysPercent) * parseFloat(premium)) / 100;
                this.setState({ governmentLavysAmount: governmentLavysAmount.toFixed(2) });
            } else if (value == "CUSTOM") {
                this.setState({ governmentLavysAmount: 0 });
            }
        }

        if (type === 'currentNCBYears') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ currentNCBYearsError: true, currentNCBYears: value });
                this.show('currentNCBYears', true);
            } else {
                this.setState({ currentNCBYearsError: false, currentNCBYears: value });
                this.show('currentNCBYears', false);
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });



        if (e.target.name === "inceptionDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ inceptionDateError: true });
                this.show("inceptionDate", true, "inceptionDateError", "Please enter Inception Date");
            }
            // else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
            //     this.setState({ inceptionDateError: true });
            //     this.show("inceptionDate", true, "inceptionDateError", "Please enter valid Inception Date");
            // } 
            else {
                // let renewalDate = moment(e.target.value).add(365, 'days').format('DD/MM/YYYY');   
                console.log('renewalDate', e.target.value);

                let renewalDate = moment(e.target.value).add(365, 'days').format('YYYY-MM-DD');
                console.log('renewalDate', renewalDate);

                this.setState({ inceptionDateError: false, inceptionDate: e.target.value, renewalDate: renewalDate, renewalDateError: false });
                this.show("inceptionDate", false, "inceptionDateError", "");

            }
        }

        if (e.target.name === "renewalDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ renewalDateError: true });
                this.show("renewalDate", true, "renewalDateError", "Please enter Renewal Date");
            } else {
                this.setState({ renewalDateError: false, renewalDate: e.target.value });
                this.show("renewalDate", false, "renewalDateError", "");
            }
        }

        if (e.target.name === "lastBindDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ lastBindDateError: true });
                this.show("lastBindDate", true, "lastBindDateError", "Please enter Last Bind Date");
            } else {
                this.setState({ lastBindDateError: false, lastBindDate: e.target.value });
                this.show("lastBindDate", false, "lastBindDateError", "");
            }
        }

        if (e.target.name === 'note') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ noteError: false, note: e.target.value });
                this.show("note", false);
            } else {
                if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value) || e.target.value.length > 200) {
                    this.setState({ noteError: true });
                    this.show("note", true);
                } else {
                    this.setState({ noteError: false, note: e.target.value });
                    this.show("note", false);
                }
            }
        }

        if (e.target.name === 'isWaterSkiing') {
            if (e.target.checked == true) {
                this.setState({ waterSkiingLiability: this.state.waterSkiingLiabilityAmount });
            } else {
                this.setState({ waterSkiingLiability: '' });
            }
            this.setState({ isWaterSkiing: e.target.checked });
        }

        if (e.target.name === 'isWaterToys') {
            if (e.target.checked == true) {
                this.setState({ waterToysLiability: this.state.waterToysLiabilityAmount });
            } else {
                this.setState({ waterToysLiability: '' });
            }
            this.setState({ isWaterToys: e.target.checked });
        }

        if (e.target.name === 'isSailRacing') {
            if (e.target.checked == true) {
                this.setState({ sailRacingCoverage: this.state.sailRacingCoverageAmount });
            } else {
                this.setState({ sailRacingCoverage: '' });
            }
            this.setState({ isSailRacing: e.target.checked });
        }

        if (e.target.name === 'sailRacingCoverage') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', true);
            } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
                this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', true);
            } else {
                this.setState({ sailRacingCoverageError: false, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', false);
            }
        }

        if (e.target.name === 'gross') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.percentage.test(e.target.value) || e.target.value > 100) {
                this.setState({ GrossError: true });
                this.show("gross", true);
            }
            else {
                this.setState({ GrossError: false, gross: e.target.value });
                this.show("gross", false);
            }
        }

        /*if (e.target.name === 'governmentLavysPercent') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.percentage.test(e.target.value)) {
                this.setState({ governmentLavysPercentError: true });
                this.show("governmentLavysPercent", true);
            } else {
                this.setState({ governmentLavysPercentError: false, governmentLavysPercent: e.target.value });
                this.show("governmentLavysPercent", false);
            }
        }*/

        // if (e.target.name === 'excess') {
        //     if (CommonConfig.isEmpty(e.target.value)) {
        //         this.setState({ excessError: true, excess: e.target.value });
        //         this.show('excess', true);
        //     } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
        //         this.setState({ excessError: true, excess: e.target.value });
        //         this.show('excess', true);
        //     } else {
        //         this.setState({ excessError: false, excess: e.target.value });
        //         this.show('excess', false);
        //     }
        // }

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

        if (e.target.name === 'adminFees') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ adminFeesError: true, adminFees: e.target.value });
                this.show('adminFees', true, "adminFeesError", "Please enter valid Admin Fees.");
            } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
                this.setState({ adminFeesError: true, adminFees: e.target.value });
                this.show('adminFees', true, "adminFeesError", "Admin Fees can not be more then Policy Amount.");
            } else {
                this.setState({ adminFeesError: false, adminFees: e.target.value });
                this.show('adminFees', false, "adminFeesError", "");
            }
        }

        if (e.target.name === 'underWriter') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ underWriterError: false, underWriter: e.target.value });
                this.show('underWriter', false);
            } else if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                this.setState({ underWriterError: true, underWriter: e.target.value });
                this.show('underWriter', true);
            } else {
                this.setState({ underWriterError: false, underWriter: e.target.value });
                this.show('underWriter', false);
            }
        }

        if (e.target.name === "MarineTradePremium") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ MarineTradePremiumError: true });
                this.show("MarineTradePremium", true, "MarineTradePremiumError", "Please enter Premium Amount");
            } else if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                this.setState({ MarineTradePremiumError: true, MarineTradePremium: e.target.value });
                this.show('MarineTradePremium', true, "MarineTradePremiumError", "Please enter valid Premium Amount");
            } else {
                this.setState({ MarineTradePremiumError: false, MarineTradePremium: e.target.value });
                this.show("MarineTradePremium", false, "MarineTradePremiumError", "");
            }
        }

        // if (e.target.name === 'ratingTypeValue') {
        //     if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimal.test(e.target.value)) {
        //         this.setState({ ratingTypeValueError: true, ratingTypeValue: e.target.value });
        //         // this.show('ratingTypeValue', true);
        //     } else {
        //         this.setState({ ratingTypeValueError: false, ratingTypeValue: e.target.value });
        //         this.show('ratingTypeValue', false);
        //     }
        // }

        if (e.target.name === 'ratingTypeValue') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ ratingTypeValueError: true });
                this.show("ratingTypeValue", true, "ratingTypeValueError", "Please enter Rate");
            } else {
                let decimalRegEx = this.state.ratingTypeValueRegex;
                let percentage = e.target.value;
                if (!decimalRegEx.test(percentage)) {
                    this.setState({ ratingTypeValueError: true });
                    this.show("ratingTypeValue", true, "ratingTypeValueError", "Please enter valid Rate");
                } else {
                    this.setState({ ratingTypeValueError: false, ratingTypeValue: e.target.value });
                    this.show("ratingTypeValue", false, "ratingTypeValueError", "");
                }
            }
        }

        if (e.target.name === 'governmentLavysAmount') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ governmentLavysAmountError: true, governmentLavysAmount: e.target.value });
                this.show('governmentLavysAmount', true, "governmentLavysAmountError", "Please eneter Government Lavys Amount");
            } else {
                this.setState({ governmentLavysAmountError: false, governmentLavysAmount: e.target.value });
                this.show('governmentLavysAmount', false, "governmentLavysAmount", "");
            }
        }

        if (e.target.name === 'currentNCBAmount') {
            if (!CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ currentNCBAmountError: true });
                this.show("currentNCBAmount", true);
            } else {
                this.setState({ currentNCBAmountError: false, currentNCBAmount: e.target.value });
                this.show("currentNCBAmount", false);
            }
        }

        if (e.target.name === 'agency') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ agencyError: true });
                this.show("agency", true, "agencyError", "Please enter Agency Commission");
            } else {
                let decimalRegEx = CommonConfig.RegExp.percentage;
                let percentage = e.target.value;
                if (!decimalRegEx.test(percentage)) {
                    this.setState({ agencyError: true });
                    this.show("agency", true, "agencyError", "Please enter valid  Agency Commission");
                } else {
                    // var totalagency = (e.target.value * this.state.currentPremium) / 100;
                    var totalagency = (e.target.value * this.state.PolicyCurrentPremium) / 100;
                    var balance = parseFloat(this.state.gross) - parseFloat(e.target.value);
                    var balanceTotal = Number(this.state.totalgross) - totalagency;
                    totalagency = CommonConfig.isEmpty(totalagency) ? 0 : totalagency.toFixed(2);
                    balance = CommonConfig.isEmpty(balance) ? 0 : balance.toFixed(2);
                    balanceTotal = CommonConfig.isEmpty(balanceTotal) ? 0 : balanceTotal.toFixed(2);
                    this.setState({ agencyError: false, agency: e.target.value, agencyTotal: totalagency, balance: balance, balanceTotal: balanceTotal })
                    this.show("agency", false, "agencyError", "");
                }
            }
        }
    }

    onRadioBtnClick(radioType, radioSelected) {
        if (radioType === 'singleHandedSailing') {
            this.setState({ singleHandedSailing: radioSelected });
        } else if (radioType === 'ratingType') {
            if (radioSelected == 'Rating') {
                this.setState({ ratingTypeValueRegex: CommonConfig.RegExp.percentage, ratingTypeValue: '' })
            } else {
                this.setState({ ratingTypeValueRegex: CommonConfig.RegExp.decimalWithOne, ratingTypeValue: '' })
            }
            this.setState({ ratingType: radioSelected });
        }
    }

    editEndorsements(task) {
        console.log('renewalDate', this.state.inceptionDate);
        console.log('renewalDate', this.state.renewalDate);
        if (task === 'view') {
            this.setState({ isEdit: false })
        } else {
            // let inceptionDate = moment(this.state.inceptionDate, CommonConfig.dateFormat.dateOnly).format('YYYY-MM-DD');
            // // let date = new Date(inceptionDate);
            // let date = moment(inceptionDate).toISOString();
            this.setState({ isEdit: true, });//inceptionDate: (this.state.inceptionDate === '') ? new Date() :  new Date(date) });
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

    goBack() {
        this.getPolicyUnderwritingData();
        this.setState({ isEdit: false })
    }

    reset() {
        this.setState({
            PolicyNumber: '', binder: '', subBinder: '', insuranceComapny: '', department: '',
            source: '', awaitingDocuments: '', premiumCredits: '', documentLanguage: '', thirdPartyLiability: '',
            waterSkiingLiability: '', waterToysLiability: '', sailRacingCoverage: '', racingEventType: '',
            singleHandedSailing: 'yes', crewLiability: '', inceptionDate: '', underWriter: '', note: '',
            gross: '', totalgross: '', agency: '', agencyTotal: '', balance: '', balanceTotal: '',
            governmentLavys: '', governmentLavysPercent: '', isEdit: false, governmentLavysAmount: ''
        })
    }

    validate() {
        var errorCount = 0;

        if (this.state.selectBinderError) {
            errorCount += 1;
            this.show("binder", true);
        }

        if (this.state.subBinderError) {
            errorCount += 1;
            this.show("subBinder", true);
        }

        if (this.state.departmentError) {
            errorCount += 1;
            this.show("department", true);
        }

        if (this.state.sourceError) {
            errorCount += 1;
            this.show("source", true);
        }

        // if (this.state.awaitingDocumentsError) {
        //     errorCount += 1;
        //     this.show("awaitingDocuments", true);
        // }

        // if (this.state.premiumCreditsError) {
        //     errorCount += 1;
        //     this.show("premiumCredits", true);
        // }

        if (this.state.thirdPartyLiabilityError) {
            errorCount += 1;
            this.show("thirdPartyLiability", true);
        }

        if (this.state.sailRacingCoverageError) {
            errorCount += 1;
            this.show("sailRacingCoverage", true);
        }

        // if (this.state.isSailRacing === true && this.state.racingEventType === '') {
        //     errorCount += 1;
        //     this.show("racingEventType", true);
        // }

        if (this.state.racingEventTypeError) {
            errorCount += 1;
            this.show("racingEventType", true);
        }

        if (this.state.crewLiabilityError) {
            errorCount += 1;
            this.show("crewLiability", true);
        }

        if (this.state.excessError) {
            errorCount += 1;
            this.show("excess", true);
        }

        if (this.state.ratingTypeValueError) {
            errorCount += 1;
            this.show("ratingTypeValue", true);
        }

        if (this.state.inceptionDateError) {
            errorCount += 1;
        }
        if (this.state.renewalDateError) {
            errorCount += 1;
            this.show("renewalDateError", true);
        }

        if (this.state.underWriterError) {
            errorCount += 1;
            this.show("underWriter", true);
        }

        // if (this.state.noteError) {
        //     errorCount += 1;
        //     this.show("note", true);
        // }

        if (this.state.grossError) {
            errorCount += 1;
            this.show("gross", true);
        }

        // if (this.state.governmentLavysError) {
        //     errorCount += 1;
        //     this.show("governmentLavys", true);
        // }

        // if (this.state.governmentLavysPercentError) {
        //     errorCount += 1;
        //     this.show("governmentLavysPercent", true);
        // }

        if (this.state.adminFeesError) {
            errorCount += 1;
            this.show("adminFees", true);
        }

        if (this.state.currentNCBYearsError) {
            errorCount += 1;
            this.show("currentNCBYears", true);
        }

        // if (this.state.currentNCBAmountError) {
        //     errorCount += 1;
        //     this.show("currentNCBAmount", true);
        // }

        if (errorCount == 0) {
            return true;
        } else {
            return false;
        }
    }

    Save = () => {
        try {
            if (this.validate()) {

                let binderResults = this.state.binders.filter((binderdata) => {
                    var binderUMRN = binderdata.UMRN;
                    return binderUMRN == this.state.binder;
                });

                let subBinderResults = this.state.subBinders.filter((subbinderdata) => {
                    var subBinderTitle = subbinderdata.Title;
                    return subBinderTitle == this.state.subBinder;
                });
                console.log('renewalDate', this.state.renewalDate);

                let data = {
                    PolicyId: this.state.PolicyId,
                    PolicyUnderwritingId: this.state.PolicyUnderwritingId,
                    PolicyInsuredAmountId: this.state.PolicyInsuredAmountId,
                    BinderId: binderResults[0].BinderId,
                    SubBinderId: (subBinderResults.length && subBinderResults !== undefined) ? subBinderResults[0].SubBinderId : '',
                    InsuranceCompanyId: binderResults[0].InsuranceCompanyId,
                    Department: this.state.department,
                    SourceId: this.state.source,
                    InceptionDate: moment(this.state.inceptionDate).format(CommonConfig.dateFormat.dbDateTime),
                    RenewalDate: moment(this.state.renewalDate).format(CommonConfig.dateFormat.dbDateTime),
                    IsAwaitingDocument: this.state.awaitingDocuments === "Yes" ? true : false,
                    IsPremiumCredit: this.state.premiumCredits === "Yes" ? true : false,

                    MarineTradePremium: this.state.MarineTradePremium,

                    UnderwriterAmount: this.state.underWriter,
                    UnderwriterNote: this.state.note,

                    ThirdPartyLiabilityAmount: this.state.thirdPartyLiability,
                    WaterSkiingLiabilityAmount: this.state.waterSkiingLiability,
                    WaterToysLiabilityAmount: this.state.waterToysLiability,
                    SailRacingCoverageAmount: this.state.sailRacingCoverage,
                    RacingEventType: this.state.racingEventType,
                    CrewLiability: this.state.crewLiability,

                    GovtLevyType: this.state.governmentLavys,
                    GovtLevyPercent: this.state.governmentLavysPercent,
                    GovtLevyAmount: this.state.governmentLavysAmount,

                    GrossCommisionPercent: this.state.gross,
                    AgencyCommissionPercent: this.state.agency,

                    AdminFeeAmount: (this.state.adminFees != undefined) ? this.state.adminFees : '',
                    ExcessAmount: this.state.excess,

                    RatingType: this.state.ratingType,
                    RatingTypeAmount: this.state.ratingTypeValue,

                    CurrentNCBYears: this.state.currentNCBYears,
                    CurrentNCBAmount: this.state.currentNCBAmount,
                    PolicyGeneralId: this.state.PolicyGeneralId,

                    SortOrder: '1',
                    LanguageId: 'en-GB',
                    Status: "Active",
                    loggedInUserId: CommonConfig.loggedInUserId()
                };


                console.log('underwriting', data);




                console.log("SavepolicyUnderwriting", data);

                api.post('api/policyUnderwriting', data).then(res => {
                    if (res.data.success) {
                        var firstRes = res.data;
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

                                    if (res.success) {
                                        if (CommonConfig.isEmpty(res.data.returnValue)) {
                                            toast.success(firstRes.message);
                                            this.editEndorsements("view");
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

                    }
                }).catch(err => {
                    console.log("error", err);
                });

            } else {
                toast.error("Please enter/select all mandatory field.");
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    toggleAll = (toggleType) => {
        this.setState({
            showRatingExcess: (toggleType === 'expand') ? true : false,
            showLimitsAdditionalCoverCommissionFeesandLevy: (toggleType === 'expand') ? true : false,
            showPolicyOptionsAdjustments: (toggleType === 'expand') ? true : false,
            showPolicyDates: (toggleType === 'expand') ? true : false,
            isExpand: (toggleType === 'expand') ? true : false
        });
    }

    toggle = (type) => {
        if (type === 'PolicyDates') {
            this.setState({
                showPolicyDates: !this.state.showPolicyDates,
                showPolicyOptionsAdjustments: (this.state.isExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: (this.state.isExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'PolicyOptionsAdjustments') {
            this.setState({
                showPolicyDates: (this.state.isExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: !this.state.showPolicyOptionsAdjustments,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: (this.state.isExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'LimitsAdditionalCoverCommissionFeesandLevy') {
            this.setState({
                showPolicyDates: (this.state.isExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: (this.state.isExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: !this.state.showLimitsAdditionalCoverCommissionFeesandLevy,
                showRatingExcess: (this.state.isExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'RatingExcess') {
            this.setState({
                showPolicyDates: (this.state.isExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: (this.state.isExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: !this.state.showRatingExcess,
            })
        }
    }

    showBinderDetails = () => {

    }

    editLastBindDate() {
        this.setState({ isLastBindEdit: true, lastBindDateError: false });
    }
    editInceptionRenewalDate(InceptionOrRenewal) {
        if (InceptionOrRenewal == 0) {
            this.setState({ isInceptionEdit: true, inceptionDateError: false })
        } else if (InceptionOrRenewal == 1) {
            this.setState({ isRenewalEdit: true, renewalDateError: false })
        }
    }

    saveLastBindDate() {
        try {

            if (this.state.lastBindDateError) {
                toast.error('Please enter Last Binder Date.');
                return false;
            }

            this.setState({ isLastBindEdit: false, lastBindDateError: false });

            let data = {
                PolicyId: this.state.PolicyId,
                LastBindDate: this.state.lastBindDate,
                loggedInUserId: CommonConfig.loggedInUserId()
            };
            api.post('api/updateLastBindDate', data).then(res => {
                if (res.data.success) {
                    toast.success(res.message);
                    this.setState({ isLastBindEdit: false, lastBindDateError: false });
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });

        } catch (error) {
            console.log("error", error);
        }
    }

    saveInceptionRenewalDate(InceptionOrRenewal) {
        try {

            if (InceptionOrRenewal == 0) {
                if (this.state.inceptionDateError) {
                    toast.error('Please enter Inception Date.');
                    return false;
                }
                // this.setState({ isInceptionEdit: false, inceptionDateError: false, isRenewalEdit: false, renewalDateError: false });
            } else if (InceptionOrRenewal == 1) {
                if (this.state.renewalDateError) {
                    toast.error('Please enter Renewal Date.');
                    return false;
                }
                // this.setState({ isRenewalEdit: false, renewalDateError: false });   
            }

            let data = {
                PolicyId: this.state.PolicyId,
                InceptionDate: this.state.inceptionDate,
                RenewalDate: this.state.renewalDate,
                InceptionOrRenewal: InceptionOrRenewal,
                loggedInUserId: CommonConfig.loggedInUserId()
            };
            api.post('api/updateInceptionOrRenewalDate', data).then(res => {
                if (res.data.success) {
                    toast.success(res.message);
                    this.setState({ isInceptionEdit: false, inceptionDateError: false, isRenewalEdit: false, renewalDateError: false });
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });

        } catch (error) {
            console.log("error", error);
        }
    }

    cancelLastBindDate() {
        this.setState({ isLastBindEdit: false, lastBindDateError: false, lastBindDate: this.state.defaultLastBindDate });
    }

    cancelInceptionRenewalDate(InceptionOrRenewal) {
        if (InceptionOrRenewal == 0) {
            this.setState({ isInceptionEdit: false, inceptionDateError: false, inceptionDate: this.state.defaultinceptionDate, renewalDate: this.state.defaultrenewalDate });
        } else if (InceptionOrRenewal == 1) {
            this.setState({ isRenewalEdit: false, renewalDateError: false, renewalDate: this.state.defaultrenewalDate });
        }
    }

    render() {
        const { t } = this.props;
        const SaveButton = t("buttons.Save");
        const CancelButton = t("buttons.Cancel");
        const BackButton = t("buttons.BackToPolicy");

        return (
            <div>
                <Row>
                    <Col md="12">

                        {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                            ? (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                                onClick={this.state.isEdit ? () => this.editEndorsements('view') : () => this.editEndorsements('edit')} title={this.state.isEdit ? "View" : "Edit"}>
                                <i className={this.state.isEdit ? "fa fa-eye" : "fa fa-pencil"}></i>
                            </BTN>)
                            : (null)}

                        <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
                            onClick={(this.state.isExpand) ? () => this.toggleAll('collapse') : () => this.toggleAll('expand')}
                        >
                            <i className={(this.state.isExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
                        </BTN>
                    </Col>
                </Row>
                <div className="input-box" id="PolicyDates">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggle('PolicyDates')} aria-expanded={this.state.showPolicyDates} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                    {t("policyUnderwriting:PolicyDates#")}
                                    <i style={{ float: 'right' }} className={this.state.showPolicyDates ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>

                        <Collapse isOpen={this.state.showPolicyDates} data-parent="#PolicyDates" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Row style={{ width: "100%" }}>
                                    <Col md="6">
                                        <span>{t("policyUnderwriting:Policy")}</span>
                                        <Card>
                                            <CardBody>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:UnderWritingPolicyNumber")}</label>
                                                        </Col>
                                                        <Col md="9">
                                                            <div>
                                                                <p>{this.state.PolicyNumber}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:Binder.label")}*</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <AutoComplete value={this.state.binder} id='binder' onChange={(e) => this.setState({ binder: e.value },
                                                                        this.changeBinder(e.value))} suggestions={this.state.binderSuggestions} completeMethod={this.suggestBinder.bind(this)} />
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:Binder.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.binder}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                        {/* <Col md="1">
                                                            <BTN title='View' style={{ float: "right" }} color="primary" onClick={() => this.showBinderDetails()}>
                                                                <i className="fa fa-eye"></i>
                                                            </BTN>
                                                        </Col> */}
                                                    </Row>
                                                </div>

                                                {(this.state.isDisplayNext ? (
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Next Binder</label>
                                                            </Col>
                                                            <Col md="8">
                                                                <div>
                                                                    <p>{this.state.nextBinder}</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (null))}

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:SubBinder.label")}</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <AutoComplete id='subBinder' value={this.state.subBinder} onChange={(e) => this.setState({ subBinder: e.value }, this.changesubBinder(e.value))}
                                                                        suggestions={this.state.subbinderSuggestions} completeMethod={this.suggestsubBinder.bind(this)} />
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:SubBinder.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.subBinder}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:InsuranceComapny.label")}</label>
                                                        </Col>
                                                        <Col md="9">
                                                            <div>
                                                                <p>{this.state.insuranceComapny}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                {(this.state.isDisplayNext ? (
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Next Insurance Company</label>
                                                            </Col>
                                                            <Col md="8">
                                                                <div>
                                                                    <p>{this.state.nextInsuranceComapny}</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (null))}

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:Department.label")}*</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <Input type="select" name="department" disabled={this.state.departmentDisable == true ? true : false} id="department" onChange={(e) => this.selectType(e.target.value, 'department')} value={this.state.department}>
                                                                        <option value=''>{t("policyUnderwriting:Department.defaultValue")}</option>
                                                                        {this.state.departmentList.map((ct, i) => {
                                                                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:Department.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.departmentName}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                {(this.state.department == 'ServiceCenter' || this.state.department == 'SubAgent') ? (
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>{t("policyUnderwriting:Source.label")}*</label>
                                                            </Col>
                                                            <Col md="9">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Select name="source" id="source" options={this.state.sourceList}
                                                                            value={this.state.source} onChange={(data) => this.selectType(data, 'source')}
                                                                            placeholder={t("policyUnderwriting:Source.defaultValue")}
                                                                            disabled={this.state.sourceDisable == true ? true : false} />
                                                                        <em id="sourceError" className="error invalid-feedback">{t("policyUnderwriting:Source.error")}</em>

                                                                        {/* <Input type="select" name="source" disabled={this.state.sourceDisable == true ? true : false} id="source" onChange={(e) => this.selectType(e.target.value, 'source')} value={this.state.source}>
                                                                                        <option value=''>{t("policyUnderwriting:Source.defaultValue")}</option>
                                                                                        {this.state.sourceList.map((ct, i) => {
                                                                                            return (<option value={ct.OrganizationId} key={i}>{ct.OrganizationName}</option>)
                                                                                        })
                                                                                        }
                                                                                    </Input>
                                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:Source.error")}</em> */}
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.sourceName}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (null)}

                                            </CardBody>
                                        </Card>
                                    </Col>

                                    <Col md="6">
                                        <span>{t("policyUnderwriting:Dates")}</span>
                                        <Card>
                                            <CardBody>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:InceptionDate.label")}*</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isInceptionEdit) ? (
                                                                <div>
                                                                    <Input type="date" name="inceptionDate" id="inceptionDate"
                                                                        placeholder="Inception Date"
                                                                        style={{ width: '50%', display: "inline-block" }}
                                                                        onBlur={(e) => this.handleChange(e)}
                                                                        onChange={(e) => this.handleChange(e)}
                                                                        value={this.state.inceptionDate}
                                                                    />
                                                                    {/* <Input type="date" name="inceptionDate" id="inceptionDate" placeholder="Inception Date"
                                                                        onBlur={(e) => this.handleChange(e)} onChange={(e) => this.handleChange(e)}
                                                                       
                                                                        value={this.state.inceptionDate} 
                                                                    /> */}
                                                                    {/* // value={moment(this.state.inceptionDate).format('YYYY-MM-DD')} /*min={moment().format('YYYY-MM-DD')}*/}
                                                                    {(this.state.inceptionDateError == true) ? (
                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:InceptionDate.error")}</em>
                                                                    ) : (null)}
                                                                    <BTN color="success" onClick={() => this.saveInceptionRenewalDate(0)} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-check"></i>
                                                                    </BTN>
                                                                    <BTN color="danger" onClick={() => this.cancelInceptionRenewalDate(0)} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-times"></i>
                                                                    </BTN>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        {moment(this.state.inceptionDate).format('DD/MM/YYYY')}
                                                                        {/* <p>{(this.state.inceptionDate !== '' && this.state.inceptionDate !== 'Invalid date') ? moment(this.state.inceptionDate).format('DD/MM/YYYY') : ''}</p> */}
                                                                        {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                                                            <BTN color="primary" onClick={() => this.editInceptionRenewalDate(0)} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                <i className="fa fa-pencil"></i>
                                                                            </BTN>
                                                                        ) : (null)}
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:RenewDate")}*</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isRenewalEdit) ? (
                                                                <div>
                                                                    <Input type="date" name="renewalDate" id="renewalDate"
                                                                        placeholder="Renewal Date"
                                                                        style={{ width: '50%', display: "inline-block" }}
                                                                        onBlur={(e) => this.handleChange(e)}
                                                                        onChange={(e) => this.handleChange(e)}
                                                                        value={this.state.renewalDate}
                                                                    />
                                                                    {(this.state.renewalDateError == true) ? (
                                                                        <em className="error invalid-feedback" >Please enter Renewal Date</em>
                                                                    ) : (null)}

                                                                    <BTN color="success" onClick={() => this.saveInceptionRenewalDate(1)} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-check"></i>
                                                                    </BTN>
                                                                    <BTN color="danger" onClick={() => this.cancelInceptionRenewalDate(1)} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-times"></i>
                                                                    </BTN>

                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        {moment(this.state.renewalDate).format('DD/MM/YYYY')}
                                                                        {/* <p>{this.state.renewalDate}</p> */}
                                                                        {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                                                            <BTN color="primary" onClick={() => this.editInceptionRenewalDate(1)} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                <i className="fa fa-pencil"></i>
                                                                            </BTN>
                                                                        ) : (null)}
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:LastBindDate")}</label>
                                                        </Col>
                                                        <Col md="9">

                                                            {(this.state.isLastBindEdit) ? (
                                                                <div>
                                                                    <Input type="date" name="lastBindDate" id="lastBindDate"
                                                                        placeholder="Last Bind Date"
                                                                        style={{ width: '50%', display: "inline-block" }}
                                                                        onBlur={(e) => this.handleChange(e)}
                                                                        onChange={(e) => this.handleChange(e)}
                                                                        value={this.state.lastBindDate}
                                                                    />
                                                                    <em id="lastBindDateError" className="error invalid-feedback" ></em>

                                                                    <BTN color="success" onClick={() => this.saveLastBindDate()} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-check"></i>
                                                                    </BTN>
                                                                    <BTN color="danger" onClick={() => this.cancelLastBindDate()} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                        <i className="fa fa-times"></i>
                                                                    </BTN>


                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        {moment(this.state.lastBindDate).format('DD/MM/YYYY')}
                                                                        {(CommonConfig.isEmpty(this.state.lastBindDate) || !CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus)) ?
                                                                            (null) : (
                                                                                <BTN color="primary" onClick={() => this.editLastBindDate()} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                    <i className="fa fa-pencil"></i>
                                                                                </BTN>
                                                                            )}
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:YearBuilt")}</label>
                                                        </Col>
                                                        <Col md="9">
                                                            <div>
                                                                <p>{this.state.yearBuilt}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                {(this.state.liabilityType != 'TPO') ?
                                                    (<div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>{t("policyUnderwriting:SurveyDueDate")}</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <div>
                                                                    <p>{this.state.surveyDueDate ? moment(this.state.surveyDueDate).format('DD/MM/YYYY') : ""}</p>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>)
                                                    : (null)}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                            </CardBody>

                        </Collapse>
                    </Card>
                </div>

                <div className="input-box" id="PolicyOptionsAdjustments">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggle('PolicyOptionsAdjustments')} aria-expanded={this.state.showPolicyOptionsAdjustments} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                    {t("policyUnderwriting:PolicyOptionsAdjustments#")}
                                    <i style={{ float: 'right' }} className={this.state.showPolicyOptionsAdjustments ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>

                        <Collapse isOpen={this.state.showPolicyOptionsAdjustments} data-parent="#PolicyOptionsAdjustments" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Row style={{ width: "100%" }}>
                                    {(this.state.PolicyType != 'MarineTrade') ?
                                        (<Col md="6">
                                            <span>{t("policyUnderwriting:PolicyOptions")}</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyUnderwriting:AwaitingDocuments.label")}</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Input type="select" name="awaitingDocuments" id="awaitingDocuments" onChange={(e) => this.selectType(e.target.value, 'awaitingDocuments')} value={this.state.awaitingDocuments}>
                                                                            <option value=''>{t("policyUnderwriting:AwaitingDocuments.defaultValue")}</option>
                                                                            {this.state.awaitingDocumentList.map((ct, i) => {
                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                            })
                                                                            }
                                                                        </Input>
                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:AwaitingDocuments.error")}</em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.awaitingDocuments}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyUnderwriting:PremiumCredits.label")}</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Input type="select" name="premiumCredits" id="premiumCredits" onChange={(e) => this.selectType(e.target.value, 'premiumCredits')} value={this.state.premiumCredits}>
                                                                            <option value=''>{t("policyUnderwriting:PremiumCredits.defaultValue")}</option>
                                                                            {this.state.premiumCreditList.map((ct, i) => {
                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                            })
                                                                            }
                                                                        </Input>
                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:PremiumCredits.error")}</em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.premiumCredits}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                            <span>Current NCB</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyGeneral:currentNCB.noofYears")} *</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Input type="select" name="currentNCBYears" id="currentNCBYears" onChange={(e) => this.selectType(e.target.value, 'currentNCBYears')} value={this.state.currentNCBYears}>
                                                                            <option value=''>{t("policyGeneral:currentNCB.noofYearsDefaultValue")}</option>
                                                                            {this.state.currentNCBNoofYearsList.map((ct, i) => {
                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                            })}
                                                                        </Input>
                                                                        <em className="error invalid-feedback" >{t("policyGeneral:currentNCB.noofYearsError")}</em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.currentNCBYears}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyGeneral:currentNCB.NCBAmount")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Input type="text" placeholder={t("policyGeneral:currentNCB.NCBAmountPlaceholder")} name="currentNCBAmount" id="currentNCBAmount" onChange={(e) => this.handleChange(e)} value={this.state.currentNCBAmount}>
                                                                        </Input>
                                                                        <em className="error invalid-feedback" >{t("policyGeneral:currentNCB.NCBAmountError")}</em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.currentNCBAmount}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>)
                                        : (null)}

                                    <Col md="6">
                                        <span>{t("policyUnderwriting:Adjustments")}</span>
                                        <Card>
                                            <CardBody>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:UnderWriter.label")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <Input type="text" name="underWriter" id="underWriter" onChange={(e) => this.handleChange(e)} value={this.state.underWriter}>
                                                                    </Input>
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:UnderWriter.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.underWriter}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:Note.label")}</label>
                                                        </Col>
                                                        <Col md="9">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <Input type="text" name="note" id="note" onChange={(e) => this.handleChange(e)} maxLength="200" value={this.state.note}>
                                                                    </Input>
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:Note.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.note}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>

                        </Collapse>
                    </Card>
                </div>

                <div className="input-box" id="LimitsAdditionalCoverCommissionFeesandLevy">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggle('LimitsAdditionalCoverCommissionFeesandLevy')} aria-expanded={this.state.showLimitsAdditionalCoverCommissionFeesandLevy} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                    {t("policyUnderwriting:LimitsAdditionalCoverCommissionFeesandLevy#")}
                                    <i style={{ float: 'right' }} className={this.state.showLimitsAdditionalCoverCommissionFeesandLevy ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>

                        <Collapse isOpen={this.state.showLimitsAdditionalCoverCommissionFeesandLevy} data-parent="#LimitsAdditionalCoverCommissionFeesandLevy" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Row style={{ width: "100%" }}>
                                    {(this.state.PolicyType != 'MarineTrade') ?
                                        (<Col md="6">
                                            <span>{t("policyUnderwriting:LimitsAdditionalCover")}</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyUnderwriting:ThirdPartyLiability.label")}({<i className={this.props.CurrencySymbol}></i>})*</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit) ? (
                                                                    <div>
                                                                        <Input type="select" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                                                            <option value=''>{t("policyUnderwriting:ThirdPartyLiability.defaultValue")}</option>
                                                                            {this.state.thirdPartyLiabilityList.map((ct, i) => {
                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                            })
                                                                            }
                                                                        </Input>
                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:ThirdPartyLiability.error")}</em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.thirdPartyLiability}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {(this.state.DisplayWater == 1) ?
                                                        (
                                                            <div>
                                                                <div className="input-box">
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <label>{t("policyUnderwriting:WaterSkiingLiability.label")}</label>
                                                                        </Col>
                                                                        <Col md="8">
                                                                            {(this.state.isEdit) ? (
                                                                                <div>
                                                                                    <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} checked={this.state.isWaterSkiing == true} />

                                                                                    {this.state.isWaterSkiing ? (
                                                                                        <div>
                                                                                            <p>Amount: {this.state.waterSkiingLiability}</p>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </div>
                                                                            ) : (
                                                                                    <div>
                                                                                        {this.state.isWaterSkiing ? (
                                                                                            <p> {this.state.waterSkiingLiability}</p>
                                                                                        ) : (null)}
                                                                                    </div>
                                                                                )}
                                                                        </Col>
                                                                    </Row>
                                                                </div>

                                                                <div className="input-box">
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <label>{t("policyUnderwriting:WaterToysLiabiility.label")}</label>
                                                                        </Col>
                                                                        <Col md="8">
                                                                            {(this.state.isEdit) ? (
                                                                                <div>
                                                                                    <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} checked={this.state.isWaterToys == true} />

                                                                                    {this.state.isWaterToys ? (
                                                                                        <div>
                                                                                            <p>Amount: {this.state.waterToysLiability}</p>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </div>

                                                                            ) : (
                                                                                    <div>
                                                                                        {this.state.isWaterToys ? (
                                                                                            <p>{this.state.waterToysLiability}</p>
                                                                                        ) : (null)}
                                                                                    </div>
                                                                                )}
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
                                                                        <Col md="4">
                                                                            <label>{t("policyUnderwriting:SailRacingCoverage.label")}</label>
                                                                        </Col>
                                                                        <Col md="8">
                                                                            {(this.state.isEdit) ? (
                                                                                <div>
                                                                                    <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} checked={this.state.isSailRacing === true} />

                                                                                    {this.state.isSailRacing ? (
                                                                                        <div>
                                                                                            <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage}>
                                                                                            </Input>
                                                                                            <em className="error invalid-feedback" >{t("policyUnderwriting:SailRacingCoverage.error")}</em>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </div>
                                                                            ) : (
                                                                                    <div>
                                                                                        {this.state.isSailRacing ? (
                                                                                            <p>{this.state.sailRacingCoverage}</p>
                                                                                        ) : (null)}
                                                                                    </div>
                                                                                )}
                                                                        </Col>
                                                                    </Row>
                                                                </div>

                                                                <div className="input-box">
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <label>{t("policyUnderwriting:RacingEventType.label")}</label>
                                                                        </Col>
                                                                        <Col md="8">
                                                                            {(this.state.isEdit) ? (
                                                                                <div>
                                                                                    <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                                                        <option value=''>{t("policyUnderwriting:RacingEventType.defaultValue")}</option>
                                                                                        {this.state.racingEventTypeList.map((ct, i) => {
                                                                                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                        })
                                                                                        }
                                                                                    </Input>
                                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:RacingEventType.error")}</em>
                                                                                </div>
                                                                            ) : (
                                                                                    <div>
                                                                                        <p>{this.state.racingEventType}</p>
                                                                                    </div>
                                                                                )}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        ) : (null)}

                                                    {(this.state.DisplayCrew == 1) ?
                                                        (
                                                            <div className="input-box">
                                                                <Row>
                                                                    <Col md="4">
                                                                        <label>{t("policyUnderwriting:CrewLiability.label")}</label>
                                                                    </Col>
                                                                    <Col md="8">
                                                                        {(this.state.isEdit) ? (
                                                                            <div>
                                                                                <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                                                    <option value=''>{t("policyUnderwriting:CrewLiability.defaultValue")}</option>
                                                                                    {this.state.crewLiabilityList.map((ct, i) => {
                                                                                        return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                    })
                                                                                    }
                                                                                </Input>
                                                                                <em className="error invalid-feedback" >{t("policyUnderwriting:CrewLiability.error")}</em>
                                                                            </div>
                                                                        ) : (
                                                                                <div>
                                                                                    <p>{this.state.crewLiability}</p>
                                                                                </div>
                                                                            )}
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ) : (null)}

                                                    {/* <div className="input-box">
                                                                <Row>
                                                                    <Col md="4">
                                                                        <label>{t("policyUnderwriting:Excess.label")}</label>
                                                                    </Col>
                                                                    <Col md="8">
                                                                        {(this.state.isEdit) ? (
                                                                            <div>
                                                                                <Input type="text" name="excess" id="excess" onChange={(e) => this.handleChange(e)} value={this.state.excess}>
                                                                                </Input>
                                                                                <em className="error invalid-feedback" >{t("policyUnderwriting:Excess.error")}</em>
                                                                            </div>
                                                                        ) : (
                                                                                <div>
                                                                                    <p>{this.state.excess}</p>
                                                                                </div>
                                                                            )}
                                                                    </Col>
                                                                </Row>
                                                            </div> */}
                                                </CardBody>
                                            </Card>
                                        </Col>)
                                        : (null)}

                                    <Col md="6">
                                        <span>{t("policyUnderwriting:Commission")}</span>
                                        <Card>
                                            <CardBody>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:gross.label")} %</label>
                                                        </Col>
                                                        <Col md="4">

                                                            {(this.state.isEdit && this.state.PolicyType === 'Vessel-Nonrated') ? (
                                                                <div>
                                                                    {/* % {this.state.gross} */}
                                                                    {/* <label>% </label> */}
                                                                    <Input type="gross" name="gross" id="gross" onChange={(e) => this.handleChange(e)} value={this.state.gross}>
                                                                    </Input>
                                                                </div>
                                                            ) : (
                                                                    <label>
                                                                        {this.state.gross}
                                                                    </label>
                                                                )}
                                                        </Col>

                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:GrossAmount")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                        </Col>
                                                        <Col md="2">
                                                            <p>{this.state.totalgross}</p>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:agency.label")} %</label>
                                                        </Col>
                                                        <Col md="4">
                                                            <div className="pl-inner">
                                                                {(this.state.changeAgencyCommission) ? (
                                                                    <span>
                                                                        <Input type="text" name="agency" id="agency" onChange={(e) => this.handleChange(e)} value={this.state.agency} style={{ display: "inline-block", width: "70%" }} />
                                                                        {/* <em id="policyNumberError" className="error invalid-feedback"></em> */}
                                                                    </span>
                                                                ) : (
                                                                        <span style={{ width: "70%" }}>{this.state.agency}</span>
                                                                    )}
                                                                {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                                                                    ? (<BTN color="primary" onClick={() => this.editAgencyCommission()} title="Change Agency Commission" style={{ padding: "1px 5px" }}>
                                                                        <i className="fa fa-pencil"></i>
                                                                    </BTN>)
                                                                    : (null)}
                                                            </div>
                                                            {/* <label>{this.state.agency}</label> */}
                                                        </Col>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:AgencyAmount")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                        </Col>
                                                        <Col md="2">
                                                            <div>
                                                                <p>{this.state.agencyTotal}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:balance.label")} %</label>
                                                        </Col>
                                                        <Col md="4">
                                                            <label>{this.state.balance}</label>
                                                        </Col>
                                                        <Col md="3">
                                                            <label>{t("policyUnderwriting:BalanceAmount")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                        </Col>
                                                        <Col md="2">
                                                            <div>
                                                                <p>{this.state.balanceTotal}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        {
                                            (this.state.PolicyType == 'MarineTrade' || this.state.PolicyType == 'MultiVessel') ? (<Card>
                                                <CardBody>
                                                    {(this.state.isEdit) ? (
                                                        <div className="input-box">
                                                            <Row>
                                                                <Col md="4">
                                                                    <label>{(this.state.PolicyType == 'MarineTrade') ? 'MarineTradePremium' : 'MultiVesselPremium'}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <div>
                                                                        <Input type="text" name="MarineTradePremium" id="MarineTradePremium" onChange={(e) => this.handleChange(e)} value={this.state.MarineTradePremium}></Input>
                                                                        <em id="MarineTradePremiumError" className="error invalid-feedback" ></em>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>) : (
                                                            <div className="input-box">
                                                                <Row>
                                                                    <Col md="4">
                                                                        <label>{(this.state.PolicyType == 'MarineTrade') ? 'MarineTradePremium' : 'MultiVesselPremium'}</label>
                                                                    </Col>
                                                                    <Col md="4">
                                                                        <div>
                                                                            <p>{this.state.MarineTradePremium}</p>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </div>
                                                        )}
                                                </CardBody>
                                            </Card>) : null
                                        }
                                        <span>{t("policyUnderwriting:FeesandLevy")}</span>

                                        <Card>
                                            <CardBody>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:GovtLevy.label")}</label>
                                                        </Col>
                                                        <Col md="5">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <Input type="select" name="governmentLavys" id="governmentLavys" onChange={(e) => this.selectType(e.target.value, 'governmentLavys')} value={this.state.governmentLavys}>
                                                                        {/* <option value=''>{t("policyUnderwriting:GovtLevy.defaultValue")}</option> */}
                                                                        {this.state.govtLevyList.map((ct, i) => {
                                                                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:GovtLevy.error")}</em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{this.state.governmentLavys}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                        <Col md="2">
                                                            {
                                                                (this.state.governmentLavys === "DEFAULT") ? (
                                                                    <label>{this.state.governmentLavysPercent}%</label>
                                                                ) : (null)
                                                            }
                                                        </Col>
                                                        <Col md="3">
                                                            {(this.state.isEdit) ? (
                                                                <div>
                                                                    <Input readOnly={(this.state.governmentLavys === "DEFAULT") ? (true) : (false)} type="text" name="governmentLavysAmount" id="governmentLavysAmount" onChange={(e) => this.handleChange(e)} value={this.state.governmentLavysAmount}></Input>
                                                                    <em id="governmentLavysAmountError" className="error invalid-feedback"></em>
                                                                </div>
                                                            ) : (
                                                                    <div>
                                                                        <p>{<i className={this.props.CurrencySymbol}></i>}{this.state.governmentLavysAmount}</p>
                                                                    </div>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2" style={{ padding: 0 }}>
                                                            <label>{t("policyUnderwriting:AdminFee")}({<i className={this.props.CurrencySymbol}></i>})</label>
                                                        </Col>
                                                        <Col md="5">
                                                            <div>
                                                                {(this.state.isEdit) ? (
                                                                    <label>
                                                                        <Input type="text" name="adminFees" id="adminFees" onChange={(e) => this.handleChange(e)} value={this.state.adminFees}></Input>
                                                                        <em id="adminFeesError" className="error invalid-feedback" ></em>
                                                                    </label>
                                                                ) : (
                                                                        <p>{this.state.adminFees}</p>
                                                                    )}
                                                            </div>
                                                        </Col>
                                                        <Col md="4">
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                {(this.state.PolicyType != 'MarineTrade') ?
                    (<div className="input-box" id="RatingExcess">
                        <Card className="mb-0">
                            <CardHeader id="headingOne">
                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggle('RatingExcess')} aria-expanded={this.state.showRatingExcess} aria-controls="collapseOne">
                                    <h5 className="m-0 p-0">
                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                        {t("policyUnderwriting:RatingExcess#")}
                                        <i style={{ float: 'right' }} className={this.state.showRatingExcess ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                    </h5>
                                </BTN>
                            </CardHeader>

                            <Collapse isOpen={this.state.showRatingExcess} data-parent="#RatingExcess" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>
                                    <Row style={{ width: "100%" }}>
                                        <Col md="12">
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyUnderwriting:RatingType")} *</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                    <div>
                                                                        <div className="rc-inline">
                                                                            <label>
                                                                                <Input type="radio" id="ratingType" name="ratingType" checked={(this.state.ratingType === 'Rating') ? true : false}
                                                                                    value={this.state.ratingType} onChange={() => this.onRadioBtnClick('ratingType', 'Rating')}
                                                                                />
                                                                                {t("policyUnderwriting:Rating")}
                                                                            </label>

                                                                            <label >
                                                                                <Input type="radio" id="ratingType" name="ratingType" checked={(this.state.ratingType === 'Absolute') ? true : false}
                                                                                    value={this.state.ratingType} onChange={() => this.onRadioBtnClick('ratingType', 'Absolute')} />
                                                                                {t("policyUnderwriting:Absolute")}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.ratingType}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                            <Col md="4">
                                                                <label>{this.state.ratingType}</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                    <label>
                                                                        <Input type="text" name="ratingTypeValue" id="ratingTypeValue" onChange={(e) => this.handleChange(e)} value={this.state.ratingTypeValue} />
                                                                        <em id="ratingTypeValueError" className="error invalid-feedback"></em>
                                                                    </label>)
                                                                    : (<p>{this.state.ratingTypeValue}</p>)}
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="4">
                                                                <label>{t("policyUnderwriting:Excess.label")}({<i className={this.props.CurrencySymbol}></i>}) *</label>
                                                            </Col>
                                                            <Col md="8">
                                                                {(this.state.isEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                    <div>
                                                                        <Input type="text" name="excess" id="excess" onChange={(e) => this.handleChange(e)} value={this.state.excess}>
                                                                        </Input>
                                                                        <em id="excessError" className="error invalid-feedback"></em>
                                                                    </div>
                                                                ) : (
                                                                        <div>
                                                                            <p>{this.state.excess}</p>
                                                                        </div>
                                                                    )}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>)
                    : (null)}

                <Row>
                    {(this.state.isEdit) ? (
                        <Col md="4" style={{ margin: "auto" }}>
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
                    ) : (null)}
                </Row>
            </div >
        );
    }
}

export default withTranslation()(Underwriting);
