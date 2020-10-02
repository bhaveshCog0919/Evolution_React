import React, { Component } from 'react';
import { Modal, ModalBody, Collapse, Button as BTN, ModalHeader, Card, CardHeader,
    UncontrolledTooltip, CardBody, Col, Row, Input, Form } from 'reactstrap';
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
import uuid from "uuid";
import APIConstant from '../../utils/constants';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import { off } from 'codemirror';
import { toast } from 'react-toastify';
import { apiBase } from '../../utils/config';

class SMSReport extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "Date", header: "Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { body: this.formatEntityData.bind(this), field: "EntityData", header: "Entity Type/Entity ID", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.formatProcessDetail.bind(this), field: "ProcessDetail", header: "Process/Template Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "RecipientType", header: "Recipient Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { body: this.formatClientDetail.bind(this), field: "ClientDetail", header: "Client/Sub Agent", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.formatPhoneNumber.bind(this), field: "PhoneNumber", header: "Recipient Mobile", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { body: this.formatMessage.bind(this), field: "Message", header: "Message", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { body: this.formatStatus.bind(this), field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
        ];

        this.state = {
            toggleModalAdd: false,
            cols: columns,
            str: '',
            arr: [],
            selectedPage: 0,
            filteredcontactsSingle: null,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            custom: true,
            isExpand: false,

            isMonthYear: true,
            monthArray: [],
            yearArray: [],

            selectedFromDate:'',
            selectedFromDateError: false,
            selectedToDate:'',
            selectedToDateError: false,

            selectedMonth:parseInt(moment().format('MM')),
            selectedMonthError: false,
            selectedYear:moment().format('YYYY'),
            selectedYearError: false,

            selectedStatus:'',
            entityType:'',
            entityTypeError: false,
            processType:'',
            processTypeError: false,
            recepientType: '',
            recepientTypeError: false,
            selectedStatus:'',
            selectedStatusError: false,
            isMessageModalVisible: false,
            FullMessage: '',

            offset: 0,
            recordStr: '',
            selected: {},
            batchMessageHeaderId: '',
            policyCount: 0,
            
            entityTypeList: [
            
            { label: 'Policy', value: 'Policy' },
            { label: 'Claims', value: 'Claims' },
            
            ],

            processTypeList: [
                
            { label: 'Renewal', value: 'Renewal' },

            ],
            recepientTypeList: [
                
            { label: 'SubAgent', value: 'SubAgent' },
            { label: 'Client', value: 'Client' },

            ],

            statusList: [
                
            { label: 'Pending', value: 'Pending'},
            { label: 'Sent', value: 'Sent' },
            { label: 'Failed', value: 'Failed' },
        
            ],

        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.getDropdown();
        // this.getSMSReportList();
    }

    getSMSReportList(){
        let data ={
            IsMonthYear: this.state.isMonthYear ? "true" : "false",
            Month: this.state.isMonthYear ? this.state.selectedMonth : '',
            Year: this.state.isMonthYear ? this.state.selectedYear : '',
            FromDate: !this.state.isMonthYear ? this.state.selectedFromDate : '',
            ToDate: !this.state.isMonthYear ? this.state.selectedToDate : '',
            EntityType: this.state.entityType,
            ProcessType: this.state.processType,
            RecipientType: this.state.recepientType,
            Status: this.state.selectedStatus,
        }

        api.post('api/getSMSReportList',data).then(res =>{
            console.log("data in SMS List....",res);
            this.setState({ arr: res.data[0]});
        }).catch(err =>{
            console.log("error in SMSList",err);
            toast.error("Error",err);
        });
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
            { label: 'Septemeber', value: 9 },
            { label: 'October', value: 10 },
            { label: 'November', value: 11 },
            { label: 'December', value: 12 },
        ];
        this.setState({ monthArray: monthArray });

        // Get Year - Get last 10 year from current year
        let startYear = moment().format('YYYY');
        let last10Year = parseInt(startYear) - 10;
        let yearArray = [];
        for (let index = last10Year; index <= (parseInt(last10Year) + 10); index++) {
            yearArray.push({ label: index, value: index });
        }
        this.setState({ yearArray: yearArray });


    }

    toggleSelectAll() {
        let newSelected = {};
        if (this.state.selectAll === 0) {
            this.state.arr.forEach(x => {
                newSelected[x.SrNo] = true;
            });
        }
        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    toggleRow(SrNo) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[SrNo] = !this.state.selected[SrNo];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }
    actionTemplate(rowData, column) {
        return <div>
            <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selected[rowData.SrNo] === true}
                onChange={() => this.toggleRow(rowData.SrNo)} />
        </div>;
    }


    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    edit(rowData) {
        this.props.history.push({
            pathname: '/PolicyDetailsMerged/' + rowData.PolicyId + '/1/1',
            state: {
                PolicyId: rowData.PolicyId,
                tab: 1
            }
        });
    }

    formatEntityData(rowData) {
        return (
            <div className="policy-list-data">
                <p>{rowData.EntityType} - {" "}
                <a onClick={()=> this.openPolicy(rowData)} 
                    style={{ marginRight: '.5em', cursor: 'pointer' , borderBottomWidth: "1px" , color: "#007ad9"}}
                    tooltip="View Policy" tooltipOptions={{ position: 'bottom' }}>
                    {rowData.PolicyNumber}
                </a>
                </p>
            </div>
        )
    }

    formatProcessDetail(rowData){
        return(
            <div className="policy-list-data">
                <p>{rowData.ProcessDetail}</p>
                {/* <p>{rowData.PolicyNumber}</p> */}
            </div>
        )

    }

    formatPhoneNumber(rowData) {
        return (
            <div className="policy-list-data">
                <p><a onClick={()=> this.openContact(rowData)} 
                    style={{ marginRight: '.5em', cursor: 'pointer' , borderBottomWidth: "1px" , color: "#007ad9"}}
                    tooltip="View Contact Deatils" tooltipOptions={{ position: 'bottom' }}>
                    {rowData.PhoneNumber}
                </a></p>
            </div>
        )
    }

    formatClientDetail(rowData){
        return (
            <div className="policy-list-data">
                <p>{rowData.ClientDetail}</p>
            </div>
        )
    }
    
    formatMessage(rowData){
        return (
            <div className="policy-list-data">
                <p>{rowData.Message.substr(0,50)}
                <a onClick={()=>this.viewSMSMessage(rowData)} style={{ marginRight: '.5em', cursor: 'pointer' , borderBottomWidth: "1px" , color: "#007ad9"}}
                    >
                    ...</a></p>
            </div>
        )
    }

    formatStatus(rowData){
        return(
            <div className="policy-list-data">
            <p>{rowData.Status}
                {rowData.Status == 'Failed' ? 
                    <>
                        <i style={{ color: '#ff0000'}} class="fa fa-exclamation-circle" id={"Error"+rowData.SMSSenderId} 
                        aria-hidden="true"></i>
                        <UncontrolledTooltip placement="bottom" target={"Error"+rowData.SMSSenderId}>
                            {rowData.ErrorMsg}    
                        </UncontrolledTooltip>
                    </>
                    :null
                }
            </p>
        </div>
        )
    }

    viewSMSMessage(rowData){
        this.setState({isMessageModalVisible: true , FullMessage: rowData.Message });
    }

    openContact(rowData){        
        window.open(window.location.origin + '/#' + 'viewContactDetails/' + rowData.EntityId + '/' + rowData.EntityType);
    }
    // PolicyDetailsMerged/7e921eb8-f65e-11ea-8832-2da09a23e307/1/1
    openPolicy(rowData){        
        window.open(window.location.origin + '/#' + 'PolicyDetailsMerged/' + rowData.PolicyId + '/1/1');
    }

    export() {
        this.dt.exportCSV();
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


    toggleCustom = (tab) => {
        const prevState = this.state.custom;
        const state = prevState.map((x, index) => tab === index ? !x : false);
        this.setState({ custom: state });
    }

    selectType(value, type) {
        if (type === 'selectedMonth') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ selectedMonth: '' });
            } else {
                this.setState({ selectedMonth: value.value });
            }
        }

        if (type === 'selectedYear') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ selectedYear: '' });
            } else {
                this.setState({ selectedYear: value.value });
            }
        }

        if (type === 'entityType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ entityType: '' });
            } else {
                this.setState({ entityType: value.value });
            }
        }

        if (type === 'processType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ processType: '' });
            } else {
                this.setState({ processType: value.value });
            }
        }

        if (type === 'recepientType') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ recepientType: '' });
            } else {
                this.setState({ recepientType: value.value });
            }
        }

        if (type === 'selectedStatus') {
            if (value === '' || value === undefined || value === null) {
                this.setState({ selectedStatus: '' });
            } else {
                this.setState({ selectedStatus: value.value });
            }
        }

    }
    handleChange = e => {
        const { t } = this.props;
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'selectedFromDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ selectedFromDate: '' });
            } else {
                this.setState({ selectedFromDate: e.target.value, selectedToDate: '' });
            }
        }

        if (e.target.name === 'selectedToDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ selectedToDate: '' });
            } else {
                if (!CommonConfig.isEmpty(this.state.selectedFromDate)) {
                    var isToDateGreater = moment(e.target.value).isSameOrAfter(this.state.selectedFromDate);
                    if (!isToDateGreater) {
                        this.show('selectedToDate', true, 'selectedToDateError', 'To date must be greater then From date.');
                    } else {
                        this.show('selectedToDate', false, 'selectedToDateError', '');
                    }
                } else {
                    this.show('selectedToDate', false, 'selectedToDateError', '');
                }
                this.setState({ selectedToDate: e.target.value });
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
        console.log(this.state.isMonthYear);
        this.setState({ isMonthYear: !this.state.isMonthYear });
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
                    <h1>SMS Report</h1>

                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="input-box" id="accordion">

                    {/* <h5>Search Policy</h5> */}
                    <Card className="mb-0">
                        <CardHeader id="headingOne">
                            <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ custom: !this.state.custom })} aria-expanded={this.state.custom} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">
                                    {"SMS Report"}
                                    <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                </h5>
                            </BTN>
                        </CardHeader>
                        <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Form onSubmit={e => e.preventDefault()}>
                                    

                                        <Row>
                                            <Col md="12">
                                                <Row>
                                                    {(this.state.isMonthYear) ? (
                                                        <Col md="2">
                                                            <div className="input-box">
                                                                <label>Month</label>
                                                                <Input type="select" name="selectedMonth" id="selectedMonth" value={this.state.selectedMonth} onChange={(e) => this.selectType(e.target, 'selectedMonth')}>
                                                                    <option value="">Select Month</option>
                                                                    {this.state.monthArray.map((month, i) => {
                                                                        return (<option value={month.value} key={i}>{month.label}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em id="selectedMonthError" className="error invalid-feedback"></em>
                                                            </div>
                                                        </Col>
                                                    ) : (
                                                            <Col md="2">
                                                                <div className="input-box">
                                                                    <label>From</label>
                                                                    <Input type="date" name="selectedFromDate" id="selectedFromDate"
                                                                        value={this.state.selectedFromDate}
                                                                        onBlur={(e) => this.handleChange(e)}
                                                                        onChange={(e) => this.handleChange(e)} />
                                                                    <em id="selectedFromDateError" className="error invalid-feedback"></em>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    {(this.state.isMonthYear) ? (
                                                        <Col md="2">
                                                            <div className="input-box">
                                                                <label>Year</label>
                                                                <Input type="select" name="selectedYear" id="selectedYear" value={this.state.selectedYear} onChange={(e) => this.selectType(e.target, 'selectedYear')}>
                                                                    <option value="">Select Year</option>
                                                                    {this.state.yearArray.map((year, i) => {
                                                                        return (<option value={year.value} key={i}>{year.label}</option>)
                                                                    })
                                                                    }
                                                                </Input>
                                                                <em id="selectedYearError" className="error invalid-feedback"></em>
                                                            </div>
                                                        </Col>
                                                    ) : (
                                                            <Col md="2">
                                                                <div className="input-box">
                                                                    <label>To</label>
                                                                    <Input type="date" name="selectedToDate" id="selectedToDate"
                                                                        value={this.state.selectedToDate}
                                                                        onBlur={(e) => this.handleChange(e)}
                                                                        onChange={(e) => this.handleChange(e)} />
                                                                    <em id="selectedToDateError" className="error invalid-feedback"></em>
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
                                        </Row>


                                        <Row>
                                            <Col md="2">
                                                <div className="input-box">
                                                    <label>Entity Type</label>
                                                    <Input type="select" name="entityType" id="entityType" value={this.state.entityType} onChange={(e) => this.selectType(e.target, 'entityType')}>
                                                        <option value="">All</option>
                                                        {this.state.entityTypeList.map((x, i) => {
                                                            return (<option value={x.value} key={i}>{x.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="entityTypeError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            <Col md="2">
                                                <div className="input-box">
                                                    <label>Process</label>
                                                    <Input type="select" name="processType" id="processType" value={this.state.processType} onChange={(e) => this.selectType(e.target, 'processType')}>
                                                        <option value="">All</option>
                                                        {this.state.processTypeList.map((x, i) => {
                                                            return (<option value={x.value} key={i}>{x.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="processTypeError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            <Col md="2">
                                                <div className="input-box">
                                                    <label>Recepient Type</label>
                                                    <Input type="select" name="recepientType" id="recepientType" value={this.state.recepientType} onChange={(e) => this.selectType(e.target, 'recepientType')}>
                                                        <option value="">All</option>
                                                        {this.state.recepientTypeList.map((x, i) => {
                                                            return (<option value={x.value} key={i}>{x.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="recepientTypeError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            <Col md="2">
                                                <div className="input-box">
                                                    <label>Status</label>
                                                    <Input type="select" name="selectedStatus" id="selectedStatus" value={this.state.selectedStatus} onChange={(e) => this.selectType(e.target, 'selectedStatus')}>
                                                        <option value="">All</option>
                                                        {this.state.statusList.map((x, i) => {
                                                            return (<option value={x.value} key={i}>{x.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="selectedStatusError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            <Col md="3" className="text-left">
                                            <div className="input-box">
                                            <label></label>
                                                <BTN type="submit" color="success" title="Go" onClick={() => this.getSMSReportList()}> Go </BTN>
                                            </div>
                                            </Col>
                                        </Row>
                                </Form>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable 
                        ref={(el) => this.dt = el} 
                        value={this.state.arr} 
                        first={this.state.selectedPage} 
                        onPage={(e) => this.getPageString(e)}
                        paginator={true} 
                        rows={this.state.rowsPerPage} 
                        totalRecords={this.state.arr.length} 
                        exportFilename="SMS Report"
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
                        {columns}
                    </DataTable>
                </div>
                
                <Modal isOpen={this.state.isMessageModalVisible} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.setState({ isMessageModalVisible: false })}> MessageDetails </ModalHeader>
                    <ModalBody>
                        <Card className="mb-0">
                                    <Row>
                                        <Col>
                                        <div>
                                            {this.state.FullMessage}
                                            {/* <ShowMoreText
                                                lines={2}
                                                more='Show more'
                                                less='Show less'
                                                anchorClass=''
                                                onClick={this.executeOnClick}
                                                expanded={false}>
                                                {notes.NoteText}
                                            </ShowMoreText> */}
                                        </div>
                                        </Col>   
                                    </Row>
                        </Card>
                    </ModalBody>
                </Modal>


            </div>
        );
    }

}

export default withTranslation()(SMSReport);



