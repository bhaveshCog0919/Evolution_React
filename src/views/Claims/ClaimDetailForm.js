import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import api from '../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../utils/constants';
import { Card, CardBody, Col, Table, Row, Input, Button as BTN, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form, UncontrolledTooltip } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import ClaimStage from './ClaimStage/ClaimStage';
import ClaimEstimation from './ClaimEstimation/ClaimEstimation';

class ClaimDetailForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 1,
            paymentCurrencyType: '',
            paymentCurrencyTypeArr: [],
            claimType: '',
            claimTypeArr: [],
            surveyerData: [],
            SurveyerName: '',
            SurveyerNameArr: [],
            dateofloss: '',
            dateoflossError: '',
            dateofreported: '',
            dateofreportedError: '',
            claimdescription: '',
            claimdescriptionError: '',
            dateappointed: '',
            dateofreportreceived: '',
            dateappointedError: '',
            dateofreportreceivedError: '',
            isacompany: '',
            thirdpartyname: '',
            thirdpartynameError: '',
            tppolicyname: '',
            tppolicynameError: '',
            tpinsurername: '',
            tpinsurernameError: '',
            legelDetailError: '',
            legelDetail: '',
            datesanctioncompleted: '',
            datesanctioncompletedError: '',
            reservefee: '',
            reserveindemnity: '',
            reservefeeError: '',
            reserveindemnityError: ''
        };
    }

    submitSurveyData() {
        try {
            this.state.surveyerData.push({ "surveyerName": this.state.SurveyerName, "DateAppointed": this.state.dateappointed, "DateOfReportReceived": this.state.dateofreportreceived })
            var data = {
                delete: false,
                surveyerData: { "surveyerName": this.state.SurveyerName, "DateAppointed": this.state.dateappointed, "DateOfReportReceived": this.state.dateofreportreceived }
            }
        } catch (error) {
            console.log("error...", error);
        }
    }

    removeSurDataTemp(index) {
        try {
            this.state.surveyerData.splice(index, 1)
            var data = {
                delete: true,
                surveyerData: this.state.surveyerData[index],
            }
        } catch (error) {
            console.log("error...",)
        }
    }

    async componentDidMount() {
        this.getDropDownValues('CURRENCYTYPE', 'paymentCurrencyTypeArr', 'SortOrder');
        this.getDropDownValues('CLAIMTYPE', 'claimTypeArr', 'SortOrder');
        this.getDropDownValues('SURVEYER_NAME', 'SurveyerNameArr', 'SortOrder');
    }

    getDropDownValues(stringMapType, setStateName, orderby) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderby
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

    selectType(value, type) {
        if (type === 'paymentCurrencyType') {
            this.setState({ paymentCurrencyType: value });
        }
        if (type === 'claimType') {
            this.setState({ claimType: value });
        }
        if (type === 'surveyername') {
            this.setState({ SurveyerName: value });
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

    handleChangeClaimDetail = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'isacompany') {
            this.setState({ isacompany: e.target.checked });
        }

        if (e.target.name === 'legelDetail') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ legelDetailError: true });
                this.show("legelDetail", true);
            } else {
                this.setState({ legelDetailError: false, legelDetail: e.target.value });
                this.show("legelDetail", false);
            }
        }

        if (e.target.name === 'dateofreported') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ dateofreportedError: true });
                this.show("dateofreported", true);
            } else {
                this.setState({ dateofreportedError: false, dateofreported: e.target.value });
                this.show("dateofreported", false);
            }
        }

        if (e.target.name === 'dateofloss') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ dateoflossError: true });
                this.show("dateofloss", true);
            } else {
                this.setState({ dateoflossError: false, dateofloss: e.target.value });
                this.show("dateofloss", false);
            }
        }

        if (e.target.name === 'claimdescription') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ claimdescriptionError: true });
                this.show("claimdescription", true);
            } else {
                this.setState({ claimdescriptionError: false, claimdescription: e.target.value });
                this.show("claimdescription", false);
            }
        }

        if (e.target.name === 'dateofreportreceived') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ dateofreportreceivedError: true });
                this.show("dateofreportreceived", true);
            } else {
                this.setState({ dateofreportreceivedError: false, dateofreportreceived: e.target.value });
                this.show("dateofreportreceived", false);
            }
        }

        if (e.target.name === 'dateappointed') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ dateappointedError: true });
                this.show("dateappointed", true);
            } else {
                this.setState({ dateappointedError: false, dateappointed: e.target.value });
                this.show("dateappointed", false);
            }
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className="tabview-demo">
                <div className="">
                    <TabView>
                        <TabPanel header="Claim Manager">
                            <div className="input-box">
                                <Row>
                                    <Col md="2">
                                        <p><label>Location Of Risk:</label> <i className=""></i>Ireland</p>
                                    </Col>
                                    <Col md="2">
                                        <p><label>Excess:</label> <i className=""></i>400</p>
                                    </Col>
                                    <Col md="2">
                                        <p><label>Risk Currency:</label> <i className=""></i>EUR</p>
                                    </Col>
                                    <Col md="3">
                                        <label>Payment Currency</label>
                                        <Input type="select" name="paymentCurrencyType" id="paymentCurrencyType"
                                            value={this.state.paymentCurrencyType} onChange={(e) => this.selectType(e.target.value, 'paymentCurrencyType')} >
                                            <option value=''>Select Payment Currency Type</option>
                                            {this.state.paymentCurrencyTypeArr.map((type, i) => {
                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <Row>
                                    <Col md="3">
                                        <label>Date Of Loss</label>
                                        <Input type="date" name="dateofloss" id="dateofloss"
                                            placeholder="dd-mm-yyyy"
                                            style={{ width: '70%', display: "inline-block" }}
                                            //onBlur={(e) => this.getRateableParam()}
                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                            value={this.state.dateofloss}
                                        />
                                    </Col>
                                    <Col md="3">
                                        <label>Date Of Reported</label>
                                        <Input type="date" name="dateofreported" id="dateofreported"
                                            placeholder="dd-mm-yyyy"
                                            style={{ width: '70%', display: "inline-block" }}
                                            //onBlur={(e) => this.getRateableParam()}
                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                            value={this.state.dateofreported}
                                        />
                                    </Col>
                                    <Col md="3">
                                        <label>Claim Type</label>
                                        <Input type="select" name="claimType" id="claimType"
                                            value={this.state.claimType} onChange={(e) => this.selectType(e.target.value, 'claimType')} >
                                            <option value=''>Select Claim Type</option>
                                            {this.state.claimTypeArr.map((type, i) => {
                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <Row>
                                    <Col md="5">
                                        <label>Claim Description</label>
                                        <Input type="textarea" name="claimdescription" id="claimdescription"
                                            //onBlur={(e) => this.getRateableParam()}
                                            placeholder="Claim Description"
                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                            value={this.state.claimdescription}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <label>Surveyer Detail</label>
                            </div>
                            <Card>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3" style={{ marginLeft: '.5em' }}>
                                            <label>Surveyer Name</label>
                                            <Input type="select" name="surveyername" id="surveyername"
                                                value={this.state.SurveyerName} onChange={(e) => this.selectType(e.target.value, 'surveyername')} >
                                                <option value=''>Select Surveyer Name</option>
                                                {this.state.SurveyerNameArr.map((type, i) => {
                                                    return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                                                })}
                                            </Input>
                                        </Col>
                                        <Col md="3">
                                            <label>Date Appointed</label>
                                            <Input type="date" name="dateappointed" id="dateappointed"
                                                placeholder="dd-mm-yyyy"
                                                style={{ width: '70%', display: "inline-block" }}
                                                //onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangeClaimDetail(e)}
                                                value={this.state.dateappointed}
                                            />
                                        </Col>
                                        <Col md="3">
                                            <label>Date Report Received</label>
                                            <Input type="date" name="dateofreportreceived" id="dateofreportreceived"
                                                placeholder="dd-mm-yyyy"
                                                style={{ width: '70%', display: "inline-block" }}
                                                //onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangeClaimDetail(e)}
                                                value={this.state.dateofreportreceived}
                                            />
                                        </Col>
                                        <Col md="2">
                                            <label style={{ marginLeft: '.5em' }} ></label>
                                            <BTN color="success" onClick={() => this.submitSurveyData()}>Add a Surveyer Data</BTN>
                                        </Col>
                                    </Row>
                                    {this.state.surveyerData.length > 0 ? (<Row>
                                        <Col md="7" style={{ marginLeft: '.5em' }}>
                                            <span>{this.state.surveyerData.length} Surveyer Data</span>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th className="center">Surveyer Name</th>
                                                        <th className="center">Date Appointed</th>
                                                        <th className="center">Date Report Received</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.surveyerData.map((surData, i) => {
                                                        return (<tr>
                                                            <td className="center">{surData.surveyerName}</td>
                                                            <td className="center">{surData.DateAppointed}</td>
                                                            <td className="center">{surData.DateOfReportReceived}</td>
                                                            <td className="center"><BTN color="light" onClick={() => this.removeSurDataTemp(i)} className={'mr-1'}><span className="fa fa-trash-o"></span></BTN></td>
                                                        </tr>)
                                                    })
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>) : (null)}
                                </div>
                            </Card>
                            <div className="input-box">
                                <Row>
                                    <Col md="5">
                                        <label>Date Sanction Search Completed</label>
                                        <Input type="date" name="datesanctioncompleted" id="datesanctioncompleted"
                                            placeholder="dd-mm-yyyy"
                                            style={{ width: '70%', display: "inline-block" }}
                                            //onBlur={(e) => this.getRateableParam()}
                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                            value={this.state.datesanctioncompleted}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <label style={{ marginLeft: '.5em' }}>
                                    Reserve Calculator
                                </label>
                            </div>
                            <div className="input-box">
                                <Row>
                                    <Col md="79" style={{ marginLeft: '.5em' }}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th className="center">                 </th>
                                                    <th className="center">Reserve Indemnity</th>
                                                    <th className="center">Reserve Fee</th>
                                                    <th className="center">Total Reserve</th>
                                                    <th className="center"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="center">Initial</td>
                                                    <td className="center"><Col>
                                                        <Input type="text" name="reserveindemnity" id="reserveindemnity"
                                                            placeholder="Reserve Indemnity"
                                                            //onBlur={(e) => this.getRateableParam()}
                                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                                            value={this.state.reserveindemnity}
                                                        />
                                                    </Col></td>
                                                    <td className="center"><Col>
                                                        <Input type="text" name="reservefee" id="reservefee"
                                                            placeholder="Reserve Indemnity"
                                                            //onBlur={(e) => this.getRateableParam()}
                                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                                            value={this.state.reservefee}
                                                        />
                                                    </Col></td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center">XXXX</td>
                                                </tr>
                                                <tr>
                                                    <td className="center">Incurred So Far</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center"></td>
                                                </tr>
                                                <tr>
                                                    <td className="center">Balance</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center">XXXX</td>
                                                    <td className="center"></td>
                                                </tr>
                                                <tr>
                                                    <td className="center">Reserve Limitor</td>
                                                    <td className="center"><Col>
                                                        <Input type="text" name="reservefee" id="reservefee"
                                                            placeholder="Reserve Limitor"
                                                            //onBlur={(e) => this.getRateableParam()}
                                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                                            value={this.state.reservefee}
                                                        />
                                                    </Col></td>
                                                    <td className="center"><Col>
                                                        <Input type="text" name="reservefee" id="reservefee"
                                                            placeholder="Reserve Limitor"
                                                            //onBlur={(e) => this.getRateableParam()}
                                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                                            value={this.state.reservefee}
                                                        />
                                                    </Col></td>
                                                    <td className="center"></td>
                                                    <td className="center"></td>
                                                </tr>
                                                <tr>
                                                    <td className="center">Recovery Claim#</td>
                                                    <td className="center"><Col>
                                                        <Input type="text" name="reservefee" id="reservefee"
                                                            placeholder="Recovery Claim"
                                                            //onBlur={(e) => this.getRateableParam()}
                                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                                            value={this.state.reservefee}
                                                        />
                                                    </Col></td>
                                                    <td className="center"></td>
                                                    <td className="center">Reserve Limitor<Input type="text" name="reservefee" id="reservefee"
                                                        placeholder="Recovery Limitor"
                                                        //onBlur={(e) => this.getRateableParam()}
                                                        onChange={(e) => this.handleChangeClaimDetail(e)}
                                                        value={this.state.reservefee}
                                                    /></td>
                                                    <td className="center">Reserve Limitor<Input type="text" name="reservefee" id="reservefee"
                                                        placeholder="Recovery Limitor"
                                                        //onBlur={(e) => this.getRateableParam()}
                                                        onChange={(e) => this.handleChangeClaimDetail(e)}
                                                        value={this.state.reservefee}
                                                    /></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <label>Third Party Detail</label>
                            </div>
                            <Card>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3" style={{ marginLeft: '.5em' }}>
                                            <label>Third Party Name</label>
                                            <Input type="text" name="thirdpartyname" id="thirdpartyname"
                                                placeholder="Third Party Name"
                                                //onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangeClaimDetail(e)}
                                                value={this.state.thirdpartyname}
                                            />
                                        </Col>
                                        <Col md="2" style={{ alignSelf: "center" }}>
                                            <h6>Is A Company<Input type="checkbox" name="isacompany" id="isacompany" value={this.state.isacompany} style={{ marginLeft: "3px" }} checked={this.state.isacompany == true ? "checked" : ""} onChange={(e) => this.handleChangeClaimDetail(e)} />
                                            </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="3" style={{ marginLeft: '.5em' }}>
                                            <label>TP Insurer</label>
                                            <Input type="text" name="tpinsurername" id="tpinsurername"
                                                placeholder="TP Insurer"
                                                //onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangeClaimDetail(e)}
                                                value={this.state.tpinsurername}
                                            />
                                        </Col>
                                        <Col md="3">
                                            <label>TP Policy#</label>
                                            <Input type="text" name="tppolicyname" id="tppolicyname"
                                                placeholder="TP Policy"
                                                //onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangeClaimDetail(e)}
                                                value={this.state.tppolicyname}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                            <div className="input-box">
                                <Row>
                                    <Col md="5">
                                        <label>Legel Detail</label>
                                        <Input type="textarea" name="legelDetail" id="legelDetail"
                                            placeholder="Legel Detail"
                                            //onBlur={(e) => this.getRateableParam()}
                                            onChange={(e) => this.handleChangeClaimDetail(e)}
                                            value={this.state.legelDetail}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </TabPanel>
                        <TabPanel header="Claim Stages">
                            <div style={{ marginTop: "20px" }}>
                                <ClaimStage {...this.props} />
                            </div>
                        </TabPanel>
                        <TabPanel header="Estimation">
                            <div style={{ marginTop: "20px" }}>
                                <ClaimEstimation {...this.props} />
                            </div>
                        </TabPanel>
                        <TabPanel header="Policy Detail">

                        </TabPanel>
                        <TabPanel header="Endorsement">

                        </TabPanel>
                        <TabPanel header="Add On Coverage">

                        </TabPanel>
                        <TabPanel header="Timeline">

                        </TabPanel>
                    </TabView>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ClaimDetailForm);
