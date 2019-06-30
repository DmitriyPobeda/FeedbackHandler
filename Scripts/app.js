var ViewModel = function () {
    var self = this;
    self.feedbacks = ko.observableArray();
    self.error = ko.observable();

    var feedbacksUri = 'api/Feedbacks/';
    function ajaxHelper(uri, method, data) {
        //  По умолчанию значение переменной error будет равно пустой строке
        self.error('');
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    // GET . Получить все строки из БД
    function getFeedbacks() {
        ajaxHelper(feedbacksUri, 'GET').done(function (data) {
            self.feedbacks(data);
        });
    }
    getFeedbacks();


    // GET (id). Получить по id
    self.detail = ko.observable();

    self.getFeedback = function (item) {
        ajaxHelper(feedbacksUri + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }


    // POST . Создать кортеж
    self.objFeedback = {
        Name: ko.observable(),
        Phone: ko.observable(),
        Email: ko.observable(),
        Message: ko.observable()
    }

    self.addFeedback = function (formElement) {
        var feedback = {
            Name: self.objFeedback.Name(),
            Phone: self.objFeedback.Phone(),
            Email: self.objFeedback.Email(),
            Message: self.objFeedback.Message()
        };
        ajaxHelper(feedbacksUri, 'POST', feedback).done(function (item) {
            self.feedbacks.push(item);
        });
    }

    //DELETE id . Удалить один элемент
    self.kill = ko.observable();

    self.removeFeedback = function (item) {
        ajaxHelper(feedbacksUri + item.Id, 'DELETE').done(function (data) {
            self.kill(data.Id);
            getFeedbacks();
        });
    };

    // Очистка значений формы
    self.clearForm = function () {
        $('form input[type="text"], form input[type="number"], form textarea').val('');
    }

}

ko.applyBindings(new ViewModel());