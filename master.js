function orderHeader(order, account = false) {
    // Creates a dynamic header and makes its paths work

    const body = document.getElementsByTagName("body")[0];
    const header = document.createElement("header");
    header.className = "pageHeader";
    let location = ""; // Calculates the path reference key based on the order parameter
    for (let i = 0; i < order; i++) {
        location += "../"
    }
    if (order == 0) {
        header.innerHTML = `<div id="headerDiv">
                                <a href="${location}">
                                    <img src="${location}images/primepudu.png" width="100">
                                </a>
                                <div class="signInDiv">
                                    <button id="signInButton" onclick="localStorage.setItem('previousUrl', '${window.location.pathname}'); window.location.href = '${location}signin';">Sign In</button>
                                </div>
                                <div id="signedDiv" class="signInDiv">
                                    <p class="clickableText" onclick="displayUserOptions()" translate="no">Username</p>
                                </div>
                                <div id="userOptionsDiv">
                                    <ul id="userOptions">
                                        <li onclick="logOut()">Log Out</li>
                                    </ul>
                                </div>
                            </div>`
    } else {
        let bidiv = "<div></div>";
        if (account) {
            let divname, imgsrc;
            divname = getRealStreakString(account.streak, account.creationDate)[getRealStreakString(account.streak, account.creationDate).length - 1] == "1" ? "" : "in";
            imgsrc = getRealStreakString(account.streak, account.creationDate)[getRealStreakString(account.streak, account.creationDate).length - 1] == "1" ? "A" : "Ina";
            bidiv = `<div style="place-self:center;">
                        <div id="streakDiv" class="${divname}activeStreakDiv">
                            <img src="../images/lesson${imgsrc}ctive.png" width=24>
                            <p>${getStreakDays(getRealStreakString(account.streak, account.creationDate))}</p>
                        </div>
                    </div>`
        }
        header.innerHTML = `<div id="signinHeaderDiv">
                                <a href="${location}">
                                    <img src="${location}images/primepudu.png" width="100">
                                </a>
                                ${bidiv}
                                <div id="signedDiv" class="signInDiv">
                                    <p class="clickableText" onclick="displayUserOptions()" translate="no">Username</p>
                                </div>
                                <div id="userOptionsDiv">
                                    <ul id="userOptions">
                                        <li onclick="logOut()">Log Out</li>
                                    </ul>
                                </div>
                            </div>`
    }

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

function getLengthDays(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);

    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

    // Calculate difference in days
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.abs(Math.ceil((utc2 - utc1) / msPerDay));
}

function getRealStreakString(streak, creation) {
    while (streak.length < getLengthDays(creation, new Date())) {
        streak += "0";
    }
    return streak;
}

function getStreakDays(streakString) {
    let streak = 0;
    let undone = false;
    for (let i = 0; i < streakString.length; i++) {
        if (streakString[i] == "1") {
            streak += 1;
            undone = false;
        } else {
            if (!undone) {
                undone = true;
            } else {
                streak = 0;
            }
        }
    }
    return streak;
}