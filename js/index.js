$(function(){
	$.ajax({
				url : "json/products_tehui.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						products : responseData
					};
					var html = template("index_template", data);
					//console.log(html);
					$("#tehui ul").eq(0).append(html);
					$("#tehui1 ul").eq(0).append(html);
					$("#tehui2 ul").eq(0).append(html);
					$("#tehui3 ul").eq(0).append(html);
					$("#tehui4 ul").eq(0).append(html);
				}
			});
	$.ajax({
				url : "json/products_cbr1.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						products: responseData
					};
					var html = template("index_template", data);
					//console.log(html);
					$(".cbr1 ul").append(html);
				}
			});
	$.ajax({
				url : "json/products_cbr2.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						products: responseData
					};
					var html = template("index_template", data);
					//console.log(html);
					$(".cbr2 ul").append(html);
				}
			});
	$.ajax({
				url : "json/products_cbr3.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						products: responseData
					};
					var html = template("index_template", data);
					//console.log(html);
					$(".cbr3 ul").append(html);
				}
			});
	$.ajax({
				url : "json/products_ads.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						ads: responseData
					};
					var html = template("ads_template", data);
					//console.log(html);
					$(".ad_container ul").append(html);
				}
			});
		
	//判断是否登录
	
	//点击地址框，弹出地址栏
	$("#showAdd").click(function(){
		$("#add").show();
		$("#opacityBox").show();
		
		$("a").click(function(event){
			var src = event.target;
			//console.log(src.innerHTML);
			$("#showAdd").val(src.innerHTML);
			//console.log($("#showAdd").value);
			$("#add").hide();
			$("#opacityBox").hide();
		});
	
	});

	
	//轮播图
		var $imgs = $("#banner li"),//首先获取图片数组
			len = $imgs.length,//获取到这个图片数组的个数
			imgWidth = $imgs.eq(0).outerWidth(),//获取到单个图片的宽
			currentIndex = 1,
			nextIndex = currentIndex + 1,
			circle=[],
			html="",//为添加小圆点准备
			isMoving=true,
			timer = null;	
		timer = setInterval(move,3000)//三秒换一张图片
		/*克隆图片*/
		var first=$imgs.eq(0).clone(true),
			last=$imgs.eq(len-1).clone(true);
		$("#banner #imgbox").append(first).prepend(last)
					   .css({
					   	width: (len+2)*imgWidth,
					   	left:-imgWidth
					   });;
		len+=2;
		console.log(len);
		
		/*创建小圆点*/
		for(var i = 0; i < len-2; i++){//计算需要创建多少个小圆点
			html += "<div></div>";
		};
		$(html).appendTo('#pages').addClass('circle').eq(0).addClass('current');
		var circleWidth = $(".circle").eq(0).outerWidth();
			$("#pages").css({
				width: ((len-2)*circleWidth)+"px"
			});
			
		/*添加小圆点移入事件*/
		$("#pages").on("mouseover",".circle",function () {
			if ((currentIndex-1) === $(this).index()) {
				return;
			}
			nextIndex = $(this).index()+1;
			move();
		})
		/*添加鼠标移入暂停，移出继续*/
		$("#banner").hover(function() {
			clearInterval(timer);
			$("#prev").show(400);
			$("#next").show(400);
		}, function() {
			timer = setInterval(move,3000);
			$("#prev").hide();
			$("#next").hide();
		});
		/*添加上下翻页*/
			$("#prev").click(function() {
				if (isMoving===false) {
					nextIndex = currentIndex - 1;
					if (nextIndex < 1) {
						nextIndex = len -2;
					}
					move()
				};
			});
			$("#next").click(function(){
				if (isMoving===false) {
					move()
				};
			});
		/* 轮播动画创建*/
		function move() {
			isMoving=true;
			var _left=-1*imgWidth*nextIndex;
			$("#banner #imgbox").stop().animate({
				left: _left}, function() {
				isMoving = false;
				if (nextIndex >=len) {
					$("#banner #imgbox").css({
						left:-imgWidth
					});
					currentIndex=1;
					nextIndex=2;
				}
			});
			//实现小圆点的颜色与当前图片对应
			var cirleIndex = (nextIndex == len - 1) ? 0 : (nextIndex - 1);
			$("#pages div").eq(cirleIndex).addClass("current").siblings().removeClass("current");
			
			currentIndex = nextIndex;
			nextIndex++;
		}
	
	
	//广告页面轮播
	var adWidth = $(".ad .ad_container").eq(0).outerWidth();
	$(".ad .pre").click(function(){
		var _ulleft = parseFloat($(".ad .ad_container ul").css("left"));
		console.log(_ulleft);
		if(_ulleft === 0){
			/*$(".ad .ad_container ul").eq(0).css({left:-adWidth});*/
			$(".ad .ad_container ul").eq(0).animate({left:-adWidth},1000);
		}else{
			/*$(".ad .ad_container ul").eq(0).css({left:0});*/
			$(".ad .ad_container ul").eq(0).animate({left:0},1000);
		}
	});
	
	
	
	
	//楼层导航
	var headerHeight = $(".kinds:eq(0)").offset().top, // 头部布局结构的高度
		winHeight = $(window).height(), // 窗口高度
		isMoving = false, // 标记是否是由于点击导航发生的滚动行为，true:点击触发  false:非点击
		currentFloorIndex = 0; // 当前显示楼层的索引

	// 绑定页面滚动的事件
	$(window).on("scroll", function(){
		if (!isMoving) {
			var _scrollTop = $(window).scrollTop(); // 获取页面滚动高度
			// 判断滚动距离
			if (_scrollTop >= headerHeight - winHeight / 2) {
				$("#menu").stop().fadeIn();
			} else {
				$("#menu").stop().fadeOut();
			}

			// 遍历每个楼层
			$(".kinds").each(function(index, element){
				// 求当前遍历到楼层在文档中距离文档顶部的绝对定位
				var _top = $(element).offset().top;
				// 与滚动距离判断
				if (_scrollTop >= _top - winHeight / 2) {
					$("#menu li").eq(index).children("span").show().end()
								 .siblings().children("span").hide();
					currentFloorIndex = index; // 标记当前正显示楼层的索引
				}
			});
		}
	});

	// 点击导航楼层跳转
	$("#menu li").click(function(){
		var floorIndex = $(this).index(),
			_top = $(".kinds").eq(floorIndex).offset().top; // 计算应该页面滚动的高度
		isMoving = true;

		$(this).children("span").show().end()
			   .siblings().children("span").hide();

		// 实现页面滚动效果
		$("html,body").stop().animate({scrollTop: _top}, 1000, function(){
			isMoving = false;
		});
	}).hover(function(){
		$(this).children("span").show();
	}, function(){
		if ($(this).index() !== currentFloorIndex)
			$(this).children("span").hide();
	});

	/*$("#menu li:last").click(function(){
		$(window).scrollTop(0);
		// $("html,body").animate({scrollTop:0}, 1000);
	});*/

	
});
