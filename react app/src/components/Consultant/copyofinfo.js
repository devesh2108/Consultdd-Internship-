import React, {Component} from 'react';
import "../../App.css";
import moment from "moment-timezone";
import {getConsultantDetails, addNewProfile, updateProfile} from "../../services/service";
import {Checkbox, DatePicker, Select, Input, Button, message} from "antd";
import {PlusOutlined,EditOutlined,} from "@ant-design/icons"

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
const doc_type = [
    "SSN",
    "Visa Docs",
    "Resume",
    "Academic Documents",
    "Certifications",
    "Identity Proof",
];
const data = JSON.parse(localStorage.getItem('DATA'));
const role = data.role;
const name = data.employee_name;

class Copy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            key: 0,
            consultant: '',
            consultantId: this.props.consultantId,
            consultantList: [],
            profile: false,
            profileStatus: false,
            consultantProfiles: [],
            originalProfile: {},
            currentProfile: {},
            profileId: 0,
            flag: false,
            editProfile: false,
            marketingEmail: '',
            title: "",
            disabled: true,
            hideButton: true,
            rate: 0,
            email: '',
            skill: '',
            team: '',
            rtg: null,
            gender: null,
            ssn: 0,
            phoneNo: '',
            ownerId: '',
            skypeId: '',
            current_city: '',
            profile_current_city: '',
            dob: null,
            profile_dob: null,
            consultantName: '',
            readOnly: true,
            readOnlyProfile: true,
            teamData: [],
            teamList: [],
            editConsultant: false,
            borderWidth: 0,
            profileBorderWidth: 0,
            submissionsStatus: false,
            consultantData: {},
            profileAdd: false,
            profileEdit: false,
            status:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.onEditCancel = this.onEditCancel.bind(this);
        this.onAddCancel = this.onAddCancel.bind(this);
    }

    componentWillMount() {
        this.props.consultantData.marketing.marketer.map((marketer, index) => {

            if (marketer.employee_name.toLowerCase() === name.toLowerCase()) {
                this.setState({
                    profileAdd: true,
                    profileEdit: true
                })
            }
        })
        this.setState({
            consultantProfiles:this.props.consultantData.profiles,
            status:true
        })
    }


    getCurrentProfile(id) {

        if (this.state.consultantProfiles.length != 0) {
            this.state.consultantProfiles.map((item, i) => (

                    item.id == id ? (
                            this.setState({
                                currentProfile: item,
                                profileId: item.id,
                                title: item.title,
                                education: item.education,
                                profile_current_city: item.current_city,
                                profile_dob: moment(item.date_of_birth),
                                visa_type: item.visa_type,
                                links: item.links,
                                ownerId: item.ownerId,
                                visa_start: moment(item.visa_start),
                                visa_end: moment(item.visa_end),
                                submissionStatus: item.submissions === 1 ? true : false,
                                disabled: true,
                                editProfile: false,
                                flag: true,
                            }))
                        : null
                )
            )
        } else {
            this.setState({
                currentProfile: {},
                profileId: 0,
                title: '',
                education: '',
                profile_current_city: '',
                visa_type: null,
                links: '',
                ownerId: this.state.ownerId,
                profile_dob: null,
                submissionStatus: false,
                visa_start: null,
                visa_end: null,
                disabled: true,
                editProfile: false,
                flag: true,
            })

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

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onDobChange = (value) => {
        this.setState({dob: value})
    };
    onProfileDobChange = (value) => {
        this.setState({profile_dob: value})
    };
    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };

    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };

    onEditCancel() {
        this.setState({
            currentProfile: this.state.currentProfile,
            profileId: this.state.currentProfile.id,
            title: this.state.currentProfile.title,
            education: this.state.currentProfile.education,
            profile_current_city: this.state.currentProfile.profile_current_city,
            profile_dob: moment(this.state.currentProfile.profile_dob),
            visa_type: this.state.currentProfile.visa_type,
            links: this.state.currentProfile.links,
            visa_start: moment(this.state.currentProfile.visa_start),
            visa_end: moment(this.state.currentProfile.visa_end),
            disabled: true,
            flag: true,
            editProfile: false,
            readOnlyProfile: true,
            profileBorderWidth: 0
        })

    }

    onAddCancel() {
        this.setState({
            currentProfile: this.state.currentProfile,
            profileId: this.state.currentProfile.id,
            title: this.state.currentProfile.title,
            education: this.state.currentProfile.education,
            profile_current_city: this.state.currentProfile.profile_current_city,
            profile_dob: moment(this.state.currentProfile.profile_dob),
            visa_type: this.state.currentProfile.visa_type,
            links: this.state.currentProfile.links,
            visa_start: moment(this.state.currentProfile.visa_start),
            visa_end: moment(this.state.currentProfile.visa_end),
            disabled: true,
            flag: true,
            editProfile: false,
            readOnlyProfile: true,
            profileBorderWidth: 0

        })

    }

    addProfile() {
        const body = {
            "title": this.state.title,
            "current_city": this.state.profile_current_city,
            "consultant": this.state.consultantId,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.profile_dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        addNewProfile(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.state.consultantProfiles.push(res.result)
                this.setState({
                    currentProfile: res.result,
                    consultantId: res.result.consultant,
                    profileId: res.result.id,
                    title: res.result.title,
                    education: res.result.education,
                    profile_current_city: res.result.current_city,
                    visa_type: res.result.visa_type,
                    links: res.result.links,
                    profile_dob: moment(res.result.dob),
                    visa_start: moment(res.result.visa_start),
                    visa_end: moment(res.result.visa_end)
                })
                message.success("Profile Created.")


            })
            .catch(error => {
                console.log(error)
            });


    }

    editProfile() {
        let self = this;
        const body = {
            "id": self.state.profileId,
            "title": this.state.title,
            "current_city": this.state.profile_current_city,
            "consultant": this.state.consultantId,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.profile_dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        updateProfile(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                message.success("Profile Updated.")

            })
            .catch(error => {
                console.log(error)
            });

    }

    render() {
        return (
            this.state.status ?
                <div>
                    <div className="infotab">
                        <div className="row">


                            <div className="col-md-9 col-sm-9 col-xs-12">



                                <div className="row">


                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <div className="main_box2">

                                            Profile
                                            <div>

                                                <div>
                                                    {this.state.profileAdd &&
                                                    <PlusOutlined/>
                                                    }

                                                    <div>
                                                        <Select
                                                            showSearch
                                                            style={{width: '30%', marginBottom: '30px', marginTop: '10px'}}
                                                            placeholder="Select a profile"
                                                            optionFilterProp="children"
                                                            onChange={(e) => {
                                                                this.getCurrentProfile(e)

                                                            }}
                                                            onSearch={this.onConsultantSearch}
                                                            filterOption={(Input, option) =>
                                                                option.props.children.toLowerCase().indexOf(Input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {this.state.consultantProfiles.map((item, i) => (

                                                                <Select.Option value={item.id}>{item.title}</Select.Option>
                                                            ))}
                                                        </Select>
                                                        {this.state.profileEdit &&
                                                        <EditOutlined onClick={() => this.setState({
                                                            readOnlyProfile: false,
                                                            disabled: true,
                                                            editProfile: true,
                                                            flag: false,
                                                            profileBorderWidth: 1
                                                        })}/>
                                                        }
                                                        <div className="profile_form">


                                                            <div className="col-md-6">

                                                                <label>
                                                                    <span> Title Suffix: </span>
                                                                    <Input
                                                                        readOnly={this.state.readOnlyProfile}
                                                                        name="title"
                                                                        style={{borderWidth: 0}}
                                                                        value={this.state.currentProfile.title}
                                                                        onChange={this.handleChange}/>
                                                                </label>

                                                                <label>
                                                                    <span> Date of Birth: </span>
                                                                    {
                                                                        this.state.readOnlyProfile ?
                                                                            <Input
                                                                                readOnly={true}
                                                                                style={{borderWidth: 0}}
                                                                                className="profledate"
                                                                                value={moment(this.state.currentProfile.dob).format("YYYY-MM-DD")}
                                                                                placeholder="Date of birth"
                                                                            /> :
                                                                            <DatePicker
                                                                                format="YYYY-MM-DD"
                                                                                className="profledate"
                                                                                value={this.state.profile_dob}
                                                                                placeholder="Date of birth"
                                                                                onChange={this.onProfileDobChange}
                                                                            />

                                                                    }

                                                                </label>

                                                                <label>
                                                                    <span> Education: </span>
                                                                    <Input
                                                                        readOnly={this.state.readOnlyProfile}
                                                                        name="education"
                                                                        style={{borderWidth: this.state.profileBorderWidth}}
                                                                        value={this.state.currentProfile.education}
                                                                        onChange={this.handleChange}/>
                                                                </label>

                                                                <label>
                                                                    <span> Current Location: </span>
                                                                    <Input
                                                                        readOnly={this.state.readOnlyProfile}
                                                                        style={{borderWidth: this.state.profileBorderWidth}}
                                                                        name="profile_current_city"
                                                                        value={this.state.profile_current_city}
                                                                        onChange={this.handleChange}/>
                                                                </label>

                                                            </div>


                                                            <div className="col-md-5">

                                                                <label>
                                                                    <span> Visa Type: </span>
                                                                    {
                                                                        this.state.readOnlyProfile ?
                                                                            <Input
                                                                                readOnly={true}
                                                                                style={{borderWidth: 0}}
                                                                                className="profledateselect"
                                                                                value={this.state.visa_type}
                                                                                placeholder="Visa Type"
                                                                            /> :
                                                                            <Select
                                                                                value={this.state.visa_type}
                                                                                className="profledateselect"
                                                                                onChange={(value) => this.setState({visa_type: value})}>
                                                                                {visa_type.map((item) => <Select.Option
                                                                                    value={item}>{item}</Select.Option>)}
                                                                            </Select>
                                                                    }
                                                                </label>

                                                                <label>

                                                                    <span> Visa Start Date: </span>
                                                                    {
                                                                        this.state.readOnlyProfile ?
                                                                            <Input
                                                                                readOnly={true}
                                                                                style={{borderWidth: 0}}
                                                                                className="profledate"
                                                                                value={moment(this.state.visa_start).format("YYYY-MM-DD")}
                                                                                placeholder="Visa Start"
                                                                            /> :
                                                                            <DatePicker
                                                                                format="YYYY-MM-DD"
                                                                                className="profledate"
                                                                                value={this.state.visa_start}
                                                                                placeholder="Visa Start"
                                                                                onChange={this.onVisaStartChange}
                                                                            />
                                                                    }

                                                                </label>

                                                                <label>
                                                                    <span> Visa End Date: </span>
                                                                    {
                                                                        this.state.readOnlyProfile ?
                                                                            <Input
                                                                                readOnly={true}
                                                                                style={{borderWidth: 0}}
                                                                                className="profledate"
                                                                                value={moment(this.state.visa_end).format("YYYY-MM-DD")}
                                                                                placeholder="Visa End"
                                                                            /> :

                                                                            <DatePicker
                                                                                disabled={this.state.readOnlyProfile}
                                                                                format="YYYY-MM-DD"
                                                                                className="profledate"
                                                                                value={this.state.visa_end}
                                                                                placeholder="Visa End"
                                                                                onChange={this.onVisaEndChange}
                                                                            />
                                                                    }
                                                                </label>

                                                                <label>
                                                                    <span> LinkedIN: </span>
                                                                    <Input
                                                                        readOnly={this.state.readOnlyProfile}
                                                                        style={{borderWidth: this.state.profileBorderWidth}}
                                                                        type="text"
                                                                        name="links"
                                                                        onChange={this.handleChange}
                                                                        value={this.state.links}/>
                                                                </label>

                                                            </div>



                                                            <div className="profilerightbutton">
                                                                {
                                                                    // this.state.originalProfile === this.state.currentProfile ?
                                                                    // this.state.editProfile ?
                                                                    //     !this.state.flag && !this.state.disabled ?
                                                                    //         <div>
                                                                    //             <Button onClick={this.addProfile} color="primary">
                                                                    //                 Submit Add
                                                                    //             </Button>
                                                                    //             <Button onClick={this.onAddCancel} color="primary">
                                                                    //                 Cancel
                                                                    //             </Button>
                                                                    //         </div> : null : null
                                                                    // :
                                                                    <div className="addprofilebuttons">
                                                                        {this.state.editProfile ?
                                                                            !this.state.flag && !this.state.disabled ?
                                                                                <div>
                                                                                    <Button onClick={this.addProfile}
                                                                                            color="primary">
                                                                                        Submit Add
                                                                                    </Button>
                                                                                    <Button onClick={this.onAddCancel}
                                                                                            color="primary">
                                                                                        Cancel
                                                                                    </Button>
                                                                                </div> :
                                                                                <div>
                                                                                    <Button onClick={this.editProfile}
                                                                                            color="primary">
                                                                                        Submit Edit
                                                                                    </Button>
                                                                                    <Button onClick={this.onEditCancel}
                                                                                            color="primary">
                                                                                        Cancel
                                                                                    </Button>
                                                                                </div>
                                                                            : null
                                                                        }
                                                                    </div>
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>




                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <div className="main_box3">

                                            Work Auth
                                        </div>

                                        <div className="main_box3">

                                            Experience
                                        </div>

                                        <div className="main_box3">
                                            Education

                                        </div>

                                    </div>


                                </div>


                            </div>


                            <div className="col-md-3 col-sm-3 col-xs-12">
                                <div className="row">
                                    <div className="right_desc">
                                        {
                                            role.map(role=> role === "superadmin") &&
                                            <div className="rightsec_new">
                                                <label> <span> Edit </span> 
                                                    <EditOutlined
                                                    onClick={() => this.setState({
                                                        readOnly: false,
                                                        editConsultant: true,
                                                        borderWidth: 1
                                                    })}/>
                                                </label>
                                            </div>
                                        }


                                        <ul>
                                            <li>
                                                <label> <span> Email </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="email"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.email}/>
                                            </li>

                                            <li><label> <span> SkypeID </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="skypeId"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.skypeId}/></li>
                                            <li><label> <span> Skill </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="skill"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.skill}/></li>

                                            <li><label> <span> Gender </span> </label>
                                                {this.state.readOnly ?
                                                    <Input style={{borderWidth: this.state.borderWidth}} name="gender"
                                                           readOnly={this.state.readOnly} value={this.state.gender}/>

                                                    :
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
                                                }</li>
                                            <li><label> <span> Rate </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="rate"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.rate}/>

                                            </li>
                                            <li><label> <span> SSN </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="ssn"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.ssn}/>
                                            </li>
                                            <li>
                                                <label> <span> Team </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="team"
                                                       readOnly={this.state.readOnly} value={this.state.team}/>
                                            </li>

                                            <li>
                                                <label> <span> Phone Number </span> </label>
                                                <Input style={{borderWidth: this.state.borderWidth}} name="phoneNo"
                                                       onChange={this.handleChange}
                                                       readOnly={this.state.readOnly} value={this.state.phoneNo}/>
                                            </li>
                                            <li>
                                                <label>
                                                    <span> Current Location: </span>
                                                </label>
                                                <Input
                                                    readOnly={this.state.readOnly}
                                                    style={{borderWidth: this.state.borderWidth}}
                                                    name="current_city"
                                                    value={this.state.current_city}
                                                    onChange={this.handleChange}/>

                                            </li>
                                            <li><label>
                                                <span> Date of Birth: </span></label>
                                                {
                                                    this.state.readOnly ?
                                                        <Input
                                                            readOnly={true}
                                                            style={{borderWidth: 0}}
                                                            className="profledate"
                                                            value={moment(this.state.dob).format("YYYY-MM-DD")}
                                                            placeholder="Date of birth"
                                                        /> :
                                                        <DatePicker
                                                            format="YYYY-MM-DD"
                                                            className="profledate"
                                                            value={this.state.dob}
                                                            placeholder="Date of birth"
                                                            onChange={this.onDobChange}
                                                        />

                                                }

                                            </li>

                                            <li><label> <Checkbox
                                                disabled={this.state.readOnly}
                                                checked={this.state.rtg}
                                                onChange={this.rtgChecked}/> <span>RTG</span> </label>

                                            </li>
                                            <li><label> <Checkbox
                                                disabled={this.state.readOnly}
                                                checked={this.state.in_pool}
                                                onChange={this.inPoolChecked}/> <span>In pool</span> </label>

                                            </li>

                                        </ul>

                                        {this.state.editConsultant ?
                                            <div>
                                                <Button>Submit</Button>
                                                <Button>Cancel</Button>
                                            </div> : null}

                                    </div>
                                </div>
                            </div>


                        </div>


                        <br clear="all"/>

                    </div>
                </div>
                : null

        )
    }
}

export default Copy;
