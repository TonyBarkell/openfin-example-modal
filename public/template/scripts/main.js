var serverPort;

async function minimiseWindow(){
    const finWindow = await fin.desktop.Window.getCurrent();
    return await finWindow.minimize();
};

async function restoreWindow(){
    const finWindow = await fin.desktop.Window.getCurrent();
    return await finWindow.restore();
};

async function closeWindow(){
    const finWindow = await fin.desktop.Window.getCurrent();
    return await finWindow.close();
};

async function maximiseWindow(){
    const finWindow = await fin.desktop.Window.getCurrent();
    return await finWindow.maximize();
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof fin != 'undefined') {
        //fin.desktop.main(onMain);
        onMain();
    } else {
        ofVersion.innerText = 'OpenFin is not available';
    }
});

function openDevTools(){
    const app = fin.desktop.Application.getCurrent();
    fin.desktop.System.showDeveloperTools(app.uuid, app.uuid);
};

async function setTrayIcon() {
    const iconUrl = "favicon.ico";
    const app = await fin.Application.getCurrent();
    return await app.setTrayIcon(iconUrl);
};

async function openChildTemplate(windowName, sections) {
    var url = 'http://localhost:' + serverPort + '/index.html?sections=';
    for(section of sections){
        console.log(section);
        url = url.concat(section);
    }
    console.log(url);
    const winOption = {
        name: windowName,
        "frame": false,
        "autoShow": true,
        "defaultWidth": 500,
        "defaultHeight": 53,
        "saveWindowState": false,
        url: url,
    };
    return await fin.Window.create(winOption);
}

function getServerPort(){
    return serverPort;
}

//Once the DOM has loaded and the OpenFin API is ready
function onMain() {
    console.log("on main");
    fin.System.getVersion()
    .then(version => {
        const ofVersion = document.querySelector('#of-version');
        ofVersion.innerText = version;
        fin.Window.getCurrentSync().getOptions()
            .then(opts => {
                serverPort = opts.customData;
                console.log("Server Port: " + serverPort);
            }).catch(err => console.log(err));
    }).catch(err => {
        console.log("Error Retrieving Runtime version: " + err);
    });
    setTrayIcon()
    .then(
        clickInfo => console.log(clickInfo)).catch(err => console.log(err)
    );
    buildContent();
};



