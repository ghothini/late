const peopleDiv = document.getElementById('peopleDiv');
const submitReason = document.getElementById('submitReason');
const noLatePeople = document.getElementById('noLatePeople');

// Move through this one time using map methods to link html code
var moveOne = [1];
var count;
var charactersMax = 25;
var lateComers = [];

// // Adding class members manually to array.
// var lateComers = [{
//     name: 'thapelo',
//     reason: 'smoke break',
//     late: false,
//     reasonTime: '',
//     elapsedTime: '',
//     arriveTime: '',
//     cancel: false
// }, {
//     name: 'samuel',
//     reason: 'stuck in traffic',
//     late: false,
//     reasonTime: '',
//     elapsedTime: '',
//     arriveTime: '',
//     cancel: false
// }, {
//     name: 'KATLEGO',
//     reason: 'pouring petrol',
//     late: false,
//     reasonTime: '',
//     elapsedTime: '',
//     arriveTime: '',
//     cancel: false
// }, {
//     name: 'joel',
//     reason: '',
//     late: false,
//     reasonTime: '',
//     elapsedTime: '',
//     arriveTime: '',
//     cancel: false
// }]


const addClassList = () => {
    peopleDiv.innerHTML = `<p>Select a names file for members.</p>
    <input type="file" id="membersFile">
    <span class="material-symbols-outlined pointer absolute back-icon" onclick="goToHome()">
    arrow_back
    </span>
    <div class="flex column a-center">
        <p id="membersCount" class="margin-0">0 members</p>
        <span class="material-symbols-outlined pointer font-xxxlarge" onclick="goToHome()">
        groups
        </span>
    </div>               `
    // Add more styles to align this html right
    peopleDiv.classList.add('moreStyles');

    // Get file input element
    const fileElement = document.getElementById('membersFile');
    const membersCount = document.getElementById('membersCount');

    // Change listener for adding file of members and what to do
    fileElement.addEventListener('change', (e) => {
        var reader = new FileReader();
        let files = fileElement.files;
        const file = files[0]
        reader.onload = (e) => {
            const wholeFile = e.target.result;
            let classList = wholeFile.split('\n');
            classList.forEach((person, x) => {
                if (x === classList.length - 1) return;
                classList[x] = classList[x].replace(classList[x].substr(classList[x].length - 1), '');
            })
            console.log(classList);
            // Reset lateComers array to nothing before assinging members from file

            // Show total no. members of element
            membersCount.innerHTML = `${classList.length} members`


            lateComers = [];
            classList.forEach((name, x) => {
                lateComers.push({
                    name: classList[x],
                    reason: [],
                    late: false,
                    reasonTime: '',
                    elapsedTime: '',
                    arriveTime: '',
                    cancel: false
                })
            })
        }
        reader.readAsText(file);
    })
}

// Function for refreshing current page
const goToHome = () => {
    // Save members in local storage
    localStorage.setItem('lateComers', JSON.stringify(lateComers));

    // Refresh page
    window.location.reload();
}

// Get members data from localStorage
lateComers = JSON.parse(localStorage.getItem('lateComers'));

// Add list of array objects as people's name on home page content in section
lateComers.map((person, i) => {
    peopleDiv.innerHTML +=
        `<div class="border-top-10">
        <span id="reasons_${i.toString()}" class="material-symbols-outlined hide" onclick="moreReasonsTab(${i})">
        edit
        </span>
        <p class="margin-0" onclick="addReason(${i})">${person.name}</p>
        <span id="imLate_${i.toString()}" class="material-symbols-outlined hide" onclick="showTimer(${i})">
        schedule
        </span></div>`;

    // if statement for showing late icon of person late or not
    if (person.late) {
        document.getElementById('imLate_' + i).classList.remove('hide');
        document.getElementById('reasons_' + i).classList.remove('hide');
    }

})

const updateLaters = () => {
    // Initialize count to 0 and start counting no. late comers
    count = 0;
    // Calculate no. of late comers and show them
    lateComers.forEach((person, x) => {
        if (person.late === true) count++;
    })
    // Update count of no. late people
    noLatePeople.innerHTML = count;
}

// Refresh no. of late people
updateLaters();


// Capitalize first char of name to upperCase and return that name
const capitalizeIndex0 = (normalText) => normalText.replace(normalText.substr(0, 1), normalText.substr(0, 1).toUpperCase());

