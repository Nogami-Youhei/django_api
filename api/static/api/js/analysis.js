async function Token() {

	const endPoint = '/api/token/';
    const response = await fetch(endPoint, {
        method: 'GET',
    });
	const res = await response.text();
    document.getElementById('token').textContent = res
}


document.addEventListener('DOMContentLoaded', function() {
	const token_btn = document.getElementById('token-btn');
	token_btn.addEventListener('click', Token);
}, false);

window.onpageshow = function(event) {
    if (event.persisted) {
        location.reload()
    }
};        