import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, InputGroup, Button as BTN } from 'reactstrap';
import { ScrollPanel } from 'primereact/scrollpanel';
import { withTranslation } from 'react-i18next';
import DatePicker from 'react-date-picker';
import Moment from "moment";
import AddContactNav from './DefaultAddContactNav';
import api from '../../utils/apiClient';
import { CommonConfig } from '../../utils/constants';
import APIConstant from '../../utils/constants';

class x_tasks extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "id", header: "Id", sortable: true, filter: true, id: 0 },
            { field: "Reporter", header: "Reporter", sortable: true, filter: true, id: 1 },
            { field: "Assignee", header: "Assignee", sortable: true, filter: true, id: 2 },
            { field: "Task_Follower", header: "TaskFollower", sortable: true, filter: true, id: 3 },
            { field: "Title", header: "Title", sortable: true, filter: true, id: 4 },
            { field: "Priority", header: "Priority", sortable: true, filter: true, id: 5 },
            { field: "Type", header: "TasksType", sortable: true, filter: true, id: 6 },
            { field: "DueDate", header: "DueDate", sortable: true, filter: true, id: 7 },
            { field: "Created", header: "Created", sortable: true, filter: true, id: 8 },
            { field: "Updated", header: "Updated", sortable: true, filter: true, id: 9 },
            { field: "Status", body: this.statusTemplate, header: "Status", sortable: true, filter: true, id: 10 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 11 }
        ];

        this.state = {
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
            isTrigerred: true,

            isSelected: true,

            taskID: '',
            TaskTitle: '',
            TaskTitleError: true,

            Assignee: '',
            Assigneearr: [],
            AssigneeError: true,

            Task_Followers: '',
            Task_Followersarr: [],
            Task_FollowersError: true,

            Priority: 'Normal',
            Priorityarr: [],
            PriorityError: false,

            Type: '',
            TaskTypearr: [],
            TypeError: true,

            Status: 'Open',
            Statusarr: [],
            statusError: false,

            DueDate: '',
            DueDateError: true,

            Regarding: '',
            Regardingarr: [],
            RegardingError: true,

            RegardingInput: '',
            RegardingInputError: true,

            Details: '',
            DetailsError: true,

            From_user: '',
            From_userError: true,

            isEdit: false,
            taskfollowerid: '',

            userImg: '',
            userImgData: '',
            noteaddon: '',
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.onBrandChange = this.onBrandChange.bind(this);
        this.export = this.export.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
    }

    componentDidMount() {
        this.getTasks();
        this.getAssignee();
        this.getTask_Followers();
        this.getPriorityType();
        this.getTaskType();
        this.getTaskStatus();
        this.getTaskRegardings();
        this.Task_Followers();
    }

    Task_Followers() {
        api.post('api/taskFollowers').then(res => {
            if (res.success) {
                // console.log("taskFollowerssssss", res);
            }
            else {
                // console.log("Else");
            }
        })
    }

    getTasks() {
        api.post('api/getTasks').then(res => {
            if (res.success) {
                // console.log("getTasks", res);
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    var Updated = (res.data[i].UpdatedOn === undefined || res.data[i].UpdatedOn === null || res.data[i].UpdatedOn === "") ? ("No Updates") : (Moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateTime));
                    formattedData.push({
                        id: [i + 1],
                        TaskFollowerID: res.data[i].TaskFollowerID,
                        Taskid: res.data[i].TaskId,
                        Assigneeid: res.data[i].TaskAssignee,
                        Reporter: res.data[i].FromUser,
                        Assignee: res.data[i].AssigneeName,
                        Title: res.data[i].Title,
                        Status: res.data[i].TaskStatus,
                        Priority: res.data[i].Priority,
                        Type: res.data[i].TaskType,
                        Task_Follower: res.data[i].FollowerName,
                        Follower_Id: res.data[i].Followerid,
                        Regarding: res.data[i].Regarding,
                        RegardingDetails: res.data[i].RegardingValue,
                        Details: res.data[i].Details,
                        DueDate: Moment(res.data[i].DueDate).format(CommonConfig.dateFormat.dateTime),
                        Created: Moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateTime),
                        Updated: Updated,
                    });
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';

                    this.setState({ arr: formattedData, str: str });
                }
            } else {
                // console.log("Else");

            }
        }).catch(err => {

        });
    }

    getAssignee() {
        api.post('api/getAssignee').then(res => {
            if (res.success) {
                var Assignee = [];
                for (let i = 0; i < res.data.length; i++) {

                    Assignee.push({
                        label: res.data[i].PersonId,
                        value: res.data[i].Forename
                    })
                }
                this.setState({ Assigneearr: Assignee });
            }
            else {
                // console.log("Else");
            }
        })
    }

    getTask_Followers() {
        api.post('api/getTask_Followers').then(res => {
            if (res.success) {
                var Task_Followers = [];
                for (let i = 0; i < res.data.length; i++) {
                    Task_Followers.push({
                        name: res.data[i].Forename,
                        code: res.data[i].PersonId,
                        taskfollowerid: ''
                    })
                }
                this.setState({ Task_Followersarr: Task_Followers });
            }
            else {
                // console.log("Else");
            }
        })
    }

    getTaskStatus() {
        try {
            const data = {
                stringmaptype: 'TASKSTATUS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var Status = [];
                    for (let i = 0; i < res.data.length; i++) {
                        Status.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ Statusarr: Status });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getTaskRegardings() {
        try {
            const data = {
                stringmaptype: 'TASKREGARDING',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var Regardings = [];
                    for (let i = 0; i < res.data.length; i++) {
                        Regardings.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ Regardingarr: Regardings });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getTaskType() {
        try {
            const data = {
                stringmaptype: 'TASKTYPE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var Type = [];
                    for (let i = 0; i < res.data.length; i++) {
                        Type.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ TaskTypearr: Type });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    getPriorityType() {

        try {
            const data = {
                stringmaptype: 'TASKPRIORITY',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var Priority = [];
                    for (let i = 0; i < res.data.length; i++) {
                        Priority.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ Priorityarr: Priority });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    reset = () => {
        this.setState({
            isTaskEdit: false, TaskTitle: '',
            Task_Followers: '', Task_FollowersError: true,
            Assignee: '', AssigneeError: true,
            Priority: this.state.Priority, PriorityError: false,
            Type: '', TaskTitleError: true,
            Status: this.state.Status, statusError: false,
            DueDate: '', DueDateError: true,
            Regarding: '', RegardingError: true,
            RegardingInput: '', RegardingInputError: true,
            Details: '', DetailsError: true,
            userImgData: '', noteaddon: '',
            taskID: '', isEdit: false
        });
    }

    editTask(rowData) {
        // console.log("rowData", rowData);

        var TaskFollower_ID = rowData.TaskFollowerID.split(',');
        // console.log("TaskFollower_ID", TaskFollower_ID);

        var Follower_id = rowData.Follower_Id.split(',');
        var taskFollower_id = [];
        for (var i = 0; i < Follower_id.length; i++) {
            let record = this.state.Task_Followersarr.find(x => x.code == Follower_id[i]);
            record.taskfollowerid = TaskFollower_ID[i];
            record.isEdit = this.state.isEdit;
            taskFollower_id.push(record);
        }


        this.setState({
            toggleModalAdd: true,
            taskID: rowData.Taskid, TaskTitle: rowData.Title,
            Task_Followers: taskFollower_id,
            Task_FollowersError: false,
            Assignee: rowData.Assigneeid, AssigneeError: false,
            Priority: rowData.Priority, PriorityError: false,
            Type: rowData.Type, TypeError: false, TaskTitleError: false,
            Status: rowData.Status, statusError: false,
            DueDate: Moment(rowData.DueDate, CommonConfig.dateFormat.dateTime).format('YYYY-MM-DD'), DueDateError: false,
            Regarding: rowData.Regarding, RegardingError: false,
            RegardingInput: rowData.RegardingDetails, RegardingInputError: false,
            Details: rowData.Details, DetailsError: false,
            From_userError: false, isEdit: true,
        });
        // console.log("Task_Followers", this.state.Task_Followers);

    }

    addMoreTask = () => {
        this.openModalAdd();
    }

    openModalDel() {
        this.setState({ toggleModalDel: !this.state.toggleModalDel });
    }

    openModalAdd() {
        this.reset();
        this.setState({ toggleModalAdd: !this.state.toggleModalAdd });
    }

    toggleLargeDel = () => {
        this.setState({ toggleModalDel: false });
    }

    toggleLargeAdd = () => {
        this.reset();
        this.setState({
            toggleModalAdd: false, TaskTitle: '',
            Task_Followers: '', Task_FollowersError: false,
            Assignee: '', AssigneeError: false,
            Priority: this.state.Priority, PriorityError: false,
            Type: '', TaskTitleError: false,
            Status: this.state.Status, statusError: false,
            DueDate: '', DueDateError: false,
            Regarding: '', RegardingError: false,
            RegardingInput: '', RegardingInputError: false,
            Details: '', DetailsError: false,
            isEdit: false,

        });
    }

    closeModelAdd() {
        this.reset();
        this.setState({ toggleModalAdd: false });
    }

    CancleTask() {
        this.reset();
        this.setState({ toggleModalAdd: false });
    }

    DeleteTaskModal = (rowdata) => {
        this.setState({ taskID: rowdata.Taskid });
        this.openModalDel(rowdata);
    }

    DeleteTask = (Taskid) => {
        api.post('api/deleteTasks', { taskId: Taskid }).then(res => {
            if (res.success) {
                this.openModalDel();
                this.getTasks();
                toast.success('Task deleted successfully');
            } else {

            }
        }).catch(err => {
        });
    }

    saveTask = () => {
        if (
            this.state.TaskTitleError === false &&
            this.state.PriorityError === false &&
            this.state.statusError === false &&
            this.state.TypeError === false &&
            this.state.Task_FollowersError === false &&
            this.state.DetailsError === false &&
            this.state.AssigneeError === false &&
            this.state.RegardingInputError === false
        ) {
            const data = {
                'TaskTitle': this.state.TaskTitle.trim(),
                'Assignee': this.state.Assignee,
                'Priority': this.state.Priority,
                'Type': this.state.Type,
                'Status': this.state.Status,
                'DueDate': this.state.DueDate,
                'Regarding': this.state.Regarding,
                'RegardingInput': this.state.RegardingInput,
                'Details': this.state.Details.trim(),
                'Task_Followers': this.state.Task_Followers,
                'TaskId': this.state.taskID,
                'isEdit': this.state.isEdit,
                'noteaddon': this.state.userImg
            };

            api.post('api/addUpdateTasks', data).then(res => {
                if (res.success) {
                    document.getElementById("noteaddon").value = null;
                    toast.success('Task added successfully');
                    this.closeModelAdd();
                    this.getTasks();
                    this.reset();
                } else {
                    console.log("Error");
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            this.show("TaskTitle", this.state.TaskTitleError);
            if (this.state.isEdit) {
                this.show("Priority", this.state.PriorityError);
                this.show("Status", this.state.statusError);
            }
            this.show("Type", this.state.TypeError);
            this.show("Task_Followers", this.state.Task_FollowersError);
            this.show("Details", this.state.DetailsError);
            this.show("Assignee", this.state.AssigneeError);
            this.show("RegardingInput", this.state.RegardingInputError);

        }
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    mulSelVal = (e) => {
        if (e.value.length == 0) {
            this.setState({ Task_FollowersError: true, Task_Followers: e.value });
            this.show('Task_Followers', true);
        } else {
            this.setState({ Task_FollowersError: false, Task_Followers: e.value });
            this.show('Task_Followers', false);
        }
        // console.log("Afdsas", this.state.Task_Followers);

    }

    selectType(value, type) {
        if (type === 'Priority') {
            if (value === '' || value === null) {
                this.setState({ PriorityError: true, Priority: value });
                this.show('Priority', true);
            } else {
                this.setState({ PriorityError: false, Priority: value });
                this.show('Priority', false);
            }
        }

        if (type === 'Type') {
            if (value === '' || value === null) {
                this.setState({ TypeError: true, Type: value });
                this.show('Type', true);
            } else {
                this.setState({ TypeError: false, Type: value });
                this.show('Type', false);
            }
        }

        if (type === 'Status') {
            if (value === '' || value === null) {
                this.setState({ statusError: true, Status: value });
                this.show('Status', true);
            } else {
                this.setState({ statusError: false, Status: value });
                this.show('Status', false);
            }
        }


        if (type === 'Regarding') {
            this.setState({ RegardingInputError: false, RegardingInput: '' });
            this.show("RegardingInput", false);
            if (value === '' || value === null) {
                this.setState({ Regarding: value });
                // this.show('Regarding', true);
            } else {
                this.setState({ Regarding: value });
                if (this.state.RegardingInput == '') {
                    this.setState({ RegardingInputError: true });
                    this.show("RegardingInput", true);
                }
                // this.show('Regarding', false);
            }
        }

        if (type === 'Assignee') {
            if (value === '' || value === null) {
                this.setState({ AssigneeError: true, Assignee: value });
                this.show('Assignee', true);
            } else {
                this.setState({ AssigneeError: false, Assignee: value });
                this.show('Assignee', false);
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'TaskTitle') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ TaskTitleError: true });
                this.show("TaskTitle", true);
            } else {
                this.setState({ TaskTitleError: false, TaskTitle: e.target.value });
                this.show("TaskTitle", false);
            }
        }

        if (e.target.name === 'RegardingInput') {
            if (CommonConfig.isEmpty(e.target.value)) {
                if (this.state.Regarding != '') {
                    this.setState({ RegardingInputError: true });
                    this.show("RegardingInput", true);
                }
            } else {
                if (this.state.Regarding != '') {
                    this.setState({ RegardingInputError: false });
                    this.show("RegardingInput", false);
                }
                this.setState({ RegardingInput: e.target.value });
            }
        }

        if (e.target.name === 'Details') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ DetailsError: true });
                this.show("Details", true);
            } else {
                this.setState({ DetailsError: false, Details: e.target.value });
                this.show("Details", false);
            }
        }
    }

    statusTemplate(rowData, column) {

        let Status = rowData.Status;
        let backgroundColor = Status == 'Open' ? '#D8D8D8' : (Status == 'Completed') ? '#C5E0B3' : (Status == 'In Progress') ? '#F7CAAC' : '#F72A00';
        return <div style={{ backgroundColor: backgroundColor, borderRadius: 5, paddingLeft: 3, paddingRight: 3 }}>{rowData.Status}</div>;
    }

    onBrandChange(event) {
        this.dt.filter(event.value, 'brand', 'equals');
        this.setState({ brand: event.value });
    }

    export() {
        this.dt.exportCSV();
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={() => this.editTask(rowData)}></Button>
            <Button type="button" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} icon="pi pi-trash" className="p-button-danger" onClick={() => this.DeleteTaskModal(rowData)}></Button>
        </div>;
    }

    goBack() {
        this.props.history.push('/')
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    selectImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ userImgData: event.target.files[0] });
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ userImg: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    render() {
        const { t } = this.props;

        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={t("contactTask:Table_header."+col.header+"")} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });

        return (
            <div>
                <div xs="12" md="12">
                    <Row>
                        <Col xs="12" md="12">
                            <AddContactNav {...this.props} />
                        </Col>
                    </Row>

                    <div className="basic-header">
                        <h1>{t("contactTask:taskTitle")}</h1>
                        <div className="header-right-option">
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />

                            <MultiSelect value={this.state.cols} options={this.colOptions}
                                fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip={t("contactTask:toggleColumn")}
                                onChange={this.onColumnToggle} style={{ width: '50px' }}
                            />

                            <Button type="button" icon="pi pi-plus" tooltip={t("contactTask:addTask")} tooltipOptions={{ position: 'bottom' }} onClick={() => this.addMoreTask()}></Button>
                        </div>
                    </div>

                    {/* <div className="content-section introduction row" style={{ marginTop: 10 }}>
                        <div className="feature-intro col-md-6">
                            <h1></h1>
                        </div>

                    </div> */}

                    <div className="table-custom">
                        <DataTable ref={(el) => this.dt = el} value={this.state.arr} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                            paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.arr.length} exportFilename="Task List"
                            currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                            responsive={true} resizableColumns={true} columnResizeMode="fit"
                            scrollable={true} scrollHeight="265px">
                            {columns}
                        </DataTable>
                    </div>
                </div>

                <Modal isOpen={this.state.toggleModalDel} toggle={this.toggleLargeDel} className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLargeDel}>Delete Task</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete task?
                    </ModalBody>
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.DeleteTask(this.state.taskID)}><i class="fa fa-check"></i> Yes</BTN>{' '}
                        <BTN color="primary"onClick={this.toggleLargeDel}><i class="fa fa-close"></i> Close</BTN>
                        {/* <button color="primary" onClick={() => this.DeleteTask(this.state.taskID)}>Yes</button>
                        <button color="secondary" onClick={this.toggleLargeDel}>Cancel</button> */}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.toggleModalAdd} toggle={this.toggleLargeAdd}
                    className={'modal-primary taskModel' + this.props.className}>
                    <ModalHeader toggle={this.toggleLargeAdd}>{(this.state.isEdit)?(<div>{t("contactTask:editTask")}</div>):(<div>{t("contactTask:addTask")}</div>)}</ModalHeader>
                    <ScrollPanel>
                        <div style={{ marginLeft: 20 }}>
                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 20 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Title.label")}*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 20, maxWidth: 205 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="text" name="TaskTitle" id="TaskTitle" onChange={e => this.handleChange(e)} placeholder={t("contactTask:Title.placeholder")} maxLength="30" value={this.state.TaskTitle} />
                                        <em className="error invalid-feedback"> {t("contactTask:Title.error_blank")} </em>
                                    </InputGroup>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Task_Followers.label")}*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <MultiSelect name="Task_Followers" id="Task_Followers" optionLabel="name" style={{ width: "200px" }} value={this.state.Task_Followers} options={this.state.Task_Followersarr}
                                            onChange={(e) => this.mulSelVal(e)}
                                            filter={true} />
                                        <em className="error invalid-feedback">{t("contactTask:Task_Followers.error_blank")}</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Assignee:label")}*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Assignee" id="Assignee" onChange={(e) => this.selectType(e.target.value, 'Assignee')} value={this.state.Assignee}>
                                            <option value=''>{t("contactTask:Assignee.placeholder")}</option>
                                            {this.state.Assigneearr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback">{t("contactTask:Assignee.error_blank")}</em>
                                    </InputGroup>
                                </Col>


                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Priority.label")}*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        {(this.state.isEdit == true) ? (
                                            <Input type="select" name="Priority" id="Priority" onChange={(e) => this.selectType(e.target.value, 'Priority')} value={this.state.Priority}>
                                                <option value=''>{t("contactTask:Priority.placeholder")}</option>
                                                {this.state.Priorityarr.map((type, i) => {
                                                    return (<option value={type.label}>{type.value}</option>)
                                                })
                                                }
                                            </Input>
                                        ) : (
                                                <Input disabled={true} type="select" name="Priority" id="Priority" onChange={(e) => this.selectType(e.target.value, 'Priority')} value={this.state.Priority}>
                                                    <option value=''>{t("contactTask:Priority.placeholder")}</option>
                                                    {this.state.Priorityarr.map((type, i) => {
                                                        return (<option value={type.label}>{type.value}</option>)
                                                    })
                                                    }
                                                </Input>
                                            )}
                                        <em className="error invalid-feedback">{t("contactTask:Priority.error_blank")}</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Type.label")}*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Type" id="Type" onChange={(e) => this.selectType(e.target.value, 'Type')} value={this.state.Type}>
                                            <option value=''>{t("contactTask:Type.placeholder")}</option>
                                            {this.state.TaskTypearr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback">{t("contactTask:Type.error_blank")}</em>
                                    </InputGroup>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Status.label")}*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        {(this.state.isEdit == true) ? (<Input type="select" name="Status" id="Status" onChange={(e) => this.selectType(e.target.value, 'Status')} value={
                                            this.state.Status}>
                                            <option value=''>{t("contactTask:Status.placeholder")}</option>
                                            {this.state.Statusarr.map((type, i) => {
                                                return (<option value={type.placeholder}>{type.value}</option>)
                                            })
                                            }
                                        </Input>)
                                            :
                                            (<Input disabled={true} type="select" name="Status" id="Status" onChange={(e) => this.selectType(e.target.value, 'Status')} value={this.state.Status}>
                                                <option value=''>{t("contactTask:Status.placeholder")}</option>
                                                {this.state.Statusarr.map((type, i) => {
                                                    return (<option value={type.label}>{type.value}</option>)
                                                })
                                                }
                                            </Input>)}
                                        <em className="error invalid-feedback">{t("contactTask:Status.error_blank")}</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Due_Date.label")}</label>
                                </Col>
                                <Col md="5" style={{ marginTop: 25 }}>
                                    {/* <InputGroup className="mb-12">
                                        <Input type="date" name="DueDate" id="DueDate" onChange={e => this.handleChange(e)} size="30" value={this.state.DueDate} />
                                        <em className="error invalid-feedback"> Please enter Due Date </em>
                                    </InputGroup> */}
                                       <DatePicker name="DueDate" id="DueDate" onChange={e => this.setState({DueDate: e})}
                                        value={this.state.DueDate} minDate={Moment().toDate()}
                                        className="" calendarClassName=""
                                    />
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Regarding.label")}</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Regarding" id="Regarding" onChange={(e) => this.selectType(e.target.value, 'Regarding')} value={this.state.Regarding}>
                                            <option value=''>{t("contactTask:Regarding.placeholder")}</option>
                                            {this.state.Regardingarr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback">{t("contactTask:Regarding.error_blank")}</em>
                                    </InputGroup>
                                </Col>

                                <Col md="5" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="text" name="RegardingInput" id="RegardingInput" onChange={e => this.handleChange(e)} placeholder={t("contactTask:Regarding_Value.placeholder")} maxLength="38" value={this.state.RegardingInput} />
                                        <em className="error invalid-feedback">{t("contactTask:Regarding_Value.error_blank")}</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>{t("contactTask:Details.label")}*</label>
                                </Col>
                                <Col md="9" style={{ marginTop: 20 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="textarea" name="Details" id="Details" onChange={e => this.handleChange(e)} placeholder={t("contactTask:Details.placeholder")} maxLength="500" value={this.state.Details} />
                                        <em className="error invalid-feedback">{t("contactTask:Details.error_blank")}</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 20 }}>
                                    <label>{t("contactTask:Notes_addon.label")}</label>
                                </Col>
                                <Col md="5" style={{ marginTop: 20 }}>
                                    <div className="btn btn-primary">
                                        <Input type="file" name="noteaddon" id="noteaddon" onChange={this.selectImage} />
                                    </div>
                                </Col>
                            </Row>

                            <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                                <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.saveTask()}
                                    icon="pi pi-check" label={this.state.isEdit ? t("buttons.Edit") : t("buttons.Save")} />
                                <Button style={{ marginRight: 10, marginTop: 20, border: "none" }} onClick={() => this.CancleTask()}
                                    icon="pi pi-times" label={t("buttons.Close")} color="red" />
                            </Row>
                        </div>
                    </ScrollPanel>
                </Modal>
            </div>
        );
    }
}

export default withTranslation()(x_tasks);