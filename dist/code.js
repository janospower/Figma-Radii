figma.showUI(__html__, { width: 375, height: 512 });
figma.on("selectionchange", () => {
    figma.ui.postMessage({
        type: 'selectionChange',
        value: figma.currentPage.selection.length
    });
});
function traverse(node) {
    if ("children" in node) {
        if (node.type !== "INSTANCE") {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
}
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
        // figma.currentPage.selection = nodes;
        // figma.viewport.scrollAndZoomIntoView(nodes);
    }
};
