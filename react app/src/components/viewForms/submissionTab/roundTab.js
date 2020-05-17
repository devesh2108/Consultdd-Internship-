import React, {Component} from 'react';
import "../../../App.css";
import {Button, Drawer, Form, Input, Select, Spin, Tag, Tooltip} from "antd";
import {EditOutlined,ScheduleOutlined,InfoCircleOutlined,SolutionOutlined} from "@ant-design/icons"
import moment from "moment-timezone";
import DateRangePicker from "../../DateRangePicker";
import InterviewFeedback from "./InterviewFeedback";

class RoundTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_time: "",
            end_time: "",
        }
    }

    componentDidMount() {
        this.setState({
            start_time: this.props.start_time,
            end_time: this.props.end_time,
        });

        console.log(this.state.start_time, "start")
    }

    onOk = (start, end,) => {
        console.log("round tab---", start, end)
        this.setState({
            start_time: start,
            end_time: end,
        }, () => {
            this.props.onOk(this.state.start_time, this.state.end_time)
        });
    };

    render() {
        return (

            <div>
                {this.props.is_active && (this.props.interview_status === "scheduled" || this.props.interview_status === "rescheduled") &&
                <div>
                    <EditOutlined onClick={this.props.setEdit}/>
                    <ScheduleOutlined onClick={this.props.setReschedule}/>
                </div>
                }
                {this.props.edit ?
                    <div className="viewsubform mainviewsubform">

                        <Form layout='vertical'>

                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <Form.Item label="Type">

                                    <Select
                                        className="form-control" name="type" onChange={this.props.handleSelect}
                                        value={this.props.type}>
                                        {this.props.INTERVIEW_MODES.map((mode, index) =>
                                            <Select.Option value={mode.key}>{mode.value}</Select.Option>
                                        )
                                        }


                                    </Select>

                                </Form.Item>
                                <Form.Item label="Start Time">
                                    {moment(this.props.start_time).tz("America/Toronto").format("YYYY-MM-DD T HH:mm")}
                                </Form.Item>
                                <Form.Item label="End Time">
                                    {moment(this.props.end_time).tz("America/Toronto").format("YYYY-MM-DD T HH:mm")}
                                </Form.Item>


                                <Form.Item label="Call taken by:">

                                    <Select
                                        showSearch
                                        value={this.props.supervisor}
                                        placeholder="Select users"
                                        onSearch={this.props.getSupervisorSuggestions}
                                        onChange={this.props.handleSupervisorInputChange}
                                        style={{width: '100%', height: '30px'}}
                                    >
                                        {this.props.supervisorList.map(d => <Select.Option
                                            key={d.name + "," + d.id}>{d.name}</Select.Option>)}
                                    </Select>

                                </Form.Item>
                                <Form.Item label=" Dialing Details">

                                    <Input
                                        onChange={this.props.handleChange} style={{width: '100%'}}
                                        name="dialing_details"
                                        value={this.props.dialing_details}/>

                                </Form.Item>
                                <Form.Item label="Additional Info">

                                    <Input
                                        onChange={this.props.handleChange} style={{width: '100%'}}
                                        name="description"
                                        value={this.props.description}/>

                                </Form.Item>

                                <Form.Item label="Guest">

                                    <Select
                                        mode="multiple"
                                        labelInValue
                                        value={this.props.value}
                                        placeholder="Select users"
                                        notFoundContent={this.props.fetching ? <Spin size="small"/> : null}
                                        filterOption={false}
                                        onSearch={this.props.fetchGuestList}
                                        onChange={this.props.handleChangeSelect}
                                        style={{width: '100%', height: '30px'}}
                                    >
                                        {this.props.data.map(d => <Select.Option
                                            key={d.value}>{d.text}</Select.Option>)}
                                    </Select>

                                </Form.Item>

                                <Form.Item label="Attachment Link">

                                    <Input onChange={this.props.handleChange} style={{width: '100%'}} name="link"
                                           value={this.props.link}/>

                                </Form.Item>


                            </div>

                            <br clear="all"/>

                            <div className="inviewbutton">

                                <Button onClick={this.props.handleClose}>Cancel</Button>
                                <Button onClick={this.props.editInterview}>Submit</Button>
                            </div>

                        </Form>

                    </div>
                    :
                    this.props.reschedule ?
                        <div>
                            <Form.Item label="Type">
                                {this.props.type}
                            </Form.Item>
                            {
                                this.props.tzStatus ?
                                    <div>
                                        <Tooltip title="Please change your system timezone to EST">
                                            <InfoCircleOutlined style={{fontSize: "20px", color: "#ce2304"}}/>
                                        </Tooltip>
                                        {/*<Tooltip title="Please change your system timezone to EST and then reload">*/}
                                        {/*<Icon type="reload" style={{fontSize: "20px", color: "#009922"}} />*/}
                                        {/*</Tooltip>*/}
                                    </div>
                                    :
                                    null
                            }
                            <DateRangePicker
                                disabled={this.props.tzStatus}
                                start_time={this.state.start_time}
                                end_time={this.state.end_time}
                                onOk={this.onOk}/>
                            <Form.Item label="Call Taken By">
                                {this.props.supervisor}
                            </Form.Item>
                            <Form.Item label="Dialing Details">
                                {this.props.dialing_details !== "" ? "There is no Dailing Information" : this.props.dialing_details}
                            </Form.Item>
                            <Form.Item label="Additional Info">
                                {this.props.description !== "" ? "There is no Additional Info" : this.props.description}
                            </Form.Item>
                            <Form.Item label="Guest">
                                <ul>{this.props.data.map((user, index) => <li> {user.text}</li>)}</ul>
                            </Form.Item>
                            <div className="inviewbutton">

                                <Button onClick={this.props.handleClose}>Cancel</Button>
                                <Button onClick={this.props.editInterview}>Submit</Button>
                            </div>
                        </div>
                        :
                        <div>
                            <Form.Item label="Type">
                                {this.props.type}
                            </Form.Item>
                            <Form.Item label="Start Time">
                                {moment(this.props.start_time).tz("America/Toronto").format("YYYY-MM-DD T HH:mm")}
                            </Form.Item>
                            <Form.Item label="End Time">
                                {moment(this.props.end_time).tz("America/Toronto").format("YYYY-MM-DD T HH:mm")}
                            </Form.Item>
                            <Form.Item label="Call Taken By">
                                {this.props.supervisor}
                            </Form.Item>
                            <Form.Item label="Dialing Details">
                                {this.props.dialing_details !== "" ? "There is no Dailing Information" : this.props.dialing_details}
                            </Form.Item>
                            <Form.Item label="Additional Info">
                                {this.props.description !== "" ? "There is no Additional Info" : this.props.description}
                            </Form.Item>
                            <Form.Item label="Feedback">
                                {this.props.feedback !== "" ? "There is no Feedback available" : this.props.feedback}
                            </Form.Item>
                            <Form.Item label="Guest">
                                <ul>{this.props.data.map((user, index) => <li> {user.text}</li>)}</ul>
                            </Form.Item>
                        </div>

                }
                { this.props.is_active && (this.props.interview_status === "feedback_due" )&&
                <Tag
                    style={{
                        background: "green",
                        borderColor: "#1cb309",
                        borderStyle: "dashed",
                        width: '20%',
                        color: "#fff"
                    }}
                    onClick={this.props.setFeedbackStatus}
                >


                    <SolutionOutlined
                        variant="outlined" color="secondary" style={{
                        backgroundColor: "green",
                        color: 'white',
                        fontSize: 22
                    }}/><span
                    style={{marginTop: '5px'}}>Add Feedback</span>
                </Tag>
                }
                {this.props.feedbackFlag &&
                <Drawer
                    title="Add Feedback"
                    width={320}
                    onClose={this.props.unsetFeedbackStatus}
                    visible={this.props.feedbackFlag}
                >
                    <InterviewFeedback
                        onChange={this.props.onChange}
                        handleChange={this.props.handleChange}
                        confirmNext={this.props.confirmNext}
                        confirm={this.props.confirm}
                        interview_id={this.props.interview_id}
                        feedbackStatus={this.props.feedbackStatus}
                        feedback_description={this.props.feedback_description}
                    />

                </Drawer>
                }
            </div>

        )
    }
}

export default RoundTab;
