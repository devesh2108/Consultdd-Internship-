import React, {Component} from 'react';
import {
    Select,Input,Button,message,DatePicker
} from 'antd';
import {updatePO,} from "../../services/service";
import moment from 'moment-timezone'
const {TextArea} = Input;
export default class PoTerminate extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reasons: [
                {id:0,
                    name:'Client fired',
                    value:'client-fired-'
                },
                {id:1,
                    name:'Resigned',
                    value:'resigned-'
                },
                {id:2,
                    name:'Completed',
                    value:'completed'
                },
                {id:3,
                    name:'Extension',
                    value:'extension'
                },
            ],
            reason:'',
            client_fired_types: [
                {
                    name: 'Performance',
                    value: 'performance'
                },
                {
                    name: 'Budget issue',
                    value: 'budget'
                },
                {
                    name: 'Data security issues',
                    value: 'security'
                },
                {
                    name: 'Other',
                    value: 'other'
                },
            ],
           resigned_types: [
                {
                    name: 'Rate',
                    value: 'rate'
                },
                {
                    name: 'Technology',
                    value: 'technology'
                },
                {
                    name: 'Got full time',
                    value: 'full_time'
                },
               {
                    name: 'Location',
                    value: 'location'
                },
            ],
            type:'',
            feedback:'',
            end_date:''
        };
        this.onReasonChange = this.onReasonChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onEndateChange = this.onEndateChange.bind(this);
        this.editPO = this.editPO.bind(this);

    }

    componentDidMount() {

    }
    onReasonChange(value) {
        console.log(value)
        if (value !== undefined) {
            this.setState({
                reason: value
            })
        }
        else{
            this.setState({
                reason: ''
            })
        }
    }
    onTypeChange(value) {
        console.log(value)
        if (value !== undefined) {
            this.setState({
                type: value
            })
        }else{
            this.setState({
                type: ''
            })
        }
    }
    editPO() {

        const body = {
            "status": this.state.reason+this.state.type,
            "feedback":this.state.feedback,
            "end_date":moment(this.state.end_date).format("YYYY-MM-DD")

        }
        console.log(body)
        if(this.state.reason!== '' && this.state.end_date) {
            updatePO(body, this.props.poId)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    if (status !== 202) {
                        message.error("Something Went Wrong.")
                    }
                    else {
                        message.success("PO Updated.")
                        //this.props.checklistStatus(res.result.check_list, res.result.id)
                        //this.props.onUpdateChange(res.result, res.result.id)
                        this.props.handleClose();

                    }

                })
                .catch(error => {
                    console.log(error)
                });
        }
        else{
            message.error("Select a reason and project termination date.")
        }
    }
    onEndateChange = (value) => {
        this.setState({end_date: value})
    };

    render() {

        return (
            <div className="poselect2">
                <label> Reason:</label>
                <Select
                    showSearch
                    allowClear
                    style={{width: '50%'}}
                    placeholder="Reason"
                    optionFilterProp="children"
                    onChange={(e) => {
                        this.onReasonChange(e);
                    }}
                >
                    {this.state.reasons.map((item, i) => (
                        <Select.Option key={item.id} value={item.value}>{item.name}</Select.Option>
                    ))}
                </Select>
                <span>
                    <label>  Project End Date: </label>
                    <br/>
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={this.state.end_date}
                        placeholder="Project End Date"
                        onChange={this.onEndateChange}
                    />
                </span>
                {this.state.reason === 'client-fired-' ?
                 <div>Sub-type: <Select
                        showSearch
                        allowClear
                        style={{width: '50%'}}
                        placeholder="Type"
                        optionFilterProp="children"
                        onChange={(e) => {
                            this.onTypeChange(e);
                        }}
                    >
                        {this.state.client_fired_types.map((item, i) => (
                            <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                        ))}
                    </Select>
                 </div>:null
                }
                {this.state.reason === 'resigned-' ?
                    <div>
                    <label> Sub-type:  </label>
                        <Select
                        showSearch
                        allowClear
                        style={{width: '50%'}}
                        placeholder="Type"
                        optionFilterProp="children"
                        onChange={(e) => {
                            this.onTypeChange(e);
                        }}
                    >
                        {this.state.resigned_types.map((item, i) => (
                            <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                        ))}
                    </Select>
                    </div>:null
                }
                <br/>
                Comments:
                <TextArea
                    onChange={(e) => this.setState({feedback: e.target.value})}
                    autosize={{minRows: 5, maxRows: 10}}/>
                <Button key="back" onClick={this.props.handleClose}>
                    Return
                </Button>
                <Button key="submit" type="primary" style={{ display: this.state.displayButton, float: "right" }} onClick={this.editPO}>
                    Submit
                </Button>
            </div>

        )

    }
}
