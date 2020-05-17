import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route,Switch, HashRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import { config } from "./init-fcm";
import firebase from "firebase";
import rootReducer from './reducers/'
import Login from './components/Login/login';
import Dashboard from './components/marketingHome/dashboard'
import {loadState} from "./localStorage";
import Archive from "./views/marketingHomeView/archive";
import CalendarComponent from "./components/calendarComponents/calendarComponent";
import Profile from "./views/userForms/profile";
import OldSubmission from "./views/marketingHomeView/oldsubmission";
import AddUser from "./components/createForms/addUser";
import ManageProfiles from "./components/manageProfiles";
import ResetPswd from "./views/userForms/resetPswd";
import Lead from "./views/marketingHomeView/lead";
import Submission from "./views/marketingHomeView/submission";
import Interview from "./views/marketingHomeView/interview";
import PO from "./views/marketingHomeView/po";
import Bench from "./views/consultant";
import EmailManage from "./views/marketingHomeView/emailManage";
import Info from "./views/info";
import Finance from "./views/marketingHomeView/finance";
import Timesheet from "./views/marketingHomeView/timesheet";
import DescriptionTab from "./components/Consultant/descriptionTab";
const store = createStore(rootReducer);
firebase.initializeApp(config);
const routing = (
    <Router basename="/">
        <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login}/>
            <Route path="/index" component={Info}/>
            <Route path="/home" component={Dashboard}/>
            <Route path="/home/lead" component={Lead}/>
            <Route path="/home/submission" component={Submission}/>
            <Route path="/home/interview" component={Interview}/>
            <Route path="/home/po" component={PO}/>
            <Route path="/home/bench" component={Bench}/>
            <Route path="/home/archive" component={Archive}/>
            <Route path="/home/finance" component={Finance}/>
            <Route path="/home/assets" component={EmailManage}/>
            <Route path="/home/profile" component={Profile}/>
            <Route path="/home/oldsubmission" component={OldSubmission}/>
            <Route path="/home/addUser" component={AddUser}/>
            <Route path="/home/manageprofile" component={ManageProfiles}/>
            <Route path="/calendar" component={CalendarComponent}/>
            <Route path="/consultant" component={DescriptionTab}/>
            <Route path="/resetpswd" component={ResetPswd}/>
            <Route path="/timesheet" component={Timesheet}/>

        </Switch>
    </Router>
);
store.subscribe(() => {
    loadState({data: localStorage.getItem('DATA')});

});
ReactDOM.render(<Provider store={store}>
    {routing}
</Provider>, document.getElementById('root'));

