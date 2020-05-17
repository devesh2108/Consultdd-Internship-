import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Popconfirm, Select, DatePicker} from "antd";
import moment from "moment-timezone";
import {createWorkAuth, editWorkAuth} from "../../../services/service";

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

class WorkAuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visa_type: '',
            visa_start: '',
            visa_end: '',
            status: true
        }
    }
    componentDidMount() {
        this.setState({
            visa_type: this.props.workAuth[0].visa_type,
            visa_start: moment(this.props.workAuth[0].visa_start),
            visa_end: moment(this.props.workAuth[0].visa_end)
        })
    }

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };

    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };
    cancelStatus = () => {
        this.setState({
            status: true,
            visa_type: this.props.workAuth[0].visa_type,
            visa_start: moment(this.props.workAuth[0].visa_start),
            visa_end: moment(this.props.workAuth[0].visa_end)
        })
    }
    changeStatus = () => {
        this.setState({
            status: false,
            visa_type: '',
            visa_start: null,
            visa_end: null

        })
    }
    updateStatus = () => {
        this.setState({
            status: true,
            visa_type: this.props.workAuth[0].visa_type,
            visa_start: moment(this.props.workAuth[0].visa_start),
            visa_end: moment(this.props.workAuth[0].visa_end)

        })
    }
    onSubmit=()=>{
        const body={
            'visa_type': this.state.visa_type,
            'visa_start':moment(this.state.visa_start).format("YYYY-MM-DD"),
            'visa_end':moment(this.state.visa_end).format("YYYY-MM-DD"),
            'consultant':this.props.consultantId
        }
        if(!this.state.status){
            createWorkAuth(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    this.props.setWorkAuth(res.result)

                })
                .catch(error => {
                    console.log(error)
                });
        }
        else{
            editWorkAuth(this.props.workAuth[0].id,body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    this.props.updateWorkAuth(res.result)
                    
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }


    render() {
        return (
            <div>
               
                <div className="workauth_sec">
                    <Popconfirm
                        title="Are you sure change this visa?"
                        onConfirm={this.changeStatus}
                        onCancel={this.cancelStatus}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button>Change Visa Type</Button>

                    </Popconfirm>
                    <Button onClick={this.updateStatus}>Update Visa Type</Button>
                    <ul>

                        <li> 
                            <label>
                                <span> Visa Type: </span>
                                <Select
                                    disabled={this.state.status}
                                    value={this.state.visa_type}
                                    className="profledateselect"
                                    onChange={(value) => this.setState({visa_type: value})}>

                                    {visa_type.map((item) => <Select.Option
                                        value={item}>{item}</Select.Option>)}
                                </Select>
                            </label> 

                        </li>
  
                        <li> 
                            <label>
                            <span> Visa Start Date: </span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                className="profledate"
                                value={this.state.visa_start}
                                placeholder="Visa Start"
                                onChange={this.onVisaStartChange}
                            />
                           </label>
                        </li>

                        <li> 
                            <label>
                                <span> Visa End Date: </span>
                                <DatePicker
                                    disabled={this.state.readOnlyProfile}
                                    format="YYYY-MM-DD"
                                    className="profledate"
                                    value={this.state.visa_end}
                                    placeholder="Visa End"
                                    onChange={this.onVisaEndChange}
                                />
                            </label>
                        </li>

                    </ul>
                    
                    <Button onClick={this.onSubmit}>Submit</Button>

                    <br clear="all" />

                </div>

            </div>
        )

    }
}

export default WorkAuthForm;
