import React, {Component} from 'react';
import "../../App.css";
import {Divider, Input, Table} from "antd";
import {ShareAltOutlined,DeleteOutlined } from "@ant-design/icons"

class JBAsset extends Component {


    render() {
        let selectedRowKeys = this.props.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.props.onSelectJobChange,

        };
        const jobColumns = [
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                width: '20%',

                render: (text, record) => (
                    <span onClick={() => this.props.jobData(record)}>{text}</span>

                ),
            },
            {
                title: 'Password',
                dataIndex: 'password',
                key: 'password',
                width: '15%',

                render: (text, record) => (
                    <Input.Password
                        style={{border: 0}}
                        value={text}
                        onClick={() => this.props.jobData(record)}/>
                ),
            },
            {
                title: 'Technology',
                dataIndex: 'tech',
                key: 'tech',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.jobData(record)}>{text}</span>

                ),
            }, {
                title: 'Provider',
                dataIndex: 'provider',
                key: 'provider',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.jobData(record)}>{text}</span>

                ),
            },
            {
                title: 'Owner',
                dataIndex: 'owner__full_name', //owner_name
                key: 'owner__full_name',//owner_name
                width: '12%',

                render: (text, record) => (
                    <span onClick={() => this.props.jobData(record)}>{text}</span>
                ),
            },
            {
                title: 'Actions',
                key: "action",
                width: '12%',
                render: (text, record) => (
                    <span>
                       <ShareAltOutlined type="share-alt" style={{fontSize: 18, color: '#2688db', float: 'left'}}
                             onClick={() => {
                                 this.props.getSpecificAssetData(record.id)

                             }
                             }/>
                        <Divider type="vertical"/>
                        <DeleteOutlined style={{fontSize: 18, color: '#2688db', float: 'auto'}}
                              onClick={() => this.props.showDeleteConfirm(record.id, 'Job Board asset')}/>

        </span>
                )
            }];
        return (

            <div>
                <Table
                    className="assettable"
                    style={{width: '100%'}}
                    rowKey={(record) => record.id.toString()}
                    rowSelection={rowSelection}
                    columns={jobColumns}
                    dataSource={this.props.jobData}
                    pagination={false}
                />
            </div>


        )
    }
}

export default JBAsset;
