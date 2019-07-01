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
        self.validateMessage1 = ko.observable();
        self.validateMessage2 = ko.observable();
    self.objFeedback = {
        Name: ko.observable(undefined),
        Phone: ko.observable(undefined),
        Email: ko.observable(undefined),
        Message: ko.observable(undefined)
    }
    self.clearVarMemory = function () {
        self.objFeedback.Name(undefined);
        self.objFeedback.Phone(undefined);
        self.objFeedback.Email(undefined);
        self.objFeedback.Message(undefined);
    }
    self.addFeedback = function (formElement) {
        self.validateMessage1(false);
        self.validateMessage2(false);
        var feedback = {
            Name: self.objFeedback.Name(),
            Phone: self.objFeedback.Phone(),
            Email: self.objFeedback.Email(),
            Message: self.objFeedback.Message()
        };

        if (feedback.Name != undefined && feedback.Message != undefined) {
            ajaxHelper(feedbacksUri, 'POST', feedback).done(function (element) {
                self.feedbacks.push(element);
            });
            self.clearVarMemory();
        } else if (feedback.Name == undefined || feedback.Message == undefined) {
            if (feedback.Name != undefined && feedback.Message == undefined) {
                self.validateMessage2(true);
            }
            else if (feedback.Name == undefined && feedback.Message != undefined) {
                self.validateMessage1(true);
            }

            else { self.validateMessage1(true); self.validateMessage2(true);}
            self.clearVarMemory();
            return false;
        } 
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
        self.validateMessage1(false);
        self.validateMessage2(false);
    }
}

ko.applyBindings(new ViewModel());