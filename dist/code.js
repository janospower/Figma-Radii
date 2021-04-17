figma.showUI(__html__, { width: 300, height: 500 });
figma.on("selectionchange", () => {
    figma.ui.postMessage({
        type: 'selectionChange',
        value: figma.currentPage.selection.length
    });
});
figma.ui.onmessage = msg => {
    if (msg.type === 'smooth') {
        let nodes = figma.currentPage.selection;
        if (!msg.selection) {
            nodes = figma.currentPage.findAll(n => n.type === "RECTANGLE" || n.type === "FRAME" || n.type === "COMPONENT");
        }
        nodes.forEach(node => {
            if ("cornerSmoothing" in node) {
                node.cornerSmoothing = msg.value / 100;
            }
        });
    }
};
figma.ui.onmessage = msg => {
    if (msg.type === 'snap') {
        let nodes = figma.currentPage.selection;
        if (!msg.selection) {
            nodes = figma.currentPage.findAll(n => n.type === "RECTANGLE" || n.type === "FRAME" || n.type === "COMPONENT");
        }
        nodes.forEach(node => {
            if ("topLeftRadius" in node) {
                let newRadius = parseInt(msg.values[0]);
                let currentRadius = node.topLeftRadius;
                let difference;
                let smallestDifference = Math.abs(newRadius - currentRadius);
                node.topLeftRadius = newRadius;
                msg.values.forEach(value => {
                    let currentValue = parseInt(value);
                    difference = Math.abs(currentValue - currentRadius);
                    if (difference < smallestDifference) {
                        newRadius = currentValue;
                        smallestDifference = Math.abs(newRadius - currentRadius);
                    }
                });
                node.topLeftRadius = newRadius;
            }
        });
    }
};
figma.ui.postMessage({
    type: 'modeChange',
    value: figma.command
});
figma.ui.postMessage({
    type: 'selectionChange',
    value: figma.currentPage.selection.length
});
