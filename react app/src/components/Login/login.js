/* globals chrome */
import React, {Component} from 'react';
import '../../App.css';
import {login} from "../../services/service";
import {saveState} from "../../localStorage";
import {Link} from 'react-router-dom'
import firebase from "firebase";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            employee_id: 0,
            password: '',
            formErrors: {employee_id: '', password: ''},
            employee_IDValid: false,
            passwordValid: false,
            formValid: false,
            invalid: false,
            not_found: false,
            role: '',
            fcmToken:'',
            fcmError:''
        };

        this.handleUserInput = this.handleUserInput.bind(this)
        this.login = this.login.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.validateField = this.validateField.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    initializePush=()=> {
        const messaging = firebase.messaging();
        messaging
            .requestPermission()
            .then(() => {
                console.log("Have Permission");
                return messaging.getToken();
            })
            .then((token) => {
                console.log("FCM Token:", token);
                this.setState({
                        fcmToken:token,
                    },()=>
                        this.login()
                )
            })
            .catch(error => {
                if (error.code === "messaging/permission-blocked") {
                    console.log("Please Unblock Notification Request Manually");
                    this.setState({
                        fcmError:"Please enable the notification popup",
                        fcmToken:''
                    },()=>this.login())
                } else {
                    console.log("Error Occurred", error);
                    this.setState({
                        fcmError:"Something is wrong with notification",
                        fcmToken:''
                    },()=>this.login())
                }
            });
        console.log("------messaging-----",messaging)
        messaging.onMessage((payload) => {
            console.log("Notification Received", payload);
            //this is the function that gets triggered when you receive a
            //push notification while you’re on the page. So you can
            //create a corresponding UI for you to have the push
            //notification handled.
        });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let employee_IDValid = this.state.employee_IDValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'employee_id':
                employee_IDValid = value.match(/[0-9]$/) && value.length <= 4;
                fieldValidationErrors.employee_id = employee_IDValid ? '' : ' is invalid';
                break;
            // case 'password':
            //     passwordValid = value.length >= 6;
            //     fieldValidationErrors.password = passwordValid ? '' : ' is too short';
            //     break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            employee_IDValid: employee_IDValid,
        }, this.validateForm);
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    validateForm() {
        this.setState({formValid: this.state.employee_IDValid});
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value, invalid: false, not_found: false},
            () => {
                this.validateField(name, value)
            });


    }

    componentDidMount() {

        const token = localStorage.getItem('TOKEN');
        const company = localStorage.getItem('TEAM');
        const role = localStorage.getItem('ROLE');
        if (token && company && role) {
            this.props.history.push("/home")
        } else {
            this.props.history.push("/login")
        }
    }

    login() {
        const body = {
            'employee_id': this.state.employee_id,
            'password': this.state.password,
            'fcm_token': this.state.fcmToken
        };
        if (this.state.formValid) {
            login(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, response]) => {
                    if (status === 400) {
                        this.setState({invalid: true})
                        //message.error("Invalid id/password")
                    }
                    if (status === 404) {
                        this.setState({not_found: true})
                        // message.error("Sorry!User not found.")
                    } else {
                        const data = {
                            id: response.result.id,
                            employee_name: response.result.employee_name,
                            roles: response.result.roles,
                            team: response.result.team,
                            token: response.result.token,
                        }
                        localStorage.setItem('DATA', JSON.stringify(data))
                        saveState({
                            data: JSON.stringify(data)
                        });

                        this.props.history.push({
                            pathname: '/home',
                        })
                    }


        })
.catch((error) => {
    console.error(error);
});
} else {
    alert("Id and password cannot be blank")
}

}

handleKeyPress(event) {
    if (event.key === 'Enter') {
        this.initializePush();
    }

}

handleKeyDown(event) {
    if (event.key === 'Enter') {
        this.refs.password.focus()
    }
}

render() {
    return (


        <div className="logipage">


            <div className="mainlogin">

                <div className="toploginbox">
                    <div className="toploginbox2">
                        <img src={require('../../icon.png')} style={{
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: '110px',
                            marginRight: '50px'
                        }}/>
                    </div>
                </div>

                <div className="mainlogin2">
                    <form className="demoForm">
                        {
                            this.state.invalid ?
                                <span style={{marginTop: '20px', color: 'red'}}>Wrong Credentials</span> :
                                ''

                        }
                        {
                            this.state.not_found ?
                                <span style={{marginTop: '20px', color: 'red'}}>Not Found</span> :
                                ''
                        } {
                        this.state.fcmError !== '' ?
                            <span style={{marginTop: '20px', color: 'red'}}>{this.state.fcmError}</span> :
                            ''
                    }
                        <div className={`form-group ${this.errorClass(this.state.formErrors.employee_id)}`}>
                            <p>Login</p>
                            <label>Employee ID</label>
                            <input type="text" required className="form-control" name="employee_id"
                                   placeholder="Employee Id"
                                   ref="email"
                                   onKeyDown={this.handleKeyDown}
                                   onChange={this.handleUserInput}/>
                            {
                                this.state.formErrors.employee_id.length > 0 ?
                                    <span
                                        style={{color: 'red'}}>Employee Id {this.state.formErrors.employee_id}</span> :
                                    ''
                            }

                        </div>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password"
                                   placeholder="Password"
                                   ref="password"
                                   onKeyDown={this.handleKeyPress}
                                   onChange={this.handleUserInput}/>
                            {this.state.formErrors.password.length > 0 ?
                                <span style={{color: 'red'}}>Password {this.state.formErrors.password}</span> :
                                ''

                            }
                        </div>
                        <button type="button" className="btn btn-primary loginbutton"
                                disabled={!this.state.formValid}
                                onClick={(event) => this.initializePush()}>Log In
                        </button>
                        <Link to={"./resetpswd"}>Forget password?</Link>

                    </form>
                </div>
            </div>
        </div>
    );
}
}

export default Login;
