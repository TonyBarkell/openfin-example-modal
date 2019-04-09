var sectionCounter = 0;
var idCounter = 0;
async function buildSectionFromFile(sectionHtmlFilePath, sectionName, sectionId){
    return new Promise(async function(resolve, reject) {
        var container;
        await getSectionFromFile(sectionHtmlFilePath).then(function(section){
            container = section;
        });
        document.getElementById("sections-container").appendChild(container);
        await animateWindow(container.offsetHeight)
        .catch(err => console.error(err));
        sectionCounter++;
        idCounter++;
        resolve();
    });
};

function setActiveControl(elemId){
    var elem = document.getElementById(elemId);
    var classes = elem.classList;
    var hidden = false;
    var size = elem.offsetHeight;
    // console.log("Element size: " + elem.offsetHeight);
    classes.forEach(function(item){
        if(item === "hidden"){
            hidden = true;
        };
    });
    if(hidden === true){
        classes.remove("hidden");
        animateWindow(elem.offsetHeight - size)
        .catch(err => console.error(err));

    }else{
        classes.add("hidden");
        animateWindow(-size)
        .catch(err => console.error(err));
    };
};

async function animateWindow(size) {
    const transitions = {
        size: {
            height: size,
            relative: true
        }
    };
    const win = await fin.Window.getCurrent();
    return win.animate(transitions);
}

function buildSectionHeadder(text){
    container = document.createElement("div");
    container.classList.add("section-headder");
    label = document.createElement("p").appendChild(document.createTextNode("+ " + text));
    container.appendChild(label);
    return container;
};

function getSectionFromFile(filePath){
    return new Promise(function(resolve, reject) {
        var container = document.createElement("div");
        var section;
        xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return;
            var html = this.responseText;
            var title;
            var id;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(html,"text/xml");
            try{
                title = xmlDoc.getElementById('title').innerHTML;  
                //title = xmlDoc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
            }catch(err){
                title = "section " + sectionCounter;
            }
            try{
                id = xmlDoc.getElementById('id').innerHTML;     
            }catch(err){
                id = "id" + sectionCounter;
            }
            var sectionHeadder = buildSectionHeadder(title);
            container.appendChild(sectionHeadder);

            section = document.createElement("div");
            section.classList.add( "section" );
            section.innerHTML = html;
            container.appendChild(section);
            section.id = id;
            if(id != "overview"){
                section.classList.add("hidden");
            };
            sectionHeadder.addEventListener("click", function(){
                setActiveControl(id);
            });
            resolve(container);
        };
        xhr.send();   
    });
};

async function buildContent(){
    sections = new URLSearchParams(window.location.search).get('sections');
    if( sections ){
        var sectionArray = sections.split(';')
        for(section of sectionArray){
            console.log("Building " + section);
            await buildSectionFromFile("./app/sections/" + section + ".html");
            console.log(section + " built")
        }
    }
};