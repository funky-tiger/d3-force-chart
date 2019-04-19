***基于d3实现一个react力导向图插件***

## d3-force-chart插件介绍
- 基于d3.js封装一套力导向图的react插件, 可缩放，可拖动。可点击节点动态生成子节点。
- 提供力导向图相关参数，可自定义不同效果的力导向图。
- 提供点击事件，提供力导向图数据更新方法，可点击节点动态生成子节点。

## 使用方法
- 安装 npm i d3-force-chart
- 引入 import D3ForceChart from 'd3-force-chart';
- 使用 <D3ForceChart />
- 传参 <D3ForceChart forceData={newNodes:[...], newEdges:[...]} ...其他参数 />

## 相关 API
- HEIGHT/WIDTH -> type:Number
> 图表的高宽   
> *默认HEIGHT = window.innerWidth / HEIGHT = window.innerHeight
- >>>
- ScaleExtent -> type:Array
> 缩放比例   
> *默认 ScaleExtent = [1 / 10, 10]
- >>>
- CenterLocation -> type:Object
> 图表坐标中心   
> *默认 CenterLocation ={ x:WIDTH/2, y:HEIGHT/2} -> 即屏幕可视区域的中心点
- >>>
- TextLocation -> type: Object
> 文字标签的位置   
> *默认 TextLocation = { dx:20, dy:8 }
- >>>
- Strength -> type: Number
> 节点间的作用力   
> *默认 Strength = -380
- >>>
- DistanceMax -> type: Number
> 节点间的最大距离   
> *默认 DistanceMax = -300
- >>>
- StrokeWidth -> type: Number
> 节点间连线的宽度   
> *默认 StrokeWidth = 1
- >>>
- DragStartAlphaTarget / DragEndAlphaTarget -> type: Number
> 开始/结束拖拽系数   
> *默认 DragStartAlphaTarget = 0.5 / DragEndAlphaTarget = 0
- >>>
- ImageSizeLocation -> type: Object
> 节点图片的大小和位置   
> *默认 ImageSizeLocation = { x:-15px, y:-15px, w:30px, h:30px }
> x ： 横坐标， y ： 竖坐标， w ： 图片宽度， h ： 图片高度
- >>>
- ForceData -> type: Object
> 力导向图的真实数据  
>  *格式 [nodes: {"name":"*","url":"*"}, edges:  {"source":1,"target":0} ]  
>  *默认 不传递forceData参数即为默认数据
- >>>
- OnUpdateData -> type: Function
> 节点点击事件
>   *参数 ( d, i, nodes, edges, restart )
>       d: 当前点击的子节点
>       i: 当前点击的子节点的下表    
>       nodes: 点击前数据的所有节点node
>       edges: 点击前数据的所有节点间的关系
>       restart: 图表更新方法 在原有数据基础上添加新数据之后 再调用此方法更新图表
- >>>
- OnLongPressDown -> type: Function
> 节点长按事件
>   *参数 ( d )
>       d: 当前长按的子节点
>  
- >>>
- OnNodesClick -> type: Boolen
> 不管是模拟数据节点还是真实数据节点 在默认情况下每个节点都是有点击事件的
> 传递OnNodesClick为true后 可取消节点的点击事件
> *默认OnNodesClick = { false }

## 注意事项
- 使用此插件必须遵守一定的数据结构。
> 数据节点（nodes）和节点间的关系（edges）缺一不可
> 同时要保证节点关系正确性
> nodes: {"name":"*","url":"*"} -> name 节点文字描述， url 节点图片地址。
> edges:  {"source":1,"target":0} -> source源，target目标。
- 本插件在不传递任何参数情况下会默认有模拟数据。传递真实数据后 效果即为真实数据效果。

## github
- https://github.com/funky-tiger/d3-force-chart.git

