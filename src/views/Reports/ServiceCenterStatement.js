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
import { Collapse, Button as BTN, Input, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import APIConstant from '../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

class ServiceCenterStatement extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 0, style: { 'width': '150px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 2, style: { 'width': '80px' } },
            { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 3, style: { 'width': '80px' } },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 5, style: { 'width': '90px' } },
            { field: "NetPremium", header: "Net Premium", sortable: true, filter: true, id: 6, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 7, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AdminFeeAmount", header: "Admin Fee", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Gross", header: "Gross Amount", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "YCommissionAmount", header: "Paid to Yachtsman", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AgentCommissionAmount", header: "Service Center Commission", sortable: true, filter: true, id: 13, style: { 'width': '60px', 'textAlign': 'right' } },

            // { field: "TotalDue", header: "Total Due", sortable: true, filter: true, id: 10 ,style:{'width':'150px'}},
            // { field: "DueDate", header: "Due Date", sortable: true, filter: true, id: 14 ,style:{'width':'150px'}},
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 15 ,style:{'width':'150px'}},

            // { field: "AgentCommissionRate", header: "Agent Commission Rate", sortable: true, filter: true, id: 11 ,style:{'width':'150px'}},



            // { field: "DayAfterDueDate", header: "Day After Due Date", sortable: true, filter: true, id: 15 ,style:{'width':'150px'}}
        ];

        let columns1 = [
            { field: "AgentName", header: "Service Center Name", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "AgentCode", header: "Service Center Code", sortable: true, filter: true, id: 1, style: { 'width': '100px' } },
            { field: "ClientName", header: "Client", sortable: true, filter: true, id: 2, style: { 'width': '150px' } },
            { field: "PolicyNumber", header: "Policy Number", sortable: true, filter: true, id: 3, style: { 'width': '60px' } },
            { field: "RenewalDate", header: "Renewal Date", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { field: "InceptionDate", header: "Inception Date", sortable: true, filter: true, id: 5, style: { 'width': '80px' } },
            { field: "TransactionDate", header: "Transaction Date", sortable: true, filter: true, id: 6, style: { 'width': '80px' } },
            { field: "TransactionType", header: "Transaction Type", sortable: true, filter: true, id: 7, style: { 'width': '90px' } },
            { field: "NetPremium", header: "Net Premium", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Levy", header: "Levy", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AdminFeeAmount", header: "Admin Fee", sortable: true, filter: true, id: 10, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Gross", header: "Gross Amount", sortable: true, filter: true, id: 11, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "YCommissionAmount", header: "Paid to Yachtsman", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AgentCommissionAmount", header: "Service Center Commission", sortable: true, filter: true, id: 13, style: { 'width': '60px', 'textAlign': 'right' } },

            // { field: "TotalDue", header: "Total Due", sortable: true, filter: true, id: 10 ,style:{'width':'150px'}},
            // { field: "DueDate", header: "Due Date", sortable: true, filter: true, id: 14 ,style:{'width':'150px'}},
            // { field: "PaidAmount", header: "Paid Amount", sortable: true, filter: true, id: 15 ,style:{'width':'150px'}},

            // { field: "AgentCommissionRate", header: "Agent Commission Rate", sortable: true, filter: true, id: 11 ,style:{'width':'150px'}},



            // { field: "DayAfterDueDate", header: "Day After Due Date", sortable: true, filter: true, id: 15 ,style:{'width':'150px'}}
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            cols1: columns1,
            arr: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            searchCollapse: false,

            DebtorType: 'ServiceCenter',
            // DebtorTypeList:[
            //     {label:'',value:''}
            // ],
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            tillDate: moment().format("YYYY-MM"),
            tillDateError: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.colOptions1 = [];
        for (let col of columns1) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        // this.servicecenterstatement();
        this.getOrganazationData('ServiceCenter');
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

    servicecenterstatement() {
        var data = {
            DebtorType: this.state.DebtorType ? this.state.DebtorType : '',
            agentinfo: this.state.agentinfo ? this.state.agentinfo : '',
            tillDate: this.state.tillDate ? this.state.tillDate : ''
        };
        api.post('api/servicecenterstatement', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
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
                        console.log("tempData", tempData);
                        formattedData.push({
                            AgentCode: tempData.AgentContactCode,
                            AgentName: tempData.AgentName,
                            ClientName: tempData.ClientName,
                            PolicyNumber: tempData.PolicyNumber,
                            RenewalOrInceptionDate: moment(tempData.RenewalOrInceptionDate).format('DD/MM/YYYY'),
                            TransactionDate: moment(tempData.TransactionDate).format('DD/MM/YYYY'),
                            TransactionType: tempData.Description,
                            NetPremium: parseFloat(tempData.Premium ? tempData.Premium : 0).toFixed(2),
                            Levy: parseFloat(tempData.Levy ? tempData.Levy : 0).toFixed(2),
                            Gross: parseFloat(tempData.Gross ? tempData.Gross : 0).toFixed(2),
                            InceptionDate: moment(tempData.InceptionDate).format('DD/MM/YYYY'),
                            RenewalDate: moment(tempData.RenewalDate).format('DD/MM/YYYY'),
                            PaidAmount: parseFloat(tempData.PaymentAmount ? tempData.PaymentAmount : 0).toFixed(2),
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
        if (this.state.radioSelected || this.state.DebtorType == '' || this.state.agentinfo == '') {
            toast.error("Select Service Center First");
        } else {
            this.servicecenterstatement();
        }
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'tillDate') {
            debugger;
            this.setState({ tillDate: e.target.value, tillDateError: false });
            this.show('tillDate', false, 'tillDateError', '');

        }
    }

    selectType(value, type) {

        if (type === 'DebtorType') {

            this.setState({ DebtorTypeError: false, DebtorType: value });
            this.show('DebtorType', false, "DebtorTypeError", "");
            this.getOrganazationData(value)

        }

        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, radioSelected: false, DebtorType: 'ServiceCenter' });

        }
    }

    onRadioBtnClick(e) {
        this.setState({
            radioSelected: e.target.checked,
            agentinfo: ''
        });
        this.state.agentinfo = '';
        this.servicecenterstatement();
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

    render() {
        const { t } = this.props;
        var header = null;

        let columns ='';
         if(this.state.agentinfo == ''){
              columns = this.state.cols1.map((col, i) => {
                 return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                 />;
             });
         }
         else{
             columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                />;
            });
         }   

        return (
            <div>
                <div className="basic-header">
                    <h1>Service Center Statement</h1>

                    <div className="input-box" style={{ width: '20%' }}>
                        <label>Select Service Center</label>
                        <Select name="agentinfo" id="agentinfo" options={this.state.sourceList}
                            value={this.state.agentinfo} onChange={(data) => this.selectType(data, 'agentinfo')}
                        // placeholder={t("policyUnderwriting:Source.defaultValue")}
                        // disabled={this.state.sourceDisable == true ? true : false}
                        />
                    </div>
                    <div>&nbsp;
                        <label>
                            <Input type="checkbox" name="radioSelected"
                                checked={this.state.radioSelected}
                                value={this.state.radioSelected}
                                onChange={(e) => this.onRadioBtnClick(e)}
                            />
                         All Service Center
                        </label>
                    </div>
                    <div>&nbsp;
                        <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                    </div>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" tooltipOptions={{ position: 'bottom' }}
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                {/* <div className="input-box" id="accordion">
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    Search Service Center
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <div className="filter-data">
                                    <Row>
                                        <Col md='3'>
                                            <div className="input-box">
                                                <label>DebtorType</label>
                                                <Input type="select" name="DebtorType" id="DebtorType" onChange={(e) => this.selectType(e.target.value, 'DebtorType')} value={this.state.DebtorType}>
                                                    <option value="SubAgent">Sub Agent</option>
                                                    <option value="ServiceCenter">Service Center</option>
                                    }
                                </Input>
                                           </div>
                                        </Col>
                                        <Col md='2'>
                                            <div className="input-box">
                                                <label>Till Date</label>
                                                <Input disabled type="month" id="tillDate" name="tillDate"
                                                    value={this.state.tillDate}
                                                    onChange={(e) => this.handleChange(e, 'tillDate')}
                                                ></Input>
                                           </div>
                                        </Col>
                                      
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div> */}
                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Service Center Statement"
                        currentPageReportTemplate={this.state.str}
                        scrollable={true}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="expand">
                        {columns}
                    </DataTable>
                </div>
            </div>
        )
    }
}


export default withTranslation()(ServiceCenterStatement);
