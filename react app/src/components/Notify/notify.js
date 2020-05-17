import React, {Component} from 'react';
import { Menu} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons"


class Notify extends Component {
    getTimesheet(id, timesheetId) {
        this.props.unReadNotify(timesheetId, id)
    }

    render() {
        return (
            <div className="notifyheadmain">

                    { this.props.notifications.length !== 0 &&
                     <Menu className="notify_not_empty">
                        <div className="notifyhead">
                            <p> Notifications <span onClick={this.props.markAllRead}> Mark All as Read </span></p>
                        </div>
                        {this.props.notifications.map((obj, i) =>
                            <Menu.Item
                                style={{
                                    backgroundColor: this.props.color[i],
                                    fontWeight: this.props.fontWeight[i]
                                }}
                                key={i}
                                onClick={() => this.getTimesheet(obj.target_object_id, obj.id)}>
                                <div>

                                    <ClockCircleOutlined />
                                    {obj.description}
                                </div>
                            </Menu.Item>
                        )}
                    </Menu>
                    }
                    {
                        this.props.notifications.length <=0 &&
                            <Menu>
                        <Menu.Item className="notifications"
                                   key="No data">
                            <div >
                                <span>No notifications</span>
                            </div>
                        </Menu.Item>
                            </Menu>
                    }
            </div>

        )
    }
}

export default Notify;
