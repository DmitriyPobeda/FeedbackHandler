var ViewModel = function () {
    var self = this;
    self.feedbacks = ko.observableArray();
    self.error = ko.observable();
    self.validateMessage1 = ko.observable(false);
    self.validateMessage2 = ko.observable(false);

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
        /*
        if (feedback.Name == null | feedback.Message == null) {
            console.log("-- --");
            if (feedback.Name != null && feedback.Message == null) {
                console.log("norm null");
                return false;
            }else if (feedback.Name == null && feedback.Message != null) {
                console.log("null norm");
                return false;
            } else if (feedback.Name == null && feedback.Message == null) {
                console.log("null null")
                return false;
            }
        } 
        else if (feedback.Name != "" && feedback.Message != "") {
            console.log(typeof feedback.Name);
            console.log(typeof feedback.Message);
        } 
        */
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