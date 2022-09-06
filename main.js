(function () {
    "use strict";

    Array.prototype.shuffle = function () {
        if (this.length <= 1) return this;
        const array = this, length = this.length;
        for (let i = 0; i < length; i++) {
            let temp = array[i];
            let count = Math.floor((i + 1) * Math.random());
            array[i] = array[count];
            array[count] = temp;
        }
        return array;
    }

    var randomizeColor, randomizeBackgroundColor;
    (function () {
        var arr = ["0", "1", "2", "3", "4", "5"].shuffle();
        var ptr = 0;
        function nextItem() {
            var ret = arr[ptr];
            ptr += 1;
            if (ptr == arr.length) {
                ptr = 0;
                arr = arr.shuffle();
            }
            return ret;
        }
        randomizeColor = function (dom) {
            dom.classList.add("colorful-" + nextItem());
        };
        randomizeBackgroundColor = function (dom) {
            dom.classList.add("background-colorful-" + nextItem());
        };
    })();

    function buildIcon(data) {
        var icon;
        if (data.img) {
            icon = document.createElement("img");
            icon.src = "imgs/" + data.img;
            icon.className = "icon";
        } else if (data.font) {
            icon = document.createElement("i");
            icon.className = "fa fa-" + data.font + " icon";
        }
        randomizeColor(icon);
        return icon;
    }

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
                    var json_array = JSON.parse(jsonhttps.responseText);
                    json_array.forEach((json) => {
                        currentID = json.id;
                        var node = document.getElementById(json.id);
                        var data_array = json.data;
                        node.innerHTML = "";
                        data_array.forEach((data) => {
                            var entry = document.createElement("div");
                            entry.className = "entry";
                            var icon = buildIcon(data);
                            entry.appendChild(icon);
                            entry.classList.add('tooltip');

                            var span = document.createElement('span');
                            span.className = "tooltiptext";
                            span.innerText = data.name;
                            randomizeBackgroundColor(span);
                            entry.appendChild(span);

                            var detail = document.createElement('div');
                            detail.className = "details";
                            var detail_item = document.createElement('div');
                            detail_item.className = "details-name";
                            detail_item.innerHTML = data.name;
                            detail.appendChild(detail_item);
                            if (data.detail) {
                                ["subname"].forEach((value) => {
                                    var detail_item = document.createElement('div');
                                    detail_item.className = "details-" + value;
                                    detail_item.innerHTML = data.detail[value];
                                    detail.appendChild(detail_item);
                                });
                            }
                            entry.append(detail);

                            if (data.enabled) {
                                entry.onclick = onEntryClickedBuilder(data);
                            } else entry.classList.add("error");

                            node.appendChild(entry);
                        });
                        onJsonLoaded();
                    });
                }
                catch (err) {
                    onJsonLoadError();
                    console.log(err);
                }
            }
        };
        jsonhttps.open("GET", "urls.json", true);
        jsonhttps.send();
    }

    function onJsonLoaded() {
        var expand_button = document.getElementById("expand-button");
        expand_button.classList.remove("loading");
        expand_button.classList.remove("error");
        expand_button.classList.add("loaded");
        expand_button.onclick = onExpandButtonClicked;

        // var boxes = document.getElementsByClassName("link-box");
        // for (var i = 0; i < boxes.length; ++i) {
        //     var elm = boxes[i];
        //     elm.onclick = onLinkBoxClicked;
        // }
        var fullscreen_button = document.getElementById("fullscreen-button");
        fullscreen_button.onclick = onFullscreenButtonClicked;
    }

    function onJsonLoadError() {
        var button = document.getElementById("expand-button");
        button.classList.remove("loading");
        button.classList.remove("loaded");
        button.classList.add("error");
    }

    function onExpandButtonClicked(e) {
        var container = document.getElementById("container");
        container.classList.toggle("expanded");
        e.stopPropagation();
    }

    function onEntryClickedBuilder(data) {
        function onEntryClicked() {
            var container = document.getElementById("container");
            if (container.classList.contains("fullscreen")) {
                setDetailPanel(data);
            } else {
                window.location.href = data.url;
            }
        };
        return onEntryClicked;
    }

    function onFullscreenButtonClicked(e) {
        var container = document.getElementById("container");
        container.classList.remove("expanded");
        container.classList.toggle("fullscreen");
        container.classList.remove("detail-activated");
        e.stopPropagation();
    }

    function setDetailPanel(data) {
        var container = document.getElementById("container");
        if (document.getElementById("detail-name").innerText == data.name) {
            container.classList.toggle("detail-activated");
            return;
        }
        container.classList.add("detail-activated");
        document.getElementById("detail-name").innerText = data.name;
        document.getElementById("detail-icon").innerHTML = "";
        document.getElementById("detail-icon").appendChild(buildIcon(data));
        document.getElementById("detail-button-go").onclick = () => { window.location.href = data.url; };
        document.getElementById("detail-button-go").className = "";
        randomizeBackgroundColor(document.getElementById("detail-button-go"));
        document.getElementById("detail-button-preview").onclick = null;
        document.getElementById("detail-button-preview").className = "";
        randomizeBackgroundColor(document.getElementById("detail-button-preview"));
    }

    // function onLinkBoxClicked(e) {
    //     var box = e.srcElement;
    //     // I don't know why this function will be invoked by the child nodes of link-box
    //     // Any help is welcomed
    //     while (!box.classList.contains("link-box"))
    //         box = box.parentNode;
    //     var boxes = box.parentNode.children;
    //     box.classList.toggle("focused");
    //     for (var i = 0; i < boxes.length; ++i) {
    //         if (boxes[i] == box) continue;
    //         boxes[i].classList.remove("focused");
    //     }
    //     e.stopPropagation();
    // }

    function makeTheWorldColorful() {
        $(".link-title, #detail-buttons div, #fullscreen-button").each(function () {
            randomizeBackgroundColor(this);
        });
    }

    function onDocumentReady() {
        loadJSON();
        makeTheWorldColorful();
    }

    window.onload = onDocumentReady;
})();
