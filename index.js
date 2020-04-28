let file_path_list = []

function submit() {
    let title = $('#title').val();
    //let text = $('.note-editing-area').val();
    let type = $('#type').val();
    let username = $('#username').val();
    let text = $('#summernote').summernote('code');
    
    

    if (title == '') {
        alert('제목을 입력해주세요.')
        $('#title').focus()
        return;
    } else if (text == '') {
        alert('질문을 입력해주세요.')
        $('.summernote').summernote('focus')
        //$('.note-editing-area').focus()
        return;
    } else if (type == '분야를 정하세요') {
        alert('분야를 정하세요.')
        $('#type').focus()
        return;
    } else if (username == '') {
        alert('이름을 입력해주세요.')
        $('#username').focus()
        return;
    }


    let data = { title_give: title, text_give: text, type_give: type, username_give: username,
        file_list_give: JSON.stringify(file_path_list)};
    console.log(data);
    $.ajax({
        type: "POST",
        url: "/posting",
        data: data,
        success: function (response) {
            if (response['result'] == 'success') {
                alert(response['msg']);
                $('#title').val('');
                $('#summernote').summernote('reset');
                //$('.note-editing-area').val('');
                $('#type').val('분야를 정하세요');
                $('#username').val('');

                window.location.reload();
            }
        }
    })


    
}


$(document).ready(function () {
    file_path_list = [] 

    $('#summernote').summernote({
        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 120,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        disableDragAndDrop: true
    });
    $('#posting_box').html('');
    listing();
});


// function listing_a() {
//     $.ajax({
//         type: "GET",
//         url: "/posting",
//         data: {},
//         success: function (response) {
//             if (response['result'] == 'success') {
//                 let posting_a = response['posting'];
//                 for (let i = 0; i < posting_a.length; i++) {
//                     front_card(posting_a[i]['title'], posting_a[i]['text'], posting_a[i]['type'], posting_a[i]['username'],
//                     );
//                 }
//                 console.log(posting_a)
//             } else {
//                 alert('질문을 받아오지 못했습니다');
//             }
//         }
//     });
// }


// function front_card(title, text, type, username) {
    
//     let front_html =
//         '<a href="/question_answer"><div>\
//             <div class="card">\
//             <div class="card-body">\
//                 <h5 class="card-title">'+ title + '</h5>\
//                 <h6 class="card-subtitle mb-2 text-muted">'+ type + ',' + username + '</h6>\
//                 <p class="card-text">'+ text + '</p>\
//                 <a href="#" class="card-link">수정</a>\
//             </div>\
//             </div>\
//          </div></a>\
//          '
//     $('#front_box').append(front_html);
// }

function listing() {
    $.ajax({
        type: "GET",
        url: "/posting",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let posting = response['posting'];
             
                for (let i = 0; i < posting.length; i++) {
                    
                    make_card_a(posting[i]['title'], posting[i]['text'], posting[i]['type'], posting[i]['username']
                    );
                    
                }

                for (let i = 0; i < posting.length; i++) {
                    make_card(posting[i]['title'], posting[i]['text'], posting[i]['type'], posting[i]['username'],
                    posting[i]['file_list']);
                }

            } else {
                alert('질문을 받아오지 못했습니다');
            }
        }
    });
}

/*
var formData = new FormData($("#form")[0]);
var formData = new FormData();
formData.append("title", $("#title").val());
formData.append("content", $("#content").val());
formData.append("file", $("#file")[0].files[0]);
console.log(formData)

$.ajax({
    type: 'POST', url: '/board/save', processData: false,
    contentType: false,
    data: formData, success: function (data) { }
});
*/
function make_card_a(title, text, type, username) {
    let temp_html_a =
        '<a href="/question_answer"><div>\
            <div class="card">\
            <div class="card-body">\
                <h5 class="card-title">'+ title + '</h5>\
                <h6 class="card-subtitle mb-2 text-muted">'+ type + ',' + username + '</h6>\
                <p class="card-text">'+ text + '</p>\
                <a href="#" class="card-link">수정</a>\
            </div>\
            </div>\
         </div></a>\
         '
    $('#front_box').append(temp_html_a);
    console.log(temp_html_a)
}



