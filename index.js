let eqstorage = new extentionStorage("equation", "local", false)
let seleq
let idcount = 0

document.addEventListener(
    "DOMNodeInserted",
    (event) => {
        if(event.originalTarget.classList) {
            // console.debug(document.getElementsByClassName("MathJax"))
            // if(document.getElementsByClassName("MathJax").length > 0) {
            //     var script = document.createElement('script');
            //     script.appendChild(document.createTextNode('('+ setMathJax +')();'));
            //     (document.body || document.head || document.documentElement).appendChild(script);
            // }

            if(event.originalTarget.classList.contains("MathJax_SVG")) {
                
                let obj = event.originalTarget
                let name = obj.id.replace("-Frame", "")
    
                obj.addEventListener("click", (event) => {
                    let thisid = idcount
                    navigator.clipboard.writeText(document.getElementById(name).textContent.replace(/\\(?=[a-zA-Z])/g, "\\\\"));
                    let mousey = event.clientY - 40
                    document.body.insertAdjacentHTML("afterbegin", `
                    <p id='clickconfid${thisid}' class='copyconf' style='position:fixed; top:${mousey}px; left:${event.clientX-20}px;'>Copied</p>
                    `);
                    let selement = document.getElementById(`clickconfid${thisid}`)
                    setTimeout(() => {
                        selement.style.top = `${mousey - 10}px`
                    }, 1)
                    setTimeout(() => {
                        selement.style.opacity = `0`
                    }, 500)
                    setTimeout(() => {selement.remove()}, 1000)
                    idcount++
                })
    
                obj.addEventListener("contextmenu", () => {
                    seleq = document.getElementById(name).textContent
                })
    
            }

            else if(event.originalTarget.id == "MathJax_MenuFrame") {
                setTimeout(() => {
                    let object = event.originalTarget.children[1]
                    object.insertAdjacentHTML("afterbegin", `<div id="desmosbutton" class="MathJax_MenuItem hoverblue" role="menuitem" tabindex="-1">Open in Desmos<span class="MathJax_MenuArrow">►</span></div>`)
                    document.getElementById("desmosbutton").addEventListener("click", () => {
                        eqstorage.set(true)
                        navigator.clipboard.writeText(seleq)
                        setTimeout(() => {window.open("https://www.desmos.com/calculator", "_blank")}, 10)
                    })
                }, 1)
            }
        }
    },
    false,
);

function setMathJax () {
    console.debug('hi')
    if(MathJax.Hub.config.menuSettings.renderer != "SVG") {
        MathJax.Hub.setRenderer("SVG");
        MathJax.Hub.Rerender()
    }
}