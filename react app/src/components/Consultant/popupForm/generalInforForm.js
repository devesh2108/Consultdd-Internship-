import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Select, DatePicker, Checkbox, message} from "antd";
import moment from "moment-timezone";
import {editConsultant,getCities} from "../../../services/service";

const skillList = [
    {id: 1, value: 'Java'},
    {id: 2, value: 'Python'},
    {id: 3, value: 'AWS'},
    {id: 4, value: 'DevOps'},
    {id: 6, value: 'Salesforce'},
    {id: 7, value: 'Peoplesoft'},
    {id: 8, value: 'Workday'},
    {id: 9, value: 'Kronos'},
    {id: 10, value: 'Lawson'},
    {id: 11, value: 'BA'},
    {id: 12, value: 'Full Stack'},
    {id: 13, value: 'Others'},
]

class GeneralInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            dob: '',
            current_city: '',
            ssn: '',
            phone_number: '',
            skype_id: '',
            skill: '',
            cityList:[]

        };
        this.handleChange = this.handleChange.bind(this);
        this.onDobChange = this.onDobChange.bind(this);
        this.onSelectSkill = this.onSelectSkill.bind(this);

    }

    componentDidMount() {
        this.setState({
            email: this.props.data.email,
            dob: moment(this.props.data.dob),
            current_city: this.props.data.current_city,
            ssn: this.props.data.ssn,
            phone_number: this.props.data.phone_no,
            skype_id: this.props.data.skype,
            skill: this.props.data.skills,
        })
        this.getCitySuggestions("")
    }

    getCitySuggestions(param){
        getCities(param)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    cityList: res.results,
                    error: res.error || null,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    onSelectCity =(data)=>{
        this.setState({
            current_city:data
        })

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onDobChange = (value) => {
        this.setState({dob: value})
    }

    onSelectSkill(data) {
        this.setState({
            skill: data,
        })

    }

    onSubmit = e => {
        const body = {
            'email': this.state.email,
            'dob': moment(this.state.dob).format('YYYY-MM-DD'),
            'current_city': this.state.current_city,
            'ssn': this.state.ssn,
            'phone_no': this.state.phone_number,
            'skype': this.state.skype_id,
            'skills': this.state.skill.toString(),

        }
        editConsultant(this.props.consultantId,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.props.setConsultant(res)
                this.props.handleClose()

            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (
            <div>
                <div className="row">


                    <div className="col-md-6 col-sm-6 col-xs-12">


                        <div className="profileformnew2">

                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Email:
                                <input
                                    placeholder="Consultant's email"
                                    id="outlined-required"
                                    className="form-control"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}/>
                            </label>


                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Current City:
                                <Select
                                    showSearch
                                    value={this.state.current_city}
                                    style={{width: '100%'}}
                                    placeholder="Job Location"
                                    optionFilterProp="children"
                                    onChange={(e) => console.log(e)}
                                    onSelect={(e) => this.onSelectCity(e)}
                                    onSearch={(e) => this.getCitySuggestions(e)}
                                >
                                    {
                                        this.state.cityList.map((item, i) => (
                                            <Select.Option
                                                value={item.name + "," + item.state}>{item.name + " ," + item.state}</Select.Option>
                                        ))}
                                </Select>

                            </label>

                            <label><span style={{color: 'red', fontSize: 9}}>*</span>SSN
                                <input
                                    placeholder="Consultant's SSN"
                                    id="outlined-required"
                                    className="form-control"
                                    name="ssn"
                                    value={this.state.ssn}
                                    onChange={this.handleChange}/>
                            </label>

                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Skill
                                <div style={{borderWidth: 1, borderColor: 'black'}}>
                                    <Select
                                        value={this.state.skill}
                                        mode="multiple"
                                        style={{width: '100%'}}
                                        placeholder="Select skill"
                                        onChange={(e) => this.onSelectSkill(e)}
                                    >
                                        {skillList.map((tag, i) =>
                                            <Select.Option key={i}
                                                           value={tag.value}>{tag.value}</Select.Option>)}
                                    </Select>
                                </div>
                            </label>


                        </div>


                    </div>


                    <div className="col-md-6 col-sm-6 col-xs-12">


                        <div className="profileformnew2">


                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Date of Birth
                                <br/>
                                <DatePicker
                                    defaultPickerValue={moment(new Date("1989-01-01"))}
                                    format="YYYY-MM-DD"
                                    value={this.state.dob}
                                    placeholder="Date of Birth"
                                    onChange={this.onDobChange}
                                />
                            </label>


                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Phone Number
                                <input
                                    placeholder="Consultant's Contact Number"
                                    id="outlined-required"
                                    className="form-control"
                                    name="phone_number"
                                    value={this.state.phone_number}
                                    onChange={this.handleChange}/>
                            </label>


                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Skype ID
                                <input
                                    placeholder="Consultant's Skype ID"
                                    id="outlined-required"
                                    className="form-control"
                                    name="skype_id"
                                    value={this.state.skype_id}
                                    onChange={this.handleChange}/>

                            </label>


                            <Button onClick={this.onSubmit}>Submit</Button>

                        </div>

                    </div>


                </div>


            </div>
        )

    }
}

export default GeneralInfoForm;