const addReason = (i) => {
    console.log(i);
    moveOne.map((item, x) => {
        peopleDiv.innerHTML =
            `<p>Why are you late ${capitalizeIndex0(lateComers[i].name)}?</p>
        <div class="text-area">
            <p class="margin-0"><small id="characters">25</small></p>
            <textarea name="" id="reasonInput" oninput="charactersTyped()" cols="30" rows="8"></textarea>
        </div>
        <div class="btn" id="submitReason" onclick="startTimer(${i})"><p class="margin-0">start timer</p></div>`
    })
    peopleDiv.classList.add('moreStyles');
    const charactersElement = document.getElementById('characters');
}

// Function for reducing characters number title according to typing *
const charactersTyped = () => {
    if (charactersMax <= 0) return;
    charactersMax--;
    charactersElement.value = charactersMax;
}


// Function for adding more reasons to being late
const moreReasonsTab = (i) => {
    moveOne.map((item, x) => {
        peopleDiv.innerHTML =
            `<p>What are you still late for ${capitalizeIndex0(lateComers[i].name)}?</p>
        <div class="text-area">
            <p class="margin-0"><small>25</small></p>
            <textarea name="" id="reasonInput" cols="30" rows="8"></textarea>
        </div>
        <div class="btn" id="submitReason" onclick="updateReasons(${i})"><p class="margin-0">update reason</p></div>`
    })
    peopleDiv.classList.add('moreStyles');
    // Show the first reason for being late
    document.getElementById('reasonInput').value = lateComers[i].reason.push(reason);
};

// Save updated reason for being late in storage
const updateReasons = (i) => {
    let reason = document.getElementById('reasonInput').value;
    if (!reason) {
        alert('You must provide an update for being late!')
        return;
    }

    let char = reason.toString().length;
    if (char <= 3) {
        alert('What update has only ' + char + ' characters?');
        return;
    }
    // Store reason on correct array position
    lateComers[i].reason.push(reason);

    localStorage.setItem('lateComers', JSON.stringify(lateComers));

    // Concat all reasons as one string if more than one
    if (lateComers[i].reason.length > 1) {
        var reasons;
        lateComers[i].reason.forEach((reason, x) => {
            if (x === lateComers[i].reason.length - 1) {
                reasons += reason;
                return;
            }
            reasons += reason + ',';
        })
        console.log(reasons)
    }

    // Refresh browser to go home page
    location.reload();
}

const showTimer = (i) => {
    // Save passed time in array and local storage
    lateComers[i].elapsedTime = calcLateTime(i);
    localStorage.setItem('lateComers', JSON.stringify(lateComers));


    // Add class for showing timer tab correctly
    peopleDiv.classList.add('moreStyles');
    // Show timer tab with elapsed time
    moveOne.map(person => {
        peopleDiv.innerHTML =
            `<div class="text flex-column">
                    <p class="margin-0">You're waiting on ${capitalizeIndex0(lateComers[i].name)} for</p>
                ${lateComers[i].reason.length === 1 ? `<p class="margin-0"> "${lateComers[i].reason[0]}"</p>` : `<marquee behavior="" direction="">${lateComers[i].reason[0]}, ${lateComers[i].reason[1]}</marquee>`}
                    </div>
                    <div class="time">
                    <div class="hrs">
                        <h3>${lateComers[i].elapsedTime[0]}</h3>
                        <p>hours</p>
                    </div>
                    <div class="min">
                        <h3>${lateComers[i].elapsedTime[1]}</h3>
                        <p>minutes</p>
                    </div>
                    <div class="sec">
                        <h3>${lateComers[i].elapsedTime[2]}</h3>
                        <p>seconds</p>
                    </div>
                    <div class="ms">
                        <h3>${lateComers[i].elapsedTime[3]}</h3>
                        <p>ms</p>
                    </div>
                    </div>
                    <div class="btn" id="arrive_${i.toString()}" onclick="arrived(${i})"><p class="margin-0">${capitalizeIndex0(lateComers[i].name)} arrived</p></div>
                    <button class="cancel-btn pointer">cancel</button>`;
    })
}


// Function for cancelling being late when person has arrived or canceled
const arrived = (i) => {
    console.log(i);
    // Make late false from true
    lateComers[i].late = false;
    // Default reason
    lateComers[i].reason = [];
    // Cancel reasonTime to nothing
    lateComers[i].reasonTime = [];
    // // Get time passed between reasoning and cancel/arrival time
    // let passedTime = calcLateTime(i);
    // lateComers[i].arriveTime = passedTime;
    // Save array data in local Storage
    localStorage.setItem('lateComers', JSON.stringify(lateComers));

    // Refresh home page
    location.reload();

}