function make_card(title, text, type, username, file_list) {
    let file = ""
    if (file_list != undefined ){
        file_list = JSON.parse(file_list);
        console.log(file_list)
        file = file_list[0]
    }
    let temp_html =
        '<a href="#"><div>\
            <div class="card">\
            <img src="' + file+ '">\
            <div class="card-body">\
                <h5 class="card-title">'+ title + '</h5>\
                <h6 class="card-subtitle mb-2 text-muted">'+ type + ',' + username + '</h6>\
                <p class="card-text">'+ text + '</p>\
            </div>\
            </div>\
         </div></a>\
         '
    $('#posting_box').append(temp_html);
}




$(function() {

    var dropbox = $('#dropbox'),
        message = $('.message', dropbox);

    dropbox.filedrop({
        paramname: 'file',
        maxfiles: 10,
        maxfilesize: 5,
        url: '/api/upload',
        uploadFinished: function(i, file, response) {
            $.data(file).addClass('done');
            file_path_list.push(response.file_path)
            console.log(file_path_list)

        },

        error: function(err, file) {
            switch (err) {
                case 'BrowserNotSupported':
                    showMessage('Your browser does not support HTML5 file uploads!');
                    break;
                case 'TooManyFiles':
                    alert('Too many files! Please select ' + this.maxfiles + ' at most!');
                    break;
                case 'FileTooLarge':
                    alert(file.name + ' is too large! The size is limited to ' + this.maxfilesize + 'MB.');
                    break;
                default:
                    break;
            }
        },

        beforeEach: function(file) {
            if (!file.type.match(/^image\//)) {
                alert('Only images are allowed!');
                return false;
            }
        },

        uploadStarted: function(i, file, len) {
            createImage(file);
        },

        progressUpdated: function(i, file, progress) {
            $.data(file).find('.progress').width(progress);
        }

    });

    var template = '<div class="preview">' +
        '<span class="imageHolder">' +
        '<img />' +
        '<span class="uploaded"></span>' +
        '</span>' +
        '<div class="progressHolder">' +
        '<div class="progress"></div>' +
        '</div>' +
        '</div>';


    function createImage(file) {

        var preview = $(template),
            image = $('img', preview);

        var reader = new FileReader();

        image.width = 100;
        image.height = 100;

        reader.onload = function(e) {
            image.attr('src', e.target.result);
        };

        reader.readAsDataURL(file);

        message.hide();
        preview.appendTo(dropbox);

        $.data(file, preview);
    }

    function showMessage(msg) {
        message.html(msg);
    }

});

function submit_answer() {

    let username_answer = $('#username').val();
    let text_answer = $('#summernote').summernote('code');

    let data_answer = {text_give: text_answer, username_give: username_answer, file_list_give: JSON.stringify(file_path_list)};
    $.ajax({
        type: "POST",
        url: "/answer",
        data: data_answer,
        success: function (response) {
            if (response['result'] == 'success') {
                alert(response['msg']);
                $('#summernote').summernote('reset');
                $('#username').val('');
            }
        }
    })

}
$(document).ready(function () {
    file_path_list = [] 

    $('#summernote').summernote({
        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 120,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        disableDragAndDrop: true
    });
    $('#answer_box').html('');
    answer_listing();
});

function answer_listing() {
    $.ajax({
        type: "GET",
        url: "/answer",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let answering = response['answering']
                for (let i = 0; i < answering.length; i++) {
                    make_card_answer(answering[i]['answer_text'], answering[i]['answer_username'], answering[i]['answer_file_list']);
                }

            } else {
                alert('답변을 받아오지 못했습니다');
            }
        }
    });
}


function make_card_answer(answer_text, answer_username, answer_file_list) {
    let file = ""
    if (answer_file_list != undefined ){
        answer_file_list = JSON.parse(answer_file_list);
        console.log(answer_file_list)
        file = answer_file_list[0]
    }
    let answer_html =
        '<a href="#"><div>\
            <div class="card">\
            <img src="' + answer_file_list + '">\
            <div class="card-body">\
                <p class="card-text">'+ answer_text + '</p>\
                <h6 class="card-subtitle mb-2 text-muted">' + answer_username + '</h6>\
            </div>\
            </div>\
         </div></a>\
         '
    $('#answer_box').append(answer_html);
    console.log(answer_html)
}
