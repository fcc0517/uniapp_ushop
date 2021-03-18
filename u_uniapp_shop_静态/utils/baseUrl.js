let baseUrl = ""
	
if(process.env.NODE_ENV == 'development'){
	baseUrl = "http://localhost:3000"
	
}else{
	baseUrl = "http://www.baidu.com"
}
export default baseUrl