let btn1 = document.querySelector(".button-1");
let inputSub = document.getElementById("input-sub");
let inputQues = document.getElementById("input-ques");
let submitBtn = document.getElementById("submit-btn");
let quesContainer = document.getElementById("ques-container");
let rightPage1 = document.querySelector(".right-page-1");
let rightPage2 = document.querySelector(".right-page-2");
let subDiv = document.querySelector(".sub-div"); 
let responseDiv = document.querySelector(".response-div");
let resolveBtn = document.getElementById("resolve-btn");
let inputName = document.getElementById("input-name");
let addComment = document.getElementById("add-comment");
let addResponsebtn = document.getElementById("add-response-btn");
let searchArea = document.getElementById("search");

rightPage2.style.display = "none";

let arr = [];                                       //to store ques as object in this array
let responseArr = [];                               //to store respose as object in this array
let ID;                                             //To store the id of the clicked ques

btn1.addEventListener("click",(e) => {
    rightPage1.style.display = "block";
    rightPage2.style.display = "none";
});

submitBtn.addEventListener("click",(e) => {
    createNewQues(e);
});

addResponsebtn.addEventListener("click",(e) => {
    createNewResponse(e);
});

resolveBtn.addEventListener("click",(e) => {
    removeQuesAndRes(e);
});

searchArea.addEventListener("keyup",(e) => {
    handleSearchArea(e);
});

function createNewQues(e){
    if(!isBoxEmpty(inputSub.value,inputQues.value)){
        const newQuesObj = {
            subject: inputSub.value,
            question: inputQues.value,
            isFav : false,
            id: Date.now(),                                     //use date.now() to provide the unique id to every question
            time: Date.now(),
        };
        arr.push(newQuesObj);
        addQuesToDom(newQuesObj);
        updateQuesStorage();
        inputSub.value = "";
        inputQues.value = "";
    }
    else{
        alert("Please enter any subject and question");
    }
}

function createNewResponse(event)
{
    if(!isBoxEmpty(inputName.value,addComment.value)){
        const newResponseObj = {
            userName: inputName.value,
            comment:addComment.value,
            quesId : ID,
            like : 0,
            disLike : 0,
            id: Date.now(),
        }
        responseArr.push(newResponseObj);
        addResponse(newResponseObj);
        updateResponseStorage();
        inputName.value = "";
        addComment.value = "";
    }
    else{
        alert("Please enter your name and add any comment");
    }
}

function addResponse(resObj)
{
    let newResponse = createResponse(resObj);
    responseDiv.style.display = "block";
    responseDiv.append(newResponse);
}

function createResponse(resObj)
{
    let resContainer = document.createElement("div");
    resContainer.classList.add("response-container","flex");

    let resDiv = document.createElement("div");
    resDiv.classList.add("res-div");

    let name = document.createElement("h4");
    name.innerText = resObj.userName;
    
    let comment = document.createElement("p");
    comment.innerText = resObj.comment;

    let likeIcon = document.createElement("i");
    likeIcon.classList.add("ri-thumb-up-line","icon");
    likeIcon.setAttribute("id","thumb-up");

    let likeCount = document.createElement("p");
    likeCount.classList.add("count");
    likeCount.innerText = resObj.like;

    likeIcon.addEventListener("click",(e) => {
        handlelikeIcon(e,resObj);
    });

    let disLikeIcon = document.createElement("i");
    disLikeIcon.classList.add("ri-thumb-down-line","icon");
    disLikeIcon.setAttribute("id","thumb-down");
    
    let disLikeCount = document.createElement("p");
    disLikeCount.classList.add("count");
    disLikeCount.innerText = resObj.disLike;

    disLikeIcon.addEventListener("click",(e) => {
        handleDislikeIcon(e,resObj);
    });

    resDiv.append(name);
    resDiv.append(comment);
    resContainer.append(resDiv);
    resContainer.append(likeIcon);
    resContainer.append(likeCount);
    resContainer.append(disLikeIcon);
    resContainer.append(disLikeCount);
    return resContainer;
}

function handlelikeIcon(e,resObj){
    let targetCount = e.target.nextElementSibling;
    let currentCount = parseInt(targetCount.innerText);
    targetCount.innerText = currentCount + 1;
    resObj.like = targetCount.innerText;
    
    updateResponseStorage();
    renderResponse(ID);
}

function handleDislikeIcon(e,resObj) {
    let targetCount = e.target.nextElementSibling;
    let currentCount = parseInt(targetCount.innerText);
    targetCount.innerText = currentCount + 1;
    resObj.disLike = targetCount.innerText;

    updateResponseStorage();
    renderResponse(ID);
}

