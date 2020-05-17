import React, {Component} from 'react';
import {changeTimesheetStatus, getConsultantTimesheetData,} from "../../services/service";
import {Drawer, Table,} from 'antd'
import {IssuesCloseOutlined,CloseCircleOutlined,CheckCircleOutlined,ArrowLeftOutlined} from "@ant-design/icons"
import ChangeTimesheetStatus from "../../components/Finance/changeTimesheetStatus";
import TimesheetFilter from "../../components/Finance/timesheetFilter";
import moment from "moment";
import HTTP_401 from "../../components/Error/HTTP_401";
import HTTP_500 from "../../components/Error/HTTP_500";
import HTTP_400 from "../../components/Error/HTTP_400";

const status = [
    {
        key: 'approved', label: 'Approved',
    },
    {
        key: 'rejected', label: 'Rejected',
    },
    {
        key: 'submitted', label: 'Pending Approval',
    },
    {
        key: 'draft', label: 'Draft',
    },
]

class Timesheet extends Component {
    constructor(props, context) {

        super(props, context);
        this.state = {
            timesheetData: [],
            status: false,
            drawerOpen: false,
            width: '100%',
            attachment: [],
            fileStatus: [false],
            file: '',
            openStatus: false,
            timesheetStatus: '',
            timesheetId: '',
            startRange: null,
            endRange: null,
            query: '',
            statusString: '',
            fontColor:['#272525'],
            total_hours:''

        };
        this.goBack = this.goBack.bind(this);
        this.getConsultant = this.getConsultant.bind(this);
    }

    componentDidMount() {
        const cId = localStorage.getItem('CID');
        if (cId !== null && cId !== undefined) {
            this.getConsultant(cId)
        }
    }

    goBack() {
        localStorage.removeItem('CID');
        this.props.history.goBack();
    }

    openDrawer = (attachment, timesheetStatus, timesheetId,hours,index) => {

        let fileStatus = [false],color=this.state.fontColor;
        fileStatus[0] = true;
        color[index]='#272525';
        this.setState({
            fileStatus: fileStatus,
            drawerOpen: true,
            width: '60%',
            attachment: attachment,
            timesheetStatus: timesheetStatus,
            timesheetId: timesheetId,
            fontColor: color,
            total_hours:hours

        })
    }
    onClose = () => {
        let color=this.state.fontColor;
        for(var i=0;i< color.length;i++){
            color[i]='#a2a2a2'
        }

        this.setState({drawerOpen: false, width: '100%', attachment: [], fontColor:color})
    }

    setUpdatedTimesheet = (timesheet) => {
        let timesheetArr = this.state.timesheetData
        timesheetArr.map((obj, index) => {
            if (obj.id === timesheet.id) {
                timesheetArr[index] = timesheet
            }
        })
        this.setState({
            timesheetData: timesheetArr
        })
    }
    onStartChange = (start) => {
        if (start !== undefined) {
            this.setState({startRange: start}, () => this.onFilter())
        } else {
            start = null
            this.setState({startRange: ''}, () => this.onFilter())
        }

    }
    onEndChange = (end) => {
        if (end !== undefined) {
            this.setState({endRange: end}, () => this.onFilter())
        } else {
            end = null
            this.setState({endRange: ''}, () => this.onFilter())
        }
    }
    onSearch = (e) => {
        if (e.target.value !== undefined) {
            this.setState({query: e.target.value}, () => this.onFilter())
        } else {
            e.target.value = null
            this.setState({query: ''}, () => this.onFilter())
        }
    }

