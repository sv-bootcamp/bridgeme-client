class SurveyUtil {

  HOST = 'http://ec2-52-78-121-221.ap-northeast-2.compute.amazonaws.com:8000/';
  API_GET_SURVEY = 'survey/request/';
  SEND_RESULT = 'survey/answer';
  GET = 'GET';
  POST = 'POST';
  CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded';
  CONTENT_TYPE_JSON = 'application/json';

  constructor(success, error) {
    this.onSuccess = success;
    this.onError = error;
  }

  getQuestionPage(select, jwt = null) {
    let url = this.HOST + this.API_GET_SURVEY + select;
    let reqSet = {
      method: this.GET,
      headers: {
        'Content-Type': this.CONTENT_TYPE_URLENCODED,
      },
    };

    if (jwt)
      reqSet.headers.access_token = jwt;

    fetch(url, reqSet)
    .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(resp.statusText);
        }
    })
    .then((res) => this.onSuccess(res))
    .catch((err) => this.onError(err));
  }

  buildResult(questions) {
    let result = JSON.parse(JSON.stringify(questions));
    let questionSize = result.length;

    for (let i = 0; i < questionSize; i++) {
      delete result[i].allow_multiple_answer;

      let answers = result[i].answers;
      let answerSize = answers.length;
      for (let j = 0; j < answerSize; j++) {
        delete result[i].answers[j].title;

        let options = answers[j].options;
        let optionSize = options.length;
        for (let k = 0; k < optionSize; k++) {
          if (result[i].answers[j].options[k].isChecked) {
            delete result[i].answers[j].options[k].next_question_index;
            delete result[i].answers[j].options[k].isChecked;
            if (result[i].answers[j].options[k].is_free_form) {
              result[i].answers[j].options[k].content =
                result[i].answers[j].options[k].inputValue;
              delete result[i].answers[j].options[k].inputValue;
            }
          } else {
            result[i].answers[j].options.splice(k, 1);
            k--;
            optionSize--;
          }
        }

        if (result[i].answers[j].options.length == 0) {
          result[i].answers.splice(j, 1);
          j--;
          answerSize--;
        }
      }
    }

    return result;
  }

  sendResult(result, jwt = null) {
    let body = {};
    body = result;

    let url = this.HOST + this.SEND_RESULT;
    let reqSet = {
        method: this.POST,
        headers: {
          'Content-Type': this.CONTENT_TYPE_JSON,
        },
      };

    reqSet.body = JSON.stringify(result);

    if (jwt) reqSet.headers.access_token = jwt;

    fetch(url, reqSet)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((result) => {
          this.onSuccess(result);
        }).catch((error) => {
        this.onError(error);
      });
  }
}

module.exports = SurveyUtil;
