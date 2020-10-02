import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import { Container, Form, Col, Row, Input, Card, CardBody, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../../utils/constants';
import { PickList } from 'primereact/picklist';
var targetLength = 0;
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

            effectivedate: 'Effective Date',
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: false,

            MooringName: '',
            nameArray: [],
            MooringZoneId: '',

            arr: [],
            source: [],
            target: [],
            isEdit: false,
            targetError: true,
            sourceHeader: "Available to assign",
            targetHeader: "Assigned",
            isDeleteModel: false,
        };
        this.mooringZoneTemp = this.mooringZoneTemp.bind(this);
    }

    componentDidMount() {
        targetLength = 0;
        this.getMooringZones();
        this.getMooringZoneTitla();
    }

    getMooringZoneTitla() {
        api.post('api/getMooringZone').then(res => {
            console.log("getMooringZone", res);
            if (res.success) {
                var nameArray = [];
                for (var i = 0; i < res.data.length; i++) {
                    nameArray.push({
                        MooringZoneId: res.data[i].MooringZoneId,
                        Title: res.data[i].MooringZoneName,
                    });
                    this.setState({ nameArray: nameArray });
                }
            } else {
                console.log("Else");

            }
        }).catch(err => {

        });
    }

    getMooringZoneDetails(Id, MooringData) {
        console.log("getMooringZoneDetails", Id, MooringData);
        try {
            let data = {
                Id: Id
            }
            api.post('api/getMooringZoneDetails', data).then(res => {
                if (res.success) {
                    console.log("getMooringZoneDetails", res.data);
                    this.setState({ mooringTitle: res.data[0].MooringZoneName, mooringSummary: res.data[0].Summary, effectiveDate: moment(res.data[0].StartDate).format('YYYY-MM-DD'), mooringTitleError: false, mooringSummaryError: false, effectiveDateError: false, MooringZoneId: Id });
                    api.post('api/getMooringZoneLocationsById', data).then(res => {
                        if (res.success) {
                            var targetMooringGuideIdArr = MooringData;
                            for (var i = 0; i < res.data.length; i++) {
                                var targetMooringGuideId = res.data[i].MooringGuideId;
                                targetMooringGuideIdArr = targetMooringGuideIdArr.filter(function (e) {
                                    return e.MooringGuideId != targetMooringGuideId;
                                })
                            }
                            targetLength = res.data.length;
                            this.setState({
                                arr: targetMooringGuideIdArr,
                                target: res.data
                            });
                        } else {
                        }
                    });
                }
            })

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
            target: event.target,
        });
        targetLength = event.target.length;
        console.log("event", targetLength);
    }

    getMooringZones() {
        api.post('api/getMooringGuide').then(res => {
            if (res.success) {

                if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
                    this.getMooringZoneDetails(this.props.match.params.Id, res.data);
                    this.setState({ isEdit: true })
                } else {
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
                let invSpace = CommonConfig.RegExp.allowAllWithSpace;
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
                let invSpace = CommonConfig.RegExp.allowAllWithSpace;
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

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false);
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
        if (this.state.mooringTitleError === true) {
            this.show("mooringTitle", this.state.mooringTitleError);
        } else if (this.state.mooringSummaryError === true) {
            this.show("mooringSummary", this.state.mooringSummaryError);
        } else if (this.state.effectiveDateError === true) {
            this.show("effectiveDate", this.state.effectiveDateError);
        } else {
            var checkTitleName;
            if (this.state.isEdit == true) {
                let array = this.state.nameArray.filter(x => x.MooringZoneId !== this.state.MooringZoneId);
                checkTitleName = array.filter(x => x.Title === this.state.mooringTitle);
                if (checkTitleName.length) {
                    toast.error("MooringZone title already exist");
                    return null;
                }
            }
            if (this.state.isEdit == false) {
                checkTitleName = this.state.nameArray.filter(x => x.Title === this.state.mooringTitle);
                if (checkTitleName.length) {
                    toast.error("MooringZone title already exist");
                    return null;
                }
            }
            var data = {
                MooringZoneId: this.state.MooringZoneId,
                mooringTitle: this.state.mooringTitle,
                mooringSummary: this.state.mooringSummary,
                target: this.state.target,
                effectiveDate: this.state.effectiveDate,
                LoggedInUserId: CommonConfig.loggedInUserId()
            }
            api.post('api/addUpdateMooringZone', data).then(res => {
                if (res.success) {
                    // debugger
                    toast.success('Mooring Zone added successfully');
                    this.cancelMooringZone();
                } else {

                }
            }).catch(err => {
            });
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
            pathname: '/Master/MooringZone'
        });
    }

    deleteMooringZone() {
        this.setState({ isDeleteModel: true });
    }

    toggleLarge = () => {
        this.setState({
            isDeleteModel: false,
            MooringZoneId: '',
        });
    }

    Delete() {
        try {
            let data = {
                MooringZoneId: this.state.MooringZoneId,
                LoggedInUserId: CommonConfig.loggedInUserId()
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
                    <h1> {this.state.isEdit ? "Edit Mooring Zone" : "Add Mooring Zone"} </h1>
                </div>
                <div>
                    <Container>
                        <Form encType="multipart/form-data" autoComplete="of">
                            <Col>
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

                                        <div className="input-box">
                                            <Row>
                                                <Col md="2">
                                                    <label>{this.state.effectivedate}</label>
                                                </Col>
                                                <Col md="3">
                                                    <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                                        min={moment().format('YYYY-MM-DD')}
                                                        max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                                    >
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter effective date</em>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <div className="input-box">
                                            <div>
                                                <PickList source={this.state.arr} target={this.state.target} itemTemplate={this.mooringZoneTemp} showTargetControls={false} showSourceControls={false}
                                                    sourceHeader={this.state.sourceHeader} targetHeader={this.state.targetHeader + ' (' + targetLength + ')'}
                                                    responsive={true} sourceStyle={{ height: '250px', padding: '0px' }} targetStyle={{ height: '250px', padding: '0px !important' }}
                                                    onChange={(e) => this.onChange(e)} />

                                                <em className="error invalid-feedback" >Please enter mooring locations in active mooring locations</em>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="12">
                                <div style={{ margin: "15px" }}>
                                    <Row >
                                        <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.saveMooringZone()}>
                                            <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                                            Save
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
                <Modal isOpen={this.state.isDeleteModel} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete MooringZone</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete this MooringZone {this.state.mooringTitle}?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.Delete()}><i class="fa fa-check"></i>Yes</Button>{' '}
                        <Button color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>No</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default AddMooringZone;