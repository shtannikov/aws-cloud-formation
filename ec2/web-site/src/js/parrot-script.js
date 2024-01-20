function goParrot() {
    window.location = "/parrotLibrary.html";
}

window.onload = function () {
        readJsonFile(window.location.origin + "/quotes.json", function (QuoteJson) {
            let QuoteObj = JSON.parse(QuoteJson);
            const quoteList = QuoteObj.quotes.map(quote => "<li>" + quote + "</li>").join("\n");
            document.getElementById("Quote").innerHTML = quoteList;
        });
    }

    function readJsonFile(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
}