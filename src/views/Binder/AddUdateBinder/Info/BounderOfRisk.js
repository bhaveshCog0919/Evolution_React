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
import { toast } from 'react-toastify';

import api from '../../../../utils/apiClient';

import APIConstant, { CommonConfig } from '../../../../utils/constants';

class BounderOfRisk extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains',id: 0 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains',id: 1 }
        ];

        const orginial = this.setState;
        // this.state = JSON.parse(localStorage.getItem('bounderriskstate'))
        //     ? JSON.parse(localStorage.getItem('bounderriskstate'))
        //     : 
            this.state = {
                toggleModal: false,
                selectedLanguage: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
                cols: columns,
                country: "",
                BinderId: "",
                RiskLocatorId: "",
                countryError: false,
                bounderRiskArray: [],
                countryarr: [],
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

    componentWillUnmount() {
        localStorage.removeItem('bounderriskstate')
    }

    selectType = (value, type) => {
        if (type == "country") {
            this.setState({ country: value })
        }
    }


    editBounderRisk(event) {
        
        let index = this.state.bounderRiskArray.findIndex(x => x.country === event.country);
        if (index !== -1) {
            let data = this.state.bounderRiskArray[index]
            this.setState({
                country: data.country,
                RiskLocatorId: data.id
            })
        }
    }

    deleteBounderRisk() {

        let data = {
            "RiskLocatorId": this.state.deleteRiskLocatorId,
            "UserId": CommonConfig.loggedInUserId(),
            "BinderId": this.state.BinderId
        }
        console.log(data)

        api.post(APIConstant.path.deleteBounder, data).then(res => {
            if (res.success) {
                // let index = this.state.bounderRiskArray.findIndex(x => x.country === this.state.country);
                // if (index !== -1) {
                //     this.state.bounderRiskArray.splice(index, 1);
                //     this.setState({ bounderRiskArray: this.state.bounderRiskArray });
                // }
                if(res.data[0][0].ErrorMsg !== ""){
                    toast.error(res.data[0][0].ErrorMsg);
                } else {
                    toast.success("Risk Locator successfully deleted");
                }
                this.getBounderRisk(this.state.BinderId);
                this.toggleLarge();
            }
        }).catch(err => {
            console.log(err)
        })


    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.bounderRiskArray.length) ? l : this.state.bounderRiskArray.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.bounderRiskArray.length + ' records';
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
            {/* <Button type="button" icon="pi pi-eye" className="p-button-warning" onClick={() => this.editBounderRisk(rowData)}
                style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
            </Button> */}
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.deleteBounderRisk(rowData)} tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button> */}
            <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" onClick={() => this.openDeleteModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
                    </div>;
    }

    openDeleteModal = (rowData) => {
        this.setState({
            toggleModal: !this.state.toggleModal,
            deleteRiskLocatorId: rowData.id,
            deletecountry: rowData.country,
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            deleteRiskLocatorId: '',
            deletecountry: ''
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getCountry();

        // this.getBounderRisk();
    }

    addBounderRisk() {
        if(this.state.BinderId == "") {
            toast.error('To add Risk Locator Please Create New binder or edit existing Binder');
        }
        else if(this.state.country == '') {
            toast.error('Please Select Country');
        }
        else {
            let data = {
            "BinderId": this.state.BinderId,
            "CountryId": this.state.country,
            "RiskLocatorId": this.state.RiskLocatorId,
            "UserId": CommonConfig.loggedInUserId()
            }
            api.post(APIConstant.path.addRiskLocator, data).then(res => {
                if (res.success) {
                    console.log("===========Bounder Class Created")
                    toast.success(res.data.message);
                    this.getBounderRisk(this.state.BinderId);
                    // setTimeout(function () {
                    //     window.location.reload();
                    // }, 2000);
                }
            }).catch(err => {
                console.log(err)
            })
            this.setState({
                RiskLocatorId: "",
                country: ""

            })
            }
    }

    getBounderRisk(BinderId) {
        debugger;
        let data = {
            "BinderId": BinderId,
            "UserId": CommonConfig.loggedInUserId()
        }
        api.post(APIConstant.path.getRiskLocator, data).then(res => {
            console.log(res)
            if (res.success) {
                console.log("===========Bounder Class Data")
                console.log(res.data)
                
                var countryarr = [...this.state.allcountryarr]; // make a separate copy of the array

                for (let i = 0; i < res.data.length; i++) {
                    let index = countryarr.findIndex(x => x.value === res.data[i].Country);
                    if (index !== -1) {
                        countryarr.splice(index, 1);
                    }
                }
                
                
                this.setState({
                    bounderRiskArray: res.data.map((obj) => {
                        return {
                            country: obj.Country,
                            id: obj.RiskLocatorId
                        }
                    }),
                    countryarr: countryarr
                })
            }
        }).catch(err => {
            console.log(err)
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
                    this.setState({ allcountryarr: country });
                    // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
                    //     this.setState({ BinderId: this.props.match.params.Id })
                    //     this.getBounderRisk(this.props.match.params.Id)
                        
                    // }
                    var splitData = this.props.location.pathname.split("/");
                    // if (splitData[3] !== undefined) {
                    if (!CommonConfig.isEmpty(splitData[3])) {
                        this.setState({ BinderId: splitData[3] })
                        this.getBounderRisk(splitData[3])
                    } 
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    render() {

        let columns = this.state.cols.map((col, i) => {
            return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter}  filterMatchMode={col.filterMatchMode}/>;
        });

        return (
            <div>
                <div className="basic-header">
                    <div className="input-box">
                        <Row>
                            <Col md="1">
                                <label>Country</label>
                            </Col>
                            <Col md="3">
                                <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                                    <option value='' disabled={"disabled"}>Select Country</option>

                                    {this.state.countryarr.map((type, i) => {
                                        return (<option value={type.key}>{type.label}</option>)
                                    })
                                    }

                                </Input>
                                <em className="error invalid-feedback" >Please select Country</em>
                            </Col>
                            <Button style={{ height: "fit-content" }} type="button" icon={this.state.RiskLocatorId == "" ? "pi pi-plus" : "pi pi-pencil"} tooltip={this.state.BinderAuthorisedClassId == "" ? "Add Bounder Risk" : "Update Bounder Risk"} tooltipOptions={{ position: 'bottom' }} onClick={() => this.addBounderRisk()}></Button>
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
                    <DataTable ref={(el) => this.dt = el} value={this.state.bounderRiskArray} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.bounderRiskArray.length} exportFilename="Risk Locator List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                        paginatorTemplate={this.state.paginatorTemplate}
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                    >{columns}</DataTable>
                </div>

                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Delete Risk Locator</ModalHeader>
                    <ModalBody>
                        Are you sure, You want to delete {this.state.deletecountry} Risk Locator?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.deleteBounderRisk()}><i class="fa fa-check"></i> Delete</BTN>{' '}
                        <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>Cancel</BTN>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default withTranslation()(BounderOfRisk);