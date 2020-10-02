import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Documents from './Documents';
import PersonNotes from './Notes';
import InboxEmail from '../Apps/Email/Inbox/Inbox';
import { toast } from 'react-toastify';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import api from '../../utils/apiClient';

class SidebarNav extends Component {

    constructor(props) {
        super(props);

        this.state = {
            NavPage: '',
            NavID: '',
            contactEntityType: '',
            contactEntityId: '',
            contactName: '',
            showPolicyModal: '',
            showContactModal: false
        };
    }

    componentDidMount() {
        if (this.props.NavPage) {
            this.setState({ NavPage: this.props.NavPage });
        }

        if (this.props.NavID) {
            this.setState({ NavID: this.props.NavID });
        }

        if (this.props.contactEntityType) {
            this.setState({ contactEntityType: this.props.contactEntityType });
        }

        if (this.props.contactEntityId) {
            this.setState({ contactEntityId: this.props.contactEntityId });
        }

        if (this.props.contactName) {
            this.setState({ contactName: this.props.contactName });
        }
    }

    viewPolicy = () => {

        let data = {
            id: this.state.contactEntityId,
            entityType: this.state.contactEntityType
        }
        api.post('api/getUserPolicyList', data).then(res => {
            console.log("DSAf", res);
            if (res.data.success) {
                if (res.data.data.length == '0') {
                    this.setState({ showPolicyModal: true });
                } else {
                    this.props.history.push({
                        pathname: '/PolicyList/' + this.state.contactEntityId + '/' + this.state.contactEntityType,
                        state: {
                            id: this.state.contactEntityId,
                            entityType: this.state.contactEntityType
                        }
                    });
                }
            } else {
                console.log('err');
            }
        }).catch(err => {
            console.log("DSAf", err);
        });
    }

    goToPolicy() {
        this.props.history.push({
            pathname: '/CreatePolicy/' + this.state.contactEntityId,
            state: {
                Id: this.state.contactEntityId
            }
        });
    }

    reset = (type) => {
        if (type === 'policyModal') {
            this.setState({ showPolicyModal: false, NewPolicyUser: '', contactEntityId: '' });
        } else if (type === 'contactModal') {
            this.setState({ showContactModal: false });
        }
    }

    gotoContactDetails() {
        this.setState({ showContactModal: true });
    }

    redirectToContactDetails() {
        if (this.state.NavPage == "Policy") {
            let id = this.state.contactEntityId;
            let entityType = this.state.contactEntityType;

            this.props.history.push({
                pathname: '/viewContactDetails/' + id + '/' + entityType,
                state: {
                    id: id,
                    entityType: entityType
                }
            }
            );
        } else {
            this.props.history.push('/contactList');
        }
    }

    gotoGenerateDocuments() {
        this.props.history.push('/bulkdocument');
    }

    gotoEmails() {
        this.props.history.push({
            pathname: '/apps/email/inbox/' + this.props.match.params.id,
        });
    }

    gotoPolicies() {
        this.viewPolicy();
        // toast.success("Comming Soon.");
    }

    gotoClaims() {
        toast.success("Comming Soon.");
    }

    gotoDocuments() {
        toast.success("Comming Soon.");
    }

    gotoNotes() {
        toast.success("Comming Soon.");
    }

    gotoTaks = () => {
        toast.success("Comming Soon.");
        // const path = './tasks';
        // this.props.history.push(path)
    }

    gotoAccounts() {
        toast.success("Comming Soon.");
    }

    gotoVault() {
        toast.success("Comming Soon.");
    }

    gotoContact() {
        toast.success("Comming Soon.");
    }

    gotoHistory() {
        toast.success("Comming Soon.");
    }

    render() {
        const { t } = this.props;
        if (this.state.NavPage == "Policy") {
            var ContactURL = "/viewContactDetails/" + this.state.contactEntityId + "/" + this.state.contactEntityType;
        } else {
            var ContactURL = "/contactList";
        }

        return (
            <div>
                <Button icon="pi pi-bars" onClick={(e) => this.setState({ visible: true })} style={{ backgroundColor: "#2F353A", border: "none", float: "right" }} />
                <Sidebar visible={this.state.visible} position="right" onHide={(e) => this.setState({ visible: false })} style={{ width: 200, marginTop: 54 }}>
                    <div xs="12" md="12">
                        <ul className="Sidebar_list contact-menu" style={{ "list-style-type": "none", marginTop: 30, padding: "0px" }}>
                            {
                                (this.state.NavPage == "Policy") ? (
                                    <li>
                                        <a href="javascript:void(0)" onClick={() => this.gotoContactDetails()}>
                                            Contact Details
                                        </a>
                                        {/* <Link to={ContactURL} target="_blank">Contact Details</Link> */}
                                    </li>
                                ) : (null)
                            }
                            {
                                (this.state.NavPage != "Policy") ? (
                                    <li>
                                        <a href="javascript:void(0)" onClick={() => this.gotoPolicies()}>
                                            Policy
                                        </a>
                                    </li>
                                ) : (null)
                            }

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoClaims()}>
                                    Claims
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)">
                                    <Documents {...this.props} />
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)">
                                    <PersonNotes {...this.props} />
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoTaks()}>
                                    Tasks
                                </a>
                            </li>

                            {
                                (this.state.NavPage != "Policy") ? (
                                    <li>
                                        <a href="javascript:void(0)" onClick={() => this.gotoAccounts()}>Accounts</a>
                                    </li>
                                ) : (null)
                            }

                            {/* 
                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoVault()}>
                                    ID Vault
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoContact()}>Contact</a>
                            </li>
                            */}

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoHistory()}>
                                    History
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoGenerateDocuments()}>
                                    Generate Documents
                                </a>
                            </li>
                            <li>
                                <a onClick={() => this.gotoEmails()}>
                                    Emails
                                </a>
                            </li>
                        </ul>
                    </div>
                </Sidebar>

                <Modal
                    toggle={() => this.reset('policyModal')}
                    isOpen={this.state.showPolicyModal}
                >
                    <ModalHeader toggle={() => this.reset('policyModal')}>
                        <h5>No Policy Found for <b>{this.state.contactName}</b></h5>
                    </ModalHeader>

                    <ModalBody>
                        <Row>
                            <Col md="12">
                                <p>{t("contactDetails:SetupPolicy.message")}</p>
                            </Col>
                        </Row>
                    </ModalBody>

                    <ModalFooter>
                        <BTN color="primary" onClick={() => this.reset('policyModal')}>
                            <i className="fa fa-close"></i>
                            {t("contactDetails:SetupPolicy.No")}
                        </BTN>
                        <BTN color="primary" onClick={() => this.goToPolicy()}>
                            <i className="fa fa-check"></i>
                            {t("contactDetails:SetupPolicy.Yes")}
                        </BTN>
                    </ModalFooter>
                </Modal>

                <Modal toggle={() => this.reset('contactModal')} isOpen={this.state.showContactModal}>
                    <ModalHeader toggle={() => this.reset('contactModal')}>Leave this page?</ModalHeader>
                    <ModalBody>
                        <span>You will loose unsaved data. Are you sure you want to leave this page?</span>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="danger" onClick={() => this.reset('contactModal')}><i className="fa fa-close"></i>No</BTN>
                        <BTN color="success" onClick={() => this.redirectToContactDetails()}><i className="fa fa-check"></i>Yes</BTN>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default withTranslation()(SidebarNav);
