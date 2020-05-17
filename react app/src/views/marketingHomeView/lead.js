import React, {Component} from 'react';
import {
    createArchive,
    getAllLeads,
    getBenchByCity,
    getLeadByCity,
    onLeadSearch,
    onSpecificFilterLead
} from "../../services/service";
import Icon from "@material-ui/core/Icon";
import LeadMap from "../../components/Maps/leadMap";
import "../../App.css"
import {
    Table, Input, Button, Divider, Pagination, Radio, Card, Row, Col, Spin, Drawer
} from 'antd';
import ViewLead from "../../components/viewForms/viewLead";
import {message} from "antd/lib/index";
import Archive from "./archive";
import Geocode from "react-geocode";
import ThreeStepForm from "../../components/createForms/threeStepForm/threeStepForm";

class Lead extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            apply: false,
            view: false,
            leadData: [],
            status: null,
            modalIsOpen: false,
            viewModal: false,
            job_desc: '',
            location: '',
            city: [],
            mapData: {},
            cityName: '',
            lead_details: {},
            editModal: false,
            hideMap: false,
            checked: [false],
            archivedData: [],
            callout_status: [false],
            mapleadData: [],
            mapBenchData: [],
            benchCity: [],
            mapStatus: false,
            current_page: 1,
            filter: 'all',
            total: null,
            new: null,
            sub: null,
            draft: null,
            archived: null,
            all: true,
            flagMap: true,
            screenStatus: true,
            flag: false,
            lead_ids: [],
            addSub: false,
            addCompany: false,
            addVendor: false,
            current_size: 10,
            loading: false,
            query: '',
            filter_status: '',
            filter_statusFlag: false,
            archivedStatus: false,
            t: 0,
            flagArray: [false],
            setArchive: 0
        };
        this.openModal = this.openModal.bind(this);
        this.openSubModal = this.openSubModal.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.archiveSingleId = this.archiveSingleId.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.getAllLeads = this.getAllLeads.bind(this);
        this.onArchive = this.onArchive.bind(this);
        this.onSelection = this.onSelection.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.setAll = this.setAll.bind(this);
        this.setHideStatus = this.setHideStatus.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.getLead = this.getLead.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);

    }

    onSelectChange = (selectedRowKeys) => {
        let self = this;
        let tempArr = []
        let to_be_archived = false
        selectedRowKeys.forEach(function (ele) {
            console.log(ele)

            self.state.leadData.map((item, i) => {

                    if (item.id === parseInt(ele)) {
                        if (item.status === 'new' || item.status === 'draft') {
                            to_be_archived = true;
                            tempArr.push(ele);
                        }
                    }
                }
            )


        });
        if (to_be_archived) {
            this.setState({archivedData: tempArr, selectedRowKeys})
        } else {
            message.error("Already submitted")
            this.setState({archivedData: [], selectedRowKeys: []})
        }


    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    openSubModal() {
        console.log("in opensub")
        this.setState({addSub: true});
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            viewModal: false,
            apply: false,
            view: false,
            addSub: false,
            addCompany: false,
            addVendor: false,
            profile: false
        });
    }

    setStatus() {
        this.setState({flag: true})
    }

    onUpdateChange(id, lead) {
        console.log(lead)
        let temp = this.state.leadData;
        console.log(temp)
        let chInd = -1;

        for (let i in temp) {
            if (temp[i].id === id) {
                chInd = i
            }
        }


        temp[chInd] = lead;

        this.setState({
            leadData: temp
        })

    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        console.log(data)
        if (!data) {
            this.props.history.push("/login")
        }
        else{
            this.props.history.push("/home")
        }
        //this.getLatLng();
        this.getAllLeads(this.state.current_page, this.state.query, this.state.filter, this.state.current_size);

    }

    setHideStatus() {
        this.setState({flagMap: true})
    }

    getAllLeads(page, query, filter, size) {

        this.setState({leadData: [], loading: false})
        getAllLeads(page, query, filter, size)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status !== 200) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        total: res.counts.total,
                        t: res.counts.total,
                        new: res.counts.new,
                        archived: res.counts.archive,
                        sub: res.counts.sub,
                        draft: res.counts.draft,
                    })
                    console.log(res.results)
                    res.results.map((item, i) => (

                        this.state.leadData.push(item)

                    ));
                    this.props.mapLeadData(this.state.leadData)
                    this.props.setMapStatus(true)
                    this.setState({status: status, loading: true})
                }
            })
    }

    getLatLng() {
        getLeadByCity()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                if (status === 401) {
                    localStorage.removeItem('DATA');

                } else {
                    this.setState({mapData: res.results});

                    res.results.map((item, i) => (
                        Geocode.fromAddress(item.location).then(
                            response => {

                                const data = {
                                    cityName: item.location,
                                    lat: response.results[0].geometry.location.lat,
                                    lng: response.results[0].geometry.location.lng
                                }


                                this.state.city.push(data)
                                this.setState({status: status, flagMap: true})

                            },
                            error => {
                                console.error(error);
                            }
                        )
                    ))
                }
            })

    }

    getLatLngBench(status) {
        getBenchByCity(status)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                if (status === 401) {
                    localStorage.removeItem('DATA');
                } else {
                    res.results.map((item, i) =>
                        item.location != null && item.total != 0
                            ?
                            this.state.mapBenchData.push(item) : null
                    )

                    res.results.map((item, i) => (
                        item.location != null && item.total != 0 ?
                            Geocode.fromAddress(item.location).then(
                                response => {

                                    const data = {
                                        cityName: item.location,
                                        lat: response.results[0].geometry.location.lat,
                                        lng: response.results[0].geometry.location.lng
                                    }


                                    this.state.benchCity.push(data)
                                    this.setState({status: status})
                                    this.setHideStatus()

                                },
                                error => {
                                    console.error(error);
                                }
                            ) : null
                    ))
                }
            })

    }

    onSelection(data) {

    }

    onArchive() {
        console.log(this.state.archivedData)
        var body = {};
        body = {
            lead_ids: this.state.archivedData,
        }
        createArchive(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                } else {
                    console.log(res)
                    message.success("Archived Lead successfully.")
                    window.location.reload();
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    onPageChange = (page, size) => {
        console.log("------", size)
        this.setState({
            current_page: page,
            current_size: size
        });
        if (this.state.query !== '') {
            this.onSearch(this.state.query, page, size, this.state.filter_status, this.state.filter)
        } else if (this.state.filter_status !== '') {
            this.onSpecificFilter(this.state.filter_status, this.state.query, page, size, this.state.t)
        } else {
            this.getAllLeads(page, this.state.query, this.state.filter, size)
        }
    };

    archiveSingleId(id) {
        const body = {
            lead_id: id,
            status: 'archived'
        }
        createArchive(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                //window.location.reload();
                message.success("Archived Lead successfully.")
            })
            .catch(error => {
                console.log(error)
            })

    }

    onFilterChange = e => {

        this.setState({
            filter: e.target.value,
        });
        this.getAllLeads(1, this.state.query, e.target.value, this.state.current_size)
    };

    onSearch(value, page, size, status, filter) {
        this.setState({loading: false, query: value})
        onLeadSearch(value, page, size, status, filter)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        loading: true,
                        total: res.counts.total,
                        t: res.counts.total,
                        new: res.counts.new,
                        archived: res.counts.archive,
                        sub: res.counts.sub,
                        draft: res.counts.draft,
                        status: status
                    })
                    console.log(res.results)

                    this.props.mapLeadData(res.results)
                    this.props.setMapStatus(true)

                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    setAll(value) {
        this.setState({all: value})
    }

    getLead(lead) {
        console.log(lead)
        this.state.leadData.unshift(lead)
    }

    onSpecificFilter(val, query, page, size, total) {
        console.log(val)
        let temp = this.state.flagArray;
        switch (val) {
            case '':
                temp[0] = true
                temp[1] = false
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'draft':
                temp[0] = false
                temp[1] = true
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'new':
                temp[0] = false
                temp[1] = false
                temp[2] = true
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'sub':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = true
                this.setState({flagArray: temp})
                break;
        }
        this.setState({
            loading: false,
            filter_status: val,
            current_page: 1,
            current_size: 10,
            total: total,
            archivedStatus: false
        })
        onSpecificFilterLead(val, query, page, size)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                } else {
                    console.log(res)
                    this.setState({
                        //total: res.counts.total,
                        new: res.counts.new,
                        archived: res.counts.archive,
                        sub: res.counts.sub,
                        draft: res.counts.draft,
                        leadData: res.results,

                    })
                    console.log(res.results)
                    this.props.mapLeadData(res.results)
                    this.props.setMapStatus(true)
                    this.setState({
                        status: status,
                        loading: true
                    })
                }
            })
    }

    render() {
        const {selectedRowKeys} = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection(this.state.leadData),

        };
        const columns = [
            {
                title: 'Job Title',
                dataIndex: 'job_title',
                key: 'job_title',
                width: '20%',

                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            }, {
                title: ' Job Location',
                dataIndex: 'city',
                key: 'city',
                width: '0%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            }, {
                title: 'Vendor Company',
                dataIndex: 'company_name',
                key: 'company_name',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '0%',
                render: (text, record) => (

                    <span>
                        {text}
                        {/*{*/}
                        {/*text === 'locked' ?*/}
                        {/*<Icon style={{fontSize: 18, color: 'white', backgroundColor: 'green'}}>check</Icon> :*/}
                        {/*<Icon style={{fontSize: 18, color: 'white', backgroundColor: 'red'}}>cancel</Icon>*/}
                        {/*}*/}
                    </span>
                )
            },
            {
                title: '# Submissions',
                dataIndex: 'submission_count',
                key: 'submission_count',
                width: '10%',
                render: (text, record) => (

                    <div style={{
                        width: 20,
                        borderRadius: 10,
                        backgroundColor: '#2688db',
                        color: 'white',
                        margin: 'auto',
                        marginLeft: 44
                    }}>
                        <div style={{marginLeft: 6}}>{text}</div>
                    </div>
                )
            },
            {
                title: 'Actions',
                dataIndex: 'vendor__name',
                key: "action",
                width: '33%',
                render: (text, record) => (
                    <span>
           <Icon title="edit" style={{fontSize: 18, color: '#2688db', float: 'left'}} onClick={() => {
               this.setState({lead_details: record})
               this.setState({view: true})
           }}>edit</Icon>

                        {/*<Icon title="archive" style={{fontSize: 18, color: '#7e4765'}}*/}
                        {/*onClick={() => this.archiveSingleId(record.id)}>archive</Icon>*/}

                        <Divider type="vertical"/>
                        <Button onClick={() => {

                            if (record.status !== 'draft') {
                                this.setState({apply: true, lead_details: record});
                            } else {
                                message.error("Please fill all the details!")
                            }
                        }}
                                type="primary"
                                size="small"
                                style={{width: 130, marginLeft: 6}}>

                                Submit Candidate

                            </Button>
        </span>
                )
            }];
        return (

            <div>

                <br/>

                <Row className="box" gutter={8}>
                    <Col span={2}
                         onClick={() => this.onSpecificFilter('', this.state.query, 1, 10, this.state.t)}
                    >
                        <Card
                            bodyStyle={{color: this.state.flagArray[0] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[0] ? '#2688db' : null}}>{this.state.t === 0 ? '0' : this.state.t}</span>}
                            bordered={false}>
                            Total
                        </Card>
                    </Col>

                    <Col span={2}
                         onClick={() => this.onSpecificFilter('draft', this.state.query, 1, 10, this.state.draft)}

                    >
                        <Card
                            bodyStyle={{color: this.state.flagArray[1] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[1] ? '#2688db' : null}}>{this.state.draft === 0 ? '0' : this.state.draft}</span>}
                            bordered={false}>
                            Draft
                        </Card>
                    </Col>
                    <Col span={2}
                         onClick={() => this.onSpecificFilter('new', this.state.query, 1, 10, this.state.new)}
                    >
                        <Card
                            bodyStyle={{color: this.state.flagArray[2] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[2] ? '#2688db' : null}}>{this.state.new === 0 ? '0' : this.state.new}</span>}
                            bordered={false}>
                            New
                        </Card>
                    </Col>
                    <Col span={2}
                         onClick={() => this.onSpecificFilter('sub', this.state.query, 1, 10, this.state.sub)}
                    >
                        <Card
                            bodyStyle={{color: this.state.flagArray[3] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[3] ? '#2688db' : null}}>{this.state.sub === 0 ? '0' : this.state.sub}</span>}
                            bordered={false}>
                            Submitted
                        </Card>
                    </Col>
                    <Col
                        onClick={() => this.setState({archivedStatus: true})

                        }
                        span={2}>
                        <Card title={this.state.archived === 0 ? '0' : this.state.archived}
                              bordered={false}>
                            Archived
                        </Card>
                    </Col>
                    <div className="leadsearch">
                        <Input.Search
                            placeholder="Search Requirements"
                            onChange={e => this.onSearch(e.target.value, 1, 10, this.state.filter_status, this.state.filter)}
                            onSearch={value => this.onSearch(value, 1, 10, this.state.filter_status, this.state.filter)}
                            style={{width: 200}}
                        />
                    </div>
                </Row>


                <div className="mapbox" style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <div className="newtab">
                        <Radio.Group defaultValue="all" buttonStyle="solid" style={{zIndex: '0'}}
                                     onChange={this.onFilterChange} value={this.state.filter}>
                            <Radio.Button value="all">All</Radio.Button>
                            <Radio.Button value="today">Today</Radio.Button>
                            <Radio.Button value="week">Last Week</Radio.Button>
                            <Radio.Button value="month">Last Month</Radio.Button>
                        </Radio.Group>
                    </div>


                    <ul className="leadbuttons">

                        {/* <li>
                            <div style={{}}>
                                All <input type="checkbox" checked={this.state.all === true ? true : false}
                                           onChange={(e) => {
                                               this.setAll(true)
                                               this.getAllLeads(this.state.current_page, this.state.filter);
                                           }}/>
                            </div>
                        </li> */}

                        <li>
                            <div style={{}}>
                                <Button variant="light" onClick={this.openModal}> New Requirement</Button>
                                {this.state.modalIsOpen &&
                                <Drawer
                                    title={null}
                                    width={820}
                                    className="new_popup"
                                    closable={false}
                                    onClose={this.closeModal}
                                    visible={this.state.modalIsOpen}
                                >

                                    <ThreeStepForm
                                        first={true}
                                        edit={true}
                                        addSub={this.state.addSub}
                                        getLead={this.getLead}
                                        setSubmission={this.props.setSubmission}
                                        openSubModal={this.openSubModal}
                                        onUpdateChange={this.onUpdateChange}
                                        handleClose={this.closeModal}/>

                                </Drawer>
                                }

                            </div>
                        </li>

                        <li>
                            <div style={{}}>
                                <Button variant="light" onClick={() => {
                                    this.onArchive()
                                }
                                }> Archive</Button>
                            </div>
                        </li>

                        <li>
                            <div style={{}}>
                                <Button variant="light" onClick={() => {
                                    this.props.setMapStatus(true)
                                    this.setState({hideMap: !this.state.hideMap})
                                }
                                }> {this.state.hideMap ? 'Hide Map' : 'Show Map'}</Button>
                            </div>
                        </li>

                    </ul>

                    <br/>
                    <br/>

                    <br clear="all"/>

                </div>

                <br/>

                {this.state.hideMap === true ?
                    <LeadMap history={this.props.history}
                             setMapStatus={this.props.setMapStatus}
                             mapLeadData={this.props.mapLeadData}
                             mapStatus={this.props.flag}
                             flagMap={this.state.flagMap}
                             city={this.state.city}
                             mapData={this.state.mapData}
                             benchCity={this.state.benchCity}
                             mapBenchData={this.state.mapBenchData}
                             setHideStatus={this.setHideStatus}
                             mapleadData={this.props.mapleadData}/>
                    : null}
                {this.state.loading && this.state.status === 200 ?
                    this.state.archivedStatus ?
                        <Archive/>
                        :
                        <div>
                            <Table
                                rowKey={(record) => record.id.toString()}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={this.props.flag ? this.props.mapleadData : this.state.leadData}
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
                            {this.state.apply &&
                            <Drawer
                                title={null}
                                width={820}
                                closable={false}
                                onClose={this.closeModal}
                                visible={this.state.apply}
                                className="addSubmissionnew"
                            >
                                <ThreeStepForm first={false} edit={false} leadDetails={this.state.lead_details} handleClose={this.closeModal}/>
                                {/*<AddSubmission*/}
                                {/*    setSubmission={this.props.setSubmission}*/}
                                {/*    leadId={this.state.lead_details.id}*/}
                                {/*    openSubModal={this.openSubModal}*/}
                                {/*    addSub={this.state.addSub}*/}
                                {/*    handleClose={this.closeModal}/>*/}
                            </Drawer>
                            }
                            {this.state.view &&
                            <Drawer
                                title="View/Edit Requirement"
                                width={720}
                                className="Req_popup"
                                onClose={this.closeModal}
                                visible={this.state.view}
                            >
                                <ViewLead
                                    onUpdateChange={this.onUpdateChange}
                                    screenStatus={this.state.screenStatus}
                                    leadId={this.state.lead_details.id}
                                    leadDetails={this.state.lead_details}
                                    setStatus={this.setStatus.bind(this)}
                                    handleClose={this.closeModal}/>
                            </Drawer>
                            }


                        </div>
                    :
                    <div>
                        <Spin style={{alignItems: 'center'}} tip="Loading..." size="large"/>
                    </div>


                }
            </div>


        );
    }
}

export default (Lead);
