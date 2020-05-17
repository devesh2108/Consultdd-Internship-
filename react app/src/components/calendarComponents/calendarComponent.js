import React from "react";
import BigCalendar from 'react-big-calendar'
import Toolbar from 'react-big-calendar/lib/Toolbar';
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarDatePicker from "./CalendarDatePicker";
import EventDialog from "../createForms/addEvent";
import {fetchGuestList, getEvents} from "../../services/service";
import {Checkbox, Drawer, Radio} from 'antd';
import DetailTabView from "../viewForms/submissionTab/detailTabView";


const customEventPropGetter = (event) => {
    let color;
    if (event.ctb === "bbookingg@gmail.com") {
        color = '#00989a'
    } else if (event.ctb === "kritika.t@consultadd.in") {
        color = "#228B22"

    } else if (event.ctb === "bharat.b@consultadd.com") {
        color = "#8714aa"

    } else if (event.ctb === "nisha.k@consultadd.com") {
        color = "#600022"

    } else if (event.ctb === "niti.p@consultadd.com") {
        color = "#b9c709"

    } else if (event.ctb === "ankit.p@consultadd.com") {
        color = "#c77802"

    } else {
        color = '#537ff2'
    }
    return {
        className: 'special-day',
        style: {
            backgroundColor: color
        },
    }
}


class CustomToolbar extends Toolbar {
    componentDidMount() {
        const view = this.props.view;

    }

    render() {
        return (
            <div className="rbc-toolbar">
                <div className="rbc-toolbar-label">{this.props.label}</div>
                <div className="rbc-btn-group calenbutton">
                    <button type="button" onClick={this.view.bind(null, 'week')}>Week</button>
                    <button type="button" onClick={this.view.bind(null, 'day')}>Day</button>
                </div>
            </div>
        );
    }
}

class WeekToolbar extends Toolbar {
    componentDidMount() {
        const view = this.props.view;
    }

    render() {
        return (
            <div className="rbc-toolbar">
                <div className="rbc-toolbar-label">{this.props.label}</div>
                <div className="rbc-btn-group">

                    <button type="button" onClick={this.view.bind(null, 'week')}>Week</button>
                </div>
            </div>
        );
    }
}

class CalendarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            open: true,
            selected: true,
            start: null,
            end: null,
            startDate: new Date(),
            eventDialogIsOpen: false,
            eventDialog: false,
            day: null,
            // views: ["day", "week"],
            selected_event: {},
            events: [
                {
                    "title": "",
                    "description": "",
                    "created": "",
                    "updated": "",
                    "start": "",
                    "end": "",
                    "attendees": [
                        ""
                    ],
                    "attachments": ""
                }
            ],
            eventList: {},
            interview_id: 0,
            calendar_email: 'sarang.m@consultadd.in',
            test_email: [],
            emailArray: ['bbookingg@gmail.com'],
            status: null,
            view: false,
            calendarData: {},
            selectedIndex:3

        };
        const m = moment.tz.setDefault('America/New_York');
        this.localizer = BigCalendar.momentLocalizer(m);
        this.closeModal = this.closeModal.bind(this);
        this.onDatePick = this.onDatePick.bind(this);
        this.onSlotChange = this.onSlotChange.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.getCurrentWeek = this.getCurrentWeek.bind(this);
        this.onChange = this.onChange.bind(this);
        console.log("-------------", this.props.submissionId)

    }


    componentDidMount() {


        const data = JSON.parse(localStorage.getItem('DATA'));
        const token = data.token;
        const company = data.team;
        const role = data.roles;

        if (!token && !role.length !==0 && !company) {
            this.props.history.push("/login");
        }
        var current_date = moment(new Date()).tz('America/New_York').format("YYYY-MM-DD");

        this.getCurrentWeek(current_date, this.state.calendar_email);
        this.getInterviewee();
    }
    handleSelect = index => {
        console.log(index)
        this.setState({selectedIndex: index});
    };

    removeEvents(checkedValues) {

        let temp = [];

        Object.keys(this.state.calendarData).map((key, index) => {

            if (checkedValues.includes(key)) {
                this.state.calendarData[key].map((item, i) => (

                    temp.push(item)
                ))
            }

        })
        this.setState({eventList: temp});


    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getInterviewee() {
        fetchGuestList("")
            .then((res) => {

                const statusCode = res.status;
                const response = res.json();
                return Promise.all([statusCode, response]);
            })
            .then(([status, response]) => {
                let tempArray = []
                let ctb = {}
                response.results.map((item, i) => {
                    ctb = {
                        'label': item.name,
                        'value': item.email,
                        'color': this.getRandomColor()
                    }


                    tempArray.push(ctb)
                })
                this.setState({test_email: tempArray})

            })
    }

    onChange(checkedValues) {
        //console.log("checkedValues",checkedValues, this.state.emailArray)
        var filteredData = this.state.emailArray.filter(item1 =>

            !checkedValues.some(item2 =>
                (item2 === item1)
            ))
        var selectedValue = checkedValues.filter(item1 =>

            !this.state.emailArray.some(item2 =>
                (item2 === item1)
            ))
        //console.log("selectedValue",selectedValue)
        var current_date = moment(new Date()).tz('America/New_York').format("YYYY-MM-DD");
        var end_date = moment(new Date() + 10).tz('America/New_York').format("YYYY-MM-DD");

        //console.log("filteredData",filteredData)
        if (checkedValues.length !== 0 && selectedValue.length !== 0) {
            this.setState({calendar_email: selectedValue[0]})
            this.getCurrentWeek(current_date, selectedValue[0]);
        } else {
            this.setState({eventList: []})
        }
        this.setState({emailArray: checkedValues})
        delete this.state.calendarData[filteredData[0]]
        this.removeEvents(checkedValues)

    }

    closeModal() {
        //this.props.handleClose();
        this.setState({
            open: true,
            view: false,
            modal: false,
            eventDialog: false,
            eventDialogIsOpen: false
        },()=>{
            var current_date = moment(new Date()).tz('America/New_York').format("YYYY-MM-DD");
            this.getCurrentWeek(current_date, this.state.calendar_email);
        });
        //this.props.handleClose()
    }

    onSlotChange(slotInfo) {
        //console.log(slotInfo)
        var startDate = moment(slotInfo.start).tz('America/New_York');
        var endDate = moment(slotInfo.end).tz('America/New_York');
        //console.log("slot info",startDate, endDate)

        this.setState({
            eventDialog: true,
            eventDialogIsOpen: true,
            //open: false,
            end: endDate,
            start: startDate
        });
    }

    getEvents(curr_date, end_date, email) {
        this.setState({events: []})
        getEvents(curr_date, end_date, email)
            .then((res) => {

                const statusCode = res.status;
                const response = res.json();
                return Promise.all([statusCode, response]);
            })
            .then(([status, response]) => {

                let tempList = {};
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    this.props.history.push("/login")
                } else {
                    //this.setState({events: response.results})
                    let temp_event = [];

                    response.result.map((item, i) => (
                            temp_event =
                                {
                                    "interview_id": item.id,
                                    "title": item.title,
                                    "description": item.description,
                                    "created": new Date(item.created),
                                    "updated": new Date(item.updated),
                                    "start": new Date(item.start),
                                    "end": new Date(item.end),
                                    "attendees": [
                                        item.attendees
                                    ],
                                    "attachments": item.attachments,
                                    "ctb": this.state.calendar_email,
                                },

                                this.state.events.push(temp_event)
                        )
                    )
                    tempList = this.state.calendarData;
                    tempList[this.state.calendar_email] = this.state.events;

                }

                this.setState({calendarData: tempList})
                let temp = [];
                Object.keys(this.state.calendarData).map((key, index) => (

                    this.state.calendarData[key].map((item, i) => (

                        temp.push(item)
                    ))

                ))
                this.setState({eventList: temp, status: status});
            })
    }

    getCurrentWeek(current_date, email) {
        var currentDate = moment(new Date(current_date)).tz('America/New_York');

        var weekStart = currentDate.clone().startOf('isoWeek');

        var days = [];

        for (var i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, 'days').format("YYYY-MM-DD"));
        }

        this.getEvents(days[0], days[6], email)
    }

    onDatePick(start) {
        console.log(start)
        this.setState({
            startDate: start,
            start: start,
        });
        this.getCurrentWeek(start, this.state.calendar_email);
        // var startDate = moment(start).format("YYYY-MM-DD")
        // var endDate = moment(start + 10).format("YYYY-MM-DD")
        //this.getEvents(startDate, endDate)
    }

    handleSelect(event) {
        this.setState({modal: true, view: true, selected_event: event})

    }

    tzChange = (event) => {
        this.setState({
            tz: event.target.value
        })
    }

    render() {
        return (

            <div>
                <div className="clalenderview" style={{flexDirection: 'row', padding: '10px'}}>

                    <div style={{flexDirection: 'column'}}>


                        <CalendarDatePicker startDate={new Date(this.state.startDate)} onOk={this.onDatePick}
                                            open={this.state.open}/>
                        <div className="calenderbox" style={{marginTop: '280px'}}>
                            <Checkbox.Group options={this.state.test_email}
                                            defaultValue={['bbookingg@gmail.com']}
                                //defaultValue={['bharat.b@consultadd.com']}
                                //defaultValue={['ankit.p@consultadd.com']}
                                            onChange={this.onChange}/>

                            {
                                this.state.test_email.map((list,i)=>
                                    <div style={{
                                        backgroundColor: list.color,
                                        height: '12px',
                                        width: '15px',
                                        position: 'absolute',
                                        top: '5px',
                                        left: '138px'
                                    }}></div>
                                )
                            }


                        </div>
                    </div>


                    {this.state.status === 200 ?
                        <div className="Calendar_right_section" style={{marginTop: -350}}>
                            <BigCalendar
                                timeslots={1}
                                getNow={() => this.state.startDate == null ? moment(new Date()).tz('America/New_York') : moment(this.state.startDate).tz('America/New_York')}
                                selectable={!this.props.path ? false : this.state.selected}
                                events={this.state.eventList}
                                // min={moment().hours(7).minutes(0).seconds(0).milliseconds(0).toDate()}
                                // max={moment().hours(17).minutes(0).seconds(0).milliseconds(0).toDate()}
                                views={["day", "week"]}
                                localizer={this.localizer}
                                defaultDate={moment(new Date()).tz('America/New_York')}
                                defaultView={this.props.path ? "day" : "week"}
                                date={this.state.startDate == null ? moment(new Date()).tz('America/New_York') : moment(this.state.startDate).tz('America/New_York')}
                                onView={(e) => this.setState({view: e})}
                                className="Calendar_right_section2"
                                style={{
                                    height: "76vh",
                                    marginLeft: "300px",
                                    zIndex: -10,

                                }}
                                onNavigate={(day) => this.setState({startDate: day - 1})}
                                components={

                                    {
                                        toolbar: this.props.path ? CustomToolbar : WeekToolbar
                                    }}
                                onSelectEvent={(e) => this.handleSelect(e)}
                                onSelectSlot={(slotInfo) => this.props.path ? this.onSlotChange(slotInfo) : null}
                                eventPropGetter={customEventPropGetter}
                            />
                            {this.state.modal &&
                            <Drawer
                                title="View Event"
                                width={720}
                                className="eventcalender"
                                onClose={this.closeModal}
                                visible={this.state.view}
                            >
                                <DetailTabView
                                    handleSelect={this.handleSelect}
                                    sub_id={this.props.submissionId}
                                    currentKey={this.state.selectedIndex}
                                    round={null}
                                    handleClose={this.closeModal}/>
                            </Drawer>
                            }
                            {this.state.eventDialog &&
                            <Drawer
                                title="Add Event"
                                width={720}
                                onClose={this.closeModal}
                                visible={this.state.eventDialogIsOpen}
                            >
                                <EventDialog
                                    create={this.props.create}
                                    ctbArray={this.state.emailArray}
                                    setInterviewTab={this.props.setInterviewTab}
                                    submissionId={this.props.submissionId}
                                    handleClose={this.closeModal}
                                    startDate={moment(this.state.start).tz('America/New_York')}
                                    endDate={moment(this.state.end).tz('America/New_York')}/>
                            </Drawer>
                            }


                        </div>
                        :
                        <div>Loading...</div>}
                </div>
            </div>

        );
    }
}

export default CalendarComponent;
