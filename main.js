const url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const getReposObj = require("./getRepos");
const fs = require("fs");
const path = require("path");
const githubPath = path.join(__dirname,"github");
dirCreater(githubPath);
request(url,cb);
function cb(error,request,html) {
    if(error)
        console.error("error: ",error);
    else
        handlehtml(html);
}
function handlehtml(html){
    let $ = cheerio.load(html);
    let anchorElem = $(".topic-box a");
    for(let i=0;i<anchorElem.length;i++)
    {
        let href = $(anchorElem[i]).attr("href");
        let fullLink = "https://github.com"+href;
        let pTagArr = $(anchorElem[i]).find("p");
        let topicName = $(pTagArr[0]).text().trim();
        const topicPath = path.join(__dirname,"github",topicName);
        dirCreater(topicPath);
        console.log("Topic:",topicName,fullLink);
        getReposObj.gr(fullLink,topicName);
    }
}
function dirCreater(filePath){
    if(fs.existsSync(filePath)==false)
        fs.mkdirSync(filePath);
}