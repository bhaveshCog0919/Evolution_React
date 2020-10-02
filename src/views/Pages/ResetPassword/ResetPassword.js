import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import api from "../../../utils/apiClient";
import Cookies from "js-cookie";
import APIConstant from "../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";

class Register extends Component {
  constructor(props, context) {
    super(props, context);
    var token = document.location.href.split('token=')[1];
    if(token === undefined)
    {
      this.props.history.push('/')
    }
    this.state = {
      newpassword: "",
      verifypassword: "",
      newpasswordError: true,
      verifypasswordError: true
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "newpassword") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          newpasswordError: true
        });
        this.show("newpassword", true);
      } else {
        this.setState({
          newpasswordError: false,
          newpassword: e.target.value
        });
        this.show("newpassword", false);
      }
    }

    if (e.target.name === "verifypassword") {
        if (e.target.value === "" || e.target.value === null) {
          this.setState({
            verifypasswordError: true
          });
          this.show("verifypassword", true);
        } else {
          this.setState({
            verifypasswordError: false,
            verifypassword: e.target.value
          });
          this.show("verifypassword", false);
        }
      }
  };

  show(field,condition)
  {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    }
    else
    {
      document.getElementById(field).className = "form-control";
    }
  }


  onReset() {

    if(this.state.newpasswordError===false && this.state.verifypasswordError===false){
      var token = document.location.href.split('token=')[1];
      const form = {
        'newpassword': this.state.newpassword,
        'verifypassword': this.state.verifypassword,
        'token': token
      }

      api.post(APIConstant.path.resetpassword, form)
      .then(res => {
        if (res.success) {
          toast.success(res.message)
          this.props.history.push('/login')
        }
        else {
          toast.error(res.message)
       }
      }).catch(err => {
          toast.error(err)
      })
     }
     else
     {
        this.show("newpassword",this.state.newpasswordError)
        this.show("verifypassword",this.state.verifypasswordError)
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
                    <h1>Reset Password</h1>
                    <p className="text-muted">Password confirmation!</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="newpassword"
                        id="newpassword"
                        type="password"
                        placeholder="New Password"
                        autoComplete="current-password"
                        onChange={e => this.handleChange(e)}
                        value={this.state.password}
                      />
                      <em className="error invalid-feedback">
                            Please enter new password
                          </em>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="verifypassword"
                        id="verifypassword"
                        type="password"
                        placeholder="Verify Password"
                        autoComplete="current-password"
                        onChange={e => this.handleChange(e)}
                        value={this.state.verifypassword}
                      />
                      <em className="error invalid-feedback">
                            Please enter verify password
                          </em>
                    </InputGroup>
                    <Button
                      color="primary"
                      className="px-4"
                      onClick={() => this.onReset()}
                    >
                      Reset
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

export default Register;
