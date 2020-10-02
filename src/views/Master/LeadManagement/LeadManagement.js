import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import DatePicker from 'react-date-picker';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { CommonConfig } from '../../../utils/constants';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col, InputGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { Number } from 'core-js';
import Underwriting from '../../Policy/Underwriting';
import { apiBase } from '../../../utils/config'



class LeadManagement extends Component {

    constructor(props) {
        super(props);
        let columns = [
            { selectionMode: "multiple", style: { width: '3em' }, id: 0 },
            { body: this.filenameTemplate.bind(this), field: "filename", header: "Nombre", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            //   { body: this.format_createddate_createdby.bind(this), field: "createdon", header: "Created/CreatedBy", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            // { field: "createdby", header: "CreatedBy", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            //    { field: "directory", header: "Directory", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { body: this.actionTemplate.bind(this), header: "Acción", sortable: false, filter: false, id: 4 },
        ];

        this.state = {
            PreferLanguage: '',
            branchList: [],
            branch: '',
            branchId: '',
            branchError: false,

            sourceList: [],
            source: '',
            sourceError: false,

            sourceNameList: [],
            sourceName: '',
            sourceNameError: false,

            vesselType: '',
            vesselTypeError: false,

            boatClassList: [],
            boatClass: '',
            boatClassName: '',
            boatClassError: false,

            boatTypeList: [],
            boatType: '',
            boatTypeName: '',
            boatTypeError: false,
            showBoatClass: false,
            showBoatType: false,
            showClaimDetail: false,
            length: '',
            lengthError: false,
            makeAndModel: '',
            makeAndModelError: false,
            sumInsured: '',
            sumInsuredError: false,
            yearBuilt: '',
            yearBuiltError: false,
            YBuilt: '',
            purchasePrice: '',
            purchasePriceError: false,
            renewalMONTHList: [],
            renewalMONTH: '',
            renewalMONTHError: '',
            Year: '',
            countryList: [],
            country: '',
            countryError: false,

            boatFlagList: [],

            whereRegList: [],
            whereReg: '',
            whereRegError: false,
            cols: columns,

            boatMooredList: [],
            boatMoored: '',
            boatMooredError: false,

            mooringTypeList: [],
            mooringType: '',
            mooringTypeError: false,

            cruisingRangeList: [],
            noOfEngineList: [],
            noOfEngine: '',
            noOfEngineError: false,

            languageList: [],
            language: '',
            languageError: false,

            department: '',
            departmentList: [],
            selectedDepartment: '',
            selectedDepartmentError: false,
            departmentError: false,

            hullMaterial: '',
            hullMaterialError: false,

            showBoatFlagDropDown: false,
            boatFlag: '',
            boatFlagError: false,

            showCruisingRangeDD: false,
            cruisingRange: '',
            cruisingRangeFromList: '',
            cruisingRangeFromListError: false,
            cruisingRangeError: false,

            noOfYearInsured: Number(0),
            noOfYearInsuredError: false,

            isPreviousClaim: false,
            isPreviousClaimError: false,
            previousInsurer: '',
            previousInsurerError: '',
            liabilityType: '',
            liabilityTypeError: false,

            currencyType: '',
            currencyTypeError: false,

            transmissionMainEngineList: [],
            transmissionMainEngine: '',
            transmissionMainEngineError: false,

            waterToyLiability: false,
            indemnityRequired: false,
            isRRE: false,

            isWaterSkiing: false,
            waterSkiingLiability: 1000000,
            waterSkiingLiabilityError: false,
            waterSkiingLiabilityError: false,
            systemWaterSkiingLiability: '',

            isSailRacing: false,

            DisplayWater: 0,
            DisplayRacing: 0,
            DisplayCrew: 0,

            CrewLiabilityList: [],
            crewLiability: '',
            crewLiabilityError: false,

            isWaterToys: false,
            waterToysLiability: 1000000,
            systemWaterToysLiabiility: '',

            isSailRacing: false,
            sailRacingCoverageError: false,
            sailRacingCoverage: '',

            RacingEventTypeList: [],
            racingEventType: '',
            racingEventTypeError: true,

            systemWaterToysLiabiilityError: false,
            systemWaterSkiingLiabilityError: false,

            forename: '',
            forenameError: false,

            surname: '',
            surnameError: false,

            email: '',
            emailError: false,

            residenceCountry: '',
            residenceCountryError: false,

            phoneNumber: '',
            phoneNumberError: false,

            notesError: false,
            notes: '',

            claimNotes: '',
            claimNotesError: false,

            ThirdPartyLiabilityList: [],
            thirdPartyLiability: '',
            thirdPartyLiabilityError: true,

            iagreecheck: false,
            policyNumebr: '',
            policyId: '',
            TPO: false,
            uploadCollapse: false,


            selectedfile: '',
            Extension: '',
            FileName: '',
            FileNameError: true,
            file: '',
            Description: '',
            valueError: true,
            fileError: true,
            engineMakeAndModel:'',
            engineMakeAndModelError:'',
            engineYearError:'',


            boatClassListCopy: [],


            documentList: [],
            str: '',
            selectedPage: 0,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            selectedCars3: '',
        };
        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

    }

    componentDidMount() {
        let loggedInUserData = CommonConfig.loggedInUserData();
        //    console.log("loggedInUserData",loggedInUserData);
        //   console.log("loggedInUserData.PreferredLanguage",loggedInUserData.PreferredLanguage);
        this.setState({ PreferLanguage: loggedInUserData.PreferredLanguage });
        setTimeout(() => {
            //      console.log("this.state.preferLang---------In",this.state.PreferLanguage);   
        }, 1000);
        //      console.log("this.state.preferLang---------OUT",this.state.PreferLanguage);



        setTimeout(() => {
            let ThirdPartyStringMapType = CommonConfig.ThirdPartyStringMapOnCountry(this.state.country);
            this.getDropDownValues(ThirdPartyStringMapType, 'ThirdPartyLiabilityList', 'SortOrder');
        }, 500);
        this.getBranchList();
        this.getDropDownValues('POLICYDEPARTMENT', 'departmentList', 'StringMapName');
        this.getDropDownValues('COUNTRY', 'countryList', 'StringMapName');
        this.getDropDownValues('NOOFENGINES', 'noOfEngineList', 'StringMapName');
        this.getDropDownValues('RACINGEVENTTYPE', 'RacingEventTypeList', 'StringMapName');
        this.getDropDownValues('TRANSMISSIONS', 'transmissionMainEngineList', 'StringMapName');
        this.getDropDownValues('THIRDPARTYLIABILITYSPAIN', 'ThirdPartyLiabilityListSpain', 'SortOrder');
        this.getDropDownValues('CREWLIABILITY', 'CrewLiabilityList', 'SortOrder');
        this.getDropDownValues('MONTH', 'renewalMONTHList', 'StringMapKey');
        this.getMooringZones();
        this.getWaterSkiiAndWaterToys();
        this.getBoatFlagList();
        this.getCruisingRangeList();
        this.getLanguageList();
        this.getBoatClassList();
        this.getBoatRegisterList();
    }

    // getBoatTypeList() {
    //     api.post('api/getVesselTypeList').then(res => {
    //         if (res.success) {
    //             this.setState({ boatTypeList: res.data });
    //         } else {
    //         }
    //     }).catch(err => {
    //         console.log("errr", err);
    //     });
    // }

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
                    var flag = 0;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data.length == 1) {
                            this.state.boatType = res.data[i].VesselTypeId;
                            flag = 1;
                        }


