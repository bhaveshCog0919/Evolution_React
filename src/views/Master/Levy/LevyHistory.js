import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN, InputGroup } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import moment from 'moment';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import APIConstant from '../../../utils/constants';

class LevyHistory extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "type", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "rate1", header: "Rate1", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "rateBasis1", header: "RateBasis1", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "rate2", header: "Rate2", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "rateBasis2", header: "RateBasis2", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "amountInEUR", header: "AmountInEUR", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "amountInGBP", header: "AmountInGBP", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "effectiveDate", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
        ];

        this.state = {
            LevyId: '',
            country: '',
            countryarr: [],
            countryError: true,
            type: '',
            typeError: true,
            typearr: [],
            rate1: '',
            rate1Error: true,
            rateBasis1: '',
            rateBasis1arr: [],
            rateBasis1Error: true,
            rate2: '',
            rate2Error: true,
            rateBasis2: '',
            rateBasis2arr: [],
            rateBasis2Error: true,
            amountInEUR: '',
            amountInEURError: true,
            amountInGBP: '',
            amountInGBPError: true,
            effectivedate: 'Effective Date',
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: true,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            toggleModal: false,
            cols: columns,
            LevyList: [],
            rowData: '',
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            primary: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        // this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        console.log('this.props',this.props);
        
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getLevyHistory(this.props.match.params.Id)
        }
    }

    getLevyHistory(Id) {
        var dataToSent = {
            LevyId: Id,
        }
        api.post('api/getLevyHistory', dataToSent).then(res => {
            console.log('getLevyHistory', res);
            var formattedArr = [];
            for (var i = 0; i < res.data.length; i++) {
                formattedArr.push({
                    LevyId: res.data[i].LevyId,
                    country: res.data[i].Country,
                    type: res.data[i].Type,
                    rate1: res.data[i].Rate1,
                    rateBasis1: res.data[i].RateBasis1,
                    rate2: res.data[i].Rate2,
                    rateBasis2: res.data[i].RateBasis2,
                    amountInEUR: res.data[i].AmountEUR,
                    amountInGBP: res.data[i].AmountGBP,
                    effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment(res.data[i].StartDate).format(CommonConfig.dateFormat.forDatePicker),
                });
            }
            console.log('formattedArr',formattedArr);            
            this.setState({ LevyList: formattedArr })
        })
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    render() {
        const { t } = this.props;
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Vessel Class History</h1>
                </div>

                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.LevyList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.LevyList.length}
                        exportFilename={t("masterLevy:LevyList")}
                        currentPageReportTemplate={this.state.str}
                        // scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage={t("translation:NoRecordsMsg")}
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                </div>
            </div>
        )
    }
}

export default withTranslation()(LevyHistory);