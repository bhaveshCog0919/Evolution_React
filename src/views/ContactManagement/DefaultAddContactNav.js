import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Documents from './Documents';
import PersonNotes from './Notes';

class DefaultAddContactNav extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        if(props.NavPage){
            this.state.NavPage = props.NavPage;
        }

        if(props.NavID){
            this.state.NavID = props.NavID;
        }
    }

    gotoContactDetails() {
        this.props.history.push('/contactList');
    }

    gotoPolicies() {
        // const path = './ContactPolicy';
        // this.props.history.push(path)
    }

    gotoClaims() {

    }

    gotoDocuments() {
        const path = './ContactDocuments';
        this.props.history.push(path)
    }

    gotoNotes() {
        const path = './ContactNotes';
        this.props.history.push(path)
    }

    gotoTaks = () => {
        const path = './tasks';
        this.props.history.push(path)
    }

    gotoAccounts() {
        const path = './tasks';
        this.props.history.push(path)
    }

    gotoVault() {
        const path = './tasks';
        this.props.history.push(path)
    }

    gotoContact() {
        const path = './tasks';
        this.props.history.push(path)
    }

    gotoHistory() {
        const path = './tasks';
        this.props.history.push(path)
    }

    render() {
        return (
            <div>
                <Button icon="pi pi-bars" onClick={(e) => this.setState({ visible: true })} style={{ backgroundColor: "#2F353A", border: "none", float: "right" }} />
                <Sidebar visible={this.state.visible} position="right" onHide={(e) => this.setState({ visible: false })} style={{ width: 200, marginTop: 54 }}>
                    <div xs="12" md="12">
                        <ul className="Sidebar_list contact-menu" style={{ "list-style-type": "none", marginTop: 30, padding: "0px" }}>
                            {
                                (this.state.NavPage=="Policy")?(
                                    <li>
                                    <a href="javascript:void(0)" onClick={() => this.gotoContactDetails()}>
                                        Contact Details
                                    </a>
                                </li>
                                ):(null)
                            }
                            {
                                (this.state.NavPage!="Policy")?(
                                    <li>
                                        <a href="javascript:void(0)" onClick={() => this.gotoPolicies()}>
                                            Policy
                                        </a>
                                    </li>
                                ):(null)
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

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoAccounts()}>
                                    Accounts
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoVault()}>
                                    ID Vault
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoContact()}>
                                    Contact
                                </a>
                            </li>

                            <li>
                                <a href="javascript:void(0)" onClick={() => this.gotoHistory()}>
                                    History
                                </a>
                            </li>
                        </ul>
                    </div>
                </Sidebar>
            </div>
        );
    }
}

export default DefaultAddContactNav;
