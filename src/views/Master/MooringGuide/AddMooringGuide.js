/* eslint-disable no-undef */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import { MultiSelect } from 'primereact/multiselect';
import { Container, Form, Col, Row, Input, Card, CardBody, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../../utils/constants';
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCMQQ0t3ArJGJlKkURVXKCkDZvJ0IQIsuo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      console.log("sdv=vd=v=dsvd=vsdv=props", this.props);
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          // lat: 41.9, lng: -87.624
          lat: this.props.latitude, lng: this.props.longitude
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          console.log("sdv=vd=v=dsvd=vsdv=nextMarkers", nextMarkers);
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <div>
    {console.log("sdv=vd=v=dsvd=vsdv=", props, typeof props.center.lat)}
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={8}
      center={(typeof props.center.lat === "number") ?
        ({ lat: props.latitude != props.center.lat ? parseFloat(props.latitude) : props.center.lat, lng: props.longitude != props.center.lng ? parseFloat(props.longitude) : props.center.lng })
        : ({ lat: props.center.lat(), lng: props.center.lng() })}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search your place here"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </SearchBox>
      {props.isMarkerShown && <Marker onDragEnd={(e) => props.getPosition(e)}
        draggable={true}
        position={(props.markers.length) ? (props.markers[0].position) : { lat: parseFloat(props.latitude), lng: parseFloat(props.longitude) }}
      />
      }
    </GoogleMap>
  </div>
)

class AddMooringGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MooringGuideId: '',

      mooringname: 'Name *',
      mooringName: '',
      mooringNameError: true,

      mooringtype: 'Mooring Type *',
      mooringType: '',
      mooringTypearr: [],
      mooringTypeError: true,

      mooringcountry: 'Country *',
      mooringCountry: '',
      mooringCountryarr: [],
      mooringCountryError: true,

      mooringcounty: 'County / Region *',
      mooringCounty: '',
      mooringCountyError: true,

      mooringlocation: 'Location',
      mooringLocation: '',
      mooringLocationError: true,

      mooringlocationType: 'Location Type *',
      mooringLocationType: '',
      mooringLocationTypearr: [],
      mooringLocationTypeError: true,

      mooringcoordinates: 'Coordinates',
      mooringCoordinates: '',
      mooringCoordinatesError: true,

      mooringzone: 'Zone',
      mooringZone: '',
      mooringZoneTypearr: [],
      mooringTypearrCp: [],
      mooringZoneTypeError: true,

      mooringloading: 'Loading (%) *',
      mooringLoading: '',
      mooringLoadingError: true,

      mooringapproval: 'Approval Required *',
      mooringApproval: '',
      mooringApprovalarr: [],
      mooringApprovalError: true,

      mooringnotes: 'Notes',
      mooringNotes: '',
      mooringNotesError: true,

      effectivedate: 'Effective Date *',
      effectiveDate: moment().format('YYYY-MM-DD'),
      effectiveDateError: false,

      arr: [],

      isMarkerShown: false,
      isEdit: false,
      isEnable: false,
      enableLatlng: false,
      isDeleteModel: false,

      latitude: null,
      latitudeError: true,
      longitude: null,
      longitudeError: true,

      defaultLat: 0,
      defaultLng: 0,

      LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
    };
  }

  componentDidMount() {
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.getMooringGuideData(this.props.match.params.Id);
    }
    this.getMooringGuide();
    this.getCountry();
    this.getmooringType();
    this.getLocationType();
    this.getApproval();
    this.getMooringZone();
    this.delayedShowMarker();
  }

  getMooringGuide() {
    api.post('api/getMooringGuide').then(res => {
      if (res.success) {
        var formattedData = [];
        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            MooringGuideId: res.data[i].MooringGuideId,
            MooringName: res.data[i].MooringName,
            mooring_Type: res.data[i].MooringType,
          });
        }
        this.setState({ arr: formattedData });
        console.log("handleChange", this.state.arr);
      } else {
        console.log("Else");

      }
    }).catch(err => {

    });
  }

  getMooringGuideData(Id) {
    var data = {
      MooringGuideId: Id,
    }
    api.post('api/getMooringGuideData', data).then(res => {
      if (res.success) {
        console.log("getMooringGuideData", res.data[0]);
        var Longitude = CommonConfig.isEmpty(res.data[0].Longitude) ? this.state.defaultLng : Number(res.data[0].Longitude);
        var Latitude = CommonConfig.isEmpty(res.data[0].Latitude) ? this.state.defaultLat : Number(res.data[0].Latitude);
        this.setState({
          MooringGuideId: CommonConfig.isEmpty(res.data[0].MooringGuideId) ? '' : res.data[0].MooringGuideId,
          isMarkerShown: true,
          mooringName: CommonConfig.isEmpty(res.data[0].MooringName) ? '' : res.data[0].MooringName,
          mooringCountry: CommonConfig.isEmpty(res.data[0].CountryId) ? '' : res.data[0].CountryId,
          mooringCounty: CommonConfig.isEmpty(res.data[0].Region) ? '' : res.data[0].Region,
          mooringLocation: CommonConfig.isEmpty(res.data[0].Location) ? '' : res.data[0].Location,
          mooringLocationType: CommonConfig.isEmpty(res.data[0].LocationType) ? '' : res.data[0].LocationType,
          mooringLoading: CommonConfig.isEmpty(res.data[0].LoadingPercent) ? 0 : res.data[0].LoadingPercent,
          mooringType: CommonConfig.isEmpty(res.data[0].MooringType) ? '' : res.data[0].MooringType,
          mooringApproval: CommonConfig.isEmpty(res.data[0].IsApprovalRequired) ? '' : ((res.data[0].IsApprovalRequired.data[0] === 0) ? 'No' : 'Yes'),
          mooringNotes: CommonConfig.isEmpty(res.data[0].Notes) ? '' : res.data[0].Notes,
          mooringCoordinates: Latitude + ' ,' + Longitude,
          mooringZone: CommonConfig.isEmpty(res.data[0].MooringZone) ? '' : res.data[0].MooringZone,
          mooringZoneDis: CommonConfig.isEmpty(res.data[0].MooringZone) ? '' : res.data[0].MooringZone,
          MooringZoneId: res.data[0].MooringZoneId,
          MooringZoneGuideId: res.data[0].MooringZoneGuideId,
          effectiveDate: moment().format('YYYY-MM-DD'),
          latitude: Latitude,
          longitude: Longitude,
          isEdit: true,

          mooringNameError: false, mooringCountryError: false, mooringCountyError: false, mooringLocationError: false, mooringLocationTypeError: false, mooringLoadingError: false, mooringTypeError: false, mooringApprovalError: false, mooringNotesError: false, mooringCoordinatesError: false, mooringZoneTypeError: false, effectiveDateError: false, latitudeError: false, longitudeError: false
        });
      }
      console.log("xfgxffg");
    }).catch(err => {
      console.log("err", err);
    });
    // }
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
              value: res.data[i].Description,
              isAdded: false,
            })
          }
          this.setState({ mooringTypearr: mooringtype, mooringTypearrCp: mooringtype });
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
      api.post('api/getMooringZoneLists').then(res => {
        console.log("getMooringZoneLists", res);
        if (res.success) {
          console.log("getMooringZoneLists", res.data);
          var mooringzone = [];
          for (let i = 0; i < res.data.length; i++) {
            mooringzone.push({
              label: res.data[i].MooringZoneName,
              value: res.data[i].MooringZoneId,
              MooringZoneGuideId: ''
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
    }, 3000)
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
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'mooringName') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringNameError: true });
        this.show("mooringName", true);
      } else {
        let invSpace = CommonConfig.RegExp.allowAllWithSpace;
        let mooringName = e.target.value;
        if (!invSpace.test(mooringName)) {
          this.setState({ mooringNameError: true });
          this.show("mooringName", true);
        } else {
          this.setState({ mooringNameError: false, mooringName: e.target.value });
          this.show("mooringName", false);

          let tempArr = this.state.mooringTypearr;
          for (var j = 0; j < tempArr.length; j++) {
            tempArr[j].isAdded = false;
          }
          var recordTemp = [];
          for (let i = 0; i < this.state.arr.length; i++) {
            if (this.state.arr[i].MooringName == mooringName) {
              recordTemp.push(
                this.state.arr[i].mooring_Type
              );
            }
          }
          for (let i = 0; i < recordTemp.length; i++) {
            let index = tempArr.findIndex(x => x.label === recordTemp[i]);
            if (index >= 0) {
              tempArr[index].isAdded = true;
            }
          }
          this.setState({ mooringTypearr: tempArr });
        }
      }
    }

    if (e.target.name === 'effectiveDate') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ effectiveDateError: true });
        this.show("effectiveDate", true);
      }  else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
        this.setState({ effectiveDateError: true });
        this.show("effectiveDate", true);
      }  else {
        this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
        this.show("effectiveDate", false);
      }
    }

    if (e.target.name === 'mooringCounty') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ mooringCountyError: true });
        this.show("mooringCounty", true);
      } else {
        let invSpace = CommonConfig.RegExp.allowAllWithSpace;
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
        let invSpace = CommonConfig.RegExp.allowAllWithSpace;
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
        let mooringLoadingRegEx = CommonConfig.RegExp.percentageWithNegative;
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
        let mooringNotesRegEx = CommonConfig.RegExp.allowAllWithSpace;
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

    if (e.target.name === 'latitude') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ latitudeError: true });
        this.show("latitude", true);
      } else {
        let latitudeRegEx = CommonConfig.RegExp.latlng;
        let latitude = e.target.value;
        if (!latitudeRegEx.test(latitude)) {
          this.setState({ latitudeError: true });
          this.show("latitude", true);
        } else {
          this.setState({ latitudeError: false, latitude: e.target.value });
          this.show("latitude", false);
        }
      }
    }

    if (e.target.name === 'longitude') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ longitudeError: true });
        this.show("longitude", true);
      } else {
        let longitudeRegEx = CommonConfig.RegExp.latlng;
        let longitude = e.target.value;
        if (!longitudeRegEx.test(longitude)) {
          this.setState({ longitudeError: true });
          this.show("longitude", true);
        } else {
          this.setState({ longitudeError: false, longitude: e.target.value });
          this.show("longitude", false);
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
      pathname: '/Master/MooringGuide'
    });
  }

  Save() {
    debugger
    if (
      this.state.mooringNameError === false &&
      this.state.mooringTypeError === false &&
      this.state.mooringCountryError === false &&
      this.state.mooringCountyError === false &&
      // this.state.mooringLocationError === false &&
      this.state.mooringLocationTypeError === false &&
      this.state.mooringLoadingError === false &&
      this.state.mooringApprovalError === false &&
      this.state.effectiveDateError === false
      // &&
      // this.state.isEnable == true ? this.state.mooringZoneTypeError === false : ''
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
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        mooringLoading: this.state.mooringLoading,
        mooringApproval: (this.state.mooringApproval == 'Yes') ? (true) : (false),
        mooringNotes: this.state.mooringNotes,
        effectiveDate: this.state.effectiveDate,
        LoggedInUserId: CommonConfig.loggedInUserId()
      };
      console.log('MooringGuide', data);
      
      api.post('api/addUpdateMooringGuide', data).then(res => {
        console.log("ressssss", res);
        if (res.success) {
          // debugger
          toast.success('Mooring Guide added successfully');
          // this.goBckToListingPage();
          // this.reset();
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
      // if (this.state.isEnable == true) {
      //   this.show("mooringZone", this.state.mooringZoneTypeError);
      // }
      this.show("mooringLoading", this.state.mooringLoadingError);
      this.show("mooringApproval", this.state.mooringApprovalError);
      this.show("effectiveDate", this.state.effectiveDateError);
    }
  }

  cancelMooringGuide() {
    this.setState({
      mooringName: '', mooringType: '', mooringCountry: '', mooringCounty: '', mooringLocation: '',
      mooringLocationType: '', mooringCoordinates: '', mooringLoading: '', mooringApproval: '',
      mooringNotes: ''
    })
    this.props.history.push({
      pathname: '/Master/MooringGuide'
    });
  }

  getLatLong = (e) => {
    this.setState({ mooringCoordinates: e.latLng.lat().toFixed(3) + ", " + e.latLng.lng().toFixed(3), latitude: e.latLng.lat(), longitude: e.latLng.lng(), mooringCoordinatesError: false });
  }

  deleteMooringGuide() {
    this.setState({ isDeleteModel: true });
  }

  mulSelVal = (e) => {
    console.log("mulSelVal", e);
    if (e.value.length == 0) {
      this.setState({ mooringZoneTypeError: true, mooringZone: e.value, });
      this.show('mooringZone', true);
    } else {
      this.setState({ mooringZoneTypeError: false, mooringZone: e.value });
      this.show('mooringZone', false);
    }
    // console.log("Afdsas", this.state.Task_Followers);

  }

  editZone(task) {
    if (task == "view") {
      this.setState({ isEnable: false });
      // window.location.reload();
    } else {
      this.setState({ isEnable: true, mooringZoneTypeError: false });
      var zone_Id = CommonConfig.isEmpty(this.state.MooringZoneId) ? '' : this.state.MooringZoneId.split(',');
      var zoneGuide_Id = CommonConfig.isEmpty(this.state.MooringZoneGuideId) ? '' : this.state.MooringZoneGuideId.split(',');
      var newZone_Id = [];
      if (zone_Id.length > 0) {
        for (var i = 0; i < zone_Id.length; i++) {
          var record = this.state.mooringZoneTypearr.find(x => x.value == zone_Id[i]);
          record.MooringZoneGuideId = zoneGuide_Id[i];
          console.log("editZone", record);
          newZone_Id.push(record);
        }
      }
      this.setState({ mooringZone: newZone_Id });
    }
  }

  editLatlng(task) {
    if (task == "view") {
      this.setState({ enableLatlng: false });
      // window.location.reload();
    } else {
      this.setState({ enableLatlng: true });
    }
  }

  cancelMooringZone() {
    this.setState({ isEnable: false });
    // window.location.reload();
  }

  editMooringZone() {
    try {
      var data = {
        mooringZone: this.state.mooringZone,
        MooringGuideId: this.props.match.params.Id,
        CurrentUser: CommonConfig.loggedInUserId(),
        LanguageId: this.state.LanguageId,
      }
      console.log('mooringZone',data);      
      api.post('api/updateMooringZone', data).then(res => {
        console.log("editMooringZone", res);
        if (res.success == true) {
          toast.success('Mooring Zone updated successfully');
          setTimeout(function () {
            window.location.reload();
          }, 600);
        }
      });
    } catch (error) {
      console.log("editMooringZone", error);
    }

  }

  toggleLarge = () => {
    this.setState({
      isDeleteModel: false,
      MooringGuideId: '',
      mooringName: ''
    });
  }

  Delete() {
    try {
      let data = {
        MooringGuideId: this.state.MooringGuideId,
        CreatedBy: CommonConfig.loggedInUserId()
      }
      console.log("Delete", data);
      api.post('api/deleteMooringGuide', data).then(res => {
        if (res.success) {
          this.toggleLarge();
          toast.success("MooringGuide deleted successfully");
          this.cancelMooringGuide();
        }
      })
    } catch (error) {
      console.log("error", error);
    }
  }

  render() {
    // console.log("sdv=dsv=dv=v=", this.state.mooringZone);
    return (
      <div>
        <div className="basic-header">
          <h1> {this.state.isEdit ? "Edit Mooring Guide" : "Add Mooring Guide"} </h1>
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
                              <Input placeholder="Name" type="text" name="mooringName" id="mooringName" onChange={(e) => this.handleChange(e)} value={this.state.mooringName}>
                              </Input>
                              <em className="error invalid-feedback" >Please enter valid mooring name</em>
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
                                  if (!type.isAdded) {
                                    return (<option value={type.label}>{type.value}</option>)
                                  }
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
                              <Input placeholder="County / Region" type="text" name="mooringCounty" id="mooringCounty" onChange={(e) => this.handleChange(e)} value={this.state.mooringCounty}>
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
                              <Input placeholder="Location" type="text" name="mooringLocation" id="mooringLocation" onChange={(e) => this.handleChange(e)} value={this.state.mooringLocation}>
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
                          <Col md="3">
                            <label>{this.state.mooringcoordinates}</label>
                          </Col>
                          <Col md="2">
                            <div>
                              <label>Lat.</label>
                            </div>
                            <div style={{ marginTop: 15 }}>
                              <label>Lng.</label>
                            </div>
                          </Col>
                          {(this.state.isEdit) ? (
                            <Col md="1">
                              <Button style={{ float: "right", marginBottom: "10px" }} color="primary"
                                onClick={this.state.enableLatlng ? () => this.editLatlng("view") : () => this.editLatlng("edit")}
                                title={this.state.enableLatlng ? "View" : "Edit"}
                              >
                                <i className={this.state.enableLatlng ? "fa fa-eye" : "fa fa-pencil"}></i>
                              </Button>
                            </Col>
                          ) : (
                              <Col md="1">
                              </Col>
                            )}


                          {/* <Col md="1">
                            {(this.state.enableLatlng == true) ? (
                              <Button onClick={() => this.editMooringLatlng()} style={{ marginLeft: 5 }} color="primary">
                                <i className="fa fa-check"></i>
                              </Button>
                            ) : (
                                null
                              )}
                          </Col> */}


                          <Col md="6">
                            <div>
                              <Input disabled={this.state.isEdit ? (this.state.enableLatlng == false) : (this.state.enableLatlng == true)} type="text" name="latitude" id="latitude" onChange={(e) => this.handleChange(e)} value={this.state.latitude}>
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring co-ordinates from the map</em>
                            </div>

                            <div style={{ marginTop: 5 }}>
                              <Input disabled={this.state.isEdit ? (this.state.enableLatlng == false) : (this.state.enableLatlng == true)} type="text" name="longitude" id="longitude" onChange={(e) => this.handleChange(e)} value={this.state.longitude}>
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring co-ordinates from the map</em>
                            </div>

                          </Col>
                          {/* <Col md="3">
                            <div>
                              <Input disabled={this.state.enableLatlng == false} type="text" name="longitude" id="longitude" onChange={(e) => this.handleChange(e)} value={this.state.longitude}>
                              </Input>
                              <em className="error invalid-feedback" >Please select mooring co-ordinates from the map</em>
                            </div>
                          </Col> */}
                        </Row>
                      </div>

                      {(this.state.isEdit) ? (
                        <div>
                          <div className="input-box">
                            <Row>
                              <Col md="5">
                                <label>{this.state.mooringzone}</label>
                              </Col>
                              <Col md="1">
                                <Button style={{ float: "right", marginBottom: "10px" }} color="primary"
                                  onClick={this.state.isEnable ? () => this.editZone("view") : () => this.editZone("edit")}
                                  title={this.state.isEnable ? "View" : "Edit"}
                                >
                                  <i className={this.state.isEnable ? "fa fa-eye" : "fa fa-pencil"}></i>
                                </Button>
                              </Col>
                              {this.state.isEnable == true ? (
                                <Col md="6">
                                  <div>
                                    {/* <label>{this.state.mooringZone}</label> */}
                                    <MultiSelect name="mooringZone" id="mooringZone" optionLabel="label" value={this.state.mooringZone} options={this.state.mooringZoneTypearr} style={{ width: '233px' }}
                                      onChange={(e) => this.mulSelVal(e) } /*onBlur={() => this.editMooringZone()}*/
                                      filter={true} />
                                  </div>
                                </Col>
                              ) : (
                                  <Col md="6">
                                    <div>
                                      <label>{this.state.mooringZoneDis}</label>
                                    </div>
                                  </Col>
                                )}
                            </Row>
                          </div>


                          <div>
                            {this.state.isEnable == true ? (
                              <Row>
                                <Col md="6">
                                </Col>
                                <Col md="6">
                                  <Button className="p-button p-component p-button-icon-only" onClick={() => this.editMooringZone()} style={{ marginLeft: 5 }} color="warning">
                                    <i className="fa fa-check"></i>
                                  </Button>
                                  <Button className="p-button p-component p-button-icon-only" onClick={() => this.cancelMooringZone()} style={{ marginLeft: 5 }} color="danger">
                                    <i className="fa fa-times"></i>
                                  </Button>
                                </Col>
                              </Row>
                            ) : (null)}
                          </div>
                        </div>
                      ) : (null)}

                      <div className="input-box">
                        <Row style={{ marginTop: 10 }}>
                          <Col md="6">
                            <label>{this.state.mooringloading}</label>
                          </Col>
                          <Col md="6">
                            <div>
                              <Input placeholder="Loading (%)" type="text" name="mooringLoading" id="mooringLoading" onChange={(e) => this.handleChange(e)} value={this.state.mooringLoading}>
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
                            <Input placeholder="Notes" type="textarea" name="mooringNotes" id="mooringNotes" onChange={(e) => this.handleChange(e)} value={this.state.mooringNotes}>
                            </Input>
                            <em className="error invalid-feedback" >Please enter mooring notes</em>
                          </Col>
                        </Row>
                      </div>

                      <div className="input-box">
                        <Row>
                          <Col md="6">
                            <label>{this.state.effectivedate}</label>
                          </Col>
                          <Col md="6">
                            <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                              min={moment().format('YYYY-MM-DD')}
                              max={moment().add(100, 'years').format('YYYY-MM-DD')}
                            />
                            <em className="error invalid-feedback" >Please enter effective date</em>
                          </Col>
                        </Row>
                      </div>

                    </CardBody>
                  </Card>
                </Col>

                <Col md="6">
                  <Card>
                    <CardBody>
                      {(!CommonConfig.isEmpty(this.state.latitude) && !CommonConfig.isEmpty(this.state.longitude)) ? (
                        <div className="input-box">
                          <MyMapComponent
                            isMarkerShown={this.state.isMarkerShown}
                            getPosition={(e) => this.getLatLong(e)}
                            latitude={parseFloat(this.state.latitude)}
                            longitude={parseFloat(this.state.longitude)}
                          />
                        </div>
                      ) : (
                          null
                        )}


                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Col md="12">
                <div style={{ margin: "15px" }}>
                  <Row >
                    <div>

                      <Button color="success" onClick={() => this.Save()}><i class="fa fa-check"></i> Save</Button>{' '}
                      {(this.state.isEdit == true) ? (
                        <Button color="danger" onClick={() => this.deleteMooringGuide()}><i class="fa fa-times"></i> Delete</Button>
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
        <Modal isOpen={this.state.isDeleteModel} toggle={this.toggleLarge}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleLarge}>Delete MooringGuide</ModalHeader>
          <ModalBody>
            Are you sure, You want to delete this MooringGuide {this.state.mooringName}?
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

export default withTranslation() (AddMooringGuide);