import React, {Component} from 'react';
import {
    Input, Button, message, Select, Radio,Spin
} from 'antd';
import {addUser, fetchGuestList, getTeam,getRole} from "../../services/service";

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee_id: null,
            email: '',
            c_password: '',
            phone: '',
            name: '',
            gender: 'male',
            team: '',
            password: '',
            teamList: [],
            team_status: null,
            formErrors: {employee_id:'',email: '',password:''},
            emailValid: false,
            passwordValid: false,
            employee_idValid: false,
            error:'',
            data: [],
            value: [],
            role: [],
            fetching: false,

        }
        this.handleChange = this.handleChange.bind(this)
        this.validateField = this.validateField.bind(this)
        this.getTeamList = this.getTeamList.bind(this)
        this.getRole = this.getRole.bind(this)
        this.handleInputChangeTeam = this.handleInputChangeTeam.bind(this)
    };

    componentWillMount() {
        this.getTeamList()
        this.getRole()
    }

    validateField(fieldName,value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let employee_IDValid = this.state.employee_IDValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'email':
                var re = /\S+@\S+\.\S+/;
                console.log(re.test(String(value).toLowerCase()))
                if (re.test(String(value).toLowerCase())) {
                    emailValid = true
                }
                else {
                    emailValid = false
                }
                fieldValidationErrors.email = emailValid ? '' : 'is not valid';
                break;
                case 'employee_id':
                employee_IDValid = value.match(/[0-9]$/);
                fieldValidationErrors.employee_id = employee_IDValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            default:
                console.log("EmployeeId validation", employee_IDValid);
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid:passwordValid ,
            employee_idValid: employee_IDValid,
        }, this.validateForm);

    }

    getTeamList() {
        getTeam()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res.results)
                res.results.map((item, i) => (
                    this.state.teamList.push(item)
                ))
                this.setState({team_status: status})


            })
            .catch(error => {
                console.log(error)
            });
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        console.log(name,value)
        this.setState({[name]: value},
            () => {
                this.validateField(name, value)
            });

    }

    handleInputChangeTeam = (team) => {

        this.setState({
            team: team,

        })
    }
   getRole() {
        this.setState({fetching: true})
        getRole()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                console.log(status);
                const data = res.results.map(user => ({
                    text: `${user.name}`,
                    value: user.id,
                }));
                this.setState({data, fetching: false});

            })
            .catch(error => {
                console.log(error)
            });

    }

    addUser() {
        console.log("role",this.state.value)
        let att=this.state.value
        let role=this.state.role
        att.map((item,i)=>{
            role.push(item.label)
        })

        const body = {
            'employee_id': this.state.employee_id,
            'name': this.state.name,
            'role': role,
            'phone': this.state.phone,
            'email': this.state.email,
            'team': this.state.team,
            'gender': this.state.gender,
            'password':this.state.password

        }
        console.log(body)
        if(this.state.employee_id && this.state.name && this.state.password && this.state.emailValid && this.state.phone && this.state.role && this.state.team && this.state.gender) {
            addUser(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res, status)
                    if (status === 401) {
                        localStorage.removeItem('TOKEN');
                        localStorage.removeItem('TEAM');
                        localStorage.removeItem('ROLE');
                        this.props.history.push("/login")
                    }
                    if (status === 400) {
                        message.error("Something went wrong!!")
                    }
                    if (status === 406) {
                        message.error("User Already Exists")
                    }
                    if (status === 500) {
                        message.error("Something went wrong!Server problem.")
                    }
                    if (status === 201) {
                        message.success("User Added Successfully.")
                        //this.props.handleClose();
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    handleChangeSelect = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    onGenderChange = e => {
        this.setState({gender: e.target.value})
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        const {fetching, data, value} = this.state;
        return (

           <div>

        <div className="sidebaradduser">
           <div class="viewhead"><h3> Add User </h3></div>
            <div className="adduserform adduserformnew">
                <div className="col-md-6 col-sm-12 col-xs-12">

                    <div className={`form-group ${this.errorClass(this.state.formErrors.employee_id)}`}>
                        <label>Employee ID</label> <span style={{color: 'red'}}>*</span>
                        <input type="text" required className="form-control" name="employee_id"
                               placeholder="Employee Id"

                               onChange={this.handleChange}/>
                        {this.state.formErrors.employee_id.length > 0 ?
                            <span style={{color: 'red'}}>Employee Id {this.state.formErrors.employee_id}</span> :
                            ''
                        }
                     </div>

                    <label> Role: </label><span style={{color: 'red'}}>*</span>

                    <Select
                        mode="multiple"
                        labelInValue
                        value={value}
                        placeholder="Select role"
                        notFoundContent={fetching ? <Spin size="small"/> : null}
                        filterOption={false}
                        onSearch={this.getRole}
                        onChange={this.handleChangeSelect}
                        style={{width: '100%', height: '30px'}}
                    >
                        {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                    </Select>
                    
                    <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                        <label> Email: </label><span style={{color: 'red'}}>*</span>
                            <Input name="email" type="text" value={this.state.email} onChange={this.handleChange}/>
                    
                        {this.state.formErrors.email.length > 0 ?
                            <span style={{color: 'red'}}>Email {this.state.formErrors.email}</span> :
                            ''
                        }
                    </div>

                    <div className="aduserform2">
                        <label> Gender </label> <span style={{color: 'red'}}>*</span>
                        <Radio.Group onChange={this.onGenderChange} value={this.state.gender}>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                        </Radio.Group>
                    </div>

                </div>

                <div className="col-md-6 col-sm-12 col-xs-12">
                     
                <label> Employee Name: </label><span style={{color: 'red'}}>*</span>
                    <Input name="name" type="text" value={this.state.name} onChange={this.handleChange}/>

                    <label> Password </label><span style={{color: 'red'}}>*</span>
                    <Input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                <label> Phone: </label><span style={{color: 'red'}}>*</span>
                <Input name="phone" type="text" value={this.state.phone} onChange={this.handleChange}/>
                
                 <div>
                    <label> Team: </label><span style={{color: 'red'}}>*</span>
                    <Select
                        showSearch
                        style={{width: '100%'}}
                        placeholder="Team List"
                        optionFilterProp="children"
                        onChange={(e) => this.handleInputChangeTeam(e)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.state.teamList.map((item, i) => (
                            <Select.Option key={i} value={item.name}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </div>

                <Button className="userbutton" onClick={() => this.addUser()}>Submit</Button>
                <br/>
                <span style={{color: 'red'}}>{this.state.error}</span>

            </div>

            </div>  

   </div>
</div>

        );


    }
}

export default AddUser;
