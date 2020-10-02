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

class NoClaimBonusHistory extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "years", header: "NoofYears", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "discount", header: "DiscountRate", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "effectiveDate", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            // { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 2 }
        ];

        this.state = {
            noClaimBonusList: [],
            cols: columns,
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            years: '',
            discount: '',
            primary: false,
            toggleModal: false,
            yearsError: true,
            discountError: true,
            NoClaimBonusId: '',
            effectivedate: 'Effective Date',
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: true,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        // this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getNoClaimBonusHistory(this.props.match.params.Id)
        }
    }

    getNoClaimBonusHistory(Id) {
        var dataToSent = {
            NoClaimBonusId: Id,
        }
        api.post('api/getNoClaimBonusHistory', dataToSent).then(res => {
            console.log('getNoClaimBonusHistory', res);
            var formattedArr = [];
            for (var i = 0; i < res.data.length; i++) {
                formattedArr.push({
                    NoClaimBonusId: res.data[i].NoClaimBonusId,
                    years: res.data[i].YearCount,
                    discount: res.data[i].DiscountRate,
                    effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment(res.data[i].StartDate).format(CommonConfig.dateFormat.forDatePicker),
                });
            }
            console.log('formattedArr',formattedArr);            
            this.setState({ noClaimBonusList: formattedArr })
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
                        value={this.state.noClaimBonusList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.noClaimBonusList.length}
                        exportFilename={t("masterNoClaimBonus:NoClaimBonusList")}
                        currentPageReportTemplate={this.state.str}
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

export default withTranslation()(NoClaimBonusHistory);