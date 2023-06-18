//setting default order if none is found
if(localStorage.getItem("subjectOrder") == null){
    reset()
}
//setting vars
var subjectOrder = JSON.parse(localStorage.getItem("subjectOrder"))
var subjectElements = []

//setting html refs
const reorder = document.getElementById("reorder")
const contents = document.getElementById("contents")
const subject = document.getElementById("subject")
console.log(subjectOrder) //verbose

//current = home
toSubject(true)

function toSubject(home, element, div) {
    current = document.getElementsByClassName("current")
    for(let i = 0; i<current.length; i++) {
        current[i].classList.remove("current")
    }

    if (home) {
        subject.src = `home.html`
        document.getElementById("home").classList.add("current")
    } else {
        subject.src = `subjects/${element.toLowerCase()}.html`
        div.classList.add("current")
    }

}

function addSubjects() {
    console.log("a")
    subjectOrder.forEach((element) => {
        //create menu item
        var div = document.createElement("div")
        var a = document.createElement("a")  
        var img = document.createElement("img")     
        a.className = "text subject-text"
        img.className = "icon"
        img.src  = `./assets/icons/${element.toLowerCase()}.png`
        a.appendChild(img)
        a.innerHTML = a.innerHTML + element
        a.append(document.createElement("br"))
        div.style = ""
        div.className = "subject"
        div.appendChild(a)
        div.setAttribute("name", element)
        div.onclick = function() {toSubject(false, element, div)}
        subjectElements.push(div)
    });
    
    subjectElements.forEach(element => {
        contents.appendChild(element)
    });
}

function doReorder() {
    //current dragging element
    let draggingEle;
    let placeholder;
    let isDraggingStarted = false;

    //pos of mouse relative to dragging element
    let x = 0;
    let y = 0;

    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        // move nodeA to before the nodeB
        nodeB.parentNode.insertBefore(nodeA, nodeB);

        // move nodeB to before the sibling of nodeA
        parentA.insertBefore(nodeB, siblingA);
    }

    const mouseDownHandler = function (e) {
        draggingEle = e.target;

        //calc mouse pos
        const rect = draggingEle.getBoundingClientRect();
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;

        //attach listeners
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    const mouseMoveHandler = function (e) {
        const prevEle = draggingEle.previousElementSibling;
        
        const draggingRect = draggingEle.getBoundingClientRect();
        
        //set pos for dragging element
        draggingEle.style.position = 'absolute'
        draggingEle.style.top = `${e.pageY - y}px`
        draggingEle.style.left = `${e.pageX - x}px`
       
        if (!isDraggingStarted) {
            //update
            isDraggingStarted=true;

            //placeholder take height of dragging element
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');

            draggingEle.parentNode.insertBefore(
                placeholder,
                draggingEle.nextSibling
            )

            //set placeholder height
            placeholder.style.height = `${draggingRect.height}px`

        }

        const nextEle = placeholder.nextElementSibling;

        //literal edge cases

        //moves item to top
        if (prevEle && isAbove(draggingEle, prevEle)) {
            // prevEle              -> placeholder
            // draggingEle          -> draggingEle
            // placeholder          -> prevEle
            swap(placeholder, draggingEle)
            swap(placeholder, prevEle)
        }

        //moves item to bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            // draggingEle          -> nextEle
            // placeholder          -> placeholder
            // nextEle              -> draggingEle
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    }

    const mouseUpHandler = function () {
        //remove placeholder
        placeholder && placeholder.parentNode.removeChild(placeholder);

        //reset flag
        isDraggingStarted = false;

        //remove pos styles
        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');

        x = null
        y = null
        draggingEle = null

        //remove handlers of 'mousemove' and 'mouseup'
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }

    const isAbove = function(nodeA, nodeB) {
        //get bounding rect of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return (rectA.top + rectA.height)/2 < (rectB.top + rectB.height)/2
    }

    subjectElements.forEach(element => {
        element.classList.add("draggable")
        element.addEventListener('mousedown', mouseDownHandler)
        element.onclick = ""
        element.childNodes[0].style.pointerEvents = "none"
    });

    reorder.style.display = "none"
    document.getElementById("confirm").style.display = "block"
    document.getElementById("reset").style.display = "block"
}

function save() {
    let subjects = document.getElementsByClassName("subject")
    for(let i = 0; i < subjects.length; i++) {
        subjectOrder[i] = subjects[i].getAttribute("name")
        localStorage.setItem("subjectOrder", JSON.stringify(subjectOrder))
        window.location.href = "./index.html"
    }
}
function tryReset() {
    if(confirm("Are you sure you would like to reset order?")) {
        reset()
        window.location.href = "./index.html"
    }
}
function reset() {
    var subjectOrder = ["Wires", "The Button", "Keypads", "Simon Says", "Who's on First", "Memory", "Morse Code", "Complicated Wires", "Wire Sequences", "Mazes", "Passwords", "Knobs"]
    localStorage.setItem("subjectOrder", JSON.stringify(subjectOrder))
}