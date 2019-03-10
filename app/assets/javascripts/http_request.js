var requestController = (function() {

    var validResponse = function(response, url, keys) {
        var hash = JSON.parse(response);
        if (keys.every(key=>key in hash || hash[0])) {
            return hash;
        } else {
            throw new Error("Json do not have all required parameters: name, id, barcode. Current route to products list is: " + url);
        }
    }

    return {
        get: function(url, keys, callback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                    var resp = validResponse(httpRequest.responseText, url, keys);
                    callback.apply(resp);
                }
            };
            httpRequest.open('GET', url);
            httpRequest.send();
        }
    }
})();
