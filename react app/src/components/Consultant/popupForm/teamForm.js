import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Tooltip, Tag, Popconfirm, message} from "antd";
import {Icon} from '@material-ui/core'
import {CheckBoxSelection, Inject, MultiSelectComponent} from '@syncfusion/ej2-react-dropdowns';
import {
    getTeam, assignTeam, deleteTeam,
} from "../../../services/service";

const role = localStorage.getItem("ROLE")
const team = localStorage.getItem("TEAM")

class TeamForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teamList: [],
            assignedTeamList: [],
            currentTeamList: [],
            fields: {text: 'label', value: 'value'},
            inputVisible: false,
            status: false,
            cancel: false
        }
    }

    showInput = () => {
        this.getTeamList()
        this.setState({inputVisible: true});
    };

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem("DATA"));
        const role = data.roles
        this.setState({
            currentTeamList: this.props.marketer.teams,
            inputVisible: role.map(role=> role === "superadmin") ?false:true
        })
        this.getTeamList()

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
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
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
                    this.setState({teamList: temp_list2, status: true})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    selectTeamList = (data) => {
        let state=false;
        let team_list = this.state.assignedTeamList;
        let updated_list=this.state.currentTeamList;
        let total_teams = this.state.teamList;
        let value={}
        if (team_list.indexOf(data) >= 0) {
            let index = team_list.indexOf(data);
            team_list.splice(index, 1);
            updated_list = updated_list.filter(team => team.id !== data)

        } else {
            team_list.push(data);
            total_teams.map((team, index) => {
                if (team.value === data ) {
                    value={
                        "id":team.value,
                        "name":team.label
                    }
                    updated_list.push(value)
                }
            })

        }
        if(state){
            this.setState({
                assignedTeamList: team_list,
                currentTeamList: updated_list,
            })
        }


    }

    confirmAssignmentTeam(teamList, consultant_id) {
        const body = {
            'teams': teamList
        };
        assignTeam(consultant_id, body)
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
                    message.success("Team Assigned")
                    this.props.setTeamTemp(res.result)
                    this.setState({inputVisible: false,currentTeamList:res.result})
                    //this.props.closeModal()
                }
            })
            .catch(error => {
                console.log(error)
            });

    }

    deleteTeam = (team_id, consultant_id) => {
        console.log("delete team")
        let updated_list = this.state.currentTeamList;
        updated_list = updated_list.filter(team => team.id !== team_id)
        const body = {
            'teams': [team_id]
        }
        console.log("updated list", updated_list)
        deleteTeam(consultant_id, body)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 202) {
                    message.success("Team Successfully removed!")
                    this.props.setTeam(updated_list)
                    this.setState({inputVisible: false, currentTeamList: updated_list})
                }

            })
            .catch(error => {
                console.log(error)
            });

    };
    disableInput = () => {
        this.setState({inputVisible: false});
    };

    render() {
        const {inputVisible} = this.state;
        const data = JSON.parse(localStorage.getItem("DATA"));
        const role = data.roles
        return (
            this.state.status ?
                role.map(role=> role === "superadmin") ?
                    <div>
                        {!inputVisible && this.state.currentTeamList.length !== 0 &&
                        <div>
                            <div>
                                {this.state.currentTeamList.map((item, j) => (

                                    <div>

                                        <Tooltip title={item.name} key={item.id}>

                                            <div className="teamname">
                                                <Popconfirm
                                                    placement="right"
                                                    title={"Are you sure you want to remove this team? "}
                                                    onCancel={this.cancel}
                                                    onConfirm={() => this.deleteTeam(item.id,this.props.consultantId)}
                                                    okText="Yes"
                                                    cancelText="No">
                                                    <Tag
                                                        key={item.id}
                                                        closable={false}
                                                        //color={col111[item.name]}
                                                    >
                                                        {item.name}
                                                    </Tag>
                                                </Popconfirm>
                                            </div>

                                        </Tooltip>

                                    </div>

                                ))}

                            </div>


                            <Tag
                                onClick={() => this.showInput()}
                                style={{background: "#fff", borderStyle: "dashed"}}
                            >

                                <Icon style={{
                                    backgroundColor: "green",
                                    color: 'white',
                                    borderRadius: 20,
                                    fontSize: 10
                                }}>add</Icon> Assign Team
                            </Tag>

                            <br clear="all"/>
                        </div>

                        }
                        {inputVisible && (
                            <div>
                                {this.state.currentTeamList.length !== 0 && this.state.currentTeamList.map((item, i) => (
                                    <div>
                                        <Tooltip title={item.name} key={item.id}>
                                            <div className="teamname">

                                                <Popconfirm
                                                    placement="right"
                                                    title={"Are you sure you want to remove this team? "}
                                                    onCancel={this.cancel}
                                                    onConfirm={(e) => this.deleteTeam(item.id, this.props.consultantId)}
                                                    okText="Yes"
                                                    cancelText="No">
                                                        
                                                    <Tag
                                                        key={item.name}
                                                        closable={false}
                                                        //color={col111[item.name]}
                                                    >
                                                        {item.name}
                                                    </Tag>
                                                </Popconfirm>

                                            </div>
                                        </Tooltip>
                                    </div>

                                ))}
                                <MultiSelectComponent
                                    id="checkbox"
                                    dataSource={this.state.teamList}
                                    getDataByValue={(value) => this.selectTeamList(value)}
                                    fields={this.state.fields}
                                    placeholder="Select Team"
                                    mode="CheckBox"
                                    selectAll={true}
                                    selectAllText="Select All"
                                    unSelectAllText="unSelect All"
                                    showSelectAll={true}>
                                    <Inject services={[CheckBoxSelection]}/>
                                </MultiSelectComponent>

                                <Popconfirm
                                    placement="top"
                                    title={"Are you sure you want to assign team?"}
                                    onCancel={this.cancel}
                                    onConfirm={() => this.confirmAssignmentTeam(this.state.assignedTeamList, this.props.consultantId)}
                                    okText="Yes"
                                    cancelText="No">

                                    <Icon style={{
                                        backgroundColor: "green",
                                        color: 'white',
                                        borderRadius: 20,
                                        fontSize: 20
                                    }} variant="outlined" color="secondary">
                                        check
                                    </Icon>
                                </Popconfirm>
                            </div>
                        )}
                        {inputVisible || this.state.currentTeamList.length === 0 && (
                            <Tag
                                onClick={() => this.showInput()}
                                style={{background: "#fff", borderStyle: "dashed"}}
                            >
                                <Icon style={{
                                    backgroundColor: "green",
                                    color: 'white',
                                    borderRadius: 20,
                                    fontSize: 10
                                }}>add</Icon> Assign Team
                            </Tag>
                        )}
                    </div>
                    :
                    <div>
                        {!inputVisible && this.state.currentTeamList.map((item, j) => (
                            <div>

                                <Tooltip title={item.name} key={item.id}>
                                    <Tag
                                        key={item.id}
                                        closable={false}
                                        //color={col111[item.name]}
                                    >
                                        {item.name}
                                    </Tag>
                                </Tooltip>

                            </div>

                        ))}

                    </div>


                : <div>Loading...</div>
        )

    }
}

export default TeamForm;
