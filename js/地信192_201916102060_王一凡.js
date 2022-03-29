	    //定义一个矢量图层
		var source = new ol.source.Vector();
	    //单击缩小功能按钮
        document.getElementById('zoom-out').onclick=function(){
            var view=map.getView();
            var zoom=view.getZoom();
            view.setZoom(zoom-1);
        };
        //单击放大按钮功能
        document.getElementById('zoom-in').onclick=function(){
            var view=map.getView();
            var zoom=view.getZoom();
            view.setZoom(zoom+1);
        };
		//实例化鹰眼控件（OverviewMap）,自定义样式的鹰眼控件
        var overviewMapControl = new ol.control.OverviewMap({
        	className: 'ol-overviewmap ol-custom-overviewmap', //鹰眼控件样式（see in overviewmap-custom.html to see the custom CSS used）
            //鹰眼中加载同坐标系下不同数据源的图层
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM({
                        'url': 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                    })
                })
            ],
            collapseLabel: '\u00BB', //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
            label: '\u00AB', //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
            collapsed: true //初始为折叠显示方式
        });
        //图层列表
        var layer = new Array();  //map中的图层数组
        var layerName = new Array();  //图层名称数组
        var layerVisibility = new Array();  //图层可见属性数组
        /**
        * 加载图层列表数据
        * @param {ol.Map} map 地图对象
        * @param {string} id 图层列表容器ID
        */
       function loadLayersControl(map, id) {
       	var treeContent = document.getElementById(id); //图层目录容器
       	var layers = map.getLayers(); //获取地图中所有图层
       	for (var i = 0; i < layers.getLength(); i++) {
       		//获取每个图层的名称、是否可见属性
       		layer[i] = layers.item(i);
            layerName[i] = layer[i].get('name');
            layerVisibility[i] = layer[i].getVisible();
            //新增li元素，用来承载图层项
            var elementLi = document.createElement('li');
            treeContent.appendChild(elementLi); // 添加子节点
            //创建复选框元素
            var elementInput = document.createElement('input');
            elementInput.type = "checkbox";
            elementInput.name = "layers";
            elementLi.appendChild(elementInput);
            //创建label元素
            var elementLable = document.createElement('label');
            elementLable.className = "layer";
            //设置图层名称
            setInnerText(elementLable, layerName[i]);
            elementLi.appendChild(elementLable);
            //设置图层默认显示状态
            if (layerVisibility[i]) {
            	elementInput.checked = true;             
            }
            addChangeEvent(elementInput, layer[i]);  //为checkbox添加变更事件
           }
       }
       /**
        * * 为checkbox元素绑定变更事件
        * @param {input} element checkbox元素
        * @param {ol.layer.Layer} layer 图层对象
        */
       function addChangeEvent(element, layer) {
       	element.onclick = function () {
       		if (element.checked) {
       			layer.setVisible(true); //显示图层
       		}
       		else {
       			layer.setVisible(false); //不显示图层
       		}
       	};
       }
       /**
        * 动态设置元素文本内容（兼容）
        * */
       function setInnerText(element, text) {
            if (typeof element.textContent == "string") {
                element.textContent = text;
            } else {
                element.innerText = text;
            }
        }
        //地图关联
        var view = new ol.View({
            center: [0, 0],
            zoom: 2
        });       
        //实例化Map对象加载地图
        var map = new ol.Map({
            target: 'map', //地图容器div的ID
            //地图容器中加载的图层
            layers: [
            //加载瓦片图层数据
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                    name: '世界地图(OSM瓦片)'
                }),
                new ol.layer.Tile({
                     source: new ol.source.Stamen({layer: 'watercolor'}),
                     name: 'Stamen地图'
                }),
                new ol.layer.Vector({
                    source: new ol.source.Vector({
                        url: 'countries.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    name: '国界(Json格式矢量图)'
                }),
                googleLayer = new ol.layer.Tile({
                	source: new ol.source.XYZ({
                		url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
                	}),
                	visible: true,
                	name: "谷歌卫星地图"
                }),
                layer_huitu = new ol.layer.Vector({
                	source: source,
                	name: "绘图",
                	style: new ol.style.Style({
                		//填充内部颜色设置
                		fill: new ol.style.Fill({
                			color: '#c6ffcd'
                			}),
                			stroke: new ol.style.Stroke({ //要素边界样式
                				color: '#d8fad8',
                				width: 2
                			}),
                			image: new ol.style.Circle({ //图片样式跟着鼠标移动的图片
                				radius: 4,
                				fill: new ol.style.Fill({
                					color: '#f8d2ff'
                				})
                			})
                		})
                	})
                ],
                view:view,
                controls: ol.control.defaults().extend([
                	new ol.control.FullScreen()  //加载全屏显示控件（目前支持非IE内核浏览器）
                	])
                });
        //实例化Map1对象加载地图
        var map1 = new ol.Map({
        	target: 'map1',
        	layers: [
        	new ol.layer.Tile({ source: new ol.source.OSM({ url: 'http://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' }) })
        	],
        	view:view
        });
        //实例化比例尺控件（ScaleLine）
        var scaleLineControl = new ol.control.ScaleLine({
        	units: "metric" //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
        });
        map.addControl(scaleLineControl)//加载比例尺控件
        //实例化ZoomSlider控件并加载到地图容器中
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
        //实例化zoomToExtent控件并加载到地图容器中
        var zoomToExtent = new ol.control.ZoomToExtent({
        	extent: [
        	13100000, 4290000,
        	13200000, 5210000
        	]
        });
        map.addControl(zoomToExtent);
        var mousePositionControl = new ol.control.MousePosition({
        	coordinateFormat: ol.coordinate.createStringXY(4), //坐标格式
        	projection: 'EPSG:4326', //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
        	className: 'custom-mouse-position', //坐标信息显示样式，默认是'ol-mouse-position'
        	target: document.getElementById('mouse-position'), //显示鼠标位置信息的目标容器
        	undefinedHTML: '&nbsp;'//未定义坐标的标记
        	});//实例化鼠标位置控件（MousePosition）
        map.addControl(mousePositionControl);//将鼠标位置控件加载到地图容器中
        map.addControl(overviewMapControl);
        //加载图层列表数据
        loadLayersControl(map, "layerTree");
        map.addControl(mousePositionControl);
        //显示和隐藏右侧地图
        $("#display-yes").click(function(){
        	$("#map1").show();
        	$("#map").css("width","62%");
        });
        $("#display-no").click(function(){
        	$("#map1").hide();
        	$("#map").css("width","100%");
        });
        //绘制功能
		//绘制点
		var drawpoint = new ol.interaction.Draw({
			source: source,
			type: 'Point',
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 0, 0, 0.2)'
					}),
					stroke: new ol.style.Stroke({ //要素边界样式
						color: '#FFA500',
						width: 2
					}),
					image: new ol.style.Circle({ //图片样式跟着鼠标移动的图片
						radius: 7,
						fill: new ol.style.Fill({
							color: '#FFA500'
						})
					})
				}),
		   });
		//绘制线
		var drawline = new ol.interaction.Draw({
			source: source,
			type: 'LineString',
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0, 255, 127, 0.8)'
					}),
					stroke: new ol.style.Stroke({ //要素边界样式
						color: '#ffaaff',
						width: 2
					}),
					image: new ol.style.Circle({ //图片样式跟着鼠标移动的图片
						radius: 9,
						fill: new ol.style.Fill({
							color: '#FFA54F'
						})
					})
				})
			});		   
        //绘制矩形
        var drawrect = new ol.interaction.Draw({
        	source: source,
        	type: 'LineString',
        	style: new ol.style.Style({
        		fill: new ol.style.Fill({
        			color: 'rgba(131, 255, 141, 0.8)'
        			}),
        			stroke: new ol.style.Stroke({ //要素边界样式
        				color: '#edfab2',
        				width: 2
        			}),
        			image: new ol.style.Circle({ //图片样式跟着鼠标移动的图片
        				radius: 20,
        				fill: new ol.style.Fill({
        					color: '#fff3aa'
        				})
        			})
        			}),
        			maxPoints: 2,
        			geometryFunction: function(coordinates, geometry) {
						if(!geometry) {
							geometry = new ol.geom.Polygon(null);
						}
						var start = coordinates[0];
						var end = coordinates[1];
						geometry.setCoordinates([
							[start, [start[0], end[1]], end, [end[0], start[1]], start] //矩形
						]);
						return geometry;
        			}
				});
		//绘制圆
		var drawcircle = new ol.interaction.Draw({
			source: source,
			type: 'Circle',
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 172, 226, 0.8)'
					}),
					stroke: new ol.style.Stroke({ //要素边界样式
						color: '#e5ff9b',
						width: 2
					}),
					image: new ol.style.Circle({ //图片样式跟着鼠标移动的图片
						radius: 7,
						fill: new ol.style.Fill({
							color: '#baffaa'
						})
					})
				})
			});
		//绘制多边形
		var drawploy = new ol.interaction.Draw({
			source: source,
			type: 'Polygon',
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(169, 255, 111, 0.8)'
					}),
					stroke: new ol.style.Stroke({
						color: '#c5cda9',
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 9,
						fill: new ol.style.Fill({
							color: '#fff2e5'
						})
					})
				})
			});
		document.getElementById("mian1").onclick = function() {
			map.addInteraction(drawploy);
			map.removeInteraction(drawpoint);
			map.removeInteraction(drawline);
			map.removeInteraction(drawcircle);
			map.removeInteraction(drawrect);
		};
		$("#mian").change(function() {
			var Miantype = $(this).children('option:selected').val(); //这就是selected的值
			//var Miantype=$("#mian").find("option:selected").val();
			if(Miantype == "ploy") {
				$("#mian1").click(function(){
					map.addInteraction(drawploy);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawrect);
				})
					map.addInteraction(drawploy);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawrect);
			} 
			else if(Miantype == "rect") {						
				$("#mian1").click(function(){
					map.addInteraction(drawrect);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawploy);
				})
					map.addInteraction(drawrect);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawploy);
			} 
			else if(Miantype == "circle") {
				$("#mian1").click(function(){
					map.addInteraction(drawcircle);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawrect);
			        map.removeInteraction(drawploy);
				})
					map.addInteraction(drawcircle);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawrect);
			        map.removeInteraction(drawploy);
			}
		});
		document.getElementById("xian").onclick = function() {
					map.addInteraction(drawline);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawrect);
			        map.removeInteraction(drawploy);
		};
		document.getElementById("dian").onclick = function() {
					map.addInteraction(drawpoint);
			        map.removeInteraction(drawline);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawrect);
			        map.removeInteraction(drawploy);
		};		
		document.getElementById("tingzhi").onclick = function() {					
					map.removeInteraction(drawline);
			        map.removeInteraction(drawpoint);
			        map.removeInteraction(drawcircle);
			        map.removeInteraction(drawrect);
			        map.removeInteraction(drawploy);
		};
		document.getElementById("clear").onclick = function() {
			source.clear();
		};
		//样式选择
		var colorInput=document.getElementById("inputcolor");
		var colorPane=document.getElementById("colorpane");
		var ColorHex=new Array('00','33','66','99','CC','FF');
		var SpColorHex=new Array('FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF');
		var current=null;
		window.onload=function(){
			var colorTable='';
			for (i=0;i<2;i++){
				for (j=0;j<6;j++){
					colorTable=colorTable+'<tr height=15>';
					colorTable=colorTable+'<td width="15" onclick=changeColor(#000000) style="background:#000000">';
					if (i==0){
						colorTable=colorTable+'<td width="15" onclick=changeColor("#'+ColorHex[j]+ColorHex[j]+ColorHex[j]+'") style="cursor:pointer;background:#'+ColorHex[j]+ColorHex[j]+ColorHex[j]+'">';
					}else{
						colorTable=colorTable+'<td width="15" onclick=changeColor("#'+SpColorHex[j]+'") style="cursor:pointer;background:#'+SpColorHex[j]+'">';
					}
					colorTable=colorTable+'<td width="15" onclick=changeColor("#000000") style="background:#000000">';
					for (k=0;k<3;k++){
						for (l=0;l<6;l++){
							colorTable=colorTable+'<td width="15" onclick=changeColor("#'+ColorHex[k+i*3]+ColorHex[l]+ColorHex[j]+'") style="cursor:pointer;background:#'+ColorHex[k+i*3]+ColorHex[l]+ColorHex[j]+'">';
						}
					}
					}
				}
			colorTable='<table border="0" cellspacing="0" cellpadding="0" style="border:1px #000000 solid;border-bottom:none;border-collapse: collapse;width:337px;" bordercolor="000000">'+'<tr height=28><td colspan=21 bgcolor=#ffffff style="font:12px tahoma;padding-left:2px;">'+'<span style="float:right;padding-right:3px;cursor:pointer;" onclick="closePane()">×关闭</span>'+'</td></table>'+'<table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000" style="cursor:pointer;">'+colorTable+'</table>';
			document.getElementById("colorpane").innerHTML=colorTable;
		}
		colorInput.onclick=function(){colorPane.style.display="";}
		function closePane(){colorPane.style.display="none";}
		var rgbcc;
		function changeColor(obj){
			colorInput.value=obj;
			coleagin=colorInput.value
			rgbcc="'" +"rgba(" + parseInt("0x" + colorInput.value.slice(1, 3)) + ","
			+ parseInt("0x" + colorInput.value.slice(3, 5)) + "," + parseInt("0x" + colorInput.value.slice(5, 7))  +")"+"'";
			console.log(rgbcc);
			layer_huitu.getStyle().getFill().setColor(colorInput.value);
			console.log(coleagin);			
		}
		//线宽
		var coleagin;
		var linewith;
		$(function() {
			$('#inputlinekuan').focus(function() {
				$('#inputlinekuan').text('');
			});
			$('#inputlinekuan').blur(function() {
				linewith = $(this).val();
				console.log(linewith);
				layer_huitu.getStyle().getStroke().setWidth(linewith);
				linewith = $.trim(linewith);
				if(linewith == '')
				$('#inputlinekuan').text('');				
			});
		})
		//边框颜色				
		document.getElementById("sure").onclick = function() {
			var width_color = document.getElementById('color_line').value;
			layer_huitu.getStyle().getStroke().setColor(width_color);
		};
		//图层控制的显示与隐藏
		$(document).ready(function(){
			$("#control1").click(function(){
				$("#layerControl").toggle();
			});
		});
		//样式选择面板的显示与隐藏
		$(document).ready(function(){
			$("#control2").click(function(){
				$("#yangshiboxcontrol").toggle();
			});
		});