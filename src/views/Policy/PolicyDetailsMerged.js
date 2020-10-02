import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import Select from 'react-select';
import IdleTimer from 'react-idle-timer';
import { IdleTimeOutModalForPolicy } from '../../modal/IdleModelForPolicy';
import { Card, CardBody, Col, Row, Input, Button as BTN, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form ,UncontrolledTooltip } from 'reactstrap';
import Endorsements from './Endorsements';
import Coverage from './Coverage';
import Account from './Account';
import Timeline from './Timeline';
import api from '../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../utils/constants';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import SidebarNav from '../SidebarNav/SidebarNav';
import moment from 'moment';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from "recompose";
import { AutoComplete } from 'primereact/autocomplete';
import { InputTextarea } from 'primereact/inputtextarea';
import Underwriting from './Underwriting';

const CURRENTDATE = moment().format('DD/MM/YYYY');

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

class PolicyDetailsMerged extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);

        this.state = {
            dislpayCalculatorBody: false,

            PolicyDynamicCalculationData: {},
            columnKeys: [],
            // ------ Ratable Fields ------
            isCalculatorVisible: false,
            isRevertPolicyPopup: false,
            PaymentMode: '',

            PolicyCurrentNetPremium: 0,
            PolicyCurrentLevy: 0,
            PolicyCurrentAdminFee: 0,
            PolicyCurrentTotalDue: 0,

            PolicyNewNetPremium: 0,
            PolicyNewLevy: 0,
            PolicyNewAdminFee: 0,
            PolicyNewTotalDue: 0,

            PolicyChangeNetPremium: 0,
            PolicyChangeLevy: 0,
            PolicyChangeAdminFee: 0,
            PolicyChangeTotalDue: 0,

            MidTermAdjustmentFee: 0,

            // ------ Policy Details ------
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            PolicyLanguageId: '',
            activeTab: 1,
            activeSubTab: 1,

            showSummary: true,
            showWarningsMessagesReminders: false,
            errorNote: [],
            languageList: [],
            currencyList: [],
            countryList: [],
            policyTypeList: [],
            policyReferNotes: [],

            policyNumber: '',
            policyType: '',
            phone: '',
            language: '',
            policyHolder: '',
            email: '',
            refrred: false,
            showRefer: false,
            status: '',
            country: '',
            currency: '',
            Levy: '',
            stage: '',
            stageList: [],
            referrList: [],
            vesselTypeName: '',
            changeLanguage: false,
            changeCurrency: false,
            changePolicyType: false,
            changeVesselType: false,
            changeCountry: false,
            changeStage: false,
            isMidTerm: false,
            midTermModel: false,
            isEditAdjustmentDate: false,
            adjustmentDate: moment().format('YYYY-MM-DD'),
            adjustmentDateError: true,
            adjustmentAmount: '',
            adjustmentAmountList: [],
            adjustmentAmountError: '',
            transactionType: 'Premium Increased',
            suggestedByEvo: '',
            actualAmount: 0,
            actualAmountError: true,
            mtdNote: '',
            mtdNoteError: '',

            totalMtdCharges: 0,
            mtdFees: '',
            mtdFeesError: true,
            newDuePayment: 0,
            DefaultChargeFee: 0,
            DefaultChargeAmount: 0,
            MidTermId: '',
            computationId: '',

            //Summary
            premiumPolicyType: '',
            defaultPremiumPolicyType: '',
            premiumPolicyTypeError: true,
            premiumPolicyTypeList: [],
            confirmPremiumPolicyType: false,
            comprehensivePremiumPolicyType: false,
            PremiumTypeList: [],
            PremiumType: '',
            policyTotalSumInsured: '',
            policyRate: '',
            policyStartingPremium: '',
            policyAdjustments: '',
            policyAdjustmentsPremium: '',
            policyNCB: '',
            policyLocalTax: '',
            policyAdminFees: '',
            policyAddOns: '',
            policyTotalDue: '',
            policyExcess: '',
            policyCommission: '',
            policySummaryCurrency: '',

            policySummaryDetails: '',
            policyWarningMessagesReminders: [],
            dynamicComputationDetails: '',
            contactEntityType: '',
            contactEntityId: '',

            inceptionDate: '',
            lastBindDate: '',
            isBindPolicyVisible: false, // to Bind Policy based on Inception Date
            isBindPolicy: false,
            contactPolicies: 0,
            CurrencySymbol: '',
            RenewalDate: '',
            paymentStatus: '',

            isRenewal: 0,
            isDisplaySummary: 1,

            isAwaitingDocument: 0,

            isRenewalActive: 0,
            bannerPaymentDue: 0,
            paymentDue: 0,
            isGenerateRenewal: 0,

            isBindPopup: false,
            bindDate: moment().format('YYYY-MM-DD'),
            bindDateError: false,
            isUnBindPopup: false,
            isunConfirmPopup: false,
            isUnBind: 0,
            isUnConfirmRenewal: 0,

            isTargetTotalDuePopup: false,
            targetTotalDue: '',
            targetTotalDueError: false,
            targetUnderWriterAmount: '',
            PolicyMidTermAdjustmentId: '',


            //-----------Vessel-----------
            PolicyData: 1,
            custom: [false, false, false, false],
            isExpand: false,
            isUnderwrittingExpand: false,
            PolicyId: '',
            maxPolicyAmount: 0,
            TPO: false,

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
            isVesselEdit: false,
            isEditClassType: false,
            toggleModalAdd: false,
            toggleModalAddForSails: false,
            isNavigationalTotalEqual: true,
            isSailsTotalEqual: true,
            policyStatus: '',

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
            sailWarningLabel: "Total sum should be equal to",


            // ---------------------------------------- Underwriting -------------------------------------------------------
            PolicyCountry: this.props.PolicyCountry,
            departmentList: [],
            sourceList: [],
            sourceDisplay: false,
            awaitingDocumentList: [],
            premiumCreditList: [],
            thirdPartyLiabilityList: [],
            racingEventTypeList: [],
            crewLiabilityList: [],
            govtLevyList: [],
            binders: [],
            subBinders: [],
            currentNCBNoofYearsList: [],

            showPolicyDates: false,
            showPolicyOptionsAdjustments: false,
            showLimitsAdditionalCoverCommissionFeesandLevy: false,
            showRatingExcess: false,

            currentNCBYears: "",
            currentNCBYearsError: true,

            currentNCBAmount: 0,
            currentNCBAmountError: true,

            PolicyGeneralId: '',

            amount: 100,
            binder: '',
            binderSuggestions: null,
            selectBinderError: true,
            subBinder: '',
            subBinderError: false,
            subbinderSuggestions: null,
            insuranceComapny: '',
            nextBinder: '',
            nextInsuranceComapny: '',
            isDisplayNext: 0,
            department: '',
            departmentError: false,
            source: '',
            sourceError: false,
            awaitingDocuments: '',
            awaitingDocumentsError: false,
            premiumCredits: '',
            premiumCreditsError: false,
            liabilityType: '',
            thirdPartyLiability: '',
            thirdPartyLiabilityError: false,
            isWaterSkiing: false,
            waterSkiingLiability: '',
            isWaterToys: false,
            waterToysLiability: '',
            isSailRacing: false,
            sailRacingCoverage: '',
            sailRacingCoverageError: false,
            racingEventType: '',
            racingEventTypeError: false,
            crewLiability: '',
            crewLiabilityError: false,
            excess: '',
            excessError: false,
            inceptionDate: '',
            inceptionDateError: true,
            isInceptionEdit: false,
            renewalDate: '',
            renewalDateError: true,
            isRenewalEdit: false,
            lastBindDate: '',
            defaultLastBindDate: '',
            isLastBindEdit: false,
            lastBindDateError: '',
            yearBuilt: '',
            lastSurveyDate: '',
            surveyDueDate: '',
            underWriter: '',
            underWriterError: false,
            note: '',
            noteError: false,
            gross: '',
            grossError: false,
            totalgross: '',
            agency: '',
            agencyError: false,
            changeAgencyCommission: false,
            agencyTotal: '',
            balance: '',
            balanceTotal: '',
            governmentLavys: '',
            governmentLavysError: false,
            governmentLavysPercent: '',
            governmentLavysPercentError: false,
            governmentLavysAmount: '',
            governmentLavysAmountError: false,
            adminFees: '',
            adminFeesError: false,
            ratingType: '',
            ratingTypeValue: '',
            ratingTypeValueError: false,

            ratingTypeValueRegex: '',

            isUnderwritingEdit: false,
            currentPremium: 0,
            renewalPremium: 0,

            isUnderwritingExpand: false,
            maxPolicyAmount: 0,

            DisplayWater: 0,
            DisplayRacing: 0,
            DisplayCrew: 0,
            CurrencySymbol: '',

            MarineTradePremium: '',
            MarineTradePremiumError: false,

            awaitingDocuments: 'No',
            IsPremiumCredit: 'No',

            PolicyCurrentPremium: 0,

            // ---------------------------------------- General -------------------------------------------------------
            boatingQualificationList: [],
            previousInsurerList: [],
            NCBList: [],
            previousNCBNoofYearsList: [],
            previousBoatingExperienceList: [],

            showGeneralQuestions: false,
            showInsuranceHistory: false,
            showSchemes: false,

            boatingExperienceYear: "",
            boatingExperienceYearError: true,
            isGeneralQuestionProofProvided: false,

            previousNCBYears: "",
            previousNCBYearsError: false,
            previousNCBAmount: 0,
            previousNCBAmountError: false,
            boatingQualifications: "",
            boatingQualificationsArr: [],
            boatingQualificationsError: false,
            losses: "",
            lossesErr: true,
            lossesDescribe: "",
            lossesDescribeError: false,
            showLossesDescribe: false,
            convicted: "",
            convictedErr: true,
            convictedDescribe: "",
            convictedDescribeError: false,
            ShowConvictedDescribe: false,
            insuranceCanceled: "",
            insuranceCanceledErr: true,
            insuranceCanceledDescribe: "",
            insuranceCanceledDescribeError: false,
            ShowInsuranceCanceledDescribe: false,
            damaged: "",
            damagedErr: true,
            damagedDescribe: "",
            damagedDescribeError: false,
            ShowDamagedDescribe: false,
            interestedParty: '',
            interestedPartiesError: false,
            previousInsurer: "",
            previousInsurerError: false,
            isInsuranceHistoryProofProvided: false,
            policyNo: "",
            policyNoError: true,
            memberISA: false,
            affiliatedClub: "",
            affiliatedClubError: false,
            ISAMembershipNo: "",
            ISAMembershipNoError: false,
            memberIWAI: false,
            affiliatedBranch: "",
            affiliatedBranchError: false,
            IWAIMembershipNo: "",
            IWAIMembershipNoError: false,
            isGeneralEdit: false,
            Options: [],
            toggleModalGeneral: false,
            tempData: {},
            toggleStageChangeModal: false,
            previousStage: '',
            changeNote: '',
            referredTo: '',
            changeNoteError: '',

            isGeneralExpand: false,
            deleteItemName: '',

            // ---------------------------------------- Mooring Navigation -------------------------------------------------------
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
            navigationCountry: '',
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
            isLock: true,
            lockMsg: '',
            loggedInUserData: CommonConfig.loggedInUserData(),

            isMooringEdit: false,
            referredToName:'',

            PolicyMode: '',
            openModal: false,
            timeout: 1000 * 60 * Number(localStorage.getItem('PolicyDetailPageTimer')) , //(1000*60*n secound) for n minutes for showing alert
            modaltimeout: 1000 * Number(localStorage.getItem('PolicyDetailModalTimer')) ,
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            sessiondisable:false,
            MovetoDashboard: true,
            showSurveyDueData: false,
            lastCompFreezeDate: '',
            showSurveyDueLabel: false,

            branchName:'',
            sourceType:'',
            leadSourceName:'',
            
        };
        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleContinue = this.handleContinue.bind(this)
        this.boatingQualificationListCopy = [];
    }

    async componentDidMount() {
        // dummy entry to create the dynamic row
        let res =await this.checkLock();
        if (!this.state.isLock){
        // this.checkTime();
        // window.addEventListener('beforeunload', this.keepOnPage );
        this.saveRateableParam('CREATEDC', 1);

        // ---------- Policy Details --------
        this.getPolicyStage();
        this.getReferredName();
        this.getSpGetUsersByTeam();
        this.getMidTermStatus();
        let loginPerson = CommonConfig.loggedInUserData().LoginId;
        this.setState({ loginPerson: loginPerson })
        window.scrollTo(0, 0);
        this.getPolicyHolder();
        this.getPaymentDue();
        this.getLanguageData();
        this.getCurrencyData();
        this.getReminderWarningMessage();
        this.getDropDownValues('POLICYTYPE', 'policyTypeList', 'StringMapName');
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
        this.getDropDownValues('ADJUSTMENTTYPE', 'adjustmentAmountList', 'StringMapName');
        this.getPaymentStatus();
        this.isErrorNotes();
        this.IsGenerateRenewal();
        this.getComputationDropdown();
        this.showHideReverseLogicButtons();
        this.getPolicyLeadData();
        this.getFreezeData();



        // -------- Vessel --------
        
        this.getPolicyVeselDetails();
        this.getSysConfigValue();
        this.IsmigratedData();
        this.getDropDownValues('TYPEOFBUILD', 'vesselBuildTypearr', 'StringMapName');
        this.getDropDownValues('HULLMATERIAL', 'vesselHullMaterialarr', 'StringMapName');
        this.getDropDownValues('NOOFENGINES', 'noOfEnginearr', 'StringMapName');
        this.getDropDownValues('TRANSMISSIONS', 'tarnsmissionMainEnginearr', 'StringMapName');
        this.getDropDownValues('AUXENGINE', 'auxiliaryEnginearr', 'StringMapName');
        this.getDropDownValues('NOOFENGINES', 'auxiliaryEngineNoEnginearr', 'StringMapName');
        this.getDropDownValues('TRANSMISSIONS', 'auxiliaryEngineTransmissionarr', 'StringMapName');
        this.getDropDownValues('HULLMATERIAL', 'tenderVesselMaterialarr', 'StringMapName');
        this.getDropDownValues('SUMINSUREDMETHOD', 'sumInsuredMethodarr', 'StringMapName');

        // -------- Underwriting --------
        this.getPolicyUnderwritingData();
        this.getBinderData();
        var PolicyPremium = await this.getPolicyPremium();
        this.getDropDownValues('POLICYDEPARTMENT', 'departmentList', 'StringMapName');
        this.getDropDownValues('AWAITINGDOCUMENT', 'awaitingDocumentList', 'StringMapName');
        this.getDropDownValues('PREMIUMCREDIT', 'premiumCreditList', 'StringMapName');
        this.getDropDownValues('RACINGEVENTTYPE', 'racingEventTypeList', 'StringMapName');
        this.getDropDownValues('CREWLIABILITY', 'crewLiabilityList', 'SortOrder');
        this.getDropDownValues('GOVTLEVY', 'govtLevyList', 'StringMapName');
        this.getDropDownValues('CURRENTNCBYEARS', 'currentNCBNoofYearsList', 'StringMapName');

        // -------- General --------
        this.getGeneralPolicy();
        this.boatingQualificationDropdown();
        this.getDropDownValues('PREVIOUSBOATINGEXPERIENCE', 'previousBoatingExperienceList', 'SortOrder');
        this.getDropDownValues('PREVIOUSNCBYEARS', 'previousNCBNoofYearsList', 'SortOrder');
        this.getDropDownValues('BOATINGQUALIFICATIONS', 'boatingQualificationAllList', 'SortOrder');
        this.getDropDownValues('PREVIOUSINSURER', 'previousInsurerList', 'SortOrder');
        this.getDropDownValues('GENERALNCB', 'NCBList', 'SortOrder');
        this.getDropDownValues('POLICYGENERALYESNO', 'Options', 'SortOrder');

        // -------- Mooring Navigation --------
        this.getMooringData();
        this.getCountry();
        this.getMooringZones();
        this.getCruisingRange();

        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        })

        // Condition if page is first time load or not
        if (window.performance) {
            if (performance.navigation.type == 1) {
                this.getRateableParam();
            } else {
                this.createDynComputationInProgressFromActive();
            }
        }    
        }



    //     this.saveRateableParam('CREATEDC', 1);

    //     // ---------- Policy Details --------
    //     this.getPolicyStage();
    //     this.getSpGetUsersByTeam();
    //     this.getMidTermStatus();
    //     let loginPerson = CommonConfig.loggedInUserData().LoginId;
    //     this.setState({ loginPerson: loginPerson })
    //     window.scrollTo(0, 0);
    //     this.getPolicyHolder();
    //     this.getPaymentDue();
    //     this.getLanguageData();
    //     this.getCurrencyData();
    //     this.getReminderWarningMessage();
    //     this.getDropDownValues('POLICYTYPE', 'policyTypeList', 'StringMapName');
    //     this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
    //     this.getDropDownValues('ADJUSTMENTTYPE', 'adjustmentAmountList', 'StringMapName');
    //     this.getPaymentStatus();
    //     this.isErrorNotes();
    //     this.IsGenerateRenewal();
    //     this.getComputationDropdown();
    //     this.showHideReverseLogicButtons();


    //     // -------- Vessel --------
        
	// this.getPolicyVeselDetails();
    //     this.getSysConfigValue();
    //     this.IsmigratedData();
    //     this.getDropDownValues('TYPEOFBUILD', 'vesselBuildTypearr', 'StringMapName');
    //     this.getDropDownValues('HULLMATERIAL', 'vesselHullMaterialarr', 'StringMapName');
    //     this.getDropDownValues('NOOFENGINES', 'noOfEnginearr', 'StringMapName');
    //     this.getDropDownValues('TRANSMISSIONS', 'tarnsmissionMainEnginearr', 'StringMapName');
    //     this.getDropDownValues('AUXENGINE', 'auxiliaryEnginearr', 'StringMapName');
    //     this.getDropDownValues('NOOFENGINES', 'auxiliaryEngineNoEnginearr', 'StringMapName');
    //     this.getDropDownValues('TRANSMISSIONS', 'auxiliaryEngineTransmissionarr', 'StringMapName');
    //     this.getDropDownValues('HULLMATERIAL', 'tenderVesselMaterialarr', 'StringMapName');
    //     this.getDropDownValues('SUMINSUREDMETHOD', 'sumInsuredMethodarr', 'StringMapName');

    //     // -------- Underwriting --------
    //     this.getPolicyUnderwritingData();
    //     this.getBinderData();
    //     var PolicyPremium = await this.getPolicyPremium();
    //     this.getDropDownValues('POLICYDEPARTMENT', 'departmentList', 'StringMapName');
    //     this.getDropDownValues('AWAITINGDOCUMENT', 'awaitingDocumentList', 'StringMapName');
    //     this.getDropDownValues('PREMIUMCREDIT', 'premiumCreditList', 'StringMapName');
    //     this.getDropDownValues('RACINGEVENTTYPE', 'racingEventTypeList', 'StringMapName');
    //     this.getDropDownValues('CREWLIABILITY', 'crewLiabilityList', 'SortOrder');
    //     this.getDropDownValues('GOVTLEVY', 'govtLevyList', 'StringMapName');
    //     this.getDropDownValues('CURRENTNCBYEARS', 'currentNCBNoofYearsList', 'StringMapName');

    //     // -------- General --------
    //     this.getGeneralPolicy();
    //     this.boatingQualificationDropdown();
    //     this.getDropDownValues('PREVIOUSBOATINGEXPERIENCE', 'previousBoatingExperienceList', 'SortOrder');
    //     this.getDropDownValues('PREVIOUSNCBYEARS', 'previousNCBNoofYearsList', 'SortOrder');
    //     this.getDropDownValues('BOATINGQUALIFICATIONS', 'boatingQualificationAllList', 'SortOrder');
    //     this.getDropDownValues('PREVIOUSINSURER', 'previousInsurerList', 'SortOrder');
    //     this.getDropDownValues('GENERALNCB', 'NCBList', 'SortOrder');
    //     this.getDropDownValues('POLICYGENERALYESNO', 'Options', 'SortOrder');

    //     // -------- Mooring Navigation --------
    //     this.getMooringData();
    //     this.getCountry();
    //     this.getMooringZones();
    //     this.getCruisingRange();

    //     setTimeout(() => {
    //         this.setState({ isMarkerShown: true })
    //     })

    //     // Condition if page is first time load or not
    //     if (window.performance) {
    //         if (performance.navigation.type == 1) {
    //             this.getRateableParam();
    //         } else {
    //             this.createDynComputationInProgressFromActive();
    //         }
    //     }

    }

