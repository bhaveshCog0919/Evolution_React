import React, { Component } from "react";
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Cookies from 'js-cookie';
import api from "../../../utils/apiClient";
import APIConstant from "../../../utils/constants";
import { withTranslation } from 'react-i18next';
import { CommonConfig } from '../../../utils/constants';

class ChangePassword extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentPassword: '',
            currentPasswordError: true,
            isShowCurrentPassword: false,

            newPassword: '',
            newPasswordError: true,
            isShowNewPassword: false,

            confirmNewPassword: '',
            confirmNewPasswordError: true,
            isShowConfirmNewPassword: false
        };
    }

    handleChange = (e) => {
        const { t } = this.props;

        this.setState({ [e.target.name]: e.target.value });

        let passwordRegExp = CommonConfig.RegExp.password;

        if (e.target.name === 'currentPassword') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ currentPasswordError: true });
                this.show("currentPassword", true, "currentPasswordError", t("ChangePassword.currentPassword.error_blank"));
            } else {
                this.setState({ currentPasswordError: false, currentPassword: e.target.value });
                this.show("currentPassword", false, "currentPasswordError", "");
            }
        }

        if (e.target.name === 'newPassword') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ newPasswordError: true });
                this.show("newPassword", true, "newPasswordError", t("ChangePassword.newPassword.error_blank"));
            } else if (!passwordRegExp.test(e.target.value)) {
                this.setState({ newPasswordError: true });
                this.show("newPassword", true, "newPasswordError", t("ChangePassword.newPassword.error_pattern"));
            } else if (e.target.value.length < 6) {

            } else if (e.target.value.length > 15) {
                this.setState({ newPasswordError: true });
                this.show("newPassword", true, "newPasswordError", t("ChangePassword.newPassword.error_maxLength"));
            } else {
                this.setState({ newPasswordError: false, newPasswordError: e.target.value });
                this.show("newPassword", false, "newPasswordError", "");
            }
        }

        if (e.target.name === 'confirmNewPassword') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ confirmNewPasswordError: true });
                this.show("confirmNewPassword", true, "confirmNewPasswordError", t("ChangePassword.confirmNewPassword.error_blank"));
            } else if (e.target.value !== this.state.newPassword) {
                this.setState({ confirmNewPasswordError: true });
                this.show("confirmNewPassword", true, "confirmNewPasswordError", t("ChangePassword.confirmNewPassword.error_pattern"));
            } else {
                this.setState({ confirmNewPasswordError: true });
                this.show("confirmNewPassword", false, "confirmNewPasswordError", "");
            }
        }
    }

    toggle(type) {
        if (type === 'currentPassword') {
            this.setState({ isShowCurrentPassword: !this.state.isShowCurrentPassword });
        } else if (type === 'newPassword') {
            this.setState({ isShowNewPassword: !this.state.isShowNewPassword });
        } else if (type === 'confirmNewPassword') {
            this.setState({ isShowConfirmNewPassword: !this.state.isShowConfirmNewPassword });
        }
    }

    show(field, condition, errorField, message) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
            document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
        } else {
            document.getElementById(field).className = "form-control";
            document.getElementById(errorField).innerHTML = null;
        }
    }

    validate() {
        const { t } = this.props;
        let passwordRegExp = CommonConfig.RegExp.password;
        let errCount = 0;

        if (CommonConfig.isEmpty(this.state.currentPassword) || CommonConfig.isEmpty(this.state.newPassword) || CommonConfig.isEmpty(this.state.confirmNewPassword)) {
            errCount++;
            this.show("currentPassword", this.state.currentPasswordError, "currentPasswordError", t("ChangePassword.currentPassword.error_blank"));
            this.show("newPassword", this.state.newPasswordError, "newPasswordError", t("ChangePassword.newPassword.error_blank"));
            this.show("confirmNewPassword", this.state.confirmNewPasswordError, "confirmNewPasswordError", t("ChangePassword.confirmNewPassword.error_blank"));
        }

        if (!passwordRegExp.test(this.state.newPassword) || this.state.newPassword.length < 6 || this.state.newPassword.length > 15) {
            errCount++;
            this.show("newPassword", true, "newPasswordError", t("ChangePassword.newPassword.error_pattern"));
        }

        if (this.state.newPassword !== this.state.confirmNewPassword) {
            errCount++;
            this.show("confirmNewPassword", true, "confirmNewPasswordError", t("ChangePassword.confirmNewPassword.error_pattern"));
        }

        if (errCount > 0) {
            return false;
        } else {
            return true;
        }
    }

    changePassword() {
        try {
            if (this.validate()) {
                let loggedInUserData = CommonConfig.loggedInUserData();
                let data = {
                    currentPassword: this.state.currentPassword,
                    newPassword: this.state.newPassword,
                    confirmNewPassword: this.state.confirmNewPassword,
                    userId: loggedInUserData.LoginId,
                    token: Cookies.get('access_token')
                }
                api.post('api/changePassword', data).then(res => {
                    console.log("Fgdf", res);
                    if (res.data.success) {
                        this.reset();
                        toast.success(res.data.message);
                        Cookies.remove('access_token');
                        this.props.history.push('/login');
                    } else {
                        toast.error(res.data.message);
                    }
                }).catch(err => {
                    console.log("api error", err);
                });
            } else {
                // validation error
            }
        } catch (error) {
            console.log("front error", error);
        }
    }

    // onForgot() {
    //     if (this.state.usernameError === false) {
    //         const form = {
    //             'username': this.state.username
    //         }

    //         api.post(APIConstant.path.forgotpassword, form).then(res => {
    //             if (res.success) {
    //                 toast.success(res.message)
    //                 this.props.history.push('/login')
    //             } else {
    //                 toast.error(res.message)
    //             }
    //         }).catch(err => {
    //             toast.error(err)
    //         })
    //     } else {
    //         this.show("username", this.state.usernameError)
    //     }
    // }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ToastContainer></ToastContainer>

                <div className="app flex-row align-items-center">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="9" lg="7" xl="6">
                                <Card className="mx-4">
                                    <CardBody className="p-4">
                                        <Form>
                                            <h1>Change Password</h1>

                                            {/* <p className="text-muted">Reset Password Form</p> */}
                                            <div className="input-box">
                                                <InputGroup>
                                                    <Input name="currentPassword" type={this.state.isShowCurrentPassword ? "text" : "password"}
                                                        id="currentPassword" className="" placeholder={t("ChangePassword.currentPassword.placeholder")}
                                                        onChange={e => this.handleChange(e)} value={this.state.currentPassword}
                                                        onBlur={e => this.handleChange(e)} maxLength="15"
                                                    />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className={this.state.isShowCurrentPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                                                                onClick={() => this.toggle('currentPassword')} title={this.state.isShowCurrentPassword ? t("ChangePassword.currentPassword.hide") : t("ChangePassword.currentPassword.show")}>
                                                            </i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <em className="error invalid-feedback" id="currentPasswordError"></em>
                                                </InputGroup>
                                            </div>

                                            <div className="input-box">
                                                <InputGroup>
                                                    <Input name="newPassword" type={this.state.isShowNewPassword ? "text" : "password"}
                                                        id="newPassword" className="" placeholder={t("ChangePassword.newPassword.placeholder")}
                                                        onChange={e => this.handleChange(e)} value={this.state.newPassword}
                                                        onBlur={e => this.handleChange(e)} maxLength="15"
                                                    />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className={this.state.isShowNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                                                                onClick={() => this.toggle('newPassword')} title={this.state.isShowNewPassword ? t("ChangePassword.newPassword.hide") : t("ChangePassword.newPassword.show")}>
                                                            </i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <em className="error invalid-feedback" id="newPasswordError"></em>
                                                </InputGroup>
                                            </div>

                                            <div className="input-box">
                                                <InputGroup>
                                                    <Input name="confirmNewPassword" type={this.state.isShowConfirmNewPassword ? "text" : "password"}
                                                        id="confirmNewPassword" className="" placeholder={t("ChangePassword.confirmNewPassword.placeholder")}
                                                        onChange={e => this.handleChange(e)} value={this.state.confirmNewPassword}
                                                        onBlur={e => this.handleChange(e)} maxLength="15"
                                                    />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className={this.state.isShowConfirmNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                                                                onClick={() => this.toggle('confirmNewPassword')} title={this.state.isShowConfirmNewPassword ? t("ChangePassword.confirmNewPassword.hide") : t("ChangePassword.confirmNewPassword.show")}>
                                                            </i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <em className="error invalid-feedback" id="confirmNewPasswordError"></em>
                                                </InputGroup>
                                            </div>
                                            {/* <Button color="primary" className="px-4" onClick={() => this.onForgot()}>
                                                Submit
                                            </Button> */}

                                            <Button color="primary" className="px-4" onClick={() => this.changePassword()}>
                                                Submit
                                            </Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ChangePassword);