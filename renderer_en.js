const PDFMerger = require('pdf-merger-js');
const fs = require('fs');
var merger = new PDFMerger();
const path = require("path");
const os = require("os");
var selectedLang = "EN"
var uploadedFile;
async function upload() {
    var file = await document.getElementById("file").files[0];
    var arrayBuffer = await file.arrayBuffer();
    var nodeBuffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(file.name, nodeBuffer);
    uploadedFile = file.name;
    next("step2");
}
async function multiply() {
    next("done");
    var file = await document.getElementById("file").files[0];
    var times = document.getElementById("page").value;
    for (var i = 0; i < times; i++) {
        await merger.add(uploadedFile);
    }
    const mergedPdfBuffer = await merger.saveAsBuffer();

    const desktopPath = path.join(os.homedir(), "Desktop", document.getElementById("page").value + "x-" + file.name);
    fs.writeFileSync(desktopPath, mergedPdfBuffer);
    fs.unlinkSync(uploadedFile);
    document.getElementById("file_check").innerHTML = "File saved to Desktop: " + document.getElementById("page").value + "x-" + file.name;
}

multiply().then(
    function () {
        next("done");
    },
    function () {
        next('step1');
    }
);

function select() {
    document.getElementById("file").click();
}

function load (){
    var file = document.getElementById("file").files[0];
    document.getElementById("select").innerHTML = file.name + "<br>Click here to reselect";
    document.getElementById("upload").style.display = null;
}
function clearAll(){
    var IDs = ['step1', 'step2', 'confirm','loading' , 'done'];
    for (var i = 0; i < IDs.length; i++) {
        document.getElementById(IDs[i]).style.display = "none";
    }
}

function next(id) {
    clearAll();
    document.getElementById(id).style.display = null;
}

function confirm(){
    clearAll();
    document.getElementById("file_name").innerHTML = document.getElementById("file").files[0].name;
    document.getElementById("copies").innerHTML = document.getElementById("page").value;
    next("confirm");
}

function restart () {
    window.location.reload();
}

function switchLang(lang)  {
    var lang = lang || "ZH";
    selectedLang = lang;
    var langList = document.getElementsByClassName("langButton");
    for (var i = 0; i < langList.length; i++) {
        langList[i].classList.remove("selected");
    }
    document.getElementById(lang).classList.add("selected");
    setTimeout(function () {
        window.location.href = "index_" + lang + ".html";
    }, 300);
}