                        formattedData.push({
                            label: res.data[i].VesselTypeName,
                            value: res.data[i].VesselTypeId,
                        });
                    }

                    this.setState({ boatTypeList: formattedData });
                    if (flag == 1)
                        this.selectType(this.state.boatType, 'boatType');

                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getVesselClass(val, Country) {
        try {
            const data = {
                VesselTypeName: val,
                Country: Country,
            };
            console.log('getVesselClassByType', data);
            api.post('api/getVesselClassByType', data).then(res => {
                console.log('getVesselClassByType', res);

                if (res.success) {
                    var formattedData = [];

                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            VesselClassName: res.data[i].VesselClassName,
                            VesselClassId: res.data[i].VesselClassId,
                        });
                    }

                    this.setState({ boatClassListCopy: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getBoatClassList() {
        let data = {}
        api.post('api/getVesselClassList', data).then(res => {
            if (res.success) {
                this.setState({ boatClassList: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }

    getBoatRegisterList() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
                orderby: 'StringMapName'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].StringMapKey
                        })
                    }
                    this.setState({ whereRegList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }
    mulSelect(e) {
        console.log("eeeee", e.value);
        this.setState({ selectedCars3: e.value });
    }
    RemoveData(e) {
        console.log("eeeee", e);



    }
    getBranchList() {
        let data = {}
        api.post('api/getBranchList', data).then(res => {
            if (res.success) {
                var formattedData = [];
                for (let i = 0; i < res.data[0].length; i++) {

                    if (res.data[0].length == 1)
                        this.state.branch = res.data[0][i].LeadBranchId;

                    formattedData.push({
                        label: res.data[0][i].BranchName,
                        value: res.data[0][i].LeadBranchId
                    })
                }
                console.log('branchList.......', formattedData)
                this.setState({ branchList: formattedData });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }

    getSourceList(value) {
        let data = {
            BranchId: value,
        }
        api.post('api/getSourceList', data).then(res => {
            if (res.success) {
                var formattedData = [];
                var flag = 0;
                for (let i = 0; i < res.data[0].length; i++) {

                    if (res.data[0].length == 1) {
                        this.state.source = res.data[0][i].BranchId;
                        flag = 1;
                    }
                    formattedData.push({

                        entityType: res.data[0][i].LeadSourceEntityType,
                        value: res.data[0][i].BranchId
                    })
                }
                console.log('sourceList.......', formattedData)
                this.setState({ sourceList: formattedData });
                if (flag == 1)
                    this.getSourceNameList(this.state.source);
                // this.setState({ sourceList: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }


    getSourceNameList(id) {
        console.log("ididididid", id);
        var ar = this.state.sourceList.filter(x => x.entityType == id);
        console.log("arararararar", ar);
        let data = {
            BranchId: ar[0].value,
            SourceType: ar[0].entityType
        }

        api.post('api/getSourceNameList', data).then(res => {
            if (res.success) {
                var flag = 0;
                var formattedData = [];
                for (let i = 0; i < res.data[0].length; i++) {

                    if (res.data[0].length == 1) {
                        this.state.sourceName = res.data[0][i].LeadSourceId;
                        flag = 1;
                    }
                    formattedData.push({
                        label: res.data[0][i].diplayLabel,
                        type: res.data[0][i].LeadSourceEntityType,
                        value: res.data[0][i].LeadSourceId,
                    })
                }
                console.log('sourceNameList.......', formattedData)
                this.setState({ sourceNameList: formattedData });
                // this.setState({ sourceNameList: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
    }

    getmooringType(value) {
        let data = {
            mooring_Type: value
        }
        api.post('api/getMooringTypeDataByMoored', data).then(res => {
            if (res.success) {
                var mooringType = [];

                for (var i = 0; i < res.data.length; i++) {

                    if (res.data.length == 1)
                        this.state.mooringType = res.data[i].MooringGuideId;

                    mooringType.push({
                        label: res.data[i].MooringType,
                        value: res.data[i].MooringGuideId,
                    })
                }
                this.setState({ mooringTypeList: mooringType });
            }
        })
    }

    getDocumentList(type) {
        try {
            const data = {
                entityType: 'Policy',
                entityId: this.state.policyId,
                documentType: type
            };
            api.post("api/getDocumentListByTypeAndId", data).then(res => {
                console.log("res", res);
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            oDocumentId: res.data[i].DocumentId,
                            documentid: [i + 1],
                            filename: res.data[i].Filename,
                            createdon: moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateTime),
                            type: res.data[i].Type,
                            url: res.data[i].URL,
                            directory: res.data[i].Directory,
                            createdby: res.data[i].forename
                        })
                    }
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ documentList: formattedData, str: str });
                } else {

                }
            }).catch(err => {

            });
        } catch (error) {

        }
    }


    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.documentList.length) ? l : this.state.documentList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.documentList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getLanguageList() {

        var formattedLanguage = [];

        try {
            api.get(APIConstant.path.getLanguage).then(res => {

                if (res.success) {

                    for (var i = 0; i < res.data.length; i++) {

                        if (res.data.length == 1)
                            this.state.language = res.data[i].Language;

                        formattedLanguage.push({
                            label: res.data[i].Language,
                            value: res.data[i].Language,
                        });
                    }
                    this.setState({ languageList: formattedLanguage });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {

        }
    }

    getCruisingRangeList() {
        try {
            const data = {
                stringmaptype: 'CRUISINGRANGE',
                orderby: 'SortOrder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("cruisingRange.......", res.data);
                    var filterdata = res.data.filter(x => x.LanguageId === 'en-IE')
                    console.log("filterdata...", filterdata)

                    var formattedData = [];
                    for (let i = 0; i < filterdata.length; i++) {
                        formattedData.push({
                            label: filterdata[i].Description,
                            value: filterdata[i].StringMapKey
                        })
                    }
                    this.setState({ cruisingRangeList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getBoatFlagList() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
                orderby: 'StringMapName'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].StringMapKey
                        })
                    }
                    this.setState({ boatFlagList: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }


    getWaterSkiiAndWaterToys() {
        api.post('api/getWaterSkiiAndWaterToys').then(res => {
            console.log(res.data);

            if (res.success) {
                this.setState({
                    systemWaterSkiingLiability: res.data[0].WaterSkiingLiability,
                    systemWaterToysLiabiility: res.data[0].WaterToysLiabiility
                });
            }
        }).catch(err => {
            console.log("error", err);
        });
    }

    getMooringZones() {
        const data = {
            pMode: 'mooringName',
            zone: 'Irish Website',
            mooringName: '',
            mooringType: '',
            PolicyId: '',
        };
        api.post('api/getMooringGuideDetails', data).then(res => {
            if (res.success) {
                console.log("MooringGuideName", res);
                var formattedData = [];
                for (let i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        label: res.data[i].MooringName,
                        value: res.data[i].MooringName,

                    })
                }
                console.log("boatmorredlist", formattedData);
                this.setState({ boatMooredList: formattedData });
            }
        }).catch(err => {

        });
    }

    getDropDownValues(stringMapType, setStateName, orderby) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderby
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("res.data res.data res.data", res.data);
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }
    languageToggle(val){
        if(val ==='Spanish')
        this.setState({ PreferLanguage: 'es-ES' });
        else
        this.setState({ PreferLanguage: 'en-IE' });

    }
    onDepartmentChange(val) {
        if (val === 'Central') {
            this.setState({ department: val, showDepartmentDD: true });
            this.getSourceList('')
        } else {
            this.setState({ department: val, showDepartmentDD: false, selectedDepartment: '', selectedDepartmentError: false });
        }
    }

    onVesselTypeChange(val) {
        debugger
        this.setState({ vesselType: '', boatClass: '', boatClassName: '', boatType: '', boatTypeName: "", boatClassError: false, boatTypeError: false });
        if (val === 'Other') {
            this.setState({ showBoatClass: true, showBoatType: true, vesselType: val, boatClass: '', boatType: '', boatTypeList: [] });
        } else {
            let data = this.state.boatClassList.filter(x => x.VesselClassName == val);
            if (data.length && val != "RIB" && val != "Fast Fisher") {
                this.setState({ showBoatClass: false, showBoatType: true, boatClassName: data[0].VesselClassName, boatClass: data[0].VesselClassId, boatType: '', boatClassError: false, boatClass: data[0].VesselClassId, boatClassName: data[0].VesselClassName });
                this.getVesselType(data[0].VesselClassId, this.state.country, this.state.TPO);


                var SelectedId = data[0].VesselClassName;

            } else {
                // this.getVesselClass( val , this.state.country)
                if (val == "Racing Yacht")
                    var SelectedId = "Racing Yacht";
                else
                    if (val == "RIB")
                        var SelectedId = "RIB";
                    else
                        if (val == "Fast Fisher")
                            var SelectedId = "Fast Fisher";
                        else
                            if (val == "Cruising Yacht")
                                var SelectedId = "Fast Fisher";



                this.setState({ showBoatType: false, showBoatClass: false, boatClass: '', boatType: '', boatTypeError: false })
            }
            this.setState({ vesselType: val });
        }
        let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(SelectedId);

        this.setState({
            DisplayWater: DisplayCondition.displayWater,
            DisplayRacing: DisplayCondition.displayRacing,
            DisplayCrew: DisplayCondition.displayCrew
        });
    }

    filenameTemplate(rowData, column) {
        var path = apiBase + "" + rowData.url;
        return (<div><a href={path} target="_new">{rowData.filename}</a></div>);
        // return {rowData.filename};
    }

    format_createddate_createdby(rowData) {
        return (
            <div className="policy-list-data">
                <p>{moment(rowData.createdon, 'DD/MM/YYYY hh:mm').format('DD-MM-YYYY,hh:mm A')}</p>
                {/* <p>{rowData.createdon}</p> */}
                <p>{rowData.createdby}</p>
            </div>
        )
    }

    actionTemplate(rowData, column) {

        return <div className="text-center">
            <Button type="button" icon="pi pi-trash" style={{ margin: 2 }} tooltip={this.state.PreferLanguage == 'es-ES' ?"Eliminar":"Remove"} tooltipOptions={{ position: 'bottom' }} onClick={() => this.RemoveData(this.state.documentList)}></Button>
            {//   <Button type="button" icon="pi pi-envelope" style={{ margin: 2 }} tooltip="Email" tooltipOptions={{ position: 'bottom' }} onClick={() => this.emailData()}></Button>
                //<Button type="button" icon="pi pi-print" style={{ margin: 2 }} tooltip="Print" tooltipOptions={{ position: 'bottom' }} onClick={() => this.printData()}></Button>
            }
        </div>;
    }


    viewPolicy(rowData) {
        console.log("RowData", rowData);
        window.open(window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData + '/1/1', '_blank');
    }

    onHullMaterailChange(val) {
        this.setState({ hullMaterial: val });
    }

    onBoatFlagChange(val) {
        if (val === 'Other') {
            this.setState({ showBoatFlagDD: true, boatFlag: val });
        } else {
            if (val == 'Belgium' || val == 'France') {
                this.setState({ boatFlag: val, country: 'Ireland', showBoatFlagDD: false, whereReg: '', whereRegError: false });
            } else {
                this.setState({ boatFlag: val, country: val, showBoatFlagDD: false, whereReg: '', whereRegError: false });
            }
            if (val == 'Ireland' || val == 'UK')
                this.setState({ languageError: false, language: "English" });
            else
                if (val == 'Spain')
                    this.setState({ languageError: false, language: "Spanish" });
                else
                    if (val == 'Germany')
                        this.setState({ languageError: false, language: "German" });
                    else
                        this.setState({ languageError: false, language: "Select" });
            if (val == 'UK' )
                this.setState({ currencyType: "Pounds" });
            else
                this.setState({ currencyType: "Euro" });
            let ThirdPartyStringMapType = CommonConfig.ThirdPartyStringMapOnCountry(val);
            this.getDropDownValues(ThirdPartyStringMapType, 'ThirdPartyLiabilityList', 'SortOrder');
        }
    }

    onCruisingRangeChange(val) {
        if (val === 'Other') {
            this.setState({ showCruisingRangeDD: true, cruisingRange: val });
        } else {
            this.setState({ cruisingRange: val, showCruisingRangeDD: false, cruisingRangeFromList: '', cruisingRangeFromListError: false });
        }
    }

    onYearInsuredChange(val) {
        this.setState({ noOfYearInsured: val });
    }

    onPreviousClaimChange(val) { //console.log("vavalvalvalvalvalvalvalvalvall",val);
        this.setState({ isPreviousClaim: val });
        //   console.log(this.state.isPreviousClaim);
        if (!this.state.isPreviousClaim)
            this.setState({ showClaimDetail: true });
        else
            this.setState({ showClaimDetail: false });
    }

    onCoverageTypeChange(val) {
        if (val == "TPO") {
            this.setState({ TPO: true, liabilityType: val });
        } else {
            this.setState({ liabilityType: val, TPO: false });
        }

    }

    onCurrencyChange(val) {
        this.setState({ currencyType: val });
    }

    onindemnityChange(val) {
        this.setState({ indemnityRequired: val });
    }

    onWaterToyLiabilityChange(val) {
        this.setState({ waterToyLiability: val });
    }

    onRREChange(val) {
        this.setState({ isRRE: val });
    }

    oniagreeChange(val) {
        this.setState({ iagreecheck: val })
    }

    selectType(value, type) {
        debugger
        console.log("value value value", value);
        console.log("type type type", type);
        if (type === 'branch') {
            this.setState({ source: "", sourceName: '', sourceNameList: [] })
            if (CommonConfig.isEmpty(value)) {
                this.setState({ branchError: true, branch: value, branchId: value });
                this.show("branch", true, "branchError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione sucursal":"Please select Branch");
            } else {
                this.setState({ branchError: false, branch: value, branchId: value });
                this.show("branch", false, "branchError", "");
                this.getSourceList(value);
            }
        } if (type === 'source') {
            this.setState({ sourceName: '' })
            if (CommonConfig.isEmpty(value)) {
                this.setState({ sourceError: true, source: value });
                this.show("source", true, "sourceError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione fuente":"Please select source");
            } else {
                this.setState({ sourceError: false, source: value });
                this.show("source", false, "sourceError", "");
                this.getSourceNameList(value);
            }
        } if (type === 'sourceName') {

            if (CommonConfig.isEmpty(value)) {
                this.setState({ sourceNameError: true, sourceName: value });
                this.show("sourceName", true, "sourceNameError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el nombre de la fuente":"Please select source name");
            } else {
                this.setState({ sourceNameError: false, sourceName: value });
                this.show("sourceName", false, "sourceNameError", "");
            }
        } if (type === 'boatClass') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ boatClassError: true, boatClass: value });
                this.show("BoatClass", true, "boatClassError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione la clase de barco":"Please select Boat Class");
            } else {

                var data = this.state.boatClassList.filter(x => x.VesselClassId == value)
                this.setState({ boatClassError: false, boatClass: value, boatClassName: data[0].VesselClassName });
                this.show("BoatClass", false, "boatClassError", "");
                this.getVesselType(value, this.state.country, this.state.TPO);


                var SelectedId = data[0].VesselClassName;
                let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(SelectedId);

                this.setState({
                    DisplayWater: DisplayCondition.displayWater,
                    DisplayRacing: DisplayCondition.displayRacing,
                    DisplayCrew: DisplayCondition.displayCrew
                });
            }
        } if (type === 'boatType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ boatTypeError: true, boatType: value });
                this.show("BoatType", true, "boatTypeError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el tipo de barco":"Please select Boat Type");
            } else {
                var data = this.state.boatTypeList.filter(x => x.value == value)

                this.setState({ boatTypeError: false, boatType: value, boatTypeName: data[0].label });
                this.show("BoatType", false, "boatTypeError", "");

                var vesselClass = this.state.boatClassList.filter(x => x.VesselClassName == this.state.boatClassName)
                if (vesselClass.length) {
                    var SelectedClass = vesselClass[0].VesselClassName;

                    if (SelectedClass == 'Yacht' || SelectedClass == 'Vela') {
                        var SelectedId = data[0].label;
                        let DisplayCondition = CommonConfig.ShowHideLimitAdditionalFields(SelectedId);
                        this.setState({
                            DisplayWater: DisplayCondition.displayWater,
                            DisplayRacing: DisplayCondition.displayRacing,
                            DisplayCrew: DisplayCondition.displayCrew
                        })
                    }
                }
            }
        } if (type === 'whereReg') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ whereRegError: true, whereReg: value, country: value });
                this.show("whereReg", true, "whereRegError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione dónde está registrado el barco":"Please select Where is boat registered");
            } else {
                this.setState({ whereRegError: false, whereReg: value, country: value });
                let ThirdPartyStringMapType = CommonConfig.ThirdPartyStringMapOnCountry(value)
                this.getDropDownValues(ThirdPartyStringMapType, 'ThirdPartyLiabilityList', 'SortOrder');
                this.show("whereReg", false, "whereRegError", "");
            }
        } if (type === 'transmissionEngine') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ transmissionMainEngineError: true, transmissionMainEngine: value });
                this.show("transmissionMainEngine", true, "transmissionMainEngineError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el motor de transmisión":"Please select tarnsmission Engine");
            } else {
                this.setState({ transmissionMainEngineError: false, transmissionMainEngine: value });
                this.show("transmissionMainEngine", false, "transmissionMainEngineError", "");
            }
        } if (type === 'boatMoored') {
            debugger

            if (value === '' || value === undefined || value === null) {
                this.setState({ boatMooredError: true, boatMoored: value, mooringTypeList: [] });
                this.show("boatMoored", true, "boatMooredError",  this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione ¿Dónde está amarrado el barco?":"Please select Where is boat moored");
            } else {
                this.getmooringType(value);
                this.setState({ boatMooredError: false, boatMoored: value });
                this.show("boatMoored", false, "boatMooredError", "");
            }
        } if (type === 'mooredType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ mooringTypeError: true, mooringType: value });
                this.show("mooringType", true, "mooringTypeError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione ¿Dónde está amarrado el barco?":"Please select Where is boat moored");
            } else {
                this.setState({ mooringTypeError: false, mooringType: value });
                this.show("mooringType", false, "mooringTypeError", "");
            }
        } if (type === 'noOfEngine') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ noOfEngineError: true, noOfEngine: value });
                this.show("noOfEngine", true, "noOfEngineError",this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione no de motor?":"Please select no of engine");
            } else {
                this.setState({ noOfEngineError: false, noOfEngine: value });
                this.show("noOfEngine", false, "noOfEngineError", "");
            }
        } if (type === 'cruisingRange') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ cruisingRangeFromListError: true, cruisingRangeFromList: value.target.value });
                this.show("", true, "cruisingRangeFromListError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccionar límite de navegación":"Please select cruising range");
            } else {
                this.setState({ cruisingRangeFromListError: false, cruisingRangeFromList: value.target.value });
                this.show("cruisingRange", false, "cruisingRangeFromListError", "");
            }
        } if (type === 'racingEventType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ racingEventTypeError: true, racingEventType: value });
                this.show("racingEventType", true, "racingEventTypeError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el tipo de evento de carreras":"Please select racing event type");
            } else {
                this.setState({ racingEventTypeError: false, racingEventType: value });
                this.show('racingEventType', false, "racingEventTypeError", "");
            }
        } if (type === 'language') {

            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ languageError: true, language: value.value });
                this.show("language", true, "languageError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione idioma":"Please select language");
            } else {
                this.setState({ languageError: false, language: value.value });
                this.show("language", false, "languageError", "");
            }
        } if (type === 'residenceCountry') {

            if (CommonConfig.isEmpty(value.value)) {
                this.setState({ residenceCountryError: true, residenceCountry: value.value });
                this.show("residenceCountry", true, "residenceCountryError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el país de residencia":"Please select residence country");
            } else {
                this.setState({ residenceCountryError: false, residenceCountry: value.value });
                this.show("residenceCountry", false, "residenceCountryError", "");
            }
        } if (type === 'thirdPartyLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ thirdPartyLiabilityError: true, thirdPartyLiability: value });
                this.show("thirdPartyLiability", true, "thirdPartyLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione la responsabilidad de terceros":"Please select third party liability");
            } else {
                this.setState({ thirdPartyLiabilityError: false, thirdPartyLiability: value });
                this.show('thirdPartyLiability', false, "thirdPartyLiabilityError", "");
            }
        } if (type === 'crewLiability') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ crewLiabilityError: true, crewLiability: value });
                this.show("crewLiability", true, "crewLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione la responsabilidad de la tripulación":"Please select crew liability");
            } else {
                this.setState({ crewLiabilityError: false, crewLiability: value });
                this.show('crewLiability', false, "crewLiabilityError", "");
            }
        } if (type === 'renewalMonth') {
            console.log("value value value", value);
            if (CommonConfig.isEmpty(value)) {
                this.setState({ renewalMONTHError: true, renewalMONTH: value });
                this.show("renewalMonth", true, "renewalMONTHError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el mes de renovación":"Please select Renewal Month");
            } else {
                this.setState({ renewalMONTHError: false, renewalMONTH: value });
                this.show('renewalMonth', false, "renewalMONTHError", "");
            }
        }
    }

    onSave() {//console.log("this.state.isPreviousClaim",this.state.isPreviousClaim);

        //  if(!this.state.iagreecheck){
        //     toast.error("Please check and agree the terms");
        //      return;
        // }
        if (this.state.source == '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione fuente":"Please select source")
            return;
        } if (this.state.sourceName == '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el nombre de la fuente":"Please select Source Name")
            return;
        } if (this.state.department === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione fuente":"Please select source")
            return;
        } if (this.state.liabilityType === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor Seleccione el tipo de cobertura":"Please select coverage Type");
            return;
        } if (this.state.renewalMONTH === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el mes de renovación":"Please select Renewal Month")
            return;
        } if (this.state.sourceName === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el nombre de la fuente":"Please select Source Name")
            return;
        } if (this.state.boatFlag === '') { 
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione la bandera del barco":"Please select Boat Flag")
            return;
        } if (this.state.boatFlag === 'Other' && this.state.whereReg === '') {
            this.setState({ whereRegError: true, });
            this.show("whereReg", true, "whereRegError", this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione la bandera del barco":"Please select Boat Flag");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione dónde está registrado el barco":"Please select Where is boat registered")
            return;
        }   if (this.state.makeAndModel === '') {
            this.setState({ makeAndModelError: true });
            this.show("makeAndModel", true, "makeAndModelError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese marca y modelo":"Please enter Make & Model");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese marca y modelo":"Please enter Make & Model")
            return;
        } if (this.state.yearBuilt === '') {
            this.setState({ yearBuiltError: true });
            this.show("yearBuilt", true, "yearBuiltError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el año de construcción":"Please enter year built");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el año de construcción":"Please enter year built")
            return;
        }if (this.state.length === '') {
            this.setState({ lengthError: true });
            this.show("length", true, "lengthError",  this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese la longitud":"Please enter length");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese la longitud":"Please enter length")
            return;
        } 
        if (this.state.purchasePrice === '') {
            this.setState({ purchasePriceError: true });
            this.show("purchasePrice", true, "purchasePriceError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el precio de compra":"Please enter purchase price");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el precio de compra":"Please enter purchase price")
            return;
        }  if (this.state.sumInsured === '') {
            this.show("sumInsured", true, "sumInsuredError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese Suma Asegurada":"Please enter Sum Insured");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese Suma Asegurada":"Please enter Sum Insured")
            return;
        } if (this.state.hullMaterial === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccionar tipo de material":"Please select type of material")
            return;
        } if (this.state.boatMoored === '') {
            this.setState({ boatMooredError: true });
            this.show("boatMoored", true, "boatMooredError", this.state.PreferLanguage == 'es-ES' ?  "Por favor Seleccione ¿Dónde está amarrado el barco?":"Please select Where is boat moored");
            toast.error(this.state.PreferLanguage == 'es-ES' ?  "Por favor Seleccione ¿Dónde está amarrado el barco?":"Please select Where is boat moored");
            return
        } if (this.state.mooringType === '') {
            // toast.error("Please selct boat moored");
            this.setState({ mooringTypeError: true });
            this.show("mooringType", true, "mooringTypeError", this.state.PreferLanguage == 'es-ES' ?  "Por favor Seleccione el tipo de amarre":"Please select Mooring type");
            toast.error(this.state.PreferLanguage == 'es-ES' ?  "Por favor Seleccione el tipo de amarre":"Please select Mooring type");
            return
        }/* if (this.state.engineMakeAndModel === '') {
            this.setState({ engineMakeAndModelError: true });
            this.show("engineMakeAndModel", true, "engineMakeAndModelError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese marca y modelo":"Please enter Make & Model");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese marca y modelo":"Please enter Make & Model");
            return;
        } if (this.state.engineYear === '') {
            this.setState({ engineYearError: true });
            this.show("engineYear", true, "engineYearError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el año":"Please enter year");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el año":"Please enter year");
            return;
        } */ if (this.state.cruisingRange === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor Seleccionar límite de navegación":"Please select cruising range");
            return;
        } if (this.state.cruisingRange === 'Other' && this.state.cruisingRangeFromList === '') {
        
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor Seleccionar límite de navegación":"Please select cruising range");
            return;
        }  if (this.state.currencyType === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor Seleccione Moneda":"Please select Curreny");
            return;
        } if (this.state.language === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione idioma":"Please select language");
            return;
        } if (this.state.residenceCountry === '') {
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor seleccione el país de residencia":"Please select residence country");
            return;
        } if (this.state.forename === '') {
            this.setState({ forenameError: true });
            this.show("forename", true, "forenameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese su nombre":"Please enter First name");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese su nombre":"Please enter First name");
            return;
        } if (this.state.surname === '') {
            this.setState({ surnameError: true });
            this.show("surname", true, "surnameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el apellido":"Please enter Last name");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el apellido":"Please enter Last name");
            return;
        } if (this.state.phoneNumber === '') {
            this.setState({ phoneNumberError: true });
            this.show("phoneNumber", true, "phoneNumberError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el número de celular":"Please enter mobile number");
            toast.error(this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el número de celular":"Please enter mobile number");
            return;
        } if (this.state.email === '') {
            this.setState({ emailError: true });
            this.show("email", true, "emailError", this.state.PreferLanguage == 'es-ES' ?  "Por favor ingrese su correo electrónico":"Please enter Email");
            toast.error(this.state.PreferLanguage == 'es-ES' ?  "Por favor ingrese su correo electrónico":"Please enter Email");
            return;
        }
        var ShowMonth = this.state.renewalMONTH; console.log(ShowMonth);

        var curmonth = new Date().getMonth() + 1;
        console.log(curmonth);
        if (ShowMonth < curmonth)

            var curyear = new Date().getFullYear() + 1;
        else
            var curyear = new Date().getFullYear();
        console.log("curyear", curyear);

        var inceptionDate = moment([parseInt(curyear), parseInt(this.state.renewalMONTH) - 1]).format('YYYY-MM-DD');

        console.log("this.state.renewalMONTH", this.state.renewalMONTH);
        console.log("inceptionDate", inceptionDate);



        let data = {
            LeadBranch: this.state.department,
            LeadSourceId: this.state.sourceName,
            VesselClass: (this.state.boatClass != '' ? this.state.boatClass : ''),
            VesselType: (this.state.boatType != '' ? this.state.boatType : ''),
            VesselClassName: (this.state.boatClassName != '' ? this.state.boatClassName : this.state.vesselType),
            VesselTypeName: (this.state.boatTypeName != "" ? this.state.boatTypeName : this.state.vesselType),
            Length: this.state.length,
            YearBuilt: this.state.yearBuilt,
            PurchasePrice: this.state.purchasePrice,
            SumInsured: this.state.sumInsured,
            Make: this.state.makeAndModel,
            HullMaterial: this.state.hullMaterial,
            VesselRegistrationLocation: (this.state.boatFlag === 'Other' ? this.state.whereReg : this.state.boatFlag),
            PolicyCountry: (this.state.boatFlag === 'Other' ? this.state.whereReg : this.state.boatFlag),
            MooringGuideId: this.state.boatMoored,
            MooringType: this.state.mooringType,
            MainEngine: this.state.engineMakeAndModel,
            MainEngineHp: this.state.cvPower,
            MainEngineYear: this.state.engineYear,
            MainEngineCount: this.state.noOfEngine,
            MainEngineTransmission: this.state.transmissionMainEngine,
            CruisingRange: (this.state.cruisingRange === 'Other' ? this.state.cruisingRangeFromList : this.state.cruisingRange),
            NoOfYearInsured: this.state.noOfYearInsured,
            previousInsurer: this.state.previousInsurer,
            previousClaim: this.state.isPreviousClaim,
            claimNote: this.state.claimNotes,
            LiabilityType: this.state.liabilityType,
            ThirdPartyLiabilityAmount: this.state.thirdPartyLiability,
            RacingEventType: this.state.racingEventType,
            WaterSkiingLiabilityAmount: (this.state.isWaterSkiing ? this.state.waterSkiingLiability : 0),
            WaterToysLiabilityAmount: (this.state.isWaterToys ? this.state.waterToysLiability : 0),
            SailRacingCoverageAmount: (this.state.isSailRacing ? this.state.sailRacingCoverage : 0),
            InceptionDate: inceptionDate,
            Forename: this.state.forename,
            SurName: this.state.surname,
            PhoneNumber: this.state.phoneNumber,
            Email: this.state.email,
            LanguageId: this.state.language,
            Country: this.state.residenceCountry,
            Currency: this.state.currencyType,
            LeadNotes: this.state.notes,
            DocLang: this.state.language,
            Policy_Id: (this.state.policyId != undefined && this.state.policyId != '' && this.state.policyId != null) ? this.state.policyId : '',
        }


        console.log('pdata........', data);

        api.post('api/saveLeadData', data).then(res => {
            if (res.success) {
                debugger
                console.log("lkasdata//", res.data.length)

                if (res.data.length == 3) {
                    toast.success(this.state.PreferLanguage == 'es-ES' ?"Lead creado con éxito":"Lead Created sucessfully");
                    this.setState({ policyId: res.data[1][0]["PolicyId"], policyNumber: res.data[1][0]["vpolicyNumber"] }); console.log('policyidd........', res.data[1][0]["PolicyId"]);
                }
                else {
                    toast.success(this.state.PreferLanguage == 'es-ES' ?"Lead creado con éxito":"Lead Created sucessfully");
                    this.setState({ policyId: res.data[2][0]["PolicyId"], policyNumber: res.data[2][0]["vpolicyNumber"] });
                    console.log('policyidd........', res.data[2][0]["PolicyId"]);
                }
            } else {

            }
        }).catch(err => {
            console.log("err", err)
        });

    }

    uploadDocumenet() {
        this.setState({ uploadCollapse: true })
    }

    selectFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            var docname = event.target.files[0].name.split('.').slice(0, -1).join('.');
            var ext = event.target.files[0].name.split('.').pop();

            this.setState({ selectedfile: event.target.files[0], FileName: docname, FileNameError: false, Extension: ext });
            this.show("FileName", false);
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ file: e.target.result });
                this.show("file", false);
            };
            reader.readAsDataURL(event.target.files[0]);

            console.log('selctedfile', this.state.selectedfile);
        }
        else {
            this.setState({ FileNameError: true, FileName: '', Extension: '' });
        }
    }

    uploadHandleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.name);
        if (e.target.name === 'Description') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ Description: e.target.value });
            }
            else {
                this.setState({ Description: e.target.value });
            }
        } else {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ FileNameError: true, FileName: e.target.value });
                this.show("FileName", true);
            }
            else {
                this.setState({ FileName: e.target.value, FileNameError: false });
                this.show("FileName", false);
            }
        }
    }

    /* upload() { debugger
         // console.log("Documents >> ", this.state);
         if (
           this.state.selectedfile !== ""  &&
           this.state.FileNameError === false
         ) {
     
           var formData = new FormData();
     
 
           formData.append('description', (this.state.Description).trim());
           formData.append('FileName', (this.state.FileName).trim());
           formData.append('Extension', this.state.Extension);
           formData.append('document', this.state.selectedfile);
           formData.append('loggedInUserId', CommonConfig.loggedInUserId());
     
           console.log("upload >> ", formData);
     
         //   api.post('api/uploadDocument', formData).then(res => {
     
         //     if (res.success) {
         //       toast.success("Document's uploaded successfully");
         //       this.togglePrimary();
         //       this.getDocumentList(this.state.documentType);
         //     } else {
         //     }
         //   }).catch(err => {
         //   });
         }
         else {
           if (this.state.FileNameError) this.show("FileName", true);
           if (this.state.selectedfile === '' || this.state.selectedfile === undefined || this.state.selectedfile === null) this.show("file", true);
         }
     }*/
    upload() {
        debugger
        console.log("Documents >> ", this.state);
        if (
            this.state.selectedfile !== "" &&
            this.state.policyId !== "" &&
            this.state.FileNameError === false
        ) {

            var formData = new FormData();

            formData.append('policyNumber', this.state.policyNumber);
            formData.append('directory', "Lead/" + this.state.policyNumber);
            formData.append('policyId', this.state.policyId);
            formData.append('description', (this.state.Description).trim());
            formData.append('FileName', (this.state.FileName).trim());
            formData.append('Extension', this.state.Extension);
            formData.append('document', this.state.selectedfile);
            formData.append('entityId', this.state.policyId);
            formData.append('entityType', "Policy");
            formData.append('loggedInUserId', CommonConfig.loggedInUserId());
            formData.append('languageId', this.state.LanguageId);

            console.log("upload >> ", formData);

            api.post('api/uploadDocument', formData).then(res => {

                if (res.success) {
                    toast.success(this.state.PreferLanguage == 'es-ES' ?"Documentos subidos con éxito":"Documents uploaded successfully");
                    //    this.togglePrimary();
                    this.uploadReset();
                    this.getDocumentList('Lead');
                } else {
                }
            }).catch(err => {
            });
        }
        else {
            if (this.state.valueError) this.show("directory", true);
            if (this.state.FileNameError) this.show("FileName", true);
            if (this.state.selectedfile === '' || this.state.selectedfile === undefined || this.state.selectedfile === null) this.show("file", true);
        }
    }

    uploadReset = () => {
        this.setState({
            Description: '', selectedfile: '', FileName: '', FileNameError: true, Extension: '',
        });
        this.setState({ uploadCollapse: false })
        this.show("FileName", false);

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

    handleChange(e, type) {
        if (e.target.name === 'makeAndModel') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ makeAndModelError: true, makeAndModel: e.target.value });
                this.show("makeAndModel", true, "makeAndModelError", this.state.PreferLanguage == 'es-ES' ?"Por favor introduzca marca y modelo":"Please enter Make & Model ");
            } else if (e.target.value.length > 50) {
                this.setState({ makeAndModelError: true, makeAndModel: e.target.value });
                this.show("makeAndModel", true, "makeAndModelError",  this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese menos de 50":"Please enter less than 50");
            } else {
                this.setState({ makeAndModel: e.target.value, makeAndModelError: false });
                this.show("makeAndModel", false, "makeAndModelError", "");
            }
        }

        if (e.target.name === 'length') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ lengthError: true, length: e.target.value });
                this.show("length", true, "lengthError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese la longitud":"Please enter length");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ lengthError: true, length: e.target.value });
                    this.show("length", true, "lengthError", this.state.PreferLanguage == 'es-ES' ?"Por favor introduzca una longitud válida":"Please enter valid length");
                } else {
                    this.setState({ lengthError: false, length: e.target.value });
                    this.show("length", false, "lengthError", "");
                }
            }
        }

        if (e.target.name === 'yearBuilt') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ yearBuiltError: true, yearBuilt: e.target.value });
                this.show("yearBuilt", true, "yearBuiltError",  this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese el año de construcción":"Please enter year built");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                var minYear = moment().subtract(100, 'year').format('YYYY');
                var maxYear = moment().year();
                if (!yearRegEx.test(year) || (year < minYear || year > maxYear)) {
                    this.setState({ yearBuiltError: true, yearBuilt: e.target.value });
                    this.show("yearBuilt", true, "yearBuiltError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese el año de construcción válido":"Please enter valid year built");
                } else {
                    this.setState({ yearBuiltError: false, yearBuilt: e.target.value });
                    this.show("yearBuilt", false, "yearBuiltError", "");

                }
            }
        }


        if (e.target.name === 'purchasePrice') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ purchasePriceError: true, purchasePrice: e.target.value });
                this.show("purchasePrice", true, "purchasePriceError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese el precio de compra":"Please enter purchase price");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ purchasePriceError: true, purchasePrice: e.target.value });
                    this.show("purchasePrice", true, "purchasePriceError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese un precio de compra válido":"Please enter valid purchase price");
                } else {
                    this.setState({ purchasePriceError: false, purchasePrice: e.target.value });
                    this.show("purchasePrice", false, "purchasePriceError", "");
                }
            }
        }

        if (e.target.name === 'sumInsured') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ sumInsuredError: true, sumInsured: e.target.value });
                this.show("sumInsured", true, "sumInsuredError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese la suma asegurada":"Please enter sum insured");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ sumInsuredError: true, sumInsured: e.target.value });
                    this.show("sumInsured", true, "sumInsuredError",this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese una suma asegurada válida":"Please enter valid sum insured");
                } else {
                    this.setState({ sumInsuredError: false, sumInsured: e.target.value });
                    this.show("sumInsured", false, "sumInsuredError", "");
                }
            }
        }

        if (e.target.name === 'engineMakeAndModel') {

            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ engineMakeAndModelError: true, engineMakeAndModel: e.target.value });
                this.show("engineMakeAndModel", true, "engineMakeAndModelError", this.state.PreferLanguage == 'es-ES' ?"Por favor introduzca marca y modelo":"Please enter Make & Model ");
            } else if (e.target.value.length > 50) {
                this.setState({ engineMakeAndModelError: true, engineMakeAndModel: e.target.value });
                this.show("engineMakeAndModel", true, "engineMakeAndModelError", this.state.PreferLanguage == 'es-ES' ?"Por favor ingrese menos de 50":"Please enter less than 50");
            } else {
                this.setState({ engineMakeAndModel: e.target.value, engineMakeAndModelError: false });
                this.show("engineMakeAndModel", false, "engineMakeAndModelError", "");
            }
        }

        if (e.target.name === 'engineYear') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ engineYearError: true, engineYear: e.target.value });
                this.show("engineYear", true, "engineYearError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el año":"Please enter year");
            } else {
                let yearRegEx = CommonConfig.RegExp.year;
                let year = e.target.value;
                var minYear = moment().subtract(100, 'year').format('YYYY');
                var maxYear = moment().year();
                if (!yearRegEx.test(year) || (year < minYear || year > maxYear)) {
                    this.setState({ engineYearError: true, engineYear: e.target.value });
                    this.show("engineYear", true, "engineYearError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un año válido":"Please enter valid year ");
                } else {
                    this.setState({ engineYearError: false, engineYear: e.target.value });
                    this.show("engineYear", false, "engineYearError", "");

                }
            }
        }

        if (e.target.name === 'cvPower') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ cvPowerError: true, cvPower: e.target.value });
                this.show("cvPower", true, "cvPowerError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca la potencia CV":"Please enter CV Power");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ cvPowerError: true, cvPower: e.target.value });
                    this.show("cvPower", true, "cvPowerError",  this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca una potencia CV válida":"Please enter valid CV Power");
                } else {
                    this.setState({ cvPowerError: false, cvPower: e.target.value });
                    this.show("cvPower", false, "cvPowerError", "");
                }
            }
        }

        if (e.target.name === 'isWaterSkiing') {
            if (e.target.checked) {
                this.setState({ isWaterSkiing: e.target.checked, waterSkiingLiability: this.state.systemWaterSkiingLiability });
            } else {
                this.setState({ isWaterSkiing: e.target.checked, waterSkiingLiability: '' });
            }
        }

        if (e.target.name === 'waterSkiingLiability') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ waterSkiingLiabilityError: true, waterSkiingLiability: e.target.value });
                this.show("waterSkiingLiability", true, "waterSkiingLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese la responsabilidad del esquí acuático":"Please enter water skiing liability");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ waterSkiingLiabilityError: true, waterSkiingLiability: e.target.value });
                    this.show("waterSkiingLiability", true, "waterSkiingLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca la responsabilidad válida de esquí acuático":"Please enter valid water skiing liability");
                } else {
                    this.setState({ waterSkiingLiabilityError: false, waterSkiingLiability: e.target.value });
                    this.show("waterSkiingLiability", false, "waterSkiingLiabilityError", "");
                }
            }
        }

        if (e.target.name === 'isWaterToys') {
            if (e.target.checked) {
                this.setState({ isWaterToys: e.target.checked, waterToysLiability: this.state.systemWaterToysLiabiility });
            } else {
                this.setState({ isWaterToys: e.target.checked, waterToysLiability: '' });
            }
        }

        if (e.target.name === 'waterToysLiability') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ waterToysLiabilityError: true });
                this.show("waterToysLiability", true, "waterToysLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca la responsabilidad válida de esquí acuático":"Please enter water toys liability");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ waterToysLiabilityError: true });
                    this.show("waterToysLiability", true, "waterToysLiabilityError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese la responsabilidad válida por juguetes acuáticos":"Please enter valid water toys liability");
                } else {
                    this.setState({ waterToysLiabilityError: false, waterToysLiability: e.target.value });
                    this.show("waterToysLiability", false, "waterToysLiabilityError", "");
                }
            }
        }

        if (e.target.name === 'isSailRacing') {
            if (e.target.checked) {
                this.setState({ isSailRacing: e.target.checked });
            } else {
                this.setState({ isSailRacing: e.target.checked });
            }
        }

        if (e.target.name === 'sailRacingCoverage') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                this.show("sailRacingCoverage", true, "sailRacingCoverageError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingresa la cobertura de regatas":"Please enter sail racing coverage");
            } else {
                let decimalRegEx = CommonConfig.RegExp.decimalWithOne;
                let decimalWithOne = e.target.value;
                if (!decimalRegEx.test(decimalWithOne)) {
                    this.setState({ sailRacingCoverageError: true, sailRacingCoverage: e.target.value });
                    this.show("sailRacingCoverage", true, "sailRacingCoverageError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingresa una cobertura válida para regatas de vela":"Please enter valid sail racing coverage");
                } else {
                    this.setState({ sailRacingCoverageError: false, sailRacingCoverage: e.target.value });
                    this.show("sailRacingCoverage", false, "sailRacingCoverageError", "");
                }
            }
        }

        if (e.target.name === 'forename') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ forenameError: true, forename: e.target.value });
                this.show("forename", true, "forenameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese su nombre":"Please enter First name");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace; // /^[a-zA-Z]+[a-zA-Z-']*$/; // /^[a-zA-Z]+[a-zA-Z-\s']*$/
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ forenameError: true, forename: e.target.value });
                    this.show("forename", true, "forenameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese su nombre":"Please enter First name");
                } else if (e.target.value.length > 25) {
                    this.setState({ forenameError: true, forename: e.target.value });
                    this.show("forename", true, "forenameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un nombre válido":"Please enter valid First name");
                } else if (e.target.value.length < 3) {
                    this.setState({ forenameError: true, forename: e.target.value });
                    this.show("forename", true, "forenameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un nombre válido":"Please enter valid First name");
                } else {
                    this.setState({ forenameError: false, forename: e.target.value, salutation: e.target.value, salutationError: false });
                    this.show("forename", false, "forenameError", "");
                }
            }
        }

        if (e.target.name === 'surname') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ surnameError: true, surname: e.target.value });
                this.show("surname", true, "surnameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el apellido":"Please enter Last name");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace; // /^[a-zA-Z]+[a-zA-Z-']*$/;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ surnameError: true, surname: e.target.value });
                    this.show("surname", true, "surnameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un apellido válido":"Please enter valid Last name");
                } else if (e.target.value.length > 25) {
                    this.setState({ surnameError: true, surname: e.target.value });
                    this.show("surname", true, "surnameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un apellido válido":"Please enter valid Last name");
                } else if (e.target.value.length < 3) {
                    this.setState({ surnameError: true, surname: e.target.value });
                    this.show("surname", true, "surnameError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese un apellido válido":"Please enter valid Last name");
                } else {
                    this.setState({ surnameError: false, surname: e.target.value });
                    this.show("surname", false, "surnameError", "");
                }
            }
        }

        if (e.target.name === 'phoneNumber') {

            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ phoneNumberError: true, phoneNumber: e.target.value });
                this.show("phoneNumber", true, "phoneNumberError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese el número de celular":"Please enter mobile number");
            } else {
                let numberRegEx = CommonConfig.RegExp.number; // /^[0-9]+$/;
                let phone = e.target.value;
                if (!numberRegEx.test(phone)) {
                    this.setState({ phoneNumberError: true, phoneNumber: this.state.phoneNumber });
                    this.show("phoneNumber", true, "phoneNumberError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca un número de móvil válido":"Please enter valid mobile number");
                } else if (e.target.value.length < 6) {
                    this.setState({ phoneNumberError: true, phoneNumber: e.target.value });
                    this.show("phoneNumber", true, "phoneNumberError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca un número de móvil válido":"Please enter valid mobile number");
                } else if (e.target.value.length > 15) {
                    this.setState({ phoneNumberError: true, phoneNumber: e.target.value });
                    this.show("phoneNumber", true, "phoneNumberError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca un número de móvil válido":"Please enter valid mobile nmber");
                } else {
                    this.setState({ phoneNumber: e.target.value, phoneNumberError: false });
                    this.show("phoneNumber", false, "phoneNumberError", "");
                }
            }
        }

        if (e.target.name === 'email') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ emailError: true, email: e.target.value });
                this.show("email", true, "emailError", this.state.PreferLanguage == 'es-ES' ? "Por favor ingrese su correo electrónico":"Please enter Email");
            } else {
                var emailRegEx = CommonConfig.RegExp.email; // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegEx.test(e.target.value)) {
                    this.setState({ emailError: true, email: e.target.value });
                    this.show("email", true, "emailError", this.state.PreferLanguage == 'es-ES' ? "Por favor introduzca un correo electrónico válido":"Please enter valid Email");
                } else {
                    this.setState({ email: e.target.value, emailError: false });
                    this.show("email", false, "emailError", "");
                }
            }
        }

        if (e.target.name === 'notes') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ notes: e.target.value });
                // this.setState({ noteError: true });
                // this.show("note", true);
            } else {
                this.setState({ notes: e.target.value, notesError: false });
                // this.show("note", false);
            }
        }

        if (e.target.name === 'claimNotes') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ claimNotes: e.target.value });
                // this.show("note", true);
            } else {
                this.setState({ claimNotes: e.target.value, claimNotesError: false });
                // this.show("note", false);
            }
        }
        if (e.target.name === 'previousInsurer') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ previousInsurer: e.target.value });
                // this.show("note", true);
            } else {
                this.setState({ previousInsurer: e.target.value, previousInsurerError: false });
                // this.show("note", false);
            }
        }
    }

    render() {
        const vesselClassList = this.state.boatClassList.map((type) => {
            return (<option value={type.VesselClassId}>{type.VesselClassName}</option>)
        })
        const vesselClassListCopy = this.state.boatClassListCopy.map((type) => {
            return (<option value={type.VesselClassId}>{type.VesselClassName}</option>)
        })
        //console.log('mooringtype',this.state.mooringType)
        // console.log('boatclasslist',this.state.boatClassList)
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} selectionMode={col.selectionMode} style={col.style} />;
        });
        return (
            <div className="leadmanagment-outer">
                {(this.state.PreferLanguage == 'es-ES') ?
                    <form>
                        <div className="language-btn">
                            <button type="button" className={(this.state.PreferLanguage == 'en-IE')?"btn active": "btn"} onClick={() => this.languageToggle("English")}>English</button>
                            <button type="button" className={(this.state.PreferLanguage == 'es-ES')?"btn active": "btn"}  onClick={() => this.languageToggle("Spanish")}>Spanish</button>
                        </div>   
                        <div className="gt-radio">
                            <label className="blue-label">Fuente</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="department" id="department" value={this.state.department}
                                            checked={this.state.department === 'Central'} onChange={() => this.onDepartmentChange("Central")}></input>
                                        <div className="front-end box"><span>Central</span></div>
                                    </label>
                                    
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="department" id="department" value={this.state.department}
                                            checked={this.state.department === 'Branch' ? true : false} onChange={() => this.onDepartmentChange("Branch")}></input>
                                        <div className="front-end box"><span>Sucursal</span></div>
                                    </label>
                                </div>
                                {this.state.department === 'Branch' ?
                                    <div className="input-box inline s-select">
                                        <div className="row row align-items-center">
                                            <div className="col-lg-4 col-md-4 prn align-right">
                                                <label>Rama</label>
                                            </div>
                                            <div className="col-lg-8 col-md-8">
                                                <select className="form-control" id="branch" name="branch" value={this.state.branch} onChange={(e) => this.selectType(e.target.value, 'branch')}>
                                                    <option value=''>Seleccione</option>
                                                    {this.state.branchList.map((type) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </select>
                                                <em id="branchError" className="error invalid-feedback"></em>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                                <div className="input-box inline s-select">
                                    <div className="row row align-items-center">
                                        <div className="col-lg-4 col-md-4 prn align-right">
                                            <label>Fuente</label>
                                        </div>
                                        <div className="col-lg-8 col-md-8">
                                            <select className="form-control" id="source" name="source" value={this.state.source} onChange={(e) => this.selectType(e.target.value, 'source')}>
                                                <option value=''>Seleccione</option>
                                                {this.state.sourceList.map((type) => {
                                                    return (<option value={type.entityType}>{type.entityType}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="sourceError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-box inline s-select">
                                    <div className="row row align-items-center">
                                        <div className="col-lg-4 col-md-4 prn align-right">
                                            <label>Nombre de la fuente</label>
                                        </div>
                                        <div className="col-lg-8 col-md-8">
                                            <select className="form-control" id="sourceName" name="sourceName" value={this.state.sourceName} onChange={(e) => this.selectType(e.target.value, 'sourceName')}>
                                                <option value=''>Seleccione</option>
                                                {this.state.sourceNameList.map((type) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="sourceNameError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="department" id="department" value={this.state.department} 
                                    checked={this.state.department ==='Sub agent' ? true : false}  onChange={() => this.onDepartmentChange("Sub agent")}></input>
                                    <div className="front-end box"><span>Sub agent</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="department" id="department" value={this.state.department}
                                     checked={this.state.department ==='Service center' ? true : false } onChange={() => this.onDepartmentChange("Service center")}></input>
                                    <div className="front-end box"><span>Service center</span></div>
                                </label>
                            </div> */}
                                {/* <div className="gtradio-box big">
                                <label>
                                    <input type="radio" name="searchType" name="department" id="department" value={this.state.department}
                                     checked={this.state.department === 'Other' ? true : false}  onChange={() => this.onDepartmentChange("Other")} ></input>
                                    <div className="front-end box"><span>Select from Evolution</span></div>
                                </label>
                            </div> */}
                            </div>
                        </div>
                        {/* {this.state.showDepartmentDD ? 
                        <div className="row">
                            <div className="col-lg-5 col-md-5">
                                <div className="input-box">
                                    <label>Select Department</label>
                                    <select className="form-control"id="selectedDepartment" name="selectedDepartment" value={this.state.selectedDepartment} onChange={(e) => this.selectType(e.target.value, 'selectedDepartment')}>
                                    <option value=''>Select</option>
                                    {this.state.departmentList.map((type)=>{
                                        return ( <option value={type.value}>{type.label}</option>)
                                        })
                                    }
                                    </select>
                                    <em id="selectedDepartmentError" className="error invalid-feedback"></em>
                                </div>
                            </div>
                        </div>
                    : null} */}
                        <div className="gt-radio">
                            <label className="blue-label">Seleccione el tipo de cobertura:</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "COMP" ? true : false} onChange={() => this.onCoverageTypeChange('COMP')} ></input>
                                        <div className="front-end box"><span>Exhaustivo</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "TPO" ? true : false} onChange={() => this.onCoverageTypeChange('TPO')}></input>
                                        <div className="front-end box"><span>Sólo la tercera fiesta</span></div>
                                    </label>
                                </div>
                                <div className="input-box inline s-select">
                                    <div className="row align-items-center">
                                        <div className="col-lg-5 col-md-5 align-right prn">
                                            <label>Mes de renovación</label>
                                        </div>
                                        <div className="col-lg-7 col-md-7">
                                            <select className="form-control" name="renewalMonth" id="renewalMonth" value={this.state.renewalMONTH} onChange={(e) => this.selectType(e.target.value, 'renewalMonth')} placeholder="Select">
                                                <option value=''>Seleccione</option>
                                                {this.state.renewalMONTHList.map((type) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="renewalMONTHError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="gt-radio">
                            <label className="blue-label">Bandera de barco: </label>
                            <div className="middle inline">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Ireland' ? true : false} onChange={() => this.onBoatFlagChange('Ireland')}></input>
                                        <div className="front-end box"><span>Irlanda</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Spain' ? true : false} onChange={() => this.onBoatFlagChange('Spain')}></input>
                                        <div className="front-end box"><span>España</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Germany' ? true : false} onChange={() => this.onBoatFlagChange('Germany')}></input>
                                        <div className="front-end box"><span>Alemania</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Belgium' ? true : false} onChange={() => this.onBoatFlagChange('Belgium')}></input>
                                        <div className="front-end box"><span>Bélgica</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'France' ? true : false} onChange={() => this.onBoatFlagChange('France')}></input>
                                        <div className="front-end box"><span>Francia</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'UK' ? true : false} onChange={() => this.onBoatFlagChange('UK')}></input>
                                        <div className="front-end box"><span>GB</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box big">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Other' ? true : false} onChange={() => this.onBoatFlagChange('Other')}></input>
                                        <div className="front-end box"><span>Seleccione desde Evolution</span></div>
                                    </label>
                                </div>
                                {this.state.showBoatFlagDD ?

                                    <div className="gtradio-box big">
                                        <div className="input-box">
                                            <label>Bandera de la embarcación</label>
                                            <select className="form-control" name="whereReg" id="whereReg" value={this.state.whereReg} onChange={(e) => this.selectType(e.target.value, 'whereReg')} placeholder="Select">
                                                <option value=''>Seleccione</option>
                                                {this.state.whereRegList.map((type) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="whereRegError" className="error invalid-feedback"></em>

                                        </div>
                                    </div>


                                    : null}
                            </div>
                        </div>

                        <div className="gt-radio">
                            <label className="blue-label">Seleccione el tipo de embarcación:</label>
                            <div className="middle inline">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Motor Cruisers' ? true : false} onChange={() => this.onVesselTypeChange('Motor Cruisers')}></input>
                                        <div className="front-end box"><span>Barco a motor</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Cruising Yacht' ? true : false} onChange={() => this.onVesselTypeChange('Cruising Yacht')}></input>
                                        <div className="front-end box"><span>Velero</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'RIB' ? true : false} onChange={() => this.onVesselTypeChange('RIB')}></input>
                                        <div className="front-end box"><span>Neumática Semirrígida</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Sports Boat' ? true : false} onChange={() => this.onVesselTypeChange('Sports Boat')}></input>
                                        <div className="front-end box"><span>Lancha a motor</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Fast Fisher' ? true : false} onChange={() => this.onVesselTypeChange('Fast Fisher')}></input>
                                        <div className="front-end box"><span>Pesca/Paseo</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Racing Yacht' ? true : false} onChange={() => this.onVesselTypeChange('Racing Yacht')}></input>
                                        <div className="front-end box"><span>Velero de regatas</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Dinghy' ? true : false} onChange={() => this.onVesselTypeChange('Dinghy')}></input>
                                        <div className="front-end box"><span>Vela Ligera</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Commercial Vessels' ? true : false} onChange={() => this.onVesselTypeChange('Commercial Vessels')}></input>
                                        <div className="front-end box"><span>Barco comercial</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Other' ? true : false} onChange={() => this.onVesselTypeChange('Other')}></input>
                                        <div className="front-end box"><span>Otro</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {this.state.showBoatClass ?
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box"><label>Seleccionar clase de barco</label>
                                        <select className="form-control" id="BoatClass" value={this.state.boatClass} onChange={(e) => this.selectType(e.target.value, 'boatClass')}>
                                            <option value=''>Seleccione</option>
                                            {this.state.vesselType == "Cruising Yacht" || this.state.vesselType == 'Racing Yacht' ? vesselClassListCopy : vesselClassList}
                                            {/* {this.state.boatClassList.map((type)=>{
                                        return ( <option value={type.VesselClassId}>{type.VesselClassName}</option>)
                                        })
                                    } */}

                                        </select>
                                        <em id="BoatClassError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                : null}
                            {this.state.showBoatType ?
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Seleccione el tipo de barco</label>
                                        <select className="form-control" id="BoatType" value={this.state.boatType} onChange={(e) => this.selectType(e.target.value, 'boatType')}>
                                            <option value=''>Seleccione</option>
                                            {this.state.boatTypeList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="BoatType" className="error invalid-feedback"></em>

                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className="row">
                            <div className="col-lg-8 col-md-8">
                                <label className="blue-label">Características embarcación:</label>
                            </div>
                            <div className="col-lg-8 col-md-12">
                                <div className="row">
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Marca y modelo</label>
                                            <input type="text" className="form-control" id='makeAndModel' name='makeAndModel' onChange={(e) => this.handleChange(e)} value={this.state.makeAndModel} placeholder="Marca y modelo"></input>
                                            <em id="makeAndModalError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <div className="input-box">
                                            <label>Año de fabricación</label>
                                            <input type="text" className="form-control" id='yearBuilt' name='yearBuilt' onChange={(e) => this.handleChange(e)} value={this.state.yearBuilt} placeholder="Año de construcción"></input>
                                            <em id="yearBuiltError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <div className="input-box">
                                            <label>Eslora</label>
                                            <input type="text" className="form-control" id='length' name='length' onChange={(e) => this.handleChange(e)} value={this.state.length} placeholder="Longitud"></input>
                                            <em id="lengthError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Precio de compra</label>
                                            <input type="text" className="form-control" id='purchasePrice' name='purchasePrice' onChange={(e) => this.handleChange(e)} value={this.state.purchasePrice} placeholder="Precio de compra"></input>
                                            <em id="purchasePriceError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Suma total Asegurada</label>
                                            <input type="text" className="form-control" id='sumInsured' name='sumInsured' onChange={(e) => this.handleChange(e)} value={this.state.sumInsured} placeholder="Suma Total Asegurada"></input>
                                            <em id="sumInsuredError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="gt-radio material-type">
                                    <label>Material</label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'GRP' ? true : false} onChange={() => this.onHullMaterailChange('GRP')} ></input>
                                                <div className="front-end box"><span>GRPF</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'Wood' ? true : false} onChange={() => this.onHullMaterailChange('Wood')}></input>
                                                <div className="front-end box"><span>Madera</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'Steel' ? true : false} onChange={() => this.onHullMaterailChange('Steel')}></input>
                                                <div className="front-end box"><span>Acero</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="gt-radio">
                        <label className="blue-label">Boat Flag: </label>
                        <div className="middle">
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Ireland' ? true : false} onChange={()=> this.onBoatFlagChange('Ireland')}></input>
                                    <div className="front-end box"><span>Ireland</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Spain' ? true : false} onChange={()=> this.onBoatFlagChange('Spain')}></input>
                                    <div className="front-end box"><span>Spain</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Germany' ? true : false} onChange={()=> this.onBoatFlagChange('Germany')}></input>
                                    <div className="front-end box"><span>Germany</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Belgium' ? true : false} onChange={()=> this.onBoatFlagChange('Belgium')}></input>
                                    <div className="front-end box"><span>Belgium</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box ">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='France' ? true : false} onChange={()=> this.onBoatFlagChange('France')}></input>
                                    <div className="front-end box"><span>France</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box ">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='UK' ? true : false} onChange={()=> this.onBoatFlagChange('UK')}></input>
                                    <div className="front-end box"><span>UK</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box big">
                                <label>
                                    <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Other' ? true : false} onChange={()=> this.onBoatFlagChange('Other')}></input>
                                    <div className="front-end box"><span>Select from Evolution</span></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    {this.state.showBoatFlagDD ?
                        <div className="row">
                            <div className="col-lg-5 col-md-5">
                                <div className="input-box">
                                    <label>Where is Boat Boat Registered</label>
                                    <select className="form-control" name="whereReg" id="whereReg"  value={this.state.whereReg} onChange={(e) => this.selectType(e.target.value, 'whereReg')} placeholder="Select">
                                    <option value=''>Select</option>
                                    {this.state.whereRegList.map((type)=>{
                                        return ( <option value={type.value}>{type.label}</option>)
                                        })
                                    }
                                    </select>
                                    <em id="whereRegError" className="error invalid-feedback"></em>

                                </div>
                            </div>
                        </div>
               
                    : null} */}
                        <div className="lead-box">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <label className="blue-label">Amarre de la embarcación:</label>
                                </div>
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>¿Dónde está la embarcación amarrada?</label>
                                        <select className="form-control" id="boatMoored" name='boatMoored' value={this.state.boatMoored} onChange={(e) => this.selectType(e.target.value, 'boatMoored')}>
                                            <option value=''>Seleccione</option>
                                            {this.state.boatMooredList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="boatMooredError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label >Tipo de amarre:</label>
                                        <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectType(e.target.value, 'mooredType')} value={this.state.mooringType}>
                                            <option value=''>Seleccione</option>
                                            {this.state.mooringTypeList.map((type, i) => {
                                                return (<option value={type.value} key={i}>{type.label}</option>)
                                            })
                                            }
                                        </Input>
                                        {/* <select className="form-control" id="mooringType" name='mooringType' value={this.state.mooringType} onChange={(e) => this.selectType(e.target.value, 'mooredType')} >
                                    {this.state.mooringTypeList.length == 1 ? null :
                                        <option value=''>Select</option>
                                    }
                                    {this.state.mooringTypeList.map((type, i) => {
                                        return (<option value={type.value}>{type.label}</option>)
                                        })
                                    }
                                    </select> */}
                                        <em id="mooringTypeError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lead-box">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <label className="blue-label">Motor:</label>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Marca y Modelo del motor</label>
                                        <input type="text" className="form-control" id='engineMakeAndModel' name='engineMakeAndModel' onChange={(e) => this.handleChange(e)} value={this.state.engineMakeAndModel} placeholder="Marca y modelo"></input>
                                        <em id="engineMakeAndModelError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>Año</label>
                                        <input type="text" className="form-control" id='engineYear' name='engineYear' onChange={(e) => this.handleChange(e)} value={this.state.engineYear} placeholder="Año de construcción"></input>
                                        <em id="engineYearError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>Potencia CV</label>
                                        <input type="text" className="form-control" id='cvPower' name='cvPower' onChange={(e) => this.handleChange(e)} value={this.state.cvPower} placeholder="Potencia CV"></input>
                                        <em id="cvPowerError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>Nº motores</label>
                                        <select className="form-control" name="noOfEngine" id="noOfEngine" onChange={(e) => this.selectType(e.target.value, 'noOfEngine')} value={this.state.noOfEngine}>
                                            <option value=''>Seleccione</option>
                                            {this.state.noOfEngineList.map((type, i) => {
                                                return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="noOfEngineError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Transmisión</label>
                                        <select className="form-control" id='transmission-engine' value={this.state.transmissionMainEngine} onChange={(e) => this.selectType(e.target.value, 'transmissionEngine')}>
                                            <option value=''>Seleccione</option>
                                            {this.state.transmissionMainEngineList.map((type, i) => {
                                                return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="transmissionMainEngineError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gt-radio">
                            <label className="blue-label">Límite de navegación:</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Inland Non Tidal' ? true : false} onChange={() => this.onCruisingRangeChange('Inland Non Tidal')}></input>
                                        <div className="front-end box"><span>Aguas interiores</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Coastal' ? true : false} onChange={() => this.onCruisingRangeChange('Coastal')}></input>
                                        <div className="front-end box"><span>Aguas costeras</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box big">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Other' ? true : false} onChange={() => this.onCruisingRangeChange('Other')}></input>
                                        <div className="front-end box"><span>Seleccione desde Evolution</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {this.state.showCruisingRangeDD ?
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Seleccionar límite de navegación</label>
                                        <select className="form-control" id="cruisingRangeFromList" value={this.state.cruisingRangeFromList} onChange={(data) => this.selectType(data, 'cruisingRange')} placeholder="Select">
                                            <option value=''>Seleccione</option>
                                            {this.state.cruisingRangeList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="cruisingRangeFromListError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                            : null}
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <label className="blue-label">Aseguradora Anterior:</label>
                            </div>
                            <div className="col-lg-2 col-md-2">
                                <div className="input-box">
                                    <label>Nombre de la aseguradora anterior</label>
                                    <input type="text" className="form-control" name="previousInsurer" id="previousInsurer" value={this.state.previousInsurer} onChange={(e) => this.handleChange(e)} placeholder="Aseguradora anterior" ></input>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="gt-radio number-radio">
                                    <label className="gray-label">Nº de años asegurado</label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 1 ? true : false} onChange={() => this.onYearInsuredChange(1)}></input>
                                                <div className="front-end box"><span>1</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 2 ? true : false} onChange={() => this.onYearInsuredChange(2)}></input>
                                                <div className="front-end box"><span>2</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 3 ? true : false} onChange={() => this.onYearInsuredChange(3)}></input>
                                                <div className="front-end box"><span>3</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 4 ? true : false} onChange={() => this.onYearInsuredChange(4)}></input>
                                                <div className="front-end box"><span>4</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 5 ? true : false} onChange={() => this.onYearInsuredChange(5)}></input>
                                                <div className="front-end box"><span>5</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2">
                                <div className="gt-radio number-radio">
                                    <label className="gray-label">Siniestros Anteriores</label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="previous-claim" id="previous-claim" value={this.state.isPreviousClaim} checked={this.state.isPreviousClaim} onChange={() => this.onPreviousClaimChange(true)} ></input>
                                                <div className="front-end box"><span>Si</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="previous-claim" id="previous-claim" value={this.state.isPreviousClaim} checked={!this.state.isPreviousClaim} onChange={() => this.onPreviousClaimChange(false)}></input>
                                                <div className="front-end box"><span>No</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.showClaimDetail ?
                                <div className="col-lg-4 col-md-4">
                                    <div className="input-box">
                                        <label>Detalle del Siniestro</label>
                                        <input type="text" className="form-control" name='claimNotes' id='claimNotes' value={this.state.claimNotes} onChange={(e) => this.handleChange(e)}></input>
                                    </div>
                                </div>
                                : null}

                        </div>
                        {/* <div className="gt-radio">
                        <label className="blue-label">Select the Type of Coverage:</label>
                        <div className="middle">
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "COMP" ? true : false} onChange={()=> this.onCoverageTypeChange('COMP')} ></input>
                                    <div className="front-end box"><span>COMP</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box">
                                <label>
                                    <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "TPO" ? true : false} onChange={()=> this.onCoverageTypeChange('TPO')}></input>
                                    <div className="front-end box"><span>TPO</span></div>
                                </label>
                            </div>
                        </div>
                    </div> */}
                        <div className="gt-radio">
                            <label className="blue-label">Límites de Cobertura</label>
                            {/* <div className="middle">
                            <div className="gtradio-box big">
                                <label>
                                    <input type="checkbox" name='indemnityRequired' id='indemnityRequired' value={this.state.indemnityRequired} checked={this.state.indemnityRequired} onChange={()=> this.onindemnityChange(!this.state.indemnityRequired)}></input>
                                    <div className="front-end box"><span>Limit of indemnity Required</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box big">
                                <label>
                                    <input type="checkbox" name="waterToyLiability" id='waterToyLiability' value={this.state.waterToyLiability} checked={this.state.waterToyLiability} onChange={()=> this.onWaterToyLiabilityChange(!this.state.waterToyLiability)} ></input>
                                    <div className="front-end box"><span>Water skiing  & Toys Liability</span></div>
                                </label>
                            </div>
                            <div className="gtradio-box big">
                                <label>
                                    <input type="checkbox" name="RRE" id='RRE' value={this.state.isRRE} checked={this.state.isRRE} onChange={()=> this.onRREChange(!this.state.isRRE)}></input>
                                    <div className="front-end box"><span>RRE</span></div>
                                </label>
                            </div> 
                         </div> */}
                            <Row>
                                <Col md="3">
                                    <label>La responsabilidad de terceros</label>
                                    <select className="form-control" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                        <option value=''>Seleccione</option>
                                        {this.state.ThirdPartyLiabilityList.map((type, i) => {
                                            return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                        })
                                        }
                                    </select>
                                    <em id="thirdPartyLiabilityError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>

                            {(this.state.DisplayWater == 1) ?

                                <div>
                                    <div className="input-box">
                                        <Row>
                                            <Col md="2">
                                                <label>Responsabilidad de esquí acuático</label>
                                            </Col>
                                            <Col md="2">

                                                <div>
                                                    <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} />
                                                    {this.state.isWaterSkiing ? (
                                                        <input type="text" name="waterSkiingLiability" id="waterSkiingLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterSkiingLiability} readOnly />
                                                    ) : (null)}
                                                    <em id="waterSkiingLiabilityError" className="error invalid-feedback"></em>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="input-box">
                                        <Row>
                                            <Col md="2">
                                                <label>Responsabilidad de juguetes acuáticos</label>
                                            </Col>
                                            <Col md="2">

                                                <div>
                                                    <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} />
                                                    {this.state.isWaterToys ? (
                                                        <input type="text" name="waterToysLiability" id="waterToysLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterToysLiability} readOnly />
                                                    ) : (null)}
                                                    <em id="waterToysLiabilityError" className="error invalid-feedback"></em>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                : null}

                            <Row>
                                {(this.state.DisplayRacing == 1) ?
                                    <Col md="4">
                                        <label>Tipo de evento de carreras</label>
                                        <div>
                                            <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                <option value=''>Seleccione</option>
                                                {this.state.RacingEventTypeList.map((type, i) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="racingEventTypeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    : (null)}

                                {(this.state.DisplayCrew == 1) ?
                                    (
                                        <Col md="2">
                                            <label>Responsabilidad de la tripulación? *</label>
                                            <div>
                                                <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                    <option value=''>Seleccione</option>
                                                    {this.state.CrewLiabilityList.map((type, i) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="crewLiabilityError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>
                                    ) : (null)}

                            </Row>

                            {(this.state.DisplayRacing == 1) ?

                                <Row>
                                    <Col md="3">
                                        <label>Sail Racing Coverage Required?</label>
                                    </Col>
                                    <Col md="2">

                                        <div>
                                            <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} />
                                            {this.state.isSailRacing ? (
                                                <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage} />
                                            ) : (null)}
                                            <em id="sailRacingCoverageError" className="error invalid-feedback"></em>
                                        </div>

                                    </Col>
                                </Row>
                                : null}
                        </div>
                        {/* {this.state.indemnityRequired ?  */}
                        {/* <div className="input-box">
                            <Row>
                                <Col md="3">
                                    <label>Third Party Liability</label>
                                        <select className="form-control" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                            <option value=''>Select</option>
                                            {this.state.ThirdPartyLiabilityList.map((type, i) => {
                                                return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="thirdPartyLiabilityError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>
                        </div> */}
                        {/* : null } */}

                        {/* {this.state.waterToyLiability ?  */}
                        {/* {(this.state.DisplayWater == 1) ?
                                                
                        <div>
                            <div className="input-box">
                                <Row>
                                    <Col md="2">
                                        <label>Water Skiing Liability</label>
                                    </Col>
                                    <Col md="2">

                                        <div>
                                            <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} />
                                            {this.state.isWaterSkiing ? (
                                                <input type="text" name="waterSkiingLiability" id="waterSkiingLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterSkiingLiability} readOnly />
                                            ) : (null)}
                                            <em id="waterSkiingLiabilityError" className="error invalid-feedback"></em>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                            <div className="input-box">
                                <Row>
                                    <Col md="2">
                                        <label>Water Toys Liabiility</label>
                                    </Col>
                                    <Col md="2">

                                        <div>
                                            <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} />
                                            {this.state.isWaterToys ? (
                                                <input type="text" name="waterToysLiability" id="waterToysLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterToysLiability} readOnly />
                                            ) : (null)}
                                            <em id="waterToysLiabilityError" className="error invalid-feedback"></em>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </div>
            
                    : null } */}

                        {/* {this.state.isRRE ?  */}
                        {/* <div className="input-box">
                            <Row>
                                {(this.state.DisplayRacing == 1) ?
                                    <Col md="4">
                                        <label>Racing Event Type</label>
                                        <div>
                                            <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                <option value=''>Select</option>
                                                {this.state.RacingEventTypeList.map((type, i) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="racingEventTypeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                : (null)}

                                {(this.state.DisplayCrew == 1) ?
                                (
                                    <Col md="2">
                                        <label>Crew Liability? *</label>
                                        <div>
                                            <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                <option value=''>Select</option>
                                                {this.state.CrewLiabilityList.map((type, i) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="crewLiabilityError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                ) : (null)}

                            </Row>
                            
                            {(this.state.DisplayRacing == 1) ?

                                <Row>
                                    <Col md="3">
                                        <label>Sail Racing Coverage Required?</label>
                                    </Col>
                                    <Col md="2">

                                        <div>
                                            <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} />
                                            {this.state.isSailRacing ? (
                                                <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage} />
                                            ) : (null)}
                                            <em id="sailRacingCoverageError" className="error invalid-feedback"></em>
                                        </div>

                                    </Col>
                                </Row> 
                            : null }                           
                        </div> */}
                        {/* : null } */}


                        <div className="lead-box">
                            <h3 className="heading-md">Datos del Cliente</h3>
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Nombre de pila</label>
                                        <input type="text" className="form-control" name='forename' id='forename' value={this.state.forename} onChange={(e) => this.handleChange(e)} ></input>
                                        <em id="forenameError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Apellido</label>
                                        <input type="text" className="form-control" name='surname' id='surname' value={this.state.surname} onChange={(e) => this.handleChange(e)} ></input>
                                        <em id="surnameError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Idioma</label>
                                        <select className="form-control" name="language" id="language" onChange={(e) => this.selectType(e.target, 'language')} value={this.state.language} >
                                            <option value=''>Seleccione</option>
                                            {this.state.languageList.map((type, i) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="languageError" className="error invalid-feedback"></em>
                                    </div>

                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <div className="gt-radio medium-box">
                                        <label>Moneda</label>
                                        <div className="middle">
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="currency" id="currency" value={this.state.currencyType} checked={this.state.currencyType === 'Euro' ? true : false} onChange={() => this.onCurrencyChange('Euro')}></input>
                                                    <div className="front-end box"><span>Euro</span></div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="currency" id="currency" value={this.state.currencyType} checked={this.state.currencyType === 'Pounds' ? true : false} onChange={() => this.onCurrencyChange('Pounds')}></input>
                                                    <div className="front-end box"><span>Libras</span></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Correo electrónico</label>
                                        <input type="text" className="form-control" name='email' id='email' value={this.state.email} onChange={(e) => this.handleChange(e)}></input>
                                        <em id="emailError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Teléfono móvil</label>
                                        <input type="text" className="form-control" name='phoneNumber' id='phoneNumber' value={this.state.phoneNumber} onChange={(e) => this.handleChange(e, 'phoneNumber')}></input>
                                        <em id="phoneNumberError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>País de residencia</label>
                                        <select className="form-control" name="residenceCountry" id="residenceCountry" onChange={(e) => this.selectType(e.target, 'residenceCountry')} value={this.state.residenceCountry} >
                                            <option value=''>Seleccione</option>
                                            {this.state.countryList.map((type) => {
                                                return <option value={type.StringMapKey}>{type.StringMapName}</option>
                                            })}
                                        </select>
                                        <em id="residenceCountryError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="notes">
                            <div className="common-input">
                                <label>Notas</label>
                                <textarea className="form-control" name='notes' id='notes' value={this.state.notes} onChange={(e) => this.handleChange(e)}></textarea>
                            </div>
                        </div>
                        {/*   <div className="blue-bdr-box">
                        <div className="bb-inner">
                            <h5>GDPR confirmation</h5>
                            <p>lorem ispum doler sit amit</p>
                        </div>
                        <div className="bb-inner">
                            <h5>Signature</h5>
                            <p>lorem ispum doler sit amit</p>
                        </div>
                    </div>
                    <div className="agreement">
                        <label>
                            <input type="checkbox" name="iagree" id="iagree" value={this.state.iagreecheck} checked={this.state.iagreecheck ? true : false} onChange={()=>this.oniagreeChange(!this.state.iagreecheck)}></input>
                            I agree
                        </label>
                        <em id="iagreeError" className="error invalid-feedback"></em>
                                    </div>*/}
                        {(this.state.policyId != "" && this.state.policyId != undefined && this.state.policyId != null) ?
                            <div className="Success">
                                <label>

                                    <p >  Se ha creado la política n. ° {this.state.policyNumber} para este cliente potencial.<span style={{ cursor: 'pointer', color: '#008c9a' }} onClick={() => this.viewPolicy(this.state.policyId)}  >Haga clic aquí para ver los detalles</span></p>
                                </label>

                            </div> : ''}
                        {/* <Collapse isOpen={this.state.uploadCollapse} id="collapseOne"> */}
                        {this.state.uploadCollapse ?
                            <CardBody style={{ textAlign: "left" }}>
                                <h3 style={{ marginBottom: "10px" }}> Cargar un documento nuevo </h3>

                                <div className="file-field">
                                    <Row>
                                        <Col md="3" className="pull-right">
                                            <label for="">Seleccione Archivo*</label>
                                        </Col>
                                        <Col md="9">
                                            <div className="btn btn-primary " style={{ width: "100%" }}>
                                                <InputGroup>
                                                    <Input type="file" name="file" id="file" className="" onChange={this.selectFile} />
                                                    <em className="error invalid-feedback"> Por favor seleccione archivo </em>

                                                </InputGroup>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "10px" }}>
                                        <Col md="3" className="pull-right">
                                            <label for="">Nombre del archivo*</label>
                                        </Col>
                                        <Col md="9">
                                            <InputGroup>
                                                <Input type="text" name="FileName" id="FileName" onChange={e => this.uploadHandleChange(e)} placeholder="Nombre del archivo" value={this.state.FileName} />
                                                <em className="error invalid-feedback"> Por favor ingrese el nombre del archivo </em>
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="3" className="pull-left">
                                            <label for="">Descripción</label>
                                        </Col>
                                        <Col md="9">
                                            <div className="input-box">
                                                <Input name="Description" type="textarea" id="Description" className="" onChange={e => this.uploadHandleChange(e)} value={this.state.Description} placeholder="Descripción" />
                                                <em className="error invalid-feedback"> Por favor introduzca una descripción </em>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="pull-right" >
                                    <BTN color="success" onClick={() => this.upload()}><i class="fa fa-check"></i> Subir</BTN>{' '}
                                    <BTN color="primary" onClick={() => this.uploadReset()}><i class="fa fa-angle-left"></i> Cancelar</BTN>
                                </div>
                                <div className="table-custom col-lg-4">
                                    <DataTable style={{ background: "#FFFFFF" }} ref={(el) => this.dt = el} value={this.state.documentList}
                                        currentPageReportTemplate={this.state.str} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                                        paginator={true} rows={this.state.rowsPerPage} exportFilename="Documents"
                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
                                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No se encontraron registros"
                                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                                        scrollable={true} scrollHeight="265px"
                                        selection={this.state.selectedCars3}
                                        onSelectionChange={(e) => this.mulSelect(e)}
                                    >
                                        {columns}
                                    </DataTable>
                                    {/* <iframe id="ifmcontentstoprint" style={{height: "0px", width: "0px", position: "absolute"}}></iframe> */}
                                </div>
                            </CardBody>
                            : null}
                        {/* </Collapse> */}


                        <div className="sub-btn">

                            <button type="button" className="btn btn-primary" onClick={() => this.onSave()}>Salvar</button>
                            {(this.state.policyId != "" && this.state.policyId != undefined && this.state.policyId != null) ? <button type="button" className="btn btn-primary" onClick={() => this.uploadDocumenet()}>Subir documento</button>
                                : null}
                            {
                                //   <button type="button" className="btn btn-primary">See evolution</button>
                                //  <button type="button" className="btn btn-primary">Take a picture</button>

                                // <button type="button" className="btn btn-primary">Event code</button>
                            }
                        </div>
                    </form>
                    : <form>
                        <div className="language-btn">
                            <button type="button" className={(this.state.PreferLanguage == 'en-IE')?"btn active": "btn"} onClick={() => this.languageToggle("English")}>English</button>
                            <button type="button" className={(this.state.PreferLanguage == 'es-ES')?"btn active": "btn"}  onClick={() => this.languageToggle("Spanish")}>Spanish</button>
                        </div>
                        <div className="gt-radio">
                            <label className="blue-label">Source</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="department" id="department" value={this.state.department}
                                            checked={this.state.department === 'Central'} onChange={() => this.onDepartmentChange("Central")}></input>
                                        <div className="front-end box"><span>Central</span></div>
                                    </label>
                                    
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="department" id="department" value={this.state.department}
                                            checked={this.state.department === 'Branch' ? true : false} onChange={() => this.onDepartmentChange("Branch")}></input>
                                        <div className="front-end box"><span>Branch</span></div>
                                    </label>
                                </div>
                                {this.state.department === 'Branch' ?
                                    <div className="input-box inline s-select">
                                        <div className="row row align-items-center">
                                            <div className="col-lg-4 col-md-4 prn align-right">
                                                <label>Branch</label>
                                            </div>
                                            <div className="col-lg-8 col-md-8">
                                                <select className="form-control" id="branch" name="branch" value={this.state.branch} onChange={(e) => this.selectType(e.target.value, 'branch')}>
                                                    <option value=''>Select</option>
                                                    {this.state.branchList.map((type) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </select>
                                                <em id="branchError" className="error invalid-feedback"></em>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                                <div className="input-box inline s-select">
                                    <div className="row row align-items-center">
                                        <div className="col-lg-4 col-md-4 prn align-right">
                                            <label>Source</label>
                                        </div>
                                        <div className="col-lg-8 col-md-8">
                                            <select className="form-control" id="source" name="source" value={this.state.source} onChange={(e) => this.selectType(e.target.value, 'source')}>
                                                <option value=''>Select</option>
                                                {this.state.sourceList.map((type) => {
                                                    return (<option value={type.entityType}>{type.entityType}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="sourceError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-box inline s-select">
                                    <div className="row row align-items-center">
                                        <div className="col-lg-4 col-md-4 prn align-right">
                                            <label>Source Name</label>
                                        </div>
                                        <div className="col-lg-8 col-md-8">
                                            <select className="form-control" id="sourceName" name="sourceName" value={this.state.sourceName} onChange={(e) => this.selectType(e.target.value, 'sourceName')}>
                                                <option value=''>Select</option>
                                                {this.state.sourceNameList.map((type) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="sourceNameError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="gtradio-box">
            <label>
                <input type="radio" name="department" id="department" value={this.state.department} 
                checked={this.state.department ==='Sub agent' ? true : false}  onChange={() => this.onDepartmentChange("Sub agent")}></input>
                <div className="front-end box"><span>Sub agent</span></div>
            </label>
        </div>
        <div className="gtradio-box">
            <label>
                <input type="radio" name="department" id="department" value={this.state.department}
                 checked={this.state.department ==='Service center' ? true : false } onChange={() => this.onDepartmentChange("Service center")}></input>
                <div className="front-end box"><span>Service center</span></div>
            </label>
        </div> */}
                                {/* <div className="gtradio-box big">
            <label>
                <input type="radio" name="searchType" name="department" id="department" value={this.state.department}
                 checked={this.state.department === 'Other' ? true : false}  onChange={() => this.onDepartmentChange("Other")} ></input>
                <div className="front-end box"><span>Select from Evolution</span></div>
            </label>
        </div> */}
                            </div>
                        </div>
                        {/* {this.state.showDepartmentDD ? 
    <div className="row">
        <div className="col-lg-5 col-md-5">
            <div className="input-box">
                <label>Select Department</label>
                <select className="form-control"id="selectedDepartment" name="selectedDepartment" value={this.state.selectedDepartment} onChange={(e) => this.selectType(e.target.value, 'selectedDepartment')}>
                <option value=''>Select</option>
                {this.state.departmentList.map((type)=>{
                    return ( <option value={type.value}>{type.label}</option>)
                    })
                }
                </select>
                <em id="selectedDepartmentError" className="error invalid-feedback"></em>
            </div>
        </div>
    </div>
: null} */}
                        <div className="gt-radio">
                            <label className="blue-label">Select the Type of Coverage:</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "COMP" ? true : false} onChange={() => this.onCoverageTypeChange('COMP')} ></input>
                                        <div className="front-end box"><span>COMP</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "TPO" ? true : false} onChange={() => this.onCoverageTypeChange('TPO')}></input>
                                        <div className="front-end box"><span>TPO</span></div>
                                    </label>
                                </div>
                                <div className="input-box inline s-select">
                                    <div className="row align-items-center">
                                        <div className="col-lg-5 col-md-5 align-right prn">
                                            <label>Renewal Month</label>
                                        </div>
                                        <div className="col-lg-7 col-md-7">
                                            <select className="form-control" name="renewalMonth" id="renewalMonth" value={this.state.renewalMONTH} onChange={(e) => this.selectType(e.target.value, 'renewalMonth')} placeholder="Select">
                                                <option value=''>Select</option>
                                                {this.state.renewalMONTHList.map((type) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="renewalMONTHError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="gt-radio">
                            <label className="blue-label">Boat Flag: </label>
                            <div className="middle inline">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Ireland' ? true : false} onChange={() => this.onBoatFlagChange('Ireland')}></input>
                                        <div className="front-end box"><span>Ireland</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Spain' ? true : false} onChange={() => this.onBoatFlagChange('Spain')}></input>
                                        <div className="front-end box"><span>Spain</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Germany' ? true : false} onChange={() => this.onBoatFlagChange('Germany')}></input>
                                        <div className="front-end box"><span>Germany</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Belgium' ? true : false} onChange={() => this.onBoatFlagChange('Belgium')}></input>
                                        <div className="front-end box"><span>Belgium</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'France' ? true : false} onChange={() => this.onBoatFlagChange('France')}></input>
                                        <div className="front-end box"><span>France</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'UK' ? true : false} onChange={() => this.onBoatFlagChange('UK')}></input>
                                        <div className="front-end box"><span>UK</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box big">
                                    <label>
                                        <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag === 'Other' ? true : false} onChange={() => this.onBoatFlagChange('Other')}></input>
                                        <div className="front-end box"><span>Select from Evolution</span></div>
                                    </label>
                                </div>
                                {this.state.showBoatFlagDD ?

                                    <div className="gtradio-box big">
                                        <div className="input-box">
                                            <label>Where is Boat Boat Registered</label>
                                            <select className="form-control" name="whereReg" id="whereReg" value={this.state.whereReg} onChange={(e) => this.selectType(e.target.value, 'whereReg')} placeholder="Select">
                                                <option value=''>Select</option>
                                                {this.state.whereRegList.map((type) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </select>
                                            <em id="whereRegError" className="error invalid-feedback"></em>

                                        </div>
                                    </div>


                                    : null}
                            </div>
                        </div>

                        <div className="gt-radio">
                            <label className="blue-label">Select the type of boat:</label>
                            <div className="middle inline">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Motor Cruisers' ? true : false} onChange={() => this.onVesselTypeChange('Motor Cruisers')}></input>
                                        <div className="front-end box"><span>Motor Cruisers</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Cruising Yacht' ? true : false} onChange={() => this.onVesselTypeChange('Cruising Yacht')}></input>
                                        <div className="front-end box"><span>Cruising Yacht</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'RIB' ? true : false} onChange={() => this.onVesselTypeChange('RIB')}></input>
                                        <div className="front-end box"><span>RIB</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Sports Boat' ? true : false} onChange={() => this.onVesselTypeChange('Sports Boat')}></input>
                                        <div className="front-end box"><span>Sports Boat</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Fast Fisher' ? true : false} onChange={() => this.onVesselTypeChange('Fast Fisher')}></input>
                                        <div className="front-end box"><span>Fast Fisher</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Racing Yacht' ? true : false} onChange={() => this.onVesselTypeChange('Racing Yacht')}></input>
                                        <div className="front-end box"><span>Racing Yacht</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Dinghy' ? true : false} onChange={() => this.onVesselTypeChange('Dinghy')}></input>
                                        <div className="front-end box"><span>Dinghy</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box ">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Commercial Vessels' ? true : false} onChange={() => this.onVesselTypeChange('Commercial Vessels')}></input>
                                        <div className="front-end box"><span>Commercial boat</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="boat-type" id="boattype" value={this.state.vesselType} checked={this.state.vesselType === 'Other' ? true : false} onChange={() => this.onVesselTypeChange('Other')}></input>
                                        <div className="front-end box"><span>Other</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {this.state.showBoatClass ?
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Select Boat Class</label>
                                        <select className="form-control" id="BoatClass" value={this.state.boatClass} onChange={(e) => this.selectType(e.target.value, 'boatClass')}>
                                            <option value=''>Select</option>
                                            {this.state.vesselType == "Cruising Yacht" || this.state.vesselType == 'Racing Yacht' ? vesselClassListCopy : vesselClassList}
                                            {/* {this.state.boatClassList.map((type)=>{
                    return ( <option value={type.VesselClassId}>{type.VesselClassName}</option>)
                    })
                } */}

                                        </select>
                                        <em id="BoatClassError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                : null}
                            {this.state.showBoatType ?
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Select Boat Type</label>
                                        <select className="form-control" id="BoatType" value={this.state.boatType} onChange={(e) => this.selectType(e.target.value, 'boatType')}>
                                            <option value=''> Select</option>
                                            {this.state.boatTypeList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="BoatType" className="error invalid-feedback"></em>

                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className="row">
                            <div className="col-lg-8 col-md-8">
                                <label className="blue-label">Boat Features:</label>
                            </div>
                            <div className="col-lg-8 col-md-12">
                                <div className="row">
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Make and Model</label>
                                            <input type="text" className="form-control" id='makeAndModel' name='makeAndModel' onChange={(e) => this.handleChange(e)} value={this.state.makeAndModel} placeholder="Make And Model"></input>
                                            <em id="makeAndModalError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <div className="input-box">
                                            <label>Year built</label>
                                            <input type="text" className="form-control" id='yearBuilt' name='yearBuilt' onChange={(e) => this.handleChange(e)} value={this.state.yearBuilt} placeholder="Year Built"></input>
                                            <em id="yearBuiltError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <div className="input-box">
                                            <label>Length</label>
                                            <input type="text" className="form-control" id='length' name='length' onChange={(e) => this.handleChange(e)} value={this.state.length} placeholder="Length"></input>
                                            <em id="lengthError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Purchase price</label>
                                            <input type="text" className="form-control" id='purchasePrice' name='purchasePrice' onChange={(e) => this.handleChange(e)} value={this.state.purchasePrice} placeholder="Purchase Price"></input>
                                            <em id="purchasePriceError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-box">
                                            <label>Total Sum Insured</label>
                                            <input type="text" className="form-control" id='sumInsured' name='sumInsured' onChange={(e) => this.handleChange(e)} value={this.state.sumInsured} placeholder="Total Sum Insured"></input>
                                            <em id="sumInsuredError" className="error invalid-feedback"></em>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="gt-radio material-type">
                                    <label>Type of material </label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'GRP' ? true : false} onChange={() => this.onHullMaterailChange('GRP')} ></input>
                                                <div className="front-end box"><span>GRP</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'Wood' ? true : false} onChange={() => this.onHullMaterailChange('Wood')}></input>
                                                <div className="front-end box"><span>Wood</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="material-type" id="hullMaterial" value={this.state.hullMaterial} checked={this.state.hullMaterial === 'Steel' ? true : false} onChange={() => this.onHullMaterailChange('Steel')}></input>
                                                <div className="front-end box"><span>Steel</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="gt-radio">
    <label className="blue-label">Boat Flag: </label>
    <div className="middle">
        <div className="gtradio-box">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Ireland' ? true : false} onChange={()=> this.onBoatFlagChange('Ireland')}></input>
                <div className="front-end box"><span>Ireland</span></div>
            </label>
        </div>
        <div className="gtradio-box">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Spain' ? true : false} onChange={()=> this.onBoatFlagChange('Spain')}></input>
                <div className="front-end box"><span>Spain</span></div>
            </label>
        </div>
        <div className="gtradio-box">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Germany' ? true : false} onChange={()=> this.onBoatFlagChange('Germany')}></input>
                <div className="front-end box"><span>Germany</span></div>
            </label>
        </div>
        <div className="gtradio-box">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Belgium' ? true : false} onChange={()=> this.onBoatFlagChange('Belgium')}></input>
                <div className="front-end box"><span>Belgium</span></div>
            </label>
        </div>
        <div className="gtradio-box ">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='France' ? true : false} onChange={()=> this.onBoatFlagChange('France')}></input>
                <div className="front-end box"><span>France</span></div>
            </label>
        </div>
        <div className="gtradio-box ">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='UK' ? true : false} onChange={()=> this.onBoatFlagChange('UK')}></input>
                <div className="front-end box"><span>UK</span></div>
            </label>
        </div>
        <div className="gtradio-box big">
            <label>
                <input type="radio" name="boat-flag" id="boatFlag" value={this.state.boatFlag} checked={this.state.boatFlag ==='Other' ? true : false} onChange={()=> this.onBoatFlagChange('Other')}></input>
                <div className="front-end box"><span>Select from Evolution</span></div>
            </label>
        </div>
    </div>
</div>
{this.state.showBoatFlagDD ?
    <div className="row">
        <div className="col-lg-5 col-md-5">
            <div className="input-box">
                <label>Where is Boat Boat Registered</label>
                <select className="form-control" name="whereReg" id="whereReg"  value={this.state.whereReg} onChange={(e) => this.selectType(e.target.value, 'whereReg')} placeholder="Select">
                <option value=''>Select</option>
                {this.state.whereRegList.map((type)=>{
                    return ( <option value={type.value}>{type.label}</option>)
                    })
                }
                </select>
                <em id="whereRegError" className="error invalid-feedback"></em>

            </div>
        </div>
    </div>

: null} */}
                        <div className="lead-box">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <label className="blue-label">Boat Mooring:</label>
                                </div>
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Where is the boat moored?</label>
                                        <select className="form-control" id="boatMoored" name='boatMoored' value={this.state.boatMoored} onChange={(e) => this.selectType(e.target.value, 'boatMoored')}>
                                            <option value=''>Select</option>
                                            {this.state.boatMooredList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="boatMooredError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label >Mooring Type:</label>
                                        <Input type="select" name="mooringType" id="mooringType" onChange={(e) => this.selectType(e.target.value, 'mooredType')} value={this.state.mooringType}>
                                            <option value=''>Select</option>
                                            {this.state.mooringTypeList.map((type, i) => {
                                                return (<option value={type.value} key={i}>{type.label}</option>)
                                            })
                                            }
                                        </Input>
                                        {/* <select className="form-control" id="mooringType" name='mooringType' value={this.state.mooringType} onChange={(e) => this.selectType(e.target.value, 'mooredType')} >
                {this.state.mooringTypeList.length == 1 ? null :
                    <option value=''>Select</option>
                }
                {this.state.mooringTypeList.map((type, i) => {
                    return (<option value={type.value}>{type.label}</option>)
                    })
                }
                </select> */}
                                        <em id="mooringTypeError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lead-box">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <label className="blue-label">Engine:</label>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Engine Make and Model</label>
                                        <input type="text" className="form-control" id='engineMakeAndModel' name='engineMakeAndModel' onChange={(e) => this.handleChange(e)} value={this.state.engineMakeAndModel} placeholder="Make And Model"></input>
                                        <em id="engineMakeAndModelError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>Year</label>
                                        <input type="text" className="form-control" id='engineYear' name='engineYear' onChange={(e) => this.handleChange(e)} value={this.state.engineYear} placeholder="Year"></input>
                                        <em id="engineYearError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>CV power</label>
                                        <input type="text" className="form-control" id='cvPower' name='cvPower' onChange={(e) => this.handleChange(e)} value={this.state.cvPower} placeholder="CV Power"></input>
                                        <em id="cvPowerError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2">
                                    <div className="input-box">
                                        <label>No Engines</label>
                                        <select className="form-control" name="noOfEngine" id="noOfEngine" onChange={(e) => this.selectType(e.target.value, 'noOfEngine')} value={this.state.noOfEngine}>
                                            <option value=''>Select</option>
                                            {this.state.noOfEngineList.map((type, i) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="noOfEngineError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Transmission</label>
                                        <select className="form-control" id='transmission-engine' value={this.state.transmissionMainEngine} onChange={(e) => this.selectType(e.target.value, 'transmissionEngine')}>
                                            <option value=''>Select </option>
                                            {this.state.transmissionMainEngineList.map((type, i) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="transmissionMainEngineError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="gt-radio">
                            <label className="blue-label">Select the Cruising Range required:</label>
                            <div className="middle">
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Inland Non Tidal' ? true : false} onChange={() => this.onCruisingRangeChange('Inland Non Tidal')}></input>
                                        <div className="front-end box"><span>Inland Non Tidal</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Coastal' ? true : false} onChange={() => this.onCruisingRangeChange('Coastal')}></input>
                                        <div className="front-end box"><span>Coastal</span></div>
                                    </label>
                                </div>
                                <div className="gtradio-box big">
                                    <label>
                                        <input type="radio" name="cruising-range" id="cruisingRange" value={this.state.cruisingRange} checked={this.state.cruisingRange === 'Other' ? true : false} onChange={() => this.onCruisingRangeChange('Other')}></input>
                                        <div className="front-end box"><span>Select from Evolution</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {this.state.showCruisingRangeDD ?
                            <div className="row">
                                <div className="col-lg-5 col-md-5">
                                    <div className="input-box">
                                        <label>Select Cruising Range</label>
                                        <select className="form-control" id="cruisingRangeFromList" value={this.state.cruisingRangeFromList} onChange={(data) => this.selectType(data, 'cruisingRange')} placeholder="Select">
                                            <option value=''>Select</option>
                                            {this.state.cruisingRangeList.map((type) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="cruisingRangeFromListError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                            : null}
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <label className="blue-label">Previous Insurer:</label>
                            </div>
                            <div className="col-lg-2 col-md-2">
                                <div className="input-box">
                                    <label>Prev Insurer Name</label>
                                    <input type="text" className="form-control" name="previousInsurer" id="previousInsurer" value={this.state.previousInsurer} onChange={(e) => this.handleChange(e)} placeholder="Previous Insurer" ></input>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className="gt-radio number-radio">
                                    <label className="gray-label">No. of years NCB</label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 1 ? true : false} onChange={() => this.onYearInsuredChange(1)}></input>
                                                <div className="front-end box"><span>1</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 2 ? true : false} onChange={() => this.onYearInsuredChange(2)}></input>
                                                <div className="front-end box"><span>2</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 3 ? true : false} onChange={() => this.onYearInsuredChange(3)}></input>
                                                <div className="front-end box"><span>3</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 4 ? true : false} onChange={() => this.onYearInsuredChange(4)}></input>
                                                <div className="front-end box"><span>4</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box big">
                                            <label>
                                                <input type="radio" name="year-insured" id="noOfYear-Insured" value={this.state.noOfYearInsured} checked={this.state.noOfYearInsured === 5 ? true : false} onChange={() => this.onYearInsuredChange(5)}></input>
                                                <div className="front-end box"><span>5</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2">
                                <div className="gt-radio number-radio">
                                    <label className="gray-label">Previous Claims</label>
                                    <div className="middle">
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="previous-claim" id="previous-claim" value={this.state.isPreviousClaim} checked={this.state.isPreviousClaim} onChange={() => this.onPreviousClaimChange(true)} ></input>
                                                <div className="front-end box"><span>Yes</span></div>
                                            </label>
                                        </div>
                                        <div className="gtradio-box">
                                            <label>
                                                <input type="radio" name="previous-claim" id="previous-claim" value={this.state.isPreviousClaim} checked={!this.state.isPreviousClaim} onChange={() => this.onPreviousClaimChange(false)}></input>
                                                <div className="front-end box"><span>No</span></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.showClaimDetail ?
                                <div className="col-lg-4 col-md-4">
                                    <div className="input-box">
                                        <label>Claim Details</label>
                                        <input type="text" className="form-control" name='claimNotes' id='claimNotes' value={this.state.claimNotes} onChange={(e) => this.handleChange(e)}></input>
                                    </div>
                                </div>
                                : null}

                        </div>
                        {/* <div className="gt-radio">
    <label className="blue-label">Select the Type of Coverage:</label>
    <div className="middle">
        <div className="gtradio-box">
            <label>
                <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "COMP" ? true : false} onChange={()=> this.onCoverageTypeChange('COMP')} ></input>
                <div className="front-end box"><span>COMP</span></div>
            </label>
        </div>
        <div className="gtradio-box">
            <label>
                <input type="radio" name="coverage-type" id="coverage-type" value={this.state.liabilityType} checked={this.state.liabilityType === "TPO" ? true : false} onChange={()=> this.onCoverageTypeChange('TPO')}></input>
                <div className="front-end box"><span>TPO</span></div>
            </label>
        </div>
    </div>
</div> */}
                        <div className="gt-radio">
                            <label className="blue-label">Coverage Limits</label>
                            {/* <div className="middle">
        <div className="gtradio-box big">
            <label>
                <input type="checkbox" name='indemnityRequired' id='indemnityRequired' value={this.state.indemnityRequired} checked={this.state.indemnityRequired} onChange={()=> this.onindemnityChange(!this.state.indemnityRequired)}></input>
                <div className="front-end box"><span>Limit of indemnity Required</span></div>
            </label>
        </div>
        <div className="gtradio-box big">
            <label>
                <input type="checkbox" name="waterToyLiability" id='waterToyLiability' value={this.state.waterToyLiability} checked={this.state.waterToyLiability} onChange={()=> this.onWaterToyLiabilityChange(!this.state.waterToyLiability)} ></input>
                <div className="front-end box"><span>Water skiing  & Toys Liability</span></div>
            </label>
        </div>
        <div className="gtradio-box big">
            <label>
                <input type="checkbox" name="RRE" id='RRE' value={this.state.isRRE} checked={this.state.isRRE} onChange={()=> this.onRREChange(!this.state.isRRE)}></input>
                <div className="front-end box"><span>RRE</span></div>
            </label>
        </div> 
     </div> */}
                            <Row>
                                <Col md="3">
                                    <label>Third Party Liability</label>
                                    <select className="form-control" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                                        <option value=''>Select</option>
                                        {this.state.ThirdPartyLiabilityList.map((type, i) => {
                                            return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                        })
                                        }
                                    </select>
                                    <em id="thirdPartyLiabilityError" className="error invalid-feedback"></em>
                                </Col>
                            </Row>

                            {(this.state.DisplayWater == 1) ?

                                <div>
                                    <div className="input-box">
                                        <Row>
                                            <Col md="2">
                                                <label>Water Skiing Liability</label>
                                            </Col>
                                            <Col md="2">

                                                <div>
                                                    <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} />
                                                    {this.state.isWaterSkiing ? (
                                                        <input type="text" name="waterSkiingLiability" id="waterSkiingLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterSkiingLiability} readOnly />
                                                    ) : (null)}
                                                    <em id="waterSkiingLiabilityError" className="error invalid-feedback"></em>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="input-box">
                                        <Row>
                                            <Col md="2">
                                                <label>Water Toys Liabiility</label>
                                            </Col>
                                            <Col md="2">

                                                <div>
                                                    <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} />
                                                    {this.state.isWaterToys ? (
                                                        <input type="text" name="waterToysLiability" id="waterToysLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterToysLiability} readOnly />
                                                    ) : (null)}
                                                    <em id="waterToysLiabilityError" className="error invalid-feedback"></em>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                : null}

                            <Row>
                                {(this.state.DisplayRacing == 1) ?
                                    <Col md="4">
                                        <label>Racing Event Type</label>
                                        <div>
                                            <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                                                <option value=''>Select</option>
                                                {this.state.RacingEventTypeList.map((type, i) => {
                                                    return (<option value={type.value}>{type.label}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="racingEventTypeError" className="error invalid-feedback"></em>
                                        </div>
                                    </Col>
                                    : (null)}

                                {(this.state.DisplayCrew == 1) ?
                                    (
                                        <Col md="2">
                                            <label>Crew Liability? *</label>
                                            <div>
                                                <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                                                    <option value=''>Select</option>
                                                    {this.state.CrewLiabilityList.map((type, i) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="crewLiabilityError" className="error invalid-feedback"></em>
                                            </div>
                                        </Col>
                                    ) : (null)}

                            </Row>

                            {(this.state.DisplayRacing == 1) ?

                                <Row>
                                    <Col md="3">
                                        <label>Sail Racing Coverage Required?</label>
                                    </Col>
                                    <Col md="2">

                                        <div>
                                            <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} />
                                            {this.state.isSailRacing ? (
                                                <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage} />
                                            ) : (null)}
                                            <em id="sailRacingCoverageError" className="error invalid-feedback"></em>
                                        </div>

                                    </Col>
                                </Row>
                                : null}
                        </div>
                        {/* {this.state.indemnityRequired ?  */}
                        {/* <div className="input-box">
        <Row>
            <Col md="3">
                <label>Third Party Liability</label>
                    <select className="form-control" name="thirdPartyLiability" id="thirdPartyLiability" onChange={(e) => this.selectType(e.target.value, 'thirdPartyLiability')} value={this.state.thirdPartyLiability}>
                        <option value=''>Select</option>
                        {this.state.ThirdPartyLiabilityList.map((type, i) => {
                            return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                        })
                        }
                    </select>
                    <em id="thirdPartyLiabilityError" className="error invalid-feedback"></em>
            </Col>
        </Row>
    </div> */}
                        {/* : null } */}

                        {/* {this.state.waterToyLiability ?  */}
                        {/* {(this.state.DisplayWater == 1) ?
                            
    <div>
        <div className="input-box">
            <Row>
                <Col md="2">
                    <label>Water Skiing Liability</label>
                </Col>
                <Col md="2">

                    <div>
                        <Input type="checkbox" name="isWaterSkiing" id="isWaterSkiing" onChange={(e) => this.handleChange(e)} value={this.state.isWaterSkiing} />
                        {this.state.isWaterSkiing ? (
                            <input type="text" name="waterSkiingLiability" id="waterSkiingLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterSkiingLiability} readOnly />
                        ) : (null)}
                        <em id="waterSkiingLiabilityError" className="error invalid-feedback"></em>
                    </div>

                </Col>
            </Row>
        </div>
        <div className="input-box">
            <Row>
                <Col md="2">
                    <label>Water Toys Liabiility</label>
                </Col>
                <Col md="2">

                    <div>
                        <Input type="checkbox" name="isWaterToys" id="isWaterToys" onChange={(e) => this.handleChange(e)} value={this.state.isWaterToys} />
                        {this.state.isWaterToys ? (
                            <input type="text" name="waterToysLiability" id="waterToysLiability" onChange={(e) => this.handleChange(e)} value={this.state.waterToysLiability} readOnly />
                        ) : (null)}
                        <em id="waterToysLiabilityError" className="error invalid-feedback"></em>
                    </div>

                </Col>
            </Row>
        </div>
    </div>

: null } */}

                        {/* {this.state.isRRE ?  */}
                        {/* <div className="input-box">
        <Row>
            {(this.state.DisplayRacing == 1) ?
                <Col md="4">
                    <label>Racing Event Type</label>
                    <div>
                        <Input type="select" name="racingEventType" id="racingEventType" onChange={(e) => this.selectType(e.target.value, 'racingEventType')} value={this.state.racingEventType}>
                            <option value=''>Select</option>
                            {this.state.RacingEventTypeList.map((type, i) => {
                                return (<option value={type.value}>{type.label}</option>)
                            })
                            }
                        </Input>
                        <em id="racingEventTypeError" className="error invalid-feedback"></em>
                    </div>
                </Col>
            : (null)}

            {(this.state.DisplayCrew == 1) ?
            (
                <Col md="2">
                    <label>Crew Liability? *</label>
                    <div>
                        <Input type="select" name="crewLiability" id="crewLiability" onChange={(e) => this.selectType(e.target.value, 'crewLiability')} value={this.state.crewLiability}>
                            <option value=''>Select</option>
                            {this.state.CrewLiabilityList.map((type, i) => {
                                return (<option value={type.value}>{type.label}</option>)
                            })
                            }
                        </Input>
                        <em id="crewLiabilityError" className="error invalid-feedback"></em>
                    </div>
                </Col>
            ) : (null)}

        </Row>
        
        {(this.state.DisplayRacing == 1) ?

            <Row>
                <Col md="3">
                    <label>Sail Racing Coverage Required?</label>
                </Col>
                <Col md="2">

                    <div>
                        <Input type="checkbox" name="isSailRacing" id="isSailRacing" onChange={(e) => this.handleChange(e)} value={this.state.isSailRacing} />
                        {this.state.isSailRacing ? (
                            <Input type="text" name="sailRacingCoverage" id="sailRacingCoverage" onChange={(e) => this.handleChange(e)} value={this.state.sailRacingCoverage} />
                        ) : (null)}
                        <em id="sailRacingCoverageError" className="error invalid-feedback"></em>
                    </div>

                </Col>
            </Row> 
        : null }                           
    </div> */}
                        {/* : null } */}


                        <div className="lead-box">
                            <h3 className="heading-md">Customer Details</h3>
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" name='forename' id='forename' value={this.state.forename} onChange={(e) => this.handleChange(e)} ></input>
                                        <em id="forenameError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" name='surname' id='surname' value={this.state.surname} onChange={(e) => this.handleChange(e)} ></input>
                                        <em id="surnameError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Language</label>
                                        <select className="form-control" name="language" id="language" onChange={(e) => this.selectType(e.target, 'language')} value={this.state.language} >
                                            <option value=''>Select</option>
                                            {this.state.languageList.map((type, i) => {
                                                return (<option value={type.value}>{type.label}</option>)
                                            })
                                            }
                                        </select>
                                        <em id="languageError" className="error invalid-feedback"></em>
                                    </div>

                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <div className="gt-radio medium-box">
                                        <label>Currency</label>
                                        <div className="middle">
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="currency" id="currency" value={this.state.currencyType} checked={this.state.currencyType === 'Euro' ? true : false} onChange={() => this.onCurrencyChange('Euro')}></input>
                                                    <div className="front-end box"><span>Euro</span></div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="currency" id="currency" value={this.state.currencyType} checked={this.state.currencyType === 'Pounds' ? true : false} onChange={() => this.onCurrencyChange('Pounds')}></input>
                                                    <div className="front-end box"><span>Pounds</span></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Email</label>
                                        <input type="text" className="form-control" name='email' id='email' value={this.state.email} onChange={(e) => this.handleChange(e)}></input>
                                        <em id="emailError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Mobile phone</label>
                                        <input type="text" className="form-control" name='phoneNumber' id='phoneNumber' value={this.state.phoneNumber} onChange={(e) => this.handleChange(e, 'phoneNumber')}></input>
                                        <em id="phoneNumberError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <div className="input-box">
                                        <label>Country of residence</label>
                                        <select className="form-control" name="residenceCountry" id="residenceCountry" onChange={(e) => this.selectType(e.target, 'residenceCountry')} value={this.state.residenceCountry} >
                                            <option value=''>Select</option>
                                            {this.state.countryList.map((type) => {
                                                return <option value={type.value}>{type.label}</option>
                                            })}
                                        </select>
                                        <em id="residenceCountryError" className="error invalid-feedback"></em>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="notes">
                            <div className="common-input">
                                <label>Notes</label>
                                <textarea className="form-control" name='notes' id='notes' value={this.state.notes} onChange={(e) => this.handleChange(e)}></textarea>
                            </div>
                        </div>
                        {/*   <div className="blue-bdr-box">
    <div className="bb-inner">
        <h5>GDPR confirmation</h5>
        <p>lorem ispum doler sit amit</p>
    </div>
    <div className="bb-inner">
        <h5>Signature</h5>
        <p>lorem ispum doler sit amit</p>
    </div>
</div>
<div className="agreement">
    <label>
        <input type="checkbox" name="iagree" id="iagree" value={this.state.iagreecheck} checked={this.state.iagreecheck ? true : false} onChange={()=>this.oniagreeChange(!this.state.iagreecheck)}></input>
        I agree
    </label>
    <em id="iagreeError" className="error invalid-feedback"></em>
                </div>*/}
                        {(this.state.policyId != "" && this.state.policyId != undefined && this.state.policyId != null) ?
                            <div className="Success">
                                <label>

                                    <p >   Policy# {this.state.policyNumber} has been created for this Lead.<span style={{ cursor: 'pointer', color: '#008c9a' }} onClick={() => this.viewPolicy(this.state.policyId)}  >Click here to View the details</span></p>
                                </label>

                            </div> : ''}
                        {/* <Collapse isOpen={this.state.uploadCollapse} id="collapseOne"> */}
                        {this.state.uploadCollapse ?
                            <CardBody style={{ textAlign: "left" }}>
                                <h3 style={{ marginBottom: "10px" }}> Upload a New Document </h3>

                                <div className="file-field">
                                    <Row>
                                        <Col md="3" className="pull-right">
                                            <label for="">Select File*</label>
                                        </Col>
                                        <Col md="9">
                                            <div className="btn btn-primary " style={{ width: "100%" }}>
                                                <InputGroup>
                                                    <Input type="file" name="file" id="file" className="" onChange={this.selectFile} />
                                                    <em className="error invalid-feedback"> Please select file </em>

                                                </InputGroup>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "10px" }}>
                                        <Col md="3" className="pull-right">
                                            <label for="">File Name*</label>
                                        </Col>
                                        <Col md="9">
                                            <InputGroup>
                                                <Input type="text" name="FileName" id="FileName" onChange={e => this.uploadHandleChange(e)} placeholder="File Name" value={this.state.FileName} />
                                                <em className="error invalid-feedback"> Please enter file name </em>
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="3" className="pull-left">
                                            <label for="">Description</label>
                                        </Col>
                                        <Col md="9">
                                            <div className="input-box">
                                                <Input name="Description" type="textarea" id="Description" className="" onChange={e => this.uploadHandleChange(e)} value={this.state.Description} placeholder="Description" />
                                                <em className="error invalid-feedback"> Please enter description </em>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="pull-right" >
                                    <BTN color="success" onClick={() => this.upload()}><i class="fa fa-check"></i> Upload</BTN>{' '}
                                    <BTN color="primary" onClick={() => this.uploadReset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                </div>
                                <div className="table-custom col-lg-4">
                                    <DataTable style={{ background: "#FFFFFF" }} ref={(el) => this.dt = el} value={this.state.documentList}
                                        currentPageReportTemplate={this.state.str} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                                        paginator={true} rows={this.state.rowsPerPage} exportFilename="Documents"
                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
                                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                                        scrollable={true} scrollHeight="265px"
                                        selection={this.state.selectedCars3}
                                        onSelectionChange={(e) => this.mulSelect(e)}
                                    >
                                        {columns}
                                    </DataTable>
                                    {/* <iframe id="ifmcontentstoprint" style={{height: "0px", width: "0px", position: "absolute"}}></iframe> */}
                                </div>
                            </CardBody>
                            : null}
                        {/* </Collapse> */}


                        <div className="sub-btn">

                            <button type="button" className="btn btn-primary" onClick={() => this.onSave()}>Save</button>
                            {(this.state.policyId != "" && this.state.policyId != undefined && this.state.policyId != null) ? <button type="button" className="btn btn-primary" onClick={() => this.uploadDocumenet()}>Upload document</button>
                                : null}
                            {
                                //   <button type="button" className="btn btn-primary">See evolution</button>
                                //  <button type="button" className="btn btn-primary">Take a picture</button>

                                // <button type="button" className="btn btn-primary">Event code</button>
                            }
                        </div>
                    </form>
                }
            </div>
        )
    }
}



export default withTranslation()(LeadManagement);
