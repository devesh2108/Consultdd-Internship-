import React, {Component} from 'react';
import {
    addConsultant, getTeam, fetchGuestList
} from "../../../services/service";

import Button from "@material-ui/core/Button";
import {DatePicker, Select, Form, message, Checkbox, Tooltip, Tag, Spin} from "antd";
import 'antd/dist/antd.css';
import moment from 'moment-timezone'

const skillList = [
    {id: 1, value: 'Java'},
    {id: 2, value: 'Python'},
    {id: 3, value: 'AWS'},
    {id: 4, value: 'DevOps'}, //Other Developer
    {id: 6, value: 'Salesforce'},
    {id: 7, value: 'Peoplesoft'},
    {id: 8, value: 'Workday'},
    {id: 9, value: 'Kronos'},
    {id: 10, value: 'Lawson'},
    {id: 11, value: 'BA'}, //Analyst
    {id: 12, value: 'Full Stack'},
    {id: 13, value: 'Others'},
]
const workType = [
    {
        id: 'c2c',
        name: 'C2C'
    },
    {
        id: 'full_time',
        name: 'Full Time'
    }
]
const visa_type = [
    "",
    "CPT",
    "H1B",
    "H4-EAD",
    "GC-EAD",
    "Green Card",
    "OPT",
    "OPT-EXT",
    "USC",
    "OPT EAD",
    "Asylam Visa",
    "Not Auth",
    "Other"
];

