
    console.log("linkExample onMain");
    var a = document.createElement("a");
    a.href = "http://localhost:" + getServerPort() + "/index.html";
    a.innerHTML = "test test";
    document.appendChild(a);
