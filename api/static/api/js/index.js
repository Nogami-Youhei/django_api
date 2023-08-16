function replaceOrAddChild(parentElement, newChildElement) {
    if (parentElement.firstChild) {
        parentElement.replaceChild(newChildElement, parentElement.firstChild);
    } else {
        parentElement.appendChild(newChildElement);
    }
}

let div1 = document.createElement('div')
div1.className = 'div1'
let div2 = document.createElement('div')
div2.className = 'div2'
let div3 = document.createElement('div')

div1.appendChild(div2)
div2.appendChild(div3)
div3.className = 'sk-chase'

for (let i = 0; i < 6; i++) {
    let divChild = document.createElement('div')
    divChild.className = 'sk-chase-dot'
    div3.appendChild(divChild);
}

async function Register() {
    document.getElementById('status').textContent = '登録中...';
	const form = document.getElementById('report');
	const formData = new FormData(form)

	const endPoint = form.action;
    const response = await fetch(endPoint, {
        method: 'POST',
        body: formData
    });
	const res = await response.text();
    if (res === 'success') {
        document.getElementById('status').textContent = '登録完了しました';
        const title = formData.get('title')
        alert(`${title}を登録完了しました`)
        Array.from(document.getElementsByClassName('errorlist')).forEach((v) => {
            v.innerHTML = '';
        })
    } else {
        document.body.innerHTML = res;
        const report_btn = document.getElementById('report-btn');
        report_btn.addEventListener('click', Register);
        const search_btn = document.getElementById('search-btn');
        search_btn.addEventListener('click', function(event) { Search(event, true) });
        const output_btn = document.getElementById('output-btn');
        output_btn.addEventListener('click', Output);
    }
}


async function Search(event, loading) {
    if (loading === true) {
        replaceOrAddChild(document.getElementById('result'), div1);
    }
	const form = document.getElementById('search');
	let formData = new FormData(form);
    formData.append('p', event.target.previousElementSibling.value);
	
	const endPoint = form.action;
    const response = await fetch(endPoint, {
        method: 'POST',
        body: formData
    });
	const res = await response.text();

    if (res.trim()[0] === '<') {
        document.getElementById('result').innerHTML = res;
        const btn_search = document.getElementsByClassName('search');
        Array.from(btn_search).forEach((v) => v.addEventListener('click', function(event) { Search(event, false) }));

        const detail_btn = Array.from(document.getElementsByClassName('detail_btn'));
        detail_btn.forEach((v) => v.addEventListener('click', async function Detail() {
            replaceOrAddChild(document.getElementById('detail-result'), div1);

            let target = document.getElementById("popup-window");
            let close = document.getElementById('close');
            target.classList.remove('hidden');

            close.addEventListener('click', function() {
                target.classList.add('hidden')
                document.getElementById('detail-result').innerHTML = '';
            });
            const form = this.parentElement;
            const endPoint = form.action;
            const response = await fetch(endPoint, {
                method: 'POST',
                body: new FormData(form)
            });
            const res = await response.text();
        
            if (res.trim()[0] === '<') {
                document.getElementById('detail-result').innerHTML = res;
            } else {
                document.getElementById('detail-result').innerHTML = '失敗';
            }
        }));

        const delete_btn = Array.from(document.getElementsByClassName('delete_btn'));
        delete_btn.forEach((v) => v.addEventListener('click', async function Delete() {

            const form = this.parentElement;
            const endPoint = form.action;
            const response = await fetch(endPoint, {
                method: 'POST',
                body: new FormData(form)
            });
            const res = await response.text();
        
            if (res === 'delete') {
                Search(event, false)
            } else {
                document.getElementById('status').innerHTML = '失敗';
            }
        }));

        const update_btn = Array.from(document.getElementsByClassName('update_btn'));
        update_btn.forEach((v) => v.addEventListener('click', async function Update() {

            const id = this.previousElementSibling.value;
            const endPoint = `/api/update/?id=${id}`;
            const response = await fetch(endPoint, {
                method: 'GET',
            });
            const res = await response.text();
        
            if (res.trim()[0] === '<') {

            replaceOrAddChild(document.getElementById('detail-result'), div1);

            let target = document.getElementById("popup-window");
            let close = document.getElementById('close');
            target.classList.remove('hidden');

            close.addEventListener('click', function() {
                target.classList.add('hidden')
                document.getElementById('detail-result').innerHTML = '';
            });
            
            document.getElementById('detail-result').innerHTML = res;

            const update_btn2 = document.getElementById('update_btn2')
            update_btn2.addEventListener('click', async function Update2() {
            document.getElementById('status2').textContent = '更新中...'
            const form = document.getElementById('update2');
            const endPoint = form.action;
            const formData = new FormData(form)
            const title = formData.get('title')

            const response = await fetch(endPoint, {
                method: 'POST',
                body: formData
            });
            const res = await response.text();
        
            if (res === 'success') {
                Search(event, false)
                document.getElementById('status2').textContent = `${title}の更新が完了しました`
            } else {
                document.getElementById('status2').innerHTML = '入力内容を確認してください';
            }
            });

            } else {
                document.getElementById('status').innerHTML = '失敗';
            }
        }));

        const box_btn = Array.from(document.getElementsByClassName('box_btn'));
        box_btn.forEach((v) => v.addEventListener('click', Box));

    } else {
        document.getElementById('result').innerHTML = '失敗';
    }
}


async function Output() {
    const searchForm = document.getElementById('search');
	const outputForm = document.getElementById('output');
	let formData = new FormData(searchForm);
	const endPoint = outputForm.action;
    try {
    const response = await fetch(endPoint, {
        method: 'POST',
        body: formData
    });
        const blobData = await response.blob();
    
        const a = document.createElement('a');
        const url = URL.createObjectURL(blobData);
        a.href = url;
        
        let keyword =  formData.get('keyword')

        if (keyword) {
            a.download = formData.get('keyword') + '.xlsx';
        } else {
            a.download = 'キーワード無し.xlsx';
        }
        
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('ダウンロード失敗', error);
      }
    }

async function Box(e) {
    const boxForm = e.target.parentElement;
	const endPoint = boxForm.action;
    const response = await fetch(endPoint, {
        method: 'POST',
        body: new FormData(boxForm)
    });
        const res = await response.json();

        if (res.status === 'success') {
            window.open(res.url);
        } else {
            console.log('error');
        }
    }

document.addEventListener('DOMContentLoaded', function() {
	const report_btn = document.getElementById('report-btn');
	report_btn.addEventListener('click', Register);
    const search_btn = document.getElementById('search-btn');
    search_btn.addEventListener('click', function(event) { Search(event, true) });
    const output_btn = document.getElementById('output-btn');
    output_btn.addEventListener('click', Output);
}, false);


window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.href = document.referrer;
    }
};