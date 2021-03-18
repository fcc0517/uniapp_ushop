//处理图片自适应工具

let actionimage = function(e){
	var imageWidth = e.detail.width,  //获取真实的宽高
		imageHeight = e.detail.height,
		imageScale = imageWidth/imageHeight; //获取真实的宽高比
	var autoWidth = "",  //设置自适应的宽高
		autoHeight = "";
	//获取屏幕的宽度，设置自适应的宽度等于屏幕的宽度，
	const res = uni.getSystemInfoSync();
	autoWidth = res.windowWidth;
	autoHeight= autoWidth / imageScale;
	
	return {autoWidth,autoHeight};
	// this.autoHeight = autoHeight;
	// this.autoWidth = autoWidth;
}

export default actionimage;