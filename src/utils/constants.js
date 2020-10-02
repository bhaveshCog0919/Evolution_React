import React from 'react';
import Cookies from "js-cookie";
import api from './apiClient';
var accentedCharacters = "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";

//=============PATH=================//
export default class APIConstant {

    static path = {
        login: 'api/login',
        register: 'api/signup',
        resetpassword: 'api/reset_password',
        forgotpassword: 'api/forgot_password',
        dropdownbycode: 'api/dropdownByCode',
        dropdownbycodeforreason: 'api/dropdownByCodeForReason',
        getcommondropdown: 'api/getCommonDropdown',
        addContactDetails: 'api/addContactDetails',
        getContact: 'api/getContact',
        getLanguage: 'api/getLanguage',
        getCurrency: 'api/getCurrency',
        getVesselClass: 'api/getVesselClass',
        getVesselType: 'api/getVesselType',
        getDefaultAddonCoverage: 'api/getDefaultAddonCoverage',
        getAssumption: 'api/getAssumption',
        getUserBankAccountDetails: 'api/getUserBankAccountDetails',
        getNotesbyEntityTypeAndEntityId: 'api/getNotesbyEntityTypeAndEntityId',
        getActiveReferralNotes: 'api/getActiveReferralNotes',
        getUserPolicyList: 'api/getUserPolicyList',
        getPolicyClientName: 'api/getPolicyClientName',
        getAllEmailList: 'api/getAllEmailList',
        getAllcontactList: 'api/getAllcontactList',
        getAllpolicyNumber: 'api/getAllpolicyNumber',
        getpolicyNumberById: 'api/getpolicyNumberById',
        getAllBinder: 'api/getAllBinder',
        getSubBinderByBinderId: 'api/getSubBinderByBinderId',
        isRenewalComutationActive: 'api/isRenewalComutationActive',
        getNextPolicyNumer: 'api/getNextPolicyNumer',
        checkPolicyNumberExists: 'api/checkPolicyNumberExists',
        cancelPolicy: 'api/cancelPolicy',
        isGenerateRenewal: 'api/isGenerateRenewal',
        generateRenewal: 'api/generateRenewal',
        confirmRenewal: 'api/confirmRenewal',
        migratedData: 'api/migratedData',
        getNextBinderDetails: 'api/getNextBinderDetails',
        getVesselClassIdFromName: 'api/getVesselClassIdFromName',
        getVesselTypeIdFromNameandClassId: 'api/getVesselTypeIdFromNameandClassId',
        getMooringNameAndTypeSeperated: 'api/getMooringNameAndTypeSeperated',
        setPremiumPolicyType: "api/setPremiumPolicyType",
        getTPOType: "api/getTPOType",
        getVesselClassByCountry: "api/getVesselClassByCountry",
        getVesselTypeByCountry: "api/getVesselTypeByCountry",
        getLaidUpAshoreModalData: "api/getLaidUpAshoreModalData",
        saveLaidUpMidTerm: "api/saveLaidUpMidTerm",
        getCancelPolicyModelData: "api/getCancelPolicyModelData",
        autoBinderByCountry: "api/autoBinderByCountry",
        //BinderRatingBands
        getBinderRatingBinder: "api/getBinderRatingBands",
        addUpdateBinderRatingBands: "api/addUpdateBinderRatingBands",
        deleteRatingBinder: "api/deleteBinderRatingBands",
        bulkInsertBinderRatingBands: "api/bulkInsertBinderRatingBands",
        insertRatingBandsFromDetail: "api/insertRatingBandsFromDetail",
        //Binder
        getBinder: "api/getBinderDetails",
        deleteBinder: "api/deleteBinder",
        addUpdateBinder: "api/addUpdateBinder",
        getInsuranceCompnay: "api/getInsuranceCompnay",
        getSecurityGroup: "api/getSecurityGroup",
        getBrokerList: "api/getOrganazationData",
        getLastBinderCode: "api/getlastbindercode",
        getselectedAuthorizeGroup: "api/getselectedAuthorizeGroup",
        getBrokerData: "api/getBrokerData",
        getBinderDataById: "api/getBinderDataById",

        //Authirised Class
        addUpdateAuthorizeClass: "api/addUpdateAuthorizeClass",
        getAuthorizeClass: "api/getAuthorizeClass",
        deleteAuthorizedClass: "api/deleteAuthorizeClass",

        //Bounder For Risk Locator
        getBounder: "api/getBounderRisk",
        getRiskLocator: "api/getRiskLocator",
        addBouder: "api/addUpdateBounderRisk",
        addRiskLocator: "api/addRiskLocator",
        deleteBounder: "api/deleteBounderRisk",

        //Transaction
        getTransaction: "api/getTransaction",
        getNextBinderList: "api/getNextBinderList",

        getSettlement: "api/getSettlement",

        getSubBinders: "api/getSubBinders",

        allEmail: "api/getInbox",
        getAttachment: "api/getAllAttachmentUnreadMail",
        addRemoveFlag: "api/addRemoveFlag",
        deleteMessage: "api/deleteMessage",
        getPolicyAutoComplete: "api/getPolicyAutoComplete",
        getEmailTemplate: "api/getEmailTemplate",
        getEmailBodyData: "api/getEmailBodyData",
        sendMailBulk: "api/sendMailBulk",
        sendReply: "api/sendReply",
        forwordMail: "api/forwordMail",
        sendReplyAll: "api/sendReplyAll",
        addUpdateTags: "api/addUpdateTags",

        //Claim
        addUpdateClaim: "api/addUpdateClaim",
        getClaimList: "api/getClaimList"
    }


