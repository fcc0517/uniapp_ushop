import baseUrl from "./baseUrl.js"
const http = (options) => {
	return new Promise((reslove, reject) => {
		uni.request({
			url: baseUrl + options.url,
			data: options.data || {},
			method: options.method || 'GET',
			header: options.header || {
				"content-type": "application/json"
			},
			success(res){
				reslove(res)
			},
			fail(error){
				reject(error)
			}

		})
	})
}
export default http