function appendInRight(event)
{
    responseDiv.innerText = "";
    responseDiv.style.display = "none";
    rightPage1.style.display = "none";
    rightPage2.style.display = "block";
    
    let target = event.target.parentNode;    //access the div
    ID = target.id;
    
    let sub = document.createElement("h4");
    let ques = document.createElement("p");
    
    let storedArr = [];
    storedArr = JSON.parse(localStorage.getItem("arr"));
    
    for(let i=0; i<arr.length; i++)
    {
        if(arr[i].id == target.id){
            sub.innerText = storedArr[i].subject;
            ques.innerText = storedArr[i].question;
        }
    }
    subDiv.innerText = "";
    subDiv.append(sub);
    subDiv.append(ques);
    
    renderResponse(target.id);
}


function addQuesToDom(obj){
    let newQues = createQuesList(obj);
    quesContainer.append(newQues);           //add to dom
}


function createQuesList(obj){
    let quesList = document.createElement("li");
    quesList.classList.add("list","flex");
    
    let quesDiv = document.createElement("div");
    quesDiv.classList.add("ques-list");
    quesDiv.setAttribute("id",`${obj.id}`);

    quesDiv.addEventListener("click",(e) => {
        appendInRight(e);
    })
    
    let sub = document.createElement("h4");
    sub.innerText = obj.subject;
    
    let ques = document.createElement("p");
    ques.innerText = obj.question;

    let timeElement = document.createElement("span");
    timeElement.classList.add("time-display");
    timeElement.innerText = getTime(obj.time);
    
    let emptyStar = document.createElement("img");
    emptyStar.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/1024px-Empty_Star.svg.png";
    emptyStar.classList.add("star");
    
    let yellowStar = document.createElement("img");
    yellowStar.src = "https://www.freepnglogos.com/uploads/star-png/star-vector-png-transparent-image-pngpix-21.png"
    yellowStar.classList.add("star");
   
    emptyStar.addEventListener("click",(e) => {
        handleEmptyStar(e,yellowStar,obj);
    });
   
    yellowStar.addEventListener("click",(e) => {
        handleYellowStar(e,emptyStar,obj);
    });

    
    quesDiv.appendChild(sub);
    quesDiv.appendChild(ques);
    quesList.appendChild(quesDiv);
    quesList.appendChild(timeElement);
    quesList.append(emptyStar);

    if(obj.isFav){
        emptyStar.replaceWith(yellowStar);
    }

    return quesList;
}

function getTime(time){
    let timeContainer = document.createElement("span");
    const currentTime = Date.now();
    let quesTime = Math.floor((currentTime - time) / 1000);           // Math.floor() removes any decimal portion of the result for ex = seconds = 90.123
    let hours;
    if(quesTime<60){
        //for seconds
        let seconds = quesTime;
        if(seconds>5)
            timeContainer.innerText = quesTime+" sec ago";
        else
        timeContainer.innerText = "few sec ago";
    }
    else{
        //for minutes
        let minutes = Math.floor(quesTime/60);
        if(minutes < 60){
            if(minutes > 5)
                timeContainer.innerText = minutes+" min ago";
            else
            timeContainer.innerText = " few min ago";        
        }
        //for hours
        else if(minutes > 60){
            hours = Math.floor(minutes/60);
            if(hours < 24)
                timeContainer.innerText = hours + " hours ago";        
        }
        //for days
        else if(hours > 24){
            let days = Math.floor(hours/24);
            if(days < 30){
                if(days == 1)
                    timeContainer.innerText = days + " day ago";  
                else
                    timeContainer.innerText = days + " days ago";        
            }
        }
    }
    return timeContainer.innerText;
}

function updateTime(){
    const timeElements = document.querySelectorAll('.time-display');
    // console.log(timeElements)
    timeElements.forEach(timeElement => {
        const quesId = timeElement.previousElementSibling.getAttribute('id');
        const quesObj = arr.find(ques => ques.id == quesId);
        if (quesObj) {                                      // Check if quesObj is not undefined
            timeElement.innerText = getTime(quesObj.time);
        }
    });
}

function handleEmptyStar(e,yellowStar,obj){
    let ques = e.currentTarget.parentNode;
    quesContainer.prepend(ques);
    e.target.replaceWith(yellowStar);
    obj.isFav = true;
    updateQuesStorage();
} 

function handleYellowStar(e,emptyStar,obj){
    let ques = e.currentTarget.parentNode;
    quesContainer.append(ques);
    e.target.replaceWith(emptyStar);
    obj.isFav = false;
    updateQuesStorage();
}

function handleSearchArea(e){
    let searchText = searchArea.value.trim().toLowerCase();
    quesContainer.innerHTML = "";

    let filteredArr = arr.filter((quesObj) => {
        return quesObj.subject.toLowerCase().includes(searchText) || quesObj.question.toLowerCase().includes(searchText);
    });

    if (filteredArr.length === 0) {
        quesContainer.innerHTML = "<p>No match found.</p>";
        return;
    }
    filteredArr.forEach((ques) => {
        let newQues = createQuesList(ques);
        let regex = new RegExp(searchText,"gi");

        let highlightSub = ques.subject.replace(regex,`<span class="highlight">${searchText}</span>`);
        let highlightQues = ques.question.replace(regex,`<span class="highlight">${searchText}</span>`);

        newQues.querySelector("h4").innerHTML = highlightSub;
        newQues.querySelector("p").innerHTML = highlightQues;
        quesContainer.append(newQues);
    });
}

