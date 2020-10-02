import React, { Component } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { PickList } from 'primereact/picklist';
import { Modal, ModalBody, ModalFooter, ModalHeader, Container, Card, CardBody, Form, Col, Row, Input, Table, Button, CardHeader } from 'reactstrap';
import APIConstant from '../../../../utils/constants';
import { CommonConfig } from '../../../../utils/constants';
import api from '../../../../utils/apiClient';
import moment from 'moment';
import { ScrollPanel } from 'primereact/scrollpanel';
import { AutoComplete } from 'primereact/autocomplete';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';


class BinderInfo extends Component {

    constructor() {
        super();
        const orginial = this.setState;
        // this.state = JSON.parse(localStorage.getItem('state'))
        //     ? JSON.parse(localStorage.getItem('state'))
        //     : 
        this.state = {
            UMRN: "",
            iseditmode: false,
            isRated: "nonrated",
            UMRNError: true,
            binderName: "",
            binderNameError: true,
            BinderID: "",
            BinderCode: "",
            startdate: "",
            enddate: "",
            startdateError: true,
            runoffstartdate: "",
            runoffenddate: "",
            nextbindermaster: [],
            currencymaster: [],
            countrymaster: [],
            brokermaster: [],
            insurancecompanymaster: [],
            insurancecompany: "",
            insuranceComapnyError: true,
            currency: "",
            currencyError: true,
            country: "",
            countryError: true,
            broker: "",
            brokerError: false,
            nextbinder: "",
            nextbinderError: false,
            MTSumInsuredHull: 0,
            MTSInsuredLiab: 0,
            GPIncomeLimit: 0,
            BIClaims: 0,
            BIPrem: 0,
            GrossCommission: 0,
            MTSumInsuredHullError: false,
            MTSInsuredLiabError: false,
            GPIncomeLimitError: false,
            BIClaimsError: false,
            BIPremError: false,
            GrossCommissionError: false,
            BinderUserGroupSource: [],
            BinderUserGroupSourceSelected: [],
            ClaimUserGroupSource: [],
            ClaimUserGroupSourceSelected: []
        };

        this.setState = function () {
            let arguments0 = arguments[0];
            let arguments1 = () => (arguments[1], localStorage.setItem('state', JSON.stringify(this.state)));
            orginial.bind(this)(arguments0, arguments1);
        };


    }

    componentWillUnmount() {
        localStorage.removeItem('state')
    }

