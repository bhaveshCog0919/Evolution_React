import React, { Component } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Container, Form, Col, Row, Input, Card, CardBody, NavLink, Button } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { CommonConfig } from '../../utils/constants';
// import { MultiSelect } from 'primereact/multiselect';

const MyMapComponent = compose(
  withProps({
    googleMapURL: CommonConfig.googleMapApiDetails.apiURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    center={{ lat: props.latitude, lng: props.longitude }}
  >
    {props.isMarkerShown && <Marker onDragEnd={(e) => props.getPosition(e)}
      position={{ lat: props.latitude, lng: props.longitude }} />}
  </GoogleMap>
)

class Mooring extends Component {
  constructor(props) {
    super(props);

    this.state = {

      mooringvesselregistered: "Is the Vessel Registrered ?",
      checked: false,

      PolicyMooringNavigationId: '',

      mooringboatReg: 'Where is the boat Registered?*',
      mooringBoatReg: '',
      newMooringBoatReg: '',
      mooringBoatRegyarr: [],
      mooringBoatRegError: true,

      mooringregNo: 'Registration No',
      mooringRegNo: '',
      mooringRegNoError: true,

      isLaidAshore: '',
      isLaidAshoreError: true,

      mooringboatMoored: 'Where is the boat Moored?*',
      mooringBoatMoored: '',
      newMooringBoatMoored: '',
      mooringBoatMooredarr: [],
      boatMooredRes: [],
      mooringBoatMooredError: true,

      mooringtype: 'Mooring Type*',
      mooringType: '',
      newMooringType: '',
      mooringTypearr: [],
      mooringTypeError: true,

      CruisingRange: '',
      newCruisingRange: '',
      CruisingRangearr: [],
      CruisingRangeError: true,

      OtherInformation: '',
      OtherInformationError: true,

      mooringTypeRes: [],
      country: '',
      location: '',
      locationType: '',
      coOrdinates: '',
      zone: '',
      loadings: '',
      approvalRequired: '',
      notes: '',

      mooringCountry: 'Country',
      mooringCounty: 'County/Region',
      mooringLocation: 'Location',
      mooringLocationType: 'Location Type',
      mooringCoOrdinates: 'Coordinates',
      mooringZone: 'Zone',
      mooringLoadings: 'Loading (%)',
      mooringApproval: 'Approval Required',
      mooringnotes: 'Notes',

      latitude: 40.75636,
      longitude: 14.01457,
      isMarkerShown: true,

      isEdit: false,

      policyStatus: '',
      CurrencySymbol: ''
    };
  }

  componentDidMount() {
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
    }
    this.getMooringData();
    this.getCountry();
    this.getMooringZones();
    this.getCruisingRange();
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    })
  }

  getLatLong = (e) => {
    this.setState({ coOrdinates: e.latLng.lat().toFixed(3) + ", " + e.latLng.lng().toFixed(3), latitude: e.latLng.lat(), longitude: e.latLng.lng(), mooringCoordinatesError: false });
  }

  getMooringData() {
    try {
      let data = {
        PolicyId: this.props.match.params.id //'bef076c0-2ea5-11ea-a563-fa163eb9754c',
      }
      api.post('api/getMooringList', data).then(res => {
        if (res.success) {
          console.log("getMooringListgetMooringList", res.data);

          if (res.data.length) {
            this.getmooringType(res.data[0].MooringName, res.data[0].MooringType);
            var mooringRegNo = (res.data[0].VesselRegistrationNumber == '' || res.data[0].VesselRegistrationNumber == undefined || res.data[0].VesselRegistrationNumber == undefined || res.data[0].VesselRegistrationNumber == "null") ? '' : res.data[0].VesselRegistrationNumber
            this.setState({
              mooringBoatReg: res.data[0].VesselRegistrationLocation,
              mooringRegNo: mooringRegNo,
              mooringBoatMoored: res.data[0].MooringName,
              mooringType: res.data[0].MooringType,
              CruisingRange: res.data[0].CruisingRange,
              OtherInformation: res.data[0].AdditionalCruisingRange,
              isLaidAshore: ((res.data[0].IsLaidUpAshore) != null ? ((res.data[0].IsLaidUpAshore.data[0] == 0) ? false : true) : false),

              newMooringBoatReg: res.data[0].VesselRegistrationLocation,
              newMooringBoatMoored: res.data[0].MooringName,
              newCruisingRange: res.data[0].CruisingRange,

              mooringBoatRegError: CommonConfig.isEmpty(res.data[0].VesselRegistrationLocation) ? true : false,
              mooringBoatMooredError: CommonConfig.isEmpty(res.data[0].MooringName) ? true : false,
              CruisingRangeError: CommonConfig.isEmpty(res.data[0].CruisingRange) ? true : false
            });
          }
        } else {

        }
      }).catch(err => {
        console.log("err...", err);
      });
    } catch (error) {
      console.log("error", error);
    }
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
              label: res.data[i].StringMapName,
              value: res.data[i].StringMapKey
            })
          }
          this.setState({ mooringBoatRegyarr: Country });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getCruisingRange() {
    try {
      const data = {
        stringmaptype: 'CRUISINGRANGE',
        orderby: 'SortOrder'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var CruisingRange = [];
          for (let i = 0; i < res.data.length; i++) {
            CruisingRange.push({
              label: res.data[i].Description,
              value: res.data[i].StringMapKey
            })
          }
          this.setState({ CruisingRangearr: CruisingRange });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  getMooringZones() {
    try {
      const data = {
        zone: 'Irish Website',
      };
      api.post('api/getMooringLocation', data).then(res => {
        console.log("getMooringLocation", res);
        if (res.success) {
          console.log("getMooringLocation", res.data);
          let Locations = [];
          for (let i = 0; i < res.data.length; i++) {
            Locations.push({
              label: res.data[i].MooringName,
              value: res.data[i].MooringName,
            })
          }
          this.setState({ mooringBoatMooredarr: Locations, boatMooredRes: res.data });
        } else {
          console.log("Else");
        }
      }).catch(err => {
        console.log("errrr", err);
      });
    } catch (error) {
      console.log("errrr", error);
    }
  }

  selectType(value, type) {

    if (type === 'mooringBoatReg') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ mooringBoatRegError: true, mooringBoatReg: value });
        this.show('', true);
      } else {
        this.setState({ mooringBoatRegError: false, mooringBoatReg: value.value });
        this.show('mooringBoatReg', false);
      }
      // this.setState({ newMooringBoatReg: this.state.mooringBoatReg });
    }

    if (type === 'mooringBoatMoored') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ mooringBoatMooredError: true, mooringBoatMoored: value });
        this.show('', true);
      } else {
        this.setState({ mooringBoatMooredError: false, mooringBoatMoored: value.value });
        this.getmooringType(value.value,'');
        this.show('mooringBoatMoored', false);
      }
      // this.setState({ newMooringBoatMoored: this.state.mooringBoatMoored });
    }

    if (type === 'mooringType') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ mooringTypeError: true, mooringType: value });
        this.show('mooringType', true);
      } else {
        this.setState({ mooringTypeError: false, mooringType: value });
        this.getmooringTypeRes(value);
        this.show('mooringType', false);
      }
      // this.setState({ newMooringType: this.state.mooringType });
    }

    if (type === 'CruisingRange') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ CruisingRangeError: true, CruisingRange: value });
        this.show('', true);
      } else {
        this.setState({ CruisingRangeError: false, CruisingRange: value.value });
        this.show('CruisingRange', false);
      }
    }
    // this.setState({ newCruisingRange: this.state.CruisingRange });
  }

  getmooringType(value, type) {

    try {
      let data = {
        zone: 'Irish Website',
        mooringName: value
      }
      api.post('api/getMooringTypeByMooringName', data).then(res => {
        if (res.success) {
          console.log("getMooringTypeByMooringName", res.data);
          var mooringTypeArr = [];
          for (var i = 0; i < res.data.length; i++) {
            mooringTypeArr.push({
              label: res.data[i].MooringType,
              value: res.data[i].MooringType,
            })
          }
          this.setState({ mooringTypearr: mooringTypeArr });

          if (res.data[0]) {
            if (type != '') {
              this.selectType(type, 'mooringType');
            } else {
              this.selectType(res.data[0].MooringType, 'mooringType');
            }
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  getmooringTypeRes(value) {
    try {

      var mooringName = this.state.mooringBoatMoored;
      if (mooringName.value === '' || mooringName.value === undefined || mooringName.value === null) {
        mooringName = mooringName;
      } else {
        mooringName = mooringName.value;
      }

      let data = {
        zone: 'Irish Website',
        mooringName: mooringName,
        mooringTypeRes: value
      }
      api.post('api/getRemainingData', data).then(res => {
        if (res.success) {
          console.log("getRemainingData", res.data);
          this.setState({
            country: CommonConfig.isEmpty(res.data[0].countryName) ? ("N/A") : (res.data[0].countryName),
            location: CommonConfig.isEmpty(res.data[0].Location) ? ("N/A") : (res.data[0].Location),
            locationType: CommonConfig.isEmpty(res.data[0].LocationType) ? ("N/A") : (res.data[0].LocationType),
            zone: CommonConfig.isEmpty(res.data[0].MooringZoneName) ? ("N/A") : (res.data[0].MooringZoneName),
            loadings: CommonConfig.isEmpty(res.data[0].LoadingPercent) ? ("N/A") : (res.data[0].LoadingPercent.toFixed(2)),
            approvalRequired: (res.data[0].IsApprovalRequired.data[0] == 0) ? ("NO") : ("YES"),
            notes: CommonConfig.isEmpty(res.data[0].Notes) ? ("N/A") : (res.data[0].Notes),
            coOrdinates: res.data[0].Longitude + " , " + res.data[0].Latitude,
            isMarkerShown: true, latitude: parseFloat(res.data[0].Latitude), longitude: parseFloat(res.data[0].Longitude),
            // latitude: selectedMooringType.Latitude, longitude: selectedMooringType.Longitude
          });
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  handleChange = (e) => {
    console.log(this.state);

    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'mooringRegNo') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringRegNoError: true });
        this.show("mooringRegNo", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ mooringRegNoError: true });
          this.show("mooringRegNo", true);
        } else {
          this.setState({ mooringRegNoError: false, mooringRegNo: e.target.value });
          this.show("mooringRegNo", false);
        }
      }
    }

    if (e.target.name === 'OtherInformation') {
      if (CommonConfig.isEmpty(e.target.value)) {
        // this.setState({ OtherInformationError: true });
        // this.show("OtherInformation", true);
      } else {
        this.setState({ OtherInformationError: false, OtherInformation: e.target.value });
        this.show("OtherInformation", false);
      }
    }

    if (e.target.name === 'isLaidAshore') {
      this.setState({ isLaidAshore: e.target.checked ? 1 : 0, isLaidAshoreError: false });
    }
  }

  // show(field, condition) {
  //   if (condition) {
  //     document.getElementById(field).className = "form-control is-invalid";
  //   } else {
  //     document.getElementById(field).className = "form-control";
  //   }
  // }

  show(field, condition, errorField, message) {
    if (condition) {
      if (document.getElementById(field))
        document.getElementById(field).className = "form-control is-invalid";

      if (document.getElementById(errorField))
        document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
    } else {
      if (document.getElementById(field))
        document.getElementById(field).className = "form-control";

      if (document.getElementById(errorField))
        document.getElementById(errorField).innerHTML = null;
    }
  }

  savePolicyMooring() {
    try {
      if (
        this.state.mooringBoatRegError === false &&
        this.state.mooringBoatMooredError === false &&
        this.state.mooringTypeError === false &&
        this.state.CruisingRangeError === false
      ) {
        let data = {
          PolicyId: this.props.match.params.id,
          mooringBoatReg: this.state.mooringBoatReg,
          mooringRegNo: this.state.mooringRegNo,
          mooringBoatMoored: this.state.mooringBoatMoored,
          mooringType: this.state.mooringType,
          CruisingRange: this.state.CruisingRange,
          AdditionalCruisingRange: this.state.OtherInformation,
          IsLaidUpAshore: this.state.isLaidAshore,
        }
        console.log("savePolicyMooring", data);
        api.post('api/addUpdateMooringTabData', data).then(res => {
          if (res.success) {
            var firstRes = res;
            let secondData = {
              policyId: this.props.match.params.id,
              CurrentUser: CommonConfig.loggedInUserId(),
            }
            api.post('api/isPolicyReferred', secondData).then(res => {
              if (res.success) {
                if (this.state.newMooringBoatMoored !== this.state.mooringBoatMoored || this.state.newMooringBoatReg !== this.state.mooringBoatReg ||
                  this.state.newCruisingRange !== this.state.CruisingRange) {
                  let thirdData = {
                    policyId: this.props.match.params.id,
                    CurrentUser: CommonConfig.loggedInUserId(),
                  }
                  api.post('api/AddNoteMooring', thirdData).then(res => {
                    if (res.success) {
                      let fourthData = {
                        policyId: this.props.match.params.id,
                        IsRenewal: 0,
                        CurrentUser: CommonConfig.loggedInUserId()
                      }
                      api.post('api/recomputePremium', fourthData).then(res => {
                        if (res.success) {

                          if (CommonConfig.isEmpty(res.data.returnValue)) {
                            toast.success('Mooring data added successfully');
                            setTimeout(function () {
                              window.location.reload();
                            }, 1000);
                          }
                          else {
                            toast.error("There was an error while calculating the premium. " + res.data.returnValue);
                          }
                        } else {
                          console.log('error');

                        }
                      }).catch(err => {

                      });
                    }
                  });
                } else {
                  let fourthData = {
                    policyId: this.props.match.params.id,
                    IsRenewal: 0,
                    CurrentUser: CommonConfig.loggedInUserId()
                  }
                  api.post('api/recomputePremium', fourthData).then(res => {
                    if (res.success) {

                      if (CommonConfig.isEmpty(res.data.returnValue)) {
                        toast.success('Mooring data added successfully');
                        setTimeout(function () {
                          window.location.reload();
                        }, 1000);
                      }
                      else {
                        toast.error("There was an error while calculating the premium. " + res.data.returnValue);
                      }
                    } else {
                      console.log('error');

                    }
                  }).catch(err => {

                  });
                }
              }
            }).catch(err => {
              console.log("error", err);
            });
          } else {

          }
        }).catch(err => {
          console.log("error", err);
        });

      } else {
        if (this.state.mooringBoatRegError != false) {
          toast.error("Please select Where is the boat Registered")
          return;
        }
        if (this.state.mooringBoatMooredError != false) {
          toast.error("Please select Where is the boat Moored")
          return;
        }
        if (this.state.mooringTypeError != false) {
          toast.error("Please select Mooring Type")
          return;
        }
        if (this.state.CruisingRangeError != false) {
          toast.error("Please select Cruising Range")
          return;
        }

      }
    } catch (error) {
      console.log("error", error);
    }
  }

  reset() {
    this.setState({
      checked: false, mooringBoatReg: '', mooringRegNo: '', mooringBoatMoored: '', CruisingRange: '', OtherInformation: ''
    })
  }

  isChecked = (e) => {
    // setState({ checked: e.checked });
    if (e.checked) {
      this.setState({ checked: e.checked });
    } else {
      this.setState({
        checked: false, mooringBoatReg: '', mooringRegNo: '', mooringBoatMoored: '', CruisingRange: '', OtherInformation: ''
      })
    }
  }

  goBack() {
    // this.props.history.push('/PolicyDetails');
    // this.getGeneralPolicy();
    this.getMooringData();
    this.setState({
      isEdit: false,
      mooringType: '',
    });
  }

  render() {
    return (
      <div>
        <Container>
          <Form encType="multipart/form-data" autoComplete="of">
            <Row>
              <Col md="6">
                <Card>
                  <CardBody>

                    <div>
                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringboatReg}</label>
                          </Col>

                          <Col md="6">
                            <Select name="mooringBoatReg" id="mooringBoatReg" options={this.state.mooringBoatRegyarr} value={this.state.mooringBoatReg} onChange={(data) => this.selectType(data, 'mooringBoatReg')} placeholder="Select country"
                            />
                            <em id="mooringBoatRegError" className="error invalid-feedback">Please enter where boat registered</em>

                            {/* <Input type="select" name="mooringBoatReg" id="mooringBoatReg" onChange={(e) => this.selectType(e.target.value, 'mooringBoatReg')} value={this.state.mooringBoatReg}>
                              <option value=''>Select country</option>
                              {this.state.mooringBoatRegyarr.map((type, i) => {
                                return (<option value={type.value} key={i}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please enter where boat registered</em> */}
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringregNo}</label>
                          </Col>

                          <Col md="6">
                            <Input type="text" name="mooringRegNo" id="mooringRegNo" onChange={(e) => this.handleChange(e)} value={this.state.mooringRegNo}>
                            </Input>
                            <em className="error invalid-feedback" >Please enter mooring registration no</em>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.mooringboatMoored}</label>
                          </Col>

                          <Col md="6">
                            <Select name="mooringBoatMoored" id="mooringBoatMoored" options={this.state.mooringBoatMooredarr} value={this.state.mooringBoatMoored} onChange={(data) => this.selectType(data, 'mooringBoatMoored')} placeholder="Select mooring location"
                            />
                            <em id="mooringBoatMooredError" className="error invalid-feedback">Please enter where boat moor</em>

                            {/* <Input type="select" name="mooringBoatMoored" id="mooringBoatMoored" onChange={(e) => this.selectType(e.target.value, 'mooringBoatMoored')} value={this.state.mooringBoatMoored}>
                              <option value=''>Select mooring location</option>
                              {this.state.mooringBoatMooredarr.map((type, i) => {
                                return (<option value={type.value} key={i}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please enter where boat moor</em> */}
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>Laid Up Ashore</label>
                          </Col>

                          <Col md="6">
                            <Input type="checkbox" name="isLaidAshore" id="isLaidAshore" onChange={(e) => this.handleChange(e)} value={this.state.isLaidAshore} checked={this.state.isLaidAshore == true ? true : false} value={this.state.isLaidAshore} style={{ marginLeft: "10px" }} />
                            <em id="isLaidAshoreError" className="error invalid-feedback">Please select is Laid Up Ashore</em>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div className="input-box">
                      <Row>
                        <Col md="6">
                          <label>{this.state.mooringtype}</label>
                        </Col>

                        <Col md="6">
                          <div>
                            <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectType(e.target.value, 'mooringType')} value={this.state.mooringType}>
                              {this.state.mooringTypearr.map((type, i) => {
                                return (<option value={type.value} key={i}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select mooring type</em>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {(CommonConfig.isEmpty(this.state.mooringType)) ? (
                      null
                    ) : (
                        <div>
                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringCountry}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.country}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringLocation}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.location}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringLocationType}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.locationType}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringCoOrdinates}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.coOrdinates}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringZone}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.zone}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringLoadings}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.loadings}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.mooringApproval}</label>
                              </Col>

                              <Col md="6">
                                <div>
                                  <label>{this.state.approvalRequired}</label>
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
                                <div>
                                  <label>{this.state.notes}</label>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      )}
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

              <Col md="12">
                <h5>Navigation Limits</h5>
                <Card>
                  <CardBody>
                    <div className="input-box">
                      <Row>
                        <Col md="12">
                          <label style={{ width: 'max-content', paddingRight: 15 }}>Cruising Range*</label>
                          {(this.state.isLaidAshore) ?
                            <i title="Laid Up Ashore" className='fa fa-anchor' style={{ fontSize: '20px', color: '#238C9A' }}></i>
                            : (null)}
                          <Select name="CruisingRange" id="CruisingRange" options={this.state.CruisingRangearr} value={this.state.CruisingRange} onChange={(data) => this.selectType(data, 'CruisingRange')} placeholder="Select Cruising Range" />
                          <em id="CruisingRangeError" className="error invalid-feedback">Please select cruising range</em>
                          {/*                           
                          <Input type="select" name="CruisingRange" id="CruisingRange" onChange={(e) => this.selectType(e.target.value, 'CruisingRange')} value={this.state.CruisingRange}>
                            <option value=''>Select Cruising Range</option>
                            {this.state.CruisingRangearr.map((type, i) => {
                              return (<option value={type.label}>{type.value}</option>)
                            })}
                          </Input>
                          <em className="error invalid-feedback" >Please select cruising range</em> */}
                        </Col>
                      </Row>
                    </div>

                    <div className="input-box">
                      <Row>
                        <Col md="12">
                          <label>Additional Cruising Range</label>
                          <Input type="textarea" name="OtherInformation" id="OtherInformation" onChange={(e) => this.handleChange(e)} value={this.state.OtherInformation}>
                          </Input>
                          <em className="error invalid-feedback" >Please enter other information</em>
                        </Col>
                      </Row>
                    </div>

                  </CardBody>
                </Card>
              </Col>

              {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                ? (<Col md="5" style={{ margin: "auto" }}>
                  <Button color="primary" onClick={() => this.goBack()}>
                    <i style={{ marginRight: "10px" }} className="fa fa-angle-left"></i>
                  Bak to PolicyList
                </Button>

                  <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.savePolicyMooring()}>
                    <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                  Save
                </Button>

                  <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.goBack()}>
                    <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                  Cancel
                </Button>
                </Col>)
                : (null)}
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

export default Mooring;