function removeQuesAndRes(event){
    let list = document.getElementById(ID);
    list.parentNode.remove();          //remove from dom

    removeQuesFromStorage();
    removeResponseFromStorage();

    rightPage1.style.display = "block";
    rightPage2.style.display = "none";
}

function removeQuesFromStorage(){
    let newArr = [];

    for(let i=0; i<arr.length; i++){
        if(arr[i].id != ID){
            newArr.push(arr[i]);
        }
    }
    arr = newArr;
    updateQuesStorage();
}

function updateQuesStorage(){
    let ques = JSON.stringify(arr);
    localStorage.setItem("arr",ques);
}

function removeResponseFromStorage(){
    let newResArr = [];

    for(let i=0; i<responseArr.length; i++){
        if(responseArr[i].quesId != ID){
            newResArr.push(responseArr[i]);
        }
    }
    responseArr = newResArr;
    updateResponseStorage();
}

function updateResponseStorage()
{
    let res = JSON.stringify(responseArr);
    localStorage.setItem("responseArr",res);
}

function isBoxEmpty(value1,value2)
{
    if(value1.trim(" ") !="" && value2.trim(" ") !="")return 0;
    return 1;
}

function renderQues(){
    arr = JSON.parse(localStorage.getItem("arr"));
    if(arr == null) arr = [];
    
    //for favorite question
    arr.forEach((ques) => {
        if(ques.isFav){
            let newQues = createQuesList(ques);
            quesContainer.append(newQues);
        }
    });

    //for Not fav. ques
    arr.forEach((ques) => {
        if(!ques.isFav){
            let newQues = createQuesList(ques);
            quesContainer.append(newQues);
        }
    });
}

function renderResponse(targetId){
    responseArr = JSON.parse(localStorage.getItem("responseArr"));
    if(responseArr == null){
        responseArr = [];
        responseDiv.style.display = "none";
        return;
    }
    responseDiv.style.display = "block";
    
    // filter and Sort the array according to the likes
    let filterArray = responseArr.filter(res => res.quesId === targetId)
    if(filterArray == null  || filterArray.length === 0){
        responseDiv.style.display = "none";
        return;
    }

    // filterArray.sort((a, b) => b.like - a.like);           sort acc. to only likes
    filterArray.sort((a, b) => {          //sort acc. to the differrence of like and dislike
        let diffA = parseInt(a.like) - parseInt(a.disLike);
        let diffB = parseInt(b.like) - parseInt(b.disLike);
        return diffB-diffA;
    });
    
    responseDiv.innerText = "";
    filterArray.forEach((res) => {
        let newRes = createResponse(res);
        responseDiv.append(newRes);
    });
}

setInterval(updateTime,1000);
renderQues();

// function isSQboxEmpty()
// {
//     if(inputSub.value.trim(" ") !="" && inputQues.value.trim(" ") !="") return 0;
//     return 1;
// }

// function isNCboxEmpty()
// {
//     if(inputName.value.trim(" ") !="" && addComment.value.trim(" ") !="")return 0;
//     return 1;
// }

// responseArr.reverse();

// let count = 0;
// responseDiv.innerText = "";
// responseArr.forEach((res) => {
//     if(targetId === res.quesId){
//         count = 1;
//         let newRes = createResponse(res);
//         responseDiv.append(newRes);
//     }
// });  
// if(count == 0){
//     responseDiv.style.display = "none";
// }

// quesContainer.addEventListener("click",(e) => {
//     appendInRight(e);
// });

// for(let i=0; i<responseArr.length; i++)
// {
//     let renderName = document.createElement("h4");
//     let renderComment = document.createElement("p");
//     if(targetId == responseArr[i].quesId){
//         count = 1;
//         renderName.innerText = responseArr[i].userName;
//         renderComment.innerText = responseArr[i].comment;
//     }
//     responseDiv.append(renderName);
//     responseDiv.append(renderComment);
// }
// if(count == 0){
//     responseDiv.style.display = "none";
// }

// yellowStar = https://www.freepnglogos.com/uploads/star-png/star-vector-png-transparent-image-pngpix-21.png

// emptyStar = https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/1024px-Empty_Star.svg.png

// if(!isResArrEmpty){
//     responseDiv.style.display = "block";
// }
// else{
//     responseDiv.style.display = "none";
// }
// function isResArrEmpty(){
//     if(responseArr.length != 0)
//         return 0;
//     return 1;
// }