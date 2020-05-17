import React, {Component} from 'react';
import DateRangePicker from "../DateRangePicker";
import Button from "@material-ui/core/Button";
import {createEvent, fetchGuestList, getEmployeeSuggestion,getIntSuggestions} from "../../services/service";
import {Input, Select, Spin, Form, message, Alert, Drawer} from 'antd';
import moment from 'moment-timezone';
import {findFirstSundayNov, findSecondSundayMar} from "../../functions/dstConverter";
import InterviewSuggestions from "../suggestions/InterviewSuggestions";

const {TextArea} = Input;



class EventDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submission: '', //sub_id
            ctb: '', // user_id
            type: 'voice_call', //"telephonic",
            timezone: '',
            start: this.props.startDate, //"2019-04-10T06:30:00.302650Z" // for now ==== >>> 2019-04-21 12:00:00
            end: this.props.endDate, //"2019-04-10T07:00:00.302650Z"
            round: 1,
            supervisor: '',
            ctbList: [],
            data: [],
            value: [],
            guest: [],
            fetching: false,
            summary: '',
            description: '',
            screening: new FormData(),
            callingDetails: '',
            status: null,
            tzDate: new Date(),
            tz: 0,
            flag: false,
            tzStatus: false,
            intSuggestionList:[],
           intSuggestion:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDatePick = this.onDatePick.bind(this);
        this.handleCtbInputChange = this.handleCtbInputChange.bind(this);
        this.getCtbSuggestions = this.getCtbSuggestions.bind(this);
        this.fetchGuestList = this.fetchGuestList.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

    }


    componentWillMount() {
        var tz = this.state.tzDate.getTimezoneOffset();
        let startOfEST;
        let endOfEST;
        endOfEST = findFirstSundayNov(new Date())
        startOfEST = findSecondSundayMar(new Date())
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
        this.getCtbSuggestions()

    }

    handleChange(event) {

        this.setState({[event.target.name]: event.target.value});
    }

    onDatePick(start, end, flag) {

        this.setState({
            start: start,
            end: end,
            flag: flag
        })
    }

    getCtbSuggestions() {


        fetchGuestList("")
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
                if (this.props.ctbArray.length === 1) {

                    this.state.ctbList.map((item, i) => {
                        if (item.email === this.props.ctbArray[0]) {
                            this.setState({
                                ctb: item.name,
                                ctb_id: item.id
                            },()=>this.getIntSuggestions(this.props.submissionId,item.id))
                        }
                    })
                }
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
    getIntSuggestions(sub_id,ctb_id){
        getIntSuggestions(sub_id,ctb_id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                this.setState({
                    intSuggestionList: res.result,

                });

            })
            .catch(error => {
           console.log(error)
            });
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
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        let startTime = moment(this.state.start).tz("America/Toronto")
        let endTime = moment(this.state.end).tz("America/Toronto")

        this.state.value.map((item, i) => (
            this.state.guest.push(parseInt(item.key))
        ))
        const body = {
            "submission": this.props.submissionId,
            "supervisor": this.state.ctb_id,
            "interview_mode": this.state.type,
            "screening_type": 'interview',
            "description": this.state.description,
            "start_time": moment(startTime).format("YYYY-MM-DDTHH:mm:ss"),
            "end_time": moment(endTime).format("YYYY-MM-DDTHH:mm:ss"),
            "guest": this.state.guest,
            "call_details": this.state.callingDetails
        };
        console.log(body)
        if (this.state.ctb_id && moment(startTime) && moment(endTime)) {
            createEvent(body)
                .then((response) => {
                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    if (status === 201) {
                        message.success("Interview Scheduled.")
                        this.props.handleClose();
                        //xthis.props.setInterviewTab();
                    }
                    else {
                        message.error('Something went wrong.')
                    }


                })
                .catch(error => {
                    console.log(error)
                });
        }
        else {
            message.error("Select all the required fields")
        }


    }


    handleChangeFile(event) {
        this.setState({screening: ''})
        this.state.screening.append("file", event.target.files[0]);
    }
    handleClose =()=>{
        this.setState({
            intSuggestion : false
        })
    }

    openSuggestionBox =()=>{
        this.setState({
            intSuggestion : true
        })
    }

    render() {
        const {fetching, data, value} = this.state;
        return (
                <div>
                    {this.state.tzStatus ?
                    <Alert
                        message="Please Change your system time to EST and reload the website."
                        type="error"
                        closable
                        onClose={this.props.handleClose}
                    />:

                        <form className="interviewform" onSubmit={this.handleSubmit}>

                        <div className="col-md-6 col-sm-6 col-xs-12">

                        <div className="">

                        <Form.Item
                        label="Type:"
                        >
                        <select className="form-control" value={this.state.type} name="type"
                        onChange={this.handleChange}>
                        <option value="voice_call">Voice Call</option>
                        <option value="video_call">Video Call</option>
                        <option value="dial_in">Dial In</option>
                        <option value="hangouts">Hangouts</option>
                        <option value="skype">Skype</option>
                        <option value="webex">Webex</option>

                        </select>

                        </Form.Item>
                        <Form.Item label="Calling Details">

                        <Input onChange={this.handleChange} name="callingDetails"
                        value={this.state.callingDetails} style={{width: '100%'}}/>
                        </Form.Item>


                        <label>Guest:</label>
                        <Select
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

                        <br/>
                        <br/>


                        <DateRangePicker tz={this.state.tz} create={this.props.create}
                                         start_time={moment(this.props.startDate).tz("America/Toronto")}
                                         end_time={moment(this.props.endDate).tz("America/Toronto")}
                        onOk={this.onDatePick}/>


                        <br/>

                        </div>

                        </div>


                        <div className="col-md-6 col-sm-6 col-xs-12">

                        <div className="">
                        <label><span style={{color: 'red', fontSize: 9}}>*</span> Supervisor:</label>

                        <Select
                        value={this.state.ctb}
                        placeholder="Select users"
                        onSearch={this.getCtbSuggestions}
                        onChange={this.handleCtbInputChange}
                        style={{width: '100%', height: '30px'}}
                        >
                        {this.state.ctbList.map(d => <Select.Option
                            key={d.name + "," + d.id}>{d.name}</Select.Option>)}
                        </Select>


                        <Form.Item label="Additional Info">

                        <TextArea name="description" value={this.state.description}
                        onChange={this.handleChange} style={{width: '100%'}}
                        autosize={{minRows: 4, maxRows: 25}}/>

                        </Form.Item>

                        </div>

                        </div>
                            {
                                this.state.intSuggestionList.length === 0 ? null :


                                    <Button  style={{color: 'blue', background: 'white' , marginTop:'20px'}} onClick={this.openSuggestionBox}>Suggestions</Button>

                            }

                        <div className="formbutoon">
                        <Button onClick={this.props.handleClose} color="primary">
                        Cancel
                        </Button>
                        <input className="submitbutton" type="submit" value="Submit"/>
                        </div>
                            {
                                this.state.intSuggestion &&
                                <Drawer
                                    title="View Interview Suggestions"
                                    width={320}
                                    onClose={this.handleClose}
                                    visible={this.state.intSuggestion}
                                >
                                    <InterviewSuggestions
                                        suggestions={this.state.intSuggestionList}
                                        handleClose={this.handleClose}
                                    />


                                </Drawer>
                            }
                        </form>
                    }

                </div>


        );
    }
}

export default EventDialog
