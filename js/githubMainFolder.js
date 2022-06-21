
// Getting content of repo: https://stackoverflow.com/questions/14390090/github-api-list-all-repositories-and-repos-content
// Vanilla JS github api video: https://www.youtube.com/watch?v=5QlE6o-iYcE

// TODO:
// 1. Make download links download the file 
//      - requires use of https://github.com/minhaskamal/downgit
//      - will allow the ability to download directories


// COMPLETED
// 1. Create upload button (DONE)
// 2. Create a file path tracker (DONE)
// 3. Allow navigation to sub directories (DONE)
// 4. Allow navigation with file path tracker (DONE)
// 2. Make base repo load on page load (DONE)


// CONFIG VARIABLES
const githubApi = "https://api.github.com/"
const username = "akcanbalkir"
const repoName = "dy_mainfile"
const mainFolder = "repos/" + username + "/" + repoName + "/"
const uploadURL = "https://github.com/" + username + "/" + repoName + "/upload/main/"
const downloadDirectoryURL = "https://download-directory.github.io/?url="
const repoMainURL = "https://github.com/" + username + "/" + repoName + "/tree/main/"
const repoDownloadURL = "https://github.com/" + username + "/" + repoName + "/archive/refs/heads/main.zip"

// GLOBAL VARIABLES
let currPath = '' // keeps track of latest path (updated in getFolderContent)

// function called on page load
$(document).ready(function () {
    getFolderContent('');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         REPO CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Async function to get the main folder repo
async function getFolderContent(path) {
    // get div to populate content
    const repoContent = document.getElementById("repoContent")

    // clear folder content div to repopulate later
    clearElement(repoContent);

    // get folder content from github api
    let url = githubApi + mainFolder + "contents/";
    if (path != '') {
        url = url + path + '?ref=main'
    }

    const response = await fetch(url);
    let result = await response.json();

    // sort by folder - file (alphabetical)
    result.sort(function (a,b) {
        if (a.type == b.type) {
            return a.name.localeCompare(b.name)
        }

        return a.type == "dir"? -1 : 1
    })

    // populate folder content 
    result.forEach(element => {
        let row = element.type == "dir"? createDirRepoContent(element) : createFileRepoContent(element)
        repoContent.appendChild(row)
    });

    // update the current path (global variables)
    currPath = path

    // update directory download button
    addDirDownloadButton(currPath)

    // clear options notes
    const optionNotes = document.getElementById("optionNotes")
    clearElement(optionNotes)
}
// function for creating directory repo element
function createDirRepoContent(element) {
    const anchor = document.createElement("a")
    anchor.onclick=function() { onClickDirRepoContent(element) }
    anchor.appendChild(createIcon("/assets/folder.svg"))
    anchor.appendChild(document.createTextNode(element.name + "/"))
    
    const row = createRowRepContent()
    row.appendChild(anchor)
    return row
}
// function for creating file repo element
function createFileRepoContent(element) {
    const anchor = document.createElement("a")
    anchor.href = element.download_url
    anchor.appendChild(createIcon("/assets/file-text.svg"))
    anchor.appendChild(document.createTextNode(element.name)) 
    anchor.target = "_blank"

    const row = createRowRepContent()
    row.appendChild(anchor)
    return row
}
// create row for repo content
function createRowRepContent(){
    const row = document.createElement("div")
    row.style.marginTop = "8px"
    return row
}

function downloadRepoFile(link){
    fetch(downloadRepoFile)
}
// function called when clicking dir repo content
function onClickDirRepoContent(dirItem) {
    // update path label
    addToPathLabel(dirItem.name,dirItem.path)

    // display folder content
    getFolderContent(dirItem.path)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         UPLOADING FILES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// opens GitHub upload page for the directory defined by currPath
function uploadToCurrPath() {
    // get div which holds the option notes
    const optionNotes = document.getElementById("optionNotes")

    // clear notes
    clearElement(optionNotes)

    // add note
    optionNotes.appendChild(document.createTextNode("Need to refresh folder (can click path) to see uploaded file."))

    //open upload page
    window.open(uploadURL + currPath)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         PATH LABEL
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function to add to the path label
function addToPathLabel(dirName,path) {
    // get div which holds the path label
    const pathLabel = document.getElementById("pathLabel")

    // create new path item
    const anchor = document.createElement("a")
    anchor.textContent = dirName + "/"
    anchor.onclick = function () { redirectFromPathLabel(path) }

    // append new path item
    pathLabel.appendChild(anchor)
}
// function to redirect when using path label to navigate
function redirectFromPathLabel(path) {
    // get div which holds the path label
    const pathLabel = document.getElementById("pathLabel")

    // clear path label
    clearElement(pathLabel)

    // add base repo link
    const mainfileAnchor = document.createElement("a")
    mainfileAnchor.textContent = "dy_mainfile/"
    mainfileAnchor.onclick = function() { redirectFromPathLabel('') }
    pathLabel.appendChild(mainfileAnchor)

    if (path == '') { 
        getFolderContent(path)
        return 
    }

    // add remaining path links 
    const pathDirs = path.split("/")
    for (i = 0; i < pathDirs.length; i++){
        const anchor = document.createElement("a")
        anchor.textContent = pathDirs[i] + "/"
        anchor.onclick = function() { redirectFromPathLabel(pathDirs.slice(0,i+1).join("/"))} 
        pathLabel.appendChild(anchor)
    }

    // get folder content
    getFolderContent(path)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              DOWN GIT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function which returns the download url for the current directory
function dirDownloadURL(path) {
    if (path == '') {
        return repoDownloadURL
    }
    return downloadDirectoryURL + repoMainURL + path
}
// function which adds the download <a> tag for the current directory
function addDirDownloadButton(path) {
    // get div which holds the directory download link
    const dirDownloadCotainer = document.getElementById("dirDownloadCotainer")

    // clear div which holds the directory download link
    clearElement(dirDownloadCotainer)

    // add <a> tag
    const anchor = document.createElement("a")
    anchor.textContent = "Download Directory"
    anchor.onclick = () => {dirFetchDownload(path)}
    dirDownloadCotainer.appendChild(anchor) 
}
function updateDownloadDir() {
    addDirDownloadButton(currPath)
}
function dirFetchDownload(path){
    window.open(dirDownloadURL(path), 'dirDownloadFrame')
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         MISC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function to clear element
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
// function to create an icon span element
function createIcon(srcImg) {
    const folderSpan = document.createElement("span")
    folderSpan.style.display = "inline-block"
    folderSpan.style.verticalAlign = "text-bottom"

    const folderIcon = document.createElement("img")
    folderIcon.style.margin="0"
    folderIcon.src = srcImg

    folderSpan.appendChild(folderIcon)
    return folderSpan
}
