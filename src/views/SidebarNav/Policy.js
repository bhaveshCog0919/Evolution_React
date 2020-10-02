import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import SidebarNav from './SidebarNav';

class Policy extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  addMoreTask() {
    this.props.history.push('/AddContactPolicy');
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    var header = <div>
      <Row>
        <Col xs="4" md="4">
          <div style={{ textAlign: 'left' }}>
            <MultiSelect value={this.state.cols} options={this.colOptions} onChange={this.onColumnToggle} style={{ width: '250px' }} />
          </div>
        </Col>
        <Col xs="4" md="4">
          <div className="content-section introduction">
            <div className="feature-intro">
              <h1>Policy</h1>
            </div>
          </div>
        </Col>
        <Col xs="4" md="4">
          <div style={{ 'textAlign': 'right' }}>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginBottom: 10 }} />
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <Button type="button" icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.export} style={{ marginRight: 10 }}></Button>
          </div>
        </Col>
      </Row>
    </div>;
    return (
      <div>
        <Row>
          <Col xs="3" md="3">
            <Button type="button" label="Back"
              onClick={() => this.goBack()}
            ></Button>
          </Col>
          <Col xs="9" md="9">
            <div>
              <Button type="button" style={{ float: "right" }} label="Add Policy" onClick={() => this.addMoreTask()}></Button>
              <SidebarNav NavPage="Policy" NavID={this.props.match.params.id} {...this.props} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Policy;
