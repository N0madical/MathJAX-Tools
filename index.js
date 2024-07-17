let equations = document.getElementsByClassName("MathJax_SVG")
let rawmath = []
let idcount = 0
for(let i = 0; i < equations.length; i++) {
    let name = equations[i].id.replace("-Frame", "")
    rawmath.push(document.getElementById(name).textContent)

    equations[i].addEventListener("click", (event) => {
        let thisid = idcount
        navigator.clipboard.writeText(document.getElementById(name).textContent);
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

    equations[i].addEventListener("contextmenu", (event) => {
        localStorage.setItem("equation", `${document.getElementById(name).textContent}`);
        console.debug(localStorage.getItem("equation"))
    })
}

document.addEventListener(
    "DOMNodeInserted",
    (event) => {
        if(event.originalTarget.id == "MathJax_MenuFrame") {
            setTimeout(() => {
                let object = event.originalTarget.children[1]
                object.insertAdjacentHTML("afterbegin", `<a href="https://www.desmos.com/calculator/" target="_blank" class="hoverblue"><div class="MathJax_MenuItem hoverblue" role="menuitem" tabindex="-1">Open in Desmos<span class="MathJax_MenuArrow">►</span></div></a>`)
            }, 1)
        }
    },
    false,
);