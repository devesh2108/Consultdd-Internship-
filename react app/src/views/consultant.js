import React, {Component} from 'react';
import BenchMap from "../components/Maps/benchMap";
import {
    Button,
    message,
    Select,
    Popconfirm,
    Table,
    Tag,
    Tooltip,
    Switch,
    Pagination,
    Input,
    Drawer,
    Row,
    Col,
    Card,
} from "antd";
import {
    addConsultantMarketer, assignTeam,
    deleteConsultantMarketer,
    getAllBenchConsultants,
    getConsultantDetails,
    getMarketerList,
    getTeam,
    onBenchSearch,
    uploadBench,
    onSpecificFilterBench, getBenchByCity
} from "../services/service";
import AddConsultant from "../components/createForms/consultantForm/addConsultant";
import DescriptionTab from "../components/Consultant/descriptionTab";
import Geocode from "react-geocode";

let col111 = {
    'Consultadd': '#f00',
    'Oc10': '#2b94ea',
    'Nzyme': '#6bdae9',
    'Induci': '#7140c4',
    'NetResolute': '#ff3fe8',
    'Zioqu': '#0bce8d',
    'Boto3': '#4e54dd',
    'GoKronos': '#ffd706',
    'Pythonwise': '#4e73fd',
    'Okyte': '#a04300',
    'Ioneq': '#362300',
}

