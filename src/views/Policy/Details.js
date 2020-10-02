import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Col, Row, Container, Form, Input, Card, CardBody, Button } from 'reactstrap';

const typeMaster = [
    { label: 'Type1', value: 'Type1' },
    { label: 'Type2', value: 'Type2' },
    { label: 'Type3', value: 'Type3' },
];

class Details extends Component {
    constructor(props) {
        super(props);

        this.state = {
            policyType: '',
            policyTypearr: [],
            policyTypeError: false,

            selectBinder: '',
            selectBinderarr: [],
            selectBinderError: false,
            binderDetails: 'Details',

            subBinder: '',
            subBinderError: false,

            insuranceComapny: '',
            insuranceComapnyError: false,

            department: '',
            departmentarr: [],
            departmentError: false,

            underWriteStatus: '',
            underWriteStatusarr: [],
            underWriteStatusError: false,

            awaitingDocuments: '',
            awaitingDocumentsarr: [],
            awaitingDocumentsError: false,

            premiumCredits: '',
            premiumCreditsarr: [],
            premiumCreditsError: false,

            boatMoored: '',
            boatMooredError: false,

            premiumRate: '',
            premiumRateError: false,

            premium: '',
            premiumError: false,

            inceptionDate: '',
            inceptionDateError: false,

            renewDate: '',
            renewDateError: false,

            customeDiscount: '',
            customeDiscountError: false,

            customeLoading: '',
            customeLoadingError: false,

            underWriter: '',
            underWriterError: false,

            Gross: '',
            GrossError: false,

            Totalgross: '',
            TotalgrossError: false,

            Agency: '',
            AgencyError: false,

            agencyTotal: '',
            agencyTotalError: false,

            Balance: '',
            BalanceError: false,

            balanceTotal: '',
            balanceTotalError: false,

            governmentLavys: '',
            governmentLavysError: false,

            governmentLavysDesc: '',
            governmentLavysDescError: false,

            adminFees: '',
            adminFeesError: false,

            adminFeesDesc: '',
            adminFeesDescError: false,

            policyID: '',
            policyIDError: false,

            inceptionDateRelay: '',
            inceptionDateRelayError: false,

            Premium2011: '',
            Premium2011Error: false,
        };

    }

    componentDidMount() {

    }