    static requestKeys = {
        login: {
            username: 'username',
            password: 'password'
        }
    }

    static responseKeys = {
        data: 'data',
        settings: 'settings',
        statusCode: 'code'
    }

};

//============Images================//



//============Route Constants========//




//============Common Configurations========//

export class CommonConfig {

    // static appVerison = "V1.2.1.2020.07.21.11.45.00";
    static appVerison = "V1.2.3.2020.08.18.14.05.00";
    static appRegion = "Production";
    static phpapi = 'https://evolutionpaymentprod.azurewebsites.net';
    static loggedInUserId = function () {
        var loggedInUserData = ''
        if(localStorage.getItem('loggedInUserData')){
            loggedInUserData = JSON.parse(localStorage.getItem('loggedInUserData'));
        // if (Cookies.get('loggedInUserData')) {
        //     loggedInUserData = JSON.parse(Cookies.get('loggedInUserData'));
            var EntityId = loggedInUserData.EntityId;
            if (loggedInUserData.PersonId === "" || loggedInUserData.PersonId === undefined || loggedInUserData.PersonId === null) {
                EntityId = loggedInUserData.OrganizationId;
            } else {
                EntityId = loggedInUserData.PersonId;
            }

            if (CommonConfig.isEmpty(EntityId)) {
                return '999';
            } else {
                return EntityId;
            }
        } else {
            return '999';
        }
    }

    static getSysConfigByKey = function (key) {
        try {
            api.post('api/getSystemConfigByKey', { key: key }).then(res => {
                if (res.success) {
                    // console.log('res.data[0].SysValue',res.data[0].SysValue)
                    // console.log(' bumber res.data[0].SysValue',Number(res.data[0].SysValue))
                    localStorage.setItem(key,  res.data[0].SysValue)
                    return  res.data[0].SysValue
                } else {
                    console.log("something error");
                    return false
                }
            }).catch(err => {
                console.log("error", err);
                return false
            });
        } catch (error) {
            console.log("erroreeee", error);
            return false
        }
    }

    static loggedInUserData = function () {
        if (localStorage.getItem('loggedInUserData')) {
            return JSON.parse(localStorage.getItem('loggedInUserData'));
        }
        // if (Cookies.get('loggedInUserData')) {
        //     return JSON.parse(Cookies.get('loggedInUserData'));
        // }
        else {
            return ""
        }
    }


