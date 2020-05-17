import React, {Component} from 'react';
import "../../App.css";
import {Tabs, Modal, Tooltip, Tag, Popconfirm, Drawer} from 'antd';
import {EditOutlined} from "@ant-design/icons"
import Info from "./info";
import MarketingTab from "./marketingTab";
import FeedbackTab from "./feedbackTab";
import CommentsTab from "./commentsTab";
import DocumentTab from "./documentTab";
import RateRevision from "./rateRevision";
import {getConsultantDetails,} from "../../services/service";
import MarketerForm from "./popupForm/marketerForm";
import TeamForm from "./popupForm/teamForm";
import PrimaryMarketerForm from "./popupForm/primaryMarketerForm";
import POCForm from "./popupForm/POCForm";
import moment from 'moment-timezone'
import GeneralInfoForm from "./popupForm/generalInforForm";
import MarketingForm from "./popupForm/marketingForm";
import MarketingCycle from "./marketingCycle";
const {TabPane} = Tabs;

const CON_STATUS = [
    {key: 'in_marketing', label: 'In Marketing'},
    {key: 'on_project', label: 'On Project'},
    {key: 'archived', label: 'Archived'},
    {key: 'unassigned', label: 'Unassigned'},

];


class DescriptionTab extends Component {
    constructor(props) {
        super(props);
        const id = localStorage.getItem("CON")
        this.state = {
            consultantData: {},
            consultantProfiles: {},
            status: false,
            modalMarketer: false,
            modalRetention: false,
            modalRecruiter: false,
            modalTeam: false,
            editPrimaryMarketer: false,
            selectedIndex: 0,
            poc_type: '',
            modalPOC: false,
            consultantStatus: '',
            consultantId: id,
            modalConsultant: false,
            modalMarketing: false,
            openMarketing: false,

        };

        this.setPrimaryMarketer = this.setPrimaryMarketer.bind(this);
        this.setMarketer = this.setMarketer.bind(this);
        this.setRetention = this.setRetention.bind(this);
        this.setRecruiter = this.setRecruiter.bind(this);
        this.setEducation = this.setEducation.bind(this);
        this.setExperience = this.setExperience.bind(this);
        this.setConsultant = this.setConsultant.bind(this);
        this.setWorkAuth = this.setWorkAuth.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.updateEducation = this.updateEducation.bind(this);
        this.setTeam = this.setTeam.bind(this);
        this.setTeamTemp = this.setTeamTemp.bind(this);
    }

    componentWillMount() {

        this.getConsultantDetails(this.state.consultantId, false);
    }

    updateEducation(education) {
        let data = this.state.consultantData;
        let temp = {}
        let arrEdu = []
        data.education.map((edu, index) => {
            if (edu.id === education.id) {
                temp = education
                arrEdu.push(education)
            } else {
                arrEdu.push(edu)
            }
        })
        console.log("-----data---", data)
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": arrEdu,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data})


    };

    updateExperience(experience) {
        let data = this.state.consultantData;
        let temp = {}
        let arrExp = []
        data.experience.map((exp, index) => {
            if (exp.id === experience.id) {
                temp = experience
                arrExp.push(experience)
            } else {
                arrExp.push(exp)
            }
        })
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": arrExp,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data})


    };

