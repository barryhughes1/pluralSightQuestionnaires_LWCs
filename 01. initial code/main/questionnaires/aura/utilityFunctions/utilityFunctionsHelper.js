({
    handle_LDS_cmp: function(component, helper, eventParams, objName) {
		if(eventParams.changeType === "LOADED") {
            // record is loaded (render other component which needs record data value)
            console.log(objName + " Record is loaded successfully.");
		} else if(eventParams.changeType === "CHANGED") {
            // record is changed
            console.log(objName + " Record has changed");
            helper.showMessageAsToast("success", "The " + objName + " was successfully saved.", "dismissible");
		} else if(eventParams.changeType === "REMOVED") {
            // record is deleted
            helper.showMessageAsToast("warning", objName + " Record was successfully deleted.", "dismissible");
        } else if(eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
            console.log(objName + " Record is loaded unsuccessfully. Error: " + JSON.stringify(eventParams.error));
            // helper.showMessageAsToast("error", objName + " Record is loaded unsuccessfully. Error: " + JSON.stringify(eventParams.error), "dismissible");
		}
	},
    showMessageAsToast : function(typeOpt, messageStr, modeOpt) {
		/*
		typeOpt:
			String	The toast type, which can be error, warning, success, or info. 
			The default is other, which is styled like an info toast and doesn’t 
			display an icon.

		modeOpt:
			String	The toast mode, which controls how users can dismiss the toast. 
			The default is dismissible, which displays the close button.
			Valid values:
				dismissible: Remains visible until you press the close button or duration has elapsed, whichever comes first.
				pester: Remains visible until duration has elapsed. No close button is displayed.
				sticky: Remains visible until you press the close buttons.
		*/
		var toastEvent = $A.get("e.force:showToast");
		toastEvent.setParams({
			mode: modeOpt,
			type: typeOpt,
			message: messageStr,
		});
		toastEvent.fire();
	} 	
})