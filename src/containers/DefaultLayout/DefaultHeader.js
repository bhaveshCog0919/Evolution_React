import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import {
  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Modal, Form,
  ModalBody, ModalHeader, ModalFooter, Button, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText ,UncontrolledTooltip
} from 'reactstrap';
import PropTypes from 'prop-types';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler, AppSidebarMinimizer } from '@coreui/react';
import { withTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import moment from 'moment';

import logo from '../../assets/img/yachtsman_logo.png';
import UserManual from '../../assets/User Manual/EvolutionUserGuide.pdf';
import profile from '../../assets/img/defaultProfile.png';
import { CommonConfig } from '../../utils/constants';
import api from '../../utils/apiClient';
import { apiBase } from '../../utils/config';
import { type } from 'os';
var path = require('path');


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,

      currentPassword: '',
      currentPasswordError: true,
      isShowCurrentPassword: false,

      newPassword: '',
      newPasswordError: true,
      isShowNewPassword: false,

      confirmNewPassword: '',
      confirmNewPasswordError: true,
      isShowConfirmNewPassword: false,
      notificationView: false,
      notificationList: [],
      notificationCount:Number,
    }
  }


  componentDidMount(){
    setInterval(this.getNotificationList, 10000);
    setInterval(this.getNotificationCount, 10000);
    this.getNotificationList();
    this.getNotificationCount();


  }

  getNotificationList(){
    let data= {
    }
     api.post('api/getNotificationList', data).then( res => {
      console.log('res',res)
      if (res.success) {
        this.setState({ notificationList: res.data});
        console.log('res',res.data)
      } else {
          console.log("SomeThing went wrong in get notification list.");
      }
    }).catch(err => {
        console.log("get notification err", err);
    })
  }

  viewPolicyDetail(not){
    this.updateNotification(not , 'Update');
    // window.open( window.location.origin + '/#' + '/PolicyDetailsMerged/' + not.EntityId + '/1/1','_blank');     
    this.props.history.push({
            pathname: '/PolicyDetailsMerged/' + not.EntityId + '/1/1' 
            
      });
  }

  updateNotification(notes , type  ){
    console.log('isRead',notes.IsRead.data[0])
    let data= {
      NotificationId: notes.DashboardNotificationId,
      Type: type,
      IsRead: notes.IsRead.data[0] == 1 ? false : true ,
    }
    api.post('api/updateNotification', data).then( res => {
      console.log('res',res)
      if (res.success) {
        this.getNotificationList();
        this.getNotificationCount();
      //  this.setState({ notificationList: res.data});
      console.log('res',res.data)
      } else {
          toast.error("SomeThing went wrong in updating notification.");
      }
    }).catch(err => {
      console.log("updating notification err", err);
    })
  }

  getNotificationCount(){
    let data ={
    }
    api.post('api/getNotificationCount', data).then( res => {
       console.log('res',res)
       if (res.success) {
         this.setState({ notificationCount: res.data[0].TotalCount});
         console.log('res',res.data)
       } else {
           console.log("SomeThing went wrong in get notification count.");
       }
    }).catch(err => {
         console.log(" notification count err", err);
    })
  }

  openModal = (e) => {
    this.setState({ showModal: true });
  }

  openNotificationModal = () =>{
    this.setState({ notificationView : true });
  }

  reset = () => {
    this.setState({
      showModal: false, currentPassword: '', currentPasswordError: true,
      newPassword: '', newPasswordError: true, confirmNewPassword: '', confirmNewPasswordError: true,
      isShowCurrentPassword: false, isShowNewPassword: false, isShowConfirmNewPassword: false
    });
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



  show(field, condition, errorField, message) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
      document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
    } else {
      document.getElementById(field).className = "form-control";
      document.getElementById(errorField).innerHTML = null;
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
          token: localStorage.getItem('access_token')
          // token: Cookies.get('access_token')
        }
        api.post('api/changePassword', data).then(res => {
          console.log("Fgdf", res);
          if (res.data.success) {
            this.reset();
            toast.success(res.data.message);
            localStorage.removeItem('access_token')
            // Cookies.remove('access_token');
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

  OpenUserManual() {
    // var path = apiBase + UserManual;
    // console.log("path", path);

    const link = document.createElement('a');
    link.href = UserManual;
    document.body.appendChild(link);
    link.setAttribute('target','_new' ); //or any other extension
    link.click();
  }

  // file://"+path.dirname(__dirname)+"/document/SystemLogo/yachtsman_logo_300_120.png

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { t } = this.props;
    const CancelButton = t("buttons.Cancel");

    const loggedInUserData = CommonConfig.loggedInUserData();
    const profileImg = CommonConfig.isEmpty(loggedInUserData.PicturePath) ? profile : apiBase + loggedInUserData.PicturePath;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />

        <AppNavbarBrand
          full={{ src: logo, width: 125, height: 45, alt: 'CoreUI Logo' }}
        />

        {/* <AppSidebarToggler className="d-md-down-none" display="lg" /> */}

        {/* <AppSidebarMinimizer /> */}
        
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <div>
            <span style={{ fontSize: 10 }}>{CommonConfig.appVerison}</span>
            <br />
            <span style={{ fontSize: 10 }}>env: <b>{CommonConfig.appRegion}</b></span>
          </div>
        </Nav>
        {/* {this.state.notificationCount} */}
        <Nav className="ml-auto notification-menu" navbar>
        
          <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            <i class="fa fa-bell" aria-hidden="true" onClick={()=>this.openNotificationModal()}></i>
            {this.state.notificationCount == undefined || this.state.notificationCount == null 
              || this.state.notificationCount == 0 ? null:
            
            <span className="noti-badge">{this.state.notificationCount}</span>
            }
          </DropdownToggle>

            <DropdownMenu right>
              <div className="notification-inner">
              {/* res.data[0].IsRead.data[0] */}
                  {this.state.notificationList.map((not)=>{
                  return (
                    <div>
                    <DropdownItem>
                      <div className={ not.IsRead.data[0] == 0 ? "notification-item unread": "notification-item"}>
                      <div className="notification-content">
                        <div className="noti-check">
                          <input type="checkbox"></input>
                        </div>
                        <div className="notification-text"> 
                          {not.NotificationText}
                        </div>
                        <div className="notification-actions"> 
                            {/* <a className="note">
                              <i class="fa fa-sticky-note" aria-hidden="true" id={"viewNote" + not.DashboardNotificationId}></i>
                            </a>
                            <UncontrolledTooltip placement="top" target={"viewNote" + not.DashboardNotificationId} >
                              {"View Notes"}
                            </UncontrolledTooltip> */}

                            <a onClick={() => this.viewPolicyDetail(not)} className="view-policy">
                              <i class="fa fa-eye" aria-hidden="true" id={"viewPolicy" + not.DashboardNotificationId}
                              //  onClick={this.viewPolicyDetail(not)}
                               ></i>
                            </a>
                            <UncontrolledTooltip placement="top" target={"viewPolicy" + not.DashboardNotificationId}  >
                              {"View Policy"}
                            </UncontrolledTooltip>

                            {not.IsRead.data[0] == 0 ?    
                              <>
                                <a onClick={()=> this.updateNotification(not,'Update')} className="mark-as-unread">
                                  <i class="fa fa-envelope" aria-hidden="true" id={"markAsUnread" + not.DashboardNotificationId}
                                  //  onClick={this.updateNotification(not,'Update')}
                                   ></i>
                                </a>
                                <UncontrolledTooltip placement="top" target={"markAsUnread" + not.DashboardNotificationId} >
                                  {"Mark As read"}
                                </UncontrolledTooltip>
                              </>
                            :   <> 
                                <a onClick={()=> this.updateNotification(not,'Update')} className="mark-as-unread">
                                  <i class="fa fa-envelope-open" aria-hidden="true" id={"markAsUnread" + not.DashboardNotificationId}
                                  //  onClick={this.updateNotification(not,'Update')}
                                   ></i>
                                </a>
                                <UncontrolledTooltip placement="top" target={"markAsUnread" + not.DashboardNotificationId} >
                                  {"Mark as Unread"}
                                 </UncontrolledTooltip>
                            </>
                              // <i class="fa fa-envelope-open" aria-hidden="true"></i>
                            }
                            <a onClick={()=>this.updateNotification(not,'Delete')} className="delete">
                              <i class="fa fa-trash" aria-hidden="true" id={"deleteNotification" + not.DashboardNotificationId}
                                // onClick={this.updateNotification(not,'Delete')}
                                ></i>
                            </a>
                            <UncontrolledTooltip placement="top" target={"deleteNotification" + not.DashboardNotificationId} >
                              {"Delete Notification"}
                            </UncontrolledTooltip>
                        </div>
                      </div>
                      <div className="notification-footer">
                        <a >
                          <i class="fa fa-user-circle" aria-hidden="true"></i>{not.UserNameFrom}
                        </a>
                        <a className="notification-dt">
                          <i class="fa fa-calendar" aria-hidden="true"></i>
                          {moment(not.NotificationTimestamp).format("DD-MM-YYYY, h:mm a")}
                        </a>
                      </div>
                    </div>
                    </DropdownItem>
                    </div>
                  )
                })}

                  {/* {this.state.notificationList ? null : 
                    
                      <div className="notification-item">
                      <div className="notification-content">
                        <div className="noti-check">
                          <input type="checkbox"></input>
                        </div>
                        <div className="notification-text"> 
                          No Notification Found
                        </div>
                        </div>
                        </div>                    
                    }  */}

                  {/* <div className="notification-item unread">
                    <div className="notification-content">
                      <div className="noti-check">
                        <input type="checkbox"></input>
                      </div>
                      <div className="notification-text"> 
                        Policy 1234 is referred to you
                      </div>
                      <div className="notification-actions"> 
                        <UncontrolledTooltip placement="top" target="View Note" >
                          <a href="#" className="note"><i class="fa fa-sticky-note" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="View Policy" >
                          <a href="#" className="view-policy"><i class="fa fa-eye" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Mark as Unread" >
                          <a href="#" className="mark-as-unread"><i class="fa fa-envelope" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Delete" >
                          <a href="#" className="delete"><i class="fa fa-trash" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                      </div>
                    </div>
                    <div className="notification-footer">
                      <a href="#"><i class="fa fa-user-circle" aria-hidden="true"></i>Sally</a>
                      <a href="#" className="notification-dt"><i class="fa fa-calendar" aria-hidden="true"></i>09/12/2020 08:30 pm</a>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-content">
                      <div className="noti-check">
                        <input type="checkbox"></input>
                      </div>
                      <div className="notification-text"> 
                        Policy 1234 is referred to you
                      </div>
                      <div className="notification-actions"> 
                        <UncontrolledTooltip placement="top" target="View Note" >
                          <a href="#" className="note"><i class="fa fa-sticky-note" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="View Policy" >
                          <a href="#" className="view-policy"><i class="fa fa-eye" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Mark as Unread" >
                          <a href="#" className="mark-as-unread"><i class="fa fa-envelope" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Delete" >
                          <a href="#" className="delete"><i class="fa fa-trash" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                      </div>
                    </div>
                    <div className="notification-footer">
                      <a href="#"><i class="fa fa-user-circle" aria-hidden="true"></i>Sally</a>
                      <a href="#" className="notification-dt"><i class="fa fa-calendar" aria-hidden="true"></i>09/12/2020 08:30 pm</a>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <div className="noti-check">
                        <input type="checkbox"></input>
                      </div>
                      <div className="notification-text"> 
                        Policy 1234 is referred to you
                      </div>
                      <div className="notification-actions"> 
                        <UncontrolledTooltip placement="top" target="View Note" >
                          <a href="#" className="note"><i class="fa fa-sticky-note" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="View Policy" >
                          <a href="#" className="view-policy"><i class="fa fa-eye" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Mark as Unread" >
                          <a href="#" className="mark-as-unread"><i class="fa fa-envelope-open" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Delete" >
                          <a href="#" className="delete"><i class="fa fa-trash" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                      </div>
                    </div>
                    <div className="notification-footer">
                      <a href="#"><i class="fa fa-cog" aria-hidden="true"></i>System</a>
                      <a href="#" className="notification-dt"><i class="fa fa-calendar" aria-hidden="true"></i>09/12/2020 08:30 pm</a>
                    </div>
                  </div>
                  */}
                  {this.state.notificationList.length ? null : 
                  <div className="notification-item">
                    <div className="notification-content">
                      {/* <div className="noti-check">
                        <input type="checkbox"></input>
                      </div> */}
                      <div className="notification-text"> 
                        No Notification Found
                      </div>
                      {/* <div className="notification-actions"> 
                        <UncontrolledTooltip placement="top" target="View Note" >
                          <a href="#" className="note"><i class="fa fa-sticky-note" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="View Policy" >
                          <a href="#" className="view-policy"><i class="fa fa-eye" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Mark as Unread" >
                          <a href="#" className="mark-as-unread"><i class="fa fa-envelope-open" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="top" target="Delete" >
                          <a href="#" className="delete"><i class="fa fa-trash" aria-hidden="true"></i></a>
                        </UncontrolledTooltip>
                      </div> */}
                    </div>
                    {/* <div className="notification-footer">
                      <a href="#"><i class="fa fa-cog" aria-hidden="true"></i>System</a>
                      <a href="#" className="notification-dt"><i class="fa fa-calendar" aria-hidden="true"></i>09/12/2020 08:30 pm</a>
                    </div> */}
                  </div>
                }
              </div>
              {/* <div className="notification-pager">
                <a className="np-next"><i class="fa fa-angle-left"></i></a>
                <a className="active">1</a>
                <a className="np-prev"><i class="fa fa-angle-right"></i></a>
              </div> */}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <Nav navbar>
          <div>
            {(loggedInUserData.Forename === "" || loggedInUserData.Forename === undefined || loggedInUserData.Forename === null) ?
              ('Welcome ' + loggedInUserData.OrganizationName) :
              ('Welcome ' + loggedInUserData.Forename)
            }
          </div>

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={profileImg} className="img-avatar" style={{ width: 40, height: 40, borderRadius: 20 }} alt="admin@bootstrapmaster.com" />
            </DropdownToggle>

            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>Account</strong>
              </DropdownItem>

              <DropdownItem>
                <i className="fa fa-user"></i>
                Profile
              </DropdownItem>

              <DropdownItem onClick={e => this.openModal(e)}>
                <i className="fa fa-key"></i>
                Change Password
              </DropdownItem>

              <DropdownItem onClick={() => this.OpenUserManual()}>
                <i className="fa fa-file"></i>
                User Manual
              </DropdownItem>

              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <AppAsideToggler className="d-lg-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}

        <Modal toggle={() => this.reset()} isOpen={this.state.showModal}>
          <ModalHeader toggle={() => this.reset()}>
            {t("ChangePassword.ModalHeader")}
          </ModalHeader>

          <ModalBody>
            <div className="input-box rc-box">
              <div className="rc-inline">
                <Row>
                  <Col md="12">
                    <span style={{ color: "red", float: "right" }}>{t("mandatoryFieldMsg")}</span>
                  </Col>
                </Row>

                <Form>
                  <Row style={{ marginTop: 10 }}>
                    <Col md="5">
                      <label>{t("ChangePassword.currentPassword.label")}*</label>
                    </Col>

                    <Col md="7">
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
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 10 }}>
                    <Col md="5">
                      <label>{t("ChangePassword.newPassword.label")}</label>
                    </Col>

                    <Col md="7">
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
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 10 }}>
                    <Col md="5">
                      <label>{t("ChangePassword.confirmNewPassword.label")}</label>
                    </Col>

                    <Col md="7">
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
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" onClick={() => this.reset()}>
              <i className="fa fa-close"></i>
              {CancelButton}
            </Button>
            <Button color="success" onClick={() => this.changePassword()}>
              <i className="fa fa-check"></i>
              {t("ChangePassword.ModalSaveButton")}
            </Button>
          </ModalFooter>

        </Modal>

      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withTranslation()(DefaultHeader);