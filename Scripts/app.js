var ViewModel = function () {
    var self = this;
    self.feedbacks = ko.observableArray();
    self.error = ko.observable();

    var feedbacksUri = 'api/Feedbacks/';
    function ajaxHelper(uri, method, data) {
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

    // GET . Получить все отзывы
    function getFeedbacks() {
        ajaxHelper(feedbacksUri, 'GET').done(function (data) {
            self.feedbacks(data);
        });
    }
    getFeedbacks();


    // GET (id). Получить отзыв
    self.detailFeedback = ko.observable();

    self.getFeedback = function (data) {
        ajaxHelper(feedbacksUri + data.Id, 'GET').done(function (element) {
            self.detailFeedback(element);
        });
    }


    // POST . Создать отзыв
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
        ajaxHelper(feedbacksUri, 'POST', feedback).done(function (element) {
            self.feedbacks.push(element);
        });
    }

    //DELETE id . Удалить определенный отзыв
    self.removeFeedback = function (data) {
        ajaxHelper(feedbacksUri + data.Id, 'DELETE').done(function (element) {
            self.feedbacks.remove(element.Id);
            getFeedbacks();
        });
    };

    // Очистка значений формы
    self.clearForm = function () {
        $('form input[type="text"], form input[type="number"], form textarea').val('');
    }
}

ko.applyBindings(new ViewModel());