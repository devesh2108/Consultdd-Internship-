import {combineReducers} from 'redux'
import token from './tokenRed'
import team from './companyRed'
import role from './roleRed'
import name from './empNameRed'
import id from './idRed'

export default combineReducers({
    token,
    team,
    role,
    name,
    id

})