// ###################################################
    // MathJaxTools Browser Extention
    // Designed for Students! Usable by everyone
    // By Nomadical (Aiden C)
    // Contact nomadicalyt@gmail.com for more info
// ###################################################

// Extention storage for Desmos connection
// Using my own JS extention, storage.js!
let eqstorage = new extentionStorage("equation", "local", false)

try {
    let seleq
    let idcount = 0
    let mousepos = [0,0]
    let mousedown

    // Listening to mouse info for gui
    document.addEventListener("mousemove", (event) => {
        mousepos = [event.clientX, event.clientY]
    })

    document.addEventListener("mouseup", () => {mousedown = 0})
    document.addEventListener("mousedown", () => {mousedown = 1})

    // Listening to object creations to modify MathJax equations
    document.addEventListener(
        "DOMNodeInserted",
        (event) => {
            if(event.originalTarget) {
            if(event.originalTarget.classList) {

                // This part of the code handles the click-to-copy function of MathJax
                if(event.originalTarget.classList.contains("MathJax_SVG")) {
                    
                    let obj = event.originalTarget
                    let name = obj.id.replace("-Frame", "")
                    let timerid, mousey, mousex

                    obj.addEventListener("mousedown", (event) => {
                        if(event.button == 0) {
                            event.preventDefault()
                            let thisid = idcount
                            mousey = event.clientY - 40
                            mousex = event.clientX
                            let textcont = document.getElementById(name).textContent
                            let eqindex = document.getElementById(name).textContent.indexOf("=")

                            // 2 scenarios for copy GUI, graphable equation or non-graphable
                            // This regex looks for an equals sign, which is an indicator of the equation being graphable
                            if(document.getElementById(name).textContent.match(/[^\s]\s*=\s*[^\s]/g)) {
                                document.body.insertAdjacentHTML("afterbegin", `
                                <p id='lefttoolid${thisid}' class='copyedge' style='position:fixed; top:${mousey}px; left:${mousex-52}px; opacity: 0'>Left</p>
                                <p id='copytoolid${thisid}' class='copyconf' style='position:fixed; top:${mousey}px; left:${mousex-20}px;'>Copy</p>
                                <p id='righttoolid${thisid}' class='copyedge' style='position:fixed; top:${mousey}px; left:${mousex+20}px; opacity: 0'>Right</p>
                                `);
                                let objects = [document.getElementById(`lefttoolid${thisid}`),document.getElementById(`copytoolid${thisid}`),document.getElementById(`righttoolid${thisid}`)]
                                setTimeout(() => {
                                    if(idcount == thisid) {
                                        objects[0].style.opacity = "0.4"
                                        objects[2].style.opacity = "0.4"
                                    }
                                }, 300)
                                timerid = setInterval(() => {

                                    // All this is mostly just animation stuff
                                    try {
                                        if(objects[0].style.opacity > 0) {
                                            objects[0].style.opacity = (mousepos[0] < mousex-20) ? "1":"0.4"
                                            objects[2].style.opacity = (mousepos[0] > mousex+20) ? "1":"0.4"
                                            objects[0].style.left = (mousepos[0] < mousex-20) ? `${(mousex-((mousex-mousepos[0])**0.5))-52}px`:`${mousex-52}px`
                                            objects[2].style.left = (mousepos[0] > mousex+20) ? `${(mousex+((mousepos[0]-mousex)**0.5))+20}px`:`${mousex+20}px`
                                        } 
                                        else if(((mousepos[0] < mousex-20) || (mousepos[0] > mousex+20)) && idcount == thisid) {
                                            objects[0].style.opacity = "0.4"
                                            objects[2].style.opacity = "0.4"
                                        }
                                        let copysel = (mousepos[0] < mousex-20) ? [1,1,0]:(mousepos[0] > mousex+20) ? [0,1,1]:[0,1,0]
                                        if(mousedown == 0) {
                                            idcount++
                                            let leftterm = (!copysel[0] && copysel[2]) ? eqindex+1:0
                                            let rightterm = (copysel[0] && !copysel[2]) ? eqindex:textcont.length

                                            // Handling the left-right copy abilities of the MathJax copier
                                            navigator.clipboard.writeText(textcont.slice(leftterm, rightterm)).catch(error => console.error("MathJaxTools: Error - no copy permission:\n", error)) //.replace(/\\(?=[a-zA-Z])/g, "\\\\"));
                                            objects[1].textContent = "Copied"
                                            objects[1].style.left = `${mousex-25}px`
                                            setTimeout(() => {
                                                for(let i in copysel) {
                                                    if(copysel[i] == 1) {
                                                        objects[i].style.top = `${mousey - 10}px`
                                                    } else {
                                                        objects[i].style.opacity = `0`
                                                    }
                                                }
                                            }, 1)
                                            setTimeout(() => {
                                                for(let i in copysel) {
                                                    objects[i].style.opacity = `0`
                                                }
                                            }, 500)
                                            setTimeout(() => {for(let i in copysel){objects[i].remove()}}, 1000)
                                            clearInterval(timerid)
                                        }
                                    } catch (error) {
                                        console.error("MathJaxTools: Error with copying:\n", error)
                                        clearInterval(timerid)
                                    }
                                }, 20)
                            } 
                            
                            // The else case, where the function is non-graphable
                            else {
                                try {
                                    timerid = setInterval(() => {
                                        if (mousedown == 0) {
                                            navigator.clipboard.writeText(document.getElementById(name).textContent).catch(error => console.error("MathJaxTools: Error - no copy permission:\n", error))
                                            document.body.insertAdjacentHTML("afterbegin", `
                                                <p id='copytoolid${thisid}' class='copyconf' style='position:fixed; top:${mousey}px; left:${event.clientX-25}px;'>Copied</p>
                                            `);
                                            let object = document.getElementById(`copytoolid${thisid}`)
                                            idcount++
                                            setTimeout(() => {
                                                object.style.top = `${mousey - 10}px`
                                            }, 1)
                                            setTimeout(() => {
                                                object.style.opacity = `0`
                                            }, 500)
                                            setTimeout(() => {object.remove()}, 1000)
                                            clearInterval(timerid)
                                        }
                                    }, 20)
                                } catch (error) {
                                    console.error("MathJaxTools: Error with copying:\n", error)
                                    clearInterval(timerid)
                                }
                            }
                        }
                    })
                    
                    // This passes the value of a selected function to the Desmos pop-out function
                    obj.addEventListener("contextmenu", () => {
                        seleq = document.getElementById(name).textContent.replace(/\\(?=[a-zA-Z])/g, "\\\\")
                    })
        
                }

                // Inserting buttons into the MathJax right-click menu
                if(event.originalTarget.id == "MathJax_MenuFrame") {
                    setTimeout(() => {
                        if(seleq.includes("=")) {
                            let object = event.originalTarget.children[1]
                            object.insertAdjacentHTML("afterbegin", `
                                <div id="desmosbutton" class="MathJax_MenuItem hoverblue" role="menuitem" tabindex="-1">Open in Desmos<span class="MathJax_MenuArrow">►</span></div>
                                <div id="desmosbutton2" target="popup" class="MathJax_MenuItem hoverblue" role="menuitem" tabindex="-1">Desmos Popup<span class="MathJax_MenuArrow">►</span></div>
                            `)
                            document.getElementById("desmosbutton").addEventListener("click", () => {
                                eqstorage.set(seleq)
                                setTimeout(() => {window.open("https://www.desmos.com/calculator", "_blank")}, 10)
                            })
                            document.getElementById("desmosbutton2").addEventListener("click", () => {
                                eqstorage.set(seleq)
                                setTimeout(() => {window.open("https://www.desmos.com/calculator", "popup", 'width=800,height=500'); return false}, 10)
                            })
                        }
                    }, 1)
                }

                // Inserting info text into the render display choose menu
                if(event.originalTarget.classList.contains("MathJax_Menu")) {
                    for(let i = 0; i < event.originalTarget.children.length; i++) {
                        if(event.originalTarget.children[i].innerHTML.includes("SVG")) {
                            event.originalTarget.children[i].innerHTML += " - MathJaxTools"
                        }
                    }
                }
                
            }
        }},
        false,
    );
} catch (error) {
    console.error("MathJaxTools catch-all error:\n", error)
}

// MathJaxTools only works with SVG-style rendering. 
// This script uses the MathJax API to swtich the render engine to SVG
addEventListener("load", () => {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ setMathJax +')();'));
    (document.body || document.head || document.documentElement).appendChild(script); 
})

function setMathJax () {
    if(MathJax.Hub) {
        MathJax.Hub.Queue(() => {
            if(MathJax.Hub.config.menuSettings.renderer != "SVG") {
                console.info("MathJaxTools: Set MathJax renderer to SVG for compatability.")
                MathJax.Hub.setRenderer("SVG");
                MathJax.Hub.Rerender()
            }
        })
    }
}

// Why doesn't JavaScript just have a print function...
function print(input) {
    console.debug("MathJaxTools:", input)
}