import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Col, Row } from 'reactstrap';
import VesselTypes from './VesselTypes/VesselTypes';
import MooringZone from './MooringZones/MooringZone';
import MooringGuide from './MooringGuide/mooringGuide';
import RiskQuestionList from './RiskQuestion/RiskQuestionList';
import EndorsementList from './Endorsement/EndorsementList';
import Levy from './Levy/levy';
import NoClaimBonus from './NoClaimBonus/noclaimBonus';


class Admin extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
s
    componentDidMount() {

    }

    render() {
        var header = <div>
            <Row style={{ marginTop: "20px" }}>
                <Col md="12">
                    <div className="content-section implementation">
                        <TabView renderActiveOnly={false}>
                            <TabPanel header="Vessel Classes">
                            </TabPanel>
                            <TabPanel header="Vessel Types">
                                <VesselTypes {...this.props} />
                            </TabPanel>
                            <TabPanel header="Mooring Zones">
                                <MooringZone {...this.props} />
                            </TabPanel>
                            <TabPanel header="Mooring Guides">
                                <MooringGuide {...this.props} />
                            </TabPanel>
                            <TabPanel header="Risk Question">
                                <RiskQuestionList {...this.props} />
                            </TabPanel>
                            <TabPanel header="Binders">
                            </TabPanel>
                            <TabPanel header="Assumption">
                            </TabPanel>
                            <TabPanel header="Endoresment">
                                <EndorsementList {...this.props} />
                            </TabPanel>
                            <TabPanel header="Levy">
                                <Levy {...this.props} />
                            </TabPanel>
                            <TabPanel header="No Claim Bonus">
                                <NoClaimBonus {...this.props} />
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

export default Admin;