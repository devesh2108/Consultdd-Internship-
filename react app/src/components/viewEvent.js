import React, {Component} from 'react';
import {fetchGuestList, getEmployeeSuggestion, getInterviewByScreeningId,getInterviewByCalendarId, updateScreening} from "../services/service";
import {Button, Form, Input, Spin,Select,antd,message,Alert} from "antd";
import DateRangePicker from "./DateRangePicker";
import moment from "moment-timezone";
import ViewCalendarEvents from "./ViewCalendarEvents";

const {TextArea} = Input;

class Interview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submission: '', //sub_id
            ctb: '', // user_id
            type: '', //"telephonic",
            timezone: '',
            start_date: '', //"2019-04-10T06:30:00.302650Z" // for now ==== >>> 2019-04-21 12:00:00
            end_date: '', //"2019-04-10T07:00:00.302650Z"
            round: 1,
            supervisor: '',
            ctbList: [],
            interview_id: 0,
            job_desc: '',
            location: '',
            job_title: '',
            client: '',
            consultant_name: '',
            employer: '',
            rate: '',
            resume: null,
            vendor_company: '',
            vendor_name: '',
            vendor_contact: '',
            vendor_email: '',
            status: 0,
            marketer: '',
            description: '',
            guest: [],
            fetching: false,
            data: [],
            value: [],
            link: '',
            file: [],
            largeFile: false,
            calendar_id: '',
            submission_id: 0,
            dialing_details: '',
            ctb_id: 0,
            interview_status: false,
            tzDate: new Date(),
            tz:0,
            flag:false,
            tzStatus: false

        };
        this.handleChange = this.handleChange.bind(this);
        this.onDatePick = this.onDatePick.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.fetchGuestList = this.fetchGuestList.bind(this);
        this.editInterview = this.editInterview.bind(this);
        this.handleCtbInputChange = this.handleCtbInputChange.bind(this);
        this.getCtbSuggestions = this.getCtbSuggestions.bind(this);

    }

    componentDidMount() {
        this.getCtbSuggestions()
        var tz= this.state.tzDate.getTimezoneOffset();
        if (tz === 240) {
            console.log("if",tz)
            this.setState({tzStatus: false})
        }
        else{
            console.log("else",tz)
            this.setState({tzStatus: true})
        }
        console.log(tz,"---viewevent------------tz---------")
        console.log(this.props.edit,"---viewevent------------create---------")
        this.setState({
            tz:tz
        })
        if (this.props.interview_details.results.submission.vendor_contact === null) {
            this.setState({
                vendor_name: 'Hidden',
                vendor_company: this.props.interview_details.results.submission.lead.vendor_company_name,
                vendor_contact: 'Hidden',
                vendor_email: 'Hidden',
            })
        } else {
            this.setState({
                vendor_name: this.props.interview_details.results.submission.vendor_contact.name,
                vendor_company: this.props.interview_details.results.submission.lead.vendor_company_name,
                vendor_contact: this.props.interview_details.results.submission.vendor_contact.number,
                vendor_email: this.props.interview_details.results.submission.vendor_contact.email,
            })

        }
        const data = this.props.interview_details.results.guest.map(user => ({
            text: `${user.full_name}`,
            value: user.id,
        }));
        const value = this.props.interview_details.results.guest.map(user => ({
            label: `${user.full_name}`,
            key: user.id,
        }));


        this.setState({
            disabled:this.props.viewAdmin,
            interview_status: this.props.interview_details.results.status === "scheduled" || this.props.interview_details.results.status === "rescheduled" || this.props.viewAdmin,
            type: this.props.interview_details.results.type,
            calendar_id: this.props.interview_details.results.calendar_id,
            interview_id: this.props.interview_details.results.id,
            submission_id: this.props.interview_details.results.submission.id,
            location: this.props.interview_details.results.submission.lead.location,
            job_desc: this.props.interview_details.results.submission.lead.job_desc,
            job_title: this.props.interview_details.results.submission.lead.job_title,
            client: this.props.interview_details.results.submission.client,
            consultant_name: this.props.interview_details.results.submission.consultant.name,
            marketer: this.props.interview_details.results.submission.lead.marketer,
            rate: this.props.interview_details.results.submission.rate,
            start_date:  moment(this.props.interview_details.results.start_time).add(4,'hours').tz("America/Toronto"),
            end_date: moment(this.props.interview_details.results.end_time).add(4,'hours').tz("America/Toronto"),
            ctb: this.props.interview_details.results.ctb.full_name,
            ctb_id: this.props.interview_details.results.ctb.id,
            round: this.props.interview_details.results.round,
            description: this.props.interview_details.results.description,
            dialing_details: this.props.interview_details.results.call_details,
            data: data,
            value: value,
            fetching: false,
            link: '',
            status: true,

            // vendor_name: '',
            // vendor_company: this.props.submission_details.results.lead.vendor,
            // vendor_contact: '',
            // vendor_email: '',
        });


    }

    fetchGuestList(params) {
        this.setState({fetching: true});
        fetchGuestList(params)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res.results)
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
        this.setState({
            value,
            data: [],
            fetching: false,
        });
        console.log(value)
    }

    getCtbSuggestions() {
        getEmployeeSuggestion(this.state.ctb, 'interview')
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    ctbList: res.results,
                    error: res.error || null,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    handleCtbInputChange(value) {
        this.setState({
            ctb: value.split(",")[0],
            ctb_id: value.split(",")[1],
        })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onDatePick(start, end,flag) {
        this.setState({
            start_date: start,
            end_date: end,
            flag:flag
        })
    }

    handleChangeFile(event) {
        if (!this.state.largeFile) {
            this.state.file.push(event.fileList)
        }

        // this.state.file.append("file", event.target.files[0]);
    }

    fileUpload(file, id) {
        const body = {
            "obj_type": "screening",
            "object_id": id,
            "attachment_type": "interview document",
            "file": file
        }
    }

    editInterview() {
        let startTime=moment(this.state.start_date).tz("America/Toronto").format("YYYY-MM-DDTHH:mm")
        let endTime=moment(this.state.end_date).tz("America/Toronto").format("YYYY-MM-DDTHH:mm")
        this.state.value.map((item, i) => (
            this.state.guest.push(parseInt(item.key))
        ))
        const body = {
            "event_id": this.props.interview_details.results.calendar_id,
            "screening_id": this.props.interview_details.results.id,
            "submission": this.props.interview_details.results.submission.id,
            "ctb": this.state.ctb_id,
            "type": this.state.type,
            "description": this.state.description,
            "start_time": startTime,
            "end_time": endTime,
            "guest": this.state.guest,
            "call_details": this.state.dialing_details
        }
        console.log(body)
        updateScreening(this.props.interview_details.results.id,body,false)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
            if(status !== 202){
                message.error("Something went wrong.")
            }
            else{
                message.success("Interview Updated.")
                this.props.onUpdateChange(res.result.id, res.result)
                this.props.handleClose()
            }


            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const {fetching, data, value} = this.state;

        return (
            <div>
                {/*<div dangerouslySetInnerHTML={{__html:this.props.interview.description}}/>*/}
                {this.state.status ?
                    this.state.tzStatus ?
                        <Alert
                            message="Please Change your system time to EST and reload the website."
                            type="error"
                            closable
                            onClose={this.props.handleClose}
                        />:
                    <div>
                        <div className="viewsubform mainviewsubform">

                            <Form layout='vertical'>

                                <div className="col-md-6 col-sm-6 col-xs-12">

                                    <Form.Item label="Job Description">

                                    <TextArea className="editTextArea" disabled={true} style={{width: '100%'}}
                                              autosize={{minRows: 10, maxRows: 25}} value={this.state.job_desc}/>

                                    </Form.Item>
                                    <Form.Item label="Job Title">

                                        <Input disabled={true} style={{width: '100%'}}
                                               value={this.state.job_title}/>

                                    </Form.Item>
                                    <Form.Item label="Job Location">

                                        <Input disabled={true} style={{width: '100%'}}
                                               value={this.state.location}/>

                                    </Form.Item>
                                    {/*<Form.Item label="Consultant">*/}

                                        {/*<Input disabled={true} style={{width: '100%'}}*/}
                                               {/*value={this.state.consultant_name}/>*/}

                                    {/*</Form.Item>*/}
                                    <Form.Item label="Client">

                                        <Input disabled={true} style={{width: '100%'}}
                                               value={this.state.client}/>

                                    </Form.Item>
                                    <Form.Item label="Marketer">

                                        <Input disabled={true} style={{width: '100%'}}
                                               value={this.state.marketer}/>

                                    </Form.Item>

                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <Form.Item label="Type">

                                        <select disabled={this.state.disabled || !this.props.edit} className="form-control" name="type" onChange={this.handleChange}
                                                value={this.state.type}>
                                            <option value="video_call">Video Call</option>
                                            <option value="telephonic">Voice Call</option>
                                            <option value="skype">Skype</option>
                                            <option value="webex">Webex</option>

                                        </select>

                                    </Form.Item>
                                    <DateRangePicker tz={this.state.tz} create={this.props.create}  disabled={this.props.edit || this.state.disabled} startDate={(this.state.start_date)}
                                                     endDate={(this.state.end_date)}
                                                     onOk={this.onDatePick}/>

                                    <Form.Item
                                        label="Call taken by:"
                                    >

                                        <Select
                                            disabled={!this.state.interview_status}
                                            showSearch
                                            value={this.state.ctb}
                                            placeholder="Select users"
                                            onSearch={this.getCtbSuggestions}
                                            onChange={this.handleCtbInputChange}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {this.state.ctbList.map(d => <Select.Option
                                                key={d.name + "," + d.id}>{d.name}</Select.Option>)}
                                        </Select>

                                    </Form.Item>
                                    <Form.Item label=" Dialing Details">

                                        <Input disabled={this.state.disabled || !this.props.edit} onChange={this.handleChange} style={{width: '100%'}}
                                               name="dialing_details"
                                               value={this.state.dialing_details}/>

                                    </Form.Item>
                                    <Form.Item label="Additional Info">

                                        <Input disabled={this.state.disabled || !this.props.edit} onChange={this.handleChange} style={{width: '100%'}} name="description"
                                               value={this.state.description}/>

                                    </Form.Item>

                                    <Form.Item label="Guest">

                                        <Select
                                            disabled={this.state.disabled || !this.props.edit}
                                            mode="multiple"
                                            labelInValue
                                            value={value}
                                            placeholder="Select users"
                                            notFoundContent={fetching ? <Spin size="small"/> : null}
                                            filterOption={false}
                                            onSearch={this.fetchGuestList}
                                            onChange={this.handleChangeSelect}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                                        </Select>

                                    </Form.Item>

                                    <Form.Item label="Attachment Link">

                                        <Input disabled={this.state.disabled || !this.props.edit} onChange={this.handleChange} style={{width: '100%'}} name="link"
                                               value={this.state.link}/>

                                    </Form.Item>

                                    {/*<Form.Item label="Upload files">*/}
                                    {/*<Upload*/}
                                    {/*multiple*/}
                                    {/*action={(file)=>this.fileUpload(file,this.state.interview_id)}*/}
                                    {/*name="file"*/}
                                    {/*onChange={this.handleChangeFile}*/}
                                    {/*beforeUpload={(fileList) => {*/}
                                    {/*if (fileList.size > 3072000) {*/}
                                    {/*alert("Too big file")*/}
                                    {/*this.setState({largeFile: true})*/}
                                    {/*}*/}
                                    {/*else {*/}
                                    {/*this.setState({largeFile: false})*/}
                                    {/*}*/}
                                    {/*}}>*/}
                                    {/*<Button>*/}
                                    {/*<Icon type="upload"/> Click to upload*/}
                                    {/*</Button>*/}
                                    {/*</Upload>*/}

                                    {/*</Form.Item>*/}

                                </div>

                                <br clear="all"/>

                                <div className="inviewbutton">

                                    <Button disabled={this.state.disabled} onClick={this.props.handleClose}>Cancel</Button>
                                    <Button disabled={this.state.disabled} onClick={this.editInterview}>Submit</Button>
                                </div>

                            </Form>

                        </div>
                    </div>
                    : <div>Loading....</div>
                }
            </div>


        );

    }
}

const ViewInterviewForm = Form.create({name: 'view_interview'})(Interview);

export default class ViewInterview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            interview_details: {},
            status: null
        }
        console.log(this.props.interview)
        this.getInterviewDetails = this.getInterviewDetails.bind(this);

    }

    componentDidMount() {
        if (this.props.type === "screening") {
            this.getInterviewDetails(this.props.interviewId)
        }
        else {
            this.getInterviewCalendarDetails(this.props.interviewId)
        }
    }

    getInterviewDetails(id) {
        getInterviewByScreeningId(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({interview_details: res, status: status})

            })
            .catch(error => {
                console.log(error)
            });
    }
    getInterviewCalendarDetails(id) {
        getInterviewByCalendarId(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({interview_details: res, status: status})

            })
            .catch(error => {
                console.log(error)
            });
    }


    render() {
console.log("viewEvevnt ",this.props.create)
        return (
            this.state.status === 200 ?
                <ViewInterviewForm
                    edit={this.props.edit}
                    viewAdmin={this.props.viewAdmin}
                    ctbArray={this.props.ctbArray}
                    onUpdateChange={this.props.onUpdateChange}
                    interview_details={this.state.interview_details}
                    create={this.props.create}
                    handleClose={this.props.handleClose}/>
                :
                this.state.status === 400 || this.state.status === 404 ?
                    <ViewCalendarEvents   create={this.props.create} interview={this.props.interview}/> : null
        )

    }
}
