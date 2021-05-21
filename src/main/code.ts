figma.showUI(__html__, {width: 300, height: 500 });

let state: number[] = []

// let lastState = figma.clientStorage.getAsync('state')
// console.log(lastState);


// figma.ui.postMessage({
// 	type: 'state',
// 	value: lastState
//   })


figma.on("selectionchange", () => { 
		figma.ui.postMessage({
			type: 'selectionChange',
			value: figma.currentPage.selection.length
		  })
})

figma.ui.onmessage = msg => {
	
	if (msg.type === 'smooth') {
		
		let nodes = figma.currentPage.selection;
		if (!msg.selection) {
			nodes = figma.currentPage.findAll(n => n.type === "RECTANGLE" || n.type === "FRAME" || n.type === "COMPONENT")
		}
		nodes.forEach(node => {
			if ("cornerSmoothing" in node) {
				node.cornerSmoothing = msg.value / 100;
			}
		});
	}

	if (msg.type === 'snap-change') {
		state = msg.values;
	}

	if (msg.type === 'snap') {
		let nodes = figma.currentPage.selection;
		if (!msg.selection) {
			nodes = figma.currentPage.findAll(n => n.type === "RECTANGLE" || n.type === "FRAME" || n.type === "COMPONENT")
		}
		nodes.forEach(node => {
			if ("topLeftRadius" in node) {
				let newRadius = parseInt( msg.values[0] );
				let currentRadius = node.topLeftRadius;
				let difference;
				let smallestDifference = Math.abs( newRadius - currentRadius );

				node.topLeftRadius = newRadius;
				

				msg.values.forEach((value: any) => {
					let currentValue = parseInt( value );
					difference = Math.abs( currentValue - currentRadius );
					
					
					if ( difference < smallestDifference ) {
						newRadius = currentValue;
						smallestDifference = Math.abs( newRadius - currentRadius );
					}
					
				});
				node.topLeftRadius = newRadius;
			}

			if ("topRightRadius" in node) {
				let newRadius = parseInt( msg.values[0] );
				let currentRadius = node.topRightRadius;
				let difference;
				let smallestDifference = Math.abs( newRadius - currentRadius );

				node.topRightRadius = newRadius;
				

				msg.values.forEach((value: any) => {
					let currentValue = parseInt( value );
					difference = Math.abs( currentValue - currentRadius );
					
					
					if ( difference < smallestDifference ) {
						newRadius = currentValue;
						smallestDifference = Math.abs( newRadius - currentRadius );
					}
					
				});
				node.topRightRadius = newRadius;
			}

			if ("bottomLeftRadius" in node) {
				let newRadius = parseInt( msg.values[0] );
				let currentRadius = node.bottomLeftRadius;
				let difference;
				let smallestDifference = Math.abs( newRadius - currentRadius );

				node.bottomLeftRadius = newRadius;
				

				msg.values.forEach((value: any) => {
					let currentValue = parseInt( value );
					difference = Math.abs( currentValue - currentRadius );
					
					
					if ( difference < smallestDifference ) {
						newRadius = currentValue;
						smallestDifference = Math.abs( newRadius - currentRadius );
					}
					
				});
				node.bottomLeftRadius = newRadius;
			}

			if ("bottomRightRadius" in node) {
				let newRadius = parseInt( msg.values[0] );
				let currentRadius = node.bottomRightRadius;
				let difference;
				let smallestDifference = Math.abs( newRadius - currentRadius );

				node.bottomRightRadius = newRadius;
				

				msg.values.forEach((value: any) => {
					let currentValue = parseInt( value );
					difference = Math.abs( currentValue - currentRadius );
					
					
					if ( difference < smallestDifference ) {
						newRadius = currentValue;
						smallestDifference = Math.abs( newRadius - currentRadius );
					}
					
				});
				node.bottomRightRadius = newRadius;
			}
		});
	}
};


figma.ui.postMessage({
	type: 'modeChange',
	value: figma.command
})

figma.ui.postMessage({
	type: 'selectionChange',
	value: figma.currentPage.selection.length
})


figma.on("close", () => { 
	figma.clientStorage.setAsync('state', state)
	console.log('state', state);
	
})