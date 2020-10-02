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


class Contact_Missing_Report extends Component {

    constructor(props) {
        super(props);

        let columns = [
             /*{ body: this.actionTemplate.bind(this), field: "Select", header: "Select", sortable: false, id: "checkbox", style: { 'width': '45px' } },
           { field: "Action", header: "Action", sortable: true, filter: true, id: 1, style: { 'width': '45px' } },*/
            { field: "ContactCode", header: "Contact Code", sortable: true, filter: true, id: 1, style: { 'width': '45px' } },
            { field: "ContactName", header: "Contact Name", sortable: true, filter: true, id: 2, style: { 'width': '100px' } },
            { field: "ContactCategory", header: "Contact Category", sortable: true, filter: true, id: 3, style: { 'width': '85px' } },
            { field: "ContactType", header: "Contact Type", sortable: true, filter: true, id: 4, style: { 'width': '125px' } },
            { field: "Email", header: "Email", sortable: true, filter: true, id: 5, style: { 'width': '125px' } },
            { field: "Phone", header: "Phone", sortable: true, filter: true, id: 6, style: { 'textAlign': 'right','width': '85px'  } },
            { field: "CreatedBy", header: "Created By", sortable: true, filter: true, id: 7, style: { 'textAlign': 'right','width': '85px'  } },
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

            DebtorType: 'SubAgent',
            Period: 0,
            selected: {},
            selectedPolicy: 0,
            selectedAgent: '',
            selectAll: 0,
            DebtorTypeError: false,
            agentinfo: '',
            agentinfoError: false,
            monthtillDate: moment().format("YYYY-MM"),
            fromDate: moment().format("YYYY-MM-DD"),
            toDate: moment().format("YYYY-MM-DD"),
            CONTACTTYPEList: [],
            MONTH: ('0'+(new Date().getMonth() + 2).toString()).slice(-2),
            MONTHError: false,
            CONTACTTYPE:'All',
            Year: '',
            YearError: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.export = this.export.bind(this);
    }

    componentDidMount() {
        this.Contact_Missing_Report(this.state.CONTACTTYPE);
        this.getDropDownValues('CONTACTTYPE', 'CONTACTTYPEList');
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
    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected,
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
                <p>({rowData.SourceName})</p>
            </div>
        ;
    }
    ColumnclassName(rowData,Column) {
 
  
        return (rowData.DaysOutstanding <=7)? <div style={{backgroundColor:'#008c9a',color:'#fff'}} className = "policy-list-data">
        <p>{rowData.ProjectedPremium}</p>     
    </div> :<div className = "policy-list-data" >
                 <p>{rowData.ProjectedPremium}</p>     
             </div>;
        
            
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


    Contact_Missing_Report() {
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
           CONTACTTYPE : this.state.CONTACTTYPE,
        };
       
        api.post('api/Contact_Missing_Report', data).then(res => {
            debugger
            if (res.success) {
                console.log("resdata......",res);
                var formattedData = [];
                this.setState({
                    selectedPage: 0
                });
                var dataLength = res.data[0].length;
                if (dataLength > 0) {
                    for (let i = 0; i < dataLength; i++) {
                        var tempData = res.data[0][i];
                        console.log("tempData", tempData);
                        formattedData.push({
                            id:i,
                            ContactId: tempData.ContactId,
                            ContactCategory: tempData.EntityType,
                            ContactName: tempData.ContactName,
                            ContactType: tempData.ContactType,
                            ContactCode: tempData.ContactCode,
                            Email: tempData.Email,
                            Phone: tempData.Phone,
                            CreatedBy: tempData.CreatedBy
                            });
                    }

                }
                console.log("formattedData...", formattedData);
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
        this.Contact_Missing_Report(this.state.CONTACTTYPE);
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

        if (type === 'agentinfo') {

            this.setState({ agentinfo: value, agentinfoError: false });
            this.show('agentinfo', false, 'agentinfoError', '');

        }

        if (type === 'Period') {
            this.setState({ Period: value });
        }

        if (type === 'CONTACTTYPE') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CONTACTTYPEError: true, CONTACTTYPE: value });
                this.show('CONTACTTYPE', true, "CONTACTTYPEError", "Please select policy type");
            } else {
                this.setState({ CONTACTTYPEError: false, CONTACTTYPE: value });
                this.show('CONTACTTYPE', false, "CONTACTTYPEError", "");

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

    ReferrData(){
        var data = {
                   };
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
                    <h1>Contact with missing Phone and Email</h1>
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
                                        <Col md='3'>
                                            <label>Contact Type</label>
                                            <Input type="select" name="CONTACTTYPE" id="CONTACTTYPE" onChange={(e) => this.selectType(e.target.value, 'CONTACTTYPE')} value={this.state.CONTACTTYPE}>
                                            <option value='All'>All</option>
                                                {this.state.CONTACTTYPEList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="MONTHError" className="error invalid-feedback"></em>
                                        </Col>
                                       
                                        <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.filterData()}> Search </BTN>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {/* <Col md='3'>
                                            <label>Month</label>
                                            <Input type="select" name="MONTH" id="MONTH" onChange={(e) => this.selectType(e.target.value, 'MONTH')} value={this.state.MONTH}>
                                                {this.state.MONTHList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="MONTHError" className="error invalid-feedback"></em>
                                        </Col> */}

                                       {/*} <Col md='2'>
                                            <div>&nbsp;</div>
                                            <BTN color="success" title="Search" onClick={() => this.ReferrData()}> Refer </BTN>
                                    </Col>*/}
                                    </Row>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.arr.length} exportFilename="Contact Missing Report"
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



export default withTranslation()(Contact_Missing_Report);
