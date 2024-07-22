//dinsert.js, MathJaxTools Desmos interaction script
//By Nomadical (Aiden C)

eqstorage.get(() => {
    if(eqstorage.value != "") {
        let temp = eqstorage.value
        var script = document.createElement('script');
        script.appendChild(document.createTextNode(`window.Calc.setExpression({id:'MathJAXinsert', latex:"${eqstorage.value}"});`));
        (document.body || document.head || document.documentElement).appendChild(script); 
        console.info("MathJaxTools: Inserted Equation:", eqstorage.value)
        eqstorage.set("")
    }
})