// const url = "https://github.com/denoland/deno/issues";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require('pdfkit');

// getIssues(url,topicName,repoName);
function getIssues(url,topicName,repoName)
{
    request(url,function (error,request,html) {
        if(error)
            console.error("error: ",error);
        else
        {
            console.log("Topic:",topicName," Repo:",repoName);
            console.log("Issues:");
            handlehtml(html,topicName,repoName);
        }
    })
}
function handlehtml(html,topicName,repoName){
    let $ = cheerio.load(html);
    let container = $(".js-navigation-container.js-active-navigation-container");
    let anchor = $("#repository-container-header h1 a[data-pjax='#repo-content-pjax-container']");
    let anchorElems = $(container).find("a[id]");
    for(let i=0;i<anchorElems.length;i++){
        let href = $(anchorElems[i]).attr("href");
        let fullLink = "https://github.com"+href;
        console.log(fullLink);
        processIssues(href,topicName,repoName);
    }
}

function processIssues(href,topicName,repoName){
    let topicPath = path.join(__dirname,"github",topicName);
    let repoPath = path.join(topicPath,repoName);
    dirCreater(repoPath);
    // let filePath = path.join(repoPath,repoName+".json");
    let filePath = path.join(repoPath,repoName+".pdf");
    fileCreater(filePath);
    let buffer = fs.readFileSync(filePath);
    let dataArr = JSON.parse(buffer);
    dataArr.push(href);
    let text = JSON.stringify(dataArr);

    let pdfDoc = new pdfkit();
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(text)
    pdfDoc.end();
    fs.writeFileSync(filePath,text);
}
function dirCreater(filePath){
    if(fs.existsSync(filePath)==false)
        fs.mkdirSync(filePath);
}
function fileCreater(filePath){
    if(fs.existsSync(filePath)==false)
        fs.writeFileSync(filePath,"[]");
}
module.exports = {
    gi : getIssues
}