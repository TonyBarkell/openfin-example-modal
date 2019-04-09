
var modalWin;
var registeredOnclick;

function openModal(){
    modalWin.show()
};


var serverPort;
fin.Window.getCurrentSync().getOptions()
.then(opts => {
    serverPort = opts.customData;
    console.log("Server Port: " + serverPort);
    var url = 'http://localhost:' + serverPort  + '/modal.html';
    win = new fin.desktop.Window(
        {
            name: "Modal",
            url: url,
            defaultWidth: 100,
            defaultHeight: 200,
            frame : false,
            saveWindowState : false,
            autoShow : false
        },
        function() {
            modalWin = win;
            modalWin.bringToFront();
            modalWin.addEventListener("shown", function (event){
                console.log("modal shown");
                registeredOnclick = fin.desktop.Window.getCurrent().addEventListener("focused", lockWindow,
                function(){
                    console.log("Click event registered");
                }, function(err){
                    console.log("error registering listener: " + err)
                });
            }, function(){
                console.log("The shown registration was sucessful")
            }, function(err){
                console.log("failure:" + err);
            } );

            modalWin.addEventListener("hidden", function (event){
                console.log("modal hidden");
                fin.desktop.Window.getCurrent().removeEventListener("focused", lockWindow);
            }, function(){
                console.log("The hidden registration was sucessful")
            }, function(err){
                console.log("failure:" + err);
            }  );
        },
        function(error) {
            console.log("Error creating window:", error);
        }
    );
}).catch(err => console.log(err));

function lockWindow() {

        console.log("Clicked");
        modalWin.focus();
        modalWin.bringToFront();

};

function unlockWindow(event) {
    console.log("unlock called");
    fin.desktop.Window.getCurrent().removeEventListener("ofocused", registeredOnclick);
};


