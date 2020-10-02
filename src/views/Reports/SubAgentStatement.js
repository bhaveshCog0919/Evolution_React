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
import { Collapse, Button as BTN, Input, Card, CardHeader, InputGroup, CardBody, Row, Col } from 'reactstrap';
import APIConstant from '../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class SubAgentStatement extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { body: this.actionTemplate.bind(this), field: "Select", header: "Select", sortable: false, id: "checkbox", style: { 'width': '45px' } },
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 2, style: { 'width': '80px' } },
            // { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 3, style: { 'width': '80px' } },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 5, style: { 'width': '90px' } },
            { field: "NetPremium", header: "Net Premium", sortable: true, filter: true, id: 6, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 7, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AdminFeeAmount", header: "Admin Fee", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Gross", header: "Gross Amount", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AgentCommissionAmount", header: "Agent Commission Amount", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "YCommissionAmount", header: "Amount Due to Yachtsman", sortable: true, filter: true, id: 13, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "DueDate", header: "Due Date", sortable: true, filter: true, id: 14, style: { 'width': '80px' } },
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 15, style: { 'width': '60px', 'textAlign': 'right' } },
        ];
        let columns1 = [
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "AgentCode", header: "Agent Code", sortable: true, filter: true, id: 1, style: { 'width': '100px' } },
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 2, style: { 'width': '100px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 3, style: { 'width': '60px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            // { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 5, style: { 'width': '80px' } },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 6, style: { 'width': '80px' } },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 7, style: { 'width': '90px' } },
            { field: "NetPremium", header: "Net Premium", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AdminFeeAmount", header: "Admin Fee", sortable: true, filter: true, id: 10, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Gross", header: "Gross Amount", sortable: true, filter: true, id: 11, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AgentCommissionAmount", header: "Agent Commission Amount", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "YCommissionAmount", header: "Amount Due to Yachtsman", sortable: true, filter: true, id: 13, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "DueDate", header: "Due Date", sortable: true, filter: true, id: 14, style: { 'width': '80px' } },
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 15, style: { 'width': '60px', 'textAlign': 'right' } },
        ];

        let columns2 = [

            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "YCommissionAmount", header: "Amount Due to Yachtsman", sortable: true, filter: true, id: 2, style: { 'width': '60px', 'textAlign': 'right' } },
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 3, style: { 'width': '60px', 'textAlign': 'right' } },
            { body: this.Outstandingamt.bind(this), field: "DueAmt", header: "Outstanding Amount", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { body: this.actionamttobepaid.bind(this), field: "Paying", header: "Amount being paid", sortable: true, filter: true, id: 5, style: { 'width': '60px', 'textAlign': 'right' } },
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            cols1: columns1,
            cols2: columns2,
            showcol2: false,
            arr: [],
            arr1: [],
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
            isMonthYear: true,
            newEntryDate: moment().format('YYYY-MM-DD'),
            newEntryDateError: false,
            paymentMode: '',
            paymentModearr: [],
            paymentModeError: false,
            monthArray: [],
            policyMonth: moment().format('M'),
            policyMonthError: false,
            yearArray: [],
            policyYear: moment().format('YYYY'),
            policyYearError: false,
            policyFrom: '',
            policyFromError: false,
            policyTo: '',
            policyToError: false,
            note: '',
            DebtorType: 'SubAgent',
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            tillDate: moment().format("YYYY-MM"),
            tillDateError: false,
            isFilterTableShow: false,
            custom: true,
            tab2Title: "Select Policies",
        };

        this.colOptions = [];
        for (let col of columns) {
            if(col.header !="Select")
            this.colOptions.push({ label: col.header, value: col });
        }

        this.colOptions1 = [];
        for (let col of columns1) {
            if(col.header !="Select")
            this.colOptions1.push({ label: col.header, value: col });
        }
        this.colOptions2 = [];
        for (let col of columns2) {
            this.colOptions1.push({ label: col.header, value: col });
        }
        console.log("this.colOptionsthis.colOptions",this.colOptions);
        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.getPaymentMode();
        this.getOrganazationData('SubAgent');
        this.getDropdown();
    }

    getPaymentMode() {
        try {
            const data = {
                stringmaptype: 'PAYMENTMODE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var paymentMode = [];
                    for (let i = 0; i < res.data.length; i++) {
                        paymentMode.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ paymentModearr: paymentMode });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }
    changeSubAgentDateView() {
        this.setState({ isMonthYear: !this.state.isMonthYear });
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

    actionamttobepaid(rowData, column) {
        return <div>
            <input
                type="number"
                id="amttobepaid"
                name="amttobepaid"
                min="0"
                max={rowData.YCommissionAmount}
                value={rowData.amttobepaid}
                onChange={(e) => this.handleChange1(rowData.id, e)} />
        </div>;
    }

    handleChange1 = (id, e) => {

        try {
            debugger;
            console.log("arr1", this.state.arr1);
            if(Number(this.state.arr1[id].YCommissionAmount) >= Number(e.target.value) ){
                var total = 0;
                this.state.arr1[id].amttobepaid = e.target.value;
                for (let index = 0; index < this.state.arr1.length; index++) {
                    const element = this.state.arr1[index];
                    if (index != this.state.arr1.length - 1) {
                        total = Number(total) + Number(this.state.arr1[index].amttobepaid);
                    }
                    else {
                        this.state.arr1[index].amttobepaid = total;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    Outstandingamt(rowData, column) {
        return (
            <div className="policy-list-data">
                <p>{parseFloat(rowData.YCommissionAmount - rowData.PaidAmount).toFixed(2)}</p>
            </div>
        )
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

     
    }
    subagentstatement() {
        
     if(this.state.isMonthYear){
        var ShowMonth = this.state.policyMonth; 
        if (ShowMonth ==="")
        this.state.policyMonth = new Date().getMonth() + 2;
        else
            if (ShowMonth ==="All")
            this.state.policyMonth = 1;
        if (this.state.policyYear ==="")
        this.state.policyYear = new Date().getFullYear();
        
        var startDate = moment([parseInt(this.state.policyYear), parseInt(this.state.policyMonth) - 1]).format('YYYY-MM-DD');

        if(ShowMonth ==='' || ShowMonth ==='All')
        var endDate =  moment(startDate).endOf('year').format('YYYY-MM-DD');
        else 
        var endDate =  moment(startDate).endOf('month').format('YYYY-MM-DD');
    }
    else
    {
        var startDate = moment(this.state.policyFrom).format('YYYY-MM-DD');
        var endDate = moment(this.state.policyTo).format('YYYY-MM-DD');

    }
        var data = {
            DebtorType: this.state.DebtorType ? this.state.DebtorType : '',
            agentinfo: this.state.agentinfo ? this.state.agentinfo : '',
            tillDate: this.state.tillDate ? this.state.tillDate : '',
            endDate:endDate,
            startDate:startDate,
        };
        api.post('api/subagentstatement', data).then(res => {
            console.log("subagentstatement",res);
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                debugger
                var dataLength = res.data[0].length;
                if (dataLength > 0) {

                    var NetPremium = 0;
                    var Levy = 0;
                    var PaidAmount = 0;
                    var Gross = 0;
                    var AdminFeeAmount = 0;
                    var AgentCommissionAmount = 0;
                    var YCommissionAmount = 0;

                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        formattedData.push({
                            id: i,
                            UniqueReferenceId: tempData.UniqueReferenceId,
                            ClientName: tempData.ClientName,
                            AgentCode: tempData.AgentContactCode,
                            AgentName: tempData.AgentName,
                            PolicyNumber: tempData.PolicyNumber,
                            RenewalOrInceptionDate: moment(tempData.RenewalOrInceptionDate).format('DD/MM/YYYY'),
                            TransactionDate: moment(tempData.TransactionDate).format('DD/MM/YYYY'),
                            TransactionType: tempData.Description,
                            NetPremium: parseFloat(tempData.Premium ? tempData.Premium : 0).toFixed(2),
                            Levy: parseFloat(tempData.Levy ? tempData.Levy : 0).toFixed(2),
                            Gross: parseFloat(tempData.Gross ? tempData.Gross : 0).toFixed(2),
                            // InceptionDate: moment(tempData.InceptionDate).format('DD/MM/YYYY'),
                            RenewalDate: moment(tempData.RenewalDate).format('DD/MM/YYYY'),
                            // PaidAmount: parseFloat(tempData.PaymentAmount ? tempData.PaymentAmount : 0).toFixed(2),
                            amttobepaid: (parseFloat(tempData.YCommissionAmount ? tempData.YCommissionAmount : 0).toFixed(2)) - (parseFloat(tempData.PaymentAmount ? tempData.PaymentAmount : 0).toFixed(2)),
                            AdminFeeAmount: parseFloat(tempData.AdminFee ? tempData.AdminFee : 0).toFixed(2),
                            TotalDue: parseFloat(tempData.Outstanding ? tempData.Outstanding : 0).toFixed(2),
                            AgentCommissionRate: parseFloat(tempData.AgentCommissionRate ? tempData.AgentCommissionRate : 0).toFixed(2),
                            AgentCommissionAmount: parseFloat(tempData.AgentCommissionAmount ? tempData.AgentCommissionAmount : 0).toFixed(2),
                            YCommissionAmount: parseFloat(tempData.YCommissionAmount ? tempData.YCommissionAmount : 0).toFixed(2),
                            DueDate: moment(tempData.DueDate).format('DD/MM/YYYY'),
                            DayAfterDueDate: tempData.DayAfterDueDate
                        });
                        NetPremium = NetPremium + tempData.Premium;
                        Levy = Levy + tempData.Levy;
                        PaidAmount = PaidAmount + tempData.PaymentAmount;
                        Gross = Gross + tempData.Gross;
                        AdminFeeAmount = AdminFeeAmount + tempData.AdminFee;
                        AgentCommissionAmount = AgentCommissionAmount + tempData.AgentCommissionAmount;
                        YCommissionAmount = YCommissionAmount + tempData.YCommissionAmount;
                    }
                    formattedData.push({
                        ClientName: 'Total',
                        Gross: parseFloat(Gross).toFixed(2),
                        NetPremium: parseFloat(NetPremium).toFixed(2),
                        Levy: parseFloat(Levy).toFixed(2),
                        PaidAmount: parseFloat(PaidAmount).toFixed(2),
                        AdminFeeAmount: parseFloat(AdminFeeAmount).toFixed(2),
                        AgentCommissionAmount: parseFloat(AgentCommissionAmount).toFixed(2),
                        YCommissionAmount: parseFloat(YCommissionAmount).toFixed(2)
                    });
                }

                let firstPage = (formattedData.length) ? '1' : '0';
                let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                this.setState({ arr: formattedData, str: str, isFilterTableShow: true });
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

    filterData(fMode) {
        if (this.state.agentinfo == '') {
            toast.error("Select Sub Agent First");            
            return false;
        } else
        if (this.state.isMonthYear) { console.log("this.state.policyMonth",this.state.policyMonth);
            if (CommonConfig.isEmpty(this.state.policyMonth) || CommonConfig.isEmpty(this.state.policyYear)) {
                toast.error('Please select Month and Year.');
                return false;
            }
        } else {
            if (CommonConfig.isEmpty(this.state.policyFrom) && CommonConfig.isEmpty(this.state.policyTo)) {
                toast.error('Please select from date and to date.');
                return false;
            }
        
        }

        if (fMode == 1) {
            this.setState({selected: [], selectedPolicy: 0})
        }
        this.subagentstatement();
         
    }
    onRadioBtnClick() {
        this.setState({
            agentinfo: ''
        });
        if (this.state.isMonthYear) {
            if (CommonConfig.isEmpty(this.state.policyMonth) && CommonConfig.isEmpty(this.state.policyYear)) {
                toast.error('Please select Month and Year.');
                return false;
            }
        } else {
            if (CommonConfig.isEmpty(this.state.policyFrom) && CommonConfig.isEmpty(this.state.policyTo)) {
                toast.error('Please To Date and From Date.');
                return false;
            }
        
        }
        this.state.agentinfo = '';
        this.subagentstatement();
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'tillDate') {
            this.setState({ tillDate: e.target.value, tillDateError: false });
            this.show('tillDate', false, 'tillDateError', '');

        }
        if (e.target.name === 'newEntryDate') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ newEntryDateError: true });
                this.show("newEntryDate", true, "newEntryDateError", "Please enter date");
            } else {
                this.setState({ newEntryDateError: false, newEntryDate: e.target.value });
                this.show("newEntryDate", false, "newEntryDateError", "");
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

    selectType(value, type) {

        if (type === 'DebtorType') {

            this.setState({ DebtorTypeError: false, DebtorType: value });
            this.show('DebtorType', false, "DebtorTypeError", "");
            this.getOrganazationData(value)

        }
        if (type === 'paymentMode') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ paymentModeError: true, paymentMode: value });
                this.show('paymentMode', true, "paymentModeError", "Select payment mode");
            } else {
                this.setState({ paymentModeError: false, paymentMode: value });
                this.show('paymentMode', false, "paymentModeError", "");

            }
        }
        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, DebtorType: 'SubAgent' });

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

    PaymentData(mMode) {
        this.filterData("0");
        if (this.state.selectAll != 0) {
            var mainarr = this.state.arr;
            this.state.showcol2 = true;
            this.setState({ showcol2: true });
            var o = this.state.selected;
            var mainarr1 = [];
            var mainagent = '';
            var mainindex = 0;
            var i = 0;

            var Totalamt = 0;
            var YCommissionAmount = 0;
            var PaidAmount = 0;
            Object.keys(o).forEach(function (key) {
                var val = o[key];
                if (val) {
                    var pusharr = '';
                    pusharr = mainarr[key];
                    pusharr.id = i;
                    Totalamt = Number(Totalamt) + Number(pusharr.amttobepaid);
                    YCommissionAmount = Number(YCommissionAmount) + Number(pusharr.YCommissionAmount);
                    PaidAmount = Number(PaidAmount) + Number(pusharr.PaidAmount);
                    mainagent = mainarr[key].AgentName;
                    mainarr1.push(pusharr);
                    i = i + 1;
                    mainindex = mainarr1.length;
                }
            });
            var totalarr = {
                ClientName: 'Total',
                amttobepaid: parseFloat(Totalamt ? Totalamt : 0).toFixed(2),
                PaidAmount: parseFloat(PaidAmount ? PaidAmount : 0).toFixed(2),
                YCommissionAmount: parseFloat(YCommissionAmount ? YCommissionAmount : 0).toFixed(2),
            };
            mainarr1.push(totalarr);
            this.state.arr1 = mainarr1;
            this.state.selectedPolicy = mainindex;
            this.state.selectedAgent = mainagent;
            var tTitle=""
            if (mMode) {
                tTitle="Selected Policies";
            }else{
                tTitle="Select Policies"
            }   
            this.setState({
                arr1: mainarr1,
                selectedPolicy: mainindex,
                selectedAgent: mainagent,
                tab2Title: tTitle
            });
            setTimeout(() => {
                this.setState({
                    isFilterTableShow: false
                })
            }, 1200);
        }
    }

    mulSelVal = (e) => {
        console.log("mulSelVal", e);
        if (e.value.length == 0) {
          this.setState({ agentinfoError: true, agentinfo: e.value, });
          this.show('agentinfo', true);
        } else {
          this.setState({ agentinfoError: false, agentinfo: e.value });
          this.show('agentinfo', false);
        }
        // console.log("Afdsas", this.state.Task_Followers);
    
      }
    RecordPayment() {
        debugger
        var newdata = {
            mainarr: this.state.arr1,
            newEntryDate: this.state.newEntryDate,
            note: this.state.note,
            paymentMode: this.state.paymentMode,
            loggedInUserId: CommonConfig.loggedInUserId()
        }
        if (CommonConfig.isEmpty(this.state.newEntryDate) || this.state.newEntryDateError) {
            this.show("newEntryDate", true, "newEntryDateError", "Please enter date");
            return;
        }
        if (CommonConfig.isEmpty(this.state.paymentMode) || this.state.paymentModeError) {
            this.show('paymentMode', true, "paymentModeError", "Select payment mode");
            return;
        }
        api.post('api/newRecordPayment', newdata).then(res => {
            console.log("res", res);
            if (res.success) {
                toast.success(res.data);
                window.location.reload();
            } else {
                toast.error(res.data);
                window.location.reload();
            }
        });
    }

    // RecordPayment() {
    //     var newdata = {
    //         PolicyId: '6864a05c-beb4-46f5-843a-6cd2c327c3ef',
    //         ProcessType: 'Quotation',
    //     }
    //     api.post('api/sendQuotationDocument', newdata).then(res => {
    //         console.log("res", res);
    //     });
    // }


    render() {
        const { t } = this.props;
        var header = null;
        let columns = '';
        let columns1 = '';
        // if (this.state.agentinfo == '') {
            columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                />;
            });
        if (this.state.arr1.length > 0) {
            columns1 = this.state.cols2.map((col2, i) => {
                return <Column key={i} field={col2.field} header={col2.header} body={col2.body} sortable={col2.sortable} filter={col2.filter} filterMatchMode={col2.filterMatchMode} style={col2.style}
                />;
            });
        }
        else {
            columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                />;
            });
        }

        return (
            <div>
                <div className="basic-header">
                    <h1>Sub Agent Statement</h1>
                    <div md="3" className="header-right-option" >
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: "left" }} onClick={() => this.export()} style={{ marginRight: 10, cursor: "pointer" }}></Button>
                    </div>
                </div>
                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    Search Sub Agent
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row> 
                                    <Col md="3">
                                        <label>Select Agent</label>
                                        <MultiSelect name="agentinfo" id="agentinfo" options={this.state.sourceList}
                                            value={this.state.agentinfo} onChange={(e) => this.mulSelVal(e)} filter
                                        />
                                    </Col>                                         
                                                      
                                            {(this.state.isMonthYear) ? (
                                                            <Col md="1.5">
                                                              
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

                                                        <Col md="1.5" style={{ alignSelf: 'center', paddingRight: '15px' }}>
                                                            {(this.state.isMonthYear) ? (
                                                                <label style={{ textDecoration: 'underline' }} onClick={() => this.changeSubAgentDateView()}>Change to Date Range</label>
                                                            ) : (
                                                                    <label style={{ textDecoration: 'underline' }} onClick={() => this.changeSubAgentDateView()}>Change to Month/Year</label>
                                                                )}
                                                        </Col>

                                                        {this.state.arr1.length > 0 ?
                                                        <Col md="2.5" style={{marginTop:'20px'}}>
                                                            <BTN color="success" title="Search" onClick={() => this.filterData("1")}> Selected Sub-Agent Search </BTN>
                                                        </Col>:
                                                        (null)}

                                                        {this.state.arr1.length > 0 ?
                                                        <Col md="2" style={{marginTop:'20px'}}>
                                                        <BTN color="success" title="Search" onClick={() => this.onRadioBtnClick()}> All Sub-Agent Search </BTN>
                                                        </Col>:
                                                        (null)}

                                                
                                        
                                                            
                                                        <Col md="8">
                                                        <Row>
                                                            {this.state.showcol2 == true ?
                                                                <Col md="2.5">
                                                                    {/* <label>{this.state.selectedAgent}</label> */}
                                                                </Col> : <Col md="3.5" style={{marginTop:'20px'}}>
                                                                <BTN color="success" title="Search" onClick={() => this.filterData("0")}> Selected Sub-Agent Search </BTN>
                                                                </Col>}

                                                            {this.state.showcol2 == true ?
                                                                <Col md="3">
                                                                    <label>Selected Policy</label>
                                                                </Col> : <Col md="4" style={{marginTop:'20px'}}>
                                                                <BTN color="success" title="Search" onClick={() => this.onRadioBtnClick()}> All Sub-Agent Search </BTN>
                                                                </Col>}
                                                                
                                                            {this.state.showcol2 == true ?
                                                                <Col md="1">
                                                                    <label> {this.state.selectedPolicy}</label>
                                                                </Col> : <Col md="4.5" style={{marginTop:'20px'}}>
                                                                    <BTN color="success" title="Payment" onClick={() => this.PaymentData("0")}> Update Policy List </BTN>
                                                                </Col>
                                                            } 
                                                            </Row>
                                                        </Col>

                                        {this.state.showcol2 == true ?
                                            <Col md="2">Transaction Date(*)</Col> : null}
                                        {this.state.showcol2 == true ?
                                            <Col md="3">
                                                <InputGroup>
                                                    <Input type="date" name="newEntryDate" id="newEntryDate" placeholder="transaction date" onBlur={(e) => this.handleChange(e)}
                                                        onChange={(e) => this.handleChange(e)} value={this.state.newEntryDate}
                                                        min={moment().subtract(100, 'years').format('DD-MM-YYYY')}
                                                        max={moment().format('DD-MM-YYYY')}
                                                    />
                                                    <em id="newEntryDateError" className="error invalid-feedback" ></em>
                                                </InputGroup>
                                            </Col> : null}
                                        {this.state.showcol2 == true ?
                                            <Col md="2"> Payment Mode(*)</Col> : null}
                                        {this.state.showcol2 == true ?
                                            <Col md="2">
                                                <Input type="select" name="paymentMode" id="paymentMode"
                                                    onChange={(e) => this.selectType(e.target.value, 'paymentMode')} value={this.state.paymentMode}
                                                >
                                                    <option value=''>Select payment mode</option>
                                                    {this.state.paymentModearr.map((type, i) => {
                                                        return (<option value={type.label} key={i}>{type.value}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em id="paymentModeError" className="error invalid-feedback" ></em>
                                            </Col> : null}

                                        {this.state.showcol2 == true ?
                                            <Col md="1"> Note </Col> : null}
                                        {this.state.showcol2 == true ?
                                            <Col md="3">
                                                <Input name="note" type="textarea" id="note" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.note} />
                                            </Col> : null}
                                        {this.state.showcol2 == true ?
                                            <Col style={{ textAlign: "center", marginTop: '1%' }} md="4">
                                                <Row>
                                                    <Col md="5">
                                                        <BTN color="success" title="Payment" onClick={() => this.PaymentData("1")}> Update Policy List </BTN>
                                                    </Col>
                                                    <Col md="5">
                                                        <BTN color="success" title="RecordPayment" onClick={() => this.RecordPayment()}> Record Payment </BTN>
                                                    </Col>
                                                </Row>
                                            </Col> : null}

                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                {/* {this.state.showcol2 != true ? (<div className="table-custom"> */}
                <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ isFilterTableShow: !this.state.isFilterTableShow })} aria-expanded={this.state.isFilterTableShow} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    <span>{this.state.tab2Title}</span>
                        <i style={{ float: 'right' }} className={this.state.isFilterTableShow ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.isFilterTableShow} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                                    paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Statement"
                                    currentPageReportTemplate={this.state.str}
                                    scrollable={true}
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                    responsive={true} resizableColumns={true} columnResizeMode="expand">
                                    {columns}
                                </DataTable>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                {/* </div>
                ) : (<div className="table-custom"> */}
                {this.state.arr1.length > 0
                    ? <div className="table-custom">
                        <DataTable ref={(el) => this.dt = el} value={this.state.arr1} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                            paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Statement"
                            currentPageReportTemplate={this.state.str}
                            scrollable={true}
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                            responsive={true} resizableColumns={true} columnResizeMode="expand">
                            {columns1}
                        </DataTable>
                    </div>
                    : (null)}
                {/* </div>)} */}
            </div>
        )
    }
}


export default withTranslation()(SubAgentStatement);
