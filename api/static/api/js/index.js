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
	
	const endPoint = form.action;
    const apiRes = await fetch(endPoint, {
        method: 'POST',
        body: new FormData(form)
    });
	const res = await apiRes.text();
    if (res === 'success') {
        document.getElementById('status').textContent = '登録完了しました';
        Array.from(document.getElementsByClassName('errorlist')).forEach((v) => {
            v.innerHTML = '';
        })
    } else {
        document.body.innerHTML = res;
        const btn_register = document.getElementById('report_btn');
        btn_register.addEventListener('click', Register);
        const btn_search = document.getElementById('search_btn');
        btn_search.addEventListener('click', Search);
    }
}


async function Search() {
    replaceOrAddChild(document.getElementById('result'), div1);
	
	const form = document.getElementById('search');
	
	const endPoint = form.action;
    const apiRes = await fetch(endPoint, {
        method: 'POST',
        body: new FormData(form)
    });
	const res = await apiRes.text();

    if (res.trim()[0] === '<') {
        document.getElementById('result').innerHTML = res;
        const detail_btn = Array.from(document.getElementsByClassName('detail_btn'));
        detail_btn.forEach((v) => v.addEventListener('click', async function Detail() {
            replaceOrAddChild(document.getElementById('detail_result'), div1);
            let box = document.getElementById("box");
            let close = document.getElementById("close");
            
            let boxstyle = box.style;
            boxstyle.display = "block";
            let target = document.getElementById("fadeLayer");
            
            let maxheightA = Math.max(document.body.clientHeight, document.body.scrollHeight)
            let maxheightB = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
            let MaxHeight = Math.max(maxheightA,maxheightB);
            target.style.height = MaxHeight+"px";
            
            let maxwidthA = Math.max(document.body.clientWidth, document.body.scrollWidth)
            let maxwidthB = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth)
            let MaxWidth = Math.max(maxwidthA, maxwidthB);
            target.style.width = MaxWidth + "px";
            target.style.visibility = "visible";

            close.addEventListener('click', function() {
                boxstyle.display = "none";
                let target = document.getElementById("fadeLayer");
                target.style.visibility = "hidden";
                document.getElementById('detail_result').innerHTML = '';
            });

            const form = this.parentElement;
            const endPoint = form.action;
            const apiRes = await fetch(endPoint, {
                method: 'POST',
                body: new FormData(form)
            });
            const res = await apiRes.text();
        
            if (res.trim()[0] === '<') {
                document.getElementById('detail_result').innerHTML = res;
            } else {
                document.getElementById('detail_result').innerHTML = 失敗;
            }
        }));

        const delete_btn = Array.from(document.getElementsByClassName('delete_btn'));
        delete_btn.forEach((v) => v.addEventListener('click', async function Delete() {

            const form = this.parentElement;
            const endPoint = form.action;
            const apiRes = await fetch(endPoint, {
                method: 'POST',
                body: new FormData(form)
            });
            const res = await apiRes.text();
        
            if (res === 'delete') {
                this.parentElement.parentElement.parentElement.innerHTML = '';
            } else {
                document.getElementById('detail_result').innerHTML = 失敗;
            }
        }));
    } else {
        document.getElementById('result').innerHTML = '失敗';
    }
}


document.addEventListener('DOMContentLoaded', function() {
	const btn_register = document.getElementById('report_btn');
	btn_register.addEventListener('click', Register);
    const btn_search = document.getElementById('search_btn');
    btn_search.addEventListener('click', Search);
}, false);
