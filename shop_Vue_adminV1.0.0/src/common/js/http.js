import axios from 'axios'
import store from '../../store'
/**
 * 携带令牌的get方法
 * @param {请求地址} url 
 * @param {提交的数据} data 
 */
function get(url,params = {}){
    return new Promise((resolve,reject)=>{
        axios({
            url,
            params,
            headers:{
                'Authorization':store.state.adminUser.token
            }
        }).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
} 

/**
 * 携带令牌的post请求
 * @param {请求地址} url 
 * @param {提交的数据} data 
 */
function post(url,data = {}){
    return new Promise((resolve,reject)=>{
        axios({
            url,
            method:'post',
            data,
            headers:{
                'Authorization':store.state.adminUser.token
            }
        }).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
} 
export default { get,post }