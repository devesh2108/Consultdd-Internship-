import React, {Component} from 'react';
import "../../../App.css";
import 'antd/dist/antd.css';
import {Form, Input, Select, Tag, Tooltip, message, Icon, Button, Drawer, Spin, Tabs} from 'antd';
import {getEmployeeSuggestion, fetchGuestList, updateScreening, addFeedback} from "../../../services/service";
import {findFirstSundayNov, findSecondSundayMar} from "../../../functions/dstConverter";
import moment from "moment-timezone";
import InterviewFeedback from "./InterviewFeedback";
import RoundTab from "./roundTab";

let startOfEST, endOfEST, setTZ;
endOfEST = findFirstSundayNov(new Date());
startOfEST = findSecondSundayMar(new Date());
const {TabPane} = Tabs;
const INTERVIEW_MODES = [
    {
        key: 'dial_in', value: "Dial In"
    },
    {
        key: 'hangouts', value: "Hangouts"
    },
    {
        key: 'skype', value: "Skype"
    },
    {
        key: 'video_call', value: "Video Call"
    },
    {
        key: 'voice_call', value: "Voice Call"
    },
    {
        key: 'webex', value: "Webex"
    },
]
const SCREENING_TYPE = [
    {
        key: 'screening', value: "Screening"
    },
    {
        key: 'interview', value: "Interview"
    },
    {
        key: 'test', value: "Test"
    },

]

class InterviewTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoundData: {},
            calendar_id: "",
            type: "",
            start_time: "",
            end_time: "",
            supervisor: "",
            supervisor_id: "",
            dialing_details: "",
            round: "",
            link: "",
            description: "",
            guest: [],
            tz: 0,
            tzStatus: false,
            tzDate: new Date(),
            supervisorList: [],
            fetching: false,
            data: [],
            value: [],
            status: "",
            edit: false,
            reschedule: false,
            interview_status: false,
            feedbackStatus: "",
            feedback_description: "",
            feedbackFlag: false,
            activeInterview: 1,
            flag: false

        }
    }

    componentDidMount() {
        this.setData();
        this.setTimeZone();

    }

    callback = (key) => {

        this.setState({
            flag: false,
            activeInterview: key,
            currentRoundData: this.props.interviewData[key - 1],
        }, () => {
            let data = [], value = [];
            if (this.state.currentRoundData.guest.length !== 0) {
                data = this.state.currentRoundData.guest.map(user => ({
                    text: `${user.employee_name}`,
                    value: user.id,
                }));
                value = this.state.currentRoundData.guest.map(user => ({
                    label: `${user.employee_name}`,
                    key: user.id,
                }));
            }
            this.setState({
                calendar_id: this.state.currentRoundData.calendar_id,
                type: INTERVIEW_MODES.map((mode, index) => {
                    if (this.state.currentRoundData.interview_mode === mode.key) {
                        return mode.value
                    }
                }),
                start_time:
                    startOfEST < new Date(this.state.currentRoundData.start_time) && new Date(this.state.currentRoundData.start_time) < endOfEST ?
                        moment(this.state.currentRoundData.start_time).add(4, 'hours') :
                        moment(this.state.currentRoundData.start_time).add(5, 'hours'),
                end_time:
                    startOfEST < new Date(this.state.currentRoundData.end_time) && new Date(this.state.currentRoundData.end_time) < endOfEST ?
                        moment(this.state.currentRoundData.end_time).add(4, 'hours') :
                        moment(this.state.currentRoundData.end_time).add(5, 'hours'),
                supervisor: this.state.currentRoundData.supervisor.employee_name,
                supervisor_id: this.state.currentRoundData.supervisor.id,
                round: this.state.currentRoundData.round,
                description: this.state.currentRoundData.description,
                dialing_details: this.state.currentRoundData.call_details,
                data: data,
                value: value,
                fetching: false,
                edit: false,
                reschedule: false,
                interview_status: this.state.currentRoundData.status,
                link: this.state.currentRoundData.attachment_link,
                flag: true
            })
        })
    }


    setTimeZone = () => {
        var tz = this.state.tzDate.getTimezoneOffset();
        if (startOfEST < new Date() && new Date() < endOfEST) {
            console.log(tz)
            if (tz === 240) {
                console.log("240")
                this.setState({tzStatus: false})
            }
        } else if (tz === 300) {
            this.setState({tzStatus: false})
        } else {

            this.setState({tzStatus: true})
        }
        this.setState({
            tz: tz,
            flag: true
        })
    }

    setData = () => {
        let data = [], value = [],type="";
        console.log("----this.props.currentRoundData.guest-----",this.props.currentRoundData)

        if (this.props.currentRoundData.guest.length !== 0) {
            data = this.props.currentRoundData.guest.map(user => ({
                text: `${user.employee_name}`,
                value: user.id,
            }));
            value = this.props.currentRoundData.guest.map(user => ({
                label: `${user.employee_name}`,
                key: user.id,
            }));
            INTERVIEW_MODES.map((mode, index) => {
                if (this.props.currentRoundData.interview_mode === mode.key) {
                    type= mode.value
                }
            })
        }
        this.setState({
            calendar_id: this.props.currentRoundData.calendar_id,
            type: type,
            start_time:
                startOfEST < new Date(this.props.currentRoundData.start_time) && new Date(this.props.currentRoundData.start_time) < endOfEST ?
                    moment(this.props.currentRoundData.start_time).add(4, 'hours') :
                    moment(this.props.currentRoundData.start_time).add(5, 'hours'),
            end_time:
                startOfEST < new Date(this.props.currentRoundData.end_time) && new Date(this.props.currentRoundData.end_time) < endOfEST ?
                    moment(this.props.currentRoundData.end_time).add(4, 'hours') :
                    moment(this.props.currentRoundData.end_time).add(5, 'hours'),
            supervisor: this.props.currentRoundData.supervisor.employee_name,
            supervisor_id: this.props.currentRoundData.supervisor.id,
            round: this.props.currentRoundData.round,
            description: this.props.currentRoundData.description,
            dialing_details: this.props.currentRoundData.call_details,
            data: data,
            value: value,
            fetching: false,
            edit: false,
            reschedule: false,
            interview_status: this.props.currentRoundData.status,
            link: this.props.currentRoundData.attachment_link,
            activeInterview: this.props.activeInterview,
            currentRoundData: this.props.currentRoundData,

        }, () => this.setTimeZone())
    }

    onChange = e => {
        this.setState({
            feedbackStatus: e.target.value,
        });
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSupervisorInputChange = (value) => {
        this.setState({
            supervisor: value.split(",")[0],
            supervisor_id: value.split(",")[1],
        })
    };

    handleChangeSelect = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    onOk = (start, end,) => {
        console.log(start, end, "working")
        this.setState({
            start_time: start,
            end_time: end,
        })
    };

    handleSelect = (type) => {
        this.setState({
            type: type
        })

    }

    setEdit = () => {
        this.setState({
            edit: true,
            reschedule: false,
        })
    }

    setReschedule = () => {
        this.setState({
            edit: false,
            reschedule: true,
        })
    }

    handleClose = () => {
        this.setData()
    }
    setFeedbackStatus = () => {
        this.setState({
            feedbackFlag: true
        })
    }
    unsetFeedbackStatus = () => {
        this.setState({
            feedbackFlag: false
        })
    }

    /* Feedback*/
    confirmNext = (feedback_status, screening_id,) => {
        const body = {
            'status': feedback_status,
            'feedback': this.state.feedback_description,

        }
        addFeedback(screening_id, body, true)
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
                    if (status === 202) {
                        if (feedback_status === 'next_round') {
                            this.setState({
                                interview_id: screening_id,
                                nextRoundFlag: true,
                                feedbackFlag: false
                            })
                            message.success("Added Feedback.");
                        } else if (feedback_status === 'offer') {
                            this.setState({
                                interview_id: screening_id,
                                po: true,
                                feedbackFlag: false
                            })
                            message.success("Added Feedback.");
                        }
                        this.setState({feedbackFlag: false, feedbackStatus: '', description: ''})

                    } else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    confirm = (feedback_status, screening_id) => {
        const body = {
            'status': feedback_status,
            'feedback': this.state.feedback_description,

        }
        addFeedback(screening_id, body, true)
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
                    if (status === 202) {
                        message.success("Added Feedback.");

                        this.setState({feedbackFlag: false, feedbackStatus: '', description: ''})

                        if (this.state.my === 'my' || this.state.my === 'team') {
                            this.getMyInterview(this.state.filter, this.state.my, this.state.filter_status, 1, 10, this.state.query)
                        } else if (this.state.query !== '') {
                            this.onSearch(this.state.query, 1, 10, this.state.filter_status, this.state.filter)
                        } else if (this.state.filter_status !== '') {
                            this.onSpecificFilter(this.state.filter, this.state.filter_status, 1, 10, this.state.total, this.state.query)
                        } else {
                            this.getAllInterview(1, this.state.filter, 10, this.state.query)
                        }
                    } else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    /* Feedback Over */
    getSupervisorSuggestions() {
        getEmployeeSuggestion(this.state.supervisor, 'interview')
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    supervisorList: res.results,
                    error: res.error || null,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    fetchGuestList(params) {
        this.setState({fetching: true});
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

    };

    editInterview = () => {
        let startTime = this.state.start_time;
        let endTime =this.state.end_time;
        console.log(startTime, endTime);
        this.state.value.map((item, i) => (
            this.state.guest.push(parseInt(item.key))
        ))
        let reschedule = "",type="";
        INTERVIEW_MODES.map((mode, index) => {
            console.log(this.state.type,mode.value)
            if (this.state.type === mode.value) {
                type= mode.key
            }
        })
        const body = {
            "event_id": this.state.currentRoundData.calendar_id,
            "screening_id": this.state.currentRoundData.id,
            "submission": this.state.currentRoundData.submission_id,
            "ctb": this.state.supervisor_id,
            "type": type,
            "description": this.state.description,
            "start_time": startTime,
            "end_time": endTime,
            "guest": this.state.guest,
            "call_details": this.state.dialing_details,
            "attachment_link": this.state.link
        };
        updateScreening(this.props.currentRoundData.id, body, false, reschedule)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status !== 202) {
                    message.error("Something went wrong.")
                } else {
                    message.success("Interview Updated.");
                    this.setState({
                        supervisor_id : this.state.supervisor_id,
                        type: type,
                        description: this.state.description,
                        start_time: startTime,
                        end_time: endTime,
                        guest: this.state.guest,
                        data: this.state.guest,
                        value: this.state.guest,
                        dialing_details: this.state.dialing_details,
                        link: this.state.link

                    })
                }


            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const {fetching, data, value} = this.state;
        return (
            this.state.flag ?
                <div>
                    <Tabs defaultActiveKey="1" onChange={this.callback}
                          activeKey={this.state.activeInterview.toString()}>
                        {
                            this.props.interviewData.map((interview, index) =>
                                <TabPane tab={"Round " + interview.round} key={interview.round}>

                                    <RoundTab
                                        INTERVIEW_MODES={INTERVIEW_MODES}
                                        tzStatus={this.state.tzStatus}
                                        interview_status={this.state.interview_status}
                                        reschedule={this.state.reschedule}
                                        edit={this.state.edit}
                                        feedbackFlag={this.state.feedbackFlag}
                                        type={this.state.type}
                                        start_time={this.state.start_time}
                                        end_time={this.state.end_time}
                                        supervisorList={this.state.supervisorList}
                                        supervisor={this.state.supervisor}
                                        dialing_details={this.state.dialing_details}
                                        description={this.state.description}
                                        interview_id={this.state.currentRoundData.id}
                                        feedbackStatus={this.state.feedbackStatus}
                                        feedback_description={this.state.feedback_description}
                                        link={this.state.link}
                                        is_active={this.props.is_active}
                                        round={this.props.round}
                                        value={value}
                                        data={data}
                                        fetching={fetching}
                                        onOk={this.onOk}
                                        setEdit={this.setEdit}
                                        setReschedule={this.setReschedule}
                                        handleClose={this.handleClose}
                                        editInterview={this.editInterview}
                                        unsetFeedbackStatus={this.unsetFeedbackStatus}
                                        setFeedbackStatus={this.setFeedbackStatus}
                                        onChange={this.onChange}
                                        handleChange={this.handleChange}
                                        confirmNext={this.confirmNext}
                                        confirm={this.confirm}
                                        handleSelect={this.handleSelect}
                                        getSupervisorSuggestions={this.getSupervisorSuggestions}
                                        handleSupervisorInputChange={this.handleSupervisorInputChange}
                                        fetchGuestList={this.fetchGuestList}
                                        handleChangeSelect={this.handleChangeSelect}

                                    />
                                </TabPane>
                            )

                        }
                    </Tabs>


                </div>
                :
                <Spin size="small">Loading...</Spin>
        )
    }
}

export default InterviewTab;
