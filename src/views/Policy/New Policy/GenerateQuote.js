import React, { Component } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Col, Row, Input, Button as BTN, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig, Regex } from '../../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { number } from 'prop-types';

const Coverage = [
    { value: 252.26 },
    { value: 80.00 },
    { value: 20.00 },
];

class GenerateQuote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            policyId: '',
            entityId: '',
            entityType: 'Person',
            radioSelected: "bankPayment",

            policyNumber: '',
            policyType: '',
            phone: '',
            language: '',
            policyHolder: '',
            country: '',
            email: '',
            refrred: false,
            showRefer: false,
            policyReferNotes: [],

            binder: '',
            subBinder: '',
            insuranceCompany: '',
            baseRateType: '',
            baseRate: '',
            excess: '',
            levy: '',
            adminFee: '',
            total: 0,
            totalAddOn: 0,

            vesselTypeId: '',
            vesselClassId: '',
            vesselClassName: '',

            inceptionDate: '',

            premiumType: '',
            premiumTypeError: true,
            premiumPolicyType: [],

            AddOnCoverage: [],
            CoverageAvailable: [],
            CoverageAlreadyList: [],
            toggleSaveModal: false,
            toggleDeleteModal: false,
            tempdata: [],

            entityBankDetailId: '',

            accountName: '',
            accountNameError: true,

            bankName: '',
            bankNameError: true,

            bankCountry: '',
            bankCountryError: true,
            countryList: [],

            IBAN: '',
            IBANError: true,

            BIC: '',
            BICError: true,

            bankExists: 0,

            assumptionCount: '',
            assumptionArr: [],

            liabilityCoveredAmount: '00',
            policyPremium: '00',
            totalPremium: '00',

            assumptionAndTerms: false,
            assumptionAndTermsError: false,

            ButtonGenerateDisable: false
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.setState({ policyId: this.props.match.params.Id, premiumType: 'Comprehensive', premiumTypeError: false });
            // setTimeout(() => {
            this.getPolicyHolder();
            // }, 150);
        }
        let userType = CommonConfig.loggedInUserData().ContactType;
        this.setState({ LoginUserType: userType });
        this.setState({ assumptionAndTerms: (userType == "InternalStaff") ? true : false })
        this.getLanguageData();
        this.getCurrencyData();
        this.getDropDownValues('POLICYTYPE', 'policyTypeList', 'sortorder');
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
        // this.getDropDownValues('PREMIUMPOLICYTYPE', 'premiumPolicyType');
    }

    getPolicyHolder() {
        try {
            const data = { policyId: this.props.match.params.Id };
            api.post('api/getPolicyHolderDetails', data).then(res => {
                console.log("dataaaaaaaaa-o-o-o-o-o-o-o-o-o-o", res);
                if (res.success) {

                    this.setState({
                        policyId: res.data[0][0].PolicyId,
                        policyNumber: res.data[0][0].PolicyNumber,
                        policyType: res.data[0][0].PolicyType,
                        phone: res.data[0][0].Phone,
                        language: res.data[0][0].DocLang,
                        languageId: res.data[0][0].LanguageId,
                        policyHolder: res.data[0][0].entityname,
                        email: res.data[0][0].EmailId,
                        refrred: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
                        showRefer: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
                        status: res.data[0][0].Status,
                        country: res.data[0][0].Country,
                        currency: res.data[0][0].Currency,
                        vesselTypeName: res.data[0][0].VesselTypeName,
                        policyPremium: (res.data[0][0].CurrentPremium == null)? 0 :res.data[0][0].CurrentPremium.toFixed(2),
                        vesselTypeId: res.data[0][0].VesselTypeId,
                        vesselClassId: res.data[0][0].VesselClassId,
                        vesselClassName: res.data[0][0].VesselClassName,
                        entityId: res.data[0][0].EntityId,
                        liabilityCoveredAmount: res.data[0][0].LiabilityCoveredAmount,
                        inceptionDate: res.data[0][0].InceptionDate,
                        binder: res.data[0][0].Binder,
                        subBinder: res.data[0][0].SubBinder,
                        insuranceCompany: res.data[0][0].InsuranceCompany,
                        baseRateType: res.data[0][0].BaseRateType,
                        baseRate: res.data[0][0].BaseRate,
                        excess: res.data[0][0].Excess,
                        levy: (res.data[0][0].Levy == null)? 0 :res.data[0][0].Levy.toFixed(2),
                        adminFee: (res.data[0][0].AdminFee == null)? 0 :res.data[0][0].AdminFee.toFixed(2),
                        total: res.data[0][0].CurrentPremium + res.data[0][0].Levy + res.data[0][0].AdminFee,
                        // policyPremium: res.data[0].CurrentPremium,
                        // premiumType: res.data[0].LiabilityType,
                        // totalPremium: thirdTotalPremium
                    });
                    this.getPremiumPolicyType();                    
                    this.getPolicyAddOnCoverage();
                    this.getAssumption();
                    this.getUserBankAccountDetails();
                    this.getInsuranceCompany();
                    this.getNotesbyEntityTypeAndEntityId();
                    this.setState({
                        ButtonGenerateDisable: this.state.status == 'Decline' ? true : false
                    })
                } else {
                    console.log("else");
                }
            }).catch(err => {
                console.log("sss", err);
            });
        } catch (error) {
            console.log("ssss", error);
        }
    }

    getPremiumPolicyType() {
        try {
            const data = {
                stringmaptype: 'PREMIUMPOLICYTYPE',
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log(this.state.country)
                    let countryData = this.state.country == 'Spain' ? (res.data.filter(x => x.StringMapKey !== 'ThirdParty')) : (res.data.filter(x => x.StringMapKey !== 'Basica' && x.StringMapKey !== 'Extra'));


                    this.setState({ premiumPolicyType: countryData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getPremiumAndCoverage = (type) => {
        const data = {
            LiabilityType: type,
            Country: this.state.country,
            VesselType: this.state.vesselTypeName,
            PolicyId: this.state.policyId,
        };
        api.post('api/getPremiumAndCoverage', data).then(res => {

            if (res.success) {
                let totalpremiumThirdParty = res.data[0].PremiumAmount;

                if (this.state.premiumType == 'ThirdParty') {
                    this.setState({ totalpremiumThirdParty: res.data[0].PremiumAmount })
                } else {
                    {
                        this.state.AddOnCoverage.map((value, i) => {
                            totalpremiumThirdParty = totalpremiumThirdParty + value.AddOnCoveragePremiumAmount;
                        })
                    }
                }
                if (this.state.premiumType == 'Comprehensive') {
                    let totalP = Number(this.state.total) + Number(this.state.totalAddOn);
                    this.setState({ totalPremium: totalP });
                } else {
                    this.setState({ totalPremium: totalpremiumThirdParty.toFixed(2) });
                }
                this.setState({
                    liabilityCoveredAmount: res.data[0].CoveredAmount,
                    policyPremium: res.data[0].PremiumAmount.toFixed(2),

                });
            } else {

            }
        }).catch(err => {

        });
    }

    getPolicyAddOnCoverage() {
        let data = {
            VesselTypeId: this.state.vesselTypeId
        }

        api.post('api/getPolicyAddOnCoverage', data).then(res => {
            if (res.success) {
                console.log('-p-o-op--iosd-sd-cs-cs-cfsd-',res.data);
                
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        id: [i + 1],
                        AddOnCoverageId: res.data[i].AddOnCoverageId,
                        policyOption: res.data[i].AddOnCoverageName,
                        premium: res.data[i].AddOnCoveragePremiumAmount,
                        FeeAmount: res.data[i].AddOnCoverageFeeAmount,
                        isAdded: false,
                    })
                }
                this.setState({ CoverageAvailable: formattedData });
                this.getPolicyAddedCoverage();
            } else {
            }
        }).catch(err => {

        });
    }

    getPolicyAddedCoverage() {
        let data = {
            PolicyId: this.state.policyId
        }

        api.post('api/getPolicyAddedCoverage', data).then(res => {            
            if (res.success) {

                let totalpremiumThirdParty = 0;
                let totalAddOns = 0;

                res.data.map((value, i) => {
                    totalpremiumThirdParty = totalpremiumThirdParty + value.AddOnCoveragePremiumAmount;
                    totalAddOns = totalAddOns + value.AddOnCoveragePremiumAmount;
                })
                let totalP = Number(this.state.total) + Number(totalAddOns);
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {

                    formattedData.push({
                        PolicyAddOnCoverageId: res.data[i].PolicyAddOnCoverageId,
                        AddOnCoverageId: res.data[i].AddOnCoverageId,
                        policyOption: res.data[i].AddOnCoverageName,
                        premium: res.data[i].AddOnCoveragePremiumAmount,
                        FeeAmount: res.data[i].AddOnCoverageFeeAmount,
                        IsDefault: res.data[i].IsDefault.data[0],
                        isAdded: true,
                    })

                    let CoverageAvailableArray = this.state.CoverageAvailable;
                    let index2 = CoverageAvailableArray.findIndex(x => x.policyOption === res.data[i].AddOnCoverageName);
                    if (index2 != -1) {
                        CoverageAvailableArray[index2].isAdded = true;
                        this.setState({ CoverageAvailable: CoverageAvailableArray });
                    }

                }

                this.setState({
                    CoverageAlreadyList: formattedData,
                    totalAddOn: totalAddOns.toFixed(2),
                    totalPremium: totalP.toFixed(2)
                });

            } else {
            }
        }).catch(err => {

        });
    }

    getAssumption() {
        try {
            const data = {
                VesselTypeId: this.state.vesselTypeId
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

    getUserBankAccountDetails() {
        try {
            const data = { EntityId: this.state.entityId, EntityType: this.state.entityType };

            api.post(APIConstant.path.getUserBankAccountDetails, data).then(res => {
                if (res.data.length) {
                    var BankExists = 1
                    this.setState({ accountNameError: false, IBANError: false, BICError: false, bankNameError: false, bankCountryError: false })
                }
                console.log('-s-cv-fe-d-ad-', res);

                if (res.success) {
                    this.setState({
                        entityBankDetailId: res.data[0].EntityBankDetailId,
                        accountName: res.data[0].AccountName,
                        IBAN: res.data[0].IBAN,
                        BIC: res.data[0].BIC,
                        bankName: res.data[0].BankName,
                        bankCountry: res.data[0].Country,
                        bankExists: BankExists,
                    });
                } else {
                    console.log("else");
                }
            }).catch(err => {
                console.log("sss", err);
            });
        } catch (error) {
            console.log("ssss", error);
        }
    }

    getInsuranceCompany() {
        try {
            const data = { Country: this.state.country, VesselClassId: this.state.vesselClassId, InceptionDate: this.state.inceptionDate };
            console.log(data);

            api.post('api/getInsuranceCompany', data).then(res => {
                console.log("dataaaaaaaaa", res.data);
                // if (res.data.length) {
                //     var BankExists = 1
                //     this.setState({accountNameError: false, IBANError: false, BICError: false, bankNameError:false, bankCountryError: false})
                // }
                // if (res.success) {
                //     this.setState({
                //         entityBankDetailId: res.data[0].EntityBankDetailId,
                //         accountName: res.data[0].AccountName,
                //         IBAN: res.data[0].IBAN,
                //         BIC: res.data[0].BIC,
                //         bankName: res.data[0].BankName,
                //         bankCountry: res.data[0].Country,
                //         bankExists: BankExists,
                //     });
                // } else {
                //     console.log("else");
                // }
            }).catch(err => {
                console.log("sss", err);
            });
        } catch (error) {
            console.log("ssss", error);
        }
    }

    getNotesbyEntityTypeAndEntityId() {
        try {
            const data = { EntityId: this.state.policyId, EntityType: "Policy" };

            api.post(APIConstant.path.getNotesbyEntityTypeAndEntityId, data).then(res => {
                if (res.success) {
                    console.log('-i-i-i-o-o-o-o', res);

                    this.setState({
                        policyReferNotes: res.data
                    });
                } else {
                    console.log("else");
                }
            }).catch(err => {
                console.log("sss", err);
            });
        } catch (error) {
            console.log("ssss", error);
        }
    }

    getLanguageData() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                console.log(res);

                if (res.success) {
                    this.setState({ languageList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getCurrencyData() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                console.log(res);

                if (res.success) {
                    this.setState({ currencyList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
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

    editLanguage() {
        this.setState({ changeLanguage: !this.state.changeLanguage });
    }

    editCurrency() {
        this.setState({ changeCurrency: !this.state.changeCurrency });
    }

    editPolicyType() {
        this.setState({ changePolicyType: !this.state.changePolicyType });
    }

    editVesselType() {

    }

    selectContainerType(value, type) {
        if (type === 'language') {
            let languageData = this.state.languageList.filter((list) => {
                return list.LanguageId == value;
            });
            this.setState({ languageId: value, language: languageData[0].Language, changeLanguage: false });
        }

        if (type === 'currency') {
            this.setState({ currency: value, changeCurrency: false });
        }

        if (type === 'policyType') {
            this.setState({ policyType: value, changePolicyType: false });
        }

        setTimeout(() => {
            this.changePolicyData(type);
        }, 200);
    }

    changePolicyData(type) {
        console.log(this.state);
        let data = '';
        if (type === 'language') {
            data = { PolicyId: this.props.match.params.id, type: type, DocLang: this.state.language, LanguageId: this.state.languageId };
        }

        if (type === 'currency') {
            data = { PolicyId: this.props.match.params.id, type: type, Currency: this.state.currency };
        }

        if (type === 'policyType') {
            data = { PolicyId: this.props.match.params.id, type: type, PolicyType: this.state.policyType };
        }

        api.post('api/changePolicyData', data).then(res => {
            if (res.success) {
                console.log(res);
            } else {
            }
        }).catch(err => {

        });
    }

    openModal(modal) {
        if (modal == 'Assumption') {
            this.setState({ toggleAssumption: !this.state.toggleAssumption });
        } else if (modal == 'TermsAndCondition') {
            this.setState({ toggleTermsAndCondition: !this.state.toggleTermsAndCondition });
        }
    }

    toggleLarge = (modal) => {
        if (modal == 'Assumption') {
            this.setState({ toggleAssumption: false });
        } else if (modal == 'TermsAndCondition') {
            this.setState({ toggleTermsAndCondition: false });
        }
    }

    onRadioBtnClick(radioType, radioSelected) {
        console.log(this.state);

        if (radioType === 'paymentMode') {
            this.setState({ radioSelected: radioSelected });
            if (radioSelected == "bankPayment") {
                this.setState({
                    accountNameError: true,
                    bankNameError: true,
                    bankCountryError: true,
                    IBANError: true,
                    BICError: true,
                })
            }else{
                this.setState({
                    accountNameError: false,
                    bankNameError: false,
                    bankCountryError: false,
                    IBANError: false,
                    BICError: false,
                    accountName: '',
                    bankName: '',
                    bankCountry: '',
                    IBAN: '',
                    BIC: ''
                })
            }
        }
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'assumptionAndTerms') {
            if (e.target.checked) {
                this.setState({ assumptionAndTerms: e.target.checked, assumptionAndTermsError: false });
            } else {
                this.setState({ assumptionAndTerms: e.target.checked, assumptionAndTermsError: true });
            }
        }

        if (e.target.name === 'refrred') {
            if (e.target.checked) {
                this.setState({ refrred: e.target.checked, refrredError: false });
            } else {
                this.setState({ refrred: e.target.checked, refrredError: true });
            }
        }

        if (e.target.name === 'accountName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ accountNameError: true });
                this.show("accountName", true, "accountNameError", "Please enter Account Name ");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ accountNameError: true });
                    this.show("accountName", true, "accountNameError", "Please enter valid Account Name");
                } else {
                    this.setState({ accountNameError: false, accountName: e.target.value });
                    this.show("accountName", false, "accountNameError", "");
                }
            }
        }
        if (e.target.name === 'bankName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ bankNameError: true });
                this.show("bankName", true, "bankNameError", "Please enter Bank Name");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ bankNameError: true });
                    this.show("bankName", true, "bankNameError", "Please enter valid Bank Name");
                } else {
                    this.setState({ bankNameError: false, bankName: e.target.value });
                    this.show("bankName", false, "bankNameError", "");
                }
            }
        }
        if (e.target.name === 'IBAN') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ IBANError: true });
                this.show("IBAN", true, "IBANError", "Please enter IBAN Number");
            } else {
                let nameRegEx = CommonConfig.RegExp.alphaNumeric;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ IBANError: true });
                    this.show("IBAN", true, "IBANError", "Please enter valid IBAN Number");
                } else {
                    if (e.target.value.length > 34) {
                        this.setState({ IBANError: true, IBAN: this.state.IBAN });
                        this.show("IBAN", true, "IBANError", "Please enter less than 34");
                    } else {
                        this.setState({ IBANError: false, IBAN: e.target.value });
                        this.show("IBAN", false, "IBANError", "");
                    }
                }
            }
        }
        if (e.target.name === 'BIC') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ BICError: true });
                this.show("BIC", true, "BICError", "Please enter BIC Number");
            } else {
                let nameRegEx = CommonConfig.RegExp.alphaNumeric;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ BICError: true });
                    this.show("BIC", true, "BICError", "Please enter valid BIC Number");
                } else {
                    if (e.target.value.length < 8 || e.target.value.length > 11) {
                        this.setState({ BICError: true, BIC: e.target.value });
                        this.show("BIC", true, "BICError", "BIC number must be between 8 to 11 Characters");
                    } else {
                        this.setState({ BICError: false, BIC: e.target.value });
                        this.show("BIC", false, "BICError", "");
                    }
                }
            }
        }
    }

    selectType(value, type) {
        if (type === 'premiumType') {
            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ premiumTypeError: true, premiumType: value.value });
                this.show('premiumType', true, "premiumTypeError", "Please select Policy Premium Type");
            } else {
                this.setState({ premiumTypeError: false, premiumType: value.value });
                this.show('premiumType', false, "premiumTypeError", "");
                this.getPremiumAndCoverage(value.value);
                // if (value.value == 'Comprehensive') {
                //     this.getPolicyHolder();
                // }
            }
        }
        if (type === 'bankCountry') {
            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ bankCountryError: true, bankCountry: value.value });
                this.show("bankCountry", true, "bankCountryError", "Please select Country");
            } else {
                this.setState({ bankCountryError: false, bankCountry: value.value });
                this.show("bankCountry", false, "bankCountryError", "");
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

    SaveQuatation() {
        console.log(this.state);
        if (!this.state.premiumTypeError && !this.state.accountNameError && !this.state.bankNameError && !this.state.bankCountryError && !this.state.IBANError && !this.state.BICError && this.state.assumptionAndTerms) {

            let data = {
                // GENERAL
                LanguageId: 'en-GB',
                Status: 'Active',
                BankExists: this.state.bankExists,
                // POLICY
                PolicyId: this.state.policyId,
                LiabilityType: this.state.premiumType,
                LiabilityCoveredAmount: this.state.liabilityCoveredAmount,
                CurrentPremium: this.state.policyPremium,
                // EntityBankDetail
                RadioSelected: this.state.radioSelected,
                EntityBankDetailId: this.state.entityBankDetailId,
                EntityType: this.state.entityType,
                EntityId: this.state.entityId,
                AccountName: this.state.accountName,
                IBAN: this.state.IBAN,
                BIC: this.state.BIC,
                BankName: this.state.bankName,
                Country: this.state.bankCountry,
                LoggedInUserId: CommonConfig.loggedInUserId()
            }

            api.post('api/saveBankAndQuote', data).then(res => {

                if (res.success) {
                    toast.success('Quotation Generated successfully');
                    this.props.history.push({
                        pathname: '/PolicyDetails/' + this.state.policyId,
                        state: {
                            Id: this.state.policyId
                        }
                    });
                } else {

                }
            })

        } else {
            if (this.state.premiumTypeError) {
                toast.error("Please select Premium Policy Type")
                return;
            }
            if (this.state.accountNameError) {
                toast.error("Please enter Bank Account Name")
                return;
            }
            if (this.state.bankNameError) {
                toast.error("Please enter Bank Name")
                return;
            }
            if (this.state.bankCountryError) {
                toast.error("Please select Bank Country")
                return;
            }
            if (this.state.IBANError) {
                toast.error("Please enter IBN")
                return;
            }
            if (this.state.BICError) {
                toast.error("Please enter BIC")
                return;
            }
            if (!this.state.assumptionAndTerms) {
                toast.error("You must agree to Assumption And Terms & Conditions")
                return;
            }
        }
    }

    Back = () => {
        this.props.history.push({
            pathname: '/PolicyList',
        });
    }

    addToListModal(data) {
        this.setState({ tempdata: data })
        this.setState({ toggleSaveModal: !this.state.toggleSaveModal });
    }

    addToList(data, field) {
        let CoverageAlreadyArray = this.state.CoverageAlreadyList;
        let index1 = CoverageAlreadyArray.findIndex(x => x.policyOption === data.policyOption);
        if (index1 > -1) {
            CoverageAlreadyArray[index1].isAdded = true;
            this.setState({ CoverageAlreadyList: CoverageAlreadyArray })
        } else {
            var CoverageAlready = [
                {
                    PolicyAddOnCoverageId: null,
                    AddOnCoverageId: data.AddOnCoverageId,
                    policyOption: data.policyOption,
                    premium: data.premium,
                    FeeAmount: data.FeeAmount,
                    isAdded: true,
                }
            ];

            this.setState({ CoverageAlreadyList: this.state.CoverageAlreadyList.concat(CoverageAlready) });
        }
        let CoverageAvailableArray = this.state.CoverageAvailable;
        let index2 = CoverageAvailableArray.findIndex(x => x.policyOption === data.policyOption);
        CoverageAvailableArray[index2].isAdded = true;
        this.setState({ CoverageAvailable: CoverageAvailableArray });
        this.Save(CoverageAlready);
    }

    Save = (CoverageAlready) => {
        let data = {
            CoverageAlreadyList: CoverageAlready,
            PolicyId: this.state.policyId,
        }
        api.post('api/addPolicyCovarage', data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                this.getPolicyAddOnCoverage();
                this.toggleSave();
            } else {

            }
        }).catch(err => {
        });
    }

    toggleSave = () => {
        this.setState({ toggleSaveModal: false, tempdata: [] });
    }

    deleteCoverageModal(data) {
        this.setState({ tempdata: data })
        this.setState({ toggleDeleteModal: !this.state.toggleDeleteModal });
        console.log(data);
        
    }

    deleteCoverage(data) {
        if (data.PolicyAddOnCoverageId) {
           let apiData = { PolicyAddOnCoverageId: data.PolicyAddOnCoverageId }
           api.post('api/deleteAddedCoverage', { apiData }).then(res => {
              if (res.success) {
                 // toast.success('Coverage Deleted Successfully');
              } else {
  
              }
           }).catch(err => {
  
           });
        }
        let CoverageAvailableArray = this.state.CoverageAvailable;
        let index1 = CoverageAvailableArray.findIndex(x => x.policyOption === data.policyOption);
        CoverageAvailableArray[index1].isAdded = false;
  
        let listIndex = this.state.CoverageAlreadyList.findIndex(x => x.policyOption === data.policyOption);
        this.state.CoverageAlreadyList.splice(listIndex, 1);
  
        this.setState({ CoverageAvailable: CoverageAvailableArray });
        toast.success('Coverage Deleted Successfully');
        this.setState({ tempdata: data })
        this.getPolicyAddOnCoverage();
        this.toggleDelete();
    }

    toggleDelete = () => {
        this.setState({ toggleDeleteModal: false, tempdata: [] });
    }

    render() {
        const { t, i18n } = this.props;
        const SaveButton = t("buttons.Save");
        const CancelButton = t("buttons.Cancel");
        const BackButton = t("buttons.BackToPolicy");
        const AddButton = t("buttons.Add");
        const DeleteButton = t("buttons.Delete");

        var header = <div>
            <Row>
                {(this.state.showRefer) ?
                    (<Col md="12">
                        <div className="policy-warning">
                            {this.state.policyReferNotes.map((ct, i) => {
                                return (<div><span style={{ fontSize: 18 }}>*</span><span style={{ marginRight: 15 }}>{ct.NoteText}</span></div>)
                            })
                            }
                        </div>
                    </Col>
                    ) : (null)}
                {(this.state.status == 'Declined') ?
                    (<Col md="12" style={{ textAlign: "center", color: "red", fontSize: 15 }}>
                        {t("generateQuote:PolicyisDeclinedbytheSystem")}
                </Col>
                    ) : (null)}
                <Col xs="12" md="12">
                    <Row>
                        <Col md="2">
                            <div className="policy-box">
                                <p>{t("generateQuote:Policy")}</p>
                                <span>{this.state.policyNumber}</span>
                            </div>
                        </Col>
                        <Col md="5">
                            <div className="policy-box">
                                <p>{this.state.vesselTypeName}
                                    <span>
                                        {(this.state.status != "Active" && this.state.status != '') ? (
                                            <BTN color="primary" onClick={() => this.editVesselType()} title="Change Vessel Type">
                                                <i className="fa fa-pencil"></i>
                                            </BTN>
                                        ) : (null)}
                                    </span>
                                </p>
                                <div className="qt-status">
                                    <p className="pl-status badge badge-primary">{this.state.status}</p>
                                    <p className="pl-status badge badge-warning">UNPAID</p>
                                    {(this.state.refrred) ?
                                    (<h6 style={{ backgroundColor: "#9e3434", padding: "2px 10px", width: "max-content", float: "left", color: "white" }}>{t("generateQuote:Referred")}</h6>)
                                    : (null)}
                                </div>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>{t("generateQuote:Phone")}</p>
                                <span>{this.state.phone}</span>
                            </div>
                        </Col>
                        <Col md="2">
                            <div className="policy-box">
                                <p>{t("generateQuote:Claims")}</p>
                                <span>0</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("generateQuote:PolicyHolder")}</p>
                                <span>{this.state.policyHolder}</span>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("generateQuote:Email")}</p>
                                <span>{this.state.email}</span>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("generateQuote:Country")}</p>
                                <span>{this.state.country}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("generateQuote:PolicyType")}</p>
                                <div className="pl-inner">
                                    {(this.state.changePolicyType) ? (
                                        <Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectContainerType(e.target.value, 'policyType')} value={this.state.policyType} style={{ width: "fit-content", display: "inline-block" }}>
                                            {this.state.policyTypeList.map((ct, i) => {
                                                return (<option value={ct.StringMapName}>{ct.StringMapName}</option>)
                                            })
                                            }
                                        </Input>
                                    ) : (
                                            <span>{this.state.policyType}</span>
                                        )}
                                    <BTN color="primary" onClick={() => this.editPolicyType()} title="Change Policy Type">
                                        <i className="fa fa-pencil"></i>
                                    </BTN>
                                </div>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>
                                {t("generateQuote:Language")}
                                    <BTN color="primary" onClick={() => this.editLanguage()} title="Change Language">
                                        <i className="fa fa-pencil"></i>
                                    </BTN>
                                </p>
                                <div className="pl-inner">
                                    <label>
                                    {t("generateQuote:Refer")}
                                        <Input type="checkbox" name="refrred" id="refrred" onChange={(e) => this.handleChange(e)} value={this.state.refrred} checked={this.state.refrred == true ? true : false} value={this.state.refrred} style={{ marginLeft: "10px" }} disabled={this.state.showRefer}>
                                        </Input>
                                    </label>
                                    {(this.state.changeLanguage) ? (
                                        <Input type="select" name="languageId" id="languageId" onChange={(e) => this.selectContainerType(e.target.value, 'language')} value={this.state.languageId}>
                                            {this.state.languageList.map((ct, i) => {
                                                return (<option value={ct.LanguageId}>{ct.Language}</option>)
                                            })
                                            }
                                        </Input>
                                    ) : (
                                            <span>{this.state.language}</span>
                                        )}
                                </div>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("generateQuote:Currency")}</p>
                                <div className="pl-inner">
                                    {(this.state.changeCurrency) ? (
                                        <Input type="select" name="currency" id="currency" onChange={(e) => this.selectContainerType(e.target.value, 'currency')} value={this.state.currency} style={{ width: "fit-content", display: "inline-block" }}>
                                            {this.state.currencyList.map((ct, i) => {
                                                return (<option value={ct.CurrncyCode}>{ct.CurrncyCode}</option>)
                                            })
                                            }
                                        </Input>
                                    ) : (
                                            <span>{this.state.currency}</span>
                                        )}
                                    <BTN  color="primary" onClick={() => this.editCurrency()} title="Change Currency">
                                        <i className="fa fa-pencil"></i>
                                    </BTN>
                                </div>
                            </div>
                        </Col>                        
                    </Row>
                </Col>
            </Row>
        </div>;

        return (
            <div>
                <Col style={{ marginTop: "20px" }}>
                    <div className="input-box">
                        {header}
                    </div>
                    <div className="input-box">
                        <Row>
                            <Col md="6">
                                <Card>
                                    <CardBody style={{ backgroundColor: "#f2f2f2" }}>
                                        <div className="input-box">
                                            <Row>
                                                <Col md="2">
                                                    <b>{t("generateQuote:Binder")}</b>
                                                </Col>
                                                <Col md="4">
                                                    {this.state.binder}
                                                </Col>
                                                {CommonConfig.isEmpty(this.state.subBinder) ? (null) :
                                                    (<Col md="6" style={{ display: "inline-flex" }}>
                                                        <Col md="6">
                                                            <b>{t("generateQuote:Sub Binder")}</b>
                                                        </Col>
                                                        <Col md="6">
                                                            {this.state.subBinder}
                                                        </Col>

                                                    </Col>)}
                                            </Row>
                                        </div>
                                        <div className="input-box">
                                            <Row>
                                                <Col md="4">
                                                    <b>{t("generateQuote:Insurance Company")}</b>
                                                </Col>
                                                <Col md="8">
                                                    {this.state.insuranceCompany}
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="input-box" style={{ marginBottom: 50 }}>
                                            <Row>
                                                <Col md="3">
                                                    <b>{t("generateQuote:Excess")}</b>
                                                </Col>
                                                <Col md="3">
                                                    {this.state.excess}
                                                </Col>
                                                <Col md="3">
                                                    <b>{t("generateQuote:Base Rate")}</b>
                                                </Col>
                                                <Col md="3">
                                                    {this.state.baseRate}{(this.state.baseRateType == "Rating" ? '%' : (null))}
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="input-box">
                                            <Row>
                                                <Col md="2">
                                                </Col>
                                                <Col md="3">
                                                    <label>{t("generateQuote:PolicyType")}</label>
                                                </Col>
                                                <Col md="5">
                                                    <Input type="select" name="premiumType" id="premiumType" onChange={(e) => this.selectType(e.target, 'premiumType')} value={this.state.premiumType}>
                                                        <option value=''>{t("generateQuote:Select")}</option>
                                                        {this.state.premiumPolicyType.map((sm, i) => {
                                                            return (<option value={sm.StringMapKey}>{sm.StringMapName}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="premiumTypeError" className="error invalid-feedback"></em>
                                                </Col>
                                                <Col md="2">
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="input-box">
                                            <Row>
                                                <Col md="2">
                                                </Col>
                                                <Col md="5">
                                                    <h6>{t("generateQuote:Policy Premium")}</h6>
                                                </Col>
                                                <Col md="3" style={{ textAlign: "right" }}>
                                                    <h6>{this.state.policyPremium}</h6>
                                                </Col>
                                                <Col md="2">
                                                </Col>
                                            </Row>
                                        </div>

                                        {(this.state.premiumType == 'Comprehensive') ? (
                                            <div>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="5">
                                                            <h6>{t("generateQuote:Levy")}</h6>
                                                        </Col>
                                                        <Col md="3" style={{ textAlign: "right" }}>
                                                            <h6>{this.state.levy}</h6>
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="5">
                                                            <h6>{t("generateQuote:Admin Fee")}</h6>
                                                        </Col>
                                                        <Col md="3" style={{ textAlign: "right" }}>
                                                            <h6>{this.state.adminFee}</h6>
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <hr style={{ height: 1, backgroundColor: '#000000', width: "70%", marginBottom: 7, marginTop: -12 }} />
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="5">
                                                            <h5>{t("generateQuote:Total")}</h5>
                                                        </Col>
                                                        <Col md="3" style={{ textAlign: "right" }}>
                                                            <h5>{(this.state.total).toFixed(2)}</h5>
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ) : null}
                                        {(this.state.premiumType == 'Comprehensive') ? (
                                            <div>
                                                {this.state.CoverageAlreadyList.map((ca, i) => {
                                                    if (ca.isAdded) {
                                                        return (
                                                            <Row>
                                                                <Col md="2">
                                                                </Col>
                                                                <Col md="5">
                                                                    <h6>{ca.policyOption}</h6>
                                                                </Col>
                                                                <Col md="3" style={{ textAlign: "right" }}>
                                                                    <h6>{ca.premium.toFixed(2)}</h6>
                                                                </Col>
                                                                <Col md="2">
                                                                    {(ca.IsDefault == 0) ?
                                                                        (<BTN title={DeleteButton} className="btn-sm" onClick={() => this.deleteCoverageModal(ca, 'CoverageAlready')} style={{ marginLeft: 5 }} color="danger">
                                                                            <i className="fa fa-trash"></i>
                                                                        </BTN>)
                                                                        : (null)}
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                })}

                                                <hr style={{ height: 1, backgroundColor: '#000000', width: "70%", marginBottom: 7, marginTop: 0 }} />
                                                <div className="input-box">
                                                    <Row>
                                                        <Col md="2">
                                                        </Col>
                                                        <Col md="5">
                                                            <h5>{t("generateQuote:Total Add Ons")}</h5>
                                                        </Col>
                                                        <Col md="3" style={{ textAlign: "right" }}>
                                                            <h5>{this.state.totalAddOn}</h5>
                                                        </Col>
                                                        <Col md="2">
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ) : (null)}
                                        <div className="input-box">
                                            <Row>
                                                <Col md="2">
                                                </Col>
                                                <Col md="5">
                                                    <h3>{t("generateQuote:Total Due")}</h3>
                                                </Col>
                                                <Col md="3" style={{ textAlign: "right" }}>
                                                    <h3>{this.state.totalPremium}</h3>
                                                </Col>
                                                <Col md="2">
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            {(this.state.premiumType != 'ThirdParty') ? (
                                <Col md="6">
                                    <Row>
                                        <Col md="12" style={{ textAlign: "center" }}>
                                            <p><b>{t("generateQuote:Wait... you may want to get an add on policy for secured protection")}</b></p>
                                        </Col>
                                    </Row>
                                    <Card>
                                        <CardBody style={{ backgroundColor: "#f2f2f2" }}>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="12">
                                                        <div style={{ marginTop: 10 }} className="input-box">
                                                            <table className="added-detail-table" style={{ width: "100%" }}>
                                                                <thead>
                                                                    <tr>
                                                                        <th>{t("policyAddOnCoverage:AvailableToPurchase.PolicyOption")}</th>
                                                                        <th>{t("policyAddOnCoverage:AvailableToPurchase.Premium")}</th>
                                                                        <th style={{ width: "25%" }}>{t("policyAddOnCoverage:AvailableToPurchase.Action")}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {this.state.CoverageAvailable.map((ca, i) => {
                                                                        {
                                                                            // console.log(this.state.CoverageAvailable)
                                                                        }
                                                                        if (!ca.isAdded) {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{ca.policyOption}</td>
                                                                                    <td>{ca.premium}</td>
                                                                                    <td>
                                                                                        <BTN title={AddButton} color="primary" icon="fa fa-plus" onClick={() => this.addToListModal(ca, 'CoverageAvailable')} >
                                                                                            <i className="fa fa-plus"></i>
                                                                                        </BTN>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    }
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ) : (null)}
                        </Row>
                    </div>
                    <div className="input-box">
                        <Row>
                            <Col md="6">
                                <Row>
                                    <Col md="12">
                                        <p><b>{t("generateQuote:Assumptions")}</b></p>
                                        <div style={{ height: 130, overflow: "scroll" }}>
                                            <ul>
                                                {this.state.assumptionArr.map((type, i) => {
                                                    return (<li>{type.AssumptionDescription}</li>)
                                                })}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="6">
                                <Row>
                                    <Col md="12">
                                        <p><b>{t("generateQuote:Terms & Conditions")}</b></p>
                                        <div style={{ height: 130, overflow: "scroll" }}>
                                            <div dangerouslySetInnerHTML={{ __html: t("translation:termsAndCondition.terms") }}></div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div className="input-box">
                        <Row>
                            <Col md="3" style={{ maxWidth: "19%" }}>
                                <h4>{t("generateQuote:Payment Method *")}</h4>
                            </Col>
                            <Col>
                                <div className="input-box rc-box">
                                    <div className="rc-inline">
                                        <label>
                                            <Input type="radio" name="paymentMode" checked={(this.state.radioSelected === 'bankPayment') ? true : false}
                                                value={this.state.radioSelected} onChange={() => this.onRadioBtnClick('paymentMode', 'bankPayment')}
                                            />
                                            {t("generateQuote:Bank Payment")}
                                    </label>

                                        <label >
                                            <Input type="radio" name="paymentMode" checked={(this.state.radioSelected === 'cardPayment') ? true : false}
                                                value={this.state.radioSelected} onChange={() => this.onRadioBtnClick('paymentMode', 'cardPayment')} />
                                            {t("generateQuote:Debit/Credit Card")}
                                    </label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        {(this.state.radioSelected == "bankPayment") ?
                            <Row>
                                <Col md="12">
                                    <h5>{t("generateQuote:Enter Bank Information")}</h5>
                                </Col>
                                <Col md="9">
                                    <Card>
                                        <CardBody style={{ backgroundColor: "#f2f2f2" }}>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Account Name")}</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="text" name="accountName" id="accountName" onChange={(e) => this.handleChange(e)} value={this.state.accountName} />
                                                        <em id="accountNameError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Bank Name")}</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="text" name="bankName" id="bankName" onChange={(e) => this.handleChange(e)} value={this.state.bankName} />
                                                        <em id="bankNameError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Country")}</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="select" name="bankCountry" id="bankCountry" onChange={(e) => this.selectType(e.target, 'bankCountry')} value={this.state.bankCountry}>
                                                            <option value=''>{t("generateQuote:Select")}</option>
                                                            {this.state.countryList.map((type, i) => {
                                                                return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="bankCountryError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:IBAN")}</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="text" name="IBAN" id="IBAN" onChange={(e) => this.handleChange(e)} value={this.state.IBAN} />
                                                        <em id="IBANError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:BIC")}</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="text" name="BIC" id="BIC" onChange={(e) => this.handleChange(e)} value={this.state.BIC} />
                                                        <em id="BICError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            : (null)}
                        {(this.state.radioSelected == "cardPayment") ?
                            <Row>
                                <Col md="12">
                                    <h5>{t("generateQuote:Enter Card Detail")}</h5>
                                </Col>
                                <Col md="9">
                                    <Card>
                                        <CardBody style={{ backgroundColor: "#f2f2f2" }}>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Cardholder Name")}</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="text" name="cardholderName" id="cardholderName" onChange={(e) => this.handleChange(e)} value={this.state.cardholderName} />
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please enter cardholder name")}</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Card Number")}</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="text" name="cardNumber" id="cardNumber" onChange={(e) => this.handleChange(e)} value={this.state.cardNumber} />
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please enter card number")}</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Card Type")}</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="select" name="cardType" id="cardType" onChange={(e) => this.selectType(e.target, 'cardType')} value={this.state.cardType}>
                                                            <option value=''>{t("generateQuote:Select")}</option>
                                                            {/* {this.state.policyTypeList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            } */}
                                                        </Input>
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please selct card type")}</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:Expiry")}</label>
                                                    </Col>
                                                    <Col md="2">
                                                        <Input type="select" name="expiryMonth" id="expiryMonth" onChange={(e) => this.handleChange(e)} value={this.state.expiryMonth}>
                                                            <option value=''>{t("generateQuote:Select")}</option>
                                                            {/* {this.state.policyTypeList.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        } */}
                                                        </Input>
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please enter expiry month")}</em>
                                                    </Col>
                                                    <Col md="2">
                                                        <Input type="select" name="expiryYear" id="expiryYear" onChange={(e) => this.handleChange(e)} value={this.state.expiryYear}>
                                                            <option value=''>{t("generateQuote:Select")}</option>
                                                            {/* {this.state.policyTypeList.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        } */}
                                                        </Input>
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please enter expiry Year")}</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{t("generateQuote:CVV")}</label>
                                                    </Col>
                                                    <Col md="2">
                                                        <Input type="text" name="CardBIC" id="CardBIC" onChange={(e) => this.handleChange(e)} value={this.state.CardBIC} />
                                                        <em className="error invalid-feedback" >{t("generateQuote:Please enter BIC")}</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            : (null)}
                    </div>
                    <div className="input-box">
                        <Row>
                            <Col md="12">
                                <h4>{t("generateQuote:Documents Required to be Uploaded")}</h4>
                            </Col>
                        </Row>
                    </div>
                    <div className="input-box">
                        <Row>
                            <Col md="2">
                                <h6>{t("generateQuote:Document 1")}</h6>
                            </Col>
                            <Col md="2">
                                <h6>{t("generateQuote:Upload")}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2">
                                <h6>{t("generateQuote:Document 2")}</h6>
                            </Col>
                            <Col md="2">
                                <h6>{t("generateQuote:Upload")}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2">
                                <h6>{t("generateQuote:Document 3")}</h6>
                            </Col>
                            <Col md="2">
                                <h6>{t("generateQuote:Upload")}</h6>
                            </Col>
                        </Row>
                    </div>
                    {(this.state.LoginUserType == "InternalStaff") ? (null) :
                        (<div className="input-box">
                            <Row>
                                <Col md="12">
                                    <Input type="checkbox" name="assumptionAndTerms" id="assumptionAndTerms" onChange={(e) => this.handleChange(e)} checked={this.state.assumptionAndTerms == true ? "checked" : ""} value={this.state.assumptionAndTerms} />
                                    <span>{t("generateQuote:I agree to the")} {this.state.assumptionCount == 0 ? 'Assumption' : (<a onClick={() => this.openModal('Assumption')} style={{ textDecorationLine: 'underline', cursor: 'pointer' }}>{t("generateQuote:Assumptions")}</a>)} {t("generateQuote:as well as")} <a onClick={() => this.openModal('TermsAndCondition')} style={{ textDecorationLine: 'underline', cursor: 'pointer' }}>{t("generateQuote:Terms & Conditions")}</a></span>
                                    {(this.state.assumptionAndTermsError)
                                        ? <p style={{ color: 'red' }}>{t("generateQuote:You must agree to Assumption And Terms & Conditions")}</p>
                                        : (null)}
                                </Col>
                            </Row>
                        </div>)}
                    <div className="input-box">
                        <Row>
                            <Col md="12" style={{ textAlign: "center" }}>
                                <BTN color="success" onClick={() => this.Back()} style={{ marginRight: 10 }} >
                                    <i className="fa fa-angle-left" />
                                    {t("generateQuote:Back")}
                                </BTN>
                                <BTN color="success" onClick={() => this.SaveQuatation()} disabled={this.state.ButtonGenerateDisable} >
                                    <i className="fa fa-check"></i>
                                    {t("generateQuote:Save Quotation")}
                                </BTN>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Modal isOpen={this.state.toggleAssumption} toggle={() => this.toggleLarge('Assumption')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleLarge('Assumption')}>{t("generateQuote:Assumption")}</ModalHeader>
                    <ModalBody>
                        <ul>
                            {this.state.assumptionArr.map((type, i) => {
                                return (<li>{type.AssumptionDescription}</li>)
                            })}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <button color="secondary" onClick={() => this.toggleLarge('TermsAndCondition')}>{t("generateQuote:Select")}Close</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.toggleTermsAndCondition} toggle={() => this.toggleLarge('TermsAndCondition')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleLarge('TermsAndCondition')}>{t("generateQuote:Terms And Condition")}</ModalHeader>
                    <ModalBody>
                        <div dangerouslySetInnerHTML={{ __html: t("translation:termsAndCondition.terms") }}></div>
                    </ModalBody>
                    <ModalFooter>
                        <button color="secondary" onClick={() => this.toggleLarge('TermsAndCondition')}>{t("generateQuote:Close")}</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.toggleSaveModal} toggle={this.toggleSave}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleSave}>{t("policyAddOnCoverage:ConformationSaveModal.Header")}</ModalHeader>
                    <ModalBody>
                    {t("generateQuote:Are you sure you want to Add")} <b>{this.state.tempdata.policyOption}</b> {t("generateQuote:Coverage?")}
                    </ModalBody>
                    <ModalFooter>
                        <button color="primary" onClick={() => this.addToList(this.state.tempdata)}>{t("policyAddOnCoverage:ConformationSaveModal.Approval")}</button>
                        <button color="secondary" onClick={this.toggleSave}>{t("policyAddOnCoverage:ConformationSaveModal.Reject")}</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.toggleDeleteModal} toggle={this.toggleDelete}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleDelete}>{t("policyAddOnCoverage:ConformationDeleteModal.Header")}</ModalHeader>
                    <ModalBody>
                    {t("generateQuote:Do you want to delete ")}<b>{this.state.tempdata.policyOption}</b> {t("generateQuote:Coverage?")}
                    </ModalBody>
                    <ModalFooter>
                        <button color="primary" onClick={() => this.deleteCoverage(this.state.tempdata)}>{t("policyAddOnCoverage:ConformationDeleteModal.Approval")}</button>
                        <button color="secondary" onClick={this.toggleDelete}>{t("policyAddOnCoverage:ConformationDeleteModal.Reject")}</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default withTranslation()(GenerateQuote);