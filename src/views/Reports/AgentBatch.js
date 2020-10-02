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
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';


class AgentBatch extends Component {

    constructor(props) {
        super(props);

        let columns = [
            { field: "AgentName", header: "Agent Name", sortable: true, filter: true, id: 0 },
            { field: "NumberOfPolicy", header: "Number Of Policy", sortable: true, filter: true, id: 1 },
            { field: "TotalPremium", header: "Total Premium", sortable: true, filter: true, id: 2 ,style:{'textAlign':'right'}},
            { field: "TotalAgentAmount", header: "Total Agent Amount", sortable: true, filter: true, id: 3 ,style:{'textAlign':'right'}},
            // { field: "TotalReceivabeYachtsmanAmount", header: "Total Receivabe Yachtsman Amount", sortable: true, filter: true, id: 4 },
            { field: "Action", header: "Action", sortable: true, filter: true, id: 5 },
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

            DebtorType: 'All',
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

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.AgentBatch();
        this.getOrganazationData(this.state.DebtorType);
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

    AgentBatch() {
        var data = {
            DebtorType: this.state.DebtorType?this.state.DebtorType:'',
            agentinfo: this.state.agentinfo?this.state.agentinfo:'',
            tillDate: this.state.tillDate?this.state.tillDate:''
        };
        api.post('api/AgentBatch', data).then(res => {
            if (res.success) {
                var formattedData = [];
                this.setState({
                    selectedPage:0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {
                    var NumberOfPolicy = 0;
                    var TotalPremium = 0;
                    var TotalAgentAmount = 0;
                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        NumberOfPolicy=tempData.NumberOfPolicy+NumberOfPolicy;
                        TotalPremium=tempData.TotalPremium+TotalPremium;
                        TotalAgentAmount=tempData.TotalAgentAmount+TotalAgentAmount;
                        formattedData.push({
                            AgentName: tempData.SourceName,
                            NumberOfPolicy: tempData.NumberOfPolicy,
                            TotalPremium:   parseFloat(tempData.TotalPremium?tempData.TotalPremium:0).toFixed(2),
                            TotalAgentAmount: parseFloat(tempData.TotalAgentAmount?tempData.TotalAgentAmount:0).toFixed(2),
                        //    TotalReceivabeYachtsmanAmount: tempData.TotalReceivabeYachtsmanAmount
                        });
                    }
                    formattedData.push({
                        AgentName: 'Total',
                        NumberOfPolicy: NumberOfPolicy,
                        TotalPremium:  parseFloat(TotalPremium?TotalPremium:0).toFixed(2),
                        TotalAgentAmount:  parseFloat(TotalAgentAmount?TotalAgentAmount:0).toFixed(2)
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
    
            this.AgentBatch();
       
    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'tillDate') {
      
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

                this.setState({ agentinfo: value, agentinfoError: false });
                this.show('agentinfo', false, 'agentinfoError', '');
         
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

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} style={col.style}
            />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Agent Batch Statement</h1>
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
                                    Search Agent
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
                                                    {/* {this.state.DebtorTypeList.map((type, i) => {
                                        return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                    }) */}
                                    }
                                </Input>
                                            </div>
                                        </Col>
                                        {/* <Col md='2'>
                                            <div className="input-box">
                                                <label>Till Date</label>
                                                <Input disabled type="month" id="tillDate" name="tillDate"
                                                    value={this.state.tillDate}
                                                    onChange={(e) => this.handleChange(e, 'tillDate')}
                                                ></Input>
                                            </div>
                                        </Col> */}
                                        <Col md='3'>
                                            <div className="input-box">
                                                <label>Agent Name/Code</label>
                                                <Select name="agentinfo" id="agentinfo" options={this.state.sourceList}
                                                    value={this.state.agentinfo} onChange={(data) => this.selectType(data, 'agentinfo')}
                                                // placeholder={t("policyUnderwriting:Source.defaultValue")}
                                                // disabled={this.state.sourceDisable == true ? true : false}
                                                />
                                           </div>
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
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Agent Batch Statement"
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


export default withTranslation()(AgentBatch);
