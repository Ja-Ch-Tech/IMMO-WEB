$(document).ready(function () {
    initUsers();
})

function initUsers() {
    login();
}

function login() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        var objData = {};

        for (let index = 0; index < e.target.elements.length; index++) {
            objData[e.target.elements[index].name] = e.target.elements[index].value
        }

        //Ajax pour interrogé le côté serveur
        $.ajax({
            type: 'POST',
            url: "/api/login",
            dataType: "json",
            data: objData,
            before: {},
            success: function (data) {
                if (data.getEtat) {
                    window.location.href = "/";
                } else {
                    alert(data.getMessage);
                }
            }
        });
    })
}