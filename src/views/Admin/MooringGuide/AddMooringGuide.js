import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Container, Form, Col, Row, Input, Card, CardBody, Button } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const mooringLocationTypearr = [
  { label: 'Inland', value: 'Inland' },
  { label: 'Coastal', value: 'Coastal' },
  { label: 'Ashore', value: 'Ashore' },
];

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.google.com/maps/api/js?v=3.exp&key=AIzaSyDDPVM-dsW-fpv1knIQw8ZFbAMq85Qpqtg&sensor=false",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
  >
    {console.log("propssssssss", props)}
    {props.isMarkerShown && <Marker onDragEnd={(e) => props.getPosition(e)}
      draggable={true} position={{ lat: props.latitude, lng: props.longitude }} />}
  </GoogleMap>
)

class AddMooringGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MooringGuideId: '',

      mooringname: 'Name',
      mooringName: '',
      mooringNameError: true,

      mooringtype: 'Mooring Type',
      mooringType: '',
      mooringTypearr: [],
      mooringTypeError: true,

      mooringcountry: 'Country',
      mooringCountry: '',
      mooringCountryarr: [],
      mooringCountryError: true,

      mooringcounty: 'County / Region',
      mooringCounty: '',
      mooringCountyError: true,

      mooringlocation: 'Location',
      mooringLocation: '',
      mooringLocationError: true,

      mooringlocationType: 'Location Type',
      mooringLocationType: '',
      mooringLocationTypearr: [],
      mooringLocationTypeError: true,

      mooringcoordinates: 'Coordinates',
      mooringCoordinates: '',
      mooringCoordinatesError: true,

      mooringzone: 'Zone',
      mooringZone: '',
      mooringZoneTypearr: [],
      mooringZoneTypeError: true,

      mooringloading: 'Loading (%)',
      mooringLoading: '',
      mooringLoadingError: true,

      mooringapproval: 'Approval Required',
      mooringApproval: '',
      mooringApprovalarr: [],
      mooringApprovalError: true,

      mooringnotes: 'Notes',
      mooringNotes: '',
      mooringNotesError: true,

      isMarkerShown: false,
      isEdit: false,

      latitude: 40.75636,
      longitude: 14.01457
    };
  }

  componentDidMount() {
    this.getCountry();
    this.getmooringType();
    this.getLocationType();
    this.getApproval();
    this.getMooringZone();
    this.delayedShowMarker();
    var getDetails = this.props.location.state;
    console.log("getDetails", getDetails);
    if (getDetails !== undefined && getDetails !== null && getDetails.Id !== '' && getDetails.Id !== undefined && getDetails.Id !== null) {
      this.getMooringGuideDetails(getDetails.Id, getDetails.Name, getDetails.CountryId, getDetails.County, getDetails.Location, getDetails.location_type, getDetails.Loading, getDetails.mooring_Type, getDetails.approval_Required, getDetails.Latitude, getDetails.Longitude, getDetails.Notes, getDetails.MooringZone, getDetails.isEdit);
      // console.log("getDetails.ID",getDetails.Id);
    }
    else if (this.props.match.params !== {} && this.props.match.params !== null && this.props.match.params !== undefined) {
      this.getMooringGuideDetails(this.props.match.params.Id, this.props.match.params.Name, this.props.match.params.CountryId, this.props.match.params.County, this.props.match.params.Location, this.props.match.params.location_type, this.props.match.params.Loading, this.props.match.params.mooring_Type, this.props.match.params.approval_Required, this.props.match.params.Latitude, this.props.match.params.Longitude);
      console.log("ELSE");
    }
  }

  getMooringGuideDetails(Id, Name, CountryId, County, Location, location_type, Loading, mooring_Type, approval_Required, Latitude, Longitude, Notes, Zone, isEdit) {
    if (isEdit == true) {
      this.setState({
        MooringGuideId: Id, mooringName: Name, mooringCountry: CountryId, mooringCounty: County, mooringLocation: Location, mooringLocationType: location_type, mooringLoading: Loading, mooringType: mooring_Type, mooringApproval: approval_Required, mooringNotes: Notes,
        mooringCoordinates: Longitude + ',' + Latitude, latitude: Number(Latitude), longitude: Number(Longitude), mooringZone: Zone, isMarkerShown: true, isEdit: isEdit,

        mooringNameError: false, mooringCountryError: false, mooringCountyError: false, mooringLocationError: false, mooringLocationTypeError: false, mooringLoadingError: false, mooringTypeError: false, mooringApprovalError: false, mooringNotesError: false, mooringCoordinatesError: false, mooringZoneTypeError: false
      })
    }
  }

  getCountry() {
    try {
      const data = {
        stringmaptype: 'COUNTRY',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          console.log("COUNTRY", res.data);
          var Country = [];
          for (let i = 0; i < res.data.length; i++) {
            Country.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ mooringCountryarr: res.data });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getmooringType() {
    try {
      const data = {
        stringmaptype: 'MOORINGTYPE',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        console.log("MOORINGTYPE", res);
        if (res.success) {
          console.log("IF");
          var mooringtype = [];
          for (let i = 0; i < res.data.length; i++) {
            mooringtype.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ mooringTypearr: mooringtype });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getLocationType() {
    try {
      const data = {
        stringmaptype: 'LOCATIONTYPE',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        console.log("resssssss", res);
        if (res.success) {
          console.log("IF");
          var locationtype = [];
          for (let i = 0; i < res.data.length; i++) {
            locationtype.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ mooringLocationTypearr: locationtype });
          console.log("mooringLocationTypearr", mooringLocationTypearr);
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getApproval() {
    try {
      const data = {
        stringmaptype: 'MOORINGAPPROVAL',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        console.log("resssssss", res);
        if (res.success) {
          console.log("IF");
          var approval = [];
          for (let i = 0; i < res.data.length; i++) {
            approval.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ mooringApprovalarr: approval });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getMooringZone() {
    try {
      const data = {
        stringmaptype: 'MOORINGZONE',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        console.log("resssssss", res);
        if (res.success) {
          console.log("IF");
          var mooringzone = [];
          for (let i = 0; i < res.data.length; i++) {
            mooringzone.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ mooringZoneTypearr: mooringzone });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    })
  }

  selectType(value, type) {

    if (type === 'mooringType') {
      if (value === '' || value === null) {
        this.setState({ mooringTypeError: true, mooringType: value });
        this.show('mooringType', true);
      } else {
        this.setState({ mooringTypeError: false, mooringType: value });
        this.show('mooringType', false);
      }
    }

    if (type === 'mooringCountry') {
      if (value === '' || value === null) {
        this.setState({ mooringCountryError: true, mooringCountry: value });
        this.show('mooringCountry', true);
      } else {
        this.setState({ mooringCountryError: false, mooringCountry: value });
        this.show('mooringCountry', false);
      }
    }

    if (type === 'mooringLocationType') {
      if (value === '' || value === null) {
        this.setState({ mooringLocationTypeError: true, mooringLocationType: value });
        this.show('mooringLocationType', true);
      } else {
        this.setState({ mooringLocationTypeError: false, mooringLocationType: value });
        this.show('mooringLocationType', false);
      }
    }

    if (type === 'mooringApproval') {
      if (value === '' || value === null) {
        this.setState({ mooringApprovalError: true, mooringApproval: value });
        this.show('mooringApproval', true);
      } else {
        this.setState({ mooringApprovalError: false, mooringApproval: value });
        this.show('mooringApproval', false);
      }
    }

    if (type === 'mooringZone') {
      if (value === '' || value === null) {
        this.setState({ mooringZoneTypeError: true, mooringZone: value });
        this.show('mooringZone', true);
      } else {
        this.setState({ mooringZoneTypeError: false, mooringZone: value });
        this.show('mooringZone', false);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'mooringName') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringNameError: true });
        this.show("mooringName", true);
      } else {
        let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
        let mooringName = e.target.value;
        if (!invSpace.test(mooringName)) {
          this.setState({ mooringNameError: true });
          this.show("mooringName", true);
        } else {
          this.setState({ mooringNameError: false, mooringName: e.target.value });
          this.show("mooringName", false);
        }
      }
    }

    if (e.target.name === 'mooringCounty') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringCountyError: true });
        this.show("mooringCounty", true);
      } else {
        let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
        let mooringCounty = e.target.value;
        if (!invSpace.test(mooringCounty)) {
          this.setState({ mooringCountyError: true });
          this.show("mooringCounty", true);
        } else {
          this.setState({ mooringCountyError: false, mooringCounty: e.target.value });
          this.show("mooringCounty", false);
        }
      }
    }

    if (e.target.name === 'mooringLocation') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringLocationError: true });
        this.show("mooringLocation", true);
      } else {
        let invSpace = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
        let mooringLocation = e.target.value;
        if (!invSpace.test(mooringLocation)) {
          this.setState({ mooringLocationError: true });
          this.show("mooringLocation", true);
        } else {
          this.setState({ mooringLocationError: false, mooringLocation: e.target.value });
          this.show("mooringLocation", false);
        }
      }
    }

    if (e.target.name === 'mooringLoading') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringLoadingError: true });
        this.show("mooringLoading", true);
      } else {
        let mooringLoadingRegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
        let mooringLoading = e.target.value;
        if (e.target.value > 100 || !mooringLoadingRegEx.test(mooringLoading)) {
          this.setState({ mooringLoadingError: true });
          this.show("mooringLoading", true);
        } else {
          this.setState({ mooringLoadingError: false, mooringLoading: e.target.value });
          this.show("mooringLoading", false);
        }
      }
    }

    if (e.target.name === 'mooringNotes') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringNotesError: true });
        this.show("mooringNotes", true);
      } else {
        let mooringNotesRegEx = /^[a-zA-Z]+[a-zA-Z-\s']*$/;
        let mooringNotes = e.target.value;
        if (e.target.value > 100 || !mooringNotesRegEx.test(mooringNotes)) {
          this.setState({ mooringNotesError: true });
          this.show("mooringNotes", true);
        } else {
          this.setState({ mooringNotesError: false, mooringNotes: e.target.value });
          this.show("mooringNotes", false);
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

  goBckToListingPage() {
    this.props.history.push({
      pathname: '/MooringGuide'
    });
  }

  saveMooringGuide() {
    debugger
    if (
      this.state.mooringNameError === false &&
      this.state.mooringTypeError === false &&
      this.state.mooringCountryError === false &&
      this.state.mooringCountyError === false &&
      // this.state.mooringLocationError === false &&
      this.state.mooringLocationTypeError === false &&
      this.state.mooringCoordinatesError === false &&
      this.state.mooringZoneTypeError === false &&
      this.state.mooringLoadingError === false &&
      this.state.mooringApprovalError === false
      // this.state.mooringNotesError === false
    ) {
      let data =
      {
        MooringGuideId: this.state.MooringGuideId,
        mooringName: this.state.mooringName,
        mooringType: this.state.mooringType,
        mooringCountry: this.state.mooringCountry,
        mooringCounty: this.state.mooringCounty,
        mooringLocation: this.state.mooringLocation,
        mooringLocationType: this.state.mooringLocationType,
        latitude: this.state.latitude.toFixed(3),
        longitude: this.state.longitude.toFixed(3),
        mooringZone: this.state.mooringZone,
        mooringLoading: this.state.mooringLoading,
        mooringApproval: (this.state.mooringApproval == 'Yes') ? (true) : (false),
        mooringNotes: this.state.mooringNotes
      };
      api.post('api/addUpdateMooringGuide', data).then(res => {
        console.log("ressssss", res);
        if (res.success) {
          debugger
          toast.success('Mooring Guide added successfully');
          this.goBckToListingPage();
          this.reset();
        } else {

        }
      }).catch(err => {
      });

    } else {
      this.show("mooringName", this.state.mooringNameError);
      this.show("mooringType", this.state.mooringTypeError);
      this.show("mooringCountry", this.state.mooringCountryError);
      this.show("mooringCounty", this.state.mooringCountyError);
      // this.show("mooringLocation", this.state.mooringLocationError);
      this.show("mooringLocationType", this.state.mooringLocationTypeError);
      this.show("mooringCoordinates", this.state.mooringCoordinatesError);
      this.show("mooringZone", this.state.mooringZoneTypeError);
      this.show("mooringLoading", this.state.mooringLoadingError);
      this.show("mooringApproval", this.state.mooringApprovalError);
      // this.show("mooringNotes", this.state.mooringNotesError);
    }
  }

  cancelMooringGuide() {
    this.setState({
      mooringName: '', mooringType: '', mooringCountry: '', mooringCounty: '', mooringLocation: '',
      mooringLocationType: '', mooringCoordinates: '', mooringLoading: '', mooringApproval: '',
      mooringNotes: ''
    })
  }

  getLatLong = (e) => {
    this.setState({ mooringCoordinates: e.latLng.lat().toFixed(3) + ", " + e.latLng.lng().toFixed(3), latitude: e.latLng.lat(), longitude: e.latLng.lng(), mooringCoordinatesError: false });
  }

  deleteMooringGuide = (MooringGuideId) => {
    api.post('api/deleteMooringGuide', { MooringGuideId: MooringGuideId }).then(res => {
      if (res.success) {
        toast.success('Mooring guide deleted successfully');
        this.goBckToListingPage();
      } else {

      }
    }).catch(err => {
    });
  }

  render() {
    return (
      <div>
        <div className="basic-header">
          <h1>Add Mooring Guide</h1>
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
                          <Col md="6">
                            <label>{this.state.mooringname}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="text" name="mooringName" id="mooringName" onChange={(e) => this.handleChange(e)} value={this.state.mooringName}>
                              </Input>
                              <em className="error invalid-feedback" >Please enter other information</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringtype}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectType(e.target.value, 'mooringType')} value={this.state.mooringType}>
                                <option value=''>Select Mooring Type</option>
                                {this.state.mooringTypearr.map((type, i) => {
                                  return (<option value={type.label}>{type.value}</option>)
                                })
                                }
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring type</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringcountry}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="select" name="mooringCountry" id="mooringCountry" onChange={(e) => this.selectType(e.target.value, 'mooringCountry')} value={this.state.mooringCountry}>
                                <option value=''>Select Country</option>
                                {this.state.mooringCountryarr.map((type, i) => {
                                  return (<option value={type.key}>{type.label}</option>)
                                })
                                }
                              </Input>
                              <em className="error invalid-feedback" >Please select country</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringcounty}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="text" name="mooringCounty" id="mooringCounty" onChange={(e) => this.handleChange(e)} value={this.state.mooringCounty}>
                              </Input>
                              <em className="error invalid-feedback" >Please enter county</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringlocation}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="text" name="mooringLocation" id="mooringLocation" onChange={(e) => this.handleChange(e)} value={this.state.mooringLocation}>
                              </Input>
                              <em className="error invalid-feedback" >Please enter location</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringlocationType}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="select" name="mooringLocationType" id="mooringLocationType" onChange={(e) => this.selectType(e.target.value, 'mooringLocationType')} value={this.state.mooringLocationType}>
                                <option value=''>Select Location Type</option>
                                {this.state.mooringLocationTypearr.map((type, i) => {
                                  return (<option value={type.label}>{type.value}</option>)
                                })
                                }
                              </Input>
                              <em className="error invalid-feedback" >Please select location type</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringcoordinates}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input disabled type="text" name="mooringCoordinates" id="mooringCoordinates" onChange={(e) => this.handleChange(e)} value={this.state.mooringCoordinates}>
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring co-ordinates from the map</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringzone}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="select" name="mooringZone" id="mooringZone" onChange={(e) => this.selectType(e.target.value, 'mooringZone')} value={this.state.mooringZone}>
                                <option value=''>Select Zone</option>
                                {this.state.mooringZoneTypearr.map((type, i) => {
                                  return (<option value={type.label}>{type.value}</option>)
                                })
                                }
                              </Input>
                              <em className="error invalid-feedback" >Please select zone</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringloading}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="text" name="mooringLoading" id="mooringLoading" onChange={(e) => this.handleChange(e)} value={this.state.mooringLoading}>
                              </Input>
                              <em className="error invalid-feedback" >Please enter mooring loading</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringapproval}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input type="select" name="mooringApproval" id="mooringApproval" onChange={(e) => this.selectType(e.target.value, 'mooringApproval')} value={this.state.mooringApproval}>
                                <option value=''>Select Mooring Approval</option>
                                {this.state.mooringApprovalarr.map((type, i) => {
                                  return (<option value={type.label}>{type.value}</option>)
                                })
                                }
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring approval</em>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringnotes}</label>
                          </Col>
                          <Col md="6">
                            <Input type="textarea" name="mooringNotes" id="mooringNotes" onChange={(e) => this.handleChange(e)} value={this.state.mooringNotes}>
                            </Input>
                            <em className="error invalid-feedback" >Please enter mooring notes</em>
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
                        <MyMapComponent
                          isMarkerShown={this.state.isMarkerShown}
                          getPosition={(e) => this.getLatLong(e)}
                          latitude={this.state.latitude}
                          longitude={this.state.longitude}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Col md="12">
                <div style={{ margin: "15px" }}>
                  <Row >
                    <div>

                      <Button color="success" onClick={() => this.saveMooringGuide()}><i class="fa fa-check"></i> Save</Button>{' '}
                      {(this.state.isEdit == true) ? (
                        <Button color="danger" onClick={() => this.deleteMooringGuide(this.state.MooringGuideId)}><i class="fa fa-times"></i> Delete</Button>
                      ) : (
                          null
                        )}
                      {' '}<Button color="primary" onClick={() => this.cancelMooringGuide()}><i class="fa fa-angle-left"></i> Cancel</Button>
                    </div>
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

export default AddMooringGuide;