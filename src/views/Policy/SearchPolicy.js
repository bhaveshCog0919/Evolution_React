import React, { Component } from 'react';
import { Collapse, Button as BTN, Card, CardHeader, CardBody, Col, Row, Input, Form, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip } from 'reactstrap';
import { Button } from 'primereact/button';
import api from '../../utils/apiClient';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig } from '../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import APIConstant from '../../utils/constants';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import { toast } from 'react-toastify';
import ShowMoreText from 'react-show-more-text';

import Vessel from '../../assets/Vessel.png';
import MultiVessel from '../../assets/MultiVessel.png';
import NewBusiness from '../../assets/NewBusiness.png';
import Renewal from '../../assets/Renewal.png';
import SubAgent from '../../assets/SubAgent.png';
import Organization from '../../assets/Organization.png';
import Direct from '../../assets/Direct.png';
import MarineTrade from '../../assets/MarineTrade.png';
import VesselNonrated from '../../assets/VesselNonrated.png';
import Miscellaneous from '../../assets/Miscellaneous.png';
import Online from '../../assets/Online.png';
import ServiceCenter from '../../assets/ServiceCenter.png';

class SearchPolicy extends Component {

    constructor(props) {
        super(props);

        let columns = [
            // { field: "SrNo", header: "Sr No.", sortable: true, filter: true, id: 0 },
            // { field: "Type", header: "Type.", sortable: true, filter: true, id: 1 },
            // { field: "PolicyNo", header: "Policy No.", sortable: true, filter: true, id: 2 },
            // { field: "BoatType", header: "Outstanding Amount", sortable: true, filter: true, id: 3 },
            // { field: "Status", header: "Status", sortable: true, filter: true, id: 4 },
            // { field: "Department", header: "Department", sortable: true, filter: true, id: 4 },
            // { field: "Vessel", header: "Vessel", sortable: true, filter: true, id: 5 },
            // { field: "Value", header: "Value.", sortable: true, filter: true, id: 6 },
            // { field: "Premiun", header: "Premiun", sortable: true, filter: true, id: 7 },
            // { field: "Created", header: "Created", sortable: true, filter: true, id: 8 },
            // { field: "Renewal", header: "Renewal", sortable: true, filter: true, id: 9 },
            // { field: "Updated", header: "Updated", sortable: true, filter: true, id: 10 },
            // { field: "LastUpdatedBy", header: "Last Updated By", sortable: true, filter: true, id: 11 },
            // { field: "CreatedBy", header: "Created by", sortable: true, filter: true, id: 12 },
            // { field: "Currency", header: "Currency", sortable: true, filter: true, id: 13 },
            // { field: "Client", header: "Client", sortable: true, filter: true, id: 14 },
            // { field: "Country", header: "Country", sortable: true, filter: true, id: 15 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 0 },
            { body: this.formatPolicyDetail.bind(this), field: "PolicyData", header: "Policy No/Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { body: this.formatContactDetail.bind(this), field: "ClientDetails", header: "Client/Contacts", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.formatVesselData.bind(this), field: "VesselDetails", header: "Vessel", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "InsuranceCompanyName", header: "Insurer", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { body: this.formatPremiun.bind(this),field: "PremiumDetails", header: "SI/Premium", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.formatDate.bind(this), field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { body: this.formatDepartment.bind(this) ,field: "DepartmentDetails", header: "Department", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { body: this.formatStage.bind(this), field: "Stage", header: "Stage", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "HandlerPerson", header: "Handler", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
            { field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 10 },
        ];

        this.state = {
            toggleModalAdd: false,
            contactShown: '',
            cols: columns,
            clientArray: [],
            client: '',
            phoneArray: [],
            phone: '',
            str: '',
            emailArray: [],
            email: '',
            policyNumberArray: [],
            policyNumber: '',
            binderArray: [],
            binder: '',
            subBinderArray: [],
            subBinder: '',
            policyStartFromDate: '',
            policyStartToDate: '',
            policyRenewalFromDate: '',
            policyRenewalToDate: '',
            agentserviceCenter: '',
            sumInsuredfrom: '',
            sumInsuredTo: '',
            arr: [],
            selectedPage: 0,
            filteredcontactsSingle: null,
            contactArray: [],
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            custom: true,
            isExpand: false,
            countryList: [],
            country: '',
            languageArray: [],
            currencyArray: [],
            policyStatusList: [],
            policyStatus: '',
            policyTypeArray: [],
            policyType: '',
            vesselClassArray: [],
            vesselClassCopy: [],
            vesselClass: '',
            vesselType: '',
            vesselTypeArray: [],

            isMonthYear: true,
            searchType: 'QUICK',
            clientNamePhoneEmail: '',
            clientNamePhoneEmailError: false,
            monthArray: [],
            policyMonth: moment().format('M'),
            policyMonthError: false,
            yearArray: [],
            policyYear: moment().format('YYYY'),
            policyYearError: false,
            policyPhoneEmail: '',
            policyPhoneEmailError: false,
            documentLanguageList: [],
            policyLanguage: '',
            policyLanguageError: false,
            currencyList: [],
            policyCurrency: '',
            policyCurrencyError: false,
            policyFrom: '',
            policyFromError: false,
            policyTo: '',
            policyToError: false,

            offset: 0,
            recordStr: '',
            isPreviousVisible: false,
            isNextVisible: false,
            toggleStageChangeModal: false,
            changeNote: '',
            referredTo: '',
            changeNoteError: '',
            changeStage: false,
            stage: '',
            stageList: [],
            stageFilterList: [],
            stageFilter: '',
            referrList: [],
            selectedPolicy: [],

            openNotePopup: false,
            addNoteCollapse: false,
            policyNoteList: [],
            noteType: [],
            NavID: null,
            isImportant: 0,
            notesType: '',
            notesdescription: '',
            NotesTypeError: true,
            notesdescriptionError: true,
            addNoteCollapse: false,
            SavedData:{},
            loggedInUserData: CommonConfig.loggedInUserData(),

        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    toggleStageChange = () => {
        if (this.state.toggleStageChangeModal == true) {
            this.setState({ stage: '', referredTo: '', changeNote: '', selectedPolicy: [] });
        }
        this.setState({ toggleStageChangeModal: !this.state.toggleStageChangeModal });
    }

    setSelectedPolicy = (e) => {
        this.setState({ selectedPolicy: e })
    }

    getAllStageList() {
        const data = {};
        api.post('api/getAllStageList', data).then(res => {
            console.log('getAllStageList', res);
            if (res.success) {
                this.setState({ stageList: res.data, stageFilterList: res.data });
                this.onRadioBtnClick(this.state.searchType)
            }
        });
    }

    getPolicyStage() {
        const data = {
            PolicyId: "",
            Stage: this.state.stageFilter,
            loggedInUserId: CommonConfig.loggedInUserId()
        };
        api.post('api/getPolicyStage', data).then(res => {
            console.log('getPolicyStage', res);
            if (res.success) {
                this.setState({ stageList: res.data });
            }
        });
    }

    handleChangePolicyDetail = (e) => {

        this.setState({ [e.target.name]: e.target.value });

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
        if (stage) {
            this.setState({ stage: stage });
            this.toggleStageChange()
        } else {
            if (this.state.stage == 'Referred') {
                if (this.state.referredTo == "") {
                    toast.error('Please Select Referred To');
                    return
                }

                if (this.state.changeNote == "") {
                    toast.error('Please Enter Note');
                    return
                }
            }
            var SendString = '';
            this.state.selectedPolicy.forEach(data => {
                if (data) {
                    SendString += data.PolicyId + '#^#' + data.PolicyNumber + ',';
                }
            });
            console.log(SendString);
            const data = {
                PolicyId: '',
                Stage: this.state.stage,
                CurrentUser: CommonConfig.loggedInUserId(),
                ChangeNote: this.state.changeNote,
                ReferredTo: this.state.referredTo,
                PolicyData: SendString
            };
            api.post('api/savePolicyStage', data).then(res => {
                console.log('savePolicyStage', res.data);
                if (res.success) {
                    console.log('savePolicyStage', res.data[0].returnValue);

                    if (CommonConfig.isEmpty(res.data[0].returnValue)) {
                        toast.success('Policy Stage Changed Successfully to ' + this.state.stage);
                        this.toggleStageChange()
                        this.setState({ stage: this.state.stage, changeNote: '', referredTo: '', selectedPolicy: [], changeStage: false });
                        this.getSearchPolicy()
                    } else {
                        toast.success(res.data[0].returnValue);
                    }
                }
            });
        }
    }

    componentDidMount() {
        this.getDropDownValues('POLICYCOUNTRY', 'countryList');
        this.getDropDownValues('POLICYSTATUS', 'policyStatusList');
        this.getDropDownValues('POLICYTYPE', 'policyTypeArray');
        this.getLanguage();
        this.getCurrency();
        this.getVesselClass();
        // this.getPolicyList(0);
        this.getPolicyClientName();
        this.getAllEmailList();
        this.getAllcontactList();
        this.getAllpolicyNumber();
        this.getAllBinder();
        this.getDropdown();
        this.getAgentServiceCenterList();
        this.getAllStageList();
        this.getSpGetUsersByTeam();
        this.getNotesType();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.match.isExact !== this.props.match.isExact) {
            setTimeout(() => {
                this.getPolicyList(0);
            }, 100);
        }
    }

    getDropdown() {

        // Get Month
        let monthArray = [
            { label: 'January', value: 1 },
            { label: 'February', value: 2 },
            { label: 'March', value: 3 },
            { label: 'April', value: 4 },
            { label: 'May', value: 5 },
            { label: 'June', value: 6 },
            { label: 'July', value: 7 },
            { label: 'August', value: 8 },
            { label: 'September', value: 9 },
            { label: 'October', value: 10 },
            { label: 'November', value: 11 },
            { label: 'December', value: 12 },
        ];
        this.setState({ monthArray: monthArray });

        // Get Year - Get last 10 year from current year
        let startYear = moment().format('YYYY');
        let yearArray = [];
        for (let index = startYear; index >= (parseInt(startYear) - 10); index--) {
            yearArray.push({ label: index, value: index });
        }
        this.setState({ yearArray: yearArray });

        // Get Language
        var formattedLanguage = [];
        try {
            api.get(APIConstant.path.getLanguage).then(res => {

                if (res.success) {

                    for (var i = 0; i < res.data.length; i++) {
                        formattedLanguage.push({
                            label: res.data[i].Language,
                            value: res.data[i].Language,
                        });
                    }
                    this.setState({ documentLanguageList: formattedLanguage });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {

        }

        // Get Currency
        var formattedCurrency = [];
        try {
            api.get(APIConstant.path.getCurrency).then(res => {

                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        formattedCurrency.push({
                            label: res.data[i].CurrncyCode,
                            value: res.data[i].CurrncyCode,
                        });
                    }
                    this.setState({ currencyList: formattedCurrency });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {
        }

    }

    getAgentServiceCenterList() {
        try {
            let data = { ContactType: 'Both' };
            api.post('api/getAgentServiceCenterList', data).then(res => {
                console.log("getAgentServiceCenterList---", res);
                if (res.success) {
                    var formattedData = [];
                    for (let i = 0; i < res.data[0].length; i++) {
                        formattedData.push({
                            label: res.data[0][i].OrganizationName,
                            value: res.data[0][i].OrganizationId,
                        })
                    }
                    this.setState({ policyAgentServiceCenterList: formattedData });
                } else {
                    console.log('getAgentServiceCenterList');
                }
            }).catch(err => {
                console.log('getAgentServiceCenterList', err);
            });
        } catch (error) {
            console.log('getAgentServiceCenterList', error);
        }
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    edit(rowData) {
            window.open(window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1', '_blank');
        // this.props.history.push({
        //     pathname: '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1',
        //     state: {
        //         PolicyId: rowData.PolicyId,
        //         tab: 1
        //     }
        // });
    }

    getImageIcon(rowData){
        var linkType= '';
        if(rowData.LockedByPerson ==''){
            linkType= 'NoLock';
        }else{
            if(Number(rowData.IsCurrentUserUW) == 0 && rowData.IsSelfLocked ==1){
                linkType= 'NormalSelfLock';
            }else if(Number(rowData.IsCurrentUserUW) == 1 && rowData.IsSelfLocked ==1){
                linkType= 'UWSelfLock';
            }else if(Number(rowData.IsCurrentUserUW) == 0 && rowData.IsSelfLocked ==0){
                linkType= 'NormalOtherLock';
            }else if(Number(rowData.IsCurrentUserUW) ==1 && rowData.IsSelfLocked ==0){
                linkType= 'UWOtherLock';
            }
        }
        
        switch (linkType){
            
        case 'NormalSelfLock' : 
            return <span> 
                <i class="fa fa-user-circle-o" aria-hidden="true" style={{ fontSize: '25px'}} id={"NSL"+rowData.policyNumber}></i>
                    <UncontrolledTooltip placement="right" target={"NSL"+rowData.policyNumber}>
                        {"locked By Me"}
                    </UncontrolledTooltip>
                 </span>
        case 'UWSelfLock':
            return <span>
                    <i class="fa fa-user-circle-o" style={{ fontSize: '25px'}} aria-hidden="true" id={'USL'+ rowData.policyNumber}></i>
                    <UncontrolledTooltip placement="right" target={"USL"+ rowData.policyNumber}>
                        {"locked By Me"}
                    </UncontrolledTooltip>
                    </span>
        case 'NormalOtherLock':
            return <span>
                <i class="fa fa-lock" aria-hidden="true" style={{ fontSize: '25px'}} id={"NOL"+ rowData.policyNumber}></i> 
                 <UncontrolledTooltip placement="right" target={"NOL"+ rowData.policyNumber} >
                        {"locked By" + rowData.LockedByPerson}
                    </UncontrolledTooltip>
                </span>
        case 'UWOtherLock' :
            return <span>
                <i class="fa fa-lock" onClick={()=>this.releaseLock(rowData)} style={{ fontSize: '25px' , cursor: 'pointer'}} aria-hidden="true" id={"UWO"+ rowData.policyNumber}> </i>
                {/* <img src= 'img' onClick={()=>this.releaseLock(rowData)} alt="UWO" /> */}
                    <UncontrolledTooltip placement="right" target={"UWO"+ rowData.policyNumber} >
                        {"locked By" + rowData.LockedByPerson}
                    </UncontrolledTooltip>
                    </span>
        case 'Nolock':
            return null;
        }
    }

    releaseLock(rowData){
        let data = {
            'PolicyId' : rowData.PolicyId,
             'ReleaseAll': 0
        };
        api.post('api/releaseLock', data).then(res => {
            if (res.success) {
                if(res.data[0][0].returnValue==''){
                    this.reloadSavedData(this.state.SavedData , rowData);
                }else{
                    toast.error(res.data[0][0].returnValue);
                }
                
            } else {
                toast.error("SomeThing went wrong.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });

    }

    async reloadSavedData(data, rowData){
        // console.log('data in reloadsaveddata......',data)
      await  api.post('api/searchPolicy', data).then(res => {
            console.log("searchPolicy--------", res);
            if (res.success) {
                var formattedData = [];
                var totalRecords = 0;
                var PolicyTypeImage = '';
                var PolicyTypeAltmsg = '';
                console.log("res.data.....",res.data)

                for (var i = 0; i < res.data.length; i++) {
                    if(res.data[i].PolicyType === "MultiVessel"){
                        PolicyTypeImage = MultiVessel;
                        PolicyTypeAltmsg = 'MV';
                    }else if(res.data[i].PolicyType === "Vessel"){
                        PolicyTypeImage = Vessel;
                        PolicyTypeAltmsg ='V';
                    }else if(res.data[i].PolicyType === "MarineTrade"){
                        PolicyTypeImage = MarineTrade;
                        PolicyTypeAltmsg = "MT";
                    }else if(res.data[i].PolicyType === "Miscellaneous"){
                        PolicyTypeImage = Miscellaneous;
                        PolicyTypeAltmsg = 'MIS';
                    }else if(res.data[i].PolicyType === "VesselNonrated"){
                        PolicyTypeImage = VesselNonrated;
                        PolicyTypeAltmsg = 'VN';
                    }
                    formattedData.push({
                        SrNo: i + 1,
                        Name: res.data[i].Name,
                        CountryCode: res.data[i].CountryCode,
                        PhoneNumber: res.data[i].PhoneNumber,
                        Email: res.data[i].Email,
                        
                        PolicyId: res.data[i].PolicyId,
                        DocLang: res.data[i].DocLang,
                        InsuranceCompanyName: res.data[i].InsuranceCompanyName,
                        Vessel: res.data[i].VesselName,
                        VesselTypeName: res.data[i].VesselTypeName,
                        SumInsured: res.data[i].SumInsured,
                        CurrentPremium: res.data[i].CurrentPremium,
                        InceptionDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker),
                        RenewalDate: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.forDatePicker),
                        PolicyType: res.data[i].PolicyType,
                        PolicyTypeImage: PolicyTypeImage,
                        PolicyTypeAltmsg: PolicyTypeAltmsg,
                        PolicyNumber: res.data[i].PolicyNumber,
                        Outstanding: CommonConfig.isEmpty(res.data[i].Outstanding) ? '' : CommonConfig.formatMoney(res.data[i].Outstanding, 2),
                        Status: res.data[i].Status,
                        Stage: res.data[i].Stage,
                        NBOrRN: res.data[i].NBOrRN,
                        IsOrganization: res.data[i].IsOrganization,
                        Department: res.data[i].Department,
                        VesselClassName: res.data[i].VesselClassName,
                        Value: CommonConfig.formatMoney(res.data[i].SumInsured, 2),
                        Premium: CommonConfig.isEmpty(res.data[i].Premium) ? '' : res.data[i].Premium,
                        Created: CommonConfig.isEmpty(res.data[i].InceptionDate) ? '' : moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                        Renewal: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                        Updated: CommonConfig.isEmpty(res.data[i].UpdatedOn) ? '' : moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateOnly),
                        UpdatedByName: CommonConfig.isEmpty(res.data[0].UpdatedByName) ? '' : res.data[0].UpdatedByName,
                        CreatedByName: CommonConfig.isEmpty(res.data[0].CreatedByName) ? '' : res.data[0].CreatedByName,
                        Currency: res.data[i].Currency,
                        InceptionRenewalDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker) + " " + moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                        Client: res.data[i].EntityType === 'person' ? res.data[i].Forename + '' + res.data[i].SurName : "",
                        Country: res.data[i].Country,
                        ClientDetails: res.data[i].Name + " " + CommonConfig.formatPhoneNumber(res.data[i].CountryCode + res.data[i].PhoneNumber) + " " + res.data[i].Email,
                        PolicyData: res.data[i].PolicyType + " " + res.data[i].PolicyNumber + " "+ res.data[i].DocLang,
                        DepartmentDetails: res.data[i].Department+ " " + res.data[i].SubAgentName + " " + res.data[i].SubAgentPhone + " " + res.data[i].SubAgentEmail,
                        VesselDetails: res.data[i].VesselClassName + " " + res.data[i].VesselTypeName,
                        Note: res.data[i].Note,
                        PreiumDifferencePercentage: res.data[i].PreiumDifferencePercentage,
                        RenewalPremium: res.data[i].RenewalPremium,
                        SubAgentName: res.data[i].SubAgentName,
                        SubAgentEmail: res.data[i].SubAgentEmail,
                        SubAgentPhone: res.data[i].SubAgentPhone,                        
                        HandlerPerson: res.data[i].HandlerPerson,
                        LockedByPerson: res.data[i].LockedByPerson,
                        LockedByPersonId: res.data[i].LockedByPersonId,
                        IsCurrentUserUW: res.data[i].IsCurrentUserUW,
                        IsSelfLocked: res.data[0].IsSelfLocked,
                        ReferredToPerson: res.data[i].ReferredToPerson
                    });
                }

                    console.log("formatted data...", formattedData);
                totalRecords = formattedData.length; // TODO: get from response
                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let recordStr = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                let str = recordStr; //(this.state.searchType == 'ALL') ? recordStr : '';
                this.setState({ arr: formattedData, str: str, recordStr: recordStr, totalRecords: totalRecords });

                this.checkPrevNextHandle();
                toast.success("Policy "+rowData.PolicyNumber+ " unlocked Successfully");  

                // if (CommonConfig.isEmpty(this.state.stageFilter)) {
                //     this.setState({ stageList: this.state.stageFilterList });
                // } else {
                //     this.getPolicyStage();
                // }
            } else {

            }
        }).catch(err => {
            console.log("searchPolicy-API-Error", err);
        });
    }

    formatPolicyDetail(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.PolicyType}</p>
                <p>{rowData.PolicyNumber}</p>
                <p>{rowData.DocLang}</p>
            </div>
        )
    }

    formatContactDetail(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.Name}</p>
                <p>{CommonConfig.formatPhoneNumber(rowData.CountryCode + rowData.PhoneNumber)}</p>
                <p>{rowData.Email}</p>
            </div>
        )
    }

    formatVesselData(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.VesselClassName}</p>
                <p>{rowData.VesselTypeName}</p>
            </div>
        )
    }

    formatPremiun(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.PremiumDetails}</p>
                {/* <p>{rowData.CurrentPremium} - {rowData.RenewalPremium} ( {rowData.PreiumDifferencePercentage}% )</p> */}
            </div>
        )
    }

    formatDate(rowData) {
        return (
            <div className="policy-list-data">
                {/* <p>{rowData.InceptionDate}</p> */}
                <p>{rowData.RenewalDate}</p>
            </div>
        )
    }

    formatDepartment(rowData){
        return(
            <div className="policy-list-data">
                <p>{rowData.Department}</p>
                {rowData.Department == "SubAgent"
                ?<> 
                <p>{rowData.SubAgentName}</p>
                    <p>{rowData.SubAgentPhone}</p>
                    <p>{rowData.SubAgentEmail}</p>
                </>
                : null}
            </div>
        )
    }

    formatStage(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.Stage}</p>
                <p>{rowData.ReferredToPerson}</p>
            </div>
        )
    }