    setWorkAuth(workAuth) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": workAuth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data})
    };

    updateWorkAuth(workAuth) {
        let data = this.state.consultantData;
        let temp = {};
        let arr = [];
        data.work_auth.map((ele, index) => {
            if (workAuth.id === ele.id) {
                temp = workAuth;
                arr.push(workAuth);
            } else {
                arr.push(ele);
            }
        })
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": arr,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data});
    };


    async setPrimaryMarketer(primaryMarketer) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": data.marketing.teams,
                "marketer": data.marketing.marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.marketing.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": primaryMarketer
            }
        };
        // noinspection ES6AwaitOutsideAsyncFunction
        await this.setState({
            consultantData: data,
        })

    };

    setEducation(education) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education.push(education),
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": data.marketing.teams,
                "marketer": data.marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": data.primary_marketer
            }
        };
        this.setState({consultantData: data})


    };

    setMarketing(marketing) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": data.marketing.teams,
                "marketer": data.marketer,
                "in_pool": marketing.in_pool,
                "start": marketing.start,
                "end": data.marketing.end,
                "preferred_location": marketing.preferred_location,
                "rtg": marketing.rtg,
                "primary_marketer": data.primary_marketer
            }
        };
        this.setState({consultantData: data})


    };

    setExperience(experience) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience.push(experience),
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": data.marketing.teams,
                "marketer": data.marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": data.primary_marketer
            }
        };
        this.setState({consultantData: data})


    };

    setMarketer(marketer) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": data.marketing.teams,
                "marketer": marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": data.marketing.primary_marketer
            }
        };
        this.setState({consultantData: data})


    };

    setRetention(retention) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": retention,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data})


    };

    async setRecruiter(recruiter) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        await this.setState({consultantData: data})


    };

    setConsultant(consultant) {
        console.log(consultant)
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": consultant.email,
            "skills": consultant.skills,
            "ssn": consultant.ssn,
            "gender": data.gender,
            "phone_no": consultant.phone_no,
            "links": data.links,
            "skype": consultant.skype,
            "status": data.status,
            "date_of_birth": consultant.date_of_birth,
            "work_type": data.work_type,
            "current_city": consultant.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": data.marketing
        };
        this.setState({consultantData: data})

    }

    setTeam(team) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": team,
                "marketer": data.marketing.marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.marketing.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": data.marketing.primary_marketer
            }
        };
        this.setState({consultantData: data})


    };

    setTeamTemp(team) {
        let data = this.state.consultantData;
        data = {
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "ssn": data.ssn,
            "gender": data.gender,
            "phone_no": data.phone_no,
            "links": data.links,
            "skype": data.skype,
            "status": data.status,
            "date_of_birth": data.date_of_birth,
            "work_type": data.work_type,
            "current_city": data.current_city,
            "work_auth": data.work_auth,
            "recruiter": data.recruiter,
            "relation": data.relation,
            "support": data.support,
            "profiles": data.profiles,
            "education": data.education,
            "experience": data.experience,
            "rate": data.rate,
            "marketing": {
                "id": data.marketing.id,
                "teams": team,
                "marketer": data.marketing.marketer,
                "in_pool": data.marketing.in_pool,
                "start": data.marketing.start,
                "end": data.marketing.end,
                "preferred_location": data.marketing.preferred_location,
                "rtg": data.marketing.rtg,
                "primary_marketer": data.marketing.primary_marketer
            }
        };


    };

    getConsultantDetails(id, param) {

        getConsultantDetails(id, param)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                this.setState({
                    consultantData: res.result,
                    consultantProfiles: res.result.profiles,
                    status: status === 200
                });
            })
            .catch(error => {
                console.log(error);
            });

    }

    handleClose = e => {
        this.setState({
            modalMarketer: false,
            modalPOC: false,
            modalTeam: false,
            editPrimaryMarketer: false,
            modalConsultant: false,
            modalMarketing: false,
        });
    };

    handleSelect = index => {
        this.setState({selectedIndex: index});
    };
    openModal = () => {
        this.setState({
            openMarketing: true
        })
    }
    closeModal = () => {
        this.setState({
            openMarketing: false
        })
    }


    render() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        const name = data.employee_name;
        return (
            this.state.status ?
                <div>


                    <div className="new_description_tab">
                        <div className="row">

                            <div className="col-md-3">
                                <div className="left_box">
                                    <div className="top_head">
                                        <h2>{this.state.consultantData.name}</h2>
                                        <h3>{CON_STATUS.map((status, i) => {
                                            if (this.state.consultantData.status === status.key) {
                                                return status.label
                                            }
                                        })}</h3>
                                        {
                                            this.state.consultantData.marketing !== null ?
                                                <h4>1 Active cycle</h4>
                                                :
                                                <Popconfirm
                                                    title="Do you want to start the marketing of the consultant?"
                                                    onConfirm={this.openModal}
                                                    onCancel={console.log("cancel")}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >

                                                    <h4>No Active Cycle</h4>
                                                </Popconfirm>

                                        }
                                    </div>
                                    <div className="right_desc">
                                        {
                                            role.map(role => role === "superadmin") &&
                                            <EditOutlined
                                                onClick={() => this.setState({
                                                    modalConsultant: true,
                                                })}/>
                                        }


                                        <div className="test12">
                                            <ul>
                                                <li>
                                                    <label> <span> Email </span> </label>
                                                    <span>{this.state.consultantData.email}</span>
                                                </li>

                                                <li><label> <span> SkypeID </span> </label>
                                                    <span>{this.state.consultantData.skype}</span>
                                                </li>

                                                <li><label> <span> Skill </span> </label>
                                                    <span>{this.state.consultantData.skills}</span>
                                                </li>

                                                <li><label> <span> Gender </span> </label>
                                                    <span>{this.state.consultantData.gender.charAt(0).toUpperCase() + this.state.consultantData.gender.slice(1) }</span>
                                                </li>

                                                <li><label> <span> Rate </span> </label>
                                                    <span>{this.state.consultantData.rate}</span>
                                                </li>

                                                <li><label> <span> SSN </span> </label>
                                                    <span>{this.state.consultantData.ssn}</span>
                                                </li>

                                                <li>
                                                    <label> <span> Phone Number </span> </label>
                                                    <span>{this.state.consultantData.phone_no}</span>
                                                </li>

                                                <li>
                                                    <label>
                                                        <span> Current Location: </span>
                                                    </label>
                                                    <span>{this.state.consultantData.current_city}</span>
                                                </li>

                                                <li><label>
                                                    <span> Date of Birth: </span></label>
                                                    <span>{this.state.consultantData.date_of_birth}</span>
                                                </li>

                                            </ul>
                                        </div>

                                    </div>
                                    {this.state.consultantData.marketing !== null ?
                                        <div>

                                            <div>
                                                {role.map(role => role === "superadmin") && <EditOutlined
                                                    onClick={() => this.setState({
                                                        modalMarketing: true,
                                                    })}/>

                                                }

                                            </div>
                                            <ul>
                                                <li><label>
                                                    <span>RTG</span></label>
                                                    <span>{this.state.consultantData.marketing.rtg ? 'Yes' : 'No'}</span>
                                                </li>

                                                <li><label>
                                                    <span>In pool</span> </label>
                                                    <span>{this.state.consultantData.marketing.in_pool ? 'Yes' : 'No'}</span>
                                                </li>
                                                <li><label>
                                                    <span>Preferred Location</span></label>
                                                    <span>{this.state.consultantData.marketing.preferred_location}</span>
                                                </li>

                                                <li><label>
                                                    <span>Marketing Start</span> </label>
                                                    <span>{moment(this.state.consultantData.marketing.start).format("DD-MM-YYYY")}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        :
                                        null}
                                </div>
                            </div>

                            <div className="col-md-9">
                                <div className="right_box">
                                    <ul>
                                        <li>
                                            <div className="top_head">
                                                <h1> primary Marketer </h1>
                                                <div>

                                                    <div onClick={() => {
                                                        role.map(role => {
                                                            if (role === "superadmin") {
                                                                this.setState({
                                                                    editPrimaryMarketer: true,
                                                                })
                                                            }
                                                        })
                                                    } }>
                                                        {this.state.consultantData.marketing.primary_marketer.employee_name}
                                                        <br/>
                                                        {this.state.consultantData.marketing.primary_marketer.email}
                                                        <br/>
                                                    </div>
                                                    {this.state.consultantData.marketing.marketer.length === 0 ?
                                                        <span>No marketer assigned</span>
                                                        :

                                                        <div>
                                                            <ul className="primarybox">

                                                                <li> <span>  {
                                                                    this.state.consultantData.marketing.marketer.map((marketer, index) => {
                                                                        const tagElem = (
                                                                            <Tooltip title={marketer.name} key={index}>
                                                                                <Tag
                                                                                    onClick={() => this.setState({modalMarketer: true})}
                                                                                    key={marketer.name}
                                                                                    closable={false}
                                                                                    color="blue"
                                                                                    style={{
                                                                                        width: '30px',
                                                                                        marginTop: '5px'
                                                                                    }}
                                                                                >
                                                                                    {marketer.name.split(" ").length === 1
                                                                                        ?
                                                                                        marketer.name.split(" ")[0].charAt(0) :
                                                                                        marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                                                                    }
                                                                                </Tag>
                                                                            </Tooltip>
                                                                        );
                                                                        if (index < 2) {
                                                                            return (
                                                                                tagElem
                                                                            );
                                                                        }

                                                                    })
                                                                } </span></li>

                                                            </ul>

                                                            <br clear="all"/>

                                                            {
                                                                this.state.consultantData.marketing.marketer.length > 2 &&

                                                                <div>
                                <span onClick={() => this.setState({modalMarketer: true})}
                                      style={{float: "right", marginRight: "63px", marginTop: "5px"}}> View More </span>
                                                                </div>

                                                            }

                                                        </div>
                                                    }

                                                </div>

                                            </div>
                                        </li>

                                        <li>
                                            <div className="top_head" onClick={() => {
                                                role.map(role => {
                                                    if (role === "superadmin") {
                                                        this.setState({
                                                            modalPOC: true, poc_type: 'relation'
                                                        })
                                                    }
                                                })
                                            } }>
                                                <h1> Retention </h1>
                                                <div className="test11">
                                                    {this.state.consultantData.relation === null ?
                                                        <span>No relation assigned</span>
                                                        :
                                                        <div>
                                                            {this.state.consultantData.relation.employee_name}
                                                            <br/>
                                                            {this.state.consultantData.relation.email}
                                                        </div>}

                                                </div>
                                            </div>
                                        </li>


                                        <li>
                                            <div className="top_head" onClick={() => {
                                                role.map(role => {
                                                    if (role === "superadmin") {
                                                        this.setState({
                                                            modalPOC: true, poc_type: 'recruiter'
                                                        })
                                                    }
                                                })
                                            } }>
                                                <h1> Recruiter </h1>
                                                <div className="test11">
                                                    {this.state.consultantData.recruiter === null ?
                                                        <span>No recruiter assigned</span>
                                                        :
                                                        <div>
                                                            {this.state.consultantData.recruiter.employee_name}
                                                            <br/>
                                                            {this.state.consultantData.recruiter.email}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="top_head">
                                                <h1> Engineer </h1>
                                                <div className="test11">
                                                    {this.state.consultantData.support === null ?
                                                        <span>No support assigned</span> :
                                                        <div>
                                                            <br/>
                                                            Name: {this.state.consultantData.support.employee_name}
                                                            <br/>
                                                            Email: {this.state.consultantData.support.email}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="top_head" onClick={() => {
                                                role.map(role => {
                                                    if (role === "superadmin") {
                                                        this.setState({
                                                            modalTeam: true
                                                        })
                                                    }
                                                })
                                            } }>

                                                <h1>Team</h1>
                                                <div className="test11">
                                                    {this.state.consultantData.marketing.teams.length === 0 ?
                                                        <span>No team assigned</span> :

                                                        <div>

                                                            {this.state.consultantData.marketing.teams.map((team, index) => {
                                                                const tagElem = (
                                                                    <Tooltip title={team.name} key={index}>
                                                                        <Tag
                                                                            onClick={() => this.setState({modalTeam: true})}
                                                                            key={team.name}
                                                                            closable={false}
                                                                            color="blue"
                                                                            style={{width: '39%', marginTop: '5px'}}
                                                                        >
                                                                            {team.name} </Tag>
                                                                    </Tooltip>
                                                                );
                                                                if (index < 2) {
                                                                    return (
                                                                        tagElem
                                                                    );
                                                                }

                                                            })
                                                            }
                                                            <br clear="all"/>

                                                            {
                                                                this.state.consultantData.marketing.teams.length > 2 &&

                                                                <div>
                                                                    <span
                                                                        onClick={() => this.setState({modalTeam: true})}> View More </span>
                                                                </div>

                                                            }
                                                        </div>
                                                    }
                                                </div>


                                            </div>
                                        </li>
                                    </ul>

                                </div>
                                <br clear="all"/>
                                <Tabs selectedIndex={this.state.selectedIndex}
                                      onSelect={this.handleSelect}>
                                    <TabPane tab="Description" key="1">
                                        <Info
                                            consultantId={this.state.consultantId}
                                            consultantData={this.state.consultantData}
                                            setExperience={this.setExperience}
                                            updateWorkAuth={this.updateWorkAuth}
                                            setEducation={this.setEducation}
                                            updateEducation={this.updateEducation}
                                            updateExperience={this.updateExperience}
                                        />
                                    </TabPane>
                                    <TabPane tab="Marketing" key="2">
                                        <MarketingTab consultantId={this.state.consultantId}/>
                                    </TabPane>
                                    <TabPane tab="Feedback" key="3">
                                        <FeedbackTab consultantId={this.state.consultantId}/>
                                    </TabPane>
                                    <TabPane tab="Comments" key="4">
                                        <CommentsTab consultantId={this.state.consultantId}/>
                                    </TabPane>
                                    <TabPane tab="Documents" key="5">
                                        <DocumentTab consultantId={this.state.consultantId}/>
                                    </TabPane>
                                    {/*<TabPane tab="Activity" key="6">*/}
                                    {/*    <ActivityTab/>*/}
                                    {/*</TabPane>*/}
                                    <TabPane tab="Rate Revision" key="7">
                                        <RateRevision consultantId={this.state.consultantId}/>
                                    </TabPane>
                                    <TabPane tab="Marketing Cycle" key="8">
                                        <MarketingCycle consultantId={this.state.consultantId}/>
                                    </TabPane>
                                </Tabs>

                            </div>


                        </div>
                        {this.state.modalConsultant &&
                        <Modal
                            title="Edit Consultant"
                            visible={this.state.modalConsultant}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <GeneralInfoForm
                                consultantId={this.state.consultantId}
                                data={this.state.consultantData}
                                edit={this.state.modalConsultant}
                                handleClose={this.handleClose}
                                setConsultant={this.setConsultant}
                            />
                        </Modal>
                        }
                        {this.state.modalMarketing &&
                        <Modal
                            title="Edit Marketing Details"
                            visible={this.state.modalMarketing}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <MarketingForm
                                data={this.state.consultantData.marketing}
                                marketingId={this.state.consultantData.marketing.id}
                                handleClose={this.handleClose}
                                setMarketing={this.setMarketing}
                            />

                        </Modal>
                        }
                        {this.state.editPrimaryMarketer &&
                        <Modal
                            title="Primary Marketer"
                            visible={this.state.editPrimaryMarketer}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <PrimaryMarketerForm
                                marketing={this.state.consultantData.marketing}
                                consultantId={this.state.consultantId}
                                closeModal={this.handleClose}
                                setPrimaryMarketer={this.setPrimaryMarketer}
                                marketer={this.state.consultantData.marketing}/>
                        </Modal>
                        }
                        {this.state.modalMarketer &&
                        <Modal
                            title="Marketer"
                            visible={this.state.modalMarketer}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <MarketerForm consultantId={this.state.consultantId}
                                          closeModal={this.handleClose}
                                          setMarketer={this.setMarketer}
                                          marketer={this.state.consultantData.marketing}/>
                        </Modal>
                        }
                        {this.state.modalPOC &&
                        <Modal
                            title={this.state.poc_type === 'relation' ? 'Retention' : 'Recruiter'}
                            visible={this.state.modalPOC}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <POCForm consultantId={this.state.consultantId}
                                     closeModal={this.handleClose}
                                     setRetention={this.setRetention}
                                     setRecruiter={this.setRecruiter}
                                     poc_type={this.state.poc_type}
                                     recruiter={this.state.consultantData.recruiter}
                                     retention={this.state.consultantData.relation}
                            />
                        </Modal>
                        }
                        {this.state.modalTeam &&
                        <Modal
                            title="Team"
                            visible={this.state.modalTeam}
                            footer={null}
                            onCancel={this.handleClose}
                        >
                            <TeamForm consultantId={this.state.consultantId}
                                      closeModal={this.handleClose}
                                      marketer={this.state.consultantData.marketing}
                                      setTeam={this.setTeam}
                                      setTeamTemp={this.setTeamTemp}
                                //setMarketer={this.setMarketer}
                            />
                        </Modal>
                        }
                        {
                            this.state.openMarketing &&
                            <Drawer
                                title="Marketing Details"
                                width={1020}
                                maskClosable={false}
                                closable={false}
                                onClose={this.closeModal}
                                visible={this.state.openMarketing}
                            >
                                <MarketingForm closeModal={this.closeModal}/>
                            </Drawer>
                        }

                    </div>

                    <br clear="all"/>


                </div>
                :
                <div>Loading....</div>

        )
    }
}

export default DescriptionTab;
