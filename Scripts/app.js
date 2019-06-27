var ViewModel = function () {
    var self = this;
    self.feedbacks = ko.observableArray();
    self.error = ko.observable();



    var feedbacksUri = 'api/feedbacks/';

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

    // GET . Получить все кортежи из БД
    function getAllFeedbacks() {
        ajaxHelper(feedbacksUri, 'GET').done(function (data) {
            self.feedbacks(data);
        });
    }

    getAllFeedbacks();


    // GET (id). Получить по id
    self.detail = ko.observable();

    self.getFeedbackDetail = function (item) {
        ajaxHelper(feedbacksUri + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }


    // POST . Создать кортеж
    self.newFeedback = {
        Name: ko.observable(),
        Phone: ko.observable(),
        Email: ko.observable(),
        Message: ko.observable()
    }

    self.addFeedback = function (formElement) {
        var feedback = {
            Name: self.newFeedback.Name(),
            Phone: self.newFeedback.Phone(),
            Email: self.newFeedback.Email(),
            Message: self.newFeedback.Message()
        };

        ajaxHelper(feedbacksUri, 'POST', feedback).done(function (item) {
            self.feedbacks.push(item);
        });
    }

    //DELETE id . Удалить один элемент
    self.killer = ko.observable();

    self.deleteFeedback = function (item) {
        ajaxHelper(feedbacksUri + item.Id, 'DELETE').done(function (data) {
            self.killer(data.Id);
        });
    };

    /*Reset fields in form
    self.resetFields = {
        Name = ko.observable(),
        Phone = ko.observable(),
        Email = ko.observable(),
        Message = ko.observable()
    }
    self.reset = function () {
        self.Name = ('');
        self.Phone = ('');
        self.Email = ('');
        self.Message = ('');
    }.bind(self); */
}

ko.applyBindings(new ViewModel());