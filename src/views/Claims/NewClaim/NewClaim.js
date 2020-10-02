import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import api from '../../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../../utils/constants';
import { Card, CardBody, Col, Table, Row, Input, Button as BTN, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form, UncontrolledTooltip } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { Panel } from 'primereact/panel';

class NewClaim extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: 'Damage',
            theftdiscovered:'',
            policynumber: '',
            vatRegNo:'',
            regVat: "",
            inchargeofvessel:'',
            minimizelossdamage:'',
            crewcarried: "",
            cutdowndetail:'',
            enginecutdown:'',
            vesselType: '',
            ageofvessel:'',
            purposeofvesseluse:'',
            nameofvessel:'',
            witnessname: '',
            witnessaddress: '',
            WitnessData: [],
            PassengerData: [],
            passengername: '',
            passengeraddress: '',
            vesselTypeArr: [],
            vesseracing: '',
            vesselcondition: '',
            vesselconditionArr: [],
            theftData: [],
            itemstolen: '',
            manufacturer: '',
            ageofitem: '',
            replacementcost: '',
            amountclaimed: '',
            dateofaccident: '',
            timeofaccident: '',
            placeofoccuence: '',
            bindercode: '',
            binderyear: '',
            causeofaccident: '',
            locationofinspected: '',
            repairyarddetail: '',
            claimAmount: '',
            mobilenumber:'',
            address:'',
            fullname:'',
            storageareaentry:''
        };
    }

    async componentDidMount() {

    }

    submitData() {
        var inputData = {
            "ClaimData": {
            "PolicyId": "10502036-f2ff-4ff6-a43b-1a2336bfa5c4",
            "ClaimType": this.state.type,
            "DateOfLoss": this.state.dateofaccident,
            "TimeOfLoss": this.state.timeofaccident,
            "PlaceOfLoss": this.state.placeofoccuence,
            "BinderCode": 'TETS3',
            "BinderYear": 2020,
            "DateReported": this.state.dateofoccurrence,
            "DateSanctionSearchCompleted": "2020-09-25",
            "DateOpened": "2020-09-25",
            "DateCoverageConfirmed": "2020-09-25",
            "DateClaimAmountAgreed": "2020-09-25",
            "DateWithdrawn": "2020-09-25",
            "DateDenied": "2020-09-25",
            "ReasonForDenial": "2020-09-25",
            "DateSubrogation": "2020-09-25",
            "DateClosed": "2020-09-25",
            "DateReopened": "2020-09-25",
            "LossLocationCountry": this.state.locationofinspected,
            "Description": this.state.repairyarddetail,
            "LegalDetail": this.state.causeofaccident,
            "Stage": "OPEN",
            "HandledBy": "TEST",
            "SettlementCurrency": "EUR",
            "Longitude": "",
            "Latitude": "",
            "ExcessAmount": this.state.claimAmount,
            "IsClaimNotPaidWithinExcess": 1,
            "Status": "Active",
            },
            "ClaimReportData": {
                "IsRegisteredForVAT": this.state.regVat == true ? 1 : 0,
                "VATRegistrationNo": this.state.vatRegNo,
                "VesselName": this.state.nameofvessel,
                "VesselAge": this.state.ageofvessel,
                "VesselFullValue": 43.4,
                "VesselMakeModel": "2020",
                "IsCrewCarried": this.state.crewcarried == true ? 1 : 0,
                "VesselUseAtAccidentTime": this.state.purposeofvesseluse,
                "TotalTPClaimAmount": Number(this.state.claimAmount),
                "Status": "Active"
            },
            "ClaimReportAccidentData": {
                "PersonInCharge": this.state.inchargeofvessel,
                "CauseOfLoss": this.state.causeofaccident,
                "IsVesselRacingAtAccidentTime": this.state.vesseracing == true ? 1 : 0,
                "WeatherCondition": this.state.vesselcondition,
                "IsEngineCutout": this.state.enginecutdown == true ? 1 : 0,
                "ReasonForNoEngineCutout": this.state.cutdowndetail,
                "StepToMinimizeLoss": this.state.minimizelossdamage,
                "ProposedCraftInspectionLocation": this.state.locationofinspected,
                "ProposedRepairStationName": this.state.fullname,
                "ProposedRepairStationAddress": this.state.address,
                "ProposedRepairStationPhone": this.state.mobilenumber,
                "Status": "Active"
            },
            "ClaimReportPartyData": {
                "PartyType": "Third",
                "PartyName": "Bhavik",
                "Address": "Ireland",
                "Description": "DataDescription",
                "SortOrder": 1,
                "Status": "Active"
            },
            "ClaimReportTheftData": {
                "DateLastSeen": "2020-09-21",
                "TimeLastSeen": "12:15 AM",
                "HowTheftDiscovered": this.state.theftdiscovered,
                "TheftDiscoveredPersonName": this.state.fullname,
                "TheftDiscoveredPersonAddress": this.state.address,
                "TheftDiscoveredPersonPhone": this.state.mobilenumber,
                "HowStorageEntry":this.state.storageareaentry,
                "SecurityPrecaution": "Done",
                "CrimeRefNum": "45435",
                "GardaStationAddress": this.state.address,
                "GardaStationPhone": this.state.mobilenumber,
                "TotalReplacementCost": Number(this.state.replacementcost),
                "TotalAmountClaimed": Number(this.state.amountclaimed),
                "Status": "Active"
            },
            "ClaimReportTheftItemData": {
                "ItemName": this.state.itemstolen,
                "SortOrder": 1,
                "Manufacturer": this.state.manufacturer,
                "ItemAge": this.state.ageofitem,
                "ReplacemenCost": Number(this.state.replacementcost),
                "ClaimedAmount": Number(this.state.amountclaimed),
                "Status": "Active"
            }
        }

        api.post(APIConstant.path.addUpdateClaim, inputData).then(res => {
            console.log(res)
            if (res.success) {

            }
        }).catch(err => {
            console.log(err)
        });
    }

    submitTheftData() {
        try {
            this.state.theftData.push({ "itemstolen": this.state.itemstolen, "manufacturer": this.state.manufacturer, "ageofitem": this.state.ageofitem, "replacementcost": this.state.replacementcost, "amountclaimed": this.state.amountclaimed })
            var data = {
                delete: false,
                theftData: { "itemstolen": this.state.itemstolen, "manufacturer": this.state.manufacturer, "ageofitem": this.state.ageofitem, "replacementcost": this.state.replacementcost, "amountclaimed": this.state.amountclaimed }
            }
        } catch (error) {
            console.log("error...", error);
        }
    }

    removeTheftDataTemp(index) {
        try {
            this.state.theftData.splice(index, 1)
            var data = {
                delete: true,
                theftData: this.state.theftData[index],
            }
        } catch (error) {
            console.log("error...",)
        }
    }

    submitPassengerData() {
        try {
            this.state.PassengerData.push({ "passengername": this.state.passengername, "passengeraddress": this.state.passengeraddress })
            var data = {
                delete: false,
                PassengerData: { "passengername": this.state.passengername, "passengeraddress": this.state.passengeraddress }
            }
        } catch (error) {
            console.log("error...", error);
        }
    }

    removePassengerDataTemp(index) {
        try {
            this.state.PassengerData.splice(index, 1)
            var data = {
                delete: true,
                PassengerData: this.state.PassengerData[index],
            }
        } catch (error) {
            console.log("error...",)
        }
    }

    submitWitnessData() {
        try {
            this.state.WitnessData.push({ "witnessname": this.state.witnessname, "witnessaddress": this.state.witnessaddress })
            var data = {
                delete: false,
                WitnessData: { "witnessname": this.state.witnessname, "witnessaddress": this.state.witnessaddress }
            }
        } catch (error) {
            console.log("error...", error);
        }
    }

    removeWitnessDataTemp(index) {
        try {
            this.state.WitnessData.splice(index, 1)
            var data = {
                delete: true,
                WitnessData: this.state.WitnessData[index],
            }
        } catch (error) {
            console.log("error...",)
        }
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

    handleChangeClaimForm = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'crewcarried') {
            this.setState({ crewcarried: e.target.checked });
        }

        if (e.target.name === 'regVat') {
            this.setState({ regVat: e.target.checked });
        }

        if (e.target.name === 'vesseracing') {
            this.setState({ vesseracing: e.target.checked });
        }

        if (e.target.name === 'enginecutdown') {
            this.setState({ enginecutdown: e.target.checked });
        }
        
    }

    componentWillUnmount() {

    }

    render() {
        var claimDetail = <Panel header="CLAIM DETAILS" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <label>Policy Number</label>
                        <Input type="text" name="policynumber" id="policynumber"
                            placeholder="Policy Number"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.policynumber}
                        />
                    </Col>
                    <Col md="3">
                        <label>Full Name</label>
                        <Input type="text" name="fullname" id="fullname"
                            placeholder="Full Name"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.fullname}
                        />
                    </Col>
                    <Col md="3">
                        <label>Business or Occupation</label>
                        <Input type="text" name="businessOccupation" id="businessOccupation"
                            placeholder="Business or Occupation"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.businessOccupation}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <label>Address</label>
                        <Input type="text" name="address" id="address"
                            placeholder="Address"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.address}
                        />
                    </Col>
                    <Col md="3">
                        <label>Telephone</label>
                        <Input type="text" name="telephonenumber" id="telephonenumber"
                            placeholder="Telephone Number"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.telephonenumber}
                        />
                    </Col>
                    <Col md="3">
                        <label>Mobile</label>
                        <Input type="text" name="mobilenumber" id="mobilenumber"
                            placeholder="Mobile Number"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.mobilenumber}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <label>Email</label>
                        <Input type="text" name="emailid" id="emailid"
                            placeholder="Email"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.emailid}
                        />
                    </Col>
                    <Col md="4" style={{ alignSelf: "center" }}>
                        <label>Are you registered for VAT<Input type="checkbox" name="regVat" id="regVat" value={this.state.regVat} style={{ marginLeft: "3px" }} checked={this.state.regVat == true ? "checked" : ""} onChange={(e) => this.handleChangeClaimForm(e)} />
                        </label>
                    </Col>
                    {this.state.regVat == true ? (<Col md="4">
                        <label>If so please advise the VAT registration no</label>
                        <Input type="text" name="vatRegNo" id="vatRegNo"
                            placeholder="VAT Registration No"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.vatRegNo}
                        />
                    </Col>) : (null)}
                </Row>
            </div>
        </Panel>

        var vesselDetail = <Panel header="VESSEL DETAILS" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <label>Name Of Vessel</label>
                        <Input type="text" name="nameofvessel" id="nameofvessel"
                            placeholder="Name Of Vessel"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.nameofvessel}
                        />
                    </Col>
                    <Col md="3">
                        <label>Age of Vessel</label>
                        <Input type="text" name="ageofvessel" id="ageofvessel"
                            placeholder="Age of Vessel"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.ageofvessel}
                        />
                    </Col>
                    <Col md="3">
                        <label>Type of Vessel</label>
                        <Input type="select" name="vesselType" id="vesselType"
                            value={this.state.vesselType} onChange={(e) => this.selectType(e.target.value, 'vesselType')} >
                            <option value=''>Select Vessel Type</option>
                            {this.state.vesselTypeArr.map((type, i) => {
                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col md="2" style={{ alignSelf: "center", marginTop: '.5em' }}>
                        <label>Crew Carried?<Input type="checkbox" name="crewcarried" id="crewcarried" value={this.state.crewcarried} style={{ marginLeft: "3px" }} checked={this.state.crewcarried == true ? "checked" : ""} onChange={(e) => this.handleChangeClaimForm(e)} />
                        </label>
                    </Col>
                    {this.state.crewcarried == true ? (<Col md="5">
                        <label>For what purpose was the vessel used at the time of the accident?</label>
                        <Input type="text" name="purposeofvesseluse" id="purposeofvesseluse"
                            placeholder="Purpose Of Vessel Use"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.purposeofvesseluse}
                        />
                    </Col>) : (null)}
                </Row>
            </div>
        </Panel>

        var accidentDetail = <Panel header="ACCIDENT DETAILS" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <label>Date Of Accident</label>
                        <Input type="date" name="dateofaccident" id="dateofaccident"
                            placeholder="Date Of Accident"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.dateofaccident}
                        />
                    </Col>
                    <Col md="3">
                        <label>Time Of Accident</label>
                        <Input type="date" name="timeofaccident" id="timeofaccident"
                            placeholder="Time Of Accident"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.timeofaccident}
                        />
                    </Col>
                    <Col md="6">
                        <label>Who was in charge of your vessel at the moment the accident occurred?</label>
                        <Input type="text" name="inchargeofvessel" id="inchargeofvessel"
                            placeholder="Incharge Of Vessel"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.inchargeofvessel}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <label>Cause:</label>
                        <Input type="text" name="causeofaccident" id="causeofaccident"
                            placeholder="Cause Of Accident"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.causeofaccident}
                        />
                    </Col>
                    <Col md="3">
                        <label>Place Of Accident</label>
                        <Input type="text" name="placeofoccuence" id="placeofoccuence"
                            placeholder="Place Of Accident"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.placeofoccuence}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="5" style={{ alignSelf: "center", marginTop: '.5em' }}>
                        <label>Was the vessel racing at the time?<Input type="checkbox" name="vesseracing" id="vesseracing" value={this.state.vesseracing} style={{ marginLeft: "3px" }} checked={this.state.vesseracing == true ? "checked" : ""} onChange={(e) => this.handleChangeClaimForm(e)} />
                        </label>
                    </Col>
                    {this.state.crewcarried == true ? (<Col md="4">
                        <label>State Condition</label>
                        <Input type="select" name="vesselcondition" id="vesselcondition"
                            value={this.state.vesselcondition} onChange={(e) => this.selectType(e.target.value, 'vesselcondition')} >
                            <option value=''>Select Vessel Type</option>
                            {this.state.vesselconditionArr.map((type, i) => {
                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                            })}
                        </Input>
                    </Col>) : (null)}
                </Row>
                <div className="input-box">
                    <label>Passengers in Vessels</label>
                </div>
                <Card>
                    <div className="input-box">
                        <Row>
                            <Col md="3" style={{ marginLeft: '.5em' }}>
                                <label>Passenger Name</label>
                                <Input type="text" name="passengername" id="passengername"
                                    placeholder="Passenger Name"
                                    style={{ width: '70%', display: "inline-block" }}
                                    value={this.state.passengername} onChange={(e) => this.handleChangeClaimForm(e)} >
                                </Input>
                            </Col>
                            <Col md="3" style={{ marginLeft: '.5em' }}>
                                <label>Passenger Address</label>
                                <Input type="text" name="passengeraddress" id="passengeraddress"
                                    placeholder="Passenger Address"
                                    style={{ width: '70%', display: "inline-block" }}
                                    value={this.state.passengeraddress} onChange={(e) => this.handleChangeClaimForm(e)} >
                                </Input>
                            </Col>
                            <Col md="3">
                                <label style={{ marginLeft: '.5em' }} ></label>
                                <BTN color="success" onClick={() => this.submitPassengerData()}>Add a Passenger Data</BTN>
                            </Col>
                        </Row>
                        {this.state.PassengerData.length > 0 ? (<Row>
                            <Col md="7" style={{ marginLeft: '.5em' }}>
                                <span>{this.state.PassengerData.length} Passenger Data</span>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th className="center">Passenger Name</th>
                                            <th className="center">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.PassengerData.map((surData, i) => {
                                            return (<tr>
                                                <td className="center">{surData.passengername}</td>
                                                <td className="center">{surData.passengeraddress}</td>
                                                <td className="center"><BTN color="light" onClick={() => this.removePassengerDataTemp(i)} className={'mr-1'}><span className="fa fa-trash-o"></span></BTN></td>
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
                    <label>Independent Witnesses</label>
                </div>
                <Card>
                    <div className="input-box">
                        <Row>
                            <Col md="3" style={{ marginLeft: '.5em' }}>
                                <label>Witnesses Name</label>
                                <Input type="text" name="witnessname" id="witnessname"
                                    placeholder="Witness Name"
                                    style={{ width: '70%', display: "inline-block" }}
                                    value={this.state.witnessname} onChange={(e) => this.handleChangeClaimForm(e)} >
                                </Input>
                            </Col>
                            <Col md="3" style={{ marginLeft: '.5em' }}>
                                <label>Witness Address</label>
                                <Input type="text" name="witnessaddress" id="witnessaddress"
                                    placeholder="witness Address"
                                    style={{ width: '70%', display: "inline-block" }}
                                    value={this.state.witnessaddress} onChange={(e) => this.handleChangeClaimForm(e)} >
                                </Input>
                            </Col>
                            <Col md="2">
                                <label style={{ marginLeft: '.5em' }} ></label>
                                <BTN color="success" onClick={() => this.submitWitnessData()}>Add a Witness Data</BTN>
                            </Col>
                        </Row>
                        {this.state.WitnessData.length > 0 ? (<Row>
                            <Col md="7" style={{ marginLeft: '.5em' }}>
                                <span>{this.state.WitnessData.length} Witness Data</span>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th className="center">Witness Name</th>
                                            <th className="center">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.WitnessData.map((surData, i) => {
                                            return (<tr>
                                                <td className="center">{surData.witnessname}</td>
                                                <td className="center">{surData.witnessaddress}</td>
                                                <td className="center"><BTN color="light" onClick={() => this.removeWitnessDataTemp(i)} className={'mr-1'}><span className="fa fa-trash-o"></span></BTN></td>
                                            </tr>)
                                        })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>) : (null)}
                    </div>
                </Card>
            </div>
        </Panel>

        var damageDetail = <Panel header="DAMAGE SUSTAINED BY YOUR CRAFT" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="4" style={{ alignSelf: "center", marginTop: '.5em' }}>
                        <label>Was an Engine cut-out device in operation at the times of the accident?<Input type="checkbox" name="enginecutdown" id="enginecutdown" value={this.state.enginecutdown} style={{ marginLeft: "3px" }} checked={this.state.enginecutdown == true ? "checked" : ""} onChange={(e) => this.handleChangeClaimForm(e)} />
                        </label>
                    </Col>
                    {this.state.enginecutdown == true ? (<Col md="4">
                        <label>If ‘NO’ please provide details as to why not</label>
                        <Input type="text" name="cutdowndetail" id="cutdowndetail"
                            placeholder="Detail"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.cutdowndetail}
                        />
                    </Col>) : (null)}
                </Row>
                <Row>
                    <Col md="3">
                        <label>What was done to minimise the loss or Damage:</label>
                        <Input type="text" name="minimizelossdamage" id="minimizelossdamage"
                            placeholder="Cause Of Accident"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.minimizelossdamage}
                        />
                    </Col>
                    <Col md="3">
                        <label>Where can the craft be inspected?</label>
                        <Input type="text" name="locationofinspected" id="locationofinspected"
                            placeholder="Craft Inspected"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.locationofinspected}
                        />
                    </Col>
                    <Col md="3">
                        <label>Repair Detail</label>
                        <Input type="text" name="repairyarddetail" id="repairyarddetail"
                            placeholder="Repair Detail"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.repairyarddetail}
                        />
                    </Col>
                </Row>
            </div>
        </Panel>

        var thirdPartyDetail = <Panel header="DAMAGE TO THIRD PARTY VESSELS" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <label>Amount of claim on you?</label>
                        <Input type="text" name="claimAmount" id="claimAmount"
                            placeholder="Claim Amount"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.claimAmount}
                        />
                    </Col>
                    <Col md="6">
                        <label>Give full details of damage or injury including Names and Addresses of all persons concerned?</label>
                        <Input type="textarea" name="damageinquirydetail" id="damageinquirydetail"
                            placeholder="Damage Inquiry Detail"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.damageinquirydetail}
                        />
                    </Col>
                </Row>
            </div>
        </Panel>

        var detailOfTheft = <Panel header="DETAILS OF THEFT" style={{ marginTop: '.5em' }}>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <label>Date Of Occurrence</label>
                        <Input type="date" name="dateofoccurrence" id="dateofoccurrence"
                            placeholder="Date Of Occurrence"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.dateofoccurrence}
                        />
                    </Col>
                    <Col md="3">
                        <label>Time Of Occurrence</label>
                        <Input type="date" name="timeofoccurrence" id="timeofoccurrence"
                            placeholder="Time Of Occurrence"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.timeofoccurrence}
                        />
                    </Col>
                    <Col md="3">
                        <label>Place Of Occurrence</label>
                        <Input type="text" name="placeofoccurrence" id="placeofoccurrence"
                            placeholder="Place Of Occurrence"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.placeofoccurrence}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <label>When was craft last seen?</label>
                        <Input type="textarea" name="craftlastseen" id="craftlastseen"
                            placeholder="Craft Last Seen"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.craftlastseen}
                        />
                    </Col>
                    <Col md="3">
                        <label>How was the theft discovered?</label>
                        <Input type="textarea" name="theftdiscovered" id="theftdiscovered"
                            placeholder="Theft Discovered"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.theftdiscovered}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="5">
                        <label>Please give name and address of person who discovered the theft?</label>
                        <Input type="textarea" name="detailoftheft" id="detailoftheft"
                            placeholder="Theft Inquiry Detail"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.detailoftheft}
                        />
                    </Col>
                    <Col md="4">
                        <label>How was entry made into the storage area?</label>
                        <Input type="textarea" name="storageareaentry" id="storageareaentry"
                            placeholder="Storage Area"
                            style={{ width: '70%', display: "inline-block" }}
                            onChange={(e) => this.handleChangeClaimForm(e)}
                            value={this.state.storageareaentry}
                        />
                    </Col>
                </Row>
            </div>
            <div className="input-box">
                <label>Theft Detail</label>
            </div>
            <Card>
                <div className="input-box">
                    <Row>
                        <Col md="3" style={{ marginLeft: '.5em' }}>
                            <label>Item stolen</label>
                            <Input type="text" name="itemstolen" id="itemstolen"
                                placeholder="Item stolen"
                                style={{ width: '70%', display: "inline-block" }}
                                value={this.state.itemstolen} onChange={(e) => this.handleChangeClaimForm(e)} >
                            </Input>
                        </Col>
                        <Col md="3" style={{ marginLeft: '.5em' }}>
                            <label>Manufacturer</label>
                            <Input type="text" name="manufacturer" id="manufacturer"
                                placeholder="Manufacturer"
                                style={{ width: '70%', display: "inline-block" }}
                                value={this.state.manufacturer} onChange={(e) => this.handleChangeClaimForm(e)} >
                            </Input>
                        </Col>
                        <Col md="3" style={{ marginLeft: '.5em' }}>
                            <label>Age of Item</label>
                            <Input type="text" name="ageofitem" id="ageofitem"
                                placeholder="Age of Item"
                                style={{ width: '70%', display: "inline-block" }}
                                value={this.state.ageofitem} onChange={(e) => this.handleChangeClaimForm(e)} >
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3" style={{ marginLeft: '.5em' }}>
                            <label>Replacement cost</label>
                            <Input type="text" name="replacementcost" id="replacementcost"
                                placeholder="Replacement cost"
                                style={{ width: '70%', display: "inline-block" }}
                                value={this.state.replacementcost} onChange={(e) => this.handleChangeClaimForm(e)} >
                            </Input>
                        </Col>
                        <Col md="3" style={{ marginLeft: '.5em' }}>
                            <label>Amount claimed</label>
                            <Input type="text" name="amountclaimed" id="amountclaimed"
                                placeholder="Amount claimed"
                                style={{ width: '70%', display: "inline-block" }}
                                value={this.state.amountclaimed} onChange={(e) => this.handleChangeClaimForm(e)} >
                            </Input>
                        </Col>
                        <Col md="2">
                            <label style={{ marginLeft: '.5em' }} ></label>
                            <BTN color="success" onClick={() => this.submitTheftData()}>Add a Theft Data</BTN>
                        </Col>
                    </Row>
                    {this.state.theftData.length > 0 ? (<Row>
                        <Col md="7" style={{ marginLeft: '.5em' }}>
                            <span>{this.state.theftData.length} Theft Data</span>
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="center">Item stolen</th>
                                        <th className="center">Manufacturer</th>
                                        <th className="center">Age of Item</th>
                                        <th className="center">Replacement cost</th>
                                        <th className="center">Amount claimed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.theftData.map((surData, i) => {
                                        return (<tr>
                                            <td className="center">{surData.itemstolen}</td>
                                            <td className="center">{surData.manufacturer}</td>
                                            <td className="center">{surData.ageofitem}</td>
                                            <td className="center">{surData.replacementcost}</td>
                                            <td className="center">{surData.amountclaimed}</td>
                                            <td className="center"><BTN color="light" onClick={() => this.removeTheftDataTemp(i)} className={'mr-1'}><span className="fa fa-trash-o"></span></BTN></td>
                                        </tr>)
                                    })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>) : (null)}
                </div>
            </Card>
        </Panel>

        return (
            <div className="input-box">
                {claimDetail}

                {vesselDetail}

                {accidentDetail}
                
                {damageDetail}

                {thirdPartyDetail}

                {detailOfTheft}

                <Row>
                    <Col md="2">
                        <label style={{ marginLeft: '.5em' }} ></label>
                        <BTN color="success" onClick={() => this.submitData()}>Save</BTN>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withTranslation()(NewClaim);