    actionTemplate(rowData, column) {
        
        return <div className="policy-list-data">
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.edit(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>

            <span>
                <i onClick={() => this.getNoteList(rowData)} style={{ fontSize: '25px', cursor: 'pointer' }} className="pi pi-comment" href="#" id={"CommentTooltip" + rowData.PolicyId}></i>
                <UncontrolledTooltip placement="right" target={"CommentTooltip" + rowData.PolicyId}>
                    {CommonConfig.isEmpty(rowData.Note) ? rowData.Stage : rowData.Note}
                </UncontrolledTooltip>
            </span>
            
            {
                this.getImageIcon(rowData)
            }
          {/*<span>
                {rowData.PolicyType !== "" ? <img src={rowData.PolicyTypeImage} alt={rowData.PolicyTypeAltmsg}/> : null }

                {rowData.NBOrRN == 'RN' ? <img src={Renewal} alt= 'RN' /> : <img src={NewBusiness} alt= 'NB' /> }
            
                {rowData.Department == 'SubAgent' ? < img src={SubAgent} alt= 'SA' /> : (rowData.Department == 'Direct' ? < img src={Direct} alt="D" /> : (rowData.Department == 'Online' ? <img src={Online} alt='ON' /> : (rowData.Department == 'ServiceCenter' ? <img src={ServiceCenter} alt='SC' /> : null ) ) ) }

                {(rowData.IsOrganization !=null  || rowData.IsOrganization != '' || rowData.IsOrganization != undefined ) ? <img src={Organization} alt= "ORG" />: null}
            </span>*/}

        </div>;
    }

    export() {
        this.dt.exportCSV();
    }

    getPolicyClientName() {
        try {
            api.post(APIConstant.path.getPolicyClientName).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].EntityId,
                            label: res.data.data[i].FullName,
                        });
                    }
                    this.setState({ clientArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllEmailList() {
        try {
            api.post(APIConstant.path.getAllEmailList).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].Email,
                            label: res.data.data[i].Email,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ emailArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllcontactList() {
        try {
            api.post(APIConstant.path.getAllcontactList).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].PhoneNumber,
                            label: res.data.data[i].PhoneNumber,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ phoneArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllpolicyNumber() {
        try {
            api.post(APIConstant.path.getAllpolicyNumber).then(res => {
                if (res.success) {
                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.data.length; i++) {
                        formattedData.push({
                            value: res.data.data[i].PolicyNumber,
                            label: res.data.data[i].PolicyNumber,
                        });
                    }
                    console.log('formattedData', formattedData);
                    this.setState({ policyNumberArray: formattedData });
                } else {
                }
            }).catch(err => {
                console.log('error', err);

            });
        } catch (error) {
            console.log('error', error);
        }
    }

    getAllBinder() {
        try {
            let data = {};
            api.post(APIConstant.path.getAllBinder, data).then(res => {
                if (res.success) {
                    console.log('res.datares.data', res.data.res);

                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.res.length; i++) {
                        formattedData.push({
                            value: res.data.res[i].BinderId,
                            label: res.data.res[i].UMRN,
                        });
                    }

                    this.setState({ binderArray: formattedData });
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

    getSubBinderByBinderId(id) {
        try {
            let data = {
                BinderId: id
            };
            api.post(APIConstant.path.getSubBinderByBinderId, data).then(res => {
                if (res.success) {
                    console.log('res.datares.data', res.data.res);

                    let formattedData = [];
                    let i;
                    for (i = 0; i < res.data.res.length; i++) {
                        formattedData.push({
                            value: res.data.res[i].SubBinderId,
                            label: res.data.res[i].Title,
                        });
                    }

                    this.setState({ subBinderArray: formattedData });
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

    getLanguage() {
        try {
            api.get(APIConstant.path.getLanguage).then(res => {
                if (res.success) {
                    this.setState({ languageArray: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getCurrency() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                if (res.success) {
                    this.setState({ currencyArray: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    getVesselClass() {
        try {
            api.get(APIConstant.path.getVesselClass).then(res => {
                if (res.success) {
                    let formattedArray = [];
                    for (let i = 0; i < res.data.length; i++) {
                        formattedArray.push({
                            label: res.data[i].VesselClassName,
                            value: res.data[i].VesselClassId
                        });
                    }
                    this.setState({ vesselClassArray: formattedArray, vesselClassCopy: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }

    }

    getVesselType(id) {
        try {
            const data = {
                VesselClassId: id
            };
            api.post(APIConstant.path.getVesselType, data).then(res => {
                if (res.success) {
                    console.log('-o-p-o-o-p-o-p-p-o', res.data);

                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselTypeName,
                            value: res.data[i].VesselTypeId,
                        });
                    }
                    this.setState({ vesselTypeArray: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }

    }

    getPolicyList(IsAdvance) {
        try {
            let data = {};
            var splitData = this.props.location.pathname.split("/");
            if (splitData[2] !== undefined && splitData[3] !== undefined) {
                data = {
                    entityId: splitData[2] || '',
                    entityType: splitData[3] || '',
                    isAdvance: 0,
                };
            } else {
                data = {
                    isAdvance: IsAdvance
                }
            }
            console.log('0o-0o-o-kl0k-0k-0k-0k-0k-0k-0kj', data);

            api.post('api/getPolicyList', data).then(res => {
                if (res.success) {
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
        
                        // console.log("getPolicyList > ", res.data[i]);
                        
                        formattedData.push({
                            SrNo: i + 1,
                            Name: res.data[i].Name,
                            CountryCode: res.data[i].CountryCode,
                            PhoneNumber: res.data[i].PhoneNumber,
                            Email: res.data[i].Email,
                            PolicyId: res.data[i].PolicyId,
                            PolicyType: res.data[i].PolicyType,
                            PolicyNumber: res.data[i].PolicyNumber,
                            Status: res.data[i].Status,
                            Department: res.data[i].Department,
                            InsuranceCompanyName: res.data[i].InsuranceCompanyName,
                            Vessel: res.data[i].VesselName,
                            Value: res.data[i].SumInsured,
                            VesselClassName: res.data[i].VesselClassName,
                            VesselTypeName: res.data[i].VesselTypeName,
                            SumInsured: res.data[i].SumInsured,
                            CurrentPremium: res.data[i].CurrentPremium,
                            InceptionDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker),
                            RenewalDate: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.forDatePicker),
                            Premium: "",
                            Created: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                            Renewal: moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                            Updated: moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateOnly),
                            LastUpdatedBy: "",
                            InceptionRenewalDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker) + " " + moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                            CreatedBy: res.data[i].CreatedBy,
                            LastUpdated: "",
                            Currency: res.data[i].Currency,
                            Client: res.data[i].EntityType === 'person' ? res.data[i].Forename + '' + res.data[i].SurName : "",
                            Country: res.data[i].Country,
                        });
                    }
                    console.log("formateted Fate...",formattedData);
                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ arr: formattedData, str: str });
                } else {
                }
            }).catch(err => {

            });
        } catch (err) {

        }
    }

    filterSingle(e) {
        let results = this.state.contactArray.filter((contact) => {
            return contact.label.toLowerCase().startsWith(e.query.toLowerCase());
        });
        this.setState({ filteredcontactsSingle: results });

    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getDropDownValues(stringMapType, setStateName) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    toggleLargeAdd = () => {
        this.setState({ toggleModalAdd: false });
    }

    gotoNextPage() {
        this.props.history.push('/newPolicy1');
    }

    toggleCustom = (tab) => {
        const prevState = this.state.custom;
        const state = prevState.map((x, index) => tab === index ? !x : false);
        this.setState({ custom: state });
    }

    selectType(value, type) {

        if (value === '' || value === undefined || value === null) {
            this.setState({
                [type]: ''
            });
        }
        else {
            this.setState({
                [type]: value.value
            });
        }

        if (type === 'client') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ client: '' });
            } else {
                this.setState({ client: value.value });
            }
        }

        if (type === 'binder') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ binder: '' });
            } else {
                this.getSubBinderByBinderId(value);
                this.setState({ binder: value.value });
            }
        }

        if (type === 'policyMonth') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyMonth: '' });
            } else {
                this.setState({ policyMonth: value.value });
            }
        }

        if (type === 'policyYear') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyYear: '' });
            } else {
                this.setState({ policyYear: value.value });
            }
        }

        if (type === 'policyType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyType: '' });
            } else {
                this.setState({ policyType: value.value });
            }
        }

        if (type === 'policyCountry') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyCountry: '' });
            } else {
                this.setState({ policyCountry: value.value });
            }
        }

        if (type === 'policyAgentServiceCenter') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyAgentServiceCenter: '' });
            } else {
                this.setState({ policyAgentServiceCenter: value.value });
            }
        }

        if (type === 'policyCurrency') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyCurrency: '' });
            } else {
                this.setState({ policyCurrency: value.value });
            }
        }

        if (type === 'policyLanguage') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyLanguage: '' });
            } else {
                this.setState({ policyLanguage: value.value });
            }
        }

        if (type === 'stageFilter') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ stageFilter: '', selectedPolicy: [], stage: '' });
            } else {
                this.setState({ stageFilter: value, selectedPolicy: [], stage: '' });
            }
        }

        if (type === 'referredTo') {
            this.setState({ referredTo: value });
        }

    }

    filterData() {
        let date = {

        }
    }

    redirectToNewPolicy = () => {
        var splitData = this.props.location.pathname.split("/");
        if (splitData[2] !== undefined && splitData[3] !== undefined) {
            this.props.history.push({
                pathname: '/CreatePolicy/' + splitData[2],
                state: {
                    id: splitData[2]
                }
            });
        } else {
            this.props.history.push({
                pathname: '/NewPolicy/',
                state: {}
            });
        }
    }

    onRadioBtnClick(radioSelected) {

        this.state.stageFilterList = [];

        if ('QUOTE' == radioSelected || 'NEWBUSINESS' == radioSelected) {
            this.state.stageFilterList = this.state.stageList.filter(function (data) {
                return data.StringMapType == 'NEWBUSINESSSTAGE';
            })
        } else if ('RENEWAL' == radioSelected) {
            this.state.stageFilterList = this.state.stageList.filter(function (data) {
                return data.StringMapType == 'RENEWALSTAGE';
            })
        } else {
            this.state.stageFilterList = this.state.stageList;
        }

        this.setState({ stageFilter: '', searchType: radioSelected, stageFilterList: this.state.stageFilterList });

        if (radioSelected === "ALL") {
            setTimeout(() => {
                this.getSearchPolicy();
            }, 100);
        }
    }

    handleChange = e => {
        const { t } = this.props;
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'policyNumber') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyNumberErro: true, policyNumber: '' });
            } else {
                this.setState({ policyNumberErro: false, policyNumber: e.target.value });
            }
        }

        if (e.target.name === 'clientNamePhoneEmail') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ clientNamePhoneEmailError: true, clientNamePhoneEmail: '' });
            } else {
                this.setState({ clientNamePhoneEmailError: false, clientNamePhoneEmail: e.target.value });
            }
        }

        if (e.target.name === 'clientName') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ clientNameError: true, clientName: '' });
            } else {
                this.setState({ clientNameError: false, clientName: e.target.value });
            }
        }

        if (e.target.name === 'policyPhoneEmail') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyPhoneEmail: '' });
            } else {
                this.setState({ policyPhoneEmail: e.target.value });
            }
        }

        if (e.target.name === 'policyFrom') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyFrom: '' });
            } else {
                this.setState({ policyFrom: e.target.value, policyTo: '' });
                this.show('policyTo', false, 'policyToError', '');
            }
        }

        if (e.target.name === 'policyTo') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ policyTo: '' });
            } else {
                if (!CommonConfig.isEmpty(this.state.policyFrom)) {
                    var isToDateGreater = moment(e.target.value).isSameOrAfter(this.state.policyFrom);
                    if (!isToDateGreater) {
                        this.show('policyTo', true, 'policyToError', 'To date must be greater then From date.');
                    } else {
                        this.show('policyTo', false, 'policyToError', '');
                    }
                } else {
                    this.show('policyTo', false, 'policyToError', '');
                }
                this.setState({ policyTo: e.target.value });
            }
        }
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

    changePolicyDateView() {
        this.setState({ isMonthYear: !this.state.isMonthYear });
    }

    getSearchPolicy() {
        try {

            this.state.selectedPolicy = []
            this.state.stage = ''

            const data = {
                searchType: this.state.searchType,
                offSet: this.state.offset
            };

            if (this.state.searchType != 'ALL') {

                if (this.state.searchType == 'QUICK') {
                    if (CommonConfig.isEmpty(this.state.policyNumber) && CommonConfig.isEmpty(this.state.clientNamePhoneEmail)) {
                        toast.error('Please fill at least one value to search');
                        return false;
                    }
                    data.PolicyNumber = CommonConfig.isEmpty(this.state.policyNumber) ? '' : this.state.policyNumber;
                    data.ClientNamePhoneEmail = CommonConfig.isEmpty(this.state.clientNamePhoneEmail) ? '' : this.state.clientNamePhoneEmail;
                    data.ClientNamePhoneEmail = data.ClientNamePhoneEmail.replace("'", "\'");

                } else {
                    if (CommonConfig.isEmpty(this.state.clientName) && CommonConfig.isEmpty(this.state.policyPhoneEmail)
                        && CommonConfig.isEmpty(this.state.policyType) && CommonConfig.isEmpty(this.state.policyCountry)
                        && CommonConfig.isEmpty(this.state.policyLanguage) && CommonConfig.isEmpty(this.state.policyCurrency)
                        && CommonConfig.isEmpty(this.state.policyAgentServiceCenter)) {

                        if (this.state.isMonthYear) {
                            if (CommonConfig.isEmpty(this.state.policyMonth) && CommonConfig.isEmpty(this.state.policyYear)) {
                                toast.error('Please fill at least one value to search.');
                                return false;
                            }
                        } else {
                            if (CommonConfig.isEmpty(this.state.policyFrom) && CommonConfig.isEmpty(this.state.policyTo)) {
                                toast.error('Please fill at least one value to search.');
                                return false;
                            }
                        }
                    }

                    data.ClientName = CommonConfig.isEmpty(this.state.clientName) ? '' : this.state.clientName;
                    data.ClientName = data.ClientName.replace("'", "\'");
                    data.PhoneEmail = CommonConfig.isEmpty(this.state.policyPhoneEmail) ? '' : this.state.policyPhoneEmail;
                    data.PolicyType = CommonConfig.isEmpty(this.state.policyType) ? '' : this.state.policyType;
                    data.PolicyMonth = CommonConfig.isEmpty(this.state.policyMonth) ? '' : this.state.policyMonth;
                    data.IsDateRange = (this.state.isMonthYear) ? false : true;
                    data.PolicyYear = CommonConfig.isEmpty(this.state.policyYear) ? '' : this.state.policyYear;
                    data.PolicyFrom = CommonConfig.isEmpty(this.state.policyFrom) ? '' : this.state.policyFrom;
                    data.PolicyTo = CommonConfig.isEmpty(this.state.policyTo) ? '' : this.state.policyTo;
                    data.PolicyCountry = CommonConfig.isEmpty(this.state.policyCountry) ? '' : this.state.policyCountry;
                    data.PolicyLanguage = CommonConfig.isEmpty(this.state.policyLanguage) ? '' : this.state.policyLanguage;
                    data.PolicyCurrency = CommonConfig.isEmpty(this.state.policyCurrency) ? '' : this.state.policyCurrency;
                    data.Stage = CommonConfig.isEmpty(this.state.stageFilter) ? '' : this.state.stageFilter;
                    data.PolicyAgentServiceCenter = CommonConfig.isEmpty(this.state.policyAgentServiceCenter) ? '' : this.state.policyAgentServiceCenter;
                }
            }

            console.log("searchPolicy--------", data);
            this.setState({SavedData: data});
            api.post('api/searchPolicy', data).then(res => {
                console.log("searchPolicy--------", res);
                if (res.success) {
                    var formattedData = [];
                    var totalRecords = 0;
                    var PolicyTypeImage = '';
                    var PolicyTypeAltmsg = '';
                    console.log("res.data.....",res.data)

                    for (var i = 0; i < res.data.length; i++) {
                        if(res.data[i].PolicyType === "MultiVessel"){
                            PolicyTypeImage = MultiVessel;
                            PolicyTypeAltmsg = 'MV';
                        }else if(res.data[i].PolicyType === "Vessel"){
                            PolicyTypeImage = Vessel;
                            PolicyTypeAltmsg ='V';
                        }else if(res.data[i].PolicyType === "MarineTrade"){
                            PolicyTypeImage = MarineTrade;
                            PolicyTypeAltmsg = "MT";
                        }else if(res.data[i].PolicyType === "Miscellaneous"){
                            PolicyTypeImage = Miscellaneous;
                            PolicyTypeAltmsg = 'MIS';
                        }else if(res.data[i].PolicyType === "VesselNonrated"){
                            PolicyTypeImage = VesselNonrated;
                            PolicyTypeAltmsg = 'VN';
                        }
                        formattedData.push({
                            SrNo: i + 1,
                            Name: res.data[i].Name,
                            CountryCode: res.data[i].CountryCode,
                            PhoneNumber: res.data[i].PhoneNumber,
                            Email: res.data[i].Email,
                            PolicyId: res.data[i].PolicyId,
                            DocLang: res.data[i].DocLang,
                            InsuranceCompanyName: res.data[i].InsuranceCompanyName,
                            Vessel: res.data[i].VesselName,
                            VesselTypeName: res.data[i].VesselTypeName,
                            SumInsured: res.data[i].SumInsured,
                            CurrentPremium: res.data[i].CurrentPremium,
                            InceptionDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker),
                            RenewalDate: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.forDatePicker),
                            PolicyType: res.data[i].PolicyType,
                            PolicyTypeImage: PolicyTypeImage,
                            PolicyTypeAltmsg: PolicyTypeAltmsg,
                            PolicyNumber: res.data[i].PolicyNumber,
                            Outstanding: CommonConfig.isEmpty(res.data[i].Outstanding) ? '' : CommonConfig.formatMoney(res.data[i].Outstanding, 2),
                            Status: res.data[i].Status,
                            Stage: res.data[i].Stage,
                            NBOrRN: res.data[i].NBOrRN,
                            IsOrganization: res.data[i].IsOrganization,
                            Department: res.data[i].Department,
                            VesselClassName: res.data[i].VesselClassName,
                            Value: CommonConfig.formatMoney(res.data[i].SumInsured, 2),
                            Premium: CommonConfig.isEmpty(res.data[i].Premium) ? '' : res.data[i].Premium,
                            Created: CommonConfig.isEmpty(res.data[i].InceptionDate) ? '' : moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.dateOnly),
                            Renewal: CommonConfig.isEmpty(res.data[i].RenewalDate) ? '' : moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                            Updated: CommonConfig.isEmpty(res.data[i].UpdatedOn) ? '' : moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateOnly),
                            UpdatedByName: CommonConfig.isEmpty(res.data[0].UpdatedByName) ? '' : res.data[0].UpdatedByName,
                            CreatedByName: CommonConfig.isEmpty(res.data[0].CreatedByName) ? '' : res.data[0].CreatedByName,
                            Currency: res.data[i].Currency,
                            InceptionRenewalDate: moment(res.data[i].InceptionDate).format(CommonConfig.dateFormat.forDatePicker) + " " + moment(res.data[i].RenewalDate).format(CommonConfig.dateFormat.dateOnly),
                            Client: res.data[i].EntityType === 'person' ? res.data[i].Forename + '' + res.data[i].SurName : "",
                            Country: res.data[i].Country,
                            ClientDetails: res.data[i].Name + " " + CommonConfig.formatPhoneNumber(res.data[i].CountryCode + res.data[i].PhoneNumber) + " " + res.data[i].Email,
                            PolicyData: res.data[i].PolicyType + " " + res.data[i].PolicyNumber + " "+ res.data[i].DocLang,
                            DepartmentDetails: res.data[i].Department+ " " + res.data[i].SubAgentName + " " + res.data[i].SubAgentPhone + " " + res.data[i].SubAgentEmail,
                            VesselDetails: res.data[i].VesselClassName + " " + res.data[i].VesselTypeName,
                            Note: res.data[i].Note,
                            PremiumDetails: res.data[i].PremiumDetails,
                            PreiumDifferencePercentage: res.data[i].PreiumDifferencePercentage,
                            RenewalPremium: res.data[i].RenewalPremium,
                            SubAgentName: res.data[i].SubAgentName,
                            SubAgentEmail: res.data[i].SubAgentEmail,
                            SubAgentPhone: res.data[i].SubAgentPhone,
                            HandlerPerson: res.data[i].HandlerPerson,
                            LockedByPerson: res.data[i].LockedByPerson,
                            LockedByPersonId: res.data[i].LockedByPersonId,
                            IsCurrentUserUW: res.data[i].IsCurrentUserUW,
                            IsSelfLocked: res.data[0].IsSelfLocked,
                            ReferredToPerson: res.data[i].ReferredToPerson
                        });
                    }

                        console.log("formatted data...", formattedData);
                    totalRecords = formattedData.length; // TODO: get from response
                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let recordStr = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    let str = recordStr; //(this.state.searchType == 'ALL') ? recordStr : '';
                    this.setState({ arr: formattedData, str: str, recordStr: recordStr, totalRecords: totalRecords });

                    this.checkPrevNextHandle();
                    // if (CommonConfig.isEmpty(this.state.stageFilter)) {
                    //     this.setState({ stageList: this.state.stageFilterList });
                    // } else {
                    //     this.getPolicyStage();
                    // }
                } else {

                }
            }).catch(err => {
                console.log("searchPolicy-API-Error", err);
            });
        } catch (error) {
            console.log("searchPolicy-Error", error);
        }
    }

    getPreviousRecords() {
        let offset = (this.state.offset > 0) ? parseInt(this.state.offset) - 1 : 0;
        this.setState({ offset: offset });

        setTimeout(() => {
            this.getSearchPolicy();
        }, 100);
    }

    getNextRecords() {
        let offset = (this.state.offset >= 0) ? parseInt(this.state.offset) + 1 : 0;
        this.setState({ offset: offset });

        setTimeout(() => {
            this.getSearchPolicy();
        }, 100);
    }

    checkPrevNextHandle() {
        if (this.state.offset > 0) {
            this.setState({ isPreviousVisible: false });
        } else {
            this.setState({ isPreviousVisible: true });
        }
    }

    getNoteList(rowData) {
        this.setState({ NavID: null });

        const data = {
            'entityId': rowData.PolicyId,
            'entityType': 'Policy',
            'CurrentUser': CommonConfig.loggedInUserData().EntityId
        };
        // api.post('api/getNotes', data).then(res => {
            api.post('api/getNewBusineesNotes', data).then(res => {
            if (res.success) {
                this.setState({ policyNoteList: res.data, openNotePopup: true, NavID: rowData.PolicyId });
            } else {
                toast.warn("No notes found for Policy.");
            }
        }).catch(err => {
            console.log("getNoteList err", err);
        });
    }

    getNotesType() {
        try {
            const data = {
                stringmaptype: 'NOTETYPE'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ noteType: res.data });
                } else {

                }
            }).catch(err => {

            });
        } catch (error) {

        }
    }

    selectNoteType(value, type) {
        if (value === '' || value === null) {
            this.setState({ NotesTypeError: true, notesType: value });
            this.show('notesType', true);
        } else {
            this.setState({ NotesTypeError: false, notesType: value });
            this.show('notesType', false);
        }
    }

    Important() {
        (this.state.isImportant === 0 ? this.setState({ isImportant: 1 }) : this.setState({ isImportant: 0 }))
    }

    saveNotes = () => {
        if (
            this.state.NotesTypeError === false &&
            this.state.notesdescriptionError === false) {

            const NotesForm = new FormData();
            NotesForm.append('notesType', this.state.notesType);
            NotesForm.append('notesdescription', this.state.notesdescription.trim());
            NotesForm.append('entityid', this.state.NavID);
            NotesForm.append('entitytype', 'Policy');
            NotesForm.append('isflag', this.state.isImportant);
            NotesForm.append('loggedInUserId', CommonConfig.loggedInUserId());
            NotesForm.append('languageId', this.state.LanguageId);

            api.post('api/addNotes', NotesForm).then(res => {
                if (res.success) {
                    this.reset();
                    toast.success('Notes added successfully');
                    this.getNoteList({ PolicyId: this.state.NavID });
                } else {

                }
            }).catch(err => {
            });
        } else {
            this.show("notesType", this.state.NotesTypeError);
            this.show("notesdescription", this.state.notesdescriptionError);
        }
    }

    handleChangeNote = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'notesdescription') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ notesdescriptionError: true });
                this.show("notesdescription", true);
            } else {
                this.setState({ notesdescriptionError: false, notesdescription: e.target.value });
                this.show("notesdescription", false);
            }
        }
    }

    reset = () => {
        this.setState({
            notesdescription: '', notesdescriptionError: true,
            notesType: '', NotesTypeError: true,
            isImportant: 0,
        });
        this.show("notesdescription", false);
        this.show('notesType', false);

        this.setState({ addNoteCollapse: false });
    }

    render() {
        const { t } = this.props;

        var header = <div>
            <Row>
                <Col md="1">
                    <MultiSelect value={this.state.cols} options={this.colOptions}
                        fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                        onChange={this.onColumnToggle} style={{ width: '50px' }} />
                </Col>
                <Col md="11">
                    <div style={{ textAlign: 'right' }}>
                        <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                        <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />

                        <Button type="button" icon="pi pi-external-link" iconPos="left" tooltip="Export as CSV" tooltipOptions={{ position: 'left' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </Col>
            </Row>
        </div>;

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>{t("policyList:PolicyList")}</h1>

                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="New Policy Setup" tooltipOptions={{ position: 'bottom' }} onClick={() => this.redirectToNewPolicy()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="input-box" id="accordion">

                    {/* <h5>Search Policy</h5> */}
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {t("policyList:SearchPolicy")}
                                    <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Form onSubmit={e => e.preventDefault()}>
                                    <div className="gt-radio">
                                        <div className="middle">
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'QUICK') ? true : false}
                                                        value={this.state.searchType} onChange={(e) => this.onRadioBtnClick('QUICK')} />
                                                    <div className="front-end box">
                                                        <span>Quick</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'QUOTE') ? true : false}
                                                        value={this.state.searchType} onChange={() => this.onRadioBtnClick('QUOTE')} />
                                                    <div className="front-end box">
                                                        <span>Quote</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'NEWBUSINESS') ? true : false}
                                                        value={this.state.searchType} onChange={() => this.onRadioBtnClick('NEWBUSINESS')} />
                                                    <div className="front-end box">
                                                        <span>New Business</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'RENEWAL') ? true : false}
                                                        value={this.state.searchType} onChange={() => this.onRadioBtnClick('RENEWAL')} />
                                                    <div className="front-end box">
                                                        <span>Renewal</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'CUSTOM') ? true : false}
                                                        value={this.state.searchType} onChange={() => this.onRadioBtnClick('CUSTOM')} />
                                                    <div className="front-end box">
                                                        <span>Custom</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="gtradio-box">
                                                <label>
                                                    <input type="radio" name="searchType" id="searchType"
                                                        checked={(this.state.searchType === 'ALL') ? true : false}
                                                        value={this.state.searchType} onChange={(e) => this.onRadioBtnClick('ALL')} />
                                                    <div className="front-end box">
                                                        <span>All</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {(this.state.searchType == 'QUICK') ? (
                                            <Row>
                                                <Col md="3">
                                                    <div className="input-box">
                                                        <label>Policy Number</label>
                                                        <Input name="policyNumber" id="policyNumber" value={this.state.policyNumber} onChange={(e) => this.handleChange(e)} placeholder="Enter Policy Number" />
                                                        <em id="policyNumberError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="3">
                                                    <div className="input-box">
                                                        <label>Client/Phone/Email</label>
                                                        <Input name="clientNamePhoneEmail" id="clientNamePhoneEmail" value={this.state.clientNamePhoneEmail} onChange={(e) => this.handleChange(e)} placeholder="Enter Client/Phone/Email" />
                                                        <em id="policyNumberError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : (null)}

                                        {(this.state.searchType != 'QUICK' && this.state.searchType != 'ALL') ? (
                                            <Row>
                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Client</label>
                                                        <Input name="clientName" id="clientName" value={this.state.clientName} onChange={(e) => this.handleChange(e)} placeholder="Enter Client Name" />
                                                        <em id="clientNameError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Phone/Email</label>
                                                        <Input name="policyPhoneEmail" id="policyPhoneEmail" value={this.state.policyPhoneEmail} onChange={(e) => this.handleChange(e)} placeholder="Enter Client/Phone/Email" />
                                                        <em id="policyPhoneEmailError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Policy Type</label>
                                                        <Input type="select" name="policyType" id="policyType" value={this.state.policyType} onChange={(e) => this.selectType(e.target, 'policyType')}>
                                                            <option value="">Select Policy Type</option>
                                                            {this.state.policyTypeArray.map((policyType, i) => {
                                                                return (<option value={policyType.StringMapKey} key={i}>{policyType.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="policyTypeError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="12">
                                                    <Row>
                                                        <Col md="2" style={{ alignSelf: 'center' }}>
                                                            {(this.state.searchType == 'RENEWAL') ? (
                                                                <h5>Policy Renewal</h5>
                                                            ) : (
                                                                    <h5>Policy Inception</h5>
                                                                )}
                                                        </Col>
                                                        {(this.state.isMonthYear) ? (
                                                            <Col md="2">
                                                                <div className="input-box">
                                                                    <label>Month</label>
                                                                    <Input type="select" name="policyMonth" id="policyMonth" value={this.state.policyMonth} onChange={(e) => this.selectType(e.target, 'policyMonth')}>
                                                                        <option value="">Select Month</option>
                                                                        {this.state.monthArray.map((month, i) => {
                                                                            return (<option value={month.value} key={i}>{month.label}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em id="policyMonthError" className="error invalid-feedback"></em>
                                                                </div>
                                                            </Col>
                                                        ) : (
                                                                <Col md="2">
                                                                    <div className="input-box">
                                                                        <label>From</label>
                                                                        <Input type="date" name="policyFrom" id="policyFrom"
                                                                            value={this.state.policyFrom}
                                                                            onBlur={(e) => this.handleChange(e)}
                                                                            onChange={(e) => this.handleChange(e)} />
                                                                        <em id="policyFromError" className="error invalid-feedback"></em>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                        {(this.state.isMonthYear) ? (
                                                            <Col md="2">
                                                                <div className="input-box">
                                                                    <label>Year</label>
                                                                    <Input type="select" name="policyYear" id="policyYear" value={this.state.policyYear} onChange={(e) => this.selectType(e.target, 'policyYear')}>
                                                                        <option value="">Select Year</option>
                                                                        {this.state.yearArray.map((year, i) => {
                                                                            return (<option value={year.value} key={i}>{year.label}</option>)
                                                                        })
                                                                        }
                                                                    </Input>
                                                                    <em id="policyYearError" className="error invalid-feedback"></em>
                                                                </div>
                                                            </Col>
                                                        ) : (
                                                                <Col md="2">
                                                                    <div className="input-box">
                                                                        <label>To</label>
                                                                        <Input type="date" name="policyTo" id="policyTo"
                                                                            value={this.state.policyTo}
                                                                            onBlur={(e) => this.handleChange(e)}
                                                                            onChange={(e) => this.handleChange(e)} />
                                                                        <em id="policyToError" className="error invalid-feedback"></em>
                                                                    </div>
                                                                </Col>
                                                            )}

                                                        <Col md="2" style={{ alignSelf: 'center' }}>
                                                            {(this.state.isMonthYear) ? (
                                                                <label style={{ textDecoration: 'underline' }} onClick={() => this.changePolicyDateView()}>Change to Date Range</label>
                                                            ) : (
                                                                    <label style={{ textDecoration: 'underline' }} onClick={() => this.changePolicyDateView()}>Change to Month/Year</label>
                                                                )}
                                                        </Col>

                                                    </Row>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Country</label>
                                                        <Input type="select" name="policyCountry" id="policyCountry" onChange={(e) => this.selectType(e.target, 'policyCountry')} value={this.state.policyCountry}>
                                                            <option value=''>Select</option>
                                                            {this.state.countryList.map((type, i) => {
                                                                return (<option value={type.StringMapKey} key={i}>{type.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="policyCountryError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Language</label>
                                                        <Input type="select" name="policyLanguage" id="policyLanguage" onChange={(e) => this.selectType(e.target, 'policyLanguage')} value={this.state.policyLanguage}>
                                                            <option value=''>Select</option>
                                                            {this.state.documentLanguageList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="policyLanguageError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Currency</label>
                                                        <Input type="select" name="policyCurrency" id="policyCurrency" onChange={(e) => this.selectType(e.target, 'policyCurrency')} value={this.state.policyCurrency}>
                                                            <option value=''>Select</option>
                                                            {this.state.currencyList.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em id="policyCurrencyError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Stage</label>
                                                        <Input type="select" name="stageFilter" id="stageFilter" value={this.state.stageFilter} onChange={(e) => this.selectType(e.target.value, 'stageFilter')}>
                                                            <option value=''>Select</option>
                                                            {this.state.stageFilterList.map((ct, i) => {
                                                                return (<option value={ct.StringMapKey}>{ct.StringMapKey}</option>)
                                                            })}
                                                        </Input>
                                                        <em id="stageFilterError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="input-box">
                                                        <label>Agent / Service Center</label>
                                                        <Select name="policyAgentServiceCenter" id="policyAgentServiceCenter" options={this.state.policyAgentServiceCenterList} value={this.state.policyAgentServiceCenter} onChange={(data) => this.selectType(data, 'policyAgentServiceCenter')} placeholder="Select" />
                                                        <em id="policyAgentServiceCenterError" className="error invalid-feedback"></em>
                                                    </div>
                                                </Col>

                                            </Row>
                                        ) : (null)}
                                    </div>

                                    {(this.state.searchType != 'ALL') ? (
                                        <Row>
                                            <Col md="12" className="text-left">
                                                <BTN type="submit" color="success" title="Go" onClick={() => this.getSearchPolicy()}> Go </BTN>
                                            </Col>
                                        </Row>
                                    ) : (null)}
                                </Form>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                {/* (this.state.searchType != 'ALL' && this.state.arr.length) ? (
                    <Row style={{ marginBottom: '10px' }}>
                        <Col md='4' className='text-right'>
                            <BTN disabled={this.state.isPreviousVisible} color="link" title="Previous" onClick={() => this.getPreviousRecords()}> Prev </BTN>
                        </Col>
                        <Col md='4' className='text-center' style={{ alignSelf: 'center' }}>
                            <span> {this.state.recordStr} </span>
                        </Col>
                        <Col md='4' className='text-left'>
                            <BTN disabled={this.state.isNextVisible} color="link" title="Next" onClick={() => this.getNextRecords()}> Next  </BTN>
                        </Col>
                    </Row>
                ) : (null) */}


                <div className="table-custom">
                    {(this.state.selectedPolicy.length > 0 ? (<Col md="3">
                        <div className="policy-box" style={{ minHeight: '57px' }}>
                            <p> Stage </p>
                            <div className="pl-inner">
                                <Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="stage" id="stage" value={this.state.stage} onChange={(e) => this.savePolicyStage(e.target.value)}>
                                    <option value=''>Select</option>
                                    {
                                        this.state.stageFilterList.map((ct, i) => {
                                            if (this.state.stageFilter == ct.StringMapKey) {
                                                return null
                                            } else {
                                                return (<option value={ct.StringMapKey}>{ct.StringMapKey}</option>)
                                            }

                                        })
                                    }
                                </Input>
                            </div>
                        </div>
                    </Col>) : (null))}
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.arr}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        selection={this.state.selectedPolicy}
                        onSelectionChange={e => this.setSelectedPolicy(e.value)}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.arr.length}
                        exportFilename="Policy List"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true}
                        scrollHeight="340px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                    >
                        <Column selectionMode="multiple" style={{ width: '3em' }} />
                        {columns}
                    </DataTable>
                </div>

                {/* Confirmation Popup On Stage Change */}
                <Modal isOpen={this.state.toggleStageChangeModal} toggle={() => this.toggleStageChange('stageChange')}
                    className={'modal-mg modal-primary'}>
                    <ModalHeader toggle={() => this.toggleStageChange('stageChange')}>Change Stage Confirmation</ModalHeader>
                    <ModalBody>
                        <Col>
                            <Row>
                                <Col md="8">
                                    <label>Changing Stage To <span>{this.state.stage}</span></label>
                                </Col>
                            </Row>
                            {(this.state.stage == 'Referred') ?
                                (<Row>
                                    <Col md="8">
                                        <div className="input-box">
                                            <label> Referred To *</label>
                                            <div className="pl-inner">
                                                <Input type="select" name="referredTo" id="referredTo" onChange={(e) => this.selectType(e.target.value, 'referredTo')} value={this.state.referredTo}>
                                                    <option value=''>Select</option>
                                                    {
                                                        this.state.referrList.map((ct, i) => {
                                                            return (<option value={ct.EntityId}>{ct.Forename}</option>)
                                                        })
                                                    }
                                                </Input>
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

                <Modal isOpen={this.state.openNotePopup} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.setState({ openNotePopup: false })}> Notes </ModalHeader>

                    <ModalBody>
                        <Card className="mb-0">
                            <CardHeader id="headingOne">
                                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ addNoteCollapse: !this.state.addNoteCollapse })} aria-expanded={this.state.addNoteCollapse} aria-controls="collapseOne">
                                    <h5 className="m-0 p-0"> AddNotes <i style={{ float: "right" }} className={this.state.addNoteCollapse ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i> </h5>
                                </BTN>
                            </CardHeader>

                            <Collapse isOpen={this.state.addNoteCollapse} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <form onSubmit={this.handleSubmit} style={{ padding: 10 }}>
                                    <Row>
                                        <Col md="6">
                                            <div className="input-box with-icon">
                                                <label>{t("contactNotes:NotesType.label")}*</label>
                                                <Input type="select" name="notesType" id="notesType" onChange={(e) => this.selectNoteType(e.target.value, 'notesType')} value={this.state.notesType}>
                                                    <option value=''>{t("contactNotes:NotesType.placeholder")}</option>
                                                    {this.state.noteType.map((ct, i) => {
                                                        return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback">{t("contactNotes:NotesType.error_blank")}</em>
                                                <a title={t("contactNotes:ImportantNotes")} href="javascript:void(0)" onClick={() => this.Important()} style={{ color: this.state.isImportant === 0 ? '#aaaaaa' : '#ff0000', fontSize: 25 }}><i class="fa fa-exclamation-circle" aria-hidden="true"></i></a>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <div className="input-box">
                                                <label>{t("contactNotes:Notes.label")}*</label>
                                                <Input type="textarea" name="notesdescription" id="notesdescription" placeholder={t("contactNotes:Notes.placeholder")} value={this.state.notesdescription} onChange={e => this.handleChangeNote(e)} autoResize={true} />
                                                <em className="error invalid-feedback">{t("contactNotes:Notes.error_blank")}</em>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="text-center">
                                        <Col>
                                            {(this.state.isNoteEdit) ?
                                                (
                                                    <div className="pull-right">
                                                        <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Update</BTN>{' '}
                                                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                    </div>
                                                ) : (
                                                    <div className="pull-right">
                                                        <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                                                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                    </div>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                </form>
                            </Collapse>
                        </Card>

                        <div className="added-note-outer">
                            <h4>{this.state.policyNoteList.length} notes</h4>
                            <ul>
                                {
                                    this.state.policyNoteList.map((notes, i) => {
                                        return (
                                            <li>
                                                <div className="addednote-left">
                                                    <span style={{ color: notes.IsFlag.data[0] === 0 ? '#aaaaaa' : '#ff0000' }}><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>
                                                    <h3>{notes.NoteType}</h3>
                                                    <p>
                                                        <ShowMoreText
                                                            lines={2}
                                                            more='Show more'
                                                            less='Show less'
                                                            anchorClass=''
                                                            onClick={this.executeOnClick}
                                                            expanded={false}>
                                                            {notes.NoteText}
                                                        </ShowMoreText>
                                                    </p>
                                                    <Row>
                                                        <Col md='6'>
                                                            <p>Added By</p>
                                                            <span className="date" style={{ marginRight: 10 }}><i class="fa fa-user" aria-hidden="true"></i> {notes.CreatedByName}</span>
                                                            <span className="date"><i class="fa fa-calendar" aria-hidden="true"></i> {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}</span>
                                                        </Col>
                                                        {(notes.UpdatedByName != null) ? (
                                                            <Col md='6'>
                                                                <p>Updated By</p>
                                                                <span className="date" style={{ marginRight: 10 }}><i class="fa fa-user" aria-hidden="true"></i> {notes.UpdatedByName}</span>
                                                                <span className="date"><i class="fa fa-calendar" aria-hidden="true"></i> {moment(notes.UpdatedOn).format(CommonConfig.dateFormat.dateTime)}</span>
                                                            </Col>
                                                        ) : (null)}
                                                    </Row>
                                                </div>

                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

export default withTranslation()(SearchPolicy);
