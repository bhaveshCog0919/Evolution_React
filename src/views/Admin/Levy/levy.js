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
import { Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import { toast } from 'react-toastify';

class levy extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "country", header: "Country", sortable: true, filter: true, id: 0 },
            { field: "type", header: "Type", sortable: true, filter: true, id: 1 },
            { field: "rate1", header: "Rate 1", sortable: true, filter: true, id: 2 },
            { field: "ratebasis1", header: "Rate Basis 1", sortable: true, filter: true, id: 3 },
            { field: "rate2", header: "Rate 2", sortable: true, filter: true, id: 4 },
            { field: "ratebasis2", header: "Rate Basis 2", sortable: true, filter: true, id: 5 },
            { field: "amountineur", header: "AmountInEUR", sortable: true, filter: true, id: 6 },
            { field: "amountingbp", header: "AmountInGBP", sortable: true, filter: true, id: 7 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 8 }
        ];

        this.state = {
            LevyId: '',
            country: '',
            countryarr: [],
            countryError: true,
            type: '',
            typeError: true,
            type: '',
            typearr: [],
            typeError: true,
            rate1: '',
            rate1Error: true,
            ratebasis1: '',
            ratebasis1arr: [],
            ratebasis1Error: true,
            rate2: '',
            rate2Error: true,
            ratebasis2: '',
            ratebasis2arr: [],
            ratebasis2Error: true,
            amountineur: '',
            amountineurError: true,
            amountingbp: '',
            amountingbpError: true,
            brand: null,
            colors: null,
            toggleModalDel: false,
            toggleModalAdd: false,
            cols: columns,
            arr: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            isEdit: false,
            primary: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getLevyList();
        this.getCountry();
        this.getRateBasis1();
        this.getRateBasis2();
        this.getLevyType();
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
                    this.setState({ countryarr: country });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getRateBasis1() {
        try {
            const data = {
                stringmaptype: 'RATEBASIS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var ratebasis1 = [];
                    for (let i = 0; i < res.data.length; i++) {
                        ratebasis1.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ ratebasis1arr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getRateBasis2() {
        try {
            const data = {
                stringmaptype: 'RATEBASIS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var ratebasis2 = [];
                    for (let i = 0; i < res.data.length; i++) {
                        ratebasis2.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ ratebasis2arr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getLevyType() {
        try {
            const data = {
                stringmaptype: 'LEVYTYPE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var type = [];
                    for (let i = 0; i < res.data.length; i++) {
                        type.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ typearr: res.data });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    getLevyList() {
        try {
            api.post('api/getLevy').then(res => {
                if (res.success) {
                    console.log("getLevy", res.data);
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        // var Updated = (res.data[i].updatedon === undefined || res.data[i].updatedon === null || res.data[i].updatedon === "") ? ("No Updates") : (Moment(res.data[i].updatedon).format(CommonConfig.dateFormat.dateTime));
                        formattedData.push({
                            LevyId: res.data[i].LevyId,
                            country: res.data[i].Country,
                            type: res.data[i].Type,
                            rate1: res.data[i].Rate1,
                            ratebasis1: res.data[i].RateBasis1,
                            rate2: res.data[i].Rate2,
                            ratebasis2: res.data[i].RateBasis2,
                            amountineur: res.data[i].AmountEUR,
                            amountingbp: res.data[i].AmountGBP,
                        });
                        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                        this.setState({ arr: formattedData, str: str });
                    }
                } else {
                    console.log(" getLevy Else");

                }
            }).catch(err => {

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    edit = (rowData) => {
        console.log("rowData", rowData);
        this.togglePrimary();
        this.setState({
            LevyId: rowData.LevyId,
            country: rowData.country, type: rowData.type, rate1: rowData.rate1, ratebasis1: rowData.ratebasis1,
            rate2: rowData.rate2, ratebasis2: rowData.ratebasis2, amountineur: rowData.amountineur, amountingbp: rowData.amountingbp,
            countryError: false, typeError: false, rate1Error: false, ratebasis1Error: false,
            rate2Error: false, ratebasis2Error: false, rate1Error: false, amountineurError: false, amountingbpError: false
        });
    }

    saveLevy() {
        debugger
        try {
            if (this.state.countryError === true ||
                this.state.typeError === true) {
                this.show("country", this.state.countryError)
                this.show("type", this.state.typeError)
            }
            else if (this.state.type == "ONE RATE" && (this.state.rate1Error === true || this.state.ratebasis1Error === true)) {
                this.show("rate1", this.state.rate1Error);
                this.show("ratebasis1", this.state.ratebasis1Error);
            } else if (this.state.type == "ADD TWO RATES" && (this.state.rate1Error === true || this.state.ratebasis1Error || this.state.rate2Error || this.state.ratebasis2Error === true)) {
                this.show("rate1", this.state.rate1Error);
                this.show("ratebasis1", this.state.ratebasis1Error);
                this.show("rate2", this.state.rate2Error);
                this.show("ratebasis2", this.state.ratebasis2Error);
            } else if (this.state.type == "FIXED AMOUNT" && (this.state.amountineurError === true || this.state.amountingbpError === true)) {
                this.show("amountineur", this.state.amountineurError);
                this.show("amountingbp", this.state.amountingbpError);
            }
            else {
                let data = {
                    LevyId: this.state.LevyId,
                    country: this.state.country,
                    type: this.state.type,
                    rate1: this.state.rate1,
                    ratebasis1: this.state.ratebasis1,
                    rate2: this.state.rate2,
                    ratebasis2: this.state.ratebasis2,
                    amountineur: this.state.amountineur,
                    amountingbp: this.state.amountingbp,
                }
                console.log("datatatatatat",data);
                api.post('api/addUpdateLevy', data).then(res => {
                    if (res.success) {
                        toast.success("Levy data added successfully");
                        this.reset();
                        this.togglePrimary();
                        this.getLevyList();
                    }
                })
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    actionTemplate(rowData, column) {

        return <div className="text-center">
            <Button type="button" icon="fa fa-pencil" color="primary" onClick={() => this.edit(rowData)} title="Edit" style={{ padding: 2 }}></Button>
        </div>;
    }

    openModalAdd() {
        this.setState({ toggleModalAdd: !this.state.toggleModalAdd });
    }

    toggleLargeAdd = () => {
        this.setState({ toggleModalAdd: false });
    }

    togglePrimary() {
        this.reset();
        this.setState({
            primary: !this.state.primary,
        });
    }

    reset() {
        this.setState({
            country: '', type: '', rate1: '',
            ratebasis1: '', rate2: '', ratebasis2: '',
            amountineur: '', amountingbp: '', LevyId: ''
        })
    }

    selectType(value, type) {

        if (type === 'country') {
            if (value === '' || value === null) {
                this.setState({ countryError: true, country: value });
                this.show('country', true);
            } else {
                this.setState({ countryError: false, country: value });
                this.show('country', false);
            }
        }

        if (type === 'type') {
            if (value === '' || value === null) {
                this.setState({ typeError: true, type: value });
                this.show('type', true);
            } else {
                this.setState({ typeError: false, type: value });
                this.setState({
                    rate1: '', ratebasis1: '', rate2: '', ratebasis2: '',
                    amountineur: '', amountingbp: ''
                });
                this.show('type', false);
            }
        }

        if (type === 'ratebasis1') {
            if (value === '' || value === null) {
                this.setState({ ratebasis1Error: true, ratebasis1: value });
                this.show('ratebasis1', true);
            } else {
                this.setState({ ratebasis1Error: false, ratebasis1: value });
                this.show('ratebasis1', false);
            }
        }

        if (type === 'ratebasis2') {
            if (value === '' || value === null) {
                this.setState({ ratebasis2Error: true, ratebasis2: value });
                this.show('ratebasis2', true);
            } else {
                this.setState({ ratebasis2Error: false, ratebasis2: value });
                this.show('ratebasis2', false);
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'rate1') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ rate1Error: true });
                this.show("rate1", true);
            } else {
                let rate1RegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let rate1 = e.target.value;
                if (e.target.value > 100 || !rate1RegEx.test(rate1)) {
                    this.setState({ rate1Error: true });
                    this.show("rate1", true);
                } else {
                    this.setState({ rate1Error: false, rate1: e.target.value });
                    this.show("rate1", false);
                }
            }
        }

        if (e.target.name === 'rate2') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ rate2Error: true });
                this.show("rate2", true);
            } else {
                let rate2RegEx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let rate2 = e.target.value;
                if (e.target.value > 100 || !rate2RegEx.test(rate2)) {
                    this.setState({ rate2Error: true });
                    this.show("rate2", true);
                } else {
                    this.setState({ rate2Error: false, rate2: e.target.value });
                    this.show("rate2", false);
                }
            }
        }

        if (e.target.name === 'amountineur') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ amountineurError: true });
                this.show("amountineur", true);
            } else {
                let invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
                let amountineur = e.target.value;
                if (!invSpace.test(amountineur)) {
                    this.setState({ amountineurError: true });
                    this.show("amountineur", true);
                } else {
                    this.setState({ amountineurError: false, amountineur: e.target.value });
                    this.show("amountineur", false);
                }
            }
        }

        if (e.target.name === 'amountingbp') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ amountingbpError: true });
                this.show("amountingbp", true);
            } else {
                let invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
                let amountingbp = e.target.value;
                if (!invSpace.test(amountingbp)) {
                    this.setState({ amountingbpError: true });
                    this.show("amountingbp", true);
                } else {
                    this.setState({ amountingbpError: false, amountingbp: e.target.value });
                    console.log("amountingbp",amountingbp);
                    this.show("amountingbp", false);
                }
            }
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    render() {
        var header = <div>

        </div>;
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });

        return (
            <div>
                <div className="basic-header">
                    <h1>Levy</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add Levy" tooltipOptions={{ position: 'bottom' }} onClick={this.togglePrimary}></Button>
                        
                    </div>
                </div>
                <div className="table-custom">
                    {/* <div className="header-right-option"> */}
                    <DataTable
                        value={this.state.arr}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        // onRowClick={(e) => this.onEditRow(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        // header={header}
                        totalRecords={this.state.arr.length}
                        exportFilename="Levy List"
                        currentPageReportTemplate={this.state.str}
                        // scrollable={true} scrollHeight="250px"
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
                            <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.togglePrimary}>Add/Update Levy</ModalHeader>
                                <ModalBody>

                                    <form className="form" action="#">
                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="3" s>
                                                <label for="country">Country</label>
                                            </Col>
                                            <Col md="5">
                                                <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target.value, 'country')} value={this.state.country}>
                                                    <option value=''>Select Country</option>
                                                    {this.state.countryarr.map((type, i) => {
                                                        return (<option value={type.key}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback" >Please select country</em>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="3">
                                                <label for="type">Type</label>
                                            </Col>
                                            <Col md="5">
                                                <Input type="select" name="type" id="type" onChange={(e) => this.selectType(e.target.value, 'type')} value={this.state.type}>
                                                    <option value=''>Select type</option>
                                                    {this.state.typearr.map((type, i) => {
                                                        return (<option value={type.value}>{type.label}</option>)
                                                    })
                                                    }
                                                </Input>
                                                <em className="error invalid-feedback" >Please enter type</em>
                                            </Col>
                                        </Row>

                                        {(this.state.type == 'ONE RATE') ? (
                                            <Row style={{ marginTop: "10px" }}>
                                                <Col md="3">
                                                    <label for="rate1">Rate 1 (%)</label>
                                                </Col>
                                                <Col md="3">
                                                    <Input type="text" name="rate1" id="rate1" onChange={(e) => this.handleChange(e)} value={this.state.rate1}>
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter mooring registration no</em>
                                                </Col>


                                                <Col md="3">
                                                    <label for="ratebasis1">Rate Basis 1</label>
                                                </Col>
                                                <Col md="3">
                                                    <Input type="select" name="ratebasis1" id="ratebasis1" onChange={(e) => this.selectType(e.target.value, 'ratebasis1')} value={this.state.ratebasis1}>
                                                        <option value=''>Select rate basis 1</option>
                                                        {this.state.ratebasis1arr.map((type, i) => {
                                                            return (<option value={type.value}>{type.label}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter where boat registered</em>
                                                </Col>
                                            </Row>
                                        ) : (
                                                null
                                            )}

                                        {(this.state.type == 'ADD TWO RATES') ? (
                                            <div>
                                                <Row style={{ marginTop: "10px" }}>
                                                    <Col md="3">
                                                        <label for="rate1">Rate 1 (%)</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="text" name="rate1" id="rate1" onChange={(e) => this.handleChange(e)} value={this.state.rate1}>
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please enter mooring registration no</em>
                                                    </Col>


                                                    <Col md="3">
                                                        <label for="ratebasis1">Rate Basis 1</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="select" name="ratebasis1" id="ratebasis1" onChange={(e) => this.selectType(e.target.value, 'ratebasis1')} value={this.state.ratebasis1}>
                                                            <option value=''>Select rate basis 1</option>
                                                            {this.state.ratebasis1arr.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please enter where boat registered</em>
                                                    </Col>
                                                </Row>

                                                <Row style={{ marginTop: "10px" }}>
                                                    <Col md="3">
                                                        <label for="rate2">Rate 2 (%)</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="text" name="rate2" id="rate2" onChange={(e) => this.handleChange(e)} value={this.state.rate2}>
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please enter mooring registration no</em>
                                                    </Col>

                                                    <Col md="3">
                                                        <label for="ratebasis2">Rate Basis 2</label>
                                                    </Col>
                                                    <Col md="3">
                                                        <Input type="select" name="ratebasis2" id="ratebasis2" onChange={(e) => this.selectType(e.target.value, 'ratebasis2')} value={this.state.ratebasis2}>
                                                            <option value=''>Select rate basis 2</option>
                                                            {this.state.ratebasis2arr.map((type, i) => {
                                                                return (<option value={type.value}>{type.label}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                        <em className="error invalid-feedback" >Please enter where boat registered</em>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : (
                                                null
                                            )}

                                        {(this.state.type == 'FIXED AMOUNT') ? (
                                            <Row style={{ marginTop: "10px" }}>
                                                <Col md="3">
                                                    <label for="eur">Amount in EUR</label>
                                                </Col>
                                                <Col md="3">
                                                    <Input type="text" name="amountineur" id="amountineur" onChange={(e) => this.handleChange(e)} value={this.state.amountineur}>
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter mooring registration no</em>
                                                </Col>

                                                <Col md="3">
                                                    <label for="gbp">Amount in GBP</label>
                                                </Col>
                                                <Col md="3">
                                                    <Input type="text" name="amountingbp" id="amountingbp" onChange={(e) => this.handleChange(e)} value={this.state.amountingbp}>
                                                    </Input>
                                                    <em className="error invalid-feedback" >Please enter mooring registration no</em>
                                                </Col>
                                            </Row>
                                        ) : (
                                                null
                                            )}
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <BTN color="primary" onClick={() => this.saveLevy()}>Save</BTN>{' '}
                                    <BTN color="secondary" onClick={this.togglePrimary}>Back</BTN>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>

                </div>
            </div >
        );
    }
}

export default levy;