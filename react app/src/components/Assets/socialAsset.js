import React, {Component} from 'react';
import "../../App.css";
import {Divider, Input, Table} from "antd";
import {ShareAltOutlined,DeleteOutlined} from "@ant-design/icons"

class SocialAsset extends Component {


    render() {
        let selectedRowKeys = this.props.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.props.onSelectSocialChange,

        };
        const socialColumns = [
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: '20%',

                render: (text, record) => (
                    <span onClick={() => this.props.socialData(record)}>{text}</span>
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
                        onClick={() => this.props.socialData(record)}/>
                ),
            }, {
                title: 'Provider',
                dataIndex: 'provider',
                key: 'provider',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.socialData(record)}>{text}</span>
                ),
            }, {
                title: 'Technology',
                dataIndex: 'tech',
                key: 'tech',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.socialData(record)}>{text}</span>
                ),
            },
            {
                title: 'Owner',
                dataIndex: 'owner__full_name', //owner_name
                key: 'owner__full_name',//owner_name
                width: '12%',

                render: (text, record) => (
                    <span onClick={() => this.props.socialData(record)}>{text}</span>
                ),
            },
            {
                title: 'Actions',
                key: "action",
                width: '12%',
                render: (text, record) => (
                    <span>
                        <ShareAltOutlined style={{fontSize: 18, color: '#2688db', float: 'left'}}
                              onClick={() => {
                                  this.props.getSpecificAssetData(record.id)

                              }
                              }/>
                        <Divider type="vertical"/>
                        <DeleteOutlined style={{fontSize: 18, color: '#2688db', float: 'auto'}}
                              onClick={() => this.props.showDeleteConfirm(record.id, 'social asset')}/>

        </span>
                )
            }];
        return (

            <div>
                <Table
                    className="assettable"
                    style={{width: '100%'}}
                    rowKey={(record) => record.id.toString()}
                    columns={socialColumns}
                    rowSelection={rowSelection}
                    dataSource={this.props.data}
                    pagination={false}
                />
            </div>


        )
    }
}

export default SocialAsset;
