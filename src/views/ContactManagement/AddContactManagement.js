import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import ContactDetails from './ContactDetails';
import { withTranslation } from 'react-i18next';
import SidebarNav from '../SidebarNav/SidebarNav';

class AddContactManagement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isContactEdit: false
    };

    if(props.match.params.id != undefined && props.match.params.entityType != undefined){
      this.state.isContactEdit = true;
      this.state.entityId = props.match.params.id;
      this.state.entityType = props.match.params.entityType;
    }
  }

  render() {
    const { t } = this.props;
    const mandatoryFieldMsg = t("mandatoryFieldMsg");

    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="12" className="">
            <span style={{color: "red"}}>{mandatoryFieldMsg}</span>
          </Col>
        </Row>

        <Row style={{marginTop: 5}}>
          <Col xs="12" md="12">
            {/* <Row>
              <Col xs="12" md="12"> */}
                {/* <AddContactNav {...this.props} /> */}
                {(this.state.isContactEdit)? (
                  <SidebarNav NavPage="User" NavID={this.props.match.params.id}
                  NavPage="User"
                  contactEntityType={this.props.match.params.entityType}
                                        contactEntityId={this.props.match.params.id}
                                        contactName={this.state.fullName} {...this.props} />
                ): (null)}
              {/* </Col>
            </Row> */}
            <ContactDetails {...this.props} />
          </Col>

        </Row>
      </div>
    );
  }
}

export default withTranslation()(AddContactManagement);
