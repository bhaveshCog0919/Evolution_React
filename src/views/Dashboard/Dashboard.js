import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalHeader, ModalBody, Col, CardBody, Form, Row, Button as BTN, UncontrolledTooltip, Card, CardHeader, Collapse, Input } from 'reactstrap';
import { CommonConfig } from '../../utils/constants';
import api from '../../utils/apiClient';
import moment from 'moment';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';
import { withTranslation } from 'react-i18next';
import ShowMoreText from 'react-show-more-text';

class Dashboard extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 0 },
            { body: this.formatPolicyDetail.bind(this), field: "PolicyData", header: "Policy No/Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { body: this.formatContactDetail.bind(this), field: "ClientDetails", header: "Client/Contacts", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.formatVesselData.bind(this), field: "VesselDetails", header: "Vessel", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "InsuranceCompanyName", header: "Insurer", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { body: this.formatPremiun.bind(this),field:"PremiumDetails", header: "SI/Premium", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.formatDate.bind(this), field: "RenewalDate", header: "Renewal", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { body: this.departmentData.bind(this), field: "DepartmentDetails", header: "Department", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { body: this.formatStage.bind(this),field: "StageReferredData", header: "Stage/Referred To", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "HandlerPerson", header: "Handler", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            policyStage: this.props.match.params.mode,
            policyCount: 0,
            policyList: [],
            first: 1,
            rows: 10,
            StageCountData: [],
            openNotePopup: false,
            addNoteCollapse: false,
            policyNoteList: [],
            noteType: [],
            NavID: null,
            TeamType: CommonConfig.loggedInUserData().SecurityGroupName,
            isImportant: 0,
            notesType: '',
            notesdescription: '',
            NotesTypeError: true,
            notesdescriptionError: true,
            addNoteCollapse: false,
            CurrentUserid: CommonConfig.loggedInUserData().EntityId,

            policyTypeArray: [],
            policyType: 'Vessel',
            monthArray: [],
            policyMonth: moment().format('M'),
            policyMonthError: false,
            yearArray: [],
            policyYear: moment().format('YYYY'),
            policyYearError: false,
            isMonthYear: true,
            policyFrom: '',
            policyFromError: false,
            policyTo: '',
            policyToError: false,
            ReasonArray: [],
            ResponseTypeArray: [],
            showReasonDD: false,
            responseType: '',
            responseTypeError:false,
            reasonTypeError:false,
            reasonType: '',
            DateTime: '',
            reasonsShow: false,
            contactMode:'',
            contactModeError: false,
            contactModeList:[],
            // renewalMonth:'',
            renewalMonthList:[],
            renewalMonthError: false,
            notesInceptionDate: '',
            notesInceptionDate1:'',
            isEditRenewalMonth: false,
            isEditDate: false,
            InceptionDate:'',
            currentPolicyId:'',
            rowInceptiondate:'',
            BusinessTypeList:[],
            businessType:'New Business',
            meOrAll:  CommonConfig.loggedInUserData().SecurityGroupName == 'New Business'  ? 'Me' : 'All',

            meOrAllList:[
                { label : 'Me' , value: 'Me'},
                { label : 'All' , value: 'All'}
            ],

            SecurityGroupList: [
                { label: 'New Business', value: 'New Business' },
                { label: 'Renewal', value: 'Renewal' },
                { label: 'Underwriting', value: 'Underwriting' },
            ],
            SecurityGroupName: '',
            language: 'All',
            languageList:[],
            languageError: false,
            isSubAgent: false,
        };

        this.colOptions = [];

        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onPage = this.onPage.bind(this);
    }

    changePolicyDateView() {
        this.setState({ isMonthYear: !this.state.isMonthYear });
    }

    getPolicyStageCount(policyCount, policyData) {
        let data = {
            TeamType: CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting' ? (this.state.TeamType ? this.state.TeamType : CommonConfig.loggedInUserData().SecurityGroupName) : CommonConfig.loggedInUserData().SecurityGroupName,
            PolicyType: this.state.policyType,
            PolicyMonth: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyMonth) ? '' : this.state.policyMonth) : '',
            PolicyYear: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyYear) ? '' : this.state.policyYear) : '',
            PolicyFrom: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyFrom) ? '' : this.state.policyFrom : '',
            PolicyTo: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyTo) ? '' : this.state.policyTo : '',
            PolicyLanguage: this.state.language,
            IsSubAgent: this.state.isSubAgent ? 1 : 0,
            MeOrAll: this.state.meOrAll,
            CurrentUser: CommonConfig.loggedInUserData().EntityId,
            BusinessType: CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting' ? this.state.businessType :'',

        }
        api.post('api/getPolicyStageCount', data).then(res => {
            if (res.success) {
                console.log("getPolicyStageCount", res.data);

                if (policyCount == "update") {
                    this.setState({ StageCountData: res.data, policyStage: policyData });
                } else {
                    this.setState({ StageCountData: res.data, policyStage: this.props.match.params.mode == undefined ? res.data[0].StringMapKey : this.props.match.params.mode });
                }

                //toDo: Count and Data
                //this.getPolicyList(this.props.match.params.mode == undefined ? res.data[0] : { 'StringMapKey': this.props.match.params.mode });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    componentDidMount() {
        var data = {
            Count: 0,
            StringMapKey: "",
        };
        if(CommonConfig.loggedInUserData().SecurityGroupName == 'Renewal'){
            data.StringMapKey = 'Review';
        }
        else if(CommonConfig.loggedInUserData().SecurityGroupName == 'New Business'){
            data.StringMapKey = 'Lead';
        }
        else if(CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting'){
            data.StringMapKey = 'New Business';
            this.setState({SecurityGroupName: "Underwriting"});
        }
        this.getPolicyList(data);
        this.getPolicyStageCount('', '');
        this.getNotesType();
        this.getLanguageList();
        this.getDropDownValues('POLICYTYPE', 'policyTypeArray');
        this.getDropDownValues('POLICYBUSINESSTYPE', 'BusinessTypeList');
        this.getDropDownValues('MONTH', 'renewalMonthList',);
        this.getDropDownValues('CONTACTMODE', 'contactModeList');
        // this.getDropDownValues('FOLLOWUPREASON', 'ReasonArray');
        this.getDropDownValues('FOLLOWUPRESPONSE', 'ResponseTypeArray');

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
    }

    getDropDownValues(stringMapType, setStateName) {
        try {
            let data = {
                stringmaptype: stringMapType,
                orderby: 'sortorder'
            };
            if (stringMapType == "MONTH"){
                 data = {
                    stringmaptype: stringMapType,
                    orderby: 'StringMapKey'
                };  
            }
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

    async getDropDownReasonValues(response, setStateName) {
        try {
            const data = {
                StingMapKey: response,
            };
            await api.post(APIConstant.path.dropdownbycodeforreason, data).then(res => {
                if (res.success) {
                    console.log("ressssssssssssss/....", res)
                    this.setState({ ReasonArray: res.data[0] });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("error...", error);
        }
    }

    onPage(event) {
        let firstPage = event.first + 1;
        let l = event.rows * (event.page + 1);
        let lastPage = (l < this.state.policyList.length) ? l : this.state.policyList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.policyList.length + ' records';
        this.setState({ selectedPage: event.first, str: str, rowsPerPage: event.rows });
    }


    getPolicyList(stageData) {
        this.state.policyList = []
        let PolicyStage = stageData.StringMapKey;
        let data = {
            PolicyStage: stageData.StringMapKey,
            TeamType: CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting' ? this.state.TeamType : CommonConfig.loggedInUserData().SecurityGroupName,
            CurrentUser: CommonConfig.loggedInUserData().EntityId,
            pPageIndex: this.state.first,
            pRowsPerPage: 10000,
            policyType: this.state.policyType,
            PolicyMonth: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyMonth) ? '' : this.state.policyMonth) : '',
            PolicyYear: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyYear) ? '' : this.state.policyYear) : '',
            PolicyFrom: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyFrom) ? '' : this.state.policyFrom : '',
            PolicyTo: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyTo) ? '' : this.state.policyTo : '',
            PolicyLanguage: this.state.language,
            IsSubAgent:this.state.isSubAgent ? 1 : 0 ,
            MeOrAll: this.state.meOrAll,
            BusinessType: (stageData.StringMapKey == undefined) ? '' : stageData.StringMapKey,
        }
        this.setState({savedData: data});
        api.post('api/getPolicyListByStage', data).then(res => {
            console.log("getPolicyListByStage", res.data);
            if (res.success) {
              console.log("res....", res)
                // this.getPolicyStageCount({ TeamType: CommonConfig.loggedInUserData().SecurityGroupName,
                //     PolicyType: this.state.policyType,
                //     PolicyMonth: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyMonth) ? '' : this.state.policyMonth) : '',
                //     PolicyYear: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyYear) ? '' : this.state.policyYear) : '',
                //     PolicyFrom: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyFrom) ? '' : this.state.policyFrom : '',
                //     PolicyTo: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyTo) ? '' : this.state.policyTo : ''});
                let firstPage = (res.data.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < res.data.length) ? this.state.rowsPerPage : res.data.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + res.data.length + ' records';
                this.setState({ policyList: res.data, str: str, policyCount: stageData.Count, first: this.state.first, policyStage: PolicyStage });
                this.getPolicyStageCount('update', PolicyStage);
                // this.setState({policyStage: stageData.StringMapKey });



                // let CountData = {
                //     PolicyStage: stageData.StringMapKey,
                //     TeamType: CommonConfig.loggedInUserData().SecurityGroupName,
                //     PolicyType: this.state.policyType,
                //     PolicyMonth: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyMonth) ? '' : this.state.policyMonth) : '',
                //     PolicyYear: (this.state.isMonthYear) ? (CommonConfig.isEmpty(this.state.policyYear) ? '' : this.state.policyYear) : '',
                //     PolicyFrom: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyFrom) ? '' : this.state.policyFrom : '',
                //     PolicyTo: (!this.state.isMonthYear) ? CommonConfig.isEmpty(this.state.policyTo) ? '' : this.state.policyTo : ''
                // }
                // api.post('api/getPolicyStageCount', CountData).then(resCount => {
                //     if (resCount.success) {
                //         console.log("getPolicyStageCount", resCount.data);
                //         this.setState({ StageCountData: resCount.data, policyStage: this.props.match.params.mode == undefined ? resCount.data[0].StringMapKey : this.props.match.params.mode });                
                //     } else {
                //         console.log("Else");
                //     }
                // });
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    goToLeadPage(){
        this.props.history.push({
            pathname: '/Master/LeadManagement'    
      });
    }

    actionTemplate(rowData, column) {
        return <div className="policy-list-data">
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.edit(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            {
                this.getImageIcon(rowData)
            }
            {/* {rowData.LockedByPerson == "" ? null :
                <Button type ="button" icon="fas fa-lock"  
                    tooltip={"Locked By: " + rowData.LockedByPerson }  tooltipOptions={{ position: 'bottom' }} >
                </Button>
            }
            {(rowData.LockedByPerson != "" && this.state.SecurityGroupName == 'Underwriting')?
                <Button type ="button" icon="fas fa-lock"  onClick={() => this.releaseLock(rowData)} 
                    tooltip={"Unlock Policy" }  tooltipOptions={{ position: 'bottom' }} >
                </Button>
                : null
            } */}
        </div>;
    }

    edit(rowData) {

        window.open( window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1','_blank');     
                    
        // this.setLock(rowData);
        // window.open( window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1','_blank');
    }

    // openLock(rowData){
    //     if(rowData.LockedByPersonId == this.state.CurrentUserid ){
    //         this.releaseLock(rowData);
    //     }else{
    //         toast.warn("Only " +rowData.LcokedByPerson +" can unlock this Policy");
    //     }
        
    //     console.log("lock realeased.....")
    // }

    async setLock(rowData){
        let data = {
            'PolicyId' : rowData.PolicyId
        };
        
       await api.post('api/setLock', data).then(res => {
            if (res.success) {
                if(res.data[0].returnValue == ''){
                    console.log("notes......",res.data)
                    window.open( window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1','_blank');
                }else{
                    alert(res.data[0].retunValue);
                }
            } else {
                toast.warn("Something went Wrong.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });

    }

    getLanguageList() {
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
                    this.setState({ languageList: formattedLanguage });
                } else {
                }
            }).catch(err => {
                console.log('error in languagelist',err)
            });
        } catch (err) {
            console.log('error in languagelist',err)
        }
    }


    getImageIcon(rowData){
        var linkType= '';
        if(rowData.LockedByPerson ==''){
            linkType= 'NoLock';
        }else{
            if(rowData.IsCurrentUserUW == 0 && rowData.IsSelfLocked ==1){
                linkType= 'NormalSelfLock';
            }else if(rowData.IsCurrentUserUW == 1 && rowData.IsSelfLocked ==1){
                linkType= 'UWSelfLock';
            }else if(rowData.IsCurrentUserUW == 0 && rowData.IsSelfLocked ==0){
                linkType= 'NormalOtherLock';
            }else if(rowData.IsCurrentUserUW ==1 && rowData.IsSelfLocked ==0){
                linkType= 'UWOtherLock';
            }
        }
        console.log('linkType',linkType)
        
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


    async releaseLock(rowData){
        let data = {
            'PolicyId' : rowData.PolicyId,
             'ReleaseAll': 0
        };
        
         await api.post('api/releaseLock', data).then( async res => {
            if (res.success) {
                if(res.data[0][0].returnValue==''){
                    setTimeout(async() => {
                       await this.reloadSearchResult({'StringMapKey': this.state.policyStage, 'Count': this.state.policyCount }, rowData)
                    }, 100);  
                    
                }else{
                    toast.warn(res.data[0][0].returnValue);
                }
            } else {
                toast.error("SomeThing went wrong.");
            }
        }).catch(err => {
            console.log("setLock err", err);
        });

    }

    reloadSearchResult(stageData , rowData){
        let data = this.state.savedData
        let PolicyStage = stageData.StringMapKey;
        api.post('api/getPolicyListByStage', data).then(res => {
            console.log("getPolicyListByStage", res.data);
            if (res.success) {

                let firstPage = (res.data.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < res.data.length) ? this.state.rowsPerPage : res.data.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + res.data.length + ' records';
                this.setState({ policyList: res.data, str: str, policyCount: stageData.Count, first: this.state.first, policyStage: PolicyStage });
                this.getPolicyStageCount('update', PolicyStage);
                toast.success("Policy "+rowData.PolicyNumber+ " unlocked Successfully");
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    formatStage(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.Stage}</p>
                <p>{rowData.ReferredToPerson}</p>
                <span>
                    <i onClick={() => this.getNoteList(rowData)} style={{ fontSize: '25px', cursor: 'pointer' }} className="pi pi-comment" href="#" id={"CommentTooltip" + rowData.PolicyId}></i>
                    <UncontrolledTooltip placement="bottom" target={"CommentTooltip" + rowData.PolicyId}>
                        {CommonConfig.isEmpty(rowData.Note) ? rowData.Stage : rowData.Note}
                    </UncontrolledTooltip>
                </span>
            </div>
        )
    }

    departmentData(rowData){
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
                <p>{rowData.NAME}</p>
                {(rowData.AreaCode != undefined && rowData.AreaCode != null && rowData.AreaCode != '')?
                <p>{rowData.CountryCode+' '+rowData.AreaCode+' '+rowData.PhoneNumber}</p>
                : <p>{rowData.CountryCode+' '+rowData.PhoneNumber}</p> }
                {/* <p>{CommonConfig.formatPhoneNumber(rowData.CountryCode + rowData.PhoneNumber)}</p> */}
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
                <p>
                    {rowData.PremiumDetails}
                </p>
        {/* <p>{rowData.CurrentPremium} - {rowData.RenewalPremium} ( {rowData.PreiumDifferencePercentage}% )</p> */}
                {/* <p>{rowData.PreiumDifference}</p> */}
            </div>
        )
    }

    formatDate(rowData) {
        return (
            <div className="policy-list-data">
                {/* <p>{moment(rowData.InceptionDate).format(CommonConfig.dateFormat.dateOnly)}</p> */}
                {/* <p>{moment(rowData.RenewalDate).format(CommonConfig.dateFormat.dateOnly)}</p> */}
                <p>{rowData.RenewalDate}</p>
            </div>
        )
    }


    getNoteList(rowData) {
        // let date =moment(rowData.InceptionDate).getMonth();
        var t ='';
        if(rowData.InceptionDate != undefined || rowData.InceptionDate != null){
            t = new Date(rowData.InceptionDate);
            this.setState({rowInceptiondate: rowData.InceptionDate,
                notesInceptionDate: moment(rowData.InceptionDate).format('DD-MM-YYYY'),
                notesInceptionDate1: moment(rowData.InceptionDate).format('YYYY-MM-DD'),
                InceptionDate: rowData.InceptionDate });
        }else{
            t = new Date(this.state.rowInceptiondate);
        }

        
        var renewalMonth = "";
        if(t.getMonth() + 1 < 10){
            renewalMonth = "0"+ (t.getMonth() + 1);  
        }  
        else{
            renewalMonth = (t.getMonth() + 1);
        } 
        let renewalValue = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
        let finalRenewalDate = {
            value : renewalMonth,
            label : renewalValue[0].StringMapName
        }
    
        this.setState({ NavID: null  , renewalMonth: finalRenewalDate, currentPolicyId: rowData.PolicyId});

        const data = {
            'entityId': rowData.PolicyId,
            'entityType': 'Policy',
            'CurrentUser': CommonConfig.loggedInUserData().EntityId
        };

        // if (CommonConfig.loggedInUserData().SecurityGroupName == "New Business") {
            api.post('api/getNewBusineesNotes', data).then(res => {
                if (res.success) {
                    console.log(" new business notes......", res.data)
                    this.setState({ policyNoteList: res.data, openNotePopup: true, NavID: rowData.PolicyId });
                } else {
                    toast.warn("No notes found for Policy.");
                }
            }).catch(err => {
                console.log("getNoteList err", err);
            });
        // } else {
        //     api.post('api/getNotes', data).then(res => {
        //         if (res.success) {
        //             console.log("notes......", res.data)
        //             this.setState({ policyNoteList: res.data, openNotePopup: true, NavID: rowData.PolicyId });
        //         } else {
        //             toast.warn("No notes found for Policy.");
        //         }
        //     }).catch(err => {
        //         console.log("getNoteList err", err);
        //     });
        // }
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

    onSubAgentChange(val){
        this.setState({isSubAgent: val});
    }


    selectType(value, type) {
        if (type === 'notesType') {
            if (value === '' || value === null) {
                this.setState({ NotesTypeError: true, notesType: value });
                this.show('notesType', true);
            } else {
                this.setState({ NotesTypeError: false, notesType: value.value });
                this.show('notesType', false);
            }
        }

        if (type === 'BusinessType') {
           if (value === '' || value === null) {
                this.setState({ businessType: value });
            } else {
                this.setState({ businessType: value.value});

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

        
        if (type === 'language') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ language: '' });
            } else {
                this.setState({ language: value.value });
            }
        }

        if (type === 'meOrAll') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ meOrAll: '' });
            } else {
                this.setState({ meOrAll: value.value });
            }
        }

        if (type === 'responseType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ responseType: '', responseTypeError: true ,showReasonDD: false });
                this.show('responseType', true ,"responseTypeError", "Please select Response")
            } else {
                this.getDropDownReasonValues(value.value, 'ReasonArray')
                this.setState({ responseType: value.value , responseTypeError:false});
                this.show('responseType', false ,"responseTypeError", "")

                // this.getDropDownReasonValues(value.value, 'ReasonArray')
                // if(this.state.ReasonArray){
                if (value.value == "Not Interested" || value.value == "Lost" || value.value == "Purge"|| value.value == "Abandoned" ){
                    this.setState({showReasonDD: true});
                }else{
                    this.setState({showReasonDD: false});
                }
            }
        }
        
        if (type === 'reasonType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ reasonType: '', reasonTypeError: true });
                this.show('reasonType', true ,"reasonTypeError", "Please select Reason")
            } else {
                this.setState({ reasonType: value.value ,reasonTypeError:false});
                this.show('reasonType', false ,"reasonTypeError", "");
            }
        }

        if (type === 'contactMode') {
            if (value.value == '' || value.value == undefined || value.value == null) {
                this.setState({ contactMode: '', contactModeError: true });
                this.show('contactMode', true, "contactModeError", "Please select Contact mode");
            } else {
                this.setState({ contactMode: value.value, contactModeError: false });
                this.show('contactMode', false, "contactModeError", "");
            }
        }

        if (type === 'renewalMonth') {
            if (value.value == '' || value.value == undefined || value.value == null) {
                this.setState({ renewalMonth: '', renewalMonthError:true });
                this.show('renewalMonth', true, "renewalMonthError", "Please select Renewal month");
            } else {
                var date = new Date();
                // let currentMonth = date.getMonth() + 1;
                // var firstDay;
                // let inceptionDate = new Date(moment(this.state.notesInceptionDate).format("DD-MM-YYYY"));
                // let inceptionMonth = inceptionDate.getMonth() + 1 ;
                // let inceptionfirstDay = new Date(inceptionDate.getFullYear(), Number(value.value) - 1, 1);
                var ShowMonth = value.value;
                 console.log(ShowMonth);

                var curmonth = new Date().getMonth() + 1;
                console.log(curmonth);
                if (ShowMonth < curmonth)
        
                    var curyear = new Date().getFullYear() + 1;
                else
                    var curyear = new Date().getFullYear();
                console.log("curyear", curyear);
        
                var inceptionDate = moment([parseInt(curyear), parseInt(value.value) - 1]).format('DD-MM-YYYY');
                var inceptionDate1 = moment([parseInt(curyear), parseInt(value.value) - 1]).format('YYYY-MM-DD');
                // if(currentMonth > Number(value.value)){
                //     firstDay = new Date(date.getFullYear() + 1, Number(value.value) - 1, 1);
                // }
                // else{
                //     firstDay = new Date(date.getFullYear(), Number(value.value) - 1, 1);
                // }

                // if((Number(value.value) > inceptionMonth)){
                //     firstDay = new Date(inceptionDate.getFullYear(), Number(value.value) - 1, 1);
                //     console.log("in if",moment(firstDay).format('DD-MM-YYYY'));
                // }
                // else{
                //     firstDay = new Date(inceptionDate.getFullYear() + 1, Number(value.value) - 1, 1);
                //     console.log("in else",moment(firstDay).format('DD-MM-YYYY'));
                // }
                this.setState({ renewalMonth: value.value, renewalMonthError:true , notesInceptionDate: inceptionDate,notesInceptionDate1: inceptionDate1});
                this.show('renewalMonth', false, "renewalMonthError", "");

            }
        }

        if (type === 'TeamType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ TeamType: '' });
            } else {
                this.setState({ TeamType: value.value });
                var data = {
                    Count: 0,
                    StringMapKey: "",
                }
                if(value.value == 'Renewal'){
                    data.StringMapKey = 'Review';
                }
                else if(value.value == 'New Business'){
                    data.StringMapKey = 'Lead';
                }
                else if(value.value == 'Underwriting'){
                    data.StringMapKey = 'New Business';
                }
                setTimeout(() => {
                this.getPolicyList(data);
                // this.getPolicyStageCount('', '');
                this.getNotesType();
                this.getDropDownValues('POLICYTYPE', 'policyTypeArray');
                // this.getDropDownValues('FOLLOWUPREASON', 'ReasonArray');
                this.getDropDownValues('FOLLOWUPRESPONSE', 'ResponseTypeArray');  
                }, 100);

            }
        }
    }

    editDate(task) {
        if (task == "view") {
            this.setState({ isEditDate: false });
        } else {
            this.setState({ isEditDate: true });
        }
    }

    editRenewalMonth(task){
        if(task == 'view'){
            this.setState({ isEditRenewalMonth : false});
        } else {
            this.setState({ isEditRenewalMonth: true });
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

    resetNewBusiness = () => {
        var t = new Date(this.state.rowInceptiondate);
        
        var renewalMonth = "";
        if(t.getMonth() + 1 < 10){
            renewalMonth = "0"+ (t.getMonth() + 1);  
        }  
        else{
            renewalMonth = (t.getMonth() + 1);
        } 
        let renewalValue = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
        let finalRenewalDate = {
            value : renewalMonth,
            label : renewalValue[0].StringMapName
        }
        this.setState({
            notesdescription: '', notesdescriptionError: true,
            responseType: '',
            notesInceptionDate: moment(this.state.InceptionDate).format('DD-MM-YYYY'),
            notesInceptionDate1: moment(this.state.inceptionDate).format('YYYY-MM-DD'),
            reasonType: '',
            DateTime: '',
            renewalMonth: finalRenewalDate,
            contactMode:'',
            isImportant: 0,
            isEditDate: false,
            isEditRenewalMonth: false,

        });

        this.show("notesdescription", false);

        this.setState({ addNoteCollapse: false });
    }

    saveNotesNewBusiness = () => {
        if (this.state.notesdescriptionError === false) {
            if (this.state.responseType == "") {
                toast.error('Please Select Response Type');
                return
            }

            if (this.state.responseType == "Not Interested") {
                if (this.state.reasonType == "") {
                    toast.error('Please Select Reason Type');
                    return
                }
            }

            if (this.state.contactMode == "") {
                toast.error('Please Select Contact mode');
                return
            }
            
            if (this.state.renewalMonth == "") {
                toast.error('Please Select Renewal Month');
                return
            }
            var data = {
                'EntityType': 'Policy',
                'EntityId': this.state.NavID,
                'PolicyId': this.state.NavID,
                'isflag': this.state.isImportant,
                'Response': this.state.responseType,
                'Reason': this.state.reasonType,
                'NoteText': this.state.notesdescription.trim(),
                'FollowUpDateTime': this.state.DateTime,
                // 'RenewalMonth': this.state.renewalMonth,
                'InceptionDate': this.state.notesInceptionDate1,
                'ContactMode': this.state.contactMode,
                'CurrentUser': CommonConfig.loggedInUserData().EntityId
            }
            console.log("dataaaaaa..........",data)
            api.post('api/saveFollowUpNote', data).then(res => {
                console.log("dataaaaaa..........",res)

                if (res.data.success) {
                    this.resetNewBusiness();
                    toast.success('Follow-Up note added successfully');
                    this.getNoteList({ PolicyId: this.state.currentPolicyId });
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
            });
        } else {
            if(this.state.responseType ==''){
                this.show("responseType", true, "responseTypeError" , "Please Select Response" )
            }
            if(this.state.contactMode ==''){
                this.show("contactMode", true, "contactModeError" , "Please Select Contact mode" )
            }
            if(this.state.renewalMonth ==''){
                this.show("renewalMonth", true, "renewalMonthError" , "Please Select Renewal month" )
            }
            this.show("notesType", this.state.NotesTypeError);
            this.show("notesdescription", this.state.notesdescriptionError);
        }
    }

    // show(field, condition) {
    //     if (condition) {
    //         document.getElementById(field).className = "form-control is-invalid";
    //     } else {
    //         document.getElementById(field).className = "form-control";
    //     }
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

    handleChange = (e) => {
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
        if(e.target.name === 'inceptionDate'){
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ inceptionDateError: true });
                this.show("inceptionDate", true, "inceptionDateError", "Please enter Inception Date");
            }else {  
                var t = new Date(e.target.value);
                var renewalMonth = "";
                if(t.getMonth() + 1 < 10){
                    renewalMonth = "0"+ (t.getMonth() + 1);  
                }  
                else{
                    renewalMonth = (t.getMonth() + 1);
                } 
                let data = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
                var inceptionDate = moment(e.target.value).format('DD-MM-YYYY');                
                console.log("data.......",e.target.value);
                let finalRenewalDate = {
                    value : renewalMonth,
                    label : data[0].StringMapName
                }
                this.setState({ notesInceptionDate: inceptionDate ,notesInceptionDate1: e.target.value, inceptionDateError: false ,renewalMonth: finalRenewalDate });
                this.show('inceptionDate', false , "inceptionDateError", "");
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
        const { t, i18n } = this.props;

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode}/>;
        });

        if (this.props.isIdleTimeOut) {
            this.props.history.push('/')
        }

        return (
            <div className="animated fadeIn">
                <div className="table-custom">
                    <Row>
                        <Col md='2'>
                            <h4>{this.state.policyStage} </h4>
                            {/* <h4>{this.state.policyStage} ({this.state.policyCount})</h4> */}
                        </Col>
                        {CommonConfig.loggedInUserData().SecurityGroupName == 'Underwriting' ? <Col md='2'>
                            <label>Select Dashboard</label>
                            <Input type="select" name="TeamType" id="TeamType" value={this.state.TeamType} onChange={(e) => this.selectType(e.target, 'TeamType')}>
                                <option value="">Select Team Type</option>
                                {this.state.SecurityGroupList.map((item, i) => {
                                    return (<option value={item.value} key={i}>{item.label}</option>)
                                })
                                }
                            </Input>
                        </Col> : null}
                        <Col md='10' style={{ textAlign: "right" }}>
                            {this.state.StageCountData.map((ct, i) => {
                                return (<div className={this.state.policyStage == ct.StringMapKey ? "dashbordSelectorSelect" : ''} style={{ display: 'inline-block', marginRight: 7, textDecoration: "underline", cursor: "pointer", fontSize: '15px' }} onClick={() => this.getPolicyList(ct)}>{ct.StringMapKey}({ct.Count})</div>)
                            })}
                        </Col>
                    </Row>
                    <Row>

                        <CardBody>
                            <Form onSubmit={e => e.preventDefault()}>
                                <div>
                                    <Row>
                                        <Col md="2">
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
                                        {this.state.TeamType == 'Underwriting' ? null :
                                        <Col md="5">
    
                                            <Row>
                                                {(this.state.isMonthYear) ? (
                                                    <Col md="4">
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
                                                        <Col md="4">
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
                                                    <Col md="4">
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
                                                        <Col md="4">
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

                                                <Col md="4" style={{ alignSelf: 'center' }}>
                                                    {(this.state.isMonthYear) ? (
                                                        <label style={{ textDecoration: 'underline' }} onClick={() => this.changePolicyDateView()}>Change to Date Range</label>
                                                    ) : (
                                                            <label style={{ textDecoration: 'underline' }} onClick={() => this.changePolicyDateView()}>Change to Month/Year</label>
                                                        )}
                                                </Col>
                                            </Row>
                                        {/* } */}
                                        </Col>
                                    
                                        }
                                        <Col md="1">
                                            <div className="input-box">
                                                <label>Language</label>
                                                <Input type="select" name="language" id="language" value={this.state.language} onChange={(e) => this.selectType(e.target, 'language')}>
                                                    <option value="All">All</option>
                                                    {this.state.languageList.map((x) => {
                                                        return (<option value={x.value}>{x.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col md="1">
                                            <div className="input-box">
                                                <label>Me or All</label>
                                                <Input type="select" name="MeOrAll" id="MeOrAll" value={this.state.meOrAll} onChange={(e) => this.selectType(e.target, 'meOrAll')}>
                                                    {this.state.meOrAllList.map((x) => {
                                                        return (<option value={x.value}>{x.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col md="1">
                                            <div className='input-box'>
                                                <Row>
                                               <Col md="8" style={{ marginTop:"25px"}}>
                                                <label>Sub Agent</label></Col>
                                                <Col md='4'  style={{ marginTop:"25px"}}>
                                                <Input type="checkbox" name="isSubAgent" id="isSubAgent" checked={this.state.isSubAgent} onChange={() => this.onSubAgentChange(!this.state.isSubAgent)} value={this.state.isSubAgent} />
                                                </Col>

                                                </Row>
                                            </div>
                                        </Col>
                                        <Col md="2" className="text-left" style={{ alignSelf: 'center' }}>
                                            <BTN type="submit" color="success" title="Go" style={{ marginRight: '5px' }} onClick={() => this.getPolicyList({ 'StringMapKey': this.state.policyStage, 'Count': this.state.policyCount })}> Go </BTN>

                                            {(this.state.policyStage == 'Lead' && CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ) ? 
                                                <BTN type="button" color="success" title="New Lead" onClick={() => this.goToLeadPage()}> New Lead </BTN>
                                                : null }
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col md="5">
                                            <div className="input-box">
                                                <label>Me or All</label>
                                                <Input type="select" name="MeOrAll" id="MeOrAll" value={this.state.meOrAll} onChange={(e) => this.selectType(e.target, 'meOrAll')}>
                                                    {this.state.meOrAllList.map((x) => {
                                                        return (<option value={x.value}>{x.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                            </div>
                                        </Col>
                                    </Row> */}
                                </div>
                            </Form>
                        </CardBody>
                    </Row>
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.policyList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.onPage(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.policyList.length}
                        exportFilename="StringMap List"
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="340px">
                        <Column selectionMode="multiple" style={{ width: '3em' }} />
                        {columns}
                    </DataTable>
                </div>

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
                                    {CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                                        (<>
                                        <Row>
                                            <Col md='4'>
                                                <label>Contact Mode</label>

                                                    <Input type="select" name ="contactMode" id="contactMode" onChange={(e) => this.selectType(e.target,'contactMode')} value={this.state.contactMode}>
                                                    <option value=''>Select</option>
                                                    {this.state.contactModeList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }
                                                    </Input>
                                                    <em id="contactModeError" className="error invalid-feedback"></em>

                                                {/* </div> */}
                                            </Col>
                                            {!this.state.isEditRenewalMonth ? 
                                            <Col md='4'>
                                                <label> Renewal Month : {CommonConfig.isEmpty(this.state.renewalMonth) !== true ? this.state.renewalMonth.label : this.state.renewalMonth}</label>
                                                <>
                                                    <BTN style={{ float: "right" }} color="primary"
                                                        onClick={this.state.isEditRenewalMonth ? () => this.editRenewalMonth("view") : () => this.editRenewalMonth("edit")}
                                                    >
                                                    <i className="fa fa-pencil"></i>
                                                        
                                                    </BTN>
                                                    </>
                                            </Col>
                                            :
                                            <Col md='4'>
                                                <>
                                                <label> Renewal Month :</label>

                                                    <Input type="select" name ="renewalMonth" id="renewalMonth" onChange={(e) => this.selectType(e.target,'renewalMonth')} value={this.state.renewalMonth.value}>
                                                    <option value=''>Select</option>
                                                    {this.state.renewalMonthList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }    
                                                    </Input>
                                                    <em id="renewalMonthError" className="error invalid-feedback"></em>
                                                {/* </div> */}
                                                </>
                                                 
                                            </Col>
                                            }
                                            {!this.state.isEditDate?
                                            <Col md='4'>
                                                <label>Inception date: {this.state.notesInceptionDate}</label>
                                                
                                                <BTN style={{ float: "right" }} color="primary"
                                                    onClick={this.state.isEditDate ? () => this.editDate("view") : () => this.editDate("edit")}
                                                >
                                                <i className="fa fa-pencil"></i>
                                                </BTN>
                                                
                                            </Col>
                                            :<Col md='4'>
                                                <label>Inception date: {this.state.notesInceptionDate}</label>
                                                <div>
                                                    <Input type='date' name="inceptionDate" id="inceptionDate"
                                                        placeholder="Inception Date"
                                                        style={{ width: '80%', display: "inline-block" }}
                                                        onChange={(e) => this.handleChange(e ,'inceptionDate')}
                                                        value={this.state.notesInceptionDate1}
                                                    />
                                                    <em id="iceptionDateError" className="error invalid-feedback"></em>
                                                </div>

                                                {/* <label>Inception date: </label>
                                                <Input type="date" id="inceptionDate" name="inceptionDate"
                                                        value={moment(this.state.notesInceptionDate).format('DD-MM-YYYY')}
                                                        onChange={(e) => this.handleChange(e, 'inceptionDate')}
                                                >
                                                </Input>
                                                <em id="iceptionDateError" className="error invalid-feedback"></em> */}
                                            </Col>
                                            }
                                        </Row>
                                        <Row>
                                            <Col md="3">
                                                <div className="input-box with-icon">
                                                    <label>Response*</label>
                                                    <Input type="select" name="responseType" id="responseType" onChange={(e) => this.selectType(e.target, 'responseType')} value={this.state.responseType}>
                                                        <option value=''>Select</option>
                                                        {this.state.ResponseTypeArray.map((ct, i) => {
                                                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="responseTypeError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            {this.state.showReasonDD ?
                                                (<Col md="6">
                                                    <div className="input-box with-icon">
                                                        <label>Reason</label>
                                                        <Input type="select" name="reasonType" id="reasonType" onChange={(e) => this.selectType(e.target, 'reasonType')} value={this.state.reasonType}>
                                                            <option value=''>Select</option>
                                                            {this.state.ReasonArray.map((ct, i) => {
                                                                return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                    </div>
                                                </Col>) : (null)}
                                        </Row>
                                        </>) 
                                    : (null)}
                                    <Row>
                                        <Col md="6">
                                            {CommonConfig.loggedInUserData().SecurityGroupName != "New Business" ?
                                                (<div className="input-box with-icon">
                                                    <label>{t("contactNotes:NotesType.label")}*</label>
                                                    <Input type="select" name="notesType" id="notesType" onChange={(e) => this.selectType(e.target, 'notesType')} value={this.state.notesType}>
                                                        <option value=''>{t("contactNotes:NotesType.placeholder")}</option>
                                                        {this.state.noteType.map((ct, i) => {
                                                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em className="error invalid-feedback">{t("contactNotes:NotesType.error_blank")}</em>
                                                </div>) : (null)}
                                            <a title={t("contactNotes:ImportantNotes")} href="javascript:void(0)" onClick={() => this.Important()} style={{ color: this.state.isImportant === 0 ? '#aaaaaa' : '#ff0000', fontSize: 25 }}><i class="fa fa-exclamation-circle" aria-hidden="true"></i></a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <div className="input-box">
                                                <label>{t("contactNotes:Notes.label")}*</label>
                                                <Input type="textarea" name="notesdescription" id="notesdescription" placeholder={t("contactNotes:Notes.placeholder")} value={this.state.notesdescription} onChange={e => this.handleChange(e)} autoResize={true} />
                                                <em className="error invalid-feedback">{t("contactNotes:Notes.error_blank")}</em>
                                            </div>
                                        </Col>
                                    </Row>
                                    {CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                                        (<Row>
                                            <Col md="6">
                                                <div className="input-box with-icon">
                                                    <label>Next Follow-Up Date & Time</label>
                                                    <Input type="datetime-local" id="DateTime" name="DateTime"
                                                        value={this.state.DateTime}
                                                        onChange={(e) => this.handleChange(e, 'DateTime')}>
                                                    </Input>
                                                </div>
                                            </Col>
                                        </Row>) : (null)}
                                    <Row className="text-center">
                                        <Col>
                                            {(this.state.isNoteEdit) ?
                                                (CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                                                    (<div className="pull-right">
                                                        <BTN color="success" onClick={() => this.saveNotesNewBusiness()}><i class="fa fa-check"></i> Update</BTN>{' '}
                                                        <BTN color="primary" onClick={() => this.resetNewBusiness()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                    </div>)
                                                    : (<div className="pull-right">
                                                        <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Update</BTN>{' '}
                                                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                    </div>)
                                                ) : (
                                                    (CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                                                        (<div className="pull-right">
                                                            <BTN color="success" onClick={() => this.saveNotesNewBusiness()}><i class="fa fa-check"></i> Save</BTN>{' '}
                                                            <BTN color="primary" onClick={() => this.resetNewBusiness()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                        </div>) : (<div className="pull-right">
                                                            <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                                                            <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                                        </div>))
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
                                                    {(notes.ContactMode == null || notes.ContactMode == '') && (notes.RenewalMonth == null || notes.RenewalMonth == '' ) ? null:
                                                     <Row>
                                                       {notes.ContactMode == null || notes.ContactMode == ''? null :
                                                       <Col md='6'>
                                                         <p><b>Contact Mode:</b> {notes.ContactMode}</p> 
                                                       </Col>
                                                       }
                                                       {notes.RenewalMonth == null || notes.RenewalMonth == ''? null:
                                                       <Col md='6'>
                                                         <p><b>Renewal Month:</b> {notes.RenewalMonth}</p> 
                                                       </Col>
                                                       }
                                                     </Row>
                                                     }
                                                     {(notes.Response == null || notes.Response == '') && (notes.Reason == null || notes.Reason == '' ) ? null:
                                                     <Row>
                                                       {notes.Response == null || notes.Response == ''? null:
                                                         <Col md="6">
                                                           <p><b>Response:</b> {notes.Response}</p> 
                                                         </Col>
                                                       }
                                                       <Col md='6'>
                                                       {notes.Reason == null || notes.Reason == '' ? null: <p><b>Reason: </b> {notes.Reason}</p> }
                                                       </Col>
                                                     </Row>
                                                     }
                                                     {notes.FollowUpDateTime == '0000-00-00 00:00:00' || notes.FollowUpDateTime == null || notes.FollowUpDateTime == "" ? null :
                                                       <Row>
                                                         <Col>
                                                           <p><b>Follow Up DateTime: </b> {moment(notes.FollowUpDateTime).format(CommonConfig.dateFormat.dateTime)}</p> 
                                                         </Col>
                                                       </Row>
                                                    }
                                                    {/* {(CommonConfig.loggedInUserData().SecurityGroupName == "New Business") ?
                                                        (<div>
                                                            <Row>
                                                                <Col md='6'>
                                                                <p><b>Conatact Mode:</b> {notes.ContactMode}</p> 
                                                                </Col>
                                                                <Col md='6'>
                                                                <p><b>Renewal Month:</b> {notes.RenewalMonth}</p> 
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <p><b>Response:</b> {notes.Response}</p> 
                                                                </Col>
                                                                <Col md='6'>
                                                                    {notes.Reason != null && notes.Reason != '' ? <p><b>Reason: </b> {notes.Reason}</p> : null}
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                            {notes.FollowUpDateTime == '0000-00-00 00:00:00' || notes.FollowUpDateTime != "Invalid date"|| notes.FollowUpDateTime != "" ? null :
                                                              <Col>
                                                              <p><b>Follow Up DateTime: </b> {moment(notes.FollowUpDateTime).format(CommonConfig.dateFormat.dateTime)}</p> 
                                                              </Col>
                                                              }
                                                            </Row>
                                                        </div>) : (null)} */}
                                                    <div><ShowMoreText
                                                            lines={2}
                                                            more='Show more'
                                                            less='Show less'
                                                            anchorClass=''
                                                            onClick={this.executeOnClick}
                                                            expanded={false}>
                                                            {notes.NoteText}
                                                        </ShowMoreText>
                                                    </div>
                                                    <Row>
                                                        <Col md='6'>
                                                            <p><b>Added By: </b> </p>
                                                            <span className="date" style={{ marginRight: 10 }}><i class="fa fa-user" aria-hidden="true"></i> {notes.CreatedByName}</span>
                                                            <span className="date"><i class="fa fa-calendar" aria-hidden="true"></i> {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}</span>
                                                        </Col>
                                                        {(notes.UpdatedByName != null) ? (
                                                            <Col md='6'>
                                                                <p><b>Updated By</b></p>
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

export default withTranslation()(Dashboard);
