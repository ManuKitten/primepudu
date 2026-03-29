function orderHeader(order) {
    // Creates a dynamic header and makes its paths work

    const body = document.getElementsByTagName("body")[0];
    const header = document.createElement("header");
    header.className = "pageHeader";
    let location = ""; // Calculates the path reference key based on the order parameter
    for (let i = 0; i < order; i++) {
        location += "../"
    }
    header.innerHTML = `<div id="headerDiv">
                            <a href="${location}">
                                <img src="${location}stock-images/primepudu.png" width="100">
                            </a>
                            <div class="signInDiv">
                                <button id="signInButton" onclick="localStorage.setItem('previousUrl', '${window.location.pathname}'); window.location.href = '${location}signin';">Sign In</button>
                            </div>
                            <div id="signedDiv" class="signInDiv">
                                <p class="clickableText" onclick="displayUserOptions()">Username</p>
                            </div>
                            <div id="userOptionsDiv">
                                <ul id="userOptions">
                                    <li onclick="logOut()">Log Out</li>
                                </ul>
                            </div>
                        </div>`
    body.insertBefore(header, body.children[0]);

    if (localStorage.getItem("username")) {
        document.getElementsByClassName("signInDiv")[0].style.display = "none";

        const signedDiv = document.getElementById("signedDiv");
        const signedDivText = signedDiv.getElementsByTagName("p")[0];
        signedDivText.textContent = localStorage.getItem("username");
        signedDivText.style.marginTop = "10px"
        signedDiv.style.display = "block";
    }
}

function displayUserOptions() {
    const div = document.getElementById("userOptionsDiv");
    if (div.style.display == "block") {
        div.style.display = "none"
    } else {
        div.style.display = "block"
    }
}

function logOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("hashName");
    location.reload()
}