const startTimer = (i) => {
    // When done with typing reset typing characters to max 25
    charactersMax = 25;

    // Store user reason for being late in variable
    var reason = document.getElementById('reasonInput').value;
    // Store that reason in array of objects
    if (reason) {
        let char = reason.toString().length;
        if (char > 3) {
            lateComers[i].reason.push(reason);
            lateComers[i].late = true;
            localStorage.setItem('lateComers', JSON.stringify(lateComers));

            // Calculate starting time of being late
            var date = new Date();
            var hrsS, minS, secS, msS, reasonTime;
            hrsS = date.getHours();
            minS = date.getMinutes();
            secS = date.getSeconds();
            msS = date.getMilliseconds();
            reasonTime = hrsS + ',' + minS + ',' + secS + ',' + msS + ',';
            reasonTime = reasonTime.split(',');

            // Store reason start time in array
            lateComers[i].reasonTime = reasonTime;


            // Show being late time update every 1 second
            setInterval(() => {
                let passedTime = calcLateTime(i);

                // Save elapsed time in array
                lateComers[i].elapsedTime = passedTime;

                // Save starting reason time and elapsed time in localstorage
                localStorage.setItem('lateComers', JSON.stringify(lateComers));


                // Show timer tab
                moveOne.map((person, indx) => {
                    peopleDiv.innerHTML =
                        `<div class="text flex-column">
                        <p class="margin-0">Whole class is waiting on <b>YOU</b> for</p>
                        <p class="margin-0"> "${lateComers[i].reason[0]}"</p>
                        </div>
                        <div class="flex-center">
                        <p class="margin-0"><b>Current waiting time: </b></p>
                        <span class="material-symbols-outlined">
                        schedule
                        </span>
                        </div>
                        <div class="time">
                        <div class="hrs">
                            <h3>${lateComers[i].elapsedTime[0]}</h3>
                            <p>hours</p>
                        </div>
                        <div class="min">
                            <h3>${lateComers[i].elapsedTime[1]}</h3>
                            <p>minutes</p>
                        </div>
                        <div class="sec">
                            <h3>${lateComers[i].elapsedTime[2]}</h3>
                            <p>seconds</p>
                        </div>
                        <div class="ms">
                            <h3>${lateComers[i].elapsedTime[3]}</h3>
                            <p>ms</p>
                        </div>
                        </div>
                        <button class="cancel-btn pointer" onclick="arrived(${i})">cancel</button>`;
                })
            }, 1000);
            // Count no. of late people and show it
            updateLaters();
        } else {
            alert('What reason has only ' + char + ' characters?');
            return;
        }
    } else {
        alert('You must provide a reason for being late!');
        return;
    }
    console.log(lateComers[i].late);

}


//Function for calculating passing time since reporting late reason
const calcLateTime = (i) => {

    // Create current time and determine how long being late;
    let currentHrs, currentMin, currentSec, currentMs, currentTime;
    let passedHrs, passedMin, passedSec, passedMs, passedTime;
    var date = new Date();

    currentHrs = date.getHours();
    currentMin = date.getMinutes();
    currentSec = date.getSeconds();
    currentMs = date.getMilliseconds();
    currentTime = currentHrs + ',' + currentMin + ',' + currentSec + ',' + currentMs + ',';
    currentTime = currentTime.split(',');

    // Determine how long being late, hous,minutes,seconds and ms
    passedHrs = currentTime[0] - lateComers[i].reasonTime[0];
    passedMin = currentTime[1] - lateComers[i].reasonTime[1];
    passedSec = currentTime[2] - lateComers[i].reasonTime[2];
    passedMs = currentTime[3] - lateComers[i].reasonTime[3];
    passedTime = passedHrs + ',' + passedMin + ',' + passedSec + ',' + passedMs + ',';
    passedTime = passedTime.split(',');

    // Calculating correct exact passed time (no negativ time e.g -12minutes)
    passedTime.forEach((item, indx) => {
        switch (indx) {
            case 0:

                break;
            case 1:
                if (passedTime[indx] < 0) {
                    passedTime[indx] = (Number(passedTime[1]) + 60);
                    passedTime[indx - 1] = Number(passedTime[indx - 1]) - 1;
                }
                break;
            case 2:
                if (passedTime[indx] < 0) {
                    passedTime[indx] = (Number(passedTime[2]) + 60);
                    passedTime[indx - 1] = Number(passedTime[indx - 1]) - 1;
                }
                break;
            case 3:
                if (passedTime[indx] < 0) {
                    passedTime[indx] = (Number(passedTime[3]) + 1000);
                    passedTime[indx - 1] = Number(passedTime[indx - 1]) - 1;
                }
                break;
            default:
                break;
        }
    });

    return passedTime;
}