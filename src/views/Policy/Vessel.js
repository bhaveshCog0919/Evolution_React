import React, { Component } from 'react';
import Select from 'react-select';
import { Button } from 'primereact/button';
import DatePicker from 'react-date-picker';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container, Col, Row, Input, Card, CardHeader, CardBody, Collapse, Button as BTN, InputGroupAddon, InputGroupText, InputGroup } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import { toast } from 'react-toastify';
import { CommonConfig } from '../../utils/constants';
import PolicyDetail from '../Policy/PolicyDetails';

class Vessel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      custom: [false, false, false, false],
      isExpand: false,
      PolicyId: '',
      maxPolicyAmount: 0,
      TPO: false,

      //-----------Vessel-----------

      VesselClassList: [],
      vesselClassLabel: 'Vessel Class',
      vesselClass: '',
      defaultVesselClass: '',
      vesselClassError: true,
      VesselClassName: '',

      vesselTypeList: [],
      vesselTypeLabel: 'Vessel Type',
      defaultVesselType: '',
      vesselType: '',
      vesselTypeRes: [],
      vesselTypeError: true,
      VesselTypeName: '',

      liabilityType: '',

      country: '',

      PolicyVesselId: '',
      vesselnameLabel: 'Vessel Name',
      vesselName: '',
      vesselNameError: true,

      vesselmodelLabel: 'Make & Model*',
      vesselModel: '',
      vesselModelError: true,

      serialnoLabel: 'Serial No',
      serialNo: '',
      serialNoError: true,

      vessellengthLabel: 'Length (meters)*',
      vesselLength: '',
      vesselLengthError: true,

      vesselbuildTypeLabel: 'Type of Build*',
      vesselBuildType: '',
      vesselBuildTypearr: [],
      vesselBuildTypeError: true,

      vesselbuiltYearLabel: 'Year Built*',
      vesselBuiltYear: '',
      vesselBuildYearError: true,

      vessellastSurveyDateLabel: "Last Survey Date",
      vessellastSurveyDateRequired: false,
      vesselLastSurveyDate: '',
      vesselLastSurveyDateError: true,

      vesselhullMaterialLabel: 'Hull Material*',
      vesselHullMaterial: '',
      vesselHullMaterialarr: [],
      vesselHullMaterialError: true,

      vesselpurchasePriceLabel: "Purchase Price",
      vesselPurchasePrice: '',
      vesselPurchasePriceError: true,

      vesseluseOfVesselLabel: 'Use of Vessel*',
      vesselUseOfVessel: '',
      UseofVesselList: [],
      vesselUseOfVesselError: true,

      vesselyearPurchasedLabel: "Year Purchased*",
      vesselYearPurchased: '',
      vesselYearPurchasedError: true,

      vesselsurveyDueDateLabel: "Survey Due",
      vesselSurveyDueDate: '',
      vesselSurveyDueDateError: true,

      //------Engine and Trailer Details---
      PolicyEngineTrailerDetailId: '',
      mainengineLabel: "Main Engine(s)",
      mainEngine: '',
      mainEngineError: true,

      mainengineHpLabel: "HP",
      mainEngineHp: '',
      mainEngineHpError: true,

      mainengineYearLabel: "Year",
      mainEngineYear: '',
      mainEngineYearError: true,

      mainengineSerialNoLabel: "Main Engine Serial Number",
      mainEngineSerialNo: '',
      mainEngineSerialNoError: true,

      noOfengineLabel: "No of Engines",
      noOfEngine: '',
      noOfEnginearr: [],
      noOfEngineError: true,

      tarnsmissionmainengineLabel: "Transmission",
      tarnsmissionMainEngine: '',
      tarnsmissionMainEnginearr: [],
      tarnsmissionMainEngineError: true,

      auxiliaryengineLabel: "Auxiliary Engine",
      auxiliaryEngine: '',
      auxiliaryEnginearr: [],
      auxiliaryEngineError: true,

      auxiliaryEngineHpLabel: "HP",
      auxiliaryEngineHp: '',
      auxiliaryEngineHpError: true,

      auxiliaryEngineYearLabel: "Year",
      auxiliaryEngineYear: '',
      auxiliaryEngineYearError: true,

      auxiliaryEngineSerialNoLabel: "Auxiliary Engine Serial Number",
      auxiliaryEngineSerialNo: '',
      auxiliaryEngineSerialNoError: true,

      auxiliaryEngineNoEngineLabel: "No of Engines",
      auxiliaryEngineNoEngine: '',
      auxiliaryEngineNoEnginearr: [],
      auxiliaryEngineNoEngineError: true,

      auxiliaryEngineTransmissionLabel: "Transmission",
      auxiliaryEngineTransmission: '',
      auxiliaryEngineTransmissionarr: [],
      auxiliaryEngineTransmissionError: true,

      maxSpeedLabel: "Max Speed (Knots)",
      maxSpeed: '',
      maxSpeedError: true,

      makeofTrailerLabel: "Make of Trailer",
      makeofTrailer: '',
      makeofTrailerError: true,

      trailerSerialNoLabel: "Trailer Serial No",
      trailerSerialNo: '',
      trailerSerialNoError: true,

      //------------------------Tender/Auxiliary Vessel-----
      PolicyAuxiliaryVesselId: '',
      tenderVesselMakeLabel: "Make",
      tenderVesselMake: '',
      tenderVesselMakeError: true,

      tenderVesselYearLabel: "Year",
      tenderVesselYear: '',
      tenderVesselYearError: true,

      tenderVesselLengthLabel: "Length",
      tenderVesselLength: '',
      tenderVesselLengthError: true,

      tenderVesselMaterialLabel: "Material",
      tenderVesselMaterial: '',
      tenderVesselMaterialarr: [],
      tenderVesselMaterialError: true,

      makeAndModelOfEngineLabel: "Make & Model of Engine",
      makeAndModelOfEngine: '',
      makeAndModelOfEngineError: true,

      makeAndModelOfEngineHPLabel: "HP",
      makeAndModelOfEngineHP: '',
      makeAndModelOfEngineHPError: true,

      //------------------------Navigational Equipment------
      PolicyNavigationalEquipmentId: '',
      EquipmentNavLabel: "Equipment Nav.",
      ModelDescriptionLabel: "Model/Description",
      valueLabel: "Value (€)",

      RadarLabel: "Radar",
      navigationalEquipmentRadarDesc: '',
      navigationalEquipmentRadarDescError: true,

      navigationalEquipmentRadarValue: 0,
      navigationalEquipmentRadarValueError: true,

      SonarLabel: "Sonar",
      navigationalEquipmentSonarDesc: '',
      navigationalEquipmentSonarDescError: true,

      navigationalEquipmentSonarValue: 0,
      navigationalEquipmentSonarValueError: true,

      GPSLabel: "GPS",
      navigationalEquipmentGPSDesc: '',
      navigationalEquipmentGPSDescError: true,

      navigationalEquipmentGPSValue: 0,
      navigationalEquipmentGPSValueError: true,

      PlotterLabel: "Plotter",
      navigationalEquipmentPlotterDesc: '',
      navigationalEquipmentPlotterDescError: true,

      navigationalEquipmentPlotterValue: 0,
      navigationalEquipmentPlotterValueError: true,

      CombinedEquipmentLabel: "Combined Equipment",
      navigationalEquipmentCombinedEquipmentDesc: '',
      navigationalEquipmentCombinedEquipmentDescError: true,

      navigationalEquipmentCombinedEquipmentValue: 0,
      navigationalEquipmentCombinedEquipmentValueError: true,

      VHFLabel: "VHF",
      navigationalEquipmentVHFDesc: '',
      navigationalEquipmentVHFDescError: true,

      navigationalEquipmentVHFValue: 0,
      navigationalEquipmentVHFValueError: true,

      RadioBeaconLabel: "Radio Beacon",
      navigationalEquipmentRadioBeaconDesc: '',
      navigationalEquipmentRadioBeaconDescError: true,

      navigationalEquipmentRadioBeaconValue: 0,
      navigationalEquipmentRadioBeaconValueError: true,

      AutoPilotLabel: "Auto Pilot",
      navigationalEquipmentAutoPilotDesc: '',
      navigationalEquipmentAutoPilotDescError: true,

      navigationalEquipmentAutoPilotValue: 0,
      navigationalEquipmentAutoPilotValueError: true,

      SlideLabel: "Slide",
      navigationalEquipmentSlideDesc: '',
      navigationalEquipmentSlideDescError: true,

      navigationalEquipmentSlideValue: 0,
      navigationalEquipmentSlideValueError: true,

      BLULabel: "BLU",
      navigationalEquipmentBLUDesc: '',
      navigationalEquipmentBLUDescError: true,

      navigationalEquipmentBLUValue: 0,
      navigationalEquipmentBLUValueError: true,

      WindEquipmentLabel: "Wind Equipment",
      navigationalEquipmentWindEquipmentDesc: '',
      navigationalEquipmentWindEquipmentDescError: true,

      navigationalEquipmentWindEquipmentValue: 0,
      navigationalEquipmentWindEquipmentValueError: true,

      TridataLabel: "Tridata",
      navigationalTridataDesc: '',
      navigationalTridataDescError: true,

      navigationalTridataValue: 0,
      navigationalTridataValueError: true,

      Others01Label: "Others 01",
      navigationalOthers01Desc: '',
      navigationalOthers01DescError: true,

      navigationalOthers01Value: 0,
      navigationalOthers01ValueError: true,

      Others02Label: "Others 02",
      navigationalOthers02Desc: '',
      navigationalOthers02DescError: true,

      navigationalOthers02Value: 0,
      navigationalOthers02ValueError: true,

      Others03Label: "Others 03",
      navigationalOthers03Desc: '',
      navigationalOthers03DescError: true,

      navigationalOthers03Value: 0,
      navigationalOthers03ValueError: true,

      Others04Label: "Others 04",
      navigationalOthers04Desc: '',
      navigationalOthers04DescError: true,

      navigationalOthers04Value: 0,
      navigationalOthers04ValueError: true,

      navigationalTotalLabel: "Total",

      //--------------Sails, Canopy & Covers-----
      PolicySailCanopyCoverId: '',
      BiminiLabel: "Bimini",
      Bimini: 0,
      BiminiError: true,

      CanopyLabel: "Canopy",
      Canopy: 0,
      CanopyError: true,

      boatCoversLabel: "Boat Covers",
      boatCovers: 0,
      boatCoversError: true,

      //--------------Sum Insured------------
      PolicyInsuredAmountId: '',

      sumInsuredMethodLabel: "Sum Insured Method",
      sumInsuredMethod: '',
      sumInsuredMethodarr: [],
      sumInsuredMethodError: true,

      hullInboardMachineLabel: "Hull + Inboard Machinery",
      hullInboardMachine: 0,
      hullInboardMachineError: true,

      tenderDinghyLabel: "Tender/Dinghy",
      tenderDinghy: 0,
      tenderDinghyError: true,

      lifeRaftLabel: "Life Raft",
      lifeRaft: 0,
      lifeRaftError: true,

      outboard1Label: "Outboard 1",
      outboard1: 0,
      outboard1Error: true,

      outboard2Label: "Outboard 2",
      outboard2: 0,
      outboard2Error: true,

      roadTrailerLabel: "Road Trailer",
      roadTrailer: 0,
      roadTrailerError: true,

      personalEffectsLabel: "Personal Effects",
      personalEffects: 0,
      personalEffectsError: true,

      navigationalEquipLabel: "Navigational Equipment",
      navigationalEquip: 0,
      navigationalEquipError: true,

      sumInsuredSails: 0,
      sumInsuredSailsError: true,

      portableGeneratorLabel: "Portable Generator",
      portableGenerator: 0,
      portableGeneratorError: true,

      customCoverageLabel: "Custom Coverage",
      customCoverage: 0,
      customCoverageError: false,

      totalSumInsuredValue: 0,
      systemTotalSumInsuredValue: 0,
      NavigationalEquipmentTotal: 0,
      PersonalEffectsTotal: 0,
      SailsTotal: 0,
      isEdit: false,
      isEditClassType: false,
      toggleModalAdd: false,
      toggleModalAddForSails: false,
      isNavigationalTotalEqual: true,
      isSailsTotalEqual: true,
      policyStatus: '',
      CurrencySymbol: '',

      isDisplayEngine: 1,

      //-----------------------Headers & Labels-----------------------------

      VesselHeaders: "Vessel",
      EngineandTrailerDetailsHeaders: "Engine and Trailer Details",
      TenderAuxiliaryVesselHeaders: "Tender/Auxiliary Vessel",
      NavigationalEquipmentHeaders: "Navigational Equipment",
      PersonalEffectsHeaders: "Personal Effects",
      SailsCanopyCoversHeaders: "Sails, Canopy & Covers",
      SumInsuredHeaders: "Sum Insured",
      TypeLabel: "Type",
      DescriptionLabel: "Description",
      ValueLabel: "Value",
      TotalLabel: "Total",
      totalSumInsuredValueLabel: "Total Sum Insured",
      BacktopolicylistLabel: "Back to policy list",
      CancelLabel: "Cancel",
      SaveLabel: "Save",
      NoteLabel: "Note",
      SailsNote: "To cover the Sails, Canopy & Covers, it is necessary to mark the optional coverage and indicate their values",
      SailsHeader: "Sails, Canopy & Covers",
      sailWarningLabel: "Total sum should be equal to"
    };
  }

  componentDidMount() {
    if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
      this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
    }
    console.log("componentDidMount", this.props.CurrencySymbol);
    this.getPolicyVeselDetails();
    this.getCategory();
    this.getMake();
    this.getTypeOfBuild();
    this.getHullMaterial();
    this.getMainNoOfEndines();
    this.getMainEngineTransmission();
    this.getAuxiliaryEngine();
    this.getAuxNoOfEndines();
    this.getAuxEngineTransmission();
    this.getTenderMaterial();
    this.getSumInsuredMethod();
    this.getSysConfigValue();
    // this.getVesselClass();
    this.IsmigratedData();
    this.isGenerateRenewal();
    // this.setState({ PolicyId: this.props.match.params.id });
  }

  getSysConfigValue() {
    try {
      api.post('api/getSystemConfigByKey', { key: 'PolicyVesselAmount' }).then(res => {
        if (res.success) {
          this.setState({ maxPolicyAmount: res.data[0].SysValue });
        } else {
          console.log("something error");
        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("erroreeee", error);
    }
  }

  getPolicyVeselDetails() {
    let data = {
      PolicyId: this.props.match.params.id
    }
    api.post('api/getVesselDetails', data).then(res => {
      console.log('getVesselDetails', res);
      if (res.success) {
        console.log('getVesselDetails', res.data[0]);
        if (res.data.length) {
          // let vesselLastSurveyDate;
          // let vesselSurveyDueDate;
          // if (CommonConfig.isEmpty(res.data[0].LastSurveyDate)) {
          //   vesselLastSurveyDate = '';
          //   this.setState({ vesselLastSurveyDateError: true });
          // } else {
          //   // res.data[0].LastSurveyDate = "0000-00-00";
          //   console.log('res.data[0].LastSurveyDate',res.data[0].LastSurveyDate);

          //   vesselLastSurveyDate = res.data[0].LastSurveyDate;
          //   // vesselSurveyDueDate = moment(res.data[0].LastSurveyDate).add(5, 'years').format('YYYY-MM-DD')
          //   // vesselLastSurveyDate = (dt === 'Invalid date') ? '' : new Date(dt);
          //   this.setState({ vesselLastSurveyDateError: false });
          // }
          console.log('res.data[0].LiabilityType', res.data[0]);

          this.setState({
            liabilityType: res.data[0].LiabilityType,
            country: res.data[0].Country,
            PolicyVesselId: res.data[0].PolicyVesselId,
            PolicyEngineTrailerDetailId: res.data[0].PolicyEngineTrailerDetailId,
            PolicyAuxiliaryVesselId: res.data[0].PolicyAuxiliaryVesselId,
            PolicyNavigationalEquipmentId: res.data[0].PolicyNavigationalEquipmentId,
            PolicyPersonalEffectId: res.data[0].PolicyPersonalEffectId,
            PolicySailCanopyCoverId: res.data[0].PolicySailCanopyCoverId,
            PolicyInsuredAmountId: res.data[0].PolicyInsuredAmountId,
            defaultVesselClass: {
              label: CommonConfig.isEmpty(res.data[0].vesselClassName) ? '' : res.data[0].vesselClassName,
              value: CommonConfig.isEmpty(res.data[0].vesselClassId) ? '' : res.data[0].vesselClassId
            },
            vesselClass: CommonConfig.isEmpty(res.data[0].vesselClassId) ? '' : res.data[0].vesselClassId,
            VesselClassName: CommonConfig.isEmpty(res.data[0].vesselClassName) ? '' : res.data[0].vesselClassName,
            defaultVesselType: CommonConfig.isEmpty(res.data[0].vesselTypeId) ? '' : res.data[0].vesselTypeId,
            vesselType: CommonConfig.isEmpty(res.data[0].vesselTypeId) ? '' : res.data[0].vesselTypeId,
            VesselTypeName: CommonConfig.isEmpty(res.data[0].vesselTypeName) ? '' : res.data[0].vesselTypeName,
            vesselName: CommonConfig.isEmpty(res.data[0].VesselName) ? '' : res.data[0].VesselName,
            vesselCategory: CommonConfig.isEmpty(res.data[0].Category) ? '' : res.data[0].Category,
            vesselName: CommonConfig.isEmpty(res.data[0].VesselName) ? '' : res.data[0].VesselName,
            vesselModel: CommonConfig.isEmpty(res.data[0].MakeModel) ? '' : res.data[0].MakeModel,
            serialNo: CommonConfig.isEmpty(res.data[0].SerialNumber) ? '' : res.data[0].SerialNumber,
            vesselLength: CommonConfig.isEmpty(res.data[0].Length) ? '' : res.data[0].Length,
            vesselBuildType: CommonConfig.isEmpty(res.data[0].BuildType) ? '' : res.data[0].BuildType,
            vesselBuiltYear: CommonConfig.isEmpty(res.data[0].YearBuilt) ? '' : res.data[0].YearBuilt,
            vesselLastSurveyDate: CommonConfig.isEmpty(res.data[0].LastSurveyDate) ? '' : moment(res.data[0].LastSurveyDate).format('YYYY-MM-DD'),
            vesselHullMaterial: CommonConfig.isEmpty(res.data[0].HullMaterial) ? '' : res.data[0].HullMaterial,
            vesselPurchasePrice: CommonConfig.isEmpty(res.data[0].PurchasePrice) ? '' : res.data[0].PurchasePrice,
            vesselUseOfVessel: CommonConfig.isEmpty(res.data[0].VesselUse) ? '' : res.data[0].VesselUse,
            vesselYearPurchased: CommonConfig.isEmpty(res.data[0].YearPurchased) ? '' : res.data[0].YearPurchased,
            vesselSurveyDueDate: CommonConfig.isEmpty(res.data[0].SurveyDueDate) ? '' : moment(res.data[0].SurveyDueDate).format('YYYY-MM-DD'),
            vesselSurveyDueDateError: CommonConfig.isEmpty(res.data[0].SurveyDueDate),
            mainEngine: CommonConfig.isEmpty(res.data[0].MainEngine) ? '' : res.data[0].MainEngine,
            mainEngineError: CommonConfig.isEmpty(res.data[0].MainEngine) ? true : false,
            mainEngineHp: CommonConfig.isEmpty(res.data[0].MainEngineHp) ? '' : res.data[0].MainEngineHp,
            mainEngineHpError: CommonConfig.isEmpty(res.data[0].MainEngineHp) ? true : false,
            mainEngineYear: CommonConfig.isEmpty(res.data[0].MainEngineYear) ? '' : res.data[0].MainEngineYear,
            mainEngineYearError: CommonConfig.isEmpty(res.data[0].MainEngineYear) ? true : false,
            mainEngineSerialNo: CommonConfig.isEmpty(res.data[0].MainEngineSerialNo) ? '' : res.data[0].MainEngineSerialNo,
            mainEngineSerialNoError: CommonConfig.isEmpty(res.data[0].MainEngineSerialNo) ? true : false,
            noOfEngine: CommonConfig.isEmpty(res.data[0].MainEngineCount) ? '' : res.data[0].MainEngineCount,
            noOfEngineError: CommonConfig.isEmpty(res.data[0].MainEngineCount) ? true : false,
            tarnsmissionMainEngine: CommonConfig.isEmpty(res.data[0].MainEngineTransmission) ? '' : res.data[0].MainEngineTransmission,
            tarnsmissionMainEngineError: CommonConfig.isEmpty(res.data[0].MainEngineTransmission) ? true : false,
            auxiliaryEngine: CommonConfig.isEmpty(res.data[0].AuxiliaryEngine) ? '' : res.data[0].AuxiliaryEngine,
            auxiliaryEngineHp: CommonConfig.isEmpty(res.data[0].AuxiliaryEngineHp) ? '' : res.data[0].AuxiliaryEngineHp,
            auxiliaryEngineYear: (CommonConfig.isEmpty(res.data[0].AuxiliaryEngineYear) || res.data[0].AuxiliaryEngineYear == "0000") ? '' : res.data[0].AuxiliaryEngineYear,
            auxiliaryEngineSerialNo: CommonConfig.isEmpty(res.data[0].AuxiliaryEngineSerialNo) ? '' : res.data[0].AuxiliaryEngineSerialNo,
            auxiliaryEngineSerialNoError: CommonConfig.isEmpty(res.data[0].AuxiliaryEngineSerialNo) ? true : false,
            auxiliaryEngineNoEngine: CommonConfig.isEmpty(res.data[0].AuxiliaryEngineCount) ? '' : res.data[0].AuxiliaryEngineCount,
            auxiliaryEngineTransmission: CommonConfig.isEmpty(res.data[0].AuxiliaryEngineTransmission) ? '' : res.data[0].AuxiliaryEngineTransmission,
            maxSpeed: CommonConfig.isEmpty(res.data[0].MaxSpeed) ? '' : res.data[0].MaxSpeed,
            maxSpeedError: CommonConfig.isEmpty(res.data[0].MaxSpeed) ? true : false,
            makeofTrailer: CommonConfig.isEmpty(res.data[0].MakeOfTrailer) ? '' : res.data[0].MakeOfTrailer,
            trailerSerialNo: CommonConfig.isEmpty(res.data[0].TrailerSrNo) ? '' : res.data[0].TrailerSrNo,

            tenderVesselMake: CommonConfig.isEmpty(res.data[0].PolicyAuxiliaryVesseMake) ? '' : res.data[0].PolicyAuxiliaryVesseMake,
            tenderVesselYear: (CommonConfig.isEmpty(res.data[0].Year) || res.data[0].Year == "0000") ? '' : res.data[0].Year,
            tenderVesselLength: CommonConfig.isEmpty(res.data[0].PolicyAuxiliaryVesseLength) ? '' : res.data[0].PolicyAuxiliaryVesseLength,
            makeAndModelOfEngine: CommonConfig.isEmpty(res.data[0].EngineMakeModel) ? '' : res.data[0].EngineMakeModel,
            makeAndModelOfEngineHP: CommonConfig.isEmpty(res.data[0].HP) ? '' : res.data[0].HP,
            tenderVesselMaterial: CommonConfig.isEmpty(res.data[0].Material) ? '' : res.data[0].Material,

            navigationalEquipmentRadarDesc: CommonConfig.isEmpty(res.data[0].RadarModelDesc) ? '' : res.data[0].RadarModelDesc,
            navigationalEquipmentRadarValue: CommonConfig.isEmpty(res.data[0].RadarValue) ? 0 : res.data[0].RadarValue,
            navigationalEquipmentSonarDesc: CommonConfig.isEmpty(res.data[0].SonarModelDesc) ? '' : res.data[0].SonarModelDesc,
            navigationalEquipmentSonarValue: CommonConfig.isEmpty(res.data[0].SonarValue == null || res.data[0].SonarValue == '' || res.data[0].SonarValue == undefined) ? (0) : (res.data[0].SonarValue),
            navigationalEquipmentGPSDesc: CommonConfig.isEmpty(res.data[0].GPSModelDesc) ? '' : res.data[0].GPSModelDesc,
            navigationalEquipmentGPSValue: CommonConfig.isEmpty(res.data[0].GPSValue) ? 0 : res.data[0].GPSValue,
            navigationalEquipmentPlotterDesc: CommonConfig.isEmpty(res.data[0].PlotterModelDesc) ? '' : res.data[0].PlotterModelDesc,
            navigationalEquipmentPlotterValue: CommonConfig.isEmpty(res.data[0].PlotterValue) ? 0 : res.data[0].PlotterValue,
            navigationalEquipmentCombinedEquipmentDesc: CommonConfig.isEmpty(res.data[0].CombinedEquipmentModelDesc) ? '' : res.data[0].CombinedEquipmentModelDesc,
            navigationalEquipmentCombinedEquipmentValue: CommonConfig.isEmpty(res.data[0].CombinedEquipmentValue) ? 0 : res.data[0].CombinedEquipmentValue,
            navigationalEquipmentVHFDesc: CommonConfig.isEmpty(res.data[0].VHFModelDesc) ? '' : res.data[0].VHFModelDesc,
            navigationalEquipmentVHFValue: CommonConfig.isEmpty(res.data[0].VHFValue) ? 0 : res.data[0].VHFValue,
            navigationalEquipmentRadioBeaconDesc: CommonConfig.isEmpty(res.data[0].RadioBeaconModelDesc) ? '' : res.data[0].RadioBeaconModelDesc,
            navigationalEquipmentRadioBeaconValue: CommonConfig.isEmpty(res.data[0].RadioBeaconValue) ? 0 : res.data[0].RadioBeaconValue,
            navigationalEquipmentAutoPilotDesc: CommonConfig.isEmpty(res.data[0].AutoPilotModelDesc) ? '' : res.data[0].AutoPilotModelDesc,
            navigationalEquipmentAutoPilotValue: CommonConfig.isEmpty(res.data[0].AutoPilotValue) ? 0 : res.data[0].AutoPilotValue,
            navigationalEquipmentBLUDesc: CommonConfig.isEmpty(res.data[0].BLUModelDesc) ? '' : res.data[0].BLUModelDesc,
            navigationalEquipmentBLUValue: CommonConfig.isEmpty(res.data[0].BLUValue) ? 0 : res.data[0].BLUValue,
            navigationalEquipmentSlideDesc: CommonConfig.isEmpty(res.data[0].SlideModelDesc) ? '' : res.data[0].SlideModelDesc,
            navigationalEquipmentSlideValue: CommonConfig.isEmpty(res.data[0].SlideValue) ? 0 : res.data[0].SlideValue,
            navigationalEquipmentWindEquipmentDesc: CommonConfig.isEmpty(res.data[0].WindEquipmentModelDesc) ? '' : res.data[0].WindEquipmentModelDesc,
            navigationalEquipmentWindEquipmentValue: CommonConfig.isEmpty(res.data[0].WindEquipmentValue) ? 0 : res.data[0].WindEquipmentValue,
            navigationalTridataDesc: CommonConfig.isEmpty(res.data[0].TridataModelDesc) ? '' : res.data[0].TridataModelDesc,
            navigationalTridataValue: CommonConfig.isEmpty(res.data[0].TridataValue) ? 0 : res.data[0].TridataValue,
            navigationalOthers01Desc: CommonConfig.isEmpty(res.data[0].Other1ModelDesc) ? '' : res.data[0].Other1ModelDesc,
            navigationalOthers01Value: CommonConfig.isEmpty(res.data[0].Other1Value) ? 0 : res.data[0].Other1Value,
            navigationalOthers02Desc: CommonConfig.isEmpty(res.data[0].Other2ModelDesc) ? '' : res.data[0].Other2ModelDesc,
            navigationalOthers02Value: CommonConfig.isEmpty(res.data[0].Other2Value) ? 0 : res.data[0].Other2Value,
            navigationalOthers03Desc: CommonConfig.isEmpty(res.data[0].Other3ModelDesc) ? '' : res.data[0].Other3ModelDesc,
            navigationalOthers03Value: CommonConfig.isEmpty(res.data[0].Other3Value) ? 0 : res.data[0].Other3Value,
            navigationalOthers04Desc: CommonConfig.isEmpty(res.data[0].Other4ModelDesc) ? '' : res.data[0].Other4ModelDesc,
            navigationalOthers04Value: CommonConfig.isEmpty(res.data[0].Other4Value) ? 0 : res.data[0].Other4Value,

            // PersonalEffectsTVDesc: CommonConfig.isEmpty(res.data[0].TVModelDesc) ? '' : res.data[0].TVModelDesc,
            // PersonalEffectsTVValue: CommonConfig.isEmpty(res.data[0].TVValue) ? 0 : res.data[0].TVValue,
            // PersonalEffectsMusicEquipmentDesc: CommonConfig.isEmpty(res.data[0].MusicEquipmentModelDesc) ? '' : res.data[0].MusicEquipmentModelDesc,
            // PersonalEffectsMusicEquipmentValue: CommonConfig.isEmpty(res.data[0].MusicEquipmentValue) ? 0 : res.data[0].MusicEquipmentValue,
            // PersonalEffectsOthers01Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther1Desc) ? '' : res.data[0].PolicyPersonalEffectOther1Desc,
            // PersonalEffectsOthers01Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther1Value) ? 0 : res.data[0].PolicyPersonalEffectOther1Value,
            // PersonalEffectsOthers02Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther2Desc) ? '' : res.data[0].PolicyPersonalEffectOther2Desc,
            // PersonalEffectsOthers02Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther2Value) ? 0 : res.data[0].PolicyPersonalEffectOther2Value,
            // PersonalEffectsOthers03Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther3Desc) ? '' : res.data[0].PolicyPersonalEffectOther3Desc,
            // PersonalEffectsOthers03Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther3Value) ? 0 : res.data[0].PolicyPersonalEffectOther3Value,
            // PersonalEffectsOthers04Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther4Desc) ? '' : res.data[0].PolicyPersonalEffectOther4Desc,
            // PersonalEffectsOthers04Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther4Value) ? 0 : res.data[0].PolicyPersonalEffectOther4Value,
            // PersonalEffectsOthers05Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther5Desc) ? '' : res.data[0].PolicyPersonalEffectOther5Desc,
            // PersonalEffectsOthers05Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther5Value) ? 0 : res.data[0].PolicyPersonalEffectOther5Value,
            // PersonalEffectsOthers06Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther6Desc) ? '' : res.data[0].PolicyPersonalEffectOther6Desc,
            // PersonalEffectsOthers06Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther6Value) ? 0 : res.data[0].PolicyPersonalEffectOther6Value,
            // PersonalEffectsOthers07Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther7Desc) ? '' : res.data[0].PolicyPersonalEffectOther7Desc,
            // PersonalEffectsOthers07Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther7Value) ? 0 : res.data[0].PolicyPersonalEffectOther7Value,
            // PersonalEffectsOthers08Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther8Desc) ? '' : res.data[0].PolicyPersonalEffectOther8Desc,
            // PersonalEffectsOthers08Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther8Value) ? 0 : res.data[0].PolicyPersonalEffectOther8Value,
            // PersonalEffectsOthers09Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther9Desc) ? '' : res.data[0].PolicyPersonalEffectOther9Desc,
            // PersonalEffectsOthers09Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther9Value) ? 0 : res.data[0].PolicyPersonalEffectOther9Value,
            // PersonalEffectsOthers10Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther10Desc) ? '' : res.data[0].PolicyPersonalEffectOther10Desc,
            // PersonalEffectsOthers10Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther10Value) ? 0 : res.data[0].PolicyPersonalEffectOther10Value,
            // PersonalEffectsOthers11Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther11Desc) ? '' : res.data[0].PolicyPersonalEffectOther11Desc,
            // PersonalEffectsOthers11Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther11Value) ? 0 : res.data[0].PolicyPersonalEffectOther11Value,
            // PersonalEffectsOthers12Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther12Desc) ? '' : res.data[0].PolicyPersonalEffectOther12Desc,
            // PersonalEffectsOthers12Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther12Value) ? 0 : res.data[0].PolicyPersonalEffectOther12Value,
            // PersonalEffectsOthers13Desc: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther13Desc) ? '' : res.data[0].PolicyPersonalEffectOther13Desc,
            // PersonalEffectsOthers13Value: CommonConfig.isEmpty(res.data[0].PolicyPersonalEffectOther13Value) ? 0 : res.data[0].PolicyPersonalEffectOther13Value,

            Bimini: CommonConfig.isEmpty(res.data[0].BiminiValue) ? 0 : res.data[0].BiminiValue,
            Canopy: CommonConfig.isEmpty(res.data[0].CanopyValue) ? 0 : res.data[0].CanopyValue,
            boatCovers: CommonConfig.isEmpty(res.data[0].CoversValue) ? 0 : res.data[0].CoversValue,
            // mainSailCovers: CommonConfig.isEmpty(res.data[0].MainSailCoversValue) ? 0 : res.data[0].MainSailCoversValue,
            // canvasAnchoring: CommonConfig.isEmpty(res.data[0].CanvasAnchoringValue) ? 0 : res.data[0].CanvasAnchoringValue,
            // genovaSailCovers: CommonConfig.isEmpty(res.data[0].GenovaSailCoverValue) ? 0 : res.data[0].GenovaSailCoverValue,
            // sailsAwnings: CommonConfig.isEmpty(res.data[0].AwningsValue) ? 0 : res.data[0].AwningsValue,
            // antiClonehood: CommonConfig.isEmpty(res.data[0].AntiCloneHoodValue) ? 0 : res.data[0].AntiCloneHoodValue,
            // SailsOther01Desc: CommonConfig.isEmpty(res.data[0].Other1Desc) ? '' : res.data[0].Other1Desc,
            // SailsOther01Value: CommonConfig.isEmpty(res.data[0].Others1Value) ? 0 : res.data[0].Others1Value,
            // SailsOther02Desc: CommonConfig.isEmpty(res.data[0].Other2Desc) ? '' : res.data[0].Other2Desc,
            // SailsOther02Value: CommonConfig.isEmpty(res.data[0].Others2Value) ? 0 : res.data[0].Others2Value,
            // SailsOther03Desc: CommonConfig.isEmpty(res.data[0].Other3Desc) ? '' : res.data[0].Other3Desc,
            // SailsOther03Value: CommonConfig.isEmpty(res.data[0].Others3Value) ? 0 : res.data[0].Others3Value,

            sumInsuredMethod: CommonConfig.isEmpty(res.data[0].SumInsuredMethod) ? 0 : res.data[0].SumInsuredMethod,

            hullInboardMachine: CommonConfig.isEmpty(res.data[0].HullAndInboardMachineryAmount) ? 0 : res.data[0].HullAndInboardMachineryAmount,
            tenderDinghy: CommonConfig.isEmpty(res.data[0].TenderAmount) ? 0 : res.data[0].TenderAmount,
            lifeRaft: CommonConfig.isEmpty(res.data[0].LifeRaftAmount) ? 0 : res.data[0].LifeRaftAmount,
            outboard1: CommonConfig.isEmpty(res.data[0].Outboard1Amount) ? 0 : res.data[0].Outboard1Amount,
            outboard2: CommonConfig.isEmpty(res.data[0].Outboard2Amount) ? 0 : res.data[0].Outboard2Amount,
            roadTrailer: CommonConfig.isEmpty(res.data[0].RoadTrailerAmount) ? 0 : res.data[0].RoadTrailerAmount,
            personalEffects: CommonConfig.isEmpty(res.data[0].PersonalEffectAmount) ? 0 : res.data[0].PersonalEffectAmount,
            navigationalEquip: CommonConfig.isEmpty(res.data[0].NavigationalEquipmentAmount) ? 0 : res.data[0].NavigationalEquipmentAmount,
            sumInsuredSails: CommonConfig.isEmpty(res.data[0].SailsCanopyCovers) ? 0 : res.data[0].SailsCanopyCovers,
            portableGenerator: CommonConfig.isEmpty(res.data[0].PortableGeneratorAmount) ? 0 : res.data[0].PortableGeneratorAmount,
            customCoverage: CommonConfig.isEmpty(res.data[0].CustomCoverageAmount) ? 0 : res.data[0].CustomCoverageAmount,
            vesselClassError: false,
            vesselTypeError: CommonConfig.isEmpty(res.data[0].vesselTypeId),
            vesselBuildTypeError: false,
            makeAndModelOfEngineError: false,
            vesselModelError: false,
            vesselBuildYearError: false,
            vesselLastSurveyDateError: false,
            vesselHullMaterialError: false,
            vesselPurchasePriceError: false,
            vesselUseOfVesselError: false,
            vesselLengthError: false,
            vesselYearPurchasedError: false,
            sumInsuredMethodError: false
          })

          if (res.data[0].vesselClassName == "Dinghy" || res.data[0].vesselClassName == "Rowing Sculls") {
            this.setState({
              isDisplayEngine: 0, mainEngine: '', mainEngineHp: '', mainEngineYear: '', noOfEngine: '', tarnsmissionMainEngine: '',
              auxiliaryEngine: '', auxiliaryEngineHp: '', auxiliaryEngineYear: '', auxiliaryEngineNoEngine: '', auxiliaryEngineTransmission: '', maxSpeed: 0,
              makeofTrailer: '', trailerSerialNo: '',
              tenderVesselMake: '', tenderVesselYear: '', tenderVesselLength: '', tenderVesselMaterial: '', makeAndModelOfEngine: '', makeAndModelOfEngineHP: ''
            })
          } else {
            this.setState({ isDisplayEngine: 1 })
          }

          // let BoatAge = new Date().getFullYear() - this.state.vesselBuildType;
          // this.setState({vessellastSurveyDateLabel:(BoatAge>=30)?"Last Survey Date *":"Last Survey Date"});

          let BoatAge = new Date().getFullYear() - this.state.vesselBuiltYear;
          this.setState({ vessellastSurveyDateLabel: (BoatAge >= 20) ? "Last Survey Date *" : "Last Survey Date" });

          if (this.state.VesselClassName === "Commercial Vessels") {
            this.getDropDownValues('COMMERCIALUSEOFVESSEL', 'UseofVesselList', 'StringMapName');
          } else {
            this.getDropDownValues('USEOFVESSEL', 'UseofVesselList', 'StringMapName');
          }

        } else {
          this.setState({ isEdit: true })
        }
        this.calculateSumInsured(true);
        this.calculateNavigationalEquipment();
        this.calculatePersonalEffects();
        this.calculateSailsCanopyCovers();
        this.getTPOType();
      }
      else {
        console.log("ELSE");
      }
    });
  }

  getSumInsuredMethod() {
    try {
      const data = {
        stringmaptype: 'SUMINSUREDMETHOD',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var sumInsuredMethod = [];
          for (let i = 0; i < res.data.length; i++) {
            sumInsuredMethod.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ sumInsuredMethodarr: sumInsuredMethod });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getCategory() {
    try {
      const data = {
        stringmaptype: 'CATEGORY',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var vesselCategory = [];
          for (let i = 0; i < res.data.length; i++) {
            vesselCategory.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ vesselCategoryarr: vesselCategory });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getMake() {
    try {
      const data = {
        stringmaptype: 'MAKE',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var vesselMake = [];
          for (let i = 0; i < res.data.length; i++) {
            vesselMake.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ vesselMakearr: vesselMake });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getUseOfVessel(type) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        var SelectedId = type;

        var data = { stringmaptype: 'USEOFVESSEL', orderby: 'StringMapName' };
        if (SelectedId === "Commercial Vessels") {
          data = { stringmaptype: 'COMMERCIALUSEOFVESSEL', orderby: 'StringMapName' };
        }
        api.post(APIConstant.path.dropdownbycode, data).then(res => {
          if (res.success) {
            resolve(res.data);
          } else {
            reject(0);
          }
        }).catch(err => {
          reject(0);
        });

      }, 100);
    });
  }

  getDropDownValues(stringMapType, setStateName, orderBy) {
    try {
      const data = {
        stringmaptype: stringMapType,
        orderby: orderBy
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ [setStateName]: res.data });
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  getTypeOfBuild() {
    try {
      const data = {
        stringmaptype: 'TYPEOFBUILD',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var vesselBuildType = [];
          for (let i = 0; i < res.data.length; i++) {
            vesselBuildType.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ vesselBuildTypearr: vesselBuildType });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getHullMaterial() {
    try {
      const data = {
        stringmaptype: 'HULLMATERIAL',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var vesselHullMaterial = [];
          for (let i = 0; i < res.data.length; i++) {
            vesselHullMaterial.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ vesselHullMaterialarr: vesselHullMaterial });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getMainNoOfEndines() {
    try {
      const data = {
        stringmaptype: 'NOOFENGINES',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var noOfEngine = [];
          for (let i = 0; i < res.data.length; i++) {
            noOfEngine.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ noOfEnginearr: noOfEngine });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getMainEngineTransmission() {
    try {
      const data = {
        stringmaptype: 'TRANSMISSIONS',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var tarnsmissionMainEngine = [];
          for (let i = 0; i < res.data.length; i++) {
            tarnsmissionMainEngine.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ tarnsmissionMainEnginearr: tarnsmissionMainEngine });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getAuxiliaryEngine() {
    try {
      const data = {
        stringmaptype: 'AUXENGINE',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var auxiliaryEngine = [];
          for (let i = 0; i < res.data.length; i++) {
            auxiliaryEngine.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ auxiliaryEnginearr: auxiliaryEngine });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getAuxNoOfEndines() {
    try {
      const data = {
        stringmaptype: 'NOOFENGINES',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var auxiliaryEngineNoEngine = [];
          for (let i = 0; i < res.data.length; i++) {
            auxiliaryEngineNoEngine.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ auxiliaryEngineNoEnginearr: auxiliaryEngineNoEngine });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getAuxEngineTransmission() {
    try {
      const data = {
        stringmaptype: 'TRANSMISSIONS',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var auxiliaryEngineTransmission = [];
          for (let i = 0; i < res.data.length; i++) {
            auxiliaryEngineTransmission.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ auxiliaryEngineTransmissionarr: auxiliaryEngineTransmission });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  getTenderMaterial() {
    try {
      const data = {
        stringmaptype: 'HULLMATERIAL',
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          var tenderVesselMaterial = [];
          for (let i = 0; i < res.data.length; i++) {
            tenderVesselMaterial.push({
              label: res.data[i].StringMapName,
              value: res.data[i].Description
            })
          }
          this.setState({ tenderVesselMaterialarr: tenderVesselMaterial });
        } else {

        }
      }).catch(err => {
        console.log("error", err);
      });
    } catch (error) {
      console.log("error", error);

    }
  }

  // getVesselClass() {
  //   api.get(APIConstant.path.getVesselClass).then(res => {
  //     if (res.success) {
  //       var formattedVesselClass = [];

  //       for (var i = 0; i < res.data.length; i++) {
  //         formattedVesselClass.push({
  //           label: res.data[i].VesselClassName,
  //           value: res.data[i].VesselClassId,
  //         });
  //       }
  //       this.setState({ VesselClassList: formattedVesselClass });
  //     } else {

  //     }
  //   }).catch(err => {

  //   });
  // }

  getVesselClassByCountry(country, TPO) {
    try {
      const data = {
        Country: country,
        TPO: (TPO) ? 1 : 0
      };
      console.log('getVesselClassByCountry', TPO);
      console.log('getVesselClassByCountry', data);
      api.post(APIConstant.path.getVesselClassByCountry, data).then(res => {
        if (res.success) {
          var formattedData = [];
          for (var i = 0; i < res.data.length; i++) {
            formattedData.push({
              label: res.data[i].VesselClassName,
              value: res.data[i].VesselClassId,
            });
          }

          this.setState({ VesselClassList: formattedData });
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  getVesselType(id, Country, TPO) {
    try {
      const data = {
        VesselClassId: id,
        Country: Country,
        TPO: (TPO) ? 1 : 0
      };
      console.log('getVesselTypeByCountry', data);
      api.post(APIConstant.path.getVesselTypeByCountry, data).then(res => {
        console.log('getVesselTypeByCountry', res);

        if (res.success) {
          var formattedData = [];

          for (var i = 0; i < res.data.length; i++) {
            formattedData.push({
              label: res.data[i].VesselTypeName,
              value: res.data[i].VesselTypeId,
            });
          }

          this.setState({ vesselTypeList: formattedData });
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  // getVesselType(id) {
  //   try {
  //     const data = {
  //       VesselClassId: id
  //     };
  //     api.post(APIConstant.path.getVesselType, data).then(res => {
  //       if (res.success) {
  //         var formattedData = [];

  //         for (var i = 0; i < res.data.length; i++) {
  //           formattedData.push({
  //             label: res.data[i].VesselTypeName,
  //             value: res.data[i].VesselTypeId,
  //           });
  //         }

  //         var isVesselTypeCheck = formattedData.find(x => x.value === this.state.vesselType);
  //         this.setState({ vesselTypeList: formattedData, vesselTypeRes: res.data, vesselTypeError: (isVesselTypeCheck) ? false : true });

  //       } else {
  //       }
  //     }).catch(err => {
  //     });
  //   } catch (error) {
  //   }
  // }

  isGenerateRenewal() {
    const data = { policyId: this.props.match.params.id };
    api.post(APIConstant.path.isGenerateRenewal, data).then(async res => {
      console.log('isGenerateRenewal', res.data[0].returnValue);
      if (res.success) {
        if (!CommonConfig.isEmpty(res.data[0].returnValue) && res.data[0].returnValue != 0) {
          if (res.data[0].returnValue == 2) {
            console.log('migratedData', 'before');
            var IsmigratedData = await this.IsmigratedData();
            console.log('migratedData after', IsmigratedData);

            if (IsmigratedData == 0) {
              // console.log('migratedData', 0);
              //   var nextBinder = await api.post(APIConstant.path.migratedData, data).then(res => {
              //     if (res.success) {
              //       if (res.data.returnValue == 0) {
              //         console.log('migratedData', '01');
              //       } else {
              //         console.log('migratedData', '11');
              //       }

              //     } else {
              //       console.log('error');
              //     }
              //   }).catch(err => {
              //     console.log('error', err);
              //   });
              //   return nextBinder;
            } else if (IsmigratedData == 1) {
              let data1 = {
                policyId: this.props.match.params.id
              }
              api.post(APIConstant.path.getNextBinderDetails, data1).then(res => {
                if (res.success) {
                  console.log('nextBinder', res);
                  if (!CommonConfig.isEmpty(res.data[0].binderUMRN)) {
                    this.setState({ nextBinder: res.data[0].binderUMRN, nextInsuranceComapny: res.data[0].insuranceCompanyName, isDisplayNext: 1 });
                  } else {
                    this.setState({ isDisplayNext: 0 });
                  }
                } else {
                  console.log('error');
                }
              }).catch(err => {
                console.log('error', err);
              });
            }
            else {

            }
          }
        }
      } else {
        console.log('error');
      }
    }).catch(err => {

    });
  }

  getTPOType() {
    try {
      const data = {
        policyId: this.props.match.params.id,
      };
      api.post(APIConstant.path.getTPOType, data).then(res => {
        if (res.success) {
          var TPO = (res.data[0].returnValue == 'Comprehensive') ? false : true;
          this.setState({ TPO: TPO });
          this.getVesselClassByCountry(this.state.country, this.state.TPO);
        } else {
        }
      }).catch(err => {
      });
    } catch (error) {
    }
  }

  async IsmigratedData() {
    let data = {
      policyId: this.props.match.params.id
    }
    var isMigrated = await api.post(APIConstant.path.migratedData, data).then(res => {
      if (res.success) {
        console.log('migratedData', res.data[0]);

        return res.data[0].returnValue;
      } else {
        console.log('error');
        return -1;
      }
    }).catch(err => {
      console.log('error', err);
    });
    return isMigrated;
  }

  getVesselTypeRes(value) {
    console.log("getVesselTypeRes", value);
    let SelectedVesselType = this.state.vesselTypeRes.find(x => x.VesselType === value);
    console.log("SelectedVesselType", SelectedVesselType);
  }

  async selectType(value, type) {

    if (type === 'vesselClass') {
      debugger
      if (value === '' || value === undefined || value === null) {
        this.setState({ vesselClassError: true, vesselClass: value, vesselTypeList: [] });
        this.show("", true, "vesselClassError", "Please select Vessel Class");
      } else {
        this.setState({ vesselClassError: false, vesselClass: value.value });
        if (this.state.isEditClassType == true) {
          this.show("vesselClass", false, "vesselClassError", "");
        }

        var SelectedId = "";
        if (value.value === '' || value.value === undefined || value.value === null) {
          SelectedId = value;
        } else {
          SelectedId = value.value;
        }
        this.getVesselType(SelectedId, this.state.country, this.state.TPO);

        var vesselClass = this.state.VesselClassList.filter(e => e.value === value.value);
        if (vesselClass.length) {
          var data = await this.getUseOfVessel(vesselClass[0].label);
          this.setState({ UseofVesselList: data });
        }

        if (value.label == "Dinghy" || value.label == "Rowing Sculls") {
          this.setState({
            isDisplayEngine: 0, mainEngine: '', mainEngineHp: '', mainEngineYear: '', noOfEngine: '', tarnsmissionMainEngine: '',
            auxiliaryEngine: '', auxiliaryEngineHp: '', auxiliaryEngineYear: '', auxiliaryEngineNoEngine: '', auxiliaryEngineTransmission: '', maxSpeed: 0,
            makeofTrailer: '', trailerSerialNo: '',
            tenderVesselMake: '', tenderVesselYear: '', tenderVesselLength: '', tenderVesselMaterial: '', makeAndModelOfEngine: '', makeAndModelOfEngineHP: ''
          })
        } else {
          this.setState({ isDisplayEngine: 1 })
        }
      }
    }

    if (type === 'vesselType') {
      if (value === '' || value === undefined || value === null) {
        this.setState({ vesselTypeError: true, vesselType: value });
        this.show("", true, "vesselTypeError", "Please select Vessel Type");
      } else {
        this.setState({ vesselTypeError: false, vesselType: value.value });
        this.getVesselTypeRes(value);
        this.show("vesselType", false, "vesselTypeError", "");
      }
    }

    if (type === 'vesselCategory') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ vesselCategoryError: true, vesselCategory: value });
        this.show('vesselCategory', true);
      } else {
        this.setState({ vesselCategoryError: false, vesselCategory: value });
        this.show('vesselCategory', false);
      }
    }

    if (type === 'vesselMake') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ vesselMakeError: true, vesselMake: value });
        this.show('vesselMake', true);
      } else {
        this.setState({ vesselMakeError: false, vesselMake: value });
        this.show('vesselMake', false);
      }
    }

    if (type === 'vesselUseOfVessel') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ vesselUseOfVesselError: true, vesselUseOfVessel: value });
        this.show('vesselUseOfVessel', true);
      } else {
        this.setState({ vesselUseOfVesselError: false, vesselUseOfVessel: value });
        this.show('vesselUseOfVessel', false);
      }
    }

    if (type === 'vesselBuildType') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ vesselBuildTypeError: true, vesselBuildType: value });
        this.show('vesselBuildType', true);
      } else {
        this.setState({ vesselBuildTypeError: false, vesselBuildType: value });
        this.show('vesselBuildType', false);
      }
    }

    if (type === 'vesselHullMaterial') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ vesselHullMaterialError: true, vesselHullMaterial: value });
        this.show('vesselHullMaterial', true);
      } else {
        this.setState({ vesselHullMaterialError: false, vesselHullMaterial: value });
        this.show('vesselHullMaterial', false);
      }
    }

    if (type === 'noOfEngine') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ noOfEngineError: true, noOfEngine: value });
        this.show('noOfEngine', true);
      } else {
        this.setState({ noOfEngineError: false, noOfEngine: value });
        this.show('noOfEngine', false);
      }
    }

    if (type === 'tarnsmissionMainEngine') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ tarnsmissionMainEngineError: true, tarnsmissionMainEngine: value });
        this.show('tarnsmissionMainEngine', true);
      } else {
        this.setState({ tarnsmissionMainEngineError: false, tarnsmissionMainEngine: value });
        this.show('tarnsmissionMainEngine', false);
      }
    }

    if (type === 'auxiliaryEngine') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ auxiliaryEngineError: true, auxiliaryEngine: value });
        this.show('auxiliaryEngine', true);
      } else {
        this.setState({ auxiliaryEngineError: false, auxiliaryEngine: value });
        this.show('auxiliaryEngine', false);
      }
    }

    if (type === 'auxiliaryEngineNoEngine') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ auxiliaryEngineNoEngineError: true, auxiliaryEngineNoEngine: value });
        this.show('auxiliaryEngineNoEngine', true);
      } else {
        this.setState({ auxiliaryEngineNoEngineError: false, auxiliaryEngineNoEngine: value });
        this.show('auxiliaryEngineNoEngine', false);
      }
    }

    if (type === 'auxiliaryEngineTransmission') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ auxiliaryEngineTransmissionError: true, auxiliaryEngineTransmission: value });
        this.show('auxiliaryEngineTransmission', true);
      } else {
        this.setState({ auxiliaryEngineTransmissionError: false, auxiliaryEngineTransmission: value });
        this.show('auxiliaryEngineTransmission', false);
      }
    }

    if (type === 'tenderVesselMaterial') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ tenderVesselMaterialError: true, tenderVesselMaterial: value });
        this.show('tenderVesselMaterial', true);
      } else {
        this.setState({ tenderVesselMaterialError: false, tenderVesselMaterial: value });
        this.show('tenderVesselMaterial', false);
      }
    }

    if (type === 'sumInsuredMethod') {
      if (CommonConfig.isEmpty(value)) {
        this.setState({ sumInsuredMethodError: true, sumInsuredMethod: value });
        this.show('sumInsuredMethod', true);
      } else {
        this.setState({ sumInsuredMethodError: false, sumInsuredMethod: value });
        this.show('sumInsuredMethod', false);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    let numberRegExp = CommonConfig.RegExp.number;
    let decimalRegExp = CommonConfig.RegExp.decimalWithOne;
    let alphaNumeric = CommonConfig.RegExp.alphaNumeric;
    let allowAllWithSpace = CommonConfig.RegExp.allowAllWithSpace;

    if (e.target.name === 'TPO') {
      this.setState({ TPO: e.target.checked });
      if (!CommonConfig.isEmpty(this.state.country)) {
        this.getVesselClassByCountry(this.state.country, e.target.checked);
        this.setState({ vesselClass: '', vesselClassError: true, vesselType: '', vesselTypeError: true });
      }
    }

    if (e.target.name === 'vesselName') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ vesselNameError: true });
        // this.show("vesselName", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ vesselNameError: true });
          this.show("vesselName", true);
        } else {
          this.setState({ vesselNameError: false, vesselName: e.target.value });
          this.show("vesselName", false);
        }
      }
    }

    if (e.target.name === 'vesselModel') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ vesselModelError: true });
        this.show("vesselModel", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ vesselModelError: true });
          this.show("vesselModel", true);
        } else {
          this.setState({ vesselModelError: false, vesselModel: e.target.value });
          this.show("vesselModel", false);
        }
      }
    }

    if (e.target.name === 'serialNo') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ serialNoError: true });
        // this.show("serialNo", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ serialNoError: true });
          this.show("serialNo", true);
        } else {
          this.setState({ serialNoError: false, serialNo: e.target.value });
          this.show("serialNo", false);
        }
      }
    }

    if (e.target.name === 'vesselLength') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ vesselLengthError: true });
        // this.show("vesselLength", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ vesselLengthError: true });
          this.show("vesselLength", true);
        } else {
          this.setState({ vesselLengthError: false, vesselLength: e.target.value });
          this.show("vesselLength", false);
        }
      }
    }

    if (e.target.name === 'vesselBuiltYear') {
      let d = new Date();
      let n = d.getFullYear();
      if (e.target.value === '' || e.target.value === null || e.target.value === '' || e.target.value === null || e.target.value > n) {
        this.setState({ vesselBuildYearError: true });
        this.show("vesselBuiltYear", true, "vesselBuildYearError", "Please enter Year Built");
      } else {
        let yearRegEx = CommonConfig.RegExp.year;
        let year = e.target.value;
        var minYear = moment().subtract(100, 'year').format('YYYY');
        var maxYear = moment().year();
        if (!yearRegEx.test(year) || (year < minYear || year > maxYear)) {
          this.setState({ vesselBuildYearError: true });
          this.show("vesselBuiltYear", true, "vesselBuildYearError", "Please enter valid Year Built");
        } else {
          this.setState({ vesselBuildYearError: false, vesselBuiltYear: e.target.value });
          this.show("vesselBuiltYear", false, "vesselBuildYearError", "");
          let BoatAge = new Date().getFullYear() - e.target.value;
          this.setState({
            vessellastSurveyDateLabel: (BoatAge >= 20) ? "Last Survey Date *" : "Last Survey Date",
            vesselLastSurveyDateError: (BoatAge >= 20) ? true : false,
            vesselLastSurveyDate: '',
          });

          if (BoatAge <= 20) {
            let dueDate = moment(e.target.value, "YYYY-MM-DD").add('years', 20);
            let surveyDueDate = moment(dueDate._d).format("YYYY-MM-DD");
            this.setState({ vesselSurveyDueDate: surveyDueDate, vesselSurveyDueDateError: false });
          } else {
            this.setState({ vesselSurveyDueDate: '', vesselSurveyDueDateError: true });
          }
        }
      }
      // if (e.target.value === '' || e.target.value === null || e.target.value > n || !numberRegExp.test(e.target.value)) {
      //   this.setState({ vesselBuildYearError: true });
      //   this.show("vesselBuiltYear", true,"vesselBuildYearError", "Please select Year of Build");
      // } else {
      // this.setState({ vesselBuildYearError: false, vesselBuiltYear: e.target.value });
      // this.show("vesselBuiltYear", false ,"vesselBuildYearError", "");
      // }
    }

    if (e.target.name === 'vesselLastSurveyDate') {
      debugger
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ vesselLastSurveyDateError: true });
      } else if (moment(e.target.value).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
        this.setState({ vesselLastSurveyDateError: true });
        this.show("vesselLastSurveyDate", true, "vesselLastSurveyDateError", "Please enter valid Last Survey Date");
      } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().subtract(5, 'years').format('YYYY-MM-DD')) {
        this.setState({ vesselLastSurveyDateError: true });
        this.show("vesselLastSurveyDate", true, "vesselLastSurveyDateError", "Please enter valid Last Survey Date");
      } else {
        let SurveyDueDate = moment(e.target.value).add(5, 'years').format('YYYY-MM-DD');
        this.setState({ vesselLastSurveyDateError: false, vesselLastSurveyDate: e.target.value, vesselSurveyDueDate: SurveyDueDate, vesselSurveyDueDateError: false });
        this.show("vesselLastSurveyDate", false, "vesselLastSurveyDateError", "");
      }

      var BoatAge = new Date().getFullYear() - this.state.vesselBuiltYear;
      if (BoatAge < 20) {
        this.setState({ vesselLastSurveyDateError: false });
      }
    }

    if (e.target.name === 'vesselSurveyDueDate') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ vesselSurveyDueDateError: true });
        this.show("vesselSurveyDueDate", true);
      } else {
        this.setState({ vesselSurveyDueDateError: false, vesselSurveyDueDate: e.target.value });
        this.show("vesselSurveyDueDate", false);
      }
    }

    if (e.target.name === 'vesselPurchasePrice') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ vesselPurchasePriceError: true });
        this.show("vesselPurchasePrice", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ vesselPurchasePriceError: true });
          this.show("vesselPurchasePrice", true);
        } else {
          this.setState({ vesselPurchasePriceError: false, vesselPurchasePrice: e.target.value });
          this.show("vesselPurchasePrice", false);
        }
      }
    }

    if (e.target.name === 'vesselYearPurchased') {
      var d = new Date();
      var n = d.getFullYear();
      // if (e.target.value === '' || e.target.value === null || !numberRegExp.test(e.target.value) || e.target.value > n) {
      //   this.setState({ vesselYearPurchasedError: true });
      //   this.show("vesselYearPurchased", true);
      // } else {
      //   this.setState({ vesselYearPurchasedError: false, vesselYearPurchased: e.target.value });
      //   this.show("vesselYearPurchased", false);
      // }
      if (e.target.value === '' || e.target.value === null || e.target.value === '' || e.target.value === null || e.target.value > n) {
        this.setState({ vesselYearPurchasedError: true });
        this.show("vesselYearPurchased", true, "vesselYearPurchasedError", "Please enter Year Built");
      } else {
        let year = e.target.value;
        if (!numberRegExp.test(year)) {
          this.setState({ vesselYearPurchasedError: true });
          this.show("vesselYearPurchased", true, "vesselYearPurchasedError", "Please enter valid Year Built");
        } else {
          this.setState({ vesselYearPurchasedError: false, vesselYearPurchased: e.target.value });
          this.show("vesselYearPurchased", false, "vesselYearPurchasedError", "");
        }
      }
    }

    if (e.target.name === 'mainEngine') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ mainEngineError: true });
        // this.show("mainEngine", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ mainEngineError: true });
          this.show("mainEngine", true);
        } else {
          this.setState({ mainEngineError: false, mainEngine: e.target.value });
          this.show("mainEngine", false);
        }
      }
    }

    if (e.target.name === 'mainEngineHp') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ mainEngineHpError: true });
        // this.show("mainEngineHp", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ mainEngineHpError: true });
          this.show("mainEngineHp", true);
        } else {
          this.setState({ mainEngineHpError: false, mainEngineHp: e.target.value });
          this.show("mainEngineHp", false);
        }
      }
    }

    if (e.target.name === 'mainEngineYear') {
      var d = new Date();
      var n = d.getFullYear();
      var minYear = moment().subtract(100, 'year').format('YYYY');
      var maxYear = moment().year();
      if (e.target.value === '' || e.target.value === null || !CommonConfig.RegExp.year.test(e.target.value) || e.target.value > n || (e.target.value < minYear || e.target.value > maxYear)) {
        this.setState({ mainEngineYearError: true });
        this.show("mainEngineYear", true);
      } else {
        this.setState({ mainEngineYearError: false, mainEngineYear: e.target.value });
        this.show("mainEngineYear", false);
      }
    }

    if (e.target.name === 'mainEngineSerialNo') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ mainEngineSerialNoError: true });
        // this.show("mainEngineSerialNo", true);
      } else {
        if (!allowAllWithSpace.test(e.target.value)) {
          this.setState({ mainEngineSerialNoError: true });
          this.show("mainEngineSerialNo", true);
        } else {
          this.setState({ mainEngineSerialNoError: false, mainEngineSerialNo: e.target.value });
          this.show("mainEngineSerialNo", false);
        }
      }
    }

    if (e.target.name === 'auxiliaryEngineHp') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ auxiliaryEngineHpError: true });
        // this.show("auxiliaryEngineHp", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ auxiliaryEngineHpError: true });
          this.show("auxiliaryEngineHp", true);
        } else {
          this.setState({ auxiliaryEngineHpError: false, auxiliaryEngineHp: e.target.value });
          this.show("auxiliaryEngineHp", false);
        }
      }
    }

    if (e.target.name === 'auxiliaryEngineYear') {
      var d = new Date();
      var n = d.getFullYear();
      var minYear = moment().subtract(100, 'year').format('YYYY');
      var maxYear = moment().year();
      if (e.target.value === '' || e.target.value === null || !CommonConfig.RegExp.year.test(e.target.value) || e.target.value > n || (e.target.value < minYear || e.target.value > maxYear)) {
        this.setState({ auxiliaryEngineYearError: true });
        this.show("auxiliaryEngineYear", true);
      } else {
        this.setState({ auxiliaryEngineYearError: false, auxiliaryEngineYear: e.target.value });
        this.show("auxiliaryEngineYear", false);
      }
    }

    if (e.target.name === 'auxiliaryEngineSerialNo') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ auxiliaryEngineSerialNoError: true });
        // this.show("auxiliaryEngineSerialNo", true);
      } else {
        if (!allowAllWithSpace.test(e.target.value)) {
          this.setState({ auxiliaryEngineSerialNoError: true });
          this.show("auxiliaryEngineSerialNo", true);
        } else {
          this.setState({ auxiliaryEngineSerialNoError: false, auxiliaryEngineSerialNo: e.target.value });
          this.show("auxiliaryEngineSerialNo", false);
        }
      }
    }

    if (e.target.name === 'maxSpeed') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ maxSpeedError: true });
        // this.show("maxSpeed", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ maxSpeedError: true });
          this.show("maxSpeed", true);
        } else {
          this.setState({ maxSpeedError: false, maxSpeed: e.target.value });
          this.show("maxSpeed", false);
        }
      }
    }

    if (e.target.name === 'makeofTrailer') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ makeofTrailerError: true });
        // this.show("makeofTrailer", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ makeofTrailerError: true });
          this.show("makeofTrailer", true);
        } else {
          this.setState({ makeofTrailerError: false, makeofTrailer: e.target.value });
          this.show("makeofTrailer", false);
        }
      }
    }

    if (e.target.name === 'trailerSerialNo') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ trailerSerialNoError: true });
        // this.show("trailerSerialNo", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ trailerSerialNoError: true });
          this.show("trailerSerialNo", true);
        } else {
          this.setState({ trailerSerialNoError: false, trailerSerialNo: e.target.value });
          this.show("trailerSerialNo", false);
        }
      }
    }

    if (e.target.name === 'tenderVesselMake') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ tenderVesselMakeError: true });
        // this.show("tenderVesselMake", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ tenderVesselMakeError: true });
          this.show("tenderVesselMake", true);
        } else {
          this.setState({ tenderVesselMakeError: false, tenderVesselMake: e.target.value });
          this.show("tenderVesselMake", false);
        }
      }
    }

    if (e.target.name === 'tenderVesselYear') {
      var d = new Date();
      var n = d.getFullYear();
      var minYear = moment().subtract(100, 'year').format('YYYY');
      var maxYear = moment().year();
      if (e.target.value === '' || e.target.value === null || !CommonConfig.RegExp.year.test(e.target.value) || e.target.value > n || (e.target.value < minYear || e.target.value > maxYear)) {
        this.setState({ tenderVesselYearError: true });
        this.show("tenderVesselYear", true);
      } else {
        this.setState({ tenderVesselYearError: false, tenderVesselYear: e.target.value });
        this.show("tenderVesselYear", false);
      }
    }

    if (e.target.name === 'tenderVesselLength') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ tenderVesselLengthError: true });
        // this.show("tenderVesselLength", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ tenderVesselLengthError: true });
          this.show("tenderVesselLength", true);
        } else {
          this.setState({ tenderVesselLengthError: false, tenderVesselLength: e.target.value });
          this.show("tenderVesselLength", false);
        }
      }
    }

    if (e.target.name === 'makeAndModelOfEngine') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ makeAndModelOfEngineError: true });
        // this.show("makeAndModelOfEngine", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ makeAndModelOfEngineError: true });
          this.show("makeAndModelOfEngine", true);
        } else {
          this.setState({ makeAndModelOfEngineError: false, makeAndModelOfEngine: e.target.value });
          this.show("makeAndModelOfEngine", false);
        }
      }
    }

    if (e.target.name === 'makeAndModelOfEngineHP') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ makeAndModelOfEngineHPError: true });
        // this.show("makeAndModelOfEngineHP", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ makeAndModelOfEngineHPError: true });
          this.show("makeAndModelOfEngineHP", true);
        } else {
          this.setState({ makeAndModelOfEngineHPError: false, makeAndModelOfEngineHP: e.target.value });
          this.show("makeAndModelOfEngineHP", false);
        }
      }
    }

    // navigational breakup
    if (e.target.name === 'navigationalEquipmentRadarDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentRadarDescError: true });
        // this.show("navigationalEquipmentRadarDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentRadarDescError: true });
          this.show("navigationalEquipmentRadarDesc", true);
        } else {
          this.setState({ navigationalEquipmentRadarDescError: false, navigationalEquipmentRadarDesc: e.target.value });
          this.show("navigationalEquipmentRadarDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentRadarValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentRadarValueError: true });
        // this.show("navigationalEquipmentRadarValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentRadarValueError: true });
          this.show("navigationalEquipmentRadarValue", true);
        } else {
          this.setState({ navigationalEquipmentRadarValueError: false, navigationalEquipmentRadarValue: e.target.value });
          this.show("navigationalEquipmentRadarValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentSonarDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentSonarDescError: true });
        // this.show("navigationalEquipmentSonarDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentSonarDescError: true });
          this.show("navigationalEquipmentSonarDesc", true);
        } else {
          this.setState({ navigationalEquipmentSonarDescError: false, navigationalEquipmentSonarDesc: e.target.value });
          this.show("navigationalEquipmentSonarDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentSonarValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentSonarValueError: true });
        // this.show("navigationalEquipmentSonarValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentSonarValueError: true });
          this.show("navigationalEquipmentSonarValue", true);
        } else {
          this.setState({ navigationalEquipmentSonarValueError: false, navigationalEquipmentSonarValue: e.target.value });
          this.show("navigationalEquipmentSonarValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentGPSDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentGPSDescError: true });
        // this.show("navigationalEquipmentGPSDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentGPSDescError: true });
          this.show("navigationalEquipmentGPSDesc", true);
        } else {
          this.setState({ navigationalEquipmentGPSDescError: false, navigationalEquipmentGPSDesc: e.target.value });
          this.show("navigationalEquipmentGPSDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentGPSValue') {
      if (e.target.value === '' || e.target.value === null || !decimalRegExp.test(e.target.value)) {
        // this.setState({ navigationalEquipmentGPSValueError: true });
        // this.show("navigationalEquipmentGPSValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentGPSValueError: true });
          this.show("navigationalEquipmentGPSValue", true);
        } else {
          this.setState({ navigationalEquipmentGPSValueError: false, navigationalEquipmentGPSValue: e.target.value });
          this.show("navigationalEquipmentGPSValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentPlotterDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentPlotterDescError: true });
        // this.show("navigationalEquipmentPlotterDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentPlotterDescError: true });
          this.show("navigationalEquipmentPlotterDesc", true);
        } else {
          this.setState({ navigationalEquipmentPlotterDescError: false, navigationalEquipmentPlotterDesc: e.target.value });
          this.show("navigationalEquipmentPlotterDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentPlotterValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentPlotterValueError: true });
        // this.show("navigationalEquipmentPlotterValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentPlotterValueError: true });
          this.show("navigationalEquipmentPlotterValue", true);
        } else {
          this.setState({ navigationalEquipmentPlotterValueError: false, navigationalEquipmentPlotterValue: e.target.value });
          this.show("navigationalEquipmentPlotterValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentCombinedEquipmentDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentCombinedEquipmentDescError: true });
        // this.show("navigationalEquipmentCombinedEquipmentDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentCombinedEquipmentDescError: true });
          this.show("navigationalEquipmentCombinedEquipmentDesc", true);
        } else {
          this.setState({ navigationalEquipmentCombinedEquipmentDescError: false, navigationalEquipmentCombinedEquipmentDesc: e.target.value });
          this.show("navigationalEquipmentCombinedEquipmentDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentCombinedEquipmentValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentCombinedEquipmentValueError: true });
        // this.show("navigationalEquipmentCombinedEquipmentValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentCombinedEquipmentValueError: true });
          this.show("navigationalEquipmentCombinedEquipmentValue", true);
        } else {
          this.setState({ navigationalEquipmentCombinedEquipmentValueError: false, navigationalEquipmentCombinedEquipmentValue: e.target.value });
          this.show("navigationalEquipmentCombinedEquipmentValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentVHFDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentVHFDescError: true });
        // this.show("navigationalEquipmentVHFDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentVHFDescError: true });
          this.show("navigationalEquipmentVHFDesc", true);
        } else {
          this.setState({ navigationalEquipmentVHFDescError: false, navigationalEquipmentVHFDesc: e.target.value });
          this.show("navigationalEquipmentVHFDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentVHFValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentVHFValueError: true });
        // this.show("navigationalEquipmentVHFValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentVHFValueError: true });
          this.show("navigationalEquipmentVHFValue", true);
        } else {
          this.setState({ navigationalEquipmentVHFValueError: false, navigationalEquipmentVHFValue: e.target.value });
          this.show("navigationalEquipmentVHFValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentRadioBeaconDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentRadioBeaconDescError: true });
        // this.show("navigationalEquipmentRadioBeaconDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentRadioBeaconDescError: true });
          this.show("navigationalEquipmentRadioBeaconDesc", true);
        } else {
          this.setState({ navigationalEquipmentRadioBeaconDescError: false, navigationalEquipmentRadioBeaconDesc: e.target.value });
          this.show("navigationalEquipmentRadioBeaconDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentRadioBeaconValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentRadioBeaconValueError: true });
        // this.show("navigationalEquipmentRadioBeaconValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentRadioBeaconValueError: true });
          this.show("navigationalEquipmentRadioBeaconValue", true);
        } else {
          this.setState({ navigationalEquipmentRadioBeaconValueError: false, navigationalEquipmentRadioBeaconValue: e.target.value });
          this.show("navigationalEquipmentRadioBeaconValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentAutoPilotDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentAutoPilotDescError: true });
        // this.show("navigationalEquipmentAutoPilotDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentAutoPilotDescError: true });
          this.show("navigationalEquipmentAutoPilotDesc", true);
        } else {
          this.setState({ navigationalEquipmentAutoPilotDescError: false, navigationalEquipmentAutoPilotDesc: e.target.value });
          this.show("navigationalEquipmentAutoPilotDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentAutoPilotValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentAutoPilotValueError: true });
        // this.show("navigationalEquipmentAutoPilotValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentAutoPilotValueError: true });
          this.show("navigationalEquipmentAutoPilotValue", true);
        } else {
          this.setState({ navigationalEquipmentAutoPilotValueError: false, navigationalEquipmentAutoPilotValue: e.target.value });
          this.show("navigationalEquipmentAutoPilotValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentBLUDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentBLUDescError: true });
        // this.show("navigationalEquipmentBLUDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentBLUDescError: true });
          this.show("navigationalEquipmentBLUDesc", true);
        } else {
          this.setState({ navigationalEquipmentBLUDescError: false, navigationalEquipmentBLUDesc: e.target.value });
          this.show("navigationalEquipmentBLUDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentBLUValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentBLUValueError: true });
        // this.show("navigationalEquipmentBLUValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentBLUValueError: true });
          this.show("navigationalEquipmentBLUValue", true);
        } else {
          this.setState({ navigationalEquipmentBLUValueError: false, navigationalEquipmentBLUValue: e.target.value });
          this.show("navigationalEquipmentBLUValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentSlideDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentSlideDescError: true });
        // this.show("navigationalEquipmentSlideDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentSlideDescError: true });
          this.show("navigationalEquipmentSlideDesc", true);
        } else {
          this.setState({ navigationalEquipmentSlideDescError: false, navigationalEquipmentSlideDesc: e.target.value });
          this.show("navigationalEquipmentSlideDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentSlideValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentSlideValueError: true });
        // this.show("navigationalEquipmentSlideValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentSlideValueError: true });
          this.show("navigationalEquipmentSlideValue", true);
        } else {
          this.setState({ navigationalEquipmentSlideValueError: false, navigationalEquipmentSlideValue: e.target.value });
          this.show("navigationalEquipmentSlideValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentWindEquipmentDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentWindEquipmentDescError: true });
        // this.show("navigationalEquipmentWindEquipmentDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalEquipmentWindEquipmentDescError: true });
          this.show("navigationalEquipmentWindEquipmentDesc", true);
        } else {
          this.setState({ navigationalEquipmentWindEquipmentDescError: false, navigationalEquipmentWindEquipmentDesc: e.target.value });
          this.show("navigationalEquipmentWindEquipmentDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquipmentWindEquipmentValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalEquipmentWindEquipmentValueError: true });
        // this.show("navigationalEquipmentWindEquipmentValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalEquipmentWindEquipmentValueError: true });
          this.show("navigationalEquipmentWindEquipmentValue", true);
        } else {
          this.setState({ navigationalEquipmentWindEquipmentValueError: false, navigationalEquipmentWindEquipmentValue: e.target.value });
          this.show("navigationalEquipmentWindEquipmentValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalTridataDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalTridataDescError: true });
        // this.show("navigationalTridataDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalTridataDescError: true });
          this.show("navigationalTridataDesc", true);
        } else {
          this.setState({ navigationalTridataDescError: false, navigationalTridataDesc: e.target.value });
          this.show("navigationalTridataDesc", false);
        }
      }
    }

    if (e.target.name === 'navigationalTridataValue') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalTridataValueError: true });
        // this.show("navigationalTridataValue", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalTridataValueError: true });
          this.show("navigationalTridataValue", true);
        } else {
          this.setState({ navigationalTridataValueError: false, navigationalTridataValue: e.target.value });
          this.show("navigationalTridataValue", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers01Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers01DescError: true });
        // this.show("navigationalOthers01Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalOthers01DescError: true });
          this.show("navigationalOthers01Desc", true);
        } else {
          this.setState({ navigationalOthers01DescError: false, navigationalOthers01Desc: e.target.value });
          this.show("navigationalOthers01Desc", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers01Value') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers01ValueError: true });
        // this.show("navigationalOthers01Value", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalOthers01ValueError: true });
          this.show("navigationalOthers01Value", true);
        } else {
          this.setState({ navigationalOthers01ValueError: false, navigationalOthers01Value: e.target.value });
          this.show("navigationalOthers01Value", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers02Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers02DescError: true });
        // this.show("navigationalOthers02Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalOthers02DescError: true });
          this.show("navigationalOthers02Desc", true);
        } else {
          this.setState({ navigationalOthers02DescError: false, navigationalOthers02Desc: e.target.value });
          this.show("navigationalOthers02Desc", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers02Value') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers02ValueError: true });
        // this.show("navigationalOthers02Value", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalOthers02ValueError: true });
          this.show("navigationalOthers02Value", true);
        } else {
          this.setState({ navigationalOthers02ValueError: false, navigationalOthers02Value: e.target.value });
          this.show("navigationalOthers02Value", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers03Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers03DescError: true });
        // this.show("navigationalOthers03Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalOthers03DescError: true });
          this.show("navigationalOthers03Desc", true);
        } else {
          this.setState({ navigationalOthers03DescError: false, navigationalOthers03Desc: e.target.value });
          this.show("navigationalOthers03Desc", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers03Value') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers03ValueError: true });
        // this.show("navigationalOthers03Value", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalOthers03ValueError: true });
          this.show("navigationalOthers03Value", true);
        } else {
          this.setState({ navigationalOthers03ValueError: false, navigationalOthers03Value: e.target.value });
          this.show("navigationalOthers03Value", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers04Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers04DescError: true });
        // this.show("navigationalOthers04Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ navigationalOthers04DescError: true });
          this.show("navigationalOthers04Desc", true);
        } else {
          this.setState({ navigationalOthers04DescError: false, navigationalOthers04Desc: e.target.value });
          this.show("navigationalOthers04Desc", false);
        }
      }
    }

    if (e.target.name === 'navigationalOthers04Value') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ navigationalOthers04ValueError: true });
        // this.show("navigationalOthers04Value", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ navigationalOthers04ValueError: true });
          this.show("navigationalOthers04Value", true);
        } else {
          this.setState({ navigationalOthers04ValueError: false, navigationalOthers04Value: e.target.value });
          this.show("navigationalOthers04Value", false);
        }
      }
    }
    // navigational breakup

    if (e.target.name === 'PersonalEffectsTVDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsTVDescError: true });
        // this.show("PersonalEffectsTVDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsTVDescError: true });
          this.show("PersonalEffectsTVDesc", true);
        } else {
          this.setState({ PersonalEffectsTVDescError: false, PersonalEffectsTVDesc: e.target.value });
          this.show("PersonalEffectsTVDesc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsMusicEquipmentDesc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsMusicEquipmentDescError: true });
        // this.show("PersonalEffectsMusicEquipmentDesc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsMusicEquipmentDescError: true });
          this.show("PersonalEffectsMusicEquipmentDesc", true);
        } else {
          this.setState({ PersonalEffectsMusicEquipmentDescError: false, PersonalEffectsMusicEquipmentDesc: e.target.value });
          this.show("PersonalEffectsMusicEquipmentDesc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers01Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers01DescError: true });
        // this.show("PersonalEffectsOthers01Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers01DescError: true });
          this.show("PersonalEffectsOthers01Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers01DescError: false, PersonalEffectsOthers01Desc: e.target.value });
          this.show("PersonalEffectsOthers01Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers02Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers02DescError: true });
        // this.show("PersonalEffectsOthers02Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers02DescError: true });
          this.show("PersonalEffectsOthers02Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers02DescError: false, PersonalEffectsOthers02Desc: e.target.value });
          this.show("PersonalEffectsOthers02Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers03Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers03DescError: true });
        // this.show("PersonalEffectsOthers03Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers03DescError: true });
          this.show("PersonalEffectsOthers03Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers03DescError: false, PersonalEffectsOthers03Desc: e.target.value });
          this.show("PersonalEffectsOthers03Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers04Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers04DescError: true });
        // this.show("PersonalEffectsOthers04Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers04DescError: true });
          this.show("PersonalEffectsOthers04Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers04DescError: false, PersonalEffectsOthers04Desc: e.target.value });
          this.show("PersonalEffectsOthers04Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers05Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers05DescError: true });
        // this.show("PersonalEffectsOthers05Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers05DescError: true });
          this.show("PersonalEffectsOthers05Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers05DescError: false, PersonalEffectsOthers05Desc: e.target.value });
          this.show("PersonalEffectsOthers05Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers06Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers06DescError: true });
        // this.show("PersonalEffectsOthers06Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers06DescError: true });
          this.show("PersonalEffectsOthers06Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers06DescError: false, PersonalEffectsOthers06Desc: e.target.value });
          this.show("PersonalEffectsOthers06Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers07Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers07DescError: true });
        // this.show("PersonalEffectsOthers07Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers07DescError: true });
          this.show("PersonalEffectsOthers07Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers07DescError: false, PersonalEffectsOthers07Desc: e.target.value });
          this.show("PersonalEffectsOthers07Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers08Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers08DescError: true });
        // this.show("PersonalEffectsOthers08Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers08DescError: true });
          this.show("PersonalEffectsOthers08Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers08DescError: false, PersonalEffectsOthers08Desc: e.target.value });
          this.show("PersonalEffectsOthers08Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers09Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers09DescError: true });
        // this.show("PersonalEffectsOthers09Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers09DescError: true });
          this.show("PersonalEffectsOthers09Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers09DescError: false, PersonalEffectsOthers09Desc: e.target.value });
          this.show("PersonalEffectsOthers09Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers10Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers10DescError: true });
        // this.show("PersonalEffectsOthers10Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers10DescError: true });
          this.show("PersonalEffectsOthers10Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers10DescError: false, PersonalEffectsOthers10Desc: e.target.value });
          this.show("PersonalEffectsOthers10Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers11Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers11DescError: true });
        // this.show("PersonalEffectsOthers11Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers11DescError: true });
          this.show("PersonalEffectsOthers11Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers11DescError: false, PersonalEffectsOthers11Desc: e.target.value });
          this.show("PersonalEffectsOthers11Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers12Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers12DescError: true });
        // this.show("PersonalEffectsOthers12Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers12DescError: true });
          this.show("PersonalEffectsOthers12Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers12DescError: false, PersonalEffectsOthers12Desc: e.target.value });
          this.show("PersonalEffectsOthers12Desc", false);
        }
      }
    }

    if (e.target.name === 'PersonalEffectsOthers13Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ PersonalEffectsOthers13DescError: true });
        // this.show("PersonalEffectsOthers13Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ PersonalEffectsOthers13DescError: true });
          this.show("PersonalEffectsOthers13Desc", true);
        } else {
          this.setState({ PersonalEffectsOthers13DescError: false, PersonalEffectsOthers13Desc: e.target.value });
          this.show("PersonalEffectsOthers13Desc", false);
        }
      }
    }

    if (e.target.name === 'mainSailCovers') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ mainSailCoversError: true });
        // this.show("mainSailCovers", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ mainSailCoversError: true });
          this.show("mainSailCovers", true);
        } else {
          this.setState({ mainSailCoversError: false, mainSailCovers: e.target.value });
          this.show("mainSailCovers", false);
        }
      }
    }

    if (e.target.name === 'SailsOther01Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ SailsOther01DescError: true });
        // this.show("SailsOther01Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ SailsOther01DescError: true });
          this.show("SailsOther01Desc", true);
        } else {
          this.setState({ SailsOther01DescError: false, SailsOther01Desc: e.target.value });
          this.show("SailsOther01Desc", false);
        }
      }
    }

    if (e.target.name === 'canvasAnchoring') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ canvasAnchoringError: true });
        // this.show("canvasAnchoring", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ canvasAnchoringError: true });
          this.show("canvasAnchoring", true);
        } else {
          this.setState({ canvasAnchoringError: false, canvasAnchoring: e.target.value });
          this.show("canvasAnchoring", false);
        }
      }
    }

    if (e.target.name === 'genovaSailCovers') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ genovaSailCoversError: true });
        // this.show("genovaSailCovers", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ genovaSailCoversError: true });
          this.show("genovaSailCovers", true);
        } else {
          this.setState({ genovaSailCoversError: false, genovaSailCovers: e.target.value });
          this.show("genovaSailCovers", false);
        }
      }
    }

    if (e.target.name === 'SailsOther02Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ SailsOther02DescError: true });
        // this.show("SailsOther02Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ SailsOther02DescError: true });
          this.show("SailsOther02Desc", true);
        } else {
          this.setState({ SailsOther02DescError: false, SailsOther02Desc: e.target.value });
          this.show("SailsOther02Desc", false);
        }
      }
    }

    if (e.target.name === 'sailsAwnings') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ sailsAwningsError: true });
        // this.show("sailsAwnings", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ sailsAwningsError: true });
          this.show("sailsAwnings", true);
        } else {
          this.setState({ sailsAwningsError: false, sailsAwnings: e.target.value });
          this.show("sailsAwnings", false);
        }
      }
    }

    if (e.target.name === 'antiClonehood') {
      if (e.target.value === '' || e.target.value === null || !CommonConfig.RegExp.decimal.test(e.target.value)) {
        // this.setState({ antiClonehoodError: true });
        // this.show("antiClonehood", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ antiClonehoodError: true });
          this.show("antiClonehood", true);
        } else {
          this.setState({ antiClonehoodError: false, antiClonehood: e.target.value });
          this.show("antiClonehood", false);
        }
      }
    }

    if (e.target.name === 'SailsOther03Desc') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ SailsOther03DescError: true });
        // this.show("SailsOther03Desc", true);
      } else {
        if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
          this.setState({ SailsOther03DescError: true });
          this.show("SailsOther03Desc", true);
        } else {
          this.setState({ SailsOther03DescError: false, SailsOther03Desc: e.target.value });
          this.show("SailsOther03Desc", false);
        }
      }
    }

    if (e.target.name === 'hullInboardMachine') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ hullInboardMachineError: true });
        // this.show("hullInboardMachine", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ hullInboardMachineError: true });
          this.show("hullInboardMachine", true);
        } else {
          this.setState({ hullInboardMachineError: false, hullInboardMachine: e.target.value });
          this.show("hullInboardMachine", false);
        }
      }
    }

    if (e.target.name === 'tenderDinghy') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ tenderDinghyError: true });
        // this.show("tenderDinghy", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ tenderDinghyError: true });
          this.show("tenderDinghy", true);
        } else {
          this.setState({ tenderDinghyError: false, tenderDinghy: e.target.value });
          this.show("tenderDinghy", false);
        }
      }
    }

    if (e.target.name === 'lifeRaft') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ lifeRaftError: true });
        // this.show("lifeRaft", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ lifeRaftError: true });
          this.show("lifeRaft", true);
        } else {
          this.setState({ lifeRaftError: false, lifeRaft: e.target.value });
          this.show("lifeRaft", false);
        }
      }
    }

    if (e.target.name === 'outboard1') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ outboard1Error: true });
        this.show("outboard1", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ outboard1Error: true });
          this.show("outboard1", true);
        } else {
          this.setState({ outboard1Error: false, outboard1: e.target.value });
          this.show("outboard1", false);
        }
      }
    }

    if (e.target.name === 'outboard2') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ outboard2Error: true });
        this.show("outboard2", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ outboard2Error: true });
          this.show("outboard2", true);
        } else {
          this.setState({ outboard2Error: false, outboard2: e.target.value });
          this.show("outboard2", false);
        }
      }
    }

    if (e.target.name === 'roadTrailer') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ roadTrailerError: true });
        this.show("roadTrailer", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ roadTrailerError: true });
          this.show("roadTrailer", true);
        } else {
          this.setState({ roadTrailerError: false, roadTrailer: e.target.value });
          this.show("roadTrailer", false);
        }
      }
    }

    if (e.target.name === 'personalEffects') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ personalEffectsError: true });
        // this.show("personalEffects", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ personalEffectsError: true });
          this.show("personalEffects", true);
        } else {
          this.setState({ personalEffectsError: false, personalEffects: e.target.value });
          this.show("personalEffects", false);
        }
      }
    }

    if (e.target.name === 'navigationalEquip') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ navigationalEquipError: true });
        this.show("navigationalEquip", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ navigationalEquipError: true, isNavigationalTotalEqual: true });
          this.show("navigationalEquip", true);
        } else {
          this.setState({ navigationalEquipError: false, navigationalEquip: e.target.value, isNavigationalTotalEqual: false });
          this.show("navigationalEquip", false);
        }
      }
    }

    if (e.target.name === 'sumInsuredSails') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({ sumInsuredSailsError: true });
        this.show("sumInsuredSails", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ sumInsuredSailsError: true });
          this.show("sumInsuredSails", true);
        } else {
          this.setState({ sumInsuredSailsError: false, sumInsuredSails: e.target.value, isSailsTotalEqual: false });
          this.show("sumInsuredSails", false);
        }
      }
    }

    if (e.target.name === 'portableGenerator') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ portableGeneratorError: true });
        // this.show("portableGenerator", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ portableGeneratorError: true });
          this.show("portableGenerator", true);
        } else {
          this.setState({ portableGeneratorError: false, portableGenerator: e.target.value });
          this.show("portableGenerator", false);
        }
      }
    }

    if (e.target.name === 'customCoverage') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ customCoverageError: true });
        // this.show("customCoverage", true);
      } else {
        if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount))) {
          this.setState({ customCoverageError: true });
          this.show("customCoverage", true);
        } else {
          this.setState({ customCoverageError: false, customCoverage: e.target.value });
          this.show("customCoverage", false);
        }
      }
    }

    //Salils, canopy & covers
    if (e.target.name === 'Bimini') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ BiminiError: true });
        // this.show("Bimini", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ BiminiError: true });
          this.show("Bimini", true);
        } else {
          this.setState({ BiminiError: false, Bimini: e.target.value });
          this.show("Bimini", false);
        }
      }
    }

    if (e.target.name === 'Canopy') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ CanopyError: true });
        // this.show("Canopy", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ CanopyError: true });
          this.show("Canopy", true);
        } else {
          this.setState({ CanopyError: false, Canopy: e.target.value });
          this.show("Canopy", false);
        }
      }
    }

    if (e.target.name === 'boatCovers') {
      if (e.target.value === '' || e.target.value === null) {
        // this.setState({ boatCoversError: true });
        // this.show("boatCovers", true);
      } else {
        if (!decimalRegExp.test(e.target.value)) {
          this.setState({ boatCoversError: true });
          this.show("boatCovers", true);
        } else {
          this.setState({ boatCoversError: false, boatCovers: e.target.value });
          this.show("boatCovers", false);
        }
      }
    }
    //Salils, canopy & covers

    this.calculateSumInsured(false);
    this.calculateNavigationalEquipment();
    this.calculatePersonalEffects();
    this.calculateSailsCanopyCovers();
  }

  calculateSumInsured(isSystem) {
    setTimeout(() => {
      var SumInsuredValue = 0;
      var SumInsuredValue = Number(this.state.hullInboardMachine) + Number(this.state.tenderDinghy) + Number(this.state.lifeRaft) + Number(this.state.outboard1) + Number(this.state.outboard2) + Number(this.state.roadTrailer) + Number(this.state.personalEffects) + Number(this.state.navigationalEquip) + Number(this.state.sumInsuredSails) + Number(this.state.portableGenerator) + Number(this.state.customCoverage);

      this.setState({ totalSumInsuredValue: SumInsuredValue });
      if (isSystem) {
        this.setState({ systemTotalSumInsuredValue: SumInsuredValue });
      }

    }, 100);
  }

  calculateNavigationalEquipment() {
    setTimeout(() => {
      var NavigationalEquipment = 0;
      var NavigationalEquipment = Number(this.state.navigationalEquipmentRadarValue) + Number(this.state.navigationalEquipmentSonarValue) + Number(this.state.navigationalEquipmentGPSValue) + Number(this.state.navigationalEquipmentPlotterValue) + Number(this.state.navigationalEquipmentCombinedEquipmentValue) + Number(this.state.navigationalEquipmentVHFValue) + Number(this.state.navigationalEquipmentRadioBeaconValue) + Number(this.state.navigationalEquipmentAutoPilotValue) + Number(this.state.navigationalEquipmentBLUValue) + Number(this.state.navigationalEquipmentSlideValue) + Number(this.state.navigationalEquipmentWindEquipmentValue) + Number(this.state.navigationalTridataValue) + Number(this.state.navigationalOthers01Value) + Number(this.state.navigationalOthers02Value) + Number(this.state.navigationalOthers03Value) + Number(this.state.navigationalOthers04Value);

      this.setState({ NavigationalEquipmentTotal: NavigationalEquipment })
      // this.setState({ navigationalEquip: NavigationalEquipment })
    }, 100);
    // if(this.state.NavigationalEquipmentTotal == this.state.navigationalEquip){
    //   document.getElementById("ItemisedBreakupErrorNav").style.display = "none";
    // }
  }

  calculatePersonalEffects() {
    setTimeout(() => {
      var PersonalEffects = 0;
      var PersonalEffects = Number(this.state.PersonalEffectsTVValue) + Number(this.state.PersonalEffectsMusicEquipmentValue) + Number(this.state.PersonalEffectsOthers01Value) + Number(this.state.PersonalEffectsOthers02Value) + Number(this.state.PersonalEffectsOthers03Value) + Number(this.state.PersonalEffectsOthers04Value) + Number(this.state.PersonalEffectsOthers05Value) + Number(this.state.PersonalEffectsOthers06Value) + Number(this.state.PersonalEffectsOthers07Value) + Number(this.state.PersonalEffectsOthers08Value) + Number(this.state.PersonalEffectsOthers09Value) + Number(this.state.PersonalEffectsOthers10Value) + Number(this.state.PersonalEffectsOthers11Value) + Number(this.state.PersonalEffectsOthers12Value) + Number(this.state.PersonalEffectsOthers13Value);

      this.setState({ PersonalEffectsTotal: PersonalEffects })
      // this.setState({ personalEffects: PersonalEffects })
    }, 100);
  }

  calculateSailsCanopyCovers() {
    setTimeout(() => {
      var sailsCanopyCovers = 0;
      var sailsCanopyCovers = Number(this.state.Bimini) + Number(this.state.Canopy) + Number(this.state.boatCovers);

      this.setState({ SailsTotal: sailsCanopyCovers })
    }, 100);
    // if(this.state.sumInsuredSails == this.state.SailsTotal){
    //   document.getElementById("ItemisedBreakupErrorSail").style.display = "none";
    // }
  }

  // show(field, condition) {
  //   console.log("show", field);
  //   console.log("show", condition);
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

  editVessel(task) {
    if (task == "view") {
      this.setState({ isEdit: false });
    } else {
      this.setState({ isEdit: true });
    }
  }

  editVesselClassType(task) {
    if (task == "view") {
      this.setState({ isEditClassType: false });
    } else {
      this.setState({ isEditClassType: true });
      this.selectType(this.state.defaultVesselClass, 'vesselClass');
    }
  }

  Save = () => {
    try {
      debugger
      var BoatAge = new Date().getFullYear() - this.state.vesselBuiltYear;
      if (this.state.vesselLastSurveyDateError) {
        toast.error('Please enter valid last survey date');
        return;
      }
      else if (BoatAge >= 20 && (this.state.vesselLastSurveyDate == '' || this.state.vesselLastSurveyDate == undefined || this.state.vesselLastSurveyDate == null || this.state.vesselLastSurveyDate == '0000-00-00')) {
        toast.error('Please enter valid last survey date');
        return;
      } else if (this.state.vesselSurveyDueDateError && this.state.liabilityType != 'TPO') {
        toast.error('Please enter valid survey due date.');
        return;
      }
      if (this.state.isNavigationalTotalEqual && this.state.isSailsTotalEqual) {
        document.getElementById("ItemisedBreakupErrorNav").style.display = "none";
        document.getElementById("ItemisedBreakupErrorSail").style.display = "none";
        if (
          this.state.vesselClassError === false &&
          this.state.vesselTypeError === false &&
          this.state.vesselBuildTypeError === false &&
          this.state.makeAndModelOfEngineError === false &&
          this.state.vesselModelError === false &&
          this.state.vesselBuildYearError === false &&
          this.state.vesselLastSurveyDateError === false &&
          this.state.vesselHullMaterialError === false &&
          this.state.vesselPurchasePriceError === false &&
          this.state.vesselUseOfVesselError === false &&
          this.state.vesselLengthError === false &&
          this.state.vesselYearPurchasedError === false &&
          // this.state.mainEngineError === false &&
          // this.state.mainEngineHpError === false &&
          // this.state.mainEngineYearError === false &&
          // this.state.noOfEngineError === false &&
          // this.state.tarnsmissionMainEngineError === false &&
          // this.state.maxSpeedError === false &&
          this.state.sumInsuredMethodError === false) {
          let data = {
            PolicyId: this.props.match.params.id, //'bef076c0-2ea5-11ea-a563-fa163eb9754c',
            VesselClass: this.state.vesselClass,
            VesselType: this.state.vesselType,
            PolicyVesselId: this.state.PolicyVesselId,
            PolicyEngineTrailerDetailId: this.state.PolicyEngineTrailerDetailId,
            PolicyAuxiliaryVesselId: this.state.PolicyAuxiliaryVesselId,
            PolicyNavigationalEquipmentId: this.state.PolicyNavigationalEquipmentId,
            PolicyPersonalEffectId: this.state.PolicyPersonalEffectId,
            PolicySailCanopyCoverId: this.state.PolicySailCanopyCoverId,
            PolicyInsuredAmountId: this.state.PolicyInsuredAmountId,
            vesselCategory: this.state.vesselCategory,

            vesselName: this.state.vesselName.trim(),
            // vesselMake: this.state.vesselMake,
            vesselModel: this.state.vesselModel.trim(),
            serialNo: this.state.serialNo.trim(),
            vesselLength: this.state.vesselLength,
            vesselBuildType: this.state.vesselBuildType,
            vesselBuiltYear: this.state.vesselBuiltYear,
            vesselBuilderName: this.state.vesselBuilderName,
            vesselLastSurveyDate: this.state.vesselLastSurveyDate,
            vesselHullMaterial: this.state.vesselHullMaterial,
            vesselPurchasePrice: this.state.vesselPurchasePrice,
            vesselUseOfVessel: this.state.vesselUseOfVessel,
            vesselYearPurchased: this.state.vesselYearPurchased,
            vesselSurveyDueDate: this.state.vesselSurveyDueDate,
            sumInsuredMethod: this.state.sumInsuredMethod,

            mainEngine: this.state.mainEngine.trim(),
            mainEngineHp: this.state.mainEngineHp,
            mainEngineYear: this.state.mainEngineYear,
            mainEngineSerialNo: this.state.mainEngineSerialNo,
            noOfEngine: this.state.noOfEngine,
            tarnsmissionMainEngine: this.state.tarnsmissionMainEngine,
            auxiliaryEngine: this.state.auxiliaryEngine,
            auxiliaryEngineHp: this.state.auxiliaryEngineHp,
            auxiliaryEngineYear: this.state.auxiliaryEngineYear,
            auxiliaryEngineSerialNo: this.state.auxiliaryEngineSerialNo,
            auxiliaryEngineNoEngine: this.state.auxiliaryEngineNoEngine,
            auxiliaryEngineTransmission: this.state.auxiliaryEngineTransmission,
            maxSpeed: this.state.maxSpeed,
            makeofTrailer: this.state.makeofTrailer.trim(),
            trailerSerialNo: this.state.trailerSerialNo.trim(),

            tenderVesselMake: this.state.tenderVesselMake.trim(),
            tenderVesselYear: this.state.tenderVesselYear,
            tenderVesselLength: this.state.tenderVesselLength,
            makeAndModelOfEngine: this.state.makeAndModelOfEngine.trim(),
            makeAndModelOfEngineHP: this.state.makeAndModelOfEngineHP,
            tenderVesselMaterial: this.state.tenderVesselMaterial,

            navigationalEquipmentRadarDesc: this.state.navigationalEquipmentRadarDesc,
            navigationalEquipmentRadarValue: this.state.navigationalEquipmentRadarValue,
            navigationalEquipmentSonarDesc: this.state.navigationalEquipmentSonarDesc,
            navigationalEquipmentSonarValue: this.state.navigationalEquipmentSonarValue,
            navigationalEquipmentGPSDesc: this.state.navigationalEquipmentGPSDesc,
            navigationalEquipmentGPSValue: this.state.navigationalEquipmentGPSValue,
            navigationalEquipmentPlotterDesc: this.state.navigationalEquipmentPlotterDesc,
            navigationalEquipmentPlotterValue: this.state.navigationalEquipmentPlotterValue,
            navigationalEquipmentCombinedEquipmentDesc: this.state.navigationalEquipmentCombinedEquipmentDesc,
            navigationalEquipmentCombinedEquipmentValue: this.state.navigationalEquipmentCombinedEquipmentValue,
            navigationalEquipmentVHFDesc: this.state.navigationalEquipmentVHFDesc,
            navigationalEquipmentVHFValue: this.state.navigationalEquipmentVHFValue,
            navigationalEquipmentRadioBeaconDesc: this.state.navigationalEquipmentRadioBeaconDesc,
            navigationalEquipmentRadioBeaconValue: this.state.navigationalEquipmentRadioBeaconValue,
            navigationalEquipmentAutoPilotDesc: this.state.navigationalEquipmentAutoPilotDesc,
            navigationalEquipmentAutoPilotValue: this.state.navigationalEquipmentAutoPilotValue,
            navigationalEquipmentSlideDesc: this.state.navigationalEquipmentSlideDesc,
            navigationalEquipmentSlideValue: this.state.navigationalEquipmentSlideValue,
            navigationalEquipmentBLUValue: this.state.navigationalEquipmentBLUValue,
            navigationalEquipmentBLUDesc: this.state.navigationalEquipmentBLUDesc,
            navigationalEquipmentWindEquipmentDesc: this.state.navigationalEquipmentWindEquipmentDesc,
            navigationalEquipmentWindEquipmentValue: this.state.navigationalEquipmentWindEquipmentValue,
            navigationalTridataDesc: this.state.navigationalTridataDesc,
            navigationalTridataValue: this.state.navigationalTridataValue,
            navigationalOthers01Desc: this.state.navigationalOthers01Desc,
            navigationalOthers01Value: this.state.navigationalOthers01Value,
            navigationalOthers02Desc: this.state.navigationalOthers02Desc,
            navigationalOthers02Value: this.state.navigationalOthers02Value,
            navigationalOthers03Desc: this.state.navigationalOthers03Desc,
            navigationalOthers03Value: this.state.navigationalOthers03Value,
            navigationalOthers04Desc: this.state.navigationalOthers04Desc,
            navigationalOthers04Value: this.state.navigationalOthers04Value,

            // currently removed
            // PersonalEffectsTVDesc: this.state.PersonalEffectsTVDesc,
            // PersonalEffectsTVValue: this.state.PersonalEffectsTVValue,
            // PersonalEffectsMusicEquipmentDesc: this.state.PersonalEffectsMusicEquipmentDesc,
            // PersonalEffectsMusicEquipmentValue: this.state.PersonalEffectsMusicEquipmentValue,
            // PersonalEffectsOthers01Desc: this.state.PersonalEffectsOthers01Desc,
            // PersonalEffectsOthers01Value: this.state.PersonalEffectsOthers01Value,
            // PersonalEffectsOthers02Desc: this.state.PersonalEffectsOthers02Desc,
            // PersonalEffectsOthers02Value: this.state.PersonalEffectsOthers02Value,
            // PersonalEffectsOthers03Desc: this.state.PersonalEffectsOthers03Desc,
            // PersonalEffectsOthers03Value: this.state.PersonalEffectsOthers03Value,
            // PersonalEffectsOthers04Desc: this.state.PersonalEffectsOthers04Desc,
            // PersonalEffectsOthers04Value: this.state.PersonalEffectsOthers04Value,
            // PersonalEffectsOthers05Desc: this.state.PersonalEffectsOthers05Desc,
            // PersonalEffectsOthers05Value: this.state.PersonalEffectsOthers05Value,
            // PersonalEffectsOthers06Desc: this.state.PersonalEffectsOthers06Desc,
            // PersonalEffectsOthers06Value: this.state.PersonalEffectsOthers06Value,
            // PersonalEffectsOthers07Desc: this.state.PersonalEffectsOthers07Desc,
            // PersonalEffectsOthers07Value: this.state.PersonalEffectsOthers07Value,
            // PersonalEffectsOthers08Desc: this.state.PersonalEffectsOthers08Desc,
            // PersonalEffectsOthers08Value: this.state.PersonalEffectsOthers08Value,
            // PersonalEffectsOthers09Desc: this.state.PersonalEffectsOthers09Desc,
            // PersonalEffectsOthers09Value: this.state.PersonalEffectsOthers09Value,
            // PersonalEffectsOthers10Desc: this.state.PersonalEffectsOthers10Desc,
            // PersonalEffectsOthers10Value: this.state.PersonalEffectsOthers10Value,
            // PersonalEffectsOthers11Desc: this.state.PersonalEffectsOthers11Desc,
            // PersonalEffectsOthers11Value: this.state.PersonalEffectsOthers11Value,
            // PersonalEffectsOthers12Desc: this.state.PersonalEffectsOthers12Desc,
            // PersonalEffectsOthers12Value: this.state.PersonalEffectsOthers12Value,
            // PersonalEffectsOthers13Desc: this.state.PersonalEffectsOthers13Desc,
            // PersonalEffectsOthers13Value: this.state.PersonalEffectsOthers13Value,
            // currently removed

            Bimini: this.state.Bimini,
            Canopy: this.state.Canopy,
            boatCovers: this.state.boatCovers,

            // currently removed
            // mainSailCovers: this.state.mainSailCovers,
            // SailsOther01Desc: this.state.SailsOther01Desc,
            // SailsOther01Value: this.state.SailsOther01Value,
            // SailsOther02Desc: this.state.SailsOther02Desc,
            // SailsOther02Value: this.state.SailsOther02Value,
            // SailsOther03Desc: this.state.SailsOther03Desc,
            // SailsOther03Value: this.state.SailsOther03Value,
            // canvasAnchoring: this.state.canvasAnchoring,
            // genovaSailCovers: this.state.genovaSailCovers,
            // sailsAwnings: this.state.sailsAwnings,
            // antiClonehood: this.state.antiClonehood,
            // currently removed

            hullInboardMachine: this.state.hullInboardMachine,
            tenderDinghy: this.state.tenderDinghy,
            lifeRaft: this.state.lifeRaft,
            outboard1: this.state.outboard1,
            outboard2: this.state.outboard2,
            roadTrailer: this.state.roadTrailer,
            personalEffects: this.state.personalEffects,
            navigationalEquip: this.state.navigationalEquip,
            sumInsuredSails: this.state.sumInsuredSails,
            portableGenerator: this.state.portableGenerator,
            customCoverage: this.state.customCoverage,

            totalSumInsuredValue: this.state.totalSumInsuredValue,
            NavigationalEquipmentTotal: this.state.NavigationalEquipmentTotal,
            PersonalEffectsTotal: this.state.PersonalEffectsTotal,
            SailsTotal: this.state.SailsTotal,
          }
          api.post('api/addVesselPolicy', data).then(res => {
            if (res.data.success) {
              var firstRes = res.data;
              let secondData = {
                policyId: this.props.match.params.id,
                CurrentUser: CommonConfig.loggedInUserId(),
              }
              api.post('api/isPolicyReferred', secondData).then(res => {
                if (res.success) {

                  if (this.state.systemTotalSumInsuredValue !== this.state.totalSumInsuredValue) {
                    let thirdData = {
                      policyId: this.props.match.params.id,
                      message: "Sum Insured was Updated from " + this.state.systemTotalSumInsuredValue + " to " + this.state.totalSumInsuredValue + " amount.",
                      CurrentUser: CommonConfig.loggedInUserId(),
                    }
                    api.post('api/addNoteSumInsured', thirdData).then(async res => {
                      if (res.success) {


                        const fourthData = {
                          policyId: this.props.match.params.id,
                          PremiumPolicyType: '',
                          IsRenewal: 0,
                          CurrentUser: CommonConfig.loggedInUserId()
                        };
                        api.post(APIConstant.path.setPremiumPolicyType, fourthData).then(res => {
                          console.log('setPremiumPolicyType', res.data);

                          if (res.success) {
                            if (CommonConfig.isEmpty(res.data.returnValue)) {
                              toast.success(firstRes.message);
                              this.editVessel("view");
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


                        // let fourthData = {
                        //   policyId: this.props.match.params.id,
                        //   IsRenewal: 0,
                        //   CurrentUser: CommonConfig.loggedInUserId()
                        // }

                        // api.post('api/recomputePremium', fourthData).then(res => {
                        //   debugger

                        //   if (res.success) {
                        //     if (CommonConfig.isEmpty(res.data.returnValue)) {
                        //       toast.success(firstRes.message);
                        //       this.editVessel("view");
                        //       setTimeout(function () {
                        //         window.location.reload();
                        //       }, 1000);
                        //     }
                        //     else {
                        //       toast.error("There was an error while calculating the premium. " + res.data.returnValue);
                        //     }
                        //   } else {
                        //     console.log('error');

                        //   }
                        // }).catch(err => {

                        // });
                      }
                    });
                  } else {
                    const fourthData = {
                      policyId: this.props.match.params.id,
                      PremiumPolicyType: '',
                      IsRenewal: 0,
                      CurrentUser: CommonConfig.loggedInUserId()
                    };
                    api.post(APIConstant.path.setPremiumPolicyType, fourthData).then(res => {
                      console.log('setPremiumPolicyType', res.data);

                      if (res.success) {
                        if (CommonConfig.isEmpty(res.data.returnValue)) {
                          toast.success(firstRes.message);
                          this.editVessel("view");
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
                    // toast.success(firstRes.message);
                    // this.editVessel("view");
                    // setTimeout(function () {
                    //   window.location.reload();
                    // }, 1000);
                  }
                }
              }).catch(err => {
                console.log("error", err);
              });

              // this.reset();
            } else {

            }
          }).catch(err => {
            console.log("error", err);
          });
        } else {
          console.log("errror");
          if (this.state.vesselClassError != false) {
            toast.error("Please select Vessel Class")
            return;
          }
          if (this.state.vesselTypeError != false) {
            toast.error("Please select Vessel Type")
            return;
          }
          if (this.state.vesselBuildTypeError != false) {
            toast.error("Please select Vessel Build Type")
            return;
          }
          if (this.state.makeAndModelOfEngineError != false) {
            toast.error("Please select Make And Model Of Engine ")
            return;
          }
          if (this.state.vesselModelError != false) {
            toast.error("Please select Vessel Model")
            return;
          }
          if (this.state.vesselBuildYearError != false) {
            toast.error("Please select Vessel Built Year")
            return;
          }
          if (this.state.vesselLastSurveyDateError != false) {
            toast.error("Please select Vessel Last Survey Date")
            return;
          }
          if (this.state.vesselHullMaterialError != false) {
            toast.error("Please select Vessel Hull Material")
            return;
          }
          if (this.state.vesselPurchasePriceError != false) {
            toast.error("Please select Vessel Purchase Price")
            return;
          }
          if (this.state.vesselUseOfVesselError != false) {
            toast.error("Please select Use Of Vessel")
            return;
          }
          if (this.state.vesselLengthError != false) {
            toast.error("Please select Vessel Length")
            return;
          }
          if (this.state.vesselYearPurchasedError != false) {
            toast.error("Please select Vessel Year Purchased")
            return;
          }
          // if (this.state.mainEngineError != false) {
          //   toast.error("Please enter main engine")
          //   return;
          // }
          // if (this.state.mainEngineHpError != false) {
          //   toast.error("Please enter main engine HP")
          //   return;
          // }
          // if (this.state.mainEngineYearError != false) {
          //   toast.error("Please enter main engine year")
          //   return;
          // }
          // if (this.state.noOfEngineError != false) {
          //   toast.error("Please select No of main engine")
          //   return;
          // }
          // if (this.state.tarnsmissionMainEngineError != false) {
          //   toast.error("Please select main engine Tarnsmission")
          //   return;
          // }
          // if (this.state.maxSpeedError != false) {
          //   toast.error("Please enter max speed")
          //   return;
          // }
          if (this.state.sumInsuredMethodError != false) {
            toast.error("Please select Sum Insured Method")
            return;
          }
        }
      } else {
        if (!this.state.isNavigationalTotalEqual) {
          document.getElementById("ItemisedBreakupErrorNav").style.display = "block";
        } else if (!this.state.isSailsTotalEqual) {
          document.getElementById("ItemisedBreakupErrorSail").style.display = "block";
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  modelForPersonalEffects() {
    this.openModelForPersonalEffects();
  }

  modelSailsCanopyCovers() {
    this.openModelSailsCanopyCovers();
  }

  openModelForPersonalEffects() {
    this.setState({ toggleModalAdd: !this.state.toggleModalAdd });
  }

  openModelSailsCanopyCovers() {
    this.setState({ toggleModalAddForSails: !this.state.toggleModalAddForSails });
  }

  saveSail() {
    if (this.state.sumInsuredSails == this.state.SailsTotal) {
      this.setState({ isSailsTotalEqual: true })
    } else {
      this.setState({ isSailsTotalEqual: false })
    }
    if (this.state.isEdit) {
      if (document.getElementById("ItemisedBreakupErrorSail").style.display == "block") {
        if (this.state.sumInsuredSails == this.state.SailsTotal) {
          document.getElementById("ItemisedBreakupErrorSail").style.display = "none";
        }
      }
    }
    this.setState({ toggleModalAddForSails: false });
  }

  saveNavigationalEqp() {
    if (this.state.NavigationalEquipmentTotal == this.state.navigationalEquip) {
      this.setState({ isNavigationalTotalEqual: true })
    } else {
      this.setState({ isNavigationalTotalEqual: false })
    }
    if (this.state.isEdit) {
      if (document.getElementById("ItemisedBreakupErrorNav").style.display == "block") {
        if (this.state.NavigationalEquipmentTotal == this.state.navigationalEquip) {
          document.getElementById("ItemisedBreakupErrorNav").style.display = "none";
        }
      }
    }
    this.setState({ toggleModalAdd: false });
  }

  goBack() {
    this.props.history.push('/PolicyDetails');
  }

  toggleCustom = (tab) => {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ custom: state });
  }

  toggleAll = (toggleType) => {
    const prevState = this.state.custom;
    if (toggleType === 'expand') {
      const state = prevState.map((x, index) => x = true);
      this.setState({ custom: state, isExpand: true });
    } else {
      const state = prevState.map((x, index) => x = false);
      this.setState({ custom: state, isExpand: false });
    }
  }

  reset() {
    this.getPolicyVeselDetails();
    this.setState({ isEdit: false, isEditClassType: false, });
  }

  render() {
    const { t } = this.props;
    const SaveButton = t("buttons.Save");
    const BackButton = t("buttons.Back");

    return (
      <div>
        <Row>
          <Col md="2" style={{ alignSelf: "center" }}>
            <h6>Third Party Only<Input type="checkbox" name="TPO" id="TPO" value={this.state.TPO} style={{ marginLeft: "3px" }} checked={this.state.TPO == true ? "checked" : ""} onChange={(e) => this.handleChange(e)} />
              <em id="TPOError" className="error invalid-feedback"></em>
            </h6>
          </Col>
          <Col md="10">
            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
              ?
              (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                onClick={this.state.isEdit ? () => this.editVessel("view") : () => this.editVessel("edit")}
                title={this.state.isEdit ? "View" : "Edit"}
              >
                <i className={this.state.isEdit ? "fa fa-eye" : "fa fa-pencil"}></i>
              </BTN>)
              : (null)}


            <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
              onClick={(this.state.isExpand) ? () => this.toggleAll('collapse') : () => this.toggleAll('expand')}
            >
              <i className={(this.state.isExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
            </BTN>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card className="mb-0">
              <CardHeader id="headingOne">
                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(0)} aria-expanded={this.state.custom[0]} aria-controls="collapseOne">
                  <h5 className="m-0 p-0">
                    {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                      Vessel
                      <i style={{ float: 'right' }} className={this.state.custom[0] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                  </h5>
                </BTN>
              </CardHeader>

              <Collapse isOpen={this.state.custom[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                <CardBody>
                  <Row>

                  </Row>
                  <Row>
                    <Col md="6">
                      {(this.state.isEditClassType) ? (
                        <div className="input-box">
                          <label>Vessel Class *</label>
                          <Select name="vesselClass" id="vesselClass" options={this.state.VesselClassList} value={this.state.vesselClass} onChange={(data) => this.selectType(data, 'vesselClass')} placeholder="Select Vessel class"
                          />
                          <em id="vesselClassError" className="error invalid-feedback"></em>

                          {/* <Input type="select" name="vesselClass" id="vesselClass" value={this.state.vesselClass} onChange={(e) => this.selectType(e.target.value, 'vesselClass')} >
                              <option value=''>Select vessel class</option>
                              {this.state.VesselClassList.map((type, i) => {
                                return (<option value={type.value}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em id="vesselClassError" className="error invalid-feedback"></em> */}
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselClassLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.VesselClassName}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="5">
                      {(this.state.isEditClassType) ? (
                        <div className="input-box">
                          <label>Vessel Type *</label>
                          <Select name="vesselType" id="vesselType" options={this.state.vesselTypeList} value={this.state.vesselType} onChange={(data) => this.selectType(data, 'vesselType')} placeholder="Select vessel type"
                          />
                          <em id="vesselTypeError" className="error invalid-feedback"></em>

                          {/* <Input type="select" name="vesselType" id="vesselType" value={this.state.vesselType} onChange={(e) => this.selectType(e.target.value, 'vesselType')}>
                              <option value=''>Select vessel type</option>
                              {this.state.vesselTypeList.map((type, i) => {
                                return (<option value={type.value}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em id="vesselTypeError" className="error invalid-feedback"></em> */}
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselTypeLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.VesselTypeName}</span>
                          </div>
                        )}
                    </Col>
                    <Col md="1">

                      {(/*this.props.status != "Active" && */this.props.status != '' && CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1) ? (
                        <BTN style={{ float: "right" }} color="primary"
                          onClick={this.state.isEditClassType ? () => this.editVesselClassType("view") : () => this.editVesselClassType("edit")}
                          title={this.state.isEditClassType ? "Read Only Vessel Type" : "Edit Vessel Type"}
                        >
                          <i className={this.state.isEditClassType ? "fa fa-eye" : "fa fa-pencil"}></i>
                        </BTN>
                      ) : (null)}

                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselnameLabel}</label>
                          <Input type="text" name="vesselName" id="vesselName" maxLength="50"
                            onChange={(e) => this.handleChange(e)} value={this.state.vesselName}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em className="error invalid-feedback" >Please enter vessel's name</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselnameLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselName}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselbuildTypeLabel}</label>
                          <Input type="select" name="vesselBuildType" id="vesselBuildType"
                            value={this.state.vesselBuildType} onChange={(e) => this.selectType(e.target.value, 'vesselBuildType')}
                          // onBlur={(e) => this.selectType(e.target.value, 'vesselBuildType')} 
                          >
                            <option value=''>Select build type</option>
                            {this.state.vesselBuildTypearr.map((type, i) => {
                              return (<option value={type.label} key={i}>{type.value}</option>)
                            })
                            }
                          </Input>
                          <em className="error invalid-feedback" >Please select build type</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselbuildTypeLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselBuildType}</span>
                          </div>
                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselmodelLabel}</label>
                          <Input type="text" name="vesselModel" id="vesselModel" maxLength="50"
                            onChange={(e) => this.handleChange(e)} value={this.state.vesselModel}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em className="error invalid-feedback" >Please enter model number</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselmodelLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselModel}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselbuiltYearLabel}</label>
                          <Input type="text" name="vesselBuiltYear" id="vesselBuiltYear"
                            maxLength="4" onChange={(e) => this.handleChange(e)} value={this.state.vesselBuiltYear}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em id="vesselBuildYearError" className="error invalid-feedback"></em>
                          {/* <em className="error invalid-feedback" >Please enter valid built year</em> */}
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselbuiltYearLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselBuiltYear}</span>
                          </div>
                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vessellastSurveyDateLabel}</label>
                          <InputGroup>
                            <Input type="date" name="vesselLastSurveyDate" id="vesselLastSurveyDate" placeholder={this.state.vessellastSurveyDateLabel}
                              value={this.state.vesselLastSurveyDate}
                              onBlur={(e) => this.handleChange(e)}
                              onChange={(e) => this.handleChange(e)}
                              min={moment().subtract(5, 'years').format('YYYY-MM-DD')}
                              max={moment().format('YYYY-MM-DD')}
                            />
                          </InputGroup>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vessellastSurveyDateLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselLastSurveyDate == "" || this.state.vesselLastSurveyDate == "0000-00-00" || this.state.vesselLastSurveyDate == "Invalid date" ? "" : moment(this.state.vesselLastSurveyDate).format('DD/MM/YYYY')}</span>
                          </div>
                        )}
                    </Col>

                    {(this.state.liabilityType != 'TPO') ?
                      (<Col md="6">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.vesselsurveyDueDateLabel} *</label>
                            <InputGroup>
                              <Input type="date"
                                name="vesselSurveyDueDate"
                                id="vesselSurveyDueDate"
                                placeholder={this.state.vesselsurveyDueDateLabel}
                                value={this.state.vesselSurveyDueDate}
                                onBlur={(e) => this.handleChange(e)}
                                onChange={(e) => this.handleChange(e)}
                              />
                            </InputGroup>

                          </div>
                        ) : (
                            <div>
                              <label>{this.state.vesselsurveyDueDateLabel}</label>
                              <span style={{ marginLeft: 10 }}>{
                                this.state.vesselSurveyDueDate == "" || this.state.vesselSurveyDueDate == "0000-00-00" || this.state.vesselSurveyDueDate == "Invalid date" ? "" : moment(this.state.vesselSurveyDueDate).format('DD/MM/YYYY')

                              }</span>
                            </div>
                          )}
                      </Col>)
                      : (null)}

                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.serialnoLabel}</label>
                          <Input type="text" name="serialNo" id="serialNo" maxLength="50"
                            onChange={(e) => this.handleChange(e)} value={this.state.serialNo}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em className="error invalid-feedback" >Please enter serial number</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.serialnoLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.serialNo}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselhullMaterialLabel}</label>
                          <Input type="select" name="vesselHullMaterial" id="vesselHullMaterial"
                            onChange={(e) => this.selectType(e.target.value, 'vesselHullMaterial')} value={this.state.vesselHullMaterial}
                          // onBlur={(e) => this.selectType(e.target.value, 'vesselHullMaterial')}
                          >
                            <option value=''>Select hull material</option>
                            {this.state.vesselHullMaterialarr.map((type, i) => {
                              return (<option value={type.label} key={i}>{type.value}</option>)
                            })
                            }
                          </Input>
                          <em className="error invalid-feedback" >Please select hull material</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselhullMaterialLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselHullMaterial}</span>
                          </div>
                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vessellengthLabel}</label>
                          <Input type="text" name="vesselLength" id="vesselLength" maxLength="6"
                            onChange={(e) => this.handleChange(e)} value={this.state.vesselLength}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em className="error invalid-feedback" >Please enter vessel's length</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vessellengthLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselLength}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselpurchasePriceLabel}({<i className={this.props.CurrencySymbol}></i>})*</label>
                          <Input type="text" name="vesselPurchasePrice" id="vesselPurchasePrice" maxLength="15"
                            onChange={(e) => this.handleChange(e)} value={this.state.vesselPurchasePrice}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em className="error invalid-feedback" >Please enter purchase price</em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselpurchasePriceLabel}({<i className={this.props.CurrencySymbol}></i>})*</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselPurchasePrice}</span>
                          </div>
                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesseluseOfVesselLabel}</label>
                          <Input type="select" name="vesselUseOfVessel" id="vesselUseOfVessel"
                            onChange={(e) => this.selectType(e.target.value, 'vesselUseOfVessel')} value={this.state.vesselUseOfVessel}
                          // onBlur={(e) => this.selectType(e.target.value, 'vesselUseOfVessel')}
                          >
                            <option value=''>Select use of vessel</option>
                            {this.state.UseofVesselList.map((type, i) => {
                              return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
                            })
                            }
                          </Input>
                          <em className="error invalid-feedback" >Please select the use of vessel </em>
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesseluseOfVesselLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselUseOfVessel}</span>
                          </div>
                        )}
                    </Col>

                    <Col md="6">
                      {(this.state.isEdit) ? (
                        <div className="input-box">
                          <label>{this.state.vesselyearPurchasedLabel}</label>
                          <Input type="text" name="vesselYearPurchased" id="vesselYearPurchased" maxLength="4"
                            onChange={(e) => this.handleChange(e)} value={this.state.vesselYearPurchased}
                          // onBlur={(e) => this.handleChange(e)}
                          >
                          </Input>
                          <em id="vesselYearPurchasedError" className="error invalid-feedback"></em>
                          {/* <em className="error invalid-feedback" >Please enter valid purchase year</em> */}
                        </div>
                      ) : (
                          <div>
                            <label>{this.state.vesselyearPurchasedLabel}</label>
                            <span style={{ marginLeft: 10 }}>{this.state.vesselYearPurchased}</span>
                          </div>
                        )}
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>

        {(this.state.isDisplayEngine == 1)
          ?
          (<Row>
            <Col md="12">
              <Card className="mb-0">
                <CardHeader id="headingTwo">
                  <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(1)} aria-expanded={this.state.custom[1]} aria-controls="collapseTwo">
                    <h5 className="m-0 p-0">
                      Engine and Trailer Details
                        <i style={{ float: 'right' }} className={this.state.custom[1] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                    </h5>
                  </BTN>
                </CardHeader>

                <Collapse isOpen={this.state.custom[1]} data-parent="#accordion" id="collapseTwo" aria-labelledby="headingTwo">
                  <CardBody>
                    <Row>
                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.mainengineLabel}</label>
                            <Input type="text" name="mainEngine" id="mainEngine" maxLength="50"
                              onChange={(e) => this.handleChange(e)} value={this.state.mainEngine}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for Main Engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.mainengineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.mainEngine}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="1">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.mainengineHpLabel}</label>
                            <Input type="text" name="mainEngineHp" id="mainEngineHp" maxLength="5"
                              onChange={(e) => this.handleChange(e)} value={this.state.mainEngineHp}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter value of Main Engine HP</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.mainengineHpLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.mainEngineHp}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="1">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.mainengineYearLabel}</label>
                            <Input type="text" name="mainEngineYear" id="mainEngineYear" maxLength="4"
                              onChange={(e) => this.handleChange(e)} value={this.state.mainEngineYear}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em id="documentLanguageError" className="error invalid-feedback"></em>
                            <em className="error invalid-feedback" >Please enter the Main Engine year</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.mainengineYearLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.mainEngineYear}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="2">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.mainengineSerialNoLabel}</label>
                            <Input type="text" name="mainEngineSerialNo" id="mainEngineSerialNo"
                              onChange={(e) => this.handleChange(e)} value={this.state.mainEngineSerialNo}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em id="documentLanguageError" className="error invalid-feedback"></em>
                            <em className="error invalid-feedback" >Please enter serial number of Main Engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.mainengineSerialNoLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.mainEngineSerialNo}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="2">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.noOfengineLabel}</label>
                            <Input type="select" name="noOfEngine" id="noOfEngine"
                              value={this.state.noOfEngine} onChange={(e) => this.selectType(e.target.value, 'noOfEngine')}
                            // onBlur={(e) => this.selectType(e.target.value, 'noOfEngine')} 
                            >
                              <option value=''>Select no of engines</option>
                              {this.state.noOfEnginearr.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.value}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select No Of Engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.noOfengineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.noOfEngine}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.tarnsmissionmainengineLabel}</label>
                            <Input type="select" name="tarnsmissionMainEngine" id="tarnsmissionMainEngine"
                              value={this.state.tarnsmissionMainEngine} onChange={(e) => this.selectType(e.target.value, 'tarnsmissionMainEngine')}
                            // onBlur={(e) => this.selectType(e.target.value, 'tarnsmissionMainEngine')}
                            >
                              <option value=''>Select transmission</option>
                              {this.state.tarnsmissionMainEnginearr.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.value}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select the value for Main Engine Transmission</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tarnsmissionmainengineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.tarnsmissionMainEngine}</span>
                            </div>
                          )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryengineLabel}</label>
                            <Input type="select" name="auxiliaryEngine" id="auxiliaryEngine"
                              value={this.state.auxiliaryEngine} onChange={(e) => this.selectType(e.target.value, 'auxiliaryEngine')}
                            // onBlur={(e) => this.selectType(e.target.value, 'auxiliaryEngine')} 
                            >
                              <option value=''>Select auxiliary engine</option>
                              {this.state.auxiliaryEnginearr.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.value}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select auxiliary engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryengineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngine}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="1">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryEngineHpLabel}</label>
                            <Input type="text" name="auxiliaryEngineHp" id="auxiliaryEngineHp" maxLength="5"
                              onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineHp}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter HP value for auxiliary engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryEngineHpLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngineHp}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="1">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryEngineYearLabel}</label>
                            <Input type="text" name="auxiliaryEngineYear" id="auxiliaryEngineYear" maxLength="4"
                              onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineYear}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the year for auxiliary engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryEngineYearLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngineYear}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="2">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryEngineSerialNoLabel}</label>
                            <Input type="text" name="auxiliaryEngineSerialNo" id="auxiliaryEngineSerialNo"
                              onChange={(e) => this.handleChange(e)} value={this.state.auxiliaryEngineSerialNo}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter serial number of auxiliary engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryEngineSerialNoLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngineSerialNo}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="2">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryEngineNoEngineLabel}</label>
                            <Input type="select" name="auxiliaryEngineNoEngine" id="auxiliaryEngineNoEngine"
                              value={this.state.auxiliaryEngineNoEngine} onChange={(e) => this.selectType(e.target.value, 'auxiliaryEngineNoEngine')}
                            // onBlur={(e) => this.selectType(e.target.value, 'auxiliaryEngineNoEngine')} 
                            >
                              <option value=''>Select no of engines</option>
                              {this.state.auxiliaryEngineNoEnginearr.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.value}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select auxiliary engine type</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryEngineNoEngineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngineNoEngine}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.auxiliaryEngineTransmissionLabel}</label>
                            <Input type="select" name="auxiliaryEngineTransmission" id="auxiliaryEngineTransmission"
                              value={this.state.auxiliaryEngineTransmission} onChange={(e) => this.selectType(e.target.value, 'auxiliaryEngineTransmission')}
                            // onBlur={(e) => this.selectType(e.target.value, 'auxiliaryEngineTransmission')} 
                            >
                              <option value=''>Select transmission</option>
                              {this.state.auxiliaryEngineTransmissionarr.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.value}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select the value for Auxiliary Engine Transmission</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.auxiliaryEngineTransmissionLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.auxiliaryEngineTransmission}</span>
                            </div>
                          )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.maxSpeedLabel}</label>
                            <Input type="text" name="maxSpeed" id="maxSpeed"
                              onChange={(e) => this.handleChange(e)} value={this.state.maxSpeed}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter valid Max Speed</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.maxSpeedLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.maxSpeed}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="4">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.makeofTrailerLabel}</label>
                            <Input type="text" name="makeofTrailer" id="makeofTrailer" maxLength="50"
                              onChange={(e) => this.handleChange(e)} value={this.state.makeofTrailer}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter make of trailer</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.makeofTrailerLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.makeofTrailer}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="4">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.trailerSerialNoLabel}</label>
                            <Input type="text" name="trailerSerialNo" id="trailerSerialNo" maxLength="50"
                              onChange={(e) => this.handleChange(e)} value={this.state.trailerSerialNo}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter trailer serial number</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.trailerSerialNoLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.trailerSerialNo}</span>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>)
          : (null)
        }

        {(this.state.isDisplayEngine == 1)
          ?
          (<Row>
            <Col md="12">
              <Card className="mb-0">
                <CardHeader id="headingThree">
                  <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(2)} aria-expanded={this.state.custom[2]} aria-controls="collapseThree">
                    <h5 className="m-0 p-0">
                      Tender/Auxiliary Vessel
                    <i style={{ float: 'right' }} className={this.state.custom[2] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                    </h5>
                  </BTN>
                </CardHeader>

                <Collapse isOpen={this.state.custom[2]} data-parent="#accordion" id="collapseThree" aria-labelledby="headingThree">
                  <CardBody>
                    <Row>
                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.tenderVesselMakeLabel}</label>
                            <Input type="text" name="tenderVesselMake" id="tenderVesselMake" maxLength="200"
                              onChange={(e) => this.handleChange(e)} value={this.state.tenderVesselMake}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter valid tender vessel make</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tenderVesselMakeLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.tenderVesselMake}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.tenderVesselYearLabel}</label>
                            <Input type="text" name="tenderVesselYear" id="tenderVesselYear" maxLength="4"
                              onChange={(e) => this.handleChange(e)} value={this.state.tenderVesselYear}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter valid tender vessel year</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tenderVesselYearLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.tenderVesselYear}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.tenderVesselLengthLabel}</label>
                            <Input type="text" name="tenderVesselLength" id="tenderVesselLength" maxLength="6"
                              onChange={(e) => this.handleChange(e)} value={this.state.tenderVesselLength}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback">Please enter valid tender vessel length</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tenderVesselLengthLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.tenderVesselLength}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.tenderVesselMaterialLabel}</label>
                            <Input type="select" name="tenderVesselMaterial" id="tenderVesselMaterial"
                              onChange={(e) => this.selectType(e.target.value, 'tenderVesselMaterial')} value={this.state.tenderVesselMaterial}
                            // onBlur={(e) => this.selectType(e.target.value, 'tenderVesselMaterial')}
                            >
                              <option value=''>Select material</option>
                              {this.state.tenderVesselMaterialarr.map((type, i) => {
                                return (<option value={type.value} key={i}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select tender vessel material</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tenderVesselMaterialLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.tenderVesselMaterial}</span>
                            </div>
                          )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.makeAndModelOfEngineLabel}</label>
                            <Input type="text" name="makeAndModelOfEngine" id="makeAndModelOfEngine"
                              onChange={(e) => this.handleChange(e)} value={this.state.makeAndModelOfEngine}
                              // onBlur={(e) => this.handleChange(e)} 
                              maxLength="200"
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter make and model of engine</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.makeAndModelOfEngineLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.makeAndModelOfEngine}</span>
                            </div>
                          )}
                      </Col>

                      <Col md="3">
                        {(this.state.isEdit) ? (
                          <div className="input-box">
                            <label>{this.state.makeAndModelOfEngineHPLabel}</label>
                            <Input type="text" name="makeAndModelOfEngineHP" id="makeAndModelOfEngineHP"
                              onChange={(e) => this.handleChange(e)} value={this.state.makeAndModelOfEngineHP}
                              // onBlur={(e) => this.handleChange(e)} 
                              maxLength="5"
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter make and model of engine HP</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.makeAndModelOfEngineHPLabel}</label>
                              <span style={{ marginLeft: 10 }}>{this.state.makeAndModelOfEngineHP}</span>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>)
          : (null)
        }

        <Row>
          <Col md="12">
            <Card className="mb-0">
              <CardHeader id="headingFour">
                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(3)} aria-expanded={this.state.custom[3]} aria-controls="collapseFour">
                  <h5 className="m-0 p-0">
                    Sum Insured
                        <i style={{ float: 'right' }} className={this.state.custom[3] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                  </h5>
                </BTN>
              </CardHeader>

              <Collapse isOpen={this.state.custom[3]} data-parent="#accordion" id="collapseFour" aria-labelledby="headingFour">
                <CardBody>
                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.sumInsuredMethodLabel}({<i className={this.props.CurrencySymbol}></i>})*</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="select" name="sumInsuredMethod" id="sumInsuredMethod"
                              onChange={(e) => this.selectType(e.target.value, 'sumInsuredMethod')} value={this.state.sumInsuredMethod}
                            // onBlur={(e) => this.selectType(e.target.value, 'sumInsuredMethod')}
                            >
                              <option value=''>Select sum insured method</option>
                              {this.state.sumInsuredMethodarr.map((type, i) => {
                                return (<option value={type.value} key={i}>{type.label}</option>)
                              })
                              }
                            </Input>
                            <em className="error invalid-feedback" >Please select sum insured method</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.sumInsuredMethod}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.hullInboardMachineLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="hullInboardMachine" id="hullInboardMachine"
                              onChange={(e) => this.handleChange(e)} value={this.state.hullInboardMachine}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter valid value for hull + inboard machinery</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.hullInboardMachine}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.tenderDinghyLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="tenderDinghy" id="tenderDinghy"
                              onChange={(e) => this.handleChange(e)} value={this.state.tenderDinghy}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for tender/dinghy</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.tenderDinghy}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.lifeRaftLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="lifeRaft" id="lifeRaft"
                              onChange={(e) => this.handleChange(e)} value={this.state.lifeRaft}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for life raft</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.lifeRaft}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.outboard1Label}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="outboard1" id="outboard1"
                              onChange={(e) => this.handleChange(e)} value={this.state.outboard1}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for outboard 1</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.outboard1}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.outboard2Label}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="outboard2" id="outboard2"
                              onChange={(e) => this.handleChange(e)} value={this.state.outboard2}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for outboard 2</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.outboard2}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.roadTrailerLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="roadTrailer" id="roadTrailer"
                              onChange={(e) => this.handleChange(e)} value={this.state.roadTrailer}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for road trailer</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.roadTrailer}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row md="12">
                      <Col md="6">
                        <label>{this.state.personalEffectsLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col md="6">
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="personalEffects" id="personalEffects"
                              onChange={(e) => this.handleChange(e)} value={this.state.personalEffects}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for pesonal effects</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.personalEffects}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.navigationalEquipLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col md="6">
                        <Row md="12">
                          <Col md="8">
                            {(this.state.isEdit) ? (
                              <div>
                                <Input type="text" name="navigationalEquip" id="navigationalEquip"
                                  onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquip}
                                // onBlur={(e) => this.handleChange(e)}
                                >
                                </Input>
                                <em className="error invalid-feedback" >Please enter the value for navigational equipment</em>
                              </div>
                            ) : (
                                <div>
                                  <label>{this.state.navigationalEquip}</label>
                                </div>
                              )}
                          </Col>
                          <Col md="4">
                            {(this.state.navigationalEquip == null || this.state.navigationalEquip == '' || this.state.navigationalEquip == undefined) ? (
                              null
                            ) : (
                                (this.state.isEdit) ? (
                                  <div>
                                    <a href="javascript:void(0)" onClick={() => this.modelForPersonalEffects()}>Itemised Breakup</a>
                                  </div>
                                ) : (
                                    <div>
                                      <a href="javascript:void(0)" onClick={() => this.modelForPersonalEffects()}>Itemised Breakup</a>
                                    </div>
                                  )
                              )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row md="12">
                      <Col md="6">
                        <label>{this.state.SailsCanopyCoversHeaders}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col md="6">
                        <Row md="12">
                          <Col md="8">
                            {(this.state.isEdit) ? (
                              <div>
                                <Input type="text" name="sumInsuredSails" id="sumInsuredSails"
                                  onChange={(e) => this.handleChange(e)} value={this.state.sumInsuredSails}
                                // onBlur={(e) => this.handleChange(e)}
                                >
                                </Input>
                                <em className="error invalid-feedback" >Please enter the value for pesonal effects</em>
                              </div>
                            ) : (
                                <div>
                                  <label>{this.state.sumInsuredSails}</label>
                                </div>
                              )}
                          </Col>
                          <Col md="4">
                            {(this.state.sumInsuredSails == null || this.state.sumInsuredSails == '' || this.state.sumInsuredSails == undefined) ? (
                              null
                            ) : (
                                (this.state.isEdit) ? (
                                  <div>
                                    <a href="javascript:void(0)" onClick={() => this.modelSailsCanopyCovers()}>Itemised Breakup</a>
                                  </div>
                                ) : (
                                    <div>
                                      <a href="javascript:void(0)" onClick={() => this.modelSailsCanopyCovers()}>Itemised Breakup</a>
                                    </div>
                                  )
                              )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.portableGeneratorLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>
                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="portableGenerator" id="portableGenerator"
                              onChange={(e) => this.handleChange(e)} value={this.state.portableGenerator}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the value for portable generator</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.portableGenerator}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <label>{this.state.customCoverageLabel}({<i className={this.props.CurrencySymbol}></i>})</label>
                      </Col>

                      <Col>
                        {(this.state.isEdit) ? (
                          <div>
                            <Input type="text" name="customCoverage" id="customCoverage"
                              onChange={(e) => this.handleChange(e)} value={this.state.customCoverage}
                            // onBlur={(e) => this.handleChange(e)}
                            >
                            </Input>
                            <em className="error invalid-feedback" >Please enter the custom coverage name</em>
                          </div>
                        ) : (
                            <div>
                              <label>{this.state.customCoverage}</label>
                            </div>
                          )}
                      </Col>
                    </Row>
                  </div>

                  <div className="input-box">
                    <Row>
                      <Col>
                        <h5><b>{this.state.totalSumInsuredValueLabel}</b></h5>
                      </Col>
                      <Col>
                        <h5><b>{<i className={this.props.CurrencySymbol}></i>}{this.state.totalSumInsuredValue}</b></h5>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>

        {(this.state.isEdit) ? (
          <Row style={{ marginTop: 10 }}>
            <Col md="12" style={{ textAlign: "center" }}>
              <p id="ItemisedBreakupErrorNav" style={{ display: "none", color: "red" }}>Itemised Breakup of Navigational Equipment Doesn't match</p>
            </Col>

            <Col md="12" style={{ textAlign: "center" }}>
              <p id="ItemisedBreakupErrorSail" style={{ display: "none", color: "red" }}>Itemised Breakup of Sails, Canopy & Covers Doesn't match</p>
            </Col>

            <Col md="4" style={{ margin: "auto" }}>
              <BTN color="primary" title={BackButton} onClick={() => this.goBack()}>
                <i style={{ marginRight: "10px" }} className="fa fa-angle-left"></i>
                {this.state.BacktopolicylistLabel}
              </BTN>

              <BTN style={{ marginLeft: "10px" }} color="success" title={SaveButton} onClick={() => this.Save()}>
                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                {this.state.SaveLabel}
              </BTN>

              <BTN style={{ marginLeft: "10px" }} color="primary" title={BackButton} onClick={() => this.reset()}>
                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                {this.state.CancelLabel}
              </BTN>
            </Col>
          </Row>
        ) : (
            <div></div>
          )}

        <Modal isOpen={this.state.toggleModalAdd}
          className={'modal-primary ' + this.props.className}
        >
          <ModalHeader toggle={() => this.setState({ toggleModalAdd: false })}>{this.state.NavigationalEquipmentHeaders}</ModalHeader>
          <ModalBody>
            <form className="form" action="#">
              <Col md="12">
                <Row>
                  <Col md="12">
                    <Row>
                      <Col md="12">
                        {/* <Panel header={this.state.NavigationalEquipmentHeaders} style={{ marginBottom: '1em' }} toggleable={true} collapsed={true}> */}
                        <CardBody>
                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <h5><b>{this.state.EquipmentNavLabel}</b></h5>
                              </Col>
                              <Col md="4" style={{ padding: 0 }}>
                                <h5><b>{this.state.ModelDescriptionLabel}</b></h5>
                              </Col>
                              <Col md="4">
                                <h5><b>{this.state.valueLabel}</b></h5>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.RadarLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentRadarDesc" id="navigationalEquipmentRadarDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentRadarDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter radar Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentRadarDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentRadarValue" id="navigationalEquipmentRadarValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentRadarValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid radar value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentRadarValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.SonarLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentSonarDesc" id="navigationalEquipmentSonarDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentSonarDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter sonar Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentSonarDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentSonarValue" id="navigationalEquipmentSonarValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentSonarValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid sonar value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentSonarValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.GPSLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentGPSDesc" id="navigationalEquipmentGPSDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentGPSDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter GPS Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentGPSDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentGPSValue" id="navigationalEquipmentGPSValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentGPSValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid GPS value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentGPSValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.PlotterLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentPlotterDesc" id="navigationalEquipmentPlotterDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentPlotterDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Plotter Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentPlotterDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentPlotterValue" id="navigationalEquipmentPlotterValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentPlotterValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Plotter value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentPlotterValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.CombinedEquipmentLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentCombinedEquipmentDesc" id="navigationalEquipmentCombinedEquipmentDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentCombinedEquipmentDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter combined equipment Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentCombinedEquipmentDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentCombinedEquipmentValue" id="navigationalEquipmentCombinedEquipmentValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentCombinedEquipmentValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid combined equipment value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentCombinedEquipmentValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.VHFLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentVHFDesc" id="navigationalEquipmentVHFDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentVHFDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter VHF Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentVHFDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentVHFValue" id="navigationalEquipmentVHFValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentVHFValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid VHF value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentVHFValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.RadioBeaconLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentRadioBeaconDesc" id="navigationalEquipmentRadioBeaconDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentRadioBeaconDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter radio beacon Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentRadioBeaconDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentRadioBeaconValue" id="navigationalEquipmentRadioBeaconValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentRadioBeaconValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Radio Beacon value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentRadioBeaconValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.AutoPilotLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentAutoPilotDesc" id="navigationalEquipmentAutoPilotDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentAutoPilotDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Auto Pilot Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentAutoPilotDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentAutoPilotValue" id="navigationalEquipmentAutoPilotValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentAutoPilotValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Auto Pilot value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentAutoPilotValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.BLULabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentBLUDesc" id="navigationalEquipmentBLUDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentBLUDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter BLU Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentBLUDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentBLUValue" id="navigationalEquipmentBLUValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentBLUValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid BLU value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentBLUValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.SlideLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentSlideDesc" id="navigationalEquipmentSlideDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentSlideDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Slide Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentSlideDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentSlideValue" id="navigationalEquipmentSlideValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentSlideValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Slide value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentSlideValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.WindEquipmentLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentWindEquipmentDesc" id="navigationalEquipmentWindEquipmentDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentWindEquipmentDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Wind Equipment Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentWindEquipmentDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalEquipmentWindEquipmentValue" id="navigationalEquipmentWindEquipmentValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalEquipmentWindEquipmentValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Wind Equipment value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalEquipmentWindEquipmentValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.TridataLabel}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalTridataDesc" id="navigationalTridataDesc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalTridataDesc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Tridata Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalTridataDesc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalTridataValue" id="navigationalTridataValue"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalTridataValue}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Tridata value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalTridataValue}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.Others01Label}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers01Desc" id="navigationalOthers01Desc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers01Desc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Others 01 Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers01Desc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers01Value" id="navigationalOthers01Value"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers01Value}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Others 01 value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers01Value}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.Others02Label}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers02Desc" id="navigationalOthers02Desc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers02Desc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Others 02 Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers02Desc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers02Value" id="navigationalOthers02Value"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers02Value}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Others 02 value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers02Value}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.Others03Label}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers03Desc" id="navigationalOthers03Desc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers03Desc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Others 03 Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers03Desc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers03Value" id="navigationalOthers03Value"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers03Value}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Others 03 value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers03Value}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <label>{this.state.Others04Label}</label>
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers04Desc" id="navigationalOthers04Desc"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers04Desc}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter Others 04 Description</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers04Desc}</label>
                                    </div>
                                  )}
                              </Col>
                              <Col md="4">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="navigationalOthers04Value" id="navigationalOthers04Value"
                                      onChange={(e) => this.handleChange(e)} value={this.state.navigationalOthers04Value}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid Others 04 value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.navigationalOthers04Value}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="4">
                                <h5><b>{this.state.navigationalTotalLabel}</b></h5>
                              </Col>
                              <Col md="4">
                                {/* <h5><b>Model/Description</b></h5> */}
                              </Col>
                              <Col md="4">
                                <h5><b>{this.state.NavigationalEquipmentTotal}</b></h5>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              {(this.state.NavigationalEquipmentTotal != this.state.navigationalEquip) ? (
                                <Col md="12">
                                  <h6 style={{ color: "red" }}><b>{this.state.NoteLabel} : {this.state.sailWarningLabel} {this.state.navigationalEquip}</b></h6>
                                </Col>
                              ) : (
                                  null
                                )}
                              {/* {(this.state.NavigationalEquipmentTotal !== this.state.navigationalEquip) ? (
                                  <Col md="12">
                                    <h6 style={{ color: "red" }}><b>{this.state.NoteLabel} : {this.state.sailWarningLabel} {this.state.navigationalEquip}</b></h6>
                                  </Col>
                                ) : (
                                    null
                                  )} */}
                            </Row>
                          </div>

                        </CardBody>
                        {/* </Panel> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.saveNavigationalEqp()}
              icon="pi pi-check" label="OK" />
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.toggleModalAddForSails}
          className={'modal-primary ' + this.props.className}
        >
          <ModalHeader toggle={() => this.setState({ toggleModalAddForSails: false })}>{this.state.SailsCanopyCoversHeaders}</ModalHeader>
          <ModalBody>
            <form className="form" action="#">
              <Col md="12">
                <Row>
                  <Col md="12">
                    <Row>
                      <Col md="12">
                        {/* <Panel header={this.state.NavigationalEquipmentHeaders} style={{ marginBottom: '1em' }} toggleable={true} collapsed={true}> */}
                        <label>{this.state.SailsNote}</label>
                        <CardBody>
                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <h5><b>{this.state.TypeLabel}</b></h5>
                              </Col>
                              <Col md="4">
                                <h5><b>{this.state.valueLabel}</b></h5>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.BiminiLabel}</label>
                              </Col>
                              <Col md="6">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="Bimini" id="Bimini"
                                      onChange={(e) => this.handleChange(e)} value={this.state.Bimini}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid bimini value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.Bimini}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.CanopyLabel}</label>
                              </Col>
                              <Col md="6">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="Canopy" id="Canopy"
                                      onChange={(e) => this.handleChange(e)} value={this.state.Canopy}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid canopy value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.Canopy}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <label>{this.state.boatCoversLabel}</label>
                              </Col>
                              <Col md="6">
                                {(this.state.isEdit) ? (
                                  <div>
                                    <Input type="text" name="boatCovers" id="boatCovers"
                                      onChange={(e) => this.handleChange(e)} value={this.state.boatCovers}
                                    // onBlur={(e) => this.handleChange(e)}
                                    >
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter valid boat cover value</em>
                                  </div>
                                ) : (
                                    <div>
                                      <label>{this.state.boatCovers}</label>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              <Col md="6">
                                <h5><b>{this.state.TotalLabel}</b></h5>
                              </Col>

                              <Col md="6">
                                <h5><b>{this.state.SailsTotal}</b></h5>
                              </Col>
                            </Row>
                          </div>

                          <div className="input-box">
                            <Row>
                              {(this.state.sumInsuredSails != this.state.SailsTotal) ? (
                                <Col md="12">
                                  <h6 style={{ color: "red" }}><b>{this.state.NoteLabel} : {this.state.sailWarningLabel} {this.state.sumInsuredSails}</b></h6>
                                </Col>
                              ) : (
                                  null
                                )}
                            </Row>
                          </div>

                        </CardBody>
                        {/* </Panel> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.saveSail()}
              icon="pi pi-check" label='OK' />
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

// export default Vessel;
export default withTranslation()(Vessel);
