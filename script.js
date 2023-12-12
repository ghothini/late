var peopleDiv = document.getElementById('peopleDiv');
var submitReason = document.getElementById('submitReason');
var noLatePeople = document.getElementById('noLatePeople');

// Move through this one time using map methods to link html code
var moveOne = [1];
var count;

// // For adding or changing members manually to array.
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
//     name: 'thabang',
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

// // Get people data from localStorage
var lateComers = JSON.parse(localStorage.getItem('lateComers'));

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


// Capitalize first letter of name to upperCase and return that name
const camelCharName = (normalText) => normalText.replace(normalText.substr(0, 1), normalText.substr(0, 1).toUpperCase());

const addReason = (i) => {
    console.log(i);
    moveOne.map((item, x) => {
        peopleDiv.innerHTML =
            `<p>Why are you late ${camelCharName(lateComers[i].name)}?</p>
        <div class="text-area">
            <p class="margin-0"><small>25</small></p>
            <textarea name="" id="reasonInput" cols="30" rows="8"></textarea>
        </div>
        <div class="btn" id="submitReason" onclick="startTimer(${i})"><p class="margin-0">start timer</p></div>`
    })
    peopleDiv.classList.add('moreStyles');
    // Refresh no. of late people
}



// Function for adding more reasons to being late
const moreReasonsTab = (i) => {
    moveOne.map((item, x) => {
        peopleDiv.innerHTML =
            `<p>What are you still late for ${camelCharName(lateComers[i].name)}?</p>
        <div class="text-area">
            <p class="margin-0"><small>25</small></p>
            <textarea name="" id="reasonInput" cols="30" rows="8"></textarea>
        </div>
        <div class="btn" id="submitReason" onclick="updateReasons(${i})"><p class="margin-0">update reason</p></div>`
    })
    peopleDiv.classList.add('moreStyles');
    // Show the first reason for being late
    document.getElementById('reasonInput').value = lateComers[i].reason;
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
    lateComers[i].reason = reason;

    localStorage.setItem('lateComers', JSON.stringify(lateComers));

    // Refresh browser to go home page
    location.reload();
}

const showTimer = (i) => {

    // Show time that updates every 1 second
    setInterval(() => {
        // Save passed time in array and local storage
        lateComers[i].elapsedTime = calcElapsedTime(i);
        localStorage.setItem('lateComers', JSON.stringify(lateComers));


        // Add class for showing timer tab correctly
        peopleDiv.classList.add('moreStyles');
        // Show timer tab with elapsed time
        moveOne.map((person, indx) => {
            peopleDiv.innerHTML =
                `<div class="text flex-column">
                    <p class="margin-0">You're waiting on ${camelCharName(lateComers[i].name)} for</p>
                    <p class="margin-0"> "${lateComers[i].reason}"</p>
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
                    <div class="btn" id="arrive_${i.toString()}" onclick="arrived(${i})"><p class="margin-0">${camelCharName(lateComers[i].name)} arrived</p></div>
                    <button class="cancel-btn pointer">cancel</button>`;
        })
    }, 1000)
}


// Function for cancelling being late when person has arrived or canceled
const arrived = (i) => {
    console.log(i);
    // Make late false from true
    lateComers[i].late = false;
    // Default reason
    lateComers[i].reason = '';
    // Cancel reasonTime to nothing
    lateComers[i].reasonTime = [];
    // // Get time passed between reasoning and cancel/arrival time
    // let passedTime = calcElapsedTime(i);
    // lateComers[i].arriveTime = passedTime;
    // Save array data in local Storage
    localStorage.setItem('lateComers', JSON.stringify(lateComers));

    // Refresh home page
    location.reload();

}


const startTimer = (i) => {
    // Store user reason for being late in variable
    var reason = document.getElementById('reasonInput').value;
    // Store that reason in array of objects
    if (reason) {
        let char = reason.toString().length;
        if (char > 3) {
            lateComers[i].reason = reason;
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
                let passedTime = calcElapsedTime(i);

                // Save elapsed time in array
                lateComers[i].elapsedTime = passedTime;

                // Save starting reason time and elapsed time in localstorage
                localStorage.setItem('lateComers', JSON.stringify(lateComers));


                // Show timer tab
                moveOne.map((person, indx) => {
                    peopleDiv.innerHTML =
                        `<div class="text flex-column">
                        <p class="margin-0">Whole class is waiting on <b>YOU</b> for</p>
                        <p class="margin-0"> "${lateComers[i].reason}"</p>
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


const calcElapsedTime = (i) => {
    //Calculate elapsed time since given reason
    // Create current time and determine how long being late;
    var date = new Date();
    let hrsC, minC, secC, msC, currentTime;
    let hrsP, minP, secP, msP, passedTime;
    hrsC = date.getHours();
    minC = date.getMinutes();
    secC = date.getSeconds();
    msC = date.getMilliseconds();
    currentTime = hrsC + ',' + minC + ',' + secC + ',' + msC + ',';
    currentTime = currentTime.split(',');

    // Determine how long being late, hous,minutes,seconds and ms
    hrsP = currentTime[0] - lateComers[i].reasonTime[0];
    minP = currentTime[1] - lateComers[i].reasonTime[1];
    secP = currentTime[2] - lateComers[i].reasonTime[2];
    msP = currentTime[3] - lateComers[i].reasonTime[3];
    passedTime = hrsP + ',' + minP + ',' + secP + ',' + msP + ',';
    passedTime = passedTime.split(',');

    // Switch statement to calculate exact elapsed time (no negativ time e.g -12minutes)
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