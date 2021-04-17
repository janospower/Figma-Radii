figma.showUI(__html__, { width: 300, height: 500 });
figma.on("selectionchange", () => {
    figma.ui.postMessage({
        type: 'selectionChange',
        val: figma.currentPage.selection.length
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
                node.cornerSmoothing = msg.val / 100;
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
                let newRadius = parseInt(msg.vals[0]);
                let currentRadius = node.topLeftRadius;
                let difference;
                let smallestDifference = Math.abs(newRadius - currentRadius);
                node.topLeftRadius = newRadius;
                msg.vals.forEach((val) => {
                    let currentval = parseInt(val);
                    difference = Math.abs(currentval - currentRadius);
                    if (difference < smallestDifference) {
                        newRadius = currentval;
                        smallestDifference = Math.abs(newRadius - currentRadius);
                    }
                });
                node.topLeftRadius = newRadius;
            }
            if ("topRightRadius" in node) {
                let newRadius = parseInt(msg.vals[0]);
                let currentRadius = node.topRightRadius;
                let difference;
                let smallestDifference = Math.abs(newRadius - currentRadius);
                node.topRightRadius = newRadius;
                msg.vals.forEach((val) => {
                    let currentval = parseInt(val);
                    difference = Math.abs(currentval - currentRadius);
                    if (difference < smallestDifference) {
                        newRadius = currentval;
                        smallestDifference = Math.abs(newRadius - currentRadius);
                    }
                });
                node.topRightRadius = newRadius;
            }
            if ("bottomLeftRadius" in node) {
                let newRadius = parseInt(msg.vals[0]);
                let currentRadius = node.bottomLeftRadius;
                let difference;
                let smallestDifference = Math.abs(newRadius - currentRadius);
                node.bottomLeftRadius = newRadius;
                msg.vals.forEach((val) => {
                    let currentval = parseInt(val);
                    difference = Math.abs(currentval - currentRadius);
                    if (difference < smallestDifference) {
                        newRadius = currentval;
                        smallestDifference = Math.abs(newRadius - currentRadius);
                    }
                });
                node.bottomLeftRadius = newRadius;
            }
            if ("bottomRightRadius" in node) {
                let newRadius = parseInt(msg.vals[0]);
                let currentRadius = node.bottomRightRadius;
                let difference;
                let smallestDifference = Math.abs(newRadius - currentRadius);
                node.bottomRightRadius = newRadius;
                msg.vals.forEach((val) => {
                    let currentval = parseInt(val);
                    difference = Math.abs(currentval - currentRadius);
                    if (difference < smallestDifference) {
                        newRadius = currentval;
                        smallestDifference = Math.abs(newRadius - currentRadius);
                    }
                });
                node.bottomRightRadius = newRadius;
            }
        });
    }
};
figma.ui.postMessage({
    type: 'modeChange',
    val: figma.command
});
figma.ui.postMessage({
    type: 'selectionChange',
    val: figma.currentPage.selection.length
});
