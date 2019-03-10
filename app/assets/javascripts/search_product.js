var calcController = (function() {
    var itemsList = [];

    var search = function(property, str) {
        var match = [];

        itemsList.forEach(function(item) {
            // jeśli nazwa lub kod kreskowy przedmiotu (property) nie jest pusty i zawiera podany łańcuch znaków
            if (item[property] && item[property].includes(str)) {
                match.push(item);
            }
        });

        // zwróć listę przedmiotów przeznaczonych do dodania do listy wyboru
        return match;
    };

    return {
        // przypisuje listę produktów do zmiennej 'itemsList'
        init: function() {
                itemsList = this;
        },

        findItemsToAdd: function(str) {
            var list = [];

            // jesli nie da się przeparsować na liczbę
            if (isNaN(parseInt(str)) ) {
                // szukaj wg nazwy
                list = search("name", str);
            } else {
                // szukaj wg kodu kreskowego
                list = search("barcode", str);
            }

            // przekaż listę przedmiotów przeznaczonych do dodania do listy wyboru
            return list;
        },

        findItemsToErase: function(oldList, toAddList) {
            var list = [];

            oldList.forEach(function(oldItem) {
                // jeśli przedmiotu ze starej listy nie ma na liście przedmiotów do dodania
                if (!toAddList.includes(oldItem)) {
                    list.push(oldItem);
                }
            });

            // przekaż listę przedmiotów przeznaczonych do usunięcia z listy wyboru
            return list;
        },

        // sprawdza czy wpisana nazwa lub kod kreskowy odpowiadają przedmiotowi
        // z listy proponowanych i zwraca jego id lub false jeśli nie znalazł
        selectedFromList: function(list, input) {
            var res = false;
            list.forEach(function(item) {
                if (item.value === input || item.label === input) {
                    res = item.id;
                }
            });
            return res;
        }
    }
})();


var UIController = (function() {

    var DOMstrings = {
        inputSearch: 'search_item', // szukany po id
        itemsList: 'items' // szukany po id
    };

    var allProposedItems = function() {
        return Array.from(document.getElementById(DOMstrings.itemsList).children);
    };



    return {
        getInput: function() {
            return document.getElementById(DOMstrings.inputSearch).value;
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        getItemsList: allProposedItems,

        addItems: function(list) {
            var template = "<option id='%id%' value='%name%' label='%barcode%'></option>";

            list.forEach(function(item) {
                var html = template.replace('%id%', item.id);
                html = html.replace('%name%', item.name);
                var barcode = item.barcode ? item.barcode : '\u2014'; // jesli barcode jest null to wpisz długi dash
                html = html.replace('%barcode%', barcode);
                document.getElementById(DOMstrings.itemsList).insertAdjacentHTML("beforeend", html);
            });
        },

        removeItems: function(list) {
            list.forEach(function(item) {
                document.getElementById(item.id).remove();
            });
        },

        removeAllProposed: function() {
            var list = allProposedItems();
            Array.from(list).forEach(function(item) {
                item.remove();
            });
        },

        clearInput: function() {
            var input = document.getElementById(DOMstrings.inputSearch);
            input.value = '';
            input.blur();
        },

        showItem: function() {
            console.log("item to append extra", this);
        }
    };
})();

var searchController = (function(UIctrl, calcCtrl, reqCtrl) {

    var setEventListeners = function() {
        var DOM = UIctrl.getDOMstrings();
        document.getElementById(DOM.inputSearch).addEventListener("input", function(e) {
            var list = UIctrl.getItemsList();
            var item_id = calcCtrl.selectedFromList(list, e.target.value);
            if (item_id) {
                UIctrl.removeAllProposed();
                UIctrl.clearInput();
                var keys = ["name", "barcode", "id", "category", "avg_price", "unit"];
                reqCtrl.get(('http://localhost:3000/product/' + item_id), keys, UIctrl.showItem);
            } else {
                searchItem();
            }
        });
    };

    // pobiera listę produktów w formie json i przekazuje do funkcji calcCtrl.init
    // po drodze sprawdza czy odpowiedź z serwera zawiera wszystkie potrzebne klucze
    var getAllItems = function() {
        var keys = ["name", "barcode", "id"];
        reqCtrl.get('http://localhost:3000/?format=json', keys, calcCtrl.init);
    };

    var searchItem = function() {
        var input, addItemsList, removeItemsList, itemsList;
        // 1. pobierz łańcuch znaków
        input = UIctrl.getInput();

        // jeśli wyszukiwana fraza zawiera co najmniej 3 znaki
        if (input.length > 2) {
            // 2a. znajdź przedmioty pasujące z nazwy lub kodu do łańcucha znaków
            addItemsList = calcCtrl.findItemsToAdd(input);

            // 3a. Pobierz aktualną listę proponowanych przedmiotów
            itemsList = UIctrl.getItemsList();

            // 4a. Zidentyfikuj przedmioty, które nleży usunąć z listy
            removeItemsList = calcCtrl.findItemsToErase(itemsList, addItemsList);

            // 5a. dodaj do listy rozwijanej te przedmioty, które pasują do łancucha znaków
            UIctrl.addItems(addItemsList);

            // 6a. usuń te przedmioty z listy rozwijanej, które nie pasują do łancucha znaków
            UIctrl.removeItems(removeItemsList);
        } else {
            // 2b. Usuń wszystkie proponowane produkty z listy proponowanych
            UIctrl.removeAllProposed();
        }
    };

    return {
        init: function(){
            setEventListeners();
            getAllItems();
        }
    }
})(UIController, calcController, requestController);

window.addEventListener('load', function() {
    searchController.init();
}, false);
