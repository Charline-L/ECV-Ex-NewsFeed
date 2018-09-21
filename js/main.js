// pour à l'api
var apiKey = "8b62d73e8585488b83be6d325246260b";
var urlSelectors = "https://newsapi.org/v2/sources?&apiKey=" + apiKey;
// éléments du DOM
var $selectorsContainer = document.getElementById("news-selector");
var $main = document.querySelector("main");
// une fois le DOM chargé
var DOMLoaded = function () {
    console.log('>>> IN DOM IS LOADED');
    getSelectors(urlSelectors)
        .then(function (data) { return addSelectors(data); })["catch"](function (error) { return console.error("Error :", error); });
};
// AJOUTER LES SELECTEURS AU DOM
var getSelectors = function (url) {
    return new Promise(function (resolve, reject) {
        console.log('>>> IN PROMISE TO GET SOURCES');
        var resquest = new XMLHttpRequest();
        resquest.open('GET', url);
        resquest.onload = function () {
            if (resquest.status === 200) {
                var response = JSON.parse(resquest.response);
                if (response.status === "ok")
                    resolve(JSON.stringify(response.sources));
                else
                    reject(Error("Erreur de connexion " + resquest.statusText));
            }
            else
                reject(Error("Erreur de connexion " + resquest.statusText));
        };
        resquest.onerror = function () {
            reject(Error("Erreur de connexion"));
        };
        resquest.send();
    });
};
// ajouter les sélecteurs
var addSelectors = function (data) {
    console.log('>>> IN ADD SELECTORS');
    var json = JSON.parse(data);
    // créer une option vide
    var $option = document.createElement("option");
    $option.innerText = "Sélectionnez un média";
    $option.setAttribute("disabled", "true");
    $option.setAttribute("selected", "true");
    $selectorsContainer.appendChild($option);
    // créer les options dynamiques
    for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
        var sources = json_1[_i];
        var $option_1 = document.createElement("option");
        $option_1.setAttribute("value", sources.id);
        $option_1.innerText = sources.name;
        $option_1.addEventListener("click", selectOption);
        $selectorsContainer.appendChild($option_1);
    }
};
// click sur un sélecteur
var selectOption = function (e) {
    console.log('>>> IN CLICK OPTION');
    var id = e.target.getAttribute("value");
    var url = "https://newsapi.org/v2/top-headlines?sources=" + id + "&apiKey=" + apiKey;
    getNews(url)
        .then(function (data) { return addNews(data); })["catch"](function (error) { return console.error("Error :", error); });
};
// récupère les news
var getNews = function (url) {
    return new Promise(function (resolve, reject) {
        console.log('>>> IN PROMISE TO GET NEWS');
        var resquest = new XMLHttpRequest();
        resquest.open('GET', url);
        resquest.onload = function () {
            if (resquest.status === 200) {
                var response = JSON.parse(resquest.response);
                if (response.status === "ok")
                    resolve(JSON.stringify(response.articles));
                else
                    reject(Error("Erreur de connexion " + resquest.statusText));
            }
            else
                reject(Error("Erreur de connexion " + resquest.statusText));
        };
        resquest.onerror = function () {
            reject(Error("Erreur de connexion"));
        };
        resquest.send();
    });
};
var addNews = function (data) {
    console.log('>>> IN ADD NEWS');
    var json = JSON.parse(data);
    // on écrase le DOM actuel
    $main.innerHTML = "";
    // on ajoute les données
    for (var _i = 0, json_2 = json; _i < json_2.length; _i++) {
        var article = json_2[_i];
        var $article = document.createElement("article");
        var $p = document.createElement("p");
        var $figure = document.createElement("figure");
        var $figcaption = document.createElement("figcaption");
        var $img = document.createElement("img");
        var $a = document.createElement("a");
        $p.innerText = article.description;
        $img.setAttribute("src", article.urlToImage);
        $figcaption.innerText = article.title;
        $a.setAttribute("href", article.url);
        $a.setAttribute("target", "_blank");
        $a.classList.add("cta");
        $a.innerText = "En savoir plus";
        $figure.appendChild($figcaption);
        $figure.appendChild($img);
        $article.appendChild($figure);
        $article.appendChild($p);
        $article.appendChild($a);
        $main.appendChild($article);
    }
};
// attendre que le DOM change
window.addEventListener("load", DOMLoaded);
