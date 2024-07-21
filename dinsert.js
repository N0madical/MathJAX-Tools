eqstorage.get(() => {
    console.debug(eqstorage.value)
    if(eqstorage.value == true) {
        let storageapi = (typeof browser !== "undefined") ? browser:chrome
        let myicon = storageapi.runtime.getURL("./icon96.png");
        document.getElementsByClassName("dcg-expression-top-bar")[0].insertAdjacentHTML("afterend", `<div id="MathJAXToolsbox" style="transition: height 0.5s ease-in-out; width: 260px; height: 40px; margin-left: auto; margin-right: auto;" class=""><image style="height: 30px; margin-top: 5px; margin-left: 5px; float: left;" src="${myicon}"></image><p class="dcg-tooltip" style="margin: 10px; margin-left: 10px; float: left;">Paste Pquation: Ctrl/Cmd+V</p></div>`)
        
        document.addEventListener("paste", removebox)
        document.addEventListener("copy", removebox)

        eqstorage.set(false)
    }
})

function removebox() {
    document.getElementById("MathJAXToolsbox").style.height = "0px"
    setTimeout(() => {document.getElementById("MathJAXToolsbox").remove()}, 1000)
}