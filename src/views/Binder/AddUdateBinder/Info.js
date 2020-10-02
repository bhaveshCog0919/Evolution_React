import React, { Component } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody, Col, Row, Input, Button } from 'reactstrap';
import { ScrollPanel } from 'primereact/scrollpanel';
import { AutoComplete } from 'primereact/autocomplete';
import AuthorizeClass from './Info/AuthorizeClass';
import BinderInfo from './Info/BinderInfo';
import BounderOfRisk from './Info/BounderOfRisk';
import { withTranslation } from 'react-i18next';

class Info extends Component {
    constructor() {
        super();
        this.state = {
        };

    }

    componentDidMount() {

    }

    render() {
            var header = <div>
            <Row style={{ marginTop: "20px" }}>
                <Col md="12">
                    <div className="content-section implementation">
                        <TabView renderActiveOnly={true}>
                            <TabPanel header="Binder Info">
                                <BinderInfo {...this.props}/>
                            </TabPanel>
                            <TabPanel header="Authorized Class">
                                <AuthorizeClass {...this.props}/>
                            </TabPanel>
                            <TabPanel header="Risk Locator">
                                <BounderOfRisk {...this.props}/>
                            </TabPanel>
                        </TabView>
                    </div>
                </Col>
            </Row>
        </div>;
        return (
            <div>
                {header}
            </div>
        );
    }
}

export default withTranslation()(Info);