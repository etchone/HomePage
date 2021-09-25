(function() {
    "use strict";
    function loadJSON() {
        var jsonhttps;
        if (window.XMLHttpRequest) {
            //  for IE7+, Firefox, Chrome, Opera, Safari
            jsonhttps = new XMLHttpRequest();
        }
        else {
            // for IE6, IE5
            jsonhttps = new ActiveXObject("Microsoft.XMLHTTP");
        }
        jsonhttps.onreadystatechange = function () {
            if (jsonhttps.readyState == 4) {
                var currentID;
                try {
                    if (jsonhttps.status != 200) throw Error;
                    var json = JSON.parse(jsonhttps.responseText);
                    for(var c = 0; c < json.length; ++c) {
                        currentID = json[c].id;
                        var node = document.getElementById(json[c].id);
                        var data = json[c].data;
                        node.innerHTML = "";
                        for (var i = 0; i < data.length; ++i) {
                            var a = document.createElement("a");
                            if(data[i].img) {
                                var img = document.createElement("img");
                                img.src = "imgs/" + data[i].img;
                                img.className = "link-entry";
                                a.appendChild(img);
                            } else if (data[i].font) {
                                var DOMi = document.createElement("i");
                                DOMi.className="fa fa-" + data[i].font + " link-entry";
                                a.appendChild(DOMi);
                            }
                            a.classList.add('tooltip');
                            var span = document.createElement('span');
                            span.className = "tooltiptext";
                            span.innerText = data[i].name;
                            a.appendChild(span);
                            if(data[i].enabled) {
                                a.href = data[i].url;
                            } else a.classList.add("error");
                            node.appendChild(a);
                        }
                        onJsonLoaded();
                    }
                }
                catch (err) {
                    onJsonLoadError();
                }
            }
        };
        jsonhttps.open("GET", "urls.json", true);
        jsonhttps.send();
    }

    function onJsonLoaded() {
        var button = document.getElementById("expand-button");
        button.classList.remove("loading");
        button.classList.remove("error");
        button.classList.add("loaded");
        button.onclick = onExpandButtonClicked;

        var titles = document.getElementsByClassName("link-title");
        for (var i=0; i < titles.length; ++i) {
            var elm = titles[i];
            elm.onclick = onTitleClicked;
        }
    }

    function onJsonLoadError() {
        var button = document.getElementById("expand-button");
        button.classList.remove("loading");
        button.classList.remove("loaded");
        button.classList.add("error");
    }

    function onExpandButtonClicked() {
        var container = document.getElementById("container");
        container.classList.toggle("expanded");
    }

    function onTitleClicked(e) {
        e.srcElement.parentNode.classList.toggle("packed");
    }

    function onDocumentReady() {
        loadJSON();
    }

    window.onload = onDocumentReady;
})();