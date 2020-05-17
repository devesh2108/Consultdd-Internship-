import React, {Component} from 'react';
import {
     Select,Input,Button,message
} from 'antd';
import {updatePO,} from "../../services/service";
const {TextArea} = Input;
export default class PoCancel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reasons: [
                {id:0,
                    name:'Client cancelled',
                    value:'client-cancelled',
                },
                {id:1,
                    name:'Candidate absconded',
                    value:'candidate-absconded',
                },
                {id:2,
                    name:'Candidate denied joining',
                    value:'candidate-denied-',
                },
                {id:3,
                    name:'Contract conflicts',
                    value:'contract-conflicts',
                },
                {id:4,
                    name:'Other',
                    value:'other'
                },
                {id:5,
                    name:'Dual Offer',
                    value:'dual-offer',
                },
              ],
            reason:'',
            types: [
                {
                    name: 'Rate',
                    value: 'rate'
                },
                {
                    name: 'Location',
                    value: 'location'
                },
                {
                    name: 'Job Description',
                    value: 'jd'
                },
            ],
            type:'',
            feedback:''
        };
        this.onReasonChange = this.onReasonChange.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.editPO = this.editPO.bind(this);

    }

    editPO() {

        const body = {
            "status": this.state.reason+this.state.type,
            "feedback":this.state.feedback

        }
        console.log(body)
        if(this.state.reason!== '') {
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
        }else{
            message.error("Select a reason")
        }
        }

    onReasonChange(value) {
        if (value !== undefined) {
            this.setState({
                reason: value
            })
        }
    }
    onTypeChange(value) {
        if (value !== undefined) {
            this.setState({
                type: value
            })
        }
    }

    render() {

        return (
            <div className="poselect">
               Reason: <Select
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
                {this.state.reason === 'candidate-denied-' ?
                    <Select
                        showSearch
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Type"
                        optionFilterProp="children"
                        onChange={(e) => {
                            this.onTypeChange(e);
                        }}
                    >
                        {this.state.types.map((item, i) => (
                            <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                        ))}
                    </Select>:null
                }
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
