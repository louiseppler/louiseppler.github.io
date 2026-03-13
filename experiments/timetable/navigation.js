viewState = "home";
searchType = 0;

function changeSearchType(type) {
    searchType = type;

    document.getElementById("search-input-departure").style.display = "none";
    document.getElementById("invert1-view").style.display = "none";
    document.getElementById("search-input-departure2").style.display = "none";
    document.getElementById("search-input-via").style.display = "none";
    document.getElementById("invert2-view").style.display = "none";
    document.getElementById("search-input-via2").style.display = "none";
    document.getElementById("invert3-view").style.display = "none";
    document.getElementById("search-input-arrival").style.display = "none";

    if(type == 0) {
        document.getElementById("search-input-departure").style.display = "block";
        document.getElementById("search-input-arrival").style.display = "block";
    }
    else if(type == 1) {
        document.getElementById("search-input-departure").style.display = "block";
        document.getElementById("search-input-departure2").style.display = "block";
        document.getElementById("search-input-arrival").style.display = "block";
    }
    else if(type == 2) {
        document.getElementById("search-input-departure").style.display = "block";
        document.getElementById("invert1-view").style.display = "block";
        document.getElementById("search-input-via").style.display = "block";
        document.getElementById("invert2-view").style.display = "block";
        document.getElementById("search-input-via2").style.display = "block";
        document.getElementById("invert3-view").style.display = "block";
        document.getElementById("search-input-arrival").style.display = "block";
    }
    else if(type == 3) {
        document.getElementById("search-input-departure").style.display = "block";
        document.getElementById("search-input-via").style.display = "block";
        document.getElementById("search-input-arrival").style.display = "block"; 
    }
    
}

function setupViews() {
    document.getElementById("view-back-button").style.display = "none";
}

function navigateBack() {
    if(viewState == "graphic") {
        showOverview();
    }
}

function showSearch() {
    document.getElementById("view-error").style.display = "none";
    document.getElementById("view-back-button").style.display = "none";
    document.getElementById("view-basic-search").style.display = "block";
}

function hideSearch() {
    document.getElementById("view-error").style.display = "none";
    document.getElementById("view-back-button").style.display = "block";
    document.getElementById("view-basic-search").style.display = "none";
}

function showLoading() {
    console.log("view: showLoading");

    document.getElementById("view-error").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById("overview").style.display = "none";
    document.getElementById("graphic").style.display = "none";
}

function showOverview() {
    viewState = "overview";
    console.log("view: showOverview");
    
    document.getElementById("view-error").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("overview").style.display = "block";
    document.getElementById("graphic").style.display = "none";
    showSearch();
}

function showGraphic() {
    viewState = "graphic";
    console.log("view: showGraphic");

    document.getElementById("view-error").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("overview").style.display = "none";
    document.getElementById("graphic").style.display = "block";
    hideSearch();

    addNavigationHistory();
}
 
function showError(message) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("overview").style.display = "none";
    document.getElementById("graphic").style.display = "none";

    document.getElementById("error-message").innerHTML = message;


    document.getElementById("view-error").style = "block";
    document.getElementById("loading").style.display = "none";
}

function addNavigationHistory() {
    history.pushState({ page: 1 }, "", "");

    window.addEventListener("popstate", function (event) {
        navigateBack();
    });
}