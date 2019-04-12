/* eslint-disable no-param-reassign */
import React, { Component } from "react";
import * as d3 from "d3";
import { cheackNodesDiff, _enter, _exit } from "./utils/functions";
import mock_data from "./mock/data.json";

class D3ForceChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeData: [],
      edgesData: []
    };
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.update_edges = [];
    this.update_nodes = [];
    this.zoom = null;
    this.drag = null;
    this.forceChart = this.forceChart.bind(this);
  }
  componentDidMount() {
    // console.log(this.props);
    let {
      OnUpdateData,
      OnBackToPreStep,
      ForceData,
      HEIGHT,
      WIDTH,
      ScaleExtent,
      CenterLocation,
      TextLocation,
      Strength,
      DistanceMax,
      StrokeWidth,
      DragStartAlphaTarget,
      DragEndAlphaTarget,
      ImageSizeLocation,
      OnNodesClick
    } = this.props;

    let nodes;
    let edges;
    let strength = 0;
    let distanceMax = 0;
    let strokeWidth = 0;
    let dragStartAlphaTarget = 0;
    let dragEndAlphaTarget = 0;
    let scaleExtent = [];
    let centerLocation = {};
    let textLocation = {};
    let imageSizeLocation = {};
    let onUpDateData;
    let onBackToPreStep;

    if (!HEIGHT || !WIDTH) {
      // console.error('必须指定宽高.');
      // 默认宽高800
      HEIGHT = 800;
      WIDTH = 800;
    } else {
      HEIGHT = HEIGHT;
      WIDTH = WIDTH;
    }

    if (!ScaleExtent || !Array.isArray(ScaleExtent)) {
      // 默认缩放比例 [1 / 10, 10] -> Array[]
      scaleExtent = [1 / 10, 10];
    } else {
      scaleExtent = ScaleExtent;
    }

    if (
      CenterLocation === undefined ||
      JSON.stringify(CenterLocation) === "{}"
    ) {
      // 默认中心点 容器中间位置 -> Object{}
      /**
       * { x:*, y:*}
       */
      centerLocation.x = WIDTH / 2;
      centerLocation.y = HEIGHT / 2;
    } else {
      centerLocation.x = CenterLocation.x;
      centerLocation.y = CenterLocation.y;
    }

    if (TextLocation === undefined || JSON.stringify(TextLocation) === "{}") {
      //  默认文字标签的位置 -> Object{}
      /**
       * { dx:*, dy:* }
       */
      textLocation.dx = 20;
      textLocation.dy = 8;
    } else {
      textLocation.dx = TextLocation.dx;
      textLocation.dy = TextLocation.dy;
    }

    if (!Strength) {
      // 默认节点间的作用力 -> Number
      strength = -380;
    } else {
      strength = Strength;
    }

    if (!DistanceMax) {
      // 默认节点间的最大距离 -> Number
      distanceMax = -300;
    } else {
      distanceMax = DistanceMax;
    }

    if (!StrokeWidth) {
      // 默认连线宽度1 -> Number
      strokeWidth = 1;
    } else {
      strokeWidth = StrokeWidth;
    }

    if (!DragStartAlphaTarget || !DragEndAlphaTarget) {
      // 默认拖拽系数 -> Number
      // dragStartAlphaTarget 开始拖拽系数
      // dragEndAlphaTarget 结束拖拽系数
      dragStartAlphaTarget = 0.5;
      dragEndAlphaTarget = 0;
    } else {
      dragStartAlphaTarget = DragStartAlphaTarget;
      dragEndAlphaTarget = DragEndAlphaTarget;
    }

    if (
      ImageSizeLocation === undefined ||
      JSON.stringify(ImageSizeLocation) === "{}"
    ) {
      // 默认节点图片的大小和位置 -> String
      /**
       * { x:*, y:*, w:*, h:* }
       */
      imageSizeLocation.x = "-15px";
      imageSizeLocation.y = "-15px";
      imageSizeLocation.w = "30px";
      imageSizeLocation.h = "30px";
    } else {
      imageSizeLocation.x = ImageSizeLocation.x;
      imageSizeLocation.y = ImageSizeLocation.y;
      imageSizeLocation.w = ImageSizeLocation.w;
      imageSizeLocation.h = ImageSizeLocation.h;
    }

    if (ForceData === undefined || JSON.stringify(ForceData) === "{}") {
      // 默认模拟数据 -> Object{}
      nodes = mock_data.nodes;
      edges = mock_data.edges;
    } else {
      // 真实数据
      nodes = ForceData.nodes;
      edges = ForceData.edges;
    }

    if(OnNodesClick){
      // 传递OnNodesClick为true后 取消节点的点击事件
      onUpDateData = function () { };
    }else  if (!OnUpdateData) {
      // 默认点击节点事件
      onUpDateData = this.mockUpdateDate;
    }else {
      onUpDateData = OnUpdateData;
    }

    if (!OnBackToPreStep) {
      // 默认回退事件
      onBackToPreStep = () => { };
    } else {
      onBackToPreStep = OnBackToPreStep;
    }


    this.forceChart(
      WIDTH,
      HEIGHT,
      nodes,
      edges,
      scaleExtent,
      centerLocation,
      strength,
      distanceMax,
      strokeWidth,
      textLocation,
      dragStartAlphaTarget,
      dragEndAlphaTarget,
      imageSizeLocation,
      onUpDateData,
      onBackToPreStep
    );
  }

  forceChart(
    WIDTH,
    HEIGHT,
    nodes,
    edges,
    scaleExtent,
    centerLocation,
    strength,
    distanceMax,
    strokeWidth,
    textLocation,
    dragStartAlphaTarget,
    dragEndAlphaTarget,
    imageSizeLocation,
    onUpDateData,
    onBackToPreStep
  ) {

    let { force, g, zoom, drag } = this;

    /*缩放*/
    zoom = d3
      .zoom()
      .scaleExtent(scaleExtent)
      .on("start", function () { })
      .on("zoom", function () {
        g.attr("transform", d3.event.transform);
      })
      .on("end", function () { });

    /*力*/
    force = d3
      .forceSimulation(nodes)
      .alphaDecay(0.1)
      .force("link", d3.forceLink(edges))
      .force("center", d3.forceCenter(centerLocation.x, centerLocation.y))
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(strength)
          .distanceMax(distanceMax)
      );

    /*创建svg和g*/
    let svg = d3
      .select("#theChart")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .call(zoom);

    g = svg.append("g");

    /*线*/
    let svg_edges = svg
      .select("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .style("stroke", "gray")
      .style("stroke-width", strokeWidth);

    /*字*/
    let svg_texts = svg
      .select("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .style("fill", "black")
      .attr("dx", textLocation.dx)
      .attr("dy", textLocation.dy)
      .text(function (d) {
        return d.name;
      });

    /*拖拽*/
    drag = d3
      .drag()
      .on("start", function (d) {
        if (!d3.event.active) {
          force
            /*设置衰减系数 它是节点位置移动过程中的模拟，数值越高移动就越快，范围[0,1]*/
            .alphaTarget(dragStartAlphaTarget)
            .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on("end", function (d) {
        if (!d3.event.active) {
          force.alphaTarget(dragEndAlphaTarget);
        }
        d.fx = null;
        d.fy = null;
      });

    /*节点*/
    let svg_nodes = svg
      .select("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      /*图片表示节点*/
      .append("svg:image")
      .attr(
        "xlink:href",
        // 'http://img2.imgtn.bdimg.com/it/u=343877052,3151572224&fm=26&gp=0.jpg'
        function (d) {
          return d.url;
        }
      )
      .attr("x", imageSizeLocation.x)
      .attr("y", imageSizeLocation.y)
      .attr("width", imageSizeLocation.w)
      .attr("height", imageSizeLocation.h)
      .call(drag);

    /*点击节点mock数据*/
    svg_nodes.on("click", (d, i) => {
      onUpDateData(d, i, nodes, edges, restart);
    });

    function restart(newNodes, newEdges) {
      let diff = cheackNodesDiff(nodes, newNodes);
      nodes = newNodes;
      edges = newEdges;
      if (diff === "enter") {
        /*线*/
        svg_edges = svg
          .select("g")
          .selectAll("line")
          .data(edges)
          .enter()
          .append("line")
          .style("stroke", "gray")
          .style("stroke-width", 1)
          .merge(svg_edges);

        /*节点*/
        svg_nodes.remove();
        svg_nodes = svg
          .select("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          /*图片表示节点*/
          .append("svg:image")
          .attr(
            "xlink:href",
            function(d){return d.url}
            // "http://img2.imgtn.bdimg.com/it/u=343877052,3151572224&fm=26&gp=0.jpg"
          )
          .attr("x", imageSizeLocation.x)
          .attr("y", imageSizeLocation.y)
          .attr("width", imageSizeLocation.w)
          .attr("height", imageSizeLocation.h)
          .call(drag);

        svg_texts = svg
          .select("g")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .style("fill", "black")
          .attr("dx", textLocation.dx)
          .attr("dy", textLocation.dy)
          .text(function (d) {
            return d.name;
          })
          .merge(svg_texts);
      } else if (diff === "exit") {
        onBackToPreStep(diff);
        /*线*/
        svg_edges = svg
          .select("g")
          .selectAll("line")
          .data(edges)
          .exit()
          .remove()
          .merge(svg_edges);

        /*节点*/
        svg_nodes.remove();
        svg_nodes = svg
          .select("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          /*图片表示节点*/
          .append("svg:image")
          .attr(
            "xlink:href",
            function(d){return d.url}
            // "http://img2.imgtn.bdimg.com/it/u=343877052,3151572224&fm=26&gp=0.jpg"
          )
          .attr("x", imageSizeLocation.x)
          .attr("y", imageSizeLocation.y)
          .attr("width", imageSizeLocation.w)
          .attr("height", imageSizeLocation.h)
          .call(drag);

        svg_texts = svg
          .select("g")
          .selectAll("text")
          .data(nodes)
          .exit()
          .remove()
          .merge(svg_texts);
      }

      force.nodes(nodes);
      force.force("link").links(edges);
      force.alpha(1).restart();
      /*点击节点mock数据*/
      svg_nodes.on("click", (d, i) => {
        onUpDateData(d, i, nodes, edges, restart);
      });
    }

    force.on("tick", function () {
      /*更新连线*/
      svg_edges
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        })
        .attr("d", function (d) {
          const path = `M${d.source.x}${d.source.y}L${d.target.x}${d.target.y}`;
          return path;
        });

      /*更新节点*/
      svg_nodes
        .attr("cx", function (d) {
          // console.log(d);
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("transform", function (d) {
          return d && `translate(${d.x},${d.y})`;
        });

      /*更新线*/
      svg_texts
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        });
    });
  }

  mockUpdateDate = (d, i, nodes, edges, restart) => {
    let { update_nodes } = this;
    let { update_edges } = this;

    // 组建拆分后 每个子节点点击事件的代码编写处.
    for (let i = 0; i < 10; i++) {
      let obj = {};
      obj.source = d.index;
      obj.target = nodes.length + i;
      update_edges.push(obj);

      let obj2 = {};
      obj2.name = `测试${i + 1}`;
      obj2.url = `https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555051176446&di=d980895b38cc694e143d01878ef5477e&imgtype=0&src=http%3A%2F%2Fp1.qhimgs4.com%2Ft010204ba62043ec126.jpg`;
      update_nodes.push(obj2);
    }
    let new_nodes = nodes.concat(update_nodes);
    let new_egdes = edges.concat(update_edges);
    nodes = new_nodes;
    edges = new_egdes;
    update_edges.length = 0;
    update_nodes.length = 0;

    restart(nodes, edges);
  };

  OnBackToPreStep = () => {
  };
  render() {
    return (
      <React.Fragment>
        {/* <button className='d3__force__chart__back__btn' onClick={this.OnBackToPreStep}>回退事件</button> */}
        <div className="theChart" id="theChart" ref="theChart" />
      </React.Fragment>
    );
  }
}
export default D3ForceChart;
