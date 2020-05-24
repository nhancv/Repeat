var _internalEditor = null;

function hasSourceCode() {
    return document.getElementById('source-code') != null
}

function registerSourceTextArea() {
    if (!hasSourceCode()) {
        return
    }

    var editor = CodeMirror.fromTextArea(document.getElementById('source-code'), {
      lineNumbers: true,
      mode: "text/html",
      matchBrackets: true,
    });
    _internalEditor = editor;

    var sourceCodeTextArea = $('#source-code');
    getSourceTemplate();

    editor.on("change", function(editor) {
        if (getCurrentSourceCode() == "") {
            getSourceTemplate();
        }
    });
}

function getSourceTemplate(editor) {
    $.get("/internals/get/source-templates", function(data) {
        setCurrentSourceCode(data);
    }).fail(function(response) {
        alert('Error getting source template: ' + response.responseText);
    });
}

function fillSourceForTask(taskId) {
    $.post("/internals/set/selected-task", JSON.stringify({ "task" : taskId }), function(data) {
        var replacePage = ((data.taskType == "source") != hasSourceCode()) || data.taskType == "manually_build";
        if (replacePage) {
            document.getElementById('source-code-container').innerHTML = data.page;
            registerSourceTextArea();
            manuallyBuildTask.registerActions();
        }

        if (data.taskType == "source") {
            setCurrentSourceCode(data.source);
        }
    }).fail(function(response) {
        alert('Error getting source code for task: ' + response.responseText);
    });
}

function getCurrentSourceCode() {
    if (!hasSourceCode()) {
        return "";
    }
    return _internalEditor.getValue();
}

function setCurrentSourceCode(source) {
    if (!hasSourceCode()) {
        return;
    }
    _internalEditor.getDoc().setValue(source);
}
