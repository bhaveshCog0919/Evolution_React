import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import APIConstant from '../../../utils/constants';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

class Assumption extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "vesselClass", header: "Class", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "vesselType", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "category", header: "Category", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "assumptionCode", header: "Assumption Code", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "assumption", header: "assumption", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 6 }
        ];

        this.state = {
            cols: columns,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            selectedPage: 0,
            str: '',
            globalFilter: null,

            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            primary: false,

            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

            VesselClassList: [],
            vesselClassError: true,
            vesselClass: '',

            VesselTypeList: [],
            vesselTypeError: true,
            vesselType: '',

            AssumptionId: '',
            assumptionList: [],

            country: '',
            countryError: true,
            countryList: [],

            category: '',
            categoryError: true,
            categoryList: [],

            assumptionCode: '',
            assumptionCodeError: '',

            assumption: '',
            assumptionError: '',
        }


        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: ("" + col.header + ""), value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.openModal = this.openModal.bind(this);

    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getAssumptionList();
        this.getVesselClass();
        // this.getVesselType();
        this.getCountry();
        this.getCategory();
    }

    getAssumptionList() {
        // let data = {}
        api.post('api/getAssumptionList').then(res => {
            console.log("data", res)
            if (res.success) {
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({

                        country: res.data[i].Country,
                        category: res.data[i].Category,
                        assumptionCode: res.data[i].AssumptionCode,
                        assumption: res.data[i].AssumptionDescription,
                    })
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                    this.setState({ assumptionList: formattedData, str: str });
                }
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getVesselClass() {
        // let data = {}
        api.post('api/getVesselClassData').then(res => {
            
            if (res.success) {
                console.log("Class", res.data);
                var VesselClass = [];
                for (var i = 0; i < res.data.length; i++) {
                    VesselClass.push({
                        vesselClassId: res.data[i].VesselClassId,
                        vesselClassName: res.data[i].VesselClassName,
                    })
                }
                this.setState({ VesselClassList: VesselClass });
                // this.getVesselType();
            } else {
                console.log("Else");
            }
        }).catch(err => {
            console.log("errr", err)
        })
    }

    getVesselType() {
        debugger
            let data = {
                // VesselClassId: 'a93c7bd9-3b91-11ea-bd8d-fa163eb9754c'
                VesselClassId: this.state.vesselClass
            } 
            api.post('api/getVesselType', data).then(res => {
                console.log(res);
    
                if (res.success) {
                    this.setState({ VesselTypeList: res.data });
                } else {
                }
            }).catch(err => {
                console.log("errr", err);
            });
        }

    getCountry() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("COUNTRY", res.data);
                    var country = [];
                    for (let i = 0; i < res.data.length; i++) {
                        country.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ countryList: country });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }


    getCategory() {
        try {
            const data = {
                stringmaptype: 'CATEGORY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("Category", res.data);
                    var category = [];
                    for (let i = 0; i < res.data.length; i++) {
                        category.push({
                            label: res.data[i].StringMapId,
                            value: res.data[i].StringMapName
                        })
                    }
                    this.setState({ categoryList: category });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }


    openModal() {
        this.setState({
            primary: true
        })
    }

    export = () => {
        this.dt.exportCSV();
    }

    reset = () => {
        this.setState({
            heading: 'Add',
            toastName: 'Saved',
            buttonName: 'Save',
            primary: false,
            country: '',
            countryError: true,
            category: '',
            categoryError: true,
            AssumptionId: '',
            assumptionCode: '',
            assumptionCodeError: true,
            assumption: '',
            assumptionError: true,
            
        })
    }

    edit = (rowData) => {
        console.log("rowData", rowData)

        this.setState({
            primary: true,
            heading: 'Update',
            buttonName: 'Update',
            toastName: 'Updated',
            country:rowData.country,
            countryError:false,
            category:rowData.category,
            categoryError: false,
            AssumptionId: rowData.AssumptionId,
            assumptionCode: rowData.assumptionCode,
            assumptionCodeError: false,
            assumption: rowData.assumption,
            assumptionError: false
        })

    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: !this.state.toggleModal,
            AssumptionId: rowData.AssumptionId,
            assumptionCode: rowData.assumptionCode
        });
    }

    Delete() {

        try {
            let data = {
                AssumptionId: this.state.AssumptionId,
                CreatedBy: CommonConfig.loggedInUserId()
            }
            api.post('api/deleteAssumption', data).then(res => {
                if (res.success) {
                    this.setState({ toggleModal: !this.state.toggleModal });
                    this.reset();
                    toast.success("Assumption deleted successfully");
                    this.getAssumptionList();
                }
            })
        } catch (error) {
            console.log("error", error);
        }

    }


    toggleLarge = () => {
        this.setState({ toggleModal: !this.state.toggleModal });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'assumptionCode') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ assumptionCodeError: true });
                this.show("assumptionCode", true);
            }
            else {
                let RegEx = ""
                let name = e.target.value;
                if (!RegEx.test(name)) {
                    this.setState({ assumptionCodeError: true });
                    this.show("assumptionCode", true);
                    // } else if (e.target.value.length > 100) {
                    //     this.setState({ assumptionCodeError: true });
                    //     this.show("assumptionCode", true);
                } else {
                    this.setState({ assumptionCodeError: false, assumptionCode: e.target.value });
                    this.show("assumptionCode", false);
                }
            }
        }

        if (e.target.name === 'assumption') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ assumptionError: true });
                this.show("assumption", true);
            }
            else {
                let RegEx = ""
                let name = e.target.value;
                if (!RegEx.test(name)) {
                    this.setState({ assumptionError: true });
                    this.show("assumption", true);
                    // } else if (e.target.value.length > 100) {
                    //     this.setState({ assumptionError: true });
                    //     this.show("assumption", true);
                } else {
                    this.setState({ assumptionError: false, assumption: e.target.value });
                    this.show("assumptions", false);
                }
            }
        }
    }

    selectType = (value, type) => {


        if (type === 'vesselClass') {

            if (value === '') {
                this.setState({ vesselClassError: true, vesselClass: value });
                this.show("vesselClass", true);
            } else {
                this.setState({ vesselClass: value, vesselClassError: false });
                this.show("vesselClass", false);
            }
        }

        if (type === 'vesselType') {

            if (value === '') {
                this.setState({ vesselTypeError: true, vesselType: value });
                this.show("vesselType", true);
            } else {
                this.setState({ vesselType: value, vesselTypeError: false });
                this.show("vesselType", false);
            }
        }

        if (type === 'country') {

            if (value === '') {
                this.setState({ countryError: true, country: value });
                this.show("country", true);
            } else {
                this.setState({ country: value, countryError: false });
                this.show("country", false);
            }
        }

        if (type === 'category') {

            if (value === '') {
                this.setState({ categoryError: true, category: value });
                this.show("category", true);
            } else {
                this.setState({ categoryError: false, category: value });
                this.show("category", false);
            }
        }
    }


    actionTemplate(rowData, column) {

        return <div className="text-center">
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltip="Edit" style={{ padding: 2 }} tooltipOptions={{ position: 'bottom' }} onClick={() => this.edit(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger"  tooltip="Delete" style={{ padding: 2 }}  tooltipOptions={{ position: 'bottom' }} onClick={() => this.openDeleteModal(rowData)}></Button>
        </div>;
    }

    render() {
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });

        return (
            <div>


                <div className="basic-header">
                    <h1>Assumption List</h1>
                </div>

                <div className="input-box rc-box">
                    <div className="rc-inline">
                        <Row>
                            <Col md="3">
                                <div className="input-box">
                                    <label>Class Name</label>
                                    <Input type="select" name="vesselClass" id="vesselClass" onChange={(e) => this.selectType(e.target.value, 'vesselClass')} value={this.state.vesselClassName}>
                                        <option>Select Class Name</option>
                                        {this.state.VesselClassList.map((ct, i) => {
                                            return (<option value={ct.vesselClassId}>{ct.vesselClassName}</option>)
                                        })
                                        } 
                                    </Input>
                                    <em className="error invalid-feedback">Please select class name</em>
                                </div>
                            </Col>

                            <Col md="3">
                                <label>Vessel Type</label>
                                <Input type="select" name="vesselType" id="vesselType" onChange={(e) => this.selectType(e.target.value, 'vesselType')} value={this.state.vesselType}>
                                    <option>Select Vessel Type</option>
                                    {this.state.VesselTypeList.map((ct, i) => {
                                        return (<option value={ct.VesselTypeId}>{ct.VesselTypeName}</option>)
                                    })
                                    } 
                                </Input>
                                <em className="error invalid-feedback">Please select vessel type</em>
                            </Col>

                            <Col md="3">
                                <label>Country</label>
                                <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'vesselType')} value={this.state.vesselType}>
                                    <option>Select Country</option>
                                    {this.state.countryList.map((type, i) => {
                                        return (<option value={type.key}>{type.label}</option>)
                                    })
                                    }
                                </Input>
                                <em className="error invalid-feedback">Please select country</em>
                            </Col>
                            <Col md="1">
                                <BTN color="success" style={{ marginTop: "20px", marginRight: '.5em', borderRadius: "20px" }}
                                    tooltip="Go" tooltipOptions={{ position: 'bottom' }} onClick={() => this.getRiskQuestion()}
                                >
                                    Go
                                </BTN>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="basic-header">
                    <div></div>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show/Hide Column"
                            tooltipOptions={{ position: 'bottom' }} onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Assumption" tooltipOptions={{ position: 'bottom' }} onClick={this.openModal}></Button>
                        <Button type="button" icon="pi pi-external-link" tooltip="Export As CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export}></Button>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.assumptionList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.assumptionList.length}
                        exportFilename="Assumption List"
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                    </div>


                    <Row>
                        <Col>
                            <Modal isOpen={this.state.primary} toggle={this.reset}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.reset}>{this.state.heading} Assumption</ModalHeader>
                                <ModalBody>

                                    <Row>
                                        <Col md="12" className="text-right">
                                            <span style={{ color: "red" }}>* Marked fields are mandatory</span>
                                        </Col>
                                    </Row>
                                    <form className="form" action="#">

                                        {/* <Row style={{ marginTop: "10px" }}>
                                            <Col className="text-right">
                                                <Button type="button" icon="fa fa-shield" onClick={() => this.VesselType()}></Button>
                                            </Col>
                                        </Row> */}

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="3" className="pull-right">
                                                <label>Class Id:</label>
                                            </Col>
                                            <Col md="">
                                                {this.state.vesselClassCode}
                                            </Col>

                                            <Col md="3" className="pull-right">
                                                <label>Class Name:</label>
                                            </Col>
                                            <Col md="">
                                                {/* {this.state.vesselClassCode} */}
                                            </Col>

                                            <Col md="3" className="pull-right">
                                                <label>Vessel Type:</label>
                                            </Col>
                                            <Col md="">
                                                {/* {this.state.vesselClassCode} */}
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="6" className="pull-right">
                                                <div className="input-box">
                                                    <label>Country*</label>
                                                    <Input type="select" name="country" id="country"
                                                        onChange={(e) => this.selectType(e.target.value, 'country')}
                                                        value={this.state.country}>
                                                        <option value=''>Select country</option>
                                                        {this.state.countryList.map((type, i) => {
                                                            return (<option value={type.key}>{type.label}</option>)
                                                        })
                                                        }
                                                        <em className="error invalid-feedback">Please select country</em>
                                                    </Input>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="6" className="pull-right">
                                                <div className="input-box">
                                                    <label>Category*</label>
                                                    <Input type="select" name="category" id="category"
                                                        onChange={(e) => this.selectType(e.target.value, 'category')}
                                                        value={this.state.category}>
                                                        <option value=''>Select category</option>
                                                        {this.state.categoryList.map((ct, i) => {
                                                            return (<option value={ct.label}>{ct.value}</option>)
                                                        })
                                                        }
                                                        <em className="error invalid-feedback">Please select category</em>
                                                    </Input>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="6" className="pull-right">
                                                <div className="input-box">
                                                    <label>Assumption Code*</label>
                                                    <InputGroup>
                                                        <Input type="text" name="assumptionCode" id="assumptionCode" onChange={e => this.handleChange(e)} placeholder="Asssumption Code" value={this.state.assumptionCode} />
                                                        <em className="error invalid-feedback">Please enter valid assumption code</em>
                                                    </InputGroup>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="6" className="pull-right">
                                                <div className="input-box">
                                                    <label>Assumption*</label>
                                                    <InputGroup>
                                                        <Input type="textarea" name="assumption" id="assumption" onChange={e => this.handleChange(e)} placeholder="Asssumption" value={this.state.assumption} />
                                                        <em className="error invalid-feedback">Please enter assumption</em>
                                                    </InputGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <BTN color="success" onClick={() => this.Save()}><i class="fa fa-check"></i> {this.state.buttonName}</BTN>{' '}
                                    <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> Cancel</BTN>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete Assumption</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete assumption?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.Delete()}><i class="fa fa-check"></i> Yes</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i> Cancel</BTN>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }

}

export default withTranslation()(Assumption);
