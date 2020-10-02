import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import APIConstant from '../../utils/constants';
import { CommonConfig } from '../../utils/constants';
import api from '../../utils/apiClient';
import moment from 'moment';
import { toast } from 'react-toastify';


class BinderManage extends Component {
    constructor(props) {
        super(props);
        let columns = [
            { field: "BinderCode", header: "Binder Code", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "UMRN", header: "UMRN", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "BinderName", header: "Binder Name", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "InsuranceCompanyName", header: "Insurance Company", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "LiveStartDate", header: "Start / End Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "RunoffStartDate", header: "Runoff Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "IsRated", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "GrossCommission", header: "Loss Ratio", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 10 }
        ];

        this.state = {
            selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            binderArray: [],
            binderOriginalArray: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
    }

    
    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.binderArray.length) ? l : this.state.binderArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.binderArray.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    export() {
        this.dt.exportCSV();
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.editBinder(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.deleteBinder(rowData)} tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button> */}
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" onClick={() => this.openDeleteModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
        </div>;
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getBinderList()
    }

    getBinderList() {
        let data = {}
        api.post(APIConstant.path.getBinder, data).then(res => {
            console.log(res)
            if (res.success) {
                console.log("===========Binder List Data")
                console.log(res.data)
                this.setState({
                    binderOriginalArray:res.data,
                    binderArray: res.data.map((obj) => {
                        return {
                            "BinderId":obj.BinderId,
                            "BinderCode":obj.BinderCode,
                            "UMRN":obj.UMRN,
                            "BinderName": obj.BinderName,
                            "InsuranceCompanyId":obj.InsuranceCompanyId,
                            "InsuranceCompanyName":obj.InsuranceCompanyName,
                            "LiveStartDate":'(' + (obj.LiveStartDate != null ? moment(obj.LiveStartDate).format(CommonConfig.dateFormat.forDatePicker) : '') + ')' + "- (" + (obj.LiveEndDate != null ? moment(obj.LiveEndDate).format(CommonConfig.dateFormat.forDatePicker) : '') + ")",
                            "RunoffStartDate":'(' + (obj.RunoffStartDate != null ? moment(obj.RunoffStartDate).format(CommonConfig.dateFormat.forDatePicker) : '') + ')' + "- (" + (obj.RunoffEndDate != null ? moment(obj.RunoffEndDate).format(CommonConfig.dateFormat.forDatePicker) : '') + ")",
                            "IsRated":obj.IsRated.data[0] == 0 ? "Non Rated" : "Rated",
                            "Status":obj.Status,
                            "GrossCommission":obj.GrossCommission,
                        }
                    })
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    openDeleteModal = (rowData) => {
        debugger;
        this.setState({
            toggleModal: !this.state.toggleModal,
            BinderId: rowData.BinderId,
            BinderUMRN: rowData.UMRN,
            BinderNumber: rowData.BinderCode,
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            BinderId: "",
            BinderUMRN: "",
            BinderNumber: "",
        });
    }

    deleteBinder() {
        let data = {
            "BinderId": this.state.BinderId,
            "UserId": CommonConfig.loggedInUserId()
        }
        api.post(APIConstant.path.deleteBinder, data).then(res => {
            if (res.success) {
                if(res.data[0][0].ErrorMsg !== ""){
                    console.log(res.data[0][0])
                    toast.error(res.data[0][0].ErrorMsg);
                } else {
                    toast.success("Binder successfully deleted");
                }
                this.getBinderList();
                this.toggleLarge();
                
            }
        }).catch(err => {
            console.log(err)
        })
    }

    editBinder(event) {
        let index = this.state.binderArray.findIndex(x => x.BinderId === event.BinderId);
        if (index !== -1) {
            let originaldata = this.state.binderOriginalArray[index]
            this.props.history.push({
                pathname: '/Master/AddUpdateBinder/'+ event.BinderId,
                search: '',
                state: { BinderData: originaldata }
              })
        }
    }

    addBinder() {
        this.props.history.push('/Master/AddUpdateBinder/'+ "");
    }

    render() {
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
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter}  filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Binders</h1>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        <Button type="button" icon="pi pi-plus" tooltip="Add Binder" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addBinder()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                <DataTable ref={(el) => this.dt = el} value={this.state.binderArray} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} header={header} totalRecords={this.state.binderArray.length} exportFilename="Task List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                        scrollable={true} scrollHeight="265px">
                        {columns}
                    </DataTable>
                </div>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete Binder</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.BinderNumber} - {this.state.BinderUMRN} Binder?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.deleteBinder()}><i class="fa fa-check"></i> Delete</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default withTranslation()(BinderManage);