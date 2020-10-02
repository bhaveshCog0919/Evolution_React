
import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import api from "../../../utils/apiClient";
import Cookies from "js-cookie";
import APIConstant from "../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";

class Register extends Component {

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

  onRegister() {
    // debugger;
    if (
      this.state.usernameError === false &&
      this.state.passwordError === false
    ) {
      const form = {
        username: this.state.username,
        password: this.state.password
      };

      api.post(APIConstant.path.register, form).then(res => {
          if (res.success) {
            // const expires = 60 * 60 * 24;
            // const inOneHour = new Date(new Date().getTime() + expires);
            // Cookies.set("access_token", res.token, { expires: inOneHour });
            localStorage.setItem('access_token',  res.token)
            this.props.history.push("/login");
            toast.success(res.message);
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
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input name="username"
                            type="text"
                            id="username"
                            className=""
                            placeholder="Username"
                            autoComplete="username"
                            onChange={e => this.handleChange(e)}
                            value={this.state.username} />
                             <em className="error invalid-feedback">
                            Please enter username
                          </em>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={e => this.handleChange(e)}
                            value={this.state.password}
                          />
                          <em className="error invalid-feedback">
                            Please enter password
                          </em>
                    </InputGroup>
                    <Button color="success" block onClick={() => this.onRegister()}>Create Account</Button>
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

export default Register;