    selectType(value, type) {
        if (type === 'policyType') {
            if (value === '' || value === null) {
                this.setState({ policyTypeError: true, policyType: value });
                this.show('policyType', true);
            } else {
                this.setState({ policyTypeError: false, policyType: value });
                this.show('policyType', false);
            }
        }

        if (type === 'selectBinder') {
            if (value === '' || value === null) {
                this.setState({ selectBinderError: true, selectBinder: value });
                this.show('selectBinder', true);
            } else {
                this.setState({ selectBinderError: false, selectBinder: value });
                this.show('selectBinder', false);
            }
        }

        if (type === 'department') {
            if (value === '' || value === null) {
                this.setState({ departmentError: true, department: value });
                this.show('department', true);
            } else {
                this.setState({ departmentError: false, department: value });
                this.show('department', false);
            }
        }

        if (type === 'underWriteStatus') {
            if (value === '' || value === null) {
                this.setState({ underWriteStatusError: true, underWriteStatus: value });
                this.show('underWriteStatus', true);
            } else {
                this.setState({ underWriteStatusError: false, underWriteStatus: value });
                this.show('underWriteStatus', false);
            }
        }

        if (type === 'awaitingDocuments') {
            if (value === '' || value === null) {
                this.setState({ awaitingDocumentsError: true, awaitingDocuments: value });
                this.show('awaitingDocuments', true);
            } else {
                this.setState({ awaitingDocumentsError: false, awaitingDocuments: value });
                this.show('awaitingDocuments', false);
            }
        }

        if (type === 'premiumRate') {
            if (value === '' || value === null) {
                this.setState({ premiumRateError: true, premiumRate: value });
                this.show('premiumRate', true);
            } else {
                this.setState({ premiumRateError: false, premiumRate: value });
                this.show('premiumRate', false);
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'subBinder') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ subBinderError: true });
                this.show("subBinder", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let subBinder = e.target.value;
                if (!invSpace.test(subBinder)) {
                    this.setState({ subBinderError: true });
                    this.show("subBinder", true);
                } else {
                    this.setState({ subBinderError: false, subBinder: e.target.value });
                    this.show("subBinder", false);
                }
            }
        }

        if (e.target.name === 'insuranceComapny') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ insuranceComapnyError: true });
                this.show("insuranceComapny", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let insuranceComapny = e.target.value;
                if (!invSpace.test(insuranceComapny)) {
                    this.setState({ insuranceComapnyError: true });
                    this.show("insuranceComapny", true);
                } else {
                    this.setState({ insuranceComapnyError: false, insuranceComapny: e.target.value });
                    this.show("insuranceComapny", false);
                }
            }
        }

        if (e.target.name === 'boatMoored') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ boatMooredError: true });
                this.show("boatMoored", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let boatMoored = e.target.value;
                if (!invSpace.test(boatMoored)) {
                    this.setState({ boatMooredError: true });
                    this.show("boatMoored", true);
                } else {
                    this.setState({ boatMooredError: false, boatMoored: e.target.value });
                    this.show("boatMoored", false);
                }
            }
        }

        if (e.target.name === 'premiumRate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ premiumRateError: true });
                this.show("premiumRate", true);
            } else {
                let premiumRateRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _premiumRate = e.target.value;
                if (e.target.value > 100 || !premiumRateRegEx.test(_premiumRate)) {
                    this.setState({ premiumRateError: true });
                    this.show("premiumRate", true);
                } else {
                    this.setState({ premiumRateError: false, premiumRate: e.target.value });
                    this.show("premiumRate", false);
                }
            }
        }

        if (e.target.name === 'premium') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ premiumError: true });
                this.show("premium", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let premium = e.target.value;
                if (!invSpace.test(premium)) {
                    this.setState({ premiumError: true });
                    this.show("premium", true);
                } else {
                    this.setState({ premiumError: false, premium: e.target.value });
                    this.show("premium", false);
                }
            }
        }

        if (e.target.name === 'inceptionDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ inceptionDateError: true });
                this.show("inceptionDate", true);
            } else {
                this.setState({ inceptionDateError: false, inceptionDate: e.target.value });
                this.show("inceptionDate", false);
            }
        }

        if (e.target.name === 'renewDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ renewDateError: true });
                this.show("renewDate", true);
            } else {
                this.setState({ renewDateError: false, renewDate: e.target.value });
                this.show("renewDate", false);
            }
        }

        if (e.target.name === 'customeDiscount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ customeDiscountError: true });
                this.show("customeDiscount", true);
            } else {
                let customeDiscountRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let customeDiscount = e.target.value;
                if (e.target.value > 100 || !customeDiscountRegEx.test(customeDiscount)) {
                    this.setState({ customeDiscountError: true });
                    this.show("customeDiscount", true);
                } else {
                    this.setState({ customeDiscountError: false, customeDiscount: e.target.value });
                    this.show("customeDiscount", false);
                }
            }
        }

        if (e.target.name === 'customeLoading') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ customeLoadingError: true });
                this.show("customeLoading", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let customeLoading = e.target.value;
                if (!invSpace.test(customeLoading)) {
                    this.setState({ customeLoadingError: true });
                    this.show("customeLoading", true);
                } else {
                    this.setState({ customeLoadingError: false, customeLoading: e.target.value });
                    this.show("customeLoading", false);
                }
            }
        }

        if (e.target.name === 'underWriter') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ underWriterError: true });
                this.show("underWriter", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let underWriter = e.target.value;
                if (!invSpace.test(underWriter)) {
                    this.setState({ underWriterError: true });
                    this.show("underWriter", true);
                } else {
                    this.setState({ underWriterError: false, underWriter: e.target.value });
                    this.show("underWriter", false);
                }
            }
        }

        if (e.target.name === 'Gross') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ GrossError: true });
                this.show("Gross", true);
            } else {
                let grossRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _gross = e.target.value;
                if (e.target.value > 100 || !grossRegEx.test(_gross)) {
                    this.setState({ GrossError: true });
                    this.show("Gross", true);
                }
                else {
                    this.setState({ GrossError: false, Gross: e.target.value });
                    this.show("Gross", false);
                }
            }
        }

        if (e.target.name === 'Totalgross') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ TotalgrossError: true });
                this.show("Totalgross", true);
            } else {
                let grossTotalRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _grossTotal = e.target.value;
                if (e.target.value > 100 || !grossTotalRegEx.test(_grossTotal)) {
                    this.setState({ TotalgrossError: true });
                    this.show("Totalgross", true);
                } else {
                    this.setState({ TotalgrossError: false, Totalgross: e.target.value });
                    this.show("Totalgross", false);
                }
            }
        }

        if (e.target.name === 'Agency') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ AgencyError: true });
                this.show("Agency", true);
            } else {
                let agencyRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _agency = e.target.value;
                if (e.target.value > 100 || !agencyRegEx.test(_agency)) {
                    this.setState({ AgencyError: true });
                    this.show("Agency", true);
                }
                else {
                    this.setState({ AgencyError: false, Agency: e.target.value });
                    this.show("Agency", false);
                }
            }
        }

        if (e.target.name === 'agencyTotal') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ agencyTotalError: true });
                this.show("agencyTotal", true);
            } else {
                let agencyTotalRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _agencyTotal = e.target.value;
                if (e.target.value > 100 || !agencyTotalRegEx.test(_agencyTotal)) {
                    this.setState({ agencyTotalError: true });
                    this.show("agencyTotal", true);
                } else {
                    this.setState({ agencyTotalError: false, agencyTotal: e.target.value });
                    this.show("agencyTotal", false);
                }
            }
        }

        if (e.target.name === 'Balance') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ BalanceError: true });
                this.show("Balance", true);
            } else {
                let balanceRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _balance = e.target.value;
                if (e.target.value > 100 || !balanceRegEx.test(_balance)) {
                    this.setState({ BalanceError: true });
                    this.show("Balance", true);
                }
                else {
                    this.setState({ BalanceError: false, Balance: e.target.value });
                    this.show("Balance", false);
                }
            }
        }

        if (e.target.name === 'balanceTotal') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ balanceTotalError: true });
                this.show("balanceTotal", true);
            } else {
                let balanceTotalRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _balanceTotal = e.target.value;
                if (e.target.value > 100 || !balanceTotalRegEx.test(_balanceTotal)) {
                    this.setState({ balanceTotalError: true });
                    this.show("balanceTotal", true);
                } else {
                    this.setState({ balanceTotalError: false, balanceTotal: e.target.value });
                    this.show("balanceTotal", false);
                }
            }
        }

        if (e.target.name === 'governmentLavys') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ governmentLavysError: true });
                this.show("governmentLavys", true);
            } else {
                let governmentLavysRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let _governmentLavys = e.target.value;
                if (e.target.value > 100 || !governmentLavysRegEx.test(_governmentLavys)) {
                    this.setState({ governmentLavysError: true });
                    this.show("governmentLavys", true);
                } else {
                    this.setState({ governmentLavysError: false, governmentLavys: e.target.value });
                    this.show("governmentLavys", false);
                }
            }
        }

        if (e.target.name === 'governmentLavysDesc') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ governmentLavysDescError: true });
                this.show("governmentLavysDesc", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let governmentLavysDesc = e.target.value;
                if (!invSpace.test(governmentLavysDesc)) {
                    this.setState({ governmentLavysDescError: true });
                    this.show("governmentLavysDesc", true);
                } else {
                    this.setState({ governmentLavysDescError: false, governmentLavysDesc: e.target.value });
                    this.show("governmentLavysDesc", false);
                }
            }
        }

        if (e.target.name === 'adminFees') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ adminFeesError: true });
                this.show("adminFees", true);
            } else {
                let adminFeesRegEx = /^[0-9]+$/;
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let adminFees = e.target.value;
                if (!adminFeesRegEx.test(adminFees) || invSpace.test(adminFees)) {
                    this.setState({ adminFeesError: true });
                    this.show("adminFees", true);
                } else {
                    this.setState({ adminFeesError: false, adminFees: e.target.value });
                    this.show("adminFees", false);
                }
            }
        }

        if (e.target.name === 'adminFeesDesc') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ adminFeesDescError: true });
                this.show("adminFeesDesc", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let adminFeesDesc = e.target.value;
                if (!invSpace.test(adminFeesDesc)) {
                    this.setState({ adminFeesDescError: true });
                    this.show("adminFeesDesc", true);
                } else {
                    this.setState({ adminFeesDescError: false, adminFeesDesc: e.target.value });
                    this.show("adminFeesDesc", false);
                }
            }
        }

        if (e.target.name === 'policyID') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyIDError: true });
                this.show("policyID", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let policyID = e.target.value;
                if (!invSpace.test(policyID)) {
                    this.setState({ policyIDError: true });
                    this.show("policyID", true);
                } else {
                    this.setState({ policyIDError: false, policyID: e.target.value });
                    this.show("policyID", false);
                }
            }
        }

        if (e.target.name === 'inceptionDateRelay') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ inceptionDateRelayError: true });
                this.show("inceptionDateRelay", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let inceptionDateRelay = e.target.value;
                if (!invSpace.test(inceptionDateRelay)) {
                    this.setState({ inceptionDateRelayError: true });
                    this.show("inceptionDateRelay", true);
                } else {
                    this.setState({ inceptionDateRelayError: false, inceptionDateRelay: e.target.value });
                    this.show("inceptionDateRelay", false);
                }
            }
        }

        if (e.target.name === 'Premium2011') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ Premium2011Error: true });
                this.show("Premium2011", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let Premium2011 = e.target.value;
                if (!invSpace.test(Premium2011)) {
                    this.setState({ Premium2011Error: true });
                    this.show("Premium2011", true);
                } else {
                    this.setState({ Premium2011Error: false, Premium2011: e.target.value });
                    this.show("Premium2011", false);
                }
            }
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Form encType="multipart/form-data" autoComplete="of">
                        <Row>
                            <Col md="12">
                                <div className="input-box">
                                    <h5>New Policy:</h5>
                                </div>

                                <Col>
                                    <Row>
                                        <Col md="6">
                                            <span>Policy</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Type</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectType(e.target.value, 'policyType')} value={this.state.selectedPolicyType}>
                                                                    <option value=''>Select Type</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select Policy type</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Binder</label>
                                                            </Col>
                                                            <Col md="7">
                                                                <Input type="select" name="selectBinder" id="selectBinder" onChange={(e) => this.selectType(e.target.value, 'selectBinder')} value={this.state.selectedBinder}>
                                                                    <option value=''>Select Binder</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select Binder</em>
                                                            </Col>
                                                            <Col md = "2" style = {{ marginTop:"5px" }}>
                                                                <a href="javascript:void(0)" onClick={() => this.toggle('contactcode')}>{this.state.binderDetails}</a>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Sub Binder</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="subBinder" id="subBinder" onChange={(e) => this.handleChange(e)} value={this.state.subBinder}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter sub binder</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Insurance Comapny</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="insuranceComapny" id="insuranceComapny" onChange={(e) => this.handleChange(e)} value={this.state.insuranceComapny}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Insurance Comapny</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Department</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="select" name="department" id="department" onChange={(e) => this.selectType(e.target.value, 'department')} value={this.state.department}>
                                                                    <option value=''>Select Department</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select department</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>UnderWrite Status</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="select" name="underWriteStatus" id="underWriteStatus" onChange={(e) => this.selectType(e.target.value, 'underWriteStatus')} value={this.state.underWriteStatus}>
                                                                    <option value=''>Select UnderWrite Status</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select UnderWrite Status</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Awaiting Documents</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="select" name="awaitingDocuments" id="awaitingDocuments" onChange={(e) => this.selectType(e.target.value, 'awaitingDocuments')} value={this.state.awaitingDocuments}>
                                                                    <option value=''>Select Awaiting Documents</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select Awaiting Documents</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Premium Credits</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="select" name="premiumCredits" id="premiumCredits" onChange={(e) => this.selectType(e.target.value, 'premiumCredits')} value={this.state.premiumCredits}>
                                                                    <option value=''>Select Premium Credits</option>
                                                                    {typeMaster.map((type, i) => {
                                                                        return (<option value={type.label}>{type.value}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please select Premium Credits</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                            <span>Overview</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Where is your boat Moored?</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="boatMoored" id="boatMoored" onChange={(e) => this.handleChange(e)} value={this.state.boatMoored}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Boat Moored</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                            <span>Premium</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="2">
                                                                <label>Rate</label>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>%</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="premiumRate" id="premiumRate" onChange={(e) => this.handleChange(e)} value={this.state.premiumRate}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Premium Rate</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3">
                                                                <label>Premium</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="premium" id="premium" onChange={(e) => this.handleChange(e)} value={this.state.premium}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Premium</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>


                                        <Col md="6">
                                            <span>Dates</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>Inception Date</label>
                                                            </Col>

                                                            <Col md="9">
                                                                <Input type="date" name="inceptionDate" id="inceptionDate" onChange={(e) => this.handleChange(e)} value={this.state.inceptionDate}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Inception Date</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>Renew Date</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="date" name="renewDate" id="renewDate" onChange={(e) => this.handleChange(e)} value={this.state.renewDate}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Renew Date</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                            <span>Adjustments</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>Custome Discount</label>
                                                            </Col>

                                                            <Col md="9">
                                                                <Input type="text" name="customeDiscount" id="customeDiscount" onChange={(e) => this.handleChange(e)} value={this.state.customeDiscount}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Custome Discount</em>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>Custome Loading</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="customeLoading" id="customeLoading" onChange={(e) => this.handleChange(e)} value={this.state.customeLoading}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Custome Loading</em>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>UnderWriter</label>
                                                            </Col>
                                                            <Col md="9">
                                                                <Input type="text" name="underWriter" id="underWriter" onChange={(e) => this.handleChange(e)} value={this.state.underWriter}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter UnderWriter</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                            <span>Commission</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="2">
                                                                <label>Gross</label>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>%</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="Gross" id="Gross" onChange={(e) => this.handleChange(e)} value={this.state.Gross}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Gross Commission</em>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>Total</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="Totalgross" id="Totalgross" onChange={(e) => this.handleChange(e)} value={this.state.Totalgross}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Gross Total</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="2">
                                                                <label>Agency</label>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>%</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="Agency" id="Agency" onChange={(e) => this.handleChange(e)} value={this.state.Agency}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Agency Commission</em>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>Total</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="agencyTotal" id="agencyTotal" onChange={(e) => this.handleChange(e)} value={this.state.agencyTotal}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Agency Total</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="2">
                                                                <label>Balance</label>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>%</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="Balance" id="Balance" onChange={(e) => this.handleChange(e)} value={this.state.Balance}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Balance</em>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>Total</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="balanceTotal" id="balanceTotal" onChange={(e) => this.handleChange(e)} value={this.state.balanceTotal}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter valid Balance Total</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                            <span>Fees and Levys</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="2" style={{ padding: 0 }}>
                                                                <label>Government Lavys</label>
                                                            </Col>
                                                            <Col md="1">
                                                                <label>%</label>
                                                            </Col>
                                                            <Col md="5">
                                                                <Input type="text" name="governmentLavys" id="governmentLavys" onChange={(e) => this.handleChange(e)} value={this.state.governmentLavys}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Government Lavys</em>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="governmentLavysDesc" id="governmentLavysDesc" onChange={(e) => this.handleChange(e)} value={this.state.governmentLavysDesc}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Government Lavys Description</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="3" style={{ padding: 0 }}>
                                                                <label>Admin Fees</label>
                                                            </Col>
                                                            <Col md="5">
                                                                <Input type="text" name="adminFees" id="adminFees" onChange={(e) => this.handleChange(e)} value={this.state.adminFees}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Admin Fees</em>
                                                            </Col>
                                                            <Col md="4">
                                                                <Input type="text" name="adminFeesDesc" id="adminFeesDesc" onChange={(e) => this.handleChange(e)} value={this.state.adminFeesDesc}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Admin Fees Description</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>Relay</span>
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row>
                                                            <Col md="1">
                                                                <label>Policy ID</label>
                                                            </Col>
                                                            <Col md="3">
                                                                <Input type="text" name="policyID" id="policyID" onChange={(e) => this.handleChange(e)} value={this.state.policyID}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Policy Id</em>
                                                            </Col>

                                                            <Col md="1" style={{ padding: 0 }}>
                                                                <label>Inception Date</label>
                                                            </Col>
                                                            <Col md="3">
                                                                <Input type="date" name="inceptionDateRelay" id="inceptionDateRelay" onChange={(e) => this.handleChange(e)} value={this.state.inceptionDateRelay}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter Inception Date</em>
                                                            </Col>

                                                            <Col md="1" style={{ padding: 0 }}>
                                                                <label>2011 Premium</label>
                                                            </Col>
                                                            <Col md="3">
                                                                <Input type="text" name="Premium2011" id="Premium2011" onChange={(e) => this.handleChange(e)} value={this.state.Premium2011}>
                                                                </Input>
                                                                <em className="error invalid-feedback" >Please enter 2011 Premium</em>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col md="4">
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Total Sum Insured</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Rate</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0 %</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Starting Premium</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Adjustments</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0</label>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md="4">
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Adjustments Premium</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0.00</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>No Claim Bonus</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Local Tax</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0.00</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Admin Fees</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0</label>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md="4">
                                            <Card>
                                                <CardBody>
                                                    <div className="input-box">
                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>+ Total Due</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0.00</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Excess</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>N/A</label>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: 10 }}>
                                                            <Col md="8">
                                                                <label>Commission</label>
                                                            </Col>
                                                            <Col md="4">
                                                                <label>0.00</label>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>*/}
                                </Col> 
                                <Col md="8">
                                    <div style={{ margin: "15px" }}>
                                        <Row>
                                            <Button color="primary" onClick={() => this.goBack()}>
                                                <i style={{ marginRight: "10px" }} className="fa fa-angle-left"></i>
                                                Back to policies list
                                            </Button>

                                            <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.goBack()}>
                                                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                                                Cancel Policy
                                            </Button>

                                            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveContact()}>
                                                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                                Save
                                            </Button>

                                            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveContact()}>
                                                {/* <i style={{ marginRight: "10px" }} className="fa fa-check"></i> */}
                                                Bind Policy
                                            </Button>

                                            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.saveContact()}>
                                                {/* <i style={{ marginRight: "10px" }} className="fa fa-check"></i> */}
                                                Delete
                                            </Button>
                                        </Row>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        );
    }

}
export default Details;  