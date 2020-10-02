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
import { Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, InputGroup, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
// import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../../utils/constants';
// import { apiBase } from '../../utils/config';

class noclaimBonus extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "years", header: "No of Years", sortable: true, filter: true, id: 0 },
            { field: "discount", header: "Discount Rate", sortable: true, filter: true, id: 1 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 2 }
        ];

        this.state = {
            noclaimbonusList: [],
            toggleModalDel: false,
            toggleModalAdd: false,
            cols: columns,
            arr: [],
            heading: 'Add',
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            isEdit: false,
            years: '',
            discount: '',
            primary: false,
            yearsError: true,
            discountError: true,
            NoClaimBonusId: '',
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.export = this.export.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getNoClaimBonusList();
    }

    getNoClaimBonusList() {
        try {
            api.post('api/getNoClaimBonus').then(res => {
                if (res.success) {
                    console.log("response", res.data);
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        // var Updated = (res.data[i].updatedon === undefined || res.data[i].updatedon === null || res.data[i].updatedon === "") ? ("No Updates") : (Moment(res.data[i].updatedon).format(CommonConfig.dateFormat.dateTime));
                        formattedData.push({
                            NoClaimBonusId: res.data[i].NoClaimBonusId,
                            years: res.data[i].YearCount,
                            discount: res.data[i].DiscountRate,
                        });
                        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                        this.setState({ arr: formattedData, str: str });
                    }
                } else {
                    console.log("Else");

                }
            }).catch(err => {

            });
        } catch (error) {
            console.log("err", error);
        }
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    edit = (rowData) => {
        console.log("rowData", rowData);
        this.togglePrimary();
        this.setState({
            heading: 'Update', years: rowData.years, discount: rowData.discount, NoClaimBonusId: rowData.NoClaimBonusId,
            yearsError: false, discountError: false
        });
    }

    actionTemplate(rowData, column) {
        return <div className="text-center">
            <Button type="button" icon="fa fa-pencil" color="primary" onClick={() => this.edit(rowData)} title="Edit" style={{ padding: 2 }}>
            </Button>
        </div>;
    }

    saveNoClaimBonus = () => {
        if (
            this.state.yearsError === false &&
            this.state.discountError === false
        ) {
            let data = {
                NoClaimBonusId: this.state.NoClaimBonusId,
                NCBYears: this.state.years,
                NCBDiscount: this.state.discount
            }
            api.post('api/addUpdateNoClaimBonus', data).then(res => {
                if (res.success) {
                    toast.success("Vessel data Added Successfully");
                    this.reset();
                    this.getNoClaimBonusList();
                } else {

                }
            }).
                catch(err => {
                });
        } else {
            this.show("years", this.state.yearsError);
            this.show("discount", this.state.discountError);
        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'years') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ yearsError: true });
                this.show("years", true);
            } else {
                let invSpace = /^[0-9]+[0-9]$/;
                let years = e.target.value;
                if (!invSpace.test(years)) {
                    this.setState({ yearsError: true });
                    this.show("years", true);
                } else {
                    this.setState({ yearsError: false, years: e.target.value });
                    this.show("years", false);
                }
            }
        }

        if (e.target.name === 'discount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ discountError: true });
                this.show("discount", true);
            } else {
                let invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
                let discount = e.target.value;
                if (!invSpace.test(discount)) {
                    this.setState({ discountError: true });
                    this.show("discount", true);
                } else {
                    this.setState({ discountError: false, discount: e.target.value });
                    this.show("discount", false);
                }
            }
        }
    }

    reset = () => {
        this.setState({
            years: '',
            discount: '',
            yearsError: true,
            discountError: true
        })
        this.togglePrimary();
    }

    export() {
        this.dt.exportCSV();
    }

    openModalAdd() {
        this.setState({ toggleModalAdd: !this.state.toggleModalAdd });
    }

    toggleLargeAdd = () => {
        this.setState({ toggleModalAdd: false });
    }

    togglePrimary() {
        this.setState({
            primary: !this.state.primary,
            heading: 'Add',
            NoClaimBonusId:''
        });
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
                    <h1>No Claim Bonus</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>

                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />

                        <Button type="button" icon="pi pi-plus" tooltip="Add No Claim Bonus" tooltipOptions={{ position: 'bottom' }} onClick={this.togglePrimary}></Button>
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.arr}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.arr.length}
                        exportFilename="Task List"
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

                    <Row>
                        <Col>
                            <Modal isOpen={this.state.primary}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader>{this.state.heading} No Claim Bonus</ModalHeader>
                                <ModalBody>
                                    <form className="form" action="#">
                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="4" className="pull-right">
                                                <label for="">No of Years*</label>
                                            </Col>
                                            <Col md="8">
                                                <InputGroup>
                                                    <Input type="text" name="years" id="years" onChange={e => this.handleChange(e)} placeholder="No. of Years" value={this.state.years} />
                                                    <em className="error invalid-feedback"> Please enter no. of years </em>
                                                </InputGroup>
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: "10px" }}>
                                            <Col md="4" className="pull-right">
                                                <label for="">Discount Rate (%)*</label>
                                            </Col>
                                            <Col md="8">
                                                <InputGroup>
                                                    <Input type="text" name="discount" id="discount" onChange={e => this.handleChange(e)} placeholder="Discount Rate" value={this.state.discount} />
                                                    <em className="error invalid-feedback"> Please enter valid discount rate (%) </em>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <BTN color="success" onClick={() => this.saveNoClaimBonus()}><i class="fa fa-check"></i> Save</BTN>{' '}
                                    <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Back</BTN>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </div>
            </div >
        );
    }
}

export default noclaimBonus;