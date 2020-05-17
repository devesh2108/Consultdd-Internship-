import React, {Component} from 'react';
import { Select, Modal, Input, Button,Radio} from "antd";
import {EyeOutlined,VerticalAlignBottomOutlined} from "@ant-design/icons"
import {changeStatus} from "../../services/service";

const {TextArea} = Input;

const timeSheet = [
    {
        key: 'rejected', label: 'Rejected',
    },
    {
        key: 'approved', label: 'Approved',
    },
];

class ChangeTimesheetStatus extends Component {
    constructor(props, context) {

        super(props, context);
        this.state = {
            timesheetStatus: '',
            fileStatus: [false],
            attachment: [],
            file: '',
            open: false,
            openStatus: false,
            remark: ''

        };
    };

    componentDidMount() {
        let fileStatus = [false];
        fileStatus[0] = true;
        this.setState({
            fileStatus: fileStatus,
            timesheetStatus: this.props.timesheetStatus,
            attachment: this.props.attachment,
            open: true
        })
    }

    onStatusChange = (e) => {
        if (e !== undefined) {
            this.setState({
                timesheetStatus: e.target.value,
                openStatus: true
            })
        } else {
            e = null
            this.setState({
                timesheetStatus: this.props.timesheetStatus,
                openStatus: true
            })
        }

    };
    onChange = (value) => {
        if (value !== undefined) {
            this.setState({
                timesheetStatus: value,
            })
        } else {
            value = null
            this.setState({
                timesheetStatus: this.props.timesheetStatus,
            })
        }

    };
    setFile = (i) => {
        let fileStatus = [false];
        fileStatus[i] = true;
        this.setState({fileStatus: fileStatus})
    }
    openFile = (i) => {
        this.setState({
            //openStatus: true,
            file: this.state.attachment[i].attachment_file
        })
    }
    setOpenStatus = () => {
        this.setState({
            openStatus: false,
        })
    }
    setRemark = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    changeStatus = () => {
        const body = {
            'status': this.state.timesheetStatus,
            'remark': this.state.remark
        }
        changeStatus(this.props.timesheetId, body)
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
                    console.log(res.result)
                    this.props.setUpdatedTimesheet(res.result);
                    this.setOpenStatus();


                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            this.state.open &&
            <div>
                        <div className="image_heading">
                           <span> Total Hours:{this.props.total_hours} </span>
                        </div>
<br clear="all" />
                        <Radio.Group onChange={this.onStatusChange} value={this.state.timesheetStatus}  className="submissionselect2">
                            <ul className="radiobutton_head"> 
                                <li> <Radio value="rejected">Rejected</Radio> </li>
                                <li> <Radio value="approved">Approved</Radio> </li>
                            </ul>
                        </Radio.Group>

                {
                    this.state.attachment.map((file, i) =>
                        <div>


                            <div className="row">
                     
                                <div className="col-md-12 col-ms-12 col-xs-12">

                                    <div className="maintime">

                                        
                                        <div className="testingtimesheet">
                                            <div className="documentsection_tab">
                                                <img src={file.attachment_file}
                                                     style={{width: '250px', height: '60%'}}/>
                                                <span
                                                    className="timesheet_img_name">{file.attachment_file.split("/")[7]}</span>

                                                <EyeOutlined className="eyeicon" onClick={() => {
                                                    this.openFile(i)
                                                }}/>
                                                <a href={file.attachment_file} download> <VerticalAlignBottomOutlined /></a>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>


                        </div>
                    )
                }
                {this.state.openStatus &&

                <Modal
                    title="Timesheet Details"
                    className="modal-full"
                    visible={this.state.openStatus}
                    onCancel={this.setOpenStatus}
                    footer={null}
                >

                    <ul className="timesheet_D">

                        <li><label> Status</label>

                            <span>
                                { timeSheet.map((status,i)=>{
                                    if(  this.state.timesheetStatus ===status.key){
                                        return status.label
                                    }
                                })

                                }
                             </span>
                        </li>


                        <li>
                            <label> Add Remark</label>
                            <span>
                                  <TextArea className="timesheet_text" rows={4} value={this.state.remark}
                                  onChange={this.setRemark}/>
                            </span>
                        </li>

                    </ul>


                    <br clear="all"/>


                    <div className="timesheetbutton">
                        <Button onClick={this.changeStatus}>Submit</Button>
                    </div>


                    <br clear="all"/>
                </Modal>
                }
            </div>
        )
    }
}

export default ChangeTimesheetStatus;
