import React, {Component} from 'react';
import "../../App.css";
import {Checkbox, DatePicker, Select, Input, Button, message, Modal} from "antd";
import {PlusOutlined,EditOutlined} from "@ant-design/icons"
import ProfileForm from "./popupForm/profileForm";
import GeneralInfoForm from "./popupForm/generalInforForm";
import MarketingForm from "./popupForm/marketingForm";
import WorkAuthForm from "./popupForm/workAuthForm";
import EducationForm from "./popupForm/educationForm";
import ExperienceForm from "./popupForm/experienceForm";
import moment from "moment-timezone"


const data = JSON.parse(localStorage.getItem('DATA'));

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultantProfiles: [],
            currentProfile: {},
            consultantData: {},
            profileAdd: false,
            profileEdit: false,
            status: false,
            modalProfile: false,
            modalEdu: false,
            modalExp: false,
            modalWorkAuth: false,
            modalConsultant: false,
            edit: false,
            editEdu: false,
            editExp: false,
            editWorkAuth: false,
            selectedEducation: {},
            selectedExperience: {},
            modalMarketing: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        const name = data.employee_name;
        this.props.consultantData.marketing.marketer.map((marketer, index) => {

            if (marketer.name.toLowerCase() === name.toLowerCase()) {
                this.setState({
                    profileAdd: true,
                    profileEdit: true
                })
            }
        })
        this.setState({
            consultantProfiles: this.props.consultantData.profiles,
            currentProfile: this.props.consultantData.profiles[0],
            status: true
        })
    }

    handleClose = e => {
        this.setState({
            modalProfile: false,
            modalConsultant: false,
            modalMarketing: false,
            modalEdu: false,
            modalExp: false,
            modalWorkAuth: false,

        });
    };
    changeCurrentProfile = (profile) => {
        this.setState({
            currentProfile: profile,
            profileId: profile.id,
        })

    }
    addProfile = (profile) => {
        this.state.consultantProfiles.push(profile)
    }


    getCurrentProfile(id) {

        if (this.state.consultantProfiles.length != 0) {
            this.state.consultantProfiles.map((item, i) => (

                    item.id == id ? (
                        this.setState({
                            currentProfile: item,
                            profileId: item.id,
                        }))
                        : null
                )
            )
        } else {
            this.setState({
                currentProfile: {},
                profileId: 0,
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


    render() {

        const role = data.roles;

        return (
            this.state.status ?
                <div>
                    <div className="infotab">
                        <div className="row">

                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div className="row">
                                    <div className="col-md-6 col-sm-6 col-xs-12">

                                        <div className="main_box2">

                                            <h1> Profile </h1>


                                            <div className="test12">

                                                <div>

                                                    <PlusOutlined className="leftplus"
                                                          onClick={() => this.setState({
                                                              modalProfile: true,
                                                              edit: false
                                                          })}/>

                                                    <div>

                                                        <Select
                                                            showSearch
                                                            style={{
                                                                width: '30%',
                                                                marginBottom: '30px',
                                                                marginTop: '10px',
                                                                marginRight: '20px',
                                                                marginLeft: '13px'
                                                            }}
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

                                                                <Select.Option
                                                                    value={item.id}>{item.title}</Select.Option>
                                                            ))}
                                                        </Select>

                                                        <EditOutlined className="rightedit"
                                                              onClick={() => this.setState({
                                                                  modalProfile: true,
                                                                  edit: true
                                                              })}/>

                                                        <div className="profile_form">

                                                            <div className="col-md-12">


                                                                <ul>

                                                                    <li>
                                                                        <label>
                                                                            <span> Title Suffix: </span>
                                                                            <span> {this.state.currentProfile.title} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Date of Birth: </span>
                                                                            <span> {this.state.currentProfile.date_of_birth} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Education: </span>
                                                                            <span> {this.state.currentProfile.education} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Current Location: </span>
                                                                            <span> {this.state.currentProfile.current_city} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Visa Type: </span>
                                                                            <span> {this.state.currentProfile.visa_type} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Visa Start Date: </span>
                                                                            <span> {this.state.currentProfile.visa_start} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> Visa End Date: </span>
                                                                            <span> {this.state.currentProfile.visa_end} </span>
                                                                        </label>
                                                                    </li>

                                                                    <li>
                                                                        <label>
                                                                            <span> LinkedIN: </span>
                                                                            <span> {this.state.currentProfile.links} </span>
                                                                        </label>
                                                                    </li>

                                                                </ul>


                                                            </div>


                                                            <div className="col-md-12">


                                                            </div>


                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <div className="main_box3">
                                            <h1> Work Auth </h1>

                                            <div className="test12">
                                                <EditOutlined
                                                      onClick={() => this.setState({
                                                          modalWorkAuth: true,
                                                      })}/>

                                                {
                                                    this.props.consultantData.work_auth.map((auth, index) =>

                                                        auth.is_current ?
                                                            <div className="rec_pop2">
                                                                <ul>
                                                                    <li> Visa Type : <span> {auth.visa_type} </span>
                                                                    </li>
                                                                    <li> Visa Start : <span> {auth.visa_start} </span>
                                                                    </li>
                                                                    <li> Visa End : <span> {auth.visa_end} </span></li>
                                                                </ul>
                                                            </div> : null
                                                    )
                                                }
                                            </div>

                                        </div>
                                        <div className="main_box3">

                                            <h1> Experience </h1>

                                            <div className="test12">
                                                <PlusOutlined
                                                      className="left_icon"
                                                      onClick={() => this.setState({
                                                          modalExp: true,
                                                          editExp: false,
                                                      })}/>
                                                {
                                                    this.props.consultantData.experience.map((exp, index) =>


                                                        <div className="experience_box">

                                                            {console.log(exp)}

                                                            {exp.title}
                                                            <br/>
                                                            {exp.org_name}

                                                            <EditOutlined
                                                                  onClick={() => this.setState({
                                                                      editExp: true,
                                                                      modalExp: true,
                                                                      selectedExperience: exp
                                                                  })}/>

                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="main_box3">

                                            <h1> Education </h1>

                                            <div className="test12">


                                                <PlusOutlined className="left_icon"
                                                      onClick={() => this.setState({editEdu: false, modalEdu: true})}/>

                                                {
                                                    this.props.consultantData.education.map((edu, index) =>

                                                        <div className="education_box">

                                                            <ul>
                                                                <li> {edu.title} </li>
                                                                <li> {edu.org_name} </li>
                                                            </ul>


                                                            <EditOutlined
                                                                  onClick={() => this.setState({
                                                                      editEdu: true,
                                                                      modalEdu: true,
                                                                      selectedEducation: edu
                                                                  })}/>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>


                                </div>


                            </div>


                            {this.state.modalProfile &&
                            <Modal
                                title="Profile"
                                visible={this.state.modalProfile}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <ProfileForm
                                    consultantId={this.props.consultantId}
                                    profile={this.state.currentProfile}
                                    edit={this.state.edit}
                                    handleClose={this.handleClose}
                                    changeCurrentProfile={this.changeCurrentProfile}
                                    addProfile={this.addProfile}
                                />
                            </Modal>
                            }
                            {this.state.modalWorkAuth &&
                            <Modal
                                title="Edit Work Auth"
                                visible={this.state.modalWorkAuth}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <WorkAuthForm consultantId={this.props.consultantId}
                                              workAuth={this.props.consultantData.work_auth}/>
                            </Modal>
                            }
                            {this.state.modalEdu &&
                            <Modal
                                title={this.state.editEdu ? "Edit Education" : "Add Education"}
                                visible={this.state.modalEdu}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <EducationForm
                                    setEducation={this.props.setEducation}
                                    updateEducation={this.props.updateEducation}
                                    handleClose={this.handleClose}
                                    consultantId={this.props.consultantId}
                                    eduObj={this.state.selectedEducation}
                                    editEdu={this.state.editEdu}/>
                            </Modal>
                            }
                            {this.state.modalExp &&
                            <Modal
                                title={this.state.editExp ? "Edit Experience" : "Add Experience"}
                                visible={this.state.modalExp}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <ExperienceForm
                                    setExperience={this.props.setExperience}
                                    updateExperience={this.props.updateExperience}
                                    handleClose={this.handleClose}
                                    consultantId={this.props.consultantId}
                                    expObj={this.state.selectedExperience}
                                    editExp={this.state.editExp}/>
                            </Modal>
                            }

                        </div>


                        <br clear="all"/>

                    </div>
                </div>
                : null

        )
    }
}

export default Info;
