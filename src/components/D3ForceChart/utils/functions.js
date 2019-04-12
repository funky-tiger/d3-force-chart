import * as d3 from 'd3';

export const cheackNodesDiff = (nodes, newNodes) => {
    return nodes.length < newNodes.length ? 'enter' : 'exit';
}

export const _enter = (nodes, edges, newNodes, newEdges, svg_edges, svg, svg_nodes, svg_texts, force, drag, imageSizeLocation, textLocation ) => {
    nodes = newNodes;
    edges = newEdges;
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
          // function(d){return d.url}
        "http://img2.imgtn.bdimg.com/it/u=343877052,3151572224&fm=26&gp=0.jpg"
      )
      .attr("x", imageSizeLocation.x)
      .attr("y", imageSizeLocation.y)
      .attr("width", imageSizeLocation.w)
      .attr("height", imageSizeLocation.h)
      // .merge(svg_nodes)
      // .exit().remove()
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
      .text(function(d) {
        return d.name;
      })
      .merge(svg_texts);

      force.nodes(nodes);
      force.force("link").links(edges);
      force.alpha(1).restart();
}
export const _exit = () => {

}

export const Drag = (drag, force, dragStartAlphaTarget, dragEndAlphaTarget ) => {
    /*拖拽*/
    return drag = d3
      .drag()
      .on("start", function(d) {
        if (!d3.event.active) {
          force
            /*设置衰减系数 它是节点位置移动过程中的模拟，数值越高移动就越快，范围[0,1]*/
            .alphaTarget(dragStartAlphaTarget)
            .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on("end", function(d) {
        if (!d3.event.active) {
          force.alphaTarget(dragEndAlphaTarget);
        }
        d.fx = null;
        d.fy = null;
      });
}