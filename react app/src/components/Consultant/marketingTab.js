import React, {Component} from 'react';
import "../../App.css";
import {Select, Table} from "antd";
import {
    getAllConsultantMarketing,
} from "../../services/service";
import moment from "moment-timezone";

class MarketingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'submission',
            data: [],
            loading: false,
            status: 0

        };
    }

    componentDidMount() {
        this.getAllConsultantMarketing(this.props.consultantId, this.state.type)
    }

    getAllConsultantMarketing(id, type) {
        this.setState({loading: false,});
        getAllConsultantMarketing(id, type)
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
                        data: res.results,
                        status: status,
                    })
                }
            })
    }

    render() {
        const subColumns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant_name',
                key: 'consultant_name',
                width: '15%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Vendor Company',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '12%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Client Company',
                dataIndex: 'client',
                key: 'client',
                width: '10%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Job Location',
                dataIndex: 'city',
                key: 'city',
                width: '8%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '5%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),

            },
            {
                title: 'Marketer',
                dataIndex: 'marketer_name',
                key: 'marketer_name',
                width: '12%',
                render: (text) => (
                    <span>{text}
                    </span>

                ),
            }];
        const intColumns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant_name',
                key: 'consultant_name',
                width: '9%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Job Title',
                dataIndex: 'job_title',
                key: 'job_title',
                width: '5%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Vendor Company',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '9%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Client Name',
                dataIndex: 'client',
                key: 'client',
                width: '9%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Marketer',
                dataIndex: 'marketer_name',
                key: 'marketer_name',
                width: '4%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Type',
                dataIndex: 'interview_mode',
                key: 'interview_mode',
                width: '5%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Round',
                dataIndex: 'round',
                key: 'round',
                width: '1%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Call Supervisor',
                dataIndex: 'ctb',
                key: 'ctb',
                width: '10%',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },
            {
                title: 'Start time',
                dataIndex: 'start_time',
                key: 'start_time',
                width: '10%',
                render: (text) => (
                    <span>
                        {moment(text).format("DD-MM-YYYY HH:mm")}
                    </span>
                )
            },
            {
                title: 'End Tine',
                dataIndex: 'end_time',
                key: 'end_time',
                width: '10%',
                render: (text) => (
                    <span>
                        {moment(text).format("DD-MM-YYYY HH:mm")}
                    </span>
                )
            },
            {
                title: 'Status',
                width: '5%',
                dataIndex: 'status',
                key: 'status',
                render: (text) => (
                    <span>
                        {text}
                    </span>
                )
            },

        ];
        const poColumns = [
            {
                title: 'Consultant',
                dataIndex: 'consultant_name',
                key: 'consultant_name',
                width: '12%',
                render: (text) => (
                    <span>
                        {text}
                     </span>
                )
            },
            {
                title: 'Location',
                dataIndex: 'city',
                key: 'city',
                width: '8%',
                render: (text) => (
                    <span>
                        {text}
                     </span>
                )
            },
            {
                title: 'Vendor Company',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '10%',
                render: (text) => (
                    <span>
                        {text}
                     </span>
                )
            },
            {
                title: 'Client',
                dataIndex: 'client',
                key: 'client',
                width: '10%',
                render: (text) => (
                    <span>
                        {text}
                     </span>
                )
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '3%',
                render: (text) => (
                    <span>
                        ${text}
                     </span>
                )
            },
            {
                title: 'Marketer',
                dataIndex: 'marketer_name',
                key: 'marketer_name',
                width: '10%',
                render: (text) => (
                    <span>
                        {text}
                     </span>
                )
            },
            {
                title: 'Created On',
                dataIndex: 'created',
                key: 'created',
                width: '12%',
                render: (text) => (
                    <span>
                            {new Date(text).toDateString() + " :: " + moment(text).tz("America/Toronto").format("hh:mm A")}
                    </span>
                )
            },

        ];
        return (

            <div>
                <Select
                    placeholder="Select"
                    value={this.state.type}
                    onChange={(e) => {
                        this.setState({type: e});
                        this.getAllConsultantMarketing(this.props.consultantId, e)
                    }}>

                    <Select.Option key="0" value="submission">Submission</Select.Option>
                    <Select.Option key="1" value="interview">Interview</Select.Option>
                    <Select.Option key="2" value="project">Purchase Order</Select.Option>


                </Select>
                <Table
                    columns={this.state.type === 'submission' ? subColumns : this.state.type === 'interview' ? intColumns : poColumns}
                    pagination={false}
                    dataSource={this.state.data}
                />
            </div>


        )
    }
}

export default MarketingTab;
