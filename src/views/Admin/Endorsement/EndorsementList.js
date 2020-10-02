import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import APIConstant from '../../../utils/constants';

class EndorsementList extends Component {
    constructor() {
        super();

        this.onColumnToggle = this.onColumnToggle.bind(this);

        let columns = [
            { field: "EndorsementType", header: "EndorsementType", sortable: true, filter: true, id: 0 },
            { field: "EndorsementNumber", header: "Number", sortable: true, filter: true, id: 1 },
            { field: "EndorsementTitle", header: "Title", sortable: true, filter: true, id: 2 },
            { field: "Status", header: "Status", sortable: true, filter: true, id: 3 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 4 }
        ];

        let classnameOption = [
            { StringMapKey: "Barge", StringMapName: "Barge" },
            { StringMapKey: "Dinghy", StringMapName: "Dinghy" },
        ];

        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.export = this.export.bind(this);

        this.state = {
            PolicyId: 'bef076c0-2ea5-11ea-a563-fa163eb9754c',
            cols: columns,
            EndorsementData: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            toogleEditModal: false,
            EndorsementEditData: {},
            status: [],
            toogleAddModal: false,
            EndorsementType: [],
            IsCustomData: true,
            titleError: true,
            classId: 2,
            className: "Dinghy",
            classnameOption: classnameOption,
            filter: {
                radioSelected: "",
                classname: ""
            },
            showSorting: false,
            lastEndorsementSystemNumber: "",
        };
        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    OpenModal = (data) => {
        console.log(data);
        this.setState({ toogleEditModal: !this.state.toogleEditModal, EndorsementEditData: data, titleError: false });
    }

    AddOpenModal = () => {
        var EndorsementData = this.state.EndorsementEditData;
        EndorsementData.EndorsementType = "System";
        EndorsementData.Status = "Active";
        this.setState({ EndorsementEditData: EndorsementData });
        this.setState({ toogleAddModal: !this.state.toogleAddModal, titleError: true });
    }

    toggleEdit = () => {
        this.setState({ toogleEditModal: false, EndorsementEditData: {} });
    }

    toggleAdd = () => {
        this.setState({ toogleAddModal: false, EndorsementEditData: {} });
    }

    componentDidMount() {
        this.getTimelineDetails();
        // this.getEndorsementListData();
        this.getEndorsementNumber();
        this.showSortingData();
        this.getEndorsementTypeOptions();
        this.getEndorsementStatusOptions();
    }

    getEndorsementTypeOptions() {
        try {
            const data = {
                stringmaptype: 'ENDORESMENTTYPEOPTION'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                console.log("ENDORESMENTTYPEOPTIONnnnnn", res);
                if (res.success) {
                    console.log("ENDORESMENTTYPEOPTION", res.data);
                    this.setState({ EndorsementType: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getEndorsementStatusOptions() {
        try {
            const data = {
                stringmaptype: 'ENDORESMENTSTATUSOPTION'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ status: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getTimelineDetails() {
        var formattedData = [];
        let firstPage = (formattedData.length) ? '1' : '0';
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
    }

    getEndorsementListData = () => {
        this.showSortingData();
        let data = { PolicyId: this.state.PolicyId, Filter: this.state.filter } //Static policy ID
        api.post('api/getEndorsementListData', data).then(res => {
            if (res.success) {
                res.data.forEach(list => {
                    list.className = "Dinghy";
                });
                this.setState({ EndorsementData: res.data });
            } else {
            }
        }).catch(err => {

        });
    }

    getEndorsementNumber = () => {
        let data = { PolicyId: this.state.PolicyId } //Static policy ID
        api.post('api/getEndorsementNumber', data).then(res => {
            if (res.success) {
                var EndorsementData = this.state.EndorsementEditData;
                EndorsementData.EndorsementNumber = res.data[0].EndorsementNumber + 1;
                this.setState({ EndorsementEditData: EndorsementData, lastEndorsementSystemNumber: res.data[0].EndorsementNumber });
            } else {
            }
        }).catch(err => {

        });
    }

    showSortingData = () => {
        if (this.state.filter.radioSelected == "System" && this.state.filter.classname !== "") {
            this.setState({ showSorting: true });
        } else {
            this.setState({ showSorting: false });
        }
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" className="p-button-warning" icon="pi pi-pencil" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} onClick={() => this.OpenModal(rowData)} style={{ marginRight: "5px" }}></Button>
            {(this.state.showSorting && rowData.SortOrder !== this.state.lastEndorsementSystemNumber) ? (
                <Button type="button" icon="pi pi-sort-down" tooltip="Move Down" tooltipOptions={{ position: 'bottom' }} onClick={() => this.MoveData(rowData, "Down")} style={{ marginRight: "5px" }}></Button>
            ) : (
                    <label></label>
                )}
            {(this.state.showSorting && rowData.SortOrder !== 1) ? (
                <Button type="button" icon="pi pi-sort-up" tooltip="Move Up" tooltipOptions={{ position: 'bottom' }} onClick={() => this.MoveData(rowData, "Up")}></Button>
            ) : (
                    <label></label>
                )}
        </div>;
    }

    MoveData(rowData, moveKey) {
        var UpdateSortingDataList = [];
        var EndorsementListData = this.state.EndorsementData;
        var rowIndex = EndorsementListData.findIndex(EndorsementListData => EndorsementListData.SystemEndorsementId === rowData.SystemEndorsementId);
        if (moveKey == "Up") {
            var sortOrderTemp = EndorsementListData[rowIndex].SortOrder;
            var sortOrderTemp1 = EndorsementListData[rowIndex - 1].SortOrder;
            EndorsementListData[rowIndex].SortOrder = sortOrderTemp1;
            EndorsementListData[rowIndex - 1].SortOrder = sortOrderTemp;
            UpdateSortingDataList.push(EndorsementListData[rowIndex]);
            UpdateSortingDataList.push(EndorsementListData[rowIndex - 1]);
        } else if (moveKey == "Down") {
            var sortOrderTemp = EndorsementListData[rowIndex].SortOrder;
            var sortOrderTemp1 = EndorsementListData[rowIndex + 1].SortOrder;
            EndorsementListData[rowIndex].SortOrder = sortOrderTemp1;
            EndorsementListData[rowIndex + 1].SortOrder = sortOrderTemp;
            UpdateSortingDataList.push(EndorsementListData[rowIndex]);
            UpdateSortingDataList.push(EndorsementListData[rowIndex + 1]);
        }
        this.setState({ EndorsementData: EndorsementListData });
        this.UpdateEndorsmentSorting(UpdateSortingDataList);
    }

    UpdateEndorsmentSorting(UpdateSortingDataList) {
        console.log(UpdateSortingDataList);
        api.post('api/UpdateSystemEndorsmentSortingData', UpdateSortingDataList).then(res => {
            if (res.success) {
                this.getEndorsementListData();
            } else {
            }
        }).catch(err => {
        });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.EndorsementData.length) ? l : this.state.EndorsementData.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.EndorsementData.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    selectType = (value, type) => {
        if (type == 'status') {
            var EndorsementData = this.state.EndorsementEditData;
            EndorsementData.Status = value;
            this.setState({ EndorsementEditData: EndorsementData });
        }

        if (type == "EndorsementType") {
            var EndorsementData = this.state.EndorsementEditData;
            EndorsementData.EndorsementType = value;
            this.setState({ EndorsementEditData: EndorsementData });
            if (value == "System") {
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

        if (type === 'vesselclass') {
            var EndorsementData = this.state.EndorsementEditData;
            EndorsementData.VesselClass = value;
            this.setState({ EndorsementEditData: EndorsementData });
        }
    }

    handleChange = (e) => {
        if (e.target.name === 'title') {
            var EndorsementData = this.state.EndorsementEditData;
            EndorsementData.EndorsementTitle = e.target.value;
            if (EndorsementData.EndorsementType == 'Custom') {
                EndorsementData.CustomEndorsementTitle = e.target.value;
            }
            this.setState({ EndorsementEditData: EndorsementData });
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ titleError: true });
                this.show("title", true);
            } else {
                this.setState({ titleError: false });
                this.show("title", false);
            }
        }
    }

    onRadioBtnClick(radioType, radioSelected) {
        if (radioType === 'endorsement_type_filter') {
            var filterData = this.state.filter;
            filterData.radioSelected = radioSelected;
            this.setState({ filter: filterData });
        }

        if (radioType == "EndorsementTypeAdd") {
            this.getEndorsementNumber();
            var EndorsementData = this.state.EndorsementEditData;
            EndorsementData.EndorsementType = radioSelected;
            this.setState({ EndorsementEditData: EndorsementData });
            if (radioSelected == "System") {
                this.setState({ IsCustomData: true });
            } else {
                this.setState({ IsCustomData: false });
            }
        }
    }

    export() {
        this.dt.exportCSV();
    }

    saveEndrosement = () => {
        if (this.state.titleError == false) {
            let data = {
                Endorsement: this.state.EndorsementEditData,
                PolicyId: this.state.PolicyId
            }
            if (this.state.EndorsementEditData.EndorsementType == 'System') {
                api.post('api/addSystemEndorsementData', data).then(res => {
                    if (res.success) {
                        this.setState({ toogleEditModal: false });
                        this.setState({ toogleAddModal: false });
                        this.getEndorsementNumber();
                        this.getEndorsementListData();
                        toast.success(res.data.message);
                    } else {

                    }
                }).catch(err => {
                });
            } else if (this.state.EndorsementEditData.EndorsementType == 'Custom') {
                api.post('api/addCustomEndorsementsData', data).then(res => {
                    if (res.success) {
                        this.setState({ toogleEditModal: false });
                        this.setState({ toogleAddModal: false });
                        this.getEndorsementNumber();
                        this.getEndorsementListData();
                        toast.success(res.data.message);
                    }
                }).catch(err => {
                    console.log('errrr');
                });
            }
        } else {
            this.show("title", true);
        }
    }

    render() {
        console.log("this.state", this.state);

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Endorsement List</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Endorsement" tooltipOptions={{ position: 'bottom' }} onClick={() => this.AddOpenModal()}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>
                <div className="basic-header">
                    <div style={{ width: "100%" }}>
                        <Col xs="12" md="12">
                            <div className="rc-inline" style={{ textAlign: "left" }}>
                                <label>Endorsement Type</label>
                                {this.state.EndorsementType.map((value, index) => {
                                    console.log(value);
                                    return (
                                        <label>
                                            <Input type="radio" name="endorsement_type_filter" checked={(this.state.filter.radioSelected === value.StringMapName) ? true : false}
                                                value={this.state.filter.radioSelected} onChange={() => this.onRadioBtnClick('endorsement_type_filter', value.StringMapName)}
                                            />
                                            {value.StringMapName}
                                        </label>
                                    )
                                })}
                                {(this.state.filter.radioSelected == "System") ? (
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
                                ) : (
                                        <div style={{ display: "inline-block" }}></div>
                                    )}
                                <label>
                                    <BTN color="success" style={{ marginRight: '.5em', borderRadius: "20px" }} onClick={() => this.getEndorsementListData()} title="Go"> Go </BTN>
                                </label>
                            </div>
                        </Col>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.EndorsementData} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.EndorsementData.length} exportFilename="Task List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                        scrollable={true} scrollHeight="265px">
                        {columns}
                    </DataTable>

                    <Modal isOpen={this.state.toogleEditModal} toggle={() => this.toggleEdit('save')}
                        className={'modal-lg ' + this.props.className}>
                        <ModalHeader toggle={() => this.toggleEdit('save')}>Edit Endorsement</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md="3">
                                    <b>Endorsement Type:</b>
                                </Col>
                                <Col md="9">
                                    {this.state.EndorsementType.map((value, index) => {
                                        console.log(value);
                                        return (
                                            <label style={{ marginRight: "30px" }} >
                                                <Input type="radio" disabled="true" name="EndorsementTypeEdit" checked={(this.state.EndorsementEditData.EndorsementType === value.StringMapName) ? true : false}
                                                    value={this.state.filter.radioSelected}
                                                />
                                                {value.StringMapName}
                                            </label>
                                        )
                                    })}
                                </Col>
                            </Row>
                            {(this.state.EndorsementEditData.EndorsementType != "Custom") ? (
                                <Row style={{ marginTop: "10px" }}>
                                    <Col md="2">
                                        <b>Veseel Class:</b>
                                    </Col>
                                    <Col md="4">
                                        <Input type="select" name="vesselclass" id="vesselclass" onChange={(e) => this.selectType(e.target.value, 'vesselclass')} value={this.state.EndorsementEditData.VesselClass}>
                                            <option value='' disabled={"disabled"}>Select class name</option>
                                            {this.state.classnameOption.map((ct, i) => {
                                                return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                            })
                                            }
                                        </Input>
                                    </Col>
                                    <Col md="4">
                                        <b>Class Id:</b> {this.state.classId}
                                    </Col>

                                </Row>
                            ) : (
                                    <div></div>
                                )}
                            {(this.state.EndorsementEditData.EndorsementType != "Custom") ? (
                                <Row style={{ marginTop: "10px" }}>
                                    <Col md="2">
                                        <b>Number</b>
                                    </Col>
                                    <Col md="10">
                                        <Input type="text" name="number" id="number" onChange={(e) => this.handleChange(e)} value={this.state.EndorsementEditData.EndorsementNumber} disabled={"disabled"}>
                                        </Input>
                                    </Col>
                                </Row>
                            ) : (
                                    <div></div>
                                )}
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="2">
                                    <b>Title</b>
                                </Col>
                                <Col md="10">
                                    <Input type="text" name="title" id="title" onChange={(e) => this.handleChange(e)} value={this.state.EndorsementEditData.EndorsementTitle}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter endorsement title</em>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col md="2">
                                    <b>Status</b>
                                </Col>
                                <Col md="10">
                                    <Input type="select" name="status" id="status" onChange={(e) => this.selectType(e.target.value, 'status')} value={this.state.EndorsementEditData.Status}>
                                        <option value='' disabled={"disabled"}>Select status</option>
                                        {this.state.status.map((ct, i) => {
                                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                </Col>
                            </Row>

                        </ModalBody>
                        <ModalFooter>
                            <BTN color="success" onClick={() => this.saveEndrosement()}><i class="fa fa-check"></i> Update</BTN>{' '}
                            <BTN color="primary" onClick={() => this.toggleEdit('save')}><i class="fa fa-angle-left"></i> Cancel</BTN>

                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.toogleAddModal} toggle={() => this.toggleAdd('save')}
                        className={'modal-lg ' + this.props.className}>
                        <ModalHeader toggle={() => this.toggleAdd('save')}>Add Endorsement</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md="3">
                                    <b>Endorsement Type:</b>
                                </Col>
                                <Col md="9">
                                    {this.state.EndorsementType.map((value, index) => {
                                        console.log(value);
                                        return (
                                            <label style={{ marginRight: "30px" }} >
                                                <Input type="radio" name="EndorsementTypeAdd"
                                                    value={this.state.EndorsementEditData.EndorsementType} checked={(this.state.EndorsementEditData.EndorsementType === value.StringMapName) ? true : false} onChange={() => this.onRadioBtnClick('EndorsementTypeAdd', value.StringMapName)}
                                                />
                                                {value.StringMapName}
                                            </label>
                                        )
                                    })}
                                </Col>
                            </Row>
                            {(this.state.IsCustomData) ? (
                                <Row>
                                    <Col md="4">
                                        <b>Class Id:</b> {this.state.classId}
                                    </Col>
                                    <Col md="4">
                                        <b>Class Name:</b> {this.state.className}
                                    </Col>
                                </Row>
                            ) : (
                                    <div></div>
                                )}
                            {(this.state.IsCustomData) ? (
                                <Row>
                                    <Col md="2">
                                        <b>Number</b>
                                    </Col>
                                    <Col md="10">
                                        <Input type="text" name="number" id="number" onChange={(e) => this.handleChange(e)} value={this.state.EndorsementEditData.EndorsementNumber} disabled="true">
                                        </Input>
                                    </Col>
                                </Row>
                            ) : (
                                    <div></div>
                                )}
                            <Row>
                                <Col md="2">
                                    <b>Title</b>
                                </Col>
                                <Col md="10">
                                    <Input type="text" name="title" id="title" onChange={(e) => this.handleChange(e)} value={this.state.EndorsementEditData.EndorsementTitle}>
                                    </Input>
                                    <em className="error invalid-feedback" >Please enter endorsement title</em>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="2">
                                    <b>Status</b>
                                </Col>
                                <Col md="10">
                                    <Input disabled="true" type="select" name="status" id="status" onChange={(e) => this.selectType(e.target.value, 'status')} value={this.state.EndorsementEditData.Status}>
                                        <option value='' disabled={"disabled"}>Select status</option>
                                        {this.state.status.map((ct, i) => {
                                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                </Col>
                            </Row>

                        </ModalBody>
                        <ModalFooter>
                            <BTN color="success" onClick={() => this.saveEndrosement()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.toggleAdd('save')}><i class="fa fa-angle-left"></i> Cancel</BTN>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default EndorsementList;