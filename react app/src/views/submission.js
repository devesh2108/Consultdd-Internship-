import React, {Component} from 'react';
import {
    getAllConsultants,
    getAllSubmission, getConsultantSubmissions, mySubs, onSpecificFilterSub,
    onSubmissionSearch
} from "../services/service";
import {
    Switch,
    Input,
    Table,
    Button,
    Pagination,
    Radio,
    Col,
    Row,
    Card,
    message,
    Spin,
    Drawer,
    Modal,
    Form,
    Select
} from "antd";
import CalendarComponent from "../components/calendarComponent";
import moment from 'moment-timezone';
import AddProject from "../components/addProject";
import {
    Route,
    Link,
} from "react-router-dom";
import DetailTabView from "../components/viewForms/submissionTab/detailTabView";


class Submission extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            stepCount: 1,
            submissionData: [],
            status: null,
            modalIsOpen: false,
            submission_details: [],
            viewModal: false,
            apply: false,
            view: false,
            current_page: 1,
            filter: 'all',
            total: null,
            project: null,
            sub: null,
            interview: null,
            t: null,
            calendarPopup: false,
            flag: false,
            subStatus: false,
            current_size: 10,
            my: 'all',
            loading: false,
            po: false,
            query: '',
            filter_status: '',
            consultantList: [],
            selectedCon: null,
            flagArray: [false],
        };
        this.openModal = this.openModal.bind(this);
        this.changeStep = this.changeStep.bind(this)
        this.closeModal = this.closeModal.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
    }

    componentDidMount() {
        this.getAllConsultant()
        if (this.props.tab_flag === false) {
            if (this.props.consultant_id != -1) {
                this.getConsultantSubmissions(this.props.consultant_id, 1,10)

            }
        } else {
            this.getAllSubmission(1, this.state.filter, 10,this.state.query,this.state.selectedCon)
        }
    }

    getAllConsultant() {
        getAllConsultants()
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
                    this.props.history.push("/login")
                } else {
                    //console.log(res.results);
                    this.setState({
                        consultantList: res.results,
                        status: status
                    });
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false, apply: false, view: false, calendarPopup: false, po: false});
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onUpdateChange(id, submission) {
        //console.log(id, submission)
        let temp = this.state.submissionData;
        let chInd = -1;

        for (let i in temp) {
            if (temp[i].id === id) {
                chInd = i
            }
        }

        temp[chInd] = submission;

        this.setState({
            submissionData: temp
        })

    }


    changeStep(val) {
        this.setState({
            stepCount: val
        })
    }

    getAllSubmission(page, filter, size,val,id) {
        let temp = [];
        this.setState({loading: false,})
        getAllSubmission(page, filter, size,val,id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log(res)
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        loading: true,
                        total: res.counts.total,
                        t: res.counts.total,
                        project: res.counts.project,
                        interview: res.counts.interview,
                        sub: res.counts.sub,
                        submissionData: res.results,
                        status: status,
                    })
                }
            })
    }

    getMySubmission(filter, type, status, page, size,val,id) {
        this.setState({loading: false,})

        mySubs(filter, type, status, page, size,val,id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log(res)
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        loading: true,
                        total: res.counts.total,
                        t: res.counts.total,
                        project: res.counts.project,
                        interview: res.counts.interview,
                        sub: res.counts.sub,
                        submissionData: res.results,
                        status: status,
                    })
                }
            })
    }

    getConsultantSubmissions(id, page, size) {
        this.setState({loading: false,})
        getConsultantSubmissions(id, page, size)
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
                        loading: true,
                        total: res.counts.total,
                        t: res.counts.total,
                        project: res.counts.project,
                        interview: res.counts.interview,
                        sub: res.counts.sub,
                        submissionData: res.results,
                        status: status,
                    })
                }
            })

    }

    onSelection(data) {

    }

    onPageChange = (page, size) => {
        this.setState({
            current_page: page,
            current_size: size
        });
        if (this.props.tab_flag === false) {
            if (this.props.consultant_id != -1) {
                this.getConsultantSubmissions(this.props.consultant_id, page, size)

            }
        } else {
            if (this.state.my === 'my' || this.state.my === 'team') {
                //this.getAllSubmission(page, this.state.my, size)
                this.getMySubmission(this.state.filter, this.state.my, this.state.filter_status, page, size,this.state.query,this.state.selectedCon)
            } else if (this.state.query !== '' || this.state.selectedCon !== null) {
                this.onSearch(this.state.selectedCon, this.state.query, page, size,this.state.filter_status,this.state.filter,this.state.my)
            } else if (this.state.filter_status !== '') {
                this.onSpecificFilter(this.state.filter, this.state.filter_status, page, size, this.state.total,this.state.query,this.state.selectedCon)
            } else {
                this.getAllSubmission(page, this.state.filter, size,this.state.query,this.state.selectedCon)
            }
        }

    };

    onFilterChange = e => {
        this.setState({
            filter: e.target.value,
            current_size:10,
            current_page:1
        });
        if (this.state.my === 'my' || this.state.my === 'team') {
            //this.getAllSubmission(page, this.state.my, size)
            this.getMySubmission(e.target.value, this.state.my, this.state.filter_status, 1, 10,this.state.query,this.state.selectedCon)
        } else if (this.state.filter_status !== '') {
            this.onSpecificFilter(e.target.value, this.state.filter_status, 1, 10, this.state.total, this.state.query,this.state.selectedCon)

        } else {
            this.getAllSubmission(1, e.target.value, 10,this.state.query,this.state.selectedCon)
        }

    };

    onSearch(con, value, page, size,status,filter,my) {
        this.setState({loading: false, query: value})
        onSubmissionSearch(con, value, page, size,status,filter,my)
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
                        loading: true,
                        total: res.counts.total,
                        t: res.counts.total,
                        project: res.counts.project,
                        interview: res.counts.interview,
                        sub: res.counts.sub,
                        submissionData: res.results,
                        status: status,
                    })
                }

            })
            .catch(error => {
                console.log(error)
            })

    }


    onSpecificFilter(filter, val, page, size, total,query,id) {
        //console.log(val)
        let temp = this.state.flagArray;
        switch (val) {
            case '':
                temp[0] = true
                temp[1] = false
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'sub':
                temp[0] = false
                temp[1] = true
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'interview':
                temp[0] = false
                temp[1] = false
                temp[2] = true
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'project':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = true
                this.setState({flagArray: temp})
                break;
        }
        this.setState({loading: false, filter_status: val, total: total})
        onSpecificFilterSub(filter, this.state.my, val, page, size,query,id)
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
                    //console.log(res)
                    this.setState({
                        loading: true,

                        total: filter !== 'all' ? res.counts.total : total,
                        t: res.counts.total,
                        project: res.counts.project,
                        interview: res.counts.interview,
                        sub: res.counts.sub,
                        submissionData: res.results,
                        status: status,
                    })
                }
            })
    }

    onConsultantChange(value) {
        //console.log(value)
        if (value !== undefined) {
            this.setState({
                selectedCon: value
            })
        } else {
            value = null
            this.setState({
                selectedCon: null
            })
        }
        //console.log(`selected ${value}`);
        this.onSearch(value, this.state.query, 1, 10,this.state.filter_status,this.state.filter,this.state.my)
        // this.getSubmissions(this.state.current_page, this.state.current_size)
    }

    render() {
        const {selectedRowKeys} = this.state;
        const role = localStorage.getItem('ROLE');
        const marketer = localStorage.getItem('NAME');
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection(this.state.submissionData),

        };
        const columns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant_name',
                key: 'consultant_name',
                width: '15%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setState({submission_details: record});
                        this.setState({view: true});
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text}
                    </span>

                ),
            },
            // {
            //     title: 'Skills',
            //     dataIndex: 'lead__skill',
            //     key: 'lead__skill',
            //     width: '7%',
            //     render: (text, record) => (
            //         <span onClick={() => {
            //             console.log(record.id)
            //             this.setState({submission_details: record})
            //             this.setState({view: true})
            //         }}>{text}</span>
            //     ),
            // },
            {
                title: 'Vendor Company',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '12%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({submission_details: record})
                        this.setState({view: true})
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Client Company',
                dataIndex: 'client',
                key: 'client',
                width: '10%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setState({submission_details: record})
                        this.setState({view: true})
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Job Location',
                dataIndex: 'location',
                key: 'location',
                width: '8%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setState({submission_details: record})
                        this.setState({view: true})
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '5%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({submission_details: record})
                        this.setState({view: true})
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text === null ? text : '$' + text}</span>
                ),

            },
            {
                title: 'Marketer',
                dataIndex: 'marketer_name',
                key: 'marketer_name',
                width: '12%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({submission_details: record})
                        this.setState({view: true})
// this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Created On',
                dataIndex: 'created',
                key: 'created',
                width: '12%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({submission_details: record})
                        this.setState({view: true})
                        //this.props.history.push({pathname:'/tabsub', state:{submission_details:this.state.submission_details,submissionData:this.state.submissionData}})
                    }}>{new Date(text).toDateString() + " :: " + moment(text).tz("America/Toronto").format("hh:mm A")}</span>
                ),
            },

            {
                title: 'Actions',
                key: "action",
                width: '30%',
                render: (text, record) => (
                    <span>
                        {record.project === null ?
                            <Button
                                //disabled={record.status ==='interview'}
                                onClick={() => {


                                    if (record.client !== "" && record.vendor_contact !== null &&

                                        record.company_name !== "" &&
                                        record.marketer_name.toLowerCase() === marketer.toLowerCase() &&
                                        record.stage === 'open' && record.rate !== 0
                                    ) {
                                        this.setState({submission_details: record, calendarPopup: true})
                                    } else if (record.marketer_name.toLowerCase() !== marketer.toLowerCase()) {
                                        message.error("You can't schedule the interview on this submission because you are not owner.")
                                    } else if (record.vendor_contact === null) {
                                        message.error("Vendor Contact is empty")
                                    } else if (
                                        record.stage !== 'open'
                                    ) {
                                        message.error("Change Status of interview")
                                    } else if (record.company_name === '') {
                                        message.error("Vendor is empty")
                                    } else if(record.rate === 0){
                                        message.error("Rate is null")
                                    }else{
                                        message.error("Client is empty")
                                    }
                                }
                                }
                                type="primary"
                                size="small"
                                style={{marginRight: 8}}>
                                Schedule Interview
                            </Button> :
                            <Button onClick={() => {
                                if (record.marketer_name.toLowerCase() === marketer.toLowerCase()) {
                                    this.setState({po: true, submission_details: record})
                                }
                            }}>Create Project</Button>
                        }
                </span>

                )
            }];
        return (
            <Route>
                <div>
                    <br/>
                    <Row className="box" gutter={8}>
                        <Col span={2}
                             onClick={() => this.onSpecificFilter(this.state.filter, '', 1, 10, this.state.t, this.state.query,this.state.selectedCon)}>
                            <Card
                                bodyStyle={{color: this.state.flagArray[0] ? '#2688db' : null}}
                                title={<span
                                    style={{color: this.state.flagArray[0] ? '#2688db' : null}}>{this.state.t === 0 ? '0' : this.state.t}</span>}
                                bordered={false}>
                                Total
                            </Card>
                        </Col>
                        <Col span={2}
                             onClick={() => this.onSpecificFilter(this.state.filter, 'sub', 1, 10, this.state.sub, this.state.query,this.state.selectedCon)}>
                            <Card
                                bodyStyle={{color: this.state.flagArray[1] ? '#2688db' : null}}
                                title={<span
                                    style={{color: this.state.flagArray[1] ? '#2688db' : null}}>{this.state.sub === 0 ? '0' : this.state.sub}</span>}
                                bordered={false}>
                                Submitted
                            </Card>
                        </Col>
                        <Col span={2}
                             onClick={() => this.onSpecificFilter(this.state.filter, 'interview', 1, 10, this.state.interview, this.state.query,this.state.selectedCon)}>
                            <Card
                                bodyStyle={{color: this.state.flagArray[2] ? '#2688db' : null}}
                                title={<span
                                    style={{color: this.state.flagArray[2] ? '#2688db' : null}}>{this.state.interview === 0 ? '0' : this.state.interview}</span>}
                                bordered={false}>
                                Interview
                            </Card>
                        </Col>
                        <Col span={2}
                             onClick={() => this.onSpecificFilter(this.state.filter, 'project', 1, 10, this.state.project, this.state.query,this.state.selectedCon)}>
                            <Card
                                bodyStyle={{color: this.state.flagArray[3] ? '#2688db' : null}}
                                title={<span
                                    style={{color: this.state.flagArray[3] ? '#2688db' : null}}>{this.state.project === 0 ? '0' : this.state.project}</span>}
                                bordered={false}>
                                Project
                            </Card>
                        </Col>

                        <div className="leadsearch leadsearch33">

                            <Select
                                showSearch
                                allowClear
                                style={{width: '50%'}}
                                placeholder="Select a consultant"
                                optionFilterProp="children"
                                onChange={(e) => {
                                    this.onConsultantChange(e);
                                }}
                            >
                                {this.state.consultantList.map((item, i) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>


                            <Input.Search
                                placeholder="Search Submission"
                                onChange={e => this.onSearch(this.state.selectedCon, e.target.value, 1, 10,this.state.filter_status,this.state.filter,this.state.my)}
                                onSearch={value => this.onSearch(this.state.selectedCon, value, 1, 10,this.state.filter_status,this.state.filter,this.state.my)}
                                style={{width: '200px', position: 'absolute', top: '37px', right: '6px'}}
                            />

                        </div>
                    </Row>

                    <br/>
                    <div id= "Submission">
                        <div className="mapbox submapbox">
                            <Radio.Group defaultValue="all" buttonStyle="solid" style={{}} onChange={this.onFilterChange}
                                         value={this.state.filter}>
                                <Radio.Button value="all">All</Radio.Button>
                                <Radio.Button value="last_day">Yesterday</Radio.Button>
                                <Radio.Button value="today">Today</Radio.Button>
                                <Radio.Button value="week">Last Week</Radio.Button>
                                <Radio.Button value="month">Last Month</Radio.Button>
                            </Radio.Group>
                        </div>

                        <br/>

                        {this.state.loading &&
                        this.state.status === 200 ?

                            <div>
                                {role.map(role=> role === "admin") ?
                                    <Radio.Group
                                        defaultValue="all"
                                        onChange={(event) => {
                                            this.setState({my: event.target.value, current_page: 1, curren_size: 10})
                                            this.getMySubmission(this.state.filter, event.target.value, this.state.filter_status, 1, 10,this.state.query,this.state.selectedCon)


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
                                        My Submissions <Switch checked={this.state.subStatus} size="small" onChange={() => {
                                        this.setState({subStatus: !this.state.subStatus})
                                        if (!this.state.subStatus) {
                                            this.setState({my: 'my', current_page: 1, curren_size: 10})
                                            this.getMySubmission(this.state.filter, 'my', this.state.filter_status, 1, 10,this.state.query,this.state.selectedCon)
                                        } else {
                                            this.setState({my: 'all', current_page: 1, curren_size: 10})
                                            this.getMySubmission(this.state.filter, 'all', this.state.filter_status, 1, 10,this.state.query,this.state.selectedCon)
                                        }


                                    }}/>
                                    </div>
                                }
                                <div className="table-responsive">
                                    <Table
                                        rowKey={record => record.id.toString()}
                                        columns={columns}
                                        dataSource={this.state.submissionData}
                                        pagination={false}
                                    />
                                </div>

                                <br/>
                                <div className="rightpagination">
                                    <Pagination
                                        showSizeChanger
                                        onShowSizeChange={this.onPageChange}
                                        onChange={this.onPageChange}
                                        style={{float: "right"}}
                                        current={this.state.current_page}
                                        total={this.state.total}
                                        pageSize={this.state.current_size}
                                    />
                                </div>
                                {this.state.view &&
                                <Drawer
                                    title={null}
                                    className="submition_sec"
                                    width={800}
                                    onClose={this.closeModal}
                                    closable={false}
                                    visible={this.state.view}
                                >

                                    {this.state.view &&
                                    <DetailTabView
                                        onUpdateChange={this.onUpdateChange}
                                        sub_id={this.state.submission_details.id}
                                        handleClose={this.closeModal}/>
                                    }
                                </Drawer>
                                }
                                {this.state.calendarPopup &&
                                <Drawer
                                    title="Schedule Interview"
                                    width="100%"
                                    onClose={this.closeModal}
                                    visible={this.state.calendarPopup}
                                >
                                    <CalendarComponent
                                        create={true}
                                        submissionId={this.state.submission_details.id}
                                        path={true}
                                        setInterviewTab={this.props.setInterviewTab}
                                        handleClose={this.closeModal}/>
                                </Drawer>
                                }
                                {this.state.po &&

                                <Drawer
                                    title="Create Project"
                                    width={720}
                                    onClose={this.closeModal}
                                    visible={this.state.po}
                                >
                                    <AddProject submissionId={this.state.submission_details.id}
                                                handleClose={this.closeModal}/>
                                </Drawer>
                                }
                            </div>
                            :
                            <div>
                                <Spin style={{alignItems: 'center'}} tip="Loading..." size="large"/>
                            </div>}
                    </div>

                </div>
            </Route>


        );
    }
}

export default Submission;
