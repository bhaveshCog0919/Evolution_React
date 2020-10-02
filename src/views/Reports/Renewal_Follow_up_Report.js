import React, { Component } from 'react';
import Select from 'react-select';
import api from '../../utils/apiClient';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CommonConfig } from '../../utils/constants';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Modal, ModalBody, ModalHeader, Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col ,UncontrolledTooltip} from 'reactstrap';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';

const URL = 'http://localhost:4111/#/'; 

class Renewal_Follow_up_Report extends Component {

    constructor(props) {
        super(props);

        let columns = [
           /* { field: "Action", header: "Action", sortable: false, id: 0, style: { 'width': '45px' } },*/
            { field: "Stage", header: "Stage", sortable: true, filter: true, id: 1, style: { 'width': '105px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 2, style: { 'width': '100px' } },
            { body: this.PolicyTemplate.bind(this) , field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 4, style: { 'width': '75px' } },
	        { body: this.ClientTemplate.bind(this) , field: "ClientName", header: "Client Name", sortable: true, filter: true, id: 6, style: { 'width': '150px' } },
            { field: "Currency", header: "Currency", sortable: true, filter: true, id: 10, style: { 'width': '65px' } },
            { body: this.ColumnclassName.bind(this), field: "TotalDue", header: "Total Due", sortable: true, filter: true, id: 9, style: { 'width': '75px','textAlign':'right' } },
            { field: "PolicyType", header: "Policy Type", sortable: true, filter: true, id: 5, style: { 'width': '100px'  } },
            { field: "VesselClass", header: "Vessel Class", sortable: true, filter: true, id: 7, style: { 'textAlign': 'right','width': '100px'  } },
            { field: "VesselType", header: "Vessel Type", sortable: true, filter: true, id: 8, style: { 'textAlign': 'right','width': '100px'  } },
            { field: "SumInsured", header: "Sum Insured", sortable: true, filter: true, id: 15, style: { 'width': '75px','textAlign':'right' } },
            { field: "Source", header: "Source", sortable: true, filter: true, filterMatchMode: 'contains', id: 11, style: { 'width': '150px' } },
            { field: "SourceName", header: "Source Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 12, style: { 'width': '150px' } },
            { body: this.ContactNumberTemplate.bind(this) , field: "ContactNumber", header: "Contact Number", sortable: true, filter: true, id: 13, style: { 'width': '155px' } },
            { body:this.formatEmail.bind(this), field: "Email", header: "Email", sortable: true, filter: true, id: 14, style: { 'width': '155px' } },
            { field: "Country", header: "Country", sortable: true, filter: true, id: 16, style: { 'width': '75px' } },
            { field: "DaysOutstanding", header: "Days Outstanding", sortable: true, filter: true, id: 3, style: { 'width': '75px' } },
            { field: "Language", header: "Language", sortable: true, filter: true, id: 18, style: { 'width': '75px' } },
            { field: "VesselRegistrationLocation", header: "Vessel Registration Location", sortable: true, filter: true, id: 17, style: { 'width': '75px' } },
            /* { field: "LastRenewalConfirmed", header: "Last Renewal Confirmed", sortable: true, filter: true, id: 10, style: { 'width': '75px' } },
            { field: "DifferenceTotalDue", header: "Difference Total Due", sortable: true, filter: true, id: 10, style: { 'width': '75px' } },
            { field: "ChangeonPreviousyear", header: "Change on Previous year", sortable: true, filter: true, id: 11, style: { 'width': '75px' } },
            { field: "Previouspaymenttype", header: "Previous payment type", sortable: true, filter: true, id: 12, style: { 'width': '65px' } },*/
            
            
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            arr: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            searchCollapse: false,
            selected: {},
            selectedPolicy: 0,
            selectedAgent: '',
            selectAll: 0,
            DebtorType: 'SubAgent',
            Period: 0,
            agentinfo: '',
            agentinfoError: false,
            monthtillDate: moment().format("YYYY-MM"),
            fromDate: moment().format("YYYY-MM-DD"),
            toDate: moment().format("YYYY-MM-DD"),
            MONTHList: [],
            MONTH: ('0'+(new Date().getMonth() + 1).toString()).slice(-2),
            MONTHError: false,
            Year: '',
            YearError: false,
            DaysOutstanding:'All',
    		policyTypeArray: [],
            policyType: 'Vessel',	
            isSMSModalVisible: false,
            rowData: {},
            SMSTemplate:'',
            SMSTemplateError: false,
            SMSTypeList: [],
            EmailTemplate:'',
            EmailTemplateError: false,
            EmailTypeList: [],

        };
        console.log('month','0'+(new Date().getMonth() + 1).toString());
        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.ClientTemplate = this.ClientTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.Renewal_Follow_up_Report();
        this.getDropDownValues('POLICYTYPE', 'policyTypeArray');
        this.getOrganazationData(this.state.DebtorType);
        this.getDropDownValues('MONTH', 'MONTHList', 'StringMapKey');
        this.getSMSTypeDropDown();
    }

    getSMSTypeDropDown(){
        try{
            var formattedSMS = [];
        
            api.post('api/getSMSTypeDropDown').then(res =>{
                console.log('res',res.success);
                for (var i = 0; i < res.data.length; i++) {
                    formattedSMS.push({
                        label: res.data[i].TamplateName,
                        value: res.data[i].MessageTemplateId,
                    });
                }
                this.setState({SMSTypeList:formattedSMS });
            }).catch(err=>{
                console.log('err',err);
            });
        } catch (error) {
            console.log("error in getSMSTypeDropDown",error)
        }   
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

    ClientTemplate(rowData, column){
        return <div className="policy-list-data">
            <span onClick={() => this.viewContactDetails(rowData)}
                style={{ marginRight: '.5em', cursor: 'pointer' , borderBottomWidth: "1px" , color: "#007ad9" }} tooltip="View Details" tooltipOptions={{ position: 'bottom' }}>
                {rowData.ClientName}
            </span>
            </div>;
    }

    PolicyTemplate(rowData, column) {
    console.log('rowData', rowData);
    return <div className="policy-list-data">
            <a onClick={() => this.viewPolicy(rowData)}
                style={{ marginRight: '.5em', cursor: 'pointer' , borderBottomWidth: "1px" , color: "#007ad9"}} tooltip="View Details" tooltipOptions={{ position: 'bottom' }}>
                {rowData.PolicyNumber}
            </a>     
    </div>;
  }

    ClientDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.ClientName}</p>
                <p>{rowData.ClientCode}</p>
            </div>
        )
    }

    AgentDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.AgentName}</p>
                <p>{rowData.AgentCode}</p>
            </div>
        )
    }

    ContactNumberTemplate(rowData){
        return (
            <div className="policy-list-data">
                <p>{rowData.ContactNumber}</p>
                <BTN onClick={() => this.openSMSTempalteModal(rowData)}>SMS</BTN>
                {/* <span>
                <i class="fas fa-sms" style={{ fontSize: '25px'}} id={"SMS"+rowData.PolicyNumber}></i>
                    <UncontrolledTooltip placement="right" target={"SMS"+rowData.PolicyNumber}>
                        {"Send SMS"}
                    </UncontrolledTooltip>
                 </span> */}
            </div>
        )
    }

    openSMSTempalteModal(rowData){
        this.setState({isSMSModalVisible: true , rowData: rowData });
    }


    sendSMS(rowData){
        try{
            if(this.state.SMSTemplate){
                let data ={
                    TemplateId: this.state.SMSTemplate,
                    PolicyId :rowData.PolicyId,
                    MessageHeaderId: '',
                }
                api.post('api/sendSMSOnDemand', data).then(res =>{
                    // console.log('res',res);
                    if(res.success == 'true' || res.success == true){
                        toast.success('SMS Send Successfull');
                    }else if(res.success == 'false' || res.success == false){
                        toast.error(res.message);  
                    }
                }).catch(err=>{
                    // console.log('err',err);
                    toast.error("SMS Sending Failed")
                });
            }else{
                this.show('SMSTemplate', true, "SMSTemplateError", "Please select SMS Template");
            }
            // console.log('rowData',rowData)
            
        } catch (error) {
            console.log("error in SendSMS",error)
        }   
    }

    formatEmail(rowData){
        return(
            <div className="policy-list-data">
                <p>{rowData.Email}</p>
                {/* <BTN onClick={() => this.sendEmail(rowData)}>EMAIL</BTN> */}
            </div>
        )
    }

    // sendEmail(rowData){
    //     try{
    //         console.log('rowData',rowData)
    //         let data ={
    //             PolicyId :rowData.PolicyId,
    //             MessageHeaderId: '',
    //             to: 'ajay.cognisun@gmail.com',  //rowData.Email,
    //             cc: '',
    //             bcc: '',
    //             subject:'Testing by Ajay',
    //             EmailSenderId:'',
    //             html:'<p>Hello For Testing</p>',

    //         }
    //         api.post('api/sendEmailOnDemand', data).then(res =>{
    //             console.log('res',res);
    //         }).catch(err=>{
    //             console.log('err',err);
    //         });
    //     } catch (error) {
    //         console.log("error in EmailSMS",error)
    //     }
        
    // }


    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selqected: newSelected,
            selectAll: 2
        });
    }
    
    toggleSelectAll() {
        let newSelected = {};
        if (this.state.selectAll === 0) {
            this.state.arr.forEach(x => {
                newSelected[x.id] = true;
            });
        }
        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    viewContactDetails(rowData) {
        window.open(window.location.origin + '/#' + 'viewContactDetails/' + rowData.EntityId + '/' + rowData.EntityType);
    }

    viewPolicy(rowData) {
        window.open(window.location.origin + '/#' + '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1', '_blank');
    }

    actionTemplate(rowData, column) {
        return <div>
            <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selected[rowData.id] === true}
                onChange={() => this.toggleRow(rowData.id)} />
        </div>;
    }
    SourceName(rowData) {
        return (rowData.Source === "Direct")?

            <div className="policy-list-data">
                <p>{rowData.Source}</p>
               
            </div> :
            

            <div className="policy-list-data">
                <p>{rowData.Source}</p>
                <p>{rowData.SourceName}</p>
            </div>
        ;
    }
    DateDetails(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.RenewalDate}</p>
                <p>{rowData.InceptionDate}</p>
            </div>
        )
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


    Renewal_Follow_up_Report() {
        var ShowMonth = this.state.MONTH; console.log(ShowMonth);
        if (ShowMonth ==="")
        this.state.MONTH = new Date().getMonth() + 2;
        else
            if (ShowMonth ==="All")
            this.state.MONTH = 1;
        if (this.state.Year ==="")
        this.state.Year = new Date().getFullYear();
        
        var startDate = moment([parseInt(this.state.Year), parseInt(this.state.MONTH) - 1]).format('YYYY-MM-DD');

        if(ShowMonth ==='' || ShowMonth ==='All')
        var endDate =  moment(startDate).endOf('year').format('YYYY-MM-DD');
        else 
        var endDate =  moment(startDate).endOf('month').format('YYYY-MM-DD');
        var data = {
	        policyType: this.state.policyType,
            fromDate:  startDate,
            toDate: endDate,
            daysOutstanding: this.state.DaysOutstanding,
        };
        console.log("lok",data);
        this.state.MONTH = ShowMonth;
        api.post('api/Renewal_Follow_up_Report', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage:0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {

                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            id:i,
Stage: tempData.Stage,
RenewalDate: moment(tempData.RenewalDate).format('DD-MM-YYYY'),
DaysOutstanding: tempData.DaysOutstanding,
PolicyNumber: tempData.PolicyNumber,
PolicyId: tempData.PolicyId,
EntityId: tempData.EntityId,
EntityType: tempData.EntityType,
ClientName: tempData.ClientName,
PolicyType: tempData.PolicyType,
VesselClass: tempData.VesselClass,
VesselType : tempData.VesselType,
Country: tempData.Country,
VesselRegistrationLocation: tempData.VesselRegistrationLocation,
SumInsured: tempData.SumInsured,
TotalDue: tempData.TotalDue,

/*LastRenewalConfirmed: tempData.LastRenewalConfirmed,
DifferenceTotalDue: tempData.DifferenceTotalDue,
ChangeonPreviousyear: tempData.ChangeOnPreviousYear,
Previouspaymenttype: tempData.PreviousPaymentType,*/
Language: tempData.DocLang,
Currency: tempData.Currency,
Source: tempData.Source,
SourceName: tempData.SourceName,
SourceData: tempData.Source + "" + tempData.SourceName,
ContactNumber: tempData.ClientPhone,
Email: tempData.ClientEmail,
                        });

                    }
                }
                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ arr: formattedData, str: str });
            }
        });
}

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    export() {
        this.dt.exportCSV();
    }

    filterData() {
        this.Renewal_Follow_up_Report();

    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'monthtillDate') {
            this.setState({ monthtillDate: e.target.value });
        }

        if (e.target.name === 'fromDate') {
            this.setState({ fromDate: e.target.value });
        }

        if (e.target.name === 'toDate') {
            this.setState({ toDate: e.target.value });
        }

        if (e.target.name === 'Year') {

            if (e.target.value === null || e.target.value === undefined || e.target.value === '') {
                this.setState({ Year: e.target.value, YearError: true });
                this.show('Year', true, 'YearError', 'Please Enter Year');
            } else {
                this.setState({ Year: e.target.value, YearError: false });
                this.show('Year', false, 'YearError', '');
            }
        }
    }

    selectType(value, type) {

        if (type === 'DebtorType') {

            this.setState({ DebtorTypeError: false, DebtorType: value });
            this.show('DebtorType', false, "DebtorTypeError", "");
            this.getOrganazationData(value)

        }
        if (type === 'policyType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ policyType: '' });
            } else {
                this.setState({ policyType: value.value });
            }
        }
        if (type === 'DaysOutstanding') {

            this.setState({DaysOutstanding: value });

        } 

        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, agentinfoError: false });
            this.show('agentinfo', false, 'agentinfoError', '');

        }

        if (type === 'Period') {
            this.setState({ Period: value });
        }

        if (type === 'MONTH') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ MONTHError: true, MONTH: value });
                this.show('MONTH', true, "MONTHError", "Please select Date Type");
            } else {
                this.setState({ MONTHError: false, MONTH: value });
                this.show('MONTH', false, "MONTHError", "");

            }
        }
        if (type === 'SMSTemplate') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ SMSTemplateError: true, SMSTemplate: value });
                this.show('SMSTemplate', true, "SMSTemplateError", "Please select SMS Template");
            } else {
                this.setState({ SMSTemplateError: false, SMSTemplate: value });
                this.show('SMSTemplate', false, "SMSTemplateError", "");

            }
        }
        

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
   
    ColumnclassName(rowData,Column) {
 
       
       return (rowData.DaysOutstanding <=7)? <div style={{backgroundColor:'#008c9a',color:'#fff'}} className = "policy-list-data">
       <p>{rowData.TotalDue}</p>     
   </div> :<div className = "policy-list-data" >
                <p>{rowData.TotalDue}</p>     
            </div>;
       
       
    }

    render() {
        const { t } = this.props;
        var header = null;

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
            />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Renewal Follow up Report</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    Filter
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row>
 					<Col md="3">
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
                                        <Col md='3'>
                                            <label>Month</label>
                                            <Input type="select" name="MONTH" id="MONTH" onChange={(e) => this.selectType(e.target.value, 'MONTH')} value={this.state.MONTH}>
                                            <option value='All'>All</option>
                                                {this.state.MONTHList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="MONTHError" className="error invalid-feedback"></em>
                                        </Col>
                                        <Col md='3'>

                                            <label>Year</label>
                                            <Input type="number" min="1900" max="2099" id="Year" name="Year"
                                                value={this.state.Year}
                                                onChange={(e) => this.handleChange(e, 'Year')}
                                            ></Input>

                                            <em id="YearError" className="error invalid-feedback"></em>
                                        </Col>
                                        <Col md='3'>
                                            <label>Days Outstanding</label>
                                            <Input type="select" name="DaysOutstanding" id="DaysOutstanding" onChange={(e) => this.selectType(e.target.value, 'DaysOutstanding')} value={this.state.DaysOutstanding}>
                                                {/* {this.state.MONTHList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                } */}
                                                <option value="All">All</option>
                                                <option value="Before 45-60">Before 45-60 d</option>
                                                <option value="Before 7-44">Before 7-44 d</option>
                                                <option value="Before 6">Before 6 d</option>
                                                <option value="Overdue < 38">Overdue &lt; 38 d</option>
                                                <option value="About to Lapse 38-44">About to Lapse (38-44 d)</option>
                                                <option value="Overdue > 45">Lapsed (&gt; 45 d)</option>
                                            </Input>
                                            <em id="MONTHError" className="error invalid-feedback"></em>
                                        </Col>
                                        <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Renewal Follow up Report"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true} 
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="expand">
                        {columns}
                    </DataTable>
                </div>

                <Modal isOpen={this.state.isSMSModalVisible} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.setState({ isSMSModalVisible: false })}> Send SMS </ModalHeader>
                    <ModalBody>
                        <Card className="mb-0">
                            <Row>
                                <Col>
                                <div> 
                                    <Row>
                                     <Col md="4"> 
                                        <label>
                                             Policy Number  : {this.state.rowData.PolicyNumber}  
                                        </label>
                                    </Col>
                                    <Col md="4">
                                        <label>
                                             Phone Number  : {this.state.rowData.ContactNumber} 
                                        </label>
                                    </Col>
                                    </Row>                        
                                </div>
                                </Col>   
                            </Row>
                            <Row>
                            <Col md="3">
                                <label>
                                        Select SMSTemplate :  
                                </label>
                                  
                            </Col>
                            <Col md="4">
                                <Input type="select" name="SMSTemplate" id="SMSTemplate" value={this.state.SMSTemplate} onChange={(e) => this.selectType(e.target.value, 'SMSTemplate')}>
                                    <option value="">Select</option>
                                    {this.state.SMSTypeList.map((x, i) => {
                                        return (<option value={x.value} key={i}>{x.label}</option>)
                                    })
                                    }
                                </Input>
                                <em id="SMSTemplateError" className="error invalid-feedback"></em>
                            </Col>
                            <Col md="2">
                                <BTN color="success" title="SendSMS" 
                                    onClick={() => this.sendSMS(this.state.rowData)}> SendSMS
                                </BTN>
                            </Col>
                            </Row>
                        </Card>
                    </ModalBody>
                </Modal>


            </div>

            
        )
    }
}



export default withTranslation()(Renewal_Follow_up_Report);
