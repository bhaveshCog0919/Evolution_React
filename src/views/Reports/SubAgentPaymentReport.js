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

class SubAgentPaymentReport extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "TransactionDate", header: "TransactionDate", sortable: true, filter: true, id: 0, style: { 'width': '100px' } },
            { field: "UniqueReferenceId", header: "UniqueReferenceId", sortable: true, filter: true, id: 1, style: { 'width': '60px' } },
            { field: "TotalAmountPaidInBatch", header: "TotalAmountPaidInBatch", sortable: true, filter: true, id: 2, style: { 'width': '80px' } },
            { field: "PaymentMode", header: "PaymentMode", sortable: true, filter: true, id: 3, style: { 'width': '80px' } },
            { field: "PolicyNumber", header: "PolicyNumber", sortable: true, filter: true, id: 4, style: { 'width': '80px' } },
            { field: "ClientName", header: "ClientName", sortable: true, filter: true, id: 5, style: { 'width': '100px' } },
            { field: "ClientDue", header: "ClientDue", sortable: true, filter: true, id: 6, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "Commission", header: "Commission", sortable: true, filter: true, id: 7, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "NetDue", header: "NetDue", sortable: true, filter: true, id: 8, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "AmountPaid", header: "AmountPaid", sortable: true, filter: true, id: 9, style: { 'width': '60px', 'textAlign': 'right' } },
            { field: "PolicyAccountReferenceId", header: "PolicyAccountReferenceId", sortable: true, filter: true, id: 12, style: { 'width': '60px', 'textAlign': 'right' } },
        ];
     
        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            showcol2: false,
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
            newEntryDate: '',
            newEntryDateError: false,
            paymentMode: '',
            paymentModearr: [],
            paymentModeError: false,
            note: '',
            DebtorType: 'SubAgent',
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

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.getOrganazationData('SubAgent');
    }


    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
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
                checked={this.state.selected[rowData.id] === true}
                onChange={() => this.toggleRow(rowData.id)} />
        </div>;
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

    SubAgentPaymentReport() {
        var data = {
            DebtorType: this.state.DebtorType ? this.state.DebtorType : '',
            agentinfo: this.state.agentinfo ? this.state.agentinfo : '',
            tillDate: this.state.tillDate ? this.state.tillDate : ''
        };
        api.post('api/SubAgentPaymentReport', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {

                    var AmountPaid = 0;
                    var ClientDue = 0;
                    var Commission = 0;
                    var NetDue = 0;
                    var TotalAmountPaidInBatch = 0;

                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        formattedData.push({
                            id: i,
                            AmountPaid: tempData.AmountPaid,
                            ClientDue: tempData.ClientDue,
                            ClientName: tempData.ClientName,
                            Commission: tempData.Commission,
                            NetDue: tempData.NetDue,
                            PaymentMode: tempData.PaymentMode,
                            PolicyAccountReferenceId: tempData.PolicyAccountReferenceId,
                            PolicyNumber: tempData.PolicyNumber,
                            TotalAmountPaidInBatch: tempData.TotalAmountPaidInBatch,
                            TransactionDate: moment(tempData.TransactionDate).format('DD/MM/YYYY'),
                            UniqueReferenceId: tempData.UniqueReferenceId,
                        });
                        AmountPaid = AmountPaid + tempData.AmountPaid;
                        Commission = Commission + tempData.Commission;
                        ClientDue = ClientDue + tempData.ClientDue;
                        NetDue = NetDue + tempData.NetDue;
                        TotalAmountPaidInBatch = TotalAmountPaidInBatch + tempData.TotalAmountPaidInBatch;
                    }
                    formattedData.push({
                        TransactionDate: 'Total',
                        AmountPaid: parseFloat(AmountPaid).toFixed(2),
                        ClientDue: parseFloat(ClientDue).toFixed(2),
                        Commission: parseFloat(Commission).toFixed(2),
                        NetDue: parseFloat(NetDue).toFixed(2),
                        TotalAmountPaidInBatch: parseFloat(TotalAmountPaidInBatch).toFixed(2)
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
            toast.error("Select Sub Agent First");
        } else {
            this.SubAgentPaymentReport();
        }
    }
    onRadioBtnClick(e) {
        this.setState({
            radioSelected: e.target.checked,
            agentinfo: ''
        });
        this.state.agentinfo = '';
        this.SubAgentPaymentReport();
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

            this.setState({ agentinfo: value, radioSelected: false, DebtorType: 'SubAgent' });

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


    render() {
        const { t } = this.props;
        var header = null;
        let columns = '';
      
            columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
                />;
            });
            return (
                <div>
                    <div className="basic-header">
                        <h1>Sub Agent Payment Report</h1>
                        <div md="3" className="header-right-option" >
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
                                        Search Sub Agent
                        <i style={{ float: 'right' }} className={this.state.custom ? "fa fa-chevron-down" : "fa fa-chevron-up"}></i>
                                    </h5>
                                </BTN>
                            </CardHeader>
                            <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>
                                    <div className="filter-data">
                                        <Row> <Col md="3">
                                            <label>Select Agent</label>
                                            <Select name="agentinfo" id="agentinfo" options={this.state.sourceList}
                                                value={this.state.agentinfo} onChange={(data) => this.selectType(data, 'agentinfo')}
                                            />
                                        </Col>
                                         {/* <Col md="3">
                                                <label>
                                                    <Input type="checkbox" name="radioSelected"
                                                        checked={this.state.radioSelected}
                                                        value={this.state.radioSelected}
                                                        onChange={(e) => this.onRadioBtnClick(e)}
                                                    /> All Agent</label>
                                            </Col> */}
                                            <Col md="2">
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
                            paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Sub Agent Payment Report"
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

    export default withTranslation()(SubAgentPaymentReport);
