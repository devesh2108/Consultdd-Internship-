import React, {Component} from 'react';
import {getAllConsultants, importData, logout, oldSubmission, onOldSubmissionSearch} from "../../services/service";
import {

    Table, Input, Pagination, Form, Select, Button, message, Tooltip,Tag

} from 'antd';
import {CopyrightOutlined,MailOutlined,PhoneOutlined,DollarOutlined,ScheduleOutlined,CalendarOutlined} from "@ant-design/icons"

class OldSubmission extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            submissionList: [],
            status: null,
            current_page: 1,
            total: null,
            current_size: 10,
            consultantList: [],
            selectedCon: '',
            query: '',
            profile: false,
            addUser: false
        };

        this.onConsultantChange = this.onConsultantChange.bind(this);
        this.getSubmissions = this.getSubmissions.bind(this);
        this.getAllConsultant = this.getAllConsultant.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.importData = this.importData.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.getSubmissions(this.state.current_page, this.state.current_size)
        this.getAllConsultant()
    }

    closeModal() {
        this.setState({profile: false, addUser: false});
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
                    console.log(res.results);
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

    getSubmissions(page, size) {
        oldSubmission(page, size)
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
                    console.log(res)
                    this.setState({
                        total: res.total,
                        submissionList: res.results,
                        status: status
                    })
                }

            })
    }

    onSearch(id, value, page, size) {
        if (id === undefined) {
            id = ''
        }
        this.setState({
            submissionList: [],
            query: value
        })
        onOldSubmissionSearch(id, value, page, size)
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
                    this.setState({
                        total: res.total,
                        submissionList: res.results,
                        status: status
                    })


                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    onPageChange = (page, size) => {
        this.setState({
            current_page: page,
            current_size: size
        });
        console.log(this.state.selectedCon)
        if (this.state.query === '' && this.state.selectedCon === 0) {
            this.getSubmissions(page, size)
        }
        else {
            this.onSearch(this.state.selectedCon, this.state.query, page, size)

        }
    };

    filterSearch(value, query) {
        console.log(value, query)

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onConsultantChange(value) {
        console.log(value)
        this.setState({
            selectedCon: value,
            submissionList:[]
        })
        console.log(`selected ${value}`);
        this.onSearch(value, this.state.query, 1, 10)
        // this.getSubmissions(this.state.current_page, this.state.current_size)
    }

    importData() {
        const body = {
            'email': this.state.email
        }
        if (this.state.email) {
            importData(body)
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
                        console.log(res)
                        if (status === 201) {
                            message.success("Updated.")
                        }
                        else if(status === 500){
                            message.error("Internal Server Error")

                        }
                       else{
                            message.error(status+" : "+res.error)
                        }


                    }

                })
                .catch(error => {
                    console.log(error)
                })
        }
        else{
            message.error("Please fill the email")
        }
    }


    render() {
        const role = localStorage.getItem('ROLE');

        const columns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant',
                key: 'consultant',
                width: '10%',
                render: (text, record) => (
                    <span>{text}</span>
                ),
            },
            {
                title: 'Job Title',
                dataIndex: 'job_title',
                key: 'job_title',
                width: '15%',
                render: (text, record) => (
                    <span>{text}</span>
                ),
            },
            {
                title: 'Job Location',
                dataIndex: 'job_location',
                key: 'job_location',
                width: '8%',
                render: (text, record) => (
                    <span>{text}</span>
                ),
            },
            {
                title: 'Vendor Name',
                dataIndex: 'vendor',
                key: 'vendor',
                width: '10%',
                render: (text, record) => (
                    text.length !== 0
                        ?
                        text.map((item, i) =>
                            <div>
                                <span>{item.name}</span>
                                <br/>
                            </div>
                        ) :
                        null

                ),
            },

            {
                title: 'Client Name',
                dataIndex: 'client',
                key: 'client',
                width: '15%',
                render: (text, record) => (
                    text.length !== 0
                        ?
                        text.map((item, i) =>
                            <div>
                                <span>{item.name}</span>
                                <br/>
                            </div>
                        ) :
                        null

                ),
            },
            {
                title: 'Marketer',
                dataIndex: 'marketer',
                key: 'marketer',
                width: '18%',
                render: (text, record,i) => (

                    <span>{text}</span>

                ),
            },

            {
                title: 'Interview',
                dataIndex: 'interview',
                key: 'interview',
                width: '2x%',
                render: (text, record) => (
                    text.length !== 0
                        ?
                        <span>Yes</span> :
                        <span>No </span>
                ),
            },
        ];

        return (
            <Container-fluid>

                {this.state.status === 200 ?
                    <div>


                        <div className="container-fluid">


                            <div className="old_sub_section">

                                <h2>Old Submissions</h2>

                                { role.map(role=> role === "superadmin") || role.map(role=> role === "admin") ?
                                    <div className="leftemail">
                                        <Input placeholder="Consultant's Email" name="email" value={this.state.email}
                                               onChange={this.handleChange}
                                               style={{width: '20%'}}/>
                                        <Button onClick={this.importData}> Submit </Button>
                                    </div> : null}


                                <ul>
                                    <li>
                                        <Form.Item
                                            label="Consultant Joined:"
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                style={{width: '100%'}}
                                                placeholder="Select a consultant"
                                                optionFilterProp="children"
                                                onChange={(e) => {
                                                    console.log(e)
                                                    this.onConsultantChange(e);
                                                }}
                                            >
                                                {this.state.consultantList.map((item, i) => (
                                                    <Select.Option value={item.id}>{item.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </li>

                                    <li>
                                        <div className="leadsearch">
                                            <Input.Search
                                                placeholder="Search Submissions"
                                                onChange={e => this.onSearch(this.state.selectedCon, e.target.value, 1, 10)}
                                                onSearch={value => this.onSearch(this.state.selectedCon, value, this.state.current_page, 10)}
                                                style={{width: 200}}
                                            />
                                        </div>
                                    </li>

                                </ul>


                            </div>


                        </div>


                        <Table
                            rowKey={(record) => record.id.toString()}
                            style={{marginTop: 10, marginRight: '10px', marginLeft: '10px', marginBottom: '10px'}}
                            columns={columns}
                            expandedRowRender={(record) =>
                                <div>
                                    <Tooltip title="Employer" placement="top"><CopyrightOutlined/></Tooltip> : {record.employer}
                                        <br/>
                                    <Tooltip title="Marketing Email" placement="top"><MailOutlined/></Tooltip> : {record.marketing_email}
                                    <br/>
                                    <Tooltip title="Marketing Phone" placement="top"><PhoneOutlined/></Tooltip> : {record.marketing_phone}
                                    <br/>
                                    <Tooltip title="Rate" placement="top"><DollarOutlined/></Tooltip> : {record.rate}
                                    <br/>
                                    <Tooltip title="Submission Created" placement="top"><ScheduleOutlined/></Tooltip> : <span>{new Date(record.sub_created).toDateString() + " : " + new Date(record.sub_created).toLocaleTimeString()}</span>

                                    <div>
                                        <CalendarOutlined/> :
                                        {record.interview.length !== 0 ?
                                            record.interview.map((item, i) =>
                                                <div>
                                                    <span style={{fontWeight: 'bold'}}>{i} :</span>
                                                    <span style={{marginLeft: '10px'}}>  {item}</span>
                                                    <br/>
                                                    <br/>
                                                </div>
                                            )
                                            : <div>No interviews</div>
                                        }
                                    </div>

                                </div>}

                            dataSource={this.state.submissionList}
                            pagination={false}

                        />
                        <div className="rightpagination">
                            <Pagination
                                showSizeChanger
                                onShowSizeChange={this.onPageChange}
                                style={{float: "right"}}
                                current={this.state.current_page}
                                onChange={this.onPageChange}
                                total={this.state.total}
                                pageSize={this.state.current_size}
                            />
                        </div>
                        <br/>
                        <br/><br/>
                        <br/><br/>
                        <br/>
                    </div>
                    :
                    <div>
                        Loading...
                    </div>}
            </Container-fluid>


        );
    }
}

export default OldSubmission;
