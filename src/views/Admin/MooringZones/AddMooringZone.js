import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Container, Form, Col, Row, Input, Card, CardBody, Button } from 'reactstrap';
import api from '../../../utils/apiClient';
import { PickList } from 'primereact/picklist';

class AddMooringZone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Id: '',
            mooringtitle: 'Title',
            mooringTitle: '',
            mooringTitleError: true,

            mooringsummary: 'Summary',
            mooringSummary: '',
            mooringSummaryError: true,

            MooringName: '',
            MooringZoneId: '',

            arr: [],
            source: [],
            target: [],
            isEdit: false,
            targetError: true,
            sourceHeader: "Other Mooring Locations",
            targetHeader: "Active Mooring Locations"
        };
        this.mooringZoneTemp = this.mooringZoneTemp.bind(this);
    }

    componentDidMount() {
        this.getMooringZones();
    }

    getMooringGuideDetails(Id, Title, Summary, MooringData) {
        try {
            let data = {
                Id: Id
            }
            this.setState({
                MooringZoneId: Id, mooringTitle: Title, mooringSummary: Summary,
                mooringTitleError: false, mooringSummaryError: false
            });
            console.log("this.state", this.state);
            api.post('api/getMooringZoneLocationsById', data).then(res => {
                if (res.success) {
                    var targetMooringGuideIdArr = MooringData;
                    for (var i = 0; i < res.data.length; i++) {
                        var targetMooringGuideId = res.data[i].MooringGuideId;
                        targetMooringGuideIdArr = targetMooringGuideIdArr.filter(function (e) {
                            return e.MooringGuideId != targetMooringGuideId;
                        })
                    }
                    this.setState({
                        arr: targetMooringGuideIdArr,
                        target: res.data
                    });
                } else {
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    mooringZoneTemp(car) {
        return (
            <div className='p-clearfix'>
                <div style={{ fontSize: '14px', float: 'left', margin: '15px 5px 0 0' }}>
                    {car.MooringName}
                </div>
            </div>
        );
    }

    onChange = (event) => {
        console.log("event", event);
        this.setState({
            arr: event.source,
            target: event.target
        });
    }

    getMooringZones() {
        api.post('api/getMooringGuide').then(res => {
            if (res.success) {
                debugger
                var getDetails = this.props.location.state;
                if (getDetails !== undefined && getDetails !== null && getDetails.Id !== '' && getDetails.Id !== undefined && getDetails.Id !== null) {
                    this.getMooringGuideDetails(getDetails.Id, getDetails.Title, getDetails.Summary, res.data);
                    this.setState({ isEdit: true })
                }
                else if (typeof this.props.match.params !== "object" && this.props.match.params !== null && this.props.match.params !== undefined) {
                    this.getMooringGuideDetails(this.props.match.params.Id, this.props.match.params.Title, this.props.match.params.Summary, res.data);
                    this.setState({ isEdit: true })
                }
                else {
                    this.setState({ arr: res.data });
                }
            } else {
                console.log("Else");
            }
        }).catch(err => {

        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'mooringTitle') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mooringTitleError: true });
                this.show("mooringTitle", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let mooringTitle = e.target.value;
                if (!invSpace.test(mooringTitle)) {
                    this.setState({ mooringTitleError: true });
                    this.show("mooringTitle", true);
                } else {
                    this.setState({ mooringTitleError: false, mooringTitle: e.target.value });
                    this.show("mooringTitle", false);
                }
            }
        }

        if (e.target.name === 'mooringSummary') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mooringSummaryError: true });
                this.show("mooringSummary", true);
            } else {
                let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
                let mooringSummary = e.target.value;
                if (!invSpace.test(mooringSummary)) {
                    this.setState({ mooringSummaryError: true });
                    this.show("mooringSummary", true);
                } else {
                    this.setState({ mooringSummaryError: false, mooringSummary: e.target.value });
                    this.show("mooringSummary", false);
                }
            }
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    saveMooringZone() {
        debugger
        if (
            this.state.mooringTitleError === false &&
            this.state.mooringSummaryError === false
        ) {
            var data = {
                MooringZoneId: this.state.MooringZoneId,
                mooringTitle: this.state.mooringTitle,
                mooringSummary: this.state.mooringSummary,
                target: this.state.target
            }
            api.post('api/addUpdateMooringZone', data).then(res => {
                if (res.success) {
                    debugger
                    toast.success('Mooring Zone added successfully');
                    this.reset();
                } else {

                }
            }).catch(err => {
            });

        } else {
            this.show("mooringTitle", this.state.mooringTitleError);
            this.show("mooringSummary", this.state.mooringSummaryError);
        }
        console.log("data", data);
    }

    saveAndExitMooringZone() {
        if (
            this.state.mooringTitleError === false &&
            this.state.mooringSummaryError === false
        ) {
            var data = {
                MooringZoneId: this.state.MooringZoneId,
                mooringTitle: this.state.mooringTitle,
                mooringSummary: this.state.mooringSummary,
                target: this.state.target
            }
            api.post('api/addUpdateMooringZone', data).then(res => {
                if (res.success) {
                    debugger
                    toast.success('Mooring Zone added successfully');
                    this.cancelMooringZone();
                    this.reset();
                } else {

                }
            }).catch(err => {
            });

        } else {
            this.show("mooringTitle", this.state.mooringTitleError);
            this.show("mooringSummary", this.state.mooringSummaryError);
        }
    }

    resetMooringZone() {
        this.setState({
            mooringTitle: '', mooringSummary: '',
            target: []
        });
    }

    cancelMooringZone() {
        this.resetMooringZone();
        this.props.history.push({
            pathname: '/MooringZone'
        });
    }

    deleteMooringZone() {
        try {
            let data = {
                MooringZoneId: this.state.MooringZoneId
            }
            api.post('api/deleteMooringZone', data).then(res => {
                if (res.success) {
                    toast.success("Mooring Zone deleted successfully");
                    this.cancelMooringZone();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    render() {
        console.log("thi.state.arr", this.state.arr);
        return (
            <div>
                <div className="basic-header">
                    <h1>Add Mooring Zone</h1>
                </div>
                <div>
                    <Container>
                        <Form encType="multipart/form-data" autoComplete="of">
                            <Row>
                                <Col md="6">
                                    <Card>
                                        <CardBody>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{this.state.mooringtitle}</label>
                                                    </Col>
                                                    <Col md="10">
                                                        <div>
                                                            <Input type="text" name="mooringTitle" id="mooringTitle" onChange={(e) => this.handleChange(e)} value={this.state.mooringTitle}>
                                                            </Input>
                                                            <em className="error invalid-feedback" >Please enter mooring zone title</em>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="input-box">
                                                <Row>
                                                    <Col md="2">
                                                        <label>{this.state.mooringsummary}</label>
                                                    </Col>
                                                    <Col md="10">
                                                        <Input type="textarea" name="mooringSummary" id="mooringSummary" onChange={(e) => this.handleChange(e)} value={this.state.mooringSummary}>
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please enter mooring zone summary</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <div className="input-box">
                                                <div>
                                                    <PickList source={this.state.arr} target={this.state.target} itemTemplate={this.mooringZoneTemp} showTargetControls={false} showSourceControls={false}
                                                        sourceHeader={this.state.sourceHeader} targetHeader={this.state.targetHeader}
                                                        responsive={true} sourceStyle={{ height: '250px', padding: '0px' }} targetStyle={{ height: '250px', padding: '0px !important' }}
                                                        onChange={(e) => this.onChange(e)} />

                                                    <em className="error invalid-feedback" >Please enter mooring locations in active mooring locations</em>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Col md="12">
                                <div style={{ margin: "15px" }}>
                                    <Row >
                                        <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.saveMooringZone()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                            Save
                                            </Button>

                                        <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveAndExitMooringZone()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                            Save & Exit
                                            </Button>

                                        <Button style={{ marginLeft: "10px" }} onClick={() => this.resetMooringZone()}>
                                            {/* <i style={{ marginRight: "10px" }} className="fa fa-check"></i> */}
                                            Reset
                                            </Button>

                                        {(this.state.isEdit == true) ? (
                                            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.deleteMooringZone()}>
                                                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                                Delete
                                                </Button>
                                        ) : (
                                                null
                                            )}

                                        <Button style={{ marginLeft: "10px" }} onClick={() => this.cancelMooringZone()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                                            Cancel
                                            </Button>
                                    </Row>
                                </div>
                            </Col>
                        </Form>
                    </Container>
                </div>
            </div>
        )
    }
}

export default AddMooringZone;