    getConsultant(consultant) {
        getConsultantTimesheetData(consultant)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                let color = [];
                if(status === 200 && res.results.length !== 0) {
                    for (var i = 0; i < res.results.length; i++) {
                        color[i] = '#8c8c8c'
                    }
                }
                    this.setState({
                        timesheetData: res.results,
                        status: status,
                        fontColor:color
                    })


            })
            .catch(error => {
                console.log(error)
            })

    }

    onFilter = () => {
        const cId = localStorage.getItem("CID")
        const startRange = (this.state.startRange) === null ? '':moment(this.state.startRange).format("YYYY-MM-DD");
        const endRange = (this.state.endRange) === null ? '':moment(this.state.endRange).format("YYYY-MM-DD");
        const query = this.state.query;
        changeTimesheetStatus(cId, startRange, endRange, query)
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
                    this.setState({
                        timesheetData: res.results,
                        status: status
                    })

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        console.log("Font color------",this.state.fontColor)
        const columns = [
            {
                title: 'Week Start',
                dataIndex: 'start',
                key: 'start',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            },
            {
                title: 'Week End',
                dataIndex: 'end',
                key: 'end',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            },{
                title: 'Client',
                dataIndex: 'project.client',
                key: 'project.client',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            },{
                title: 'Vendor',
                dataIndex: 'project.vendor',
                key: 'project.vendor',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            },{
                title: 'Total Hours',
                dataIndex: 'hours',
                key: 'hours',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            },{
                title: 'Additional Hours',
                dataIndex: 'additional_hours',
                key: 'additional_hours',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span style={{color: this.state.fontColor[i]}}
                            onClick={() => this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>{text}</span>


                ),
            }, {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                render: (text, record,i) => (
                    text === null ?
                        <span style={{color: this.state.fontColor[i]}}>Not on Project</span> :
                        <span
                            style={{
                                //color:this.state.fontColor[i],
                                color:text === "submitted" ? "#ffb60b":text === "rejected" ? "#b71e0d" :"#007700"
                            }}
                            onClick={() =>
                                this.openDrawer(record.attachments, record.status, record.id,record.hours,i)}>
                            {text === "submitted" ?
                                <IssuesCloseOutlined style={{color:"#ffb60b",fontSize:"18px",marginRight:"4px"}}  /> :text === "rejected" ?
                                    <CloseCircleOutlined style={{color:"#b71e0d",fontSize:"18px",marginRight:"4px"}}  /> :
                                    <CheckCircleOutlined style={{color:"#007700",fontSize:"18px",marginRight:"4px"}} />}

                            {status.map((item, i) => item.key === text ? item.label : null)}
                        </span>


                ),
            },
        ];
        return (

            <div>

                <div className="gobackicon">
                    <h1 style={{color:'#fff'}}><ArrowLeftOutlined onClick={this.goBack}/><span style={{marginLeft:'60px',position:'fixed',top:45}}>Timesheet</span></h1>
                </div>

                <div className="filtersec">
                    <TimesheetFilter
                        startRange={this.state.startRange}
                        endRange={this.state.endRange}
                        query={this.state.query}
                        onSearch={this.onSearch}
                        onStartChange={this.onStartChange}
                        onEndChange={this.onEndChange}
                    />
                </div>

                {this.state.status === 200 ?

                    <div>
                        <Table
                            style={{
                                width: this.state.width,
                                overflow: "hidden",
                                position: "relative",
                                border: "1px solid #ebedf0",
                                borderRadius: 2,
                                padding: 48,
                                textAlign: "center",
                                background: "#fafafa"
                            }}
                            rowKey={(record) => record.id.toString()}
                            columns={columns}
                            dataSource={this.state.timesheetData}
                            pagination={false}
                        />
                    </div>
                    :
                    this.state.status === 400 ?
                        <HTTP_400/>
                        :
                        this.state.status === 500 ?
                            <HTTP_500/>
                            :
                            this.state.status === 401 ?
                                <HTTP_401 history={this.props.history}/> : null
                }
                {this.state.drawerOpen &&
                <Drawer
                    title={null}
                    placement="right"
                    width="44%"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerOpen}
                    getContainer={false}
                    style={{position: "absolute"}}
                >
                    <ChangeTimesheetStatus
                        total_hours={this.state.total_hours}
                        timesheetStatus={this.state.timesheetStatus}
                        timesheetId={this.state.timesheetId}
                        attachment={this.state.attachment}
                        setUpdatedTimesheet={this.setUpdatedTimesheet}

                    />
                    {/*{this.state.openStatus &&*/}
                    {/*<Modal*/}
                    {/*    title={null}*/}
                    {/*    className="modal-full"*/}
                    {/*    visible={this.state.openStatus}*/}
                    {/*    closable={false}*/}
                    {/*    footer={null}*/}
                    {/*>*/}
                    {/*    <div className="modal-full modal-content ">*/}
                    {/*        <Icon type="arrow-left" onClick={this.setOpenStatus}/>*/}
                    {/*        <Icon type="vertical-align-bottom"/>*/}
                    {/*        <img src={this.state.file} style={{height: '50%', width: '50%'}}/>*/}
                    {/*    </div>*/}
                    {/*</Modal>*/}
                    {/*}*/}
                </Drawer>
                }

            </div>


        )
    }
}

export default Timesheet;