    GetSelectedAuthorizeGroup(BinderId) {
        try {
            let data = { BinderId: BinderId };
            api.post(APIConstant.path.getselectedAuthorizeGroup, data).then(res => {
                if (res.success) {
                    debugger;
                    let BinderUserGroupSourceSelected = []
                    let ClaimUserGroupSourceSelected = []

                    var BinderUserGroupSource = [...this.state.allBinderUserGroupSource]; // make a separate copy of the array
                    var ClaimUserGroupSource = [...this.state.allClaimUserGroupSource];

                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].AuthorisationType == 0) {
                            let index = BinderUserGroupSource.findIndex(x => x.SecurityGroupName === res.data[i].SecurityGroupName);
                            console.log("BinderUserGroupSource", index);
                            // BinderUserGroupSource.splice(index, 1);
                            if (index !== -1) {
                                BinderUserGroupSource.splice(index, 1);
                            }
                            BinderUserGroupSourceSelected.push(res.data[i])
                        }
                        else {
                            let index1 = ClaimUserGroupSource.findIndex(y => y.SecurityGroupName === res.data[i].SecurityGroupName);
                            console.log("ClaimUserGroupSource", index1);
                            if (index1 !== -1) {
                                ClaimUserGroupSource.splice(index1, 1);
                            }
                            ClaimUserGroupSourceSelected.push(res.data[i])
                        }
                    }
                    this.setState({
                        BinderUserGroupSourceSelected: BinderUserGroupSourceSelected,
                        ClaimUserGroupSourceSelected: ClaimUserGroupSourceSelected,
                        BinderUserGroupSource: BinderUserGroupSource,
                        ClaimUserGroupSource: ClaimUserGroupSource
                    })
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getLastBinderCode() {
        try {
            let data = {};
            api.post(APIConstant.path.getLastBinderCode, data).then(res => {
                if (res.success) {
                    this.setState({
                        BinderCode: Number(res.data[0]['BinderCode']) + 1
                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getBrokerList() {

        try {
            let data = { ContactType: "Broker" };
            api.post(APIConstant.path.getBrokerData, data).then(res => {
                if (res.success) {
                    this.setState({
                        brokermaster: res.data.map((obj) => {
                            return {
                                label: obj.OrganizationName,
                                value: obj.OrganizationId,
                            }
                        })
                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getSecurityGroup() {
        try {
            var data = {}
            api.post(APIConstant.path.getSecurityGroup, data).then(res => {
                if (res.success) {
                    this.setState({
                        allBinderUserGroupSource: res.data,
                        allClaimUserGroupSource: res.data,
                        BinderUserGroupSource: res.data,
                        ClaimUserGroupSource: res.data,
                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getInsuranceCompnay() {
        try {
            var data = {}
            api.post(APIConstant.path.getInsuranceCompnay, data).then(res => {
                var formattedData = [];
                if (res.success) {
                    this.setState({
                        insurancecompanymaster: res.data.map((obj) => {
                            return {
                                label: obj.InsuranceCompanyName,
                                value: obj.InsuranceCompanyId,
                            }
                        })
                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getNextBinderList() {
        var data = {
            "InsuranceCompanyId": this.state.insurancecompany,
            "LiveEndDate": moment(this.state.enddate).format('YYYY-MM-DD'),
            "BinderId": this.state.BinderID
        }
        try {
            api.post(APIConstant.path.getNextBinderList, data).then(res => {
                var formattedData = [];
                if (res.success) {
                    console.log("Next Binder Data....", res.data);
                    this.setState({
                        nextbindermaster: res.data.map((obj) => {
                            return {
                                label: obj.UMRN + '-' + obj.BinderCode,
                                value: obj.BinderId,
                            }
                        })
                    });
                } else {
                }
            }).catch(err => {
                console.log(err)
            });
        } catch (err) {
            console.log(err)
        }
    }

    getCurrency() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                var formattedData = [];
                if (res.success) {
                    console.log("Currency....", res.data);
                    this.setState({
                        currencymaster: res.data.map((obj) => {
                            return {
                                label: obj.CurrncyCode,
                                value: obj.CurrncyCode,
                            }
                        })
                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getCountry() {
        try {
            const data = {
                stringmaptype: 'POLICYCOUNTRY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("COUNTRY", res.data);
                    this.setState({
                        countrymaster: res.data.map((obj) => {
                            return {
                                label: obj.StringMapName,
                                value: obj.Description,
                            }
                        })
                    });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getBinderData(binderId) {
        try {
            let data = { "binderId": binderId }
            api.post(APIConstant.path.getBinderDataById, data).then(res => {
                console.log(res);
                debugger;
                var data = res.data[0];
                this.setState({
                    BinderID: data.BinderId,
                    UMRN: data.UMRN,
                    binderName: data.BinderName,
                    BinderCode: data.BinderCode,
                    startdate: moment(data.LiveStartDate).format("YYYY-MM-DD"),
                    enddate: moment(data.LiveEndDate).format(CommonConfig.dateFormat.forDatePicker),
                    runoffstartdate: moment(data.RunoffStartDate).format(CommonConfig.dateFormat.forDatePicker),
                    runoffenddate: moment(data.RunoffEndDate).format(CommonConfig.dateFormat.forDatePicker),
                    insurancecompany: data.InsuranceCompanyId,
                    currency: data.Currency,
                    country: data.Country,
                    BounderRiskLocatorId: data.BounderRiskLocatorId,
                    broker: data.Broker,
                    nextbinder: data.NextBinder,
                    MTSumInsuredHull: data.MaxTotalSumInsuredHull,
                    MTSInsuredLiab: data.MaxTotalSumInsuredLiability,
                    GPIncomeLimit: data.GrossPremiumIncomeLimit,
                    BIClaims: data.BorderauxIntervalsClaimDay,
                    BIPrem: data.BorderauxIntervalsPremDay,
                    GrossCommission: data.GrossCommission,
                    isRated: data.IsRated.data[0] == 0 ? "nonrated" : "rated",
                    UMRNError: false,
                    startdateError: false,
                    insuranceComapnyError: false,
                    currencyError: false,
                    countryError: false,
                    binderNameError: false,
                    IsBrb: data.IsBrb
                })
                this.GetSelectedAuthorizeGroup(data.BinderId)
                this.getNextBinderList()

            }).catch(err => {
            });
        } catch (err) {
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'UMRN') {
            debugger;
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ UMRNError: true });
                this.show("UMRN", true, "UMRNError", "Please Enter UMRN");
            } else {
                if (!CommonConfig.RegExp.alphaNumeric.test(e.target.value)) {
                    this.setState({ UMRNError: true });
                    this.show("UMRN", true, "UMRNError", "Please Enter Valid UMRN. Special characters not allowed");
                } else {
                    this.setState({ UMRNError: false, UMRN: e.target.value });
                    this.show("UMRN", false, "UMRNError", "");
                }
            }
        }

        if (e.target.name === 'binderName') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ binderNameError: true });
                this.show("binderName", true, "binderNameError", "Please Enter Binder Name");
            } else {
                if (!CommonConfig.RegExp.alphaNumeric.test(e.target.value)) {
                    this.setState({ binderNameError: true });
                    this.show("binderName", true, "binderNameError", "Please Enter Valid Binder Name. Special characters not allowed");
                } else {
                    this.setState({ binderNameError: false, binderName: e.target.value });
                    this.show("binderName", false, "binderNameError", "");
                }
            }
        }


        if (e.target.name === 'startdate') {
            if (e.target.value != "") {

                this.setState({ startdateError: false });
                this.show("startdate", false, "startdateError", "");
                var enddate = moment(e.target.value, "YYYY-MM-DD").add('years', 1).subtract("days", 1)
                this.setState({
                    enddate: enddate.format(CommonConfig.dateFormat.forDatePicker),
                    runoffstartdate: moment(enddate).add("days", 1).format(CommonConfig.dateFormat.forDatePicker),
                    runoffenddate: moment(enddate).add("year", 1).format(CommonConfig.dateFormat.forDatePicker)
                });
            } else {
                this.setState({ startdateError: true });
                this.show("startdate", true, "startdateError", "Please Enter Start Date");
            }
        }

        let decimalRegExp = CommonConfig.RegExp.decimalWithOne;

        if (e.target.name === 'MTSumInsuredHull') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ MTSumInsuredHullError: false, MTSumInsuredHull: 0 });
                this.show("MTSumInsuredHull", false, "MTSumInsuredHullError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ MTSumInsuredHullError: true });
                    this.show("MTSumInsuredHull", true, "MTSumInsuredHullError", "Please Enter Valid Max Total Sum Insured Hull");
                } else {
                    this.setState({ MTSumInsuredHullError: false, MTSumInsuredHull: e.target.value });
                    this.show("MTSumInsuredHull", false, "MTSumInsuredHullError", "");
                }
            }
        }

        if (e.target.name === 'MTSInsuredLiab') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ MTSInsuredLiabError: false, MTSInsuredLiab: 0 });
                this.show("MTSInsuredLiab", false, "MTSInsuredLiabError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ MTSInsuredLiabError: true });
                    this.show("MTSInsuredLiab", true, "MTSInsuredLiabError", "Please Enter Valid Max Total Sum Insured Liab");
                } else {
                    this.setState({ MTSInsuredLiabError: false, MTSInsuredLiab: e.target.value });
                    this.show("MTSInsuredLiab", false, "MTSInsuredLiabError", "");
                }
            }
        }

        if (e.target.name === 'GPIncomeLimit') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ GPIncomeLimitError: false, GPIncomeLimit: 0 });
                this.show("GPIncomeLimit", false, "GPIncomeLimitError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ GPIncomeLimitError: true });
                    this.show("GPIncomeLimit", true, "GPIncomeLimitError", "Please Enter Valid Gross Premium Income Limit");
                } else {
                    this.setState({ GPIncomeLimitError: false, GPIncomeLimit: e.target.value });
                    this.show("GPIncomeLimit", false, "GPIncomeLimitError", "");
                }
            }
        }

        if (e.target.name === 'BIClaims') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ BIClaimsError: false, BIClaims: 0 });
                this.show("BIClaims", false, "BIClaimsError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ BIClaimsError: true });
                    this.show("BIClaims", true, "BIClaimsError", "Please Enter Valid Borderaux Intervals Claims");
                } else {
                    this.setState({ BIClaimsError: false, BIClaims: e.target.value });
                    this.show("BIClaims", false, "BIClaimsError", "");
                }
            }
        }

        if (e.target.name === 'BIPrem') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ BIPremError: false, BIPrem: 0 });
                this.show("BIPrem", false, "BIPremError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ BIPremError: true });
                    this.show("BIPrem", true, "BIPremError", "Please Enter Valid Borderaux Intervals Prem");
                } else {
                    this.setState({ BIPremError: false, BIPrem: e.target.value });
                    this.show("BIPrem", false, "BIPremError", "");
                }
            }
        }

        if (e.target.name === 'GrossCommission') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ GrossCommissionError: false, GrossCommission: 0 });
                this.show("GrossCommission", false, "GrossCommissionError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ GrossCommissionError: true });
                    this.show("GrossCommission", true, "GrossCommissionError", "Please Enter Valid Gross Commission");
                } else {
                    this.setState({ GrossCommissionError: false, GrossCommission: e.target.value });
                    this.show("GrossCommission", false, "GrossCommissionError", "");
                }
            }
        }
    }

    selectType = (value, type) => {

        if (type == "insurancecompany") {
            if (value === '' || value === undefined || value === null) {
                this.setState({ insuranceComapnyError: true, insurancecompany: value });
                this.show("insurancecompany", true);
            } else {
                this.setState({ insuranceComapnyError: false, insurancecompany: value });
                this.show("insurancecompany", false);
                this.getNextBinderList();
            }
        }

        else if (type == "broker") {
            this.setState({ broker: value })
        }
        else if (type == "currency") {
            // this.setState({ currency: value })
            if (value === '' || value === undefined || value === null) {
                this.setState({ currencyError: true, currency: value });
                this.show("currency", true);
            } else {
                this.setState({ currencyError: false, currency: value });
                this.show("currency", false);
            }
        }
        else if (type == "country") {
            // this.setState({ country: value })
            if (value === '' || value === undefined || value === null) {
                this.setState({ countryError: true, country: value });
                this.show("country", true);
            } else {
                this.setState({ countryError: false, country: value });
                this.show("country", false);
            }
        }
        else if (type == "nextbinder") {
            this.setState({ nextbinder: value })
        }
    }

    // show(field, condition) {
    //     if (condition) {
    //         document.getElementById(field).className = "form-control is-invalid";
    //     } else {
    //         document.getElementById(field).className = "form-control";
    //     }
    // }

    show(field, condition, errorField, message) {
        debugger;
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

    componentDidMount() {
        debugger;
        this.getCurrency()
        this.getCountry()
        this.getInsuranceCompnay()
        this.getSecurityGroup()
        this.getBrokerList()

        var splitData = this.props.location.pathname.split("/");
        // if (splitData[3] !== undefined) {
        if (!CommonConfig.isEmpty(splitData[3])) {
            this.getBinderData(splitData[3])
        } else {
            this.getLastBinderCode()
        }

        // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
        //     this.getBinderData(this.props.match.params.Id)
        // } else {
        //     this.getLastBinderCode()
        // }
    }

    goBack() {
        this.props.history.push('/Master/Binder');
    }
    addUpdateBinderInfo() {
        debugger
        if (this.state.UMRNError) {
            toast.error('Please Enter Valid UMRN');
        } else if (this.state.binderNameError) {
            toast.error('Please Enter Valid Binder Name');
        } else if (this.state.startdateError) {
            toast.error('Please Enter Valid Start Date');
        } else if (this.state.insuranceComapnyError) {
            toast.error('Please Select Insurance Company');
        } else if (this.state.countryError) {
            toast.error('Please Select Country');
        } else if (this.state.currencyError) {
            toast.error('Please Select Currency');
        } else if (this.state.isRatedError) {
            toast.error('Please Select IsRated');
        } else if (this.state.MTSumInsuredHullError) {
            toast.error('Please Enter Valid Max Total Sum Insured Hull');
        } else if (this.state.MTSInsuredLiabError) {
            toast.error('Please Select Valid Max Total Sum Insured Liab');
        } else if (this.state.GPIncomeLimitError) {
            toast.error('Please Select Valid Gross Premium Income Limit');
        }
        else if (this.state.BIClaimsError) {
            toast.error('Please Enter Valid Borderaux Intervals Claims(days)');
        } else if (this.state.BIPremError) {
            toast.error('Please Select Valid Borderaux Intervals Prem.(days)');
        } else if (this.state.GrossCommissionError) {
            toast.error('Please Select Valid Gross Commission (%)');
        } else {
            let data = {
                "BinderId": this.state.BinderID,
                "BinderCode": this.state.BinderCode,
                "UMRN": this.state.UMRN,
                "BinderName": this.state.binderName,
                "LiveStartDate": this.state.startdate,
                "LiveEndDate": moment(this.state.enddate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                "RunoffStartDate": moment(this.state.runoffstartdate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                "RunoffEndDate": moment(this.state.runoffenddate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                "InsuranceCompanyId": this.state.insurancecompany,
                "Currency": this.state.currency,
                "CountryId": this.state.country,
                "BounderRiskLocatorId": this.state.BounderRiskLocatorId ? this.state.BounderRiskLocatorId : "",
                "Broker": this.state.broker,
                "MaxTotalSumInsuredHull": parseFloat(this.state.MTSumInsuredHull),
                "MaxTotalSumInsuredLiability": parseFloat(this.state.MTSInsuredLiab),
                "GrossPremiumIncomeLimit": parseFloat(this.state.GPIncomeLimit),
                "BorderauxIntervalsClaimDay": parseInt(this.state.BIClaims),
                "BorderauxIntervalsPremDay": parseInt(this.state.BIPrem),
                "GrossCommission": parseFloat(this.state.GrossCommission),
                "NextBinder": this.state.nextbinder,
                "UserId": CommonConfig.loggedInUserId(),
                "BinderUserGroupSourceSelected": this.state.BinderUserGroupSourceSelected,
                "ClaimUserGroupSourceSelected": this.state.ClaimUserGroupSourceSelected,
                "IsRated": this.state.isRated == "nonrated" ? 0 : 1
            }
            api.post(APIConstant.path.addUpdateBinder, data).then(res => {
                if (res.success) {
                    console.log("===========Binder Created")
                    this.props.history.push('/Master/Binder');
                    console.log(res)
                }
            }).catch(err => {
                console.log(err)
            })

            this.setState({
                BinderAuthorisedClassId: "",
                vesselclass: "",
                minimumpremium: ""
            })
        }
    }

    onRadioBtnClick(radioType, radioSelected) {
        if (radioType === 'isRated') {
            if (radioSelected === '' || radioSelected === undefined || radioSelected === null) {
                // this.setState({ isRatedError: true, isRated: radioSelected });
                // this.show("isRated", true);
            } else {
                this.setState({ isRatedError: false, isRated: radioSelected });
                // this.show("isRated", false);
                // this.getNextBinderList();
            }

            // this.setState({ isRated: radioSelected });
        }
    }

    onChangeSource(event, type) {
        if (type == "binder") {
            this.setState({
                BinderUserGroupSource: event.source,
                BinderUserGroupSourceSelected: event.target
            });
        }
        else {
            this.setState({
                ClaimUserGroupSource: event.source,
                ClaimUserGroupSourceSelected: event.target
            });
        }
    }

    binderTemplate(binder) {
        return (
            <div className="p-clearfix">
                <div style={{ fontSize: '14px', float: 'right', margin: '15px 5px 0 0' }}>{binder.SecurityGroupName}</div>
            </div>
        );
    }

    claimTemplate(claim) {
        return (
            <div className="p-clearfix">
                <div style={{ fontSize: '14px', float: 'right', margin: '15px 5px 0 0' }}>{claim.SecurityGroupName}</div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Container>
                    <Form encType="multipart/form-data" autoComplete="of">
                        <Row>
                            <Col md="12">
                                <Col>
                                    <Row>
                                        <Col md="12">
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>BinderCode</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <label>{this.state.BinderCode}</label>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>UMRN *</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="UMRN" id="UMRN" maxLength="50" onChange={(e) => this.handleChange(e)} value={this.state.UMRN}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter UMRN</em> */}
                                                        <em id="UMRNError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Binder Name *</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="binderName" id="binderName" maxLength="50" onChange={(e) => this.handleChange(e)} value={this.state.binderName}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter binder name</em> */}
                                                        <em id="binderNameError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Live Period *</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <label>Start Date</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <Input type="date" name="startdate" id="startdate" placeholder="Start Date" onBlur={(e) => this.handleChange(e)}
                                                            onChange={(e) => this.handleChange(e)} value={this.state.startdate} min={moment().format('YYYY-MM-DD')}
                                                            max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                                        />
                                                        {/* <em className="error invalid-feedback" >Please select StartDate</em> */}
                                                        <em id="startdateError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="3">

                                                    </Col>
                                                    <Col md="3">
                                                        <label>End Date</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <label>{this.state.enddate}</label>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Runoff Period</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <label>{this.state.runoffstartdate} to {this.state.runoffenddate}</label>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Insurance Company *</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="select" name="insurancecompany" id="insurancecompany" onChange={(e) => this.selectType(e.target.value, 'insurancecompany')} value={this.state.insurancecompany}>
                                                            <option value=''>Select Insurance Company</option>
                                                            {this.state.insurancecompanymaster.map((type, i) => { return (<option value={type.value}>{type.label}</option>) })}
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please select Insurance Company</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Country *</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input disabled={this.state.IsBrb == 1} type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                                                            <option value=''>Select Country</option>
                                                            {this.state.countrymaster.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please select Country</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Currency *</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="select" name="currency" id="currency" onChange={(e) => this.selectType(e.target.value, 'currency')} value={this.state.currency}>
                                                            <option value=''>Select Currency</option>
                                                            {this.state.currencymaster.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please select Currency</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Broker</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="select" name="broker" id="broker" onChange={(e) => this.selectType(e.target.value, 'broker')} value={this.state.broker}>
                                                            <option value=''>Select Broker</option>
                                                            {this.state.brokermaster.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please select Broker</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Authorised to Bind</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <div>
                                                            <div className="content-section implementation">
                                                                <PickList source={this.state.BinderUserGroupSource} target={this.state.BinderUserGroupSourceSelected} showTargetControls={false} itemTemplate={this.binderTemplate}
                                                                    sourceHeader="User Groups Available" showSourceControls={false} targetHeader="User Groups Selected" responsive={true}
                                                                    onChange={(e) => this.onChangeSource(e, "binder")}></PickList>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Authorised to Claim</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <div>
                                                            <div className="content-section implementation">
                                                                <PickList showSourceControls={false} showTargetControls={false} source={this.state.ClaimUserGroupSource} target={this.state.ClaimUserGroupSourceSelected} itemTemplate={this.claimTemplate}
                                                                    sourceHeader="User Groups Available" targetHeader="User Groups Selected" responsive={true}
                                                                    onChange={(e) => this.onChangeSource(e, "claim")}></PickList>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Max Total Sum Insured Hull</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="MTSumInsuredHull" id="MTSumInsuredHull" onChange={(e) => this.handleChange(e)} value={this.state.MTSumInsuredHull}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Max Total Sum Insured Hull</em> */}
                                                        <em id="MTSumInsuredHullError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Max Total Sum Insured Liab</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="MTSInsuredLiab" id="MTSInsuredLiab" onChange={(e) => this.handleChange(e)} value={this.state.MTSInsuredLiab}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Max Total Sum Insured Liab</em> */}
                                                        <em id="MTSInsuredLiabError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Gross Premium Income Limit</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="GPIncomeLimit" id="GPIncomeLimit" onChange={(e) => this.handleChange(e)} value={this.state.GPIncomeLimit}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Gross Premium Income Limit</em> */}
                                                        <em id="GPIncomeLimitError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Borderaux Intervals Claims(days)</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="BIClaims" id="BIClaims" onChange={(e) => this.handleChange(e)} value={this.state.BIClaims}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Borderaux Intervals Claims</em> */}
                                                        <em id="BIClaimsError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Borderaux Intervals Prem.(days)</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="BIPrem" id="BIPrem" onChange={(e) => this.handleChange(e)} value={this.state.BIPrem}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Borderaux Intervals Prem</em> */}
                                                        <em id="BIPremError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Gross Commission (%)</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="text" name="GrossCommission" id="GrossCommission" onChange={(e) => this.handleChange(e)} value={this.state.GrossCommission}>
                                                        </Input>
                                                        {/* <em className="error invalid-feedback" >Please enter Gross Commission</em> */}
                                                        <em id="GrossCommissionError" className="error invalid-feedback"></em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Next Binder</label>
                                                    </Col>
                                                    <Col md="9">
                                                        <Input type="select" name="nextbinder" id="nextbinder" onChange={(e) => this.selectType(e.target.value, 'nextbinder')} value={this.state.nextbinder}>
                                                            <option value=''>Select Next Binder</option>
                                                            {this.state.nextbindermaster.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please select Next Binder</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="input-box">
                                                <Row>
                                                    <Col md="3">
                                                        <label>Is Rated? *</label>
                                                    </Col>
                                                    <Col md="6">
                                                        <div className="rc-inline">
                                                            <label>
                                                                <Input type="radio" name="Rated" checked={(this.state.isRated === 'rated') ? true : false}
                                                                    value={this.state.isRated} onChange={() => this.onRadioBtnClick('isRated', 'rated')}
                                                                />
                                                                Rated
                                                                </label>

                                                            <label >
                                                                <Input type="radio" name="NoRated" checked={(this.state.isRated === 'nonrated') ? true : false}
                                                                    value={this.state.isRated} onChange={() => this.onRadioBtnClick('isRated', 'nonrated')}
                                                                />
                                                                NonRated
                                                                </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>

                                        {this.state.iseditmode == true ? <Col md="5">
                                            <Card>
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Summary</th>
                                                            <th>No</th>
                                                            <th>Total Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Samppa Nori</td>
                                                            <td>1</td>
                                                            <td>100000</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Estavan Lykos</td>
                                                            <td>2</td>
                                                            <td>200000</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Card>
                                        </Col> : null}
                                    </Row>
                                </Col>
                            </Col>
                            <Col md="7">
                                <div style={{ margin: "15px" }}>
                                    <Row>
                                        <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.addUpdateBinderInfo()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                            Submit
                                            </Button>

                                        <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.goBack()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                                            Back
                                            </Button>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withTranslation()(BinderInfo);