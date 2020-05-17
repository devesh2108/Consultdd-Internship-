import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Tooltip, Tag, Popconfirm, message} from "antd";
import {Icon} from '@material-ui/core'
import {CheckBoxSelection, Inject, MultiSelectComponent} from '@syncfusion/ej2-react-dropdowns';
import {
    addConsultantMarketer,
    deleteConsultantMarketer, getMarketerList
} from "../../../services/service";


class MarketerForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marketerList: [],
            assignedMarketerList: [],
            currentMarketerList: [],
            fields: {text: 'label', value: 'value'},
            in_pool: false,
            inputVisible: false
        }
    }

    componentDidMount() {
        this.setState({
            in_pool: this.props.marketer.in_pool,
            currentMarketerList: this.props.marketer.marketer
        })
        this.getMarketerList()
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
                    this.setState({marketerList: temp_list2, status: true})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    showInput = () => {
        this.getMarketerList();
        this.setState({inputVisible: true});
    };

    disableInput = () => {
        this.setState({inputVisible: false});
    };

    selectMarketer(data) {
        let marketer_list = this.state.assignedMarketerList;
        let updated_list = this.state.currentMarketerList;
        let total_marketers = this.state.marketerList;
        let value={}
        if (marketer_list.indexOf(data) >= 0) {
            let index = marketer_list.indexOf(data);
            marketer_list.splice(index, 1);
            updated_list = updated_list.filter(marketer => marketer.id !== data)
        } else {
            marketer_list.push(data);
            total_marketers.map((marketer, index) => {
                if (marketer.value === data ) {
                    value={
                        "name":marketer.label,
                        "id":marketer.value
                    }
                    updated_list.push(value)
                }
            })
        }


        this.setState({assignedMarketerList: marketer_list,currentMarketerList:updated_list})

    }

    confirmAssignment (marketerList, consultant_id) {
        const body = {
            "marketers": marketerList
        };
        addConsultantMarketer(consultant_id, body)
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
                    message.success("Added Marketer")
                    this.props.setMarketer(this.state.currentMarketerList)
                    this.setState({inputVisible: false})
                }
            })
            .catch(error => {
                console.log(error)
            });

    }

    deleteMarketer = (marketer_id, consultant_id) => {
        let updated_list = this.state.currentMarketerList;
        updated_list = updated_list.filter(marketer => marketer.id !== marketer_id)
        const body = {
            'marketers': [marketer_id]
        }
        deleteConsultantMarketer(consultant_id, body)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 200) {
                    message.success("Marketer Successfully removed!")
                    this.props.setMarketer(updated_list)
                    this.setState({inputVisible: false,currentMarketerList:updated_list})
                }

            })
            .catch(error => {
                console.log(error)
            });

    };

    render() {

        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        const team = data.team;
        const {inputVisible} = this.state;
        return (
            this.state.status ?
                role.map(role=> role === "superadmin") ?

                    <div>
                        {this.state.currentMarketerList.map((marketer, index) => {
                            const tagElem = (

                                <Popconfirm
                                    placement="right"
                                    title={"Are you sure you want to delete this marketer? "}
                                    onCancel={this.cancel}
                                    onConfirm={() => this.deleteMarketer(marketer.id, this.props.consultantId)}
                                    okText="Yes"
                                    cancelText="No">
                                    <Tooltip title={marketer.name} key={index}>
                                        <Tag
                                            key={marketer.id}
                                            closable={false}
                                            color="blue"
                                            style={{width: '28px', marginTop: '5px'}}
                                        >
                                            {marketer.name.split(" ").length === 1
                                                ?
                                                marketer.name.split(" ")[0].charAt(0) :
                                                marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                            }
                                        </Tag>
                                    </Tooltip>
                                </Popconfirm>

                            );
                            return (

                                <div>                                        {tagElem}
                                </div>

                            )
                        })}
                        {
                            inputVisible && (
                                <div>
                                    <MultiSelectComponent id="checkbox"
                                                          dataSource={this.state.marketerList}
                                                          getDataByValue={(value) => this.selectMarketer(value)}
                                                          fields={this.state.fields}
                                                          placeholder="Select Marketer"
                                                          className="marketer_textbox"
                                                          mode="CheckBox"
                                                          selectAll={true}
                                                          selectAllText="Select All"
                                                          unSelectAllText="Unselect All"
                                                          showSelectAll={true}>
                                        <Inject services={[CheckBoxSelection]}/>
                                    </MultiSelectComponent>

                                    <Popconfirm
                                        placement="top"
                                        title={"Are you sure you want to assign "}
                                        onCancel={this.cancel}
                                        onConfirm={() => this.confirmAssignment(this.state.assignedMarketerList, this.props.consultantId)}
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
                                        <Icon
                                            onClick={() => this.disableInput()}
                                            style={{
                                                marginLeft: '5px',
                                                backgroundColor: "red",
                                                color: 'white',
                                                borderRadius: 20,
                                                fontSize: 20
                                            }} variant="outlined" color="secondary">
                                            close
                                        </Icon>
                                    </Popconfirm>
                                </div>
                            )
                        }

                        {!inputVisible && (


                            <Tooltip title="Assign Marketer">

                                <Tag
                                    closable={false}
                                    color="#006400"
                                    onClick={() => this.showInput()}
                                    style={{width: '30px', marginTop: '5px'}}
                                >
                                    <Icon style={{
                                        // backgroundColor: "green",
                                        // color: 'white',
                                        borderRadius: 20,
                                        // fontSize: 10
                                        // width: '30px'
                                    }}>add</Icon>
                                </Tag>
                                <br/>
                                
                            </Tooltip>


                        )}
                    </div>

                    :
                    role.map(role=> role === "superadmin") ?
                        (this.props.marketer.in_pool) ?
                            <div>
                                {this.state.currentMarketerList.map((marketer, index) => {
                                    if (index < 2) {

                                        const tagElem = (
                                            <Tooltip title={marketer.name} key={index}>
                                                <Tag
                                                    onClick={() => {
                                                        this.setState({
                                                            consultantId: this.props.consultantId,
                                                            modalIsOpen: true,
                                                            obj: this.props.marketer
                                                        })
                                                    }}
                                                    key={marketer.name}
                                                    closable={false}
                                                    color="blue"
                                                    style={{width: '30px', marginTop: '5px'}}
                                                >
                                                    {marketer.name.split(" ").length === 1
                                                        ?
                                                        marketer.name.split(" ")[0].charAt(0) :
                                                        marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                                    }
                                                </Tag>
                                            </Tooltip>
                                        );
                                        return (
                                            tagElem
                                        );
                                    }
                                })}
                                {
                                    <div>{
                                        this.state.currentMarketerList.map((marketer, index) => {

                                            const tagElem = (
                                                <Tooltip title={marketer.name} key={index}>
                                                    <Tag
                                                        key={marketer.name}
                                                        closable={false}
                                                        color="blue"
                                                        style={{width: '30px', marginTop: '5px'}}
                                                    >
                                                        {marketer.name.split(" ").length === 1
                                                            ?
                                                            marketer.name.split(" ")[0].charAt(0) :
                                                            marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                                        }
                                                    </Tag>
                                                </Tooltip>
                                            );
                                            return (
                                                tagElem
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                            :
                            (
                                this.props.marketer.teams.map((teamObj, j) =>
                                    (teamObj.name === team) ?
                                        <div>
                                            {this.props.marketer.marketer.map((marketer, index) => {
                                                const tagElem = (

                                                    <Popconfirm
                                                        placement="right"
                                                        title={"Are you sure you want to delete this marketer? "}
                                                        onCancel={this.cancel}
                                                        onConfirm={() => this.deleteMarketer(marketer.id, this.props.consultantId)}
                                                        okText="Yes"
                                                        cancelText="No">
                                                        <Tooltip title={marketer.name} key={index}>
                                                            <Tag
                                                                key={marketer.id}
                                                                closable={false}
                                                                color="blue"
                                                                style={{width: '28px', marginTop: '5px'}}
                                                            >
                                                                {marketer.name.split(" ").length === 1
                                                                    ?
                                                                    marketer.name.split(" ")[0].charAt(0) :
                                                                    marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                                                }
                                                            </Tag>
                                                        </Tooltip>
                                                    </Popconfirm>

                                                );
                                                return (

                                                    <div>                                        {tagElem}
                                                    </div>

                                                )
                                            })}
                                            {
                                                inputVisible && (
                                                    <div>
                                                        <MultiSelectComponent id="checkbox"
                                                                              dataSource={this.state.marketerList}
                                                                              getDataByValue={(value) => this.selectMarketer(value)}
                                                                              fields={this.state.fields}
                                                                              placeholder="Select Marketer"
                                                                              mode="CheckBox"
                                                                              selectAll={true}
                                                                              selectAllText="Select All"
                                                                              unSelectAllText="Unselect All"
                                                                              showSelectAll={true}>
                                                            <Inject services={[CheckBoxSelection]}/>
                                                        </MultiSelectComponent>
                                                        
                                                        {/*<ReactMultiSelectCheckboxes*/}
                                                        {/*options={this.state.marketerList}*/}
                                                        {/*onChange={(value)=>console.log(value)}*/}
                                                        {/*>*/}
                                                        {/*</ReactMultiSelectCheckboxes>*/}

                                                        <Popconfirm
                                                            placement="top"
                                                            title={"Are you sure you want to assign "}
                                                            onCancel={this.cancel}
                                                            onConfirm={() => this.confirmAssignment(this.state.assignedMarketerList, this.props.consultantId)}
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
                                                            <Icon
                                                                onClick={() => this.disableInput()}
                                                                style={{
                                                                    marginLeft: '5px',
                                                                    backgroundColor: "red",
                                                                    color: 'white',
                                                                    borderRadius: 20,
                                                                    fontSize: 20
                                                                }} variant="outlined" color="secondary">
                                                                close
                                                            </Icon>
                                                        </Popconfirm>
                                                    </div>
                                                )
                                            }

                                            {!inputVisible && (


                                                <Tooltip title="Assign Marketer">

                                                    <Tag
                                                        closable={false}
                                                        color="#006400"
                                                        onClick={() => this.showInput()}
                                                        style={{width: '30px', marginTop: '5px'}}
                                                    >
                                                        <Icon style={{
                                                            // backgroundColor: "green",
                                                            // color: 'white',
                                                            borderRadius: 20,
                                                            // fontSize: 10
                                                            // width: '30px'
                                                        }}>add</Icon>
                                                    </Tag>
                                                </Tooltip>


                                            )}
                                        </div> : null)
                            )
                        :
                        <div>
                            <span>Not admin</span>
                            {
                                this.state.currentMarketerList.map((marketer, index) => {

                                    const tagElem = (
                                        <Tooltip title={marketer.name} key={index}>
                                            <Tag
                                                key={marketer.name}
                                                closable={false}
                                                color="blue"
                                                style={{width: '30px', marginTop: '5px'}}
                                            >
                                                {marketer.name.split(" ").length === 1
                                                    ?
                                                    marketer.name.split(" ")[0].charAt(0) :
                                                    marketer.name.split(" ")[0].charAt(0) + marketer.name.split(" ")[1].charAt(0)
                                                }
                                            </Tag>
                                        </Tooltip>
                                    );
                                    return (
                                        tagElem
                                    );
                                })}

                        </div>
                : <div>Loading...</div>
        )

    }
}

export default MarketerForm;
