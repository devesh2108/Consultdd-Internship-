import React, {Component} from 'react';
import moment from 'moment-timezone';
import {
    deleteScreening,
    getAllInterview,
    getConsultantInterviews,
    myInt,
    onInterviewSearch,
    onSpecificFilterInt,
    updateScreening
} from "../../services/service";
import AddProject from "../../components/createForms/addProject";
import { Table, Input, Button, Pagination, Radio, message, Row, Col, Card, Menu, Dropdown, Switch, Spin, Drawer, Modal,} from 'antd';
import {MoreOutlined} from "@ant-design/icons"
import 'antd/dist/antd.css';
import CalendarComponent from "../../components/calendarComponents/calendarComponent";
import {findFirstSundayNov, findSecondSundayMar} from "../../functions/dstConverter";
import DetailTabView from "../../components/viewForms/submissionTab/detailTabView";
import InterviewFeedback from "../../components/viewForms/submissionTab/InterviewFeedback";

const {TextArea} = Input;
const {confirm} = Modal;

let startOfEST;
let endOfEST;
endOfEST =findFirstSundayNov(new Date())
startOfEST =findSecondSundayMar(new Date())
class Interview extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            po: false,
            view: false,
            interviewData: [],
            status: null,
            modalIsOpen: false,
            interview_details: {},
            searchText: '',
            selectedRowKeys: [],
            current_page: 1,
            filter: 'all',
            total: null,
            feedback_description: '',
            calendarPopup: false,
            edit: false,
            scheduled: '',
            cancelled: '',
            passed: '',
            rescheduled: '',
            feedback_due: '',
            failed: '',
            current_size: 10,
            my: 'all',
            intStatus: false,
            loading: false,
            open: false,
            dropdown: [false],
            query: '',
            filter_status: '',
            t: 0,
            editFlag: false,
            viewFlag: false,
            rescheduleFlag: false,
            cancelFlag: false,
            feedbackFlag: false,
            nextRoundFlag: false,
            feedbackStatus: '',
            description: '',
            index: 0,
            interview_id: '',
            submission_id: '',
            flagArray: [false],
            dstStatus:4,
            selectedIndex:"",
            round:1,
            tzDate: new Date(),
            tz: 0,
            tzStatus: false

        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getAllInterview = this.getAllInterview.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.viewModal = this.viewModal.bind(this);
        this.editModal = this.editModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.feedbackModal = this.feedbackModal.bind(this);
        this.rescheduleModal = this.rescheduleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.nextRoundModal = this.nextRoundModal.bind(this);
        this.confirmNext = this.confirmNext.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            po: false,
            view: false,
            edit: false,
            calendarPopup: false,
            editFlag: false,
            feedbackFlag: false,
            viewFlag: false,
            rescheduleFlag: false,
            nextRoundFlag: false,
            selectedIndex :1,
        });
        if (this.props.tab_flag === false) {
            if (this.props.consultant_id !== -1) {
                this.getConsultantInterviews(this.props.consultant_id, 1, 10)

            }
        } else {
            if (this.state.my === 'my' || this.state.my === 'team') {
                this.getMyInterview(this.state.filter, this.state.my, this.state.filter_status, 1, 10, this.state.query)
            } else if (this.state.query !== '') {
                this.onSearch(this.state.query, 1, 10, this.state.filter_status, this.state.filter, this.state.my)
            } else if (this.state.filter_status !== '') {
                this.onSpecificFilter(this.state.filter, this.state.filter_status, 1, 10, this.state.total, this.state.query)
            } else if (!this.state.nextRoundFlag) {
                this.getAllInterview(1, this.state.filter, 10, this.state.query)
            }
        }

    }

    componentDidMount() {
        var tz = new Date().getTimezoneOffset();
        let startOfEST;
        let endOfEST;
        endOfEST =findFirstSundayNov(new Date())
        startOfEST =findSecondSundayMar(new Date())
        if (startOfEST < new Date() && new Date() < endOfEST) {
            if (tz === 240) {
                this.setState({tzStatus: false})
            }
        } else if (tz === 300) {
            this.setState({tzStatus: false})
        } else {
            this.setState({tzStatus: true})
        }
        this.setState({
            tz: tz
        })
        if(startOfEST < new Date() && new Date() < endOfEST){
            if (tz === 240) {
                this.setState({tzStatus: false,dstStatus: 5})
            }
        }
        else if (tz === 300) {
            this.setState({tzStatus: false,dstStatus: 4})
        } else {
            this.setState({tzStatus: true,dstStatus: 4})
        }


        if (this.props.tab_flag === false) {
            if (this.props.consultant_id !== -1) {
                this.getConsultantInterviews(this.props.consultant_id, 1, 10)

            }
        } else {
            this.getAllInterview(1, this.state.filter, 10, this.state.query)

        }

    }

    getConsultantInterviews(id, page, size) {
        this.setState({interviewData: [], loading: false})
        getConsultantInterviews(id, page, size)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                }
                else {
                    let temp_interviewData = []
                    let temp_obj = {}


                    res.results.map((item, i) => (
                            temp_obj = {
                                interview_id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                supervisor_name: item.supervisor_name_name,
                                status: item.status,
                                marketer: item.marketer_name,
                                start_end:
                                    startOfEST < new Date(item.end_time) && new Date(item.end_time) < endOfEST ?
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
                                obj: item,
                                round: item.round,
                                job_title: item.job_title,
                                marketer_name: item.marketer_name,
                                project: item.project,
                                submission_id : item.submission_id,
                                interview_mode: item.interview_mode.charAt(0).toUpperCase() + item.interview_mode.slice(1)
                            },
                                console.log("time", temp_obj.start_end),
                                temp_interviewData.push(temp_obj)

                        )
                    )

                    this.setState({
                        loading: true,
                        interviewData: temp_interviewData,
                        scheduled: res.counts.scheduled,
                        feedback_due: res.counts.feedback_due,
                        total: res.counts.total,
                        t: res.counts.total,
                        failed: res.counts.failed,
                        cancelled: res.counts.cancelled,
                        passed: res.counts.offer,
                        rescheduled: res.counts.rescheduled,
                        status: status
                    })
                }

            })
    };

    getAllInterview(page, filter, size, val) {
        let temp_obj = {};
        let temp_interviewData = []
        this.setState({interviewData: [], loading: false})
        getAllInterview(page, filter, size, val)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                }
                else {

                    console.log("response", res)
                    console.log("startEST", startOfEST)
                    console.log("endEST", endOfEST)
                    res.results.map((item, i) => (
                            temp_obj = {
                                interview_id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                supervisor_name: item.supervisor_name,
                                marketer: item.marketer_name,
                                status: item.status,
                                start_end:
                                    startOfEST < new Date(item.end_time) && new Date(item.end_time) < endOfEST ?
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
                                obj: item,
                                round: item.round,
                                job_title: item.job_title,
                                project: item.project,
                                marketer_name: item.marketer_name,
                                submission_id: item.submission_id,
                                interview_mode: item.interview_mode.charAt(0).toUpperCase() + item.interview_mode.slice(1)
                            },
                                console.log("temp interview data", temp_interviewData),
                                temp_interviewData.push(temp_obj)

                        )
                    )
                    console.log(res.counts)
                    this.setState({
                        loading: true,
                        interviewData: temp_interviewData,
                        scheduled: res.counts.scheduled,
                        feedback_due: res.counts.feedback_due,
                        total: res.counts.total,
                        t: res.counts.total,
                        failed: res.counts.failed,
                        cancelled: res.counts.cancelled,
                        passed: res.counts.offer,
                        rescheduled: res.counts.rescheduled,
                        status: status
                    })
                }

            })
    };

    onPageChange = (page, size) => {
        this.setState({
            current_size: size,
            current_page: page
        });
        if (this.props.tab_flag === false) {
            if (this.props.consultant_id !== -1) {
                this.getConsultantInterviews(this.props.consultant_id, page, size)

            }
        } else {
            if (this.state.my === 'my' || this.state.my === 'team') {
                this.getMyInterview(this.state.filter, this.state.my, this.state.filter_status, page, size, this.state.query)
            }
            else if (this.state.query !== '') {
                this.onSearch(this.state.query, page, size, this.state.filter_status, this.state.filter, this.state.my)
            }
            else if (this.state.filter_status !== '') {
                this.onSpecificFilter(this.state.filter, this.state.filter_status, page, size, this.state.total, this.state.query)
            }
            else {
                this.getAllInterview(page, this.state.filter, size, this.state.query)
            }


        }
    };

    onFilterChange = e => {

        this.setState({
            filter: e.target.value,
            current_size: 10,
            current_page: 1
        });
        if (this.state.my === 'my' || this.state.my === 'team') {
            this.getMyInterview(e.target.value, this.state.my, this.state.filter_status, 1, 10, this.state.query)
        }
        else if (this.state.filter_status !== '') {
            this.onSpecificFilter(e.target.value, this.state.filter_status, 1, 10, this.state.t, this.state.query)
        }
        else {
            this.getAllInterview(1, e.target.value, 10, this.state.query)
        }

    };

    onSearch(value, page, size, status, filter, my) {
        let temp_obj = {};
        let temp_interviewData = [];
        this.setState({interviewData: [], loading: false, status: '', query: value})
        console.log(this.state.interviewData)
        onInterviewSearch(value, page, size, status, filter, my)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                if (status !== 200) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    res.results.map((item, i) => (
                            temp_obj = {
                                interview_id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                supervisor_name: item.supervisor_name,
                                marketer: item.marketer_name,
                                status: item.status,
                                start_end:
                                    startOfEST < new Date(item.end_time) && new Date(item.end_time) < endOfEST ?
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
                                obj: item,
                                round: item.round,
                                job_title: item.job_title,
                                project: item.project,
                                marketer_name: item.marketer_name,
                                submission_id: item.submission_id,
                                interview_mode: item.interview_mode.charAt(0).toUpperCase() + item.interview_mode.slice(1)
                            },
                                temp_interviewData.push(temp_obj)

                        )
                    )
                    this.setState({
                        interviewData: temp_interviewData,
                        scheduled: res.counts.scheduled,
                        feedback_due: res.counts.feedback_due,
                        total: res.counts.total,
                        t: res.counts.total,
                        failed: res.counts.failed,
                        cancelled: res.counts.cancelled,
                        passed: res.counts.offer,
                        rescheduled: res.counts.rescheduled,
                        loading: true,
                        status: status
                    })
                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    cancel(e) {
        this.setState({open: false})
    }

    onUpdateChange(id, interview) {
        console.log(id, interview)
        let temp = this.state.interviewData;
        let chInd = -1;
        let temp_interviewData;
        temp_interviewData = {
            interview_id: interview.id,
            consultant_name: interview.consultant_name,
            vendor: interview.company_name,
            client: interview.client,
            job_title: interview.job_title,
            supervisor_name: interview.supervisor_name,
            status: interview.status,
            marketer: interview.marketer_name,
            start_end:
                startOfEST < new Date(interview.start_time) && new Date(interview.start_time) < endOfEST ?
                    moment(interview.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(interview.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(interview.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                    moment(interview.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(interview.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(interview.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
            obj: interview,
            round: interview.round,
            submission_id: interview.submission_id,
            interview_mode: interview.interview_mode.charAt(0).toUpperCase() + interview.interview_mode.slice(1),
            project: interview.project,
            marketer_name: interview.marketer_name
        }
        console.log("update temp interview data", temp_interviewData)

        for (let i in temp) {
            if (temp[i].interview_id === id) {
                chInd = i
            }
        }

        temp[chInd] = temp_interviewData;
        console.log(temp)
        this.setState({
            interviewData: temp,

        })

    }

    confirmNext(feedback_status, screening_id, sub_id) {
        const body = {
            'screening_id': screening_id,
            'status': feedback_status,
            'feedback': this.state.feedback_description,

        }
        updateScreening(screening_id, body, true,false)
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
                                submission_id: sub_id,
                                nextRoundFlag: true,
                                feedbackFlag: false
                            })
                            message.success("Added Feedback.");
                        }
                        else if (feedback_status === 'offer') {
                            this.setState({
                                interview_id: screening_id,
                                submission_id: sub_id,
                                po: true,
                                feedbackFlag: false
                            })
                            message.success("Added Feedback.");
                        }
                        this.setState({feedbackFlag: false, feedbackStatus: '', description: ''})

                        if (this.state.my === 'my' || this.state.my === 'team') {
                            this.getMyInterview(this.state.filter, this.state.my, this.state.filter_status, 1, 10, this.state.query)
                        }
                        else if (this.state.query !== '') {
                            this.onSearch(this.state.query, 1, 10, this.state.filter_status, this.state.filter, this.state.my)
                        }
                        else if (this.state.filter_status !== '') {
                            this.onSpecificFilter(this.state.filter, this.state.filter_status, 1, 10, this.state.t, this.state.query)
                        }
                        else {
                            this.getAllInterview(1, this.state.filter, 10, this.state.query)
                        }
                    }
                    else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    confirm(feedback_status, screening_id) {
        const body = {
            'screening_id': screening_id,
            'status': feedback_status,
            'feedback': this.state.feedback_description,

        };
        console.log(body)
        updateScreening(screening_id, body, true,false)
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
                        }
                        else if (this.state.query !== '') {
                            this.onSearch(this.state.query, 1, 10, this.state.filter_status, this.state.filter)
                        }
                        else if (this.state.filter_status !== '') {
                            this.onSpecificFilter(this.state.filter, this.state.filter_status, 1, 10, this.state.total, this.state.query)
                        }
                        else {
                            this.getAllInterview(1, this.state.filter, 10, this.state.query)
                        }
                    }
                    else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    showDeleteConfirm(id) {
        const self = this;
        confirm({
            title: 'Are you sure cancel this interview?',
            visible: this.state.open,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({open: true})
                self.deleteScreening(id)
            },
            onCancel() {
                self.setState({open: false})
                console.log('Cancel')
            },
        });
    }

    showConfirm(type, id, i) {
        let a = this.state.dropdown.slice();
        a[i] = false;
        this.setState({dropdown: a});
        const self = this;
        confirm({
            visible: this.state.open,
            title: 'Interview Feedback : ',
            content: <div style={{position: 'relative'}}>
                Add description:
                <TextArea
                    onChange={(e) => this.setState({feedback_description: e.target.value})}
                    autosize={{minRows: 5, maxRows: 10}}/>
            </div>,
            okText: 'Submit',
            okType: 'info',
            cancelText: 'Cancel',
            onOk() {
                self.setState({open: true})
                self.confirm(type, id)
            },
            onCancel() {
                self.setState({open: false})
                console.log('Cancel')
            },
        });
    }

    deleteScreening(screening_id) {


        deleteScreening(screening_id)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    message.success("Interview Cancelled.");
                    this.getAllInterview(1, this.state.filter, 10, this.state.query)
                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    onSpecificFilter(filter, val, page, size, total, query) {
        console.log(val)
        let temp_interviewData = [];
        let temp_obj = {};
        let temp = this.state.flagArray;
        switch (val) {
            case '':
                temp[0] = true
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = false
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'scheduled':
                temp[0] = false
                temp[1] = true
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = false
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'rescheduled':
                temp[0] = false
                temp[1] = false
                temp[2] = true
                temp[3] = false
                temp[4] = false
                temp[5] = false
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'offer':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = true
                temp[4] = false
                temp[5] = false
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'failed':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = true
                temp[5] = false
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'feedback_due':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = true
                temp[6] = false
                this.setState({flagArray: temp})
                break;
            case 'cancelled':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = false
                temp[6] = true
                this.setState({flagArray: temp})
                break;
        }

        this.setState({
            interviewData: [],
            loading: false,
            filter_status: val,
            current_page: page,
            current_size: size,
            total: total
        })
        onSpecificFilterInt(filter, this.state.my, val, page, size, query)
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
                    console.log(res)
                    res.results.map((item, i) => (
                            temp_obj = {
                                interview_id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                supervisor_name: item.supervisor_name,
                                marketer: item.marketer_name,
                                status: item.status,
                                start_end:
                                    startOfEST < new Date(item.end_time) && new Date(item.end_time) < endOfEST ?
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
                                obj: item,
                                round: item.round,
                                job_title: item.job_title,
                                marketer_name: item.marketer_name,
                                submission_id: item.submission_id,
                                interview_mode: item.interview_mode.charAt(0).toUpperCase() + item.interview_mode.slice(1)
                            },
                                temp_interviewData.push(temp_obj)


                        )
                    )
                    this.setState({
                        interviewData: temp_interviewData,
                        scheduled: res.counts.scheduled,
                        loading: true,
                        t: res.counts.total,
                        failed: res.counts.failed,
                        feedback_due: res.counts.feedback_due,
                        cancelled: res.counts.cancelled,
                        passed: res.counts.offer,
                        rescheduled: res.counts.rescheduled,
                        status: status
                    })
                }
            })
    }

    getMyInterview(filter, interview_mode, status, page, size, val) {
        let temp_interviewData = [];
        let temp_obj = {};
        this.setState({interviewData: []})
        myInt(filter, interview_mode, status, page, size, val)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    res.results.map((item, i) => (
                            temp_obj = {
                                interview_id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                ctb: item.supervisor_name,
                                marketer: item.marketer_name,
                                status: item.status,
                                start_end:
                                    startOfEST < new Date(item.end_time) && new Date(item.end_time) < endOfEST ?
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(4, 'hours').tz("America/Toronto").format("hh:mm A"):
                                        moment(item.start_time).tz("America/Toronto").format("dddd, MMMM Do YYYY") + ": " + moment(item.start_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A") + " to " + moment(item.end_time).add(5, 'hours').tz("America/Toronto").format("hh:mm A"),
                                obj: item,
                                round: item.round,
                                job_title: item.job_title,
                                marketer_name: item.marketer_name,
                                project: item.project,
                                submission_id: item.submission_id,
                                interview_mode: item.interview_mode.charAt(0).toUpperCase() + item.interview_mode.slice(1)
                            },
                                temp_interviewData.push(temp_obj)

                        )
                    )
                    this.setState({
                        interviewData: temp_interviewData,
                        scheduled: res.counts.scheduled,
                        feedback_due: res.counts.feedback_due,
                        total: res.counts.total,
                        t: res.counts.total,
                        failed: res.counts.failed,
                        cancelled: res.counts.cancelled,
                        passed: res.counts.offer,
                        rescheduled: res.counts.rescheduled,
                        status: status
                    })
                }
            })
    }

    viewModal() {
        this.setState({viewFlag: true})
    }

    editModal() {
        this.setState({editFlag: true})
    }

    rescheduleModal() {
        this.setState({rescheduleFlag: true})
    }

    cancelModal() {
        this.setState({cancelFlag: true})
    }

    feedbackModal(id, sub_id, i) {
        this.setState({feedbackFlag: true, submission_id: sub_id, interview_id: id, index: i})
    }

    nextRoundModal(sub_id) {
        console.log(sub_id)
        this.setState({submission_id: sub_id, nextRoundFlag: true})
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })

    }

    onChange = e => {
        this.setState({
            feedbackStatus: e.target.value,
        },()=>{
            if(this.state.feedbackStatus === "cancelled"){
                this.showDeleteConfirm(this.state.interview_details.id)
            }
        });
    };

    handleSelect = key => {
        this.setState({selectedIndex: key});
    };

    setInterviewData=(record)=>{
        this.setState({
            interview_details: record.obj,
            submission_id: record.obj.submission_id,
            selectedIndex :3,
            round:record.obj.round,
            view: true,
            edit: true
        })
    }

    render() {

        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        const marketer = data.employee_name;
        const menu = (status, data, project, i) => (
            <Menu>


                {status !== 'cancelled' ?
                    status === 'offer' ?
                        project === null ?
                            <Menu.Item key="5" onClick={() => this.setState({
                                po: true,
                                submission_id: data.obj.submission_id,
                                interview_details: data.obj
                            })}>
                                Create PO
                            </Menu.Item> :
                            null :
                        status === 'next_round' ?
                            <Menu.Item key={status === 'offer' ? 3 : 6}
                                       onClick={() => this.nextRoundModal(data.obj.submission_id)}>
                                Next Round
                            </Menu.Item> :
                            <Menu.Item key="7"
                                       onClick={() => this.feedbackModal(data.interview_id, data.obj.submission_id, i)}>
                                Change Interview Status
                            </Menu.Item> : null

                }

            </Menu>
        )
        const columns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant_name',
                key: 'consultant_name',
                width: '9%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Job Title',
                dataIndex: 'job_title',
                key: 'job_title',
                width: '5%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Vendor Company',
                dataIndex: 'vendor',
                key: 'vendor',
                width: '9%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Client Name',
                dataIndex: 'client',
                key: 'client',
                width: '9%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Marketer',
                dataIndex: 'marketer',
                key: 'marketer',
                width: '4%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Type',
                dataIndex: 'interview_mode',
                key: 'interview_mode',
                width: '5%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Round',
                dataIndex: 'round',
                key: 'round',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                           this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Call Supervisor',
                dataIndex: 'supervisor_name',
                key: 'supervisor_name',
                width: '10%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Schedule',
                dataIndex: 'start_end',
                key: 'start_end',
                width: '12%',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text}
                    </span>
                )
            },
            {
                title: 'Status',
                width: '5%',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => (
                    <span onClick={() => {
                        if (role.map(role=> role === "superadmin")) {
                            this.setInterviewData(record);
                        }

                    }}>
                        {text.charAt(0).toUpperCase() + text.slice(1)}
                    </span>
                )
            },
            {
                title: 'Actions',
                dataIndex: 'status',
                key: 'actions',
                width: '2%',
                render: (text, record, i) => (
                    record.project === null?
                        <Dropdown trigger={['click']} overlay={menu(text, record, record.project, i)}>
                            <MoreOutlined style={{marginLeft: 70}}/>
                        </Dropdown>
                        :null
                )
            }

        ];

        return (

            <div>
                <br/>
                <Row className="box" gutter={8}>

                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[0] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, '', 1, 10, this.state.t, this.state.query)}
                            title={
                                <span
                                    style={{color: this.state.flagArray[0] ? '#2688db' : null}}>
                                    {this.state.t === 0 ? '0' : this.state.t}</span>} bordered={false}>
                            Total
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[1] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'scheduled', 1, 10, this.state.scheduled, this.state.query)}
                            title={
                                <span
                                    style={{color: this.state.flagArray[1] ? '#2688db' : null}}>
                                    {this.state.scheduled === 0 ? '0' : this.state.scheduled}</span>} bordered={false}>
                            Scheduled
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[2] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'rescheduled', 1, 10, this.state.rescheduled, this.state.query)}
                            title={
                                <span
                                    style={{color: this.state.flagArray[2] ? '#2688db' : null}}>
                                    {this.state.rescheduled === 0 ? '0' : this.state.rescheduled}</span>}
                            bordered={false}>
                            Rescheduled
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[3] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'offer', 1, 10, this.state.passed, this.state.query)}
                            title={
                                <span
                                    style={{color: this.state.flagArray[3] ? '#2688db' : null}}>
                                    {this.state.passed === 0 ? '0' : this.state.passed}</span>} bordered={false}>
                            Passed
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[4] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'failed', 1, 10, this.state.failed, this.state.query)}
                            title={
                                <span
                                    style={{color: this.state.flagArray[4] ? '#2688db' : null}}>
                                    {this.state.failed === 0 ? '0' : this.state.failed}</span>}
                            bordered={false}>
                            Failed
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[5] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'feedback_due', 1, 10, this.state.feedback_due, this.state.query)}
                            title={ <span
                                style={{color: this.state.flagArray[5] ? '#2688db' : null}}>
                                {this.state.feedback_due === 0 ? '0' : this.state.feedback_due}</span>}
                            bordered={false}>
                            Feedback Due
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[6] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'cancelled', 1, 10, this.state.cancelled, this.state.query)}
                            title={ <span
                                style={{color: this.state.flagArray[6] ? '#2688db' : null}}>
                                {this.state.cancelled === 0 ? '0' : this.state.cancelled}</span>} bordered={false}>
                            Cancelled
                        </Card>
                    </Col>

                    <div className="leadsearch">
                        <Input.Search
                            placeholder="Search Consultant"
                            onChange={e => this.onSearch(e.target.value, 1, 10, this.state.filter_status, this.state.filter, this.state.my)}
                            onSearch={value => this.onSearch(value, 1, 10, this.state.filter_status, this.state.filter, this.state.my)}
                            style={{width: 200, zIndex: '0'}}
                        />
                    </div>

                </Row>
                <br/>
                <div className="mapbox submapbox">
                    <Radio.Group defaultValue="all" buttonStyle="solid" style={{}} onChange={this.onFilterChange}
                                 value={this.state.filter}>
                        <Radio.Button value="all">All</Radio.Button>
                        <Radio.Button value="today">Today</Radio.Button>
                        <Radio.Button value="week">Last Week</Radio.Button>
                        <Radio.Button value="month">Last Month</Radio.Button>
                    </Radio.Group>
                </div>

                <div style={{marginTop: '10px'}}>
                    {role.map(role=> role === "admin") ?
                        <Radio.Group
                            defaultValue="all"
                            onChange={(event) => {
                                this.setState({my: event.target.value, current_page: 1, curren_size: 10})
                                this.getMyInterview(this.state.filter, event.target.value, this.state.filter_status, 1, 10, this.state.query
                                )

                            }}
                            style={{
                                position: 'absolute',
                                top: 140,
                                left: 10,
                                borderWidth: 0,
                                borderColor: 'transparent'
                            }}
                            value={this.state.my}>
                            <Radio value="all">All</Radio>
                            <Radio value="my">My</Radio>
                            <Radio value="team">Team</Radio>

                        </Radio.Group> :
                        <div>
                            My Interview <Switch checked={this.state.intStatus} size="small" onChange={() => {
                            this.setState({intStatus: !this.state.intStatus})
                            if (!this.state.intStatus) {
                                this.setState({my: 'my', current_page: 1, curren_size: 10})
                                this.getMyInterview(this.state.filter, 'my', this.state.filter_status, 1, 10, this.state.query)
                            }
                            else {
                                this.setState({my: 'all', current_page: 1, curren_size: 10})
                                this.getMyInterview(this.state.filter, 'all', this.state.filter_status, 1, 10, this.state.query)
                            }


                        }}/>
                        </div>
                    }

                </div>

                <Button style={{marginRight: 20,marginTop: '50px',marginBottom: '10px'}} variant="light"
                        onClick={() =>{
                            if(!this.state.tzStatus){

                                this.setState({calendarPopup: true})
                            }
                            else{
                                message.error("Please change your system to EST timezone")

                            }

                        }
                        }> Show Calendar</Button>

                <br/>

                {this.state.loading && this.state.status === 200 ?
                    <div>
                        <Table
                            // rowSelection={rowSelection}
                            rowKey={record => record.interview_id.toString()}
                            columns={columns}
                            dataSource={this.state.interviewData}
                            pagination={false}
                            className="inte_new"
                        />
                        <br/>
                        <div className="rightpagination">
                            <Pagination
                                showSizeChanger
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onPageChange}
                                style={{float: "right"}}
                                current={this.state.current_page}
                                total={this.state.total}
                                pageSize={this.state.current_size}
                            />
                        </div>
                        {(this.state.calendarPopup) &&
                        <Drawer
                            title="Interview Calendar"
                            width={1300}
                            className="calender_popup"
                            onClose={this.closeModal}
                            visible={this.state.calendarPopup}
                        >
                            <CalendarComponent submissionId={this.state.submission_id} setInterviewTab={this.props.setInterviewTab} create={false} path={false}
                                               handleClose={this.closeModal}/>
                        </Drawer>
                        }{this.state.po &&

                    <Drawer
                        title="Create Project"
                        width={380}
                        onClose={this.closeModal}
                        visible={this.state.po}
                    >
                        <AddProject submissionId={this.state.submission_id}
                                    handleClose={this.closeModal}/>
                    </Drawer>
                    }
                        {(this.state.view) &&
                        <Drawer
                            title={null}
                            closable={false}
                            width={1220}
                            onClose={this.closeModal}
                            visible={this.state.view}
                        >
                            <DetailTabView
                                handleSelect={this.handleSelect}
                                sub_id={this.state.submission_id}
                                currentKey={this.state.selectedIndex}
                                round={this.state.round}/>
                        </Drawer>
                        }
                        {this.state.nextRoundFlag &&
                        <Drawer
                            title="Schedule Interview"
                            width="100%"
                            onClose={this.closeModal}
                            visible={this.state.nextRoundFlag}
                        >
                            <CalendarComponent
                                create={true}
                                submissionId={this.state.submission_id}
                                path={true}
                                setInterviewTab={this.props.setInterviewTab}
                                handleClose={this.closeModal}/>
                        </Drawer>
                        }
                        {this.state.feedbackFlag &&
                    <Drawer
                        title="Add Feedback"
                        width={320}
                        onClose={this.closeModal}
                        visible={this.state.feedbackFlag}
                    >
                        <InterviewFeedback

                        onChange={this.onChange}
                            handleChange={this.handleChange}
                            confirmNext={this.confirmNext}
                            confirm={this.confirm}

                            showDeleteConfirm={this.showDeleteConfirm}
                            interview_id={this.state.interview_id}
                            feedbackStatus={this.state.feedbackStatus}
                            feedback_description={this.state.feedback_description}
                        />

                    </Drawer>
                    }
                    </div>

                    : <Spin style={{alignItems: 'center'}} tip="Loading..." size="large"/>}



            </div>


        );

    }

}

export default Interview;
