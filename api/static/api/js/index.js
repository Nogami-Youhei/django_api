function replaceOrAddChild(parentElement, newChildElement) {
    if (parentElement.firstChild) {
        parentElement.replaceChild(newChildElement, parentElement.firstChild);
    } else {
        parentElement.appendChild(newChildElement);
    }
}

function testCheckbox(del=false) {
    const checkboxes = document.getElementsByClassName('checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    if (del) {
        return checkedCheckboxes
    } else {
        return checkedCheckboxes[0].value
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
        // alert(`${title}を登録完了しました`)
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

async function Search(event, loading, deleteState=false) {
    if (loading === true) {
        replaceOrAddChild(document.getElementById('result'), div1);
    }
	const form = document.getElementById('search');
	let formData = new FormData(form);

    let pageNum = event.target.previousElementSibling.value
    formData.append('p', pageNum);

    if (deleteState) {

        let pageNum2 = document.getElementsByClassName('page')[0].textContent.trim()[0]

        if (document.getElementById('result').querySelectorAll('tr').length === 2) {
            if (pageNum2 - 1) {
                formData.append('p', pageNum2 - 1);
            } else {
                formData.append('p', pageNum2);
            }
        } else {
            formData.append('p', pageNum2);
        }
    }

	const endPoint = form.action;
    const response = await fetch(endPoint, {
        method: 'POST',
        body: formData
    });
	const res = await response.text();
    
    if (res.trim()[0] === '<') {
        document.getElementById('result').classList.add('animation1')
        document.getElementById('result').innerHTML = res;

        // 次へボタンへの設定
        const btn_search = document.getElementsByClassName('search');
        Array.from(btn_search).forEach((v) => v.addEventListener('click', function(event) { Search(event, false) }));

        const checkboxSelector = document.getElementById('checkbox-selector')
        checkboxSelector.addEventListener('click', function checkboxChecker() {
            const checkboxes = document.getElementsByClassName('checkbox');
            console.log('aaa')
            console.log(checkboxSelector)
            if (checkboxSelector.checked) {
                for (let x of Array.from(checkboxes)) {
                    x.checked = true
                }   
            } else {
                for (let x of Array.from(checkboxes)) {
                    x.checked = false
                } 
            }
        });

        function btnControl(e) {
            // checkbox以外の部分をクリックしたときにチェックが入るように設定
            if (e.target.tagName !== 'INPUT') {
                e.target.parentElement.firstElementChild.firstElementChild.checked = !e.target.parentElement.firstElementChild.firstElementChild.checked
            }
            const checkboxes = document.getElementsByClassName('checkbox');
            console.log(checkboxes[0].checked)
            const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
            console.log(checkedCheckboxes);

            if (checkedCheckboxes.length === 1) {
                const boxBtn = document.getElementById('box-btn')
                boxBtn.classList.remove('hover');
                boxBtn.disabled = false;
                const detailBtn = document.getElementById('detail-btn')
                detailBtn.classList.remove('hover');
                detailBtn.disabled = false;
                const updateBtn = document.getElementById('update-btn')
                updateBtn.classList.remove('hover');
                updateBtn.disabled = false;
                const deleteBtn = document.getElementById('delete-btn')
                deleteBtn.classList.remove('hover');
                deleteBtn.disabled = false;
            } else if (checkedCheckboxes.length === 0) {
                const boxBtn = document.getElementById('box-btn')
                boxBtn.classList.add('hover');
                boxBtn.disabled = true;
                const detailBtn = document.getElementById('detail-btn')
                detailBtn.classList.add('hover');
                detailBtn.disabled = true;
                const updateBtn = document.getElementById('update-btn')
                updateBtn.classList.add('hover');
                updateBtn.disabled = true;
                const deleteBtn = document.getElementById('delete-btn')
                deleteBtn.classList.add('hover');
                deleteBtn.disabled = true;
            } else {
                const boxBtn = document.getElementById('box-btn')
                boxBtn.classList.add('hover');
                boxBtn.disabled = true;
                const detailBtn = document.getElementById('detail-btn')
                detailBtn.classList.add('hover');
                detailBtn.disabled = true;
                const updateBtn = document.getElementById('update-btn')
                updateBtn.classList.add('hover');
                updateBtn.disabled = true;
                const deleteBtn = document.getElementById('delete-btn')
                deleteBtn.classList.remove('hover');
                deleteBtn.disabled = false;
            }
        }

        // checkboxがチェックされているかどうか確認
        const checkboxesTr = document.getElementsByClassName('checkbox-tr');
        Array.from(checkboxesTr).forEach((v) => v.addEventListener('click', function(e) { btnControl(e) }));
        checkboxSelector.addEventListener('click', function(e) { btnControl(e) });
        
        
        const detailBtn = document.getElementById('detail-btn');
        detailBtn.addEventListener('click', async function Detail(e) {

            const id = testCheckbox()

            replaceOrAddChild(document.getElementById('detail-result'), div1);

            let target = document.getElementById("popup-window");
            let close = document.getElementById('close');
            target.classList.remove('hidden');

            close.addEventListener('click', function() {
                target.classList.add('hidden')
                document.getElementById('detail-result').innerHTML = '';
            });

            const form = e.target.parentElement;
            const endPoint = form.action;
            let formData = new FormData(form)
            formData.append('detail', id);
            const response = await fetch(endPoint, {
                method: 'POST',
                body: formData
            });
            const res = await response.text();
        
            if (res.trim()[0] === '<') {
                document.getElementById('detail-result').innerHTML = res;
            } else {
                document.getElementById('detail-result').innerHTML = '失敗';
            }
        });

        const deleteBtn = document.getElementById('delete-btn');
        deleteBtn.addEventListener('click', async function Delete(e) {
            const checkedCheckboxes = testCheckbox(del=true)
            const checkedList = checkedCheckboxes.map(x => x.value);
            const form = e.target.parentElement;
            const endPoint = form.action;
            let formData = new FormData(form);
            formData.append('checked_list', checkedList)
            const response = await fetch(endPoint, {
                method: 'POST',
                body: formData
            });
            const res = await response.text();
        
            if (res === 'delete') {
                Search(event, false, deleteState=true)
            } else {
                document.getElementById('status').innerHTML = '失敗';
            }
        });

        const updateBtn = document.getElementById('update-btn');
        updateBtn.addEventListener('click', async function Update() {
            const id = testCheckbox()

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
        });

        const boxBtn = document.getElementById('box-btn');
        boxBtn.addEventListener('click', Box);

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
    const id = testCheckbox()

    const boxForm = e.target.parentElement;
    const endPoint = boxForm.action;
    let formData = new FormData(boxForm);

    formData.append('box', id);
    const response = await fetch(endPoint, {
        method: 'POST',
        body: formData
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
        location.reload()
    }
};