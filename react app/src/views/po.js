import React, {Component} from 'react';
import {getAllPO, mailOnboarding, onPOSearch, onSpecificFilterPO} from "../services/service";
import {
    Table, Input, Button, Pagination, Radio, Progress, Row, Col, Card, Drawer, message, Menu, Modal,
    Dropdown
} from 'antd';
import {MoreOutlined} from "@ant-design/icons"
import ViewPO from "../components/viewPO";
import POCancel from '../components/poCancel'
import POTerminate from '../components/poTerminate'
import moment from 'moment-timezone';

const {TextArea} = Input;
const {confirm} = Modal;

class PO extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            po: false,
            poData: [],
            status: null,
            modalIsOpen: false,
            po_details: {},
            searchText: '',
            selectedRowKeys: [],
            current_page: 1,
            filter: 'all',
            total: null,
            check_list: {},
            on_boarded: 0,
            received: 0,
            joined: 0,
            new: 0,
            not_joined: 0,
            current_size: 10,
            query: '',
            filter_status: '',
            t: null,
            flagArray: [false],
            cancel: false,
            terminate: false,
            cancelStatus: false,
            terminateStatus: false,
            cancel_reasons: [
                {
                    id: 0,
                    name: 'Client cancelled',
                    value: 'client-cancelled',
                },
                {
                    id: 1,
                    name: 'Candidate absconded',
                    value: 'candidate-absconded',
                },
                {
                    id: 2,
                    name: 'Candidate denied joining',
                    value: 'candidate-denied-',
                },
                {
                    id: 3,
                    name: 'Contract conflicts',
                    value: 'contract-conflicts',
                },
                {
                    id: 4,
                    name: 'Other',
                    value: 'other'
                },
                {
                    id: 5,
                    name: 'Dual Offer',
                    value: 'dual-offer',
                },
            ],
            cancel_types: [
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
            terminate_reasons: [
                {
                    id: 0,
                    name: 'Client fired',
                    value: 'client-fired-'
                },
                {
                    id: 1,
                    name: 'Resigned',
                    value: 'resigned-'
                },
                {
                    id: 2,
                    name: 'Completed'
                },
                {
                    id: 3,
                    name: 'Extension'
                },
            ],
            reason: '',
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
            type: '',
            feedback: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getAllPO = this.getAllPO.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.checklistStatus = this.checklistStatus.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.mailToOnboarding = this.mailToOnboarding.bind(this);

    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onUpdateChange(id, po) {

        let temp = this.state.poData;

        let chInd = -1;
        let temp_poData;
        temp_poData = {
            id: po.id,
            consultant_name: po.consultant_name,
            vendor: po.company_name,
            client: po.client,
            rate: po.rate,
            marketer: po.marketer_name,
            obj: po
        }

        for (let i in temp) {
            if (temp[i].id === id) {
                chInd = i
            }
        }

        temp[chInd] = temp_poData;

        this.setState({
            poData: temp
        })

    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false, view: false, terminateStatus: false, cancelStatus: false});
    }

    componentDidMount() {
        this.getAllPO(1, this.state.filter, 10, this.state.query)
    }

    getAllPO(page, filter, size, val) {
        let temp_poData = []
        let temp_obj = {}
        this.setState({poData: []})
        getAllPO(page, filter, size, val)
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
                }
                else if (status === 200) {
                    console.log("poData", res.results)
                    res.results.map((item, i) => (
                            temp_obj = {
                                check_list: item.check_list,
                                id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                rate: item.rate,
                                marketer: item.marketer_name,
                                obj: item,
                                location: item.location,
                                status: item.status,
                                created: item.created
                            },

                                temp_poData.push(temp_obj)

                        )
                    )

                    this.setState({
                        poData: temp_poData,
                        total: res.counts.total,
                        t: res.counts.total,
                        on_boarded: res.counts.on_boarded,
                        joined: res.counts.joined,
                        received: res.counts.received,
                        new: res.counts.new,
                        not_joined: res.counts.not_joined,
                        status: status
                    })
                }
                else {
                    this.setState({status: status})
                }
            })
    }

    checklistStatus(checkList, id) {

        let temp = this.state.poData;
        let test = {};
        let chInd = -1;

        for (let i in temp) {
            if (temp[i].id === id) {
                test = {
                    'id': id,
                    'consultant_name': temp[i].consultant_name,
                    'vendor': temp[i].vendor,
                    'client': temp[i].client,
                    'rate': temp[i].rate,
                    'marketer': temp[i].marketer,
                    'obj': temp[i],
                    'location': temp[i].location,
                    'check_list': checkList,
                    'status': temp[i].status,
                    'created': temp[i].created
                }
                chInd = i
            }
        }

        temp[chInd] = test;

        this.setState({
            poData: temp
        })

    }

    onUpdateChange(id, po) {

        let temp = this.state.poData;
        let test = {};
        let chInd = -1;

        for (let i in temp) {
            if (temp[i].id === id) {
                test = {
                    'id': id,
                    'consultant_name': po.consultant_name,
                    'vendor': po.vendor,
                    'client': po.client,
                    'rate': po.rate,
                    'marketer': po.marketer,
                    'obj': po,
                    'location': temp[i].location,
                    'check_list': po.checkList,
                    'status': temp[i].status,
                    'created': temp[i].created,
                }
                chInd = i
            }
        }

        temp[chInd] = test;

        this.setState({
            poData: temp
        })

    }

    onPageChange = (page, size) => {
        this.setState({
            current_size: size,
            current_page: page
        });

        if (this.state.filter_status !== '') {
            this.onSpecificFilter(this.state.filter, this.state.filter_status, page, size, this.state.total, this.state.query)
        }
        else {
            this.getAllPO(page, this.state.filter, size, this.state.query);
        }
    };
    onFilterChange = e => {

        this.setState({
            filter: e.target.value,
            current_size: 10,
            current_page: 1
        });

        if (this.state.filter_status !== '') {
            this.onSpecificFilter(e.target.value, this.state.filter_status, 1, 10, this.state.total, this.state.query)
        }
        else {
            this.getAllPO(1, e.target.value, 10, this.state.query)
        }
    };

    onSearch(value, page, size, status, filter) {
        this.setState({poData: [], query: value})
        onPOSearch(value, page, size, status, filter)
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

                    let temp_poData = []
                    let temp_obj = {}

                    res.results.map((item, i) => (
                            temp_obj = {
                                id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                rate: item.rate,
                                marketer: item.marketer_name,
                                obj: item,
                                check_list: item.check_list,
                                location: item.location,
                                status: item.status,
                                created: item.created
                            },

                                temp_poData.push(temp_obj)

                        )
                    )
                    this.setState({
                        poData: temp_poData,
                        total: res.counts.total,
                        t: res.counts.total,
                        on_boarded: res.counts.on_boarded,
                        received: res.counts.received,
                        joined: res.counts.joined,
                        new: res.counts.new,
                        not_joined: res.counts.not_joined,
                        status: status
                    })

                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    mailToOnboarding(id) {

        mailOnboarding(id)
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
                } else if (status === 200) {
                    message.success("Mail sent.")
                }
                else {
                    message.error("Something went wrong.")
                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    onSpecificFilter(filter, val, page, size, total, query) {

        let temp = this.state.flagArray;
        switch (val) {
            case '':
                temp[0] = true
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = false
                this.setState({flagArray: temp})
                break;
            case 'new':
                temp[0] = false
                temp[1] = true
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = false
                this.setState({flagArray: temp})
                break;
            case 'received':
                temp[0] = false
                temp[1] = false
                temp[2] = true
                temp[3] = false
                temp[4] = false
                temp[5] = false
                this.setState({flagArray: temp})
                break;
            case 'on_boarded':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = true
                temp[4] = false
                temp[5] = false
                this.setState({flagArray: temp})
                break;
            case 'not_joined':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = true
                temp[5] = false
                this.setState({flagArray: temp})
                break;
            case 'joined':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = false
                temp[4] = false
                temp[5] = true
                this.setState({flagArray: temp})
                break;
        }
        this.setState({
            poData: [],
            loading: false,
            filter_status: val,
            current_page: page,
            current_size: size,
            total: total
        })
        onSpecificFilterPO(filter, val, page, size, query)
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

                    let temp_poData = []
                    let temp_obj = {}

                    res.results.map((item, i) => (
                            temp_obj = {
                                id: item.id,
                                consultant_name: item.consultant_name,
                                vendor: item.company_name,
                                client: item.client,
                                rate: item.rate,
                                marketer: item.marketer_name,
                                obj: item,
                                check_list: item.check_list,
                                location: item.location,
                                status: item.status,
                                created: item.created
                            },
                                temp_poData.push(temp_obj)

                        )
                    )
                    this.setState({
                        poData: temp_poData,

//total: res.counts.total,

                        total: filter !== 'all' ? res.counts.total : total,
                        t: res.counts.total,
                        on_boarded: res.counts.on_boarded,
                        received: res.counts.received,
                        joined: res.counts.joined,
                        new: res.counts.new,
                        not_joined: res.counts.not_joined,
                        status: status,
                        loading: true
                    })

                }
            })
            .catch(error => {
                console.log(error)
            })
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

    showCancelConfirm(id) {
        const self = this;
        confirm({
            title: 'Are you sure cancel this PO?',
            visible: this.state.cancel,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({cancel: true, cancelStatus: true})
                //self.showCancel(id)
            },
            onCancel() {
                self.setState({cancel: false, cancelStatus: false})
                console.log('Cancel')
            },
        });
    }

    showTerminateConfirm(id) {
        const self = this;
        confirm({
            title: 'Are you sure terminate this PO?',
            visible: this.state.terminate,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({terminate: true, terminateStatus: true})
                //self.showTerminate(id)
            },
            onCancel() {
                self.setState({terminate: false, terminateStatus: false})
                console.log('Cancel')
            },
        });
    }

    render() {
        const marketer = localStorage.getItem('NAME');
        const {selectedRowKeys} = this.state;
        const self_menu = (status, data, project, i) => (
            <Menu>

                <Menu.Item key="0" onClick={() => {
                    this.setState({po_details: data.obj})
                    this.showCancelConfirm(data.id)
                }}>
                    Cancel
                </Menu.Item>

                <Menu.Item key="1" onClick={() => {
                    this.setState({po_details: data.obj})
                    this.showTerminateConfirm(data.id)
                }}>
                    Terminate
                </Menu.Item>

            </Menu>
        )
        const columns = [
                {
                    title: 'Consultant',
                    dataIndex: 'consultant_name',
                    key: 'consultant_name',
                    width: '12%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  {text}
  </span>
                    )
                },
                {
                    title: 'Location',
                    dataIndex: 'location',
                    key: 'location',
                    width: '8%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  {text}
  </span>
                    )
                },
                {
                    title: 'Vendor Company',
                    dataIndex: 'vendor',
                    key: 'vendor',
                    width: '10%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  {text}
  </span>
                    )
                },
                {
                    title: 'Client',
                    dataIndex: 'client',
                    key: 'client',
                    width: '10%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  {text}
  </span>
                    )
                },
                {
                    title: 'Rate',
                    dataIndex: 'rate',
                    key: 'rate',
                    width: '3%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  ${text}
  </span>
                    )
                },
                {
                    title: 'Marketer',
                    dataIndex: 'marketer',
                    key: 'marketer',
                    width: '10%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
  {text}
  </span>
                    )
                },
                {
                    title: 'Created On',
                    dataIndex: 'created',
                    key: 'created',
                    width: '12%',
                    render: (text, record) => (
                        <span onClick={() => {
                            this.setState({po_details: record.obj, view: true})
                        }}>
                            {new Date(text).toDateString() + " :: " + moment(text).tz("America/Toronto").format("hh:mm A")}
  </span>
                    )
                },

                {
                    title: 'Actions',
                    key: "action",
                    width: '12%',
                    render: (text, record) => (

                        <span>
 
<div>
  {record.check_list.status
      ?
      <Progress type="circle" percent={100} width={30}/>
      :
      (record.check_list.msa_signed + record.check_list.work_order_signed + record.check_list.client_address + record.check_list.vendor_address + record.check_list.start_date + record.check_list.reporting_details) % 6 === 5 ?
          <Progress type="circle" percent={75} width={30}/> :
          (record.check_list.msa_signed + record.check_list.work_order_signed + record.check_list.client_address + record.check_list.vendor_address + record.check_list.start_date + record.check_list.reporting_details) % 6 === 4 ?
              <Progress type="circle" percent={60} width={30}/> :
              (record.check_list.msa_signed + record.check_list.work_order_signed + record.check_list.client_address + record.check_list.vendor_address + record.check_list.start_date + record.check_list.reporting_details) % 6 === 3 ?

                  <Progress type="circle" percent={45} width={30}/> :
                  (record.check_list.msa_signed + record.check_list.work_order_signed + record.check_list.client_address + record.check_list.vendor_address + record.check_list.start_date + record.check_list.reporting_details) % 6 === 2 ?
                      <Progress type="circle" percent={30} width={30}/> :
                      (record.check_list.msa_signed + record.check_list.work_order_signed + record.check_list.client_address + record.check_list.vendor_address + record.check_list.start_date + record.check_list.reporting_details) % 6 === 1 ?
                          <Progress type="circle" percent={15} width={30}/> :

                          <Progress type="circle" percent={0} width={30}/>
  }
    {
        record.check_list.status ?
            <Button disabled={!(record.marketer.toLowerCase() === marketer.toLowerCase())}
                    style={{marginLeft: '10px'}}
                    onClick={() => this.mailToOnboarding(record.id)}>Mail to
                Onboarding</Button> : null
    }
 
</div>
 
</span>
                    )
                },
                {
                    title: '',
                    dataIndex: 'status',
                    key: 'actions',
                    width: '8%',
                    render: (text, record, i) => (
                        record.marketer.toLowerCase() === marketer.toLowerCase()
                        &&
                        (text === 'new' || text === 'signed' || text === 'on_boarded' || text === 'received' || text === 'joined' )
                            ?
                            <Dropdown trigger={['click']} overlay={self_menu(text, record, record.project, i)}>
                                <MoreOutlined style={{marginLeft: 70}}/>
                            </Dropdown>
                            :
                            null

                    )
                }

            ]
            ;

        return (

            <div>
                <br/>
                <Row className="box" gutter={8}>

                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[0] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, '', 1, 10, this.state.t, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[0] ? '#2688db' : null}}>{this.state.t === 0 ? '0' : this.state.t}</span>}
                            bordered={false}>
                            Total
                        </Card>
                    </Col>
                    <Col
                        onClick={() => this.onSpecificFilter(this.state.filter, 'new', 1, 10, this.state.new, this.state.query)}
                        span={2}>
                        <Card bodyStyle={{color: this.state.flagArray[1] ? '#2688db' : null}}
                              title={<span
                                  style={{color: this.state.flagArray[1] ? '#2688db' : null}}>{this.state.new === 0 ? '0' : this.state.new}</span>}
                              bordered={false}>
                            New
                        </Card>
                    </Col>
                    <Col
                        onClick={() => this.onSpecificFilter(this.state.filter, 'received', 1, 10, this.state.received, this.state.query)}
                        span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[2] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[2] ? '#2688db' : null}}>{this.state.received === 0 ? '0' : this.state.received}</span>}
                            bordered={false}>
                            Received
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[3] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'on_boarded', 1, 10, this.state.on_boarded, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[3] ? '#2688db' : null}}>{this.state.on_boarded === 0 ? '0' : this.state.on_boarded}</span>}
                            bordered={false}>
                            Onboarded
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[4] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'not_joined', 1, 10, this.state.not_joined, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[4] ? '#2688db' : null}}>{this.state.not_joined === 0 ? '0' : this.state.not_joined}</span>}
                            bordered={false}>
                            Not Joined
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[5] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.filter, 'joined', 1, 10, this.state.joined, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[5] ? '#2688db' : null}}>{this.state.joined === 0 ? '0' : this.state.joined}</span>}
                            bordered={false}>
                            Joined
                        </Card>
                    </Col>

                    <div className="leadsearch">
                        <Input.Search
                            placeholder="Search PO"
                            onChange={e => this.onSearch(e.target.value, 1, 10, this.state.filter_status, this.state.filter)}
                            onSearch={value => this.onSearch(value, 1, 10, this.state.filter_status, this.state.filter)}
                            style={{width: '200px'}}
                        />
                    </div>

                </Row>
                <br/>

                <div className="mapbox submapbox">
                    <Radio.Group defaultValue="all" buttonStyle="solid" style={{}} onChange={this.onFilterChange}
                                 value={this.state.filter}>
                        <Radio.Button value="all">All</Radio.Button>
                        <Radio.Button value="today">Today</Radio.Button>
                        <Radio.Button value="week">Last Week</Radio.Button>
                        <Radio.Button value="month">Last Month</Radio.Button>
                    </Radio.Group>
                </div>

                <br clear="all"/>
                { this.state.status === 200 ?
                    <div>
                        <Table
                            // rowSelection={rowSelection}
                            rowKey={record => record.id.toString()}
                            columns={columns}
                            dataSource={this.state.poData}
                            pagination={false}
                        />

                        <br/>

                        <div className="rightpagination">
                            <Pagination
                                style={{float: "right"}}
                                current={this.state.current_page}
                                showSizeChanger
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onPageChange}
                                total={this.state.total}
                                pageSizeOptions={['10', '20', '30', '40']}
                                pageSize={this.state.current_size}
                            />
                        </div>
                        {this.state.view &&
                        <Drawer
                            title="View Project"
                            width={920}
                            onClose={this.closeModal}
                            visible={this.state.view}
                        >
                            <ViewPO
                                onUpdateChange={this.onUpdateChange}
                                poId={this.state.po_details.id}
                                handleClose={this.closeModal}
                                checklistStatus={this.checklistStatus}
                            />
                        </Drawer>
                        }
                        <Modal
                            title="Termination Feedback"
                            visible={ this.state.terminateStatus }
                            footer={null}
                            onCancel={this.closeModal}
                        >
                            <POTerminate
                                handleClose={this.closeModal}
                                poId={this.state.po_details.id}/>
                        </Modal>
                        <Modal
                            title="Cancelled Feedback"
                            visible={ this.state.cancelStatus }
                            footer={null}
                            onCancel={this.closeModal}
                        >
                            <POCancel
                                handleClose={this.closeModal}
                                poId={this.state.po_details.id}/>
                        </Modal>

                    </div>
                    : this.state.status === 400 || this.state.status === 500 ?
                        <div>Internal server error</div> : null}
            </div>

        )
            ;
    }
}

export default PO;
