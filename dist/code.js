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
figma.ui.postMessage({
    type: 'modeChange',
    value: figma.command
});
