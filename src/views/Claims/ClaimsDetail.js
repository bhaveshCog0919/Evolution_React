import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Panel } from 'primereact/panel';
import { Card, CardBody, Col, Table, Row, Input, Button as BTN, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form, UncontrolledTooltip } from 'reactstrap';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import api from '../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../utils/constants';
import ClaimList from '../Claims/ClaimList';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import ClaimDetailForm from './ClaimDetailForm';

class ClaimsDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            changeLocationOfLossCountry: false,
            changeLanguage: false,
            changeCurrencyOfClaim: false,
            locationOfLoss: '',
            currencyofclaim: '',
            LanguageId: '1',
            languageList: [],
            currencyList: [],
            countryList: [],
        };
    }

    editLanguage() {
        this.setState({ changeLanguage: !this.state.changeLanguage });
    }

    editCurrency(type) {
        if (type == "currencyofclaim") {
            this.setState({ changeCurrencyOfClaim: !this.state.changeCurrencyOfClaim });
        }
    }

    editCountry(type) {
        if (type == "locationOfLoss") {
            this.setState({ changeLocationOfLossCountry: !this.state.changeLocationOfLossCountry });
        }
    }

    getLanguageData() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                console.log('getLanguageData', res.data);
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
                if (res.success) {
                    this.setState({ currencyList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    async componentDidMount() {
        this.getLanguageData()
        this.getCurrencyData()
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
    }

    selectType(value, type) {
        if (type === 'locationOfLoss') {
            this.setState({ locationOfLoss: value });
        }

        if (type === 'currencyofclaim') {
            this.setState({ currencyofclaim: value });
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

    componentWillUnmount() {

    }

    render() {
        const { t } = this.props;
        const CancelButton = t("buttons.Cancel");
        const AddButton = t("buttons.Add");
        const DeleteButton = t("buttons.Delete");
        var header = <div>
            <div className="input-box">
                <Row>
                    <Col md="3">
                        <div className="policy-box">
                            <p>PolicyHolder:</p>
                            <span>Mark Solly</span>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Email:</p>
                            <span>Test@gmail.com</span>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Phone:</p>
                            <span>+91-7043557171</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Policy Binder Country:</p>
                            <span>Ireland</span>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Policy Currency:</p>
                            <span>EUR</span>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="policy-box">
                            <p>
                                {t("policyDetails:Language")}
                                {(this.state.changeLanguage) ? (
                                    <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="LanguageId" id="LanguageId" onChange={(e) => this.selectContainerType(e.target.value, 'language')} value={this.state.language}>
                                        {
                                            this.state.languageList.map((ct, i) => {
                                                return (<option value={ct.Language}>{ct.Language}</option>)
                                            })
                                        }
                                    </Input>
                                ) : (
                                        <span style={{ marginLeft: 10 }}>{this.state.language}</span>
                                    )}
                                <BTN color="primary" onClick={() => this.editLanguage()} title="Change Language">
                                    <i className="fa fa-pencil"></i>
                                </BTN>
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Location Of Loss</p>
                            <div className="pl-inner">
                                {(this.state.changeLocationOfLossCountry) ? (
                                    <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="locationOfLoss" id="locationOfLoss" onChange={(e) => this.selectType(e.target.value, "locationOfLoss")} value={this.state.locationOfLoss}>
                                        {
                                            this.state.countryList.map((ct, i) => {
                                                return (<option value={ct.label}>{ct.label}</option>)
                                            })
                                        }
                                    </Input>
                                ) : (
                                        <span style={{ marginLeft: 10 }}>{this.state.locationOfLoss}</span>
                                    )}
                                <BTN color="primary" onClick={() => this.editCountry("locationOfLoss")} title="Change Country">
                                    <i className="fa fa-pencil"></i>
                                </BTN>
                            </div>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="policy-box">
                            <p>Currency Of Claim</p>
                            <div className="pl-inner">
                                {(this.state.changeCurrencyOfClaim) ? (
                                    <Input type="select" name="currencyofclaim" id="currencyofclaim" onChange={(e) => this.selectType(e.target.value, 'currencyofclaim')} value={this.state.currencyofclaim} style={{ width: "fit-content", display: "inline-block" }}>
                                        {this.state.currencyList.map((ct, i) => {
                                            return (<option value={ct.CurrncyCode}>{ct.CurrncyCode}</option>)
                                        })
                                        }
                                    </Input>
                                ) : (
                                        <span>{this.state.currencyofclaim}</span>
                                    )}

                                <BTN color="primary" onClick={() => this.editCurrency("currencyofclaim")} title="Change Currency">
                                    <i className="fa fa-pencil"></i>
                                </BTN>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Panel header="Claim Summary" toggleable>
                <div className="input-box">
                    <Row>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Total Sum Insured:</p>
                                <span>Mark Sully</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Incepation:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Renewal:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Claim Reported:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Opened:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Coverage Confirmed:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Loss Date:</p>
                                <span>dd-mm-yyyy</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Loss Fund Available From Binder:</p>
                                <span>15000</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Loss Fund:</p>
                                <span>0</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>Claims Bordereau:</p>
                                <span>??</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Panel>
        </div>
        return (
            <div>
                <div>
                    {header}
                </div>
                <div style={{ marginTop: "20px" }}>
                    <ClaimDetailForm {...this.props} />
                </div>
            </div>
        );
    }
}

export default withTranslation()(ClaimsDetail);
