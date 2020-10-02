import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import uuid from "uuid";
import api from "../../../utils/apiClient";
import Cookies from "js-cookie";
import APIConstant from "../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { CommonConfig } from '../../../utils/constants';

import logo from '../../../assets/img/yachtsman_logo.png';

function Page() {
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    window.location.reload();
  };

  return (
    <div className="lan-buttons">
      <button onClick={() => changeLanguage('de')}>de</button>
      <button onClick={() => changeLanguage('en')}>en</button>
      <button onClick={() => changeLanguage('es')}>es</button>
    </div>
  );
}

class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      password: "",
      username: "",
      passwordError: true,
      usernameError: true
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "username") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          usernameError: true
        });
        this.show("username", true);
      } else {
        this.setState({
          usernameError: false,
          username: e.target.value
        });
        this.show("username", false);
      }
    }

    if (e.target.name === "password") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          passwordError: true
        });
        this.show("password", true);
      } else {
        this.setState({
          passwordError: false,
          password: e.target.value
        });
        this.show("password", false);
      }
    }
  };

  validateEmail(username) {
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(username);
  }

  show(field, condition) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    } else {
      document.getElementById(field).className = "form-control";
    }
  }

  onLogin() {
    if (
      this.state.usernameError === false &&
      this.state.passwordError === false
    ) {
      const form = {
        username: this.state.username,
        password: this.state.password
      };

      api
        .post(APIConstant.path.login, form)
        .then(res => {
          if (res.success) {
            toast.success(res.message);
            var PolicyDetailPageTimer = CommonConfig.getSysConfigByKey('PolicyDetailPageTimer');
            var PolicyDetailModalTimer = CommonConfig.getSysConfigByKey('PolicyDetailModalTimer');
            // const expires = 60 * 600 * 1000;
            // const inOneHour = new Date(new Date().getTime() + expires);
            // console.log("DSgf", inOneHour, res);
            // Cookies.set("access_token", res.token, { expires: inOneHour });
            // Cookies.set("loggedInUserData", JSON.stringify(res.data[0]), { expires: inOneHour });
            localStorage.setItem('access_token',  res.token)

              localStorage.setItem('batchMessageHeaderId', uuid.v4())
            localStorage.setItem('loggedInUserData', JSON.stringify(res.data[0]))
            this.props.history.push("/dashboard");
          } else {
            toast.error(res.message);
          }
        })
        .catch(err => {
          toast.error(err);
        });
    } else {
      this.show("username", this.state.usernameError);
      this.show("password", this.state.passwordError);
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <Page />

        <ToastContainer></ToastContainer>

        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="3">
                <img src={logo} className="" style={{ marginBottom: 20 }} />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={e => e.preventDefault()}>
                        <h1>{t('loginData.title')}</h1>

                        <p className="text-muted">{t('loginData.description')}</p>

                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>

                          <Input
                            name="username"
                            type="text"
                            id="username"
                            className=""
                            placeholder={t('loginData.username.placeholder')}
                            autoComplete={t('loginData.username.placeholder')}
                            onChange={e => this.handleChange(e)}
                            value={this.state.username}
                          />
                          {/* <Input id="username" type="text" className="form-control is-invalid" placeholder="Username" autoComplete="username" value={this.state.username} /> */}
                          <em className="error invalid-feedback">{t('loginData.username.error')}</em>
                        </InputGroup>

                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>

                          <Input
                            name="password"
                            id="password"
                            type="password"
                            placeholder={t('loginData.password.placeholder')}
                            autoComplete="current-password"
                            onChange={e => this.handleChange(e)}
                            value={this.state.password}
                          />
                          <em className="error invalid-feedback">{t('loginData.password.error')}</em>
                        </InputGroup>

                        <Row>
                          <Col xs="6">
                            <Button
                              type="submit"
                              color="primary"
                              className="px-4"
                              onClick={() => this.onLogin()}
                            >
                              {t('loginData.button')}
                            </Button>
                          </Col>

                          <Col xs="6" className="text-right">
                            {/* <Link to="/forgotpassword"> */}
                            <Button color="link" className="px-0" onClick={e => this.props.history.push('/forgotpassword')}>
                              {t('loginData.forgotpassword')}
                            </Button>
                            {/* </Link> */}
                          </Col>
                          {/* <Col xs="6" className="text-right">
                          <Link to="/forgotpassword">
                            <Button color="link" className="px-0">
                            {t('loginData.forgotpassword')}
                            </Button>
                          </Link>
                        </Col> */}
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                  <Card
                    className="text-white bg-primary py-5 d-md-down-none"
                    style={{ width: "44%" }}
                  >
                    <CardBody className="text-center">
                      <div>
                        <h2>{t('loginData.signup')}</h2>
                        <p>
                          {t('loginData.registerdescription')}
                        </p>
                        <Link to="/register">
                          <Button
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}
                          >
                            {t('loginData.registerbutton')}
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md="3">
                <div style={{ fontSize: 10, textAlign: "center", marginTop: 10 }}>
                  Verison: {CommonConfig.appVerison}
                </div>
                <div style={{ fontSize: 10, textAlign: "center" }}>
                  Region: {CommonConfig.appRegion}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }

}

export default withTranslation()(Login);
