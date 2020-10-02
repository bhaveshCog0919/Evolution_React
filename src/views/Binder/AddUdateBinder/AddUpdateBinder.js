import React, { Component } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody, Col, Row, Input, Button } from 'reactstrap';
import { ScrollPanel } from 'primereact/scrollpanel';
import { AutoComplete } from 'primereact/autocomplete';
import  RatingBand  from './RatingBand'
import  Settlement  from './Settlement'
import  SubBinder  from './SubBinder'
import  Transaction  from './Transaction'
import Info from './Info';
import { withTranslation } from 'react-i18next';
import APIConstant from '../../../utils/constants';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';

class AddUpdateBinder extends Component {
    constructor() {
        super();
        this.state = {
        };

    }

    getBinderData(binderId) {
        try {
            let data = { "binderId": binderId }
            api.post(APIConstant.path.getBinderDataById, data).then(res => {
                console.log(res);
                var data = res.data[0];
                this.setState({
                    BinderCode: data.BinderCode,
                    UMRN: data.UMRN,
                    isRated: data.IsRated.data[0] == 0 ? false : true,
                })
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    componentDidMount() {
        var splitData = this.props.location.pathname.split("/");
        // if (splitData[3] !== undefined) {
        if (!CommonConfig.isEmpty(splitData[3])) {
            this.getBinderData(splitData[3])
        } 
        // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
        //     this.getBinderData(this.props.match.params.Id)
        // }
    }

    render() {
        var header = <div>
            <Row style={{ marginTop: "20px" }}>
                <Col md="12">
                    <div className="content-section implementation">
                        <TabView renderActiveOnly={true}>
                            <TabPanel header="Info">
                                <Info {...this.props} />
                            </TabPanel>
                            <TabPanel header="Rating Bands" disabled={!this.state.isRated}>
                                <RatingBand {...this.props} />
                            </TabPanel>
                            <TabPanel header="Sub Binders">
                                <SubBinder {...this.props} />
                            </TabPanel>
                            <TabPanel header="Transactions">
                                <Transaction {...this.props} />
                            </TabPanel>
                            <TabPanel header="Settlements">
                                <Settlement {...this.props} />
                            </TabPanel>
                        </TabView>
                    </div>
                </Col>
            </Row>
        </div>;
        return (
            <div>
                <div className="basic-header">
                    {(this.state.BinderCode) ? (<h1>Add Update Binder ({this.state.BinderCode} - {this.state.UMRN})</h1>) :  <h1>Add Update Binder</h1>}
                </div>
                {header}
            </div>
        );
    }
}

export default withTranslation()(AddUpdateBinder);