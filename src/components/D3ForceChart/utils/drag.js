import * as d3 from 'd3';



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