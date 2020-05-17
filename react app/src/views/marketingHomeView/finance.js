import React, {Component} from 'react';
import {searchConsultants, getFinance} from "../../services/service";
import FinanceFilter from "../../components/Finance/financeFilter";
import { Pagination, Table} from "antd";
import {CloseCircleOutlined,IssuesCloseOutlined,CheckCircleOutlined} from "@ant-design/icons"
import Timesheet from "../marketingHomeView/timesheet";


class Finance extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCon: '',
            consultantData: [],
            financeData: [],
            current_size: 10,
            current_page: 1,
            total: null,
            status: false,
            modalTimesheet: false,
            consultantId: '',
            query:''
        }
        this.getData = this.getData.bind(this);
        this.onConsultantChange = this.onConsultantChange.bind(this);
    }

    componentDidMount() {
        localStorage.removeItem('CID');
        this.getData(this.state.current_page, this.state.current_size, this.state.selectedCon,this.state.query)
        this.getAllConsultant('')

    }

    getData(page, size, consultant,query) {
        getFinance(page, size, consultant,query)
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
                        financeData: res.results,
                        total: res.total,
                    })

                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    getAllConsultant=(query)=> {

        searchConsultants(query)
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
                        status: true
                    });
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    onConsultantChange(value) {

        if (value !== undefined) {
            this.setState({
                selectedCon: value
            }, () =>this.getData(1, 10, value,this.state.query))
        } else {
            value = null
            this.setState({
                selectedCon: ''
            }, () =>this.getData(1, 10, '',this.state.query))
        }
    }
    onSearch = (e) => {
        if (e.target.value !== undefined) {
            this.setState({query: e.target.value},()=>this.getData(1,10,this.state.selectedCon,this.state.query))
        } else {
            e.target.value = null
            this.setState({query: ''},()=>this.getData(1,10,this.state.selectedCon,''))
        }
    }

    onPageChange = (page, size) => {
        this.setState({
            current_page: page,
            current_size: size
        }, () => this.getData(page, size, this.state.selectedCon,this.state.query));

    };
    closeModal = () => {
        this.setState({
            modalTimesheet: false
        })
    };
    openModal = (id) => {
        this.setState({
            modalTimesheet: true,
            consultantId: id
        }, () => {
            localStorage.setItem('CID',id)
            this.props.history.push('/timesheet')
        })

    }

    render() {
        const columns = [
            {
                title: 'Consultant Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',

                render: (text, record) => (
                    <span onClick={() => this.openModal(record.id)}>
                        {text}
                    </span>
                ),
            },
            {
                title: 'Client Name',
                dataIndex: 'project.client',
                key: 'project.client',
                width: '10%',
                render: (text, record) => (

                    <span onClick={() => this.openModal(record.id)}>
                        {record.project === null ?
                            'Not on Project' :
                            text
                        }
                    </span>

                ),
            },
            {
                title: 'Vendor Company',
                dataIndex: 'project.vendor',
                key: 'project.vendor',
                width: '10%',
                render: (text, record) => (

                    <span onClick={() => this.openModal(record.id)}>
                        {record.project === null ?
                            'Not on Project' :
                            text
                        }
                    </span>

                ),
            },{
                title: 'Team',
                dataIndex: 'project.employer',
                key: 'project.employer',
                width: '10%',
                render: (text, record) => (

                    <span onClick={() => this.openModal(record.id)}>
                        {record.project === null ?
                            'Not on Project' :
                            text
                        }
                    </span>

                ),
            },
            {
                title: 'Start Date',
                dataIndex: 'project.start_date',
                key: 'project.start_date',
                width: '10%',
                render: (text, record) => (
                    <span onClick={() => this.openModal(record.id)}>
                        {record.project === null ?
                            'Not on Project' :
                            text === null ? "null" : text
                        }
                    </span>


                ),
            },
            {
                title: 'Timesheet Status',
                dataIndex: 'ts_status',
                key: 'ts_status',
                width: '15%',
                render: (text, record) => (
                    <span onClick={() => this.openModal(record.id)}>
                        {record.project === null ?
                            'Not on Project' :
                            <div>
                                {text.rejected ? <span><CloseCircleOutlined style={{color:"#b71e0d",fontSize:"18px",marginRight:"4px",marginLeft:"2px"}} />Rejected</span> : null}
                                {text.submitted ?  <span><IssuesCloseOutlined style={{color:"#ffb60b",fontSize:"18px",marginRight:"4px",marginLeft:"2px"}}  /> Pending</span>:
                                    <span>   <CheckCircleOutlined style={{color:"#007700",fontSize:"18px",marginRight:"4px",marginLeft:"2px"}} />Approved</span>}
                            </div>
                        }
                    </span>


                ),
            },
        ];
        return (
            this.state.status &&
            <div className="financeteble">
                
                 <div className="righttitle">
                   <h1> Finance </h1>
                </div>
              
                <div className="righttitle2">
                    <FinanceFilter
                        onChange={this.onConsultantChange}
                        onSearch={this.onSearch}
                        searchConsultant={this.getAllConsultant}
                        query={this.state.query}
                        consultantList={this.state.consultantList}/>

                  
                </div>
                
                <br clear="all" />

                <Table
                    rowKey={(record) => record.id.toString()}
                    columns={columns}
                    dataSource={this.state.financeData}
                    pagination={false}
                />

                <br/>

                <div className="rightpagination">
                    <Pagination
                        showSizeChanger
                        onShowSizeChange={this.onPageChange}
                        onChange={this.onPageChange}
                        style={{float: "right"}}
                        current={this.state.current_page}
                        pageSize={this.state.current_size}
                        total={this.state.total}
                    />
                </div>

                {this.state.modalTimesheet &&
                <Timesheet consultantId={this.state.consultantId}/>
                }
            </div>
        )
    }
}

export default Finance;
