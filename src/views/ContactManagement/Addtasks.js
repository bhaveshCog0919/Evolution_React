import React, { Component } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalHeader, Col, Row, Input, InputGroup } from 'reactstrap';
import { ScrollPanel } from 'primereact/scrollpanel';
import api from '../../utils/apiClient';
import { toast } from 'react-toastify';
import APIConstant from '../../utils/constants';

// const Task_Followers = [];

const from_User = [
    { label: 'Parth', value: 'Parth' },
];

class Addtasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TaskTitle: '',
            TaskTitleError: true,

            Assignee: '',
            Assigneearr: [],
            AssigneeError: true,

            Task_Followers: '',
            Task_Followersarr: [],
            Task_FollowersError: true,

            Priority: '',
            Priorityarr: [],
            PriorityError: true,

            Type: '',
            TaskTypearr: [],
            TypeError: true,

            Status: '',
            Statusarr: [],
            statusError: true,

            DueDate: '',
            DueDateError: true,

            Regarding: '',
            Regardingarr: [],
            RegardingError: true,

            RegardingInput: '',
            RegardingInputError: true,

            Details: '',
            DetailsError: true,

            From_userType: from_User,
            From_user: '',
            From_userError: true,

            toggleModal: false,
        };
        console.log("Props", this.props);
    }

    componentWillMount() {
        // debugger
        this.reset();
        this.getAssignee();
        this.getTask_Followers();
        this.getPriorityType();
        this.getTaskType();
        this.getTaskStatus();
        this.getTaskRegardings();
    }

    reset = () => {
        // debugger
        this.state.Assigneearr = [];
        this.setState({
            Assigneearr: [], Task_Followersarr: [], Priorityarr: [], TaskTypearr: [], Statusarr: [],
            Regardingarr: [],
            isTaskEdit: false, TaskTitle: '',
            Task_Followers: '', Task_FollowersError: true,
            Assignee: '', AssigneeError: true,
            Priority: '', PriorityError: true,
            Type: '', TaskTitleError: true,
            Status: '', statusError: true,
            DueDate: '', DueDateError: true,
            Regarding: '', RegardingError: true,
            RegardingInput: '', RegardingInputError: true,
            Details: '', DetailsError: true,
            From_user: '', From_userError: true,
        });
    }

    closeModel() {
        this.setState({ toggleModal: false });
        this.reset();
    }

    getTask_Followers() {
        // debugger
        api.post('api/getTask_Followers').then(res => {
            if (res.success) {
                var Task_Followers = [];
                for (let i = 0; i < res.data.length; i++) {
                    Task_Followers.push({
                        name: res.data[i].forename,
                        code: res.data[i].personid
                    })
                }
                this.setState({ Task_Followersarr: Task_Followers });
            }
            else {
                console.log("Else");
            }
        })
    }

    getAssignee() {
        // debugger

        api.post('api/getAssignee').then(res => {

            if (res.success) {
                var Assignee = [];
                for (let i = 0; i < res.data.length; i++) {

                    Assignee.push({
                        label: res.data[i].personid,
                        value: res.data[i].forename
                    })
                }
                this.setState({ Assigneearr: Assignee });
            }
            else {
                console.log("Else");
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
                            label: res.data[i].stringmapname,
                            value: res.data[i].description
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
                            label: res.data[i].stringmapname,
                            value: res.data[i].description
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
                            label: res.data[i].stringmapname,
                            value: res.data[i].description
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
                            label: res.data[i].stringmapname,
                            value: res.data[i].description
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

    saveTask = () => {
        console.log(this.state);

        // debugger
        if (
            this.state.TaskTitleError === false &&
            this.state.PriorityError === false &&
            this.state.statusError === false &&
            this.state.TypeError === false &&
            this.state.Task_FollowersError === false &&
            // this.state.RegardingError === false &&
            this.state.DetailsError === false &&
            this.state.From_userError === false &&
            // this.state.DueDateError === false &&
            // this.state.RegardingInputError === false &&
            this.state.AssigneeError === false
        ) {
            const data = {
                'TaskTitle': this.state.TaskTitle,
                'Assignee': this.state.Assignee,
                'Priority': this.state.Priority,
                'Type': this.state.Type,
                'Status': this.state.Status,
                'DueDate': this.state.DueDate,
                'Regarding': this.state.Regarding,
                'RegardingInput': this.state.RegardingInput,
                'Details': this.state.Details,
                'From_user': this.state.From_user,
                'Task_Followers': this.state.Task_Followers
            };

            api.post('api/addUpdateTasks', data).then(res => {
                if (res.success) {
                    this.reset();
                    toast.success(res.message);
                    this.closeModel();
                } else {
                    console.log("Error");
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            this.show("TaskTitle", this.state.TaskTitleError);
            this.show("Priority", this.state.PriorityError);
            this.show("Type", this.state.TypeError);
            this.show("Status", this.state.statusError);
            this.show("Task_Followers", this.state.Task_FollowersError);
            // this.show("Regarding", this.state.RegardingError);
            this.show("Details", this.state.DetailsError);
            this.show("From_user", this.state.From_userError);
            // this.show("DueDate", this.state.DueDateError);
            // this.show("RegardingInput", this.state.RegardingInputError);
            this.show("Assignee", this.state.AssigneeError);
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log("e.target.name", e);

        if (e.target.name === 'TaskTitle') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ TaskTitleError: true });
                this.show("TaskTitle", true);
            } else {
                this.setState({ TaskTitleError: false, TaskTitle: e.target.value });
                this.show("TaskTitle", false);
            }
        }

        if (e.target.name === 'RegardingInput') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ RegardingInputError: true });
                this.show("RegardingInput", true);
            } else {
                this.setState({ RegardingInputError: false, RegardingInput: e.target.value });
                this.show("RegardingInput", false);
            }
        }

        if (e.target.name === 'Details') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ DetailsError: true });
                this.show("Details", true);
            } else {
                this.setState({ DetailsError: false, Details: e.target.value });
                this.show("Details", false);
            }
        }

        // if (e.target.name === 'DueDate') {
        //     if (e.target.value === '' || e.target.value === null) {
        //         this.setState({ DueDateError: true });
        //         this.show("DueDate", true);
        //     } else {
        //         this.setState({ DueDateError: false, DueDate: e.target.value });
        //         this.show("DueDate", false);
        //     }
        // }
    }

    selectType(value, type) {
        // debugger
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
            if (value === '' || value === null) {
                this.setState({ RegardingError: true, Regarding: value });
                this.show('Regarding', true);
            } else {
                this.setState({ RegardingError: false, Regarding: value });
                this.show('Regarding', false);
            }
        }

        if (type === 'From_user') {
            if (value === '' || value === null) {
                this.setState({ From_userError: true, From_user: value });
                this.show('From_user', true);
            } else {
                this.setState({ From_userError: false, From_user: value });
                this.show('From_user', false);
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

    show(field, condition) {
        // debugger
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    mulSelVal = (e) => {
        // debugger
        if (e.value.length === 0) {
            this.setState({ Task_FollowersError: true, Task_Followers: e.value });
            this.show('Task_Followers', true);
        } else {
            this.setState({ Task_FollowersError: false, Task_Followers: e.value });
            this.show('Task_Followers', false);
        }
    }

    addMoreTask = () => {
        this.openModal();
    }

    openModal = () => {
        this.setState({ toggleModal: !this.state.toggleModal });
    }

    editMoreTask = (event) => {
        this.openModal();
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false, TaskTitle: '',
            Task_Followers: '', Task_FollowersError: true,
            Assignee: '', AssigneeError: true,
            Priority: '', PriorityError: true,
            Type: '', TaskTitleError: true,
            Status: '', statusError: true,
            DueDate: '', DueDateError: true,
            Regarding: '', RegardingError: true,
            RegardingInput: '', RegardingInputError: true,
            Details: '', DetailsError: true,
            From_user: '', From_userError: true
        });
    }

    render() {

        return (
            <div>
                <div className="col-md-12 text-right">
                    <Button type="button" label="Add New Task" onClick={() => this.addMoreTask()}></Button>
                </div>
                <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}><h2>Add Task</h2></ModalHeader>
                    <ScrollPanel>
                        <div style={{ marginLeft: 20 }}>
                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 20 }}>
                                    <label style={{ fontSize: 16 }}>Title*</label>
                                </Col>
                                <Col md="4" style={{ marginTop: 20, maxWidth: 205 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="text" name="TaskTitle" id="TaskTitle" onChange={e => this.handleChange(e)} placeholder="Title" size="30" value={this.state.TaskTitle} />
                                        <em className="error invalid-feedback"> Please enter title </em>
                                    </InputGroup>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Task Followers*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <MultiSelect name="Task_Followers" id="Task_Followers" optionLabel="name" style={{ width: "200px" }} value={this.state.Task_Followers} options={this.state.Task_Followersarr}
                                            onChange={(e) => this.mulSelVal(e)}
                                            filter={true} />
                                        <em className="error invalid-feedback">Please select Task Followers </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Assignee*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Assignee" id="Assignee" onChange={(e) => this.selectType(e.target.value, 'Assignee')} value={this.state.Assignee}>
                                            <option value=''>Select Assignee</option>
                                            {this.state.Assigneearr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback">Please select Assignee </em>
                                    </InputGroup>
                                </Col>


                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Priority*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Priority" id="Priority" onChange={(e) => this.selectType(e.target.value, 'Priority')} value={this.state.Priority}>
                                            <option value=''>Select Priority</option>
                                            {this.state.Priorityarr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback"> Please select Priority </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Type*</label>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Type" id="Type" onChange={(e) => this.selectType(e.target.value, 'Type')} value={this.state.Type}>
                                            <option value=''>Select Type</option>
                                            {this.state.TaskTypearr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback"> Please select Type </em>
                                    </InputGroup>
                                </Col>

                                <Col md="3" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Status*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Status" id="Status" onChange={(e) => this.selectType(e.target.value, 'Status')} value={this.state.Status}>
                                            <option value=''>Select Status</option>
                                            {this.state.Statusarr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback"> Please select Status </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Due Date</label>
                                </Col>
                                <Col md="5" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="date" name="DueDate" id="DueDate" onChange={e => this.handleChange(e)} size="30" value={this.state.DueDate} />
                                        <em className="error invalid-feedback"> Please enter Due Date </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Regarding</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="Regarding" id="Regarding" onChange={(e) => this.selectType(e.target.value, 'Regarding')} value={this.state.Regarding}>
                                            <option value=''>Select Regarding</option>
                                            {this.state.Regardingarr.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback"> Please select Regardings </em>
                                    </InputGroup>
                                </Col>

                                <Col md="5" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="text" name="RegardingInput" id="RegardingInput" onChange={e => this.handleChange(e)} placeholder="Regardings" size="30" value={this.state.RegardingInput} />
                                        <em className="error invalid-feedback"> Please enter Regardings </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label style={{ fontSize: 16 }}>Details*</label>
                                </Col>
                                <Col md="5" style={{ marginTop: 20 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="text" name="Details" id="Details" onChange={e => this.handleChange(e)} placeholder="Details" size="30" value={this.state.Details} />
                                        <em className="error invalid-feedback"> Please enter Details</em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row style={{ backgroundColor: "#fff" }}>
                                <Col md="2" style={{ marginTop: 25 }}>
                                    <label>From User*</label>
                                </Col>
                                <Col md="3" style={{ marginTop: 25 }}>
                                    <InputGroup className="mb-12">
                                        <Input type="select" name="From_user" id="From_user" onChange={(e) => this.selectType(e.target.value, 'From_user')} value={this.state.From_user}>
                                            <option value=''>Select From user</option>
                                            {this.state.From_userType.map((type, i) => {
                                                return (<option value={type.label}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em className="error invalid-feedback"> Please select From user </em>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row className="text-center" style={{ backgroundColor: "#fff" }}>
                                <Col style={{ marginTop: 30 }} >
                                    <Button style={{ marginRight: 10, marginTop: 50, border: "none" }} onClick={() => this.saveTask()} label="Save"></Button>
                                </Col>
                            </Row>
                        </div>
                    </ScrollPanel>
                </Modal>
            </div>
        );
    }
}

export default Addtasks;