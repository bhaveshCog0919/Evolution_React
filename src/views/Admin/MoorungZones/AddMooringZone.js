import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Container, Form, Col, Row, Input, Card, CardBody, NavLink, Button } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { PickList } from 'primereact/picklist';
import { CommonConfig } from '../../../utils/constants';
import { InputTextarea } from 'primereact/inputtextarea';

const mooringType = [
    { label: 'Swinging Mooring Marina berth', value: 'Swinging Mooring Marina berth' },
    { label: 'Launch & retrieve', value: 'Launch & retrieve' },
];

const mooringLocationTypearr = [
    { label: 'Inland', value: 'Inland' },
    { label: 'Coastal', value: 'Coastal' },
    { label: 'Ashore', value: 'Ashore' },
];

const mooringApprovalarr = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
];

const zone = [
    { label: 'Spanish Website', value: 'Spanish Website' },
    { label: 'Irish Website', value: 'Irish Website' },
];

const locations = [
    {
        lat: 40.75636,
        lng: 14.01457,
        label: 'S',
        draggable: false,
        title: 'Ireland',
        www: 'https://unsplash.com/s/photos/ireland'
    },
];

const apiKey = 'AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA'

const defaultZoom = 6;
const defaultCenter = { lat: 40.75636, lng: 14.01457 };

const GoogleMapsComponent = withScriptjs(withGoogleMap((props) => {
    return (
        <GoogleMap defaultZoom={defaultZoom} defaultCenter={defaultCenter}>
            {<MarkerList locations={locations} />}
        </GoogleMap>
    );
}
));

class MarkerList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return locations.map((location, index) => {
            return (
                <MarkerWithInfoWindow key={index.toString()} location={location} />
            )
        }
        );
    }
}

class MarkerWithInfoWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        const { location } = this.props;

        return (
            <Marker onClick={this.toggle} position={location} title={location.title} label={location.label}>
                {this.state.isOpen &&
                    <InfoWindow onCloseClick={this.toggle}>
                        <NavLink href={location.www} target="_blank">{location.title}</NavLink>
                    </InfoWindow>}
            </Marker>
        )
    }
}

class AddMooringZone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mooringtitle: 'Title',
            mooringTitle: '',
            mooringTitleError: false,

            mooringsummary: 'Summary',
            mooringSummary: '',
            mooringSummaryError: false,

            sourceHeader: "Active Mooring Locations",
            targetHeader: "Other Mooring Locations"
        };
    }

    componentDidMount() {
        this.getCountry();
        this.maps();
    }

    getCountry() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var Country = [];
                    for (let i = 0; i < res.data.length; i++) {
                        Country.push({
                            label: res.data[i].stringmapname,
                            value: res.data[i].description
                        })
                    }
                    this.setState({ mooringCountryarr: Country });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
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

    editPolicyMooring() {
        this.setState({ isEdit: true });
    }

    back() {
        this.setState({ isEdit: false });
    }

    savePolicyMooring() {
        let data = [
            { mooringName: this.state.mooringName },
            { mooringType: this.state.mooringType },
            { mooringCountry: this.state.mooringCountry },
            { mooringLocation: this.state.mooringLocation },
            { mooringLocationType: this.state.mooringLocationType },
            { mooringLoading: this.state.mooringLoading },
            { mooringApproval: this.state.mooringApproval },
            { mooringNotes: this.state.mooringNotes },
            { OtherInformation: this.state.OtherInformation },
            { CruisingRange: this.state.CruisingRange },
        ]
        console.log(data);
    }

    reset() {
        this.setState({
            mooringName: '', mooringType: '', mooringCountry: '', mooringLocation: '',
            mooringLocationType: '', mooringLoading: '', mooringApproval: '', mooringNotes: '',
            CruisingRange: '', OtherInformation: '', isEdit: false
        })
    }

    maps() {
        console.log("Maps", document.getElementById('map_canvas'));
        // var map = new google.maps.Map(document.getElementById('map_canvas'), {
        //   zoom: 1,
        //   center: new google.maps.LatLng(35.137879, -82.836914),
        //   mapTypeId: google.maps.MapTypeId.ROADMAP
        // });

        // var myMarker = new google.maps.Marker({
        //   position: new google.maps.LatLng(47.651968, 9.478485),
        //   draggable: true
        // });

        // google.maps.event.addListener(myMarker, 'dragend', function (evt) {
        //   document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
        // });

        // google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
        //   document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
        // });

        // map.setCenter(myMarker.position);
        // myMarker.setMap(map);
    }

    saveMooringZone(){

    }

    saveAndExitMooringZone(){
        
    }

    reserMooringZone(){
        
    }

    cancelMooringZone(){
        
    }

    render() {
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
                                                    <PickList source={this.state.cars} target={this.state.targetCars} itemTemplate={this.carTemplate} showTargetControls={false} showSourceControls={false}
                                                        sourceHeader={this.state.sourceHeader} targetHeader={this.state.targetHeader}
                                                        responsive={true} sourceStyle={{ height: '250px' }} targetStyle={{ height: '250px' }}
                                                        onChange={(e) => this.setState({ source: e.source, target: e.target })} />
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

                                        <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.reserMooringZone()}>
                                            {/* <i style={{ marginRight: "10px" }} className="fa fa-check"></i> */}
                                            Reset
                                            </Button>

                                        <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.cancelMooringZone()}>
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