// const url="https://github.com/topics/pwa";
const request = require("request");
const cheerio = require("cheerio");
const issuesObj = require("./issues");
function getRepos(url,topicName){
    request(url,function (error,request,html) {
        if(error)
            console.error("error: ",error);
        else
        {
            console.log("Topic:",topicName);
            handlehtml(html,topicName);
        }
    })
}
function handlehtml(html,topicName){
    let $ = cheerio.load(html);
    let titleElems = $("h3.f3.color-fg-muted.text-normal.lh-condensed");
    for(let i=0;i<8;i++)
    {
        let anchorElems = $(titleElems[i]).find("a");
        let repoName = $(anchorElems[1]).text().trim();
        let href = $(anchorElems[1]).attr("href");
        let fullLink = "https://github.com"+href;
        console.log("Repo:",repoName,fullLink);
        let issueLink = fullLink+"/issues";
        issuesObj.gi(issueLink,topicName,repoName);
    }
}

module.exports = {
    gr : getRepos
}