class Consultant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideMap: false,
            flagMap: false,
            consultantList: [],
            consultantId: 0,
            consultant: '',
            consultant_details: [],
            original_details: [],
            status: null,
            profile_status: false,
            profile_id: 0,
            color: [],
            marketerList: [],
            marketer_status: null,
            marketer: '',
            marketer_id: null,
            assignedMarketerList: [],
            assignedTeamList: [],
            team_name: '',
            teamStatus: false,
            i: [],
            j: 0,
            inputVisible: [false],
            teamFlag: [false],
            inputValue: "",
            reload: true,
            teamList: [],
            assignedArray: [],
            teamData: [],
            team: '',
            current_team: 'all',
            current_page: 1,
            current_size: 10,
            fields: {text: 'label', value: 'value'},
            team_fields: {text: 'label', value: 'value'},
            query: '',
            flagArray: [false],
            in_marketing: 0,
            in_pool: 0,
            in_offer: 0,
            on_project: 0,
            t: 0,
            benchStatus: 'in_marketing',
            profile: false,
            showMore: [false],
            showMoreLocation: [false],
            showMoreTeam: [false],
            obj: {},
            flag: false,
            mapleadData: [],
            mapconsultantData: [],
            mapBenchData: [],
            cityBench: [],


        };
        this.getAllConsultant = this.getAllConsultant.bind(this);
        this.getConsultantDetails = this.getConsultantDetails.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.colorRow = this.colorRow.bind(this);
        this.onSelection = this.onSelection.bind(this);
        this.getMarketerList = this.getMarketerList.bind(this);
        this.onSelectMarketer = this.onSelectMarketer.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setHideStatus = this.setHideStatus.bind(this)
        this.disableInput = this.disableInput.bind(this)
        this.mapLeadData = this.mapLeadData.bind(this);
        this.setMapStatus = this.setMapStatus.bind(this);
        this.mapConsultantData = this.mapConsultantData.bind(this);
    }

    setMapStatus(value) {
        this.setState({flag: value})
    }

    mapLeadData(value) {
        this.setState({mapleadData: value})

    }

    mapConsultantData(value) {
        console.log(value)
        this.setState({mapconsultantData: value})
    }

    setHideStatus() {
        this.setState({flagMap: true})
    }


    closeModal() {
        this.setState({profile: false});

    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const team = data.team;
        this.setState({current_team: team});
        // this.getLatLng()
        this.getAllConsultant(team, this.state.current_page, this.state.current_size, 'in_marketing', null);
        this.getTeamList();

        // if (role.includes("admin") || role.includes("superadmin")) {
        //     this.getMarketerList();
        // }
    }

    getLatLng(status) {
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


                                    this.state.cityBench.push(data)
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

    handleClose = (marketer_id, consultantId) => {
        deleteConsultantMarketer(marketer_id, consultantId)
            .then((response) => {

                const statusCode = response.status;
                this.setState({inputVisible: [false]})
                this.getAllConsultant(this.state.current_team, this.state.current_page, this.state.current_size, 'in_marketing', null)

            })
            .catch(error => {
                console.log(error)
            });

    };
    showMoreTeamStatus = (i) => {
        console.log(i)
        let a = this.state.showMoreTeam.slice();
        a[i] = true;
        this.setState({showMoreTeam: a});
    };
    disableMoreTeamStatus = (i) => {
        console.log(i)
        let a = this.state.showMoreTeam.slice();
        a[i] = false;
        this.setState({showMoreTeam: a});
    };
    showMoreLocationStatus = (i) => {
        console.log(i)
        let a = this.state.showMoreLocation.slice();
        a[i] = true;
        this.setState({showMoreLocation: a});
    };
    disableMoreLocationStatus = (i) => {
        console.log(i)
        let a = this.state.showMoreLocation.slice();
        a[i] = false;
        this.setState({showMoreLocation: a});
    };
    showMoreStatus = (i) => {
        console.log(i)
        let a = this.state.showMore.slice();
        a[i] = true;
        this.setState({showMore: a});
    };
    disableMoreStatus = (i) => {
        let a = this.state.showMore.slice();
        a[i] = false;
        this.setState({showMore: a});
    };
    showInput = (i) => {
        this.getMarketerList();
        console.log(i)
        let a = this.state.inputVisible.slice();
        a[i] = true;
        this.setState({inputVisible: a});
    };
    disableInput = (i) => {
        let a = this.state.inputVisible.slice();
        a[i] = false;
        this.setState({inputVisible: a});
    };
    showInputTeam = (i) => {
        this.getMarketerList();
        let a = this.state.teamFlag.slice();
        a[i] = true;
        this.setState({teamFlag: a});
    };
    // handleInputChange = (marketer_id, consultantId) => {
    //
    //     this.setState({
    //         marketer_id: marketer_id,
    //         consultantId: consultantId
    //
    //     })
    // };
    // handleInputChangeTeam = (team, consultantId) => {
    //
    //     this.setState({
    //         team_name: team,
    //         consultantId: consultantId
    //
    //     })
    // };

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    getMarketerList() {
        getMarketerList()
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
                    let temp_list = {}
                    let temp_list2 = []
                    res.results.map((item, i) => {
                        temp_list =
                            {
                                label: item.name,
                                value: item.id
                            }
                        temp_list2.push(temp_list)

                    })
                    this.setState({marketerList: temp_list2, marketer_status: status})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    getTeamList() {
        getTeam()
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
                    console.log(res.results)
                    res.results.map((item, i) => (
                        this.state.teamList.push(item)
                    ))
                    let temp_list = {}
                    let temp_list2 = []
                    res.results.map((item, i) => {
                        temp_list =
                            {
                                label: item.name,
                                value: item.name
                            }
                        temp_list2.push(temp_list)

                    })
                    this.setState({teamData: temp_list2, team_status: status})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }


    getAllConsultant(team, page, size, status, total) {
        console.log(status)
        getAllBenchConsultants(team, page, size, status)
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
                        consultantList: res.results,
                        total: total === null ? res.count.in_marketing : total,
                        in_marketing: res.count.in_marketing,
                        in_pool: res.count.in_pool,
                        in_offer: res.count.in_offer,
                        on_project: res.count.on_project,
                        t: res.count.in_marketing
                    });
                    console.log(res.results)
                    this.mapConsultantData(this.state.consultantList)
                    this.setMapStatus(true)
                    this.setState({status: status})
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    getConsultantDetails(id) {
        this.setState({profile_status: false})
        this.setState({profile_id: id})
        getConsultantDetails(id)
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
                    this.setState({consultant_details: res.results[0].profiles});
                    this.setState({profile_id: res.results[0].profiles[0].id})
                    this.state.consultant_details.map((item, i) =>

                        item.id === this.state.profile_id ? this.setState({original_details: item}) : null
                    )
                }


            })
            .catch(error => {
                console.log(error)
            });

    }

    onSelection(data) {

    }

    selectTeamList(data) {
        let team_list = this.state.assignedTeamList;

        if (team_list.indexOf(data) >= 0) {
            let index = team_list.indexOf(data);
            team_list.splice(index, 1);
        } else {
            team_list.push(data);
        }
        this.setState({assignedTeamList: team_list})
        console.log(team_list)
    }

    selectMarketer(data) {
        console.log("data", data)
        console.log("this.state.assignedMarketerList", this.state.assignedMarketerList)
        let marketer_list = this.state.assignedMarketerList;

        if (marketer_list.indexOf(data) >= 0) {
            let index = marketer_list.indexOf(data);
            marketer_list.splice(index, 1);
        } else {
            marketer_list.push(data);
        }
        this.setState({assignedMarketerList: marketer_list})
        console.log(marketer_list)
    }

    onSelectMarketer(data) {
        this.setState({
            j: data.split(",")[0],
            marketer: data.split(" ")[1] + " " + data.split(" ")[2],
            marketerId: data.split(" ")[0]
        })

    }

    colorRow(data) {
        let oneDay, firstDate, secondDate, diffDays;
        oneDay = 24 * 60 * 60 * 1000
        firstDate = new Date(data.created)
        secondDate = new Date()
        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)))
        if (diffDays <= 12) {
            return 'green'
        } else if (diffDays <= 24) {
            return 'yellow'
        } else if (diffDays <= 36) {
            return 'amber'
        } else {
            return 'red'
        }
    }

    countDays(data) {
        let oneDay, firstDate, secondDate, diffDays;
        oneDay = 24 * 60 * 60 * 1000
        firstDate = new Date(data)
        secondDate = new Date()
        diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)))
        return diffDays
    }

    confirmAssignment(marketerList, consultantId) {
        const body = {
            'consultant': consultantId,
            "marketer": marketerList
        };
        addConsultantMarketer(body)
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
                    message.success("Marketer Added")
                    this.setState({inputVisible: [false], teamStatus: false})
                    this.getAllConsultant(this.state.current_team, this.state.current_page, this.state.current_size, 'in_marketing', null)
                }
            })
            .catch(error => {
                console.log(error)
            });

    }

    confirmAssignmentTeam(teamList, consultantId) {
        const body = {
            'consultant': consultantId,
            'teams': teamList
        };
        assignTeam(body)
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
                    message.success("Team Assigned")
                    this.setState({teamFlag: [false], teamStatus: false})

                    this.getAllConsultant(this.state.current_team, this.state.current_page, this.state.current_size, 'in_marketing', null)
                }
            })
            .catch(error => {
                console.log(error)
            });

    }

    cancel(e) {
        message.error('Click on No');
    }

    selectTeam(value) {
        if (value != '') {
            this.setState({teamStatus: false})
        }
        this.setState({current_team: value})
        this.getAllConsultant(value, 1, 10, this.state.benchStatus, null)

    }

    onPageChange = (page, size) => {
        this.setState({
            current_page: page,
            current_size: size
        });
        if (this.state.query !== '') {
            this.onSearch(this.state.query, page, size, this.state.benchStatus)
        } else
            this.getAllConsultant(this.state.current_team, page, size, this.state.benchStatus, this.state.total)
    };

    onSearch(value, page, size, status) {
        this.setState({poData: [], query: value})
        onBenchSearch(value, page, size, status)
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
                        consultantList: res.results,
                        total: res.count.in_marketing,
                        in_marketing: res.count.in_marketing,
                        in_pool: res.count.in_pool,
                        in_offer: res.count.in_offer,
                        on_project: res.count.on_project,
                        t: res.count.in_marketing

                    });
                    this.mapConsultantData(this.state.consultantList)
                    this.setMapStatus(true)
                    this.setState({status: status})

                }

            })
            .catch(error => {
                console.log(error)
            })

    }

    uploadBench(e) {
        console.log(e.target.files[0])
        if (e.target.files[0].type === 'text/csv') {
            let fd = new FormData();
            fd.append('file', e.target.files[0])
            uploadBench(fd)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(status)
                    if (status === 401) {
                        localStorage.removeItem('TOKEN');
                        localStorage.removeItem('TEAM');
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('ID');
                        localStorage.removeItem('NAME');
                        this.props.history.push('/login')
                    } else {
                        if (status === 201) {
                            message.success(res.errors)
                        }
                        message.success(res.errors)
                    }
                })
                .catch(error => {
                    message.success(error)
                })

        } else {
            message.error("Please select a CSV file")
        }
    }

    onSpecificFilter(team, val, page, size, total, query) {
        this.setState({
            status: 0,
            consultantList: [],
            loading: false,
            benchStatus: val,
            current_page: page,
            current_size: size,
            total: total,
            query: query
        })
        let temp = this.state.flagArray;
        switch (val) {
            case 'in_marketing':
                temp[0] = true
                temp[1] = false
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'in_pool':
                temp[0] = false
                temp[1] = true
                temp[2] = false
                temp[3] = false
                this.setState({flagArray: temp})
                break;
            case 'in_offer':
                temp[0] = false
                temp[1] = false
                temp[2] = true
                temp[3] = false
                this.setState({flagArray: temp});
                break;
            case 'on_project':
                temp[0] = false
                temp[1] = false
                temp[2] = false
                temp[3] = true
                this.setState({flagArray: temp})
                break;
        }

        onSpecificFilterBench(team, page, size, val, query)
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
                        consultantList: res.results,
                        in_marketing: res.count.in_marketing,
                        in_pool: res.count.in_pool,
                        in_offer: res.count.in_offer,
                        on_project: res.count.on_project,
                        t: res.count.in_marketing
                    });
                    console.log(res.results)
                    this.mapConsultantData(this.state.consultantList)
                    this.setMapStatus(true)
                    this.setState({status: status})

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    setConsultantData = (data) => {
        localStorage.setItem("CON", data.id)
        this.setState({consultantId: data.id, obj: data})
        this.props.history.push("/consultant")
    }
    setOnProjectConsultantData = (data) => {
        localStorage.setItem("CON", data.id)
        this.setState({consultantId: data.id,})
        this.props.history.push("/consultant")
    }

    render() {
        const {inputVisible, teamFlag} = this.state;
        const data = JSON.parse(localStorage.getItem("DATA"));
        const role = data.roles;
        const team = data.team;
        const columns = [
            {

                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '8%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setConsultantData(record)


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        //if (record.team === team) {
                        this.setConsultantData(record)

                        //}


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Recruiter',
                dataIndex: 'recruiter',
                key: 'recruiter',
                width: '6%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team) {
                        this.setConsultantData(record)

                        // }


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Preferred Location',
                dataIndex: 'preferred_location',
                key: 'preferred_location',
                width: '4%',
                render: (text, record, i) => (
                    text !== null && text !== "" ?
                        <div>
                            {!this.state.showMoreLocation[i] && text.split(",").map((item, i) => (
                                item !== null && i < 2 ?
                                    <div onClick={() => {
                                        this.setConsultantData(record)
                                    }}>
                                        <Tooltip title={item} key={i}>
                                            <div>
                                                <Tag
                                                    style={{width: 'auto'}}
                                                    key={item}
                                                    closable={false}
                                                    color="orange"
                                                >
                                                    {item}
                                                </Tag>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    : null

                            ))}
                            {!this.state.showMoreLocation[i] && text.split(",").length > 2 &&
                            <span style={{fontSize: '11px', textDecoration: 'underline', color: '#1890FF'}}
                                  onClick={() => this.showMoreLocationStatus(i)}>Show More</span>}
                            {this.state.showMoreLocation[i] && text.split(",").map((item, j) => (
                                <div onClick={() => {
                                    this.setConsultantData(record)
                                }}>
                                    <Tooltip title={item} key={i}>
                                        <div>
                                            <Tag
                                                style={{width: 'auto'}}
                                                key={item}
                                                closable={false}
                                                color="orange"
                                            >
                                                {item}
                                            </Tag>
                                        </div>
                                    </Tooltip>
                                </div>

                            ))}
                            {this.state.showMoreLocation[i] && text.split(",").length > 2 &&
                            <span style={{fontSize: '11px', textDecoration: 'underline', color: '#1890FF'}}
                                  onClick={() => this.disableMoreLocationStatus(i)}>Hide More</span>}

                        </div>
                        :
                        <div>None</div>
                )
            },
            {
                title: 'Skill',
                dataIndex: 'skills',
                key: 'skills',
                width: '5%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team && record.in_pool) {
                        this.setConsultantData(record)

                        // }


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'In pool',
                dataIndex: 'in_pool',
                key: 'in_pool',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        //if (record.team === team && record.in_pool) {
                        this.setConsultantData(record)


                        //  }


                    }}
                    >{text ? 'Yes' : 'No'}</span>
                )
            },
            {
                title: 'RTG',
                dataIndex: 'rtg',
                key: 'rtg',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setConsultantData(record)


                    }}>
                        <input type="checkbox" checked={text} disabled={true}/>
                    </span>
                )
            },
            {

                title: 'Days',
                dataIndex: 'marketing_start',
                key: 'days',
                width: '1%',
                render: (text, record) => (
                    text !== null ?
                        <div className="bench_sec_button1" style={{
                            backgroundColor: this.countDays(text) <= 12 ? '#00FF00' :
                                this.countDays(text) <= 24 ? '#ffef6c' :
                                    this.countDays(text) <= 36 ? '#ff9700' :
                                        '#890000',
                            color: this.countDays(text) > 36 ? "white" : "black"

                        }} onClick={() => {
                            this.setConsultantData(record)


                        }}>{this.countDays(text)}</div> :
                        <div className="bench_sec_button1">0</div>
                )
            },
            // {
            //
            //     title: '# Sub',
            //     dataIndex: 'sub_count',
            //     key: 'sub_count',
            //     width: '1%',
            //     render: (text, record) => (
            //
            //
            //         <div className="bench_sec_button1" onClick={() => this.props.callSubmission(record.id)}>
            //             {text}
            //         </div>
            //
            //
            //     )
            // },
            // {
            //     title: '# Interview',
            //     dataIndex: 'interview_count',
            //     key: 'interview_count',
            //     width: '1%',
            //     render: (text, record) => (
            //
            //         <div className="bench_sec_button1" onClick={() => this.props.callInterview(record.id)}>
            //             {text}
            //         </div>
            //
            //     )
            // },
            // {
            //     title: 'Actions',
            //     dataIndex: 'id',
            //     key: "id",
            //     width: '30%',
            //     render: (text, record) => (
            //         <span>
            //             {record.team === team ?
            //                 <Button onClick={() => {
            //                     this.setState({consultantId: record.id})
            //                     this.setState({modalIsOpen: true})
            //
            //
            //                 }}
            //                         type="primary"
            //                         size="small"
            //                         style={{width: 130, marginRight: 8}}>
            //                     Manage Profiles
            //                 </Button> : null}
            //
            //          </span>
            //     )
            // }
        ];
        const columns_project = [
            {

                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '8%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team) {
                        this.setOnProjectConsultantData(record)
                        //}


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        //if (record.team === team) {
                        this.setOnProjectConsultantData(record)

                        //}


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Recruiter',
                dataIndex: 'recruiter.full_name',
                key: 'recruiter.full_name',
                width: '6%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team) {
                        this.setOnProjectConsultantData(record)

                        // }


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Preferred Location',
                dataIndex: 'preferred_location',
                key: 'preferred_location',
                width: '4%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team) {
                        this.setOnProjectConsultantData(record)

                        // }


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Skill',
                dataIndex: 'skills',
                key: 'skills',
                width: '5%',
                render: (text, record) => (
                    <span onClick={() => {
                        // if (record.team === team && record.in_pool) {
                        this.setOnProjectConsultantData(record)

                        // }


                    }}
                    >{text}</span>
                )
            },
            {
                title: 'Team',
                dataIndex: 'teams',
                key: 'teams',
                width: '6%',
                render: (text, record, i) => (

                    text.map((item, i) => (
                        <div>

                            <Tooltip title={item.name} key={i}>
                                <Tag
                                    onClick={() => {
                                        // if (record.team === team) {
                                        this.setOnProjectConsultantData(record)
                                        // }
                                    }}
                                    key={item.name}
                                    closable={false}
                                    //color={col111[text]}
                                >
                                    {item.name}
                                </Tag>
                            </Tooltip>
                        </div>
                    ))


                )
            },
            {
                title: 'In pool',
                dataIndex: 'in_pool',
                key: 'in_pool',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        //if (record.team === team && record.in_pool) {
                        this.setOnProjectConsultantData(record)


                        //  }


                    }}
                    >{text ? 'Yes' : 'No'}</span>
                )
            },
            {
                title: 'RTG',
                dataIndex: 'rtg',
                key: 'rtg',
                width: '1%',
                render: (text, record) => (
                    <span onClick={() => {
                        this.setOnProjectConsultantData(record)

                    }}>
                        <input type="checkbox" checked={text} disabled={true}/>
                    </span>
                )
            },

        ];
        return (

            <div style={{marginTop: '80px', marginLeft: '5px', marginRight: '10px'}}>

                <br/>
                <Row className="box" gutter={8}>

                    <Col
                        onClick={() => this.onSpecificFilter(this.state.current_team, 'in_marketing', 1, 10, this.state.in_marketing, this.state.query)}
                        span={2}>
                        <Card bodyStyle={{color: this.state.flagArray[0] ? '#2688db' : null}}
                              title={<span
                                  style={{color: this.state.flagArray[0] ? '#2688db' : null}}>{this.state.in_marketing === 0 ? '0' : this.state.in_marketing}</span>}
                              bordered={false}>
                            In Marketing
                        </Card>
                    </Col>
                    <Col
                        onClick={() => this.onSpecificFilter(this.state.current_team, 'in_pool', 1, 10, this.state.in_pool, this.state.query)}
                        span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[1] ? '#2688db' : null}}
                            title={<span
                                style={{color: this.state.flagArray[1] ? '#2688db' : null}}>{this.state.in_pool === 0 ? '0' : this.state.in_pool}</span>}
                            bordered={false}>
                            In Pool
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[2] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.current_team, 'in_offer', 1, 10, this.state.in_offer, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[2] ? '#2688db' : null}}>{this.state.in_offer === 0 ? '0' : this.state.in_offer}</span>}
                            bordered={false}>
                            In Offer
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bodyStyle={{color: this.state.flagArray[3] ? '#2688db' : null}}
                            onClick={() => this.onSpecificFilter(this.state.current_team, 'on_project', 1, 10, this.state.on_project, this.state.query)}
                            title={<span
                                style={{color: this.state.flagArray[3] ? '#2688db' : null}}>{this.state.on_project === 0 ? '0' : this.state.on_project}</span>}
                            bordered={false}>
                            On Project
                        </Card>
                    </Col>

                </Row>
                <br/>
                <div className="benchnew">


                    <Button variant="light"
                            style={{marginLeft: '5px'}}
                            onClick={() => {
                                this.setMapStatus(true)
                                this.setState({hideMap: !this.state.hideMap})
                            }
                            }> {this.state.hideMap ? 'Hide Map' : 'Show Map'}</Button>
                    <Input.Search
                        placeholder="Search Consultant"
                        onChange={e => this.onSearch(e.target.value, 1, 10, this.state.benchStatus)}
                        onSearch={value => this.onSearch(value, 1, 10, this.state.benchStatus)}
                        style={{width: 200, float: "right", marginLeft: '5px', marginRight: "10px"}}
                    />

                </div>
                <br/>
                <br/>
                {role.map(r => r === "superadmin") || role.map(r => r === "admin") ? <label className="uploadbench"
                                                                                            style={{}}>Upload Bench
                    <input type="file" style={{visibility: 'hidden', width: '50px'}}
                           onChange={(e) => this.uploadBench(e)}/></label> : null}
                {
                    role.map(r => r === "superadmin") &&
                    <Button className="cunsultaddbutton" onClick={(e) => this.setState({profile: true})}>Add
                        Consultant</Button>
                }
                <div>

                    <div>
                        <ul className="benchtab">
                            <li>
                                All <Switch checked={this.state.teamStatus} size="small" checkedChildren=""
                                            unCheckedChildren="" onChange={() => {
                                this.setState({teamStatus: !this.state.teamStatus})
                                if (!this.state.teamStatus) {
                                    let team = 'all';
                                    this.setState({current_team: 'all'}, () => this.getAllConsultant(team, 1, 10, this.state.benchStatus, null))

                                } else {
                                    this.setState({current_team: team}, () => this.getAllConsultant(team, 1, 10, this.state.benchStatus, null))

                                }

                            }}/>
                            </li>

                            <li>
                                <div>
                                    <Select
                                        showSearch
                                        className="benchselect"
                                        style={{width: '170px', marginTop: "10px"}}
                                        placeholder="Team List"
                                        optionFilterProp="children"
                                        onChange={(e) => this.selectTeam(e)}
                                        value={this.state.current_team}
                                        filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.teamList.map((item, i) => (
                                            <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </li>

                        </ul>


                        {this.state.hideMap &&

                        <BenchMap
                            benchStatus={this.state.benchStatus}
                            setAll={this.setAll}
                            all={this.state.all}
                            setMapStatus={this.setMapStatus}
                            mapConsultantData={this.mapConsultantData}
                            mapStatus={this.state.flag}
                            flagMap={this.state.flagMap}
                            cityBench={this.state.cityBench}
                            mapBenchData={this.state.mapBenchData}
                            setHideStatus={this.setHideStatus}
                            status={this.state.status}
                            mapconsultantData={this.state.mapconsultantData}
                        />}
                    </div>

                    <ul className="check_color_box">

                        <li>
                            <div className="colorbox1">
                                Days,<br/>Less than 12 <span> <div className="box"> </div> </span>
                            </div>
                        </li>
                        <li>
                            <div className="colorbox2">
                                Days,<br/>Less than 24 <span> <div className="box"> </div> </span>
                            </div>
                        </li>
                        <li>
                            <div className="colorbox3">
                                Days,<br/> Less than 36 <span> <div className="box"> </div> </span>
                            </div>
                        </li>
                        <li>
                            <div className="colorbox4">
                                Days,<br/>More than 36 <span> <div className="box"> </div> </span>
                            </div>
                        </li>

                    </ul>


                    {this.state.mapconsultantData.length === 0 && this.state.consultantList.length === 0 && this.state.status === 200 ?
                        <div className="benchtabno">No consultant in your team</div> :
                        <div>
                            <Table
                                //rowClassName={(record, index) => this.colorRow(record)}
                                columns={this.state.benchStatus === 'on_project' ? columns_project : columns}
                                rowKey={(record) => record.id.toString()}
                                dataSource={this.state.flag ? this.state.mapconsultantData : this.state.consultantList}
                                pagination={false}
                                //onRow={(record,index)=>{return {onClick: (event) => {this.setState({consultantId:record.id,consultant:record.name})}}}}
                            />

                            <br/>

                            <div className="rightpagination">
                                <Pagination
                                    style={{float: "right"}}
                                    current={this.state.current_page}
                                    onChange={this.onPageChange}
                                    showSizeChanger
                                    onShowSizeChange={this.onPageChange}
                                    pageSize={this.state.current_size}
                                    total={this.state.total}
                                />
                            </div>
                        </div>
                    }


                    {this.state.profile &&
                    <Drawer
                        title="Add Consultant"
                        width={1020}
                        maskClosable={false}
                        closable={false}
                        onClose={this.closeModal}
                        visible={this.state.profile}

                    >
                        <AddConsultant handleClose={this.closeModal}/>

                    </Drawer>
                    }

                </div>

            </div>

        );


    }
}

export default Consultant;
