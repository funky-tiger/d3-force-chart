export const cheackNodesDiff = (nodes, newNodes) => {
    return nodes.length > newNodes.length ? 'enter' : 'exit';
  }