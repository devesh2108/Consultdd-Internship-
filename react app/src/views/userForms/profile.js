import React, {Component} from 'react';
import {changePassword, userDetails} from "../../services/service";
import {
     Input, Button, message
} from 'antd';
import {DeleteOutlined,UploadOutlined} from "@ant-design/icons"

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            c_password: '',
            current_password: '',
            formErrors: {password: '', c_password: ''},
            passwordValid: false,
            error:'',
            profile:{}
        }
        this.handleChange = this.handleChange.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.userDetails = this.userDetails.bind(this)
    };
    componentDidMount(){
        this.userDetails()
    }
    userDetails() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const id =data.id;
        userDetails(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({profile:res.results})
            })
            .catch(error => {
                console.log(error)
            });
    }

    validateField() {
        let fieldValidationErrors = this.state.formErrors;
        let passwordValid = this.state.passwordValid;
        if (this.state.password.length === this.state.c_password.length && this.state.password === this.state.c_password) {
            passwordValid = true
        }
        else {
            passwordValid = false
        }
        fieldValidationErrors.password = passwordValid ? '' : 'does not match';
        this.setState({
            formErrors: fieldValidationErrors,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value},
            () => {
                this.validateField()
            })
    }

    changePassword() {
        //console.log(this.state.password)
        const body = {
            'cur_password': this.state.current_password,
            'new_password': this.state.password
        };
        if (this.state.passwordValid) {
            changePassword(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    //console.log(res, status)
                    if (status === 401) {
                        localStorage.removeItem('TOKEN');
                        localStorage.removeItem('TEAM');
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('ID');
                        localStorage.removeItem('NAME');
                        this.props.history.push("/login")
                    }
                    if(status === 400){
                        this.setState({error:res.error})
                    }
                    if(status === 200){
                        message.success("Password Updated Successfully.")
                        this.props.history.push("/")
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        return (
            <div>


            

            


    <div className="profilesectionmain">

      <div className="profilesectionmain2">


<div className="row">
    

        <div className="col-md-6 col-sm-6 col-xs-12 rightborder">

            <div>

            <ul>
                <div className="profileimg">
                  <UploadPreview /> 
                </div>

                <li>
                    <label>Employee ID : </label><span>{this.state.profile.employee_id}</span>
                </li>
 
                <li>
                    <label>Name : </label><span>{this.state.profile.employee_name}</span>
                </li>

                <li>
                    <label>Email : </label><span>{this.state.profile.email}</span>
                </li>

                <li>
                    <label>Role : </label><span>{this.state.profile.roles}</span>
                </li>

                <li>
                    <label>Team : </label><span>{this.state.profile.team}</span>
                </li>

            </ul>
            
            </div>

        </div>


        <div className="col-md-6 col-sm-6 col-xs-12">

            <div className="profilesection">

                <div>
                <label> Current Password: </label>
                <Input name="current_password" type="password" value={this.state.current_password}
                onChange={this.handleChange}/>

                </div>

                <div>
                <label>  Change Password:</label>
                <Input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>

                </div>

                <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
                <label> Confirm Password: </label>
                <Input name="c_password" type="password" value={this.state.c_password}
                onChange={this.handleChange}/>

                {this.state.formErrors.password.length > 0 ?
                <span style={{color: 'red'}}>Password {this.state.formErrors.password}</span> :
                ''

                }
                </div>

                <Button onClick={this.changePassword}>Submit</Button>
                <br/>
                <span style={{color: 'red'}}>{this.state.error}</span>


            </div>

        </div>


</div>



      </div>

    </div>




            </div>


        );


    }
}
class UploadPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: null };
        this.onChange = this.onChange.bind(this);
        this.resetFile = this.resetFile.bind(this);
    }
    onChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        });
    }

    resetFile(event) {
        event.preventDefault();
        this.setState({ file: null });
    }
    render() {
        return (
            <div>
                <label>
                    Upload
                    <UploadOutlined/>
                    <Input type="file" style={{visibility: 'hidden'}}
                           onChange={(e) => this.onChange(e)}/>
                </label>
                {/*<input type="file" onChange={this.onChange} />*/}
                {this.state.file && (
                    <div style={{ textAlign: "center" }}>
                        <DeleteOutlined onClick={this.resetFile}/>
                    </div>
                )}
                <img style={{ width: "10%" }} src={this.state.file === null ? 'https://www.netfort.com/assets/user.png':this.state.file} />
            </div>
        );
    }
}

export default Profile;