class CreateCon2 extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            status: 0,
            title: 'Original',
            email: '',
            rate: '',
            ssn: '',
            skill: [],
            team: '',
            phone_number: '',
            gender: '',
            skype_id: '',
            rtg: false,
            in_pool: false,
            team_status: '',
            teamData: [],
            teamList: [],
            consultant_name: '',
            selected: [false],
            recruiter: '',
            primary_marketer: '',
            preferred_location: '',
            marketing_startDate: null,
            data: [],
            value: [],
            guest: [],
            links: '',
            dob: null,
            retention: null,
            current_city: '',
            work_type: 'C2C',
            visa_type: '',
            visa_start: null,
            visa_end: null,
            rate_start: null,
            disabled_pref: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.addConsultant = this.addConsultant.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
        this.fetchGuestList = this.fetchGuestList.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangePrimarySelect = this.handleChangePrimarySelect.bind(this);
        this.selectWorkType = this.selectWorkType.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.onRateStartChange = this.onRateStartChange.bind(this);
    }

    componentDidMount() {
        this.getTeamList()
        this.fetchGuestList("")
    }

    fetchGuestList(params) {
        this.setState({fetching: true})
        fetchGuestList(params)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

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

    handleChangeSelect = (value) => {
        console.log(value)
        this.setState({
            recruiter: value
        });
    }

    handleChangeRetentionSelect = (value) => {
        console.log(value)
        this.setState({
            retention: value
        });
    }

    handleChangePrimarySelect = (value) => {
        console.log(value)
        this.setState({
            primary_marketer: value
        });
    }

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };

    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };

    handleChange(event) {
        // if(event.target.name === 'preferred_location'){
        //     if(event.target.value === ""){
        //         this.setState({ disabled_rtg: false})
        //     }
        //     else{
        //         this.setState({ disabled_rtg: true,[event.target.name]: event.target.value})
        //     }
        // }
        this.setState({
            [event.target.name]: event.target.value});
    }

    closeModal() {
        this.setState({profile: false});
    }

    openModal() {
        this.setState({profile: true});
    }

    onStartChange = (value) => {
        this.setState({marketing_startDate: value})
    };

    handleAttachmentChange = (e) => {
        this.setState({
            attachment_type: e
        });
    };

    onSelectSkill(data) {
        this.setState({
            skill: data,
        })

    }


    addConsultant() {
        const body = {
            "name": this.state.consultant_name,
            "email": this.state.email,
            "ssn": this.state.ssn,
            "in_pool": this.state.in_pool,
            "skills": this.state.skill.toString(),
            "skype": this.state.skype_id,
            "marketing_start": moment(this.state.marketing_startDate).format("YYYY-MM-DD"),
            "phone_no": this.state.phone_number,
            "preferred_location": this.state.preferred_location,
            "current_city": this.state.current_city,
            "recruiter": this.state.recruiter,
            "retention": this.state.retention,//
            "rate": this.state.rate,
            "rate_start": this.state.rate_start,
            "dob": moment(this.state.dob).format("YYYY-MM-DD"),
            "gender": this.state.gender,
            "links": this.state.links,//
            "primary_marketer": this.state.primary_marketer,
            "work_type": this.state.work_type,
            "teams": [this.state.team],
            "visa_type": this.state.visa_type,
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD"),
        }
        console.log("add profile", body)
        if (
            this.state.consultant_name !== '' &&
            this.state.email !== '' &&
            this.state.ssn !== '' &&
            this.state.skype_id !== '' &&
            this.state.in_pool !== '' &&
            this.state.skill.length !== 0 &&
            this.state.recruiter !== '' &&
            this.state.retention !== '' &&
            this.state.phone_number !== '' &&
            this.state.preferred_location !== '' &&
            this.state.current_city !== '' &&
            this.state.recruiter !== '' &&
            this.state.rate !== '' &&
            this.state.primary_marketer !== '' &&
            this.state.visa_type !== '' &&
            this.state.work_type !== '' &&
            this.state.gender !== '' &&
            this.state.visa_end !== null &&
            this.state.visa_start !== null &&
            this.state.dob !== null &&
            this.state.rate_start !== null &&
            this.state.marketing_startDate !== null &&
            this.state.team !== ''
        ) {
            addConsultant(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    if (status === 201) {
                        this.props.changeStepCount(2, res.result.id)
                    } else if (status === 400) {
                        message.error("Consultant already exists.")
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            message.error("Please fill all the details.")

        }


    }

    rtgChecked = (e) => {
        this.setState({
            rtg: e.target.checked,
        })
    }
    inPoolChecked = (e) => {
        this.setState({
            in_pool: e.target.checked,
        })

    }
    onDobChange = (value) => {
        this.setState({dob: value})
    }
    onRateStartChange = (value) => {
        this.setState({rate_start: value})
    }

    getTeamList() {
        getTeam()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    console.log(res.results)
                    res.results.map((item, i) => (
                        this.state.teamList.push(item)
                    ))
                    let temp_list = {}
                    let temp_list2 = []
                    res.results.map((item, i) => {
                        temp_list =
                            {
                                label: item.name,
                                value: item.name
                            }
                        temp_list2.push(temp_list)

                    })
                    this.setState({teamData: temp_list2, team_status: status})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    selectTeam(value) {
        if (value != '') {
            this.setState({teamStatus: false})
        }
        this.setState({team: value})
        // this.getAllConsultant(value, 1, 10,this.state.benchStatus,null)

    }

    selectWorkType(value) {
        if (value != '') {
            this.setState({work_type: value})
        }
        // this.getAllConsultant(value, 1, 10,this.state.benchStatus,null)

    }

    render() {
        const company = localStorage.getItem('TEAM');
        const {fetching, data, value} = this.state;
        return (

            this.state.team_status === 200 ?
                <div>


                    <div className="submissionform submissionform_new">
                        <div className="applysubmission">
                            <div className="col-md-12">


                                <div className="row">

                                    <div className="col-md-6">

                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Consultant Name:
                                            <input
                                                placeholder="Consultant Name"
                                                id="outlined-required"
                                                className="form-control"
                                                name="consultant_name"
                                                value={this.state.consultant_name}
                                                onChange={this.handleChange}/>
                                        </label>

                                    </div>
                                    <div className="col-md-6">

                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Email:

                                            <input
                                                placeholder="Consultant's email"
                                                id="outlined-required"
                                                className="form-control"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleChange}/>

                                        </label>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Marketing Start Date

                                            <br/>
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                value={this.state.marketing_startDate}
                                                placeholder="Marketing Start Date"
                                                onChange={this.onStartChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
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
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="preflocationlist">
                                            <li>
                                                <label><span style={{color: 'red', fontSize: 9}}>*</span>Preferred
                                                    Location:

                                                    <input
                                                        placeholder="Consultant's Preferred Location"
                                                        id="outlined-required"
                                                        className="form-control"
                                                        name="preferred_location"
                                                        value={this.state.preferred_location}
                                                        onChange={this.handleChange}/>

                                                </label>
                                            </li>
                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>RTG
                                                <Checkbox
                                                    checked={this.state.rtg}
                                                    onChange={this.rtgChecked}/>

                                            </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">

                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Current City:

                                            <input
                                                placeholder="Consultant's Current City"
                                                id="outlined-required"
                                                className="form-control"
                                                name="current_city"
                                                value={this.state.current_city}
                                                onChange={this.handleChange}/>

                                        </label>

                                    </div>

                                </div>


                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span className="newdate" style={{color: 'red', fontSize: 9}}>*</span>Recruiter:</label>
                                        <Select
                                            showSearch
                                            allowClear
                                            value={this.state.recruiter}
                                            placeholder="Select recruiter"
                                            filterOption={false}
                                            onSearch={this.fetchGuestList}
                                            onChange={this.handleChangeSelect}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                                        </Select>

                                    </div>
                                    <div className="col-md-6">
                                        <label><span className="newdate" style={{color: 'red', fontSize: 9}}>*</span>Retention:</label>
                                        <Select
                                            showSearch
                                            allowClear
                                            value={this.state.retention}
                                            placeholder="Select retention"
                                            filterOption={false}
                                            onSearch={this.fetchGuestList}
                                            onChange={this.handleChangeRetentionSelect}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                                        </Select>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Primary
                                            Marketer</label>

                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Select marketer"
                                            filterOption={false}
                                            onSearch={this.fetchGuestList}
                                            onChange={this.handleChangePrimarySelect}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                                        </Select>

                                    </div>
                                    <div className="col-md-6">


                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Skill
                                            <div style={{borderWidth: 1, borderColor: 'black'}}>
                                                <Select
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
                                <div className="row">

                                    <div className="col-md-6">

                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>SSN
                                            <input
                                                placeholder="Consultant's SSN"
                                                id="outlined-required"
                                                className="form-control"
                                                name="ssn"
                                                value={this.state.ssn}
                                                onChange={this.handleChange}/>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Gender
                                            <Select
                                                style={{width: '100%'}}
                                                placeholder="Select Gender"
                                                value={this.state.gender}
                                                onChange={(e) => {
                                                    this.setState({gender: e});
                                                }}>

                                                <Select.Option key="0" value="male">Male</Select.Option>
                                                <Select.Option key="1" value="female">Female</Select.Option>


                                            </Select>

                                        </label>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-6">


                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Team:
                                            <Select
                                                showSearch
                                                style={{width: '100%'}}
                                                placeholder="Team List"
                                                optionFilterProp="children"
                                                onChange={(e) => this.selectTeam(e)}
                                                value={this.state.team}
                                                filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.teamList.map((item, i) => (
                                                    <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Phone Number
                                            <input
                                                placeholder="Consultant's Contact Number"
                                                id="outlined-required"
                                                className="form-control"
                                                name="phone_number"
                                                value={this.state.phone_number}
                                                onChange={this.handleChange}/>

                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Skype ID
                                            <input
                                                placeholder="Consultant's Skype ID"
                                                id="outlined-required"
                                                className="form-control"
                                                name="skype_id"
                                                value={this.state.skype_id}
                                                onChange={this.handleChange}/>

                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Links
                                            <input
                                                placeholder="Consultant's Links"
                                                id="outlined-required"
                                                className="form-control"
                                                name="links"
                                                value={this.state.links}
                                                onChange={this.handleChange}/>

                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Work Type:
                                            <Select
                                                showSearch
                                                style={{width: '100%'}}
                                                placeholder="Work Type"
                                                optionFilterProp="children"
                                                onChange={(e) => this.selectWorkType(e)}
                                                value={this.state.work_type}
                                                filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {workType.map((item, i) => (
                                                    <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </label>
                                    </div>
                                    <div className="col-md-6">

                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>
                                            Visa Type:
                                            <br/>
                                            <select
                                                value={this.state.visa_type}
                                                className="form-control"
                                                placeholder="Visa Type"
                                                onChange={(e) => this.setState({visa_type: e.target.value})}>
                                                {visa_type.map((item, i) => <option key={i}
                                                                                    value={item}>{item}</option>)}

                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>
                                            Visa Start Date:
                                            <br/>
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                value={this.state.visa_start}
                                                placeholder="Visa Start Date"
                                                onChange={this.onVisaStartChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>
                                            Visa End Date:
                                            <br/>
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                value={this.state.visa_end}
                                                placeholder="Visa End Date"
                                                onChange={this.onVisaEndChange}
                                            />
                                        </label>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">

                                        <ul className="consultantsec">

                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>Rate
                                                <input
                                                    placeholder="$"
                                                    id="outlined-required"
                                                    className="form-control"
                                                    name="rate"
                                                    value={this.state.rate}
                                                    onChange={this.handleChange}/>
                                            </label></li>
                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>Rate
                                                Start</label>
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    value={this.state.rate_start}
                                                    placeholder="Rate Start Date"
                                                    onChange={this.onRateStartChange}
                                                />
                                            </li>


                                            <li>
                                                <label><span style={{color: 'red', fontSize: 9}}>*</span>In pool
                                                    <Checkbox
                                                        onChange={this.inPoolChecked}/>

                                                </label></li>

                                        </ul>

                                    </div>

                                </div>

                            </div>

                        </div>
                        <br/><br/>


                    </div>

                    <div className="addprofilebuttons">
                        <div>
                            <Button onClick={this.addConsultant} color="primary">
                                Submit
                            </Button>
                            <Button onClick={this.props.handleClose} color="primary">
                                Cancel
                            </Button>
                        </div>

                    </div>
                </div>

                : <div>
                Loading...
            </div>
        );
    }
}

export default CreateCon2;