// keepOnPage(e) {
//   var message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
//   e.returnValue = message;
//   this.releaseLock(this.props.match.params.id)
//   return message;
// }


    handleClose() {
        // this.setState({sessiondisable: true})
        console.log("debug handleclose");
        this.setState({showModal: false})
        this.props.history.push('/dashboard')
    }

    handleContinue(){
        console.log("debug continue");
        this.setState({ openModal: false,
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            sessiondisable:false ,
            MovetoDashboard: false
        })       
            
        this.extendLock();
    }

    _onAction(e) {
        // console.log('user did something')
        this.setState({isTimedOut: false})
      }
     
      _onActive(e) {
     
        // console.log('user is active', e)
        this.setState({isTimedOut: false})
      }
     
      _onIdle(e) {
        // console.log('user is idle', e)
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            // localStorage.clear()
            this.props.history.push('/dashboard')
        } else {
          this.setState({showModal: true})
          this.idleTimer.reset();
          this.setState({isTimedOut: true})
          this.setState({sessiondisable: true})
          setTimeout(() => {
            if(this.state.MovetoDashboard){
              this.props.history.push('/dashboard');
            }
          }, this.state.modaltimeout);//15 seconds alert logout
        }
        
      }

      

    componentWillUnmount() {
        if(!this.state.isLocked){
            this.releaseLock();
            // window.removeEventListener('beforeunload', this.keepOnPage);
        }
    }

    // window.onbeforeunload = function (event) {
    //     var message = 'Important: Please click on \'Save\' button to leave this page.';
    //     if (typeof event == 'undefined') {
    //         event = window.event;
    //     }
    //     if (event) {
    //         event.returnValue = message;
    //     }
    //     return message;
    // };
    // ------------ Policy Details --------
    getMidTermStatus() {
        const data = { PolicyId: this.props.match.params.id };
        console.log("getMidTermStatus", data);
        api.post('api/getMidTermStatus', data).then(res => {
            if (res.success) {
                console.log("getMidTermStatus", res.data);
                if (res.data.length) {
                    this.setState({ isMidTerm: true, PolicyMidTermAdjustmentId: res.data });
                    const data = { PolicyMidTermAdjustmentId: res.data };
                    console.log("getMTDetails", data);
                    api.post('api/getMTDetails', data).then(res => {
                        console.log("getMTDetails", res);
                        if (res.success) {
                            this.setState({ newDuePayment: (CommonConfig.isEmpty(res.data[0].PremiumAfter)) ? 0 : res.data[0].PremiumAfter, paymentDue: (CommonConfig.isEmpty(res.data[0].PremiumBefore)) ? 0 : res.data[0].PremiumBefore, })
                        }
                    });
                } else {
                    this.setState({ isMidTerm: false });
                }
            }
        });
    }

    getPolicyHolder() {
        const data = { policyId: this.props.match.params.id };
        console.log("getPolicyHolderDetails", data);
        api.post('api/getPolicyHolderDetails', data).then(res => {
            console.log("getPolicyHolderDetails", res);
            if (res.success) {
                let resdata = res.data[0];
                console.log("getPolicyHolderDetails", resdata[0]);
                this.setState({
                    policyNumber: resdata[0].PolicyNumber,
                    policyType: resdata[0].PolicyType,
                    phone: resdata[0].CountryCode + ' ' + ((resdata[0].AreaCode == null) ? '' : resdata[0].AreaCode) + ' ' + CommonConfig.formatPhoneNumber(resdata[0].Phone),
                    countryCode: resdata[0].CountryCode,
                    areaCode: resdata[0].AreaCode,
                    language: resdata[0].DocLang,
                    LanguageId: resdata[0].LanguageId,
                    PolicyLanguageId: resdata[0].LanguageId,
                    policyHolder: resdata[0].entityname,
                    email: resdata[0].EmailId,
                    refrred: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
                    showRefer: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
                    status: resdata[0].Status,
                    country: resdata[0].Country,
                    currency: resdata[0].Currency,
                    vesselTypeName: resdata[0].VesselTypeName,
                    contactEntityId: resdata[0].EntityId,
                    contactEntityType: resdata[0].EntityType,
                    inceptionDate: resdata[0].InceptionDate,
                    lastBindDate: resdata[0].LastBindDate,
                    CurrencySymbol: resdata[0].CurrencySymbol,
                    RenewalDate: resdata[0].RenewalDate,
                    isAwaitingDocument: resdata[0].IsAwaitingDocument.data[0],
                    stage: resdata[0].Stage
                });
                this.checkPolicyBind();
                this.getActiveReferralNotes();
                this.getPolicyCount();
                setTimeout(() => {
                    this.initialToggle(0, this.props.match.params.tab, this.props.match.params.subTab);
                }, 5000);
                this.getPremiumPolicyType(resdata[0].Country, 0);
                this.getTPOType();
                this.getThirdPartyDD();
            } else {

            }
        }).catch(err => {
            console.log('error', err);
        });
    }

    getFreezeData(){
        let data={
            PolicyId: this.props.match.params.id
        }
        api.post('api/getFreezingDate', data).then(res => {
            if (res.success) {
                console.log("lastCompFreezeDate....",res.data[0].lastCompFreezeDate)
                var freezingdate = moment(res.data[0].lastCompFreezeDate).format('DD-MM-YYYY');
                this.setState({lastCompFreezeDate: freezingdate});
            } else {
            }
        }).catch(err => {
            console.log("err,,, in freezing data",err);
        });
    }

    getPolicyLeadData(){
        let data={
            PolicyId: this.props.match.params.id
        }
        api.post('api/getPolicyLeadData', data).then(res => {
            if (res.success) {
                console.log("getPolicyLeadData....",res.data[0])
                this.setState({branchName: res.data[0].BranchType , sourceType: res.data[0].SourceEntityType , leadSourceName: res.data[0].LeadSourceName})
            } else {
            }
        }).catch(err => {
            console.log("err,,, in getPolicyLeadData",err);
        });
    }

    getSurveyDataVisible(){
        let data={
            policyId: this.props.match.params.id,
            VesselClassId:this.state.vesselClass,
            VesselTypeId: this.state.vesselType,
            LiabilityType:this.state.LiabilityType
        }
        console.log('data................',data)
        api.post('api/getSurveyDataVisible', data).then(res => {
            if (res.success) {
                var isvisible = (res.data[0].isSurveyDataVisible == 1 ? true : false);
                // console.log("surveydatavisible....",res.data[0].isSurveyDataVisible)
                this.setState({ showSurveyDueData: isvisible});
                
                if(this.state.vesselSurveyDueDate != "" && this.state.vesselSurveyDueDate != "Invalid date" && this.state.vesselSurveyDueDate !="0000-00-00"){

                    var dt2 = new Date().getTime();
                    var dt1 = new Date(this.state.vesselSurveyDueDate).getTime();
                    var diff = (dt2 - dt1) / 1000;
                        diff /= (60 * 60);
                        if(diff >= 0){
                            this.setState({showSurveyDueLabel: true});
                        }else{
                            this.setState({showSurveyDueLabel: false});
                        }

                }else{
                    console.log("else date......", moment().format('DD/MM/YYYY'))

                }
            } else {
            }
        }).catch(err => {
            console.log("err,,, in survey data visible",err);
        });
    }


    checkPolicyBind() {
        if (this.state.status === 'Quotation') {
            this.setState({ isBindPolicyVisible: true });
        }

        if (this.state.lastBindDate == null || this.state.lastBindDate == "") {
            this.setState({ isBindPolicy: false });
        } else {
            this.setState({ isBindPolicy: true });
        }
    }

    getTPOType() {
        try {
            const data = {
                policyId: this.props.match.params.id,
            };
            api.post(APIConstant.path.getTPOType, data).then(res => {
                if (res.success) {
                    var TPO = (res.data[0].returnValue == 'Comprehensive') ? false : true;
                    this.getVesselClassByCountry(this.state.country, this.state.TPO);
                    this.setState({ TPO: TPO, premiumPolicyType: res.data[0].returnValue, defaultPremiumPolicyType: res.data[0].returnValue });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getPaymentDue() {
        try {
            let data = {
                PolicyId: this.props.match.params.id
            }
            api.post('api/getDebitAccountList', data).then(res => {
                console.log("getDebitAccountList ", res);
                let accountData = res.data[0];
                if (res.success) {
                    if (accountData.length) {
                        var duePayment = accountData[0].ClosingBalance;
                    } else {
                        duePayment = 0.00;
                    }
                    this.setState({ bannerPaymentDue: duePayment, paymentStatus: accountData[0].PolicyPaymentStatus });
                } else {
                    console.log("getPaymentDue > getDebitAccountList > error 3", res);
                }
            }).catch(err => {
                console.log("getPaymentDue > getDebitAccountList > error 2", err);
            });
        } catch (err) {
            console.log("getPaymentDue > getDebitAccountList > error 1", err);
        }


    }

    getLanguageData() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                console.log('getLanguageData', res.data);
                if (res.success) {
                    this.setState({ languageList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getCurrencyData() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                if (res.success) {
                    this.setState({ currencyList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getReminderWarningMessage() {

        const data = { PolicyId: this.props.match.params.id, CurrentUser: CommonConfig.loggedInUserId() };
        api.post('api/getReminderWarningMessage', data).then(res => {
            if (res.success) {
                this.setState({ policyWarningMessagesReminders: res.data })
            } else {

            }
        }).catch(err => {

        });
    }

    getPaymentStatus() {
        // const data = { policyId: this.props.match.params.id };
        // api.post('api/getPaymentStatus', data).then(res => {
        //     if (res.success) {
        //         var newRes = res.data[0];
        //         this.setState({ paymentStatus: newRes[0].returnValue });
        //     }
        // });
    }

    getPolicyStage() {
        const data = {
            PolicyId: this.props.match.params.id,
            Stage: this.state.stage,
            loggedInUserId: CommonConfig.loggedInUserId()
        };

        api.post('api/getPolicyStage', data).then(res => {
            console.log('getPolicyStage', res);

            if (res.success) {
                this.setState({ stageList: res.data });
            }
        });
    }

    getReferredName() {
        const data = {
            PolicyId: this.props.match.params.id
        };

        api.post('api/getReferredName', data).then(res => {
            console.log('getReferredName', res);
            if (res.success) {
                this.setState({ referredToName: res.data.referredTo });
            }
        });
    }

    getSpGetUsersByTeam() {
        const data = {
            TeamName: 'Underwriting',
        };
        api.post('api/getSpGetUsersByTeam', data).then(res => {
            console.log('getSpGetUsersByTeam', res);
            if (res.success) {
                this.setState({ referrList: res.data });
            }
        });
    }

    savePolicyStage(stage) {
        if (stage === "") {
            toast.error("Please select any stage to continue.");
        } else {

            if (stage) {
                this.setState({ previousStage: this.state.stage, stage: stage });
                this.toggleStageChange()
            } else {
                if (this.state.stage == 'Referred') {
                    // if (this.state.referredTo == "") {
                    //     toast.error('Please Select Referred To');
                    //     return
                    // }

                    if (this.state.changeNote == "") {
                        toast.error('Please Enter Note');
                        return
                    }
                }
                const data = {
                    PolicyId: this.props.match.params.id,
                    Stage: this.state.stage,
                    CurrentUser: CommonConfig.loggedInUserId(),
                    ChangeNote: this.state.changeNote,
                    ReferredTo: CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting' ? this.state.referredTo : '',
                    PolicyData: ''
                };
                api.post('api/savePolicyStage', data).then(res => {
                    console.log('savePolicyStage', res.data);
                    if (res.success) {
                        console.log('savePolicyStage', res.data[0].returnValue);

                        if (CommonConfig.isEmpty(res.data[0].returnValue)) {
                            toast.success('Policy Stage changed Successfully to ' + this.state.stage);
                            this.setState({ stage: this.state.stage, previousStage: this.state.stage, referredTo: '', changeNote: '', changeStage: false });
                            this.toggleStageChange();
                        } else {
                            toast.success(res.data[0].returnValue);
                        }

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
            }
        }
    }

    isErrorNotes() {
        const data = { PolicyId: this.props.match.params.id, CurrentUser: CommonConfig.loggedInUserId() };
        api.post('api/isErrorNotes', data).then(res => {
            console.log('isErrorNotes', res.data);
            if (res.success) {
                if (res.data.length != 0) {
                    this.setState({ errorNote: res.data, showSummary: false, showWarningsMessagesReminders: true })
                } else {
                    this.setState({ showWarningsMessagesReminders: false, showSummary: true })
                }
            } else {

            }
        }).catch(err => {

        });
    }

    IsGenerateRenewal() {
        const data = { policyId: this.props.match.params.id };
        api.post(APIConstant.path.isGenerateRenewal, data).then(res => {
            console.log('isGenerateRenewal', res.data[0].returnValue);
            if (res.success) {
                if (!CommonConfig.isEmpty(res.data[0].returnValue) && res.data[0].returnValue != 0) {

                    console.log('res.data[0].returnValue', res.data[0].returnValue);
                    this.setState({ isGenerateRenewal: res.data[0].returnValue, PremiumType: 'Upcoming Renewal', isRenewal: 1 })
                    this.getPolicySummaryUpdated('Upcoming Renewal');
                }
            } else {
                console.log('error');
            }
        }).catch(err => {

        });
    }

    showHideReverseLogicButtons() {
        const data = { policyId: this.props.match.params.id };
        api.post('api/showHideReverseLogicButtons', data).then(res => {
            console.log('isGenerateRenewal', res.data);
            if (res.success) {

                console.log('res.returnValue[0].returnValue', res.data.returnValue[0].returnValue);
                if (res.data.returnValue[0].returnValue == 0) {
                    this.setState({ isUnBind: 1 })
                } else if (res.data.returnValue[0].returnValue == 1) {
                    this.setState({ isUnConfirmRenewal: 1 })
                }

            }

        }).catch(err => {

        });
    }

    getComputationDropdown() {
        const data = { PolicyId: this.props.match.params.id };
        api.post('api/getComputationDropdown', data).then(res => {

            if (res.success) {
                var nameArr = res.data[0][0].outValue.split(',');
                var formattedData = [];
                for (var i = 0; i < res.data[0][0].outCount; i++) {
                    formattedData.push({
                        StringMapKey: nameArr[i],
                        StringMapName: nameArr[i]
                    });
                }
                this.getPolicySummaryUpdated(nameArr[0]);
                this.setState({ PremiumTypeList: formattedData, PremiumType: nameArr[0] })
            } else {
                console.log('error');
            }
        }).catch(err => {

        });
    }

    getPolicySummaryUpdated(option) {
        const data = { PolicyId: this.props.match.params.id, Option: option };
        console.log("getPolicySummaryUpdated", data);
        api.post('api/getPolicySummaryUpdated', data).then(res => {
            console.log("getPolicySummaryUpdated", res);
            if (res.success) {
                console.log("getPolicySummaryUpdated", res.data);
                // let res.data[0][0] = res.data[0][0];
                var length = res.data[0].length
                var temp = length == 0 ? '' : res.data[0][0].SumInsured;
                this.setState({
                    isDisplaySummary: res.data[0].length,
                    computationId: length == 0 ? '' : res.data[0][0].PolicyComputationId,
                    policyTotalSumInsured: length == 0 ? '' : res.data[0][0].SumInsured,
                    policyRate: length == 0 ? '' : res.data[0][0].BaseRate + ' %',
                    policyStartingPremium: length == 0 ? '' : res.data[0][0].StartingPremium,
                    policyAdjustments: length == 0 ? '' : res.data[0][0].Adjustments,
                    policyAdjustmentsPremium: length == 0 ? '' : res.data[0][0].AdjustedPremium,
                    policyNCB: length == 0 ? '' : res.data[0][0].NCBDiscount,
                    policyLocalTax: length == 0 ? '' : res.data[0][0].LevyTotalAmount,
                    policyAdminFees: length == 0 ? '' : res.data[0][0].AdminFee,
                    policyAddOns: length == 0 ? '' : res.data[0][0].AddOnCoverage != null ? res.data[0][0].AddOnCoverage : 0.00,
                    policyTotalDue: length == 0 ? '' : res.data[0][0].TotalDue,
                    policyExcess: length == 0 ? '' : res.data[0][0].Excess,
                    policyCommission: length == 0 ? '' : res.data[0][0].GrossCommission,
                    policySummaryCurrency: length == 0 ? '' : res.data[0][0].Currency,
                });
            } else {

            }
        }).catch(err => {

        });
    }

    // ------------ Policy Details --------

    //------------- Vessel ----------------

    getPolicyVeselDetails() {
        let data = {
            PolicyId: this.props.match.params.id
        }
        api.post('api/getVesselDetails', data).then(res => {
            console.log('getVesselDetails', res);
            if (res.success) {
                console.log('getVesselDetails', res.data[0]);
                if (res.data.length) {
                    var d= res.data[0].vesselClassName;

                    console.log('res.data[0].LiabilityType', res.data[0].LiabilityType);
                    this.setState({
                        liabilityType: res.data[0].LiabilityType,
                        // country: res.data[0].Country,
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
			// vesselBuildName: CommonConfig.isEmpty(res.data[0].BuildTypeName) ? '' : res.data[0].BuildTypeName,
                        vesselBuiltYear: CommonConfig.isEmpty(res.data[0].YearBuilt) ? '' : res.data[0].YearBuilt,
                        vesselLastSurveyDate: CommonConfig.isEmpty(res.data[0].LastSurveyDate) ? '' : moment(res.data[0].LastSurveyDate).format('YYYY-MM-DD'),
                        vesselHullMaterial: CommonConfig.isEmpty(res.data[0].HullMaterial) ? '' : res.data[0].HullMaterial,
			// vesselHullMaterialName: CommonConfig.isEmpty(res.data[0].HullMaterialName) ? '' : res.data[0].HullMaterialName,	
                        vesselPurchasePrice: CommonConfig.isEmpty(res.data[0].PurchasePrice) ? '' : res.data[0].PurchasePrice,
                        vesselUseOfVessel: CommonConfig.isEmpty(res.data[0].VesselUse) ? '' : res.data[0].VesselUse,
			// vesselUseOfVesselName: CommonConfig.isEmpty(res.data[0].VesselUse) ? '' : res.data[0].VesselUseName,
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
			// noOfEngineName: CommonConfig.isEmpty(res.data[0].MainEngineCountName) ? '' : res.data[0].MainEngineCountName,
                        noOfEngineError: CommonConfig.isEmpty(res.data[0].MainEngineCount) ? true : false,
                        tarnsmissionMainEngine: CommonConfig.isEmpty(res.data[0].MainEngineTransmission) ? '' : res.data[0].MainEngineTransmission,
                        // tarnsmissionMainEngineName: CommonConfig.isEmpty(res.data[0].MainEngineTransmissionName) ? '' : res.data[0].MainEngineTransmissionName,
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
                        Bimini: CommonConfig.isEmpty(res.data[0].BiminiValue) ? 0 : res.data[0].BiminiValue,
                        Canopy: CommonConfig.isEmpty(res.data[0].CanopyValue) ? 0 : res.data[0].CanopyValue,
                        boatCovers: CommonConfig.isEmpty(res.data[0].CoversValue) ? 0 : res.data[0].CoversValue,
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
                    let BoatAge = new Date().getFullYear() - this.state.vesselBuiltYear;
                    this.setState({ vessellastSurveyDateLabel: (BoatAge >= 20) ? "Last Survey Date *" : "Last Survey Date" });

                    if (this.state.VesselClassName === "Commercial Vessels") {
                        this.getDropDownValues('COMMERCIALUSEOFVESSEL', 'UseofVesselList', 'StringMapName');
                    } else {
                        this.getDropDownValues('USEOFVESSEL', 'UseofVesselList', 'StringMapName');
                    }

                } else {
                    this.setState({ isVesselEdit: true })
                }
                this.getSurveyDataVisible();
                this.calculateSumInsured(true);
                this.calculateNavigationalEquipment();
                this.calculatePersonalEffects();
                this.calculateSailsCanopyCovers();
            }
            else {
                console.log("getVesselDetails", "ELSE");
            }
        });
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

    unlapsePolicy() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                loggedInUserId: CommonConfig.loggedInUserId()
            };
            api.post('api/unlapsePolicy', data).then(res => {
                console.log("unlapsePolicy-----", res);
                if (res.success) {
                    toast.success('Policy unlapsed successfully.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.log("unlapsePolicy ---- error", res);
                }
            }).catch(error => {
                console.log("unlapsePolicy ---- error", error);
            });
        } catch (error) {
            console.log("unlapsePolicy ---- error", error);
        }
    }
    //------------- Vessel ----------------

    //------------- Underwriting ---------

    async getPolicyPremium() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                LanguageId: this.state.LanguageId
            };
            var PolicyPremium = await api.post('api/getPolicyPremium', data).then(res => {
                if (res.success) {
                    this.setState({ PolicyCurrentPremium: res.data[0][0].TotalPremium });
                    return 1;
                } else {
                    console.log("something error");
                    return 1;
                }
            }).catch(err => {
                console.log("error", err);
                return 1;
            });
            return PolicyPremium;
        } catch (error) {
            console.log("erroreeee", error);
        }
    }

    getBinderData() {
        try {
            let data = {};
            api.post('api/getBinder', data).then(res => {
                if (res.success) {
                    this.setState({ binders: res.data });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
        }
    }

    getPolicyUnderwritingData() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                LanguageId: this.state.LanguageId,
                loggedInUserId: CommonConfig.loggedInUserId()
            };
            api.post('api/getPolicyUnderwritingData', data).then(res => {
                console.log("underwriting", res.data);
                if (res.success) {
                    let PolicyUnderwritingData = res.data[0];

                    let InceptionDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].InceptionDate)) {
                        InceptionDate = '';
                        this.setState({ inceptionDateError: true });
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].InceptionDate).format('YYYY-MM-DD');
                        InceptionDate = (dt === 'Invalid date') ? '' : dt;
                        this.setState({ inceptionDateError: false });
                    }
                    let SurveyDueDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].SurveyDueDate)) {
                        SurveyDueDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].SurveyDueDate).format('YYYY-MM-DD');
                        SurveyDueDate = (dt === 'Invalid date') ? '' : new Date(dt);
                    }

                    let RenewalDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].RenewalDate)) {
                        RenewalDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].RenewalDate).format('YYYY-MM-DD');
                        RenewalDate = (dt === 'Invalid date') ? '' : dt;
                    }
                    console.log('PolicyUnderwritingData[0].RenewalDate', PolicyUnderwritingData[0].RenewalDate);

                    let LastBindDate;
                    if (CommonConfig.isEmpty(PolicyUnderwritingData[0].LastBindDate)) {
                        LastBindDate = '';
                    } else {
                        let dt = moment(PolicyUnderwritingData[0].LastBindDate).format('YYYY-MM-DD');
                        LastBindDate = (dt === 'Invalid date') ? '' : dt;
                    }

                    this.conditionalFieldUnderwriting(0);

                    // Initialize Agency value
                    let currentPremium = parseFloat(this.state.PolicyCurrentPremium);
                    let agencyPercent = (PolicyUnderwritingData[0].AgencyCommissionPercent) ? parseFloat(PolicyUnderwritingData[0].AgencyCommissionPercent) : 0;
                    let agencyAmount = (agencyPercent * currentPremium) / 100;

                    // Initialize gross value
                    let gross = parseFloat(PolicyUnderwritingData[0].GrossCommisionPercent);
                    let totalgross = (gross * currentPremium) / 100;

                    // Initialize balance value
                    let balance = parseFloat(gross) - parseFloat(agencyPercent);
                    let balanceTotal = parseFloat(totalgross) - parseFloat(agencyAmount);
                    // let source = { label: PolicyUnderwritingData[0].SourceName, value: PolicyUnderwritingData[0].SourceId };
                    var source = PolicyUnderwritingData[0].SourceId;
                    console.log('(PolicyUnderwritingData[0].Department ===', (PolicyUnderwritingData[0].Department === 'ServiceCenter' || PolicyUnderwritingData[0].Department === 'SubAgent'));
                    console.log(PolicyUnderwritingData[0].Department);

                    this.setState({
                        PolicyNumber: PolicyUnderwritingData[0].PolicyNumber,
                        PolicyUnderwritingId: PolicyUnderwritingData[0].PolicyUnderwritingId,
                        PolicyInsuredAmountId: PolicyUnderwritingData[0].PolicyInsuredAmountId,
                        binder: PolicyUnderwritingData[0].UMRN,
                        subBinder: PolicyUnderwritingData[0].Title,
                        insuranceComapnyId: PolicyUnderwritingData[0].InsuranceComapnyId,
                        insuranceComapny: PolicyUnderwritingData[0].InsuranceCompanyName,
                        department: PolicyUnderwritingData[0].Department,
                        departmentName: PolicyUnderwritingData[0].DepartmentName,
                        departmentDisable: (PolicyUnderwritingData[0].Title) ? true : false,
                        source: source,
                        sourceDisable: (PolicyUnderwritingData[0].Title) ? true : false,
                        sourceName: PolicyUnderwritingData[0].SourceName,
                        sourceError: (PolicyUnderwritingData[0].Department === 'ServiceCenter' || PolicyUnderwritingData[0].Department === 'SubAgent') ? CommonConfig.isEmpty(PolicyUnderwritingData[0].SourceName) : false,
                        awaitingDocuments: CommonConfig.isEmpty(PolicyUnderwritingData[0].IsAwaitingDocument) ? 'No' : PolicyUnderwritingData[0].IsAwaitingDocument.data[0] == 1 ? "Yes" : "No",
                        premiumCredits: CommonConfig.isEmpty(PolicyUnderwritingData[0].IsPremiumCredit) ? 'No' : PolicyUnderwritingData[0].IsPremiumCredit.data[0] == 1 ? "Yes" : "No",
                        liabilityType: PolicyUnderwritingData[0].LiabilityType,
                        PolicyInsuredAmount: PolicyUnderwritingData[0].InsuranceCompanyName,
                        thirdPartyLiability: PolicyUnderwritingData[0].ThirdPartyLiabilityAmount,
                        isWaterSkiing: (CommonConfig.isEmpty(PolicyUnderwritingData[0].WaterSkiingLiabilityAmount) || PolicyUnderwritingData[0].WaterSkiingLiabilityAmount == 0) ? false : true,
                        waterSkiingLiability: PolicyUnderwritingData[0].WaterSkiingLiabilityAmount,
                        waterSkiingLiabilityAmount: PolicyUnderwritingData[0].WaterSkiingLiabilityAmount,
                        isWaterToys: (CommonConfig.isEmpty(PolicyUnderwritingData[0].WaterToysLiabilityAmount) || PolicyUnderwritingData[0].WaterToysLiabilityAmount == 0) ? false : true,
                        waterToysLiability: PolicyUnderwritingData[0].WaterToysLiabilityAmount,
                        waterToysLiabilityAmount: PolicyUnderwritingData[0].WaterToysLiabilityAmount,
                        isSailRacing: (CommonConfig.isEmpty(PolicyUnderwritingData[0].SailRacingCoverageAmount) || PolicyUnderwritingData[0].SailRacingCoverageAmount == 0) ? false : true,
                        sailRacingCoverage: PolicyUnderwritingData[0].SailRacingCoverageAmount,
                        sailRacingCoverageAmount: PolicyUnderwritingData[0].SailRacingCoverageAmount,
                        racingEventType: PolicyUnderwritingData[0].RacingEventType,
                        crewLiability: PolicyUnderwritingData[0].CrewLiability,
                        MarineTradePremium: PolicyUnderwritingData[0].MarineTradePremium ? PolicyUnderwritingData[0].MarineTradePremium : '',
                        // inceptionDate: moment(PolicyUnderwritingData[0].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                        // renewalDate: moment(PolicyUnderwritingData[0].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                        // lastBindDate: moment(PolicyUnderwritingData[0].LastBindDate).format(CommonConfig.dateFormat.dateOnly),
                        yearBuilt: PolicyUnderwritingData[0].YearBuilt,
                        lastSurveyDate: CommonConfig.isEmpty(moment(PolicyUnderwritingData[0].LastSurveyDate)) ? moment(PolicyUnderwritingData[0].LastSurveyDate).format(CommonConfig.dateFormat.dateOnly) : '',
                        surveyDueDate: SurveyDueDate,
                        defaultinceptionDate: InceptionDate,
                        inceptionDate: InceptionDate,
                        defaultrenewalDate: RenewalDate,
                        renewalDate: RenewalDate,
                        renewalDateError: CommonConfig.isEmpty(RenewalDate),
                        defaultLastBindDate: LastBindDate,
                        lastBindDate: LastBindDate,
                        underWriter: PolicyUnderwritingData[0].UnderwriterAmount,
                        currentPremium: PolicyUnderwritingData[0].CurrentPremium,
                        renewalPremium: PolicyUnderwritingData[0].RenewalPremium,
                        policyStatus: PolicyUnderwritingData[0].Status,

                        note: PolicyUnderwritingData[0].UnderwriterNote,
                        gross: gross.toFixed(2),
                        totalgross: totalgross.toFixed(2),
                        agency: agencyPercent.toFixed(2),
                        agencyTotal: agencyAmount.toFixed(2),
                        balance: balance.toFixed(2),
                        balanceTotal: balanceTotal.toFixed(2),

                        governmentLavys: (PolicyUnderwritingData[0].GovtLevyType == "CUSTOM") ? 'CUSTOM' : 'DEFAULT',
                        governmentLavysPercent: PolicyUnderwritingData[0].GovtLevyPercent,
                        governmentLavysAmount: PolicyUnderwritingData[0].GovtLevyAmount,
                        adminFees: PolicyUnderwritingData[0].AdminFeeAmount,

                        excess: PolicyUnderwritingData[0].ExcessAmount,
                        subBinders: PolicyUnderwritingData[0].subBinderData,

                        ratingType: PolicyUnderwritingData[0].NonRatableRatingType,
                        ratingTypeValueRegex: (PolicyUnderwritingData[0].NonRatableRatingType == 'Rating') ? CommonConfig.RegExp.percentage : CommonConfig.RegExp.decimalWithOne,
                        ratingTypeValue: PolicyUnderwritingData[0].NonRatableRateAmount,
                        PolicyType: PolicyUnderwritingData[0].PolicyType,
                        currentNCBAmount: (CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBAmount) ? '' : PolicyUnderwritingData[0].CurrentNCBAmount),
                        currentNCBYears: PolicyUnderwritingData[0].CurrentNCBYear,
                        PolicyGeneralId: PolicyUnderwritingData[0].PolicyGeneralId,
                        currentNCBAmountError: CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBAmount) ? true : false,
                        currentNCBYearsError: CommonConfig.isEmpty(PolicyUnderwritingData[0].CurrentNCBYear) ? true : false,
                        // inceptionDateError: (PolicyUnderwritingData[0].InceptionDate != '' || PolicyUnderwritingData[0].InceptionDate != null || PolicyUnderwritingData[0].InceptionDate != undefined) ? false : true,
                        // selectBinderError: (PolicyUnderwritingData[0].BinderId != '' || PolicyUnderwritingData[0].BinderId != null || PolicyUnderwritingData[0].BinderId != undefined) ? false : true
                        selectBinderError: CommonConfig.isEmpty(PolicyUnderwritingData[0].BinderId) ? true : false
                    });
                    this.getOrganazationData(this.state.department);
                    this.getWaterSkiiAndWaterToys();
                } else {
                    console.log('getPolicyUnderwritingData_error');
                }
            }).catch(err => {
                console.log('getPolicyUnderwritingData_error', err);
            });
        } catch (error) {
            console.log('getPolicyUnderwritingData_error', error);
        }
    }

    getThirdPartyDD() {
        if (this.state.country == "Spain") {
            this.getDropDownValues('THIRDPARTYLIABILITYSPAIN', 'thirdPartyLiabilityList', 'SortOrder');
        } else {
            this.getDropDownValues('THIRDPARTYLIABILITY', 'thirdPartyLiabilityList', 'SortOrder');
        }
    }

    //------------- Underwriting ---------

    //------------- General --------------

    getGeneralPolicy() {
        try {
            let data = { PolicyId: this.props.match.params.id };
            api.post('api/getGeneralPolicy', data).then(res => {
                console.log("ASDfdsagf", res);
                if (res.success) {
                    let arr1 = res.data[0].boatingQualificationsArr; //data from policyboatingQualification(which are added)
                    let arr2 = this.state.boatingQualificationList; //data from stringmap(all boatingQualifications)

                    for (let i = 0; i < arr1.length; i++) {
                        let index = arr2.findIndex(x => x.StringMapId === arr1[i].BoatingQualification);
                        arr2.splice(index, 1);
                    }

                    this.setState({
                        policyGeneralId: res.data[0].PolicyGeneralId,
                        boatingExperienceYear: res.data[0].PreviousBoatingExperinceInYears,
                        isGeneralQuestionProofProvided: res.data[0].IsGeneralQuestionProofProvided.data[0] === 1 ? true : false,
                        previousNCBAmount: res.data[0].PreviousNCBAmount,
                        previousNCBYears: res.data[0].PreviousNCBYears,
                        CurrentNCBAmount: res.data[0].CurrentNCBAmount,
                        CurrentNCBYear: res.data[0].CurrentNCBYear,

                        boatingQualificationsArr: res.data[0].boatingQualificationsArr,
                        boatingQualificationList: arr2,

                        losses: res.data[0].IsLossesInLastFiveYears.data[0] === 1 ? "Yes" : "No",
                        showLossesDescribe: res.data[0].IsLossesInLastFiveYears.data[0] === 1 ? true : false,
                        lossesDescribe: res.data[0].LossesInLastFiveYearsDescription,
                        convicted: res.data[0].IsConvictedOrCharged.data[0] === 1 ? "Yes" : "No",
                        ShowConvictedDescribe: res.data[0].IsConvictedOrCharged.data[0] === 1 ? true : false,
                        convictedDescribe: res.data[0].ConvictedOrChargedDescription,
                        insuranceCanceled: res.data[0].IsInsuranceCanceledOrRefused.data[0] === 1 ? "Yes" : "No",
                        ShowInsuranceCanceledDescribe: res.data[0].IsInsuranceCanceledOrRefused.data[0] === 1 ? true : false,
                        insuranceCanceledDescribe: res.data[0].InsuranceCanceledOrRefusedDescription,
                        damaged: res.data[0].IsVesselHasBeenDamaged.data[0] === 1 ? "Yes" : "No",
                        ShowDamagedDescribe: res.data[0].IsVesselHasBeenDamaged.data[0] === 1 ? true : false,
                        damagedDescribe: res.data[0].VesselHasBeenDamagedDescription,
                        interestedParty: res.data[0].InterestedParty,
                        previousInsurer: res.data[0].PreviousInsurer,
                        isInsuranceHistoryProofProvided: res.data[0].IsInsuranceHistoryProofProvided.data[0] === 1 ? true : false,
                        policyNo: res.data[0].PreviousPolicyNumber,
                        memberISA: res.data[0].IsMemberofISA.data[0] === 1 ? true : false,
                        affiliatedClub: res.data[0].ISAAffiliatedClubName,
                        ISAMembershipNo: res.data[0].ISAMembershipNumber,
                        memberIWAI: res.data[0].IsMemberofIWAI.data[0] === 1 ? true : false,
                        affiliatedBranch: res.data[0].IWAIAffiliatedBranchName,
                        IWAIMembershipNo: res.data[0].IWAIMembershipNumber,
                        boatingExperienceYearError: res.data[0].PreviousBoatingExperinceInYears !== '' ? false : true,
                        policyNoError: res.data[0].PreviousPolicyNumber !== '' ? false : true,
                        previousNCBYearsError: res.data[0].PreviousNCBYears !== '' ? false : true,
                        previousNCBAmountError: res.data[0].PreviousNCBAmount !== '' ? false : true,
                        lossesErr: false,
                        convictedErr: false,
                        insuranceCanceledErr: false,
                        damagedErr: false,
                    });
                } else {
                    console.log("Something Went Wrong");
                }
            }).catch(err => {
                console.log("err...", err);
                toast.error("Something Went Wrong");
            });
        } catch (err) {
            console.log("err...", err);
            toast.error("Something Went Wrong");
        }

    }

    boatingQualificationDropdown() {
        try {
            const data = {
                stringmaptype: "BOATINGQUALIFICATIONS",
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {

                if (res.success) {
                    this.setState({ boatingQualificationList: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    //------------- General --------------

    //------------- Mooring --------------

    getMooringData() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
            }
            api.post('api/getMooringList', data).then(res => {
                if (res.success) {

                    console.log('getMooringList', res);
                    if (res.data.length) {
                        this.getmooringType(res.data[0].MooringName, res.data[0].MooringType);
                        var mooringRegNo = (res.data[0].VesselRegistrationNumber == '' || res.data[0].VesselRegistrationNumber == undefined || res.data[0].VesselRegistrationNumber == undefined || res.data[0].VesselRegistrationNumber == "null") ? '' : res.data[0].VesselRegistrationNumber
                        this.setState({
                            // currency: res.data[0].Currency,
                            mooringBoatReg: res.data[0].VesselRegistrationLocation,
                            PolicyMooringNavigationId: res.data[0].PolicyMooringNavigationId,
                            mooringRegNo: mooringRegNo,
                            mooringBoatMoored: res.data[0].MooringName,
                            mooringType: res.data[0].MooringType,
                            CruisingRange: res.data[0].CruisingRange,
                            OtherInformation: res.data[0].AdditionalCruisingRange,
                            defaultIsLaidAshore: ((res.data[0].IsLaidUpAshore) != null ? ((res.data[0].IsLaidUpAshore.data[0] == 0) ? false : true) : false),
                            isLaidAshore: ((res.data[0].IsLaidUpAshore) != null ? ((res.data[0].IsLaidUpAshore.data[0] == 0) ? false : true) : false),

                            newMooringBoatReg: res.data[0].VesselRegistrationLocation,
                            newMooringBoatMoored: res.data[0].MooringName,
                            newCruisingRange: res.data[0].CruisingRange,

                            mooringBoatRegError: CommonConfig.isEmpty(res.data[0].VesselRegistrationLocation) ? true : false,
                            mooringBoatMooredError: CommonConfig.isEmpty(res.data[0].MooringName) ? true : false,
                            CruisingRangeError: CommonConfig.isEmpty(res.data[0].CruisingRange) ? true : false
                        });
                        // this.getLaidUpAshoreModalData();
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

    getMooringZones() {
        try {
            const data = {
                pMode: 'mooringName',
                zone: 'Irish Website',
                mooringName: this.state.mooringBoatMoored,
                mooringType: this.state.mooringType,
                PolicyId: this.props.match.params.id,
            };
            api.post('api/getMooringGuideDetails', data).then(res => {
                console.log("getMooringLocation", res.data[0]);
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
                    console.log('CruisingRange', CruisingRange);
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

    //------------- Mooring --------------

    // Condition if page is first time load or not

    getRateableParam() {
        const data = {
            PolicyId: this.props.match.params.id,
            loggedInUserId: CommonConfig.loggedInUserId(),
            adjustmentDate: this.state.adjustmentDate,
        };
        console.log("getRateableParam", data);
        api.post('api/getRateableParam', data).then(res => {
            console.log("getRateableParam", res);
            if (res.success) {
                if (res.data.length) {
                    this.setState({
                        // Quotation / Mid Term Adjustment / Mid Term Laid Up / Renewal
                        PolicyMode: res.data[0].computationType,

                        PolicyCurrentNetPremium: res.data[0].prevTotalPremium.toFixed(2),
                        PolicyCurrentLevy: res.data[0].prevLevy.toFixed(2),
                        PolicyCurrentAdminFee: res.data[0].prevAdminFee.toFixed(2),
                        PolicyCurrentTotalDue: res.data[0].prevTotalDue.toFixed(2),

                        PolicyNewNetPremium: res.data[0].totalPremium.toFixed(2),
                        PolicyNewLevy: res.data[0].levy.toFixed(2),
                        PolicyNewAdminFee: res.data[0].adminFee.toFixed(2),
                        PolicyNewTotalDue: res.data[0].totalDue.toFixed(2),

                        PolicyChangeNetPremium: res.data[0].diffTotalPremium.toFixed(2),
                        PolicyChangeLevy: res.data[0].diffLevy.toFixed(2),
                        PolicyChangeAdminFee: res.data[0].diffAdminFee.toFixed(2),
                        PolicyChangeTotalDue: res.data[0].diffTotalDue.toFixed(2),
                        ProrationRatio: res.data[0].prorationRatio,

                        MidTermAdjustmentFee: CommonConfig.isEmpty(res.data[0].midTermAdjustmentFee) ? 0 : Number(res.data[0].midTermAdjustmentFee).toFixed(2),
                        isEditAdjustmentDate: false
                    });

                    if ((Number(res.data[0].totalPremium) - Number(res.data[0].prevTotalPremium)) != 0) {
                        this.setState({ isCalculatorVisible: true });
                    }

                } else {
                    toast.error(res.message);
                }
            } else {
                toast.error(res.message);
            }
        });
    }

    createDynComputationInProgressFromActive() {
        const data = {
            PolicyId: this.props.match.params.id,
            loggedInUserId: CommonConfig.loggedInUserId(),
            adjustmentDate: this.state.adjustmentDate,
        };
        api.post('api/createDynComputationInProgressFromActive', data).then(res => {
            if (res.success) {
                console.log("createDynComputationInProgressFromActive", res.data);
                this.getRateableParam();
            }
        });
    }

    // checkTime(){
    //     setTimeout(function () {
    //         this.setState({openModal: true});
    //         this.checkIsClicked1();
    //         console.log("openModal")
    //     }.bind(this), 30000);
    // }

    // checkIsClicked1 = () => {
    //     setTimeout(function(){
    //         this.extendLock({'IsClicked': false });
    //     }.bind(this), 15000)
    // }

     extendLock(){
        
        this.setState({showModal : false});
        let data = {
            'PolicyId' : this.props.match.params.id
        };
        
         api.post('api/extendLock', data).then(res => {
            console.log("debug extednd")
            if (res.success) {
                toast.success(" Your session was extended sucessfully.");
            } else {
                toast.warn("Could not extend your session.");
            }
        }).catch(err => {
            console.log("error in catch", err);
        });
    }

    // Condition if page is first time load or not
    async checkLock(){
        let data = {
            'PolicyId' : this.props.match.params.id
        };
        
        await api.post('api/setLock', data).then(res => {
            if (res.success) {
                if(res.data[0].returnValue == ''){
                    this.setState({isLock: false});
                    return true
                }else{
                    this.setState({isLock: true , lockMsg: res.data[0].returnValue});
                    return false
                }
            } else {
                toast.warn("No notes found for Policy.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });
    }

    async releaseLock(){
        let data = {
            'PolicyId' : this.props.match.params.id,
            'ReleaseAll' : 0
        };
        
        await api.post('api/releaseLock', data).then(res => {
            if (res.success) {
                if(res.data[0][0].returnValue==''){
                    toast.success("Policy unlocked Successfully");
                    window.location.reload();  
                }else{
                    toast.warn(res.data[0][0].returnValue);
                }
                
            } else {
                toast.warn("SomeThing went wrong.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });

    }

    saveRateableParam(RetableFieldName, RetableFieldValue) {
        var isTriggerd = false;
        // if (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel' && this.state.policyType != 'VesselNonrated' && !(this.state.TPO) && this.state.liabilityType != 'TPO') {
        if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
            if (RetableFieldName == 'MarineTradePremium' || RetableFieldName == 'AdminFee' || RetableFieldName == 'LevyAbsolute' || RetableFieldName == 'UnderwriterAmount') {
                isTriggerd = true;
            }
        }
        else {
            isTriggerd = true;
        }

        if (isTriggerd) {

            const data = {
                PolicyId: this.props.match.params.id,
                RetableField: { [RetableFieldName]: RetableFieldValue },
                PolicyMode: this.state.PolicyMode,
                loggedInUserId: CommonConfig.loggedInUserId(),
            };
            console.log("saveRateableParam", data);
            api.post('api/saveRateableParam', data).then(res => {
                if (res.success) {
                    console.log("saveRateableParam", res.data);
                    if (CommonConfig.isEmpty(res.data[0].returnValue)) {
                        if (!CommonConfig.isEmpty(res.data[0].newVesselTypeName)) {
                            this.setState({ vesselTypeName: res.data[0].newVesselTypeName });
                        }
                        this.getRateableParam();
                    } else {
                        toast.error(res.data[0].returnValue);
                    }
                }
            });
        }
    }

    // Banner Refresh Button

    refreshDynamicComputation() {
        this.saveRateableParam('Refresh', '');
    }

    // Banner Refresh Button

    // Banner red button

    toggleRevertPolicyDetailPopup() {
        this.setState({ isRevertPolicyPopup: !this.state.isRevertPolicyPopup });
    }

    revertPolicyDetail() {
        const data = {
            PolicyId: this.props.match.params.id,
            loggedInUserId: CommonConfig.loggedInUserId(),
        };
        console.log("revertPolicyDetail", data);
        api.post('api/revertPolicyDetail', data).then(res => {
            console.log('revertPolicyDetail', res);
            if (res.success) {
                this.setState({ isRevertPolicyPopup: false });
                toast.success("All changes Reverted");
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        });
    }

    // Banner red button

    // Banner green button

    validatePolicyDetails() {
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

            var isTabError1 = true;
            var isTabError2 = true;
            if (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') {
                if (this.state.vesselClassError === false &&
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
                    this.state.sumInsuredMethodError === false &&
                    // <--------------General------------->
                    this.state.boatingExperienceYearError === false &&
                    this.state.lossesErr === false &&
                    this.state.lossesDescribeError === false &&
                    this.state.convictedErr === false &&
                    this.state.convictedDescribeError === false &&
                    this.state.insuranceCanceledErr === false &&
                    this.state.insuranceCanceledDescribeError === false &&
                    this.state.damagedErr === false &&
                    this.state.damagedDescribeError === false &&
                    // <--------------Mooring------------->
                    this.state.mooringBoatRegError === false &&
                    this.state.mooringBoatMooredError === false &&
                    this.state.mooringTypeError === false &&
                    this.state.CruisingRangeError === false) {

                    isTabError1 = false;

                }
            }

            if (
                // <-------------Underwriting-------------->
                this.state.selectBinderError === false &&
                this.state.subBinderError === false &&
                this.state.departmentError === false &&
                this.state.sourceError === false &&
                this.state.thirdPartyLiabilityError === false &&
                this.state.sailRacingCoverageError === false &&
                this.state.racingEventTypeError === false &&
                this.state.crewLiabilityError === false &&
                this.state.excessError === false &&
                this.state.ratingTypeValueError === false &&
                this.state.inceptionDateError === false &&
                this.state.renewalDateError === false &&
                this.state.underWriterError === false &&
                this.state.grossError === false &&
                this.state.adminFeesError === false &&
                this.state.currentNCBYearsError === false) {

                isTabError2 = false;

            }
            var isAnyError = true;
            if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
                if (!isTabError2) {
                    isAnyError = false;
                }
            } else {
                if (!isTabError1 && !isTabError2) {
                    isAnyError = false;
                }
            }
            if (!isAnyError) {
                this.proceedPolicyDetails();
            }
            else {
                console.log("errror");
                if (this.state.vesselClassError) {
                    toast.error("[Vessel] Please select Vessel Class")
                    return;
                }
                if (this.state.vesselTypeError) {
                    toast.error("[Vessel] Please select Vessel Type")
                    return;
                }
                if (this.state.vesselBuildTypeError) {
                    toast.error("[Vessel] Please select Vessel Build Type")
                    return;
                }
                if (this.state.makeAndModelOfEngineError) {
                    toast.error("[Vessel] Please select Make And Model Of Engine ")
                    return;
                }
                if (this.state.vesselModelError) {
                    toast.error("[Vessel] Please select Vessel Model")
                    return;
                }
                if (this.state.vesselBuildYearError) {
                    toast.error("[Vessel] Please select Vessel Built Year")
                    return;
                }
                if (this.state.vesselLastSurveyDateError) {
                    toast.error("[Vessel] Please select Vessel Last Survey Date")
                    return;
                }
                if (this.state.vesselHullMaterialError) {
                    toast.error("[Vessel] Please select Vessel Hull Material")
                    return;
                }
                if (this.state.vesselPurchasePriceError) {
                    toast.error("[Vessel] Please select Vessel Purchase Price")
                    return;
                }
                if (this.state.vesselUseOfVesselError) {
                    toast.error("[Vessel] Please select Use Of Vessel")
                    return;
                }
                if (this.state.vesselLengthError) {
                    toast.error("[Vessel] Please select Vessel Length")
                    return;
                }
                if (this.state.vesselYearPurchasedError) {
                    toast.error("[Vessel] Please select Vessel Year Purchased")
                    return;
                }
                // if (this.state.mainEngineError) {
                //   toast.error("Please enter main engine")
                //   return;
                // }
                // if (this.state.mainEngineHpError) {
                //   toast.error("Please enter main engine HP")
                //   return;
                // }
                // if (this.state.mainEngineYearError) {
                //   toast.error("Please enter main engine year")
                //   return;
                // }
                // if (this.state.noOfEngineError) {
                //   toast.error("Please select No of main engine")
                //   return;
                // }
                // if (this.state.tarnsmissionMainEngineError) {
                //   toast.error("Please select main engine Tarnsmission")
                //   return;
                // }
                // if (this.state.maxSpeedError) {
                //   toast.error("Please enter max speed")
                //   return;
                // }
                if (this.state.sumInsuredMethodError) {
                    toast.error("[Vessel] Please select Sum Insured Method")
                    return;
                }
                // <-------------Underwriting-------------->

                if (this.state.selectBinderError) {
                    toast.error("[Underwritting] Please select Binder")
                    this.show("binder", true);
                    return;
                }

                if (this.state.subBinderError) {
                    toast.error("[Underwritting] Please select SubBinder")
                    this.show("subBinder", true);
                    return;
                }

                if (this.state.departmentError) {
                    toast.error("[Underwritting] Please select Department")
                    this.show("department", true);
                    return;
                }

                if (this.state.sourceError) {
                    toast.error("[Underwritting] Please select Source")
                    this.show("source", true);
                    return;
                }

                if (this.state.thirdPartyLiabilityError) {
                    toast.error("[Underwritting] Please select ThirdParty Liability Amount")
                    this.show("thirdPartyLiability", true);
                    return;
                }

                if (this.state.sailRacingCoverageError) {
                    toast.error("[Underwritting] Please select sailRacing Coverage")
                    this.show("sailRacingCoverage", true);
                    return;
                }

                if (this.state.racingEventTypeError) {
                    toast.error("[Underwritting] Please select Racing Event Type")
                    this.show("racingEventType", true);
                    return;
                }

                if (this.state.crewLiabilityError) {
                    toast.error("[Underwritting] Please select Crew Liability")
                    this.show("crewLiability", true);
                    return;
                }

                if (this.state.excessError) {
                    toast.error("[Underwritting] Please enter Excess Amount")
                    this.show("excess", true);
                    return;
                }

                if (this.state.ratingTypeValueError) {
                    toast.error("[Underwritting] Please enter RacingType Value")
                    this.show("ratingTypeValue", true);
                    return;
                }

                if (this.state.inceptionDateError) {
                    toast.error("[Underwritting] Please select Inception Date")
                    this.show("inceptionDate", true);
                    return;
                }
                if (this.state.renewalDateError) {
                    toast.error("[Underwritting] Please select Renewal Date")
                    this.show("renewalDate", true);
                    return;
                }

                if (this.state.underWriterError) {
                    toast.error("[Underwritting] Please enter UnderWriter Amount")
                    this.show("underWriter", true);
                    return;
                }

                if (this.state.grossError) {
                    toast.error("[Underwritting] Please enter Gross Value")
                    this.show("gross", true);
                    return;
                }

                if (this.state.adminFeesError) {
                    toast.error("[Underwritting] Please enter Admin Frees")
                    this.show("adminFees", true);
                    return;
                }

                if (this.state.currentNCBYearsError) {
                    toast.error("[Underwritting] Please select Current NCB Years")
                    this.show("currentNCBYears", true);
                    return;
                }
                // <-------------General-------------->

                if (this.state.boatingExperienceYearError === true) {
                    this.show('boatingExperienceYear', true);
                    toast.error("[General] Please select Boating Experience");
                    return;
                }

                if (this.state.lossesErr === true) {
                    this.show('losses', true);
                    toast.error("[General] Please select any losses in last 5 years.");
                    return;
                }

                if (this.state.lossesDescribeError === true) {
                    this.show('lossesDescribe', true);
                    toast.error("[General] Please enter description for losses in last 5 years.");
                    return;
                }

                if (this.state.convictedErr === true) {
                    this.show('convicted', true);
                    toast.error("[General] Please select is Convicted or Charged.");
                    return;
                }

                if (this.state.convictedDescribeError === true) {
                    this.show('convictedDescribe', true);
                    toast.error("[General] Please enter description for Convicted or Charged.");
                    return;
                }

                if (this.state.insuranceCanceledErr === true) {
                    this.show('insuranceCanceled', true);
                    toast.error("[General] Please select is Insurance cancelled or refused.");
                    return;
                }

                if (this.state.insuranceCanceledDescribeError === true) {
                    this.show('insuranceCanceledDescribe', true);
                    toast.error("[General] Please enter description for Insurance cancelled or refused.");
                    return;
                }

                if (this.state.damagedErr === true) {
                    toast.error("[General] Please select description Has the vessel ever been damaged?");
                    this.show('damaged', true);
                    return;
                }

                if (this.state.damagedDescribeError === true) {
                    this.show('damagedDescribe', true);
                    toast.error("[General] Please enter description for Has the vessel ever been damaged.");
                    return;
                }
                // <--------------Navigation------------->
                if (this.state.mooringBoatRegError != false) {
                    toast.error("[Navigation] Please select Where is the boat Registered")
                    return;
                }
                if (this.state.mooringBoatMooredError != false) {
                    toast.error("[Navigation] Please select Where is the boat Moored")
                    return;
                }
                if (this.state.mooringTypeError != false) {
                    toast.error("[Navigation] Please select Mooring Type")
                    return;
                }
                if (this.state.CruisingRangeError != false) {
                    toast.error("[Navigation] Please select Cruising Range")
                    return;
                }
            }
        } else {
            if (!(this.state.isNavigationalTotalEqual)) {
                document.getElementById("ItemisedBreakupErrorNav").style.display = "block";
                toast.error("[Vessel] Itemised Breakup of Navigational Equipment Doesn't match")
                return;
            }
            if (!(this.state.isSailsTotalEqual)) {
                document.getElementById("ItemisedBreakupErrorSail").style.display = "block";
                toast.error("[Vessel] Itemised Breakup of Sails, Canopy & Covers Doesn't match")
                return;
            }
        }
    }

    proceedPolicyDetails() {
        // Mid Term Adjustment / Mid Term Laid Up / Renewal / Quotation
        if (this.state.PolicyMode === "Mid Term Adjustment") {
            this.toggleMidTermPopup();
        } else if (this.state.PolicyMode === "Mid Term Laid Up") {
            this.toggleLaidUpPopup();
        } else if (this.state.PolicyMode === "Renewal") {
            this.savePolicyDetail();
        } else if (this.state.PolicyMode === "Quotation") {
            this.savePolicyDetail();
        } else {
            this.savePolicyDetail();
            // toast.error('Please select valid policy computation type.');
        }
    }

    toggleMidTermPopup() {
        this.setState({
            DefaultChargeAmount: (Number(this.state.PolicyChangeNetPremium) + Number(this.state.PolicyChangeLevy)).toFixed(2),
            DefaultChargeFee: this.state.MidTermAdjustmentFee,
            modelAction: 1,
            mtdFees: this.state.MidTermAdjustmentFee,
            actualAmount: (Number(this.state.PolicyChangeNetPremium) + Number(this.state.PolicyChangeLevy)).toFixed(2),
            Levy: this.state.PolicyChangeLevy,
            mtdFeesError: false,
            actualAmountError: false,
            newDuePayment: this.state.PolicyNewTotalDue,
            adjustmentDateError: false
        });
        this.calculateMTDTotal();
        this.calculateNewTotalDue();
        this.calculateDefaultTotal();

        var Increased = Number(this.state.PolicyNewTotalDue) > Number(this.state.PolicyCurrentTotalDue);
        var Decreased = Number(this.state.PolicyNewTotalDue) < Number(this.state.PolicyCurrentTotalDue);
        var Equal = Number(this.state.PolicyNewTotalDue) == Number(this.state.PolicyCurrentTotalDue);

        console.log("endMidTerm", Increased, Decreased, Equal);

        if (Increased) {
            this.setState({ transactionType: "Premium Increased" });
        } else if (Decreased) {
            this.setState({ transactionType: "Premium Reduced" });
        } else if (Equal) {
            this.setState({ transactionType: "Premium Unchanged" });
        }
        this.setState({ adjustmentPopup: true });

    }

    toggleLaidUpPopup() {
        this.setState({
            DefaultChargeAmount: (Number(this.state.PolicyChangeNetPremium) + Number(this.state.PolicyChangeLevy)).toFixed(2),
            DefaultChargeFee: this.state.MidTermAdjustmentFee,
            modelAction: 2,
            mtdFees: this.state.MidTermAdjustmentFee,
            actualAmount: (Number(this.state.PolicyChangeNetPremium) + Number(this.state.PolicyChangeLevy)).toFixed(2),
            Levy: this.state.PolicyChangeLevy,
            mtdFeesError: false,
            actualAmountError: false,
            newDuePayment: this.state.PolicyNewTotalDue,
            adjustmentDateError: false
        });
        this.calculateMTDTotal();
        this.calculateNewTotalDue();
        this.calculateDefaultTotal();

        var Increased = Number(this.state.PolicyNewTotalDue) > Number(this.state.PolicyCurrentTotalDue);
        var Decreased = Number(this.state.PolicyNewTotalDue) < Number(this.state.PolicyCurrentTotalDue);
        var Equal = Number(this.state.PolicyNewTotalDue) == Number(this.state.PolicyCurrentTotalDue);
        console.log('PolicyNewTotalDue', this.state.PolicyNewTotalDue);
        console.log('PolicyNewTotalDue PolicyCurrentTotalDue', this.state.PolicyCurrentTotalDue);
        console.log("endMidTerm", Increased, Decreased, Equal);

        if (Increased) {
            this.setState({ transactionType: "Premium Increased" });
        } else if (Decreased) {
            this.setState({ transactionType: "Premium Reduced" });
        } else if (Equal) {
            this.setState({ transactionType: "Premium Unchanged" });
        }

        this.setState({ adjustmentPopup: true });

    }

    savePolicyDetail() {

        var pData = {};
        pData.AllData = this.state.PolicyDynamicCalculationData;
        pData.ColumnKeys = this.state.columnKeys;
        pData.PolicyId = this.props.match.params.id;
        pData.LoggedInUserId = CommonConfig.loggedInUserId();

        if (this.state.PolicyMode == 'Mid Term Adjustment' || 'Mid Term Laid Up') {
            pData.adjustmentData = {
                PolicyId: this.props.match.params.id,
                DefaultChargeAmount: this.state.DefaultChargeAmount,
                DefaultChargeFee: this.state.DefaultChargeFee,
                ChargeFee: this.state.mtdFees,
                ChargeAmount: this.state.actualAmount,
                Levy: this.state.Levy,
                PremiumAfter: this.state.newDuePayment,
                Note: this.state.mtdNote,
                Currency: this.state.currency,
                AdjustmentType: this.state.transactionType,
                AdjustmentDate: this.state.adjustmentDate,
                PremiumBefore: this.state.paymentDue,
                Status: this.state.status,
                LanguageId: this.state.LanguageId,
                loggedInUserId: CommonConfig.loggedInUserId(),
                Difference: this.state.totalMtdCharges.toFixed(2),
                IsLaidUpAshore: this.state.isLaidAshore,
            }
        } else {
            pData.adjustmentData = {}
        }
        pData.PolicyMode = this.state.PolicyMode;

        api.post('api/savePolicyDetail', pData).then(res => {
            console.log('savePolicyDetail', res);
            if (res.success) {
                if (res.data.success) {

                    var pData2 = {
                        boatingQualificationsArr: this.state.boatingQualificationsArr,
                        BoatingQualificationsCount: this.state.boatingQualificationsArr.length,
                        PolicyId: this.props.match.params.id,
                        LoggedInUserId: CommonConfig.loggedInUserId(),
                        LanguageId: this.state.LanguageId,
                    }

                    api.post('api/saveBoatingQualification', pData2).then(result => {
                        console.log('saveBoatingQualification', result);
                        if (result.success) {
                            if (res.data.success) {

                                this.setState({ adjustmentPopup: false });
                                toast.success(res.data.message);
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);

                            } else {
                                toast.error(res.data.message);
                            }
                        }
                    });

                } else {
                    toast.error(res.data.message);
                }
            }
        });
    }

    cancelAdjustmentModel() {
        this.setState({
            adjustmentPopup: false,
            mtdFees: '',
            mtdNote: '',
            mtdNoteError: true,
            actualAmount: 0,
            adjustmentDate: moment().format('YYYY-MM-DD'),
        });
    }

    // Banner green button

    // Banner eye button

    showDynamicComputationDetails() {
        const data = {
            PolicyId: this.props.match.params.id,
            PolicyMidTermAdjustmentId: ''
        };

        api.post('api/showDynamicComputationDetails', data).then(res => {
            if (res.success) {
                this.setState({ dynamicComputationDetails: res.data[0][0].Html, showDynamicComputation: true });
            } else {

            }
        }).catch(err => {

        });
    }

    // Banner eye button

    // Banner expand button

    toggleCalculator() {
        this.setState({ dislpayCalculatorBody: !this.state.dislpayCalculatorBody });
    }

    // Banner expand button

    //------------ Tab --------------

    toggle(tabPane, tab, subTab) {
        if (tab === undefined || tab === '' || tab === null) {
            tab = '1';
        }
        if (subTab === undefined || subTab === '' || subTab === null) {
            if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
                subTab = '2';
            } else {
                subTab = '1';
            }
        }
        // const newArray = this.state.activeTab.slice();
        // newArray[tabPane] = tab
        this.setState({
            activeTab: tab,
            activeSubTab: subTab,
        });
        let policyId = this.props.match.params.id;
        this.props.history.push({
            pathname: '/PolicyDetailsMerged/' + policyId + '/' + tab + '/' + subTab,
            state: {
                id: policyId,
                tab: tab,
                subTab: subTab
            }
        });
    }

    initialToggle(tabPane, tab, subTab) {
        if (tab === undefined || tab === '' || tab === null) {
            tab = '1';
        }
        if (subTab === undefined || subTab === '' || subTab === null) {
            subTab = '1';
        }
        if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
            subTab = '2';
        }
        // const newArray = this.state.activeTab.slice();
        // newArray[tabPane] = tab;
        this.setState({
            activeTab: tab,
            activeSubTab: subTab,
        });
        let policyId = this.props.match.params.id;
        this.props.history.push({
            pathname: '/PolicyDetailsMerged/' + policyId + '/' + tab + '/' + subTab,
            state: {
                id: policyId,
                tab: tab,
                subTab: subTab
            }
        });
    }

    //------------ Tab --------------

    newClaim() {
        toast.success("Comming Soon...");
    }

    // edit policyDetails variables

    editLanguage() {
        this.setState({ changeLanguage: !this.state.changeLanguage });
    }

    editCurrency() {
        this.setState({ changeCurrency: !this.state.changeCurrency });
    }

    editCountry() {
        this.setState({ changeCountry: !this.state.changeCountry });
    }

    editPolicyType() {
        this.setState({ changePolicyType: !this.state.changePolicyType });
    }

    editState() {
        this.setState({ changeStage: !this.state.changeStage });
    }

    // edit policyDetails variables

    getDropDownValues(stringMapType, setStateName, orderby) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderby
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("getDropDownValues", res.data);
                    if (setStateName === 'boatingQualificationAllList') {
                        this.boatingQualificationListCopy = res.data;
                    } else {
                        this.setState({ [setStateName]: res.data });
                    }
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    showDynamicComputationPopup() {
        const data = {
            PolicyId: this.props.match.params.id,
            Option: this.state.PremiumType
        };

        api.post('api/showDynamicComputationPopup', data).then(res => {
            if (res.success) {
                this.setState({ dynamicComputationDetails: res.data[0][0].computationHTML, showDynamicComputation: true });
            } else {

            }
        }).catch(err => {

        });
    }

    getActiveReferralNotes() {
        try {
            const data = { EntityId: this.props.match.params.id };

            api.post(APIConstant.path.getActiveReferralNotes, data).then(res => {
                if (res.success) {

                    this.setState({
                        policyReferNotes: res.data
                    });
                } else {
                    console.log("else");
                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    // --------- Bind Policy -----------

    bindPolicy() {
        this.setState({ isBindPopup: true, bindDateError: false });
    }

    runBindPolicy() {

        if (this.state.bindDateError) {
            toast.error('Please enter Binder Date.');
            return false;
        }

        const data = {
            policyId: this.props.match.params.id,
            IsReferred: 0,
            bindDate: this.state.bindDate,
            CurrentUser: CommonConfig.loggedInUserId()
        };
        api.post('api/bindPolicy', data).then(res => {
            console.log("bindPolicy-i-i-i-i-i", res);
            if (res.success) {
                if (CommonConfig.isEmpty(res.data.returnValue)) {
                    toast.success("Policy was Bound Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    toast.error(res.data.returnValue);
                    // if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
                    //     setTimeout(() => {
                    //         window.location.reload();
                    //     }, 2000);
                    // }
                }
            } else {
                console.log('error');
            }
        }).catch(err => {
            console.log('error', err);
        });

        this.setState({ isBindPopup: false, bindDateError: false });
    }

    unBindPolicy() {
        this.setState({ isUnBindPopup: true });
    }

    runUnBindPolicy() {

        const data = {
            policyId: this.props.match.params.id,
            CurrentUser: CommonConfig.loggedInUserId()
        };
        api.post('api/unBindPolicy', data).then(res => {
            console.log("bindPolicy-i-i-i-i-i", res);
            if (res.success) {
                console.log('resunBindPolicy', res.data);
                if (CommonConfig.isEmpty(res.data.returnValue[0].returnValue)) {
                    this.setState({ isUnBindPopup: false });
                    toast.success("Policy was UnBound Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    this.setState({ isUnBindPopup: false });
                    toast.error(res.data.returnValue[0].returnValue);
                }
            } else {
                console.log('error');
            }
        }).catch(err => {
            console.log('error', err);
        });

    }

    cancelBindPolicy() {
        this.setState({ isBindPopup: false, bindDateError: false });
    }

    cancelUnBindPolicy() {
        this.setState({ isUnBindPopup: false });
    }
    // --------- Bind Policy -----------

    // --------- Cancel Policy -----------

    confirmCancelPolicy() {
        this.getCancelPolicyModelData();
    }

    getCancelPolicyModelData() {
        try {
            const data = {
                PolicyId: this.props.match.params.id
            };
            api.post(APIConstant.path.getCancelPolicyModelData, data).then(res => {
                console.log('response', res);
                if (res.success) {
                    this.setState({
                        // transactionType: 'Premium Increased',
                        policyNumber: res.data[0].policyNumber,
                        paymentDue: res.data[0].totalDue,
                        newDuePayment: res.data[0].newTotalDue,
                        DefaultChargeAmount: res.data[0].actualAmount,
                        actualAmount: res.data[0].actualAmount,
                        DefaultChargeFee: res.data[0].midTermAdjustmentFee,
                        mtdFees: res.data[0].midTermAdjustmentFee,
                        mtdFeesError: false,
                        actualAmountError: false,
                        adjustmentDateError: false
                    });
                    this.calculateMTDTotal();
                    this.calculateNewTotalDue();
                    this.calculateDefaultTotal();

                    var Increased = Number(this.state.newDuePayment) > Number(this.state.paymentDue);
                    var Decreased = Number(this.state.newDuePayment) < Number(this.state.paymentDue);
                    var Equal = Number(this.state.newDuePayment) == Number(this.state.paymentDue);

                    console.log("endMidTerm", Increased, Decreased, Equal);

                    if (Increased) {
                        this.setState({ transactionType: "Premium Increased" });
                    } else if (Decreased) {
                        this.setState({ transactionType: "Premium Reduced" });
                    } else if (Equal) {
                        this.setState({ transactionType: "Premium Unchanged" });
                    }
                    this.setState({ adjustmentPopup: true, modelAction: 3 });
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

    cancelPolicy() {

        const data = {
            PolicyId: this.props.match.params.id,
            MidTermId: this.state.MidTermId,
            ChargeAmount: this.state.actualAmount,
            ChargeFee: this.state.mtdFees,
            DefaultChargeAmount: this.state.DefaultChargeAmount,
            DefaultChargeFee: this.state.DefaultChargeFee,
            PremiumBefore: this.state.paymentDue,
            PremiumAfter: this.state.newDuePayment.toFixed(2),

            Currency: this.state.currency,
            AdjustmentType: this.state.transactionType,
            AdjustmentDate: this.state.adjustmentDate,
            Note: this.state.mtdNote,
            Levy: this.state.Levy,
            loggedInUserId: CommonConfig.loggedInUserId(),
            LanguageId: this.state.LanguageId,
            Difference: this.state.totalMtdCharges.toFixed(2),
        }
        console.log('cancelPolicy', data);
        api.post(APIConstant.path.cancelPolicy, data).then(res => {
            console.log('response', res);
            if (res.success) {
                if (CommonConfig.isEmpty(res.data.returnValue)) {
                    this.setState({ midTermModel: false })
                    toast.success("Policy was canceled Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    toast.error(res.data.returnValue);
                }
            } else {
                console.log(res);
                if (res.isDocumentGenerate == 0) {
                    this.setState({ midTermModel: false })
                    toast.error('Policy was Canceled Successfully *' + res.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        }).catch(err => {

        });
    }

    // --------- Cancel Policy -----------

    confirmRenewal() {

        var docData1 = {
            policyId: this.props.match.params.id,
            processType: 'ConfirmationOfRenewal',
            isDocumentGenerateAllow: 1
        }
        api.post('api/generateDocument', docData1).then(res => {

            if (res.success) {

                const data = {
                    policyId: this.props.match.params.id,
                    currentUser: CommonConfig.loggedInUserId()
                };
                api.post(APIConstant.path.confirmRenewal, data).then(res => {
                    console.log('confirmRenewal', res);
                    if (res.success) {
                        if (CommonConfig.isEmpty(res.data[0].returnValue)) {
                            toast.success("Renewal Confirmed Successfully");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                    } else {
                        console.log('error');
                    }
                }).catch(err => {

                });

            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            console.log("api/generateProcessDocument > Error");
        });
    }

    // --------- unConfirm Renewal -----------

    unConfirmRenewal() {
        this.setState({ isunConfirmPopup: true });
    }

    runUnConfirmRenewal() {
        const data = {
            policyId: this.props.match.params.id,
            CurrentUser: CommonConfig.loggedInUserId()
        };
        api.post('api/UnConfirmRenewal', data).then(res => {
            console.log("bindPolicy-i-i-i-i-i", res);
            if (res.success) {
                console.log('resrunUnConfirmRenewal', res.data.returnValue[0].returnValue);
                if (CommonConfig.isEmpty(res.data.returnValue[0].returnValue)) {
                    this.setState({ isunConfirmPopup: false });
                    toast.success("Policy was UnConfirmed Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    this.setState({ isunConfirmPopup: false });
                    toast.error(res.data.returnValue[0].returnValue);
                }
            } else {
                console.log('error');
            }
        }).catch(err => {
            console.log('error', err);
        });
    }

    cancelUnConfirmRenewal() {
        this.setState({ isunConfirmPopup: false });
    }

    // -------- Hide Summary Model ---------

    hideModel = (e) => {
        this.setState({ policySummaryDetails: '', showPolicySummary: false });
    }

    hideDynamicComputationDetailModel = (e) => {
        this.setState({ dynamicComputationDetails: '', showDynamicComputation: false });
    }

    // -------- Hide Summary Model ---------

    handleChangePolicyDetail = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'refrred') {

            if (e.target.checked) {
                this.setState({ refrred: e.target.checked, refrredError: false });
            } else {
                this.setState({ refrred: e.target.checked, refrredError: true });
            }
            var refer = (e.target.checked ? 1 : 0);
            let data = {
                policyId: this.props.match.params.id,
                CurrentUser: CommonConfig.loggedInUserId(),
                IsReffer: refer
            }
            api.post('api/alterReferralFlag', data).then(res => {
                if (res.success) {
                    this.setState({ refrred: res.data.returnValue });
                    window.location.reload();
                } else {
                    console.log('err');
                }
            }).catch(err => {
                console.log("error", err);
            });
        }

        if (e.target.name === 'bindDate') {
            console.log('bindDate');
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ bindDateError: true });
                this.show("bindDate", true, "bindDateError", "Please enter Bind Date");
            } else {
                this.setState({ bindDateError: false, bindDate: e.target.value });
                this.show("bindDate", false, "bindDateError", "");
            }
        }

        if (e.target.name === 'targetTotalDue') {

            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ targetTotalDueError: true });
                this.show("targetTotalDue", true, "targetTotalDueError", "Please enter Target Total Due.");
            } else {
                this.setState({ targetTotalDueError: false, targetTotalDue: e.target.value });
                this.show("targetTotalDue", false, "targetTotalDueError", "");
            }
        }

        if (e.target.name === 'mtdFees') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mtdFeesError: true });
                this.show("mtdFees", true);
            } else {
                if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                    this.setState({ mtdFeesError: true });
                    this.show("mtdFees", true);
                } else {
                    this.setState({ mtdFeesError: false, mtdFees: e.target.value });
                    this.show("mtdFees", false);
                }
            }
        }

        if (e.target.name === 'actualAmount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ actualAmountError: true });
                this.show("actualAmount", true);
            } else {
                if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                    this.setState({ actualAmountError: true });
                    this.show("actualAmount", true);
                } else {
                    this.setState({ actualAmountError: false, actualAmount: e.target.value });
                    this.show("actualAmount", false);
                }
            }
        }

        if (e.target.name === 'mtdNote') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mtdNoteError: true });
                this.show("mtdNote", true);
            } else {
                if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
                    this.setState({ mtdNoteError: true });
                    this.show("mtdNote", true);
                } else {
                    this.setState({ mtdNoteError: false, mtdNote: e.target.value });
                    this.show("mtdNote", false);
                }
            }
        }

        if (e.target.name === 'changeNote') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ changeNoteError: true });
            } else {
                if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
                    this.setState({ changeNoteError: true });
                } else {
                    this.setState({ changeNoteError: false, changeNote: e.target.value });
                }
            }
        }

        if (e.target.name === 'adjustmentDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ adjustmentDateError: true });
                this.show("adjustmentDate", true);
            } else {
                this.setState({ adjustmentDateError: false, adjustmentDate: e.target.value });
                this.show("adjustmentDate", false);
            }
        }

        this.calculateMTDTotal();
        this.calculateNewTotalDue();
    }

    // ----------- MTA Model Calculation -------------

    calculateDefaultTotal() {
        setTimeout(() => {
            var defaultTempTotal = 0;
            var defaultTempTotal = Number(this.state.DefaultChargeAmount) + Number(this.state.DefaultChargeFee);
            this.setState({ defaultTotal: defaultTempTotal.toFixed(2) })
        }, 1000)
    }

    calculateMTDTotal() {

        setTimeout(() => {
            var tempTotal = 0;
            var tempTotal = Number(this.state.actualAmount) + Number(this.state.mtdFees);
            this.setState({ totalMtdCharges: tempTotal });
            var newTotalDue = Number(this.state.PolicyCurrentTotalDue) + tempTotal;
            this.setState({ newDuePayment: newTotalDue });
        }, 1000)
    }

    calculateNewTotalDue() {

        setTimeout(() => {
            var newTotalDue = 0;
            var newTotalDue = Number(this.state.PolicyCurrentTotalDue) + Number(this.state.actualAmount) + Number(this.state.mtdFees);
            this.setState({ newDuePayment: newTotalDue });
        }, 1000);
    }

    // ----------- MTA Model Calculation -------------

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

    getPremiumPolicyType(country, isRefresh) {
        try {
            var PremiumStringMapType = '';
            if (country == 'Spain') {
                PremiumStringMapType = 'SPAINPREMIUMPOLICYTYPE';
            } else {
                PremiumStringMapType = 'PREMIUMPOLICYTYPE';
            }
            if (country == 'UK') {
                this.setState({ currency: 'GBP' })
            } else {
                this.setState({ currency: 'EUR' })
            }
            const data = {
                stringmaptype: PremiumStringMapType,
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    // console.log('this.state.country', this.state.country)
                    // let countryData = this.state.country == 'Spain' ? (res.data.filter(x => x.StringMapKey !== 'ThirdParty')) : (res.data.filter(x => x.StringMapKey !== 'Basica' && x.StringMapKey !== 'Extra'));

                    // console.log('this.state.country', countryData);

                    this.setState({ premiumPolicyTypeList: res.data });
                    if (isRefresh) {
                        this.setState({ country: country, changeCountry: false });
                        this.autoBinderByCountry(this.state.country);
                        this.getThirdPartyDD();
                    }
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    autoBinderByCountry(country) {
        try {
            const data = {
                PolicyId: this.props.match.params.id,
                Country: country,
                CurrentUser: CommonConfig.loggedInUserId()
            };
            console.log('autoBinderByCountry', data);
            api.post(APIConstant.path.autoBinderByCountry, data).then(res => {
                if (res.success) {
                    console.log('autoBinderByCountry', res);
                    const dataTwo = {
                        PolicyId: this.props.match.params.id,
                        type: 'country',
                        Country: country
                    };
                    api.post('api/changePolicyData', dataTwo).then(responce => {
                        if (responce.success) {
                            console.log('changePolicyData123', res.data.binderName);
                            this.setState({ binder: res.data.binderName })
                            this.changeBinder(res.data.binderName);
                            // setTimeout(() => {
                            //     window.location.reload();
                            // }, 200);
                        } else {
                        }
                    }).catch(err => {

                    });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    // Coverage Type change

    selectPremiumPolicyType(value) {
        if (value.value == 'Comprehensive') {
            this.setState({ premiumPolicyType: value.value, /*comprehensivePremiumPolicyType: true*/ });
        } else {
            this.setState({ premiumPolicyType: value.value, /*confirmPremiumPolicyType: true*/ });
        }
        this.saveRateableParam('premiumPolicyType', value.value)
    }

    resetPremiumPolicyType(premiumPolicyType) {
        if (premiumPolicyType == 'Comprehensive') {
            this.setState({ premiumPolicyType: this.state.defaultPremiumPolicyType, comprehensivePremiumPolicyType: false });
        } else {
            this.setState({ premiumPolicyType: this.state.defaultPremiumPolicyType, confirmPremiumPolicyType: false });
        }
    }

    setPremiumPolicyType() {
        const data = {
            PolicyId: this.props.match.params.id,
            PremiumPolicyType: this.state.premiumPolicyType,
            IsRenewal: this.state.isRenewal,
            CurrentUser: CommonConfig.loggedInUserId()
        };
        api.post(APIConstant.path.setPremiumPolicyType, data).then(res => {

            if (res.success) {
                if (CommonConfig.isEmpty(res.data.returnValue)) {
                    toast.success("Coverage Updated Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    toast.error(res.data.returnValue);
                }
            } else {
                console.log('error');
            }
        }).catch(err => {

        });
    }

    // Coverage Type change

    selectContainerType(value, type) {
        if (type === 'language') {
            // let languageData = this.state.languageList.filter((list) => {
            //     return list.LanguageId == value;
            // });
            this.setState({ language: value, changeLanguage: false });

            setTimeout(() => {
                this.changePolicyData(type);
            }, 200);
        }

        if (type === 'currency') {
            this.setState({ currency: value, changeCurrency: false });
            this.saveRateableParam('Currency', value);
        }

        if (type === 'policyType') {
            this.setState({ policyType: value, changePolicyType: false });
            this.saveRateableParam('PolicyType', value);
        }

        if (type === 'country') {
            this.setState({ country: value, changeCountry: false });
            // this.getPremiumPolicyType(value);
            this.saveRateableParam('Country', value);
        }
    }

    changePolicyData(type) {
        let data = '';
        if (type === 'language') {
            data = { PolicyId: this.props.match.params.id, type: type, DocLang: this.state.language };
        }

        if (type === 'currency') {
            data = { PolicyId: this.props.match.params.id, type: type, Currency: this.state.currency };
        }

        if (type === 'policyType') {
            data = { PolicyId: this.props.match.params.id, type: type, PolicyType: this.state.policyType };
        }

        if (type === 'country') {
            data = { PolicyId: this.props.match.params.id, type: type, country: this.state.country };
        }

        api.post('api/changePolicyData', data).then(res => {
            if (res.success) {
                console.log(res);
                // setTimeout(() => {
                // 	window.location.reload();
                // }, 300);
            } else {
            }
        }).catch(err => {

        });
    }

    // Policy count and redirect to list

    getPolicyCount = () => {
        let data = {
            id: this.state.contactEntityId,
            entityType: this.state.contactEntityType,
        }
        api.post('api/getUserPolicyList', data).then(res => {
            if (res.data.success) {
                this.setState({ contactPolicies: res.data.data.length });
            } else {
                console.log('err');
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    redirectToPolicyList = (e) => {
        this.props.history.push({
            pathname: '/PolicyList/' + this.state.contactEntityId + '/' + this.state.contactEntityType,
            state: {
                id: this.state.contactEntityId,
                entityType: this.state.contactEntityType
            }
        });
    }

    ChangePolicyStatus = (e) => {debugger

        let data = {
            policyId: this.props.match.params.id,
            Status: "Quotation",
            Stage: "Prospect",
        }
        console.log("data",data);
        api.post('api/ChangePolicyStatus', data).then(res => {
            if (res.success) {
                toast.success("Status update successfully.");
                window.location.reload();
            } else {
                console.log('err');
            }
        }).catch(err => {
            console.log("error", err);
        });

    }

    // Policy count and redirect to list

    // Create new policy

    redirectToNewPolicy = () => {
        this.props.history.push({
            pathname: '/CreatePolicy/' + this.state.contactEntityId,
            state: {
                id: this.state.contactEntityId
            }
        });
    }

    // Create new policy

    selectType(value, type) {
        if (type === 'language') {
            let languageData = this.state.languageList.filter((list) => {
                return list.LanguageId == value;
            });
            this.setState({ LanguageId: value, language: languageData[0].Language, changeLanguage: false });
        }
        if (type === 'currency') {
            this.setState({ currency: value, changeCurrency: false });
        }
        if (type === 'policyType') {
            this.setState({ policyType: value, changePolicyType: false });
        }
        if (type === 'PremiumType') {
            var IsRenewal = '';
            if (value == 'Current') {
                IsRenewal = 0;
            } else {
                IsRenewal = 1;
            }
            this.getPolicySummaryUpdated(value);
            this.setState({ isRenewal: IsRenewal, PremiumType: value });

        }
        if (type === 'country') {
            this.setState({ country: value, changeCountry: false });
        }

        if (type === 'referredTo') {
            this.setState({ referredTo: value });
        }

        setTimeout(() => {
            this.changePolicyData(type);
        }, 200);
    }

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

    // Calculate total due

    showTargetTotalDuePopup() {
        this.setState({ targetUnderWriterAmount: '', isTargetTotalDuePopup: true });
    }

    hideTargetTotalDuePopup() {
        this.setState({ isTargetTotalDuePopup: false, targetUnderWriterAmount: '' });
    }

    getUnderwriterAmount() {
        try {
            if (this.state.targetTotalDueError == false) {

                let data = {
                    PolicyId: this.props.match.params.id,
                    TargetAmount: this.state.targetTotalDue,
                    IsRenewal: this.state.isRenewal
                };
                api.post('api/getUnderwriterAmount', data).then(res => {
                    console.log("getUnderwriterAmount-----", res);
                    if (res.data[0].length) {
                        this.setState({ targetUnderWriterAmount: res.data[0][0].UnderwriterAmount });
                    } else {
                        console.log("error", res);
                    }
                }).catch(error => {
                    console.log("error", error);
                });
            } else {

            }
        } catch (error) {
            console.log("error", error);
        }
    }

    // Calculate total due

    saveMidTermModel() {
        if (
            this.state.mtdFeesError === false &&
            this.state.adjustmentDateError === false &&
            this.state.mtdNoteError === false
        ) {
            if (this.state.modelAction == 1) {
                this.savePolicyDetail();
            } else if (this.state.modelAction == 2) {
                this.savePolicyDetail();
            } else if (this.state.modelAction == 3) {
                this.cancelPolicy();
            }
        } else {
            if (this.state.actualAmountError != false) {
                toast.error("Please enter actual amount")
                return;
            }
            if (this.state.mtdFeesError != false) {
                toast.error("Please enter mid term adjutment fees")
                return;
            }
            if (this.state.adjustmentDateError != false) {
                toast.error("Please enter mid term adjutment date")
                return;
            }
            if (this.state.mtdNoteError != false) {
                toast.error("Please enter mid term adjutment note")
                return;
            }
        }
    }

    onRadioBtnClick(radioSelected) {
        console.log("onRadioBtnClick", radioSelected);
        this.setState({
            transactionType: radioSelected
        });
    }

    toggleForNoCharge(type) {
        const { t } = this.props;
        console.log("toggle", type);

        if (type == 'PremiumUnchanged') {
            this.setState({ mtdFees: 0, totalMtdCharges: 0, newDuePayment: this.state.paymentDue })
        }
    }


    // START ----- Vessel Functions ----
    handleChangeVessel = (e) => {
        let tab = 'Vessel';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        var columnKeys = this.state.columnKeys;
        PolicyDynamicCalculationData[tab + '.' + e.target.name] = e.target.value;
        columnKeys.push(tab + '.' + e.target.name);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

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

                        let tab = 'Vessel';
                        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
                        var columnKeys = this.state.columnKeys;
                        PolicyDynamicCalculationData[tab + '.' + 'vesselSurveyDueDate'] = surveyDueDate;
                        columnKeys.push(tab + '.' + 'vesselSurveyDueDate');
                        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

                        this.setState({ vesselSurveyDueDate: surveyDueDate, vesselSurveyDueDateError: false });
                    } else {
                        this.setState({ vesselSurveyDueDate: '', vesselSurveyDueDateError: true });
                    }
                }
            }
        }

        if (e.target.name === 'vesselLastSurveyDate') {

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

                let tab = 'Vessel';
                let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
                var columnKeys = this.state.columnKeys;
                PolicyDynamicCalculationData[tab + '.' + 'vesselSurveyDueDate'] = SurveyDueDate;
                columnKeys.push(tab + '.' + 'vesselSurveyDueDate');
                this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

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
                if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount)) || (this.state.NavigationalEquipmentTotal == Number(e.target.value))) {
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
                if (!decimalRegExp.test(e.target.value) || (Number(e.target.value) > Number(this.state.maxPolicyAmount)) || (Number(e.target.value) == this.state.SailsTotal)) {
                    this.setState({ sumInsuredSailsError: true, isSailsTotalEqual: true });
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

        if (e.target.name === 'hullInboardMachine' || e.target.name === 'tenderDinghy' || e.target.name === 'lifeRaft' || e.target.name === 'outboard1' || e.target.name === 'outboard2' || e.target.name === 'roadTrailer' || e.target.name === 'personalEffects' || e.target.name === 'navigationalEquip' || e.target.name === 'sumInsuredSails' || e.target.name === 'portableGenerator' || e.target.name === 'customCoverage') {
            this.calculateSumInsured(false);
        }
        this.calculateNavigationalEquipment();
        this.calculatePersonalEffects();
        this.calculateSailsCanopyCovers();
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

    getVesselTypeRes(value) {
        let SelectedVesselType = this.state.vesselTypeRes.find(x => x.VesselTypeId === value.value);
        this.saveRateableParam('VesselTypeId', SelectedVesselType.VesselTypeId);
    }

    async selectVesselClass(value, type) {
        console.log('PolicyDynamicCalculationData', this.state.PolicyDynamicCalculationData);

        let tab = 'Vessel';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        if (value === '' || value === undefined || value === null) {
            PolicyDynamicCalculationData[tab + '.' + type] = '';
        } else {
            PolicyDynamicCalculationData[tab + '.' + type] = value.value;
        }
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + type);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (type === 'vesselClass') {

            if (value === '' || value === undefined || value === null) {
                this.setState({ vesselClassError: true, vesselClass: value, vesselTypeList: [] });
                this.show("", true, "vesselClassError", "Please select Vessel Class");
            } else {
                this.setState({ vesselClassError: false, vesselClass: value.value, VesselClassName: value.label });
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
                setTimeout(() => {
                    this.conditionalFieldUnderwriting(1);
                }, 2000);
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
                this.setState({ vesselTypeError: false, vesselType: value.value, VesselTypeName: value.label });
                this.getVesselTypeRes(value);
                setTimeout(() => {
                    this.conditionalFieldUnderwriting(1);
                }, 2000);
                this.show("vesselType", false, "vesselTypeError", "");
            }
        }
        this.getSurveyDataVisible()
    }

    async selectTypeVessel(value, type) {
        let tab = 'Vessel';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + type] = value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + type);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (type === 'vesselClass') {

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
	    // var vesselUseOfVesselName = this.state.UseofVesselList.filter(e => e.StringMapKey === value);
            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselUseOfVesselError: true, vesselUseOfVessel: value });
                this.show('vesselUseOfVessel', true);
            } else {
                this.setState({ vesselUseOfVesselError: false, vesselUseOfVessel: value });
                this.show('vesselUseOfVessel', false);
            }
        }

        if (type === 'vesselBuildType') {
	// var vesselBuildName = this.state.vesselBuildTypearr.filter(e => e.StringMapKey === value);
            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselBuildTypeError: true, vesselBuildType: value });
                this.show('vesselBuildType', true);
            } else {
                this.setState({ vesselBuildTypeError: false, vesselBuildType: value });
                this.show('vesselBuildType', false);
                this.saveRateableParam('BuildType', value);
            }
        }

        if (type === 'vesselHullMaterial') {
		// var vesselHullMaterialName = this.state.vesselHullMaterialarr.filter(e => e.StringMapKey === value); 
            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselHullMaterialError: true, vesselHullMaterial: value });
                this.show('vesselHullMaterial', true);
            } else {
                this.setState({ vesselHullMaterialError: false, vesselHullMaterial: value });
                this.show('vesselHullMaterial', false);
                this.saveRateableParam('HullMaterial', value);
            }
        }

        if (type === 'noOfEngine') {
		// var noOfEngineName = this.state.noOfEnginearr.filter(e => e.StringMapKey === value); 
            if (CommonConfig.isEmpty(value)) {
                this.setState({ noOfEngineError: true, noOfEngine: value });
                this.show('noOfEngine', true);
            } else {
                // this.setState({ noOfEngineError: false, noOfEngine: value , noOfEngineName:noOfEngineName[0].StringMapName });
                this.setState({ noOfEngineError: false, noOfEngine: value });
                this.show('noOfEngine', false);
            }
        }

        if (type === 'tarnsmissionMainEngine') {
		// var  tarnsmissionMainEngineName = this.state. tarnsmissionMainEnginearr.filter(e => e.StringMapKey === value); 
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

                    var isVesselTypeCheck = formattedData.find(x => x.value === this.state.vesselType);
                    this.setState({ vesselTypeList: formattedData, vesselTypeRes: res.data, vesselTypeError: (isVesselTypeCheck) ? false : true });

                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    calculateSumInsured(isSystem) {
        setTimeout(() => {
            var SumInsuredValue = 0;
            var SumInsuredValue = Number(this.state.hullInboardMachine) + Number(this.state.tenderDinghy) + Number(this.state.lifeRaft) + Number(this.state.outboard1) + Number(this.state.outboard2) + Number(this.state.roadTrailer) + Number(this.state.personalEffects) + Number(this.state.navigationalEquip) + Number(this.state.sumInsuredSails) + Number(this.state.portableGenerator) + Number(this.state.customCoverage);

            this.setState({ totalSumInsuredValue: SumInsuredValue });
            // this.saveRateableParam('SumInsured', SumInsuredValue);
            if (isSystem) {
                this.setState({ systemTotalSumInsuredValue: SumInsuredValue });
            }

        }, 100);
    }

    calculateSumInsuredOnBlur() {
        setTimeout(() => {
            document.getElementById("ItemisedBreakupErrorNav").style.display = "none";
            document.getElementById("ItemisedBreakupErrorSail").style.display = "none";

            if (Number(this.state.navigationalEquip) !== Number(this.state.NavigationalEquipmentTotal)) {
                document.getElementById("ItemisedBreakupErrorNav").style.display = "block";
                return true;
            } else if (Number(this.state.sumInsuredSails) !== Number(this.state.SailsTotal)) {
                document.getElementById("ItemisedBreakupErrorSail").style.display = "block";
                return true;
            } else if (Number(this.state.systemTotalSumInsuredValue) === Number(this.state.totalSumInsuredValue)) {
                return true;
            } else {
                this.saveRateableParam('SumInsured', this.state.totalSumInsuredValue);
                this.setState({ systemTotalSumInsuredValue: this.state.totalSumInsuredValue });
            }
        }, 100);
    }

    calculateNavigationalEquipment() {
        setTimeout(() => {
            var NavigationalEquipment = 0;
            var NavigationalEquipment = Number(this.state.navigationalEquipmentRadarValue) + Number(this.state.navigationalEquipmentSonarValue) + Number(this.state.navigationalEquipmentGPSValue) + Number(this.state.navigationalEquipmentPlotterValue) + Number(this.state.navigationalEquipmentCombinedEquipmentValue) + Number(this.state.navigationalEquipmentVHFValue) + Number(this.state.navigationalEquipmentRadioBeaconValue) + Number(this.state.navigationalEquipmentAutoPilotValue) + Number(this.state.navigationalEquipmentBLUValue) + Number(this.state.navigationalEquipmentSlideValue) + Number(this.state.navigationalEquipmentWindEquipmentValue) + Number(this.state.navigationalTridataValue) + Number(this.state.navigationalOthers01Value) + Number(this.state.navigationalOthers02Value) + Number(this.state.navigationalOthers03Value) + Number(this.state.navigationalOthers04Value);

            this.setState({ NavigationalEquipmentTotal: NavigationalEquipment });
        }, 100);
    }

    calculatePersonalEffects() {
        setTimeout(() => {
            var PersonalEffects = 0;
            var PersonalEffects = Number(this.state.PersonalEffectsTVValue) + Number(this.state.PersonalEffectsMusicEquipmentValue) + Number(this.state.PersonalEffectsOthers01Value) + Number(this.state.PersonalEffectsOthers02Value) + Number(this.state.PersonalEffectsOthers03Value) + Number(this.state.PersonalEffectsOthers04Value) + Number(this.state.PersonalEffectsOthers05Value) + Number(this.state.PersonalEffectsOthers06Value) + Number(this.state.PersonalEffectsOthers07Value) + Number(this.state.PersonalEffectsOthers08Value) + Number(this.state.PersonalEffectsOthers09Value) + Number(this.state.PersonalEffectsOthers10Value) + Number(this.state.PersonalEffectsOthers11Value) + Number(this.state.PersonalEffectsOthers12Value) + Number(this.state.PersonalEffectsOthers13Value);

            this.setState({ PersonalEffectsTotal: PersonalEffects });
        }, 100);
    }

    calculateSailsCanopyCovers() {
        setTimeout(() => {
            var sailsCanopyCovers = 0;
            var sailsCanopyCovers = Number(this.state.Bimini) + Number(this.state.Canopy) + Number(this.state.boatCovers);

            this.setState({ SailsTotal: sailsCanopyCovers })
        }, 100);
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

    editVessel(task) {
        if (task == "view") {
            this.setState({ isVesselEdit: false });
        } else {
            this.setState({ isVesselEdit: true });
        }
    }

    editVesselClassType(task) {
        if (task == "view") {
            this.setState({ isEditClassType: false });
        } else {
            this.setState({ isEditClassType: true });
            this.selectTypeVessel(this.state.defaultVesselClass, 'vesselClass');
        }
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
        if (document.getElementById("ItemisedBreakupErrorSail")) {
            if (document.getElementById("ItemisedBreakupErrorSail").style.display == "block") {
                if (this.state.sumInsuredSails == this.state.SailsTotal) {
                    document.getElementById("ItemisedBreakupErrorSail").style.display = "none";
                    this.saveRateableParam('SumInsured', this.state.totalSumInsuredValue);
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

        if (document.getElementById("ItemisedBreakupErrorNav")) {
            if (document.getElementById("ItemisedBreakupErrorNav").style.display == "block") {
                if (this.state.NavigationalEquipmentTotal == this.state.navigationalEquip) {
                    document.getElementById("ItemisedBreakupErrorNav").style.display = "none";
                    this.saveRateableParam('SumInsured', this.state.totalSumInsuredValue);

                }
            }
        }
        this.setState({ toggleModalAdd: false })
    }
    // END ----- Vessel Functions ----


    // START ----- Underwriting Functions ----

    /* START ----- Underwriting Functions ---- */
    conditionalFieldUnderwriting(isChange) {

        // this.resetConditionalFields();

        if (isChange) {
            // this.saveRateableParam('waterSkiingLiabilityAmount', 0);
            // this.saveRateableParam('waterToysLiabilityAmount', 0);
            // this.saveRateableParam('SailRacingCoverageAmount', 0);
            // this.saveRateableParam('RacingEventType', '');
            // this.saveRateableParam('crewLiability', '');
            this.setState({ waterSkiingLiability: '', isWaterSkiing: 0, waterToysLiability: '', isWaterToys: 0, isSailRacing: '', sailRacingCoverage: 0, crewLiability: '', racingEventType: '', racingEventTypeError: false, crewLiabilityError: false });
        }

        let vesselClass = this.state.VesselClassName

        let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(vesselClass);
        this.setState({
            DisplayWater: DisplayCondition.displayWater,
            DisplayRacing: DisplayCondition.displayRacing,
            DisplayCrew: DisplayCondition.displayCrew
        })

        if (vesselClass == 'Yacht' || vesselClass == 'Vela' || vesselClass == 'Personal Watercraft') {

            let vesselType = this.state.VesselTypeName
            console.log('vesselType', vesselType);
            let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(vesselType);
            this.setState({
                DisplayWater: DisplayCondition.displayWater,
                DisplayRacing: DisplayCondition.displayRacing,
                DisplayCrew: DisplayCondition.displayCrew
            })
        }
        if (isChange) {
            if (DisplayCondition.displayWater) {
                toast.info('Please check Water Liability fields [Underwriting]');
            } else if (DisplayCondition.displayRacing) {
                toast.info('Please check Racing Liability fields [Underwriting]');
                this.setState({ racingEventTypeError: true })
            } else if (DisplayCondition.displayCrew) {
                toast.info('Please check Crew Liability fields [Underwriting]');
                this.setState({ crewLiabilityError: true })
            }
        }
    }

    resetConditionalFields() {
        this.saveRateableParam('waterSkiingLiabilityAmount', 0);
        this.saveRateableParam('waterToysLiabilityAmount', 0);
        this.saveRateableParam('SailRacingCoverageAmount', 0);
        this.saveRateableParam('RacingEventType', '');
        this.saveRateableParam('crewLiability', '');
        this.setState({ waterSkiingLiability: '', isWaterSkiing: 0, waterToysLiability: '', isWaterToys: 0, isSailRacing: '', sailRacingCoverage: 0, crewLiability: '', RacingEventType: '', racingEventTypeError: false, crewLiabilityError: true });
    }

    getOrganazationData(ContactType) {
        try {
            let data = { ContactType: ContactType };
            api.post('api/getOrganazationData', data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].OrganizationName,
                            value: res.data[i].OrganizationId,
                        })
                    }
                    this.setState({ sourceList: formattedData });
                } else {
                    console.log('getOrganazationData_error');
                }
            }).catch(err => {
                console.log('getOrganazationData', err);
            });
        } catch (error) {
            console.log('getOrganazationData', error);
        }
    }

    getWaterSkiiAndWaterToys() {
        api.post('api/getWaterSkiiAndWaterToys').then(res => {
            if (res.success) {
                this.setState({ waterSkiingLiabilityAmount: res.data[0].WaterSkiingLiability, waterToysLiabilityAmount: res.data[0].WaterToysLiabiility });

                if (this.state.isWaterSkiing) {
                    this.setState({ waterSkiingLiability: res.data[0].WaterSkiingLiability });
                }
                if (this.state.isWaterToys) {
                    this.setState({ waterToysLiability: res.data[0].WaterToysLiabiility });
                }
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    toggleAllUnderwriting = (toggleType) => {
        this.setState({
            showRatingExcess: (toggleType === 'expand') ? true : false,
            showLimitsAdditionalCoverCommissionFeesandLevy: (toggleType === 'expand') ? true : false,
            showPolicyOptionsAdjustments: (toggleType === 'expand') ? true : false,
            showPolicyDates: (toggleType === 'expand') ? true : false,
            isUnderwrittingExpand: (toggleType === 'expand') ? true : false
        });
    }

    toggleUnderwriting = (type) => {
        if (type === 'PolicyDates') {
            this.setState({
                showPolicyDates: !this.state.showPolicyDates,
                showPolicyOptionsAdjustments: (this.state.isUnderwrittingExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isUnderwrittingExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: (this.state.isUnderwrittingExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'PolicyOptionsAdjustments') {
            this.setState({
                showPolicyDates: (this.state.isUnderwrittingExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: !this.state.showPolicyOptionsAdjustments,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isUnderwrittingExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: (this.state.isUnderwrittingExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'LimitsAdditionalCoverCommissionFeesandLevy') {
            this.setState({
                showPolicyDates: (this.state.isUnderwrittingExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: (this.state.isUnderwrittingExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: !this.state.showLimitsAdditionalCoverCommissionFeesandLevy,
                showRatingExcess: (this.state.isUnderwrittingExpand) ? this.state.showRatingExcess : false,
            })
        } else if (type === 'RatingExcess') {
            this.setState({
                showPolicyDates: (this.state.isUnderwrittingExpand) ? this.state.showPolicyDates : false,
                showPolicyOptionsAdjustments: (this.state.isUnderwrittingExpand) ? this.state.showPolicyOptionsAdjustments : false,
                showLimitsAdditionalCoverCommissionFeesandLevy: (this.state.isUnderwrittingExpand) ? this.state.showLimitsAdditionalCoverCommissionFeesandLevy : false,
                showRatingExcess: !this.state.showRatingExcess,
            })
        }
    }

    editUnderwriting(task) {
        if (task === 'view') {
            this.setState({ isUnderwritingEdit: false })
        } else {
            // let inceptionDate = moment(this.state.inceptionDate, CommonConfig.dateFormat.dateOnly).format('YYYY-MM-DD');
            // // let date = new Date(inceptionDate);
            // let date = moment(inceptionDate).toISOString();
            this.setState({ isUnderwritingEdit: true, });//inceptionDate: (this.state.inceptionDate === '') ? new Date() :  new Date(date) });
        }
    }

    changeBinder(value) {

        console.log("changeBinder >", value);
        if (CommonConfig.isEmpty(value)) {
            this.setState({ selectBinderError: true, binder: value });
            this.show('binder', true);
        } else {
            this.setState({ selectBinderError: false, binder: value });
            this.show('binder', false);
            this.saveRateableParam('BinderId', value);
            let results = this.state.binders.filter((binderdata) => {
                var binderUMRN = binderdata.UMRN;
                return binderUMRN == value;
            });
            if (results.length > 0) {
                this.getSubBinderData(value);
                var totalgross = (results[0].GrossCommission * this.state.PolicyCurrentPremium) / 100;
                var balance = results[0].GrossCommission + this.state.agency;
                var balanceTotal = parseFloat(totalgross) + parseFloat(this.state.agencyTotal);
                this.setState({ insuranceComapny: results[0].InsuranceCompanyName, gross: results[0].GrossCommission, /*subBinders: results[0].subBinderData,*/ adminFees: results[0].adminFees, totalgross: totalgross, balance: balance, balanceTotal: balanceTotal.toFixed(2) })

                let tab = 'Underwriting';
                let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
                PolicyDynamicCalculationData[tab + '.BinderId'] = results[0].BinderId;
                PolicyDynamicCalculationData[tab + '.InsuranceCompanyId'] = results[0].InsuranceCompanyId;
                var columnKeys = this.state.columnKeys;
                columnKeys.push(tab + '.BinderId');
                columnKeys.push(tab + '.InsuranceCompanyId');
                this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });
            }


        }
    }

    changesubBinder(value) {

        if (CommonConfig.isEmpty(value)) {
            this.setState({ subBinderError: true, subBinder: value, departmentDisable: false,  sourceDisable: false });
            this.show('subBinder', true);
        } else {
            this.setState({ subBinderError: false, subBinder: value });
            let results = this.state.subBinders.filter((subbinderdata) => {
                var subBinderTitle = subbinderdata.Title;
                return subBinderTitle == value;
            });
            if (results.length > 0) {
                console.log("results",results);
                this.setState({ department: results[0].Type, source: results[0].EntityId, sourceName: results[0].EntityType, departmentDisable: true ,sourceDisable: true });

                let tab = 'Underwriting';
                let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
                PolicyDynamicCalculationData[tab + '.SubBinderId'] = results[0].SubBinderId;
                var columnKeys = this.state.columnKeys;
                columnKeys.push(tab + '.SubBinderId');
                this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });
            }
        }
    }

    getSubBinderData(data) {
        try {
            api.post('api/getSubBinderData', data).then(res => {
                if (res.success) {
                    this.setState({ subBinders: res.data });
                } else {
                    console.log('getBinderData_error');
                }
            }).catch(err => {
                console.log('getBinderData_error', err);
            });
        } catch (error) {
            console.log('getBinderData_error', error);
        }
    }

    suggestBinder(event) {
        let results = this.state.binders.filter((binderdata) => {
            var binderUMRN = binderdata.UMRN;
            return binderUMRN.toLowerCase().startsWith(event.query.toLowerCase());
        });
        var binderresult = [];
        results.forEach(res => {
            binderresult.push(res.UMRN);
        });
        this.setState({ binderSuggestions: binderresult });
    }

    suggestsubBinder(event) {
        let results = this.state.subBinders.filter((subBinder) => {
            var subBinderTitle = subBinder.Title;
            return subBinderTitle.toLowerCase().startsWith(event.query.toLowerCase());
        });
        var subBinderresult = [];
        results.forEach(res => {
            subBinderresult.push(res.Title);
        });
        this.setState({ subbinderSuggestions: subBinderresult });
    }

    selectTypeUnderwriting(value, type) {
        console.log('selectTypeUnderwriting', value)
        let tab = 'Underwriting';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + type] = value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + type);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (type === 'department') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ departmentError: true, department: value });
                this.show('department', true);
            } else {
                this.setState({ departmentError: false, department: value });
                this.show('department', false);
                // this.saveRateableParam('Department', value);
                if (value === 'ServiceCenter' || value === 'SubAgent') {
                    this.setState({ sourceDisplay: true, sourceError: true })
                    this.getOrganazationData(value)
                } else {
                    this.setState({ sourceDisplay: false, source: '', sourceError: false, sourceList: [] });
                    this.show('source', false);
                }
            }
        }

        if (type === 'source') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ sourceError: true, source: value });
                this.show('source', true);
            } else {

                this.setState({ sourceError: false, source: value });
                this.show('source', false);
            }
        }

        if (type === 'awaitingDocuments') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ awaitingDocumentsError: true, awaitingDocuments: value });
                this.show('awaitingDocuments', true);
            } else {
                this.setState({ awaitingDocumentsError: false, awaitingDocuments: value });
                this.show('awaitingDocuments', false);
            }
        }

        if (type === 'premiumCredits') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ premiumCreditsError: true, premiumCredits: value });
                this.show('premiumCredits', true);
            } else {
                this.setState({ premiumCreditsError: false, premiumCredits: value });
                this.show('premiumCredits', false);
            }
        }

        if (type === 'thirdPartyLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ thirdPartyLiabilityError: true, thirdPartyLiability: value });
                this.show('thirdPartyLiability', true);
            } else {
                this.setState({ thirdPartyLiabilityError: false, thirdPartyLiability: value });
                this.show('thirdPartyLiability', false);
                this.saveRateableParam('ThirdPartyLiabilityAmount', value);
            }
        }

        if (type === 'racingEventType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ racingEventTypeError: true, racingEventType: value });
                this.show('racingEventType', true);
            } else {
                this.setState({ racingEventTypeError: false, racingEventType: value });
                this.show('racingEventType', false);
                this.saveRateableParam('RacingEventType', value);
            }
        }

        if (type === 'crewLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ crewLiabilityError: true, crewLiability: value });
                this.show('crewLiability', true);
            } else {
                this.setState({ crewLiabilityError: false, crewLiability: value });
                this.show('crewLiability', false);
                this.saveRateableParam('crewLiability', value);
            }
        }

        if (type === 'governmentLavys') {
            this.setState({ governmentLavys: value });
            if (value == "DEFAULT") {
                let premium = this.state.currentPremium;
                if (this.state.policyStatus == "Active") {
                    premium = (this.state.renewalPremium == null) ? 0 : this.state.renewalPremium;
                }
                let governmentLavysAmount = (parseFloat(this.state.governmentLavysPercent) * parseFloat(premium)) / 100;
                this.setState({ governmentLavysAmount: governmentLavysAmount.toFixed(2) });
            } else if (value == "CUSTOM") {
                this.setState({ governmentLavysAmount: 0 });
            }
            this.saveRateableParam('LevyType', value);
            this.saveRateableParam('LevyAbsolute', 0);
        }

        if (type === 'currentNCBYears') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ currentNCBYearsError: true, currentNCBYears: value });
                this.show('currentNCBYears', true);
            } else {
                this.setState({ currentNCBYearsError: false, currentNCBYears: value });
                this.show('currentNCBYears', false);
                this.saveRateableParam('CurrentNCBYear', value);
            }
        }
    }

    handleCheckboxUnderwriting = (e) => {

        if (e.target.name === 'isWaterSkiing') {

            let tab = 'Underwriting';
            let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
            PolicyDynamicCalculationData[tab + '.' + 'waterSkiingLiability'] = ((e.target.checked == true) ? this.state.waterSkiingLiabilityAmount : '');
            var columnKeys = this.state.columnKeys;
            columnKeys.push(tab + '.' + 'waterSkiingLiability');
            console.log('PolicyDynamicCalculationData', PolicyDynamicCalculationData);

            this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });
            this.saveRateableParam('waterSkiingLiabilityAmount', e.target.checked ? 1 : 0);

            if (e.target.checked == true) {
                this.setState({ waterSkiingLiability: this.state.waterSkiingLiabilityAmount });
            } else {
                this.setState({ waterSkiingLiability: '' });
            }
            this.setState({ isWaterSkiing: e.target.checked });
        }

        if (e.target.name === 'isWaterToys') {

            let tab = 'Underwriting';
            let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
            PolicyDynamicCalculationData[tab + '.' + 'waterToysLiability'] = ((e.target.checked == true) ? this.state.waterToysLiabilityAmount : '');
            var columnKeys = this.state.columnKeys;
            columnKeys.push(tab + '.' + 'waterToysLiability');
            console.log('PolicyDynamicCalculationData', PolicyDynamicCalculationData);

            this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });
            this.saveRateableParam('waterToysLiabilityAmount', e.target.checked ? 1 : 0);

            if (e.target.checked == true) {
                this.setState({ waterToysLiability: this.state.waterToysLiabilityAmount });
            } else {
                this.setState({ waterToysLiability: '' });
            }
            this.setState({ isWaterToys: e.target.checked });
        }

        if (e.target.name === 'isSailRacing') {

            let tab = 'Underwriting';
            let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
            PolicyDynamicCalculationData[tab + '.' + 'sailRacingCoverage'] = ((e.target.checked == true) ? this.state.sailRacingCoverageAmount : '');
            var columnKeys = this.state.columnKeys;
            columnKeys.push(tab + '.' + 'sailRacingCoverage');
            console.log('PolicyDynamicCalculationData', PolicyDynamicCalculationData);

            this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

            if (e.target.checked == true) {
                this.setState({ sailRacingCoverage: this.state.sailRacingCoverageAmount });
            } else {
                this.setState({ sailRacingCoverage: '' });
                this.saveRateableParam('SailRacingCoverageAmount', '');
            }
            this.setState({ isSailRacing: e.target.checked });
        }
    }

    handleChangeUnderwriting = (e) => {
        let tab = 'Underwriting';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + e.target.name] = e.target.value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + e.target.name);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === "inceptionDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ inceptionDateError: true });
                this.show("inceptionDate", true, "inceptionDateError", "Please enter Inception Date");
            }
            // else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
            //     this.setState({ inceptionDateError: true });
            //     this.show("inceptionDate", true, "inceptionDateError", "Please enter valid Inception Date");
            // } 
            else {

                let RenewalDate = moment(e.target.value).add(365, 'days').format('YYYY-MM-DD');

                console.log('inceptionDate', e.target.value);
                console.log('renewalDate', RenewalDate);

                let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
                PolicyDynamicCalculationData[tab + '.' + 'renewalDate'] = RenewalDate;
                var columnKeys = this.state.columnKeys;
                columnKeys.push(tab + '.' + 'renewalDate');
                this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

                this.setState({ inceptionDateError: false, inceptionDate: e.target.value, renewalDate: RenewalDate, renewalDateError: false });
                this.show("inceptionDate", false, "inceptionDateError", "");
            }
        }

        if (e.target.name === "renewalDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ renewalDateError: true });
                this.show("renewalDate", true, "renewalDateError", "Please enter Renewal Date");
            } else {
                this.setState({ renewalDateError: false, renewalDate: e.target.value });
                this.show("renewalDate", false, "renewalDateError", "");
            }
        }

        if (e.target.name === "lastBindDate") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ lastBindDateError: true });
                this.show("lastBindDate", true, "lastBindDateError", "Please enter Last Bind Date");
            } else {
                this.setState({ lastBindDateError: false, lastBindDate: e.target.value });
                this.show("lastBindDate", false, "lastBindDateError", "");
            }
        }

        if (e.target.name === 'note') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ noteError: false, note: e.target.value });
                this.show("note", false);
            } else {
                if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value) || e.target.value.length > 200) {
                    this.setState({ noteError: true });
                    this.show("note", true);
                } else {
                    this.setState({ noteError: false, note: e.target.value });
                    this.show("note", false);
                }
            }
        }

        if (e.target.name === 'sailRacingCoverage') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', true);
            } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
                this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', true);
            } else {
                this.setState({ sailRacingCoverageError: false, sailRacingCoverage: e.target.value });
                this.show('sailRacingCoverage', false);
            }
        }

        if (e.target.name === 'gross') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.percentage.test(e.target.value) || e.target.value > 100) {
                this.setState({ GrossError: true });
                this.show("gross", true);
            }
            else {
                this.setState({ GrossError: false, gross: e.target.value });
                this.show("gross", false);
            }
        }

        /*if (e.target.name === 'governmentLavysPercent') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.percentage.test(e.target.value)) {
                this.setState({ governmentLavysPercentError: true });
                this.show("governmentLavysPercent", true);
            } else {
                this.setState({ governmentLavysPercentError: false, governmentLavysPercent: e.target.value });
                this.show("governmentLavysPercent", false);
            }
        }*/

        // if (e.target.name === 'excess') {
        //     if (CommonConfig.isEmpty(e.target.value)) {
        //         this.setState({ excessError: true, excess: e.target.value });
        //         this.show('excess', true);
        //     } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
        //         this.setState({ excessError: true, excess: e.target.value });
        //         this.show('excess', true);
        //     } else {
        //         this.setState({ excessError: false, excess: e.target.value });
        //         this.show('excess', false);
        //     }
        // }

        if (e.target.name === 'excess') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ excessError: true });
                this.show("excess", true, "excessError", "Please enter Excess Amount");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ excessError: true });
                    this.show("excess", true, "excessError", "Please enter valid Excess Amount");
                } else {
                    this.setState({ excessError: false, excess: e.target.value });
                    this.show("excess", false, "excessError", "");
                }
            }
        }

        if (e.target.name === 'adminFees') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ adminFeesError: true, adminFees: e.target.value });
                this.show('adminFees', true, "adminFeesError", "Please enter valid Admin Fees.");
            } else if (Number(e.target.value) > Number(this.state.maxPolicyAmount)) {
                this.setState({ adminFeesError: true, adminFees: e.target.value });
                this.show('adminFees', true, "adminFeesError", "Admin Fees can not be more then Policy Amount.");
            } else {
                this.setState({ adminFeesError: false, adminFees: e.target.value });
                this.show('adminFees', false, "adminFeesError", "");
            }
        }

        if (e.target.name === 'underWriter') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ underWriterError: false, underWriter: e.target.value });
                this.show('underWriter', false);
            } else if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                this.setState({ underWriterError: true, underWriter: e.target.value });
                this.show('underWriter', true);
            } else {
                this.setState({ underWriterError: false, underWriter: e.target.value });
                this.show('underWriter', false);
            }
        }

        if (e.target.name === "MarineTradePremium") {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ MarineTradePremiumError: true });
                this.show("MarineTradePremium", true, "MarineTradePremiumError", "Please enter Premium Amount");
            } else if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                this.setState({ MarineTradePremiumError: true, MarineTradePremium: e.target.value });
                this.show('MarineTradePremium', true, "MarineTradePremiumError", "Please enter valid Premium Amount");
            } else {
                this.setState({ MarineTradePremiumError: false, MarineTradePremium: e.target.value });
                this.show("MarineTradePremium", false, "MarineTradePremiumError", "");
            }
        }

        // if (e.target.name === 'ratingTypeValue') {
        //     if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimal.test(e.target.value)) {
        //         this.setState({ ratingTypeValueError: true, ratingTypeValue: e.target.value });
        //         // this.show('ratingTypeValue', true);
        //     } else {
        //         this.setState({ ratingTypeValueError: false, ratingTypeValue: e.target.value });
        //         this.show('ratingTypeValue', false);
        //     }
        // }

        if (e.target.name === 'ratingTypeValue') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ ratingTypeValueError: true });
                this.show("ratingTypeValue", true, "ratingTypeValueError", "Please enter Rate");
            } else {
                let decimalRegEx = this.state.ratingTypeValueRegex;
                let percentage = e.target.value;
                if (!decimalRegEx.test(percentage)) {
                    this.setState({ ratingTypeValueError: true });
                    this.show("ratingTypeValue", true, "ratingTypeValueError", "Please enter valid Rate");
                } else {
                    this.setState({ ratingTypeValueError: false, ratingTypeValue: e.target.value });
                    this.show("ratingTypeValue", false, "ratingTypeValueError", "");
                }
            }
        }

        if (e.target.name === 'governmentLavysAmount') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ governmentLavysAmountError: true, governmentLavysAmount: e.target.value });
                this.show('governmentLavysAmount', true, "governmentLavysAmountError", "Please eneter Government Lavys Amount");
            } else {
                this.setState({ governmentLavysAmountError: false, governmentLavysAmount: e.target.value });
                this.show('governmentLavysAmount', false, "governmentLavysAmount", "");
            }
        }

        if (e.target.name === 'currentNCBAmount') {
            if (!CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ currentNCBAmountError: true });
                this.show("currentNCBAmount", true);
            } else {
                this.setState({ currentNCBAmountError: false, currentNCBAmount: e.target.value });
                this.show("currentNCBAmount", false);
            }
        }

        if (e.target.name === 'agency') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ agencyError: true });
                this.show("agency", true, "agencyError", "Please enter Agency Commission");
            } else {
                let decimalRegEx = CommonConfig.RegExp.percentage;
                let percentage = e.target.value;
                if (!decimalRegEx.test(percentage)) {
                    this.setState({ agencyError: true });
                    this.show("agency", true, "agencyError", "Please enter valid  Agency Commission");
                } else {
                    var totalagency = (e.target.value * this.state.PolicyCurrentPremium) / 100;
                    var balance = parseFloat(this.state.gross) - parseFloat(e.target.value);
                    var balanceTotal = Number(this.state.totalgross) - totalagency;
                    this.setState({ agencyError: false, agency: e.target.value, agencyTotal: totalagency, balance: balance, balanceTotal: balanceTotal })
                    this.show("agency", false, "agencyError", "");
                }
            }
        }
    }

    onRadioBtnClickUnderwriting(radioType, radioSelected) {
        let tab = 'Underwriting';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + radioType] = radioSelected;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + radioType);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (radioType === 'singleHandedSailing') {
            this.setState({ singleHandedSailing: radioSelected });
        } else if (radioType === 'ratingType') {
            if (radioSelected == 'Rating') {
                this.setState({ ratingTypeValueRegex: CommonConfig.RegExp.percentage, ratingTypeValue: '' })
            } else {
                this.setState({ ratingTypeValueRegex: CommonConfig.RegExp.decimalWithOne, ratingTypeValue: '' })
            }
            this.setState({ ratingType: radioSelected });
            this.saveRateableParam('RatingType', radioSelected);
        }
    }

    editLastBindDate() {
        this.setState({ isLastBindEdit: true, lastBindDateError: false });
    }

    editInceptionRenewalDate(InceptionOrRenewal) {
        if (InceptionOrRenewal == 0) {
            this.setState({ isInceptionEdit: true, inceptionDateError: false })
        } else if (InceptionOrRenewal == 1) {
            this.setState({ isRenewalEdit: true, renewalDateError: false })
        }
    }

    editAdjustmentDate() {
        this.setState({ isEditAdjustmentDate: true, adjustmentDateError: false })
    }

    saveLastBindDate() {
        try {

            if (this.state.lastBindDateError) {
                toast.error('Please enter Last Binder Date.');
                return false;
            }

            this.setState({ isLastBindEdit: false, lastBindDateError: false });
            let data = {
                PolicyId: this.state.PolicyId,
                LastBindDate: this.state.lastBindDate,
                loggedInUserId: CommonConfig.loggedInUserId()
            };
            api.post('api/updateLastBindDate', data).then(res => {
                if (res.data.success) {
                    toast.success(res.message);
                    this.setState({ isLastBindEdit: false, lastBindDateError: false });
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });

        } catch (error) {
            console.log("error", error);
        }
    }

    saveInceptionRenewalDate(InceptionOrRenewal) {
        if (InceptionOrRenewal == 0) {
            this.setState({ isInceptionEdit: false, inceptionDateError: false, isRenewalEdit: false, renewalDateError: false });
        } else if (InceptionOrRenewal == 1) {
            this.setState({ isRenewalEdit: false, renewalDateError: false });
        }
        // try {
        //     if (InceptionOrRenewal == 0) {
        //         if (this.state.inceptionDateError) {
        //             toast.error('Please enter Inception Date.');
        //             return false;
        //         }
        //         // this.setState({ isInceptionEdit: false, inceptionDateError: false, isRenewalEdit: false, renewalDateError: false });
        //     } else if (InceptionOrRenewal == 1) {
        //         if (this.state.renewalDateError) {
        //             toast.error('Please enter Renewal Date.');
        //             return false;
        //         }
        //         // this.setState({ isRenewalEdit: false, renewalDateError: false });   
        //     }

        //     let data = {
        //         PolicyId: this.state.PolicyId,
        //         InceptionDate: this.state.inceptionDate,
        //         RenewalDate: this.state.renewalDate,
        //         InceptionOrRenewal: InceptionOrRenewal,
        //         loggedInUserId: CommonConfig.loggedInUserId()
        //     };
        //     api.post('api/updateInceptionOrRenewalDate', data).then(res => {
        //         if (res.data.success) {
        //             toast.success(res.message);
        //             this.setState({ isInceptionEdit: false, inceptionDateError: false, isRenewalEdit: false, renewalDateError: false });
        //         } else {
        //         }
        //     }).catch(err => {
        //         console.log("error", err);
        //     });

        // } catch (error) {
        //     console.log("error", error);
        // }
    }

    cancelLastBindDate() {
        this.setState({ isLastBindEdit: false, lastBindDateError: false, lastBindDate: this.state.defaultLastBindDate });
    }

    cancelInceptionRenewalDate(InceptionOrRenewal) {
        if (InceptionOrRenewal == 0) {
            this.setState({ isInceptionEdit: false, inceptionDateError: false, inceptionDate: this.state.defaultinceptionDate, renewalDate: this.state.defaultrenewalDate });
        } else if (InceptionOrRenewal == 1) {
            this.setState({ isRenewalEdit: false, renewalDateError: false, renewalDate: this.state.defaultrenewalDate });
        }
    }

    cancelEditAdjustmentDate() {
        this.setState({ isEditAdjustmentDate: false, adjustmentDateError: false, adjustmentDate: moment().format('YYYY-MM-DD') });
    }

    editAgencyCommission() {
        this.setState({ changeAgencyCommission: !this.state.changeAgencyCommission });
    }
    /* END ----- Underwriting Functions ---- */


    /* START ----- General Functions ---- */

    handleChangeGeneral = (e) => {
        let tab = 'General';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        if (e.target.name === 'memberISA') {
            PolicyDynamicCalculationData[tab + '.' + e.target.name] = ((this.state.memberISA == true) ? 0 : 1);
        } else if (e.target.name === 'memberIWAI') {
            PolicyDynamicCalculationData[tab + '.' + e.target.name] = ((this.state.memberIWAI == true) ? 0 : 1);
        } else {
            PolicyDynamicCalculationData[tab + '.' + e.target.name] = e.target.value;
        }
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + e.target.name);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'previousNCBAmount') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
                this.setState({ previousNCBAmountError: true });
                this.show("previousNCBAmount", true);
            } else {
                this.setState({ previousNCBAmountError: false, previousNCBAmount: e.target.value });
                this.show("previousNCBAmount", false);
            }
        }

        if (e.target.name === 'lossesDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ lossesDescribeError: true });
                this.show("lossesDescribe", true);
            } else {
                this.setState({ lossesDescribeError: false, lossesDescribe: e.target.value });
                this.show("lossesDescribe", false);
            }
        }

        if (e.target.name === 'convictedDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ convictedDescribeError: true });
                this.show("convictedDescribe", true);
            } else {
                this.setState({ convictedDescribeError: false, convictedDescribe: e.target.value });
                this.show("convictedDescribe", false);
            }
        }

        if (e.target.name === 'insuranceCanceledDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ insuranceCanceledDescribeError: true });
                this.show("insuranceCanceledDescribe", true);
            } else {
                this.setState({ insuranceCanceledDescribeError: false, insuranceCanceledDescribe: e.target.value });
                this.show("insuranceCanceledDescribe", false);
            }
        }

        if (e.target.name === 'damagedDescribe') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ damagedDescribeError: true });
                this.show("damagedDescribe", true);
            } else {
                this.setState({ damagedDescribeError: false, damagedDescribe: e.target.value });
                this.show("damagedDescribe", false);
            }
        }

        if (e.target.name === 'interestedParty') {
            if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
                this.setState({ interestedPartiesError: true });
                this.show("interestedParty", true);
            } else {
                this.setState({ interestedPartiesError: false, interestedParty: e.target.value });
                this.show("interestedParty", false);
            }
        }

        if (e.target.name === 'policyNo') {
            if (!CommonConfig.RegExp.alphaNumeric.test(e.target.value)) {
                this.setState({ policyNoError: true });
                this.show("policyNo", true);
            } else {
                this.setState({ policyNoError: false, policyNo: e.target.value });
                this.show("policyNo", false);
            }
        }

        if (e.target.name === 'memberISA') {
            if (!this.state.memberISA == false) {
                this.setState({
                    affiliatedClub: '',
                    ISAMembershipNo: ''
                });
            }
            this.setState({
                memberISA: !this.state.memberISA,
                affiliatedClubError: !this.state.affiliatedClubError,
                ISAMembershipNoError: !this.state.ISAMembershipNoError,
            });
        }

        if (e.target.name === 'affiliatedClub') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ affiliatedClubError: true });
                this.show("affiliatedClub", true);
            } else {
                this.setState({ affiliatedClubError: false, affiliatedClub: e.target.value });
                this.show("affiliatedClub", false);
            }
        }

        if (e.target.name === 'ISAMembershipNo') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ ISAMembershipNoError: true });
                this.show("ISAMembershipNo", true);
            } else {
                this.setState({ ISAMembershipNoError: false, ISAMembershipNo: e.target.value });
                this.show("ISAMembershipNo", false);
            }
        }

        if (e.target.name === 'memberIWAI') {
            if (!this.state.memberIWAI == false) {
                this.setState({
                    affiliatedBranch: '',
                    IWAIMembershipNo: ''
                });
            }
            this.setState({
                memberIWAI: !this.state.memberIWAI,
                affiliatedBranchError: !this.state.affiliatedBranchError,
                IWAIMembershipNoError: !this.state.IWAIMembershipNoError,
            });
        }

        if (e.target.name === 'affiliatedBranch') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ affiliatedBranchError: true });
                this.show("affiliatedBranch", true);
            } else {
                this.setState({ affiliatedBranchError: false, affiliatedBranch: e.target.value });
                this.show("affiliatedBranch", false);
            }
        }

        if (e.target.name === 'IWAIMembershipNo') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ IWAIMembershipNoError: true });
                this.show("IWAIMembershipNo", true);
            } else {
                this.setState({ IWAIMembershipNoError: false, IWAIMembershipNo: e.target.value });
                this.show("IWAIMembershipNo", false);
            }
        }

        if (e.target.name === 'isGeneralQuestionProofProvided') {
            this.setState({
                isGeneralQuestionProofProvided: !this.state.isGeneralQuestionProofProvided,
            });
        }

        if (e.target.name === 'isInsuranceHistoryProofProvided') {
            this.setState({
                isInsuranceHistoryProofProvided: !this.state.isInsuranceHistoryProofProvided,
            });
        }

    }

    selectTypeGeneral(value, type) {
        let tab = 'General';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + type] = value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + type);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (type === 'boatingExperienceYear') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ boatingExperienceYearError: true, boatingExperienceYear: value });
                this.show('boatingExperienceYear', true);
            } else {
                this.setState({ boatingExperienceYearError: false, boatingExperienceYear: value });
                this.show('boatingExperienceYear', false);
            }
        }

        if (type === 'boatingQualifications') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ boatingQualificationsError: true, boatingQualifications: value });
                this.show('boatingQualifications', true);
            } else {
                this.setState({ boatingQualificationsError: false, boatingQualifications: value });
                this.show('boatingQualifications', false);
            }
        }

        if (type === 'previousInsurer') {
            this.setState({ previousInsurer: value });
        }

        if (type === 'losses') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ losses: value, showLossesDescribe: false, lossesErr: true, lossesDescribe: '' });
                this.show('losses', true);
            } else {
                if (value === "Yes") {
                    this.setState({ showLossesDescribe: true });
                    this.setState({ lossesDescribeError: true, losses: value, lossesErr: false });
                } else {
                    this.setState({ showLossesDescribe: false, lossesDescribe: '' });
                    this.setState({ lossesDescribeError: false, losses: value, lossesErr: false });
                }
                this.show('losses', false);
                this.saveRateableParam('IsLossesInLastFiveYears', value);
            }
        }

        if (type === 'convicted') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ convicted: value, ShowConvictedDescribe: false, convictedErr: true, convictedDescribe: '' });
                this.show('convicted', true);
            } else {
                if (value === "Yes") {
                    this.setState({ ShowConvictedDescribe: true });
                    this.setState({ convictedDescribeError: true, convicted: value, convictedErr: false });
                } else {
                    this.setState({ ShowConvictedDescribe: false, convictedDescribe: '' });
                    this.setState({ convictedDescribeError: false, convicted: value, convictedErr: false });
                }
                this.show('convicted', false);
            }
        }

        if (type === 'insuranceCanceled') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ insuranceCanceled: value, ShowInsuranceCanceledDescribe: false, insuranceCanceledErr: true, insuranceCanceledDescribe: '' });
                this.show('insuranceCanceled', true);
            } else {
                if (value === "Yes") {
                    this.setState({ ShowInsuranceCanceledDescribe: true });
                    this.setState({ insuranceCanceledDescribeError: true, insuranceCanceled: value, insuranceCanceledErr: false });
                } else {
                    this.setState({ ShowInsuranceCanceledDescribe: false, insuranceCanceledDescribe: '' });
                    this.setState({ insuranceCanceledDescribeError: false, insuranceCanceled: value, insuranceCanceledErr: false });
                }
                this.show('insuranceCanceled', false);
            }
        }

        if (type === 'damaged') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ damaged: value, ShowDamagedDescribe: false, damagedErr: true, damagedDescribe: '' });
                this.show('damaged', true);
            } else {
                if (value === "Yes") {
                    this.setState({ ShowDamagedDescribe: true });
                    this.setState({ damagedDescribeError: true, damaged: value, damagedErr: false });
                } else {
                    this.setState({ ShowDamagedDescribe: false, damagedDescribe: '' });
                    this.setState({ damagedDescribeError: false, damaged: value, damagedErr: false });
                }
                this.show('damaged', false);
            }
        }

        if (type === 'previousNCBYears') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ previousNCBYearsError: true, previousNCBYears: value });
                this.show('previousNCBYears', true);
            } else {
                this.setState({ previousNCBYearsError: false, previousNCBYears: value });
                this.show('previousNCBYears', false);
            }
        }
    }

    changePreviousInsurer(value) {
        let tab = 'General';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.previousInsurer'] = value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.previousInsurer');
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (CommonConfig.isEmpty(value)) {
            this.setState({ previousInsurerError: true, previousInsurer: value });
            this.show('previousInsurer', true, 'previousInsurerError', 'Please select previous insurer');
        } else {
            this.setState({ previousInsurerError: false, previousInsurer: value });
            this.show('previousInsurer', false, 'previousInsurerError', '');
            let results = this.state.previousInsurerList.filter((previousInsurerData) => {
                var previousInsurerName = previousInsurerData.StringMapName;
                return previousInsurerName == value;
            });
        }
    }

    suggestPreviousInsurer(event) {
        let results = this.state.previousInsurerList.filter((previousInsurerData) => {
            var previousInsurerName = previousInsurerData.StringMapName;
            return previousInsurerName.toLowerCase().startsWith(event.query.toLowerCase());
        });
        var previousInsurerResult = [];
        results.forEach(res => {
            previousInsurerResult.push(res.StringMapName);
        });
        this.setState({ previousInsurerSuggestions: previousInsurerResult });
    }

    toggleAllGeneral = (toggleType) => {
        if (toggleType === 'expand') {
            this.setState({
                showGeneralQuestions: true,
                showInsuranceHistory: true,
                showSchemes: true,
                isGeneralExpand: true
            });
        } else {
            this.setState({
                showGeneralQuestions: false,
                showInsuranceHistory: false,
                showSchemes: false,
                isGeneralExpand: false
            });
        }
    }

    openModalGeneral() {
        this.setState({ toggleModalGeneral: !this.state.toggleModalGeneral });
    }

    deleteGeneral = (data) => {
        this.setState({ tempData: data, deleteItemName: data.BoatingQualificationName });
        this.openModalGeneral();
    }

    toggleLargeGeneral = () => {
        this.setState({ toggleModalGeneral: false, tempData: '' });
    }

    toggleStageChange = () => {
        if (this.state.toggleStageChangeModal == true) {
            this.setState({ stage: this.state.previousStage, referredTo: '', changeNote: '' });
        }
        this.setState({ toggleStageChangeModal: !this.state.toggleStageChangeModal });
    }

    deleteBoatingQualification = () => {
        let arr1 = this.state.boatingQualificationsArr;
        let arr2 = this.boatingQualificationListCopy;
        let arr3 = this.state.boatingQualificationList;
        let selectedRecord = this.state.tempData;

        // let index = arr1.findIndex(x => x.PolicyBoatingQualificationId === selectedRecord.PolicyBoatingQualificationId);
        let index = arr1.findIndex(x => x.BoatingQualification === selectedRecord.BoatingQualification);
        if (index > -1) {
            arr1.splice(index, 1);
        }

        let index1 = arr2.findIndex(x => x.StringMapId === selectedRecord.BoatingQualification);
        if (index1 > -1) {
            arr3.push(arr2[index1]);
        }

        this.setState({
            boatingQualificationsArr: arr1,
            boatingQualificationList: arr3,
            tempData: {},
            toggleModalGeneral: false
        })
    }

    ValidateAndAddBoatingQualification = () => {
        if (CommonConfig.isEmpty(this.state.boatingQualifications) || this.state.boatingQualificationsError) {
            this.setState({ boatingQualificationsError: true });
            this.show('boatingQualifications', true);
        } else {
            let arr1 = this.state.boatingQualificationsArr;
            let arr2 = this.boatingQualificationListCopy;
            let arr3 = this.state.boatingQualificationList;

            let index = arr2.findIndex(x => x.StringMapKey === this.state.boatingQualifications);
            let index1 = arr3.findIndex(x => x.StringMapKey === this.state.boatingQualifications);
            let bqindex = arr1.findIndex(x => x.BoatingQualification === this.state.boatingQualifications);

            if (bqindex === -1) {
                let boatingQuaData = {
                    PolicyBoatingQualificationId: '',
                    PolicyId: this.props.match.params.id,
                    Status: arr2[index].Status,
                    BoatingQualification: arr2[index].StringMapId,
                    BoatingQualificationName: arr2[index].StringMapKey,
                    LanguageId: arr2[index].LanguageId
                }
                arr1.push(boatingQuaData);
                arr3.splice(index1, 1);
            }

            // else {
            //   BoatingQualificationsArray[bqindex].Status = "Active";
            // }

            this.setState({
                boatingQualificationsArr: arr1,
                boatingQualificationList: arr3,
                boatingQualifications: ''
            });
        }
    }

    editPolicyGeneral() {
        this.setState({ isGeneralEdit: true });
    }

    viewPolicyGeneral() {
        this.setState({ isGeneralEdit: false });
    }

    getMooringGuid(type, name) {
        try {
            let data = {
                MooringType: type,
                MooringName: name
            }
            api.post('api/getMooringGuidId', data).then(res => {
                if (res.success) {
                    this.setState({ mooringGuideId: res.data.leghth < 0 || res.data != undefined ? res.data[0].MooringGuideId : '' });
                    this.saveRateableParam('MooringGuideId', res.data.leghth < 0 || res.data != undefined ? res.data[0].MooringGuideId : '');
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }
    // END ----- General Functions ----


    // START ----- Mooring Navigation Functions ----

    getLatLong = (e) => {
        this.setState({ coOrdinates: e.latLng.lat().toFixed(3) + ", " + e.latLng.lng().toFixed(3), latitude: e.latLng.lat(), longitude: e.latLng.lng(), mooringCoordinatesError: false });
    }

    selectTypeMooring(value, type) {
        console.log('selectTypeMooring', value);
        let tab = 'Mooring';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        if (value === '' || value === undefined || value === null) {
            PolicyDynamicCalculationData[tab + '.' + type] = '';
        } else {
            PolicyDynamicCalculationData[tab + '.' + type] = value.value;
        }
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + type);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        if (type === 'mooringBoatReg') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ mooringBoatRegError: true, mooringBoatReg: value });
                this.show('mooringBoatReg', true);
            } else {
                this.setState({ mooringBoatRegError: false, mooringBoatReg: value.value });
                this.show('mooringBoatReg', false);
                this.saveRateableParam('VesselRegistrationLocation', value.value);
            }
            // this.setState({ newMooringBoatReg: this.state.mooringBoatReg });
        }

        if (type === 'mooringBoatMoored') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ mooringBoatMooredError: true, mooringBoatMoored: value });
                this.show('mooringBoatMoored', true);
            } else {
                this.setState({ mooringBoatMooredError: false, mooringBoatMoored: value.value });
                this.getmooringType(value.value, '');
                this.show('mooringBoatMoored', false);
                // this.saveRateableParam('MooringName', value.value);
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
                // this.saveRateableParam('MooringType', value);
                // this.saveRateableParam('MooringName', this.state.mooringBoatMoored);
                if (this.state.mooringBoatMoored != null || this.state.mooringBoatMoored != '') {
                    this.getMooringGuid(value, this.state.mooringBoatMoored);
                }
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
                this.saveRateableParam('CruisingRange', value.value);
            }
        }
        // this.setState({ newCruisingRange: this.state.CruisingRange });
    }

    handleCheckboxMooring = (e) => {

        let tab = 'Mooring';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + e.target.name] = ((e.target.checked) ? 1 : 0);
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + e.target.name);
        console.log('PolicyDynamicCalculationData', PolicyDynamicCalculationData);

        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });
        if (e.target.name === 'isLaidAshore') {
            this.setState({ isLaidAshore: e.target.checked ? 1 : 0, isLaidAshoreError: false, transactionType: e.target.checked ? 'Premium Reduced' : 'Premium Increased' });
            this.saveRateableParam('IsLaidUpAshore', e.target.checked ? 1 : 0);
        }
    }

    handleChangeMooring = (e) => {
        let tab = 'Mooring';
        let PolicyDynamicCalculationData = this.state.PolicyDynamicCalculationData;
        PolicyDynamicCalculationData[tab + '.' + e.target.name] = e.target.value;
        var columnKeys = this.state.columnKeys;
        columnKeys.push(tab + '.' + e.target.name);
        this.setState({ PolicyDynamicCalculationData: PolicyDynamicCalculationData, columnKeys: columnKeys });

        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'mooringRegNo') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mooringRegNoError: true });
                this.show("mooringRegNo", true);
            } else {
                let invSpace = /^\S*$/;
                let mooringRegNo = e.target.value;
                if (!invSpace.test(mooringRegNo)) {
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
                this.setState({ OtherInformationError: true });
                this.show("OtherInformation", true);
            } else {
                this.setState({ OtherInformationError: false, OtherInformation: e.target.value });
                this.show("OtherInformation", false);
            }
        }

        if (e.target.name === 'mtdFees') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mtdFeesError: true });
                this.show("mtdFees", true);
            } else {
                if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                    this.setState({ mtdFeesError: true });
                    this.show("mtdFees", true);
                } else {
                    this.setState({ mtdFeesError: false, mtdFees: e.target.value });
                    this.show("mtdFees", false);
                    this.calculateMTDTotal();
                    this.calculateNewTotalDue();
                }
            }
        }

        if (e.target.name === 'actualAmount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ actualAmountError: true });
                this.show("actualAmount", true);
            } else {
                if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
                    this.setState({ actualAmountError: true });
                    this.show("actualAmount", true);
                } else {
                    this.setState({ actualAmountError: false, actualAmount: e.target.value });
                    this.show("actualAmount", false);
                    this.calculateMTDTotal();
                    this.calculateNewTotalDue();
                }
            }
        }

        if (e.target.name === 'mtdNote') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ mtdNoteError: true });
                this.show("mtdNote", true);
            } else {
                if (!CommonConfig.RegExp.allowAllWithSpace.test(e.target.value)) {
                    this.setState({ mtdNoteError: true });
                    this.show("mtdNote", true);
                } else {
                    this.setState({ mtdNoteError: false, mtdNote: e.target.value });
                    this.show("mtdNote", false);
                }
            }
        }

        if (e.target.name === 'adjustmentDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ adjustmentDateError: true });
                this.show("adjustmentDate", true);
            } else {
                this.setState({ adjustmentDateError: false, adjustmentDate: e.target.value });
                this.show("adjustmentDate", false);
            }
        }
    }

    getmooringType(value, type) {

        try {
            let data = {
                pMode: 'mooringType',
                zone: 'Irish Website',
                mooringName: value,
                mooringType: this.state.mooringType,
                PolicyId: this.props.match.params.id,
            }
            api.post('api/getMooringGuideDetails', data).then(res => {
                if (res.success) {
                    console.log("getMooringTypeByMooringName", res.data[0]);
                    var mooringTypeArr = [];
                    for (var i = 0; i < res.data.length; i++) {
                        mooringTypeArr.push({
                            label: res.data[i].MooringType,
                            value: res.data[i].MooringType,
                        })
                    }
                    this.setState({ mooringTypearr: mooringTypeArr });

                    if (res.data) {
                        if (type != '') {
                            this.selectTypeMooring(type, 'mooringType');
                        } else {
                            this.selectTypeMooring(res.data[0].MooringType, 'mooringType');
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
                pMode: 'RemainingData',
                zone: 'Irish Website',
                mooringName: mooringName,
                mooringType: value,
                PolicyId: this.props.match.params.id
            }
            api.post('api/getMooringGuideDetails', data).then(res => {
                if (res.success) {
                    console.log("getRemainingData", res.data);
                    var Latitude = CommonConfig.isEmpty(res.data[0].Latitude) ? 'null' : (res.data[0].Latitude);
                    var Longitude = CommonConfig.isEmpty(res.data[0].Longitude) ? 'null' : (res.data[0].Longitude);
                    this.setState({
                        mooringCountry: CommonConfig.isEmpty(res.data[0].countryName) ? ("N/A") : (res.data[0].countryName),
                        location: CommonConfig.isEmpty(res.data[0].Location) ? ("N/A") : (res.data[0].Location),
                        locationType: CommonConfig.isEmpty(res.data[0].LocationType) ? ("N/A") : (res.data[0].LocationType),
                        zone: CommonConfig.isEmpty(res.data[0].MooringZoneName) ? ("N/A") : (res.data[0].MooringZoneName),
                        loadings: CommonConfig.isEmpty(res.data[0].LoadingPercent) ? ("N/A") : (res.data[0].LoadingPercent.toFixed(2)),
                        loadings: CommonConfig.isEmpty(res.data[0].LoadingPercent) ? ("N/A") : (res.data[0].LoadingPercent),
                        approvalRequired: (res.data[0].IsApprovalRequired.data[0] == 0) ? ("NO") : ("YES"),
                        notes: CommonConfig.isEmpty(res.data[0].Notes) ? ("N/A") : (res.data[0].Notes),
                        coOrdinates: res.data[0].Longitude + " , " + res.data[0].Latitude,
                        coOrdinates: Latitude + " , " + Longitude,
                        isMarkerShown: true,
                        latitude: parseFloat(res.data[0].Latitude), longitude: parseFloat(res.data[0].Longitude),
                        // latitude: selectedMooringType.Latitude, longitude: selectedMooringType.Longitude
                    });
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }
    // END ----- Mooring Navigation Functions ----

    render() {
        const { t } = this.props;
        const CancelButton = t("buttons.Cancel");
        const AddButton = t("buttons.Add");
        const DeleteButton = t("buttons.Delete");

        var header = <div>

            <div className="policy-calc-outer" style={{ background: CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (null) : ("#f86c6b") }}>
                <div className="policy-calc-header">
                    {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                        <Row className="align-items-center">
                            <Col md="1">
                                <p>{(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? 'New' : 'Change'}</p>
                            </Col>
                            <Col md="5" style={{ display: '-webkit-inline-box' }}>
                                <p style={{ marginRight: 30 }}>Premium <span>{(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? this.state.PolicyNewNetPremium : this.state.PolicyChangeNetPremium}</span></p>
                                <p style={{ marginRight: 30 }}>Levy <span>{(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? this.state.PolicyNewLevy : this.state.PolicyChangeLevy}</span></p>
                                <p style={{ marginRight: 30 }}>Admin Fee <span>{(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? this.state.PolicyNewAdminFee : this.state.PolicyChangeAdminFee}</span></p>
                                <p style={{ marginRight: 30 }}>Gross Premium <span>{(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? this.state.PolicyNewTotalDue : this.state.PolicyChangeTotalDue}</span></p>
                            </Col>
                            {(this.state.PolicyMode == 'Quotation' || this.state.PolicyMode == 'Renewal') ? (null) :
                                (<Col md="4" style={{ display: '-webkit-inline-box' }}>
                                    <p style={{ marginRight: 30 }}>Proration <span>{this.state.ProrationRatio}</span></p>

                                    {(this.state.isEditAdjustmentDate) ? (
                                        <div>
                                            <Input type="date" name="adjustmentDate" id="adjustmentDate"
                                                placeholder="Adjustment Date"
                                                style={{ width: '70%', display: "inline-block" }}
                                                onBlur={(e) => this.getRateableParam()}
                                                onChange={(e) => this.handleChangePolicyDetail(e)}
                                                value={this.state.adjustmentDate}
                                            />
                                            {(this.state.renewalDateError == true) ? (
                                                <em className="error invalid-feedback" >Please enter Adjustment Date</em>
                                            ) : (null)}

                                            <BTN color="success" onClick={() => this.getRateableParam()} title="Save Adjustment Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                <i className="fa fa-check"></i>
                                            </BTN>
                                            <BTN color="danger" onClick={() => this.cancelEditAdjustmentDate()} title="Cancel Adjustment Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                <i className="fa fa-times"></i>
                                            </BTN>

                                        </div>
                                    ) : (
                                            <div>
                                                <span style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 600 }}>{moment(this.state.adjustmentDate).format('DD/MM/YYYY')}</span>
                                                {/* <p>{this.state.adjustmentDate}</p> */}
                                                {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                                    <BTN color="primary" onClick={() => this.editAdjustmentDate()} title="Change Adjustment Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                        <i className="fa fa-pencil"></i>
                                                    </BTN>
                                                ) : (null)}
                                            </div>
                                        )}
                                </Col>
                                )}
                            <Col md="2" className="ml-auto">
                                <div className="pch-btns">
                                    {/* <a onClick={() => this.refreshDynamicComputation()} title={t("policyDetails:refreshDynamicComputation")}><i className="fa fa-refresh"></i></a> */}
                                    <a onClick={() => { this.toggleRevertPolicyDetailPopup() }} title="Cancel" className="del"><i className="fa fa-close"></i></a>
                                    <a onClick={() => { this.validatePolicyDetails() }} title="Proceed" className="check"><i className="fa fa-check"></i></a>
                                    <a onClick={() => this.showDynamicComputationDetails()} title={t("policyDetails:SummaryDetail")} className="view"><i className="fa fa-eye"></i></a>
                                    <a onClick={(e) => this.toggleCalculator()}>{(this.state.dislpayCalculatorBody) ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}</a>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                            <Row className="align-items-center">
                                <Col md="12" style={{ textAlign: "center", color: "white" }}>
                                    {(this.state.status == "Cancel") ? (<h4>Cancelled Policy</h4>) : (null)}
                                    {(this.state.status == "Lapsed") ? (<h4>Lapsed Policy</h4>) : (null)}
                                </Col>
                            </Row>
                        )}
                </div>

                {(this.state.dislpayCalculatorBody) ? (
                    <div className="policy-calc-content">
                        <h3>Calculator</h3>
                        <div className="policy-calc-table">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><b>Mode:   </b>{this.state.PolicyMode}</th>
                                        <th>Current</th>
                                        <th>Change</th>
                                        <th>New</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Net Premium (<i class={this.state.CurrencySymbol}></i>)</td>
                                        <td>{this.state.PolicyCurrentNetPremium}</td>
                                        <td>{this.state.PolicyChangeNetPremium}</td>
                                        <td>{this.state.PolicyNewNetPremium}</td>
                                    </tr>
                                    <tr>
                                        <td>Levy (<i class={this.state.CurrencySymbol}></i>)</td>
                                        <td>{this.state.PolicyCurrentLevy}</td>
                                        <td>{this.state.PolicyChangeLevy}</td>
                                        <td>{this.state.PolicyNewLevy}</td>
                                    </tr>
                                    <tr>
                                        <td>Admin Fee (<i class={this.state.CurrencySymbol}></i>)</td>
                                        <td>{this.state.PolicyCurrentAdminFee}</td>
                                        <td>{this.state.PolicyChangeAdminFee}</td>
                                        <td>{this.state.PolicyNewAdminFee}</td>
                                    </tr>
                                    <tr>
                                        <td>Gross Premium (<i class={this.state.CurrencySymbol}></i>)</td>
                                        <td><b>{this.state.PolicyCurrentTotalDue}</b></td>
                                        <td><b>{this.state.PolicyChangeTotalDue}</b></td>
                                        <td>
                                            <b>{this.state.PolicyNewTotalDue}</b>
                                            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus)) ?
                                                (
                                                    <BTN style={{ padding: '5px', fontSize: 14, marginLeft: '10px' }} color="primary" title="Total Due Suggestion" onClick={() => this.showTargetTotalDuePopup()}>
                                                        <i className="fa fa-calculator"></i>
                                                    </BTN>
                                                ) : (null)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                    : (null)}
            </div>

            <Row>
                {(this.state.showRefer) ?
                    (<Col md="12">
                        <div className="policy-warning">
                            {this.state.policyReferNotes.map((ct, i) => {
                                return (<div><span style={{ fontSize: 18 }}>*</span><span style={{ marginRight: 15 }}>{ct.NoteText}</span></div>)
                            })
                            }
                        </div>
                    </Col>
                    ) : (null)}
                {(this.state.status == 'Declined') ?
                    (<Col md="12" style={{ textAlign: "center", color: "red", fontSize: 15 }}>
                        {t("policyDetails:PolicyisDeclinedbytheSystem")}
                    </Col>
                    ) : (null)}

                <Col xs="12" md="12">
                    <Row>
                        <Col md="2">
                            <div className="policy-box">
                                <p>{t("policyDetails:Policy")}</p>
                                <span>{this.state.policyNumber}</span>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{this.state.vesselTypeName}</p>
                                <div className="qt-status">
                                    {(this.state.status == 'Lapsed' || this.state.status == 'Cancel' || this.state.status == 'Canceled') ? (
                                        <p className="pl-status badge badge-danger">{this.state.status}</p>
                                    ) : (
                                            <p className="pl-status badge badge-primary">{this.state.status}</p>
                                        )}
                                    
                                    {(this.state.liabilityType != 'TPO' && this.state.showSurveyDueData) ?                                    
                                        (this.state.showSurveyDueLabel 
                                        ? 
                                        <div>
                                                <p className="pl-status badge badge-danger">Survey Due</p> 
                                        </div>
                                        : null )
                                    : null}
                                    {(this.state.status != 'Quotation')
                                        ?
                                        (this.state.paymentStatus == 'PAID')
                                            ?
                                            <div>
                                                <p className="pl-status badge badge-success">{this.state.paymentStatus}</p>
                                                <p className="pl-status badge badge-primary">Due: {<i className={this.state.CurrencySymbol} ></i>}{this.state.bannerPaymentDue}</p>
                                            </div>
                                            :
                                            (this.state.paymentStatus == 'UNPAID')
                                                ?
                                                <div>
                                                    <p className="pl-status badge badge-danger">{this.state.paymentStatus}</p>
                                                    <p className="pl-status badge badge-primary">Due: {<i className={this.state.CurrencySymbol} ></i>}{this.state.bannerPaymentDue}</p>
                                                </div>
                                                :
                                                (null)
                                        : (null)}

                                    {/* As Discuss With Sir Hide {(this.state.refrred) ?
                                        (<p className="pl-status badge badge-danger">{t("policyDetails:Referred")}</p>)
                                        : (null)} */}
                                    {(this.state.isAwaitingDocument) ?
                                        (<p className="pl-status badge badge-danger">{t("policyDetails:IsAwaitingDocument")}</p>)
                                        : (null)}
                                </div>
                                {/* <div className="pl-inner">
                                    <label>
                                        {t("policyDetails:Refer")}
                                        <Input type="checkbox" name="refrred" id="refrred" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.refrred} checked={this.state.refrred == true ? true : false} value={this.state.refrred} style={{ marginLeft: "10px" }} disabled={(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus)) ? 0 : 1}>
                                        </Input>
                                    </label>
                                </div> */}
                            </div>
                        </Col>
               
                         
                         {(this.state.status == 'Lead') ?   <div className="pl-inner">
                            <BTN  style={{ padding: '1px', fontSize: 14, marginLeft: '5px' }} color="primary" title="Quotation Sent" onClick={() => this.ChangePolicyStatus("Quotation")}>
                                                       Quotation Sent
                            </BTN>
                            </div>   :null}
                            
                        <Col md="2">
                            <div className="policy-box">
                                <p>{t("policyDetails:Policies")}</p>
                                <span onClick={(e) => this.redirectToPolicyList()} title={t("policyDetails:Policies")} style={{ cursor: "pointer", backgroundColor: "#008c9a", color: "#ffffff", padding: "1px 5px", borderRadius: 5 }}>
                                    {this.state.contactPolicies}
                                </span>
                            </div>
                        </Col>
                        <Col md="2" style={{ paddingLeft: 0 }}>
                            <div className="policy-box">
                                <p>{t("policyDetails:Claims")}</p>
                                <span>0</span>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="3">
                            <div className="policy-box">
                                <p>{t("policyDetails:PolicyHolder")}</p>
                                <span>{this.state.policyHolder}</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>{t("policyDetails:Email")}</p>
                                <span>{this.state.email}</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p>{t("policyDetails:Phone")}</p>
                                <span>{this.state.phone}</span>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="policy-box">
                                <p> {t("policyDetails:Country")} </p>
                                <div className="pl-inner">
                                    {(this.state.changeCountry) ? (
                                        <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="country" id="country" onChange={(e) => this.getPremiumPolicyType(e.target.value, 1)/*this.selectContainerType(e.target.value, 'country')*/} value={this.state.country}>
                                            {
                                                this.state.countryList.map((ct, i) => {
                                                    return (<option value={ct.label}>{ct.label}</option>)
                                                })
                                            }
                                        </Input>
                                    ) : (
                                            <span style={{ marginLeft: 10 }}>{this.state.country}</span>
                                        )}
                                    {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1) ? (
                                        <BTN color="primary" onClick={() => this.editCountry()} title="Change Country">
                                            <i className="fa fa-pencil"></i>
                                        </BTN>
                                    ) : (null)}
                                </div>

                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("policyDetails:PolicyType")}</p>
                                <div className="pl-inner">
                                    {(this.state.changePolicyType) ? (
                                        <Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectContainerType(e.target.value, 'policyType')} value={this.state.policyType} style={{ width: "fit-content", display: "inline-block" }}>
                                            {this.state.policyTypeList.map((ct, i) => {
                                                return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                            })
                                            }
                                        </Input>
                                    ) : (
                                            <span>{this.state.policyType}</span>
                                        )}
                                    {(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel' && CommonConfig.ShowHideActionOnPolicyStatus(this.state.status)) ?
                                        (<BTN color="primary" onClick={() => this.editPolicyType()} title="Change Policy Type">
                                            <i className="fa fa-pencil"></i>
                                        </BTN>)
                                        : (null)}
                                </div>
                            </div>
                        </Col>

                        <Col md="4">
                            <div className="policy-box">
                                <p>
                                    {t("policyDetails:Language")}

                                    {(this.state.changeLanguage) ? (
                                        <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="LanguageId" id="LanguageId" onChange={(e) => this.selectContainerType(e.target.value, 'language')} value={this.state.language}>
                                            {
                                                this.state.languageList.map((ct, i) => {
                                                    return (<option value={ct.Language}>{ct.Language}</option>)
                                                })
                                            }
                                        </Input>
                                    ) : (
                                            <span style={{ marginLeft: 10 }}>{this.state.language}</span>
                                        )}
                                    {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1) ? (
                                        <BTN color="primary" onClick={() => this.editLanguage()} title="Change Language">
                                            <i className="fa fa-pencil"></i>
                                        </BTN>
                                    ) : (null)}
                                </p>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="policy-box">
                                <p>{t("policyDetails:Currency")}</p>
                                <div className="pl-inner">
                                    {(this.state.changeCurrency) ? (
                                        <Input type="select" name="currency" id="currency" onChange={(e) => this.selectContainerType(e.target.value, 'currency')} value={this.state.currency} style={{ width: "fit-content", display: "inline-block" }}>
                                            {this.state.currencyList.map((ct, i) => {
                                                return (<option value={ct.CurrncyCode}>{ct.CurrncyCode}</option>)
                                            })
                                            }
                                        </Input>
                                    ) : (
                                            <span>{this.state.currency}</span>
                                        )}

                                    {(/*this.state.status != "Active" &&*/ this.state.status != '' && this.state.loginPerson == ('karen@yachtsman.ie' || 'matt@yachtsman.ie')) ? (
                                        <BTN color="primary" onClick={() => this.editCurrency()} title="Change Currency">
                                            <i className="fa fa-pencil"></i>
                                        </BTN>
                                    ) : (null)}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>;

        return (
            <>
            <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />
            <script src="http://fb.me/react-js-fiddle-integration.js"></script>

            <div>{this.state.isLock ? 
           <div>
                <p>{this.state.lockMsg}</p>
                {this.state.loggedInUserData.SecurityGroupName == 'Underwriting' ?
                <div>
                <i class="fa fa-lock" onClick={()=>this.releaseLock()} style={{ fontSize: '25px' , cursor: 'pointer'}} aria-hidden="true" id={"Lock"} > </i>
                    <UncontrolledTooltip placement="right" target={"Lock"} >
                        {"Unlock Policy"}
                    </UncontrolledTooltip>
                
                </div>
                : null }
            </div>:  
                <div>
                    <IdleTimeOutModalForPolicy
                    showModal={this.state.showModal} 
                    handleClose={this.handleClose}
                    handleContinue={this.handleContinue}
                />
                <Row>
                    <Col>
                        <div>
                            <Row md="12" className="policy-calc-top-margin" style={{ marginBottom: "10px" }}>
                                <Col md="3">
                                    <div className="policy-box">
                                        <p>Coverage Type</p>
                                        <span><Input type="select" name="premiumPolicyType" id="premiumPolicyType" onChange={(e) => this.selectPremiumPolicyType(e.target, 'premiumPolicyType')} value={this.state.premiumPolicyType} disabled={(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus)) ? 0 : 1}>
                                            <option value=''>Select</option>
                                            {this.state.premiumPolicyTypeList.map((sm, i) => {
                                                return (<option value={sm.StringMapKey}>{sm.StringMapName}</option>)
                                            })
                                            }
                                        </Input></span>
                                    </div>
                                </Col>
                                <Col md="4">
                                    <div className="policy-box" style={{ minHeight: '57px' }}>
                                        <p> Stage </p>
                                        {this.state.stage== 'Referred'? this.state.referredToName : null }
                                        {(this.state.changeStage) ? <span> {this.state.stage} </span> : null}
                                        <div className="pl-inner">
                                            {(this.state.changeStage) ? (
                                                <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="stage" id="stage" value={this.state.stage} onChange={(e) => this.savePolicyStage(e.target.value)}>
                                                    {
                                                        this.state.stageList.map((ct, i) => {
                                                            return (<option value={ct.StringMapKey}>{ct.StringMapKey}</option>)
                                                        })
                                                    }
                                                </Input>
                                            ) : (
                                                    <span style={{ marginLeft: 10 }}>{this.state.stage}</span>
                                                )}
                                            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1) ? (
                                                <>
                                                <BTN color="primary" onClick={() => this.editState()} title="Change State">
                                                    <i className="fa fa-pencil"></i>
                                                </BTN>
                                                {this.state.stage == 'Referred' ?
                                                <BTN color="primary" onClick={() => this.toggleStageChange()} title="Referr Change">
                                                    <i className="fa fa-eye"></i>
                                                </BTN>
                                                : null }
                                                </>
                                            ) : (null)}
                                        </div>
                                        {/* Referred */}

                                    </div>
                                </Col>
                                <Col md="5">
                                    {
                                        (this.state.contactEntityType != "") ? (
                                            <div style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} >
                                                <SidebarNav
                                                    inceptionDate={this.state.inceptionDate}
                                                    contactEntityType={this.state.contactEntityType}
                                                    contactEntityId={this.state.contactEntityId}
                                                    NavPage="Policy" NavID={this.props.match.params.id}
                                                    {...this.props} />
                                            </div>
                                        ) : (null)
                                    }
                                    {(this.state.status === 'Active')
                                        ?
                                        <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="danger" onClick={() => this.confirmCancelPolicy()}>Cancel Policy</BTN>
                                        :
                                        (null)
                                    }
                                    <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.redirectToNewPolicy()}>{t("policyDetails:New Policy")}</BTN>
                                    <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.newClaim()}>{t("policyDetails:NewClaim")}</BTN>
                                    {
                                        (this.state.isBindPolicyVisible) ? (
                                            <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.bindPolicy()}>{t("policyDetails:BindPolicy")}</BTN>
                                        ) : (
                                                (this.state.isUnBind) ? (
                                                    <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="warning" onClick={() => this.unBindPolicy()}>UnBind Policy</BTN>
                                                ) : (null)
                                            )
                                    }

                                    {
                                        (this.state.status == 'Lapsed') ?
                                            (
                                                <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="danger" onClick={() => this.unlapsePolicy()}>Unlapse Policy</BTN>
                                            )
                                            :
                                            (null)
                                    }
                                    
                                {(this.state.department == 'SubAgent')
                                        ?
                                        <div style={{ fontWeight: "bold",color: "#008c9a",fontSize: "14px" ,float: "left", paddingTop: "9px" ,marginLeft: "5px", marginRight: "5px" ,maxWidth: "220px" }}>
                                            {/* <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" disabled="true">{this.state.sourceName}</BTN>  */}
                                            {/* {this.state.sourceName} */}
                                            <span>{this.state.sourceName}</span> 
                                        </div>
                                    : null}
                                </Col>
                            </Row>
                        </div>

                        <div className="input-box">
                            {header}
                        </div>
                        <div className="input-box" id="Summary">
                            <Card className="mb-0">
                                <CardHeader id="headingOne">
                                    <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showSummary: !this.state.showSummary, showWarningsMessagesReminders: false })} aria-expanded={this.state.showSummary} aria-controls="collapseOne">
                                        <h5 className="m-0 p-0">

                                            {t("policyDetails:Summary")}
                                            <i style={{ float: 'right' }} className={this.state.showSummary ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                        </h5>
                                    </BTN>
                                </CardHeader>
                                <Collapse isOpen={this.state.showSummary} data-parent="#Summary" id="collapseOne" aria-labelledby="headingOne">
                                    <CardBody>
                                        <Row>
                                            <Col md="3">
                                                <h5 style={{ color: '#008c9a' }}>{this.state.PremiumType} Calculation</h5>
                                            </Col>
                                            {(this.state.isRenewal == 1) ?
                                                (<Col md="5">
                                                    <Row>
                                                        <Col md="6">
                                                            <p>Renewal Date: {moment(this.state.RenewalDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
                                                        </Col>
                                                        {(this.state.isGenerateRenewal == 2 && CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1) ?
                                                            (<Col md='6'>
                                                                <Row>
                                                                    <Col>
                                                                        <BTN color="primary" onClick={() => this.confirmRenewal()}>Confirm Renewals</BTN>
                                                                    </Col>
                                                                </Row>
                                                            </Col>)
                                                            : (null)}
                                                    </Row>
                                                </Col>)
                                                :
                                                (<Col md="4">
                                                    <Row>
                                                        <Col md="6">
                                                            <p>Inception Date: {moment(this.state.inceptionDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
                                                        </Col>
                                                        <Col md="6">
                                                            <p>Renewal Date: {moment(this.state.renewalDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>)}

                                                {this.state.lastCompFreezeDate == "" || this.state.lastCompFreezeDate == "0000-00-00" || this.state.lastCompFreezeDate == "Invalid date" ?
                                                    null    
                                                    :  <p>Computation Freeze Date:{this.state.lastCompFreezeDate == "" || this.state.lastCompFreezeDate == "0000-00-00" || this.state.lastCompFreezeDate == "Invalid date" ? "" :this.state.lastCompFreezeDate /*moment(this.state.lastCompFreezeDate).format('DD-MM-YYYY')*/}</p>
                                                }
                                            
                                                        {(this.state.isUnConfirmRenewal) ?
                                                (<Col md='3'>
                                                    <Row>
                                                        <Col>
                                                            <BTN color="warning" onClick={() => this.unConfirmRenewal()}>UnConfirm Renewals</BTN>
                                                        </Col>
                                                    </Row>
                                                </Col>)
                                                : (null)}
                                        </Row>
                                        <Row>
                                            <Col md="2">
                                                <p>{t("policyDetails:Allvaluesarein")}{this.state.currency}.</p>
                                            </Col>
                                            <Col md="7">
                                            </Col>
                                            <Col md="3" style={{ textAlign: "right" }}>
                                                <Input type="select" name="PremiumType" id="PremiumType" onChange={(e) => this.selectType(e.target.value, 'PremiumType')} value={this.state.PremiumType} style={{ width: "fit-content", display: "inline-block", marginRight: 5 }}>
                                                    {this.state.PremiumTypeList.map((cl, i) => {
                                                        return (<option value={cl.StringMapKey}>{cl.StringMapName}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="PremiumTypeError" className="error invalid-feedback"></em>

                                                <BTN style={{ padding: '7px 10px' }} className="btn-sm" color="primary" onClick={() => this.showDynamicComputationPopup()} title={t("policyDetails:SummaryDetail")}>
                                                    <i className="fa fa-eye"></i>
                                                </BTN>

                                            </Col>
                                            <Col md="4">
                                                <Card>
                                                    <CardBody>
                                                        <div className="input-box">
                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:TotalSumInsured")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyTotalSumInsured}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:Rate")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{this.state.policyRate}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:Starting Premium")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyStartingPremium}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:Adjustments")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdjustments}</label>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                            <Col md="4">
                                                <Card>
                                                    <CardBody>
                                                        <div className="input-box">
                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:AdjustmentsPremium")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdjustmentsPremium}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:NoClaimBonus")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyNCB}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:LocalTax")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyLocalTax}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:AdminFees")}</label>
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdminFees}</label>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                            <Col md="4">
                                                <Card>
                                                    <CardBody>
                                                        <div className="input-box">
                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:AddOns")}</label>
                                                                </Col>

                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAddOns}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 8px", backgroundColor: '#008c9a', borderRadius: 7 }}>
                                                                <Col md="8">
                                                                    <label style={{ color: '#ffffff' }}>Gross Premium</label>
                                                                </Col>

                                                                <Col md="3">
                                                                    <label style={{ color: '#ffffff' }}>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyTotalDue}</label>
                                                                </Col>
                                                                {/* <Col md="1">
                                                                {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus))?
                                                                (
                                                                    <BTN style={{ padding: '0px 0px', fontSize: 14 }} className="btn-sm" color="primary" title="Total Due Suggestion"
                                                                        onClick={() => this.showTargetTotalDuePopup()}>
                                                                        <i className="fa fa-calculator"></i>
                                                                    </BTN>
                                                                ):(null)}
                                                                </Col> */}
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:Excess")}</label>
                                                                </Col>

                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyExcess}</label>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ padding: "3px 10px" }}>
                                                                <Col md="8">
                                                                    <label>{t("policyDetails:Commission")}</label>
                                                                </Col>

                                                                <Col md="4">
                                                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyCommission}</label>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>

                                </Collapse>
                            </Card>
                        </div>

                        <div className="input-box" id="WarningsMessagesReminders">
                            <Card className="mb-0">
                                <CardHeader id="headingOne">
                                    <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showWarningsMessagesReminders: !this.state.showWarningsMessagesReminders, showSummary: false })} aria-expanded={this.state.showWarningsMessagesReminders} aria-controls="collapseOne">
                                        <h5 className="m-0 p-0">
                                            {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                            {t("policyDetails:Notes")}
                                            <i style={{ float: 'right' }} className={this.state.showWarningsMessagesReminders ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                        </h5>
                                    </BTN>
                                </CardHeader>
                                <Collapse isOpen={this.state.showWarningsMessagesReminders} data-parent="#WarningsMessagesReminders" id="collapseOne" aria-labelledby="headingOne">
                                    <CardBody>
                                        <Row>
                                            <Col md="12">
                                                <Card style={{ border: 0, margin: 0 }}>
                                                    <CardBody style={{ padding: 0 }}>
                                                        <div className="input-box">
                                                            <Row style={{ padding: "3px 10px" }}>
                                                                {this.state.policyWarningMessagesReminders.length ? (
                                                                    <div>
                                                                        {this.state.policyWarningMessagesReminders.map((ct, i) => {
                                                                            return (
                                                                                <Col md="12">
                                                                                    <h5>
                                                                                        {ct.NotificationType == "Warning" ? (
                                                                                            <i className="fa fa-exclamation-triangle" title="Warning" style={{ marginRight: 10, color: "#FFCC00" }}></i>
                                                                                        ) : ct.NotificationType == "Reminder" ? (
                                                                                            <i className="fa fa-bell" title="Reminder" style={{ marginRight: 10 }}></i>
                                                                                        ) : ct.NotificationType == "Message" ? (
                                                                                            <i className="fa fa-commenting" title="Message" style={{ marginRight: 10 }}></i>
                                                                                        ) : (null)}
                                                                                        {ct.IsImportant.data[0] == 1 ? (
                                                                                            <i className="fa fa-exclamation-circle" title="Important" style={{ marginRight: 10, color: "#ec0606" }}></i>
                                                                                        ) : (null)}
                                                                                        <span>{ct.NotificationText}</span>
                                                                                    </h5>
                                                                                </Col>
                                                                            )
                                                                        })
                                                                        }
                                                                    </div>



                                                                ) : (null)}
                                                                {this.state.errorNote.length ? (
                                                                    <div>
                                                                        {this.state.errorNote.map((ct, i) => {
                                                                            return (
                                                                                <Col md="12">
                                                                                    <ul style={{ listStyle: "none" }}>
                                                                                        <li style={{ color: 'red' }}><i style={{ paddingRight: 10 }} className='fa fa-anchor'></i>{ct.NoteText}</li>
                                                                                    </ul>
                                                                                </Col>
                                                                            )
                                                                        })
                                                                        }
                                                                    </div>
                                                                ) : (null)}
                                                            </Row>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </div>

                        <Row style={{ marginTop: "20px" }}>
                            <Col md="12">
                                <Nav tabs>

                                    <NavItem>
                                        <NavLink active={this.state.activeTab === '1'} onClick={() => { this.toggle(0, '1'); }}>
                                            Details
										</NavLink>
                                    </NavItem>
                                    {
                                        (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ? (
                                            <NavItem>
                                                <NavLink active={this.state.activeTab === '2'} onClick={() => { this.toggle(0, '2'); }}>

                                                    {t("policyDetails:Endorsements")}
                                                </NavLink>
                                            </NavItem>
                                        ) : (null)
                                    }

                                    {
                                        (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ? (
                                            <NavItem>
                                                <NavLink active={this.state.activeTab === '3'} onClick={() => { this.toggle(0, '3'); }}>

                                                    {t("policyDetails:AddOnCoverage")}
                                                </NavLink>
                                            </NavItem>
                                        ) : (null)
                                    }
                                    <NavItem>
                                        <NavLink active={this.state.activeTab === '4'} onClick={() => { this.toggle(0, '4'); }}>
                                            {t("policyDetails:Account")}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink active={this.state.activeTab === '5'} onClick={() => { this.toggle(0, '5'); }}>
                                            {t("policyDetails:Timeline")}
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                {(this.state.policyNumber != null && this.state.policyNumber != "") ? (
                                    <TabContent activeTab={this.state.activeTab}>

                                        <TabPane tabId="1">

                                            <Nav tabs>
                                                {
                                                    (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ? (
                                                        <NavItem>
                                                            <NavLink active={this.state.activeSubTab === '1'} onClick={() => { this.toggle(0, '1', '1'); }}>

                                                                {t("policyDetails:Vessel")}
                                                            </NavLink>
                                                        </NavItem>
                                                    ) : (null)
                                                }

                                                <NavItem>
                                                    <NavLink active={this.state.activeSubTab === '2'} onClick={() => { this.toggle(0, '1', '2'); }}>
                                                        {t("policyDetails:Underwriting")}
                                                    </NavLink>
                                                </NavItem>

                                                {
                                                    (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ? (
                                                        <NavItem>
                                                            <NavLink active={this.state.activeSubTab === '3'} onClick={() => { this.toggle(0, '1', '3'); }}>
                                                                {t("policyDetails:General")}
                                                            </NavLink>
                                                        </NavItem>
                                                    ) : (null)
                                                }
                                                {
                                                    (this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ? (
                                                        <NavItem>
                                                            <NavLink active={this.state.activeSubTab === '4'} onClick={() => { this.toggle(0, '1', '4'); }}>
                                                                {t("policyDetails:Navigation")}
                                                            </NavLink>
                                                        </NavItem>
                                                    ) : (null)
                                                }
                                            </Nav>

                                            <TabContent activeTab={this.state.activeSubTab}>

                                                {/* START - Vessel  */}
                                                <TabPane tabId="1">

                                                    <Row>
                                                        <Col md="2" style={{ alignSelf: "center" }}>
                                                            <h6>Third Party Only<Input type="checkbox" name="TPO" id="TPO" value={this.state.TPO} style={{ marginLeft: "3px" }} checked={this.state.TPO == true ? "checked" : ""} onChange={(e) => this.handleChangeVessel(e)} />
                                                                <em id="TPOError" className="error invalid-feedback"></em>
                                                            </h6>
                                                        </Col>
                                                        <Col md="10">
                                                            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                                                                ?
                                                                (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                                                                    onClick={this.state.isVesselEdit ? () => this.editVessel("view") : () => this.editVessel("edit")}
                                                                    title={this.state.isVesselEdit ? "View" : "Edit"}
                                                                >
                                                                    <i className={this.state.isVesselEdit ? "fa fa-eye" : "fa fa-pencil"}></i>
                                                                </BTN>)
                                                                : (null)}


                                                            <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
                                                                onClick={(this.state.isExpand) ? () => this.toggleAll('collapse') : () => this.toggleAll('expand')}
                                                            >
                                                                <i className={(this.state.isExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
                                                            </BTN>
                                                        </Col>
                                                    </Row>

                                                    <div className="input-box" id="vesselDetails">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(0)} aria-expanded={this.state.custom[0]} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        Vessel <i style={{ float: 'right' }} className={this.state.custom[0] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.custom[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            {(this.state.isEditClassType) ? (
                                                                                <div className="input-box">
                                                                                    <label>Vessel Class *</label>
                                                                                    <Select name="vesselClass" id="vesselClass" options={this.state.VesselClassList} value={this.state.vesselClass} onChange={(data) => this.selectVesselClass(data, 'vesselClass')} placeholder="Select Vessel class"
                                                                                    />
                                                                                    <em id="vesselClassError" className="error invalid-feedback"></em>
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
                                                                                    <Select name="vesselType" id="vesselType" options={this.state.vesselTypeList} value={this.state.vesselType} onChange={(data) => this.selectVesselClass(data, 'vesselType')} placeholder="Select vessel type"
                                                                                    />
                                                                                    <em id="vesselTypeError" className="error invalid-feedback"></em>
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselnameLabel}</label>
                                                                                    <Input type="text" name="vesselName" id="vesselName" maxLength="50"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} value={this.state.vesselName}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselbuildTypeLabel}</label>
                                                                                    <Input type="select" name="vesselBuildType" id="vesselBuildType"
                                                                                        value={this.state.vesselBuildType} onChange={(e) => this.selectTypeVessel(e.target.value, 'vesselBuildType')} >
                                                                                        <option value=''>Select build type</option>
                                                                                        {this.state.vesselBuildTypearr.map((type, i) => {
                                                                                            return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselmodelLabel}</label>
                                                                                    <Input type="text" name="vesselModel" id="vesselModel" maxLength="50"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} value={this.state.vesselModel}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselbuiltYearLabel}</label>
                                                                                    <Input type="text" name="vesselBuiltYear" id="vesselBuiltYear"
                                                                                        maxLength="4" onChange={(e) => this.handleChangeVessel(e)} onBlur={(e) => this.saveRateableParam('YearBuilt', e.target.value)} value={this.state.vesselBuiltYear}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                                    {(this.state.liabilityType != 'TPO' && this.state.showSurveyDueData) ?
                                                                        <>
                                                                        <Col md="6">
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vessellastSurveyDateLabel}</label>
                                                                                    <InputGroup>
                                                                                        <Input type="date" name="vesselLastSurveyDate" id="vesselLastSurveyDate" placeholder={this.state.vessellastSurveyDateLabel}
                                                                                            value={this.state.vesselLastSurveyDate}
                                                                                            onBlur={(e) => this.handleChangeVessel(e)}
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
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

                                                                            <Col md="6">
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.vesselsurveyDueDateLabel} *</label>
                                                                                        <InputGroup>
                                                                                            <Input type="date"
                                                                                                name="vesselSurveyDueDate"
                                                                                                id="vesselSurveyDueDate"
                                                                                                placeholder={this.state.vesselsurveyDueDateLabel}
                                                                                                value={this.state.vesselSurveyDueDate}
                                                                                                onBlur={(e) => this.handleChangeVessel(e)}
                                                                                                onChange={(e) => this.handleChangeVessel(e)}
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
                                                                            </Col>
                                                                        </>
                                                                            : (null)}

                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.serialnoLabel}</label>
                                                                                    <Input type="text" name="serialNo" id="serialNo" maxLength="50"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} value={this.state.serialNo}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselhullMaterialLabel}</label>
                                                                                    <Input type="select" name="vesselHullMaterial" id="vesselHullMaterial"
                                                                                        onChange={(e) => this.selectTypeVessel(e.target.value, 'vesselHullMaterial')} value={this.state.vesselHullMaterial} >
                                                                                        <option value=''>Select hull material</option>
                                                                                        {this.state.vesselHullMaterialarr.map((type, i) => {
                                                                                            return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vessellengthLabel}</label>
                                                                                    <Input type="text" name="vesselLength" id="vesselLength" maxLength="6"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} onBlur={(e) => this.saveRateableParam('Length', e.target.value)} value={this.state.vesselLength}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselpurchasePriceLabel}({<i className={this.state.CurrencySymbol}></i>})*</label>
                                                                                    <Input type="text" name="vesselPurchasePrice" id="vesselPurchasePrice" maxLength="15"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} value={this.state.vesselPurchasePrice}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
                                                                                    >
                                                                                    </Input>
                                                                                    <em className="error invalid-feedback" >Please enter purchase price</em>
                                                                                </div>
                                                                            ) : (
                                                                                    <div>
                                                                                        <label>{this.state.vesselpurchasePriceLabel}({<i className={this.state.CurrencySymbol}></i>})*</label>
                                                                                        <span style={{ marginLeft: 10 }}>{this.state.vesselPurchasePrice}</span>
                                                                                    </div>
                                                                                )}
                                                                        </Col>
                                                                    </Row>

                                                                    <Row>
                                                                        <Col md="6">
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesseluseOfVesselLabel}</label>
                                                                                    <Input type="select" name="vesselUseOfVessel" id="vesselUseOfVessel"
                                                                                        onChange={(e) => this.selectTypeVessel(e.target.value, 'vesselUseOfVessel')} value={this.state.vesselUseOfVessel} >
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
                                                                            {(this.state.isVesselEdit) ? (
                                                                                <div className="input-box">
                                                                                    <label>{this.state.vesselyearPurchasedLabel}</label>
                                                                                    <Input type="text" name="vesselYearPurchased" id="vesselYearPurchased" maxLength="4"
                                                                                        onChange={(e) => this.handleChangeVessel(e)} value={this.state.vesselYearPurchased}
                                                                                    // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                    </div>

                                                    {(this.state.isDisplayEngine == 1)
                                                        ?
                                                        (<div className="input-box" id="engineAndTrailerDetails">
                                                            <Card className="mb-0">
                                                                <CardHeader id="headingTwo">
                                                                    <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(1)} aria-expanded={this.state.custom[1]} aria-controls="collapseTwo">
                                                                        <h5 className="m-0 p-0">
                                                                            Engine and Trailer Details <i style={{ float: 'right' }} className={this.state.custom[1] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                        </h5>
                                                                    </BTN>
                                                                </CardHeader>

                                                                <Collapse isOpen={this.state.custom[1]} data-parent="#accordion" id="collapseTwo" aria-labelledby="headingTwo">
                                                                    <CardBody>
                                                                        <Row>
                                                                            <Col md="3">
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.mainengineLabel}</label>
                                                                                        <Input type="text" name="mainEngine" id="mainEngine" maxLength="50"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.mainEngine} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.mainengineHpLabel}</label>
                                                                                        <Input type="text" name="mainEngineHp" id="mainEngineHp" maxLength="5"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.mainEngineHp} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.mainengineYearLabel}</label>
                                                                                        <Input type="text" name="mainEngineYear" id="mainEngineYear" maxLength="4"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.mainEngineYear} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.mainengineSerialNoLabel}</label>
                                                                                        <Input type="text" name="mainEngineSerialNo" id="mainEngineSerialNo"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.mainEngineSerialNo} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.noOfengineLabel}</label>
                                                                                        <Input type="select" name="noOfEngine" id="noOfEngine"
                                                                                            value={this.state.noOfEngine} onChange={(e) => this.selectTypeVessel(e.target.value, 'noOfEngine')} >
                                                                                            <option value=''>Select</option>
                                                                                            {this.state.noOfEnginearr.map((type, i) => {
                                                                                                return (<option value={type.StringMapKey} key={i}>{type.StringMapName}</option>)
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.tarnsmissionmainengineLabel}</label>
                                                                                        <Input type="select" name="tarnsmissionMainEngine" id="tarnsmissionMainEngine"
                                                                                            value={this.state.tarnsmissionMainEngine} onChange={(e) => this.selectTypeVessel(e.target.value, 'tarnsmissionMainEngine')} >
                                                                                            <option value=''>Select transmission</option>
                                                                                            {this.state.tarnsmissionMainEnginearr.map((type, i) => {
                                                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryengineLabel}</label>
                                                                                        <Input type="select" name="auxiliaryEngine" id="auxiliaryEngine"
                                                                                            value={this.state.auxiliaryEngine} onChange={(e) => this.selectTypeVessel(e.target.value, 'auxiliaryEngine')} >
                                                                                            <option value=''>Select auxiliary engine</option>
                                                                                            {this.state.auxiliaryEnginearr.map((type, i) => {
                                                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryEngineHpLabel}</label>
                                                                                        <Input type="text" name="auxiliaryEngineHp" id="auxiliaryEngineHp" maxLength="5"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.auxiliaryEngineHp} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryEngineYearLabel}</label>
                                                                                        <Input type="text" name="auxiliaryEngineYear" id="auxiliaryEngineYear" maxLength="4"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.auxiliaryEngineYear} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryEngineSerialNoLabel}</label>
                                                                                        <Input type="text" name="auxiliaryEngineSerialNo" id="auxiliaryEngineSerialNo"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.auxiliaryEngineSerialNo} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryEngineNoEngineLabel}</label>
                                                                                        <Input type="select" name="auxiliaryEngineNoEngine" id="auxiliaryEngineNoEngine"
                                                                                            value={this.state.auxiliaryEngineNoEngine} onChange={(e) => this.selectTypeVessel(e.target.value, 'auxiliaryEngineNoEngine')} >
                                                                                            <option value=''>Select</option>
                                                                                            {this.state.auxiliaryEngineNoEnginearr.map((type, i) => {
                                                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.auxiliaryEngineTransmissionLabel}</label>
                                                                                        <Input type="select" name="auxiliaryEngineTransmission" id="auxiliaryEngineTransmission"
                                                                                            value={this.state.auxiliaryEngineTransmission} onChange={(e) => this.selectTypeVessel(e.target.value, 'auxiliaryEngineTransmission')} >
                                                                                            <option value=''>Select transmission</option>
                                                                                            {this.state.auxiliaryEngineTransmissionarr.map((type, i) => {
                                                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.maxSpeedLabel}</label>
                                                                                        <Input type="text" name="maxSpeed" id="maxSpeed"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} onBlur={(e) => this.saveRateableParam('MaxSpeed', e.target.value)} value={this.state.maxSpeed} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.makeofTrailerLabel}</label>
                                                                                        <Input type="text" name="makeofTrailer" id="makeofTrailer" maxLength="50"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.makeofTrailer} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.trailerSerialNoLabel}</label>
                                                                                        <Input type="text" name="trailerSerialNo" id="trailerSerialNo" maxLength="50"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.trailerSerialNo} >
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
                                                        </div>)
                                                        : (null)
                                                    }

                                                    {(this.state.isDisplayEngine == 1)
                                                        ?
                                                        (<div className="input-box" id="tenderAuxiliaryVessel">
                                                            <Card className="mb-0">
                                                                <CardHeader id="headingThree">
                                                                    <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(2)} aria-expanded={this.state.custom[2]} aria-controls="collapseThree">
                                                                        <h5 className="m-0 p-0">
                                                                            Tender/Auxiliary Vessel <i style={{ float: 'right' }} className={this.state.custom[2] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                        </h5>
                                                                    </BTN>
                                                                </CardHeader>

                                                                <Collapse isOpen={this.state.custom[2]} data-parent="#accordion" id="collapseThree" aria-labelledby="headingThree">
                                                                    <CardBody>
                                                                        <Row>
                                                                            <Col md="3">
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.tenderVesselMakeLabel}</label>
                                                                                        <Input type="text" name="tenderVesselMake" id="tenderVesselMake" maxLength="200"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.tenderVesselMake} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.tenderVesselYearLabel}</label>
                                                                                        <Input type="text" name="tenderVesselYear" id="tenderVesselYear" maxLength="4"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.tenderVesselYear} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.tenderVesselLengthLabel}</label>
                                                                                        <Input type="text" name="tenderVesselLength" id="tenderVesselLength" maxLength="6"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.tenderVesselLength} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.tenderVesselMaterialLabel}</label>
                                                                                        <Input type="select" name="tenderVesselMaterial" id="tenderVesselMaterial"
                                                                                            onChange={(e) => this.selectTypeVessel(e.target.value, 'tenderVesselMaterial')} value={this.state.tenderVesselMaterial} >
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.makeAndModelOfEngineLabel}</label>
                                                                                        <Input type="text" name="makeAndModelOfEngine" id="makeAndModelOfEngine"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.makeAndModelOfEngine}
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
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div className="input-box">
                                                                                        <label>{this.state.makeAndModelOfEngineHPLabel}</label>
                                                                                        <Input type="text" name="makeAndModelOfEngineHP" id="makeAndModelOfEngineHP"
                                                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.makeAndModelOfEngineHP}
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
                                                        </div>)
                                                        : (null)
                                                    }

                                                    <div className="input-box" id="sumInsured">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingFour">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleCustom(3)} aria-expanded={this.state.custom[3]} aria-controls="collapseFour">
                                                                    <h5 className="m-0 p-0">
                                                                        Sum Insured <i style={{ float: 'right' }} className={this.state.custom[3] ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.custom[3]} data-parent="#accordion" id="collapseFour" aria-labelledby="headingFour">
                                                                <CardBody>
                                                                    <div className="input-box">
                                                                        <Row>
                                                                            <Col>
                                                                                <label>{this.state.sumInsuredMethodLabel}({<i className={this.state.CurrencySymbol}></i>})*</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="select" name="sumInsuredMethod" id="sumInsuredMethod"
                                                                                            onChange={(e) => this.selectTypeVessel(e.target.value, 'sumInsuredMethod')} value={this.state.sumInsuredMethod} >
                                                                                            <option value=''>Select sum insured method</option>
                                                                                            {this.state.sumInsuredMethodarr.map((type, i) => {
                                                                                                return (<option value={type.StringMapName} key={i}>{type.Description}</option>)
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
                                                                                <label>{this.state.hullInboardMachineLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="hullInboardMachine" id="hullInboardMachine"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => (
                                                                                                this.calculateSumInsuredOnBlur(), this.saveRateableParam('HullAndInboardMachineryAmount', e.target.value)
                                                                                            )}
                                                                                            value={this.state.hullInboardMachine} >
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
                                                                                <label>{this.state.tenderDinghyLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="tenderDinghy" id="tenderDinghy"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.tenderDinghy} >
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
                                                                                <label>{this.state.lifeRaftLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="lifeRaft" id="lifeRaft"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.lifeRaft} >
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
                                                                                <label>{this.state.outboard1Label}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="outboard1" id="outboard1"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.outboard1} >
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
                                                                                <label>{this.state.outboard2Label}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="outboard2" id="outboard2"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.outboard2} >
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
                                                                                <label>{this.state.roadTrailerLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="roadTrailer" id="roadTrailer"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.roadTrailer} >
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
                                                                                <label>{this.state.personalEffectsLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col md="6">
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="personalEffects" id="personalEffects"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.personalEffects} >
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
                                                                                <label>{this.state.navigationalEquipLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col md="6">
                                                                                <Row md="12">
                                                                                    <Col md="8">
                                                                                        {(this.state.isVesselEdit) ? (
                                                                                            <div>
                                                                                                <Input type="text" name="navigationalEquip" id="navigationalEquip"
                                                                                                    onChange={(e) => this.handleChangeVessel(e)}
                                                                                                    onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                                    value={this.state.navigationalEquip} >
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
                                                                                                <div>
                                                                                                    <a href="javascript:void(0)" onClick={() => this.openModelForPersonalEffects()}>Itemised Breakup</a>
                                                                                                </div>
                                                                                            )}
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                    <div className="input-box">
                                                                        <Row md="12">
                                                                            <Col md="6">
                                                                                <label>{this.state.SailsCanopyCoversHeaders}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col md="6">
                                                                                <Row md="12">
                                                                                    <Col md="8">
                                                                                        {(this.state.isVesselEdit) ? (
                                                                                            <div>
                                                                                                <Input type="text" name="sumInsuredSails" id="sumInsuredSails"
                                                                                                    onChange={(e) => this.handleChangeVessel(e)}
                                                                                                    onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                                    value={this.state.sumInsuredSails} >
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
                                                                                                <div>
                                                                                                    <a href="javascript:void(0)" onClick={() => this.openModelSailsCanopyCovers()}>Itemised Breakup</a>
                                                                                                </div>
                                                                                            )}
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                    <div className="input-box">
                                                                        <Row>
                                                                            <Col>
                                                                                <label>{this.state.portableGeneratorLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>
                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="portableGenerator" id="portableGenerator"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.portableGenerator} >
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
                                                                                <label>{this.state.customCoverageLabel}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                            </Col>

                                                                            <Col>
                                                                                {(this.state.isVesselEdit) ? (
                                                                                    <div>
                                                                                        <Input type="text" name="customCoverage" id="customCoverage"
                                                                                            onChange={(e) => this.handleChangeVessel(e)}
                                                                                            onBlur={(e) => this.calculateSumInsuredOnBlur()}
                                                                                            value={this.state.customCoverage} >
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
                                                                                <h5><b>{<i className={this.state.CurrencySymbol}></i>}{this.state.totalSumInsuredValue}</b></h5>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </CardBody>
                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    <Row style={{ marginTop: 10 }}>
                                                        <Col md="12" style={{ textAlign: "center" }}>
                                                            <p id="ItemisedBreakupErrorNav" style={{ display: "none", color: "red" }}>Itemised Breakup of Navigational Equipment Doesn't match</p>
                                                        </Col>

                                                        <Col md="12" style={{ textAlign: "center" }}>
                                                            <p id="ItemisedBreakupErrorSail" style={{ display: "none", color: "red" }}>Itemised Breakup of Sails, Canopy & Covers Doesn't match</p>
                                                        </Col>
                                                    </Row>

                                                </TabPane>
                                                {/* END - Vessel  */}

                                                {/* START - Underwriting  */}
                                                <TabPane tabId="2">

                                                    <Row>
                                                        <Col md="12">
                                                            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                                                                ? (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                                                                    onClick={this.state.isUnderwritingEdit ? () => this.editUnderwriting('view') : () => this.editUnderwriting('edit')} title={this.state.isUnderwritingEdit ? "View" : "Edit"}>
                                                                    <i className={this.state.isUnderwritingEdit ? "fa fa-eye" : "fa fa-pencil"}></i>
                                                                </BTN>)
                                                                : (null)}

                                                            <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isUnderwrittingExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
                                                                onClick={(this.state.isUnderwrittingExpand) ? () => this.toggleAllUnderwriting('collapse') : () => this.toggleAllUnderwriting('expand')}
                                                            >
                                                                <i className={(this.state.isUnderwrittingExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
                                                            </BTN>
                                                        </Col>
                                                    </Row>

                                                    <div className="input-box" id="PolicyDates">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleUnderwriting('PolicyDates')} aria-expanded={this.state.showPolicyDates} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyUnderwriting:PolicyDates#")}
                                                                        <i style={{ float: 'right' }} className={this.state.showPolicyDates ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showPolicyDates} data-parent="#PolicyDates" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    <Row style={{ width: "100%" }}>
                                                                        <Col md="6">
                                                                            <span>{t("policyUnderwriting:Policy")}</span>
                                                                            <Card>
                                                                                <CardBody>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:UnderWritingPolicyNumber")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                <div>
                                                                                                    <p>{this.state.PolicyNumber}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:Binder.label")}*</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <AutoComplete value={this.state.binder} id='binder' onChange={(e) => this.setState({ binder: e.value },
                                                                                                            this.changeBinder(e.value))} suggestions={this.state.binderSuggestions} completeMethod={this.suggestBinder.bind(this)} />
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:Binder.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.binder}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                            {/* <Col md="1">
                                                            <BTN title='View' style={{ float: "right" }} color="primary" onClick={() => this.showBinderDetails()}>
                                                                <i className="fa fa-eye"></i>
                                                            </BTN>
                                                        </Col> */}
                                                                                        </Row>
                                                                                    </div>

                                                                                    {(this.state.isDisplayNext ? (
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="3">
                                                                                                    <label>Next Binder</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    <div>
                                                                                                        <p>{this.state.nextBinder}</p>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    ) : (null))}

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:SubBinder.label")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <AutoComplete id='subBinder' value={this.state.subBinder} onChange={(e) => this.setState({ subBinder: e.value }, this.changesubBinder(e.value))}
                                                                                                            suggestions={this.state.subbinderSuggestions} completeMethod={this.suggestsubBinder.bind(this)} />
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:SubBinder.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.subBinder}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:InsuranceComapny.label")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                <div>
                                                                                                    <p>{this.state.insuranceComapny}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    {(this.state.isDisplayNext ? (
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="3">
                                                                                                    <label>Next Insurance Company</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    <div>
                                                                                                        <p>{this.state.nextInsuranceComapny}</p>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    ) : (null))}

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:Department.label")}*</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="select" name="department" disabled={this.state.departmentDisable == true ? true : false} id="department" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'department')} value={this.state.department}>
                                                                                                            <option value=''>{t("policyUnderwriting:Department.defaultValue")}</option>
                                                                                                            {this.state.departmentList.map((ct, i) => {
                                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                            })
                                                                                                            }
                                                                                                        </Input>
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:Department.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.departmentName}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                        {/*-------------------- LEad Data ----------------------*/}
                                                                                {this.state.branchName != ''?
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="9">
                                                                                                <div>
                                                                                                    <p>{this.state.branchName}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                 : null}
                                                                                {this.state.sourceType != '' ?
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="9">
                                                                                                <Row>
                                                                                                <Col md='12'>
                                                                                                    <p>{this.state.sourceType} - {this.state.leadSourceName}</p>
                                                                                                </Col>
                                                                                                </Row>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                : null }
                                                                                    {(this.state.department == 'ServiceCenter' || this.state.department == 'SubAgent') ? (
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="3">
                                                                                                    <label>{t("policyUnderwriting:Source.label")}*</label>
                                                                                                </Col>
                                                                                                <Col md="9">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Select name="source" id="source" options={this.state.sourceList}
                                                                                                                value={this.state.source} onChange={(data) => this.selectTypeUnderwriting(data.value, 'source')}
                                                                                                                placeholder={t("policyUnderwriting:Source.defaultValue")}
                                                                                                                disabled={this.state.sourceDisable == true ? true : false} />
                                                                                                            <em id="sourceError" className="error invalid-feedback">{t("policyUnderwriting:Source.error")}</em>

                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.sourceName}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    ) : (null)}

                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>

                                                                        <Col md="6">
                                                                            <span>{t("policyUnderwriting:Dates")}</span>
                                                                            <Card>
                                                                                <CardBody>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:InceptionDate.label")}*</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isInceptionEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="date" name="inceptionDate" id="inceptionDate"
                                                                                                            placeholder="Inception Date"
                                                                                                            style={{ width: '50%', display: "inline-block" }}
                                                                                                            onBlur={(e) => (
                                                                                                                this.saveRateableParam('InceptionDate', e.target.value), this.saveRateableParam('RenewalDate', moment(e.target.value).add(365, 'days').format('YYYY-MM-DD')), this.saveInceptionRenewalDate(0)
                                                                                                            )}
                                                                                                            onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                            value={this.state.inceptionDate}
                                                                                                        />
                                                                                                        {/* <Input type="date" name="inceptionDate" id="inceptionDate" placeholder="Inception Date"
                                                                                                            onBlur={(e) => this.handleChangeUnderwriting(e)} onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                            value={this.state.inceptionDate} 
                                                                                                        /> */}
                                                                                                        {/* // value={moment(this.state.inceptionDate).format('YYYY-MM-DD')} /*min={moment().format('YYYY-MM-DD')}*/}
                                                                                                        {(this.state.inceptionDateError == true) ? (
                                                                                                            <em className="error invalid-feedback" >{t("policyUnderwriting:InceptionDate.error")}</em>
                                                                                                        ) : (null)}
                                                                                                        <BTN color="success" onClick={() => this.saveInceptionRenewalDate(0)} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-check"></i>
                                                                                                        </BTN>
                                                                                                        <BTN color="danger" onClick={() => this.cancelInceptionRenewalDate(0)} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-times"></i>
                                                                                                        </BTN>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            {moment(this.state.inceptionDate).format('DD/MM/YYYY')}
                                                                                                            {/* <p>{(this.state.inceptionDate !== '' && this.state.inceptionDate !== 'Invalid date') ? moment(this.state.inceptionDate).format('DD/MM/YYYY') : ''}</p> */}
                                                                                                            {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                                                                                                <BTN color="primary" onClick={() => this.editInceptionRenewalDate(0)} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                                    <i className="fa fa-pencil"></i>
                                                                                                                </BTN>
                                                                                                            ) : (null)}
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:RenewDate")}*</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isRenewalEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="date" name="renewalDate" id="renewalDate"
                                                                                                            placeholder="Renewal Date"
                                                                                                            style={{ width: '50%', display: "inline-block" }}
                                                                                                            onBlur={(e) => (
                                                                                                                this.saveRateableParam('RenewalDate', e.target.value), this.saveInceptionRenewalDate(1)
                                                                                                            )}
                                                                                                            onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                            value={this.state.renewalDate}
                                                                                                        />
                                                                                                        {(this.state.renewalDateError == true) ? (
                                                                                                            <em className="error invalid-feedback" >Please enter Renewal Date</em>
                                                                                                        ) : (null)}

                                                                                                        <BTN color="success" onClick={() => this.saveInceptionRenewalDate(1)} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-check"></i>
                                                                                                        </BTN>
                                                                                                        <BTN color="danger" onClick={() => this.cancelInceptionRenewalDate(1)} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-times"></i>
                                                                                                        </BTN>

                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            {moment(this.state.renewalDate).format('DD/MM/YYYY')}
                                                                                                            {/* <p>{this.state.renewalDate}</p> */}
                                                                                                            {CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) ? (
                                                                                                                <BTN color="primary" onClick={() => this.editInceptionRenewalDate(1)} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                                    <i className="fa fa-pencil"></i>
                                                                                                                </BTN>
                                                                                                            ) : (null)}
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:LastBindDate")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">

                                                                                                {(this.state.isLastBindEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="date" name="lastBindDate" id="lastBindDate"
                                                                                                            placeholder="Last Bind Date"
                                                                                                            style={{ width: '50%', display: "inline-block" }}
                                                                                                            // onBlur={(e) => this.saveRateableParam('RenewalDate', e.target.value)}
                                                                                                            onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                            value={this.state.lastBindDate}
                                                                                                        />
                                                                                                        <em id="lastBindDateError" className="error invalid-feedback" ></em>

                                                                                                        <BTN color="success" onClick={() => this.saveLastBindDate()} title="Save Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-check"></i>
                                                                                                        </BTN>
                                                                                                        <BTN color="danger" onClick={() => this.cancelLastBindDate()} title="Cancel Bind Date Change" style={{ marginLeft: '5px', padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-times"></i>
                                                                                                        </BTN>


                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            {moment(this.state.lastBindDate).format('DD/MM/YYYY')}

                                                                                                            {(CommonConfig.isEmpty(this.state.lastBindDate) || !CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus)) ?
                                                                                                                (null) : (
                                                                                                                    <BTN color="primary" onClick={() => this.editLastBindDate()} title="Change Bind Date" style={{ marginLeft: '10px', padding: "1px 5px" }}>
                                                                                                                        <i className="fa fa-pencil"></i>
                                                                                                                    </BTN>
                                                                                                                )}
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:YearBuilt")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                <div>
                                                                                                    <p>{this.state.yearBuilt}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                    {(this.state.liabilityType != 'TPO' && this.state.showSurveyDueData) ?
                                                                                        (<div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="3" style={{ padding: 0 }}>
                                                                                                    <label>{t("policyUnderwriting:SurveyDueDate")}</label>
                                                                                                </Col>
                                                                                                <Col md="9">
                                                                                                    <div>
                                                                                                        <p>{this.state.surveyDueDate ? moment(this.state.surveyDueDate).format('DD/MM/YYYY') : ""}</p>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>)
                                                                                        : (null)}
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>

                                                                </CardBody>

                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    <div className="input-box" id="PolicyOptionsAdjustments">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleUnderwriting('PolicyOptionsAdjustments')} aria-expanded={this.state.showPolicyOptionsAdjustments} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyUnderwriting:PolicyOptionsAdjustments")}
                                                                        <i style={{ float: 'right' }} className={this.state.showPolicyOptionsAdjustments ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showPolicyOptionsAdjustments} data-parent="#PolicyOptionsAdjustments" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    <Row style={{ width: "100%" }}>
                                                                        {(this.state.PolicyType != 'MarineTrade' && this.state.PolicyType != 'MultiVessel') ?
                                                                            (<Col md="6">
                                                                                <span>{t("policyUnderwriting:PolicyOptions")}</span>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="4">
                                                                                                    <label>{t("policyUnderwriting:AwaitingDocuments.label")}</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Input type="select" name="awaitingDocuments" id="awaitingDocuments" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'awaitingDocuments')} value={this.state.awaitingDocuments}>
                                                                                                                <option value=''>{t("policyUnderwriting:AwaitingDocuments.defaultValue")}</option>
                                                                                                                {this.state.awaitingDocumentList.map((ct, i) => {
                                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                })
                                                                                                                }
                                                                                                            </Input>
                                                                                                            <em className="error invalid-feedback" >{t("policyUnderwriting:AwaitingDocuments.error")}</em>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.awaitingDocuments}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>

                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="4">
                                                                                                    <label>{t("policyUnderwriting:PremiumCredits.label")}</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Input type="select" name="premiumCredits" id="premiumCredits" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'premiumCredits')} value={this.state.premiumCredits}>
                                                                                                                <option value=''>{t("policyUnderwriting:PremiumCredits.defaultValue")}</option>
                                                                                                                {this.state.premiumCreditList.map((ct, i) => {
                                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                })
                                                                                                                }
                                                                                                            </Input>
                                                                                                            <em className="error invalid-feedback" >{t("policyUnderwriting:PremiumCredits.error")}</em>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.premiumCredits}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    </CardBody>
                                                                                </Card>

                                                                                <span>Current NCB</span>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="4">
                                                                                                    <label>{t("policyGeneral:currentNCB.noofYears")} *</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Input type="select" name="currentNCBYears" id="currentNCBYears" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'currentNCBYears')} value={this.state.currentNCBYears}>
                                                                                                                <option value=''>{t("policyGeneral:currentNCB.noofYearsDefaultValue")}</option>
                                                                                                                {this.state.currentNCBNoofYearsList.map((ct, i) => {
                                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                })}
                                                                                                            </Input>
                                                                                                            <em className="error invalid-feedback" >{t("policyGeneral:currentNCB.noofYearsError")}</em>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.currentNCBYears}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>

                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="4">
                                                                                                    <label>{t("policyGeneral:currentNCB.NCBAmount")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Input type="text" placeholder={t("policyGeneral:currentNCB.NCBAmountPlaceholder")} name="currentNCBAmount" id="currentNCBAmount" onChange={(e) => this.handleChangeUnderwriting(e)} value={this.state.currentNCBAmount}>
                                                                                                            </Input>
                                                                                                            <em className="error invalid-feedback" >{t("policyGeneral:currentNCB.NCBAmountError")}</em>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.currentNCBAmount}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>)
                                                                            : (null)}

                                                                        <Col md="6">
                                                                            <span>{t("policyUnderwriting:Adjustments")}</span>
                                                                            <Card>
                                                                                <CardBody>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:UnderWriter.label")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="text" name="underWriter" id="underWriter" onChange={(e) => this.handleChangeUnderwriting(e)} onBlur={(e) => this.saveRateableParam('UnderwriterAmount', e.target.value)} value={this.state.underWriter}>
                                                                                                        </Input>
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:UnderWriter.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.underWriter}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:Note.label")}</label>
                                                                                            </Col>
                                                                                            <Col md="9">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="text" name="note" id="note" onChange={(e) => this.handleChangeUnderwriting(e)} maxLength="200" value={this.state.note}>
                                                                                                        </Input>
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:Note.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.note}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>
                                                                </CardBody>

                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    <div className="input-box" id="LimitsAdditionalCoverCommissionFeesandLevy">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleUnderwriting('LimitsAdditionalCoverCommissionFeesandLevy')} aria-expanded={this.state.showLimitsAdditionalCoverCommissionFeesandLevy} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyUnderwriting:LimitsAdditionalCoverCommissionFeesandLevy#")}
                                                                        <i style={{ float: 'right' }} className={this.state.showLimitsAdditionalCoverCommissionFeesandLevy ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showLimitsAdditionalCoverCommissionFeesandLevy} data-parent="#LimitsAdditionalCoverCommissionFeesandLevy" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    <Row style={{ width: "100%" }}>
                                                                        {(this.state.PolicyType != 'MarineTrade' && this.state.PolicyType != 'MultiVessel') ?
                                                                            (<Col md="6">
                                                                                <span>{t("policyUnderwriting:LimitsAdditionalCover")}</span>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        <div className="input-box">
                                                                                            <Row>
                                                                                                <Col md="4">
                                                                                                    <label>{t("policyUnderwriting:ThirdPartyLiability.label")}({<i className={this.state.CurrencySymbol}></i>})*</label>
                                                                                                </Col>
                                                                                                <Col md="8">
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <div>
                                                                                                            <Input type="select" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                                                                                                <option value=''>{t("policyUnderwriting:ThirdPartyLiability.defaultValue")}</option>
                                                                                                                {this.state.thirdPartyLiabilityList.map((ct, i) => {
                                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                })
                                                                                                                }
                                                                                                            </Input>
                                                                                                            <em className="error invalid-feedback" >{t("policyUnderwriting:ThirdPartyLiability.error")}</em>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                            <div>
                                                                                                                <p>{this.state.thirdPartyLiability}</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                        {(this.state.DisplayWater == 1) ?
                                                                                            (
                                                                                                <div>
                                                                                                    <div className="input-box">
                                                                                                        <Row>
                                                                                                            <Col md="4">
                                                                                                                <label>{t("policyUnderwriting:WaterSkiingLiability.label")}</label>
                                                                                                            </Col>
                                                                                                            <Col md="8">
                                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                                    <div>
                                                                                                                        <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleCheckboxUnderwriting(e)} value={this.state.isWaterSkiing} checked={this.state.isWaterSkiing == true} />

                                                                                                                        {this.state.isWaterSkiing ? (
                                                                                                                            <div>
                                                                                                                                <p>Amount: {this.state.waterSkiingLiability}</p>
                                                                                                                            </div>
                                                                                                                        ) : (null)}
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                        <div>
                                                                                                                            {this.state.isWaterSkiing ? (
                                                                                                                                <p> {this.state.waterSkiingLiability}</p>
                                                                                                                            ) : (null)}
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                    </div>

                                                                                                    <div className="input-box">
                                                                                                        <Row>
                                                                                                            <Col md="4">
                                                                                                                <label>{t("policyUnderwriting:WaterToysLiabiility.label")}</label>
                                                                                                            </Col>
                                                                                                            <Col md="8">
                                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                                    <div>
                                                                                                                        <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleCheckboxUnderwriting(e)} value={this.state.isWaterToys} checked={this.state.isWaterToys == true} />

                                                                                                                        {this.state.isWaterToys ? (
                                                                                                                            <div>
                                                                                                                                <p>Amount: {this.state.waterToysLiability}</p>
                                                                                                                            </div>
                                                                                                                        ) : (null)}
                                                                                                                    </div>

                                                                                                                ) : (
                                                                                                                        <div>
                                                                                                                            {this.state.isWaterToys ? (
                                                                                                                                <p>{this.state.waterToysLiability}</p>
                                                                                                                            ) : (null)}
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (null)}
                                                                                        {(this.state.DisplayRacing == 1) ?
                                                                                            (
                                                                                                <div>
                                                                                                    <div className="input-box">
                                                                                                        <Row>
                                                                                                            <Col md="4">
                                                                                                                <label>{t("policyUnderwriting:SailRacingCoverage.label")}</label>
                                                                                                            </Col>
                                                                                                            <Col md="8">
                                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                                    <div>
                                                                                                                        <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleCheckboxUnderwriting(e)} value={this.state.isSailRacing} checked={this.state.isSailRacing === true} />

                                                                                                                        {this.state.isSailRacing ? (
                                                                                                                            <div>
                                                                                                                                <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChangeUnderwriting(e)} onBlur={(e) => this.saveRateableParam('SailRacingCoverageAmount', e.target.value)} value={this.state.sailRacingCoverage}>
                                                                                                                                </Input>
                                                                                                                                <em className="error invalid-feedback" >{t("policyUnderwriting:SailRacingCoverage.error")}</em>
                                                                                                                            </div>
                                                                                                                        ) : (null)}
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                        <div>
                                                                                                                            {this.state.isSailRacing ? (
                                                                                                                                <p>{this.state.sailRacingCoverage}</p>
                                                                                                                            ) : (null)}
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                    </div>

                                                                                                    <div className="input-box">
                                                                                                        <Row>
                                                                                                            <Col md="4">
                                                                                                                <label>{t("policyUnderwriting:RacingEventType.label")}</label>
                                                                                                            </Col>
                                                                                                            <Col md="8">
                                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                                    <div>
                                                                                                                        <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                                                                                            <option value=''>{t("policyUnderwriting:RacingEventType.defaultValue")}</option>
                                                                                                                            {this.state.racingEventTypeList.map((ct, i) => {
                                                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                            })
                                                                                                                            }
                                                                                                                        </Input>
                                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:RacingEventType.error")}</em>
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                        <div>
                                                                                                                            <p>{this.state.racingEventType}</p>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (null)}

                                                                                        {(this.state.DisplayCrew == 1) ?
                                                                                            (
                                                                                                <div className="input-box">
                                                                                                    <Row>
                                                                                                        <Col md="4">
                                                                                                            <label>{t("policyUnderwriting:CrewLiability.label")}</label>
                                                                                                        </Col>
                                                                                                        <Col md="8">
                                                                                                            {(this.state.isUnderwritingEdit) ? (
                                                                                                                <div>
                                                                                                                    <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                                                                                        <option value=''>{t("policyUnderwriting:CrewLiability.defaultValue")}</option>
                                                                                                                        {this.state.crewLiabilityList.map((ct, i) => {
                                                                                                                            return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                                        })
                                                                                                                        }
                                                                                                                    </Input>
                                                                                                                    <em className="error invalid-feedback" >{t("policyUnderwriting:CrewLiability.error")}</em>
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                    <div>
                                                                                                                        <p>{this.state.crewLiability}</p>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </div>
                                                                                            ) : (null)}

                                                                                        {/* <div className="input-box">
                                                                <Row>
                                                                    <Col md="4">
                                                                        <label>{t("policyUnderwriting:Excess.label")}</label>
                                                                    </Col>
                                                                    <Col md="8">
                                                                        {(this.state.isUnderwritingEdit) ? (
                                                                            <div>
                                                                                <Input type="text" name="excess" id="excess" onChange={(e) => this.handleChangeUnderwriting(e)} value={this.state.excess}>
                                                                                </Input>
                                                                                <em className="error invalid-feedback" >{t("policyUnderwriting:Excess.error")}</em>
                                                                            </div>
                                                                        ) : (
                                                                                <div>
                                                                                    <p>{this.state.excess}</p>
                                                                                </div>
                                                                            )}
                                                                    </Col>
                                                                </Row>
                                                            </div> */}
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>)
                                                                            : (null)}

                                                                        <Col md="6">
                                                                            <span>{t("policyUnderwriting:Commission")}</span>
                                                                            <Card>
                                                                                <CardBody>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:gross.label")} %</label>
                                                                                            </Col>
                                                                                            <Col md="4">

                                                                                                {(this.state.isUnderwritingEdit && this.state.PolicyType === 'Vessel-Nonrated') ? (
                                                                                                    <div>
                                                                                                        {/* % {this.state.gross} */}
                                                                                                        {/* <label>% </label> */}
                                                                                                        <Input type="gross" name="gross" id="gross" onChange={(e) => this.handleChangeUnderwriting(e)} value={this.state.gross}>
                                                                                                        </Input>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <label>
                                                                                                            {this.state.gross}
                                                                                                        </label>
                                                                                                    )}
                                                                                            </Col>

                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:GrossAmount")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                            </Col>
                                                                                            <Col md="2">
                                                                                                <p>{this.state.totalgross}</p>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:agency.label")} %</label>
                                                                                            </Col>
                                                                                            <Col md="4">
                                                                                                <div className="pl-inner">
                                                                                                    {(this.state.changeAgencyCommission) ? (
                                                                                                        <span>
                                                                                                            <Input type="text" name="agency" id="agency" onChange={(e) => this.handleChangeUnderwriting(e)} value={this.state.agency} style={{ display: "inline-block", width: "70%" }} />
                                                                                                            {/* <em id="policyNumberError" className="error invalid-feedback"></em> */}
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                            <span style={{ width: "70%" }}>{this.state.agency}</span>
                                                                                                        )}
                                                                                                    {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                                                                                                        ? (<BTN color="primary" onClick={() => this.editAgencyCommission()} title="Change Agency Commission" style={{ padding: "1px 5px" }}>
                                                                                                            <i className="fa fa-pencil"></i>
                                                                                                        </BTN>)
                                                                                                        : (null)}
                                                                                                </div>
                                                                                                {/* <label>{this.state.agency}</label> */}
                                                                                            </Col>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:AgencyAmount")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                            </Col>
                                                                                            <Col md="2">
                                                                                                <div>
                                                                                                    <p>{this.state.agencyTotal}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>

                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:balance.label")} %</label>
                                                                                            </Col>
                                                                                            <Col md="4">
                                                                                                <label>{this.state.balance}</label>
                                                                                            </Col>
                                                                                            <Col md="3">
                                                                                                <label>{t("policyUnderwriting:BalanceAmount")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                            </Col>
                                                                                            <Col md="2">
                                                                                                <div>
                                                                                                    <p>{this.state.balanceTotal}</p>
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </CardBody>
                                                                            </Card>
                                                                            {
                                                                                (this.state.PolicyType == 'MarineTrade' || this.state.PolicyType == 'MultiVessel') ? (<Card>
                                                                                    <CardBody>
                                                                                        {(this.state.isUnderwritingEdit) ? (
                                                                                            <div className="input-box">
                                                                                                <Row>
                                                                                                    <Col md="4">
                                                                                                        <label>{(this.state.PolicyType == 'MarineTrade') ? 'MarineTradePremium' : 'MultiVesselPremium'}</label>
                                                                                                    </Col>
                                                                                                    <Col md="4">
                                                                                                        <div>
                                                                                                            <Input type="text" name="MarineTradePremium" id="MarineTradePremium" onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                                onBlur={(e) => this.saveRateableParam('MarineTradePremium', e.target.value)}
                                                                                                                value={this.state.MarineTradePremium}></Input>
                                                                                                            <em id="MarineTradePremiumError" className="error invalid-feedback" ></em>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </div>) : (
                                                                                                <div className="input-box">
                                                                                                    <Row>
                                                                                                        <Col md="4">
                                                                                                            <label>{(this.state.PolicyType == 'MarineTrade') ? 'MarineTradePremium' : 'MultiVesselPremium'}</label>
                                                                                                        </Col>
                                                                                                        <Col md="4">
                                                                                                            <div>
                                                                                                                <p>{this.state.MarineTradePremium}</p>
                                                                                                            </div>
                                                                                                        </Col>

                                                                                                    </Row>
                                                                                                </div>
                                                                                            )}
                                                                                    </CardBody>
                                                                                </Card>)
                                                                                    : (null)
                                                                            }

                                                                            <span>{t("policyUnderwriting:FeesandLevy")}</span>

                                                                            <Card>
                                                                                <CardBody>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="2" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:GovtLevy.label")}</label>
                                                                                            </Col>
                                                                                            <Col md="5">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <Input type="select" name="governmentLavys" id="governmentLavys" onChange={(e) => this.selectTypeUnderwriting(e.target.value, 'governmentLavys')} value={this.state.governmentLavys}>
                                                                                                            {/* <option value=''>{t("policyUnderwriting:GovtLevy.defaultValue")}</option> */}
                                                                                                            {this.state.govtLevyList.map((ct, i) => {
                                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                            })
                                                                                                            }
                                                                                                        </Input>
                                                                                                        <em className="error invalid-feedback" >{t("policyUnderwriting:GovtLevy.error")}</em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{this.state.governmentLavys}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                            <Col md="2">
                                                                                                {
                                                                                                    (this.state.governmentLavys === "DEFAULT") ? (
                                                                                                        <label>{this.state.governmentLavysPercent}%</label>
                                                                                                    ) : (null)
                                                                                                }
                                                                                            </Col>
                                                                                            <Col md="3">
                                                                                                {(this.state.isUnderwritingEdit) ? (
                                                                                                    <div>
                                                                                                        <Input readOnly={(this.state.governmentLavys === "DEFAULT") ? (true) : (false)} type="text" name="governmentLavysAmount" id="governmentLavysAmount"
                                                                                                            onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                            onBlur={(e) => this.saveRateableParam('LevyAbsolute', e.target.value)} value={this.state.governmentLavysAmount}></Input>
                                                                                                        <em id="governmentLavysAmountError" className="error invalid-feedback"></em>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                        <div>
                                                                                                            <p>{<i className={this.state.CurrencySymbol}></i>}{this.state.governmentLavysAmount}</p>
                                                                                                        </div>
                                                                                                    )}
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                    <div className="input-box">
                                                                                        <Row>
                                                                                            <Col md="2" style={{ padding: 0 }}>
                                                                                                <label>{t("policyUnderwriting:AdminFee")}({<i className={this.state.CurrencySymbol}></i>})</label>
                                                                                            </Col>
                                                                                            <Col md="5">
                                                                                                <div>
                                                                                                    {(this.state.isUnderwritingEdit) ? (
                                                                                                        <label>
                                                                                                            <Input type="text" name="adminFees" id="adminFees"
                                                                                                                onChange={(e) => this.handleChangeUnderwriting(e)}
                                                                                                                onBlur={(e) => this.saveRateableParam('AdminFee', e.target.value)}
                                                                                                                value={this.state.adminFees}></Input>
                                                                                                            <em id="adminFeesError" className="error invalid-feedback" ></em>
                                                                                                        </label>
                                                                                                    ) : (
                                                                                                            <p>{this.state.adminFees}</p>
                                                                                                        )}
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col md="4">
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </CardBody>
                                                                            </Card>
                                                                        </Col>
                                                                    </Row>
                                                                </CardBody>
                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    {
                                                        (this.state.PolicyType === 'VesselNonrated') ?
                                                            (<div className="input-box" id="RatingExcess">
                                                                <Card className="mb-0">
                                                                    <CardHeader id="headingOne">
                                                                        <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.toggleUnderwriting('RatingExcess')} aria-expanded={this.state.showRatingExcess} aria-controls="collapseOne">
                                                                            <h5 className="m-0 p-0">
                                                                                {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                                {t("policyUnderwriting:RatingExcess#")}
                                                                                <i style={{ float: 'right' }} className={this.state.showRatingExcess ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
                                                                            </h5>
                                                                        </BTN>
                                                                    </CardHeader>

                                                                    <Collapse isOpen={this.state.showRatingExcess} data-parent="#RatingExcess" id="collapseOne" aria-labelledby="headingOne">
                                                                        <CardBody>
                                                                            <Row style={{ width: "100%" }}>
                                                                                <Col md="12">
                                                                                    <Card>
                                                                                        <CardBody>
                                                                                            <div className="input-box">
                                                                                                <Row>
                                                                                                    <Col md="4">
                                                                                                        <label>{t("policyUnderwriting:RatingType")} *</label>
                                                                                                    </Col>
                                                                                                    <Col md="8">
                                                                                                        {(this.state.isUnderwritingEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                                                            <div>
                                                                                                                <div className="rc-inline">
                                                                                                                    <label>
                                                                                                                        <Input type="radio" id="ratingType" name="ratingType" checked={(this.state.ratingType === 'Rating') ? true : false}
                                                                                                                            value={this.state.ratingType} onChange={() => this.onRadioBtnClickUnderwriting('ratingType', 'Rating')}
                                                                                                                        />
                                                                                                                        {t("policyUnderwriting:Rating")}
                                                                                                                    </label>

                                                                                                                    <label >
                                                                                                                        <Input type="radio" id="ratingType" name="ratingType" checked={(this.state.ratingType === 'Absolute') ? true : false}
                                                                                                                            value={this.state.ratingType} onChange={() => this.onRadioBtnClickUnderwriting('ratingType', 'Absolute')} />
                                                                                                                        {t("policyUnderwriting:Absolute")}
                                                                                                                    </label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                                <div>
                                                                                                                    <p>{this.state.ratingType}</p>
                                                                                                                </div>
                                                                                                            )}
                                                                                                    </Col>
                                                                                                    <Col md="4">
                                                                                                        <label>{this.state.ratingType}</label>
                                                                                                    </Col>
                                                                                                    <Col md="8">
                                                                                                        {(this.state.isUnderwritingEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                                                            <label>
                                                                                                                <Input type="text" name="ratingTypeValue" id="ratingTypeValue" onChange={(e) => this.handleChangeUnderwriting(e)} onBlur={(e) => this.saveRateableParam('Rating', e.target.value)} value={this.state.ratingTypeValue} />
                                                                                                                <em id="ratingTypeValueError" className="error invalid-feedback"></em>
                                                                                                            </label>)
                                                                                                            : (<p>{this.state.ratingTypeValue}</p>)}
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </div>

                                                                                            <div className="input-box">
                                                                                                <Row>
                                                                                                    <Col md="4">
                                                                                                        <label>{t("policyUnderwriting:Excess.label")}({<i className={this.state.CurrencySymbol}></i>}) *</label>
                                                                                                    </Col>
                                                                                                    <Col md="8">
                                                                                                        {(this.state.isUnderwritingEdit && this.state.PolicyType === 'VesselNonrated') ? (
                                                                                                            <div>
                                                                                                                <Input type="text" name="excess" id="excess" onChange={(e) => this.handleChangeUnderwriting(e)} value={this.state.excess}>
                                                                                                                </Input>
                                                                                                                <em id="excessError" className="error invalid-feedback"></em>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                                <div>
                                                                                                                    <p>{this.state.excess}</p>
                                                                                                                </div>
                                                                                                            )}
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </div>
                                                                                        </CardBody>
                                                                                    </Card>
                                                                                </Col>
                                                                            </Row>
                                                                        </CardBody>
                                                                    </Collapse>
                                                                </Card>
                                                            </div>)
                                                            : (null)
                                                    }

                                                </TabPane>
                                                {/* END - Underwriting  */}

                                                {/* START - General  */}
                                                <TabPane tabId="3">

                                                    <Row>
                                                        <Col md="12">
                                                            {(CommonConfig.ShowHideActionOnPolicyStatus(this.state.policyStatus) == 1)
                                                                ? (<BTN style={{ float: "right", marginBottom: "10px" }} color="primary"
                                                                    onClick={(this.state.isGeneralEdit) ? () => this.viewPolicyGeneral() : () => this.editPolicyGeneral()}
                                                                >
                                                                    <i className={(this.state.isGeneralEdit) ? "fa fa-eye" : "fa fa-pencil"}></i>
                                                                </BTN>)
                                                                : (null)}

                                                            <BTN style={{ float: "right", marginRight: 5 }} color="primary" title={(this.state.isGeneralExpand) ? t("contactDetails:ViewPage.CollapseAll") : t("contactDetails:ViewPage.ExpandAll")}
                                                                onClick={(this.state.isGeneralExpand) ? () => this.toggleAllGeneral('collapse') : () => this.toggleAllGeneral('expand')}
                                                            >
                                                                <i className={(this.state.isGeneralExpand) ? "fa fa-compress" : "fa fa-expand"}></i>
                                                            </BTN>
                                                        </Col>
                                                    </Row>

                                                    <div className="input-box" id="generalQuestions">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showGeneralQuestions: !this.state.showGeneralQuestions, showInsuranceHistory: false, showSchemes: false })} aria-expanded={this.state.showGeneralQuestions} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyGeneral:generalQuestions#")}
                                                                        <i style={{ float: 'right' }} className={this.state.showGeneralQuestions ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showGeneralQuestions} data-parent="#generalQuestions" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    {(this.state.isGeneralEdit) ? (
                                                                        <div>
                                                                            <Row>
                                                                                <Col md="6">
                                                                                    <div className="input-box">
                                                                                        <label>{t("policyGeneral:previousBoatingExperience.label")}*</label>
                                                                                        <Input type="select" style={{ width: "36%" }} name="boatingExperienceYear" id="boatingExperienceYear" onChange={(e) => this.selectTypeGeneral(e.target.value, 'boatingExperienceYear')} value={this.state.boatingExperienceYear}>
                                                                                            <option value=''>{t("policyGeneral:previousBoatingExperience.defaultValue")}</option>
                                                                                            {this.state.previousBoatingExperienceList.map((ct, i) => {
                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                            })}
                                                                                        </Input>
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:previousBoatingExperience.error")}</em>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md="6">
                                                                                    <div className="input-box">
                                                                                        <Input type="checkbox" name="isGeneralQuestionProofProvided" id="isGeneralQuestionProofProvided" value={this.state.isGeneralQuestionProofProvided} checked={this.state.isGeneralQuestionProofProvided} onChange={(e) => this.handleChangeGeneral(e)}>
                                                                                        </Input>
                                                                                        <label>{t("policyGeneral:generalProofProvided")}</label>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                            <Row>
                                                                                <Col md="4">
                                                                                    <div className="input-box row">
                                                                                        <Col md="10">
                                                                                            <label>{t("policyGeneral:boatingQualifications.label")}</label>
                                                                                            <Input type="select" style={{ width: "100%", display: "inline-block" }} name="boatingQualifications" id="boatingQualifications" onChange={(e) => this.selectTypeGeneral(e.target.value, 'boatingQualifications')} value={this.state.boatingQualifications}>
                                                                                                <option value=''>{t("policyGeneral:boatingQualifications.defaultValue")}</option>
                                                                                                {this.state.boatingQualificationList.map((ct, i) => {
                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                })}
                                                                                            </Input>
                                                                                            <em className="error invalid-feedback" >{t("policyGeneral:boatingQualifications.error")}</em>
                                                                                        </Col>
                                                                                        <Col md="2">
                                                                                            <label>&nbsp;</label>
                                                                                            <BTN title={AddButton} style={{ marginLeft: "10px" }} color="primary" onClick={() => this.ValidateAndAddBoatingQualification()}>
                                                                                                <i className="fa fa-plus"></i>
                                                                                            </BTN>
                                                                                        </Col>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md="5">
                                                                                    <table className="added-detail-table" style={{ marginTop: "10px" }}>
                                                                                        <tbody>
                                                                                            {this.state.boatingQualificationsArr.map((bqa, i) => {
                                                                                                return bqa.Status === "Active" ? (
                                                                                                    <tr key={i}>
                                                                                                        <td>{(bqa.BoatingQualificationName)}</td>
                                                                                                        <td>
                                                                                                            <span>
                                                                                                                <BTN title={DeleteButton} onClick={() => this.deleteGeneral(bqa)} style={{ marginLeft: 5 }} color="danger">
                                                                                                                    <i className="fa fa-trash"></i>
                                                                                                                </BTN>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ) : null
                                                                                            })}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </Col>
                                                                            </Row>

                                                                            <Row>
                                                                                <Col md="3">
                                                                                    <div className="input-box">
                                                                                        <label>{t("policyGeneral:lossesinlast5years.label")}*</label>
                                                                                        <Input type="select" name="losses" id="losses" onChange={(e) => this.selectTypeGeneral(e.target.value, 'losses')} value={this.state.losses}>
                                                                                            <option value=''>Select losses</option>
                                                                                            {this.state.Options.map((ct, i) => {
                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                            })}
                                                                                        </Input>
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:lossesinlast5years.lossesError")}</em>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    <div className="input-box">
                                                                                        <label>{t("policyGeneral:convictedorCharged.label")}*</label>
                                                                                        <Input type="select" name="convicted" id="convicted" onChange={(e) => this.selectTypeGeneral(e.target.value, 'convicted')} value={this.state.convicted}>
                                                                                            <option value=''>Select convicted</option>
                                                                                            {this.state.Options.map((ct, i) => {
                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                            })}
                                                                                        </Input>
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:convictedorCharged.convictedError")}</em>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    <div className="input-box">
                                                                                        <label>{t("policyGeneral:insuranceCanceledorRefused.label")}*</label>
                                                                                        <Input type="select" name="insuranceCanceled" id="insuranceCanceled" onChange={(e) => this.selectTypeGeneral(e.target.value, 'insuranceCanceled')} value={this.state.insuranceCanceled}>
                                                                                            <option value=''>Select insurance canceled</option>
                                                                                            {this.state.Options.map((ct, i) => {
                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                            })}
                                                                                        </Input>
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:insuranceCanceledorRefused.insuranceCanceledorRefusedError")}</em>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    <div className="input-box">
                                                                                        <label>{t("policyGeneral:vesselDamaged.label")}*</label>
                                                                                        <Input type="select" name="damaged" id="damaged" onChange={(e) => this.selectTypeGeneral(e.target.value, 'damaged')} value={this.state.damaged}>
                                                                                            <option value=''>Select damaged</option>
                                                                                            {this.state.Options.map((ct, i) => {
                                                                                                return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                            })}
                                                                                        </Input>
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:vesselDamaged.vesselDamagedError")}</em>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>

                                                                            <Row>
                                                                                <Col md="3">
                                                                                    {(this.state.showLossesDescribe) ? (
                                                                                        <div className="input-box">
                                                                                            <label>{t("policyGeneral:lossesinlast5years.describe")}</label>
                                                                                            <InputTextarea placeholder={t("policyGeneral:lossesinlast5years.describePlaceholder")} rows={1} cols={25} autoResize={true} name="lossesDescribe" id="lossesDescribe" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.lossesDescribe}>
                                                                                            </InputTextarea>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    {(this.state.ShowConvictedDescribe) ? (
                                                                                        <div className='input-box'>
                                                                                            <label>{t("policyGeneral:convictedorCharged.describe")}</label>
                                                                                            <InputTextarea placeholder={t("policyGeneral:convictedorCharged.describePlaceholder")} rows={1} cols={25} autoResize={true} name="convictedDescribe" id="convictedDescribe" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.convictedDescribe}>
                                                                                            </InputTextarea>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    {(this.state.ShowInsuranceCanceledDescribe) ? (
                                                                                        <div className='input-box'>
                                                                                            <label>{t("policyGeneral:insuranceCanceledorRefused.describe")}</label>
                                                                                            <InputTextarea placeholder={t("policyGeneral:insuranceCanceledorRefused.describePlaceholder")} rows={1} cols={25} autoResize={true} name="insuranceCanceledDescribe" id="insuranceCanceledDescribe" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.insuranceCanceledDescribe}>
                                                                                            </InputTextarea>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </Col>

                                                                                <Col md="3">
                                                                                    {(this.state.ShowDamagedDescribe) ? (
                                                                                        <div className='input-box'>
                                                                                            <label>{t("policyGeneral:vesselDamaged.describe")}</label>
                                                                                            <InputTextarea placeholder={t("policyGeneral:vesselDamaged.describePlaceholder")} rows={1} cols={25} autoResize={true} name="damagedDescribe" id="damagedDescribe" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.damagedDescribe}>
                                                                                            </InputTextarea>
                                                                                        </div>
                                                                                    ) : (null)}
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <div className='input-box'>
                                                                                        <label>Interested Parties</label>
                                                                                        <InputTextarea style={{ width: "100%" }} placeholder="Interested Parties" cols={25} autoResize={true} name="interestedParty" id="interestedParty" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.interestedParty} />
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    ) : (
                                                                            <div>
                                                                                <Row>
                                                                                    <Col md="4">
                                                                                        <div className="policy-box">
                                                                                            <p>{t("policyGeneral:previousBoatingExperience.label")} :</p>
                                                                                            <span>{this.state.boatingExperienceYear}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col md="4">
                                                                                        <div className="policy-box">
                                                                                            <p>{t("policyGeneral:generalProofProvided")} :</p>
                                                                                            <span>{this.state.isGeneralQuestionProofProvided ? 'Yes' : 'No'}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col md="4">
                                                                                        <div className='policy-box'>
                                                                                            <p>{t("policyGeneral:lossesinlast5years.label")}</p>
                                                                                            <span>{this.state.losses}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    {(this.state.showLossesDescribe) ?
                                                                                        (<Col md="4">
                                                                                            <div className='input-box'>
                                                                                                <label>{t("policyGeneral:lossesinlast5years.describe")}</label>
                                                                                                <span>{this.state.lossesDescribe}</span>
                                                                                            </div>
                                                                                        </Col>) : null
                                                                                    }
                                                                                </Row>

                                                                                <Row>
                                                                                    <Col md="4">
                                                                                        <div className='policy-box'>
                                                                                            <p>{t("policyGeneral:convictedorCharged.label")}</p>
                                                                                            <span>{this.state.convicted}</span>
                                                                                        </div>
                                                                                    </Col>
                                                                                    {(this.state.ShowConvictedDescribe) ?
                                                                                        (<Col md="4">
                                                                                            <div className='policy-box'>
                                                                                                <p>{t("policyGeneral:convictedorCharged.describe")}</p>
                                                                                                <span>{this.state.convictedDescribe}</span>
                                                                                            </div>
                                                                                        </Col>) : null
                                                                                    }
                                                                                    <Col md="4">
                                                                                        <div className='policy-box'>
                                                                                            <p>{t("policyGeneral:insuranceCanceledorRefused.label")}*</p>
                                                                                            <span>{this.state.insuranceCanceled}</span>
                                                                                        </div>
                                                                                    </Col>
                                                                                    {(this.state.ShowInsuranceCanceledDescribe) ?
                                                                                        (<Col md="4">
                                                                                            <div className='policy-box'>
                                                                                                <p>{t("policyGeneral:insuranceCanceledorRefused.describe")}</p>
                                                                                                <span>{this.state.insuranceCanceledDescribe}</span>
                                                                                            </div>
                                                                                        </Col>) : null
                                                                                    }
                                                                                    <Col md="4">
                                                                                        <div className='policy-box'>
                                                                                            <p>{t("policyGeneral:vesselDamaged.label")}*</p>
                                                                                            <span>{this.state.damaged}</span>
                                                                                        </div>
                                                                                    </Col>

                                                                                    {(this.state.ShowDamagedDescribe) ?
                                                                                        (<Col md="4">
                                                                                            <div className='policy-box'>
                                                                                                <p>{t("policyGeneral:vesselDamaged.describe")}</p>
                                                                                                <span>{this.state.damagedDescribe}</span>
                                                                                            </div>
                                                                                        </Col>) : null
                                                                                    }
                                                                                </Row>

                                                                                <Row>
                                                                                    <Col md="12">
                                                                                        <div className='policy-box'>
                                                                                            <p>Interested Party</p>
                                                                                            <span>{this.state.interestedParty}</span>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>

                                                                                <Row>
                                                                                    <Col md="5">
                                                                                        <table className="added-detail-table" style={{ marginTop: "10px" }}>
                                                                                            <tbody>
                                                                                                {this.state.boatingQualificationsArr.map((bqa, i) => {
                                                                                                    return bqa.Status === "Active" ? (
                                                                                                        <tr key={i}>
                                                                                                            <td>{(bqa.BoatingQualificationName)}</td>
                                                                                                        </tr>
                                                                                                    ) : null
                                                                                                })}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                        )}
                                                                </CardBody>
                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    <div className="input-box" id="insuranceHistory">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showInsuranceHistory: !this.state.showInsuranceHistory, showGeneralQuestions: false, showSchemes: false })} aria-expanded={this.state.showInsuranceHistory} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyGeneral:insuranceHistory#")}
                                                                        <i style={{ float: 'right' }} className={this.state.showInsuranceHistory ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showInsuranceHistory} data-parent="#insuranceHistory" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    {(this.state.isGeneralEdit) ? (
                                                                        <Row>
                                                                            <Col md="4">
                                                                                <div className="input-box">
                                                                                    <label>{t("policyGeneral:previousInsurer.label")}</label>

                                                                                    <AutoComplete placeholder="Previous Insurer Name" value={this.state.previousInsurer} id='previousInsurer' onChange={(e) => this.setState({ previousInsurer: e.value },
                                                                                        this.changePreviousInsurer(e.value))} suggestions={this.state.previousInsurerSuggestions} completeMethod={this.suggestPreviousInsurer.bind(this)} />
                                                                                    <em id="previousInsurerError" className="error invalid-feedback" >{t("policyGeneral:previousInsurer.error")}</em>

                                                                                    {/* <Input type="select" name="previousInsurer" id="previousInsurer" onChange={(e) => this.selectTypeGeneral(e.target.value, 'previousInsurer')} value={this.state.previousInsurer}>
                                                                                    <option value=''>{t("policyGeneral:previousInsurer.defaultValue")}</option>
                                                                                    {this.state.previousInsurerList.map((ct, i) => {
                                                                                        return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                    })}
                                                                                    </Input>
                                                                                    <em className="error invalid-feedback" >{t("policyGeneral:previousInsurer.error")}</em> */}
                                                                                </div>
                                                                            </Col>

                                                                            <Col md="3">
                                                                                <div className="input-box">
                                                                                    <label>{t("policyGeneral:policyNo.label")}</label>
                                                                                    <Input type="text" placeholder={t("policyGeneral:policyNo.label")} name="policyNo" id="policyNo" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.policyNo}></Input>
                                                                                    <em className="error invalid-feedback" >{t("policyGeneral:policyNo.error")}</em>
                                                                                </div>
                                                                            </Col>

                                                                            <Col md="5">
                                                                                <div className="input-box">
                                                                                    <Input type="checkbox" name="isInsuranceHistoryProofProvided" id="isInsuranceHistoryProofProvided" value={this.state.isInsuranceHistoryProofProvided} checked={this.state.isInsuranceHistoryProofProvided} onChange={(e) => this.handleChangeGeneral(e)}></Input>
                                                                                    <label>{t("policyGeneral:insuranceHistoryProofProvided")}</label>
                                                                                </div>
                                                                            </Col>

                                                                            <Col md="6" >
                                                                                <Row>
                                                                                    <Col md="3">
                                                                                        <div className="input-box">
                                                                                            <label>{t("policyGeneral:previousNCB.label")}</label>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col md="5">
                                                                                        <div className="input-box">
                                                                                            <label>{t("policyGeneral:previousNCB.noofYears")}</label>
                                                                                            <Input type="select" name="previousNCBYears" id="previousNCBYears" onChange={(e) => this.selectTypeGeneral(e.target.value, 'previousNCBYears')} value={this.state.previousNCBYears}>
                                                                                                <option value=''>{t("policyGeneral:previousNCB.noofYearsDefaultValue")}</option>
                                                                                                {this.state.previousNCBNoofYearsList.map((ct, i) => {
                                                                                                    return (<option value={ct.StringMapKey} key={i}>{ct.StringMapName}</option>)
                                                                                                })}
                                                                                            </Input>
                                                                                            <em className="error invalid-feedback" >{t("policyGeneral:previousNCB.noofYearsError")}</em>
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col md="4">
                                                                                        <div className="input-box">
                                                                                            <label>{t("policyGeneral:previousNCB.NCBAmount")}</label>
                                                                                            <Input type="text" placeholder={t("policyGeneral:previousNCB.NCBAmountPlaceholder")} name="previousNCBAmount" id="previousNCBAmount" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.previousNCBAmount}>
                                                                                            </Input>
                                                                                            <em className="error invalid-feedback" >{t("policyGeneral:previousNCB.NCBAmountError")}</em>
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col >
                                                                        </Row>
                                                                    ) : (
                                                                            <Row>
                                                                                <Col>
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <div className="policy-box">
                                                                                                <p>{t("policyGeneral:previousInsurer.label")} : {this.state.previousInsurer}</p>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </Col>

                                                                                        <Col>
                                                                                            <div className="policy-box">
                                                                                                <p>{t("policyGeneral:policyNo.label")} : {this.state.policyNo}</p>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </Col>

                                                                                        <Col>
                                                                                            <div className="policy-box">
                                                                                                <p>{t("policyGeneral:insuranceHistoryProofProvided")} : {this.state.isInsuranceHistoryProofProvided ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</p>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <div className="policy-box">
                                                                                                <p>Previous NCB No of Years : {this.state.previousNCBYears}</p>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </Col>

                                                                                        <Col>
                                                                                            <div className="policy-box">
                                                                                                <p>Previous NCB Amount : {<i className={this.state.CurrencySymbol}></i>} {this.state.previousNCBAmount}</p>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        )}
                                                                </CardBody>
                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                    <div className="input-box" id="schemes">
                                                        <Card className="mb-0">
                                                            <CardHeader id="headingOne">
                                                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showSchemes: !this.state.showSchemes, showGeneralQuestions: false, showInsuranceHistory: false })} aria-expanded={this.state.showSchemes} aria-controls="collapseOne">
                                                                    <h5 className="m-0 p-0">
                                                                        {/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
                                                                        {t("policyGeneral:schemes#")}
                                                                        <i style={{ float: 'right' }} className={this.state.showSchemes ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                                                    </h5>
                                                                </BTN>
                                                            </CardHeader>

                                                            <Collapse isOpen={this.state.showSchemes} data-parent="#schemes" id="collapseOne" aria-labelledby="headingOne">
                                                                <CardBody>
                                                                    <div className="input-box">
                                                                        <Row>
                                                                            <Col md="3">
                                                                                <label>{t("policyGeneral:ISA.label")}</label>
                                                                            </Col>

                                                                            {(this.state.isGeneralEdit) ? (
                                                                                <Col md="2" style={{ padding: "0px" }}>
                                                                                    <div>
                                                                                        <Input type="checkbox" checked={this.state.memberISA === true ? "checked" : ""} name="memberISA" id="memberISA" value={this.state.memberISA} onChange={(e) => this.handleChangeGeneral(e)}>
                                                                                        </Input>
                                                                                        {(this.state.memberISA) ? (
                                                                                            <label>{t("policyGeneral:ISA.affiliatedClub")}</label>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                    </div>
                                                                                </Col>
                                                                            ) : (
                                                                                    <Col md="2" style={{ padding: "0px" }}>
                                                                                        <div>
                                                                                            <label style={{ marginRight: "10px", marginLeft: "-31px" }}>{this.state.memberISA == true ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</label>
                                                                                            {(this.state.memberISA) ? (
                                                                                                <label>{t("policyGeneral:ISA.affiliatedClub")}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    </Col>
                                                                                )}

                                                                            <Col md="3">
                                                                                {(this.state.isGeneralEdit) ? (
                                                                                    <div>
                                                                                        {(this.state.memberISA) ? (
                                                                                            <Input type="text" placeholder={t("policyGeneral:ISA.affiliatedClub")} name="affiliatedClub" id="affiliatedClub" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.affiliatedClub}>
                                                                                            </Input>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:ISA.affiliatedClubError")}</em>
                                                                                    </div>
                                                                                ) : (
                                                                                        <div>
                                                                                            {(this.state.memberISA) ? (
                                                                                                <label>{this.state.affiliatedClub}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    )}
                                                                            </Col>

                                                                            <Col md="2">
                                                                                {(this.state.memberISA) ? (
                                                                                    <label>{t("policyGeneral:ISA.membershipNo")}</label>
                                                                                ) : (
                                                                                        null
                                                                                    )}
                                                                            </Col>

                                                                            <Col md="2">
                                                                                {(this.state.isGeneralEdit) ? (
                                                                                    <div>
                                                                                        {(this.state.memberISA) ? (
                                                                                            <Input type="text" placeholder={t("policyGeneral:ISA.membershipNo")} name="ISAMembershipNo" id="ISAMembershipNo" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.ISAMembershipNo}>
                                                                                            </Input>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:ISA.membershipNoError")}</em>
                                                                                    </div>
                                                                                ) : (
                                                                                        <div>
                                                                                            {(this.state.memberISA) ? (
                                                                                                <label>{this.state.ISAMembershipNo}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    )}
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                    <div className="input-box">
                                                                        <Row>
                                                                            <Col md="3">
                                                                                <label>{t("policyGeneral:IWAI.label")}</label>
                                                                            </Col>

                                                                            {(this.state.isGeneralEdit) ? (
                                                                                <Col md="2" style={{ padding: "0px" }}>
                                                                                    <div>
                                                                                        <Input type="checkbox" name="memberIWAI" id="memberIWAI" checked={this.state.memberIWAI == true ? "checked" : ""} value={this.state.memberIWAI} onChange={(e) => this.handleChangeGeneral(e)} >
                                                                                        </Input>
                                                                                        {(this.state.memberIWAI) ? (
                                                                                            <label>{t("policyGeneral:IWAI.affiliatedBranch")}</label>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                    </div>
                                                                                </Col>
                                                                            ) : (
                                                                                    <Col md="2" style={{ padding: "0px" }}>
                                                                                        <div>
                                                                                            <label style={{ marginRight: "10px", marginLeft: "-31px" }}>{this.state.memberIWAI == true ? t("policyGeneral:generalYes") : t("policyGeneral:generalNo")}</label>
                                                                                            {(this.state.memberIWAI) ? (
                                                                                                <label>{t("policyGeneral:IWAI.affiliatedBranch")}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    </Col>
                                                                                )}

                                                                            <Col md="3">
                                                                                {(this.state.isGeneralEdit) ? (
                                                                                    <div>
                                                                                        {(this.state.memberIWAI) ? (
                                                                                            <Input type="text" placeholder={t("policyGeneral:IWAI.affiliatedBranch")} name="affiliatedBranch" id="affiliatedBranch" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.affiliatedBranch}>
                                                                                            </Input>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:IWAI.affiliatedBranchError")}</em>
                                                                                    </div>
                                                                                ) : (
                                                                                        <div>
                                                                                            {(this.state.memberIWAI) ? (
                                                                                                <label>{this.state.affiliatedBranch}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    )}
                                                                            </Col>

                                                                            <Col md="2">
                                                                                {(this.state.memberIWAI) ? (
                                                                                    <label>{t("policyGeneral:IWAI.membershipNo")}</label>
                                                                                ) : (
                                                                                        null
                                                                                    )}
                                                                            </Col>

                                                                            <Col md="2">
                                                                                {(this.state.isGeneralEdit) ? (
                                                                                    <div>
                                                                                        {(this.state.memberIWAI) ? (
                                                                                            <Input type="text" placeholder={t("policyGeneral:IWAI.membershipNo")} name="IWAIMembershipNo" id="IWAIMembershipNo" onChange={(e) => this.handleChangeGeneral(e)} value={this.state.IWAIMembershipNo}>
                                                                                            </Input>
                                                                                        ) : (
                                                                                                null
                                                                                            )}
                                                                                        <em className="error invalid-feedback" >{t("policyGeneral:IWAI.membershipNoError")}</em>
                                                                                    </div>
                                                                                ) : (
                                                                                        <div>
                                                                                            {(this.state.memberIWAI) ? (
                                                                                                <label>{this.state.IWAIMembershipNo}</label>
                                                                                            ) : (
                                                                                                    null
                                                                                                )}
                                                                                        </div>
                                                                                    )}
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                </CardBody>
                                                            </Collapse>
                                                        </Card>
                                                    </div>

                                                </TabPane>
                                                {/* END - General  */}

                                                {/* START - Navigation  */}
                                                <TabPane tabId="4">
                                                    <Form encType="multipart/form-data" autoComplete="off">
                                                        <Row>
                                                            <Col md="6">
                                                                <Card>
                                                                    <CardBody>

                                                                        <div className="input-box">
                                                                            <Row>
                                                                                <Col md="6">
                                                                                    <label>{this.state.mooringboatReg}</label>
                                                                                </Col>

                                                                                <Col md="6">
                                                                                    <Select name="mooringBoatReg" id="mooringBoatReg" options={this.state.mooringBoatRegyarr} value={this.state.mooringBoatReg} onChange={(data) => this.selectTypeMooring(data, 'mooringBoatReg')} placeholder="Select country"
                                                                                    />
                                                                                    <em id="mooringBoatRegError" className="error invalid-feedback">Please enter where boat registered</em>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>

                                                                        <div className="input-box">
                                                                            <Row>
                                                                                <Col md="6">
                                                                                    <label>{this.state.mooringregNo}</label>
                                                                                </Col>

                                                                                <Col md="6">
                                                                                    <Input type="text" name="mooringRegNo" id="mooringRegNo" onChange={(e) => this.handleChangeMooring(e)} value={this.state.mooringRegNo}>
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
                                                                                    <Select name="mooringBoatMoored" id="mooringBoatMoored" options={this.state.mooringBoatMooredarr} value={this.state.mooringBoatMoored} onChange={(data) => this.selectTypeMooring(data, 'mooringBoatMoored')} placeholder="Select mooring location"
                                                                                    />
                                                                                    <em id="mooringBoatMooredError" className="error invalid-feedback">Please enter where boat moor</em>

                                                                                    {/* <Input type="select" name="mooringBoatMoored" id="mooringBoatMoored" onChange={(e) => this.selectTypeMooring(e.target.value, 'mooringBoatMoored')} value={this.state.mooringBoatMoored}>
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
                                                                                    <Input type="checkbox" name="isLaidAshore" id="isLaidAshore" onChange={(e) => this.handleCheckboxMooring(e)} value={this.state.isLaidAshore} checked={this.state.isLaidAshore == true ? true : false} value={this.state.isLaidAshore} style={{ marginLeft: "10px" }} />
                                                                                    <em id="isLaidAshoreError" className="error invalid-feedback">Please select is Laid Up Ashore</em>
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
                                                                                        <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectTypeMooring(e.target.value, 'mooringType')} value={this.state.mooringType}>
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
                                                                                                    <label>{this.state.mooringCountry}</label>
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
                                                                                    <Select name="CruisingRange" id="CruisingRange" options={this.state.CruisingRangearr} value={this.state.CruisingRange} onChange={(data) => this.selectTypeMooring(data, 'CruisingRange')} placeholder="Select Cruising Range" />
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
                                                                                    <Input type="textarea" name="OtherInformation" id="OtherInformation" onChange={(e) => this.handleChangeMooring(e)} value={this.state.OtherInformation}>
                                                                                    </Input>
                                                                                    <em className="error invalid-feedback" >Please enter other information</em>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>

                                                                    </CardBody>
                                                                </Card>
                                                            </Col>

                                                        </Row>
                                                    </Form>
                                                </TabPane>
                                                {/* END - Navigation  */}

                                            </TabContent>

                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Endorsements CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} PolicyNumber={this.state.policyNumber} {...this.props} />
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <Coverage CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} ></Coverage>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <Account EntityType={this.state.contactEntityType} status={this.state.status} EntityId={this.state.contactEntityId} PolicyNumber={this.state.policyNumber} PolicyType={this.state.policyType} PolicyHolder={this.state.policyHolder} CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} RenewalDate={this.state.RenewalDate} {...this.props}></Account>
                                        </TabPane>

                                        <TabPane tabId="5">
                                            <Timeline CurrencySymbol={this.state.CurrencySymbol} {...this.props} ></Timeline>
                                        </TabPane>

                                    </TabContent>
                                ) : (null)}
                            </Col>
                        </Row>

                    </Col>
                </Row>

                {/* navigationalEquip Model */}
                <Modal isOpen={this.state.toggleModalAdd} className={'modal-primary ' + this.props.className} size='lg' >
                    <ModalHeader toggle={() => this.setState({ toggleModalAdd: false })}>{this.state.NavigationalEquipmentHeaders}</ModalHeader>
                    <ModalBody>
                        <form className="form" action="#">
                            <Col md="12">
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentRadarDesc" id="navigationalEquipmentRadarDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentRadarDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentRadarValue" id="navigationalEquipmentRadarValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentRadarValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentSonarDesc" id="navigationalEquipmentSonarDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentSonarDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentSonarValue" id="navigationalEquipmentSonarValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentSonarValue} >
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentGPSDesc" id="navigationalEquipmentGPSDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentGPSDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentGPSValue" id="navigationalEquipmentGPSValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentGPSValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentPlotterDesc" id="navigationalEquipmentPlotterDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentPlotterDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentPlotterValue" id="navigationalEquipmentPlotterValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentPlotterValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentCombinedEquipmentDesc" id="navigationalEquipmentCombinedEquipmentDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentCombinedEquipmentDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentCombinedEquipmentValue" id="navigationalEquipmentCombinedEquipmentValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentCombinedEquipmentValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentVHFDesc" id="navigationalEquipmentVHFDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentVHFDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentVHFValue" id="navigationalEquipmentVHFValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentVHFValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentRadioBeaconDesc" id="navigationalEquipmentRadioBeaconDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentRadioBeaconDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentRadioBeaconValue" id="navigationalEquipmentRadioBeaconValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentRadioBeaconValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentAutoPilotDesc" id="navigationalEquipmentAutoPilotDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentAutoPilotDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentAutoPilotValue" id="navigationalEquipmentAutoPilotValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentAutoPilotValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentBLUDesc" id="navigationalEquipmentBLUDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentBLUDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentBLUValue" id="navigationalEquipmentBLUValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentBLUValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentSlideDesc" id="navigationalEquipmentSlideDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentSlideDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentSlideValue" id="navigationalEquipmentSlideValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentSlideValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentWindEquipmentDesc" id="navigationalEquipmentWindEquipmentDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentWindEquipmentDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalEquipmentWindEquipmentValue" id="navigationalEquipmentWindEquipmentValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalEquipmentWindEquipmentValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalTridataDesc" id="navigationalTridataDesc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalTridataDesc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalTridataValue" id="navigationalTridataValue"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalTridataValue}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers01Desc" id="navigationalOthers01Desc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers01Desc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers01Value" id="navigationalOthers01Value"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers01Value}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers02Desc" id="navigationalOthers02Desc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers02Desc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers02Value" id="navigationalOthers02Value"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers02Value}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers03Desc" id="navigationalOthers03Desc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers03Desc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers03Value" id="navigationalOthers03Value"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers03Value}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers04Desc" id="navigationalOthers04Desc"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers04Desc}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="navigationalOthers04Value" id="navigationalOthers04Value"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.navigationalOthers04Value}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                            </Col>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.saveNavigationalEqp()} icon="pi pi-check" label="OK" />
                    </ModalFooter>
                </Modal>
                {/* navigationalEquip Model */}

                {/* SailsCanopyCovers Model */}
                <Modal isOpen={this.state.toggleModalAddForSails} className={'modal-primary ' + this.props.className} >
                    <ModalHeader toggle={() => this.setState({ toggleModalAddForSails: false })}>{this.state.SailsCanopyCoversHeaders}</ModalHeader>
                    <ModalBody>
                        <form className="form" action="#">
                            <Col md="12">
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="Bimini" id="Bimini"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.Bimini}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="Canopy" id="Canopy"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.Canopy}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                                                {(this.state.isVesselEdit) ? (
                                                    <div>
                                                        <Input type="text" name="boatCovers" id="boatCovers"
                                                            onChange={(e) => this.handleChangeVessel(e)} value={this.state.boatCovers}
                                                        // onBlur={(e) => this.handleChangeVessel(e)}
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
                            </Col>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.saveSail()}
                            icon="pi pi-check" label='OK' />
                    </ModalFooter>
                </Modal>
                {/* SailsCanopyCovers Model */}

                {/* Summary detail Model */}
                <Modal isOpen={this.state.showDynamicComputation} className="policydetail_modal">
                    <ModalHeader>
                        Summary Details
                        <a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.hideDynamicComputationDetailModel()}>
                            <i class="fa fa-close"></i>
                        </a>
                    </ModalHeader>
                    <ModalBody>
                        <div dangerouslySetInnerHTML={{ __html: this.state.dynamicComputationDetails }}></div>
                    </ModalBody>
                </Modal>
                {/* Summary detail Model */}

                {/* Bind Policy Model */}
                <Modal isOpen={this.state.isBindPopup} className="PolicyBindModal">
                    <ModalHeader>
                        Please confirm bind date to Bind Policy
                  					<a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.cancelBindPolicy()}>
                            <i class="fa fa-close"></i>
                        </a>
                    </ModalHeader>

                    <Col style={{ margin: "20px" }}>
                        <div className="input-box">
                            <Row>
                                <Col md="3" style={{ padding: 0 }}>
                                    <label> Bind Date * </label>
                                </Col>
                                <Col md="6">
                                    <div className="input-box">
                                        <Input type="date" name="bindDate" id="bindDate"
                                            placeholder="Bind Date"
                                            onBlur={(e) => this.handleChangePolicyDetail(e)}
                                            onChange={(e) => this.handleChangePolicyDetail(e)}
                                            value={this.state.bindDate}
                                        />
                                        <em id="bindDateError" className="error invalid-feedback" ></em>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <BTN color="success" onClick={() => this.runBindPolicy()} style={{ marginRight: "20px" }}> Bind Policy </BTN>
                            <BTN color="danger" onClick={() => this.cancelBindPolicy()}> Cancel </BTN>
                        </Row>
                    </div>

                </Modal>
                {/* Bind Policy Model */}

                {/* UnBind Policy Model */}
                <Modal isOpen={this.state.isUnBindPopup} className="PolicyBindModal">
                    <ModalHeader>
                        UnBind Policy
                  					<a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.cancelUnBindPolicy()}>
                            <i class="fa fa-close"></i>
                        </a>
                    </ModalHeader>

                    <Col style={{ margin: "20px" }}>
                        <div className="input-box">
                            <Row>
                                <Col style={{ padding: 0 }}>
                                    <p>Please confirm you want to UnBind the Policy.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <div style={{ marginBottom: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <BTN color="success" onClick={() => this.runUnBindPolicy()} style={{ marginRight: "20px" }}> UnBind Policy </BTN>
                            <BTN color="danger" onClick={() => this.cancelUnBindPolicy()}> Cancel </BTN>
                        </Row>
                    </div>

                </Modal>
                {/* UnBind Policy Model */}

                {/* UnConfirm Policy Model */}
                <Modal isOpen={this.state.isunConfirmPopup} className="PolicyBindModal">
                    <ModalHeader>
                        UnConfirm Policy
                  					<a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.cancelUnConfirmRenewal()}>
                            <i class="fa fa-close"></i>
                        </a>
                    </ModalHeader>

                    <Col style={{ margin: "20px" }}>
                        <div className="input-box">
                            <Row>
                                <Col style={{ padding: 0 }}>
                                    <p>Please confirm you want to UnConfirm the Policy.</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <div style={{ marginBottom: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <BTN color="success" onClick={() => this.runUnConfirmRenewal()} style={{ marginRight: "20px" }}> UnConfirm Policy </BTN>
                            <BTN color="danger" onClick={() => this.cancelUnConfirmRenewal()}> Cancel </BTN>
                        </Row>
                    </div>

                </Modal>
                {/* UnConfirm Policy Model */}

                {/* Calulate Total Due Model */}
                <Modal isOpen={this.state.isTargetTotalDuePopup} className="PolicyTargetTotalDue">
                    <ModalHeader>
                        <label>Compute the Underwriter Amount</label>
                        <a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.hideTargetTotalDuePopup()}>
                            <i class="fa fa-close"></i>
                        </a>
                    </ModalHeader>

                    <Col style={{ margin: "20px" }}>
                        <div className="input-box">

                            <Row style={{ marginBottom: "20px" }}>
                                <Col md="3" style={{ padding: 0 }}>
                                    <label> Total Due </label>
                                </Col>
                                <Col md="6">
                                    <label>{<i className={this.state.CurrencySymbol}></i>}{this.state.PolicyNewTotalDue}</label>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: "20px" }}>
                                <Col md="3" style={{ padding: 0 }}>
                                    <label> Target Total Due * </label>
                                </Col>
                                <Col md="6">
                                    <div className="input-box">
                                        <Input type="text" name="targetTotalDue" id="targetTotalDue"
                                            placeholder="Target Total Due"
                                            onBlur={(e) => this.handleChangePolicyDetail(e)}
                                            onChange={(e) => this.handleChangePolicyDetail(e)}
                                            value={this.state.targetTotalDue}
                                        />
                                        <em id="targetTotalDueError" className="error invalid-feedback" ></em>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="3" style={{ padding: 0 }}>
                                    <label> Underwriter Amount </label>
                                </Col>
                                <Col md="6">
                                    {(!CommonConfig.isEmpty(this.state.targetUnderWriterAmount)) ? (
                                        <label>
                                            {<i className={this.state.CurrencySymbol}></i>}
                                            {this.state.targetUnderWriterAmount}
                                        </label>
                                    ) : (null)}
                                </Col>
                            </Row>

                        </div>
                    </Col>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <BTN color="success" onClick={() => this.getUnderwriterAmount()} style={{ marginRight: "20px" }}> Compute the Underwriter Amount </BTN>
                            <BTN color="danger" onClick={() => this.hideTargetTotalDuePopup()}> Cancel </BTN>
                        </Row>
                    </div>
                </Modal>
                {/* Calulate Total Due Model */}

                {/* Coverage Type Model */}
                <Modal toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)} isOpen={this.state.confirmPremiumPolicyType}>
                    <ModalHeader toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
                        Confirm change Coverage Type?
          			</ModalHeader>

                    <ModalBody>
                        <span>Are you sure you want to change Coverage type to <b>{this.state.premiumPolicyType}</b> ?</span>
                    </ModalBody>

                    <ModalFooter>
                        <BTN color="danger" onClick={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
                            <i className="fa fa-close"></i>
							No
						</BTN>
                        <BTN color="success" onClick={() => this.setPremiumPolicyType(this.state.selectedRecord)}>
                            <i className="fa fa-check"></i>
							Yes
						</BTN>
                    </ModalFooter>
                </Modal>

                <Modal toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)} isOpen={this.state.comprehensivePremiumPolicyType}>

                    <ModalHeader toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
                        Coverage Type {this.state.premiumPolicyType}
                    </ModalHeader>

                    <ModalBody>
                        <span>Please change Vessel Type and add Sum Insured Amount to chnage the Coverage type to <b>{this.state.premiumPolicyType}</b> ?</span>
                    </ModalBody>

                    <ModalFooter>
                        <BTN color="success" onClick={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
                            <i className="fa fa-check"></i>
							Ok
						</BTN>
                    </ModalFooter>
                </Modal>
                {/* Coverage Type Model */}

                {/* Delete Boating Qualification Type Model */}
                <Modal isOpen={this.state.toggleModalGeneral} toggle={() => this.toggleLargeGeneral()}>
                    <ModalHeader toggle={() => this.toggleLargeGeneral()}> Delete Boating Qualification </ModalHeader>
                    <ModalBody> Are you sure you want to Delete <b>{this.state.deleteItemName}</b> Boating Qualification? </ModalBody>
                    <ModalFooter>
                        <BTN style={{ marginLeft: "10px" }} color="danger" onClick={() => this.deleteBoatingQualification(this.state.tempData)}>
                            <i style={{ marginRight: "10px" }} className="fa fa-trash"></i>
                            {DeleteButton}
                        </BTN>

                        <BTN style={{ marginLeft: "10px" }} color="primary" onClick={() => this.toggleLargeGeneral()}>
                            <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                            {CancelButton}
                        </BTN>
                    </ModalFooter>
                </Modal>
                {/* Delete Boating Qualification Type Model */}

                {/* Revert MTA Model */}
                <Modal isOpen={this.state.isRevertPolicyPopup} toggle={() => this.toggleRevertPolicyDetailPopup()}>
                    <ModalHeader toggle={() => this.toggleRevertPolicyDetailPopup()}> Cancel all changes </ModalHeader>
                    <ModalBody> Are you sure you want to cancel the Policy changes you have made ? </ModalBody>
                    <ModalFooter>
                        <BTN style={{ marginLeft: "10px" }} color="danger" onClick={() => this.revertPolicyDetail()}>
                            <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                            Yes
                        </BTN>

                        <BTN style={{ marginLeft: "10px" }} color="primary" onClick={() => this.toggleRevertPolicyDetailPopup()}>
                            <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                            No
                        </BTN>
                    </ModalFooter>
                </Modal>
                {/* Revert MTA Model */}

                {/* Confirm MTA Model (Green Button) */}
                <Modal isOpen={this.state.adjustmentPopup} className={'modal-lg modal-primary '} >
                    <ModalHeader toggle={() => this.cancelAdjustmentModel()}>
                        {(this.state.modelAction == 1 ? 'Mid-Term Adjustment' : this.state.modelAction == 2 ? 'Laid Up Ashore' : 'Cancel Policy')}
                    </ModalHeader>
                    <ModalBody>
                        <Col style={{ margin: 15 }}>

                            <Row>
                                <Col md="3">
                                    <label>Policy Number</label>
                                </Col>
                                <Col md="3">
                                    <label>{this.state.policyNumber}</label>
                                </Col>
                                {/* <Col md="3">
                                    <label>Total Due</label>
                                </Col>
                                <Col md="3">
                                    <label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.paymentDue}</label>
                                </Col> */}
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3">
                                    <label>Adjustment Date *</label>
                                </Col>
                                <Col md="3">
                                    <Input type="date" name="adjustmentDate" id="adjustmentDate" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.adjustmentDate}
                                        min={moment().subtract(100, 'years').format('YYYY-MM-DD')}
                                        max={moment().format('YYYY-MM-DD')} readOnly />
                                    <em className="error invalid-feedback" >Please enter adjustment date</em>
                                </Col>

                                {/* <Col md="3">
                                    <label>New Total Due</label>
                                </Col>
                                <Col md="3">
                                    <label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.newDuePayment.toFixed(2)}</label>
                                </Col> */}
                            </Row>

                            <Row style={{ marginTop: 30, marginLeft: 10 }}>
                                <Col>
                                    <Row>
                                        {this.state.adjustmentAmountList.map((value, index) => {
                                            // console.log("adjustmentAmountList", value, index);
                                            return (
                                                <Col md="4">
                                                    <Input type="radio" name="transactionType" value={value.StringMapName} onChange={() => this.onRadioBtnClick(value.StringMapName)} checked={this.state.transactionType == value.StringMapName ? true : false} /><label>{value.StringMapName}</label>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Col>
                            </Row>

                            {/* {(this.state.transactionType == 'Premium Unchanged') ? (
                                null
                            ) : ( */}
                            <div>
                                <Row style={{ marginTop: 10 }}>
                                    <Col md="4">
                                        <label></label>
                                    </Col>

                                    <Col md="2">
                                        <label>Suggested</label>
                                    </Col>

                                    <Col md="2">
                                        <label>Actual</label>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: 10 }}>
                                    <Col md="4">
                                        <label>Actual Amount</label>
                                    </Col>
                                    <Col md="2">
                                        <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeAmount}
                                        </label>
                                    </Col>
                                    <Col md="2">
                                        <div className="input-box">
                                            <Input type="text" name="actualAmount" id="actualAmount" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.actualAmount}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please enter Actual Amount</em>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {/* )} */}

                            <Row style={{ marginTop: 10 }}>
                                <Col md="4">
                                    <label>Mid Term Adjustment Fee
                        {/* {this.state.suggestedByEvo} */}
                                    </label>
                                </Col>
                                <Col md="2">
                                    <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeFee}
                                    </label>
                                </Col>
                                <Col md="2">
                                    <div className="input-box">
                                        <Input type="text" name="mtdFees" id="mtdFees" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.mtdFees}>
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter Mid Term Adjustment Fee</em>
                                    </div>
                                </Col>
                                <Col md="4">
                                    {(this.state.transactionType == 'Premium Unchanged') ? (
                                        <a href="javascript:void(0)" onClick={() => this.toggleForNoCharge('PremiumUnchanged')}>Do not charge</a>
                                    ) : (
                                            null
                                        )}

                                </Col>
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col md="4">
                                    <label>Total Mid Term Charges</label>
                                </Col>
                                <Col md="2">
                                    <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.defaultTotal}</label>
                                </Col>
                                <Col md="4">
                                    <label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.totalMtdCharges.toFixed(2)}</label>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col md="4">
                                    <label>Note*</label>
                                </Col>
                                <Col md="5">
                                    <div className="input-box">
                                        <Input type="textarea" name="mtdNote" id="mtdNote" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.mtdNote}>
                                        </Input>
                                        <em className="error invalid-feedback" >Please enter note</em>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.saveMidTermModel()}><i style={{ marginRight: "10px" }} className="fa fa-check"></i>Accept</BTN>
                        <BTN style={{ marginLeft: 20 }} color="danger" onClick={() => this.cancelAdjustmentModel()}><i style={{ marginRight: "10px" }} className="fa fa-times"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>
                {/* Confirm MTA Model (Green Button) */}

                {/* Confirmation Popup On Stage Change */}
                <Modal isOpen={this.state.toggleStageChangeModal} toggle={() => this.toggleStageChange('stageChange')}
                    className={'modal-mg modal-primary'}>
                    <ModalHeader toggle={() => this.toggleStageChange('stageChange')}>Change Stage Confirmation</ModalHeader>
                    <ModalBody>
                        <Col>
                            <Row>
                                {this.state.previousStage == ''? null
                                    // <Col md="12">
                                    //     <label>Change Refe <span>{this.state.previousStage}</span> To <span>{this.state.stage}</span></label>
                                    // </Col>
                                :
                                    <Col md="12">
                                        <label>Changing Stage From <span>{this.state.previousStage}</span> To <span>{this.state.stage}</span></label>
                                    </Col>
                                }
                            </Row>
                            {(this.state.stage == 'Referred') ?
                                (<Row>
                                    <Col md="8">
                                        <div className="input-box">
                                            <label> Referred To *</label>
                                            <div className="pl-inner">
                                            {CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting'  ? 

                                                <Input type="select" name="referredTo" id="referredTo" onChange={(e) => this.selectType(e.target.value, 'referredTo')} value={this.state.referredTo}>
                                                    <option value=''>Select</option>
                                                        
                                                       { this.state.referrList.map((ct, i) => {
                                                            return (<option value={ct.EntityId}>{ct.Forename}</option>)
                                                        })}
                                                        
                                                </Input>
                                                : <label> Underwriting Team</label> }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>) : (null)}
                            <Row>
                                <Col md="8">
                                    <div className="input-box">
                                        <label>Note</label>
                                        <Input type="textarea" name="changeNote" id="changeNote" onChange={(e) => this.handleChangePolicyDetail(e)} value={this.state.changeNote}>
                                        </Input>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.savePolicyStage()}>
                            <i className="fa fa-check"></i>
							Proceed
						</BTN>
                        <BTN color="danger" onClick={() => this.toggleStageChange('stageChange')}>
                            <i className="fa fa-close"></i>
							Close
						</BTN>
                    </ModalFooter>
                </Modal>
                {/* Confirmation Popup On Stage Change */}
                </div>
                }
            </div>
            </>
        );
    }
}

export default withTranslation()(PolicyDetailsMerged);
