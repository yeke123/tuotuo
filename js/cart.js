$(function(){
		/*$.ajax({
				url : "../json/cart_products.json",
				type : "get",
				dataType : "json",
				success : function(responseData){
					var data = {
						products : responseData
					};
					var html = template("cartProd_template", data);
					//console.log(html);
					$(".title").after(html);
				}
			})*/
		
		//点击地址框，弹出地址栏
		$("#add_peisong").click(function(){
			$("#add").show();
			$("#opacityBox").show();
		
			$("a").click(function(event){
				var src = event.target;
				//console.log(src.innerHTML);
				$("#add_peisong").val(src.innerHTML);
				//console.log($("#showAdd").value);
				$("#add").hide();
				$("#opacityBox").hide();
			})
		});
		
		/*获取商品cookie*/
		$.cookie.json=true;
		var _products=$.cookie("cartProd") || [];
		console.log(_products);
		//判断购物车是否为空
		if (_products.length === 0) { // 购物车为空
				$("#kong_gwc").css("display","block");
				$("#total").css("display","none");
				return;
			}
		var data={
			products:_products
		}
		//console.log(data);
		var html=template("cartProd_template",data);
		console.log(html);
		//$(html).appendTo($("#cart-list"));
		//$(".title").after(html);	
		$(html).insertBefore("#list_foot").filter(".body").each(function(index, element){
			$(element).data("products", _products[index]);
		});

		
		
		
			/* 修改商品数量：加、减 */
			$("#cart-list").delegate(".add,.minus", "click", function(){
				// 获取点击符号所在行
				var $row = $(this).parents(".body");
				console.log($row);
				// 获取行上缓存的商品对象
				var _product = $row.data("products");
				//console.log(_product);
				// 修改界面显示数量
				if ($(this).is(".add")){ // 当前点击的是 + 
					++_product.num;
				} else{ // 点击的是 -
					if (_product.num <= 1)
						return;
					--_product.num;
				}
				$row.find(".product_count").val(_product.num);
				// 修改显示小计
				$row.children(".xiaoji").text(_product.price * 100 * _product.num / 100);
				// 显示合计
				calcTotal();
				// 修改cookie
				console.log(_product);
				$.cookie("products", _products, {expires:7});
			});
		/* 输入实现修改数量 */
		$("#cart-list").on("blur", ".product_count", function(){
				var _product = $(this).parents(".body").data("products");
				console.log(_product);
				var reg = /^[1-9]\d*$/;
				if (!reg.test($(this).val())) {
					$(this).val(_product.num);
					return;
				}
				// 输入数量正确
				_product.num = $(this).val();
				// 修改小计显示
				$(this).parents(".body").children(".xiaoji").text(_product.price*100 * _product.num/100);
				// 合计
				calcTotal();
				// 修改 cookie
				$.cookie("cartProd", _products, {expires:7});
				var _cookie = $.cookie("cartProd");
				console.log(_cookie);
			});
		
			/* 全选 */
			$(".ck_all").click(function(){
				// 获取当前全选框选中状态
				var status = $(this).prop("checked");
				// 设置所有商品复选框状态与全选一致
				$(".ck_product").prop("checked", status);
				// 计算合计
				calcTotal();
			});
			/* 单选 */
			$(".body :checkbox").click(function(){
				// 计算合计
				calcTotal();
				// 当所有商品行前的复选框选中时，将全选设置为选中状态，否则取消全选选中
				//console.log(_products.length);
				if ($(".body :checkbox:checked").length === _products.length) {
					$(".ck_all").prop("checked", true);
				} else{
					$(".ck_all").prop("checked", false);
				}
			});
			
			/* 删除 */
			$(".body").on("click", ".dele a", function(e){
				alert("进入删除模块");
				e.preventDefault();
				// 删除超级链接所在行
				var $row = $(this).parents(".body");
				console.log($row);
				// 删除的商品对象
				var _product = $row.data("product");
				// 找出在数组中的下标
				var index = $.inArray(_product, _products);
				// 从数组中删除 index 处元素
				_products.splice(index, 1);
				// 从dom结构中删除行
				$row.remove();
				// 从 cookie 中删除当前行的数据
				$.cookie("cartProd", _products, {expires:7});
			});
			
			
			//清空购物车
			$("#dele_cart").click(function(){
				var _conf = confirm("是否清空购物车？");
				if(_conf){
					$(".buy-box").css("display","none");
					$("#kong_gwc").css("display","block");
					$("#total").css("display","none");
					$.cookie("cartProd","", {expires:7});
				}
				
			})
			
			/* 合计 */
			function calcTotal() {
				var _total_p = 0,
				 	_total_n = 0;
				$(".body input:checked").each(function(index, element){
					_total_p += Number($(element).parents(".body").children(".xiaoji").text());
				});
				$("#total_price").text(_total_p.toFixed(2));
				
			}
		
			//提交订单
			$("#order").click(function(event){
				//event.preventDefault();
				//提交订单前先清空订单cookie
				$.cookie.json = true;
				$.cookie("order","",{expires:7});
				var _orderProd = $.cookie("order")||[];
				//console.log("清空cookie"+_orderProd);
					
				$(".body input:checked").each(function(index, element){
					var prod_name = $(element).parents(".body").children(".img_name").children("span").text(),
						prod_standard = $(element).parents(".body").children(".standard").text(),
						prod_num = $(element).parents(".body").children(".amount").children(".product_count").val(),
						prod_src = $(element).parents(".body").children(".img_name").children("img").attr("src"),
						prod_ishave = $(element).parents(".body").children(".ishave").text(),
						prod_price = $(element).parents(".body").children(".danjia").children("span").text(),
						prod_xiaoji = $(element).parents(".body").children(".xiaoji").text();
					//console.log(prod_xiaoji);
					var order = {
						name : prod_name,
						standard : prod_standard,
						num : prod_num,
						src : prod_src,
						ishave:prod_ishave,
						price : prod_price,
						xiaoji : prod_xiaoji
					};
					console.log(order);
					_orderProd.push(order);
					$.cookie("order",_orderProd,{expires:7});
					
				});
				var li=$.cookie("order");
				console.log(li);
			});
	})
