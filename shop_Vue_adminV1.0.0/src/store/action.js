import http from '../common/js/http'
import apis from '../common/js/api'
import axios from 'axios'
export default{
    getNavMenuSync({commit},params = {}){
        return new Promise((reslove,reject)=>{
            http.get(apis.menulist,params).then(res=>{
                commit('setNavMenu',res.data.list)
                reslove(res)
            })
        })
    },
    userLoginSync({commit},userinfo){
        return new Promise((reslove,reject)=>{
            axios.post(apis.userlogin,userinfo).then(res=>{
                commit('setAdminUser',res.data.list)
                reslove(res)
            })
        })
    },
    userLogoutSync({commit}){
        commit('logout')
    }
}