    static formatPhone = (CountryCode, AreaCode, PhoneNumber) => {
        let phone;
        if (CountryCode && CountryCode !== '' && CountryCode !== undefined && CountryCode !== null) {
            if (AreaCode && AreaCode !== '' && AreaCode !== undefined && AreaCode !== null) {
                phone = CountryCode + ' ' + AreaCode + ' ' + this.formatPhoneNumber(PhoneNumber);
            } else {
                phone = CountryCode + ' ' + this.formatPhoneNumber(PhoneNumber);
            }
        } else {
            if (AreaCode && AreaCode !== '' && AreaCode !== undefined && AreaCode !== null) {
                phone = AreaCode + ' ' + this.formatPhoneNumber(PhoneNumber);
            } else {
                phone = this.formatPhoneNumber(PhoneNumber);
            }
        }
        return phone;
    }

    static formatPhoneNumber(str) {
        //Filter only numbers from the input
        // let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        // let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        // if (match) {
        //   return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        // };

        if (str.length > 6) {
            let formatted = str.substring(0, 2) + ' ' + str.substring(2, 5) + ' ' + str.substring(5, 6) + ' ' + str.substring(6, 10);
            return formatted;
        } else {
            return str;
        }

        // return null
    };

    static formatPhoneNumberWithAreaCode(str) {
        //Filter only numbers from the input
        // let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        // let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        // if (match) {
        //   return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        // };

        if (str.length > 6) {
            let formatted = str.substring(0, 2) + ' ' + str.substring(2, 5) + ' ' + str.substring(5, 6) + ' ' + str.substring(6, 10);
            return formatted;
        } else {
            return str;
        }
    };

    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    };

    static randomStr = function (len, arr) {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }

    static isEmpty = function (value) {
        if (value === undefined || value === null || value === '') {
            return true;
        } else {
            if (typeof value === 'string') {
                return value.trim() == "";
            } else {
                return false;
            }
        }
    }

    static ThirdPartyStringMapOnCountry = function (country) {
        if (country == 'Spain') {
            return 'THIRDPARTYLIABILITYSPAIN';
        } else {
            return 'THIRDPARTYLIABILITY';
        }
    }

    static ShowHideLimitAdditionalFields = function (vessleClass) {
        if (vessleClass == 'RIB' || vessleClass == 'Sports Boat' || vessleClass == 'Neumática/Semirígida' || vessleClass == 'Jet Ski') {
            let condition = {
                displayWater: 1,
                displayRacing: 0,
                displayCrew: 0
            }
            return condition;
        } else if (vessleClass == 'Racing Yacht' || vessleClass == 'Dinghy') {
            let condition = {
                displayWater: 0,
                displayRacing: 1,
                displayCrew: 0
            }
            return condition;
        } else if (vessleClass == 'Commercial Vessels') {
            let condition = {
                displayWater: 0,
                displayRacing: 0,
                displayCrew: 1
            }
            return condition;
        } else {
            let condition = {
                displayWater: 0,
                displayRacing: 0,
                displayCrew: 0
            }
            return condition;
        }
    }

    static GetFixedCrusingRange = function (boatUse, whereReg) {
        var CrusingRange = '';
        if (boatUse == 'Med Waters') {
            if (whereReg == 'Ireland') {
                CrusingRange = 'Inland & Coastal Waters of Ireland';
            } else if (whereReg == 'Spain') {
                CrusingRange = 'Coastal water of Spain Including Gibraltar (Excluding North Africa)';
            } else if (whereReg == 'United Kingdom') {
                CrusingRange = 'Mediterranean waters not east of 10 degrees east (Excluding North Africa)';
            }
        } else if (boatUse == 'Inland & Coastal UK') {
            if (whereReg == 'Ireland') {
                CrusingRange = 'Inland & Coastal Waters of Ireland';
            } else if (whereReg == 'Spain') {
                CrusingRange = 'Coastal water of Spain Including Gibraltar (Excluding North Africa)';
            } else if (whereReg == 'United Kingdom') {
                CrusingRange = 'Inland & Coastal Waters of UK';
            }
        }
        return CrusingRange;
    }

    static getFixedVesselTypeFromVesselClassName = function (vessleClassName) {
        var VesselType = '';
        if (vessleClassName == 'Motor Cruisers') {
            VesselType = 'Motorboat Coastal Waters';
        } else if (vessleClassName == 'Yacht') {
            VesselType = 'Cruising Yacht';
        } else if (vessleClassName == 'Rib') {
            VesselType = 'Rib';
        } else if (vessleClassName == 'Sports Boat') {
            VesselType = 'Sportsboat';
        } else if (vessleClassName == 'MarineTradeVessel') {
            VesselType = 'MarineTradeVessel';
        } else if (vessleClassName == 'MultiVessel') {
            VesselType = 'MultiVessel';
        } else if (vessleClassName == 'Engineering Vessel') {
            VesselType = 'Engineering Vessel';
        }
        return VesselType;
    }

    static ShowHideActionOnPolicyStatus = function (Status) {
        var condition = '';
        if (Status == 'Cancel' || Status == 'Lapsed') {
            condition = 0;
        } else {
            condition = 1;
        }
        return condition;
    }

    static handleError = function (error, methodName, userMessageKey, severity) {

    }

    static dateFormat = {
        dateTime: 'DD/MM/YYYY HH:mm',
        dateOnly: 'DD/MM/YYYY',
        YearMonthDay: 'YYYY-MM-DD',
        forDatePicker: 'DD-MM-YYYY',
        yearOnly: 'YYYY',
        dbDateTime: 'YYYY-MM-DD HH:mm:ss',
        timeOnly: 'HH:mm'
    }

    static dataTableConfig = {
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 20, 30, 50],
        columnToggleIcon: <i className="fa fa-bars"></i>
    }

    static RegExp = {

        percentage: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/,
        percentageWithNegative: /^-?[0-9]{0,2}(\.[0-9]{1,2})?$|^-?(100)(\.[0]{1,2})?$/,
        number: /^[0-9]+$/,
        // nameWithoutSpace: /^[a-zA-Z]+[a-zA-Z-']*$/,
        // nameWithSpace: /^[a-zA-Z]+[a-zA-Z-\s']*$/,
        nameWithoutSpace: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+[a-zA-Z-\u00C0-\u024F\u1E00-\u1EFF']*$/,
        nameWithSpace: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+[a-zA-Z-\u00C0-\u024F\u1E00-\u1EFF\s']*$/,
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, // /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,}$/,
        decimal: /^[0-9]+(\.[0-9][0-9])?$/,
        decimalWithOne: /^(?:\d*\.\d{1,2}|\d+)$/,
        decimalWithNegative: /^-?(?:\d*\.\d{1,2}|\d+)$/,  /*   /^-?[0-9]+(\.[0-9][0-9])?$/  */
        // alphaNumeric: /^[a-zA-Z0-9]+[a-zA-Z0-9-\s']*$/,
        alphaNumeric: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9]+[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9-\s']*$/,
        year: /^[0-9]{4}$/,
        allowAllWithSpace: /^(\w.*)$/,
        latlng: /^-?(\d*\.)?\d+$/,
    }

    static thousandSeparator = {
        format: toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    static googleMapApiDetails = {
        apiKey: "AIzaSyDDPVM-dsW-fpv1knIQw8ZFbAMq85Qpqtg",
        apiURL: "https://maps.google.com/maps/api/js?v=3.exp&key=AIzaSyDDPVM-dsW-fpv1knIQw8ZFbAMq85Qpqtg&sensor=false",
        googleMapApiURL: "https://maps.googleapis.com/maps/api/js?v=6.exp&libraries=geometry,drawing,places&key=AIzaSyDDPVM-dsW-fpv1knIQw8ZFbAMq85Qpqtg"
    }
}