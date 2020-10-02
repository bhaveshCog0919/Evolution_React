import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
// import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../../utils/constants';
// import { apiBase } from '../../utils/config';

class VesselTypes extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "classid", header: "Class ID", sortable: true, filter: true, id: 0 },
            { field: "classname", header: "Class Name", sortable: true, filter: true, id: 1 },
            { field: "type", header: "Type", sortable: true, filter: true, id: 2 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 3 }
        ];

        let classnameOption = [
            { StringMapKey: "Barge", StringMapName: "Barge" },
            { StringMapKey: "Dinghy", StringMapName: "Dinghy" },
        ];

        this.state = {
            vesselTypes: [],
            brand: null,
            colors: null,
            heading: 'Add',
            toggleModalDel: false,
            toggleModalAdd: false,
            cols: columns,
            arr: [],
            classname: '',
            type: '',
            className: "Dinghy",
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            // isEdit: false,
            primary: false,
            classnameOption: classnameOption,
            filter: {
                classname: ""
            },
            sales: [
                { classid: '1', classname: 'Barge', type: 'Wide Barge' },
                { classid: '2', classname: 'Motor Cruisers', type: 'Wide Barge' },
                { classid: '3', classname: 'Dinghy', type: 'Pico' },
                { classid: '4', classname: 'Dinghy', type: 'Wide Barge' },
                { classid: '5', classname: 'Barge', type: 'Wide Barge' },
                { classid: '6', classname: 'Motor Cruisers', type: 'Wide Barge' }
            ]
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        // this.export = this.export.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.openModal = this.openModal.bind(this);
     
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {

    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.sales.length) ? l : this.state.sales.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.sales.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    actionTemplate(rowData, column) {

        return <div className="text-center">
            <Button type="button" style={{ margiLeft: '.5em' }} icon="fa fa-pencil" color="primary" onClick={() => this.edit(rowData)} title="Edit" style={{ padding: 2 }}></Button>
            <Button type="button" icon="fa fa-clipboard" color="primary" title="Assumptions" style={{ padding: 2, marginLeft: '.5em' }}></Button>
        </div>;
    }


    selectType = (value, type) => {
        if (type === 'status') {
            var vesselData = this.state.vesselEditData;
            vesselData.Status = value;
            this.setState({ vesselEditData: vesselData });
        }

        if (type === "vesselType") {
            vesselData.vesselType = value;
            this.setState({VesselEditData: vesselData });
            if (value === "System") {
                this.setState({ IsCustomData: true });
            } else {
                this.setState({ IsCustomData: false });
            }
        }

        if (type === 'classname') {
            var filterData = this.state.filter;
            filterData.classname = value;
            this.setState({ filter: filterData });
        }
    }

    openModal() {
        this.setState({
            primary: true
        })
    }

    edit = (rowData) => {
     
        this.setState({
            primary: true,
            heading: 'Update',
            classname: rowData.classname,
            type: rowData.type
        })
    }

    reset = () => {
        this.setState({
            primary: false,
            heading: 'Add'
        })
    }

    export() {
        this.dt.exportCSV();
    }

    save() {

    }


    addVesselTypes = () => {
        this.props.history.push({
            pathname: '/AddVesselTypes'
        });
    }

    render() {

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Vessel Types</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Vessel Types" tooltipOptions={{ position: 'bottom' }} onClick={this.openModal}></Button>
                        {/* <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button> */}
                    </div>
                </div>

                <div className="basic-header">
                    <div style={{ width: "100%" }}>
                        <Col xs="12" md="12">
                            <div className="rc-inline" style={{ textAlign: "left" }}>
                             
                                <div style={{ display: "inline-block" }}>
                                    <label >
                                        Class Name
                                    </label>
                                    <label >
                                        <Input type="select" name="classname" id="classname" onChange={(e) => this.selectType(e.target.value, 'classname')} value={this.state.filter.classname}>
                                            <option value='' disabled={"disabled"}>Select class name</option>
                                            {this.state.classnameOption.map((ct, i) => {
                                                return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                            })
                                            }
                                        </Input>
                                    </label>
                                </div>
                               
                                <label>
                                    <BTN color="success" style={{ marginRight: '.5em', borderRadius: "20px" }} onClick={() => this.getEndorsementListData()} title="Go"> Go </BTN>
                                    {/* <BTN color="primary" style={{ marginRight: '.5em', borderRadius: "20px" }} onClick={() => this.ClearFilter()} title="Go"> Clear </BTN> */}
                                </label>
                            </div>
                        </Col>
                    </div>
                </div>

                <div className="table-custom">
                    {/* <div className="header-right-option"> */}
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.sales}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
               
                        paginator={true}
                        rows={this.state.rowsPerPage}
                   
                        totalRecords={this.state.arr.length}
                        exportFilename="Vessel Types List"
                        currentPageReportTemplate={this.state.str}
                       
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        // scrollable={true}
                        scrollHeight="340px">
                        {columns}
                    </DataTable>

                    <Row>
                        <Col>
                            <Modal isOpen={this.state.primary} toggle={this.reset}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.reset}>{this.state.heading} Vessel Type</ModalHeader>

                                <ModalBody>
                                    <form className="form" action="#">
                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="4" className="pull-right">
                                                <label for="">Vessel ID</label>
                                            </Col>

                                            <Col md="6">
                                                <InputGroup>
                                                {this.state.classId}                                                 
                                                </InputGroup>
                                            </Col>

                                            <Col md="2" className="text-right">
                                                {/* <BTN color="primary" type="button">
                                                    <i className="fa fa-clipboard-check"></i>
                                                </BTN> */}
                                                <Button type="button" icon="fa fa-clipboard-check" tooltip="Add Vessel Types" tooltipOptions={{ position: 'bottom' }}></Button>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="4" className="pull-right">
                                                <label for="">Class Name</label>
                                            </Col>
                                            <Col md="8">
                                                <InputGroup>
                                                    <Input type="text" name="classname " id="classname" onChange={e => this.handleChange(e)} placeholder="Class Name" value={this.state.classname} />
                                                    <em className="error invalid-feedback"> Please enter class name </em>
                                                </InputGroup>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="4" className="pull-right">
                                                <label for="">Vessel Type</label>
                                            </Col>
                                            <Col md="8">
                                                <InputGroup>
                                                    <Input type="text" name="type" id="type" onChange={e => this.handleChange(e)} placeholder="Vessel" value={this.state.type} />
                                                    <em className="error invalid-feedback"> Please enter vessel type </em>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </form>

                                </ModalBody>
                                <ModalFooter>
                                    <BTN color="primary" onClick={this.save}><i class="fa fa-check"></i> Save</BTN>{' '}
                                    <BTN color="secondary" onClick={this.reset}><i class="fa fa-angle-left"></i> Back</BTN>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>

                </div>
            </div >
        );
    }
}

export default VesselTypes;