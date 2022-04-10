function login() {
    var userName = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var username_error = document.getElementById('username_error');
    var password_error = document.getElementById('password_error');
    username_error.style.display = "none";
    password_error.style.display = "none";
    if (userName == "") {
        username_error.style.display = "block";
    }
    if (password.length <= 6) {
        password_error.style.display = "block";
    }
    if (password.length <= 6 && userName == "") {
        password_error.style.display = "block";
        username_error.style.display = "block";
    }
    if (userName != "" && password.length > 6) {
        username_error.style.display = "none";
        password_error.style.display = "none";
        confirm("Login successfully");
        window.location.href = "start.htm";
    }
}