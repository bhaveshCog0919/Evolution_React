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
import api from '../../../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../../../utils/constants';
import moment from 'moment';
import { toast } from 'react-toastify';

class AuthorizeClass extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "vesselclass", header: "Vessel", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "minimumpremium", header: "Minimum Premium", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: this.formatDate.bind(this), header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 8 }
        ];

        const orginial = this.setState;
        // this.state = JSON.parse(localStorage.getItem('authorizegroupstate'))
        //     ? JSON.parse(localStorage.getItem('authorizegroupstate'))
        //     : 
        this.state = {
            toggleModal: false,
            selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            authorizeArray: [],
            BinderId: "",
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            vesselclass: "",
            addUpdateData: {},
            vesselclassError: false,
            vesselclassmaster: [],
            minimumpremium: "",
            minimumpremiumError: false,
            BinderAuthorisedClassId: "",
            startdate: moment().format("YYYY-MM-DD"),
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

    formatDate(rowData) {
        return (
            <p>{moment(rowData.startdate).format('DD/MM/YYYY')}</p>
        )
    }

    componentWillUnmount() {
        localStorage.removeItem('authorizegroupstate')
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.authorizeArray.length) ? l : this.state.authorizeArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.authorizeArray.length + ' records';
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
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.editAuthorizeClass(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button>
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" onClick={() => this.deleteAuthorizeClass(rowData)} tooltipOptions={{ position: 'bottom' }}></Button> */}
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" onClick={() => this.openDeleteModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
        </div>;
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: !this.state.toggleModal,
            deleteBinderAuthorisedClassId: rowData.id,
            deletevesselclass: rowData.vesselclass,
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            deleteBinderAuthorisedClassId: '',
            deletevesselclass: ''
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getVesselClassList();
    }

    getVesselClassList() {
        api.get(APIConstant.path.getVesselClass).then(res => {
            if (res.success) {
                this.setState({ allvesselclassmaster: res.data });
                var splitData = this.props.location.pathname.split("/");
                // if (splitData[3] !== undefined) {
                if (!CommonConfig.isEmpty(splitData[3])) {
                this.setState({ BinderId: splitData[3] })
                    this.getAuthorizeClass(splitData[3])
                } 
                // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
                //     this.setState({ BinderId: this.props.match.params.Id })
                //     this.getAuthorizeClass(this.props.match.params.Id)
                // }
            } else {
            }
        }).catch(err => {
            console.log(err)
        });
    }

    getAuthorizeClass(BinderID) {
        let data = {
            "BinderId": BinderID
        }
        api.post(APIConstant.path.getAuthorizeClass, data).then(res => {
            console.log(res)
            if (res.success) {
                console.log("===========Authirised Class Data")
                console.log(res.data)

                // let vesselclassmaster = []

                var vesselclassmaster = [...this.state.allvesselclassmaster]; // make a separate copy of the array

                for (let i = 0; i < res.data.length; i++) {
                    let index = vesselclassmaster.findIndex(x => x.VesselClassName === res.data[i].VesselClassName);
                    if (index !== -1) {
                        vesselclassmaster.splice(index, 1);
                    }
                }


                this.setState({
                    authorizeArray: res.data.map((obj) => {
                        return {
                            vesselclass: obj.VesselClassName,
                            minimumpremium: obj.MinimumPremium,
                            id: obj.BinderAuthorisedClassId,
                            vesselclassid: obj.VesselClassId,
                            startdate: moment(obj.AuthorizedClassStartDate).format('YYYY-MM-DD')
                        }
                    }),
                    vesselclassmaster: vesselclassmaster
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    addAuthorizeClass() {
        if (this.state.BinderId == "") {
            toast.error('To add Authorized Class Please Create New binder or edit existing Binder');
        }
        else if (this.state.vesselclass == '') {
            toast.error('Please Select Vessel Class');
        }
        else if (this.state.minimumpremium == '') {
            toast.error('Please Enter Minimum Premiun');
        }
        else if (this.state.minimumpremiumError) {
            toast.error('Please Enter Valid Minimum Premiun');
        }
        else if (this.state.startdate == '') {
            toast.error('Please Enter Effective Date');
        }
        else {
            let data = {
                "BinderId": this.state.BinderId,
                "VesselClassId": this.state.vesselclass,
                "MinimumPremiunm": this.state.minimumpremium,
                "UserId": CommonConfig.loggedInUserId(),
                "BinderAuthorisedClassId": this.state.BinderAuthorisedClassId,
                "StartDate": moment(this.state.startdate).format('YYYY-MM-DD')
            }
            // debugger
            console.log(data)
            api.post(APIConstant.path.addUpdateAuthorizeClass, data).then(res => {
                if (res.success) {
                    console.log("===========Authirised Class Created", res)
                    toast.success(res.data.message);
                    this.getAuthorizeClass(this.state.BinderId);
                    this.setState({
                        vesselclass: "",
                        minimumpremium: "",
                        startdate: moment().format('YYYY-MM-DD')
                    })
                    // setTimeout(function () {
                    //     window.location.reload();
                    // }, 2000);
                }
            }).catch(err => {
                console.log(err)
            })

            this.setState({
                BinderAuthorisedClassId: "",
                vesselclass: "",
                minimumpremium: "",
                startdate: moment().format("YYYY-MM-DD")
            })
        }

    }

    editAuthorizeClass(event) {
        debugger;
        var vesselclassmaster = this.state.vesselclassmaster;
        var allvesselclassmaster = [...this.state.allvesselclassmaster]; // make a separate copy of the array

        let index1 = allvesselclassmaster.findIndex(x => x.VesselClassId === event.vesselclassid);
        if (index1 !== -1) {
            vesselclassmaster.splice(index1, 0, allvesselclassmaster[index1]);
        }

        this.setState({ vesselclassmaster: vesselclassmaster })
        let index = this.state.authorizeArray.findIndex(x => x.id === event.id);
        if (index !== -1) {
            let data = this.state.authorizeArray[index]
            this.setState({
                vesselclass: data.vesselclassid,
                minimumpremium: data.minimumpremium,
                BinderAuthorisedClassId: data.id,
                startdate: moment(data.startdate).format('YYYY-MM-DD')
            })
        }
    }

    deleteAuthorizeClass() {
        let data = {
            "BinderAuthorisedClassId": this.state.deleteBinderAuthorisedClassId,
            "UserId": CommonConfig.loggedInUserId(),
            "BinderId": this.state.BinderId
        }
        console.log(data)

        api.post(APIConstant.path.deleteAuthorizedClass, data).then(res => {
            if (res.success) {
                // let index = this.state.authorizeArray.findIndex(x => x.vesselclass === this.state.vesselclass);
                // if (index !== -1) {
                //     this.state.authorizeArray.splice(index, 1);
                //     this.setState({ authorizeArray: this.state.authorizeArray });
                // }
                if (res.data[0][0].ErrorMsg !== "") {
                    console.log(res.data[0][0])
                    toast.error(res.data[0][0].ErrorMsg);
                } else {
                    toast.success("Authorised class successfully deleted");
                }
                this.setState({
                    vesselclass: "",
                    minimumpremium: "",
                    startdate: moment().format('YYYY-MM-DD'),
                    BinderAuthorisedClassId: ""
                })
                this.getAuthorizeClass(this.state.BinderId);
                this.toggleLarge();


            }
        }).catch(err => {
            console.log(err)
        })

    }

    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

        let decimalRegExp = CommonConfig.RegExp.decimalWithOne;

        if (e.target.name === 'minimumpremium') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ minimumpremiumError: false, minimumpremium: 0 });
                this.show("minimumpremium", false, "minimumpremiumError", "");
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ minimumpremiumError: true });
                    this.show("minimumpremium", true, "minimumpremiumError", "Please Enter Valid Minimum Premium");
                } else {
                    this.setState({ minimumpremiumError: false, minimumpremium: e.target.value });
                    this.show("minimumpremium", false, "minimumpremiumError", "");
                }
            }
        }

        if (e.target.name === 'startdate') {
            if (e.target.value != "") {

                this.setState({ startdateError: false });
                this.show("startdate", false);
                this.setState({
                    startdate: e.target.value
                });
            } else {
                this.setState({ startdateError: true });
                this.show("startdate", true);
            }
        }


    }

    selectType = (value, type) => {
        if (type == "vesselclass") {
            this.setState({ vesselclass: value })
        }
    }

    // show(field, condition) {
    //     if (condition) {
    //         document.getElementById(field).className = "form-control is-invalid";
    //     } else {
    //         document.getElementById(field).className = "form-control";
    //     }
    // }

    show(field, condition, errorField, message) {
        debugger;
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
        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <div className="input-box">
                        <Row>
                            <Col md="1">
                                <label>Vessel Class</label>
                            </Col>
                            <Col md="3">
                                <Input type="select" name="vesselclass" id="vesselclass" onChange={(e) => this.selectType(e.target.value, 'vesselclass')} value={this.state.vesselclass}>
                                    <option value='' disabled={"disabled"}>Select VesselClass</option>
                                    {this.state.vesselclassmaster.map((type, i) => { return (<option value={type.VesselClassId}>{type.VesselClassName}</option>) })}
                                </Input>
                                <em className="error invalid-feedback" >Please select VesselClass</em>
                            </Col>
                            <Col md="1">
                                <label>Effective Date</label>
                            </Col>
                            <Col md="2">
                                <Input type="date" name="startdate" id="startdate" placeholder="Start Date" onBlur={(e) => this.handleChange(e)}
                                    onChange={(e) => this.handleChange(e)} value={this.state.startdate} min={moment().format('YYYY-MM-DD')} max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                />
                                <em className="error invalid-feedback" >Please select StartDate</em>
                            </Col>
                            <Col md="1">
                                <label>Minimum Premium</label>
                            </Col>
                            <Col md="3">
                                <Input type="text" name="minimumpremium" id="minimumpremium" onChange={(e) => this.handleChange(e)} value={this.state.minimumpremium}>
                                </Input>
                                {/* <em className="error invalid-feedback" >Please enter Minimum Premium</em> */}
                                <em id="minimumpremiumError" className="error invalid-feedback"></em>
                            </Col>
                            <Button style={{ height: "fit-content" }} type="button" icon={this.state.BinderAuthorisedClassId == "" ? "pi pi-plus" : "pi pi-save"} tooltip={this.state.BinderAuthorisedClassId == "" ? "Add Authorize Class" : "Update Authorize Class"} tooltipOptions={{ position: 'bottom' }} onClick={() => this.addAuthorizeClass()}></Button>
                        </Row>
                    </div>
                    <div className="header-right-option">
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.authorizeArray} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.authorizeArray.length} exportFilename="Authorized Class List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                        paginatorTemplate={this.state.paginatorTemplate}
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                    >
                        {columns}
                    </DataTable>
                </div>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete Authorized class</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.deletevesselclass} Authorized Class?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.deleteAuthorizeClass()}><i class="fa fa-check"></i> Delete</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withTranslation()(AuthorizeClass);