chrome.runtime.onMessage.addListener(
    function(request,sender, sendResponse){
        console.log("Share Screen Button: ",request);
        if(request.message === "clicked_browser_action"){
            console.log("Share Screen dasda");
            chrome.runtime.sendMessage({"message":"open_new_tab","url":"http://www.fpt.vn/"});
        }
    }
)
